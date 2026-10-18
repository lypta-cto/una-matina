# Section library: round 3 (patterns + redesign specs)

Research run on 2026-10-18 (night). **v1**: written in the first hour. Later passes added sections at the end, each one marked.
Scope: the two /crepes sections Luka called bad ("Folded hot", "Made in front of you"), hero motion add-ons, and anything else on /crepes or the Events site that the research shows is below the bar.
Read with: `sections-catalog.md` (round 2, Luka's 4 references), `DESIGN.md`, `section-plan.md`, `build-log.md`.

**Builder status at the time of writing (00:30).** The builder had already acted on the brief while this research ran. "Folded hot" is gone. A menu band image and `components/CrpSequence.vue` were added: a pinned camera pan through Luka's AI image with 5 steps. §3 therefore reviews that build against the references and gives the deltas. It does not re-specify from zero. Current-state sheets: `r3-motion/_una-mattina-now/crepes-desktop-sheet.jpg` and `crepes-mobile-sheet.jpg` (before: `crepes-desktop-before-sheet.jpg`), `home-desktop-sheet.jpg`.

---

## 0. Method and evidence

- **Motion probe** (`scratchpad/sec/probe.mjs`; results copied into `references/r3-motion/<slug>/probe-{desktop,mobile}.json`):
  - An init script polls `document.getAnimations()` every frame and logs each animation's real duration, delay, easing (including Framer's spring `linear()` curves, summarised as value at 25/50/75 % and the overshoot) and keyframes.
  - The page is then wheel-scrolled in 0.5 vh steps (desktop 1440×900) or 0.6 vh steps (mobile 390×844), and the probe records which named layers (`data-framer-name`) change transform or opacity at each step. Scroll-linked effects show up as values that change with scroll.
  - `position: sticky` / `fixed` elements are listed with their top, size and parent height, so the length of every pin is measured, not guessed.
- **Frames**: every site has `r3-motion/<slug>/scroll-sheet.jpg` (desktop, step by step, read left to right), `m-scroll-sheet.jpg` (mobile), `load-sheet.jpg` (first ~2.6 s after navigation, 14 frames) and named `key-*.jpg` frames for the sections cited below.
- **Full captures** with `builder/scripts/capture-refs.mjs` (desktop + mobile full page + tokens) for the six sites with the most patterns we take: `references/r2-curbside/`, `r2-cateringgco/`, `r2-dollop/`, `r2-cenere/`, `r2-moka/`, `r2-glacee/`.
- **Crops of Luka's AI image** for the made-in-front-of-you sequence: `references/r3-made-crops/step1..5-*.jpg` and `sequence-strip.jpg`.

### Sites studied (34)

| Slug (`r3-motion/…`) | Site | Why it is in the set | Verdict |
|---|---|---|---|
| `morni` | mornibali.framer.website | Luka's /crepes model | hero timings measured (§1) |
| `agrovas` | agrovas.framer.website | Luka's video hero | no hero entrance at all, only the video, so nothing to add |
| `beanro` | beanro.framer.website | Luka | pinned grow video measured; split-line hero rejected |
| `latte` | lattetemplate.framer.website | Luka | sticky photo beside list (round 2) |
| `curbside` | curbsidetruck.framer.website (Adam Kansky, "Food Truck & Catering") | **closest business model** (truck + catering) | **TAKE ×4** |
| `truckfare` | "Griddlecar" (John Nicholson, "food truck with live location") | live "where are we today" + week | **TAKE ×3** |
| `cenere` | Cenere pizzeria (Waleed Ejkhidem) | process told with numbers, odometer prices | **TAKE ×2** |
| `dollop` | dollop-cafe.framer.website (Pankaj Human) | sticky card stack, Instagram fan | **TAKE ×2** |
| `cateringgco` | Cateringg Co. (Webestica, "Event catering & private chef") | catering hero, occasions wheel | **TAKE ×2** |
| `peel` / `hinoki` / `growler` | Adam Kansky pizzeria / omakase / brewery | stacked full-bleed "rooms", stair-step process row, sticky menu photo | **TAKE ×2** |
| `glacee` | Glacee gelato (John Nicholson) | "flavours today" board, social block, visit cards | PARTIAL |
| `moka` | MOKA café (Ambie) | sticky text + scrolling photo column, hero text parallax | PARTIAL |
| `tab` | tabkitchenbakery.com (taste library 6.8) | oval vignette that grows into the room on scroll | PARTIAL (Events) |
| `elan` | Élan Events (wedding) | sticky step timeline + stacked step cards | PARTIAL (mechanism only) |
| `madie` | madie.es (taste library 7.2) | specimen menu | SKIP for now (needs product cut-outs) |
| `florale` | Florale florist | scrubbed text reveal | PARTIAL (one detail) |
| `sunburst`, `baristi`, `cateredplate`, `savour`, `movero`, `camino`, `afterhours`, `bakeryco`, `lunarossa`, `deux`, `ember`, `yugure`, `onda`, `qitchen` | Framer food templates | checked and rejected as generic: centred pill heroes, arch photo cards, star testimonials, stats rows, sticker tapes, dark "luxury" fine-dining clones | SKIP |
| `undny` | und-ny.com (Awwwards inspiration: "pastry scroll", "page colour by content") | real matcha + bakery brand | PARTIAL: the **field wipe between chapters** (E2). Captured in a second pass with fixed wheel steps (custom smooth scroll). |
| `graza`, `kafea`, `balans` | graza.co, kafeaterra.eu, balanskitchen.pl | real brands | blocked (403) or a WebGL / canvas page that renders blank headless. Not used. |

---

## 1. Measured motion vocabulary (what "premium" is in numbers)

