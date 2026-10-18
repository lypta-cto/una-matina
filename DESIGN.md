---
version: alpha
name: Una Mattina — Lido
description: A Mediterranean beach-club awning over a cream page. The brand's apricot and yellow cabana stripes (from its aprons and napkins) hang at the top of every page as an awning with a scalloped valance, and each scallop is the same half-circle as the sun in the "A" mark. Everything under the awning is flat cream, yellow or apricot fields with brown ink, set in Montserrat like painted lido signboards, with whole sentences in Playfair Display Italic. Square corners, no shadows, no gradients; stripes never sit behind text.

colors:
  cream: "#FFF7EA"        # ground
  cream-deep: "#F8EBD5"   # surface: one tone step for alternate fields and signboards
  brown: "#5B3A2E"        # ink, all running text
  brown-deep: "#4E2412"   # ink on sage (logo brown, 5.5:1 on sage)
  brown-muted: "#76533F"  # secondary notes only, 6.4:1 on cream
  line: "#9A7A65"         # form-field and menu-row rules, 3.7:1 on cream, 3.3:1 on cream-deep
  apricot: "#F4A878"      # accent: primary button, awning stripe A, scallops
  yellow: "#F6D67A"       # field: awning stripe B, "day" fields
  sage: "#9EAD83"         # field-2: Bloom Cart only, large text only
  success: "#4F6B3A"
  warning: "#8A5A00"
  danger: "#A63A22"
  info: "#5B3A2E"

typography:
  sign-xl:   { fontFamily: Montserrat, fontWeight: 400, fontSize: "clamp(3.25rem, 1.6rem + 7.4vw, 9rem)", textTransform: uppercase, letterSpacing: "0.02em", lineHeight: 0.95 }
  sign-l:    { fontFamily: Montserrat, fontWeight: 400, fontSize: "clamp(2.5rem, 1.6rem + 4.2vw, 6rem)", textTransform: uppercase, letterSpacing: "0.02em", lineHeight: 0.95 }
  sign-m:    { fontFamily: Montserrat, fontWeight: 500, fontSize: "clamp(1.75rem, 1.3rem + 2vw, 3.25rem)", textTransform: uppercase, letterSpacing: "0.03em", lineHeight: 1.0 }
  title:     { fontFamily: Montserrat, fontWeight: 600, fontSize: "clamp(1.25rem, 1.1rem + 0.6vw, 1.5rem)", lineHeight: 1.25 }
  statement: { fontFamily: "Playfair Display", fontStyle: italic, fontWeight: 400, fontSize: "clamp(1.375rem, 1.1rem + 1.2vw, 2.25rem)", lineHeight: 1.3 }
  body:      { fontFamily: Montserrat, fontWeight: 400, fontSize: "clamp(1rem, 0.96rem + 0.2vw, 1.0625rem)", lineHeight: 1.6 }
  small:     { fontFamily: Montserrat, fontWeight: 500, fontSize: "0.875rem", lineHeight: 1.45 }
  signoff:   { fontFamily: "Mrs Saint Delafield", fontSize: "clamp(2rem, 1.5rem + 2vw, 3.25rem)", note: "once per page, sign-off only" }

spacing:
  gutter: "clamp(16px, 4vw, 40px)"
  section: "clamp(88px, 11vw, 184px)"
  measure: "62ch"
  max: "1440px"
  stripe: "28px (<768px) · 44px (≥768px) · 56px (≥1200px)"

rounded: { all: 0 }
shadows: none
motion:
  ease-out: "cubic-bezier(0.22, 1, 0.36, 1)"
  ease-in-out: "cubic-bezier(0.65, 0, 0.35, 1)"
  fast: 160ms
  base: 240ms
  slow: 560ms
---

## Overview
The page is a beach club seen from under its awning. The awning is the brand's own material (the apricot/cream and yellow/cream cabana stripes of its aprons, napkins and tote) and its scalloped valance repeats the half-sun of the "A" mark. Under it, content is set like the painted boards of an Italian lido: big upright capitals for names, a clean list of what is on offer, prices or details aligned right. The look must read warm and relaxed, never luxury-wedding (no black, no gold, no script headlines) and never boho (no jute, pampas, macramé).

