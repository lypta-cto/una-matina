# /crepes final review (2026-10-18, against mornibali.framer.website)

Reviewer: final AD + front-end QA pass. Read-only on code. Dev server `localhost:3001/crepes`.
Evidence: `review/final-crepes/`
- `widths/{320,360,390,414,768,1024,1280,1440,1920}-{fold,full}.png`: DPR 2 on phones and at 1440/1920.
- `morni/…`: the same sizes for mornibali.
- `motion/`: load and scroll frame sheets. Desktop uses `mouse.wheel` with Lenis on; mobile uses CDP touch `synthesizeScrollGesture`.
- `states/`: market clock simulations.
- `checks/`: reduced motion, no JS, focus, contrast, sequence sizes, landscape, details.

## Verdict: FIX, don't ship yet

The motion system is better than the reference: the letter rise, the circumflex drop, the curtain, the camera sequence, the cone finale and the week board are all crafted. Scroll on desktop and mobile showed no jank.

Two layout bugs block shipping. The first is a regression in the curtain code: **the featured-crêpe signboard and the live market line are hidden on first load on every device with motion allowed.** That signboard is the bottom-right element Luka liked in mornibali. The second is on short phones (360×640, 320×568) and landscape phones: **the pinned sequence overlaps its own text.**

Both fixes are small. Once they and the P1s below are done, the page is shippable.

**Score vs mornibali: 6.5 / 10 as it runs now. About 8.5 / 10 after the P0 and P1 fixes.**
- Motion and interaction are better than mornibali (about 9).
- Photography (one AI picture used 4 times, plus mockups) and headline voice ("THE MENU", "FIND THE STAND") are below it (about 6).

---

## P0: must fix before the QR goes live

### P0-1 The hero's featured board and market status never show (desktop) or are hidden at rest (phones)

**Evidence**
- `widths/1440-fold.png` and `widths/1920-fold.png`: the bottom-right is empty. There is no "Pistachio Bliss $11" and no "Next market …" line.
- `widths/390-fold.png` and `widths/320-fold.png`: no brown plank behind the lead and no featured crêpe. The lead sits straight on the strawberries.
- For comparison, the intended look (reduced motion, where the curtain is off): `checks/reduced-1440-fold.jpg` and `checks/reduced-390-fold.jpg`.

**Measured.** At `scrollY = 0` these elements already carry `.is-tucked`:
- `.hero__side` and `.hero__status` at 1024, 1280 and 1440.
- `.hero__side` at 1920.
- `.hero__plank` and `.hero__feat` at 320–768.
- After pressing Home from the bottom, `.hero__side` is still tucked (`checks/after-home.jpg`).

So on desktop the market status, which is the page's most useful fact, is not on screen at all.

**Cause.** In `pages/crepes.vue:94` the tuck test runs even when the sheet has not entered:
```js
for (const el of tucks) el.classList.toggle('is-tucked', el.getBoundingClientRect().bottom > top - 24)
```
Both elements sit flush to the hero's bottom edge:
- the side board's bottom margin is negative, so its bottom equals the hero's bottom;
- the phone `.hero__feat` ends 20 px above it.

At rest, `top` is the hero height, so `bottom > top − 24` is already true.

**Fix (`pages/crepes.vue`, inside `frame()`).** Only tuck once the sheet is actually in the viewport:
```js
const entering = top < vh - 1          // the sheet has started to cover the hero
for (const el of tucks) el.classList.toggle('is-tucked', entering && el.getBoundingClientRect().bottom > top - 24)
```
Checks to run after the fix:
- At rest, nothing in `#crepes-hero .is-tucked` at 320×568 … 1920×1080.
- The probe script is in the scratchpad; the same check by hand: `document.querySelectorAll('#crepes-hero .is-tucked').length === 0`.
- The board slides in with `hero-in-side`, then the price odometer rolls at +1150 ms.

### P0-2 "Made in front of you" overlaps its own text on short phones and in landscape

**Evidence**
- `checks/seq-small-phones.png`:
  - 320×568: the frame ends at 462 px and covers the "Three of five" meter (404) and the step title (444). The title reads "Filled the way you like" half under the picture.
  - 360×640, the most common Android size: the frame ends at 504 and the meter starts at 481.
- `checks/seq-844x390.jpg`: in landscape the frame is 175 px wide and sits on top of the text.

**Cause.** In `components/CrpSequence.vue:209–212` the frame is sized from the viewport (`width: min(100%, 56svh*0.8, 480px)`, 4:5). It is not sized from the grid row it lives in (`minmax(0,1fr)`). When the title, meter and lines need more than 44svh, the 4:5 box overflows its row.

