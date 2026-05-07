"use client";

import { ArrowLeft } from "lucide-react";
import { ProgressBar } from "./ProgressBar";

interface QuizShellProps {
  title: string;
  progress: number;
  total: number;
  onBack?: () => void;
  children: React.ReactNode;
}

export function QuizShell({ title, progress, total, onBack, children }: QuizShellProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-1 text-gray-500 hover:text-navy-900 transition-colors"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="flex-1">
            <p className="text-sm font-semibold text-navy-900">{title}</p>
            <div className="mt-1">
              <ProgressBar current={progress} total={total} />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-start justify-center px-4 py-8">
        <div className="w-full max-w-lg">{children}</div>
      </div>
    </div>
  );
}
