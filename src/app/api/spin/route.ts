import { NextResponse } from "next/server";
import {
  searchWoltItems,
  getRandomSearchTerm,
  pickRandomItem,
  SEARCH_TERMS,
} from "@/lib/wolt";
import { MealCategory, SpinResult, WoltMenuItem } from "@/types";

const CATEGORIES: MealCategory[] = ["main", "side", "dessert"];

async function getItemForCategory(
  category: MealCategory
): Promise<WoltMenuItem> {
  const term = getRandomSearchTerm(category);
  const items = await searchWoltItems(term);

  if (items.length > 0) {
    return pickRandomItem(items);
  }

  // Retry with a different term
  const fallbackTerm = getRandomSearchTerm(category);
  const fallbackItems = await searchWoltItems(fallbackTerm);

  if (fallbackItems.length > 0) {
    return pickRandomItem(fallbackItems);
  }

  throw new Error(`No items found for category: ${category}`);
}

export async function GET() {
  try {
    const [main, side, dessert] = await Promise.all(
      CATEGORIES.map((cat) => getItemForCategory(cat))
    );

    const result: SpinResult = { main, side, dessert };
    return NextResponse.json(result);
  } catch (error) {
    console.error("Spin error:", error);
    return NextResponse.json(
      { error: "Failed to fetch meals. Please try again!" },
      { status: 500 }
    );
  }
}
