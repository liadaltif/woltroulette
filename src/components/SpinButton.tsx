"use client";

interface SpinButtonProps {
  onClick: () => void;
  isSpinning: boolean;
}

export default function SpinButton({ onClick, isSpinning }: SpinButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={isSpinning}
      className={`
        relative w-16 h-16 md:w-32 md:h-32 rounded-full text-white font-bold text-sm md:text-xl
        bg-gradient-to-br from-[#009DE0] via-purple-500 to-pink-500
        shadow-lg shadow-purple-500/30
        transition-all duration-200
        hover:scale-105 hover:shadow-xl hover:shadow-purple-500/40
        active:scale-95
        disabled:cursor-not-allowed disabled:opacity-80
        ${isSpinning ? "animate-spin-slow" : ""}
      `}
    >
      <span className={`${isSpinning ? "animate-pulse" : ""}`}>
        {isSpinning ? "🎰" : "SPIN!"}
      </span>
    </button>
  );
}
