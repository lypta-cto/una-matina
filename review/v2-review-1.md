# Events v2: review 1 against the /crepes bar (2026-10-18)

This is a fresh, read-only review. No code was changed. It covers Home (`/`), `/services`, `/live-stations` and `/luxury-picnics` on `localhost:3001` (the dev server), judged against `/crepes`, which Luka calls "perfect".

All evidence paths are relative to `review/v2-review-1/`.

## Setup

- **Tooling:** Playwright from `builder/node_modules/playwright`, Chromium headless.
- **Scrolling:** desktop uses `page.mouse.wheel`, so Lenis engages. Phones use CDP `Input.synthesizeScrollGesture` (touch, `isMobile`/`hasTouch`).
- **Load films:** CSS animations slowed 4× with `Animation.setPlaybackRate 0.25`. Timestamps are in real milliseconds.
- **Widths:** 320×568, 360×640, 390×844, 768×1024, 1024×768, 1280×800, 1440×900 and 1920×1080. Each has a fold and a full-page shot (`widths/<page>/`) and side-by-side folds (`compare/folds-*.jpg`).
- **Films:**
  - `motion/<page>-{d,m}-load-sheet.jpg` and `motion/<page>-{d,m}-scroll-sheet-*.jpg` (desktop 1440, phone 390).
  - Fine-step films of the pinned parts: `motion/home-rooms-1440-sheet.jpg`, `home-rooms-1280-sheet.jpg`, `svc-1024-sheet.jpg` and `ls-1024-sheet.jpg`. The raw frames are in `motion/fine/`.
  - The /crepes bar was filmed the same way: `motion/crepes-d-*.jpg`.
- **Modes:** reduced motion and JS off, full pages at 390 and 1440 (`modes/*-{reduced,nojs}-*-full.jpg`, montages `modes/montage-*.jpg`), plus a keyboard walk of the first 28 Tab stops at 1440 (`modes/keyboard.json`, `modes/*-kb-*.jpg`).
- **Contrast:** measured on pixels. The text is hidden and the 98th-percentile brightest pixel under each glyph box is sampled at all 8 widths (`checks/contrast-*.json`, text-off frames `checks/contrast-*-textoff.png`).

**Caveat on full-page shots.** The full-page screenshots under `widths/*-full.png` and in the montages misdraw sticky rooms and `100svh` boxes, because Chromium resizes the viewport for the capture. Judge motion and pins from the scroll films, not from the full-page shots.

## Verdict

| Page | Verdict | Score vs /crepes (= 10) | One line |
|---|---|---|---|
| Home | **fix** | **7.0** | The closest to the bar: a real photo-led hero, the curtain and the rooms. But the rooms have no hold, their fields are half empty, and keyboard focus is lost inside them (P0). |
| Live Stations | **fix** | **6.5** | Good hero and menu board. The sticky frame is mostly flat panels, and the six names are shown three times. |
| Luxury Picnics | **fix** | **6.0** | A beautiful hero, then the page runs out: 3 sections and 1 photo, and the second idea is a permits disclaimer. |
| Services | **fix** | **5.5** | No photo and no signature-scale moment. It is five ruled boards of bare nouns, which reads as a spec sheet. |

### What already holds at /crepes level, measured

| Check | Result |
|---|---|
| Horizontal overflow | 0 px on all 4 pages at all 8 widths |
| Console | 0 errors or warnings |
| Placeholder words | None found ("TBC", "placeholder", "lorem", "coming soon", "[[", "Concept image", "to confirm", "Styled shoot", "undefined"/"NaN") |
| Headings | Every h1/h2/h3 is at most 2 lines visually. The DOM counter flags the CloseCta planks as 3–4 lines; that is plank padding (as in the build log). LS "COCKTAIL & MOCKTAIL BAR" at 320 was re-measured: 2 lines (`checks/ls-320-cocktail-row.png`). |
| Frame pacing | p50 16.7 ms and p95 16.7–16.8 ms, 0 frames over 34 ms, on all pages with wheel (desktop) and with touch (phone). Same as /crepes. |
| LCP | 52–216 ms, dev, local. Always the `rt__line` title, which is correct. |
| CLS (dev) | 0 on phones; 0.001–0.012 from 768 px up. The shift is the title/voice ~70–90 ms after load (web-font swap). /crepes shows the same signature on dev (0.003). Builders measured 0 on a production build: **re-check on prod before launch** (P2-X3). |
| Reduced motion | Full content on all pages. No text left at opacity 0 (`modes/*-reduced-*`). |
| JS off | Full content on all pages. The LS frame falls back to the griddle under the board (`modes/montage-nojs-1440.jpg`). |
| Text over photos | Every title is ≥ 3:1 (large text). Every small text sits on a brown plate (9.45:1). Details in the table below. |
| Rule-breaking craft | None: no gradients, glass, emoji or eyebrows, and the valance count per page is ≤ 2. |

