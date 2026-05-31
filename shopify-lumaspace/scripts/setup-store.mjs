#!/usr/bin/env node
/* ============================================================
   LumaSpace — Shopify store setup
   Automates the API-doable steps for the galaxy-projector store:

     1. Finds your imported product (most recent, or by handle/id) and
        sets the branded title, description, price + compare-at, status.
     2. Uploads the 8 LumaSpace sections to your LIVE (main) theme.
     3. Uploads templates/index.json (homepage layout) to that theme,
        injecting the real product URL into every button.

   Runs on YOUR machine against YOUR store (it can't run from a sandbox —
   it needs your store credentials).

   ---- ONE-TIME SETUP ----
   1. Shopify admin → Settings → Apps and sales channels → "Develop apps"
      → "Create an app" (e.g. "LumaSpace Setup").
   2. Configure Admin API scopes:  write_products, read_products,
      write_themes, read_themes
   3. Install the app → reveal the "Admin API access token" (shpat_...).
   4. Run it (Node 18+; uses global fetch):

        export SHOPIFY_STORE="hppzqh-vt.myshopify.com"
        export SHOPIFY_ADMIN_TOKEN="shpat_xxxxxxxxxxxxxxxx"

        node setup-store.mjs --dry-run     # preview, writes nothing
        node setup-store.mjs               # apply everything
        node setup-store.mjs --list        # just list products & themes
        node setup-store.mjs --product=<id-or-handle>   # target a specific product

   Notes:
   - Removing the storefront password and choosing the hero image are done in
     the admin (see RUNBOOK.md) — there's no reliable REST endpoint for them.
   - Re-running is safe: it updates the same product/theme assets in place.
   ============================================================ */

