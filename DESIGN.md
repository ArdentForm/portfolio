---
name: Craig Ardent Portfolio
description: A Swiss-disciplined portfolio for a UI/UX designer — warm-grounded neutrals, single charged accent, typography as the primary instrument.
colors:
  brand: "oklch(62% 0.22 35)"
  blue: "oklch(46% 0.27 265)"
  acid: "oklch(90% 0.19 115)"
  ink: "oklch(9% 0.007 50)"
  void: "oklch(5% 0.004 50)"
  surface-950: "oklch(13% 0.009 50)"
  surface-900: "oklch(17% 0.010 50)"
  surface-800: "oklch(23% 0.012 50)"
  muted: "oklch(58% 0.012 50)"
  surface-200: "oklch(88% 0.008 50)"
  surface-100: "oklch(93% 0.006 55)"
  surface-50: "oklch(97% 0.004 60)"
  surface-white: "oklch(99% 0.003 60)"
typography:
  display:
    fontFamily: "PP Monument Normal, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 6vw, 4.5rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "PP Monument Normal, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 4vw, 2.5rem)"
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  title:
    fontFamily: "PP Monument Normal, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  body:
    fontFamily: "PP Monument Normal, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "IBM Plex Mono, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    letterSpacing: "0.12em"
rounded:
  sharp: "2px"
  sm: "4px"
  md: "8px"
  xl: "12px"
  2xl: "16px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "40px"
  xl: "48px"
  section: "96px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.surface-white}"
    rounded: "{rounded.md}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.surface-800}"
  button-primary-dark:
    backgroundColor: "{colors.surface-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "12px 24px"
  button-primary-dark-hover:
    backgroundColor: "{colors.surface-100}"
  post-card:
    backgroundColor: "{colors.surface-200}"
    rounded: "{rounded.2xl}"
    padding: "16px"
  tag-chip:
    textColor: "{colors.muted}"
    typography: "label"
---

# Design System: Craig Ardent Portfolio

## 1. Overview

**Creative North Star: "The Swiss Proof"**

This system is a demonstration before it is a presentation. Every layout decision is a proof of design competence: the grid holds because the designer understands grids, the type hierarchy is exact because the designer understands hierarchy, the restraint is deliberate because the designer understands ornament. There is no element here that does not also mean something.

The palette is near-monochromatic. Warm ink grounds everything; the single orange accent activates sparingly; every neutral carries a warm tilt that makes the near-black feel considered rather than default-digital. Screen-blue grays are prohibited. The typographic pairing, geometric Monument Normal against technical IBM Plex Mono, encodes the dual nature of the work: form thinking and systems thinking, operating in concert.

Nothing competes with the work. Navigation disappears into the background. Every component steps back to let portfolio pieces occupy the frame. If an element cannot justify its presence, it is absent.

**Key Characteristics:**
- Warm-tinted neutrals throughout; never screen-blue or charcoal-gray
- Single Precision Signal (orange) used on ≤10% of any surface
- Geometric sans paired with technical mono; two faces, no exceptions
- Flat surfaces at rest; depth only for structural separation
- Motion used only for state acknowledgement; never choreography or decoration

## 2. Colors: The Warm Ground Palette

Near-monochromatic with a single charged accent. The warm shift moves every neutral toward amber, making the system feel analogue and deliberate rather than default-digital.

### Primary
- **Precision Signal** (`{colors.brand}`, approx `#ff5500`): The only chromatic activation in the system. Active nav underlines, focus rings, the brand dot in tag chips. Never decorative, never used as a background fill. Its power comes entirely from its rarity.

### Secondary
- **Technical Depth** (`{colors.blue}`, approx `#0052ff`): Reserved for contexts where a second accent is structurally necessary and sits adjacent to the Precision Signal. Not a general-purpose accent; confirm its necessity before using.

### Tertiary
- **Acid Proof** (`{colors.acid}`, approx `#cdea19`): The sharpest contrast in the system. Used only when differentiation from both orange and blue is simultaneously required. If you're reaching for this, question the information architecture first.

