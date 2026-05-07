import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Locale } from "@/lib/i18n";

interface RelatedLink {
  title: string;
  href: string;
}

interface RelatedLinksProps {
  locale: Locale;
  heading: string;
  links: RelatedLink[];
}

export function RelatedLinks({ heading, links }: RelatedLinksProps) {
  if (links.length === 0) return null;

  return (
    <nav className="my-8 rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-navy-900 mb-4">{heading}</h3>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="flex items-center gap-2 text-sm text-gray-700 hover:text-navy-900 transition-colors group"
            >
              <ArrowRight className="w-4 h-4 text-navy-200 group-hover:text-navy-900 transition-colors" />
              {link.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