| Effect | Site | Duration / delay | Easing (measured) | Values |
|---|---|---|---|---|
| Hero kicker fade-rise | mornibali | 900 / +100 ms | `cubic-bezier(0.2, 0.7, 0.2, 1)` | translateY 24 → 0, opacity 0 → 1 |
| Hero giant word slide | mornibali | 1000 / +200 ms | same | translateX −40 → 0 |
| Hero meta block | mornibali | 900 / +500 ms | same | translateY 20 → 0 |
| Headings per word (sections) | mornibali | 450 ms, 30 ms per word | same | opacity only |
| Hero photo settle | curbside / peel | 1400 / 0 ms | `cubic-bezier(0.22, 1, 0.36, 1)` (our `--ease-out`) | scale 1.08 (curbside) / 1.04 (peel) → 1 |
| Nav drop | curbside / peel | 1000 / +400 ms | spring, no overshoot (50 % at ≈ 0.94) | translateY −100 → 0 |
| Meta row ("Today, Friday · place · hours") | curbside / peel | 700–800 / +350 ms | `cubic-bezier(0.23, 1, 0.32, 1)` | translateY 16–20 → 0 |
| Odometer digits (prices, numerals) | cenere | 900 ms, +70 ms per digit | `cubic-bezier(0.16, 0.84, 0.24, 1)` | each digit column translateY 0 → −N × 1em |
| Open-now status | cenere / truckfare | 600 ms fade; 2000 ms infinite pulse | ease / linear | opacity .4 → 1; ring pulse |
| Section reveal (Framer default) | agrovas, cateringgco | ≈ 1000–1500 ms | spring, no overshoot | translateY 20–40 → 0 |
| Hero text parallax | moka | scroll-linked | linear | translateY = −0.15 × scrollY |
| Rotating word list | cateringgco | 600 ms every 2000 ms | `cubic-bezier(0.44, 0, 0.56, 1)` | row opacities 0 / .1 / .5 / **1** / .5 / .1 / 0 |
| Clip window grows | truckfare (CSS `animation-timeline: view()`) | scroll-linked | linear | `clip-path: inset(18% 8% round 28px)` → `inset(0)` |
| Pinned video grows | beanro | scroll-linked, sticky 1641 px in 1917 | linear | scale 0.5 → 1.5, opacity 0.5 → 1 |
| Stacked sticky chapters | peel / hinoki | 3 × sticky `top:0` 1440×900 in a 2700 px parent | — | each chapter slides over the last (pure CSS) |
| Sticky card stack | dollop | cards `sticky; top:100px` 705×620 in a 3212 px parent | — | next card covers the last |
| Sticky text beside photo column | moka | text `sticky; top:0` 711×900 in a 7200 px parent | — | — |
| Sticky photo beside steps | curbside | photo `sticky; top:74px` 720×792 in a 2785 px parent | — | photo doesn't change; steps scroll past |
| Photo fan | dollop | scroll-linked | — | 5 cards from a stack to translateX ±78 % / ±150 %, rotate ±7° / ±14° |
| Pop-in tags | dollop | 700 ms, +140 ms each | `cubic-bezier(0.34, 1.7, 0.5, 1)` (overshoot) | scale 0.3 → 1 |

**Reading.** The premium templates use **one ease-out family with long tails** (0.9–1.4 s, nothing bouncy except one small detail per page) and **pure-CSS sticky** for every big scroll moment. Our `--ease-out` cubic-bezier(.22,1,.36,1) is the same curve curbside and peel use, so we keep it. The cheap templates (sunburst, baristi) use blur-ins, scale-from-0.5 and stickers. Blur is also on the rejection list for cost.

---

## 2. Pattern library

Format per pattern: **Seen** (URL · frames · section) → **Premium because** (measurable) → **Moves** → **Una Mattina** (page, section, content, images) → **Verdict**.
★ marks the top 10.

### A. Hero motion add-ons (full-bleed food photo hero)

**A1 ★ Live "open now" status with a pulse** (honest motion, our strongest hero add-on)
- Seen: curbside mobile hero (`curbside/key-m-hero-status.jpg`: "Today, Friday · Rainey Street Late Night · 70 Rainey St · 6 PM to 1 AM · Get directions", above the giant headline). truckfare "Today's stop" card with a live clock ("SUNDAY · 06:32", `truckfare/key-today-stop.jpg`). cenere top bar "Closed · opens today 17:00" with an opacity fade.
- Premium because the motion carries information: the only thing that moves is the thing that is live. Pulse period 2000 ms, sweep 1400 ms (truckfare `tfPulse`/`tfSweep`). The status row is 13–14 px caps on one line.
- Moves: a 10 px apricot dot plus a ring `scale 1 → 2.4`, `opacity .6 → 0`, 2000 ms linear infinite. **Only while the market is open now.** Otherwise the dot is static and brown ("Next: Sat 8 am").
- Una Mattina: /crepes hero `MarketStatus` ("At Saturday market now · until 12 pm"). Reduced motion: no ring. It must never pulse on a closed or "next" state, or it would lie.
- Verdict: **TAKE**.

**A2 ★ Scroll-away: hero stays, the page slides over it ("curtain")**
- Seen: peel / hinoki "Three Rooms": each chapter is `position: sticky; top: 0`, 1440×900, inside a 2700 px parent, and the next one slides over it (`peel/key-three-rooms-a.jpg`, `-b.jpg`). moka hero: text translateY −0.15 × scrollY while the photo stays.
- Premium because it costs nothing at runtime (CSS sticky, no JS) and makes the cream page physically cover the photo like a sheet.
- Moves:
  - The hero becomes `position: sticky; top: 0` (height 100svh), and the intro section after it gets `position: relative; z-index: 1` plus its field colour, so it slides over the hero.
  - While it is covered, the hero text drifts `translateY(calc(var(--p) * -12vh))` and fades to 0 by p = 0.6.
  - The photo scales 1 → 1.06 (p = section progress; CSS `animation-timeline: view()` where supported, otherwise one rAF writing `--p`).
- Una Mattina: /crepes hero → intro "One morning, one crêpe". Don't use it on Events Home (the video hero already has the board overlapping it).
- Guardrails:
  - Mobile Safari: sticky works, but the drift must be a transform, never `top`.
  - The sticky phone bar appears only after the intro covers the hero (keep the IntersectionObserver on `#crepes-hero` with `threshold: 0`, which still works).
  - Reduced motion: static, no sticky.
- Verdict: **TAKE**.

