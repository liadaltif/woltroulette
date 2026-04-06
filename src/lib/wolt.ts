import { WoltMenuItem } from "@/types";

const LAT = 32.0853;
const LON = 34.7818;
const WOLT_SEARCH_URL =
  "https://restaurant-api.wolt.com/v1/pages/search";

export const SEARCH_TERMS = {
  main: [
    "pizza",
    "hamburger",
    "shawarma",
    "schnitzel",
    "sushi",
    "pasta",
    "falafel",
    "steak",
    "chicken wings",
    "burrito",
  ],
  side: [
    "fries",
    "onion rings",
    "hummus",
    "salad",
    "garlic bread",
    "spring rolls",
    "mozzarella sticks",
  ],
  dessert: [
    "chocolate cake",
    "ice cream",
    "cheesecake",
    "cookie",
    "brownie",
    "tiramisu",
    "donut",
    "waffle",
  ],
} as const;

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export async function searchWoltItems(
  query: string
): Promise<WoltMenuItem[]> {
  const res = await fetch(WOLT_SEARCH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      q: query,
      target: "items",
      lat: LAT,
      lon: LON,
    }),
  });

  if (!res.ok) {
    throw new Error(`Wolt search failed: ${res.status}`);
  }

  const data = await res.json();

  const sections = data?.sections ?? [];
  if (sections.length === 0) return [];

  const items: WoltMenuItem[] = [];

  for (const section of sections) {
    for (const item of section.items ?? []) {
      const details = item?.link?.menu_item_details;
      if (!details) continue;

      items.push({
        name: details.name ?? "Unknown item",
        description: details.description ?? "",
        price: details.price ?? 0,
        image_url: details.image?.url ?? null,
        venue_name: details.venue_name ?? "Unknown restaurant",
        venue_slug: details.venue_slug ?? "",
      });
    }
  }

  return items;
}

export function getRandomSearchTerm(
  category: keyof typeof SEARCH_TERMS
): string {
  return pickRandom([...SEARCH_TERMS[category]]);
}

export function pickRandomItem(items: WoltMenuItem[]): WoltMenuItem {
  const withImages = items.filter((i) => i.image_url);
  const pool = withImages.length > 0 ? withImages : items;
  return pickRandom(pool);
}
