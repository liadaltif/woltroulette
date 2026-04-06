"use client";

import { useState } from "react";
import { SpinResult } from "@/types";
import SpinButton from "@/components/SpinButton";
import SlotMachine from "@/components/SlotMachine";

export default function Home() {
  const [result, setResult] = useState<SpinResult | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSpin() {
    setIsSpinning(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/spin");
      if (!res.ok) throw new Error("Failed to fetch");
      const data: SpinResult = await res.json();
      setResult(data);
    } catch {
      setError("Something went wrong! Try again.");
    } finally {
      setIsSpinning(false);
    }
  }

  return (
    <main className="flex-1 flex flex-col items-center justify-center gap-10 px-4 py-10">
      {/* Title */}
      <div className="text-center space-y-2">
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#009DE0] via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Wolt Roulette
        </h1>
        <p className="text-white/50 text-lg">Let fate decide your dinner</p>
      </div>

      {/* Spin button */}
      <SpinButton onClick={handleSpin} isSpinning={isSpinning} />

      {/* Error */}
      {error && (
        <p className="text-red-400 text-center bg-red-400/10 px-6 py-3 rounded-xl">
          {error}
        </p>
      )}

      {/* Results */}
      <SlotMachine result={result} isSpinning={isSpinning} />
    </main>
  );
}
