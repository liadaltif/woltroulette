"use client";

import { WoltMenuItem } from "@/types";

interface ResultCardProps {
  item: WoltMenuItem;
  category: string;
  emoji: string;
  revealed: boolean;
}

export default function ResultCard({
  item,
  category,
  emoji,
  revealed,
}: ResultCardProps) {
  const woltLink = `https://wolt.com/en/isr/tel-aviv/restaurant/${item.venue_slug}`;
  const priceILS = (item.price / 100).toFixed(2);

  return (
    <div
      className={`
        bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden
        border border-white/20 shadow-xl
        transition-all duration-500 w-full max-w-xs
        ${revealed ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-75 translate-y-8"}
      `}
    >
      {/* Category header */}
      <div className="bg-white/10 px-4 py-2 text-center">
        <span className="text-lg font-semibold text-white">
          {emoji} {category}
        </span>
      </div>

      {/* Item image */}
      <div className="aspect-square relative bg-white/5">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            🍽️
          </div>
        )}
      </div>

      {/* Item details */}
      <div className="p-4 space-y-2">
        <h3 className="text-white font-bold text-lg leading-tight">
          {item.name}
        </h3>
        <p className="text-white/60 text-sm">{item.venue_name}</p>
        <p className="text-green-400 font-semibold">₪{priceILS}</p>
        <a
          href={woltLink}
          target="_blank"
          rel="noopener noreferrer"
          className="
            inline-block w-full text-center mt-2 px-4 py-2 rounded-xl
            bg-[#009DE0] hover:bg-[#0086c0] text-white font-semibold
            transition-colors duration-200
          "
        >
          View on Wolt →
        </a>
      </div>
    </div>
  );
}
