import fs from "fs";
import path from "path";
import { GoogleAuth } from "google-auth-library";

const SCOPES = ["https://www.googleapis.com/auth/indexing"];
const INDEXING_API = "https://indexing.googleapis.com/v3/urlNotifications:publish";
const SITEMAP_URL = "https://mvacompensation.com/sitemap.xml";
const KEY_FILE = path.resolve("gsc-service-account.json");
const BATCH_DELAY_MS = 1000;

if (!fs.existsSync(KEY_FILE)) {
  console.error(`
  ╔══════════════════════════════════════════════════════════════╗
  ║  GSC Service Account key not found!                         ║
  ║                                                             ║
  ║  To set up auto-indexing:                                   ║
  ║                                                             ║
  ║  1. Go to console.cloud.google.com/iam-admin/serviceaccounts║
  ║  2. Create a new service account                            ║
  ║  3. Create a JSON key and download it                       ║
  ║  4. Save it as: gsc-service-account.json (in project root)  ║
  ║  5. In Google Search Console → Settings → Users             ║
  ║     Add the service account email as OWNER                  ║
  ║  6. Run this script again: node scripts/gsc-index.mjs       ║
  ╚══════════════════════════════════════════════════════════════╝
  `);
  process.exit(1);
}

async function getAuthClient() {
  const auth = new GoogleAuth({
    keyFile: KEY_FILE,
    scopes: SCOPES,
  });
  return auth.getClient();
}

async function fetchSitemapUrls() {
  const res = await fetch(SITEMAP_URL);
  const xml = await res.text();
  const urls = [];
  const regex = /<loc>([^<]+)<\/loc>/g;
  let match;
  while ((match = regex.exec(xml)) !== null) {
    const url = match[1].trim();
    if (url.startsWith("https://mvacompensation.com/") && !url.endsWith(".xml")) {
      urls.push(url);
    }
  }
  return [...new Set(urls)];
}

async function submitUrl(client, url) {
  try {
    const res = await client.request({
      url: INDEXING_API,
      method: "POST",
      data: {
        url,
        type: "URL_UPDATED",
      },
    });
    return { url, status: res.status, ok: true };
  } catch (err) {
    return {
      url,
      status: err.response?.status || 0,
      error: err.response?.data?.error?.message || err.message,
      ok: false,
    };
  }
}

async function main() {
  console.log("Fetching sitemap URLs...");
  const urls = await fetchSitemapUrls();
  console.log(`Found ${urls.length} URLs in sitemap\n`);

  console.log("Authenticating with Google...");
  const client = await getAuthClient();
  console.log("Authenticated!\n");

  let submitted = 0;
  let failed = 0;

  for (const url of urls) {
    const result = await submitUrl(client, url);
    if (result.ok) {
      submitted++;
      const shortUrl = url.replace("https://mvacompensation.com", "");
      console.log(`  ✓ ${shortUrl}`);
    } else {
      failed++;
      const shortUrl = url.replace("https://mvacompensation.com", "");
      console.log(`  ✗ ${shortUrl} — ${result.error}`);
    }
    await new Promise((r) => setTimeout(r, BATCH_DELAY_MS));
  }

  console.log(`\nDone! Submitted: ${submitted}, Failed: ${failed}`);
}

main().catch(console.error);
