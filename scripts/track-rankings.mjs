import fs from "fs";
import path from "path";

const calendarPath = path.resolve("content-calendar.json");
const calendar = JSON.parse(fs.readFileSync(calendarPath, "utf-8"));
const auth = calendar.config.dataforseo_base64_auth;

const trackKeywords = [
  { keyword: "abogado accidente de carro", lang: "es" },
  { keyword: "compensacion por accidente de carro", lang: "es" },
  { keyword: "accidente de carro sin papeles", lang: "es" },
  { keyword: "cuanto pagan por accidente de carro", lang: "es" },
  { keyword: "abogado de accidente en houston", lang: "es" },
  { keyword: "que hacer despues de un accidente de carro", lang: "es" },
  { keyword: "abogado de accidente en español", lang: "es" },
  { keyword: "car accident settlement", lang: "en" },
  { keyword: "car accident no insurance", lang: "en" },
  { keyword: "spanish speaking car accident lawyer", lang: "en" },
];

const results = [];

for (const { keyword, lang } of trackKeywords) {
  try {
    const res = await fetch(
      "https://api.dataforseo.com/v3/serp/google/organic/live/advanced",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          {
            keyword,
            location_code: 2840,
            language_code: lang,
            device: "mobile",
            depth: 100,
          },
        ]),
      }
    );
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
    }
    const data = await res.json();
    const items = data.tasks?.[0]?.result?.[0]?.items || [];
    const ourResult = items.find(
      (i) =>
        i.type === "organic" &&
        i.domain === "mvacompensation.com"
    );
    results.push({
      keyword,
      lang,
      position: ourResult?.rank_absolute || null,
      url: ourResult?.url || null,
      date: new Date().toISOString().split("T")[0],
    });
  } catch (err) {
    results.push({
      keyword,
      lang,
      position: null,
      url: null,
      error: true,
      errorMessage: err.message,
    });
  }
}

const rankingFile = path.resolve("ranking-history.json");
let history = [];
if (fs.existsSync(rankingFile)) {
  history = JSON.parse(fs.readFileSync(rankingFile, "utf-8"));
}
history.push({
  date: new Date().toISOString().split("T")[0],
  results,
});
fs.writeFileSync(rankingFile, JSON.stringify(history, null, 2));

const failed = results.filter((r) => r.error);

console.log("=== RANKING CHECK ===");
for (const r of results) {
  const pos = r.error
    ? `CHECK FAILED — ${r.errorMessage}`
    : r.position
      ? `#${r.position}`
      : "not ranking";
  console.log(`  ${r.keyword} (${r.lang}): ${pos}`);
}

if (failed.length) {
  console.error(
    `\n${failed.length}/${results.length} checks failed — these are NOT "not ranking" results.`
  );
  process.exitCode = 1;
}
