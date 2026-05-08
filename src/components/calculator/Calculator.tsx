"use client";

import { useState } from "react";
import { ArrowRight, Calculator as CalcIcon, AlertTriangle, DollarSign, Info } from "lucide-react";
import Link from "next/link";
import { quizUrl } from "@/lib/quiz-url";
import { cn } from "@/lib/cn";

interface CalculatorProps {
  locale: "en" | "es";
  dict: Record<string, string>;
}

type InjuryLevel = "" | "minor" | "moderate" | "serious" | "catastrophic";
type FaultLevel = "" | "none" | "partial" | "majority";

interface Estimate {
  low: number;
  high: number;
  factors: string[];
  warning?: string;
}

function calculateEstimate(
  injury: InjuryLevel,
  medicalBills: number,
  lostWages: number,
  fault: FaultLevel,
  hasLawyer: boolean,
  locale: "en" | "es"
): Estimate | null {
  if (!injury) return null;

  // Base multipliers by injury severity (applied to economic damages)
  const multipliers: Record<string, { low: number; high: number }> = {
    minor: { low: 1.5, high: 3 },
    moderate: { low: 3, high: 5 },
    serious: { low: 5, high: 8 },
    catastrophic: { low: 8, high: 15 },
  };

  const mult = multipliers[injury];
  const economic = medicalBills + lostWages;

  // Minimum floor based on injury type
  const floors: Record<string, number> = {
    minor: 5000,
    moderate: 25000,
    serious: 100000,
    catastrophic: 300000,
  };

  let low = Math.max(economic * mult.low, floors[injury]);
  let high = Math.max(economic * mult.high, floors[injury] * 2);

  // If they have significant economic damages, use those
  if (economic > 0) {
    low = Math.max(economic * mult.low, low);
    high = Math.max(economic * mult.high, high);
  }

  const factors: string[] = [];
  let warning: string | undefined;
  const isEs = locale === "es";

  // Fault adjustment
  if (fault === "partial") {
    low = Math.round(low * 0.6);
    high = Math.round(high * 0.7);
    factors.push(isEs ? "Culpa parcial reduce tu compensación" : "Partial fault reduces your compensation");
  } else if (fault === "majority") {
    low = 0;
    high = 0;
    warning = isEs
      ? "En la mayoría de los estados, si tuviste más de la mitad de la culpa, podrías no recibir nada. Pero cada caso es diferente — un abogado puede evaluar tu situación."
      : "In most states, if you were more than 50% at fault, you may not recover anything. But every case is different — a lawyer can evaluate your situation.";
  }

  // Lawyer multiplier
  if (hasLawyer && fault !== "majority") {
    factors.push(isEs
      ? "Con abogado, la compensación promedio es 3.5x mayor (Insurance Research Council)"
      : "With a lawyer, average compensation is 3.5x higher (Insurance Research Council)");
  }

  // Medical bills factor
  if (medicalBills > 50000) {
    factors.push(isEs ? "Gastos médicos altos fortalecen tu caso" : "High medical bills strengthen your case");
  }

  // Lost wages factor
  if (lostWages > 10000) {
    factors.push(isEs ? "Salarios perdidos documentados aumentan el valor" : "Documented lost wages increase case value");
  }

  // Round to nice numbers
  low = Math.round(low / 1000) * 1000;
  high = Math.round(high / 1000) * 1000;

  return { low, high, factors, warning };
}

