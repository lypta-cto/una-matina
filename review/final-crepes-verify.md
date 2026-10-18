# /crepes verification of final-crepes.md (2026-10-18)

This is a fresh reviewer's check of the "/crepes v3.3" round against `review/final-crepes.md`. The code was only read, not changed.

**Setup**
- Dev server: `localhost:3001/crepes`.
- Playwright: `builder/node_modules/playwright`, Chromium headless.
- Desktop scrolls use `page.mouse.wheel`, so Lenis is engaged. Phones use CDP touch `synthesizeScrollGesture` with `isMobile` and `hasTouch` set.
- Widths: 320×568, 360×640, 390×664, 390×844, 768×1024, 1024×768, 1440×900, 1920×1080, plus landscape 844×390 and 667×375. Phones and 1440/1920 run at DPR 2.
- Also run: reduced motion, JS off, and the market clock pinned with `context.clock` (Sat 10:15 open, Sat 7:30 before opening, Sun 14:00 closed today, Wed midday).

Evidence is in `review/final-crepes-verify/`:
- `widths/`: `*-fold.png`, `*-full.png` (static, sections still armed), `*-seq.png`.
- `motion/`: `d1440-load-sheet.png`, `m390-load-sheet.png`, `d1440-scroll-sheet.png`, `m390-scroll-sheet.png`, raw frames, `full-after-scroll.jpg`, `log.json`.
- `states/`: market clock simulations.
- `checks/`: reduced motion, no JS, anchors, odometer, Instagram, wordmark, contrast.

## Verdict

The **code is ship quality. Do not print the QR yet.**

- Both P0s are fixed. I verified them at every width.
- 14 of the 19 P1/P2 items are resolved.
- The remaining blockers are content work for Luka, not code:
  - P1-1: confirm the market days, hours and addresses.
  - P1-3: replace the hero image, which is derivative of mornibali's hero photo.
- Five small code fixes are left: 2 partial and 1 unresolved from the old list, plus 2 new P2s worth doing (N1, N2). Each is a few lines.

**Score vs mornibali:**
- **8 / 10 now**, up from 6.5.
- About **8.5** after the P2s below.
- About **9** once the hero is re-rendered from our own composition at ≥ 3344 px.

Where we are better than mornibali: motion, the live week board, the A→cone idea. Where it is still ahead: photography, which here is one AI picture plus mockups.

Measured in passing:
- Scroll: p50 and p95 16.7 ms on wheel (desktop) and touch (phone), 0 frames over 34 ms.
- CLS: 0.0035 on desktop, 0 on phone.
- No horizontal overflow anywhere.
- No console errors or warnings at any width.
- Every h2 is at most 2 lines.

---

## 1. Previous findings: status

