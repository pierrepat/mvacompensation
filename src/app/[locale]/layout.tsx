import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { locales, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ExitIntentModal } from "@/components/ExitIntentModal";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const dict = await getDictionary(params.locale);
  const baseUrl = "https://mvacompensation.com";
  const altLocale = params.locale === "en" ? "es" : "en";

  return {
    title: {
      default: dict.meta.siteName,
      template: `%s | ${dict.meta.siteName}`,
    },
    description: dict.meta.siteDescription,
    alternates: {
      canonical: `${baseUrl}/${params.locale}`,
      languages: {
        en: `${baseUrl}/en`,
        es: `${baseUrl}/es`,
        "x-default": `${baseUrl}/en`,
      },
    },
    openGraph: {
      siteName: dict.meta.siteName,
      locale: params.locale,
      alternateLocale: altLocale,
      type: "website",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  const dict = await getDictionary(params.locale);

  return (
    <html lang={params.locale}>
      <body className={`${inter.variable} font-sans antialiased bg-white text-gray-900`}>
        <Header locale={params.locale} dict={dict} />
        <main className="min-h-screen">{children}</main>
        <Footer locale={params.locale} dict={dict} />
        <ExitIntentModal locale={params.locale} />
      </body>
    </html>
  );
}