### Neutral
- **Warm Ink** (`{colors.ink}`, approx `#13100d`): Default text color and button fills. Replaces all prior screen-blue near-blacks.
- **Warm Void** (`{colors.void}`, approx `#0c0a07`): Device frames and absolute maximum contrast. Rarely needed beyond the device mockup component.
- **Warm Surface 950** (`{colors.surface-950}`, approx `#1d1812`): Dark mode page background.
- **Warm Surface 900** (`{colors.surface-900}`, approx `#251e15`): Dark mode navigation and mobile overlay.
- **Warm Surface 800** (`{colors.surface-800}`, approx `#34291a`): Dark mode card interior.
- **Warm Muted** (`{colors.muted}`, approx `#7a6d60`): Excerpts, timestamps, supporting text. The second text tier.
- **Warm Surface 200** (`{colors.surface-200}`, approx `#e0dad2`): Light mode card background (outer shell).
- **Warm Surface 100** (`{colors.surface-100}`, approx `#ebe8e3`): Light mode card interior.
- **Warm Surface 50** (`{colors.surface-50}`, approx `#f5f3f0`): Light mode page background.
- **Warm White** (`{colors.surface-white}`, approx `#faf8f6`): Navigation bar and component fills in light mode.

### Named Rules

**The One Signal Rule.** The Precision Signal appears on ≤10% of any surface. It marks active state, focus, and brand identity. It does not fill backgrounds, decorate cards, or announce sections. Its rarity is the point.

**The Warm Ground Rule.** Every neutral leans warm (OKLCH hue 45–60). The cool-blue grays in the existing codebase (`#0d0e12`, `#13141b`, `gray-950`) are prohibited in new work. When in doubt, shift warmer.

## 3. Typography

**Display Font:** PP Monument Normal (weights 100–900, CSS variable `--font-monument`)
**Label/Mono Font:** IBM Plex Mono (weight 400, CSS variable `--font-ibm-plex-mono`)

**Character:** Monument Normal is geometric and uncommitted — it makes no emotional claim of its own, which is exactly right for a system built around showing work. IBM Plex Mono is precise and technical; restricted to labels, timestamps, and controls, it reads as "system" without demanding attention.

### Hierarchy
- **Display** (weight 700–900, `clamp(2.5rem, 6vw, 4.5rem)`, line-height 1.05, tracking `−0.02em`): Hero statements and primary page titles. One per page.
- **Headline** (weight 500, `clamp(1.75rem, 4vw, 2.5rem)`, line-height 1.15, tracking `−0.02em`): Section headings and CTA headings.
- **Title** (weight 500, `1.25rem`, line-height 1.3, tracking `−0.01em`): Post titles, card headings, component labels.
- **Body** (weight 400, `1rem`, line-height 1.65): Prose and descriptions. Max line length 65–75ch.
- **Label** (weight 400, `0.75rem`, IBM Plex Mono, letter-spacing `0.12em`, uppercase): Tags, timestamps, navigation controls, metadata. Mono-only.

### Named Rules

**The Swiss Type Rule.** Hierarchy is built through scale and weight alone. Color is never used to signal importance in text. The one exception: Precision Signal on active nav links marks location, not emphasis — that is structural.

**The Mono Reserve Rule.** IBM Plex Mono is restricted to labels, timestamps, buttons, and UI controls. It does not appear in prose headings or article body text.

## 4. Elevation

This system is flat by default. Surfaces at rest carry no shadows. Depth is conveyed through background-color contrast between tonal steps (surface-50 vs surface-200 in light mode; surface-800 vs surface-950 in dark mode). No decorative layering; no ambient floating.

The one shadow token (`shadow-layer`: `0 35px 60px -15px rgba(0, 0, 0, 0.30)`) is reserved for structural separation: when an image or device mockup needs to read as physically lifted from the page. It is not for cards, tooltips, dropdown menus, or navigation.

Hover states use `filter: brightness()` rather than z-lift shadows, keeping feedback tactile without adding visual noise.

### Named Rules

**The Flat-By-Default Rule.** No shadow at rest. Brightness-shift on hover (`brightness(0.95)` light / `brightness(1.25)` dark, 200ms). `shadow-layer` only for structural image and device mockup separation.

## 5. Components

### Buttons

Clean and direct. The button is a command.

- **Shape:** Gently curved (8px radius)
- **Primary (light):** Warm Ink background, Warm White text; IBM Plex Mono, 0.875rem; `padding: 12px 24px`
- **Primary hover:** Shifts to Warm Surface 800; `transition: background 200ms ease-out`
- **Active:** `transform: scale(0.95) translateY(1px)`; 200ms
- **Primary (dark):** Warm White background, Warm Ink text; hover shifts to Warm Surface 100
- **Focus:** 2px Precision Signal outline, 2px offset

### Tag Chips

