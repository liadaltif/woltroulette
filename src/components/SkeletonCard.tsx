"use client";

interface SkeletonCardProps {
  category: string;
  emoji: string;
}

export default function SkeletonCard({ category, emoji }: SkeletonCardProps) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl overflow-hidden border border-white/20 shadow-xl flex flex-row md:flex-col md:max-w-xs md:w-full">
      {/* Image placeholder */}
      <div className="w-40 h-40 md:w-full md:h-44 bg-white/5 shrink-0" />

      {/* Text placeholders */}
      <div className="flex-1 min-w-0 p-3 md:p-4 flex flex-col justify-between">
        {/* Category + lock row */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs md:text-sm font-semibold text-white/70">
            {emoji} {category}
          </span>
          <span className="text-sm md:text-lg opacity-30">🔓</span>
        </div>
        {/* Title */}
        <div className="h-4 md:h-5 bg-white/10 rounded w-3/4" />
        {/* Venue name */}
        <div className="h-3 bg-white/10 rounded w-1/2 mt-1" />
        {/* Price */}
        <div className="h-3 md:h-4 bg-white/10 rounded w-1/4 mt-1" />
        {/* Button */}
        <div className="h-7 md:h-9 bg-white/10 rounded-lg md:rounded-xl w-full mt-1 md:mt-3" />
      </div>
    </div>
  );
}