| # | Finding | Status | Evidence |
|---|---|---|---|
| P0-1 | Hero signboard and market line hidden at rest | **Resolved** | See note A |
| P0-2 | Sequence frame overlaps its text on short phones and in landscape | **Resolved** | See note B |
| P1-1 | Days and hours presented as live truth; directions go to a generic search | **Unresolved (Luka)** | `data/markets.ts` is unchanged: `tbc: true`, `mapsQuery: 'Naples FL farmers market'`. See `states/*`. Blocks the QR. |
| P1-2 | Instagram controls lead to a dead end | **Resolved** | Bar reads "Directions / See the menu → #menu"; 0 links to `#follow`; the footer shows the handle as text. See `motion/m390/scroll-02*` |
| P1-3 | Hero picture is derivative of mornibali's photo | **Unresolved (Luka)** | `hero-ai-*.webp` was last changed 17 Oct 23:56, same composition (`widths/1440x900-fold.png`). Blocks launch. |
| P1-4 | Image sharpness on 2× and 3× screens | **Partial** | See note C |
| P1-5 | Sequence index contrast | **Resolved** | Inactive `rgb(118,83,63)` at opacity 1 = 6.4:1; active is full ink, 700 weight, apricot dot. See `widths/1440x900-seq.png` |
| P2-1 | Odometer shows "$0–00" | **Partial** | See note D |
| P2-2 | Seams in the footer wordmark | **Resolved** | No seams at M\|A or in the TT crossbar at DPR 2. See `checks/footer-wordmark-2x.png` and `-MA-zoom.png` |
| P2-3 | "Done" market row at 45 % opacity fails contrast | **Resolved** | Muted ink on the 55 % ground-over-sage row = **4.58:1**; Directions button 6.75:1. See `states/sun-1400-closed-390-board.jpg` |
| P2-4 | Status repeats the day and orphans the time | **Resolved** | "Open now, until 12 pm" and "Next market: Saturday, 8 am – 12 pm" each fit on 1 line at 390. See `states/sat-1015-open-390-hero.jpg` |
| P2-5 | Live dot colour differs between hero and board | **Resolved** | Both are `rgb(244,168,120)` apricot; the board dot is outlined. See `states/sat-1015-open-1440-board.jpg` |
| P2-6 | Instagram row lopsided on desktop | **Resolved** | Handle on 5 columns, 4 cards fill 7 columns (178 px tiles), no repeated plate. See `checks/ig-1440.png` |
| P2-7 | `#made` anchor lands 96 px early | **Unresolved** | See note E and fix N1 |
| P2-8 | "Tap the sign" on desktop | **Resolved** | "Tap or click the sign to turn it." |
| P2-9 | `aria-live` on the sequence lines | **Resolved** | Only `.ms` (the market status) and `.flip__cap` (the user-triggered sign flip) are live regions |
| P2-10 | No JS: "$11" clipped | **Resolved** | See note F |
| P2-11 | Hero tint too heavy | **Resolved** | See note G |
| P2-12 | Headings are labels, not lines | **Resolved (copy for Luka to approve)** | "Sweet, savory, folded hot" and "Come find the griddle", 2 lines at most at every width |
| P2-13 | Tablet portrait is a stretched phone | **Resolved** | CRÊPES is 184 px at 768, a proper tablet composition. See `widths/768x1024-fold.png`. Landscape side effect: N4 |
| P2-14 | Phone loads stills it never shows | **Unresolved (optional)** | See note H |

**Notes**

A. P0-1, signboard and market line
- At rest, `#crepes-hero .is-tucked` = 0 at all 10 sizes.
- The board slides in at about 1.0 s, then "$11" rolls (`motion/d1440-load-sheet.png`).
- After End → Home on desktop, the count is 0 (`motion/d1440/after-home.jpg`).
- Evidence: `widths/1440x900-fold.png`, `1920x1080-fold.png`, `390x844-fold.png`, `320x568-fold.png`.

B. P0-2, sequence frame. Frame bottom vs meter top at steps 1, 3, 4 and 5:

| Size | Frame bottom | Meter top |
|---|---|---|
| 320×568 | 388 | 404 |
| 360×640 | 465 | 481 |
| 390×664 | 489 | 505 |
| 390×844 | 667 | 685 |
| 768×1024 | 819 | 859 |

- The step lines end at 552, 624, 648, 828 and 1008, all inside the viewport.
- 844×390 and 667×375 get the static list.
- Evidence: `widths/*-seq.png`.

C. P1-4, image sharpness
- Instagram is fixed: 600×600 sources shown at 178 CSS px (`checks/ig-1440.png`).
- The hero and phone sequence still come from the 1672 px source.
- On tablet (600–899) the camera zooms the 1920 file to about 1.9×, and the "drizzle" step is visibly soft (`widths/768x1024-seq.png`). The fix is in N5.
- The real fix is P1-3's ≥ 3344 px render.

