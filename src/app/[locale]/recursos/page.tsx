import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";

export function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Metadata {
  const isEn = params.locale === "en";
  const baseUrl = "https://mvacompensation.com";
  const url = `${baseUrl}/${params.locale}/recursos`;
  return {
    title: isEn
      ? "Free Accident Resource Center for the Latino Community"
      : "Centro de Recursos Gratuito tras un Accidente de Auto",
    description: isEn
      ? "A free public resource for Latino families after a car accident. What to do, your rights, and free bilingual help. No cost, regardless of immigration status."
      : "Recurso gratuito para la comunidad latina tras un accidente de auto. Qué hacer, tus derechos, y ayuda bilingüe gratis. Sin importar tu estatus migratorio.",
    alternates: {
      canonical: url,
      languages: {
        es: `${baseUrl}/es/recursos`,
        en: `${baseUrl}/en/recursos`,
        "x-default": `${baseUrl}/es/recursos`,
      },
    },
  };
}

const CHECKLIST_ES = [
  "Llama al 911 y pide un reporte policial. Es la prueba más importante de tu caso.",
  "Busca atención médica de inmediato, aunque te sientas bien. Algunas lesiones aparecen días después.",
  "Toma fotos del lugar, los vehículos, tus lesiones y las placas.",
  "Pide nombres y teléfonos de testigos.",
  "No firmes nada ni aceptes la primera oferta del seguro sin asesoría.",
  "Habla con un abogado bilingüe antes de declarar a la aseguradora del otro conductor.",
];

const CHECKLIST_EN = [
  "Call 911 and request a police report. It is the most important evidence in your case.",
  "Get medical care right away, even if you feel fine. Some injuries show up days later.",
  "Take photos of the scene, the vehicles, your injuries, and the license plates.",
  "Get names and phone numbers of witnesses.",
  "Do not sign anything or accept the insurer's first offer without advice.",
  "Talk to a bilingual lawyer before giving a statement to the other driver's insurer.",
];

export default function Recursos({
  params,
}: {
  params: { locale: Locale };
}) {
  const { locale } = params;
  const isEn = locale === "es" ? false : true;
  const checklist = isEn ? CHECKLIST_EN : CHECKLIST_ES;

  const hubs = [
    {
      href: `/${locale}/guias/accidente-de-carro-que-hacer`,
      title: isEn ? "What to do after a crash, step by step" : "Qué hacer después de un accidente, paso a paso",
    },
    {
      href: `/${locale}/estados`,
      title: isEn ? "Your rights by state" : "Tus derechos por estado",
    },
    {
      href: `/${locale}/ciudades`,
      title: isEn ? "Find a lawyer by city" : "Encuentra un abogado por ciudad",
    },
    {
      href: `/${locale}/lesiones`,
      title: isEn ? "Common accident injuries" : "Lesiones comunes en accidentes",
    },
    {
      href: `/${locale}/guias`,
      title: isEn ? "All free guides" : "Todas las guías gratis",
    },
    {
      href: `/${locale}/calculadora`,
      title: isEn ? "Estimate your case value" : "Calcula el valor de tu caso",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <p className="text-sm font-semibold uppercase tracking-wide text-navy-700">
        {isEn ? "Free community resource" : "Recurso comunitario gratuito"}
      </p>
      <h1 className="mt-2 text-3xl font-bold text-navy-900">
        {isEn
          ? "Accident Resource Center for the Latino Community"
          : "Centro de Recursos tras un Accidente de Auto"}
      </h1>
      <p className="mt-4 text-lg text-gray-600">
        {isEn
          ? "Free, plain-language help for Latino families after a car accident. What to do, what you can claim, and how to find a bilingual lawyer. There is no cost, and your immigration status does not affect your right to seek compensation."
          : "Ayuda gratuita y en lenguaje claro para familias latinas tras un accidente de auto. Qué hacer, qué puedes reclamar, y cómo encontrar un abogado bilingüe. No tiene costo, y tu estatus migratorio no afecta tu derecho a buscar compensación."}
      </p>

      {/* Printable quick checklist */}
      <section className="mt-12 rounded-xl border border-gray-200 p-6 sm:p-8">
        <h2 className="text-xl font-semibold text-navy-900">
          {isEn
            ? "The first 24 hours: quick checklist"
            : "Las primeras 24 horas: lista rápida"}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          {isEn
            ? "Save it, print it, or share it with your community."
            : "Guárdala, imprímela, o compártela con tu comunidad."}
        </p>
        <ul className="mt-5 space-y-3">
          {checklist.map((item, i) => (
            <li key={i} className="flex gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-navy-700" />
              <span className="text-gray-700">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Resource hub links */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold text-navy-900">
          {isEn ? "Free guides and tools" : "Guías y herramientas gratis"}
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {hubs.map((h) => (
            <Link
              key={h.href}
              href={h.href}
              className="group flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:border-navy-200 hover:shadow-sm transition-all"
            >
              <span className="font-medium text-gray-800 group-hover:text-navy-900 transition-colors">
                {h.title}
              </span>
              <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-navy-900 transition-colors" />
            </Link>
          ))}
        </div>
      </section>

      <div className="mt-12">
        <LeadCaptureForm locale={locale} variant="banner" source={`recursos_${locale}`} />
      </div>

      {/* Partner / co-branding offer */}
      <section className="mt-12 rounded-xl bg-navy-50 border border-navy-200 p-6 sm:p-8">
        <h2 className="text-xl font-semibold text-navy-900">
          {isEn
            ? "For chambers, nonprofits, and community organizations"
            : "Para cámaras, organizaciones sin fines de lucro y grupos comunitarios"}
        </h2>
        <p className="mt-3 text-gray-700">
          {isEn
            ? "If your organization wants to share this resource with your community, we are glad to co-brand it with your logo at no cost. It is a free, practical tool for families who may not know their options."
            : "Si tu organización quiere compartir este recurso con su comunidad, con gusto lo personalizamos con tu logo, sin ningún costo. Es una herramienta gratuita y práctica para familias que quizá no conocen sus opciones."}
        </p>
        <a
          href="mailto:pierre@gtmpartner.ai?subject=Recurso%20para%20mi%20comunidad"
          className="mt-4 inline-block rounded-md bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-700 transition-colors"
        >
          {isEn ? "Request a co-branded version" : "Solicita una versión con tu logo"}
        </a>
      </section>

      <p className="mt-12 text-xs italic text-gray-400">
        {isEn
          ? "This page is general information, not legal advice, and does not guarantee any result. Laws and amounts vary by case."
          : "Esta página es información general, no asesoría legal, y no garantiza ningún resultado. Las leyes y los montos varían según el caso."}
      </p>
    </div>
  );
}
