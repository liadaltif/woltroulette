export interface WoltMenuItem {
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  venue_name: string;
  venue_slug: string;
}

export interface SpinResult {
  main: WoltMenuItem;
  side: WoltMenuItem;
  dessert: WoltMenuItem;
}

export type MealCategory = "main" | "side" | "dessert";
