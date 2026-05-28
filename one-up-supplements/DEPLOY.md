# Deploying One Up Supplements to Shopify Oxygen

This storefront is a **Shopify Hydrogen** app. You don't paste it into the
theme editor — you **deploy** it to **Oxygen** (Shopify's free hosting for
Hydrogen) and it becomes your live storefront, connected to your store's
products, inventory, and checkout.

> Run all commands from inside the `one-up-supplements/` folder.

## Prerequisites
- Node.js 18+ installed locally (`node -v`)
- A Shopify store you own (a paid plan or a dev store both work)
- This repo cloned to your machine

## 1. Install dependencies
```bash
cd one-up-supplements
npm install
```

## 2. Link the app to your store
```bash
npx shopify hydrogen link
```
This opens your browser to log in and pick your store. It creates a **Hydrogen
sales channel** in your store and connects this project to it.

## 3. Pull your store's environment variables
```bash
npx shopify hydrogen env pull
```
This writes `PUBLIC_STORE_DOMAIN`, `PUBLIC_STOREFRONT_API_TOKEN`, etc. into a
local `.env`. (You can also set them by hand — see `.env.example`.)
Make sure `SESSION_SECRET` is set to any long random string.

## 4. Preview locally before shipping
```bash
npm run dev          # http://localhost:3000 — should now show YOUR products
```
Click through the home, shop, a product page, and the cart drawer. If products
show up here, the deploy will work.

## 5. Deploy to Oxygen
```bash
npx shopify hydrogen deploy
```
This builds and uploads the app to Oxygen and prints a live `*.myshopify.dev`
deployment URL. That URL is your storefront.

## 6. Push production environment variables
So the deployed site has its secrets:
```bash
npx shopify hydrogen env push
```
(Or set them in Shopify Admin → your Hydrogen sales channel → Storefront
settings → Environment variables. `SESSION_SECRET` must be set there too.)

## 7. (Optional) Connect your custom domain
In Shopify Admin → the Hydrogen sales channel → **Storefronts**, attach your
domain so the storefront serves from `oneupsupplements.com` instead of the
`*.myshopify.dev` URL.

## 8. (Optional) Auto-deploy on every push
In the Hydrogen channel settings you can connect this GitHub repo so each push
to your branch deploys automatically (Oxygen creates a deploy token + GitHub
Action for you).

---

## Adding your products
Add products (creatine, beetroot, mullein, postbiotics, …) and collections in
Shopify Admin as normal — the storefront displays them automatically, no code
changes. For the **Supplement Facts** panel on product pages, add `custom`
metafields per the table in `README.md`.

## Troubleshooting
- **Blank product grids / "No products yet":** the API isn't reachable or
  credentials are wrong. Re-run `npx shopify hydrogen env pull` and confirm
  `PUBLIC_STORE_DOMAIN` + `PUBLIC_STOREFRONT_API_TOKEN` in `.env`.
- **`SESSION_SECRET environment variable is not set`:** set `SESSION_SECRET`
  in `.env` (local) and via `hydrogen env push` / admin (production).
- **Cart/checkout not working on `mock.shop`:** expected — the demo catalog is
  read-only. Link a real store to enable cart + checkout.
- **Want a non-Oxygen host (Vercel/Node):** see the "Vercel / Node hosts"
  note in `README.md`; it requires swapping to a Node server adapter.