**Fix (`CrpSequence.vue`, mobile block).** Let the frame fill its own row and keep 4:5 inside it. `measure()` already reads `clientWidth/Height`, so the camera adapts.
```css
@media (max-width: 899px) {
  .seq__frame { width: auto; height: 100%; max-width: 100%; max-height: 520px; aspect-ratio: 4 / 5; }
}
/* very short screens (landscape phones): the pin is not worth it */
```
In `onMounted`, also skip the pin when `window.innerHeight < 520`. That gives a short screen the static list of stills:
```js
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.innerHeight < 520) return
```
Check again at 320×568, 360×640, 390×664, 844×390 and 667×375: the frame bottom must be at or above the meter top.

---

## P1: fix before launch

### P1-1 Launch-blocking facts: market days and hours are presented as live truth

The hero says "Next market: Tomorrow, 9 am – 1 pm". The board says "Open now, until 12 pm", with a live dot and a "Now" bar (`states/sat-1015-open-1440-board.jpg`).

These come from `data/markets.ts`, whose own header says "ALL placeholder until confirmed". The names are neutral and the address falls back to "Naples, FL", which is fine. But days and hours are specific claims people will act on.

"Get directions" opens a Google search for "Naples FL farmers market", which returns a list of several markets.

**Fix.** Before printing the QR, Luka confirms the days, hours and markets, and `mapsQuery` gets the real address.

### P1-2 Instagram controls lead to a dead end

- The sticky phone bar's second button "Instagram", "Say hi on Instagram" and the footer "Instagram @unamattina" all go to `#follow`.
- `#follow` has no link, because `contact.instagram.url` is empty.
- On phones that is one of the two thumb actions, and tapping it only scrolls (`motion/m390x844-scrollup.jpg`).

**Fix, if the URL is not confirmed at launch.**
- In `pages/crepes.vue`, use `v-if="igUrl"` on the bar's Instagram button and the "Say hi" link.
- Make the bar's second button "See the menu" (`href="#menu"`, `crp-btn--cream`) until the URL exists.

Better: get the handle confirmed and set `site.ts` `instagram.url`.

### P1-3 Hero picture: derivative of mornibali's own hero photo

`widths/1440-fold.png` and `morni/1440-fold.png` have the same composition:
- a server in a burgundy apron with a forearm tattoo;
- a glass cloche with a pastry on the left;
- a jug poured from the top right by a hand with a bracelet;
- a latte cup on a saucer and a striped towel on the right;
- a plate held at the left rim.

Luka's AI image is effectively an image-to-image re-render of the reference photo. That is a problem for three reasons:
- It breaks the workspace rule "reference → inspiration, no copying".
- It carries rights risk on the source photo.
- A visitor who knows the template sees the clone.

It also shows a café counter with plates, while the copy says market stand and paper cone.

**Fix (Luka).** Re-render from a text prompt with our own composition: the stand's griddle and a paper cone, outdoors, morning light. Render at **≥ 3344 px** wide. That also solves P1-4. It needs no code change: same file names, then rerun the `hero-ai-*` and `seq-source-3344.webp` exports and the `seq` crops.

### P1-4 Image sharpness on 2× and 3× screens (source-limited)

The source is 1672×941, and every hero, sequence and Instagram crop is upscaled from it:
- `checks/hero-1440-2x-detail.png`: the plate is soft and painterly at DPR 2.
- On phones, `hero-ai-m-828.webp` (828×1377) covers 413 CSS px. At DPR 3 that is 0.67 of the needed pixels, cropped from a 941 px tall source.
- Instagram cards (`checks/ig-1440-2x-detail.png`):
  - `placeholder/crepe-cone.webp` is **278×470** and `placeholder/apron.webp` is 350×515, shown at 280 CSS px (needs 560) on desktop and 171 px at DPR 3 (needs 513).
  - `placeholder/booth.webp` is the opposite: 1374 px and **189 KB** for a 171 px tile.

**Fix.**
- Get a large render (P1-3).
- Export the Instagram cards at 600×600 and about 40–60 KB each, using the 2× source where one exists.
- Until then, do not show crepe-cone or apron above 278 or 350 device px. At least cap `.ig__cards` at `minmax(0, 180px)` on desktop.

### P1-5 The sequence index fails contrast as a control

Inactive step titles are clickable buttons at `opacity: .35`, about 2:1 on cream (`checks/nav-made-click.jpg`).

**Fix (`CrpSequence.vue:250`).**
```css
.seq__idx { opacity: 1; color: color-mix(in srgb, var(--ink) 55%, var(--ground)); }
.seq__idx.is-on { color: var(--ink); }
```
Use `transition: color` instead of opacity. The target is ≥ 3:1 for an inactive state that does not carry the information, or ≥ 4.5:1 if you want it read.

---

## P2: polish, inside the same pass if possible

