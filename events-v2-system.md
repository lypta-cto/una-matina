# Events v2: the /crepes language applied to Una Mattina Events & Catering

Owner: design-system lead, 2026-10-18. Status: **Phase A done.** The shared layer is built and verified. Page agents build on it.
Read with: `DESIGN.md` (brand, unchanged), `build-log.md` (/crepes v3 → v3.4), `references/section-library.md`.
The brand is fixed and does not change here: cream #FFF7EA, apricot #F4A878, yellow #F6D67A, sage #9EAD83 and brown #5B3A2E; Montserrat, Playfair Display Italic and one script sign-off. The accepted exceptions are unchanged (Montserrat, a cream ground, three typefaces). Still banned: gradients, glass, shadows at rest, emoji, eyebrow labels, rows of icon cards, invented proof.

---

## 0. Why /crepes feels premium and Events does not (measured side by side at 1440 and 390)

| | /crepes | Events today |
|---|---|---|
| Display type | Montserrat **700**, −0.035em, 0.86 leading on the hero word; section titles 600–700 | Montserrat **400**, +0.02em: reads thin and "template" |
| First screen | Full-bleed photo from the top edge. The nav sits over it. Words sit on a flat brown multiply tint. A brown board with a valance is flush to the bottom-right corner | A field colour, a thin title and a small framed picture, or the video under a cream card |
| Actions | Pills with character: the half-round ends repeat the half-sun; colour swap, arrow nudge, scale(.97) on press | Square buttons with a paint wipe |
| Motion | One authored move per section, each a different verb: letters rise out of masks, the circumflex lands with a spring, an odometer rolls, a pinned camera moves, the curtain sheet slides over the hero, the sign flips, the week board's rows rise, the wordmark rises letter by letter | The same rise or fade on every heading |
| Sections | 5 sections, each one idea, each its own field (cream → yellow → cream pinned → sage → cream-deep → brown) | 6–8 sections. Lists of text in boxes, near-empty boards, two pages with three near-identical bands |
| Footer | The horizontal wordmark rising across the full width | A stacked wordmark that fills half a screen |

**The v2 rule:** heavy type in authored lines; one photo-led or heavy-type first screen; one signature move per page; everything else quiet; pills; a brown board with a valance as the recurring device.

---

## 1. Type

All sizes live in tokens (`assets/css/tokens.css`). On Events pages `layouts/default.vue` redefines them with `--vw` (1vw capped at 14.4 px), so type stops growing at 1440. /crepes keeps its own values.

| Role | Class / component | Face | Size (exact) | Tracking · leading |
|---|---|---|---|---|
| Hero title (H1) | `PageHero layout="heavy\|photo"` → `RiseText size="xl"` | Montserrat 700, caps | `--display-xl: clamp(3rem, 1rem + 12vw, 8.75rem)`, **fitted per line**: `min(--display-xl, 100cqi / (longest line chars × 0.7))` | −0.03em · 0.88 |
| Section title (H2) | `RiseText size="l"` or `.display-l` | Montserrat 700, caps | `--display-l: clamp(2.5rem, 1.6rem + 4.2vw, 6rem)` (fitted the same way) | −0.025em · 0.92 |
| Sub-title / board title (H3) | `RiseText size="m"` or `.display-m` | Montserrat 700, caps | `--display-m: clamp(1.75rem, 1.3rem + 2vw, 3.25rem)` | −0.015em · 1.0 |
| Row name (station, place, step) | `.title-board` | Montserrat 700, sentence case | `--step-2` (22 → 36 px) | −0.01em · 1.1 |
| Voice line above a hero title | `PageHero voice="…"` / `.voice` | Playfair Italic | `clamp(1.625rem, 1.2rem + 1.6vw, 2.25rem)` | 0 · 1.15 |
| Lead | `.lead` (+ `.lead--l` ≥ 900 px) | Montserrat 400 | `--step-1` (20 → 24 px); `--l`: 20 px | 1.45 · max 38ch (`--l` 32ch) |
| Statement (whole sentences) | `.statement` | Playfair Italic | `--step-2` | 1.3 |
| Body | — | Montserrat 400 | `--step-0` (16 → 17 px) | 1.6 |
| Small / credit | — | Montserrat 500 / 400 | 14 px / 13 px | 1.45 / 1.4 |
| Sign-off | `.signoff` | Mrs Saint Delafield | existing, **once per page, in the footer only** | |