**A3 Odometer price on the featured board**
- Seen: cenere hero board and menu: every price is digit columns that roll into place. 900 ms, +70 ms per digit, `cubic-bezier(0.16,0.84,0.24,1)` (`cenere/key-hero-board.jpg`).
- Premium because the digits read as a mechanical menu board (split-flap). Prices are real data, so this is not a stat counter.
- Una Mattina: hero featured "Pistachio Bliss $11" (once, +900 ms after load) and, optionally, the menu prices when each row draws (they already rise; the odometer would replace the rise for the number only). `font-variant-numeric: tabular-nums`, digit column `overflow: clip` 1em, aria-hidden twin with the real price in sr-only. Reduced motion: static.
- Verdict: **TAKE (small)**.

**A4 Nav arrives from above**
- Seen: curbside / peel nav translateY −100 → 0, 1000 ms, +400 ms, spring with no overshoot.
- Ours today: −8 px, 700 ms. Raise it to the full nav height (−100 %), 900 ms, +300 ms. The apricot pill expands from its centre (`clip-path: inset(0 50% round 999px)` → `inset(0 0 round 999px)`, 700 ms, +500 ms) so the three links appear inside an opening pill, not just fade in.
- Verdict: **TAKE (cheap)**.

**A5 Masked line / letter rises** (we have them): mornibali word 450 ms per word at 30 ms stagger. Keep ours. **Do not** add blur-ins (sunburst, dollop: filter blur 6–10 px). Blur is costly on phones and reads as template.

**A6 Rejected hero add-ons:**
- beanro's two lines sliding in from ±250 px (1670 ms): showy, and it fights our letter rise.
- dollop's giant wordmark rising from the fold: our CRÊPES already is the giant word.
- cateringgco's inline image chips in the H1: already catalogued for the Events intro (beanro 4), wrong for a status-first QR page.
- Idle "breathing" Ken Burns on the AI photo: media-notes rule, no fake motion on stills.

### B. "How it's made" / process storytelling

**B1 ★ Sticky picture + steps that scroll past** (the one most food templates converge on)
- Seen: curbside "Prep Story" (`curbside/key-prep-story-a/b/c.jpg`). Left: photo 720×792, `sticky; top: 74px`, in a 2785 px section. Right: 5 steps, each a 64 px orange clock numeral ("12:00 AM", "6:30 AM", "10:15 AM", "11:00 AM", "2:47 PM") + 20 px caps title + 15 px paragraph, ~300 px apart with 1 px rules. Mobile: photo first, steps stacked, no pin (`key-m-prep-story.jpg`).
- Premium because one big image holds still while the text does the moving. Long pin, zero JS.
- Una Mattina: the base of /crepes "Made in front of you". We upgrade it with B2 (the picture changes framing per step).
- Note: curbside's clock times are invented-sounding. Our round-2 build rejected invented clock times, so we use **verbs, not times**.
- Verdict: **TAKE**.

