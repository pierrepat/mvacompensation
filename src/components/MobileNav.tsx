"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { quizUrl } from "@/lib/quiz-url";
import type { Dictionary } from "@/lib/dictionaries";

export function MobileNav({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 text-gray-600 hover:text-gray-900"
        aria-label="Toggle menu"
        aria-expanded={open}
      >
        {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {open && (
        <nav className="absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-40">
          <div className="flex flex-col px-4 py-4 gap-3">
            <MobileLink href={`/${locale}/estados`} onClick={() => setOpen(false)}>
              {dict.nav.states}
            </MobileLink>
            <MobileLink href={`/${locale}/lesiones`} onClick={() => setOpen(false)}>
              {dict.nav.injuries}
            </MobileLink>
            <MobileLink href={`/${locale}/guias`} onClick={() => setOpen(false)}>
              {dict.nav.guides}
            </MobileLink>
            <Link
              href={quizUrl(locale)}
              onClick={() => setOpen(false)}
              className="mt-2 block text-center bg-navy-900 text-white font-semibold px-4 py-2.5 rounded-md hover:bg-navy-700 transition-colors text-sm"
            >
              {dict.cta.freeEvaluation}
            </Link>
          </div>
        </nav>
      )}
    </div>
  );
}

function MobileLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="text-gray-700 hover:text-navy-900 font-medium text-sm py-1 transition-colors"
    >
      {children}
    </Link>
  );
}
