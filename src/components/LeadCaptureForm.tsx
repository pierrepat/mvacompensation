"use client";

import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { quizUrl } from "@/lib/quiz-url";

interface LeadCaptureFormProps {
  locale: Locale;
  variant?: "inline" | "banner";
  source?: string;
  stateCode?: string;
}

export function LeadCaptureForm({
  locale,
  variant = "inline",
  source,
  stateCode,
}: LeadCaptureFormProps) {
  const isEn = locale === "en";
  const href = quizUrl(locale, { source, state: stateCode });

  if (variant === "banner") {
    return (
      <div className="bg-navy-50 border border-navy-200 rounded-lg p-6 my-8">
        <h3 className="text-lg font-semibold text-navy-900">
          {isEn
            ? "Were you injured in an accident?"
            : "¿Te lastimaste en un accidente?"}
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          {isEn
            ? "Get a free evaluation in under 2 minutes. No obligation."
            : "Evaluación gratis en menos de 2 minutos. Sin compromiso."}
        </p>
        <Link
          href={href}
          className="mt-4 inline-block bg-navy-900 text-white font-semibold px-6 py-2.5 rounded-md hover:bg-navy-700 transition-colors text-sm"
        >
          {isEn ? "Start Free Evaluation" : "Quiero Mi Evaluación Gratis"}
        </Link>
      </div>
    );
  }

  return (
    <div className="not-prose bg-gray-50 border border-gray-200 rounded-lg p-5 my-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className="flex-1">
        <p className="font-semibold text-gray-900 text-sm">
          {isEn ? "Think you have a case?" : "¿Crees que tienes un caso?"}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {isEn
            ? "Free evaluation — no obligation, takes 2 minutes."
            : "Evaluación gratis — sin compromiso, toma 2 minutos."}
        </p>
      </div>
      <Link
        href={href}
        className="shrink-0 bg-navy-900 text-white font-semibold px-5 py-2 rounded-md hover:bg-navy-700 transition-colors text-sm"
      >
        {isEn ? "Get Started" : "Comenzar"}
      </Link>
    </div>
  );
}