D. P2-1, odometer
- Before the roll, the digits are invisible (opacity 0 measured).
- But the columns start at "0" and fade in over 200 ms while the per-digit delays run up to 350 ms. So "$0–00", "$3–00" and "Savory $00–00" are still caught mid-roll on desktop and on phone. See `motion/d1440/scroll-003-y1167.jpg`, `checks/odo-menu-30.png` and `motion/m390/scroll-003-y1183.jpg`.
- It is shorter than before (about 0.3 s instead of 0.5 s), but it still reads as "free". Fix N2.

E. P2-7, `#made` anchor
- `scroll-margin-top: 0` is set, but Lenis (`anchors: true`) honours `html { scroll-padding-top: 96px }` from `main.css:72`.
- `#made` settles at top = **96**, with a yellow menu band showing above the pinned stage. See `checks/nav-made-click.jpg` and `anchor-made-1440.jpg`.
- `#menu` and `#visit` also land at 96.

F. P2-10, no JS
- "$11" is fully visible and the board is flush right (`checks/nojs-1440-fold.jpg`).
- Without JS, the valance sits inside the board's padding instead of on its top edge. This is cosmetic and only shows without JS.

G. P2-11, hero tint
- Lighter tint with brown plates behind small text.
- Pixel-sampled 98th percentile, text hidden: all large text ≥ 3.67:1, status ≥ 4.75, lead and featured text 9.45 (on the plate).
- The exception is N3.

H. P2-14, stills on phone
- `fetchpriority=low` lowers priority but does not stop the download. `step-counter` and `step-folds` (94 KB) still load at 390×844 DPR 3 before hydration swaps in the pin (network log in the checks run).
- Fine to leave.

---

## 2. Fresh look: new findings

No new P0s or P1s. Load choreography, curtain, sequence, cone finale, board rise, card deal, wordmark rise and the sticky bar are all clean in the frame sheets (`motion/*-sheet.png`). Reduced motion and no-JS render all content.

### N1 (P2): in-page anchors stop 96 px early on /crepes (this is P2-7)
**Cause.** The /crepes nav is `position: absolute` in the hero and does not follow the scroll. The site-wide `scroll-padding-top: 96px` (76 px under 1100) therefore only adds a strip of the previous section above every target. For `#made` that strip sits above a pinned 100svh stage.

**Fix.** Unscoped style in `layouts/crepes.vue`, or a global block in `pages/crepes.vue`:
```css
html:has(.crepes) { scroll-padding-top: 0; }
```
This applies only to /crepes. The `.seq` `scroll-margin-top: 0` can stay.

**Re-check.** Click Menu, How it's made and Visit at 1440×900. Each target's `getBoundingClientRect().top` should settle at 0 ± 1.

### N2 (P2): odometer still flashes zeros mid-roll (finishes P2-1)
**Fix (`CrpOdo.vue`).** Start each column one cell *below* the window, so a digit that has not started yet is blank, not "0":
```css
.odo.is-armed:not(.is-in) .odo__col { transform: translateY(1.1em); }   /* was: transform: none */
```
The roll then goes blank → 0 → … → d, and each digit appears at its own 70 ms stagger. The 200 ms opacity fade can stay.

**Re-check.** Wheel into the menu at 1440 and sample every 40 ms. No frame should show a "0" for a price that has no 0.

### N3 (P2): phone ghost button over the whipped cream at 360×640
**Problem.** "See the menu" (16 px, cream text, cream border, transparent fill) sits on the cream and sugar of the plate. Its 98th-percentile contrast is **4.22:1**, under 4.5 for normal text. Every other width passes (320: 4.78; 390: 8.23). See `widths/360x640-fold.png`.

**Fix (`CrpHero.vue`, `@media (max-width: 599px)`).** Give the ghost button the same flat plate the other small text gets:
```css
.hero__actions .crp-btn--ghost { background: var(--field-dark); }
```
Or use `color-mix(in srgb, var(--field-dark) 70%, transparent)` if a fully solid fill feels heavy.

