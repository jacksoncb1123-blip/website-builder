# LumaSpace — Galaxy Projector Store

A single-file, high-converting Shopify-style **one-product dropshipping store** for
"LumaSpace," a galaxy/sunset projection lamp brand targeting TikTok-driven impulse
buyers (16–30). Dark, dreamy, premium aesthetic — purple / deep blue / amber.

Everything (HTML + CSS + JS) lives in **`index.html`**. No frameworks, no build step,
no dependencies beyond Google Fonts (Space Grotesk + Inter).

## Run / preview

```
python3 -m http.server 8000   # then open http://localhost:8000/lumaspace/
```
or just open `lumaspace/index.html` in a browser.

## What's inside

**Hero** — full-screen animated gradient (purple → deep blue → black), starfield,
floating ⭐ 4.9/5 social-proof badge, "Transform Any Room in Seconds" headline, and
the primary CTA.

**Product / buy block** — sticky add-to-cart bar, daily-resetting countdown timer,
color swatches, BOGO quantity pricing (2nd unit 50% off), live stock line, trust
badges, secure-checkout payment icons (Visa/Mastercard/PayPal/Apple Pay).

**Conversion sections** — before/after room transformation slider (drag to reveal),
7 icon feature bullets, animated stat counters, "As seen on TikTok" trust strip,
photo review cards with star ratings, 5+ FAQ accordion, 30-day money-back guarantee
band, "X people viewing right now" live counter, sticky BOGO top banner.

**Checkout flow UI** — 3-step modal (shipping → payment → confirmation) with
client-side validation, card-number formatting, payment-method switcher, and a
confetti success state. It's a UI prototype — no real payment is processed.

## Notes

- Mobile-first (90% of traffic assumed to be TikTok mobile); responsive at
  375 / 768 / 1024 / 1440.
- All animation respects `prefers-reduced-motion`.
- Countdown counts down to local midnight, so urgency refreshes daily.
- Icons are inline SVG; payment "logos" are lightweight SVG text marks (swap for
  official brand SVGs before going live).
- Copy/figures (review counts, stock, viewers) are marketing placeholders — wire the
  checkout to a real backend (Shopify, Stripe, etc.) before taking live orders.
