# Una Mattina — final design review (reviewer, 2026-10-17 23:20)

Scope: `/`, `/services`, `/live-stations`, `/luxury-picnics`, `/bloom-cart`, `/how-we-work`, `/about`, `/inquire`, `/crepes`.
Evidence: `screens/rv-<page>-{desktop,desktop-fold,tablet,mobile,mobile-fold}.png` (shoot.mjs), `impeccable detect --json` per page, and Playwright measurements I ran at 360×640, 390×844, 768, 1024, 1280×720 and 1440×900 (heading line counts, overflow, Home CTA position, video requests, no-JS render, focus ring, headroom header, mobile sheet).
Brand exceptions not reported: Montserrat (shoot.mjs `default-font` BAN on every page, detect `overused-font`), cream ground (`cream-palette`), cream+apricot palette, 3 faces, placeholder/credited/"styled shoot coming" media, and the `/crepes` "Buongiorno, / CRÊPES" hero.

## Automated results

| Page | shoot.mjs | impeccable detect (non-brand) |
|---|---|---|
| all 9 | only `default-font` (brand) | `overused-font`, `cream-palette` (brand) |
| /inquire | – | **low-contrast ×2**: placeholders `#ad998c` on cream = 2.6:1 (need 4.5:1) → P1-7 |
| /luxury-picnics | – | low-contrast `span.found__credit` brown-muted on apricot 3.5:1. **Verified false positive**: the caption sits 130 px below the apricot field at 768/1024/1280 (the figure hangs out of the hero, the detector reads the ancestor's colour). No fix needed; see P2-16 for hardening. |

Measured and passing: no horizontal overflow on any page at any width; Home CTA fully in the first viewport at 360×640 (bottom 524), 390×844 (624), 1280×720 (684), 1440×900 (854); no video bytes under reduced motion (poster webp is LCP at 68 ms); with motion on only `palm-sunset-1280.webm` loads; page renders with JS off (h1 visible, nothing stuck at opacity 0); headroom header hides on scroll down and returns on cream on scroll up; focus ring 3 px brown on apricot is visible; mobile sheet has no hairlines.

Note: one shoot of `/crepes` (mobile) captured a Nuxt dev toast "Error · Compile error – Failed to parse source for import analysis…". It did not reproduce on a re-shoot or in a clean Playwright session, so it was a stale HMR error from an earlier edit. Builder: check the dev terminal once before shipping.

**No P0 found.**

---

## P1 — clearly wrong vs plan / rules

**P1-1 · Home · hero (tablet 768–~990 px): the Pause/Play button is hidden behind the board.**
At 834 px the board is full width and covers the toggle in the video's bottom-right corner (only the "e" of "Pause" shows). This is the only pause control for a looping video (WCAG 2.2.2 + plan DoD 8, "Pause/Play button works").
Fix `components/HeroVideo.vue`: keep the mobile position until the board stops being full width.
```css
@media (min-width: 768px) { .hv__toggle { top: calc(var(--stripe) / 2 + 12px); bottom: auto; } }   /* replace `top:auto; bottom:16px` here */
@media (min-width: 1200px) { .hv__toggle { top: auto; bottom: 16px; } }
```

**P1-2 · Headings over 2 lines (DoD 2), measured:**
| Page / heading | Widths that break | Fix |
|---|---|---|
| Home `Planned, styled, served` (`.pillars__title`, sign-l in 7 cols) | **1280** (3 lines), 1024 (3) | `pages/index.vue`: `@media (min-width:900px){ .pillars__title{ font-size: min(var(--step-4), 5.3vw); } }` (at 1280 → 68 px, "PLANNED, STYLED," fits 7 cols). |
| Home `It started with a crêpe` (origin, 7 cols) | 1024 (3) | `@media (min-width:900px) and (max-width:1199px){ #origin-title{ font-size: 5.6vw; } }` |
| Home `At home or on the beach` | 360 (3) | `@media (max-width:599px){ .where__title{ font-size: clamp(2rem, 11vw, 2.875rem); } }` (12 chars × 0.68 × 39.6 px = 323 px at 360). |
| /crepes `Naples market mornings` | 360, 390, 1024, 1280 (3) | `pages/crepes.vue`: give the intro H2 the full 7 cols at ≥900 and cap `min(var(--step-4), 5.2vw)`; below 600 `clamp(2rem, 10vw, 2.5rem)`. |
| /crepes `A morning at the stand` | **1024 (4 lines)**, | `.morning__head` is `1fr auto`, so the note column squeezes the H2. Use `grid-template-columns: 7fr 5fr`. |
| /crepes `Come hungry, come early` | 360, 1024, 1280 (3) | same cap as above on `.visit` H2. |

**P1-3 · /crepes · "A morning at the stand" strip invents clock times and breaks the image-size law.**
- `8:00 Griddles on`, `8:20 First crêpe of the day`, `9:30`, `10:45`, `12:00` are made up. The section plan deferred exactly this pattern on How We Work because "clock times would be invented" (§3 W, DoD 11).
- G12: `crepe-cone` (278 px source) and `napkins-yellow` (243 px source, garbled AI text, ≤200 px rule) are shown at 340 px wide, upscaled and soft on 2× screens. `apron` (350 px source) is shown at 340 px, above the 320 px cap.
- The first card and its caption sit flush against the viewport's left edge (x = 0). The cause is `scroll-snap-align:start` without `scroll-padding`.
Fix `pages/crepes.vue`:
  - Delete `time` from `morning[]` and render the label only. Change the note to "A few things you'll see at the stand." so it no longer promises a timeline.
  - Drop the `napkins-yellow` item.
  - `.morning__item { width: clamp(200px, 22vw, 240px); }` (booth may go to 340).
  - `.morning__strip { scroll-padding-inline: var(--gutter); }`
  - Simpler alternative: replace the strip with a static row of three ≤240 px concept images.

**P1-4 · /crepes · Visit: `napkins-apricot` (272 px source, garbled "A TASTERRAAANCA…" print) is shown at 460×575 desktop and 358 px wide on mobile.** This breaks G12 (napkins ≤ 200 px) and shows garbled AI text at full size.
Fix: replace `.visit__photo` with `<ShootSlot tone="apricot" subject="the stand on a market morning" ratio="4 / 5" />`, or cap `.visit__photo { max-width: 200px }`.

**P1-5 · Home · Picnics | Bloom halves: wrong photos.**
- (a) The Bloom half shows the "Gulik" brand on the wrapping paper. The plan's crop (right 60 %) is applied on /bloom-cart but not on Home. Fix in `pages/index.vue`: `.halves__flowers :deep(.found__img){ object-position: 100% 50%; }`.
- (b) The Vanderbilt photo is saturated turquoise water under a blue sky. Lido says "nema plave" (no blue, design-direction §4 P2). It is the only cold area on the site, and it sits right above the full-bleed pier photo, so two sea photos in a row.
- Fix: swap it for `<ShootSlot tone="yellow" subject="Beach picnic" ratio="3 / 2" />`, or reuse a warm crop of `clam-pass-sunset`. Then remove `vanderbilt` from the footer credits.

**P1-6 · /inquire · I3: the TBC tag is invisible on the yellow band.**
`Tbc.vue` paints `.tbc__tag` with `--field` (yellow). In "What happens next" ("Usually within two business days ~~to confirm~~ .") the chip disappears into the band, and the honesty marker is lost (DoD 11). /crepes patches this per section, inquire does not.
Fix at the source, `components/Tbc.vue`: `.tbc__tag { background: var(--ink); color: var(--ground); }`. That works on cream, cream-deep, yellow, apricot and sage. Keep the footer override (`--field` on brown) and delete the three `:deep(.tbc__tag)` overrides in `pages/crepes.vue`.

**P1-7 · /inquire · placeholder contrast 2.6:1** (detect). `components/InquiryForm.vue`: `.f input::placeholder, .f textarea::placeholder { color: var(--ink-muted); opacity: 1; }` (6.4:1).

**P1-8 · Home · "Where we set up" claims a track record.** "Most of our events happen at private homes, backyards, beaches and parks…" implies past events, and the brief says there are none yet.
Fix `pages/index.vue:80` (+ `copy.md`): "We set up at private homes, backyards, beaches and parks across Naples and Southwest Florida. For public places we confirm the rules and any permits before we finalise."

---

## P2 — polish

1. **Home · PillarExplorer starts on "All three"**, so all 8 rows are lit: a 480 px column of yellow planks where nothing contrasts, and the "pick one to see" idea isn't visible until someone clicks. `components/PillarExplorer.vue:5` → `ref<Sel>('planning')`. Then 4 of 8 rows are lit and the rest are muted, which explains itself.
2. **Home · occasions list** (`.where__list`, step-2 in 2 CSS columns inside 7 cols): at 1440 five of seven items wrap to two lines, and the 6 px item gap equals the line gap, so you can't see where one item ends ("Bridal & baby / showers / Engagements &…"). Use `font-size: var(--step-1)` and `.where__list li { margin-bottom: 0.7em }`, or a single column.
3. **Home · griddle photo** (raw batter on grey steel, not appetising) is used three times: Home stations band, Live Stations, /crepes. On Home crop to the crêpe, `object-position: 50% 45%`, ratio `1 / 1`, max 440. On Live Stations mobile (`.lsl__lead-photo`) use cannoli so it doesn't repeat.
4. **Home mobile · close steps:** "pack-/out." breaks at the hyphen. In `CloseCta` steps write `pack&#8209;out` (non-breaking hyphen).
5. **Home mobile · pier photo** at 21:9 is only ~165 px tall at 390 and reads as a strip. `.where__photo` ratio `4 / 3` under 768.
6. **Inner heroes · mobile buttons aren't full width** (Services, Picnics, Bloom, HWW, About, LS). DESIGN says "<768px: buttons full width in the first viewport", and Home already does this. `components/PageHero.vue`: `@media (max-width:767px){ .ph .btn, .ph [class*="btn-"] { width: 100%; justify-content: center; } }`.
7. **How We Work mobile H1** "SIMPLE FOR YOU" renders ≈34 px, against DESIGN sign-xl 52–64 px on mobile, so the page opens weakest of all. In `PageHero.vue` `type` layout: `@media (max-width:599px){ .ph__title{ font-size: clamp(2.75rem, 13vw, 3.5rem); } }` (2 lines, fine).
8. **How We Work · W3 band:** the permits note is 15 px in a 410 px tall yellow band, so hierarchy collapses next to the 36 px statement. Use `font-size: var(--step-1)` and reduce the band padding to `calc(var(--section) * .7)`.
9. **Services · S3:** the Playfair statement "The flowers are ours…" sits *above* its column head "Florals, in-house" and reads as an orphan pull quote. Move it below the list in that column, or above the three columns as the band's lead.
10. **Live Stations · StationCounter** with one station picked: a 760×375 yellow field with one 224 px cream board in the top-left, about 80 % empty. Render 3 fixed slots (1/3 width each) and show unpicked slots as `--surface` boards with "Add a station" (`title`, `--ink-muted`), so the counter reads as a counter. Also the legend "Pick up to three, then ask us about them." is 3 lines at 360/390: shorten to "Pick up to three." and move "then ask us about them" into the button.
11. **Yellow next to yellow:** Picnics `ShootSlot tone="yellow"` sits 160 px above the yellow P3 band, and Bloom's sticky yellow slot sits directly above the yellow B3 band. That makes two yellow masses per page and breaks the ≤1-yellow rule in spirit. `pages/luxury-picnics.vue:37` → `tone="apricot"`; `pages/bloom-cart.vue:38` → `tone="sage"` (sage is allowed on Bloom; ShootSlot uses `--ink-deep` there).
12. **About · A2 suns** read as icons on top of columns, especially stacked on mobile, because there is no horizon: each sun just floats above its heading. Make the horizon real without a rule: put the three headings + text on a `--surface` band whose top edge is the shared baseline, with suns clipped by that edge (`overflow: clip` on a wrapper whose bottom = band top). On mobile, line the three suns up in one row above the stacked texts instead of one per item.
13. **About · A5 "Who we are"**: a 630 px tall section holds one TBC line and a slot. `padding-block: calc(var(--section) * .5)`; slot `max-width: 320px`.
14. **Duplicate headline:** "It started with a crêpe" is both the Home origin H2 and the About H1. Rename the Home one ("Still at the market" / "Market first"), so the About link doesn't feel like a dead end.
15. **Bloom Cart · "How it works"** is a generic label heading next to a strong H1. Use something in the brand's voice, e.g. "From bucket to bouquet" (≤13 chars/line rule: "FROM BUCKET / TO BOUQUET").
16. **Footer credits list media not shown anywhere:** `positano` and `montepaone`, plus `vanderbilt` if P1-5b is applied. `SiteFooter.vue:4` uses `Object.values(credits)`. Delete the unused entries from `data/credits.ts`, or filter on a `used: true` flag. Hardening for the false-positive contrast flag: `FoundPhoto` captions that hang outside their field should set `background: var(--ground)` explicitly.
17. **/crepes · "Folded hot" card:** the `$8–11 / 9 / To order` trio is the hero-metric template (big figure + small label × 3, craft-floor "Refuse"). Make it one sentence under the body, e.g. "Nine crêpes on the menu, $8–11, every one made to order." (keep the TBC).
18. **/crepes · Visit rows** use `border-top: 2px` on a `<dl>` (not a table), which is the thin-rule ban (plan §6). Separate the markets with 32 px space or alternate `--surface` planks.
19. **/crepes · hero has three actions** (Find us ↗, See the menu, Follow on Instagram). Plan §6 asked for one primary + one text link: keep "Find us ↗" (header) + "See the menu" as a text link, and let Instagram live in the Visit band and footer. (The Buongiorno/CRÊPES hero itself stays, per Luka.)
20. **Picnics hero caption widow** "setups." on its own line: `text-wrap: pretty` on `.found__cap` globally.

---

## Scores (1–10)

| Page | Score | One-line verdict |
|---|---|---|
| Home | 7.5 | Strong first viewport (awning over the video, board, one CTA). Hurt by the hidden pause on tablet, 3-line H2 at 1280, the blue beach photo and Gulik. |
| Services | 7 | Clear and honest, varied sections; text-heavy, with one ordering slip in S3. |
| Live Stations | 7 | Best type-led hero; sticky frame works; counter looks empty with one pick. |
| Luxury Picnics | 7 | Good hero photo hang; yellow slot + yellow band stack up. |
| Bloom Cart | 7 | Sage world feels right; generic "How it works" + yellow-on-yellow. |
| How We Work | 6.5 | Correct structure but no image and a small mobile H1: the flattest page. |
| About | 6.5 | Nice mark band and lemons; suns read as icons; long empty "Who we are". |
| Inquire | 7.5 | Form + live summary is the best UX on the site; fix the invisible TBC and placeholder contrast. |
| /crepes | 7 | Fast, on-brand, usable in the sun. The morning strip (invented times, upscaled AI napkins) and napkins in Visit undo some of the honesty. |

## The 3 biggest wins left
1. **Honesty + image law on /crepes** (P1-3, P1-4): remove the invented clock times and the upscaled/garbled napkin images. These are the only places the site still overstates.
2. **Headline wraps at real laptop widths + the hidden pause** (P1-2, P1-1): 1280 and 1024 are the commonest desktop widths, and Home's second heading and three /crepes headings break there. The tablet Pause button is an a11y failure.
3. **Colour/photo discipline on Home and the service pages** (P1-5, P2-11, P1-6): drop the blue beach, crop Gulik, stop stacking yellow on yellow, and make TBC visible on every field. These keep the Lido palette clean and the "not ours / to confirm" promises visible.
