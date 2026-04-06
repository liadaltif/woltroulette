export interface WoltMenuItem {
  type: "item";
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  venue_name: string;
  venue_slug: string;
}

export interface WoltVenue {
  type: "venue";
  name: string;
  short_description: string;
  image_url: string | null;
  slug: string;
  rating: number | null;
  estimate_range: string | null;
  tags: string[];
}

export type SpinResultItem = WoltMenuItem | WoltVenue;

export interface SpinResult {
  main: SpinResultItem;
  side: SpinResultItem;
  dessert: SpinResultItem;
}

export type MealCategory = "main" | "side" | "dessert";
export type SearchMode = "items" | "venues";
export type VenueMatch = "off" | "main-side" | "all";