1. **Odometer shows "$0–00" before it rolls.** See `motion/d1440/scroll-006.jpg` and the menu row of `motion/m390x844-scroll-00.png`. For about 0.5 s the menu says "Sweet $0–00 · Savory $00–00", which reads like a glitch or "free".
   - Fix in `CrpOdo.vue:45`: `.odo.is-armed:not(.is-in) .odo__vis { opacity: 0; } .odo.is-armed.is-in .odo__vis { opacity: 1; transition: opacity 200ms var(--ease-out); }`
   - Also use rootMargin `0px` instead of `-10%`.
2. **Footer wordmark has hairline seams** where the 10 clip slices meet, at M|A and in the TT crossbar (`checks/footer-wordmark-2x.png`).
   - Fix in `CrpWordmarkRise.vue:25`: `<rect :x="s.x - 1.5" y="-40" :width="s.w + 3" height="305" />`. The fill is opaque, so the overlap is invisible.
   - Or render one unclipped `<use>` after the rise ends: add `.is-done` on `transitionend` and hide the slices.
3. **The 45 % dimmed "done" market row fails contrast** at about 2.4:1 (`widths/390-full.png`, the Saturday row; `states/sun-1400-closed-390-board.jpg`). It is set twice: `CrpWeekBoard.vue:69` and `pages/crepes.vue:266`.
   - Replace with `.is-done { color: var(--ink-muted); background: color-mix(in srgb, var(--ground) 55%, transparent); }`. Muted ink is 6.4:1.
   - Keep the button at full ink.
4. **Status copy repeats the day** and orphans the time. "Next market: Saturday, 8 am – 12 pm, Saturday market", and on phones "until↵12 pm" (`states/sat-1015-open-390-hero.jpg`).
   - In `MarketStatus.vue:11`, drop the name when it contains the weekday (`!status.market.name.includes(dayNames[status.market.day])`).
   - Wrap `fmtTime(close)` in a `white-space: nowrap` span in the open branch.
5. **Live dot colour differs between hero and board.** It is apricot in the hero (`CrpHero.vue:125` overrides it) and green `--success` in the board. Pick one; apricot is the brand's sun.
6. **The Instagram row is lopsided on desktop.** Four 280 px cards are left-aligned with an empty quarter of the row (`widths/1440-full-ig-footer.jpg`). The pour card is the 4th use of the same picture.
   - Fix at `pages/crepes.vue:282`: `repeat(4, minmax(0, 1fr))`.
   - Replace the pour with another brand mockup (tote or napkins in `public/img/placeholder/`).
7. **`#made` anchor lands 96 px early.** The yellow menu band shows above the pinned stage and the frame touches the bottom edge (`checks/nav-made-click.jpg`). Fix: `#made { scroll-margin-top: 0; }` in `CrpSequence.vue`.
8. **"Tap the sign to turn it."** on desktop. Use "Tap or click the sign to turn it." (`pages/crepes.vue:125`).
9. **`aria-live="polite"` on `.seq__lines`** (`CrpSequence.vue:164`) announces every step while a screen-reader user scrolls. Remove it; the index's `aria-current` already says where you are.
10. **No JS: the side board's "$11" is clipped** at the right edge, because the grid item's min-content is 442 px in a 389 px column (`checks/nojs-1440-fold.jpg`). Fix: `.hero__side > * { min-width: 0; }` in the ≥900 block of `CrpHero.vue`.
11. **The hero tint is heavy compared with mornibali.** The median contrast under the text is 13–18:1, and the photo reads muddy brown (`widths/1440-fold.png` vs `morni/1440-fold.png`).
    - I tested `--tint: .55` with `saturate(1.12)`; it is far more appetising (`checks/tint055-1440.jpg`).
    - But the lead then drops to 3.3–3.7:1, which fails for body text (`checks/` contrast run).
    - Option: on desktop only, tint .55 and set the lead at 700 weight / 1.25 rem, which counts as large text (needs 3:1).
    - Or keep .72; it passes everywhere: lead ≥ 4.94, word ≥ 4.85, status ≥ 6.98.
12. **Section headings are labels, not lines.** mornibali's H2s carry the voice ("SAME MENU AT 7 AM AND 4 PM."); ours are "THE MENU" and "FIND THE STAND". Proposals that stay ≤ 2 lines and are not facts:
    - "Sweet, savory, folded hot."
    - "Come find the griddle."

    This is a copy decision for Luka.
13. **Tablet portrait (768–899) is the phone layout stretched.** CRÊPES is capped at 7.5 rem (120 px) with a big empty middle, and the lead sits over powdered sugar (`widths/768-fold.png`). Fix in `CrpHero.vue`: `@media (min-width: 600px) and (max-width: 899px) { .hero__word { font-size: min(24vw, 11rem); } }`.
14. **Mobile loads about 92 KB of stills it never shows.** The SSR static list (`step-counter`, `step-folds`) is fetched before hydration swaps in the pin. Optional: `fetchpriority="low"`, or render the static list only inside `<noscript>` plus the reduced-motion path.