## Colors
- **Cream ground (~45%)** is a brand decision (tent canvas, napkins, cups), not a default.
- **Stripes (~25–30%)** live only in the awning, the valance and small textile strips. Stripe pair = one apricot or yellow stripe + one cream stripe of equal width. Never a gradient: stripes are DOM blocks or SVG.
- **Yellow and apricot fields** carry one band per page each at most. **Sage** belongs to Bloom Cart (its awning and field) and carries only large text in `brown-deep`.
- **Brown** is the only ink. Footer is a brown field ("evening under the awning") with cream text.
- Contrast: brown on cream 9.45, on yellow 7.09, on apricot 5.13; brown-deep on sage 5.53. Cream text never sits on apricot/yellow/sage.

## Typography
- Montserrat is brand-mandated (it is on the house list of over-used faces; the exception is recorded here). Its character comes from scale: uppercase Regular at sign sizes, like hand-painted lido boards.
- Playfair Display Italic is used **only for whole sentences**: statements, menu descriptions, captions of photos. Never one word inside a sans headline.
- The script face appears once per page, for "Good Food, Brighter Days" only. `[[potvrditi: brand script font — Mrs Saint Delafield is a stand-in]]`
- Headlines ≤ 2 lines at every width. No eyebrows, no tiny letter-spaced labels (the logo's own tagline lockup is the only tracked caps).

## Layout
- One grid: 12 columns, gutter token, max 1440px. Large things run to the edges (awning, fields, photos).
- Section gap clearly larger than inner gaps. Neighbouring sections never share a composition.
- Mobile is its own composition: awning shorter (stripe 28px), boards full width, primary action reachable by thumb.

## Elevation
None. Surfaces separate by tone step (cream → cream-deep) or by field colour. No shadows, no blur, no glass.

## Components
### Awning
Full-width row of vertical stripes (`stripe` width) with a scalloped bottom edge: each stripe ends in a half-circle of its own colour, diameter = stripe width. Variants: `apricot`, `yellow`, `sage`. Height: 96–180px desktop, 64–96px mobile. Load motion: drops from scaleY(0.6) to 1 from the top, `slow` + `ease-out`, once. No text on it.

### Signboard
A cream-deep (or yellow/apricot) panel with square corners holding a title in `sign-m` and rows: name (title) left, detail (statement italic, smaller) under it, value right in tabular figures. Rows are separated by a 1px `line` rule (a real list/table: allowed). Used for: the crêpe menu, the three pillars, the station counter, market schedule.

### Buttons
Rectangular, square corners, min-height 52px, padding 0 24px, Montserrat 600 15px sentence case.
- Primary: apricot fill, brown text. Hover: brown fill, cream text (`fast`). Press: translateY(1px).
- Secondary: brown 2px outline, brown text. Hover: brown fill.
- Text link: brown, 2px underline offset 4px; hover underline turns apricot.

### Placeholder frame
Every AI mockup image carries a visible label "Concept image · placeholder" (cream-deep chip, small type, bottom-left). Empty portfolio slots are cream-deep rectangles with a mini awning edge and the text "Styled shoot coming: <subject>". Found photographs carry a caption with creator and licence.

### TBC marker
Any unconfirmed fact (market names, times, handle, phone, email, menu) renders inside `<Tbc>`: a dashed apricot underline and a small "TBC" tag, so it is obvious on screen and greppable in code.

### Forms
Labels above fields, Montserrat 500 15px. Fields: cream background, 2px bottom border `line`, focus border brown + apricot outline. Choice chips for event type and services: rectangular toggles, selected = apricot fill. Errors in `danger` with text, never colour alone.

### Header / Footer
Header: traced horizontal wordmark left (brown), 5 links, one apricot "Inquire" button; on mobile a "Menu" text button opens a cream sheet. Footer: brown field, stacked wordmark at full width in cream with apricot sun, contact (TBC), links, credits, the script sign-off.

## Do / Don't
- Do: stripes as material, flat fields, square corners, brown ink, whole-sentence italics, real lists.
- Don't: gradients, shadows, rounded cards, icon cards, script headlines, gold, black, emoji, invented reviews or event photos, text over stripes, more than one awning per page plus one small strip.

## Responsive Behavior
- <768px: stripe 28px, awning 64–88px, sign-xl ≈ 52–64px, boards stack, buttons full width in the first viewport.
- ≥768px: stripe 44px; ≥1200px: stripe 56px.
- Touch targets ≥ 44px. `prefers-reduced-motion`: awning static, reveals off.
