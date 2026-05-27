"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { quizUrl } from "@/lib/quiz-url";

const STORAGE_KEY = "mva-exit-modal-dismissed";
const MIN_TIME_MS = 15_000; // 15 seconds on page before showing
const MIN_SCROLL_PX = 200; // must scroll at least 200px

export function ExitIntentModal({ locale }: { locale: Locale }) {
  const [show, setShow] = useState(false);
  const loadedAt = useRef(Date.now());
  const maxScroll = useRef(0);

  const isEn = locale === "en";

  const handleClose = useCallback(() => {
    setShow(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {}
  }, []);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY)) return;
    } catch {}

    // Don't show on quiz/cuestionario pages — they're already in the funnel
    if (
      window.location.pathname.includes("/quiz") ||
      window.location.pathname.includes("/cuestionario")
    ) {
      return;
    }

    const trackScroll = () => {
      maxScroll.current = Math.max(maxScroll.current, window.scrollY);
    };

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger when mouse exits through the top (toward browser chrome)
      if (e.clientY > 0) return;

      // Must have been on page at least 15 seconds
      if (Date.now() - loadedAt.current < MIN_TIME_MS) return;

      // Must have scrolled at least 200px (shows they engaged)
      if (maxScroll.current < MIN_SCROLL_PX) return;

      setShow(true);
    };

    window.addEventListener("scroll", trackScroll, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      window.removeEventListener("scroll", trackScroll);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl leading-none"
          aria-label="Close"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold text-gray-900 text-center">
          {isEn
            ? "Before you go —"
            : "Antes de que te vayas —"}
        </h2>
        <p className="mt-3 text-gray-600 text-center text-sm">
          {isEn
            ? "People with a lawyer get 3.5x more money after an accident. Our evaluation is free and takes 2 minutes."
            : "Las personas con abogado reciben 3.5 veces más dinero después de un accidente. La evaluación es gratis y toma 2 minutos."}
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <Link
            href={quizUrl(locale)}
            onClick={handleClose}
            className="block text-center bg-navy-900 text-white font-semibold px-6 py-3 rounded-md hover:bg-navy-700 transition-colors"
          >
            {isEn ? "See What I'm Owed" : "Ver Cuánto Me Deben"}
          </Link>
          <button
            onClick={handleClose}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            {isEn ? "No thanks" : "No, gracias"}
          </button>
        </div>
      </div>
    </div>
  );
}
