"use client";

import { useState } from "react";
import { MealCategory, SearchMode, SpinResult, VenueMatch } from "@/types";
import { CITIES } from "@/lib/cities";
import SpinButton from "@/components/SpinButton";
import SlotMachine from "@/components/SlotMachine";
import ModeToggle from "@/components/ModeToggle";
import VenueMatchToggle from "@/components/VenueMatchToggle";
import CityPicker from "@/components/CityPicker";

const CATEGORIES: MealCategory[] = ["main", "side", "dessert"];

export default function Home() {
  const [result, setResult] = useState<SpinResult | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locked, setLocked] = useState<Record<MealCategory, boolean>>({
    main: false,
    side: false,
    dessert: false,
  });
  const [mode, setMode] = useState<SearchMode>("items");
  const [venueMatch, setVenueMatch] = useState<VenueMatch>("off");
  const [city, setCity] = useState("Tel Aviv");

  function toggleLock(category: MealCategory) {
    setLocked((prev) => ({ ...prev, [category]: !prev[category] }));
  }

  function handleModeChange(newMode: SearchMode) {
    if (newMode === mode) return;
    setMode(newMode);
    setResult(null);
    setLocked({ main: false, side: false, dessert: false });
    if (newMode === "venues") setVenueMatch("off");
  }

  function handleCityChange(cityName: string) {
    setCity(cityName);
    setResult(null);
    setLocked({ main: false, side: false, dessert: false });
  }

  async function handleSpin() {
    const unlocked = CATEGORIES.filter((c) => !locked[c]);
    if (unlocked.length === 0) return;

    setIsSpinning(true);
    setError(null);

    const cityData = CITIES.find((c) => c.name === city) ?? CITIES[0];

    try {
      const params = new URLSearchParams();
      params.set("categories", unlocked.join(","));
      params.set("mode", mode);
      params.set("lat", cityData.lat.toString());
      params.set("lon", cityData.lon.toString());
      if (mode === "items" && venueMatch !== "off") {
        params.set("venueMatch", venueMatch);
      }
      const res = await fetch(`/api/spin?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? `API error ${res.status}`);
      if (data?.error) throw new Error(data.error);
      setResult((prev) => (prev ? { ...prev, ...data } : data));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong! Try again.");
    } finally {
      setIsSpinning(false);
    }
  }

  return (
    <main className="flex-1 flex flex-col items-center gap-3 md:gap-5 px-2 md:px-4 py-2 md:py-6 md:justify-center">
      {/* Top bar: title + toggle + spin in one row on mobile */}
      <div className="flex items-center justify-between w-full md:hidden px-2 mb-2">
        <div className="space-y-1">
          <h1 className="text-xl font-bold bg-gradient-to-r from-[#009DE0] via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Wolt Roulette
          </h1>
          <ModeToggle mode={mode} onModeChange={handleModeChange} disabled={isSpinning} />
        </div>
        <SpinButton onClick={handleSpin} isSpinning={isSpinning} />
      </div>

      {/* Controls row — mobile */}
      <div className="flex items-center gap-3 md:hidden flex-wrap justify-center">
        <CityPicker value={city} onChange={handleCityChange} disabled={isSpinning} />
        {mode === "items" && (
          <VenueMatchToggle value={venueMatch} onChange={setVenueMatch} disabled={isSpinning} />
        )}
      </div>

      {/* Desktop layout */}
      <div className="hidden md:block text-center space-y-1">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-[#009DE0] via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Wolt Roulette
        </h1>
        <p className="text-white/50 text-lg">Let fate decide your dinner</p>
      </div>
      <div className="hidden md:flex items-center gap-4">
        <CityPicker value={city} onChange={handleCityChange} disabled={isSpinning} />
        <ModeToggle mode={mode} onModeChange={handleModeChange} disabled={isSpinning} />
        {mode === "items" && (
          <VenueMatchToggle value={venueMatch} onChange={setVenueMatch} disabled={isSpinning} />
        )}
      </div>
      <div className="hidden md:block">
        <SpinButton onClick={handleSpin} isSpinning={isSpinning} />
      </div>

      {/* Error */}
      {error && (
        <p className="text-red-400 text-center bg-red-400/10 px-6 py-3 rounded-xl">
          {error}
        </p>
      )}

      {/* Results */}
      <SlotMachine
        result={result}
        isSpinning={isSpinning}
        locked={locked}
        onToggleLock={toggleLock}
      />
    </main>
  );
}