### N4 (P2): landscape phones (844×390, 667×375) put the word ahead of the actions
**Problem.** The tablet rule `@media (min-width: 600px) and (max-width: 899px)` also matches landscape phones. CRÊPES becomes 176 px tall inside a 390 px viewport, and "Get directions" starts at 392 px (844×390) or 364 px of 375 (667×375). So the fold shows no action. See `widths/844x390-fold.png`.

**Fix (`CrpHero.vue`).** Scope the tablet size to portrait-ish screens:
```css
@media (min-width: 600px) and (max-width: 899px) and (min-height: 600px) { .hero__word { font-size: min(24vw, 11rem); } … }
```
Optionally add `@media (max-height: 480px) { .hero__word { font-size: min(13vw, 6rem); } }` for landscape.

### N5 (P2): tablet sequence uses the 1920 file and looks soft
**Problem.** `CrpSequence.vue` only switches the layer to `seq-source-3344.webp` at `min-width: 900px`. A 768×1024 iPad shows a 541×676 frame at DPR 2, zoomed up to 1.9× into the 1920 file, and the pour and drizzle steps are visibly soft (`widths/768x1024-seq.png`).

**Fix.** Pick the source by the frame's real pixel need, not by viewport width:
```js
if (window.matchMedia('(min-width: 600px)').matches || window.devicePixelRatio * Math.min(innerWidth, 480) > 900) layerSrc.value = '/img/crepes/seq-source-3344.webp'
```
Simplest version: change `900px` to `600px`.

### N6 (P2): 1 px dark hairline on the left edge of the apricot cone card
**Problem.** At the end of the finale wipe (desktop), the card shows a 1 px dark vertical line at its left edge, about 450 px tall. It is the photo layer showing through the anti-aliased clip edge while the frame is scaled by `--rel`. See `motion/d1440/scroll-019-y5967.jpg`, `scroll-020-y6267.jpg` and `scroll-022-y6867.jpg` (x ≈ 929).

**Fix (`CrpSequence.vue`).**
- In `render()`, drop the clip once the wipe is done and hide the photo under it:
  ```js
  finale.value.style.clipPath = pF >= 0.999 ? 'none' : `inset(…)`
  l.style.visibility = pF >= 0.999 ? 'hidden' : ''
  ```
- And in CSS: `.seq__finale { inset: -1px; }`.

### N7 (P2 copy nit): the finale line appears twice on screen
**Problem.** On desktop the step line beside the frame and the line inside the apricot card both read "At the market it leaves in a paper cone." (`motion/d1440/scroll-020-y6267.jpg`). On phones the same pair shows under "Then it is yours."

**Fix.** Keep the line in the card and make the end mask's `.seq__ll` "Then it is yours. Enjoy the walk." (copy for Luka). Or, on desktop, show the "Then it is yours." title (`.seq__mask--end .seq__lt { display: block }`) and drop the card's line.

### Observed, acceptable (no action)
- At 320×568 the phone sequence frame is 195×243 px, left-aligned with the text column. It is small but nothing overlaps.
- At 768 portrait, "$11" stops at the 26 rem `max-width` instead of the plank's right edge.
- On phones the sticky bar stays hidden while you read downwards. This is by design: it returns on scroll-up and at the end, verified with reduced motion too (`checks/reduced-390-scrollup-bar.jpg`).
- The fullPage screenshots under `widths/*-full.png` and `checks/*-full.jpg` show armed or lazy sections as empty. That is a capture artefact. `motion/*/full-after-scroll.jpg` shows the real page.

---

## 3. Before the QR goes live
1. **Luka:**
   - P1-1: confirm the days, hours and addresses, and set a real `mapsQuery` per market.
   - P1-3: re-render the hero from a text prompt (our own griddle + paper cone, outdoors, morning) at ≥ 3344 px. That also clears the rest of P1-4.
   - Approve the two section headlines (P2-12).
   - Set the Instagram URL when known.
2. **Builder:** N1–N6 (N7 is copy). Each is a few lines.
3. **Before launch:** measure a production build. Transfer on phone is unmeasured here because the dev server ships about 8 MB of JS.
