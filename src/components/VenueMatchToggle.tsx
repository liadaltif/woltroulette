"use client";

import { VenueMatch } from "@/types";

interface VenueMatchToggleProps {
  value: VenueMatch;
  onChange: (value: VenueMatch) => void;
  disabled: boolean;
}

const OPTIONS: { value: VenueMatch; label: string }[] = [
  { value: "off", label: "Any" },
  { value: "main-side", label: "Main+Side" },
  { value: "all", label: "All Same" },
];

export default function VenueMatchToggle({
  value,
  onChange,
  disabled,
}: VenueMatchToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-white/50 text-xs md:text-sm shrink-0">Same venue:</span>
      <div className="flex rounded-full bg-white/10 border border-white/20 p-0.5">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            disabled={disabled}
            className={`
              px-3 md:px-4 py-1 rounded-full text-xs md:text-sm font-semibold transition-all duration-200
              ${value === opt.value ? "bg-[#009DE0] text-white" : "text-white/60 hover:text-white"}
              disabled:cursor-not-allowed
            `}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
