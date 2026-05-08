import type { Metadata } from "next";
import { Shield } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { Calculator } from "@/components/calculator/Calculator";

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const isEs = params.locale === "es";
  return {
    title: isEs
      ? "Calculadora de Compensación por Accidente de Auto"
      : "Car Accident Settlement Calculator",
    description: isEs
      ? "Calcula cuánto podrías recibir por tu accidente de auto. Herramienta gratis. Estimado en menos de 1 minuto."
      : "Estimate how much your car accident case may be worth. Free tool. Get an estimate in under 1 minute.",
  };
}

export default async function CalculadoraPage({
  params,
}: {
  params: { locale: Locale };
}) {
  const dict = await getDictionary(params.locale);
  const isEs = params.locale === "es";

  return (
    <>
      {/* Hero */}
      <section className="bg-navy-950 text-white py-14 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shield className="w-7 h-7 text-amber-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {dict.calc.title}
          </h1>
          <p className="mt-4 text-gray-300 max-w-xl mx-auto leading-relaxed">
            {dict.calc.subtitle}
          </p>
        </div>
      </section>

      {/* Calculator */}
      <section className="bg-white py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Calculator locale={params.locale} dict={dict.calc} />
        </div>
      </section>

      {/* SEO content below calculator */}
      <section className="bg-gray-50 border-t border-gray-100 py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-navy max-w-none">
          <h2>{isEs ? "¿Cómo se calcula la compensación por un accidente?" : "How Is Accident Compensation Calculated?"}</h2>
          <p>
            {isEs
              ? "La compensación por un accidente de auto se basa en dos tipos de daños: económicos (gastos médicos, salarios perdidos, daños a propiedad) y no económicos (dolor y sufrimiento, angustia emocional, pérdida de calidad de vida). Los abogados y aseguradoras usan un 'multiplicador' — un número que se multiplica por tus daños económicos para estimar el valor total del caso."
              : "Car accident compensation is based on two types of damages: economic (medical bills, lost wages, property damage) and non-economic (pain and suffering, emotional distress, loss of quality of life). Lawyers and insurers use a 'multiplier' — a number applied to your economic damages to estimate the total case value."}
          </p>
          <p>
            {isEs
              ? "Para lesiones leves, el multiplicador típico es de 1.5x a 3x. Para lesiones moderadas, de 3x a 5x. Para lesiones serias, de 5x a 8x. Y para lesiones catastróficas, puede llegar a 15x o más."
              : "For minor injuries, the typical multiplier is 1.5x to 3x. For moderate injuries, 3x to 5x. For serious injuries, 5x to 8x. And for catastrophic injuries, it can reach 15x or more."}
          </p>

          <h2>{isEs ? "¿Por qué un abogado puede conseguir más?" : "Why Can a Lawyer Get You More?"}</h2>
          <p>
            {isEs
              ? "Según el Insurance Research Council, las personas con abogado reciben en promedio 3.5 veces más compensación que quienes negocian solas. Esto se debe a que las aseguradoras saben que un abogado llevará el caso a juicio si la oferta no es justa. Sin esa amenaza, las aseguradoras ofrecen menos."
              : "According to the Insurance Research Council, people with lawyers receive on average 3.5 times more compensation than those who negotiate alone. This is because insurers know a lawyer will take the case to trial if the offer isn't fair. Without that threat, insurers offer less."}
          </p>

          <h2>{isEs ? "¿Este estimado es preciso?" : "Is This Estimate Accurate?"}</h2>
          <p>
            {isEs
              ? "Esta calculadora da un rango general basado en promedios nacionales. El valor real de tu caso depende de muchos factores: las leyes de tu estado, la claridad de la culpa, los límites del seguro, la calidad de tu documentación médica y más. Solo un abogado que revise los detalles de tu caso puede darte un número preciso."
              : "This calculator provides a general range based on national averages. The actual value of your case depends on many factors: your state's laws, clarity of fault, insurance limits, quality of medical documentation, and more. Only a lawyer who reviews your case details can give you an accurate number."}
          </p>
        </div>
      </section>
    </>
  );
}
