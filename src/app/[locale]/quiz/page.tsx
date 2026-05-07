import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { QuizPage } from "@/components/quiz/QuizPage";

export default async function Quiz({
  params,
}: {
  params: { locale: Locale };
}) {
  const dict = await getDictionary(params.locale);
  return <QuizPage locale={params.locale} quizDict={dict.quiz} />;
}
