export interface City {
  name: string;
  lat: number;
  lon: number;
}

export const CITIES: City[] = [
  { name: "Tel Aviv", lat: 32.0853, lon: 34.7818 },
  { name: "Jerusalem", lat: 31.7683, lon: 35.2137 },
  { name: "Haifa", lat: 32.7940, lon: 34.9896 },
  { name: "Beer Sheva", lat: 31.2530, lon: 34.7915 },
  { name: "Rishon LeZion", lat: 31.9500, lon: 34.8000 },
  { name: "Petah Tikva", lat: 32.0841, lon: 34.8878 },
  { name: "Netanya", lat: 32.3215, lon: 34.8532 },
  { name: "Ashdod", lat: 31.8014, lon: 34.6435 },
  { name: "Herzliya", lat: 32.1629, lon: 34.8447 },
  { name: "Ra'anana", lat: 32.1836, lon: 34.8714 },
  { name: "Rehovot", lat: 31.8928, lon: 34.8113 },
  { name: "Kfar Saba", lat: 32.1780, lon: 34.9065 },
  { name: "Ramat Gan", lat: 32.0700, lon: 34.8236 },
  { name: "Givatayim", lat: 32.0717, lon: 34.8100 },
  { name: "Bat Yam", lat: 32.0167, lon: 34.7500 },
  { name: "Holon", lat: 32.0114, lon: 34.7748 },
  { name: "Modiin", lat: 31.8969, lon: 35.0104 },
  { name: "Nahariya", lat: 33.0050, lon: 35.0920 },
];
