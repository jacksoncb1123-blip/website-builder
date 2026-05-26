# CLAUDE.md

Project context for AI assistants (Claude) working in this repository.

## What this is

A single-page **restaurant / business website** — "Saffron & Sage" — built as a
static site with **plain HTML, CSS, and JavaScript**. No framework, no build
step, no dependencies. It can be opened directly in a browser or served as
static files.

## Structure

```
website-builder/
├── index.html          # Entry point / all page markup (stays at root)
├── CLAUDE.md           # This file
├── css/
│   └── styles.css      # All styles; design tokens live in :root at the top
├── js/
│   └── script.js       # All interactions (IIFE, vanilla JS)
└── assets/
    └── images/         # Put photos / image assets here
```

When adding new asset types, create sibling folders under the relevant
directory (e.g. `assets/fonts/`, `assets/icons/`).

## Conventions

- **No build tooling.** Don't introduce npm, bundlers, or frameworks unless
  explicitly asked. Keep it openable via `file://` or a simple static server.
- **CSS:** colors, fonts, spacing, and shadows are defined as custom properties
  in `:root` at the top of `css/styles.css`. Change those tokens to re-theme
  the whole site rather than hardcoding values.
- **JS:** everything is wrapped in one IIFE in `js/script.js`. All animations
  must respect `prefers-reduced-motion` (there's a `reduceMotion` flag).
- **Accessibility:** keep the skip link, focus styles, ARIA states on the
  nav/menu tabs/form, and reduced-motion handling intact.
- **Paths in `index.html`** reference `css/styles.css` and `js/script.js` —
  update them if files move.

## Run / preview

```
python3 -m http.server 8000   # then open http://localhost:8000
```
or just open `index.html` in a browser.

## Sections in the page

Header/nav · Hero · About · Menu (tabbed) · Gallery · Reservation form
(client-side validation only — does not submit anywhere yet) · Visit (hours /
location / contact) · Footer · Back-to-top button.

## Known TODOs / not yet wired

- The reservation form validates and shows success, but does **not** send
  submissions anywhere. Hook it to a form backend (e.g. Formspree) to make it
  live.
- Gallery and About use CSS gradient placeholders; swap in real photos from
  `assets/images/`.
