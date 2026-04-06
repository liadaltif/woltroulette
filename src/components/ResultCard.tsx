"use client";

import { SpinResultItem } from "@/types";

interface ResultCardProps {
  item: SpinResultItem;
  category: string;
  emoji: string;
  loading?: boolean;
  isLocked: boolean;
  onToggleLock: () => void;
}

export default function ResultCard({
  item,
  category,
  emoji,
  loading,
  isLocked,
  onToggleLock,
}: ResultCardProps) {
  const isVenue = item.type === "venue";
  const woltLink = isVenue
    ? `https://wolt.com/en/isr/tel-aviv/restaurant/${item.slug}`
    : `https://wolt.com/en/isr/tel-aviv/restaurant/${item.venue_slug}`;

  return (
    <div
      className={`
        bg-white/10 backdrop-blur-md overflow-hidden
        border shadow-xl
        transition-opacity duration-300
        rounded-xl md:rounded-2xl
        flex flex-row md:flex-col
        ${loading ? "opacity-50" : "opacity-100"}
        ${isLocked ? "border-[#009DE0] ring-1 ring-[#009DE0]/50" : "border-white/20"}
        md:max-w-xs md:w-full
      `}
    >
      {/* Image */}
      <div className="w-40 h-40 md:w-full md:h-44 relative bg-white/5 shrink-0">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl md:text-5xl">
            {isVenue ? "🏪" : "🍽️"}
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0 p-3 md:p-4 flex flex-col justify-between">
        {/* Category + lock */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs md:text-sm font-semibold text-white/70 truncate">
            {emoji} {category}
          </span>
          <button
            onClick={onToggleLock}
            className="text-sm md:text-lg hover:scale-110 transition-transform shrink-0 ml-1"
            title={isLocked ? "Unlock" : "Lock"}
          >
            {isLocked ? "🔒" : "🔓"}
          </button>
        </div>

        <h3 className="text-white font-bold text-base md:text-base leading-tight line-clamp-1 md:line-clamp-2">
          {item.name}
        </h3>

        {isVenue ? (
          <div className="flex items-center gap-2 text-xs md:text-sm mt-0.5">
            {item.rating != null && (
              <span className="text-yellow-400 font-semibold">
                ⭐ {item.rating.toFixed(1)}
              </span>
            )}
            {item.estimate_range && (
              <span className="text-white/60">{item.estimate_range} min</span>
            )}
          </div>
        ) : (
          <>
            <p className="text-white/60 text-xs line-clamp-1">{item.venue_name}</p>
            <p className="text-green-400 font-semibold text-xs md:text-base">
              ₪{(item.price / 100).toFixed(2)}
            </p>
          </>
        )}

        {/* Desktop-only extras */}
        {isVenue && item.short_description && (
          <p className="text-white/60 text-sm line-clamp-1 hidden md:block">{item.short_description}</p>
        )}
        {isVenue && item.tags.length > 0 && (
          <div className="flex-wrap gap-1 hidden md:flex">
            {item.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-xs bg-white/10 text-white/70 px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}

        <a
          href={woltLink}
          target="_blank"
          rel="noopener noreferrer"
          className="
            inline-block w-full text-center mt-1 md:mt-3 px-2 md:px-4 py-1 md:py-2
            rounded-lg md:rounded-xl
            bg-[#009DE0] hover:bg-[#0086c0] text-white font-semibold
            transition-colors duration-200 text-xs md:text-sm
          "
        >
          <span className="hidden md:inline">View on Wolt →</span>
          <span className="md:hidden">Wolt →</span>
        </a>
      </div>
    </div>
  );
}
