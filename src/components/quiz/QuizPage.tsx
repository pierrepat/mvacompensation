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
      {/* TrustedForm script */}
      <Script
        src="https://api.trustedform.com/trustedform.js?field=xxTrustedFormCertUrl&ping_field=xxTrustedFormPingUrl&l=https://api.trustedform.com/trustedform.js"
        strategy="afterInteractive"
      />

      {/* Hidden Netlify form for bot detection */}
      <form name="lead-submissions" data-netlify="true" hidden>
        <input type="hidden" name="form-name" value="lead-submissions" />
        <input name="locale" />
        <input name="state" />
        <input name="when" />
        <input name="injured" />
        <input name="has_lawyer" />
        <input name="first_name" />
        <input name="last_name" />
        <input name="phone" />
        <input name="phone_e164" />
        <input name="email" />
        <input name="otp_verified" />
        <input name="ip_address" />
        <input name="consent_timestamp" />
        <input name="source" />
        <input name="source_state" />
        <input name="trusted_form_cert_url" />
        <input name="tag" />
        <input name="submitted_at" />
        <input name="utm_source" />
        <input name="utm_medium" />
        <input name="utm_campaign" />
        <input name="utm_content" />
        <input name="utm_term" />
        <input name="fbclid" />
        <input name="gclid" />
        <input name="landing_url" />
        <input name="referrer" />
      </form>

      {/* Hidden TrustedForm fields */}
      <input type="hidden" id="xxTrustedFormCertUrl" name="xxTrustedFormCertUrl" />
      <input type="hidden" id="xxTrustedFormPingUrl" name="xxTrustedFormPingUrl" />

      <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
        <Funnel locale={locale} dict={quizDict} />
      </Suspense>
    </>
  );
}
