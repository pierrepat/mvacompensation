import fs from "fs";
import path from "path";

const host = "mvacompensation.com";
const key = "mva2026indexnow";
const contentDir = path.resolve("content");
const outDir = path.resolve("out");

fs.writeFileSync(path.join(outDir, `${key}.txt`), key);

function listMdxSlugs(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(".mdx", ""));
}

const urls = [];

for (const locale of ["es", "en"]) {
  for (const section of ["guias", "lesiones", "estados"]) {
    const slugs = listMdxSlugs(path.join(contentDir, locale, section));
    for (const slug of slugs) {
      urls.push(`https://${host}/${locale}/${section}/${slug}`);
    }
  }
  urls.push(`https://${host}/${locale}`);
}

urls.push(`https://${host}/es/quiz`);
urls.push(`https://${host}/en/quiz`);
urls.push(`https://${host}/en/calculator/settlement-estimator`);

const payload = {
  host,
  key,
  keyLocation: `https://${host}/${key}.txt`,
  urlList: urls.slice(0, 10000),
};

console.log(`Submitting ${urls.length} URLs to IndexNow...`);

try {
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });
  console.log(`IndexNow response: ${res.status} ${res.statusText}`);
} catch (err) {
  console.error(`IndexNow failed: ${err.message}`);
}

try {
  const res = await fetch(
    `https://www.google.com/ping?sitemap=https://${host}/sitemap.xml`
  );
  console.log(`Google sitemap ping: ${res.status}`);
} catch (err) {
  console.error(`Google ping failed: ${err.message}`);
}
