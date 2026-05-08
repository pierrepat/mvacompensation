/**
 * Extract FAQ pairs from MDX content.
 * Looks for bold questions (**question?**) followed by paragraph answers.
 */
export function extractFAQs(
  content: string
): { question: string; answer: string }[] {
  const faqs: { question: string; answer: string }[] = [];

  // Match **Question?** followed by answer paragraphs
  const faqRegex = /\*\*(.+?\?)\*\*\s*\n\n([\s\S]*?)(?=\n\n\*\*|---|\n##|$)/g;
  let match;

  while ((match = faqRegex.exec(content)) !== null) {
    const question = match[1].trim();
    const answer = match[2]
      .trim()
      .replace(/\*\*/g, "") // remove bold markers
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // remove markdown links, keep text
      .replace(/\n/g, " ") // flatten newlines
      .replace(/\s+/g, " ") // normalize whitespace
      .trim();

    if (question && answer && answer.length > 20) {
      faqs.push({ question, answer });
    }
  }

  return faqs;
}
