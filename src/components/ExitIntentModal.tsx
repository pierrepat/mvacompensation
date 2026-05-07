"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { quizUrl } from "@/lib/quiz-url";

const STORAGE_KEY = "mva-exit-modal-dismissed";

export function ExitIntentModal({ locale }: { locale: Locale }) {
  const [show, setShow] = useState(false);

  const isEn = locale === "en";

  const handleClose = useCallback(() => {
    setShow(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {}
  }, []);

  useEffect(() => {
    // Don't show if already dismissed this session
    try {
      if (sessionStorage.getItem(STORAGE_KEY)) return;
    } catch {}

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setShow(true);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
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
          {isEn ? "Wait — Don't Leave Yet" : "Espere — No se vaya aún"}
        </h2>
        <p className="mt-3 text-gray-600 text-center text-sm">
          {isEn
            ? "Find out if you're entitled to compensation. Our free case evaluation takes less than 2 minutes."
            : "Descubra si tiene derecho a compensación. Nuestra evaluación gratuita de caso toma menos de 2 minutos."}
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <Link
            href={quizUrl(locale)}
            onClick={handleClose}
            className="block text-center bg-navy-900 text-white font-semibold px-6 py-3 rounded-md hover:bg-navy-700 transition-colors"
          >
            {isEn ? "Free Case Evaluation" : "Evaluación Gratuita"}
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
