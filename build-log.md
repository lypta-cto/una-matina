# Build log — Una Mattina (Lido)

Dev: `http://localhost:3001` (Nuxt dev, `una-mattina/app`).

## Assets
- Wordmark horizontal + stacked: traced from client PNGs with potrace (sharp + potrace in scratchpad), two paths: ink = `currentColor`, sun = `--logo-sun`. → `app/app/assets/logo/`, originals in `assets/logo/traced/`. Source PNGs have uneven strokes; ask for real vectors.
- "A" sign: redrawn as clean geometry (`BrandSign.vue`), inverted = crêpe cone. Favicon from the same geometry.
- Placeholders: crops of AI mockups → `app/public/img/placeholder/` (booth, crepe-cone, coffee-cup, apron, napkins ×2, tote, caps). Always rendered through `ConceptImage` with the "Concept image · placeholder" label.
- Found photos (credited, never "our events"): Naples Pier sunset, Clam Pass sunset (CC BY-SA 4.0, P,TO 19104), Positano umbrellas (CC BY 2.0, Nan Palmero). Rejected: 1899 farm catalogue (wrong subject), Venice lido huts, Amalfi lemons at night.

## /crepes
Round 1 (shoot): cream stripes vanished on the cream page, so the awning read as apricot tabs; mobile H1 ran to 3 lines.
Fix: **rule added to DESIGN: an awning always hangs over a coloured field, never over cream** (hero = yellow field, "Find the stand" = apricot field under a yellow awning). H1 → "Crêpes to order", mobile size clamp(3rem, 15vw, 4rem).
Round 2 (impeccable detect + taste inspect):
- overused-font (Montserrat), cream palette, palette-claude, 3 typefaces → **brand exceptions** (fixed palette and fonts from the client's brand board). Inspector run with `--allow palette-claude`.
- hairlines on menu rows → removed (spacing only); schedule became a real `<table>` (lines allowed).
- few pictures → booth concept image in "Find the stand", apron image in the events teaser (4 pictures).
- still page → reveals on headings/boards/rows (70–90ms stagger), awning drop on load, slow drift on the hero image.
- small text → placeholder label and TBC tag at 13px.
- grey-body on apricot (5.1:1) → text on apricot uses `--ink-deep` (6.8:1).
- no-footage → defended: QR page on mobile data in the sun; no honest clip of this stand exists.
Result: only brand-exception warnings remain.

## Events pages, round 1 (2026-10-17)
Built: Home, Services, Live Stations (StationCounter live thing), Luxury Picnics, Bloom Cart, How We Work, About, Inquire (+ `/api/inquiry`, delivery TBC).
Layout rule implemented in `layouts/default.vue`: page meta `awning` + `field`; the awning hangs over the page's coloured field (apricot/yellow/sage), header sits on that field.
shoot.mjs on all 7 pages: only the Montserrat brand exception. Visual check: heroes on inner pages are text-only on the field (waiting for media agent); styled-shoot slots shrunk to 3:1.
Luka's new references (agrovas video hero, beanro, lattetemplate, mornibali for /crepes) → research agent + media agent running; Home and /crepes to be reworked from their section plan.

## /crepes v2 — mornibali structure (Luka's pick), Una Mattina world
Sections: apricot hero under a yellow awning (Buongiorno, + giant CRÊPES, featured crêpe with price + live market status, booth placeholder beside) → intro (caps left, Playfair + body right) → yellow menu field, two ruled `<table>` columns → brown field, cream card beside a credited griddle photo with 3 menu-derived facts → "A morning at the stand" scroll-snap strip (user-controlled, no marquee) → sage WHERE/WHEN per market + Say hi + Heads up → brown footer with full-width wordmark. Mobile sticky Directions/Instagram bar (<600px) after the hero leaves.
Not taken from mornibali: its photos, gradient shade, pill buttons, palette, condensed face, sticker, dashed coupon border, map iframe.
Inspect: headline lines fixed (shorter H2s), eyebrow fixed (featured block before buttons), footer rule removed. Defended: grey-body 6.8:1 (ink-deep on apricot, AA), side-scroll (intended strip), Montserrat/palette/3 faces (brand).
Media agent: hero video palm-sunset (CC BY 2.0), 6 new credited photos; `data/credits.ts` rewritten with all found media + `heroVideo`.

## Round 2 — section plan (art director) applied: globals + Home (main builder)
Globals: layout = header (fascia, headroom: hides on scroll down) → awning → first field; `meta.media` lets the awning hang over the Home video. `CloseCta` = two painted planks (apricot/yellow) + action, different lines per page. `PageHero` split/type variants with a required side. `ShootSlot` = coloured 4:5 frame, no mini awning. New `Faq`. `WordList` heads Montserrat 600 (Playfair only for sentences). Footer credits generated from `data/credits.ts`.
Home: `HeroVideo` (palm-sunset loop, poster webp 90 KB / mobile 55 KB, sources injected after reduced-motion + Save-Data check, pause off-screen and on tab hide, Pause/Play button, credit under the video, cream board overlapping the video's bottom edge) → `PillarExplorer` (3 services + all three; example party lights up) → apricot stations band with scroll-stepped `StationRotator` + credited griddle photo → Picnics | Bloom Cart halves (Vanderbilt Beach, flower buckets, credited) → "At home or on the beach" with full-bleed Naples Pier → origin with live `MarketStatus` → planks close with the four next steps. Removed: EventAnatomy tiles, "How it goes" icon columns, yellow close band.
Inspect: headline-lines fixed (H1 "Your party, one team"; stations title sized to 7 cols; planks nowrap at 5.2vw). Defended: eyebrow = photo figcaption credit above the next heading; size-count 10; Montserrat/palette/3 faces brand.
/crepes: kept "Buongiorno, / CRÊPES" (Luka asked for mornibali as the model, whose hero is exactly greeting + giant word) — AD note overruled on purpose; 2 px rule above the featured crêpe replaced by a yellow plank.

## Builder B — Bloom Cart / How We Work / About / Inquire
Section plan §3 B1–B3, W1–W3, A1–A5, I1–I3 + G3/G4/G5/G9/G10/G12. Shared components used as they are (none edited).

**Bloom Cart** (sage field, apricot awning)
- B1 split hero: decorative `BrandSign` replaced by `FoundPhoto flowers` 4:5, `object-position: 100% 50%` (right ~53 % only, so "Gulik" is cut), ≤ 520 px. Caption "A flower-market stall. Not our cart, and not a Una Mattina event." The credit line is set in `--ink-deep` on sage (the default `--ink-muted` fails there).
- B2 cream: `sign-l` "How it works", `<ol>` of 3 rows (`sign-m` clause + italic note, 40 px apart, no numerals, no cards), then the statement; a sticky `ShootSlot tone="yellow"` 4:5 on the right (5 cols). This replaces the 3 staggered cards and the separate slot section.
- B3 yellow band: H2 "For showers and parties" + plain "Ideal for" list + cream-deep "Custom details" board, columns 5/3/4 (≥1100), 2 columns at 768–1099.
- Close: planks "Bring the / Bloom Cart" → /inquire?services=bloom.

**How We Work** (apricot field, yellow awning)
- W1 `layout="type"`: "Simple for you" on 1 line at 1440 (134 px). The `.btn-ink` "Send an inquiry" sits on the left of the 7/5 row, the statement on the right in `--ink-deep`.
- W2 cream: three `<section>` phases (Before you book · While we plan · On the day, and after). Each has a sticky `sign-m` title (5/7 grid, 4/8 at ≥1360 so "ON THE DAY," stays at 2 lines at 900–1359) and an `<ol start>` that keeps the journey order for assistive tech, with no numerals drawn. Steps are `title`-weight step-2 + italic sentence. Removed: the 3×3 grid, the numerals 1–9 and the random tints.
- W3 yellow band: the staffing rule as a statement (max 36 px, 8 cols) + the permits note (4 cols, bottom-aligned).

**About** (yellow field, apricot awning)
- A1: apron `ConceptImage` capped at 320 px (240 px on mobile). Added `.btn-primary` "Start an inquiry" (yellow field, G3) because the hero had no action.
- A2: three apricot suns at 30 % / 65 % / full behind a shared clipped horizon, unequal columns 5/4/3 (≥1100, stacked below), `sign-m` "Market, today" / "Events, next" / "A café, one day", plus `MarketStatus` + "Find the stand" under Market. The suns rise once (translateY, 560 ms ease-out, 120 ms stagger). Without JS and under reduced motion they render in their final position. Removed: the cards, the italic eyebrows and the visible H2 (now sr-only).
- A3 apricot band kept.
- A4: Positano photo and its invented caption ("the beach clubs our stripes come from") **deleted**. Full-bleed `FoundPhoto lemons` 21:9 with a top crop (16:9 under 768), caption "Amalfi lemons on a wall in Italy. Not a Una Mattina photo." Then 5/7: "Mornings, Gulf light" | body.
- A5 cream-deep, compact: H2 + `<Tbc>` founders | `ShootSlot apricot` 1:1 (≤ 400 px). **Script sign-off removed** (the footer keeps the page's one script).

**Inquire** (apricot field, yellow awning)
- I1 compact split: no lead. Side = statement + "We reply <Tbc>". Bottom padding 48–72 px; the first legend and the name field are in the first screen at 1440×900 and 390×844.
- I2: the form spans cols 1–7. New `components/InqSummary.vue` (a `<dl>`) shows "Your event so far" in a sticky cream-deep board at cols 9–12, `aria-live="polite"`. The city value settles after 700 ms, so typing isn't read out per keystroke. Under 900 px it is a `<details>` directly above the submit button, rendered only when open.
  - Legends are Playfair questions: "Who are we talking to?", "What are you celebrating?", "When and where is it?", "How many guests?", "What would you like help with?", "Anything else we should know?" (a label). "(required)" is in Montserrat 14 px.
  - Submit is `.btn-primary` (cream, G3) and full width on mobile.
  - Validation: focus goes to the first error (focus is mapped per field; the old code tried to focus a `<fieldset>`, which can't take focus). Radios carry `aria-invalid`, chip groups get a danger border, and errors clear live after the first attempt.
  - On success, focus moves to the status block.
  - `?services=` / `?stations=` prefill kept. Prefilled stations now also tick "Live stations".
- I3 yellow band: "What happens next" + 3 statements (no numerals, reply time `<Tbc>`) + `Faq` "Why is there no price list?".

**Checks**
- shoot.mjs: only `default-font` (Montserrat brand exception).
- check:tokens: only the missing `public/og.png`.
- Headings (h1–h3, legends, planks): ≤ 2 lines at 360, 390, 600, 768, 900, 1024, 1100, 1199, 1280 and 1440, with no horizontal scroll (Playwright measurement). PageHero's `sign-l` ran to 3 lines between 900 and ~1279 px. I fixed that per page with a `:deep(.ph__title)` size, and it should move into PageHero (see below).
- Form, tested with Playwright at 1440 and 390:
  - Empty submit: 5 errors, focus on `#f-name`.
  - Name only: focus moves to `#f-email`.
  - Keyboard Space selects a radio. The summary updates and the mobile `<details>` sits right above the submit button.
  - Valid submit: "Thank you, Maria…", focus on the status block. No console errors.

**Inspector** (`--allow palette-claude`, run from `.inspect-b`)
- Fixed:
  - HWW: the rule statement was read as a 3-line headline (38 px), now ≤ 36 px.
  - About: the photo credit was read as an eyebrow, now with more space above the H2.
  - Inquire: chips were read as eyebrows above the legends (group gap now 76–88 px), and the hidden summary `dt` was read as an eyebrow (summary now lazy).
  - Bloom Cart / Inquire `still-page` FAIL: one reveal block per section added (list / board / FAQ / legends).
- Defended:
  - `few-pictures` (Bloom 1, About 2, HWW 0, Inquire 0): there are no real event photos. AI crops are capped at 240–320 px (G12), and the plan deliberately uses ShootSlots and defers the "day by the clock" strip.
  - `no-footage` on inner pages, `size-count` (brand type scale), `palette-cream`, `font-count` (3 brand faces).
  - `still-page` WARN: G9 allows one authored moment per page.
  - Inquire `mixed-font-headline`: plan I2 sets "(required)" in Montserrat inside the Playfair legend.
  - Inquire `first-action` at 768/390: the first field is the action, and a jump button would be clutter.
  - Statements at 3 lines (≤ 25 words, allowed).

## Builder A — Services / Live Stations / Picnics
Section plan §3 (S1–S5, L1–L3, P1–P3 + planks close), G3/G4/G5/G9/G10/G12. Files: `pages/services.vue`, `pages/live-stations.vue`, `pages/luxury-picnics.vue`, `components/StationCounter.vue`, new `components/LsStationList.vue`. Headline lines checked with a Playwright line counter (`.inspect-a/lines.mjs`) at 360/390/600/768/834/900/1024/1100/1280/1440. Every h1/h2/h3 is ≤ 2 lines and every statement ≤ 3 lines at all of those widths. No horizontal overflow. `check:tokens` ok.

**Services.** S1 split hero: H1 + one-line lead + `.btn-ink`, with the "one person leads your event" statement (ink-deep) in the side slot. At 900–1440 that statement uses `clamp(1.375rem, 2.3vw, 2.25rem)` so it stays at 3 lines, and it follows the copy-deck wording ("from first call to last box packed"). S2 is a 5/7 grid from 1024 up: the H2 is capped at `min(4.1vw, step-4)` because "COORDINATION" overflows 5 cols at full sign-l. The two lists are plain `WordList`s, with no cream-deep boxes. S3 is the yellow band: a full-width H2 (8.4vw under 600px so it stays at 2 lines), then columns 3/5/4, with florals widest and carrying the Playfair statement. S4 uses `FoundPhoto` cannoli in 4 of 12 cols (≤ 430px), captioned "Sicilian cannoli. Not our station.", next to a 7-col text column with `.btn-outline`. The crêpe-cone AI image is gone (G12). When stacked, the text comes first so the photo credit never sits above the H2. S5 partners: the rule statement was moved out (it belongs to How We Work), and "You still talk to one person." is kept as the statement. Per-item list staggers were removed (G9).

**Live Stations.** L1 is the `type` hero: sign-xl capped at `min(step-5, 9vw)` from 600px up. Without the cap it ran to 3 lines at 768. Lead + `.btn-primary` (on the yellow field) | statement. L2 adds the H2 "Six stations" plus the TBC line, then the new `LsStationList`: 6 rows with sign-m names and step-1 Playfair notes, 48–64px apart, no rules. A sticky frame (top 96, width capped so frame + caption fit the viewport) swaps by IntersectionObserver (`-45% 0px -45% 0px`). Crêpe → griddle, Cannoli → cannoli, the other four → apricot `ShootSlot`. The crossfade is opacity, 240ms ease-out. Hidden layers get `visibility:hidden` + `inert`, and the active row's name sits on an apricot plank (scaleX). Under reduced motion there is no transition. Below 900px there is no sticky frame, just one griddle photo above the list, 88px clear of the first name so the credit doesn't read as an eyebrow. L3 is a cream-deep band, 5/7 from 1100 up: H2 "One counter, many stations", body, and the Playfair sentence "Coming later: …" built from `comingLater`. `StationCounter` now has `id="counter"` on its section. Its legend reads "Pick up to three, then ask us about them." with a separate "1 of 3 picked" count. Selected chips use the apricot fill (same as InquiryForm), names are step-1 so three fit, and the fieldset/grid `min-width:0` fixes an overflow the awning strip caused. Its mini awning is the page's one strip. The old full-width ShootSlot section is gone.

**Luxury Picnics.** P1 split hero: H1, lead, `.btn-ink`. The side holds a Clam Pass `FoundPhoto`: 4:5, ≤ 480px, with a CSS crop to the top 55% of the frame, x 460–993 of 1600 (sun and sea only; the boardwalk and beach sign are out). It hangs 64px below the field (40px on mobile), and its caption sits on cream. P2: a cream-deep signboard ("What it can include", title-size h2) | a `dl` with Where / Who it's for in step-2 Montserrat sentences, then a yellow `ShootSlot` 3:2 (≤ 630px wide, so it never passes 420px tall). The "Who it's for" sentence was shortened to 11 words so it stays at 3 lines. P3: the yellow band replaces sage. H2 sign-m "Public places have rules" + statement | `Faq` with 2 questions. The public-place answer comes from PRODUCT/copy (rules + permits confirmed before booking). The weather answer is `tbc`. "How long does setup take?" was dropped because it would also be TBC (G11).

**Inspector** (`--allow palette-claude`, per page):
- `default-font`: Montserrat, brand exception.
- `no-footage`: inner pages, accepted.
- `size-count` (10–12): fluid brand scale plus capped sign sizes, defended.
- `palette-cream`: the cream ground is a brand decision (DESIGN).
- `still-page` WARN: awning drop + heading reveals only, per the G9 motion budget. Picnics had been a FAIL with 6 moving elements; it now reveals the board title and the FAQ block, which brings it to 8.
- **`few-pictures` FAIL on all three (1 / 2 / 1): defended, not fixed.** Una Mattina has no photography of its own yet. The plan fills the remaining spots with labelled `ShootSlot`s and allows only honest world photos where they relate. Padding with extra unrelated world photos or AI crops above G12 sizes would be worse than the counter. This resolves when the styled shoots arrive.
- Fixed during the rounds: eyebrow (photo credit above an H2, on Services and Live Stations), covered-text (stacked frame layers), statement-length (Picnics dd), headline wraps (Live Stations at 768, "One counter" at 1024, Picnics P3 at 900).

Notes: at 2× the Clam Pass crop is about 1.1 source px per CSS px (soft on retina). A pre-cropped 4:5 asset of about 900×1125 would fix it (media task).

## Image pipeline fix (main builder, after reviews)
P0 from motion-perf review: CSS-syntax `sizes` made @nuxt/image v2 emit 1w/2w srcsets (2×2 px photos). Fixed: `image.screens` adds `lp: 900`; FoundPhoto default `sizes="sm:100vw lp:520px"` + `eager` (fetchpriority/preload); ConceptImage default `sm:100vw` + `eager`; call sites use Nuxt syntax (pier/lemons `sm:100vw xl:1440px`, halves 720/420, picnics 480 eager, bloom 520 eager, LsStationList 360/440). Graded crops from the imagery editor wired in `data/credits.ts` (with "cropped, colour-graded" in captions). Picnic `width:300%` hack and Bloom object-position removed. CLS: `:where(.found|.concept|.slot) { margin: 0 }` so parent margins win in production CSS order.

## Events fixer 2 — About / How We Work / Bloom Cart / Inquire (2026-10-18)
Files: `pages/about.vue`, `pages/how-we-work.vue`, `pages/bloom-cart.vue`, `pages/inquire.vue`, `components/InquiryForm.vue`, `components/InqSummary.vue`. Adopted fixer 1's `v-lines` (headline rise) on every section H2 and the Bloom step clauses; `v-reveal` is left only on single blocks (HWW rule statement, Inquire "next" list, Bloom custom-details board). Tools: `.inspect-e2/frames.mjs` (scroll/time frame recorder; `SLOW=` CDP playback rate, `CLIP=` selector; `sheet` contact sheet), `el.mjs`, `lines.mjs` (heading line count 360–1440), `form.mjs` (form states). Frames: `review/motion-frames/{about,how-we-work,how-we-work/swap,bloom-cart,bloom-cart/steps,inquire/board}/sheet.png`.

**Signature moments (one per page, transform/clip only, final state without JS or under reduced motion)**
- About A2, the sunrise: the three suns now sit over a real horizon. The sky row and the text row share one column template (5/4/3 ≥ 900, 3 equal ≥ 700); the text lives on a full-bleed cream-deep "land" band whose top edge clips the suns (no rule). Mobile: one row of three suns above the stacked texts. With `animation-timeline: view()` the rise is scrubbed by scroll (market → events → café, staggered ranges cover 0–30 / 8–40 / 16–50 %, `--ease-out`), then latched: once the horizon passes 40 % from the top the animation is dropped and the suns stay up ("once it is morning it stays morning"); this also keeps full-page screenshots correct. Browsers without scroll timelines get the old one-shot IO rise (560 ms, 120 ms stagger).
- How We Work W2, the repainted signboard (≥ 900, JS): one sticky board in the left column for the whole journey; when a phase's top passes a reading line at 40 % of the viewport, the old title slides up out of the board and the new one rises in (560 ms ease-out, direction follows the scroll, off-board titles `visibility:hidden` after they leave). The real phase H2s stay in each section (visually hidden in board mode); the board is `aria-hidden`. No JS / < 900: each phase keeps its own sticky H2 (old behaviour). Active phase is computed from positions, so it is correct at the top, after jumps and when scrolling back.
- Bloom B2: H2 renamed "From bucket to bouquet" (P2-15); each step clause rises out of its baseline as it reaches the eye (`v-lines`, 80 ms index offset when several enter together); notes stay still.
- Inquire, the board reacts: each changed answer rises into its row while the old one leaves upward (240 ms, Vue `<Transition>` in one grid cell, interruptible, leaving copy `aria-hidden`); an apricot sun climbs from behind the board's top edge as rows fill ("n of 6" beside the title) and is fully up once the inquiry is sent (title becomes "What you sent us"). The thank-you card enters with `m-follow`.

**Review items done**
- About: suns as a composition (P2-12); A5 compact, slot ≤ 320 (P2-13); mobile lemons `object-position: 0 0` (C7); hero button full width < 768; sky padding 0.6× section; eyebrow flag at 768 fixed by the 3-column layout.
- HWW: mobile H1 `clamp(2.75rem, 13vw, 3.5rem)` (P2-7, 2 lines at 360); hero button full width; W3 band padding 0.7×, note at step-1 (P2-8); statement size has a rem term (a11y #22); step-list and note reveals removed (motion budget).
- Bloom: ShootSlot tone sage (P2-11, no yellow next to the yellow band); hero button full width; title 2 lines at all widths.
- Inquire / form: legends/labels no longer reveal (6 removed) and the FAQ reveal is gone; TBC chip on the yellow band is ink (P1-6, local); `.inq` `minmax(0,1fr)` + `overflow-wrap:anywhere` on the email (thank-you at 360: scrollWidth 360); submit uses `aria-disabled` + a guard instead of `disabled`, so focus never drops to body, and focus is put back on the button after an error; 15 s AbortController timeout with its own message; error message links `mailto:`; `min` = today (Naples) + a "date has passed" error in the focus order; `maxlength` 120/254/40/160/4000 with a counter from 3,500; chips `user-select:none`, no touch callout, 1 px press; selected state no longer colour-only: a drawn marker (circle = pick one, square = pick any) gets a dot or tick, border stays ink, width never changes (a11y #12); "(pick any)" on the services legend; date input focus ring (a11y #14); radios carry `aria-describedby` to their error (a11y #15); summary is no longer a live region (a11y #11); mobile summary shows "n of 6".
- Verified: form (empty → 5 errors, focus #f-name; past date → error + focus #f-date; 500 → alert + focus on button; hung API → "taking too long" at 15 s, focus on button, Enter while sending ignored; success → focus on thank-you); headings ≤ 2 lines and no horizontal overflow at 360/390/768/1024/1280/1440 on all four pages; reduced motion: suns at final heights, nothing left at opacity 0; `check:tokens` ok.
- Inspector (`--allow palette-claude`): remaining FAIL is `few-pictures` on all four (About 2, Bloom 1, HWW 0, Inquire 0), defended as before (no own photography until the styled shoot; ShootSlots hold the places). WARN defended: `size-count`, `no-footage`, `palette-cream` (brand), Inquire `mixed-font-headline` ("(required)" in the Playfair legend, plan I2) and `first-action` (the first field is the action).

**Needs a shared change (not my files)**
- `PageHero`: a `#lead` slot (or `leadLang`) so About can mark "Una mattina" with `lang="it"` (a11y #21).
- `FoundPhoto`: an `unveil` prop like ConceptImage's, then About's lemons band can use it (I will not pass an undeclared attr).
- `server/api/inquiry.post.ts`: server-side length/type limits and the 32 KB cap (break-mobile #11); the client limits are in.

## Events fixer 1 (2026-10-18)
Scope: layout, header, footer, shared components, motion system, Home / Services / Live Stations / Picnics. Inputs: design-review, imagery, break-mobile, motion-perf, a11y. Frames: `review/motion-frames/` (recorded at 1/5 speed through CDP `Animation.setPlaybackRate`; `sheet.png` per sequence).

**Valance.** `layouts/default.vue` now hangs `<Awning variant="valance">` (stripes 14/16 px, ~18 px tall) under the fascia. It unrolls once per visit (`useState('valance-dropped')`); later navigations only crossfade the field colour (header, valance stripes and field: background-color 240 ms). Home (`meta.media`): the scallops overlap the video by one radius. The hero video got the freed height (`100svh - 220px`, CTA bottom ≈ 862 at 1440×900). `theme-color` follows the page field.

**Motion system** (`assets/css/motion.css` + `plugins/reveal.ts`, one IntersectionObserver, nothing hidden without JS / under reduced motion / in the first viewport, navigation-aware):
- `v-lines` — headline lines rise from their own baseline mask. Splits by rendered line at play time (after fonts), restores the plain text node afterwards. Used on every section H2 of my four pages.
- `v-unveil` (or `unveil` prop on `FoundPhoto` / `ConceptImage`) — picture unrolls top-down (clip-path) while the image settles 1.06 → 1.
- `v-reveal` — cleaned up (shared observer, unmounted cleanup, inline transition removed, 16 px).
- `v-stage` — sets `data-stage="armed" → "in"` for component-authored choreography (CloseCta planks).
- `.m-line > .m-line__i.m-rise`, `.m-follow`, `.m-lift` — CSS-only load versions (SSR-safe) for heroes.
- Page transition `page` (out-in): leave fade 160 ms, enter fade + 12 px 240 ms.

| Element | Property | Duration | Easing | Trigger | Reduced motion |
|---|---|---|---|---|---|
| Valance | clip-path inset (top-down unroll) | 560 | ease-out | first load only | static |
| Field / header / stripes on route change | background-color, color | 240 | ease-out | navigation | instant |
| Page content | opacity (+ translateY 12 → 0 on enter) | 160 out / 240 in | ease-out | navigation | opacity only (0.01 ms) |
| Home H1 lines | translateY 118% → 0 in mask | 560, +70/line, 140 ms delay | ease-out | load (CSS) | static |
| Home board | translateY 24 → 0 | 560, 80 ms delay | ease-out | load (CSS) | static |
| Home statement / actions | opacity + translateY 10 | 560, 260 / 340 ms | ease-out | load (CSS) | static |
| Hero video | opacity 0 → 1, once | 560 | ease-out | first `playing` | no video until Play |
| Still-poster fallback | scale 1.04 → 1, ends | 5 s | ease-out | load, `still` only | static |
| Inner hero title (PageHero) | translateY in mask (one sign) | 560, 60 ms | ease-out | load + navigation | static |
| Inner hero lead / actions | opacity + translateY 10 | 560, 240 / 320 ms | ease-out | same | static |
| Inner hero side (may be LCP) | translateY 16, no opacity | 560, 320 ms | ease-out | same | static |
| Section H2 (`v-lines`) | translateY in line masks | 560, +70/line | ease-out | enters viewport, once | not armed |
| Supporting block (`v-reveal`) | opacity + translateY 16 | 560, 120–200 ms | ease-out | enters, once | not armed |
| Photos (`unveil`) | clip-path top-down + img scale 1.06 → 1 | 560 | ease-out | enters, once | not armed |
| CloseCta planks | ::before scaleX 0 → 1, then words rise | 560, plank 2 +100, words +140 | ease-out | enters, once | not armed |
| Header headroom | translateY −100% | 240 | ease-out | scroll (rAF) | instant |
| Header background | field → cream crossfade | 240 | ease-out | scrollY > 8 | instant |
| Header link underline | scaleX | 240 | ease-out | hover (fine pointer only), active route | instant |
| Mobile sheet | clip-path top-down | 240 in / 160 out | ease-out | Menu | instant |
| PillarExplorer row | apricot plank scaleX + 4 px ink edge scaleY | 240 on / 160 off | ease-out | click | instant |
| PillarExplorer pieces | yellow plank scaleX, 20 ms × min(n,3) | 240 on / 160 off, no delay | ease-out | click | instant |
| StationRotator | roller: old label out −105%, new in from 105% at once (reverse on scroll up) | 240 | ease-out | scroll step (rAF) / click | static list |
| StationCounter sign | drop translateY −18 → 0 + opacity | 560 / 160 | `--ease-spring` (only spring on site) | pick | instant |
| StationCounter neighbours | FLIP move | 240 | ease-out | remove | instant |
| LsStationList frame | incoming opacity over opaque outgoing + img 1.04 → 1 | 240 / 560 | ease-out | row in mid-viewport | instant |
| LsStationList name plank | scaleX | 240 | ease-out | same | instant |
| FAQ answer | opacity + translateY −6 | 240 | ease-out | open | none |
| Buttons / chips | 1 px press | 160 | ease-out | :active | — |

**Fixes (reviews).**
- Video: Pause freezes the frame (video fades in once, never back to the poster). One `sync()` decides playback (loaded, not user-paused, on screen, tab visible) for autoplay *and* reduced-motion Play. A 404 / unsupported source falls back to the still poster and removes the button. The toggle stays top-right until 1200 px, clear of the board. Drawn pause/play glyph. Hover only on fine pointers.
- Rotator: plank sized to the longest label (no width jump), `sign: 'Cocktails'` in `data/stations.ts` so no wrap and no overflow at 320; `.stations__grid` minmax(0, 1fr).
- StationCounter: three fixed places with "Add a station" boards, legend "Pick up to three.", check-mark on picked chips, `aria-disabled` at the limit (announced), short live status, CTA hidden behind a hint when nothing is picked.
- PillarExplorer: starts on Planning; one debounced-style status line instead of a chatty live list; capped stagger.
- LsStationList: no crossfade dip; no `inert` swap while focus is inside the frame; mobile lead photo is the cannoli (griddle no longer repeats).
- Header: rAF + ResizeObserver; sheet scrolls in landscape, locks the page, closes on outside tap, Escape returns focus to Menu; `@focusin` unhides; 44 px logo target.
- Home: H2s ≤ 2 lines 320–1440 (pillars `calc(4vw + .45rem)`, stations `calc(4.4vw + .4rem)`, origin 900–1199, where < 600); Vanderbilt replaced by a warm 3:2 Clam Pass crop (`clam-pass-gulf-3x2.jpg`, 1440×960 from the 3840 px original, UM warm v1, entry in `img/world/credits.json`); griddle 1:1 crop at 50% 45%, max 440; "We set up at …" copy (also in copy.md); origin H2 "Still at the market"; occasions list step-1 with 0.7 em gaps; non-breaking hyphen in "pack-out"; pier 4:3 under 768; 44 px text-link targets; stacked halves/origin spacing so credits never read as kickers (inspector 0 FAIL).
- PageHero: `#lead` slot (falls back to the `lead` prop). API: known service/station ids only, wrong field types → 422, area ≤ 120.
- Services: S3 florals statement moved under its list; cannoli unveil. Live Stations: H1 fits at 320. Picnics: slot apricot (no yellow on yellow).
- Shared: `--on-accent #4E2412`; `Tbc` brown chip + sr-only parentheses; PageHero full-width mobile buttons, short titles larger on phones, 320 px sizes; `BrandSign` unique clipPath ids (`useId`); new-tab sr text on credits; footer: credits deduplicated and only for shown media, 44 px link targets, cream focus ring; `:focus-visible` uses `--focus-ring`; global `::placeholder` contrast; `scroll-padding-top` 76/96; `.sign-*` overflow-wrap; hover rules gated to `(hover: hover) and (pointer: fine)`; reduced-motion kills delays; `.wrap` safe-area padding; `viewport-fit=cover` + `theme-color`; `watch: ['site.config.ts']` (lang now `en`); `motion-v` module removed; Montserrat preloaded (`display: optional` for the script face breaks @nuxt/fonts resolution in production, so it was not kept); `/api/inquiry` type-checks and caps every field, 32 KB body limit; ConceptImage `drift` is a 5 s settle that ends.

**Checks.** Headings ≤ 2 lines and no overflow at 320/360/390/768/900/1024/1280/1440 on all eight Events pages (`.inspect-e1/check.mjs`); no console errors/warnings; reduced motion: nothing left hidden, Play works and pauses off-screen; no-JS: heroes render final; production build (scratchpad): CLS 0.000 on /, /services, /live-stations, /luxury-picnics, /bloom-cart, /about at 1440 and 390; `check:tokens` ok; shoot.mjs only `default-font` (brand); taste inspect: Home 0 FAIL; inner pages only `few-pictures` / `no-footage` / `size-count` / `palette-cream` (brand + no own photography yet, defended as before).

## /crepes v3 — hero + motion (2026-10-17/18)
Owner brief: "hero mora bolje, animacije moraju bolje, sve mora bolje" + mid-run changes from Luka (mornibali hero composition, no top awning, his AI hero image, responsive 320→2560).

**What changed**
- Hero (`components/CrpHero.vue`, nav in `components/CrpNav.vue`): full-bleed picture from the top edge (Luka's AI concept image `assets/brand/hero-crepes-luka-ai.png` → `public/img/crepes/hero-ai-{1920,1280}.webp`, portrait `hero-ai-m-{828,640}.webp`, preloaded, `fetchpriority=high`), label "Concept image · placeholder until our own shoot". Nav over the photo: wordmark · apricot pill of in-page links (3-col grid `1fr auto 1fr`, nowrap, pill hidden < 900 px) · cream "Find us ↗". Bottom-left: Playfair "Buongiorno," + CRÊPES (Montserrat 700, −0.035em, 0.86 leading; tested 500/600/700/800 — 700 is the punch closest to mornibali's condensed heavy while still reading as the brand's geometric Montserrat; 800 clogs the counters) + lead + "Get directions ↗" / "See the menu". Bottom-right (desktop): the featured crêpe + live market line on a solid brown signboard flush to the corner with a slim apricot valance on its top edge; on phones the same board is a band holding lead + featured, while greeting, word, market line and both actions are in the first screen (checked at 320×640, 360×640, 390×844).
- Text over the photo: flat `--field-dark` layer with `mix-blend-mode: multiply` (0.72 desktop / 0.66 phone; multiply keeps the food warm instead of greying it), plus the solid signboard behind the small text. Measured by sampling the pixels under every text box with text hidden (`scratchpad/tools/contrast.mjs`), 98th-percentile brightest pixel: body text ≥ 4.5:1 at 320, 360, 390, 414, 600, 768, 1024, 1280, 1440, 1920, 2560 (lowest: status at 600 px 4.86, lead at 1920 4.98); CRÊPES ≥ 4.46 (needs 3); greeting ≥ 4.7 (large text).
- Page font: the global @nuxt/fonts setup serves Montserrat **400 only** (500/600 are browser-synthesised site-wide). /crepes self-hosts the OFL variable latin file (`public/img/crepes/fonts/montserrat-latin-var.woff2`, 35 KB) as "Montserrat Crp" in `layouts/crepes.vue`, scoped to `.crp`.
- Pills on /crepes only (`.crp-btn*` in the layout): the half-round ends repeat the half-sun; Luka asked for the reference's feel. Rest of the site keeps square buttons.
- Signature: `components/CrpSignFlip.vue` — the "A" turns 180° into the cone (half-sun → filling at the cone's mouth), caption swaps "Same symbol. A brighter day." ↔ "A sweeter way."; turns once on view, then it is a button (tap to turn, aria-pressed). Lives in the intro "One morning, one crêpe" so it doesn't compete with the photo.
- Menu: rows draw their rule then the words rise (one move). Card section: credited CC0 chocolate crêpe (Bigul Malayi, WordPress Photo Directory, Turin) replaces the griddle; the "$8–11 / 9 / To order" stat trio became three plain lines, price ranges computed from `data/menu.ts`.
- "A morning at the stand" (invented clock times, upscaled AI tiles, garbled napkin) → **"Made in front of you"**: 5 real CC0 photos of crêpe-making at another stand (Waaboi9l, Commons "Making of Crêpes" 01/03/07/09/13, cropped away from the Nutella jars), native momentum + snap, scroll-padding = gutter, progress bar (scaleX) + ←/→ buttons for pointer users, credit line.
- Visit → "Find the stand" (old H2 ran to 3 lines): market boards as tone steps (cream; the next market yellow), no rules, `minmax(0,1fr)` + `overflow-wrap:anywhere`; napkin AI image → `ShootSlot` yellow; `#follow` block is the target of every Instagram control while the URL is unconfirmed.
- Footer: wordmark rises out of its baseline, then its sun comes up. Meta line says pictures are placeholders.
- Sticky phone bar: brown with an apricot valance, Directions + Instagram; appears after the hero, steps aside while reading downwards, returns on scroll-up / at the end.
- Robustness: 0 markets / empty menu sections guarded; featured crêpe from all sections; `useMarketStatus` clock in `useState` (no hydration mismatch); "Saturday next week" when today's market has closed; landmarks header/main/footer outside each other (skip link works); `lang="it"`; "(opens in a new tab)"; focus ring cream on brown/photo; hover only under `(hover:hover) and (pointer:fine)`; controls ≥ 44 px, `user-select:none`.
- `Awning.vue`: new `variant="valance"` (stripe 14/16 px, body 8/10 px, scallop r = stripe/2 → 15 px phone / 18 px desktop, 160 stripes, unrolls with `clip-path` so scallops stay round); default unchanged except the keyframe now starts at scaleY(0.6) per DESIGN. Checked on `/` and `/services`.

**Motion spec** (all transform/opacity/clip-path; one easing family `--ease-out` cubic-bezier(.22,1,.36,1); spring only for the sign; sections armed by `v-inview` only if below the fold at load, never under reduced motion, never without JS; reduced motion = final state, no travel; global reduced-motion rule zeroes the CSS load animations)
| Section | Property | Duration / easing | Trigger | Reduced / no-JS |
|---|---|---|---|---|
| Hero photo | scale 1.06 → 1 | 1600 ms ease-out | load (CSS) | static |
| Nav | opacity + translateY(−8px) | 700 ms ease-out, +80 ms | load | static |
| Greeting | translateY(104%) out of its mask | 800 ms ease-out, +120 ms | load | static |
| CRÊPES | each letter translateY(104%) out of its own baseline mask | 900 ms ease-out, 180 ms + 55 ms × i | load | static |
| Circumflex | real Ê glyph clipped above cap height, drops from −0.45em | 620 ms spring `linear()` (≈8% overshoot), +760 ms | load | static |
| Lead / actions / board / status | translateY(14px) or translateX(24px) + opacity | 700 ms ease-out, 560–900 ms | load | static |
| Valance on the board | clip-path inset unroll | 560 ms ease-out, +1050 ms | load | static |
| Sign A → cone | rotate 0 → 180° around the mark's centre | 980 ms spring `linear()`, interruptible (transition) | in view (−25% margin) once, then tap | cone shown, tap swaps instantly |
| Menu | rule scaleX 0 → 1 left→right, then words rise 14 px | 720 ms / 560 ms ease-out, 70 ms per row | in view once | static |
| Card | slides over the photo: translateX(72px) desktop / translateY(48px) phone + opacity | 1000 ms / 320 ms ease-out | in view once | static |
| Made strip | tiles glide in translateX(64px) + opacity | 900 ms ease-out, 70 ms stagger | in view once | static; native scroll |
| Find the stand | market boards rise 28 px | 760 ms ease-out, 90 ms stagger | in view once | static |
| Footer | wordmark translateY(102%) → 0, then sun path rises 45% | 1000 ms, sun +700 ms | in view once | static |
| Sticky bar | translateY | 420 ms ease-out | past hero + scroll direction | instant |
| Controls | scale(.97) press, arrow nudge 2 px on hover | 120 / 240 ms | press / hover (fine pointer) | — |
Frames: `review/crepes-motion/{d,m}-*-sheet.png` (CDP playback 0.25×, 133 ms per frame); mornibali reference frames in `review/crepes-motion/morni/` (its motion = per-word fade/rise on headings, photos fading up from .35; ours is masked letter/row/line motion with one spring).

**Checks**: shoot.mjs — only the Montserrat brand exception. inspect (`--allow palette-claude`) — 0 FAIL; WARN defended: palette-cream (brand), size-count (fluid brand scale), grey-body 1:1 (the inspector reads cream hero text against the page ground, not the photo; measured ≥ 4.5 on pixels), no-footage (the only honest clips found are 640–720 px demos; a QR page on mobile data), side-scroll (the intended snap strip with arrows + progress). check:tokens ok. No horizontal scroll and every h1/h2/caption ≤ 2 lines at 320, 360, 390, 414, 600, 768, 834, 900, 1024, 1100, 1280, 1440, 1680, 1920, 2560 (`review/crepes-widths/`). Reduced motion and JS-off render all content (`review/crepes-motion/{reduced,nojs}-390-full.png`); no console warnings or hydration mismatch.

**Media** (`public/img/crepes/`, sources in `credits.json`, originals kept out of /public): hero = Luka's AI concept (labelled); `choc-crepe-*.webp` CC0 Bigul Malayi; `making-0{1,3,7,9}-600.webp`, `making-13-600.webp` CC0 Waaboi9l. The Paris counter photo (CC0, Aidan Meyer) was tried and dropped when Luka's image arrived.

### /crepes v3.1 — Luka's overnight notes (2026-10-18)
- **No visible placeholders**: hero label, "to confirm" tags (hidden on /crepes; `Tbc.vue` is now tag-less anyway), "Address to confirm" (shown as "Naples, FL"), "not our stand" captions and footer disclaimer removed. Facts still wrapped in `<Tbc>` (data-tbc). CC0 credit kept as one tiny line under the Visit photo.
- **"Folded hot" card + Turin photo and the 5-photo griddle strip removed.** Replaced by `components/CrpSequence.vue` — pinned scroll sequence (`#made`): one image layer (Luka's hero image, laid out at 2.2× and only scaled down) pans/zooms through 5 camera stops (wide → folded → berries → pour → hand) while 5 steps swap ("Made when you order / Folded while it is soft / Filled the way you like / A last drizzle / Into your hands, warm"). Progress from `getBoundingClientRect` in a rAF on window scroll (works with native touch and window-moving smooth scroll such as Lenis); hold 20 % at each stop, smoothstep travel, zoom interpolated in log space. Section height 100svh + 4×70svh, stage `position: sticky`. Phone: picture on top, text band at the bottom. Thumbnail strip (160 px crops) = progress cue + jump buttons (scrollTo smooth). Reduced motion / no JS: SSR default is a stacked list of the 5 steps with still 4:3 crops (`seq-*-800.webp`).
- Menu: a 7:3 band of the folded crêpes from the same image under the two columns; rows lean in on hover (name +6 px, price −6 px).
- Visit: credited CC0 Paris counter crop (4:5) instead of the ShootSlot.
- Hero: scroll-away parallax (picture translateY 22 %, words lift −14 % and dim) via CSS `animation-timeline: view()` (compositor; static where unsupported or reduced motion).
- Footer: `components/CrpWordmarkRise.vue` — wordmark rebuilt from the traced paths in 10 clipped slices, letters rise 55 ms apart, then the sun comes up.
- Checks: check:tokens ok; shoot.mjs only the Montserrat exception; inspect 0 FAIL — new WARN `pinned-over-picture`/`long-pin` are the intended pin (the text has its own column; the measured overlap is the oversized, clipped image layer's bounding box). Headings ≤ 2 lines and no horizontal scroll at 320–2560; reduced-motion and no-JS render all content; no console errors except a stale dev 404 for `Tbc.vue`'s removed style block (another agent's edit; gone after a dev restart).

## Events polish — no placeholders, smooth scroll, details (2026-10-18)
Owner brief (Luka): remove every visible placeholder; Lenis smooth scroll; "što više lepih detalja" within the motion system.

**No visible placeholders.** Full list (file + what) in `review/hidden-placeholders.md`.
- `Tbc` renders only its content (`data-tbc`, note in `data-tbc-note`): no chip, underline, tooltip or sr text. Keeps a one-rule style block so the dev server never asks for a missing style module.
- `ConceptImage`: label gone, `data-concept`, alts start "Illustration of …".
- `ShootSlot`: wordless brand panel, `aria-hidden`, `data-shoot-slot="<subject>"`. Motif `sun` (the mark's half-sun rising out of the lower edge, rises once on view via v-stage; yellow sun on apricot, apricot sun on sage/yellow — a cream sun read as a hole) and `mark` (close crop of the A over its sun, unrolls). Live Stations: the sun climbs station by station in the sticky frame. A cabana-stripe textile was tried and dropped (cream stripes dissolve into the cream page = barcode). No unused found photo fits honestly (Positano is blue and crowded, Vanderbilt was already rejected as cold), so panels everywhere a photo is missing.
- Contacts: `confirmed: false` flags in `data/site.ts`; email, phone (value emptied) and reply time render only when confirmed; the footer's contact is "Send us an inquiry"; Instagram shown, still `<Tbc>`.
- Credits: per photo one 13 px line "Photo: creator, licence" (links, thin 45 % underline, full on hover/focus); hero "Video: creator, licence"; footer one small credits line with title, creator, licence and changes (CC BY 2.0 asks for the title). All "Not our station / not one of our setups / Not a Una Mattina event" captions removed. Picnic FAQ "What if the weather turns?" filtered out until answered. About "Who we are": copy.md's own line + market link.

**Smooth scroll** (`plugins/smooth-scroll.ts`, lenis 1.3.27). On only for `(hover: hover) and (pointer: fine)` and not reduced motion; touch = native. `anchors` (glide respects `scroll-padding-top` / `scroll-margin-top`; hash + focus start are the browser's own fragment navigation — skip link verified: next Tab lands in main), `allowNestedScroll` (mobile sheet, textareas), `stopInertiaOnNavigate`. Route change: `lenis.stop()` in `beforeEach`, `start()+resize()` 120 ms after the page transition (router scroll restored first). Mobile sheet pauses Lenis (`$lenis.stop()`) and has `data-lenis-prevent`. Only the safe part of lenis.css is copied into main.css (no `overflow: clip` while stopped). Verified (Playwright, mouse.wheel): wheel glide; header headroom hides; PageDown/Space/Arrows/Home/End native, wheel continues from the key position; `#counter` lands at 96 px (= scroll-padding) with `#counter` in the URL; `/crepes #menu` at 95; route change opens at 0 and wheel works after it; back restores the exact position (2900 → 2900); sheet open = page does not move; focus scrolls a footer link into view; About suns still scrubbed (CSS scroll timeline), StationRotator/LsStationList/How-we-work board follow.

**Details.**
| Detail | What | Property | Gate |
|---|---|---|---|
| Parallax | Home hero footage (±3.5 %, layer scaled 1.08), Home pier and About lemons (±7 % of the frame, layer oversized in CSS so SSR/touch just show a closer crop) | `--py` → translate3d, written in Lenis' rAF | Lenis on |
| Valance flutter | scallop row stretches up to +50 % (4–5 px) with scroll velocity, eases back | scaleY | Lenis on, near the top |
| Buttons | next colour painted across left → right (560 ms), wiped off to the right on leave; text colour switches 120 ms in | scaleX ::before | hover (fine) + :focus-visible |
| Standalone links (`.link-draw`) | underline wipes off right and is drawn again from the left | scaleX ::after keyframes | hover (fine) + :focus-visible |
| Focus ring | settles from 9 px offset/transparent onto the control (240 ms) | outline (one element) | motion allowed |
| Home halves / stations | the picture leans in 1.04 while its link is hovered (`:has`) | scale | hover (fine) |
| Field colour | header + under-awning field cross-fade at 560 ms between pages | background-color | — |

**Fixes found on the way.** How we work had CLS 0.059 at 1440 (the single-board grid was switched on in `onMounted`): an inline head script sets `html.js` before first paint (nuxt.config) and the board layout is keyed on it (unscoped block; Vue `:global()` can't combine with scoped selectors); no-JS keeps per-phase sticky titles. Its board now also settles on `scrollend` (a jump could skip the reading line). Fonts: Montserrat is now the variable face `font-weight: 400 700` (site.config `weights: ['400 700']`); production build serves one variable file per subset and 400/500/600/700 measure different widths with `font-synthesis: none` (700 was missing before) — /crepes can drop its self-hosted copy.

**Checks.** Rendered text of all 8 Events pages + /crepes: no "confirm/placeholder/Concept image/Styled shoot/TBC/000-0000/not our/to come"; no console errors or warnings; `check:tokens` ok; shoot.mjs only the brand `default-font`; headings ≤ 2 lines + no overflow at 320–1440 on all 8 pages (`.inspect-e1/check.mjs`); production build (scratchpad): CLS 0.000 on all 8 pages at 1440 (Lenis, wheel) and 390 (touch); LCP 36–108 ms locally. Motion frames (Lenis wheel, 150 ms): `review/motion-frames/polish/<page>/` + `sheet.png`. /crepes renders, Lenis glides there, `#menu` anchor ok.

### /crepes v3.2 — round 4 (section-library.md §3.1–3.4 applied)
- **Made in front of you** (`CrpSequence.vue`) rebuilt: cream field; 4:5 frame ≤ 480 px (phones: full column, ≤ 56svh); the camera frames the crop table from §3.1 (counter → folds lower-left → cream/berry topping → pour → handed over), zoom computed per frame size and capped at 1.9 (≤ 1.2 CSS px per source px); in-out travel with a 40 % hold per step; step line rises through a mask (out 240 ms, in 560 ms `--ease-out`, +60 ms); index of the five titles (active full ink, others 35 %, click → scroll to the step via Lenis when it runs); counter in words ("Two of five" — the house rules ban "02 / 05" numerals, the inspector fails them) + 2 px rail; finale wipes the frame (clip-path, scroll-linked) to an apricot field with the cone mark (`CrpConeMark.vue`) and "At the market it leaves in a paper cone."; 30svh release scales the frame to .96. Copy no longer claims batter over a finished plate. Static (SSR / no JS / reduced motion): 2–3-col list of 4:5 stills (`step-*-600.webp`) + the cone card.
  - Resolution: `seq-source-3344.webp` (313 KB) = 2× Lanczos + light sharpen of Luka's 1672 px PNG, used only ≥ 900 px. Side by side at the step-3 crop it removes the webp blocking of the 1920 upscale but adds **no real detail** (Laplacian variance 55 vs 65, the higher one being block noise). **Luka should render the image at ≥ 3344 px**; drop it in as `seq-source-3344.webp` and every framing is Retina-crisp.
- Menu: band image removed; price range under the heading ("Sweet $8–11 · Savory $10–11", from data) rolls in with `CrpOdo.vue` (900 ms, +70 ms per digit, cubic-bezier(.16,.84,.24,1); the 0–9 strip is generated content, so it is never read as text; SSR = final number).
- Hero: open-now pulse on the status dot (renders only in the "open" state; ring 2000 ms linear; none under reduced motion); **curtain** — hero + intro share a wrapper, the hero is `sticky` (top = viewport − hero height, so a hero taller than the screen is seen whole first), the intro sheet slides over it; hero words drift −12vh and each block steps aside (opacity → 0, then visibility) just before the sheet reaches it; picture leans in to 1.06. rAF on window scroll (native + Lenis). Reduced motion: no curtain. Price on the board rolls (odometer, +1150 ms). Nav drops from −100 % (900 ms, +300 ms); the apricot pill opens from its centre (clip-path, 700 ms, +500 ms), links follow 80 ms apart. Phone tint 0.70.
- Find the stand: `CrpWeekBoard.vue` — next market first, today's day on an apricot plank, open-now pulse + opening-hours bar with a "Now" dot while open, closed-today rows at 45 % with "Back next Saturday"; rows rise in. Paris photo removed. "Heads up" + "Say hi on Instagram" beside the board.
- Instagram (`#follow`, cream-deep): the handle is the headline, one sentence, "Follow on Instagram ↗" only once the URL exists, four square cards (booth, crêpe cone, syrup pour, apron) dealt out from a stack on desktop (translateX, 900 ms, +80 ms each, no rotation), rising on phones.
- Montserrat: the global config now serves the variable 400–700 file; the page-scoped copy and `public/img/crepes/fonts/` are gone. 700 renders from the real file.
- Checks: check:tokens ok; shoot.mjs = the Montserrat brand exception only; inspector 0 FAIL (WARN: palette-cream, size-count, no-footage, pinned-over-picture/long-pin = the intended sequence pin and the hero photo); no horizontal scroll and headings ≤ 2 lines at 320–2560; hero contrast ≥ 4.5:1 body / ≥ 3:1 word at 320, 360, 390, 414, 600, 1440; reduced motion + no JS render all content; no console errors. Frames: `review/crepes-motion/{d,m}-{hero,curtain,menu,made,visit,ig,foot}-sheet.png`.

## Events round 3 — research patterns (2026-10-18)
Specs from `references/section-library.md` (§2 E1, E2, B3, B4, A4; §3.4 priorities 4–7).

**Home**
- **E2 stacked chapters** replace the "Made in front of your guests" band and the lopsided Picnics | Bloom Cart split. There are three chapters, each 100svh and `position: sticky; top: 0`:
  - Live stations: apricot field, griddle photo, the roller plank;
  - Luxury picnics: yellow field, Clam Pass photo;
  - Bloom Cart: sage field, flower stall photo.
  - Each next field wipes up over the last (pure CSS). Its top edge is a row of half-sun scallops in the field's own tone (`components/ChapterEdge.vue`, SVG pattern + a base strip that closes the hairline seams).
  - Not the striped valance the spec suggests: DESIGN allows one awning per page, and Home already hangs one under the header.
  - Layout: text bottom-left (7 cols); a 4:5 credited photo in the right column sized to the screen (`min(100%, (100svh − 250px) × 0.8, 560px)`).
  - Sticky only from 900 px, at least 600 px tall, with motion allowed. Otherwise three plain bands.
  - `StationRotator` now reads the pin track when its section is sticky: the stations step through while chapter 1 is pinned and being covered.
  - PillarExplorer stays as the "three parts + example party" section above the chapters; the chapters are the three signature things.
- **E1 occasions wheel** (`components/OccasionWheel.vue`) in "At home or on the beach":
  - Behaviour: 5-row window, middle row full ink, ±1 at 50 %, ±2 at 15 %; one row every 2 s with a 600 ms `cubic-bezier(.44,0,.56,1)` glide; seamless loop through a cloned list.
  - WCAG 2.2.2: a visible Pause/Play button (aria-pressed). It also holds on hover/focus, off screen and in a hidden tab.
  - The real `<ul>` is always in the DOM. The wheel is an aria-hidden copy, chosen in CSS from `html.js` (set by an inline head script) so there is no layout swap after hydration.
  - Phones (< 600 px), reduced motion and no JS get the plain list.
  - Tested: the loop wraps, Pause holds 4.5 s, Play resumes, hover holds.
- **B4 stair-step "what happens next"** under the closing planks (new `#after` slot on `CloseCta`):
  - four flat boards, cream-deep → yellow → apricot → brown, each standing ~52 px higher;
  - the mark's half-sun stands on the last ("the day");
  - static; "How we work, step by step" link.
  - Phones: the boards step inward.
- Hero add-ons (A4 + settle):
  - the header contents drop in from above on the first page of a visit (900 ms `--ease-out`, +120 ms; `useState`, so not on route changes);
  - the hero footage settles 1.14 → 1.08 (backwards fill, so the parallax owns the transform afterwards);
  - PageHero side pictures settle 1.04 → 1 over 1400 ms;
  - all off under reduced motion.

**How we work: B3 stacked boards + rail** (dollop / élan). The three phases are painted boards: apricot, yellow, then cream-deep with the half-sun rising from its lower edge.
- From 900 px (≥ 640 px tall, motion allowed):
  - each board is sticky one 18 px "lip" lower than the last, so the next covers it and the earlier boards' edges stay visible;
  - a sticky rail above them has a 2 px track, a scaleX fill (piecewise between board arrivals) and the three phase names, the current one in ink;
  - the rail leaves together with the stack.
- Sticky lessons (in the code comments):
  - a sticky box's margin box must stay inside its container's content box, so the spacing is on the next board's top margin and on an empty tail element. Bottom margin or padding stopped the last board from ever pinning.
  - `offsetTop` of a stuck box is its stuck position, so spans come from heights + margins.
- The single-signboard version is gone. Phones / no JS / reduced motion: the boards simply follow each other, with the H2s intact.
- The pinned rules sit in an unscoped `html .hw-journey …` block. Classes were renamed to `hw-*`, because `.board` is also used in InquiryForm and page CSS stays loaded in the SPA.

**Shared**
- Type stops growing at 1440 px on Events pages (`--vw: min(1vw, 14.4px)` in tokens; `.site` redefines `--step-*` with it). Page-level vw calcs use `var(--vw)`. This fixed 3-line headings at 1920; /crepes keeps the global tokens.
- Footer credits are now a `<details>` "Photo and video credits" (full title/creator/licence/changes at body size). Per-photo credit lines stay. The 13 px credits paragraph was the page's dominant running text and made the inspector read body = 13.8 px.

**Not done, on purpose**
- E3 Live Stations clip window: the only honest station picture is the 1000 px griddle photo. It is already the first frame of the station list right under it, and full-width it would be soft. No footage exists.
- E4 / B6: partial or optional.

**Checks**
- Headings ≤ 2 lines and no overflow at 320, 360, 390, 600, 768, 900, 1024, 1280, 1440 and 1920 on all 8 Events pages, with and without reduced motion.
- `check:tokens` ok; no console errors (dev and production); shoot.mjs only the brand Montserrat exception.
- Motion frames (Lenis wheel): `review/motion-frames/r3/<page>/sheet.png`.
- Production build in the scratchpad: CLS 0.000 on all 8 pages at 1440 and 390; LCP 28–96 ms locally. The 1.66 s on /services 390 is a lazy image picked up during the scripted scroll.
- Taste inspector (`--allow palette-claude`):
  - Home: 1 FAIL, `covered-text`. This is the chapter stack itself, the next field covering the last, and is the specified pattern.
  - How we work: `few-pictures` (no event photos exist) + `covered-text` (same stacking).
  - Defended WARNs: `long-pin` (3 screens: approach, pinned, covered; the rotator / rail change on each), `size-count` (brand scale), `card-rows` (the stair has stepped heights and four colours), `no-footage` / `still-page` on inner pages.
- Inner pages after the body-size fix: one FAIL each, `few-pictures`, as in earlier rounds; it can only be fixed with the client's own photos. Inquire's `mixed-font-headline` and `first-action` WARNs are unchanged from round 2 (italic statements are whole sentences; the form starts in the first screen on desktop).

### /crepes v3.3 — round 5 (review/final-crepes.md)
- P0-1: curtain only tucks hero blocks once the intro has entered (`top < vh − 1`). At rest, `#crepes-hero .is-tucked` = 0 at 320×568 … 1920×1080 (verified); the signboard + market line show.
- P0-2: phone frame fills its own grid row (height 100 %, 4:5 inside, ≤ 520 px; tablet ≤ min(680 px, 66svh)); screens under 520 px tall (landscape phones) get the static list. Frame bottom ≤ meter top verified at 320×568, 360×640, 390×664, 390×844, 768×1024; 667×375 and 844×390 static.
- P1-2: no Instagram control points at a block without a link: bar's second button is "See the menu" until `contact.instagram.url` exists; "Say hi" and the footer show the handle as text only.
- P1-4: Instagram cards are new 600×600 exports (booth, griddles on the stand without the mock price board, latte from the 2× source, apron from the merch board; 21–57 KB). Desktop ≥ 1100: handle + line left (5 cols), the four cards fill the right (7 cols, ≈ 190 px tiles) — no empty quarter, no 4th use of the plate.
- P1-5: sequence index inactive = `--ink-muted` (6.4:1), active = full ink, 700, apricot dot marker.
- P2: odometer invisible until it rolls (never "$0"); wordmark slices overlap 1.5 units (no seams); closed-today row = `--ink-muted` on a lighter tone (no 45 % opacity); status drops the market name when it repeats the day, "until 12 pm" nowrap; live dot apricot everywhere (outlined on cream); `#made` scroll-margin 0; "Tap or click the sign"; no aria-live on steps; side-board min-width 0 (no clipped price without JS); tablet 600–899 hero word min(24vw, 11rem); stills `fetchpriority=low`; headings with voice: "Sweet, savory, folded hot" (menu), "Come find the griddle" (visit) — copy for Luka to approve; menu head stacks under 1280 so it stays at 2 lines.
- Hero tint: lighter (0.66 phones / 0.54 desktop / 0.60 ≥ 1680, saturate 1.08 on desktop) with flat brown plates only behind small text (desktop lead plate, phone lead+featured band, signboard). Pixel-sampled 98th percentile, text hidden but plates kept: every body line ≥ 4.5:1 and every large line ≥ 3:1 at 320×568, 360, 390, 414, 600, 768, 834, 1024, 1280, 1440, 1680, 1920, 2560.
- Checks: check:tokens ok; inspector 0 FAIL; no overflow and headings ≤ 2 lines at 320–2560; reduced motion / no JS full content; no console errors.
- Still for Luka: confirm market days/hours/addresses and the Instagram URL before the QR is printed; re-render the hero from a text prompt (own composition: griddle + paper cone, outdoors, morning) at ≥ 3344 px — the current image follows mornibali's hero photo too closely.

### /crepes v3.4 — round 6 (review/final-crepes-verify.md)
- N1: `html:has(.crepes) { scroll-padding-top: 0 }` (layout): Menu / How it's made / Visit land at top 0 (measured 0, with Lenis at 1440).
- N2: odometer columns start one cell below (blank) and the strip is ordered 1…9, 0, so a roll never shows a 0 that isn't in the price (sampled every 40 ms: `___ → 1__ … 811`, `____ → 1___ … 1011`).
- N3: phone ghost "See the menu" gets a solid brown fill (<600 px).
- N4: tablet hero size only for screens ≥ 600 px tall; landscape phones size CRÊPES by height (min(13vw, 22svh)) — both actions in the first screen at 844×390 (bottom 317) and 667×375 (309).
- N5: the 2× layer is used from 600 px (tablets).
- N6: after the finale wipe the clip is dropped and the photo layer hidden; the card overlaps 1 px — no seam.
- N7: the cone sentence appears once (in the card); the end line reads "Then it is yours. / Enjoy it on the walk around the market." (copy for Luka).
- P2-14: the SSR stills carry a 1×1 `<source>` for ≤ 899 px, so phones download none of them; reduced-motion / short-screen visitors get the real stills (source removed on mount). Trade-off: a phone with JS off shows the step list without stills.
- Re-checked: no overflow, headings ≤ 2 lines at 320–2560; inspector 0 FAIL; check:tokens ok; reduced motion / no JS full content; no console errors; hero contrast passes at 320×568, 360×640, 844×390.

## Events round 4 — final review fixes (2026-10-18)
Source: `review/final-events.md`. Every P0, P1 and P2 item is addressed. The two exceptions are noted under P2.

**P0**
- The market line on Home "Still at the market" and About "Market, today" renders `<MarketStatus>` only when at least one market is confirmed (`markets.some(m => !m.tbc)`). Until then it reads "Find us at the Naples farmers markets." `MarketStatus.vue` is untouched; /crepes keeps its own behaviour.

**P1**
- Home hero, 768–1199:
  - the board is ~640 px, so the footage shows;
  - the video credit has its own third grid row, visible under the CTA (checked at 768 and 1024).
- Live Stations:
  - `ShootSlot` gets a `label` prop, painted top-left in sign capitals as large as the panel allows. The size is `min(13cqi, 84cqi / (longest word × 0.74))` with a container query, so "CHARCUTERIE" never breaks.
  - The four panels carry the station names, alternate apricot / yellow, and the sun climbs from 0.25 to 1.
  - The outgoing photo's credit is hidden at once during the cross-fade.
  - JS off (`html:not(.js)`): no sticky frame; the lead photo shows above the list.
- Luxury Picnics:
  - the hero credit is `--ink-deep` (6.6:1);
  - the single FAQ is plain text (question + answer);
  - the 630 px wordless panel is now an apricot "Where we set up" signboard listing Beach / Park / Private backyard / Poolside / Private property / Sunset spots in sign capitals, with the half-sun on its lower edge. It keeps `data-shoot-slot`.
  - "For proposals, anniversaries, …" now sits under the "What it can include" board.
- Hero video at desktop:
  - new `palm-sunset-1920.webm` (VP9 crf 39, 2.35 MB) and `.mp4` (H.264 crf 28, 2.84 MB), from the same 1920×1080 Commons source and the same 13.52 s cross-faded loop (`scratchpad/vid/enc.sh`);
  - `palm-sunset-poster-1920.webp` (150 KB) as a `<picture>` source ≥ 1200 px;
  - `HeroVideo` `sourcesLarge` is picked at ≥ 1200 px, or ≥ 768 px at DPR > 1.5. Verified in the network log: 1440@1 and 1024@2 get the 1920 clip, 1024@1 gets 1280, 390 gets 720;
  - `public/video/credits.json` updated.

**P2**
1. Pinned chapters: `.chap > .wrap { width: 100% }`. All three chapter grids are now the same width (checked 1440/1440/1440).
2. Statements on phones:
   - shorter copy for the chapter statements and the Home hero line (copy.md synced);
   - 19 px statements under 600 px, 17 px for the hero line under 360 px with tighter board padding;
   - no statement runs past 3 lines at 320–1280. The only 4-line italic is the StationCounter note, a board note, not a statement.
3. The hero Pause button now follows the board in the DOM (it is still drawn on the footage via the grid). Tab order: skip link, logo, nav, Start an inquiry, See what we do, Pause, credit.
4. Image density:
   - the picnic chapter uses the 960×1200 4:5 Clam Pass crop (was a 768 px-wide slice of the 3:2); the unused `clamGulf` credit was removed.
   - **Exception:** the apron (no source larger than 350 px exists: it is cropped 1:1 from `merch-mockups.png`) and the 21:9 pier (made from a 1600 px download) can only get sharper with a new download from Commons. That was not done in this round.
5. Inquire summary: one calm line until the first answer, then rows rise in as they are answered.
6. How We Work boards: yellow → apricot → cream-deep, so the first board is not apricot under the apricot hero.
7. About at 768–899: split hero (title 7 cols, apron 5 cols) instead of a 200 px picture in an empty field.
8. Services: the cannoli photo moved into the hero, so there is a picture in the first screen. The one-team promise is now part of the lead. S4 "Live station catering" is title + text + button.
9. Instagram is hidden on the Events pages until it is confirmed (see `review/hidden-placeholders.md`).
10. Live Stations with JS off: see P1.

**Checks**
- Headings ≤ 2 lines and no overflow at 320–1920 on all 8 pages, with and without reduced motion.
- `check:tokens` ok; no console errors (dev and production; /crepes too).
- Motion frames: `review/motion-frames/r4/<page>/sheet.png`.
- Clean production build in the scratchpad: CLS 0.000 on all 8 pages at 1440 and 390; LCP 28–108 ms locally.
- Inspector:
  - Home: 1 FAIL `covered-text` (the chapter stack, by design).
  - Services and Picnics: only `few-pictures`.
  - Live Stations: `headline-lines` and `pinned-over-picture` are the aria-hidden painted labels inside the cross-fading frame layers (measured 2 lines in the browser), plus `few-pictures`.

## Events round 5 — final polish (2026-10-18)
Source: `review/final-events-verify.md` (all 8 pages "ship"); Luka wants it perfect.

- **N-1 full-bleed bands:** `FoundPhoto` gets a `bleed` prop used by the Home pier and the About lemons. It sets `sizes="100vw"` and a hand-made srcset (640 … 2400 w) capped at the original's width, so a 1080p monitor gets the 1920 file and a 3× phone never downloads an upscaled 2880.
- **N-2 Picnics "Where we set up":** one place per line at every width. `white-space: nowrap`, and the size is `min(fluid, 8.4cqi)` on the list as a container ("PRIVATE PROPERTY" ≈ 11.6 em). Checked at 320, 360, 390, 768, 900, 1024, 1099, 1280, 1440 and 1920.
- **N-3 Live Stations highlight:** from 900 px a station name never wraps. Each row is a size container and the name is `min(sign-m, 100cqi / (characters × 0.74))`, so the apricot plank always hugs the text. "COCKTAIL & MOCKTAIL BAR" is one line: 27 px at 900 up to 45 px at 1440+. Phones (no plank) wrap as before.
- **N-4:** "For proposals, …" is `--step-1` at 900–1199. No statement runs past 3 lines at 320–1280.
- **N-5 /inquire load CLS:** dev only. On a clean production build the load-time CLS sweep (/inquire, /luxury-picnics, /services, /bloom-cart at 390, 768, 1024, 1280 and 1920, cold cache) records 0 shifts. Nothing to fix.
- **N-6 distinct first screens** (two pages changed; Picnics and About keep the photo split):
  - **Services:** type-led hero. "THREE PARTS, ONE TEAM" runs full width at sign-xl. The one-team lead and the button sit left; the three parts hang right as painted planks (cream / yellow / cream-deep) that jump to #planning, #design and #stations. On hover/focus the ink is painted across and the ↓ nudges. From 600 px each plank label stays one line (container-fit). The cannoli photo goes back to S4, which also fixes the thin text-only band there.
  - **Bloom Cart:** sage field with the title left. The right side is a tall cream signboard "Ideal for" (the seven occasions in sign capitals, one per line, container-fit) with the apricot half-sun on its lower edge. The flower photo moves into the sticky frame beside "From bucket to bouquet", replacing the wordless sage panel and keeping its `data-shoot-slot`. "Ideal for" left the yellow band, which is now title + custom details (5/7).
  - Photo reuse in first screens: Home video · Services none · Live Stations none · Picnics Clam Pass · Bloom none · How We Work none · About apron · Inquire none. No two adjacent pages open on the same picture.

**Checks**
- Headings ≤ 2 lines and no overflow at 320–1920 on all 8 pages, with and without reduced motion.
- `check:tokens` ok; no console errors (dev and production, /crepes too).
- Motion frames: `review/motion-frames/r5/<page>/sheet.png`.
- Clean production build: CLS 0.000 on all 8 pages at 1440 and 390, plus the load sweep above. LCP 28–112 ms locally; the 1.4–1.7 s at 390 on Services / Bloom are lazy images met during the scripted scroll, now that those heroes have no picture.

## Events v2 — shared layer (design-system lead, 2026-10-18)
System: `events-v2-system.md` (the /crepes language for Events: heavy fitted caps, pills, photo-led heroes on a flat multiply tint with plates, brown board + valance, one signature move per page, per-page briefs).
- Tokens/CSS: `--display-xl/l/m`, `--track-*`, `--cap-w`, `--space-*`, `--tint-photo(-wide)`, `--dur-rise/settle`, `--ease-roll`, `--spring-turn`; `.display-*`, `.title-board`, `.voice`, `.lead`, `.pill*`, `.pills`, `.tint`, `.plate`, `.on-photo`, `.field-*`, `.sec`; motion `.m-settle/.m-in/.m-in-side`, `[data-stage]` `.st-rise/.st-in/.st-side/.st-draw`. Legacy `sign-*`/`.btn` untouched.
- New: `RiseText` (authored lines, each fitted to its column → ≤ 2 lines by construction; letter/word/line mask rise on load or view), `Board`, `Odometer` (copy of CrpOdo), `SignFlip` (copy of CrpSignFlip with caption props), `WordmarkRise` (copy of CrpWordmarkRise, self-triggering), `usePinProgress`.
- Upgraded: `PageHero` (+ `heavy` and `photo` layouts, curtain + `#sheet`; legacy split/type markup unchanged), header (pill nav, over-photo mode via meta `hero: 'photo'`, /crepes arrival choreography), footer (full-width rising horizontal wordmark), `CloseCta` (heavy planks, pill, `field`), `FoundPhoto`/`ConceptImage` (`tint`, text slot, `credit="over"`, `position`, `settle`), `ShootSlot` (700 label, `brown` tone), layout (`.site` overflow-x clip, display sizes frozen at 1440).
- Checks: /crepes pixel-identical at 1440 (full page diff 0 px); all 9 routes 200; no overflow and no console errors at 320–1920; specimen pages (deleted) passed headings ≤ 2 lines, reduced motion + no-JS final state, curtain verified; check:tokens ok.

## Events v2 — Luxury Picnics + Bloom Cart (v2-pic, 2026-10-18)
Files: `app/app/pages/luxury-picnics.vue`, `app/app/pages/bloom-cart.vue`, new `app/app/components/BcSequence.vue`. No shared file edited. `public/img/events/` was checked each round: still empty (README only), so both pages run on the two credited found photos; type, boards and motion carry them.

**Luxury Picnics** (meta `hero: 'photo'`, apricot): hero → cream sheet (curtain) → yellow rules band → cream close.
- Hero: `PageHero layout="photo" curtain` on the Clam Pass original (1600 × 1200, `position 50% 100%` so the sun sits under the nav and the title runs over sea and boardwalk; phones get the 4:5 crop, sun in the empty middle). Voice "Just arrive," + "A PICNIC, / ALREADY SET". Tint 0.62 phone / 0.66 wide. Brown "What it can include" board (apricot valance, flush right) with six ruled rows; under 900 px the board would hide the sun under a 500 px band, so it is hidden there and the same rows open the sheet instead (one copy rendered per breakpoint). Pills: Plan a picnic (sun) · See where ↓ (ghost, brown-filled < 900 px: it crosses the sun's reflection).
- Sheet: "WHERE WE / SET UP" (display-l, `--cap-w: 0.77` because the three Ws measure 0.74 em) + the occasions statement (trimmed to 3 lines) beside a brown board (yellow valance, flush right) with the six places in heavy caps fitted to the longest (16 capitals).
- Rules (yellow): "PUBLIC PLACES / HAVE RULES" + the one confirmed answer (question as a Playfair line, answer as body). The unconfirmed weather answer stays in `faq` with `tbc`, unrendered.
- Close: `CloseCta field="cream"` "Pick a spot / and a date".

**Bloom Cart** (sage): heavy hero → BcSequence (cream, pinned) → yellow "Ideal for" → cream close.
- Hero: `layout="heavy"`, "PICK A STEM, / TAKE IT HOME"; ≥ 900 px the grid is re-areaed page-side so the title shares the row with the 4:5 flower photo (8/4 columns, settle, credit below in logo brown for AA on sage); `--cap-w: 0.65` (measured 0.61) for a bigger word. Pills: Ask about it (ink) · How it works ↓ (line).
- `BcSequence.vue`: the CrpSequence technique on `usePinProgress` (Crp files untouched). One layer of `flower-market-buckets.jpg` (1600 × 1066 → webp) laid out at its largest size and only scaled down; three 4:5 stops: whole stall (z 1) → the paper-wrapped tulip bucket (z 1.9) → hyacinth stems (z 1.9); frame ≤ 672 px tall so ≤ 1.2 CSS px per source px. Desktop: frame left, copy right; the step titles are the index in fitted heavy caps (active full ink + sage half-sun + 1.15 em shift, past 76 %, next 62 % ink: ≥ 3:1), "Two of three" + rail, step sentence through a mask, then the end line "Décor, an activity and a favour, from one cart." Phones: title, frame, meter, step, credit (pinned ≥ 520 px tall). Static list (SSR / no JS / reduced motion / short screens): three stills cropped with CSS percentages from the same file (one download).
- Ideal for (yellow): "IDEAL FOR" + seven occasions in heavy caps fitted to the longest (21) + "Custom details" on a brown board (sage valance, flush right, ruled rows).
- Close: `CloseCta field="cream"` "Bring the / Bloom Cart".

**Motion** (transform / opacity / clip-path only; reduced motion and no JS = final state; sections armed only below the fold)
| Page · section | Move | Timing | Trigger |
|---|---|---|---|
| Picnics hero | PageHero load choreography (settle, voice, letter rise, lead/actions, board from the edge, valance unroll) | 700–1600 ms, ease-out | load (CSS) |
| Picnics hero → sheet | **Curtain** (signature 1): hero holds, cream sheet slides over, words drift −12vh and tuck; page adds a tuck for voice/title reaching the header | scroll-linked, 240 ms tuck fade | scroll |
| Picnics sheet | **Where board** (signature 2): each place rises out of its own line mask, then the apricot half-sun rises from the board's lower edge | 900 ms/place, 90 ms apart; sun 1400 ms after the last | in view, once |
| Picnics sheet (< 900) | include rows: rules draw left→right, words lift | 720 / 560 ms, 70 ms stagger | in view, once |
| Picnics rules | title words rise, the answer lifts after | 900 ms / 700 ms, +420 ms | in view, once |
| Bloom hero | heavy load: letter rise, photo settle 1.06 → 1, lead/actions lift | as PageHero | load |
| Bloom sequence | **Pinned camera** (signature): 2 × 70 svh camera + 40 end + 30 release; hold 40 % per segment, ease-in-out, log-space zoom; index dot/shift 420 ms; text masks 560 ms | scroll-linked | scroll |
| Bloom ideal | occasions rise 28 px, 60 ms apart; board slides in 48 px from its edge | 760 ms, ease-out | in view, once |
| Both closes | CloseCta plank paint + words rise | shared | in view, once |

**Checks**
- Contrast on pixels (text hidden, 98th percentile under each box; `scratchpad/tools/contrast-pic.mjs`) at 320, 360, 390, 768, 1024, 1280, 1440, 1920: title lines ≥ 3.33 (large, needs 3), voice ≥ 4.7, lead/credit 9.45 (plates), the ghost pill measured 3.35–3.49 over the reflection below 900 px → now brown-filled there. Bloom: all text on flat fields (ink-deep on sage 5.5:1; credit moved off `--ink-muted` which was ~3.2:1 on sage).
- Headings ≤ 2 lines and fitted rows 1 line, no horizontal overflow at 320–1920 (`review/v2/v2-pic/*-<w>.png`, reduced-motion full pages). The only flag is the CloseCta planks (box padding, they read 2 lines).
- CLS on a production build in the scratchpad: 0.0000 on both pages at 1440 and 390, load and full scroll; no console errors. (Found and worked around: see the shared request below.)
- `check:tokens` ok. Dev console clean for both pages (the how-we-work CSS error seen during the run belonged to another agent's page).
- inspect (`--allow palette-claude`), defended WARN/FAIL: `hairline` (the brief asks for ruled list boards, as the /crepes menu; real lists), `few-pictures` (only two credited photos exist and `data/credits.ts` is frozen; the shoot slots are where Luka's images go), `covered-text` / `pinned-over-picture` on "Just arrive," (the curtain: everything under the sheet is tucked to opacity 0 + visibility hidden within 240 ms; verified at 300/600/900 px of scroll), `hero-words` 12 (the meter counts the sr-only copy and the visual copy: it is 6), `long-pin` (210 svh, shortened from 240; something changes on every screen), `size-count`, `palette-cream`, `no-footage` (brand / accepted).
- Vs /crepes, still short: one honest picture per page (no picnic or cart of our own yet); the Bloom hero leaves an open sage field between title and lead at 1440 (kept as the hero's breathing room).

**Shared-file requests**
1. `Board.vue`: `.board__valance { position: absolute }` has the same specificity as Awning's `.awning { position: relative }`, and in the production CSS order Awning wins until hydration: every valanced board is ~36 px taller on first paint (measured CLS 0.0100 on the Picnics hero). Raise it (e.g. `.board > .board__valance`). Both my pages pin it page-side for now.
2. Optional: a `capW` prop on `RiseText` (or document per-heading `--cap-w`): lines with several Ws exceed the 0.7 em assumption ("WHERE WE" = 0.74 em) and spill into the column gap.

## Events v2 — Services / Live Stations (v2-svc, 2026-10-18)
Files: `pages/services.vue`, `pages/live-stations.vue`, `components/StationCounter.vue`, `components/LsStationList.vue`, new `components/SvcRuled.vue`. No shared file touched.

**Services** (apricot field, heavy hero). Hero "THREE PARTS, / ONE TEAM" (letter rise), lead + `pill--ink`; the side is a cream `Board` with a yellow valance, flush to the hero's bottom-right corner so it runs straight into the cream of the parts (the /crepes board move); its three rows (name + Playfair note, ↓) jump to the parts. **Signature: sticky index of the three parts** — left column Planning / Design / Stations in heavy caps (active = full ink + apricot dot landing, steps 22 px; others muted), "One of three" + a rail following the section's progress (`usePinProgress`), each a jump link. Phones: the same index as a brown bar stuck to the bottom of the section (CSS sticky; with JS it shows once the parts fill the screen, steps aside while reading down, returns on scroll-up). Parts: Planning (display-l, statement, Planning | Production ruled board, "Who we bring in" merged as one split ruled list + "You still talk to one person."), Design (lead, flowers 4:5 unveil beside the in-house florals list + statement, Design | Setup ruled board), Stations (text + pill to /live-stations, the **griddle** half-bleed to the viewport's right edge, 72svh tall; phones edge to edge). Close `field="yellow"`. Cannoli moved to Live Stations.
**Live Stations** (photo hero, yellow field). Hero on the cannoli tray (1600×1280 desktop, 4:5 crop phones), "MADE IN FRONT / OF YOUR GUESTS", `:tint-wide="0.6"`, pills "Pick stations ↓" (sun) / "See all six" (ghost on its own brown fill), brown board + apricot valance flush bottom-right with the six station names as jump links (two columns < 900 px). Curtain into the cream sheet. **Signature: the six stations as a menu board** ("SIX STATIONS, / ALL MADE LIVE" + statement): name in heavy caps (one size for all rows, fitted to the longest name ≥ 600 px; balanced 2 lines max on phones), note in Playfair (still `<Tbc note="station description">`), 2 px rules; sticky 4:5 frame (≥ 900) swaps per row in the reading band — griddle / cannoli photos, the other four signboard ShootSlots (apricot/yellow/brown, heavy labels) — with name + "Three of six" under it. Counter (yellow): "ONE COUNTER, / MANY STATIONS" + 2 sentences + the coming-later line; `StationCounter` restyled: pill chips (apricot + drawn check), optional guest-range pills, a brown board under the big awning (its one allowed use), cream signs (names only when three sit side by side), "For [odometer] guests" only when the visitor picks a range, `pill--sun` ask carrying `stations` + `guests` to /inquire. Close `field="cream"`.

**Motion**
| Where | Move | Values | Trigger | Reduced / no JS |
|---|---|---|---|---|
| Both heroes | PageHero load (letters, lead, actions, board slide + valance unroll; photo settle on LS) | shared | load (CSS) | final |
| LS hero | curtain: sheet slides over, words drift −12vh and tuck, picture leans 1.06 | shared | scroll | off / static |
| Services index | active name: colour 240 ms, translateX 22 px 360 ms, apricot dot scale 0→1 360 ms; rail scaleX = progress | `--ease-out` | IO band 40–55 % + rAF scroll | colour only / links still jump |
| Services phone bar | translateY(100%+8) away / back | 420 ms ease-out | scroll direction | static sticky |
| Ruled boards (Planning, Partners, Design, Setup, Florals) | rule scaleX 0→1, then words rise 14 px | 720 / 560 ms, 70 ms per row, words +180 ms, groups +120 ms | v-stage once | final |
| Florals / griddle | unveil (frame unrolls, picture 1.06→1) | shared | v-unveil | final |
| LS menu board | rule draws, name +180 ms, note +240 ms rise | 70 ms per row | v-stage once | final |
| LS active row | apricot dot lands, name steps 0.6 em | 360 ms | IO band 45 % | — |
| LS frame swap | incoming layer clip-path inset(100% 0 0 0)→0 over the outgoing one, picture 1.06→1; caption name rises through a mask | 700 / 1100 / 420 ms | active row change | instant |
| Counter | sign drops on its hook (spring), neighbours FLIP; guest range rolls on the odometer | `--ease-spring`, 900 ms | click | instant |
| Rows / boards hover | lean 6 px (rows), arrows nudge 4 px | 280 ms | fine pointer | — |

**Checks** (`review/v2/v2-svc/`: 8 widths fold + full for both pages, motion frames in `motion/`, `*-reduced-390-full.png`, `*-nojs-390-full.png`, counter states): no horizontal overflow 320–1920; every h1/h2/h3 ≤ 2 lines (the close planks read as 3 in my DOM counter only because of their padding; 2 in the render). Contrast measured on pixels (text hidden, 98th percentile) at 320/360/390/768/1024/1280/1440/1920: LS title ≥ 3.51 (large), lead/credit/board on brown plates 9.45, the ghost pill measured 4.2 over the photo → given its own brown fill. check:tokens ok. CLS **0.000** on a scratchpad production build (1440 + 390, load + full scroll), no console errors. Inspector (`--allow palette-claude`): 1 FAIL + 3 WARN each, defended: **few-pictures** (2 honest found photos per page as the brief allocates; LS adds 4 signboard panels until the shoot; no Events concept images have arrived in `img/events/`), **size-count** (the fluid brand scale), **no-footage** (Home owns the one honest clip), **grey-body** on Services (ink-deep on apricot is the brand's 6.8:1 pairing), **hero-words** on LS (RiseText's sr-only copy counted twice).
**Found while measuring CLS (shared, for the main builder):** page-scoped overrides of a shared component's own scoped rule (same specificity, e.g. `.my-board { gap: 0 }` vs Board's `.board { gap: 14px }`) lose until the page CSS chunk lands on the client, so the hero re-flows ~50 ms after load. My pages now use `.x.board` (CLS went 0.004 / 0.024 → 0); About (0.025, `.stages`), Inquire (0.017), How We Work (0.008) and Picnics (0.010) show the same early shift signature.

## Events v2 — Home (v2-home, 2026-10-18)
Files: `pages/index.vue`, `components/HeroVideo.vue` (now media-only), `PillarExplorer.vue`, `StationRotator.vue`, `OccasionWheel.vue`, new `components/HomeBand.vue`. `ChapterEdge.vue` unchanged (sized from the page). No shared file touched.

**Page** (yellow field meta, `hero: 'photo'`): hero → cream sheet (curtain) → three rooms (apricot / yellow / sage) → where (cream-deep) → close (cream) → footer. The booth concept image and the "Still at the market" band are gone; the market is one line + link.
- **Hero**: `PageHero layout="photo"` with `#media` = HeroVideo (poster first; no clip bytes under reduced motion / Save-Data / 2g; pauses off-screen, in a hidden tab and once the curtain sheet has covered it; first frame fades over the poster). Tint 0.55 phones / 0.5 wide. "Buonasera," (the evening twin of /crepes' greeting) + YOUR PARTY, / ONE TEAM letter rise; lead on the brown plate; `pill--sun` "Start an inquiry →" + ghost "What we do ↓" (brown fill < 900 px). Brown board, apricot valance, flush bottom-right: the three ways in (`.hb__way`, nowrap so a font swap never reflows) + the Pause/Play ghost pill and "Video: Johann Mynhardt, CC BY 2.0" (the credit stays visible; fixed-width toggle). Phones: the clip owns the first screen (hero `min-height: 100svh + 200px`), the sun sits under the actions (the 4:5 poster is a crop of the frame, so the clip gets its own `videoPositionMobile` 96 % ↔ poster 100 % — no jump when the first frame fades in); lead + board follow as the brown band. Inquiry pill bottom: 279/568, 293/640, 312/844, 655/720, 829/900, 372/390 (landscape).
- **Sheet** "PLANNED, STYLED, / SERVED": PillarExplorer rebuilt — four heavy display-m rows (fitted to the longest), the chosen one painted onto an apricot pill; one Playfair sentence under them swaps (all four share one cell: nothing moves); the example party is a cream-deep board holding a real `<table>` (ruled like the /crepes menu), covered rows painted yellow + filled dot (ring when left out), count in words ("Planning covers five of eight."), `pill--sun` ask with the services preset. No JS: all four sentences show.
- **Signature — rooms**: each room = a field half (LIVE / STATIONS, LUXURY / PICNICS, BLOOM / CART in one shared display-l size, `--fit-n: 8`) + a photo half to the viewport edge for the full height, alternating sides (griddle, Clam Pass, flowers — the 1600 px originals; credits on plates, lifted 16 px above the next room's scallops). The sign at the top of the field (read first as the room arrives), statement + pill at the bottom; StationRotator (now heavy caps) in the stations room. ≥ 900 × 600 + motion: sticky rooms, the next slides over with its scallop edge over the field half only; the arriving room's photo lags behind its window; the room being covered lets its words drift −6vh and tucks each block before the edge reaches it (the hero curtain's rule: nothing is read through a room). Otherwise plain rooms (≥ 900) / text + 1:1 photo bands (phones).
- **Where**: `HomeBand` — AT HOME OR / ON THE BEACH over the pier (tint 0.45, 21:9 → 16:9 → 4:3 → 4:5; phones use the 4:3 original so the crop is never an upscaled slice; credit plate top-left < 1100, bottom-right above), parallax 0.07 on Lenis. Occasion wheel (700 weight) + the permits sentence + `pill--line` How we work; then the market line: "It started with one griddle at the farmers market. The crêpe stand is still there." + Crêpes at the market ↗.
- **Close**: `CloseCta` cream, "TELL US ABOUT / YOUR DAY" (2 lines at 320), stair of four boards with heavy titles (Tell us / We talk / Proposal / The day) + Playfair line, rising.

**Motion**
| Where | Move | Values | Trigger | Reduced / no JS |
|---|---|---|---|---|
| Hero | clip/poster layer settles 1.06 → 1; voice rise; letters rise; lead +560, actions +720; board slides from the right +760, valance unrolls +1060; ways rise 980/1060/1140; foot +1220 | 1600 / 800 / 900 / 700 ms `--ease-out` | load (CSS) | final, poster + Play |
| Hero → sheet | curtain (PageHero) | shared | scroll | off |
| Sheet | heading words rise; rows rise 80 ms apart; board slides in 48 px | 760 ms | v-stage once | final |
| Explorer | pill painted (clip-path, 420 ms); sentence: old drops + fades 120 ms, new rises 60 % → 0 (560 ms, +120); table rows painted in a 20 ms cascade (≤ 3 steps), un-paint at once | `--ease-out` | click | colour swap only |
| Rooms (signature) | sticky stack; arriving photo lags (translateY −0.3vh·p → 0, img only); covered room's words drift −6vh and tuck (opacity 240 ms + visibility) | rAF on scroll | scroll | plain rooms |
| Rooms | sign words rise; statement/pill lift | 55 ms/word; 80 ms stagger | v-stage once | final |
| Stations room | roller sign steps through the six stations with the pin | 240 ms | scroll progress | plain list |
| Where | title words rise over the band; parallax ±7 %; wheel 2 s / 600 ms glide (Pause) | — | view / Lenis | final / list |
| Close | planks paint (CloseCta); stair steps rise 28 px, 80 ms apart | 760 ms | v-stage once | final |
| Controls | pill press .97 + arrow nudge; board ways lean 6 px, arrow apricot | 120 / 240 ms | fine pointer | — |

**Checks** (`review/v2/v2-home/`: folds at 320/360/390/768/1024/1280/1440/1920, full pages, `motion/` load films (production, 0.25×), wheel films of the curtain and the rooms, explorer click, reduced 1440, no-JS 390):
- Contrast on pixels (text hidden, p98 brightest) over the poster **and seven frames of the clip** (1–13 s), 320–1920: title ≥ 3.07 (large) at 320, ≥ 3.4 from 390, ≥ 4.3 from 768; voice ≥ 4.07; band title ≥ 3.69 (1280), ≥ 4.0 elsewhere; lead/board/credit on brown 9.45; ghost pill on its brown fill < 900, ≥ 7 over the frond area ≥ 900; header wordmark/Menu ≥ 5.5.
- No horizontal overflow 320–1920; every h1/h2/h3 ≤ 2 lines. check:tokens ok. CLS **0.000** on a scratchpad production build at 1440×900, 1280×720, 390×844, 360×640 (load + full wheel scroll); LCP 48–128 ms local. No console errors from Home (the dev 404/500 seen during the run was another page's CSS).
- Inspector (`--allow palette-claude`): **0 FAIL**, 2 WARN defended — `size-count` (the fluid brand scale), `pinned-over-picture` ("Buonasera," is the hero over its own clip; "LUXURY PICNICS": the arriving bloom photo's *unclipped* img box overlaps it — the photo is clipped by its window and the title tucks before the edge reaches it). Fixed on the way: hairlines (board rules out, the party list is a real table, market rule out), covered-text (voice/letter boxes now 0.9 rem apart; rooms tuck), statement length, long-pin.
- Vs /crepes, still short: the griddle photo is a plain steel close-up (the only honest station photo); the rooms will sing with Luka's own picnic/cart/station images.

**Shared-file requests**
1. `PageHero`: a `voiceLang` prop (or `lang` on the voice line) — "Buonasera," should carry `lang="it"` like /crepes' greeting.
2. `PageHero`: a credit slot/prop for `#media` (the clip's credit now lives on the hero board, which works, but a media hero has no built-in credit line).
3. Page-scoped overrides of a shared component's own rule with equal specificity re-flow the hero ~50 ms after load in production (Board gap / valance) — Home avoids them now; the Board valance specificity fix already landed.

## Events v2 — How We Work, About, Inquire (v2-hai, 2026-10-18)
Built on the shared layer (events-v2-system.md §8). Files: `pages/how-we-work.vue`, `pages/about.vue`, `pages/inquire.vue`, `components/HwSteps.vue` (new), `components/InquiryForm.vue`, `components/InqSummary.vue`. No shared file touched.

**How We Work** (apricot → cream → yellow → cream close)
- Hero `heavy` "SIMPLE / FOR YOU" (letter rise). From 900 px the brown Board (yellow valance) stands *beside* the title, not under it: "Three phases, / nine steps" + three ruled ↓ rows that jump into the stack (our own scroll target, not Lenis' anchor glide: the boards above the target are stuck, so its rect is wrong; `stopPropagation` + computed arrival).
- Signature `HwSteps`: nine boards, each sticky one 12 px lip lower than the last, so the brown top rules of the earlier boards stack above the current one. Board = phase name, step title (heavy caps), the italic sentence, the step's number painted large in the lower corner (apricot on yellow, yellow on cream/cream-deep). Tones yellow → cream-deep → cream, the last board yellow (never end on cream-on-cream). Text sits at the top of each board so the next board covers the empty lower half first. "Event day" carries the half-sun, which rises when that board arrives. Desktop: H2 "FROM INQUIRY / TO FOLLOW-UP" scrolls on, the meter (phase index with apricot dot, "Four of nine", rail) holds beside the stack; phones/tablets: a slim sticky bar (phase · count · rail), space reserved in SSR so pinning shifts nothing. Pinned only after mount with motion allowed and ≥ 560 px tall; SSR / no JS / reduced motion = the same boards in flow.
- Yellow band: "RUNNING IT, / NOT SERVING IT" + the rule as a statement + the permits note (the 17-word sentence no longer set as a 3–4-line headline). Close: `CloseCta` cream.
**About** (yellow → cream/deep → apricot → photo band → deep → cream close)
- Hero `heavy` "IT STARTED / WITH A CRÊPE": the letters rise, then the circumflex drops onto the E with the turn spring (page CSS on the Ê cell: body and hat are two clipped copies of the glyph, the hat waits above the mask). Apron concept ≤ 320 px on a cream-deep Board with an apricot valance, beside the title from 900 px (fixed width, so its frame has its height before the file loads).
- Suns at three heights kept (scrubbed); titles now display-m in authored lines. "ONE MARK, / TWO MORNINGS" on apricot with `<SignFlip>` (yellow sun, logo-brown strokes, captions "The A in our name is a sunrise." / "Upside down, a crêpe in its cone."). "MORNINGS, / GULF LIGHT" over the lemons band (credit over, parallax), body below. Who we are: heavy title + the founders' slot (now the rising-sun motif: the A mark is the sign flip's). Close cream.
**Inquire** (apricot → cream, no CloseCta)
- Short `heavy` hero "TELL US ABOUT / YOUR DAY" with the statement beside it; the first question is in the first screen at 1440 and 1280.
- Chips → pills (radius 999, apricot when chosen, the circle/square marker with dot/tick kept, press scale .97); submit `pill--sun pill--on-light`. Summary = sticky brown Board with an apricot valance: ruled key | answer rows that rise in, count in words ("Two of six", "Six questions" before the first answer), the guest range rolls in with `Odometer` (a fresh roll per choice); "What happens next" (3 numbered italic lines) is the board's foot; "Why no price list?" sits under the form (slot). Phones: brown "Your event so far" disclosure above the submit, the board's foot after the form.
- Behaviour unchanged and re-tested (Playwright): prefill `?services=`/`?stations=` (unknown ids dropped) and now `?guests=` (one of the four ranges only), empty submit → 5 errors + focus #f-name, then #f-email, past date → error + focus #f-date, errors clear as fixed, maxlength 120/254/40/160/4000, 500 → `role=alert` + focus on submit, 17 s hang → timeout message after 15 s, repeat clicks ignored while sending (aria-disabled), success → "Thank you, Ana." focused, board "What you sent us". API untouched.

**Motion** (transform/opacity/clip-path; `--ease-out`; reduced motion / no JS = final state)
| Page · section | Move | Timing | Trigger |
|---|---|---|---|
| all heroes | letter rise (PageHero), lead/actions lift, board slides in + valance unrolls | 900 ms, 30 ms/letter; 700 ms | load (CSS) |
| About hero | circumflex drops onto the E | 700 ms `--spring-turn`, +1320 ms | load (CSS) |
| HWW steps | boards stick and cover (scroll position, no animation); rail scaleX; phase dot; half-sun rises on "Event day" | rail per frame; 240 ms; 1100 ms | scroll (rAF) |
| HWW rule band | title word rise; statement + note lift | 55 ms/word; 560/760 ms | in view once |
| About stages | suns rise, scrubbed | `animation-timeline: view()` | scroll |
| About mark | sign flip A → cone, caption swap | 980 ms spring | in view once, then tap |
| About band | title word rise; parallax ±7 % | 900 ms; scroll | in view; fine pointer |
| About team | slot sun rises | 1100 ms | in view once |
| Inquire summary | rows rise in, answer swaps through its mask, guests odometer | 560 / 240 / 900 ms | on answer |
| closes | CloseCta planks paint + words rise | shared | in view once |

**Checks** — widths 320/360/390/768/1024/1280/1440/1920: no horizontal overflow; every heading ≤ 2 lines (the script flags the shared CloseCta at < 600 px as 3 "lines": plank padding; visually 2). Lemons title contrast (98th-percentile pixel, title hidden) 3.37–3.54 : 1 at 320–1920 with tint **0.62** — the brief's 0.45 measures ≈ 2.1 : 1 on the white wall, so it was raised. CLS on a scratchpad production build (load + full scroll): 0 on all three pages at 320/390/768/1024/1280/1440/1920 except Inquire ≤ 0.0015 (Playfair swap in the summary foot). Earlier shifts fixed: page overrides of PageHero/Board made more specific than the components' own rules; About's apron board given a definite width (it was 0 tall until the image loaded); Inquire's statement keeps a fixed 3/4-line box so the Playfair swap can't resize the hero; HWW board title has an authored break. Reduced motion and JS off render everything (`review/v2/v2-hai/modes-reduced-nojs-390.png`). Jump links land on the right board (One/Six/Eight of nine, desktop with Lenis and touch). check:tokens ok; no console errors (the dev-only 404 "how-we-work.vue … style index=1" was a stale module from an earlier save; resolved).
**Inspector WARN/FAIL defended**: `few-pictures` (heavy-type heroes by brief; no honest photo of a process or a form), `hairline` (HWW hero board rows: a ruled list on a board, §9), `covered-text`/`long-pin` (the stacked boards and the sticky summary are the signatures: covering is the move), `mixed-font-headline` (Inquire legends are Playfair questions with a sans "(required)" note), `size-count` (fluid brand scale), `no-footage`, palette (brand).
Artifacts: `review/v2/v2-hai/` (full pages per width, motion sheets, form states).
