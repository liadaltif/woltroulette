"use client";

import { MealCategory, SpinResult } from "@/types";
import ResultCard from "./ResultCard";
import SkeletonCard from "./SkeletonCard";

interface SlotMachineProps {
  result: SpinResult | null;
  isSpinning: boolean;
  locked: Record<MealCategory, boolean>;
  onToggleLock: (category: MealCategory) => void;
}

const CATEGORIES = [
  { key: "main" as const, label: "Main Dish", emoji: "🍕" },
  { key: "side" as const, label: "Side", emoji: "🍟" },
  { key: "dessert" as const, label: "Dessert", emoji: "🍰" },
];

export default function SlotMachine({
  result,
  isSpinning,
  locked,
  onToggleLock,
}: SlotMachineProps) {
  if (!result && !isSpinning) return null;

  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-4 justify-center items-stretch w-full px-2 md:px-0">
      {CATEGORIES.map((cat) =>
        result ? (
          <ResultCard
            key={cat.key}
            item={result[cat.key]}
            category={cat.label}
            emoji={cat.emoji}
            loading={isSpinning && !locked[cat.key]}
            isLocked={locked[cat.key]}
            onToggleLock={() => onToggleLock(cat.key)}
          />
        ) : (
          <SkeletonCard key={cat.key} category={cat.label} emoji={cat.emoji} />
        )
      )}
    </div>
  );
}