---

## What passed

- **Horizontal overflow:** none at 320–1920 (`scrollWidth == clientWidth`).
- **Headings:** every h1, h2 and caption is ≤ 2 lines.
- **First screen on phones (320×568 → 414×896):** greeting, CRÊPES, market status and both actions are all visible.
- **Load choreography (desktop and phone):** clean (`motion/d1440-load-sheet.png`, `motion/m390x844-load-sheet.png`).
  - Letters rise out of their masks 55 ms apart.
  - The circumflex lands last and lines up exactly (`motion/d1440-load-crops.png`).
  - The nav drops, the pill opens from its centre, then the links come in.
- **Curtain (desktop wheel/Lenis and mobile touch):** the sheet slides over and the words step aside before they are covered. No half-covered words, no blank frames (`motion/d1440-curtain-detail.png`, `motion/m390x844-scroll-00.png`).
- **Sequence at 390×844 and desktop:** five distinct framings. Steps 2 and 3 are now different shots (`motion/m390-seq-steps.png`). The mask text swap, the rail, the "One of five" counter, the apricot cone finale wipe and the release all work. The index click glides via Lenis to the right step.
- **Frame timing (headless, wheel and touch, whole page):**
  - p50 and p95 16.7 ms.
  - 0 long tasks.
  - 2 single 33 ms frames on touch.

  Headless has no GPU raster, so confirm on a real mid-range Android.
- **CLS:** 0.0013 on desktop (letter cells at 104 ms), 0 on mobile.
- **LCP:** 68–120 ms (the H1 glyphs), measured locally on the dev server.
- **Week board states** (`states/`): before opening ("Today, from 8 am", apricot plank), open (pulse + Now bar), closed today (dimmed, "Back next Sunday", sorted last), midweek ("This Saturday"). The logic is correct for all.
- **Reduced motion and no JS:** all content renders (`checks/reduced-*`, `checks/nojs-*`). The curtain is off and the static sequence list shows.
- **Keyboard:**
  - The skip link is first.
  - Every stop has a 3 px ring in a contrasting colour: cream on the photo and footer, brown on cream, deep brown on the apricot pill.
  - Focus scrolls each target into view.
  - The sticky bar is `inert` while it is hidden.
- **Sticky phone bar:** appears after the hero, hides while reading downwards, comes back on scroll-up and at the end.
- **Contrast on the photo (pixel-sampled 98th percentile, cream text):**
  - lead ≥ 4.94
  - word ≥ 4.85
  - greeting ≥ 5.86
  - status ≥ 6.98
  - ghost button ≥ 5.24

  Measured at 320, 360, 390, 414, 768, 1024, 1440 and 1920.
- **Console:** no errors or warnings on /crepes in the final runs. The first run picked up a transient Vite CSS error from `pages/how-we-work.vue`, another agent's in-progress edit; it was gone on rerun.
- **Honesty:** the rendered text has no "confirm / placeholder / concept / TBC / coming soon / illustration". Alts say "Illustrative image …" and "Illustration of …", which is fine because they are not visible. Names are neutral and the address shows as "Naples, FL". Days and hours are the exception (P1-1).
- **Transfer (mobile, DPR 3, whole scroll):**
  - Images 607 KB.
  - Fonts 75 KB.
  - JS is 8 MB, but only because this is the dev server. Measure a production build in the scratchpad before launch; the target is < 1 MB total on mobile.

## mornibali, section by section

| | mornibali | ours | gap |
|---|---|---|---|
| Hero | bright photo, gradient shade, condensed 190 px caps, featured dish bottom-right, static | darker flat multiply tint, Montserrat 700 caps, letter rise + circumflex + curtain; **featured board currently hidden** (P0-1) | motion ours ≫; photo appetite theirs > (P2-11); composition equal after the fix |
| About / intro | H2 + statement + 3 staggered photos | A→cone sign flip, our own idea | ours more ownable |
| Menu | pink field, ruled rows, category tags | yellow field, ruled rows, Playfair notes, odometer range | equal; ours has the "$0" flash (P2-1) |
| Story | coffee card over photo + clock-time photo strip (10+ real photos) | pinned 5-shot camera through one picture + cone finale | ours better crafted, theirs richer in photography |
| Visit | WHERE/WHEN grid + photo | live week board | ours more useful |
| Social | none | handle headline + 4 dealt cards | lopsided on desktop (P2-6), soft images (P1-4) |
| Footer | statement + wordmark | script sign-off + rising wordmark | equal; hairline seams (P2-2) |
