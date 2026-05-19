#!/bin/bash
# Batch content generator for MVAcompensation.com
# Generates new guides, injury pages, and state pages in Spanish + English
# Usage: ./scripts/batch-generate.sh [guides|injuries|states|all]

set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
TYPE="${1:-all}"

echo "================================================"
echo "MVA Compensation - Batch Content Generator"
echo "Type: $TYPE"
echo "Date: $(date +%Y-%m-%d)"
echo "================================================"
echo ""

# ============================================================
# NEW GUIDES TO GENERATE (Spanish)
# Prioritized by search volume and conversion potential
# ============================================================
generate_guides() {
  echo "--- GENERATING GUIDES (ES) ---"

  # Tier 1: Highest intent
  "$SCRIPT_DIR/generate-guide.sh" "accidente-de-uber-lyft" "es" \
    "¿Qué Hacer Después de un Accidente en Uber o Lyft?"

  "$SCRIPT_DIR/generate-guide.sh" "accidente-sin-licencia" "es" \
    "Accidente de Auto Sin Licencia de Conducir"

  "$SCRIPT_DIR/generate-guide.sh" "accidente-sin-papeles" "es" \
    "Accidente de Auto Sin Papeles — Tus Derechos como Indocumentado"

  "$SCRIPT_DIR/generate-guide.sh" "que-no-decir-a-la-aseguradora" "es" \
    "Qué No Decir a la Aseguradora Después de un Accidente"

  "$SCRIPT_DIR/generate-guide.sh" "como-negociar-con-la-aseguradora" "es" \
    "Cómo Negociar con la Aseguradora por tu Accidente"

  # Tier 2: Specific situations
  "$SCRIPT_DIR/generate-guide.sh" "accidente-de-camion" "es" \
    "Accidente con Camión Comercial (18-Wheeler)"

  "$SCRIPT_DIR/generate-guide.sh" "accidente-de-motocicleta" "es" \
    "Accidente de Motocicleta — Compensación y Derechos"

  "$SCRIPT_DIR/generate-guide.sh" "accidente-estacionamiento" "es" \
    "Accidente en Estacionamiento — ¿Quién Tiene la Culpa?"

  "$SCRIPT_DIR/generate-guide.sh" "accidente-menor-de-edad" "es" \
    "Accidente de Auto con Menor de Edad"

  "$SCRIPT_DIR/generate-guide.sh" "accidente-embarazada" "es" \
    "Accidente de Auto Estando Embarazada"

  # Tier 3: Educational / long-tail
  "$SCRIPT_DIR/generate-guide.sh" "diferencia-reclamo-demanda" "es" \
    "Diferencia entre Reclamo y Demanda por Accidente"

  "$SCRIPT_DIR/generate-guide.sh" "me-chocaron-por-detras-en-semaforo" "es" \
    "Me Chocaron Por Detrás en un Semáforo"

  "$SCRIPT_DIR/generate-guide.sh" "accidente-auto-de-trabajo" "es" \
    "Accidente de Auto Yendo o Viniendo del Trabajo"

  "$SCRIPT_DIR/generate-guide.sh" "accidente-conductor-borracho" "es" \
    "Accidente por Conductor Borracho (DUI)"

  "$SCRIPT_DIR/generate-guide.sh" "cuanto-tarda-caso-accidente" "es" \
    "¿Cuánto Tarda un Caso de Accidente de Auto?"

  "$SCRIPT_DIR/generate-guide.sh" "accidente-zona-construccion" "es" \
    "Accidente en Zona de Construcción"

  "$SCRIPT_DIR/generate-guide.sh" "atropello-peaton" "es" \
    "Atropello de Peatón — Derechos y Compensación"

  "$SCRIPT_DIR/generate-guide.sh" "accidente-auto-alquilado" "es" \
    "Accidente en Auto Alquilado (Rental Car)"

  "$SCRIPT_DIR/generate-guide.sh" "primera-oferta-aseguradora" "es" \
    "¿Debo Aceptar la Primera Oferta de la Aseguradora?"

  "$SCRIPT_DIR/generate-guide.sh" "accidente-multiple-vehiculos" "es" \
    "Accidente con Múltiples Vehículos — ¿Quién Paga?"

  echo ""
  echo "Guides generation complete."
  echo ""
}

