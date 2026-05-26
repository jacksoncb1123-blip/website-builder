---
name: Heritage Club Aesthetic
colors:
  surface: '#f6f9ff'
  surface-dim: '#c7ddf0'
  surface-bright: '#f6f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#ebf5ff'
  surface-container: '#e0f0ff'
  surface-container-high: '#d6ebfe'
  surface-container-highest: '#d0e5f9'
  on-surface: '#071d2c'
  on-surface-variant: '#424843'
  inverse-surface: '#1e3241'
  inverse-on-surface: '#e6f2ff'
  outline: '#727973'
  outline-variant: '#c1c8c2'
  surface-tint: '#456553'
  primary: '#032416'
  on-primary: '#ffffff'
  primary-container: '#1a3a2a'
  on-primary-container: '#82a48f'
  inverse-primary: '#abcfb8'
  secondary: '#755b00'
  on-secondary: '#ffffff'
  secondary-container: '#fed977'
  on-secondary-container: '#785d00'
  tertiary: '#201f1a'
  on-tertiary: '#ffffff'
  tertiary-container: '#36342f'
  on-tertiary-container: '#a09c95'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c7ebd4'
  primary-fixed-dim: '#abcfb8'
  on-primary-fixed: '#002113'
  on-primary-fixed-variant: '#2d4d3c'
  secondary-fixed: '#ffe08f'
  secondary-fixed-dim: '#e6c364'
  on-secondary-fixed: '#241a00'
  on-secondary-fixed-variant: '#584400'
  tertiary-fixed: '#e7e2da'
  tertiary-fixed-dim: '#cac6be'
  on-tertiary-fixed: '#1d1c17'
  on-tertiary-fixed-variant: '#494741'
  background: '#f6f9ff'
  on-background: '#071d2c'
  surface-variant: '#d0e5f9'
  heritage-green: '#1A3A2A'
  clubhouse-gold: '#C9A84C'
  par-white: '#F5F0E8'
  deep-navy: '#223645'
  grass-accent: '#8EB359'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  section-gap: 80px
---

## Brand & Style

This design system targets an upscale demographic seeking a premium, indoor golf experience. The brand personality is "The Modern Clubhouse"—balancing the exclusivity of a private club with the accessibility of a modern social venue. It evokes a sense of prestige, precision, and warmth.

The design style is **Corporate Modern with a Moody Boutique twist**. It leverages deep, saturated tones and high-contrast accents to create a cinematic atmosphere. While the structure is clean and systematic, the use of serif typography and gold accents introduces an editorial, luxurious feel. The UI should prioritize high-quality photography of the facility and social spaces, treated with slightly desaturated, warm-toned filters to maintain the "moody but welcoming" aesthetic.

## Colors

The palette is anchored by **Heritage Green**, a deep forest hue that provides a sophisticated backdrop. **Par White** serves as the primary surface color, offering a softer, more premium feel than pure white. 

**Clubhouse Gold** is reserved strictly for high-priority calls to action and decorative line work, ensuring it retains its impact as a signal of quality. **Deep Navy** is used for secondary text and structural elements to provide grounding contrast without the harshness of black. A legacy **Grass Accent** is maintained for utility-driven elements like success states or specific golf-related data visualizations.

## Typography

Typography relies on a high-contrast pairing: **Playfair Display** provides an authoritative, traditional serif presence for headlines, while **Inter** ensures maximum legibility for body content and technical data.

Headlines should be set with tighter letter spacing to emphasize their "editorial" weight. Labels and small navigation elements use Inter with increased letter spacing and uppercase styling to create a distinct functional hierarchy. On mobile devices, display sizes are scaled down to ensure headlines fit within the viewport while maintaining their bold character.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy on desktop to maintain a curated, controlled appearance similar to a high-end magazine. Content is centered within a 1280px container using a 12-column grid.

Spacing is generous, utilizing an 8px base unit. Large section gaps (80px+) are used to separate different service offerings (Simulators, Bar, Events), allowing the high-quality imagery to "breathe." On mobile, margins reduce to 16px, and the grid collapses to a single-column flow, prioritizing verticality and ease of thumb-navigation for booking.

## Elevation & Depth

Depth is conveyed through **Tonal Layers** rather than heavy shadows. The background uses Par White (#F5F0E8), while interactive surfaces like cards or menus use a pure white (#FFFFFF) with a very subtle, extra-diffused shadow (4% opacity Heritage Green) to lift them slightly.

To reinforce the premium feel, use **Gold Line Work**—1px strokes of Clubhouse Gold—to separate sections or frame featured content. Subtle textures, such as a very faint paper grain or linen pattern, can be applied to large green background sections to prevent them from feeling flat and digital.

## Shapes

The shape language is **Soft (0.25rem)**. This slight rounding takes the edge off the design, making it feel approachable and modern without losing the precision of a high-end brand. 

Interactive elements like buttons and input fields use the 0.25rem radius. Secondary elements like image containers or review cards can scale up to 0.5rem (rounded-lg) to create a softer, friendlier look for community-focused content. Circular shapes are reserved exclusively for icons and avatar images.

## Components

### Buttons
Primary buttons are solid Heritage Green with Par White text. The "Golden Action" button used for "Book a Bay" uses a solid Clubhouse Gold background with Heritage Green text for maximum visibility. All buttons use a subtle hover state where the background color deepens by 10%.

### Navigation
The navigation is a **Sticky Header** with a frosted Par White background (backdrop-blur). It features the logo centered or left-aligned, with navigation links in Inter (Label-MD). A "Book Now" Golden Action button is always present in the far right of the header.

### Review Cards
Cards feature a white background, 1px Heritage Green border at 10% opacity, and a 5-star rating system using Clubhouse Gold icons. The reviewer's name is set in Inter Bold, while the testimonial is in Inter Regular.

### Input Fields
Forms use a clean, minimalist style. Labels are placed above the field in Label-SM. The fields themselves have a 1px border in Deep Navy (20% opacity), which transitions to Clubhouse Gold upon focus.

### Info Sections
Structured sections for "How it Works" or "Pricing" use alternating backgrounds of Par White and Heritage Green. When Heritage Green is used as a section background, all text switches to Par White, and accent lines switch to Clubhouse Gold.