**Contrast, minimum p98 over 320–1920** (cream on tinted pixels, text hidden):

| | Voice | Title line 1 / 2 | Ghost pill (no fill, ≥ 900) | Lead / credit / board |
|---|---|---|---|---|
| Home (video frame at ~4.5 s) | 4.99 | 4.01 / 3.50 (phones) · ≥ 4.96 / 7.22 (≥ 1024) | 7.87 | 9.45 (plate) |
| Live Stations | — | 3.49 / 3.50 | brown fill at all widths (4.23 underneath) | 9.45 |
| Luxury Picnics | 4.71 | 3.40 / 3.33 (768) · ≥ 3.65 elsewhere | 5.12 | 9.45 |
| Home pier band | — | 3.44 (1280–1440) · ≥ 5 elsewhere | — | plate |
| /crepes (bar) | — | 3.60–6.71 | 4.23 (360, N3 known) | 9.45 |

The LS header wordmark measures 3.5–3.9 over the cannoli. Logos are exempt from contrast rules, but the thin strokes visibly fizz over the sugar.

---

## Why /crepes still reads better (the gap in one paragraph)

/crepes spends its motion on **content that changes**:
- The odometer rolls a real price.
- The pinned camera moves through *one* rich picture while the index and the copy change.
- The board in the hero carries *live* information: the featured crêpe, its price and the next market.

The Events pages copied the *devices* (rising letters, boards with valances, sticky columns) but often fill them with **repeated or static content**:
- The LS hero board repeats the six names that the menu board and the counter repeat again.
- Home's rooms hold a title and a sentence 500 px apart.
- Services' sticky index is three small words beside 40 ruled nouns.

**The three photos (griddle, Clam Pass, flowers) do eight jobs across four pages, and the weakest of them, the steel griddle, is the one used most.** Most of the remaining gap is content density and imagery, not CSS.

---

## Home: fix (7.0)

### P0

**H-P0-1 · Keyboard focus is lost inside the pinned rooms; two pills are unreachable.**
- **Where:** ≥ 900×600 with motion allowed.
- **What happens:**
  - Tab from "Ask about planning" lands on `<body>` (stop 22), not on "See all six stations".
  - The next Tab skips the room's credit and lands on `<body>` again instead of "Plan a picnic" (stop 25).
