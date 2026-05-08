"use client";

import { Suspense } from "react";
import Script from "next/script";
import { Funnel } from "./Funnel";

interface QuizPageProps {
  locale: "en" | "es";
  quizDict: Record<string, string>;
}

export function QuizPage({ locale, quizDict }: QuizPageProps) {
  return (
    <>
      {/* TrustedForm script — load early */}
      <Script
        src="https://api.trustedform.com/trustedform.js?field=xxTrustedFormCertUrl&ping_field=xxTrustedFormPingUrl"
        strategy="afterInteractive"
      />

      {/* TrustedForm needs hidden fields inside a form */}
      <form id="trustedform-wrapper" style={{ display: "none" }}>
        <input type="hidden" id="xxTrustedFormCertUrl" name="xxTrustedFormCertUrl" />
        <input type="hidden" id="xxTrustedFormPingUrl" name="xxTrustedFormPingUrl" />
      </form>

      <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
        <Funnel locale={locale} dict={quizDict} />
      </Suspense>
    </>
  );
}
