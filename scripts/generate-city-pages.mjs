import fs from "fs";
import path from "path";

/**
 * Generate Spanish city-level landing pages from DataForSEO-validated data in
 * city-pages-data.json. Targets "abogado de accidentes en [ciudad]" searches.
 *
 * Each page uses real per-city data (Hispanic population, county, court, local
 * highways, state insurance law) so it is unique, not thin/templated content.
 *
 *   node scripts/generate-city-pages.mjs
 */

const ROOT = process.cwd();
const DATA = JSON.parse(fs.readFileSync(path.join(ROOT, "city-pages-data.json"), "utf-8"));
const OUT_DIR = path.join(ROOT, "content", "es", "ciudades");
const TODAY = "2026-06-23";

const STATE_CODE_TO_SLUG = {
  TX: "texas", FL: "florida", CA: "california", IL: "illinois",
  NV: "nevada", CO: "colorado", AZ: "arizona", GA: "georgia",
};

// Injury pages to cross-link (must exist in content/es/lesiones).
const INJURY_LINKS = [
  { title: "Latigazo cervical (whiplash)", href: "/es/lesiones/latigazo-cervical" },
  { title: "Lesiones de espalda", href: "/es/lesiones/lesiones-de-espalda" },
];

function esc(s) {
  return String(s).replace(/"/g, '\\"');
}

function moneyList(min) {
  return min || "según la ley estatal";
}

function faultSection(city, state, isNoFault, stateSlug) {
  if (isNoFault) {
    return `## ${state} es un estado "sin culpa" (no-fault): qué significa para tu caso

${state} funciona con un sistema "sin culpa". Eso quiere decir que, después de un accidente en ${city}, tu propio seguro paga primero tus gastos médicos a través de la cobertura PIP, sin importar quién causó el choque. Para lesiones graves, todavía puedes presentar un reclamo contra el conductor culpable.

Los plazos importan: en ${state} tienes un tiempo limitado para actuar (ver la tabla de arriba). Si lo dejas pasar, pierdes el derecho a reclamar. Revisa los detalles completos en nuestra [guía de compensación en ${state}](/es/estados/${stateSlug}).`;
  }
  return `## ${state} es un estado "con culpa" (at-fault): qué significa para tu caso

${state} es un estado "con culpa", así que el conductor responsable del accidente paga los daños. Si el otro conductor tuvo la culpa del choque en ${city}, puedes reclamar directamente contra su seguro por tus gastos médicos, salario perdido y dolor y sufrimiento.

Hay reglas de negligencia que pueden reducir tu compensación si tuviste parte de la culpa, y un plazo límite para presentar tu caso (ver la tabla de arriba). Conoce los detalles en nuestra [guía de compensación en ${state}](/es/estados/${stateSlug}).`;
}

function buildPage(city, siblings) {
  const {
    city: name, state, state_code, slug, keyword,
    hispanic_population, hispanic_pct, county, court,
    accident_roads = [], is_no_fault, min_liability,
    statute_of_limitations_years, neighborhoods = [],
  } = city;

  const stateSlug = STATE_CODE_TO_SLUG[state_code];
  const popStr = hispanic_population ? hispanic_population.toLocaleString("en-US") : null;
  const hoodStr = neighborhoods.slice(0, 3).join(", ");
  const roadsList = accident_roads.map((r) => `- **${r}**: una de las vías con más choques de la zona.`).join("\n");

  const kw = keyword; // e.g. "abogado de accidentes en houston"
  const title = `Abogado de Accidentes en ${name} | Consulta Gratis en Español`;
  const description = `¿Buscas un ${kw}? Conecta gratis con abogados bilingües en ${name}, ${state_code}. No pagas nada hasta que ganes. Sin importar tu estatus migratorio.`.slice(0, 158);

  const keywords = [
    kw,
    `abogados de accidentes ${name.toLowerCase()}`,
    `abogado de accidentes de auto en ${name.toLowerCase()}`,
    `accidente de auto ${name.toLowerCase()}`,
    `abogado de accidentes cerca de mi ${name.toLowerCase()}`,
  ];

  const siblingLinks = siblings
    .map((s) => `- [Abogado de accidentes en ${s.city}](/es/ciudades/${s.slug})`)
    .join("\n");

  const fm = `---
title: "${esc(title)}"
description: "${esc(description)}"
slug: "${slug}"
locale: "es"
pillar: "city"
city: "${esc(name)}"
state: "${esc(state)}"
stateCode: "${state_code}"
parentStateSlug: "${stateSlug}"
isNoFault: ${is_no_fault ? "true" : "false"}
statuteOfLimitations: ${statute_of_limitations_years ?? 2}
keywords: [${keywords.map((k) => `"${esc(k)}"`).join(", ")}]
author:
  name: "Equipo de MVACompensation"
  credential: "Equipo Editorial"
publishedAt: "${TODAY}"
lastUpdated: "${TODAY}"
schema: "Article"
---`;

  const intro = `Si tuviste un accidente de auto en ${name} y necesitas un **${kw}** que hable tu idioma, estás en el lugar correcto. ${name} tiene una de las comunidades hispanas más grandes de ${state}${popStr ? `, con aproximadamente ${popStr} residentes latinos (${hispanic_pct}% de la población)` : ""}. En barrios como ${hoodStr || "toda la ciudad"}, miles de familias enfrentan cada año las consecuencias de un choque sin saber que tienen derecho a una compensación.`;

  const intro2 = `Te ayudamos a conectar, **gratis y en español**, con abogados de accidentes en ${name} que trabajan por contingencia: **no pagas nada hasta que ganes tu caso**. Y tu estatus migratorio no afecta tu derecho a reclamar.`;

  const dataTable = `## Datos clave para víctimas de accidentes en ${name}

| Dato | Detalle |
|------|---------|
| Condado | ${county || "Ver tribunal local"} |
| Dónde se presenta el caso | ${court || "Tribunal civil del condado"} |
| Tipo de estado | ${is_no_fault ? "Sin culpa (no-fault)" : "Con culpa (at-fault)"} |
| Plazo para reclamar | ${statute_of_limitations_years ?? 2} años desde el accidente |
| Seguro mínimo en ${state} | ${moneyList(min_liability)} |
| Costo de la evaluación | Gratis, sin compromiso |`;

  const steps = `## Qué hacer después de un accidente de auto en ${name}

1. **Llama al 911 y pide un reporte policial.** Es la prueba más importante de tu caso.
2. **Busca atención médica de inmediato**, aunque te sientas bien. Algunas lesiones aparecen días después.
3. **Toma fotos** del lugar, los vehículos, tus lesiones y las placas.
4. **No firmes nada** ni aceptes la primera oferta del seguro sin asesoría.
5. **Habla con un abogado bilingüe** antes de dar declaraciones a la aseguradora del otro conductor.

Actuar rápido protege tu salud y tu caso. En ${name}, el plazo para reclamar es de ${statute_of_limitations_years ?? 2} años, pero la evidencia se pierde mucho antes.`;

  const roads = accident_roads.length
    ? `## Las vías con más accidentes en ${name}

Gran parte de los choques en ${name} ocurren en estas vías de alto tráfico:

${roadsList}

Si tu accidente ocurrió en una de estas carreteras, un abogado local conoce los patrones de tráfico y los puntos de mayor riesgo, lo que ayuda a construir tu caso.`
    : "";

  const fault = faultSection(name, state, is_no_fault, stateSlug);

  const withWithout = `## Con abogado vs. sin abogado: la diferencia en tu compensación

| | Sin abogado | Con abogado |
|--|------------|------------|
| Oferta inicial del seguro | Baja, a veces el 10% del valor real | Negociada al alza |
| Conoces el valor real de tu caso | Casi nunca | Sí |
| Quién maneja el papeleo | Tú | El abogado |
| Costo inicial | $0 | $0 (cobran solo si ganas) |

Los estudios de la industria muestran que las víctimas representadas por un abogado suelen recibir compensaciones mucho mayores, incluso después de los honorarios.`;

  const howWeHelp = `## Cómo te conectamos con un abogado en ${name}

No somos un bufete. Somos un servicio gratuito que te conecta con abogados de accidentes con licencia en ${name} que:

- **Hablan español** y entienden a la comunidad hispana
- **Trabajan por contingencia**: no pagas nada por adelantado
- **Atienden sin importar tu estatus migratorio**

Solo contesta unas preguntas rápidas y te conectamos con un abogado que puede revisar tu caso hoy mismo.`;

  const faqs = `## Preguntas frecuentes

**¿Cuánto cobra un abogado de accidentes en ${name}?**
La mayoría trabaja por contingencia: no cobran nada por adelantado y solo reciben un porcentaje si ganan tu caso. La evaluación es gratis.

**¿Puedo reclamar si no tengo papeles?**
Sí. Tu estatus migratorio no afecta tu derecho a buscar compensación por un accidente de auto en ${state}.

**¿Cuánto tiempo tengo para presentar mi caso en ${name}?**
En ${state} el plazo (estatuto de limitaciones) es de ${statute_of_limitations_years ?? 2} años desde la fecha del accidente. Mientras antes empieces, mejor.

**¿Qué pasa si el otro conductor no tenía seguro?**
Todavía puedes tener opciones, como tu propia cobertura para conductores sin seguro. Un abogado en ${name} puede revisar tu póliza.`;

  const cta = `[Toma nuestra evaluación gratis](/es/cuestionario?source=city_${slug}_es&state=${state_code}) y te conectamos con un abogado de accidentes en ${name} que habla español. Sin costo, sin compromiso.`;

  const related = `### Sigue leyendo

${siblingLinks ? siblingLinks + "\n" : ""}- [Guía de compensación en ${state}](/es/estados/${stateSlug})
- [Calcula el valor de tu caso](/es/calculadora)`;

  const disclaimer = `*Última actualización: ${TODAY}. Esta página es información general, no asesoría legal, y no garantiza ningún resultado. Las leyes y los montos varían según tu caso. Consulta con un abogado con licencia en ${state}.*`;

  return [
    fm, "",
    intro, "",
    intro2, "",
    dataTable, "",
    steps, "",
    roads, roads ? "" : null,
    fault, "",
    withWithout, "",
    howWeHelp, "",
    faqs, "",
    cta, "",
    related, "",
    disclaimer, "",
  ].filter((x) => x !== null).join("\n");
}

// Group cities by state for sibling links.
const byState = {};
for (const c of DATA) (byState[c.state_code] ||= []).push(c);

// Fallback siblings (highest-volume cities) for single-city states.
const topCities = [...DATA].sort((a, b) => b.search_volume - a.search_volume);

function siblingsFor(city) {
  const same = (byState[city.state_code] || []).filter((c) => c.slug !== city.slug);
  let sibs = same.slice(0, 2);
  if (sibs.length < 2) {
    for (const c of topCities) {
      if (c.slug !== city.slug && !sibs.find((s) => s.slug === c.slug)) sibs.push(c);
      if (sibs.length >= 2) break;
    }
  }
  return sibs.slice(0, 2);
}

fs.mkdirSync(OUT_DIR, { recursive: true });
let written = 0;
for (const city of DATA) {
  const mdx = buildPage(city, siblingsFor(city));
  fs.writeFileSync(path.join(OUT_DIR, `${city.slug}.mdx`), mdx);
  written++;
}
console.log(`Generated ${written} city pages in content/es/ciudades/`);
