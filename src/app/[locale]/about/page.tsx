import type { Metadata } from "next";
import Link from "next/link";
import { Heart, Languages, ShieldCheck, HandHeart } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";

export function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Metadata {
  const isEn = params.locale !== "es";
  const baseUrl = "https://mvacompensation.com";
  const url = `${baseUrl}/${params.locale}/about`;
  return {
    title: isEn
      ? "About MVACompensation | Free Accident Help for the Latino Community"
      : "Acerca de MVACompensation | Ayuda Gratuita para la Comunidad Latina",
    description: isEn
      ? "MVACompensation is a free, Spanish-first resource that helps Latino families understand their rights after a car accident. No cost, regardless of immigration status."
      : "MVACompensation es un recurso gratuito en español que ayuda a familias latinas a entender sus derechos tras un accidente de auto. Sin costo, sin importar tu estatus migratorio.",
    alternates: {
      canonical: url,
      languages: {
        es: `${baseUrl}/es/about`,
        en: `${baseUrl}/en/about`,
        "x-default": `${baseUrl}/es/about`,
      },
    },
  };
}

export default function About({
  params,
}: {
  params: { locale: Locale };
}) {
  const { locale } = params;
  const isEn = locale !== "es";

  const values = isEn
    ? [
        { icon: Languages, title: "Spanish first", body: "Everything is written in plain Spanish, the way families actually talk, not legal jargon." },
        { icon: ShieldCheck, title: "Regardless of status", body: "Immigration status does not affect your right to seek compensation, and we say so clearly." },
        { icon: Heart, title: "Free for families", body: "There is never a cost or obligation to use our guides or our free case evaluation." },
        { icon: HandHeart, title: "People before paperwork", body: "Our goal is to help families make informed decisions after a hard moment." },
      ]
    : [
        { icon: Languages, title: "Primero en español", body: "Todo está escrito en español claro, como hablan las familias, sin tecnicismos legales." },
        { icon: ShieldCheck, title: "Sin importar tu estatus", body: "Tu estatus migratorio no afecta tu derecho a buscar compensación, y lo decimos con claridad." },
        { icon: Heart, title: "Gratis para las familias", body: "Nunca hay costo ni compromiso por usar nuestras guías o la evaluación gratuita." },
        { icon: HandHeart, title: "Las personas primero", body: "Nuestra meta es ayudar a las familias a tomar decisiones informadas después de un momento difícil." },
      ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <p className="text-sm font-semibold uppercase tracking-wide text-navy-700">
        {isEn ? "About us" : "Acerca de nosotros"}
      </p>
      <h1 className="mt-2 text-3xl font-bold text-navy-900">
        {isEn
          ? "Free accident help for the Latino community"
          : "Ayuda gratuita tras un accidente para la comunidad latina"}
      </h1>

      <div className="mt-6 space-y-5 text-lg text-gray-700">
        <p>
          {isEn
            ? "MVACompensation.com is a free, Spanish-first resource that helps Latino families in the United States understand their rights after a car accident. We started it for a simple reason: too many Spanish-speaking families never get the help they are entitled to, often because of a language barrier or fear about their immigration status."
            : "MVACompensation.com es un recurso gratuito en español que ayuda a las familias latinas en Estados Unidos a entender sus derechos después de un accidente de auto. Lo creamos por una razón simple: demasiadas familias hispanohablantes nunca reciben la ayuda que les corresponde, muchas veces por la barrera del idioma o por miedo a su estatus migratorio."}
        </p>
        <p>
          {isEn
            ? "We put clear, plain-Spanish information in their hands, at no cost, so they can make informed decisions during a stressful time. We are not a law firm. When a family wants legal help, we connect them, for free, with licensed bilingual attorneys who offer a free case evaluation and only get paid if the family wins. That support from our attorney network is what keeps this resource free for everyone who uses it."
            : "Ponemos información clara y en español sencillo en sus manos, sin costo, para que puedan tomar decisiones informadas en un momento difícil. No somos un bufete de abogados. Cuando una familia quiere ayuda legal, la conectamos, gratis, con abogados bilingües con licencia que ofrecen una evaluación gratuita y solo cobran si la familia gana. Ese apoyo de nuestra red de abogados es lo que mantiene este recurso gratis para todos."}
        </p>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {values.map((v) => (
          <div key={v.title} className="rounded-xl border border-gray-200 p-6">
            <v.icon className="h-6 w-6 text-navy-700" />
            <h2 className="mt-3 text-lg font-semibold text-navy-900">{v.title}</h2>
            <p className="mt-1 text-gray-600">{v.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-xl bg-navy-50 border border-navy-200 p-6 sm:p-8">
        <h2 className="text-xl font-semibold text-navy-900">
          {isEn ? "For community organizations" : "Para organizaciones comunitarias"}
        </h2>
        <p className="mt-3 text-gray-700">
          {isEn
            ? "If your chamber or nonprofit wants to share our free resources with your community, we are glad to co-brand them with your logo at no cost. See our "
            : "Si tu cámara u organización quiere compartir nuestros recursos gratuitos con su comunidad, con gusto los personalizamos con tu logo, sin costo. Visita nuestro "}
          <Link href={`/${locale}/recursos`} className="font-semibold text-navy-800 underline">
            {isEn ? "resource center" : "centro de recursos"}
          </Link>
          {isEn ? " or reach us at " : " o escríbenos a "}
          <a href="mailto:pierre@gtmpartner.ai" className="font-semibold text-navy-800 underline">
            pierre@gtmpartner.ai
          </a>
          .
        </p>
      </div>

      <div className="mt-12">
        <LeadCaptureForm locale={locale} variant="banner" source={`about_${locale}`} />
      </div>
    </div>
  );
}
