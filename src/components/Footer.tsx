import Link from "next/link";
import { Shield } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";
import { quizUrl } from "@/lib/quiz-url";

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-950 text-white">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-white/10 rounded-lg flex items-center justify-center">
                <Shield className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-white">MVACompensation</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              {dict.footer.notLawFirm}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-3">
              {locale === "es" ? "Guías" : "Guides"}
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href={`/${locale}/estados`} className="hover:text-white transition-colors">{dict.nav.states}</Link></li>
              <li><Link href={`/${locale}/injuries`} className="hover:text-white transition-colors">{dict.nav.injuries}</Link></li>
              <li><Link href={`/${locale}/guides`} className="hover:text-white transition-colors">{dict.nav.guides}</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-3">Legal</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href={`/${locale}/privacy`} className="hover:text-white transition-colors">{dict.footer.privacy}</Link></li>
              <li><Link href={`/${locale}/terms`} className="hover:text-white transition-colors">{dict.footer.terms}</Link></li>
              <li><Link href={`/${locale}/about`} className="hover:text-white transition-colors">{locale === "es" ? "Acerca de" : "About"}</Link></li>
            </ul>
          </div>

          {/* CTA */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-3">
              {locale === "es" ? "¿Necesitas ayuda?" : "Need help?"}
            </h3>
            <Link
              href={quizUrl(locale)}
              className="inline-block bg-white text-navy-900 font-semibold px-5 py-2.5 rounded-lg text-sm hover:bg-gray-100 transition-colors"
            >
              {dict.cta.freeEvaluation}
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-xs text-gray-500 text-center">
            {dict.footer.disclaimer}
          </p>
          <p className="text-xs text-gray-600 text-center mt-2">
            {dict.footer.copyright.replace("{year}", String(year))}
          </p>
        </div>
      </div>
    </footer>
  );
}
