"use client";

import { SearchMode } from "@/types";

interface ModeToggleProps {
  mode: SearchMode;
  onModeChange: (mode: SearchMode) => void;
  disabled: boolean;
}

export default function ModeToggle({
  mode,
  onModeChange,
  disabled,
}: ModeToggleProps) {
  return (
    <div className="flex rounded-full bg-white/10 border border-white/20 p-1">
      <button
        onClick={() => onModeChange("items")}
        disabled={disabled}
        className={`
          px-5 py-1.5 rounded-full text-sm font-semibold transition-all duration-200
          ${mode === "items" ? "bg-[#009DE0] text-white" : "text-white/60 hover:text-white"}
          disabled:cursor-not-allowed
        `}
      >
        Items
      </button>
      <button
        onClick={() => onModeChange("venues")}
        disabled={disabled}
        className={`
          px-5 py-1.5 rounded-full text-sm font-semibold transition-all duration-200
          ${mode === "venues" ? "bg-[#009DE0] text-white" : "text-white/60 hover:text-white"}
          disabled:cursor-not-allowed
        `}
      >
        Restaurants
      </button>
    </div>
  );
}
