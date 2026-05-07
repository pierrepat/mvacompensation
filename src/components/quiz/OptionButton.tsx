"use client";

import { cn } from "@/lib/cn";

interface OptionButtonProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export function OptionButton({ label, selected, onClick }: OptionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full text-left px-4 py-3.5 rounded-lg border text-base font-medium transition-all",
        "min-h-[48px] active:scale-[0.98]",
        selected
          ? "border-navy-900 bg-navy-50 text-navy-900"
          : "border-gray-200 bg-white text-gray-700 hover:border-navy-200"
      )}
    >
      {label}
    </button>
  );
}
