# LumaSpace — Shopify store runbook

Everything to take your imported galaxy-projector product to a fully branded,
live homepage. Store: **`hppzqh-vt.myshopify.com`**. Brand: dark/dreamy, purple
`#7c3aed` + amber `#f59e0b` on near-black `#0a0a0f`, Space Grotesk + Inter.

> Why some steps are scripted and some are clicks: the script handles everything
> the Shopify Admin API can do reliably (product fields, price, theme files,
> homepage layout). Two things — the **storefront password** and the **hero
> image** — have no dependable API and take 20 seconds each in the admin.

```
shopify-lumaspace/
├── RUNBOOK.md              ← you are here
├── product-copy.md         ← paste-ready title + description (also in the script)
├── sections/               ← the 8 self-contained Liquid sections
├── templates/index.json    ← homepage layout (all 8 sections, in order)
└── scripts/setup-store.mjs ← does product + theme upload + homepage wiring
```

---

## Step 0 — Get an Admin API token (one time, ~2 min)

1. Shopify admin → **Settings → Apps and sales channels → Develop apps**.
2. **Create an app** → name it "LumaSpace Setup".
3. **Configure Admin API scopes** → enable: `write_products`, `read_products`,
   `write_themes`, `read_themes`.
4. **Install app** → reveal the **Admin API access token** (`shpat_…`). Copy it.

---

## Steps 1–2 & 4–5 & 7 (the API parts) — run the script

From this folder, with Node 18+:

```bash
export SHOPIFY_STORE="hppzqh-vt.myshopify.com"
export SHOPIFY_ADMIN_TOKEN="shpat_xxxxxxxxxxxxxxxx"

node scripts/setup-store.mjs --list      # see your products + main theme
node scripts/setup-store.mjs --dry-run   # preview, writes nothing
node scripts/setup-store.mjs             # apply
```

What it does:
- **Step 2 (product setup):** finds your imported product (most recent — or pass
  `--product=<id-or-handle>` from the `--list` output), sets the branded **title**
  and **description** (bold opener, 6 emoji benefit bullets, guarantee line),
  sets **price `$39.99` / compare-at `$79.99`**, and marks it **Active / published**.
- **Step 4 (sections):** uploads all **8** `sections/*.liquid` files to your live theme.
- **Step 5 (homepage):** uploads `templates/index.json` so the homepage shows the
  8 sections **in order** (Hero → Trust bar → Problem/Solution → Features → How It
  Works → Reviews → Bundle → FAQ), replacing the default theme sections. It also
  **injects your real product URL** into every CTA button (Step 7 link check ✓).

> Want different copy or price? Edit the constants at the top of
> `setup-store.mjs` (`TITLE`, `PRICE`, `COMPARE_AT`, `BODY_HTML`) and re-run.

---

## Step 3 — Brand the store (admin clicks)

The **homepage sections are already brand-styled** (colors + fonts baked into each
section's CSS — nothing to set there). The remaining store-level branding:

1. **Store name:** Settings → **General** → *Store name* → `LumaSpace`.
2. **Currency / details:** Settings → General → set your currency, address, contact.
3. **Theme name color/fonts:** the sections override the theme, so this is optional.
   If you want the header/footer to match, Theme → **Customize → Theme settings →
   Colors/Typography**: background `#0a0a0f`, text `#f8fafc`, accent `#7c3aed`,
   heading font **Space Grotesk**, body font **Inter**.
4. **Remove the password** (lets customers in): Online Store → **Preferences** →
   untick **"Restrict access to visitors with a password."** → Save.
   *(Do this when you're ready to go live — it's the on/off switch for the store.)*

---

## Step 6 — Set the hero image (theme editor)

1. Online Store → Themes → **Customize**.
2. Make sure you're on the **Home page** template.
3. Click the **LumaSpace Hero** section → **Product image** → upload/select a clean
   product shot (square works best; the price bubble sits bottom-right).
4. *(Optional)* add a bundle photo in the **LumaSpace Bundle** section the same way.
5. **Save.**

---

## Step 7 — Polish & verify

- [ ] **Button links** point to the product — the script set them to
      `/products/<your-handle>`. In the editor, click a CTA → confirm the link.
- [ ] **Store name** shows as `LumaSpace` in the header, browser tab, and checkout.
- [ ] **Price `$39.99` / compare-at `$79.99`** show with the strike-through; inventory
      is set how you want (tracked number, or tracking off for dropshipping).
- [ ] **Password is OFF** (Online Store → Preferences) so customers can reach it.
- [ ] Preview on **mobile** — 90% of TikTok traffic; every section is mobile-first.

---

## Manual alternative (no script)

If you'd rather not run the script: paste `product-copy.md` into the product,
then Online Store → Themes → **Edit code** → under `sections/` click **Add a new
section** for each of the 8 files and paste its contents, then replace
`templates/index.json` with the one in `templates/` (swap each `__PRODUCT_URL__`
for `/products/<your-handle>`). The script just does all of that for you.
