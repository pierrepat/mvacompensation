#!/bin/bash
# Usage: ./scripts/generate-injury.sh "slug" "es" "Injury Name" "injury-type" low mid high recoveryMonths
# Example: ./scripts/generate-injury.sh "hernia-de-disco" "es" "Hernia de Disco" "herniated-disc" 10000 50000 200000 12

SLUG="$1"
LOCALE="${2:-es}"
INJURY_TITLE="$3"
INJURY_TYPE="$4"
SETTLEMENT_LOW="${5:-5000}"
SETTLEMENT_MID="${6:-30000}"
SETTLEMENT_HIGH="${7:-150000}"
RECOVERY_MONTHS="${8:-6}"
TODAY=$(date +%Y-%m-%d)
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUTPUT_DIR="$PROJECT_ROOT/content/$LOCALE/lesiones"
OUTPUT_FILE="$OUTPUT_DIR/$SLUG.mdx"

if [ -z "$SLUG" ] || [ -z "$INJURY_TITLE" ] || [ -z "$INJURY_TYPE" ]; then
  echo "Usage: $0 <slug> <locale> <injury-title> <injury-type> [low] [mid] [high] [recovery-months]"
  echo "Example: $0 hernia-de-disco es 'Hernia de Disco' herniated-disc 10000 50000 200000 12"
  exit 1
fi

if [ -f "$OUTPUT_FILE" ]; then
  echo "ERROR: $OUTPUT_FILE already exists. Skipping."
  exit 1
fi

mkdir -p "$OUTPUT_DIR"

PROMPT="You are a legal content writer for MVAcompensation.com, a site that helps Spanish-speaking accident victims in the US get compensation.

Generate an MDX injury guide about: \"$INJURY_TITLE\"
Locale: $LOCALE
Slug: $SLUG
Injury type: $INJURY_TYPE
Average settlement range: \$$SETTLEMENT_LOW (low) / \$$SETTLEMENT_MID (mid) / \$$SETTLEMENT_HIGH (high)
Typical recovery time: $RECOVERY_MONTHS months
Date: $TODAY

REQUIREMENTS:
1. Write at a 6th-grade reading level in natural, conversational Spanish (if locale is es). No legal jargon without immediate explanation.
2. If locale is 'en', write in simple English for non-native speakers.
3. Include ONLY the frontmatter + markdown content. No code fences around the output.
4. The content should be 800-1500 words.
5. Structure: What is this injury > Symptoms > How it happens in car accidents > Compensation table by severity > Why insurers minimize it > How to protect your case > FAQ
6. Include at least one data table with compensation ranges by severity level (mild/moderate/severe).
7. Include internal links to related pages like [text](/es/guias/cuanto-pagan-por-accidente-de-auto) or [text](/es/guias/dolor-y-sufrimiento).
8. End with encouragement to get a free evaluation.
9. End with a disclaimer line in italics.
10. Include a FAQ section with 3-4 questions.
11. Medical reviewer is a doctor (Dr. Elena Vargas, MD).

FRONTMATTER FORMAT (must be exact):
---
title: \"[SEO title about this injury + compensation | year]\"
description: \"[155 chars max meta description]\"
slug: \"$SLUG\"
locale: \"$LOCALE\"
pillar: \"injury\"
injuryType: \"$INJURY_TYPE\"
averageSettlement:
  low: $SETTLEMENT_LOW
  mid: $SETTLEMENT_MID
  high: $SETTLEMENT_HIGH
recoveryTimeMonths: $RECOVERY_MONTHS
keywords: [\"keyword1\", \"keyword2\", \"keyword3\", \"keyword4\"]
author:
  name: \"Carlos Mendoza\"
  credential: \"Editor Legal\"
reviewer:
  name: \"Dr. Elena Vargas\"
  credential: \"MD\"
publishedAt: \"$TODAY\"
lastUpdated: \"$TODAY\"
schema: \"Article\"
---

IMPORTANT: Keywords must be real Spanish search terms people would type into Google about this injury after an accident. Include both medical and colloquial terms.

Output ONLY the complete MDX file content, starting with --- and ending with the disclaimer. No explanation, no code fences."

echo "Generating injury page: $INJURY_TITLE ($LOCALE)..."
claude -p "$PROMPT" --output-format text > "$OUTPUT_FILE"

if [ $? -eq 0 ] && [ -s "$OUTPUT_FILE" ]; then
  echo "SUCCESS: Created $OUTPUT_FILE"
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
