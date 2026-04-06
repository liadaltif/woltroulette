"use client";

import { useEffect, useState } from "react";
import { SpinResult } from "@/types";
import ResultCard from "./ResultCard";

interface SlotMachineProps {
  result: SpinResult | null;
  isSpinning: boolean;
}

const CATEGORIES = [
  { key: "main" as const, label: "Main Dish", emoji: "🍕" },
  { key: "side" as const, label: "Side", emoji: "🍟" },
  { key: "dessert" as const, label: "Dessert", emoji: "🍰" },
];

export default function SlotMachine({ result, isSpinning }: SlotMachineProps) {
  const [revealed, setRevealed] = useState([false, false, false]);

  useEffect(() => {
    if (result) {
      // Staggered reveal
      setRevealed([false, false, false]);
      const timers = CATEGORIES.map((_, i) =>
        setTimeout(() => {
          setRevealed((prev) => {
            const next = [...prev];
            next[i] = true;
            return next;
          });
        }, i * 300)
      );
      return () => timers.forEach(clearTimeout);
    } else {
      setRevealed([false, false, false]);
    }
  }, [result]);

  if (isSpinning) {
    return (
      <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
        {CATEGORIES.map((cat) => (
          <div
            key={cat.key}
            className="w-full max-w-xs h-80 rounded-2xl bg-white/5 border border-white/10 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
      {CATEGORIES.map((cat, i) => (
        <ResultCard
          key={cat.key}
          item={result[cat.key]}
          category={cat.label}
          emoji={cat.emoji}
          revealed={revealed[i]}
        />
      ))}
    </div>
  );
}
