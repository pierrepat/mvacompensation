import fs from "fs";
import path from "path";
import { GoogleAuth } from "google-auth-library";

/**
 * GSC URL Inspection audit — reproduces the "Why pages aren't indexed" report
 * per URL, since the Page Indexing report itself has no API.
 *
 * URL universe = live sitemap + every page GSC has shown in search (16 months)
 * + any extra URLs passed via --urls file.txt (one per line).
 *
 * Usage:
 *   node scripts/gsc-inspect.mjs                 # full audit -> gsc-inspection.json
 *   node scripts/gsc-inspect.mjs --urls list.txt # only these URLs
 *   node scripts/gsc-inspect.mjs --only-problems # print only non-indexed URLs
 */

const KEY_FILE = path.resolve("gsc-service-account.json");
const SITE = "sc-domain:mvacompensation.com";
const SITEMAP_URL = "https://mvacompensation.com/sitemap.xml";
const OUT_FILE = path.resolve("gsc-inspection.json");
const CONCURRENCY = 5; // quota: 600/min, 2000/day

const argv = process.argv.slice(2);
const urlsFileIdx = argv.indexOf("--urls");
const urlsFile = urlsFileIdx !== -1 ? argv[urlsFileIdx + 1] : null;
const onlyProblems = argv.includes("--only-problems");

function fmtDate(d) {
  return d.toISOString().split("T")[0];
}

async function fetchSitemapUrls() {
  const res = await fetch(SITEMAP_URL);
  const xml = await res.text();
  const urls = new Set();
  const re = /<loc>([^<]+)<\/loc>/g;
  let m;
  while ((m = re.exec(xml)) !== null) urls.add(m[1].trim());
  return [...urls];
}

async function fetchSearchPages(client) {
  const end = new Date();
  const start = new Date();
  start.setUTCDate(start.getUTCDate() - 480);
  const url = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/searchAnalytics/query`;
  const pages = new Set();
  let startRow = 0;
  for (;;) {
    const r = await client.request({
      url,
      method: "POST",
      data: {
        startDate: fmtDate(start),
        endDate: fmtDate(end),
        dimensions: ["page"],
        rowLimit: 5000,
        startRow,
      },
    });
    const rows = r.data.rows || [];
    rows.forEach((row) => pages.add(row.keys[0]));
    if (rows.length < 5000) break;
    startRow += 5000;
  }
  return [...pages];
}

async function inspect(client, url) {
  try {
    const r = await client.request({
      url: "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect",
      method: "POST",
      data: { inspectionUrl: url, siteUrl: SITE, languageCode: "en-US" },
    });
    const idx = r.data.inspectionResult?.indexStatusResult || {};
    return {
      url,
      verdict: idx.verdict,
      coverageState: idx.coverageState,
      robotsTxtState: idx.robotsTxtState,
      indexingState: idx.indexingState,
      pageFetchState: idx.pageFetchState,
      lastCrawlTime: idx.lastCrawlTime,
      googleCanonical: idx.googleCanonical,
      userCanonical: idx.userCanonical,
      crawledAs: idx.crawledAs,
      sitemap: idx.sitemap,
      referringUrls: idx.referringUrls,
    };
  } catch (err) {
    return {
      url,
      error: err.response?.data?.error?.message || err.message,
    };
  }
}

async function main() {
  if (!fs.existsSync(KEY_FILE)) {
    console.error("Missing gsc-service-account.json in project root.");
    process.exit(1);
  }
  const auth = new GoogleAuth({
    keyFile: KEY_FILE,
    scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
  });
  const client = await auth.getClient();

  let urls;
  if (urlsFile) {
    urls = fs
      .readFileSync(urlsFile, "utf8")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
  } else {
    const [sm, sp] = await Promise.all([fetchSitemapUrls(), fetchSearchPages(client)]);
    console.log(`Sitemap URLs: ${sm.length}, search-analytics pages: ${sp.length}`);
    urls = [...new Set([...sm, ...sp])];
  }
  console.log(`Inspecting ${urls.length} URLs...\n`);

  const results = [];
  let i = 0;
  const worker = async () => {
    while (i < urls.length) {
      const url = urls[i++];
      const res = await inspect(client, url);
      results.push(res);
      if (!onlyProblems || res.verdict !== "PASS") {
        console.log(
          `${(res.verdict || "ERR").padEnd(8)} ${(res.coverageState || res.error || "").padEnd(45)} ${url.replace("https://mvacompensation.com", "")}`
        );
      }
    }
  };
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  results.sort((a, b) => a.url.localeCompare(b.url));
  fs.writeFileSync(
    OUT_FILE,
    JSON.stringify({ inspectedAt: new Date().toISOString(), site: SITE, results }, null, 2)
  );

  const byState = {};
  for (const r of results) {
    const k = r.coverageState || r.error || "unknown";
    byState[k] = (byState[k] || 0) + 1;
  }
  console.log("\nSummary:");
  Object.entries(byState)
    .sort((a, b) => b[1] - a[1])
    .forEach(([k, v]) => console.log(`  ${String(v).padStart(4)}  ${k}`));
  console.log(`\nSaved -> ${OUT_FILE}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