function formatMoney(n: number): string {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n}`;
}

export function Calculator({ locale, dict }: CalculatorProps) {
  const [injury, setInjury] = useState<InjuryLevel>("");
  const [medicalBills, setMedicalBills] = useState("");
  const [lostWages, setLostWages] = useState("");
  const [fault, setFault] = useState<FaultLevel>("");
  const [hasLawyer] = useState(true);
  const [showResult, setShowResult] = useState(false);

  const t = (key: string) => dict[key] || key;

  const estimate = calculateEstimate(
    injury,
    parseInt(medicalBills.replace(/\D/g, "")) || 0,
    parseInt(lostWages.replace(/\D/g, "")) || 0,
    fault,
    hasLawyer,
    locale
  );

  const handleCalculate = () => {
    if (!injury) return;
    setShowResult(true);
    setTimeout(() => {
      document.getElementById("calc-result")?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const formatInput = (val: string) => {
    const num = val.replace(/\D/g, "");
    if (!num) return "";
    return "$" + parseInt(num).toLocaleString();
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Injury severity */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-navy-900 mb-3">{t("calc_injury_label")}</label>
        <div className="grid grid-cols-2 gap-3">
          {(["minor", "moderate", "serious", "catastrophic"] as const).map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => { setInjury(level); setShowResult(false); }}
              className={cn(
                "text-left p-3 rounded-lg border text-sm transition-all min-h-[64px]",
                injury === level
                  ? "border-navy-900 bg-navy-50 text-navy-900"
                  : "border-gray-200 text-gray-700 hover:border-navy-200"
              )}
            >
              <span className="font-medium block">{t(`calc_injury_${level}`)}</span>
              <span className="text-xs text-gray-500 mt-0.5 block">{t(`calc_injury_${level}_desc`)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Medical bills */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-navy-900 mb-1">{t("calc_medical_label")}</label>
        <p className="text-xs text-gray-500 mb-2">{t("calc_medical_hint")}</p>
        <input
          type="text"
          inputMode="numeric"
          value={medicalBills}
          onChange={(e) => { setMedicalBills(formatInput(e.target.value)); setShowResult(false); }}
          placeholder="$0"
          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base focus:border-navy-900 focus:outline-none"
        />
      </div>

      {/* Lost wages */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-navy-900 mb-1">{t("calc_wages_label")}</label>
        <p className="text-xs text-gray-500 mb-2">{t("calc_wages_hint")}</p>
        <input
          type="text"
          inputMode="numeric"
          value={lostWages}
          onChange={(e) => { setLostWages(formatInput(e.target.value)); setShowResult(false); }}
          placeholder="$0"
          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base focus:border-navy-900 focus:outline-none"
        />
      </div>

      {/* Fault */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-navy-900 mb-3">{t("calc_fault_label")}</label>
        <div className="space-y-2">
          {(["none", "partial", "majority"] as const).map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => { setFault(level); setShowResult(false); }}
              className={cn(
                "w-full text-left px-4 py-3 rounded-lg border text-sm font-medium transition-all",
                fault === level
                  ? "border-navy-900 bg-navy-50 text-navy-900"
                  : "border-gray-200 text-gray-700 hover:border-navy-200"
              )}
            >
              {t(`calc_fault_${level}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Calculate button */}
      <button
        onClick={handleCalculate}
        disabled={!injury}
        className="w-full bg-navy-900 text-white font-bold py-4 rounded-xl hover:bg-navy-700 transition-colors text-base disabled:opacity-40 flex items-center justify-center gap-2"
      >
        <CalcIcon className="w-5 h-5" />
        {t("calc_button")}
      </button>

      {/* Result */}
      {showResult && estimate && (
        <div id="calc-result" className="mt-8 animate-in fade-in">
          {estimate.warning ? (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <div className="flex gap-3">
                <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-amber-900">{t("calc_warning_title")}</h3>
                  <p className="text-sm text-amber-800 mt-1">{estimate.warning}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-navy-50 border border-navy-200 rounded-xl p-6">
              <p className="text-sm text-navy-700 font-medium mb-2">{t("calc_result_label")}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-navy-900">{formatMoney(estimate.low)}</span>
                <span className="text-xl text-navy-500">–</span>
                <span className="text-4xl font-bold text-navy-900">{formatMoney(estimate.high)}</span>
              </div>

              {estimate.factors.length > 0 && (
                <div className="mt-4 space-y-2">
                  {estimate.factors.map((f, i) => (
                    <div key={i} className="flex gap-2 text-sm text-navy-700">
                      <Info className="w-4 h-4 shrink-0 mt-0.5 text-navy-500" />
                      {f}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Disclaimer */}
          <p className="text-xs text-gray-500 mt-4 text-center">{t("calc_disclaimer")}</p>

          {/* CTA */}
          <div className="mt-6 bg-white border border-gray-200 rounded-xl p-6 text-center">
            <DollarSign className="w-8 h-8 text-navy-900 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-navy-900">{t("calc_cta_heading")}</h3>
            <p className="text-sm text-gray-600 mt-1 mb-4">{t("calc_cta_text")}</p>
            <Link
              href={quizUrl(locale, { source: "calculator" })}
              className="inline-flex items-center justify-center gap-2 bg-navy-900 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-navy-700 transition-colors"
            >
              {t("calc_cta_button")}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="text-xs text-gray-400 mt-3">{t("calc_cta_free")}</p>
          </div>
        </div>
      )}
    </div>
  );
}
