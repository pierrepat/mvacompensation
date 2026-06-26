#!/bin/bash
# Usage: ./scripts/generate-state.sh "slug" "locale" "State Name" "ST" is_no_fault statute_years low mid high
# Example: ./scripts/generate-state.sh "michigan" "es" "Michigan" "MI" true 3 10000 80000 500000

SLUG="$1"
LOCALE="${2:-es}"
STATE_NAME="$3"
STATE_CODE="$4"
IS_NO_FAULT="${5:-false}"
STATUTE_YEARS="${6:-2}"
SETTLEMENT_LOW="${7:-10000}"
SETTLEMENT_MID="${8:-75000}"
SETTLEMENT_HIGH="${9:-500000}"
TODAY=$(date +%Y-%m-%d)
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUTPUT_DIR="$PROJECT_ROOT/content/$LOCALE/estados"
OUTPUT_FILE="$OUTPUT_DIR/$SLUG.mdx"

if [ -z "$SLUG" ] || [ -z "$STATE_NAME" ] || [ -z "$STATE_CODE" ]; then
  echo "Usage: $0 <slug> <locale> <state-name> <state-code> [is-no-fault] [statute-years] [low] [mid] [high]"
  echo "Example: $0 michigan es Michigan MI true 3 10000 80000 500000"
  exit 1
fi

if [ -f "$OUTPUT_FILE" ]; then
  echo "ERROR: $OUTPUT_FILE already exists. Skipping."
  exit 1
fi

mkdir -p "$OUTPUT_DIR"

PROMPT="You are a legal content writer for MVAcompensation.com, a site that helps Spanish-speaking accident victims in the US get compensation.

Generate an MDX state guide about car accident compensation in: $STATE_NAME ($STATE_CODE)
Locale: $LOCALE
Slug: $SLUG
No-fault state: $IS_NO_FAULT
Statute of limitations: $STATUTE_YEARS years
Average settlement range: \$$SETTLEMENT_LOW (low) / \$$SETTLEMENT_MID (mid) / \$$SETTLEMENT_HIGH (high)
Date: $TODAY

REQUIREMENTS:
1. Write at a 6th-grade reading level in natural, conversational Spanish (if locale is es). No legal jargon without immediate explanation.
2. If locale is 'en', write in simple English for non-native speakers.
3. Include ONLY the frontmatter + markdown content. No code fences.
4. Content should be 1000-2000 words.
5. Structure: Intro mentioning Hispanic population in that state > Insurance system explanation (no-fault vs at-fault) > Statute of limitations with exceptions > Compensation table by injury severity > Minimum insurance requirements > Steps after accident > Areas with Hispanic population > Common mistakes > FAQ
6. Include at least 2 data tables (compensation ranges + insurance minimums).
7. Include internal links to related pages like [text](/es/guias/cuanto-pagan-por-accidente-de-auto) or [text](/es/lesiones/latigazo-cervical).
8. Reference real state laws with section numbers where possible.
9. Mention 'sin importar tu estatus migratorio' naturally.
10. End with encouragement to get a free evaluation.
11. End with a disclaimer mentioning the state's actual statutes as sources.
12. FAQ section with 5-7 questions.

FRONTMATTER FORMAT (must be exact):
---
title: \"Compensación por Accidente de Auto en $STATE_NAME | Guía Completa $(date +%Y)\"
description: \"[155 chars max meta description about accidents in $STATE_NAME]\"
slug: \"$SLUG\"
locale: \"$LOCALE\"
pillar: \"state\"
state: \"$SLUG\"
stateCode: \"$STATE_CODE\"
isNoFault: $IS_NO_FAULT
statuteOfLimitations: $STATUTE_YEARS
averageSettlement:
  low: $SETTLEMENT_LOW
  mid: $SETTLEMENT_MID
  high: $SETTLEMENT_HIGH
keywords: [\"accidente auto $SLUG\", \"compensación $SLUG\", \"abogado accidente $SLUG\", \"seguro auto $SLUG\"]
author:
  name: \"Equipo de MVACompensation\"
  credential: \"Equipo Editorial\"
publishedAt: \"$TODAY\"
lastUpdated: \"$TODAY\"
ogImage: \"/og/estados/$SLUG-$LOCALE.png\"
schema: \"Article\"
---

IMPORTANT:
- Keywords must include the state name in Spanish search terms.
- Use accurate data for this specific state's laws, insurance requirements, and fault system.
- If this is a no-fault state, explain PIP requirements. If at-fault, explain the fault determination system.
- Include the actual comparative/contributory negligence rule for this state.

Output ONLY the complete MDX file content, starting with --- and ending with the disclaimer. No explanation, no code fences."

echo "Generating state page: $STATE_NAME ($LOCALE)..."
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