# ============================================================
# NEW INJURY PAGES TO GENERATE (Spanish)
# slug, locale, title, injury-type, low, mid, high, recovery-months
# ============================================================
generate_injuries() {
  echo "--- GENERATING INJURY PAGES (ES) ---"

  "$SCRIPT_DIR/generate-injury.sh" "hernia-de-disco" "es" \
    "Hernia de Disco por Accidente de Auto" "herniated-disc" \
    10000 50000 200000 12

  "$SCRIPT_DIR/generate-injury.sh" "lesion-de-rodilla" "es" \
    "Lesión de Rodilla por Accidente de Auto" "knee-injury" \
    8000 40000 150000 8

  "$SCRIPT_DIR/generate-injury.sh" "lesion-de-hombro" "es" \
    "Lesión de Hombro por Accidente de Auto" "shoulder-injury" \
    10000 45000 175000 9

  "$SCRIPT_DIR/generate-injury.sh" "costillas-rotas" "es" \
    "Costillas Rotas por Accidente de Auto" "broken-ribs" \
    8000 35000 120000 6

  "$SCRIPT_DIR/generate-injury.sh" "quemaduras" "es" \
    "Quemaduras por Accidente de Auto" "burns" \
    15000 75000 500000 12

  "$SCRIPT_DIR/generate-injury.sh" "lesion-de-cuello" "es" \
    "Lesión de Cuello por Accidente de Auto" "neck-injury" \
    8000 35000 150000 6

  "$SCRIPT_DIR/generate-injury.sh" "lesion-de-tobillo" "es" \
    "Lesión de Tobillo o Pie por Accidente de Auto" "ankle-foot-injury" \
    5000 25000 100000 6

  "$SCRIPT_DIR/generate-injury.sh" "cicatrices-desfiguracion" "es" \
    "Cicatrices y Desfiguración por Accidente de Auto" "scarring-disfigurement" \
    10000 50000 300000 12

  "$SCRIPT_DIR/generate-injury.sh" "ptsd-trauma-emocional" "es" \
    "PTSD y Trauma Emocional por Accidente de Auto" "ptsd-emotional-trauma" \
    5000 30000 150000 12

  "$SCRIPT_DIR/generate-injury.sh" "lesion-de-muneca-mano" "es" \
    "Lesión de Muñeca o Mano por Accidente de Auto" "wrist-hand-injury" \
    5000 25000 100000 6

  "$SCRIPT_DIR/generate-injury.sh" "lesion-medula-espinal" "es" \
    "Lesión de Médula Espinal por Accidente de Auto" "spinal-cord-injury" \
    100000 500000 5000000 24

  "$SCRIPT_DIR/generate-injury.sh" "lesion-de-cadera" "es" \
    "Lesión de Cadera por Accidente de Auto" "hip-injury" \
    15000 60000 250000 12

  echo ""
  echo "Injury pages generation complete."
  echo ""
}

# ============================================================
# MISSING ENGLISH STATE PAGES
# These exist in ES but not in EN
# ============================================================
generate_states() {
  echo "--- GENERATING MISSING EN STATE PAGES ---"

  # States that exist in ES but not EN
  "$SCRIPT_DIR/generate-state.sh" "connecticut" "en" "Connecticut" "CT" false 2 10000 70000 400000
  "$SCRIPT_DIR/generate-state.sh" "utah" "en" "Utah" "UT" false 4 8000 60000 350000
  "$SCRIPT_DIR/generate-state.sh" "kansas" "en" "Kansas" "KS" false 2 8000 55000 300000
  "$SCRIPT_DIR/generate-state.sh" "indiana" "en" "Indiana" "IN" false 2 8000 55000 300000
  "$SCRIPT_DIR/generate-state.sh" "wisconsin" "en" "Wisconsin" "WI" false 3 8000 60000 350000
  "$SCRIPT_DIR/generate-state.sh" "oklahoma" "en" "Oklahoma" "OK" false 2 7000 50000 300000
  "$SCRIPT_DIR/generate-state.sh" "carolina-del-sur" "en" "South Carolina" "SC" false 3 8000 55000 300000
  "$SCRIPT_DIR/generate-state.sh" "luisiana" "en" "Louisiana" "LA" false 1 10000 65000 400000
  "$SCRIPT_DIR/generate-state.sh" "minnesota" "en" "Minnesota" "MN" true 6 10000 65000 400000
  "$SCRIPT_DIR/generate-state.sh" "iowa" "en" "Iowa" "IA" false 2 7000 50000 300000
  "$SCRIPT_DIR/generate-state.sh" "nebraska" "en" "Nebraska" "NE" false 4 7000 50000 300000
  "$SCRIPT_DIR/generate-state.sh" "rhode-island" "en" "Rhode Island" "RI" false 3 8000 55000 300000

  echo ""
  echo "English state pages generation complete."
  echo ""
}

# ============================================================
# RUN SELECTED TYPE
# ============================================================
case "$TYPE" in
  guides)
    generate_guides
    ;;
  injuries)
    generate_injuries
    ;;
  states)
    generate_states
    ;;
  all)
    generate_guides
    generate_injuries
    generate_states
    ;;
  *)
    echo "Usage: $0 [guides|injuries|states|all]"
    exit 1
    ;;
esac

echo "================================================"
echo "DONE. Run 'npm run build' to verify all pages compile."
echo "Then commit and deploy."
echo "================================================"