**B2 ★ Camera path through one picture** (Luka's proposal, now built as `CrpSequence.vue`)
- Seen as mechanisms:
  - truckfare "The Double, taken apart": pinned 1440×900 inside 2700 px; the product is exploded into labelled layers while you scroll (`truckfare/key-taken-apart-a/b.jpg`).
  - beanro pinned video that scales 0.5 → 1.5 inside a 1641 px sticky.
  - tab: an oval vignette 1440×900 sticky in a 3350 px parent, growing from a small window into the whole room (`tab/key-vignette-a/b.jpg`).
- Premium because scroll is the camera. One asset becomes five shots, and nothing moves on its own.
- Una Mattina: /crepes "Made in front of you". Spec and review in §3.1.
- Verdict: **TAKE**.

**B3 Stacked sticky cards**
- Seen: dollop "Hello": left column `sticky; top: 110px` (statement card), right column of 705×620 "special" cards, each `sticky; top: 100px`, every new card covering the last over 3212 px (`dollop/key-sticky-cards-a/b/c.jpg`). élan: a sticky progress rail (800×59, `top: 100px`) over stacked step cards (1000×507, `top: 200px`) (`elan/key-sticky-timeline.jpg`).
- Una Mattina: Events **How We Work** (4 moments as painted boards that stack, each covering the last, a rail with 4 ticks above). Also the reduced-JS fallback for /crepes Made if the camera path is dropped.
- Verdict: **TAKE for Events**.

**B4 Stair-step process row**
- Seen: peel "Dough Days" / hinoki "Ten hours of prep, ten seconds a piece" / growler "One brew day": a row of 6 photos whose heights step up toward the middle (≈ 90 → 160 px offsets), each captioned with a stage. hinoki puts them on a dotted timeline (7 AM … 5:30 PM) with a green **"Now" dot placed by the real clock** (`peel/key-dough-days.jpg`, `hinoki/key-stair-row-a.jpg`, `hinoki/key-stair-row-b-now-marker.jpg`). Static CSS, no scroll motion.
- Una Mattina: Events How We Work summary on Home (4 boards stepping up like stairs = "from first message to the day"). Placeholders allowed: flat colour boards, no photos needed.
- Verdict: **PARTIAL**.

**B5 Process facts as big numerals**
- Seen: cenere "A whole day of waiting. Sixty seconds of fire.": three full-bleed photo panels, each with a 180 px odometer numeral (24 hours / 250 grams / 485 degrees) and a one-line caption (`cenere/key-fire-numeral-a/b.jpg`).
- Premium because the numbers are about the craft, not about customers. It's the only "stats" form that passes our no-invented-proof rule, **if the facts are real**.
- Una Mattina: optional final beat of the /crepes sequence, e.g. "2 folds · 1 cone". Griddle temperature and seconds per side **only after the owner confirms them** (TBC chips otherwise). Not before.
- Verdict: **HOLD until facts exist**.

**B6 Scrubbed statement** (florale "Text revel": words go from 20 % to 100 % ink as you scroll). One sentence max per site. Candidate: the About "Market → Events → Café" sentence. **PARTIAL**.

### C. Signature product / menu highlight

**C1 ★ Week board with "today" row** (also the visit block, see D1)

**C2 Exploded "taken apart" anatomy**
- Seen: truckfare (burger layers with labelled ingredients and price, pinned).
- Una Mattina: needs product cut-outs we don't have. The brand-flat version is §3.2 option B (the crêpe drawn as shapes: disc → half → quarter → cone). **PARTIAL**.

**C3 "What's going out now" live board**
- Seen: cenere board "What is going out right now: 14 pizze · 40 covers". glacee "flavours today", a display case with "sold out" tags and "6 of 6 in the case" (`glacee/key-flavours-today.jpg`).
- Una Mattina: later, if the owner wants to toggle "sold out" per crêpe on market day (a `soldOut` flag in `data/menu.ts` → the row dims to 40 % and gets a "Sold out today" chip). Don't fake it.
- Verdict: **LATER**.

**C4 Tabbed menu with photo** (cateringgco "Guest favorites": tabs Canapés / Mains / Sweets beside one photo, `cateringgco/key-tab-menu.jpg`). /crepes: **SKIP**, because tabs hide half the menu from someone in the queue (round-2 decision). Events Live Stations: possible for station menus.

**C5 Giant word behind multi-speed columns**
- Seen: moka "most ordered": 300 px word with product cards scrolling over it (`moka/key-most-ordered.jpg`). dollop columns at translateY −70 / +50 / −150 px over the section.
- SKIP: product grid with "order now" buttons; we have no product photos.

### D. Visit / hours / social / footer

**D1 ★ Day board: "Today's stop, and the rest of the week"**
- Seen:
  - curbside "Six lots, seven days" (`curbside/key-stops-board.jpg`): rows of MON…SUN in 40 px caps, place 18 px caps, address 13 px, hours in mono caps, "Get directions" link right, a "TODAY" sticker on today's row, 1 px rules.
  - truckfare (`truckfare/key-today-stop.jpg`): a live card left (clock, today's place, "Order ahead" / "Directions"), the week list right with **past days dimmed to ~35 %**.
- Premium because it answers "where, when, now?" in one glance and the list itself shows the state (today highlighted, past dimmed), with no extra UI.
- Una Mattina: /crepes **"Find the stand"** (see §3.4). The day is the headline of the row: "SAT" / "SUN" in `sign-m`, then market name, address, hours in tabular figures, "Directions ↗".
  - Today's row gets an apricot plank behind the day, plus A1's dot if it is open now.
  - **While open, today's row also gets a 2 px opening-hours bar** (open → close) with a "Now" dot placed by the clock: hinoki's "Now" marker, `hinoki/key-stair-row-b-now-marker.jpg`. It is honest because it uses only the market hours we already have. The dot moves once a minute, no animation needed. Reduced motion: same, it is not motion.
  - A market that already closed today dims to 45 %, with "back next Saturday".
- Verdict: **TAKE**. This replaces the Paris counter photo (dark, steamy, someone else's shop, at night: the opposite of "sunny Mediterranean morning").

**D2 Route map day by day** (truckfare "Where to find us, day by day": pinned 3600 px, a night-city map with a route drawing per day, `truckfare/key-route-a/b.jpg`). **SKIP**: two markets don't need a map, and the brief says link to Maps, no embed.

**D3 ★ Instagram block without a feed: "deal out" cards**
- Seen: dollop "follow us on instagram": 5 photo cards stacked, fanning out on scroll to ±78 % / ±150 % with ±7° / ±14° rotation, the centre card carrying the handle chip, then "say hi on instagram" (`dollop/key-fan-a/b.jpg`). glacee "@glacee, out in the sun": 4 photos + "follow along" + a round "tag us!" sticker (`glacee/key-social.jpg`).
- Una Mattina: /crepes, a new short section before "Find the stand" or merged into its "Say hi":
  - The **handle as the headline** (`sign-l` "@unamattina", TBC chip), plus 4 square cards that deal out from a stack when the section enters (once, 900 ms, `--ease-out`, +80 ms each; translateX only, **no rotation**: square corners and straight boards are the house style).
  - Cards available today, all labelled "Concept image": the hero AI image, the merch mockup, the booth mockup, the brand board. Swap for real posts later.
  - Button "Follow on Instagram ↗" (or `#follow` until the URL exists).
- Verdict: **TAKE (straightened)**.

**D4 Visit cards with photo** (glacee "two shops, one kitchen": photo card + address + hours + get directions, `glacee/key-visit-cards.jpg`). **SKIP** for now: D1 needs no photos.

**D5 Footer with big wordmark rising**: confirmed by curbside, glacee, sunburst and peel (footer wordmark fades up 4–10 px). We already have the sunrise wordmark. **No change.**

### E. Events site

**E1 ★ Occasions wheel**
- Seen: cateringgco "Who we serve" (`cateringgco/key-occasions-wheel.jpg`): 5 visible rows of 40 px type in a dark panel. The active row is 100 % ink, its neighbours 50 % and 10 %; the list advances one row every 2000 ms with a 600 ms `cubic-bezier(0.44,0,0.56,1)` glide.
- Una Mattina: Home "At home or on the beach". Today the occasions sit in a static 2-column list. Replace it with a `sign-m` wheel of the brief's occasions (birthdays, bridal and baby showers, brunches, rehearsal dinners, engagements, corporate gatherings, intimate weddings) on cream, beside the sentence "We set up at private homes, backyards, beaches and parks…".
- a11y: the full list sits in the DOM as a `<ul>` (visually it is the wheel), the wheel pauses on hover/focus and when off-screen, `aria-hidden` on the animated clone. Reduced motion: static list.
- Verdict: **TAKE**.

**E2 ★ Stacked full-bleed chapters for the three services**
- Seen: peel / hinoki "Three Rooms" (`peel/key-three-rooms-a/b.jpg`): three chapters, each 100vh, sticky, sliding over each other. Title bottom-left in 64 px ("The dining room.", "Party trays.", "The slice window."), one paragraph, a 1 px rule, a link.
- Una Mattina: Home. Replace the lopsided "Picnics | Bloom Cart" split and the "Made in front of your guests" band with **three chapters**: Live stations (apricot field, griddle placeholder) → Luxury picnics (yellow field, clam-pass 3:2 credited photo) → Bloom Cart (sage field, flower-market photo, credited). Each chapter:
  - left 6 cols: `sign-l` title, one Playfair sentence, link;
  - right 6 cols: the image in a square frame, or a labelled `ShootSlot` until the shoot. Not full-bleed, because we don't own the photos.
  - The colour field itself slides over the previous one: that is the lido "cabana changes" moment.
  - The UND NY version of the same move (`undny/key-chapter-13.jpg` → `-14` → `-15`): each chapter is a 1440×900 sticky inside 1800–5133 px. **The next chapter's flat colour field wipes up from the bottom edge** over the previous one (tan → olive → pink), and its giant caps title ("BAKERY", "MERCHANDISE") arrives with the field, not after it.
  - For us: the field edge carries the awning valance (scallops on the top edge of the rising field), so every chapter change literally lowers a new awning. Skip UND's blur-to-sharp image reveal (cost, and blur is on our no list).
- Mobile: no sticky; three stacked bands, each with its valance edge.
- Verdict: **TAKE**.

**E3 Clip window that opens on scroll**
- Seen: truckfare closing photo `clip-path: inset(18% 8% round 28px)` → `inset(0)` on `animation-timeline: view()`. cateringgco hero photo growing from an inset band to full width (`cateringgco/key-hero-grow.jpg`). tab's oval vignette.
- Una Mattina: Live Stations opener (round 2 already specified the beanro "cabana window"). Use square `inset(14% 22%)` → `inset(0)` (no radius), CSS scroll-driven with an IntersectionObserver class fallback.
- Verdict: **TAKE (confirms round 2)**.

**E4 Inquiry CTA as three formats**
- Seen: curbside "Feed 20 to 250 people from the window": H2 + 3 formats (Lunch drop $16 / Party tray $19 / Truck at your event from $1,200) with a per-format link.
- Una Mattina: the Home closing CTA can list the three ways in ("A live station" · "A picnic" · "The Bloom Cart") as links that pre-fill /inquire. **No prices.** Guest range only if the owner confirms it.
- Verdict: **PARTIAL**.

**E5 Upcoming dates as an index** (curbside "Coming up on weekends", hinoki "Four nights at the counter": date numeral 40 px + name + place + small thumb). For /crepes: upcoming special markets, once they exist. **LATER**.

**E6 Gallery before photos exist.**
- None of the templates solve this honestly: all of them use stock/AI "real life" galleries (cateringgco "What this looks like in real life" with "Garden wedding, 180 guests" captions on stock photos). We don't copy that.
- Our rule stays: labelled `ShootSlot` frames in tone colours, one per service, plus credited world photos captioned "not a Una Mattina event".
- New idea from this round: put the **planned shot list** in the slot ("Styled shoot, spring: crêpe station at golden hour · Bloom Cart at a bridal shower"). It turns the gap into a promise with a date and reads as honest.
- Verdict: **OWN**.

### F. Rejected this round (generic or dishonest)
- Star-rating testimonials and "Kind words" carousels (cateredplate, savour, sunburst, baristi, movero, élan).
- Arch-shaped photo cards (cateringgco services, cateredplate, élan).
- Stats rows "640+ events · 4.9 rating" (cateringgco, movero "12K+ / 50+").
- Per-guest price cards (cateringgco $18 / $42 / $75).
- Sticker tapes and keyword marquees (baristi "FRESH JOY", florale "We Celebrate ✱").
- Blur-in headings (sunburst, dollop).
- Coverflow / photo carousels with arrows (camino, cateredplate).
- Dark "fine dining" palettes (camino, afterhours, ember, élan).
- AI cut-outs with splashes (beanro, baristi).
- Map embeds (madie, glacee).
- Newsletter "join the club" cards.

---

## 3. Redesign specs

### 3.1 /crepes "Made in front of you": review of the built `CrpSequence.vue` + deltas (priority 1)

**What is built (00:30):** a brown section, 100svh sticky stage inside `100svh + 4 × 70svh`. Left: H2 + one active step (title + line) + 5 thumbnail ticks. Right: a frame with the AI image that pans/zooms between 5 camera stops (z 1 → 1.75 → 2.1 → 1.9 → 1.8), holding on each step (smoothstep over the middle 60 % of each segment). Fallback is a stacked list with stills.

**Verdict:** right pattern (B1 + B2, the same family as curbside Prep Story and truckfare Taken Apart). Eight deltas, in priority order:

1. **Resolution: cap the zoom.**
   - The source is 1672×941; `hero-ai-1920.webp` is an upscale. The desktop frame is the 7fr column, ≈ 780×820 CSS px, so base ≈ 0.87. At z = 2.1, one source pixel covers ≈ 1.83 CSS px ≈ 3.7 device px on Retina.
   - Measured: `r3-motion/_una-mattina-now/seq-step3-2x-detail.jpg` is a 1:1 crop of the step-3 frame at DPR 2. The cream and berries are mushy and show webp blocking. This is the first thing a viewer will notice on a MacBook or iPhone.
   - The rule that keeps it acceptable: **at most 1.2 CSS px per source px**. The hero itself runs at ≈ 0.86, the menu band at ≈ 1.1. In other words, the crop shown in a frame W CSS px wide must be at least W / 1.2 source px wide.
   - **Real fix (ask Luka, 5 minutes in his AI tool):** a 2× render or upscale of the source (≥ 3344×1882) used only by the sequence, `seq-source-3344.webp` (≈ 350–450 KB, lazy, `decoding=async`). With it, every framing below is crisp on Retina even in the current 780 px frame.
   - **Until then:** a 4:5 frame, **480 CSS px wide on desktop** (≈ 600 tall) and the full column on phones (≤ 390 px), with crops no narrower than 400 source px. These are the framings in `references/r3-made-crops/` (`sequence-strip.jpg`). Source rectangles are in px of the 1672×941 original. For a 480×600 frame, base = max(480/1672, 600/941) = 0.638 and z = 480 / (crop w × 0.638):

   | Step | Crop (x, y, w, h) | Camera centre (x, y) | z in a 480×600 frame | CSS px per source px |
   |---|---|---|---|---|
   | 1 counter (establishing) | 500, 0, 752, 940 | 876, 470 | 1.00 | 0.64 |
   | 2 folds | 640, 441, 400, 500 | 840, 691 | 1.88 | 1.2 |
   | 3 topping (cream, berries) | 890, 400, 400, 500 | 1090, 650 | 1.88 | 1.2 |
   | 4 pour (jug + syrup) | 905, 40, 400, 500 | 1105, 290 | 1.88 | 1.2 |
   | 5 handed over | 380, 380, 400, 500 | 580, 630 | 1.88 | 1.2 |

   On a 390 px phone frame (4:5, 488 tall), the same crops give 0.98 CSS px per source px: fine. **The frame is the lever: 4:5 at ≤ 480 px, not a 780 px near-square column.** It also makes the composition calmer (a framed print on a cream wall, not a second hero).

1b. **Steps 2 and 3 look like the same shot on phones** (`_una-mattina-now/crepes-mobile-sheet.jpg`, second row: "Folded while it is soft" and "Filled the way you like" both show cream and berries). The built camera centres are only ≈ 115 source px apart: (1030, 700) and (1050, 585). The table above separates them: folds = the lower-left layered edges (640–1040, 441–941), topping = the cream and berries above (890–1290, 400–900). Each step must show something the previous one did not.

2. **Make it read as a camera, not a slideshow.** Camera moves between stops use an in-out curve (`cubic-bezier(.65,0,.35,1)`-shaped mapping instead of smoothstep is fine). The **hold should be ≥ 40 % of each segment** (now 40 %; keep it). Add a 2 % `scale` overshoot-free settle on arrival? **No.** Keep it calm: mornibali and curbside never bounce.

3. **Step text: mask, don't swap.** Today the title and line change instantly. Mirror the hero's language instead:
   - The outgoing step rises out of a 1-line mask: translateY 0 → −100 %, 240 ms ease-in.
   - The incoming one rises in from +100 %: 560 ms `--ease-out`, +60 ms for the line under it.
   - Interruptible (CSS transitions on a class), since fast flicks skip steps.

4. **Step counter, done tastefully.** Replace the thumbnail ticks (tiny 160 px crops at ~36 px read as noise; see the sheet) with:
   - a `small` caps line "02 / 05" in tabular figures;
   - a 2 px progress rail that scales X with progress (élan sticky rail);
   - **the five step titles as a vertical list where the active one is 100 % ink and the others 35 %** (agrovas tab list, cateringgco wheel). It is both the index and the navigation. Clicking a title scrolls to its step, as `go(i)` does now.
   - Mobile: rail + "02 / 05" only.

5. **Copy must match the picture.**
   - Step 1 currently says "Your crêpe starts as batter on a hot griddle" over a plated, finished dish. Either drop the batter clause ("Made when you order. Nothing waits under a lamp.") or move it.
   - Step 5 shows a plate set on a café counter while the text promises a paper cone. Keep the text (it's true at the stand), and end the sequence on the brand: on the last 30 % of the run, the frame wipes (`clip-path inset(0 0 0 0) → inset(0 0 0 100%)`, 700 ms tied to progress) to an **apricot field with the cone mark** (the turned A from `CrpSignFlip`) and the line "At the market it leaves in a paper cone." That resolves the plate/cone contradiction and closes the loop with the intro's sign.
   - Keep the "Concept image · placeholder until our own shoot" chip on the frame at all times.

6. **Don't show the same picture three times in a row.**
   - The hero, the new menu band (`menu-band-*.webp`) and the sequence all use the same AI plate. A visitor sees one scene 3× in ~4 screens, and it starts to look like we have one photo (we do).
   - **Remove the menu band.** The menu ends on its rules (mornibali menu is type only). Let the sequence be the only re-use, where re-use is the point (one picture, five shots).

7. **Field and frame.** Brown field + brown hero tint means the hero and the sequence are the same dark mood. Run the sequence on **cream** (`--ground`) with brown ink, the image frame square-cornered, 4:5, right-hand 5 cols on desktop (left 6 cols for the text/list), centred stage. On phones:
   - frame on top, 56svh, `max-height: 520px`;
   - step text in a fixed-height board under it (3 lines reserved, so nothing jumps);
   - the cone-mark finale fills the frame.

   This makes the page alternate dark hero → cream intro → yellow menu → **cream** sequence. If cream-after-yellow feels flat, use `--cream-deep`, never brown twice.

8. **Pin length and exits.**
   - Keep `100svh + 4 × 70svh` (5 steps ≈ 380svh): curbside runs 2785 px for 5 steps at 900 px, ≈ 3.1 vh. Don't go longer.
   - After the last step add 30svh of release where the frame scales to 0.96 and the next section (Find the stand, sage) slides up over the stage. The A2 curtain again, the same move as the hero exit, so the page has one scroll language.
   - Reduced motion / no JS: the stacked list as now, but with the **crops from `r3-made-crops/`** as 4:5 stills in a 2-col grid (desktop) / 1 col (phone), not 4:3 boxes of the whole image.

**Motion table (sequence)**

| Element | Property | Duration / easing | Trigger | Reduced |
|---|---|---|---|---|
| Image layer | translate + scale (camera) | scroll-linked, hold 40 % / travel 60 % per step, in-out mapping | scroll | static crops |
| Step title / line | translateY mask out −100 % / in +100 % → 0 | 240 ms in-ease / 560 ms `--ease-out`, +60 ms | step change | instant |
| Index list | colour/opacity 35 % → 100 % | 240 ms `--ease-out` | step change | instant |
| Rail | scaleX = progress | scroll-linked | scroll | hidden |
| Finale wipe to cone mark | clip-path inset | scroll-linked over the last 30 % | scroll | cone card shown as the 6th still |
| Release | stage scale 1 → .96, next section overlaps | scroll-linked | scroll | none |

### 3.2 /crepes "Folded hot" replacement (priority 1, already removed; decide what fills the slot)

The card was removed in the build, so the question is what, if anything, takes its job: telling people that **it's cooked to order, folded into a cone, and what it costs**.

- **Option A (recommended): no new section, three moves.**
  1. Its first fact ("cooked to order") is now step 1 of the sequence.
  2. Its second ("folded into a cone you can walk with") is the sequence finale (§3.1 delta 5, the cone mark).
  3. Its third (the price range) moves into the menu head as one line under "The menu": "Sweet $8–11 · Savory $10–11" in tabular figures with a TBC chip. Prices roll in with the A3 odometer when the menu enters.

  Net: the page is one screen shorter, the stock photo is gone, nothing is lost.

- **Option B (if Luka wants a signature moment between menu and sequence): "The fold".** A flat-shape animation in brand colours, no photo:
  - an apricot disc (the crêpe) folds in half (top half `rotateX(180deg)` around the centre line, 520 ms `--ease-out`);
  - then into a quarter (`rotateY(180deg)`, 520 ms, +120 ms);
  - the quarter turns point-down (rotate 135°, 640 ms spring-free ease-out) and becomes **the cone of our mark**, whose half-sun filling rises at the mouth (the CrpSignFlip ending);
  - captions swap under it: "A round, thin as paper." → "Folded in half." → "And again." → "Into the cone. Walk with it.";
  - plays once on view (−25 % margin), then tap to replay (a button, `aria-pressed` pattern as in CrpSignFlip);
  - layout: cream-deep band, the shape left (4 cols, 280–360 px), the captions + price line right;
  - reduced motion: the final cone with all four captions as a list.

  Reference logic: truckfare "taken apart" (a product explained by deconstructing it) and the beanro / mornibali rule "one illustration language only". It is ours, not copied.

  Risk: two cone animations on the page (intro sign + fold). If B ships, **merge them**: the intro sign becomes the fold's last frame and the separate tap-to-turn sign goes away.

### 3.3 /crepes hero motion additions (priority 2)

Keep everything in `build-log.md` (photo settle, letter rise, circumflex drop, board valance). Add, in this order of value:

| # | Add-on | Spec | Ref |
|---|---|---|---|
| 1 | **Open-now pulse** on the status line | 10 px apricot dot + ring scale 1 → 2.4 / opacity .6 → 0, 2000 ms linear infinite, only when `status.open`. Text "Open now at Saturday market · until 12 pm". Ring hidden in reduced motion and when the tab is hidden. | A1 (curbside, truckfare, cenere) |
| 2 | **Curtain exit** | hero `sticky; top:0`. The intro slides over it. Hero text translateY 0 → −12vh and opacity 1 → 0 over the first 60 % of the overlap; photo scale 1 → 1.06. CSS scroll-driven (`animation-timeline: view()` on the intro, `animation-range: entry 0% entry 100%`) with a one-rAF `--p` fallback. | A2 (peel, moka) |
| 3 | **Odometer price** on the featured board | digits roll 900 ms, +70 ms per digit, `cubic-bezier(.16,.84,.24,1)`, start at +900 ms (after the board slides in). | A3 (cenere) |
| 4 | **Nav from above + pill opens** | nav translateY −100 % → 0, 900 ms `--ease-out`, +300 ms. The pill's `clip-path: inset(0 50% round 999px)` → `inset(0 round 999px)`, 700 ms, +500 ms; its links fade in +80 ms each after it opens. | A4 (curbside, peel) |
| 5 | (optional) **Pointer-parallax** on desktop only | photo translate ±8 px following the pointer, lerp 0.08 per frame, `(hover:hover) and (pointer:fine)` only, off in reduced motion. Small, but it makes the still feel lit. Skip if the curtain ships (one scroll language is enough). | — |

Do **not** add: blur-ins, split lines from both sides, idle Ken Burns, a second giant word.

### 3.4 Other sections below the bar, by priority

1. **/crepes "Find the stand" (P1)**
   - The Paris counter photo is dark, steamy, at night, and from someone else's shop. It is the only off-brand picture left on the page. On phones it is a near-full-screen dark block right after the sequence (`_una-mattina-now/crepes-mobile-sheet.jpg`, second row, last frames).
   - Replace the right column with **D1 Day board**: one row per market (SAT, SUN in `sign-m`), today's row on an apricot plank with the A1 dot when open, closed-today rows at 45 %, "Directions ↗" per row, tabular hours.
   - Left column: the "Heads up" line (weather / sold out) and "Say hi" become one small block under the board.
   - No photo in this section. Ref: `curbside/key-stops-board.jpg`, `truckfare/key-today-stop.jpg`.
2. **/crepes Instagram (P2):** D3 deal-out cards with the handle as headline (see above). Today Instagram is a single dd line and a sticky-bar button.
3. **/crepes menu band (P1, quick):** remove it (§3.1 delta 6).
4. **Events Home "Picnics | Bloom Cart" split + "Made in front of your guests" band (P2):** E2 stacked chapters (three services, each its own field). Fixes the lopsided half-empty split visible in `_una-mattina-now/home-desktop-sheet.jpg`.
5. **Events Home occasions list (P3):** E1 wheel.
6. **Events How We Work (P3):** B3 stacked boards with a progress rail. Home summary as a B4 stair-step row.
7. **Events Live Stations opener (P3):** E3 square clip window (confirms round 2).

---

## 4. Top 10 (one line each)

| # | Pattern | Ref (frames) | Target |
|---|---|---|---|
| 1 | B2 Camera path through one picture (with the §3.1 deltas) | truckfare taken-apart, tab vignette, beanro pinned video | /crepes Made in front of you |
| 2 | B1 Sticky picture + steps scrolling past, verbs not times | `curbside/key-prep-story-*.jpg` | /crepes Made (layout) |
| 3 | D1 Week board with today's row, past days dimmed | `curbside/key-stops-board.jpg`, `truckfare/key-today-stop.jpg` | /crepes Find the stand |
| 4 | A1 Open-now pulse (motion only when live) | curbside m-hero, truckfare, cenere | /crepes hero status |
| 5 | A2 Curtain exit (sticky hero, page slides over) | `peel/key-three-rooms-*.jpg`, moka | /crepes hero → intro; also the sequence release |
| 6 | E2 Stacked full-bleed chapters for 3 services | `peel/key-three-rooms-*.jpg`, hinoki | Events Home services |
| 7 | D3 Deal-out cards + handle headline (no feed) | `dollop/key-fan-*.jpg`, `glacee/key-social.jpg` | /crepes Instagram |
| 8 | A3 Odometer prices | `cenere/key-hero-board.jpg` | /crepes hero board + menu |
| 9 | E1 Occasions wheel | `cateringgco/key-occasions-wheel.jpg` | Events Home occasions |
| 10 | B3 Stacked sticky boards + rail | `dollop/key-sticky-cards-*.jpg`, `elan/key-sticky-timeline.jpg` | Events How We Work |

---

## 5. Implementation notes (v2 pass): minimal, house-style code for the top patterns

All of this is transform / opacity / clip-path only, `--ease-out` = cubic-bezier(.22,1,.36,1), and has a reduced-motion final state. Vue/Nuxt equivalents are trivial. The snippets show the mechanism, not finished components.

**A1 open-now pulse** (`MarketStatus.vue`)
```css
.status__dot { position: relative; width: 10px; height: 10px; border-radius: 50%; background: var(--accent); }
.status--open .status__dot::after { content: ""; position: absolute; inset: 0; border-radius: inherit; background: inherit;
  animation: um-pulse 2000ms linear infinite; }
@keyframes um-pulse { 0% { transform: scale(1); opacity: .6 } 70%, 100% { transform: scale(2.4); opacity: 0 } }
.status:not(.status--open) .status__dot { background: var(--on); opacity: .7 } /* closed / next: static */
@media (prefers-reduced-motion: reduce) { .status__dot::after { animation: none; display: none } }
```
Also pause it while `document.hidden` (add `.is-paused { animation-play-state: paused }`).

**A2 curtain exit** (hero → intro), CSS first, JS fallback
```css
.hero { position: sticky; top: 0; z-index: 0 }
.intro { position: relative; z-index: 1; background: var(--ground) }   /* slides over the hero */
@supports (animation-timeline: view()) {
  .hero__body { animation: um-hero-away linear both; animation-timeline: --intro; animation-range: entry 0% entry 60% }
  .hero__img  { animation: um-hero-push linear both; animation-timeline: --intro; animation-range: entry 0% entry 100% }
  .intro { view-timeline-name: --intro }
  /* needs the timeline in scope: put `timeline-scope: --intro` on the common parent (.crepes) */
}
@keyframes um-hero-away { to { transform: translateY(-12vh); opacity: 0 } }
@keyframes um-hero-push { to { transform: scale(1.06) } }
@media (prefers-reduced-motion: reduce) { .hero { position: relative } .hero__body, .hero__img { animation: none } }
```
Fallback (Firefox, older Safari): one rAF on scroll that writes `--p` = intro overlap 0…1 on `.crepes`, with `transform: translateY(calc(var(--p) * -12vh))`. The load choreography on `.hero__img` (scale 1.06 → 1) must finish before the timeline takes over: give the scroll animation to a wrapper (`.hero__media`), not to the same element.

**A3 odometer price**
```html
<span class="odo" aria-hidden="true"><span class="odo__col" style="--d:1"><span>0</span>…<span>9</span></span><span class="odo__col" style="--d:1">…</span></span>
<span class="sr-only">$11</span>
```
```css
.odo { display: inline-flex; height: 1em; overflow: clip; line-height: 1; font-variant-numeric: tabular-nums }
.odo__col { display: flex; flex-direction: column; transform: translateY(calc(var(--d) * -1em));
  transition: transform 900ms cubic-bezier(.16,.84,.24,1); transition-delay: calc(var(--i) * 70ms) }
.odo:not(.is-in) .odo__col { transform: translateY(0) }  /* start at 0, roll to the digit */
```

**D1 day board with the "Now" bar** (`Find the stand`)
- Row anatomy (desktop): `[SAT sign-m on plank] [market name title / address small] [8:00 – 12:00 tnum] [Directions ↗]`. Grid `minmax(5ch,auto) minmax(0,1fr) auto auto`, 24 px row padding, no rules: tone steps as now.
- Today + open: under the row a 2 px track, `background: color-mix(in srgb, var(--on) 20%, transparent)`, with a fill `transform: scaleX(var(--t))` (t = (now − open) / (close − open)) and a 10 px dot at `left: calc(var(--t) * 100%)` that reuses the A1 pulse. Update `--t` once a minute from `useMarketStatus` (it already holds the clock). No animation beyond that.
- Closed today: `opacity: .45` + "Back next Saturday" in `small`.

**D3 deal-out cards** (Instagram)
```css
.ig__cards { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px }
.ig__card { aspect-ratio: 1; transform: translateX(calc((1.5 - var(--i)) * 100% + (1.5 - var(--i)) * 16px)); /* stacked at centre */
  transition: transform 900ms var(--ease-out) calc(var(--i) * 80ms) }
.ig.is-in .ig__card { transform: none }
@media (max-width: 599px) { .ig__cards { grid-template-columns: repeat(2, minmax(0,1fr)) } }
```
Each card carries the "Concept image" chip; z-index ascending so the deal-out reads as cards leaving a stack.

**E1 occasions wheel**: a 5-row window (`height: 5lh; overflow: clip`), the list `translateY(calc(var(--k) * -1lh))` advanced by `setInterval(2000)` with `transition: transform 600ms cubic-bezier(.44,0,.56,1)`. Row opacity is derived from the distance to the centre row (`.is-c` 1, `±1` .5, `±2` .12). Clone the list once for the seamless loop and `aria-hidden` the clone. Pause on `:hover`, `:focus-within`, off-screen (IntersectionObserver), and `document.hidden`.

**E2 stacked chapters**: three `<section class="chap">` with `position: sticky; top: 0; min-height: 100svh`, each followed by nothing (the next chapter is the cover). The top edge of chapters 2–3 is an `Awning variant="valance"` in the chapter's own tone, absolutely positioned at `top: calc(var(--stripe) / -2)`. The last chapter needs a normal (non-sticky) section after it, so the stack releases. Below 900 px: `position: relative`.
