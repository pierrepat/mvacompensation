"use client";

import { useReducer, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Check, Phone, Shield, ArrowRight, Loader2 } from "lucide-react";
import { funnelReducer, initialContext } from "@/lib/quiz/reducer";
import { STEP_PROGRESS } from "@/lib/quiz/types";
import type { FunnelStep } from "@/lib/quiz/types";
import { US_STATES, STATE_CODE_TO_NAME } from "@/lib/quiz/states";
import {
  validateName,
  validatePhone,
  validateEmail,
  validateOtp,
  normalizePhone,
  formatPhone,
} from "@/lib/quiz/validation";
import { QuizShell } from "./QuizShell";
import { OptionButton } from "./OptionButton";
import { cn } from "@/lib/cn";

interface FunnelProps {
  locale: "en" | "es";
  dict: Record<string, string>;
}

export function Funnel({ locale, dict }: FunnelProps) {
  const searchParams = useSearchParams();
  const [ctx, dispatch] = useReducer(funnelReducer, initialContext);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [otpResent, setOtpResent] = useState(false);

  // Pre-fill from URL params on mount
  useEffect(() => {
    const stateCode = searchParams.get("state");
    if (stateCode && STATE_CODE_TO_NAME[stateCode.toUpperCase()]) {
      dispatch({ type: "UPDATE", field: "state", value: STATE_CODE_TO_NAME[stateCode.toUpperCase()] });
    }
    const source = searchParams.get("source") || "";
    if (source) dispatch({ type: "UPDATE", field: "source", value: source });
    const sourceState = searchParams.get("state") || "";
    if (sourceState) dispatch({ type: "UPDATE", field: "source_state", value: sourceState });
    dispatch({ type: "UPDATE", field: "locale", value: locale });
  }, [searchParams, locale]);

  // Load TrustedForm cert URL
  useEffect(() => {
    const interval = setInterval(() => {
      const el = document.getElementById("xxTrustedFormCertUrl") as HTMLInputElement | null;
      if (el?.value) {
        dispatch({ type: "UPDATE", field: "trusted_form_cert_url", value: el.value });
        clearInterval(interval);
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const t = (key: string, replacements?: Record<string, string>) => {
    let val = dict[key] || key;
    if (replacements) {
      Object.entries(replacements).forEach(([k, v]) => {
        val = val.replace(`{${k}}`, v);
      });
    }
    return val;
  };

  const goTo = (step: FunnelStep) => {
    dispatch({ type: "SET_STEP", step });
    setFieldErrors({});
    window.scrollTo(0, 0);
  };

  // -- OTP helpers --
  const sendOtp = useCallback(async () => {
    const digits = normalizePhone(ctx.data.phone);
    try {
      const res = await fetch("/.netlify/functions/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: digits }),
      });
      if (!res.ok) {
        const text = await res.text();
        console.error("send-otp response:", res.status, text);
        return false;
      }
      const json = await res.json();
      if (json.ipAddress) {
        dispatch({ type: "UPDATE", field: "ip_address", value: json.ipAddress });
      }
      return true;
    } catch (err) {
      console.error("send-otp fetch error:", err);
      return false;
    }
  }, [ctx.data.phone]);

  const verifyOtp = useCallback(async () => {
    const digits = normalizePhone(ctx.data.phone);
    const code = ctx.data.otp.trim();
    console.log("verify-otp request:", { phone: digits, code, codeLength: code.length });
    try {
      const res = await fetch("/.netlify/functions/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: digits, code }),
      });
      const json = await res.json();
      console.log("verify-otp response:", json);
      return json.approved === true;
    } catch (err) {
      console.error("verify-otp fetch error:", err);
      return false;
    }
  }, [ctx.data.phone, ctx.data.otp]);

  // -- Submit lead to GHL webhook --
  const GHL_WEBHOOK = "https://services.leadconnectorhq.com/hooks/ownD7SHV7OSI7i5Ab74t/webhook-trigger/yHjhOVGqJRlxiG9ZCqLT";

  const submitLead = useCallback(async () => {
    const d = ctx.data;
    const phone10 = normalizePhone(d.phone);

    // Collect UTMs
    let utms: Record<string, string> = {};
    try {
      utms = JSON.parse(sessionStorage.getItem("mva_utms") || "{}");
    } catch {}

    const payload = {
      // Identity
      first_name: d.first_name.trim(),
      last_name: d.last_name.trim(),
      phone: formatPhone(d.phone),
      phone_e164: `+1${phone10}`,
      phone_ten_digits: phone10,
      email: d.email.trim(),

      // Case details
      state: d.state,
      when: d.when,
      injured: d.injured,
      has_lawyer: d.has_lawyer,

      // Compliance
      otp_verified: String(d.otp_verified),
      ip_address: d.ip_address,
      consent_timestamp: d.consent_timestamp,
      consent_text: "By submitting, you agree to our Privacy Policy and consent to receive calls, texts, and emails from MVA Compensation and its legal partners about your case.",
      trusted_form_cert_url: d.trusted_form_cert_url,
      user_agent: navigator.userAgent,

      // Attribution
      source: d.source || "direct",
      source_state: d.source_state,
      locale: d.locale,
      tag: d.locale === "es" ? "es_lead_pending_review" : "en_lead_pending_review",
      submitted_at: new Date().toISOString(),
      landing_url: utms.landing_url || "",
      referrer: utms.referrer || "",
      utm_source: utms.utm_source || "",
      utm_medium: utms.utm_medium || "",
      utm_campaign: utms.utm_campaign || "",
      utm_content: utms.utm_content || "",
      utm_term: utms.utm_term || "",
      fbclid: utms.fbclid || "",
      gclid: utms.gclid || "",
    };

    console.log("Submitting lead to GHL:", payload);

    const res = await fetch(GHL_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error("GHL submission failed:", res.status, await res.text());
    }

    return res.ok;
  }, [ctx.data]);

  // -- Screen handlers --
  const handleAccidentNext = () => {
    if (!ctx.data.state) {
      setFieldErrors({ state: t("error_required") });
      return;
    }
    goTo("details");
  };

  const handleDetailsNext = () => {
    const errs: Record<string, string> = {};
    if (!ctx.data.when) errs.when = t("error_required");
    if (!ctx.data.injured) errs.injured = t("error_required");
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }
    goTo("lawyer");
  };

  const handleLawyerSelect = (val: "yes" | "no") => {
    dispatch({ type: "UPDATE", field: "has_lawyer", value: val });
    setTimeout(() => goTo("contact"), 150);
  };

  const handleContactSubmit = async () => {
    const errs: Record<string, string> = {};
    const fnErr = validateName(ctx.data.first_name);
    const lnErr = validateName(ctx.data.last_name);
    const phErr = validatePhone(ctx.data.phone);
    const emErr = validateEmail(ctx.data.email);
    if (fnErr) errs.first_name = t(fnErr === "too_short" ? "error_name_short" : "error_invalid_name");
    if (lnErr) errs.last_name = t(lnErr === "too_short" ? "error_name_short" : "error_invalid_name");
    if (phErr) errs.phone = t("error_invalid_phone");
    if (emErr) errs.email = t(emErr === "required" ? "error_required" : "error_invalid_email");
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }

    dispatch({ type: "UPDATE", field: "consent_timestamp", value: new Date().toISOString() });
    dispatch({ type: "UPDATE", field: "phone_e164", value: `+1${normalizePhone(ctx.data.phone)}` });
    dispatch({ type: "SET_SUBMITTING", value: true });

    try {
      const sent = await sendOtp();
      if (!sent) {
        dispatch({ type: "SET_ERROR", error: t("error_submit_failed") });
        return;
      }
      dispatch({ type: "SET_SUBMITTING", value: false });
      goTo("otp");
    } catch (err) {
      console.error("OTP send failed:", err);
      dispatch({ type: "SET_ERROR", error: t("error_submit_failed") });
    }
  };

  const handleOtpSubmit = async () => {
    const otpErr = validateOtp(ctx.data.otp);
    if (otpErr) { setFieldErrors({ otp: t("error_invalid_otp") }); return; }

    dispatch({ type: "SET_SUBMITTING", value: true });
    try {
      const approved = await verifyOtp();
      if (!approved) {
        dispatch({ type: "SET_ERROR", error: t("error_otp_wrong") });
        return;
      }
      dispatch({ type: "UPDATE", field: "otp_verified", value: true });
      const submitted = await submitLead();
      if (!submitted) {
        dispatch({ type: "SET_ERROR", error: t("error_submit_failed") });
        return;
      }
      dispatch({ type: "SET_SUBMITTING", value: false });
      goTo("thanks");
    } catch {
      dispatch({ type: "SET_ERROR", error: t("error_submit_failed") });
    }
  };

  const handleResendOtp = async () => {
    setOtpResent(false);
    await sendOtp();
    setOtpResent(true);
    setTimeout(() => setOtpResent(false), 3000);
  };

  // Capture UTMs on mount
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "gclid"];
      const utms: Record<string, string> = {};
      keys.forEach((k) => { const v = params.get(k); if (v) utms[k] = v; });
      utms.landing_url = window.location.href;
      utms.referrer = document.referrer;
      sessionStorage.setItem("mva_utms", JSON.stringify(utms));
    } catch {}
  }, []);

  // ─── SCREENS ───
  if (ctx.step === "accident") {
    return (
      <QuizShell title={t("title")} progress={STEP_PROGRESS.accident} total={5}>
        <h1 className="text-2xl font-bold text-navy-900 mb-6">{t("step1_heading")}</h1>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("step1_state_label")}
        </label>
        <select
          value={ctx.data.state}
          onChange={(e) => dispatch({ type: "UPDATE", field: "state", value: e.target.value })}
          className={cn(
            "w-full border rounded-lg px-4 py-3.5 text-base bg-white appearance-none",
            fieldErrors.state ? "border-red-400" : "border-gray-200 focus:border-navy-900"
          )}
        >
          <option value="">{t("step1_state_placeholder")}</option>
          {US_STATES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        {fieldErrors.state && <p className="text-red-500 text-sm mt-1">{fieldErrors.state}</p>}
        <button
          onClick={handleAccidentNext}
          className="mt-6 w-full bg-navy-900 text-white font-semibold py-3.5 rounded-lg hover:bg-navy-700 transition-colors text-base flex items-center justify-center gap-2"
        >
          {t("next")} <ArrowRight className="w-4 h-4" />
        </button>
      </QuizShell>
    );
  }

  if (ctx.step === "details") {
    return (
      <QuizShell title={t("title")} progress={STEP_PROGRESS.details} total={5} onBack={() => goTo("accident")}>
        <h1 className="text-2xl font-bold text-navy-900 mb-6">{t("step2_heading")}</h1>

        <p className="text-sm font-medium text-gray-700 mb-2">{t("step2_when")}</p>
        <div className="space-y-2 mb-6">
          {(["less_1mo", "1_6mo", "6_12mo", "over_1yr"] as const).map((val) => (
            <OptionButton
              key={val}
              label={t(`when_${val}`)}
              selected={ctx.data.when === val}
              onClick={() => dispatch({ type: "UPDATE", field: "when", value: val })}
            />
          ))}
        </div>
        {fieldErrors.when && <p className="text-red-500 text-sm -mt-4 mb-4">{fieldErrors.when}</p>}

        <p className="text-sm font-medium text-gray-700 mb-2">{t("step2_injured")}</p>
        <div className="flex gap-3">
          {(["yes", "no"] as const).map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => dispatch({ type: "UPDATE", field: "injured", value: val })}
              className={cn(
                "flex-1 py-3.5 rounded-lg border text-base font-medium transition-all min-h-[48px]",
                ctx.data.injured === val
                  ? "border-navy-900 bg-navy-50 text-navy-900"
                  : "border-gray-200 bg-white text-gray-700 hover:border-navy-200"
              )}
            >
              {t(`injured_${val}`)}
            </button>
          ))}
        </div>
        {fieldErrors.injured && <p className="text-red-500 text-sm mt-1">{fieldErrors.injured}</p>}

        <button
          onClick={handleDetailsNext}
          className="mt-6 w-full bg-navy-900 text-white font-semibold py-3.5 rounded-lg hover:bg-navy-700 transition-colors text-base flex items-center justify-center gap-2"
        >
          {t("next")} <ArrowRight className="w-4 h-4" />
        </button>
      </QuizShell>
    );
  }

  if (ctx.step === "lawyer") {
    return (
      <QuizShell title={t("title")} progress={STEP_PROGRESS.lawyer} total={5} onBack={() => goTo("details")}>
        <h1 className="text-2xl font-bold text-navy-900 mb-6">{t("step3_heading")}</h1>
        <div className="space-y-3">
          <OptionButton label={t("step3_no")} selected={ctx.data.has_lawyer === "no"} onClick={() => handleLawyerSelect("no")} />
          <OptionButton label={t("step3_yes")} selected={ctx.data.has_lawyer === "yes"} onClick={() => handleLawyerSelect("yes")} />
        </div>
      </QuizShell>
    );
  }

  if (ctx.step === "contact") {
    return (
      <QuizShell title={t("title")} progress={STEP_PROGRESS.contact} total={5} onBack={() => goTo("lawyer")}>
        <h1 className="text-2xl font-bold text-navy-900 mb-2">{t("step4_heading")}</h1>
        <p className="text-sm text-gray-600 mb-4">{t("step4_subtitle")}</p>
        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 mb-6 text-sm text-green-800 font-medium">
          {t("step4_noCost")}
        </div>

        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("first_name")}</label>
              <input
                type="text"
                autoComplete="given-name"
                value={ctx.data.first_name}
                onChange={(e) => dispatch({ type: "UPDATE", field: "first_name", value: e.target.value })}
                className={cn("w-full border rounded-lg px-4 py-3 text-base", fieldErrors.first_name ? "border-red-400" : "border-gray-200 focus:border-navy-900")}
              />
              {fieldErrors.first_name && <p className="text-red-500 text-xs mt-1">{fieldErrors.first_name}</p>}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("last_name")}</label>
              <input
                type="text"
                autoComplete="family-name"
                value={ctx.data.last_name}
                onChange={(e) => dispatch({ type: "UPDATE", field: "last_name", value: e.target.value })}
                className={cn("w-full border rounded-lg px-4 py-3 text-base", fieldErrors.last_name ? "border-red-400" : "border-gray-200 focus:border-navy-900")}
              />
              {fieldErrors.last_name && <p className="text-red-500 text-xs mt-1">{fieldErrors.last_name}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("phone")}</label>
            <input
              type="tel"
              autoComplete="tel"
              inputMode="numeric"
              value={formatPhone(ctx.data.phone)}
              onChange={(e) => {
                const raw = e.target.value.replace(/\D/g, "").slice(0, 10);
                dispatch({ type: "UPDATE", field: "phone", value: raw });
              }}
              placeholder="(555) 123-4567"
              className={cn("w-full border rounded-lg px-4 py-3 text-base", fieldErrors.phone ? "border-red-400" : "border-gray-200 focus:border-navy-900")}
            />
            {fieldErrors.phone && <p className="text-red-500 text-xs mt-1">{fieldErrors.phone}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("email")}</label>
            <input
              type="email"
              autoComplete="email"
              value={ctx.data.email}
              onChange={(e) => dispatch({ type: "UPDATE", field: "email", value: e.target.value })}
              className={cn("w-full border rounded-lg px-4 py-3 text-base", fieldErrors.email ? "border-red-400" : "border-gray-200 focus:border-navy-900")}
            />
            {fieldErrors.email && <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>}
          </div>
        </div>

        {/* TCPA consent */}
        <p className="text-xs text-gray-500 mt-4 leading-relaxed">{t("step4_consent")}</p>
        <p className="text-xs text-gray-400 mt-2">{t("step4_not_law_firm")}</p>

        {ctx.error && <p className="text-red-500 text-sm mt-3 text-center">{ctx.error}</p>}

        <button
          onClick={handleContactSubmit}
          disabled={ctx.submitting}
          className="mt-6 w-full bg-navy-900 text-white font-semibold py-3.5 rounded-lg hover:bg-navy-700 transition-colors text-base disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {ctx.submitting ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> {t("processing")}</>
          ) : (
            t("step4_submit")
          )}
        </button>
      </QuizShell>
    );
  }

  if (ctx.step === "otp") {
    return (
      <QuizShell title={t("title")} progress={STEP_PROGRESS.otp} total={5} onBack={() => goTo("contact")}>
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-navy-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Phone className="w-7 h-7 text-navy-900" />
          </div>
          <h1 className="text-2xl font-bold text-navy-900">{t("step5_heading")}</h1>
          <p className="text-sm text-gray-600 mt-2">
            {t("step5_subtitle", { phone: formatPhone(ctx.data.phone) })}
          </p>
        </div>

        <label className="block text-sm font-medium text-gray-700 mb-1">{t("step5_code_label")}</label>
        <input
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          value={ctx.data.otp}
          onChange={(e) => dispatch({ type: "UPDATE", field: "otp", value: e.target.value.replace(/\D/g, "").slice(0, 6) })}
          className={cn(
            "w-full border rounded-lg px-4 py-3.5 text-center text-2xl font-mono tracking-[0.3em]",
            fieldErrors.otp || ctx.error ? "border-red-400" : "border-gray-200 focus:border-navy-900"
          )}
          placeholder="000000"
        />
        {fieldErrors.otp && <p className="text-red-500 text-sm mt-1 text-center">{fieldErrors.otp}</p>}
        {ctx.error && <p className="text-red-500 text-sm mt-1 text-center">{ctx.error}</p>}

        <button
          onClick={handleOtpSubmit}
          disabled={ctx.submitting}
          className="mt-6 w-full bg-navy-900 text-white font-semibold py-3.5 rounded-lg hover:bg-navy-700 transition-colors text-base disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {ctx.submitting ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> {t("processing")}</>
          ) : (
            t("step5_verify")
          )}
        </button>

        <button
          onClick={handleResendOtp}
          className="mt-3 w-full text-sm text-gray-500 hover:text-navy-900 transition-colors py-2"
        >
          {otpResent ? t("step5_resent") : t("step5_resend")}
        </button>
      </QuizShell>
    );
  }

  // Thanks screen
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-navy-900">
          {t("thanks_heading", { name: ctx.data.first_name })}
        </h1>
        <p className="text-gray-600 mt-3">
          {t("thanks_message", { phone: formatPhone(ctx.data.phone) })}
        </p>

        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6 text-left">
          <h2 className="text-sm font-semibold text-navy-900 mb-4">{t("thanks_what_next")}</h2>
          <div className="space-y-3">
            {["thanks_step1", "thanks_step2", "thanks_step3"].map((key, i) => (
              <div key={key} className="flex gap-3 items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-navy-50 text-navy-900 rounded-full text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <p className="text-sm text-gray-600">{t(key)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
          <Shield className="w-4 h-4" />
          <span>{locale === "es" ? "Tu información está segura" : "Your information is secure"}</span>
        </div>
      </div>
    </div>
  );
}
