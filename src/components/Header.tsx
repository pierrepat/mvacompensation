import Link from "next/link";
import { Shield } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";
import { quizUrl } from "@/lib/quiz-url";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileNav } from "./MobileNav";

export function Header({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-navy-900 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              <span className="text-navy-900">MVA</span>
              <span className="text-navy-500">Compensation</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
            <Link href={`/${locale}/estados`} className="hover:text-navy-900 transition-colors">
              {dict.nav.states}
            </Link>
            <Link href={`/${locale}/injuries`} className="hover:text-navy-900 transition-colors">
              {dict.nav.injuries}
            </Link>
            <Link href={`/${locale}/guides`} className="hover:text-navy-900 transition-colors">
              {dict.nav.guides}
            </Link>
          </nav>

          {/* CTA + Language + Mobile */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher locale={locale} />
            <Link
              href={quizUrl(locale)}
              className="hidden sm:inline-flex items-center gap-1.5 bg-navy-900 hover:bg-navy-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-sm"
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
