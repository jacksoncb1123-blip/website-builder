# One Up Supplements — Hydrogen Storefront

A dark, premium, athletic storefront for **One Up Supplements** built on
**Shopify Hydrogen** (React Router 7 + Vite) with **Tailwind CSS** and
**Framer Motion**. Deploys to **Shopify Oxygen**.

- Dark luxury aesthetic — near-black surfaces, electric‑green (`volt`) accent
- Display font **Syne**, body font **Manrope** (Google Fonts)
- Connected to the Shopify **Storefront API** (products, collections, cart)
- Working cart drawer (add / update / remove / discount), sorting + filters,
  product pages with an image gallery and a **Supplement Facts** panel
- Scroll reveals, parallax hero, animated product cards, page‑load brand intro

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
```

With no credentials configured, the site runs against Shopify's public demo
catalog (**mock.shop**) so you can see the design immediately. Cart and
checkout require a real store (see below).

Useful scripts:

```bash
npm run dev          # local dev server (mini-oxygen) + codegen
npm run build        # production build
npm run preview      # build, then serve the production build locally
npm run typecheck    # react-router typegen + tsc
npm run codegen      # regenerate GraphQL + route types
```

## Connect your Shopify store

1. `cp .env.example .env`
2. Fill in `PUBLIC_STORE_DOMAIN` (`your-store.myshopify.com`),
   `PUBLIC_STOREFRONT_API_TOKEN`, and a random `SESSION_SECRET`.
   `.env.example` documents exactly where to find each value in Shopify Admin.
3. Restart `npm run dev`.

Or let the Hydrogen CLI do it for you:

```bash
npx shopify hydrogen link
npx shopify hydrogen env pull
```

`.env` is git‑ignored — your real token never gets committed.

## Adding products

The storefront automatically displays whatever you add in Shopify Admin —
products (creatine, beetroot, mullein, postbiotics, …), collections, images,
and variants. No code changes needed.

### Supplement Facts panel

Each product page renders a "Supplement Facts" panel from **product metafields**
(namespace `custom`). Add these in Admin → product → Metafields:

| Key                | Type                  | Example |
| ------------------ | --------------------- | ------- |
| `supplement_facts` | Multi‑line text       | one nutrient per line, pipe‑delimited: `Creatine Monohydrate\|5 g\|*` |
| `serving_size`     | Single‑line text      | `1 scoop (5 g)` |
| `directions`       | Single‑line text      | `Mix 1 scoop with 8–10 oz water daily.` |

If a product has no `supplement_facts` metafield, the panel shows a friendly
placeholder instead.

## Deployment

### Shopify Oxygen (recommended)

Oxygen is the first‑class target for Hydrogen and is wired up out of the box.

```bash
npx shopify hydrogen link        # link to your Hydrogen sales channel
npx shopify hydrogen deploy      # deploy to Oxygen
```

Set the same environment variables in the Hydrogen channel settings (or push
them with `npx shopify hydrogen env push`). CI deploys via the standard
Hydrogen GitHub Action / Oxygen tokens.

### Vercel / Node hosts

This project uses the Oxygen worker runtime (`@shopify/hydrogen` +
`virtual:react-router/server-build` in `server.ts`). To deploy on Vercel or
another Node host you must swap to a Node server adapter (React Router's Node
preset) and provide a Node entry — the UI/routes/queries port over unchanged.
Oxygen is the supported path; use it unless you have a specific reason not to.

## Project structure

```
app/
  components/   UI + commerce components (Hero, ProductCard, Cart*, Aside, …)
  routes/       _index, products.$handle, collections.*, cart, about, search, …
  lib/          context, session, fragments, variants
  styles/       app.css (Tailwind + design tokens)
  root.tsx      document shell, fonts, analytics provider, brand intro
server.ts       Oxygen worker entry
tailwind.config.js   brand colors / fonts / animations
.env.example    every environment variable, documented
```

Design tokens (colors, fonts, shadows, animations) live in
`tailwind.config.js` — re‑theme there rather than hardcoding values.