- **Style:** Warm Muted text, IBM Plex Mono, uppercase, tracking-widest; no background, no border
- **Brand dot:** 6px diameter circle, Precision Signal fill, left of label text
- **Purpose:** Category label only. Not interactive filters unless the design explicitly requires it.

### Cards

Two-layer nesting: an outer container provides structural padding and rounded corners; an inner surface provides the content plane. Tonal contrast between the two layers creates visual separation without borders or shadows.

- **Outer shell:** Warm Surface 200 (light) / Warm Surface 900 (dark); `border-radius: 16px`; padding `16px` (mobile) `24px` (sm+)
- **Inner surface:** Warm Surface 100 (light) / Warm Surface 800 (dark); `border-radius: 12px`
- **Hover:** `filter: brightness(0.95)` (light) / `filter: brightness(1.25)` (dark); 200ms ease-out
- **No border, no shadow at rest**

### Navigation

- **Container:** Sticky, `backdrop-filter: blur(12px)`, Warm White at 70% opacity (light) / Warm Surface 950 at 70% opacity (dark); `transition: background-color 500ms`
- **Links:** Monument Normal, weight 400, 1rem; Warm Ink (light) / Warm White (dark)
- **Active state:** 2px Precision Signal bottom border; flush to nav bottom edge
- **Default hover:** 2px Warm Ink border (light) / Warm White (dark)
- **Theme toggle:** IBM Plex Mono, 0.75rem, uppercase, tracking-widest; Warm Muted at rest; Ink/White on hover; `active:scale-95`
- **Mobile overlay:** Full-screen, Warm Surface 100 (light) / Warm Void (dark); links at 1.875rem, weight 500

### Device Mockup (Signature Component)

The iPhone frame component, used in case studies to present app work in context. This is the system's primary structural use of `shadow-layer`.

- **Frame radius:** `13cqi` (container-query-relative; scales with the component's width)
- **Border variants:** medium (`2.4cqi`), thick (`3.36cqi`), chunky (`4.8cqi`)
- **Device shadow:** Two-layer: `0 2.4cqi 4.8cqi -1.2cqi rgba(0,0,0,0.40), 0 1.2cqi 2.4cqi -1.2cqi rgba(0,0,0,0.25)`
- **Crop variant:** Bottom-cropped for mid-scroll reveals; base radius flattens
- **Usage:** Never nested inside a card. Present on a page section with clear surrounding whitespace.

## 6. Do's and Don'ts

### Do:
- **Do** use Warm Ink (`{colors.ink}`) for all near-black values. The warm ground is non-negotiable.
- **Do** keep the Precision Signal to ≤10% of any surface. If orange is everywhere, it is nowhere.
- **Do** build type hierarchy through scale and weight alone. Never color to signal emphasis in text.
- **Do** use `filter: brightness()` for hover states on interactive containers. Shadows are not hover feedback here.
- **Do** restrict IBM Plex Mono to labels, timestamps, and UI controls. Monument Normal for everything else.
- **Do** apply `text-wrap: balance` to all headings. Monument Normal earns it.
- **Do** cap body prose at 65–75ch. Longer lines dissolve the grid.
- **Do** use the two-layer card structure (outer shell + inner surface) before reaching for borders or shadows.
- **Do** use `ease-out` curves (ease-out-quart or expo) for all transitions. No bounce, no elastic.

### Don't:
- **Don't** animate anything for decoration. State transitions only: hover, active, focus, theme toggle.
- **Don't** use scroll-triggered reveal animations or parallax. These bury the work.
- **Don't** use the `.mesh` grain texture backgrounds on content areas or over portfolio work.
- **Don't** use glassmorphism, 3D blobs, aurora backgrounds, or gradient-heavy treatments.
- **Don't** fill large surfaces with the brand orange. It is a signal, not a background.
- **Don't** use gradient text (`background-clip: text` with gradient fill). Solid color only.
- **Don't** use side-stripe borders (`border-left` > 1px as a colored accent on cards or list items). Use background tints or full borders instead.
- **Don't** nest cards inside cards.
- **Don't** introduce a third typeface. Two faces are the system.
- **Don't** apply `shadow-layer` to cards, navigation, tooltips, or dropdowns. Structural image/device separation only.
- **Don't** replicate "generic creative agency" patterns: big rotating hero text, identical icon-heading-text card grids, footer rows of social links.
- **Don't** use cool-blue-gray neutrals (`#0d0e12`, `#13141b`, or equivalent). Replace with warm-tinted values.
