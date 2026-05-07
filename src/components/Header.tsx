import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";
import { quizUrl } from "@/lib/quiz-url";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileNav } from "./MobileNav";

export function Header({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="text-xl font-bold tracking-tight"
          >
            <span className="text-navy-900">MVA</span>
            <span className="text-gray-700">Compensation</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link
              href={`/${locale}/states`}
              className="hover:text-navy-900 transition-colors"
            >
              {dict.nav.states}
            </Link>
            <Link
              href={`/${locale}/injuries`}
              className="hover:text-navy-900 transition-colors"
            >
              {dict.nav.injuries}
            </Link>
            <Link
              href={`/${locale}/calculator/settlement-estimator`}
              className="hover:text-navy-900 transition-colors"
            >
              {dict.nav.calculator}
            </Link>
            <Link
              href={`/${locale}/guides`}
              className="hover:text-navy-900 transition-colors"
            >
              {dict.nav.guides}
            </Link>
          </nav>

          {/* CTA + Language + Mobile toggle */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher locale={locale} />
            <Link
              href={quizUrl(locale)}
              className="hidden sm:inline-block bg-navy-900 hover:bg-navy-700 text-white text-sm font-semibold px-4 py-2 rounded-md transition-colors"
            >
              {dict.cta.freeEvaluation}
            </Link>
            <MobileNav locale={locale} dict={dict} />
          </div>
        </div>
      </div>
    </header>
  );
}