Rules
- **Authored lines, always.** Every display heading is given as `lines` (≤ 2). Each line stays on one line and shrinks to fit its column, so "headings ≤ 2 lines at 320–1920" holds by construction. Keep lines ≤ 16 characters for xl and ≤ 22 for l. A long line just gets smaller, so rewrite the copy rather than accept a 30 px hero.
- Put the fitted heading in a block or grid cell with a definite width. `RiseText` is a size container with `width: 100%`. Never put it in a shrink-to-fit flex item.
- **Voice line:** a spoken phrase ("Buongiorno,", "Tell us,"). Never a category ("Our services"). At most one per page, and only in the hero. It replaces nothing and is optional.
- Legacy `.sign-xl/l/m` (400 weight) and `.btn*` stay for pages not yet rebuilt. **Rebuilt pages use none of them.**
- Playfair only for whole sentences: statements, captions, form questions. Never for one word inside a caps title.

## 2. Buttons: pills

`<a class="pill pill--sun">Plan a picnic <span class="pill__arrow" aria-hidden="true">↗</span></a>` · `.pill--s` = 44 px compact (header) · `.pills` = action row (on phones the first-screen pair shares the row 50/50).
Shape: min-height 52 px, padding 0 26 px, radius 999 px, 2 px border, Montserrat 600 16 px, `white-space: nowrap`.

| Field | Primary | Secondary |
|---|---|---|
| Photo + tint, brown field, brown board | `pill--sun` | `pill--ghost` (cream outline; it gets a brown fill < 600 px, done in PageHero) |
| Cream / cream-deep | `pill--sun pill--on-light` (hover turns brown, not cream) | `pill--line` |
| Yellow, apricot | `pill--ink` | `pill--line` |
| Sage | `pill--cream` or `pill--ink` | `pill--line` |

Motion: colours swap in 160 ms `--ease-out`. On hover (fine pointer only) the arrow nudges (2, −2) px, or 3 px down with `.pill__arrow--down`. On press, `scale(.97)` for 120 ms. The focus ring is 3 px `--focus-ring` (cream on photo/brown). Arrows: ↗ means an external link or a new place; → means the next step; ↓ means an in-page jump. One primary per view.
Form chips (Inquire) become pills too: `border-radius: 999px`, apricot fill when selected.

## 3. Photo treatment

Four shapes, and nothing else. Square corners and no shadows. Never a floating frame on a coloured slab beside text in a box (the "template" look).

