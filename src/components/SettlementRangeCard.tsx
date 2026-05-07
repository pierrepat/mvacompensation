import type { Locale } from "@/lib/i18n";

interface SettlementRange {
  label: string;
  low: string;
  high: string;
}

interface SettlementRangeCardProps {
  locale: Locale;
  ranges: SettlementRange[];
  source?: string;
}

export function SettlementRangeCard({
  locale,
  ranges,
  source,
}: SettlementRangeCardProps) {
  const isEn = locale === "en";

  return (
    <div className="my-8 rounded-lg border border-gray-200 overflow-hidden">
      <div className="bg-navy-50 px-6 py-3 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-navy-900">
          {isEn
            ? "Average Settlement Ranges"
            : "Rangos promedio de compensación"}
        </h3>
      </div>
      <div className="divide-y divide-gray-100">
        {ranges.map((range) => (
          <div
            key={range.label}
            className="flex items-center justify-between px-6 py-3 text-sm"
          >
            <span className="text-gray-700">{range.label}</span>
            <span className="font-semibold text-navy-900">
              {range.low} – {range.high}
            </span>
          </div>
        ))}
      </div>
      {source && (
        <div className="px-6 py-2 bg-gray-50 text-xs text-gray-500 border-t border-gray-100">
          {isEn ? "Source" : "Fuente"}: {source}
        </div>
      )}
    </div>
  );
}
