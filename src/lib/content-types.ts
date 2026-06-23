export type BaseFrontmatter = {
  title: string;
  description: string; // 155 char meta description
  slug: string;
  locale: "en" | "es";
  pillar: "state" | "injury" | "guide" | "faq" | "tool" | "city";
  keywords: string[];
  author: { name: string; credential?: string; bio?: string };
  reviewer?: { name: string; credential: string };
  publishedAt: string; // ISO date
  lastUpdated: string;
  ogImage?: string;
  schema?: "Article" | "FAQPage" | "HowTo" | "MedicalCondition";
};

export type StateFrontmatter = BaseFrontmatter & {
  pillar: "state";
  state: string; // 'florida'
  stateCode: string; // 'FL'
  isNoFault: boolean;
  statuteOfLimitations: number; // years
  averageSettlement: { low: number; mid: number; high: number };
};

export type InjuryFrontmatter = BaseFrontmatter & {
  pillar: "injury";
  injuryType: string;
  averageSettlement: { low: number; mid: number; high: number };
  recoveryTimeMonths: number;
};

export type GuideFrontmatter = BaseFrontmatter & {
  pillar: "guide";
  topic: string;
};

export type CityFrontmatter = BaseFrontmatter & {
  pillar: "city";
  city: string;
  state: string;
  stateCode: string;
  parentStateSlug: string; // slug of the /estados page this city rolls up to
  isNoFault: boolean;
  statuteOfLimitations: number; // years
};

export type FaqFrontmatter = BaseFrontmatter & {
  pillar: "faq";
  question: string; // the question, used as H1
  category: string;
};

export type ContentFrontmatter =
  | StateFrontmatter
  | InjuryFrontmatter
  | GuideFrontmatter
  | FaqFrontmatter
  | CityFrontmatter;
