import type { Locale } from "@/lib/i18n";

export default function InjuriesIndex({
  params,
}: {
  params: { locale: Locale };
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-gray-900">
        {params.locale === "es"
          ? "Compensación por Tipo de Lesión"
          : "Compensation by Injury Type"}
      </h1>
      <p className="mt-4 text-gray-600">Coming soon.</p>
    </div>
  );
}
