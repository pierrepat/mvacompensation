import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Locale } from "./i18n";
import type { BaseFrontmatter, ContentFrontmatter } from "./content-types";

const contentDir = path.join(process.cwd(), "content");

export function getContentSlugs(locale: Locale, section: string): string[] {
  const dir = path.join(contentDir, locale, section);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getContentBySlug<T extends BaseFrontmatter = ContentFrontmatter>(
  locale: Locale,
  section: string,
  slug: string
): { meta: T; content: string } {
  const filePath = path.join(contentDir, locale, section, `${slug}.mdx`);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    meta: {
      slug,
      locale,
      ...data,
    } as T,
    content,
  };
}

export function getAllContent<T extends BaseFrontmatter = ContentFrontmatter>(
  locale: Locale,
  section: string
): T[] {
  const slugs = getContentSlugs(locale, section);
  return slugs.map((slug) => getContentBySlug<T>(locale, section, slug).meta);
}
