"use client";

import { CITIES } from "@/lib/cities";

interface CityPickerProps {
  value: string;
  onChange: (cityName: string) => void;
  disabled: boolean;
}

export default function CityPicker({ value, onChange, disabled }: CityPickerProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-white/50 text-xs md:text-sm shrink-0">📍</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="
          bg-white/10 border border-white/20 text-white text-xs md:text-sm
          rounded-full px-3 py-1 md:py-1.5
          focus:outline-none focus:ring-1 focus:ring-[#009DE0]
          disabled:cursor-not-allowed disabled:opacity-60
          appearance-none cursor-pointer
        "
        style={{ backgroundImage: "none" }}
      >
        {CITIES.map((city) => (
          <option key={city.name} value={city.name} className="bg-[#1a0a3e] text-white">
            {city.name}
          </option>
        ))}
      </select>
    </div>
  );
}