| Shape | Use | Build | Source |
|---|---|---|---|
| **Full-bleed hero** | First screen (photo pages) | `PageHero layout="photo"` + page meta `hero: 'photo'`. min-height `max(100svh, 560px)`, ≥ 900 px `clamp(640px, 100svh, 1200px)` | ≥ 1600 px wide (2400 ideal). Pass `photoMobile` (a 4:5 crop) for phones |
| **Full-bleed band with words over it** | One per page at most, mid-page | `<FoundPhoto bleed ratio="21 / 9" :tint="0.45" credit="over"><RiseText …/></FoundPhoto>` (phones: give the frame `aspect-ratio: 4/5` or `4/3` from the page's CSS) | 2400 × 1029 (pier, lemons) |
| **Half-bleed panel** | Chapters, a service with its photo | The photo runs to one viewport edge and fills the section height (≥ 4:5); the field half holds the words | ≥ 880 × 1100 crops |
| **Framed 4:5** | Beside a list, in a sticky frame | `FoundPhoto ratio="4 / 5" unveil`, ≤ 520 CSS px wide | 880–1100 px |

Full-size originals for heroes: `credits.*` hold the 4:5 crops. Spread an entry and point it at the original for the desktop picture: `{ ...credits.clamPass, src: '/img/world/clam-pass-sunset.jpg', w: 1600, h: 1200 }`, `{ ...credits.cannoli, src: '/img/world/cannoli-tray.jpg', w: 1600, h: 1280 }`, `flower-market-buckets.jpg` 1600 × 1066, `crepe-griddle.jpg` 1600 × 1200. Pass the 4:5 crop as `photoMobile`.

Text over a picture:
- A flat brown **multiply** tint over the whole picture: `.tint`, at `--tint-photo` 0.62 on phones and `--tint-photo-wide` 0.5 from 900 px. Override with `:tint` / `:tint-wide`, never with a gradient. Multiply keeps the food and the sunsets warm.
- Large text (cream, ≥ 24 px or 19 px bold) needs ≥ 3:1 on the tinted pixels. **Every small text sits on a solid brown `.plate`** (lead, credit, board). Measure like /crepes: hide the text, sample the 98th-percentile brightest pixel under each text box, at 320, 360, 390, 768, 1024, 1440 and 1920. Never put a title over the sun itself: crop with `position` / `positionMobile`.
- The context class `.on-photo` / `.on-dark` sets cream ink and a cream focus ring.

Credits: every found photo shows "Photo: creator, licence" (both linked). It sits under framed photos, on a brown plate in a corner over full-bleed bands (`credit="over"`), and bottom-left on its own plate in photo heroes (automatic when the photo object has `creator`). AI concepts (`ConceptImage`) carry no label (Luka's decision), only an honest `alt`.
Picture loads: hero = `fetchpriority="high"` + preload (PageHero does both), with a hand-made srcset capped at the original's width. Everything else is lazy. CLS 0: every frame has its ratio before load.

## 4. Fields, rhythm, boards, valance

Spacing tokens (new; /crepes keeps `--section`):
`--space-section: clamp(80px, 9vw, 152px)` (section padding, `.sec`), `--space-head: clamp(28px, 3.4vw, 56px)` (title → content, `.sec__head`), `--space-block: clamp(40px, 5vw, 80px)` (between blocks in a section), `--space-tight: clamp(14px, 1.6vw, 22px)` (title → lead). The gutter (16 → 40 px) and the 1440 max are unchanged.

Field sequencing:
- Classes `.field-cream | deep | yellow | apricot | sage | brown` set background, ink and focus ring together. Use one per section.
- A page = **hero** (photo, or its page field) → **cream sheet** (the curtain sheet if there is one) → at most **one yellow and one apricot band** besides the hero's own field → **close** (cream by default; never brown, because the footer is brown) → brown footer. Sage is Bloom Cart's only. One brown mid-page band is allowed per page (for example a signboard section).
- Neighbouring sections never share a field or a composition. Aim for **4–6 sections** after the hero, as on /crepes. Cut before you add.

Boards (`<Board>`): flat panels, square corners. The brown board with a valance on its top edge is the recurring Events device, taken from the /crepes hero board. Use it for the hero board, a list board, the Inquire summary. `flush="right"` runs it to the viewport edge.

Valance (the slim scalloped edge, `<Awning variant="valance">`):
- **Field pages:** the header valance under the fascia (automatic). **Photo pages:** no header valance. The hero board carries it (`<Board valance="apricot" drop>`).
- At most **two valances per page** (header or hero board, plus one board). The valance colour is never the board's colour, and never cream-on-cream.
- The big default `Awning` is retired on Events except inside `StationCounter`. `ChapterEdge` scallops (Home) count as material and are allowed.

## 5. Header and footer (built)

Header: wordmark on the left, **one pill of links** centred (apricot; cream on apricot pages), the current page as a brown plank inside the pill, and an `Inquire` pill on the right (ink; cream over a photo). Below 1100 px the `Menu` pill opens a cream sheet with heavy caps links. On the first page of a visit it drops from −100 % (900 ms, +300 ms), the pill opens from its centre (700 ms, +500 ms) and the links follow 80 ms apart. Over photos it is fixed and transparent, then turns cream once you scroll. Headroom is unchanged.
Footer: brown field. The sign-off + a `Start an inquiry` pill sit on the left, three columns on the right. The **horizontal wordmark runs across the full width and rises letter by letter, then its sun comes up** (`WordmarkRise`). Credits sit in a `<details>`.

## 6. Motion vocabulary

One easing family (`--ease-out` cubic-bezier(.22,1,.36,1)). Long tails (560–1600 ms). A spring only where something physically turns or lands. Transform, opacity and clip-path only. **Budget per page:** the hero load choreography + **one** scroll signature + one quiet move per other section. Every move: final state without JS, under reduced motion, and for anything already in the first viewport at load.

| Move | Primitive (where) | Allowed |
|---|---|---|
| **Letter-mask rise** (each letter out of its baseline, 900 ms, 30 ms/letter, 120 ms/line) | `RiseText by="letter" trigger="load"` (PageHero does it) | Hero H1 only, lines ≤ 16 characters |
| Word-mask rise (55 ms/word) | `RiseText by="word"` (default, `trigger="view"`) | Section H2s: the default for display headings |
| Line rise (plain text heading) | `v-lines` (plugins/reveal.ts) | Legacy / small headings |
| Photo settle 1.06 → 1, 1600 ms | `.m-settle`, `FoundPhoto/ConceptImage settle` | First-screen pictures only |
| Lead / actions / credit lift (14 px + fade, 700 ms) | `.m-in` + `--m-d` | Hero blocks |
| Board slides from its edge (24 px) + valance unroll | `.m-in-side`, `<Board drop>` | Hero board |
| **Curtain exit** (hero holds, the cream sheet slides over, words drift −12vh and step aside, picture leans to 1.06) | `PageHero curtain` + `#sheet` slot | Photo heroes only; one per page; the sheet must be cream; off under reduced motion |
| **Odometer** (digit columns roll, 900 ms, +70 ms/digit, `--ease-roll`) | `<Odometer value="$11" :delay="…" />` | **Real numbers only:** prices, a guest range the visitor picked, confirmed counts. Never stats, proof or invented figures |
| **Pinned camera sequence** (sticky stage, a camera pans/zooms through one picture in 3–5 stops, index + "Two of five" counter, static list fallback) | `usePinProgress(root)` (pattern: `CrpSequence.vue`) | One per page, ≥ 3 stops, source ≥ 1600 px (zoom ≤ 1.9, ≤ 1.2 CSS px per source px); screens < 520 px tall get the static list |
| Stacked sticky boards (each board covers the last, rail + counter in words) | CSS sticky + `usePinProgress` for the rail | How We Work only |
| **Sign flip** (A ↔ cone, 980 ms spring, then a button) | `<SignFlip :captions="[…, …]" />` | The brand mark only; About only (and /crepes) |
| Week board / live pulse | `CrpWeekBoard` pattern, `MarketStatus` | Live market data only, and only once markets are confirmed |
| Section choreography (rows rise 28 px, 80 ms stagger; rules draw left → right) | `v-stage` on the section + `.st-rise` / `.st-in` / `.st-side` / `.st-draw` with `--i` | One per section |
| Unveil (frame unrolls top-down, picture 1.06 → 1) | `FoundPhoto unveil`, `v-unveil` | Framed photos below the fold |
| Parallax (±7 %) | `FoundPhoto :parallax="0.07"` | Full-bleed bands, fine pointer only |
| Plank paint (scaleX) + words rise | `CloseCta` (built), highlight planks | Close and one highlight per page |
| Deal-out cards (translateX from a stack) | pattern in `pages/crepes.vue` `.ig__card` | A row of ≥ 4 square pictures |
| Press / hover | `.pill` scale(.97), arrow nudge; rows lean 6 px on hover | Controls, rows (fine pointer) |

Never: blur-ins, scale-from-0.5, endless Ken Burns, marquees, scroll-jacking (Lenis drives the real scroll; no snapping), more than one pin per page, a pulse on anything that isn't live.

## 7. Shared API (what page agents must use)

- `<PageHero id title :lines layout="photo|heavy" voice lead :photo :photo-mobile alt position position-mobile :tint :tint-wide curtain>` with the slots `#lead #actions #side`(heavy) `#board`(photo) `#media`(photo: replaces the picture, e.g. a video) `#sheet`(curtain). Photo pages add `definePageMeta({ hero: 'photo', field, awning })`. `photo` = a `credits.*` entry (or `{ src, w, h }` for a concept). The credit is shown automatically.
- `<RiseText :lines as="h2" size="xl|l|m" by="letter|word|line" trigger="view|load" :delay :fit>`. `id` and `class` land on the heading element.
- `<Board tone="brown|cream|deep|yellow|apricot|sage" valance="apricot|yellow|sage|none" flush="none|left|right" drop as>`.
- `<Odometer value :delay>` · `<SignFlip :captions :labels>` · `<WordmarkRise>` (the footer uses it) · `usePinProgress(ref, { minHeight })` → `{ progress, enabled }`.
- `<FoundPhoto … :tint credit="below|over" position settle>` with a default slot for words over the picture. `<ConceptImage … :tint position settle>` with a default slot.
- `<ShootSlot … tone="apricot|yellow|sage|brown">`: the label is now heavy 700.
- `<CloseCta :lines field="cream|yellow|apricot|sage" label to>`: heavy planks + a pill.
- CSS: `.display-xl/.display-l/.display-m`, `.title-board`, `.voice`, `.lead(.lead--l)`, `.pill(.pill--sun|cream|ink|ghost|line|s|on-light)`, `.pill__arrow(--down)`, `.pills`, `.tint`, `.plate`, `.on-photo/.on-dark`, `.field-*`, `.sec`, `.sec__head`, `.m-settle/.m-in/.m-in-side`, `[data-stage]` + `.st-rise/.st-in/.st-side/.st-draw`.
- Tokens: `--display-*`, `--track-*`, `--leading-xl/l`, `--cap-w`, `--space-section/head/block/tight`, `--tint-photo(-wide)`, `--dur-rise/settle`, `--stagger-letter/word`, `--ease-roll`, `--spring-turn`.
- Don't edit `pages/crepes.vue`, `layouts/crepes.vue`, `Crp*`, `MarketStatus.vue`, `MenuTable.vue`, `useMarketStatus.ts`, `data/markets.ts`, `data/menu.ts`.

## 8. Per-page briefs

Hero mix across the nav (no two neighbours open the same way or on the same picture): Home **photo (video)** · Services **heavy** · Live Stations **photo (cannoli)** · Picnics **photo (Clam Pass)** · Bloom Cart **heavy + photo side** · How We Work **heavy** · About **heavy** · Inquire **heavy, short**.

**Home** (yellow field). Signature: **the three service chapters as half-bleed photo rooms.**
- Hero: `layout="photo"` with `#media` = the palm-sunset loop (keep HeroVideo's Save-Data / reduced-motion / off-screen pause logic and a visible Pause ghost pill). The tint goes over the video. "YOUR PARTY, / ONE TEAM" sits bottom-left in cream, letters rising. A brown board, bottom-right with an apricot valance, holds the three ways in as links: Planning & coordination · Design, florals & setup · Live station catering. The cream card over the video goes. Curtain into the sheet.
- Sheet (cream): "PLANNED, STYLED, SERVED" + `PillarExplorer` restyled. Its pillar tabs become heavy display-m rows with pills, and its example-party table becomes a ruled board.
- Chapters (keep the sticky stack and ChapterEdge): each chapter is a field half (display-l title, statement, pill) plus a photo half running to the viewport edge for the full chapter height, on alternating sides. Stations = griddle, Picnics = Clam Pass, Bloom = flowers.
- "AT HOME OR ON THE BEACH": the title goes **over** the pier band (tint 0.45, credit over). The occasion wheel stays below.
- Merge "Still at the market" into one line + a link under the occasions (About and the footer carry the story). Close: `CloseCta field="cream"`. The stair stays, with display-m steps that rise (`.st-rise`).

**Services** (apricot field). Signature: **a sticky index of the three parts.**
- Hero: heavy "THREE PARTS, / ONE TEAM". The side is a cream `Board` holding the three plank links (↓).
- Index: a sticky left column lists Planning / Design / Stations. The active one is full ink 700 with an apricot dot, the others `--ink-muted`; clicking scrolls to it (the CrpSequence index). The three parts scroll past on the right. Each part = display-l title + its list as a two-column ruled board (`.st-draw` rules).
- Photos: design → flowers 4:5 (unveil); stations → **griddle** half-bleed with a pill to /live-stations (the cannoli moves to Live Stations).
- Merge "Who we bring in" into Planning as one ruled row list. Close: `field="yellow"`.

**Live Stations** (yellow field). Signature: **the six stations as a menu board.**
- Hero: `layout="photo"` on the **cannoli tray** (1600 × 1280; 4:5 crop for phones). Title "MADE IN FRONT / OF YOUR GUESTS". The board holds the six station names in `.title-board` rows. Curtain into the sheet.
- Six stations: each row = name in display-m + an italic note. The rule draws, then the words rise, 70 ms per row; rows lean on hover. The sticky frame on the right swaps photo or ShootSlot (heavy label) per active row.
- `StationCounter` stays as the second, quieter beat. Restyle: pill chips, a brown board for the counter, and the guest count odometer only if the visitor enters it. Shorten "One counter, many stations" to title + 2 sentences. Close: `field="cream"`.

**Luxury Picnics** (apricot field). Signature: **the curtain hero + the "Where we set up" board.**
- Hero: `layout="photo"` on Clam Pass sunset (landscape 1600 × 1200 for desktop, `clamPass` 4:5 for phones, crop the title off the sun), with **curtain**. Title "A PICNIC, / ALREADY SET". The board (brown, apricot valance) holds "What it can include" (six short rows).
- Sheet (cream): "WHERE WE SET UP": six places in fitted display-l caps, one per line, rising word by word, with the apricot half-sun rising from the board's lower edge. The "For proposals, anniversaries…" statement sits beside it.
- The rules band (yellow) is compressed to title + one paragraph. Close: `field="cream"`.

**Bloom Cart** (sage field). Signature: **a pinned camera sequence through the flower-market photo.**
- Hero: heavy "PICK A STEM, / TAKE IT HOME". The side is the flower photo 4:5 (`settle`, credit below).
- Sequence: three stops through `flower-market-buckets.jpg` (1600 × 1066): the whole stall → one bucket → stems at hand. They sit beside "We pick the flowers / The cart is set / Guests tie a bouquet", with an index + "Two of three" (`usePinProgress`; static list of three 4:5 stills as fallback).
- Yellow band: "IDEAL FOR" as a fitted caps list board + the custom details board. Close: `field="cream"`.

**How We Work** (apricot field). Signature: **stacked sticky boards.**
- Hero: heavy "SIMPLE / FOR YOU" (letter rise). The side is a brown Board with a yellow valance: "Three phases, nine steps" + three ↓ jump links.
- Nine steps are boards that stick and cover each other (top = header + n × 12 px). Each board: phase name (small), step title display-m, the italic sentence. Tones cycle yellow → cream-deep → cream. A rail + "Four of nine" counter follows progress. This replaces the three half-empty phase boards. Static stack without JS / under reduced motion.
- Yellow band: the staffing rule as a big statement + the permits note. Close: `field="cream"`.

**About** (yellow field). Signature: **the sign flip.**
- Hero: heavy "IT STARTED / WITH A CRÊPE": the letter rise lands on the Ê, echoing /crepes. The side is the apron concept ≤ 320 px on a cream-deep Board.
- "Market, today / Events, next / A café, one day": keep the rising suns; titles become display-m.
- "ONE MARK, TWO MORNINGS" (apricot field): `<SignFlip>` replaces the static A/V pair. Captions: "The A in our name is a sunrise." / "Upside down, a crêpe in its cone."
- "MORNINGS, / GULF LIGHT" goes **over** the lemons band (tint 0.45, credit over). The body text sits below it.
- "Who we are" + the founders' ShootSlot stay. Close: `field="cream"`.

**Inquire** (apricot field). Signature: **the live summary board.**
- Hero: heavy, short: "TELL US ABOUT / YOUR DAY". The side is the "No packages, no price list" statement. Keep the hero compact so the form starts in the first screen at 1440.
- Form: chips → pills; the submit is a `pill--sun`. Questions stay Playfair (they are sentences). The fields are unchanged (a11y as built).
- Summary: a sticky brown `Board` with an apricot valance. Answers rise in as rows. The count reads in words ("Two of six"). The guest range rolls with the Odometer when chosen.
- "What happens next" is cut as a band: its three lines become the summary board's foot; "Why no price list?" stays under the form. No CloseCta on this page.

## 9. Don'ts (v2 additions to DESIGN.md)

- No 400-weight caps headings on rebuilt pages. No square `.btn`. No headline without authored `lines`.
- No small text on a photo without a plate. No gradient scrims. No title over the sun or the brightest part of a picture.
- No second pinned section, no second curtain, no second sign flip on a page. No odometer on anything that isn't a real number.
- No text-in-a-box sections that only list words (the old Services / How We Work boards). Give a list a board with rules, or a photo beside it, or cut it.
- No floating 4:5 frame on a coloured slab next to a paragraph as the default composition. Use full-bleed, half-bleed, or a frame that does something (sticky, swapping).
- No more than two valances per page. No valance over cream on cream. No big default Awning.
- No eyebrow labels. A voice line is a spoken phrase in the hero only.
- No brown close section right above the brown footer.
- Keep: CLS 0, headings ≤ 2 lines 320–1920, no horizontal scroll, reduced motion = final state, no-JS = full content, focus rings (cream on photo/brown), 44 px targets, `check:tokens` ok, credits on every found photo.
