import fs from "fs";
import path from "path";

const base = "https://mvacompensation.com";
const contentDir = path.resolve("content");
const outDir = path.resolve("out");

function extractTitle(filePath) {
  const text = fs.readFileSync(filePath, "utf-8");
  const match = text.match(/title:\s*"(.+?)"/);
  return match ? match[1] : path.basename(filePath, ".mdx");
}

function listMdx(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .sort()
    .map((f) => ({
      slug: f.replace(".mdx", ""),
      title: extractTitle(path.join(dir, f)),
    }));
}

const esGuias = listMdx(path.join(contentDir, "es/guias"));
const esLesiones = listMdx(path.join(contentDir, "es/lesiones"));
const esEstados = listMdx(path.join(contentDir, "es/estados"));
const enGuias = listMdx(path.join(contentDir, "en/guias"));
const enLesiones = listMdx(path.join(contentDir, "en/lesiones"));
const enEstados = listMdx(path.join(contentDir, "en/estados"));

const lines = [
  "# MVA Compensation",
  "",
  "> Free bilingual (Spanish/English) resource helping car accident victims in the US understand their legal rights, settlement values, and find bilingual attorneys. We serve the 45M+ Spanish-speaking population with content about personal injury law, state-by-state guides, and injury-specific compensation data.",
  "",
  "## Key Topics",
  "",
  "- Car accident compensation amounts by injury type",
  "- State-by-state accident laws, statutes of limitations, and fault rules",
  "- Rights of undocumented immigrants after car accidents",
  "- Insurance claims process in Spanish",
  "- Settlement calculator and free case evaluation",
  "",
];

function addSection(title, items, pathPrefix) {
  lines.push(`## ${title}`, "");
  for (const { slug, title: t } of items) {
    lines.push(`- [${t}](${base}${pathPrefix}/${slug})`);
  }
  lines.push("");
}

addSection("Spanish Guides (Guías)", esGuias, "/es/guias");
addSection("Spanish Injury Guides (Lesiones)", esLesiones, "/es/lesiones");
addSection("Spanish State Guides (Estados)", esEstados, "/es/estados");
addSection("English Guides", enGuias, "/en/guias");
addSection("English Injury Guides", enLesiones, "/en/lesiones");
addSection("English State Guides", enEstados, "/en/estados");

lines.push(
  "## Tools",
  "",
  `- [Free Settlement Calculator](${base}/en/calculator/settlement-estimator)`,
  `- [Evaluación Gratis / Free Case Evaluation](${base}/es/quiz)`,
  ""
);

const output = lines.join("\n");
fs.writeFileSync(path.join(outDir, "llms.txt"), output);
console.log(
  `Generated llms.txt (${esGuias.length + esLesiones.length + esEstados.length + enGuias.length + enLesiones.length + enEstados.length} pages indexed)`
);
