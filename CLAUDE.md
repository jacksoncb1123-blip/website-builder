# CLAUDE.md

Project context for AI assistants (Claude) working in this repository.

## What this is

A single-page **website for "Eagle 5 Golf"** — an indoor golf-simulator venue in
Columbia / Howard County, MD. Built as a **static site with plain HTML, CSS, and
JavaScript**. No framework, no build step, no dependencies. Open it directly in a
browser or serve it as static files.

The design follows the Stitch **"Heritage Club Aesthetic"** system (see
`design/DESIGN.md`): a premium "Modern Clubhouse" look — deep Heritage Green,
Clubhouse Gold accents, Par White surfaces, Playfair Display + Inter type.

## Structure

```
website-builder/
├── index.html          # Entry point / all page markup (stays at root)
├── CLAUDE.md           # This file
├── css/
│   └── styles.css      # All styles; design tokens live in :root at the top
├── js/
│   └── script.js       # All interactions (IIFE, vanilla JS)
├── design/
│   ├── DESIGN.md       # Source Stitch design system (colors, type, components)
│   └── stitch-screen.png  # Reference screenshot of the intended layout
└── assets/
    └── images/         # Put real facility photos here
```

## Conventions

- **No build tooling.** Don't introduce npm, bundlers, or frameworks unless asked.
  Keep it openable via `file://` or a simple static server.
- **CSS tokens:** brand colors, fonts, radii, and shadows are CSS custom
  properties in `:root` at the top of `css/styles.css`, mirroring `design/DESIGN.md`.
  Re-theme by changing those tokens rather than hardcoding values.
  Key brand colors: Heritage Green `#1A3A2A`, Clubhouse Gold `#C9A84C`,
  Par White `#F5F0E8`, Deep Navy `#223645`, Grass Accent `#8EB359`.
- **Fonts:** Playfair Display for headlines, Inter for body/UI (loaded from Google Fonts).
- **JS:** everything is wrapped in one IIFE in `js/script.js`. All animations
  respect `prefers-reduced-motion` (there's a `reduceMotion` flag).
- **Accessibility:** keep the skip link, focus styles, ARIA states on nav/form,
  and reduced-motion handling intact.

## Run / preview

```
python3 -m http.server 8000   # then open http://localhost:8000
```
or just open `index.html` in a browser.

## Sections in the page

Header/nav · Hero · Feature cards (Simulator Tech / Food & Drinks / Location) ·
The Modern Clubhouse (facility) · Booking (form + tee times + visit) · Reviews ·
Footer · Back-to-top button.

## Interactions in script.js

Sticky header state, mobile nav toggle, button ripple, scroll-spy nav
highlighting, reveal-on-scroll, "8+ bays" count-up, hero parallax, back-to-top,
and client-side booking-form validation.

## Known TODOs / not yet wired

- The booking form validates and shows success, but does **not** send submissions
  anywhere. Hook it to a form backend (e.g. Formspree) or a real booking system.
- Hero, clubhouse image, and feature visuals use CSS gradient placeholders styled
  to match the brand. Swap in real facility photos from `assets/images/`
  (e.g. set `.hero-bg { background-image: url("../assets/images/hero.jpg"); }`).
- Footer Privacy Policy / Terms links and social links are placeholders (`#`).
