import { NextRequest, NextResponse } from "next/server";
import {
  searchWoltItems,
  searchWoltVenues,
  getRandomSearchTerm,
  pickRandomItem,
  pickRandomVenue,
  SEARCH_TERMS,
} from "@/lib/wolt";
import { MealCategory, SearchMode, SpinResultItem, VenueMatch, WoltMenuItem } from "@/types";

const ALL_CATEGORIES: MealCategory[] = ["main", "side", "dessert"];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function getResultForCategory(
  category: MealCategory,
  mode: SearchMode,
  lat: number,
  lon: number
): Promise<SpinResultItem> {
  const term = getRandomSearchTerm(category);

  if (mode === "venues") {
    const venues = await searchWoltVenues(term, lat, lon);
    if (venues.length > 0) return pickRandomVenue(venues);

    const fallback = await searchWoltVenues(getRandomSearchTerm(category), lat, lon);
    if (fallback.length > 0) return pickRandomVenue(fallback);

    throw new Error(`No venues found for category: ${category}`);
  }

  const items = await searchWoltItems(term, lat, lon);
  if (items.length > 0) return pickRandomItem(items);

  const fallback = await searchWoltItems(getRandomSearchTerm(category), lat, lon);
  if (fallback.length > 0) return pickRandomItem(fallback);

  throw new Error(`No items found for category: ${category}`);
}

// Safe fetch that returns empty array on error instead of throwing
async function safeSearchItems(term: string, lat: number, lon: number): Promise<WoltMenuItem[]> {
  try {
    return await searchWoltItems(term, lat, lon);
  } catch {
    return [];
  }
}

async function getSameVenueResults(
  matchCategories: MealCategory[],
  freeCategories: MealCategory[],
  lat: number,
  lon: number
): Promise<Partial<Record<MealCategory, SpinResultItem>>> {
  const venueItems: Record<string, Record<MealCategory, WoltMenuItem[]>> = {};

  function addItems(category: MealCategory, items: WoltMenuItem[]) {
    for (const item of items) {
      if (!item.venue_slug) continue;
      if (!venueItems[item.venue_slug]) {
        venueItems[item.venue_slug] = { main: [], side: [], dessert: [] };
      }
      const existing = venueItems[item.venue_slug][category];
      if (!existing.some((e) => e.name === item.name)) {
        existing.push(item);
      }
    }
  }

  function findValidVenues(): string[] {
    return Object.keys(venueItems).filter((slug) =>
      matchCategories.every((cat) => venueItems[slug][cat].length > 0)
    );
  }

  // Round 1: search 2 terms per category, sequentially per category to avoid rate limits
  for (const cat of matchCategories) {
    const terms = shuffle([...SEARCH_TERMS[cat]]).slice(0, 2);
    // Run the 2 terms for this category in parallel (only 2 concurrent requests)
    const results = await Promise.all(terms.map((t) => safeSearchItems(t, lat, lon)));
    for (const items of results) {
      addItems(cat, items);
    }
  }

  let validSlugs = findValidVenues();

  // Round 2: if no match, try 2 more terms per category
  if (validSlugs.length === 0) {
    for (const cat of matchCategories) {
      const terms = shuffle([...SEARCH_TERMS[cat]]).slice(0, 2);
      const results = await Promise.all(terms.map((t) => safeSearchItems(t, lat, lon)));
      for (const items of results) {
        addItems(cat, items);
      }
    }
    validSlugs = findValidVenues();
  }

  const result: Partial<Record<MealCategory, SpinResultItem>> = {};

  if (validSlugs.length > 0) {
    const chosenSlug = pickRandom(validSlugs);
    for (const cat of matchCategories) {
      result[cat] = pickRandomItem(venueItems[chosenSlug][cat]);
    }
  } else {
    // Fallback: pick venue with most category coverage, fill gaps independently
    let bestSlug = "";
    let bestCount = 0;
    for (const slug of Object.keys(venueItems)) {
      const count = matchCategories.filter((cat) => venueItems[slug][cat].length > 0).length;
      if (count > bestCount) {
        bestCount = count;
        bestSlug = slug;
      }
    }

    for (const cat of matchCategories) {
      if (bestSlug && venueItems[bestSlug][cat].length > 0) {
        result[cat] = pickRandomItem(venueItems[bestSlug][cat]);
      } else {
        result[cat] = await getResultForCategory(cat, "items", lat, lon);
      }
    }
  }

  // Fetch free categories independently
  if (freeCategories.length > 0) {
    const freeResults = await Promise.all(
      freeCategories.map(async (cat) =>
        [cat, await getResultForCategory(cat, "items", lat, lon)] as const
      )
    );
    for (const [cat, item] of freeResults) {
      result[cat] = item;
    }
  }

  return result;
}

export async function GET(request: NextRequest) {
  try {
    const categoriesParam = request.nextUrl.searchParams.get("categories");
    const mode = (request.nextUrl.searchParams.get("mode") ?? "items") as SearchMode;
    const venueMatch = (request.nextUrl.searchParams.get("venueMatch") ?? "off") as VenueMatch;
    const lat = parseFloat(request.nextUrl.searchParams.get("lat") ?? "32.0853");
    const lon = parseFloat(request.nextUrl.searchParams.get("lon") ?? "34.7818");

    const categories: MealCategory[] = categoriesParam
      ? (categoriesParam.split(",").filter((c) =>
          ALL_CATEGORIES.includes(c as MealCategory)
        ) as MealCategory[])
      : ALL_CATEGORIES;

    if (mode === "items" && venueMatch !== "off") {
      const matchCats: MealCategory[] =
        venueMatch === "all"
          ? categories
          : categories.filter((c) => c === "main" || c === "side");

      if (matchCats.length >= 2) {
        const freeCats = categories.filter((c) => !matchCats.includes(c));
        const result = await getSameVenueResults(matchCats, freeCats, lat, lon);
        return NextResponse.json(result);
      }
    }

    const results = await Promise.all(
      categories.map(async (cat) => [cat, await getResultForCategory(cat, mode, lat, lon)] as const)
    );

    const result: Partial<Record<MealCategory, SpinResultItem>> = {};
    for (const [cat, item] of results) {
      result[cat] = item;
    }

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Spin error:", message);
    return NextResponse.json(
      { error: `Wolt API: ${message}` },
      { status: 500 }
    );
  }
}
