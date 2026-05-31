# LumaSpace — Browser install handoff

Hand this to a browser-controlling assistant (Claude in Chrome) to finish the
install. It summarizes what's already built and the exact steps left.

## Store & product facts
- **Store admin:** https://admin.shopify.com/store/hppzqh-vt  (`hppzqh-vt.myshopify.com`)
- **Product:** galaxy/sunset star projector, already **imported** by the owner.
- **Set on the product:** title, description, **price $39.99 / compare-at $79.99**, status **Active**.
- **Product handle:** confirm in admin; homepage CTAs should link to `/products/<handle>`.

## Brand identity (already baked into every section's CSS)
- Background `#0a0a0f` · cards `#12121a` · purple `#7c3aed` · amber `#f59e0b` · text `#f8fafc`
- Fonts: **Space Grotesk** (headings) + **Inter** (body), imported via `@import` in each section.
- Vibe: dark, dreamy, premium — TikTok galaxy projector, not generic AliExpress.

## What's built and where the code lives
GitHub repo **`jacksoncb1123-blip/website-builder`**, branch
**`claude/lumaspace-dropshipping-store-oWJd1`**, folder **`shopify-lumaspace/`**.

8 self-contained Liquid sections (own CSS + HTML + `{% schema %}` + preset), under
`shopify-lumaspace/sections/`. Raw URL pattern to copy each file's code:
```
https://raw.githubusercontent.com/jacksoncb1123-blip/website-builder/claude/lumaspace-dropshipping-store-oWJd1/shopify-lumaspace/sections/<FILE>
```
| # | File (= section type) | What it is |
|---|------------------------|------------|
| 1 | `lumaspace-hero.liquid` | Split hero: eyebrow, headline (highlighted word), subheadline, CTA, trust row, image picker + was/now/save price bubble |
| 2 | `lumaspace-trust-bar.liquid` | 5 horizontal icon + label benefits |
| 3 | `lumaspace-problem-solution.liquid` | Before/after cards + 3 numbered pain points |
| 4 | `lumaspace-features.liquid` | 6 feature cards, 3-col grid |
| 5 | `lumaspace-how-it-works.liquid` | 4 numbered steps |
| 6 | `lumaspace-reviews.liquid` | 3 review cards: stars, quote, name, verified badge |
| 7 | `lumaspace-bundle.liquid` | 2-pack upsell, was/bundle price, savings badge, CTA |
| 8 | `lumaspace-faq.liquid` | 6-question accordion |

Also in the folder: `templates/index.json` (homepage layout, all 8 in order),
`scripts/setup-store.mjs` (Admin-API uploader), `product-copy.md`, `RUNBOOK.md`.

---

## Steps left to do (in the browser)

### A. Install the 8 section files
`Online Store → Themes → Edit code`. For EACH file above, in the `sections/` folder:
1. Click **Add a new section**, name it exactly as the filename **without** `.liquid`
   (e.g. `lumaspace-hero`), press Enter.
2. Click into the editor, **Ctrl+A** to select the default content.
3. Write the file's code to the clipboard, e.g.:
   ```js
   navigator.clipboard.writeText(`<PASTE THE FILE'S FULL CODE HERE>`).then(() => { document.title = 'OK'; });
   ```
4. **Ctrl+V** to replace, then **Ctrl+S** to save.
Repeat for all 8.

### B. Build the homepage (order matters)
`Online Store → Themes → Customize` (Home template):
1. Remove any leftover default sections (image banner, featured collection, etc.).
2. **Add section** → search **"LumaSpace"** → add these **in this order**:
   Hero → Trust Bar → Problem/Solution → Features → How It Works → Reviews → Bundle → FAQ.
   *(Or replace `templates/index.json` via Edit code with the repo's version — it
   wires all 8 automatically; swap `__PRODUCT_URL__` for `/products/<handle>`.)*

### C. Set the hero image
Theme editor → **LumaSpace Hero** → **Product image** → upload a clean product shot. Save.
(Optional: add a bundle image in the **LumaSpace Bundle** section.)

### D. Brand & go-live (admin)
1. Settings → **General** → Store name = `LumaSpace`; set currency + details.
2. Confirm product: **$39.99 / $79.99**, Active, on the **Online Store** channel.
3. Check every CTA links to `/products/<handle>`.
4. Online Store → **Preferences** → turn **OFF** the storefront password when ready to launch.
5. Preview on **mobile** (90% of TikTok traffic).

---

## Open decisions for the owner
- **Fonts:** existing sections use **Space Grotesk + Inter**. A later request asked for
  **Playfair Display + DM Sans** with serif headlines — that version is **not built yet**
  (needs product name, brand name + colors, store URL, price/compare-at, and handle).
  Decide whether to ship the current set or rebuild with the serif spec.
- **Price** ($39.99/$79.99) is a default — change in `setup-store.mjs` or the admin if desired.
