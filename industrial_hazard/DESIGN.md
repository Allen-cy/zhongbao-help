---
name: Industrial Hazard
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#e4beb9'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#ab8985'
  outline-variant: '#5b403d'
  surface-tint: '#ffb4ac'
  primary: '#ffb4ac'
  on-primary: '#690006'
  primary-container: '#ff544c'
  on-primary-container: '#5c0005'
  inverse-primary: '#bb171c'
  secondary: '#7ddc7a'
  on-secondary: '#00390a'
  secondary-container: '#03711e'
  on-secondary-container: '#92f28e'
  tertiary: '#ffba38'
  on-tertiary: '#432c00'
  tertiary-container: '#c08600'
  on-tertiary-container: '#3a2600'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdad6'
  primary-fixed-dim: '#ffb4ac'
  on-primary-fixed: '#410002'
  on-primary-fixed-variant: '#93000d'
  secondary-fixed: '#98f994'
  secondary-fixed-dim: '#7ddc7a'
  on-secondary-fixed: '#002204'
  on-secondary-fixed-variant: '#005313'
  tertiary-fixed: '#ffdeac'
  tertiary-fixed-dim: '#ffba38'
  on-tertiary-fixed: '#281900'
  on-tertiary-fixed-variant: '#604100'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  headline-xl:
    fontFamily: Space Grotesk
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 26px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-xl:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 16px
  label-md:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 14px
  data-display:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.04em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 20px
  lg: 32px
  xl: 48px
  edge-margin: 16px
  touch-target-min: 48px
---

## Brand & Style

The design system is built for the high-stakes, high-pressure environment of urban delivery. The brand personality is rugged, utilitarian, and uncompromisingly functional. It is designed for riders who need mission-critical data at a glance while navigating chaotic traffic and harsh weather conditions.

The visual style leverages **Brutalism** and **High-Contrast** movements. It prioritizes information density and legibility over aesthetic fluff. The interface should feel like a piece of heavy machinery or a professional-grade tactical tool—raw, efficient, and durable. Expect heavy borders, monochromatic surfaces punctuated by high-visibility safety colors, and a complete absence of soft gradients or decorative blurs.

## Colors

The color palette is strictly functional, utilizing high-contrast signals to communicate difficulty and danger instantly. 

- **Warning Red (#E53935):** Used exclusively for high-difficulty zones, critical alerts, and high-pressure zones.
- **Safety Green (#43A047):** Indicates low-difficulty, safe routes, and completed tasks.
- **Caution Yellow (#FFB300):** Reserved for moderate difficulty and secondary warnings.
- **Background (#121212):** A deep, industrial matte black to minimize screen glare during night shifts and maximize contrast for foreground elements.
- **Surface (#1E1E1E):** A slightly lighter grey for card components to create structural separation without losing the dark-mode benefits.

## Typography

This design system uses a dual-font strategy to balance technical character with readability.

**Space Grotesk** is used for headlines, data points, and labels. Its geometric, slightly mechanical terminals reinforce the industrial aesthetic. Use the "Data Display" level for critical metrics like difficulty scores or distance.

**Inter** is used for body text and descriptive content. It provides maximum legibility at smaller sizes, ensuring that delivery notes and navigation instructions are readable even when the device is vibrating on a handlebar mount.

Text should rarely use weights below 400. High-contrast white-on-black is the default state for all critical information.

## Layout & Spacing

The layout philosophy is based on a **Fluid Grid** with generous touch targets to accommodate gloved hands or rapid interactions.

- **Margins:** A consistent 16px edge margin ensures content does not bleed into the bezel.
- **Rhythm:** An 8px baseline grid governs all vertical rhythm. 
- **Tappable Areas:** All interactive elements must maintain a minimum height of 48px.
- **Gutters:** Use 12px gutters between cards to create clear visual separation on high-vibration displays.

## Elevation & Depth

In this design system, depth is conveyed through **Bold Borders** and **Tonal Layers** rather than shadows. 

Shadows are avoided as they can appear muddy on high-brightness outdoor displays. Instead:
- **Level 0:** Darkest background (#121212).
- **Level 1:** Surface cards (#1E1E1E) with a 2px solid border (#333333).
- **Active State:** Elements use a high-visibility border color (Primary Red or Safety Green) to indicate focus or "active duty" status.
- **In-Set Depth:** Use inner strokes or slightly darker wells for input fields to suggest they are "machined into" the interface.

## Shapes

The shape language is "Soft-Industrial." While sharp corners feel more aggressive, a small radius (0.25rem) improves screen durability and glanceable recognition of distinct modules.

- **Standard Containers:** Use `rounded` (4px) for most cards and buttons.
- **Status Pills:** Use `rounded-lg` (8px) for status indicators to differentiate them from interactive buttons.
- **Map Markers:** Utilize sharp, angular geometric shapes (hexagons or diamonds) to represent difficulty nodes, reinforcing the technical map aesthetic.

## Components

### Buttons
Buttons are massive and blocky. Primary buttons use a solid fill of Warning Red or Safety Green with black text for maximum punch. Secondary buttons use a thick 2px ghost-border style. 

### Industrial Cards
Cards utilize a "Header-Well" structure. The top section of the card contains the title and difficulty score, while the body contains technical data (ETA, Terrain, Traffic). Borders are always visible and 2px thick.

### Map Markers
Markers are high-visibility polygons. High-difficulty markers should pulse or utilize a thick "hazard" striped border pattern. Low-difficulty markers are simpler, solid green diamonds.

### Input Fields
Inputs are dark with 2px borders that turn Warning Red on error or Safety Green on valid entry. Typography inside inputs should be large (Body-LG) for easy verification.

### Status Chips
Small, high-contrast badges that use uppercase Space Grotesk. They serve as quick tags for "STEEP GRADE," "HIGH TRAFFIC," or "EASY ROUTE."

### Progress Bars
Thick, 12px tall bars using segmented blocks (like a battery indicator) rather than a smooth fill, reinforcing the rugged digital aesthetic.