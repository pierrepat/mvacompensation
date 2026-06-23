import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { QuizPage } from "@/components/quiz/QuizPage";

// Conversion/lead-capture page, no informational content. Keep it (and its
// ?source= tracking variants) out of the index so crawl budget goes to content.
export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default async function Quiz({
  params,
}: {
  params: { locale: Locale };
}) {
  const dict = await getDictionary(params.locale);
  return <QuizPage locale={params.locale} quizDict={dict.quiz} />;
}
