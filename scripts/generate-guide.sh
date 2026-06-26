#!/bin/bash
# Usage: ./scripts/generate-guide.sh "keyword-slug" "es" "Título de la Guía"
# Example: ./scripts/generate-guide.sh "accidente-de-uber" "es" "Accidente de Uber o Lyft"

SLUG="$1"
LOCALE="${2:-es}"
TOPIC_TITLE="$3"
TODAY=$(date +%Y-%m-%d)
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUTPUT_DIR="$PROJECT_ROOT/content/$LOCALE/guias"
OUTPUT_FILE="$OUTPUT_DIR/$SLUG.mdx"

if [ -z "$SLUG" ] || [ -z "$TOPIC_TITLE" ]; then
  echo "Usage: $0 <slug> <locale> <topic-title>"
  echo "Example: $0 accidente-de-uber es 'Accidente de Uber o Lyft'"
  exit 1
fi

if [ -f "$OUTPUT_FILE" ]; then
  echo "ERROR: $OUTPUT_FILE already exists. Skipping."
  exit 1
fi

mkdir -p "$OUTPUT_DIR"

PROMPT="You are a legal content writer for MVAcompensation.com, a site that helps Spanish-speaking accident victims in the US get compensation.

Generate an MDX guide about: \"$TOPIC_TITLE\"
Locale: $LOCALE
Slug: $SLUG
Date: $TODAY

REQUIREMENTS:
1. Write at a 6th-grade reading level in natural, conversational Spanish (if locale is es). No legal jargon without immediate explanation.
2. If locale is 'en', write in simple English for non-native speakers.
3. Include ONLY the frontmatter + markdown content. No code fences around the output.
4. The content should be 800-1500 words.
5. Include at least one data table with compensation ranges or statistics.
6. Include internal links to related pages using relative paths like [text](/es/estados/florida) or [text](/es/guias/dolor-y-sufrimiento) or [text](/es/lesiones/latigazo-cervical).
7. End with a section encouraging the reader to get a free evaluation.
8. End with a disclaimer line in italics about the date and sources.
9. Include a FAQ section with 3-5 questions using ## and **bold question** format.
10. Mention 'sin importar tu estatus migratorio' naturally where relevant.

FRONTMATTER FORMAT (must be exact):
---
title: \"[SEO title with | MVA Compensation or year]\"
description: \"[155 chars max meta description]\"
slug: \"$SLUG\"
locale: \"$LOCALE\"
pillar: \"guide\"
topic: \"$SLUG\"
keywords: [\"keyword1\", \"keyword2\", \"keyword3\", \"keyword4\"]
author:
  name: \"Equipo de MVACompensation\"
  credential: \"Equipo Editorial\"
publishedAt: \"$TODAY\"
lastUpdated: \"$TODAY\"
schema: \"Article\"
---

IMPORTANT: Keywords must be real Spanish search terms people would type into Google about this topic. Think about what a Spanish-speaking person in the US would search after having an accident related to this topic.

Output ONLY the complete MDX file content, starting with --- and ending with the disclaimer. No explanation, no code fences."

echo "Generating guide: $TOPIC_TITLE ($LOCALE)..."
claude -p "$PROMPT" --output-format text > "$OUTPUT_FILE"

if [ $? -eq 0 ] && [ -s "$OUTPUT_FILE" ]; then
  echo "SUCCESS: Created $OUTPUT_FILE"
  # Verify frontmatter exists
  if head -1 "$OUTPUT_FILE" | grep -q "^---"; then
    echo "Frontmatter: OK"
  else
    echo "WARNING: File may not have valid frontmatter. Check manually."
  fi
else
  echo "ERROR: Failed to generate $OUTPUT_FILE"
  rm -f "$OUTPUT_FILE"
  exit 1
fi