- **Cause:** the browser scrolls the focused pill into view. At that scroll position the next room's edge is already rising, so `frame()` puts `is-tucked` (`visibility: hidden`) on the block holding the focused element, and focus drops.
- **Evidence:** `checks/kb-home-22.jpg` (focus on body, the room's words gone), `modes/keyboard.json` → `home`.
- **Fix, part 1 (`pages/index.vue`, in `frame()`):** never tuck a block that holds focus.
  ```js
  const act = document.activeElement
  for (const b of text.children as HTMLCollectionOf<HTMLElement>)
    b.classList.toggle('is-tucked', !b.contains(act) && edge < vh - 1 && b.getBoundingClientRect().bottom > edge - 24)
  ```
- **Fix, part 2 (same `onMounted`):** bring a focused room to its pinned position.
  ```js
  const onFocus = (e: FocusEvent) => {
    if (!mq.matches) return
    const i = secs.findIndex(x => x.s.contains(e.target as Node)); if (i < 0) return
    const top = root.getBoundingClientRect().top + window.scrollY + i * (window.innerHeight + HOLD) // HOLD = the margin from H-P1-1 (0 today)
    window.scrollTo({ top, behavior: 'instant' as ScrollBehavior })
    onScroll()
  }
  root.addEventListener('focusin', onFocus)   // + remove in onBeforeUnmount
  ```
- **Re-check:** Tab through `/` at 1440×900 and 1280×720. Every pill in the rooms gets a visible ring. No `<body>` stops.

### P1

**H-P1-1 · The rooms have no hold, so each room is readable for only 150–300 px of scroll.**
- **What happens:** each `.chap` is sticky and `100svh` tall, so the next room starts covering it the moment it is pinned. The tuck then hides the statement and the pill as soon as the scallops appear.
- **Evidence:**
  - 1440: the stations room is complete only at `home-rooms-1440-006` (y 2095); by 008 (y 2395) only the title is left.
  - 1280×720: only frame 003 (`motion/home-rooms-1280-sheet.jpg`).
  - Compare /crepes, which holds 20 % of its scroll at every camera stop.
- **Fix (`pages/index.vue`, inside the pinned media query):**
  ```css
  @media (min-width: 900px) and (min-height: 600px) and (prefers-reduced-motion: no-preference) {
    .chap + .chap { margin-top: 45svh; }   /* the previous room stays pinned, uncovered, for 45svh */
  }
  ```
  The sticky room above stays in place over the transparent margin. The tuck and photo-lag maths read the next room's rect, so they need no change. Use the same 45svh as `HOLD` in H-P0-1.

**H-P1-2 · The room fields read half empty: title at the top, statement at the bottom, about 40 % blank apricot, yellow or sage in between.**
- **Evidence:** `home-rooms-1440-006`, `012`, `018`; `motion/home-d-scroll-sheet-1.jpg` #7, #10, #13.
- **Cause:** `.chap__text :deep(.rt) { margin-bottom: auto }` pushes the rest of the block to the floor. Each room says one sentence, where /crepes' sequence column carries an index, a meter and a changing line.
- **Fix:** give each room a ruled three-row board (the /crepes menu move: the rule draws, then the words rise) from data that already exists, and close the gap.
  ```ts
  // chapters[]: add rows
  stations: rows: ['Crêpe station', 'Cannoli bar', 'Cocktail & mocktail bar']   // from data/stations.ts
  picnic:   rows: ['Low tables, rugs and cushions', 'Fresh florals and signage', 'Setup and breakdown'] // from the picnics page
  bloom:    rows: ['We pick the flowers', 'The cart is set', 'Guests tie a bouquet']  // the Bloom Cart steps
  ```
  ```html
  <ul class="chap__rows st-in" style="--i: 3"><li v-for="r in c.rows" :key="r" class="chap__row"><span class="st-draw" aria-hidden="true" />{{ r }}</li></ul>
  ```
  ```css
  .chap__rows { list-style: none; margin: 0; padding: 0; width: min(100%, 26rem); }
  .chap__row { position: relative; padding: 12px 0; font-weight: 700; font-size: var(--step-1); }
  .chap__row > span { position: absolute; inset: 0 0 auto; height: 2px; background: currentColor; }
  ```
  Put the rows between the title and the statement. Keep `margin-bottom: auto` on the rows block, not on the title, so the sign and its list read together at the top.

**H-P1-3 · The stations room photo (steel griddle, `crepe-griddle.jpg`) is the weakest image on the site, and it is reused on Services and Live Stations.**
- **What happens:** it reads as a pale disc on a hob. The stations room is the first room, so it sets the tone of the signature.
- **Evidence:** `motion/home-d-scroll-sheet-1.jpg` #6–#9.
- **Fix:** use Luka's AI crêpe image that /crepes already ships (an accepted image source; AI concepts carry no label), cropped to the folded crêpes. In `pages/index.vue`:
  ```ts
  { id: 'stations', …, concept: { src: '/img/crepes/seq-source-3344.webp', w: 3344, h: 1882 }, pos: '58% 55%', posM: '58% 55%',
    alt: 'Folded crêpes with berries and cream on a plate at the counter' }
  ```
  ```html
  <ConceptImage v-if="c.concept" class="chap__photo" :src="c.concept.src" :width="c.concept.w" :height="c.concept.h" :alt="c.alt" :position="c.pos" sizes="md:100vw lg:50vw" />
  <FoundPhoto v-else … />
  ```
- **Caveat:** if Luka re-renders the /crepes hero (crepes P1-3), the same file updates here.

### P2

**H-P2-1 · The occasion wheel is a perpetual ticker.**
- **Problems:**
  - It is effectively a marquee, which §6 bans.
  - Its 15 % / 50 % rows read as disabled text.
  - A "Pause" control sits in the middle of the section.
- **Evidence:** `checks/home-band-1440.png`, `motion/home-d-scroll-sheet-1.jpg` #17–#18.
- **Fix:** replace `<OccasionWheel>` in `pages/index.vue` with the fitted caps list Bloom uses for IDEAL FOR (seven rows at the size of the longest, rising once):
  ```html
  <ul class="where__occ" aria-label="Occasions we set up for"><li v-for="(o, i) in occasions" :key="o" class="st-rise" :style="{ '--i': i }">{{ o }}</li></ul>
  ```
  ```css
  .where__occ { list-style: none; margin: 0; padding: 0; container-type: inline-size; }
  .where__occ li { font-weight: 700; letter-spacing: -0.015em; line-height: 1.12; white-space: nowrap; font-size: min(2.75rem, calc(100cqi / (27 * 0.62))); }
  ```

**H-P2-2 · The pier band goes grey-mauve under the 0.45 multiply tint.**
- **What happens:** the band title reads, but the picture loses the warmth that the hero and /crepes keep. /crepes adds `saturate(1.08)` on desktop.
- **Evidence:** `checks/home-band-1440.png`.
- **Fix (`HomeBand.vue`):**
  ```css
  .hband__img { filter: saturate(1.15); }
  ```

**H-P2-3 · On phones the curtain leaves "ONE TEAM" cut by the top edge while the header is away.**
- **Evidence:** `motion/home-m-scroll-sheet-1.jpg` #1.
- **Fix:** add Picnics' companion tuck (`pic-under`, `pages/luxury-picnics.vue` `onMounted`) to Home, or move it into PageHero for every curtain hero.

**H-P2-4 · Copy repeats across pages.**
- "ONE TEAM" closes both the Home and the Services H1, two clicks apart.
- "made in front of your guests" appears 5 times across Home (lead and stations room), Services and LS (H1).
- **Suggestion:** Services H1 "ONE PART / OR ALL THREE" (copy for Luka to approve). Home stations room: "Cooked at the party: the griddle from our market stand, brought to yours."

---

## Services: fix (5.5)

### P1

**S-P1-1 · No picture and no signature-scale moment in the first two screens.**
- **What happens:**
  - The hero is a flat apricot field with a cream list board.
  - The signature (the sticky index) is three words at 28–44 px with a 2 px rail and a 15 px counter. It reads as a docs sidebar.
  - It is the only Events page in this set without a photo-led or pinned moment; /crepes opens on a photo and pins a camera.
- **Evidence:** `widths/services/1440x900-fold.png`, `1920x1080-fold.png`, `motion/services-d-scroll-sheet-1.jpg`, `motion/svc-1024-sheet.jpg`.
- **Fix:** make the sticky column do what the LS frame does. Under the index, add a 4:5 frame that wipes to the active part's picture (the `LsStationList` `.lsl__layer` pattern: `clip-path` wipe, 1.06 → 1):
  - **Design:** flowers.
  - **Stations:** the crêpe concept (see H-P1-3).
  - **Planning:** a brown `ShootSlot` labelled "THE DAY", or the pier crop.

  Then drop the inline florals photo and the half-bleed griddle (they become the frame). Also enlarge the index names to the column:
  ```css
  .svc-index__a { font-size: min(var(--display-m), calc(100cqi / (9 * var(--cap-w)))); }
  .svc-index { container-type: inline-size; }
  ```
  In `pages/services.vue`, add `<div class="svc-index__frame">` with three layers keyed by `active` (copy `.lsl__layer` CSS and its `prefers-reduced-motion` block). It shows ≥ 900 px only.

**S-P1-2 · Five ruled boards hold about 40 rows of bare nouns at 15–16 px; it reads as a spec sheet.**
- **The boards:** Planning, Production, Partners, Design, Setup, Florals.
- **Why it matters:** §9 bans text-in-a-box lists. A ruled board was meant to make a list *a menu*. The /crepes menu rows carry a name and a sentence; these carry only a noun.
- **Evidence:** `motion/services-d-scroll-sheet-1.jpg` #3–#11, `motion/services-m-scroll-sheet-1.jpg` (five phone screens of hairlines).
- **Fix (`pages/services.vue` + `SvcRuled.vue`):**
  - Each part shows **one** board of ≤ 6 rows in the /crepes menu shape: name in 700, plus one Playfair half-line taken from the existing copy. Example: "Floor plan and guest flow · where people stand, eat and dance". Copy for Luka.
  - The full lists go behind a disclosure:
    ```html
    <details class="svc-more"><summary class="pill pill--line">Everything in Planning (10)</summary><SvcRuled :groups="planning" /></details>
    ```
  - Merge "Who we bring in" into one sentence plus a single ruled row of partners, comma-separated.

### P2

**S-P2-1 · The phone bar steps aside while reading down.**
- **What happens:** a reader who only scrolls down never sees the bottom index bar. It works on scroll-up: `checks/svc-390-bar-scrollup.png`. The bar is the page's signature on phones.
- **Fix:** show it for the first 1.2 s after each part's title enters, then let it step aside.
  ```js
  // in read(): if (newActive !== active.value) { away.value = false; clearTimeout(t); t = setTimeout(() => (away.value = down), 1200) }
  ```

**S-P2-2 · On phones the florals frame is capped at 340 px**, leaving a ragged gap at the right, while the griddle runs edge to edge.
- **Evidence:** `checks/svc-390-bar-scrollup.png`.
- **Fix:**
  ```css
  @media (max-width: 639px) { .svc-florals__img { max-width: none; margin-inline: calc(-1 * var(--gutter)); } }
  ```

**S-P2-3 · Two yellow valances (header and hero board) sit on the same screen, at the same scale, 380 px apart.** This is within the "≤ 2" rule, but they read as a repeat. Give the board an apricot valance:
```html
<Board tone="cream" valance="apricot" …>
```

---

## Live Stations: fix (6.5)

### P1

**L-P1-1 · Four of the six frames in the signature are flat panels.**
- **What happens:** the sticky frame swaps between griddle → TIRAMISU slab → FRUIT CUPS slab → CHARCUTERIE slab → cannoli → COCKTAILS slab. Two photos in six reads as "the pictures are missing", not as "signboards".
- **Evidence:** `motion/ls-1024-sheet.jpg` 005–010, `motion/live-stations-d-scroll-sheet-1.jpg` #4–#6.
- **Fix, short term (`LsStationList.vue`):** make the slab a real signboard, not an empty panel: the name plus the station's Playfair note plus the half-sun.
  ```html
  <ShootSlot v-else … :label="s.sign || s.short"><p class="lsl__slotnote">{{ s.note }}</p></ShootSlot>
  ```
  This needs a default slot in `ShootSlot.vue`, positioned bottom-left on the panel, Playfair 1.125 rem, `--slot-ink`.
- **Fix, real:** one Luka AI image per station (tiramisu cups, fruit cups, board, bar). Drop them into `public/img/events/` and map them in `photos`. The crêpe row should use the /crepes concept instead of the griddle (H-P1-3).

**L-P1-2 · The six station names appear three times in the first three screens: the hero board, the menu board and the counter chips.**
- **What happens:** the hero board adds nothing. /crepes' hero board carries a featured item with live detail.
- **Evidence:** `widths/live-stations/1440x900-fold.png`, `compare/folds-390.jpg` (on phones the brown band holds the same six names again).
- **Fix (`pages/live-stations.vue`):** make the board the *featured* station, built from data only:
  ```html
  <Board tone="brown" valance="apricot" drop flush="right" class="ls-hb">
    <p class="ls-hb__t">Crêpe station</p>
    <p class="italic-line">{{ stations[0].note }}</p>
    <a href="#stations" class="pill pill--s pill--ghost">All six stations <span class="pill__arrow pill__arrow--down" aria-hidden="true">↓</span></a>
  </Board>
  ```
  Remove the "See all six" ghost from `#actions`; the board now carries that jump. This also shortens the phone band by about 150 px.

### P2

**L-P2-1 · During the frame wipe, the outgoing photo's credit shows under the incoming panel.**
- **What happens:** "Photo: DanielPenfield…" appears under TIRAMISU, and "Stefano Mortellaro…" under COCKTAILS, for 720 ms.
- **Evidence:** `checks/ls-1440-swap-credit.png`, `motion/ls-1024-sheet.jpg` 005 and 008.
- **Fix (`LsStationList.vue`):**
  ```css
  .lsl__layer:not(.is-on) :deep(.found__cap) { visibility: hidden; transition: none; }
  ```

**L-P2-2 · The hero title sits over the busiest part of the tray** (powdered sugar and red cherries).
- **Numbers:** it passes at 3.5–3.9, but it reads noisier than /crepes (3.6–6.7 over calm areas). The wordmark fizzes as well.
- **Evidence:** `widths/live-stations/1440x900-fold.png`.
- **Fix:** `:tint-wide="0.66"` and `position="50% 20%"`, so the dark tray rim and the cream ricotta rows run behind line 2. Then re-measure with `checks/contrast-*.json`'s method.

**L-P2-3 · The empty counter slots read as an unfilled form.**
- **What happens:** "Add a station" boxes with a 2 px cream border.
- **Evidence:** `motion/live-stations-m-scroll-sheet-1.jpg` #8–#9.
- **Fix (`StationCounter.vue`):** draw empty signs as a dashed outline at 40 % and label them "+ add".
  ```css
  .sc__sign.is-empty { border-style: dashed; border-color: color-mix(in srgb, var(--on-field-dark) 40%, transparent); }
  ```

**L-P2-4 · The cramped 320 px pills are covered under Picnics P-P1-3** (same shared fix).

---

## Luxury Picnics: fix (6.0)

### P1

**P-P1-1 · The page runs out after the hero.**
- **What happens:**
  - It is 3,546 px at 1440: hero, sheet, rules, close. It has one photo.
  - After the hero there is no picture at all, and the second band is a permits disclaimer ("PUBLIC PLACES / HAVE RULES").
  - /crepes has five ideas, each carried by a different move.
- **Evidence:** `motion/luxury-picnics-d-scroll-sheet-1.jpg`, `motion/luxury-picnics-m-scroll-sheet-1.jpg`.
- **Fix (`pages/luxury-picnics.vue`):** replace the rules band with a yellow **"Before you arrive / After you leave"** split board. It uses only claims already in the lead ("set it before you arrive and take it all away after"):
  - **Left board (cream-deep), "BEFORE YOU ARRIVE":** the six include rows, ruled.
  - **Right board (brown, apricot valance), "AFTER YOU LEAVE":** "We pack the table, the textiles and the flowers, and leave the spot as we found it." plus the permits sentence as its foot.
  - **Motion:** the two boards slide in from their edges (`st-side`), then the half-sun moves from the left board to the right one (one transform).
- **Imagery:** the real fix is one Luka AI picnic image (a low table on sand at golden hour) as a half-bleed panel beside "WHERE WE SET UP". Ask Luka; `public/img/events/` is still empty.

**P-P1-2 · The title crowds the board's valance, and at 1024 it crosses the sun.**
- **Measurements:** the title's last line box overlaps the board top by 24 px at 1024–1920. At 1024×768 the "SET" baseline sits about 2 px above the scallops. At 1280×720 the board runs 64 px below the fold (its bottom is at 784).
- **Evidence:** `widths/luxury-picnics/1024x768-fold.png`, `1440x900-fold.png`.
- **Fix (`PageHero.vue`, for every photo hero):** promote Home's page-side rule into PageHero.
  ```css
  @media (min-width: 900px) { .phx--photo .phx__title { margin-bottom: clamp(18px, 3.4svh, 36px); } }
  ```
  Then shorten the Picnics board rows on short screens:
  ```css
  @media (min-width: 900px) and (max-height: 820px) { .pic .inc__row { height: 38px; } }
  ```
  At 1024 use `position="50% 100%"` with `position-mobile` unchanged and check that the sun clears "PICNIC,". If it does not, set the 900–1199 position to `50% 92%`.

**P-P1-3 · At 320–360 the two hero pills share a row with 14 px padding, so "Plan a picnic →" runs into the pill ends.**
- **Evidence:** `checks/pills-luxury-picnics-320.png`; LS has the same problem (`checks/pills-live-stations-320.png`). /crepes and Home stack the pills full width.
- **Fix (`assets/css/main.css`, after line 183):**
  ```css
  @media (max-width: 379px) { .pills > .pill { flex: 1 1 100%; } }
  ```

### P2

**P-P2-1 · "Where we set up" leaves a tall empty cream gap** between the title and the statement on the left (`align-content: space-between`).
- **Evidence:** `motion/luxury-picnics-d-scroll-sheet-1.jpg` #3.
- **Fix:**
  ```css
  .where__head { align-content: start; }
  ```
  Then lift the statement to `margin-top: var(--space-block)`, or put the occasions as fitted caps under it.

**P-P2-2 · The hero repeats Home's picnic room** (the same Clam Pass sunset). Home links straight here, so the visitor sees the same picture twice in a row. Until the AI picnic image arrives, crop it differently: use `clam-pass-gulf-3x2.jpg` (same credit, unused) for the Home room.

---

## Cross-page

**X-1 (P1): three photos do eight jobs.**
- Griddle: Home, Services, LS (twice).
- Clam Pass: Home, Picnics.
- Flowers: Home, Services, Bloom.

The cheapest jump toward /crepes is the AI crêpe concept for every crêpe-station spot (H-P1-3) plus one AI picnic and one AI station set from Luka. Do not use `vanderbilt-beach.jpg`: it is credited and unused, but it is a teal Gulf, off palette.

**X-2 (P2): the ghost-pill fill is inconsistent.** LS fills it brown at every width; Home and Picnics only under 900. Pick one rule in PageHero, for example fill whenever the measured p98 under the pill is below 4.5.

**X-3 (P2): measure CLS on a production build** for all four pages (dev shows 0.004–0.012 font-swap shifts at ≥ 768). The method is in the build log, v2-svc.

**X-4 (P2): where the /crepes craft is missing.**
- No page uses the odometer. That is correct: there are no real numbers to roll. The LS guest range only rolls when the visitor picks one.
- Picnics has no scroll signature besides the curtain. The "where" board rise is pleasant, but it is a v-stage, not a signature.
- Services has no curtain and no pin-quality moment (S-P1-1).

## The 3 biggest wins per page

**Home**
1. Hold plus focus-safe rooms (H-P1-1 and H-P0-1).
2. Ruled rows in each room, so the field isn't empty (H-P1-2).
3. The AI crêpe concept instead of the steel griddle (H-P1-3).

**Services**
1. A sticky swapping frame under an enlarged index (S-P1-1).
2. One menu-style board per part, with the full lists in `<details>` (S-P1-2).
3. A new H1 that doesn't echo Home ("ONE PART / OR ALL THREE").

**Live Stations**
1. Real signboards (name and note) or AI images in the four empty frames (L-P1-1).
2. The hero board as a featured station, not a third copy of the list (L-P1-2).
3. A calmer crop or tint behind the title, plus the credit-leak fix (L-P2-2, L-P2-1).

**Luxury Picnics**
1. Replace the rules band with "Before you arrive / After you leave" boards (P-P1-1).
2. Title clearance in PageHero plus the 320 pill stack (P-P1-2, P-P1-3).
3. One AI picnic image as a half-bleed panel beside "Where we set up" (P-P1-1, imagery).

## Re-check list for the fixer

| Fix | Check |
|---|---|
| Home keyboard | Tab walk at 1440 and 1280×720: no `<body>` stops, and every room pill shows a ring. |
| Home rooms | Fine film at 1440 and 1280×720 (`fine.mjs` method). Each room fully legible for ≥ 40svh of scroll. |
| Pills | At 320 and 360: `scrollWidth ≤ clientWidth − 28` for every hero pill. |
| Picnics hero | Title glyph bottom ≥ 16 px above the board top at 1024–1920. |
| Overall | Contrast re-measured after any tint or crop change; prod CLS = 0. |

Scripts for every check above are in the session scratchpad (`tools/v2r1/*.mjs`): widths, motion, fine, contrast2, modes, kb2, gap, pills, leak, bar.