import { readFile, readdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const STORE = process.env.SHOPIFY_STORE;
const TOKEN = process.env.SHOPIFY_ADMIN_TOKEN;
const API_VERSION = process.env.SHOPIFY_API_VERSION || "2024-10";

const ARGS = process.argv.slice(2);
const DRY = ARGS.includes("--dry-run");
const LIST_ONLY = ARGS.includes("--list");
const PRODUCT_ARG = (ARGS.find((a) => a.startsWith("--product=")) || "").split("=")[1] || process.env.SHOPIFY_PRODUCT || "";

// ---- Editable product details -------------------------------------------
const TITLE = "LumaSpace™ Galaxy Star Projector — 360° Night Light & Ambient Lamp";
const HANDLE = "lumaspace-galaxy-projector";
const PRICE = "39.99";
const COMPARE_AT = "79.99";
const BODY_HTML = [
  "<p><strong>Turn any room into a galaxy in seconds — the projector with 38M+ TikTok views.</strong></p>",
  "<p>LumaSpace floats a drifting night sky across your walls and ceiling, so your space goes from plain to <em>portal</em> with one tap. Soft nebula colors, gentle 360° motion, and a whisper-quiet motor make it perfect for bedrooms, dorms, parties, and content that actually stops the scroll.</p>",
  "<ul>",
  "<li>🌌 <strong>360° rotating galaxy</strong> — a moving starfield + nebula wraps every wall and the ceiling</li>",
  "<li>🎨 <strong>14 color modes</strong> — galaxy, sunset, aurora, ocean and more for any vibe</li>",
  "<li>🤫 <strong>Whisper-quiet motor</strong> — under 25dB, so it never interrupts sleep or filming</li>",
  "<li>🔌 <strong>USB powered</strong> — plug into any charger, laptop or power bank; no batteries</li>",
  "<li>📱 <strong>Remote &amp; app control</strong> — brightness, speed, color and a sleep timer from bed</li>",
  "<li>🎵 <strong>Music-reactive sync</strong> — a built-in mic pulses the stars to your music</li>",
  "</ul>",
  "<p>🛡️ <strong>Try it risk-free for 30 nights.</strong> If LumaSpace doesn't transform your space, we'll refund every cent — you only risk falling in love with your room. Free tracked shipping · ships in 2–3 days.</p>",
].join("\n");
// --------------------------------------------------------------------------

const SECTION_FILES = [
  "lumaspace-hero.liquid",
  "lumaspace-trust-bar.liquid",
  "lumaspace-problem-solution.liquid",
  "lumaspace-features.liquid",
  "lumaspace-how-it-works.liquid",
  "lumaspace-reviews.liquid",
  "lumaspace-bundle.liquid",
  "lumaspace-faq.liquid",
];

function die(msg) { console.error("\n✗ " + msg + "\n"); process.exit(1); }
if (!STORE || !TOKEN) {
  die('Missing credentials. Set them first:\n' +
    '    export SHOPIFY_STORE="hppzqh-vt.myshopify.com"\n' +
    '    export SHOPIFY_ADMIN_TOKEN="shpat_..."');
}

async function api(path, method = "GET", body) {
  const url = `https://${STORE}/admin/api/${API_VERSION}/${path}`;
  if (DRY && method !== "GET") { console.log(`  [dry-run] ${method} ${path}`); return { dryRun: true }; }
  const res = await fetch(url, {
    method,
    headers: { "X-Shopify-Access-Token": TOKEN, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data; try { data = JSON.parse(text); } catch { data = text; }
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status}\n${text}`);
  await new Promise((r) => setTimeout(r, 600)); // be gentle with rate limits
  return data;
}

async function findProduct() {
  const { products } = await api("products.json?limit=50&order=created_at+desc");
  if (!products || !products.length) die("No products found. Import your product first, then re-run.");
  if (PRODUCT_ARG) {
    const p = products.find((x) => String(x.id) === PRODUCT_ARG || x.handle === PRODUCT_ARG);
    if (!p) die(`No product matched "${PRODUCT_ARG}". Use --list to see options.`);
    return p;
  }
  return products[0]; // most recent
}

async function getMainTheme() {
  const { themes } = await api("themes.json");
  const main = themes.find((t) => t.role === "main");
  if (!main) die("Could not find the published (main) theme.");
  return main;
}

async function putAsset(themeId, key, value) {
  return api(`themes/${themeId}/assets.json`, "PUT", { asset: { key, value } });
}

async function main() {
  console.log(`\nLumaSpace setup → ${STORE}${DRY ? "  (DRY RUN)" : ""}\n`);

  const product = await findProduct();
  const theme = await getMainTheme();

  if (LIST_ONLY) {
    const { products } = await api("products.json?limit=50&order=created_at+desc");
    console.log("Products (newest first):");
    products.forEach((p) => console.log(`  ${p.id}  ${p.handle}  — ${p.title}`));
    console.log(`\nMain theme: ${theme.name} (id ${theme.id})\n`);
    return;
  }

  console.log(`Target product: ${product.title}  (id ${product.id}, handle "${product.handle}")`);
  console.log(`Target theme:   ${theme.name}  (id ${theme.id})\n`);

  // 1) Update product core fields + publish
  console.log("• Updating product title, description, status…");
  await api(`products/${product.id}.json`, "PUT", {
    product: {
      id: product.id,
      title: TITLE,
      body_html: BODY_HTML,
      status: "active",
      published_scope: "global",
    },
  });

  // 2) Price + compare-at on every variant
  console.log("• Setting price + compare-at on variants…");
  for (const v of product.variants) {
    await api(`variants/${v.id}.json`, "PUT", {
      variant: { id: v.id, price: PRICE, compare_at_price: COMPARE_AT },
    });
  }

  // Determine the live product URL (prefer existing handle so links never 404)
  const productUrl = `/products/${product.handle || HANDLE}`;

  // 3) Upload section files
  console.log("• Uploading 8 LumaSpace sections to the live theme…");
  for (const file of SECTION_FILES) {
    const value = await readFile(join(ROOT, "sections", file), "utf8");
    await putAsset(theme.id, `sections/${file}`, value);
    console.log(`    ✓ sections/${file}`);
  }

  // 4) Upload homepage template with the real product URL injected
  console.log("• Uploading templates/index.json (homepage layout)…");
  let indexJson = await readFile(join(ROOT, "templates", "index.json"), "utf8");
  indexJson = indexJson.split("__PRODUCT_URL__").join(productUrl);
  await putAsset(theme.id, "templates/index.json", indexJson);
  console.log(`    ✓ buttons → ${productUrl}`);

  console.log("\n✓ Done." + (DRY ? " (dry run — nothing was written)" : ""));
  console.log("\nNext (in the admin — see RUNBOOK.md):");
  console.log("  • Theme editor → LumaSpace Hero → set the product image");
  console.log("  • Online Store → Preferences → turn OFF the password");
  console.log("  • Confirm the product is on all the sales channels you want\n");
}

main().catch((e) => die(e.message));
