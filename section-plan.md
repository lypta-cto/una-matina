# Section plan — Una Mattina Events (Lido) — art direction + anti-slop gate

Author: art director agent, 2026-10-17. Sources read: brief, PRODUCT, design-direction (Pravac 2 — Lido), DESIGN, copy, references README + sections-catalog, reference screenshots, house rules (anti-generic-design, taste-skill house rules + laws, impeccable craft-floor), current build (`screens/*` from 22:22, `app/app/**`), `media-notes.md` (22:34).
Scope: the 8 Events pages. /crepes only gets review notes (§6).

**Notation.** `[ref: slug — n]` = sections-catalog item · `[own]` = brief / design-direction / DESIGN · `[existing]` = current build already right.
Type classes: `sign-xl` `sign-l` `sign-m` `title` `statement` `body` `small` (DESIGN.md). Cols = the 12-col grid inside `.wrap` (max 1440, gutter token).
Motion family (only this): `--ease-out` cubic-bezier(0.22,1,0.36,1) for every entrance/state change; `--ease-in-out` only for the one slow loop (still-image scale). Durations 160 / 240 / 560 ms. Transform + opacity only. Every motion has a `prefers-reduced-motion: reduce` fallback (static, final state).
**Reference budget rule.** Counted per page over its section decisions, excluding the shared close (G7) and footer. No reference above ~1/3.
**Headline arithmetic** (measured from the build: Montserrat caps ≈ 0.68 em per character incl. spaces). Chars per line ≈ width / (0.68 × font-size). At 390 px (358 px usable): sign-l 40 px → 13 chars, 46 px → 11, 52 px → 10. At 1440: sign-l ≈ 86 px → 781 px (7 cols) holds 13 chars; sign-xl ≈ 132 px → 1360 px holds 15. Use this before choosing any H1/H2 copy.

---

## 0. Verdict on the current build

Brand is applied well (awning, fields, square corners, footer wordmark, labelled placeholders, credited photos, TBC markers). The problems are structural:

1. **Every inner hero is the same composition** (text left on a field, right half empty): Services, Live Stations, Picnics, How We Work, Inquire. Same layout on 5 pages, and the empty half reads unfinished.
2. **Banned patterns in place:**
   - How We Work: 3×3 grid of identical cards with big index numerals 1–9 (index numbering + identical cards). Two cards are randomly tinted (Inquiry yellow, Event day apricot) with no meaning.
   - Home "How it goes": 4 equal columns, each topped by an apricot half-sun icon (icon-topped card row).
   - Home `EventAnatomy`: 8 equal apricot tiles in a 4×2 grid plus a "8 of 8" counter that reads like a stat.
   - Bloom Cart "How it works": 3 identical staggered cards.
   - About "Market, Events, Café": 3 identical cards with sun icons and italic eyebrows ("Today / Next / One day").
   - Playfair used for single words and fragments, not sentences: `WordList` titles ("Planning", "Production", "Where", "For", "Ideal for", "Custom details"), `EventAnatomy` pillar captions, About stage labels, `InquiryForm` legends ("About you", "When and where").
   - Hairlines between Live Stations rows; 1 px borders on mobile menu links (`SiteHeader .sheet__link`).
3. **Headlines over 2 lines:** Home H1 "Planned, styled, served" (3 lines at desktop and mobile), Home "Backyards, beaches, poolside" (3), Home origin "It started with a crêpe" (3 in 6 cols), Live Stations "One counter, many stations" (4), About "Mediterranean mornings, Gulf light" (3).
4. **DESIGN rule breaks:**
   - Two full yellow bands on Home, Live Stations and About (yellow hero + the shared yellow `CloseCta`).
   - Sage on Luxury Picnics ("Public places have rules"); sage is Bloom Cart only.
   - Up to 3 awnings on one page (Live Stations: page + `StationCounter` + `ShootSlot`).
   - `ShootSlot` mini-awnings hang over cream-deep, which is the "awning over cream" failure: the stripes read as tabs.
   - Primary CTAs are brown everywhere; DESIGN says apricot primary.
5. **Dead space:** `ShootSlot` sections are 600–650 px tall empty cream-deep boxes with a tiny caps title (Live Stations, Picnics, Bloom Cart). Home "Picnics and a flower cart" is lopsided: photo bottom-left, a big empty right of the H2, a small sage card with an "A" icon.
6. **Media misuse risk.** Per media-notes, `crepe-cone`, `coffee-cup`, `apron`, `tote` and `napkins-*` are 230–350 px wide and should never display above ~240–320 px. Services shows `crepe-cone` at ~290 px (soft on 2×). The napkins have garbled AI text.
7. **Same close on every page:** an identical yellow `CloseCta` band ends every page.
8. The **video hero** (Luka's explicit ask) is not built yet. The Home first screen is the generic "text left + photo right on a field".

---

## 1. Global tasks (do first; every page depends on them)

**G1. Fascia → awning → field (layout order).** `layouts/default.vue`: render `<SiteHeader/>` first, then `<Awning/>`, both inside the `.under-awning` wrapper on the page field. The header is the lido's fascia sign and the awning hangs under it, as on a real shopfront. This lets the awning hang directly over the first field, and over the video on Home.
- New page meta `media: true` (Home only). The wrapper gets `.is-media`; the awning gets `position:relative; z-index:2; margin-bottom: calc(var(--stripe) / -2)`, so the scallops hang over the video by one radius.
- Keep `field` meta: the header bar sits on it (Home: yellow).
- The awning drop on load stays as is [existing].

**G2. Headroom header** [ref: agrovas — 1, nav behaviour]. `SiteHeader.vue`:
- `position: sticky; top: 0; z-index: 40`.
- Scrolling down past `header + awning` height: `transform: translateY(-100%)`. Scrolling up: `translateY(0)`, background switches instantly to `--ground` once `scrollY > 0`.
- Transition: transform only, 240 ms ease-out. Never hide while the mobile sheet is open or focus is inside the header.
- Reduced motion: no transition (it still hides and returns).
- Heights: 72–80 px desktop, 56 px mobile.

**G3. Button rule.**
- Primary inquiry CTA = `.btn-primary` (apricot) on cream, yellow and the cream board.
- `.btn-ink` (brown) on apricot fields, on sage (apricot on sage fails 3:1 non-text contrast) and in the header (it sits on changing fields).
- Change: Home hero, `CloseCta`, Live Stations hero (yellow) → `.btn-primary`. Services, Picnics, How We Work and Inquire heroes (apricot) and Bloom Cart (sage) keep `.btn-ink`.

**G4. Playfair = whole sentences only.**
- `WordList.vue .wl__title` → Montserrat 600 `title`, sentence case.
- `InquiryForm.vue .f__legend` → rewrite as whole-sentence questions, which may stay Playfair (see I2). "(required)" goes in Montserrat `small`.
- About stage labels and the `EventAnatomy` captions are replaced (see Home H2 and About A2).

**G5. No thin rules.**
- Live Stations rows: delete borders and separate with 48–64 px of space.
- `.sheet__link`: drop `border-bottom`; use 4 px gap + 14 px padding.
- 1 px lines stay only in real `<table>`s and form fields.

**G6. `ShootSlot.vue` rebuild.**
- Delete the inner `<Awning>`.
- Background = tone colour (`yellow` / `apricot` / `sage`; on sage use `--ink-deep`).
- Text bottom-left: `title` sentence case "Styled shoot coming: {subject}" + `small` note "This space is for a real photograph."
- Default `ratio: 4 / 5`, `max-height: min(70svh, 640px)`, never wider than 6 cols, never a section of its own.

**G7. `CloseCta.vue` → painted planks** [ref: beanro — 12, straightened].
- Section on cream; padding `--section`.
- Left 7 cols: an `<h2>` (currently a `<p>`: fix) whose two lines are each a `<span class="plank">`, display:block, width fit-content. Line 1 on an apricot plank, line 2 on a yellow plank, brown ink, padding 0.06em 0.28em, 8 px gap, square, no tilt.
- Size: `sign-l` ≥768; `clamp(1.75rem, 8.4vw, 2.5rem)` below, so each line stays one plank at 360 px.
- Right 5 cols, bottom-aligned: `body` step-1 + `.btn-primary`.
- Optional `steps` prop (Home only, see H7).
- Motion: planks enter `translateX(-24px)` + opacity → 0, 560 ms ease-out, 80 ms stagger via `v-reveal`. Reduced motion: static.
- Props: `lines: [string, string]`, `body`, `label`, `to` (string | route object).
- Removes the yellow full band from every page.

| Page | Plank lines | CTA | `to` |
|---|---|---|---|
| Home | Tell us / about your day | Start an inquiry | /inquire |
| Services | Start with / one part | Start an inquiry | /inquire |
| Live Stations | Pick your / stations | Ask about stations | /inquire?services=stations |
| Picnics | Pick a spot / and a date | Plan a picnic | /inquire?services=picnic |
| Bloom Cart | Bring the / Bloom Cart | Ask about the Bloom Cart | /inquire?services=bloom |
| How We Work | Start with / step one | Send an inquiry | /inquire |
| About | Tell us / about your day | Start an inquiry | /inquire |

**G8. `PageHero.vue` variants.**
- `layout: 'split' | 'type'` and `size: 'l' | 'xl'`.
- `split`: title 7 cols, side slot 5 cols, bottom-aligned. The side slot is **required** (statement, picture or slot); an empty right half fails review.
- `type`: title full width (`sign-xl`), lead + side in a 7/5 row under it.
- Drop `.ph__title { max-width: 14ch }` and let the column set the measure.

**G9. Motion budget.**
- One authored moment per page: Home = awning drop + video fade; inner pages = awning drop.
- `v-reveal` only on section headings and at most one block per section. Remove per-item staggers on lists longer than 4 (Home occasions, Live Stations rows, Services lists).
- No section has the same entrance as the hero.

**G10. Credits.**
- Every found picture/video: `FoundPhoto` caption = what it shows + "not a Una Mattina event/setup" + creator + licence link.
- Footer credits line lists all found media from `data/credits.ts` (generated from both `credits.json` files, not hand-typed).
- Hero video credit appears under the video (see §2).

**G11. New `Faq.vue`** (used on Picnics and Inquire only).
- Native `<details>`/`<summary>`. Each row is a cream-deep plank (8 px gap, no rules).
- Question in Montserrat 600 step-1; "+" drawn from two 2 px bars, the vertical bar rotates 90° on open (transform, 240 ms ease-out).
- Answer: `body`, max 62ch.
- Max 4 questions. Answers come only from brief/PRODUCT/business doc; anything unknown renders `<Tbc>`. If more than half the answers would be TBC, don't ship the FAQ.

**G12. Image sizing law (from media-notes).**
- `crepe-cone`, `coffee-cup`, `tote`, `caps`, `napkins-*`: ≤ 240 px display. `apron`: ≤ 320 px.
- `booth`: ≤ 690 px.
- World photos (1600 px): ≤ 800 px sharp at 2×. Full-bleed only where noted.
- Never show `napkins-*` above 200 px (garbled AI text).

---

## 2. Video hero (Home) — spec + `HeroVideo.vue`

**Clip: `palm-sunset`** (agree with media-notes). Static camera, slow frond sway, apricot-to-rose sky that matches the palette, names no place, 13.5 s seamless loop, 1.6 MB.
- The frond and sun sit top-right; the lower-left is even sky, exactly where the board overlaps.
- Rejected: `izola-sunset` (blue sky, and its webm is bigger than its mp4) and `beach-drone` (Brazil, teal, a drone fly-over reads as a resort ad; Lido avoids blue).
- Credit: *Video: "Free video clip – Sunset through Palm Tree", Johann Mynhardt, CC BY 2.0, via Wikimedia Commons (trimmed, looped). Not a Una Mattina event.*

**Overruling media-notes:** do **not** put cream text over the video with a 25–35 % brown overlay.
- At 25–35 % that fails 4.5:1 on light frames (sections-catalog: ≥ 0.75 tint is needed, which kills the footage).
- Lido rule: text sits on a cream board, never on footage.
- Also do not ship the media snippet as written: `autoplay` in SSR HTML can't honour reduced motion / Save-Data before the download starts, and `<source media>` support is uneven. See the component below.

**Composition ≥1200 px (1440×900 target).**
1. Header (G1/G2) on the yellow fascia, 80 px.
2. Apricot awning, `--h` ≈ 96–112 px; scallops (radius 28) overlap the video top.
3. Video field: full bleed, `height: clamp(440px, calc(100svh - var(--head-h) - var(--awning-h) - 120px), 720px)` (≈ 600 at 900 tall); `object-fit: cover`; `object-position: 50% 60%`. Square, no overlay, no gradient. Background while loading: `--surface`.
4. Cream board (`--ground`):
   - Cols 1–7 (cols 1–9 at 900–1199; full width minus gutters < 900). Padding `clamp(24px, 3.4vw, 48px)`.
   - Anchored bottom-left; its bottom edge sits **96 px below the video's bottom edge**. Grid: `.hv { grid-template-rows: auto 96px }`, media in row 1, board `grid-row: 1 / 3; align-self: end`.
   - Contents in order: H1 `sign-l` (2 lines), `statement` (≤ 2 lines, ≤ 25 words), actions (`.btn-primary` "Start an inquiry" + text link "See what we do" → /services).
   - At 1440×900 the CTA bottom lands at ≈ 830 px, inside the first viewport. At 1280×720 the video clamps to 440, the board top is ≈ 270 and the CTA ≈ 660, still inside.
5. Pause control: bottom-right inside the video, 16 px inset. Square cream button, min 44×44, padding 0 14px, Montserrat 600 15 px, text "Pause"/"Play", `aria-label="Pause background video"` / "Play background video", visible focus ring.
6. Credit: in the 96 px band right of the board (grid row 2, `justify-self: end`), `small`, `--ink-muted`, on cream.

**Mobile (< 768 px), 390×844 target, 360×640 floor.**
- Header 56, awning 64–88.
- Video `height: clamp(260px, 46svh, 420px)`, `object-position: 75% 50%` (keeps the sun).
- Board **below** the video: `grid-row: 2; margin-top: -48px`, full width minus 16 px gutters, padding 20.
- Order inside the board on mobile: H1 → actions → statement (CSS `order`), so the CTA is always in the first viewport (≈ 540 px at 360×640, ≈ 690 at 390×844).
- Button full width. Pause button top-right inside the video, `top: calc(var(--stripe) / 2 + 12px)` (below the scallops, clear of the board).
- Credit under the board.

**H1 copy (must fix: today's H1 is 3 lines).** Constraint: ≤ 11 chars per line (mobile 46 px) and 2 lines.
- Recommended: **"Your party, / one team"** (11/8). Alternative: "One team, / whole party" (9/11).
- "Planned, styled, served" moves to the pillars H2 (H2 below), where it names the three pillars.
- Statement: *"Planning, design with our own florals, and food made in front of your guests, across Naples and Southwest Florida."* (19 words.)
- `copy.md` has to be updated by the builder or copy owner; I only write this file.

**Media prep.**
- Poster: re-encode `palm-sunset-poster.jpg` (374 KB) → `palm-sunset-poster-1600.webp` ≤ 120 KB plus a 4:5 crop `palm-sunset-poster-800x1000.webp` ≤ 60 KB (sharp, crop centred at x 75%). Keep the jpg as `<picture>` fallback ≤ 160 KB.
- Ship `palm-sunset-1280.webm` (1.56 MB) before the `-1280.mp4` (1.64 MB) for desktop; `-720.mp4` (0.6 MB) for < 768.

**`components/HeroVideo.vue` outline**

```vue
<script setup lang="ts">
interface Src { src: string; type: string }
const props = withDefaults(defineProps<{
  poster: string; posterMobile?: string         // LCP image; webp ≤120 KB / ≤60 KB
  posterAlt?: string                              // '' (decorative) unless it carries meaning
  sources?: Src[]; sourcesMobile?: Src[]          // omit both → still mode (fallback)
  position?: string; positionMobile?: string      // object-position
  credit: { text: string; href: string; license: string; licenseUrl: string }
  still?: boolean                                 // force photo mode
}>(), { position: '50% 60%', positionMobile: '75% 50%', posterAlt: '', still: false })

const video = ref<HTMLVideoElement>()
const mode = ref<'still' | 'video'>('still')     // SSR + no-JS = still (poster only)
const playing = ref(false); const loaded = ref(false); const userPaused = ref(false)
let io: IntersectionObserver | undefined

function pick() {
  const m = matchMedia('(max-width: 767px)').matches
  return (m && props.sourcesMobile?.length ? props.sourcesMobile : props.sources) ?? []
}
function load() {                                 // inject sources only when allowed
  const v = video.value!; v.muted = true; v.defaultMuted = true; v.setAttribute('muted', '')
  v.replaceChildren(...pick().map(s => Object.assign(document.createElement('source'), s)))
  v.autoplay = true; v.load(); loaded.value = true
  v.play().catch(() => { userPaused.value = true })
}
function toggle() {
  if (!loaded.value) { userPaused.value = false; return load() }
  if (playing.value) { userPaused.value = true; video.value!.pause() }
  else { userPaused.value = false; video.value!.play() }
}
onMounted(async () => {
  if (props.still || !props.sources?.length) return
  mode.value = 'video'; await nextTick()
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  const c = (navigator as any).connection
  const lowData = c?.saveData || ['slow-2g', '2g'].includes(c?.effectiveType)
  if (reduce || lowData) { userPaused.value = true; return }   // poster + "Play" button
  load()
  io = new IntersectionObserver(([e]) => {
    if (!loaded.value) return
    if (e.isIntersecting && !userPaused.value) video.value!.play(); else video.value!.pause()
  }, { threshold: 0.1 }); io.observe(video.value!)
  document.addEventListener('visibilitychange', onVis)
})
function onVis() { if (document.hidden) video.value?.pause(); else if (!userPaused.value && loaded.value) video.value?.play() }
onBeforeUnmount(() => { io?.disconnect(); document.removeEventListener('visibilitychange', onVis) })
</script>

<template>
  <section class="hv" :class="{ 'is-playing': playing, 'is-still': mode === 'still' }"
           :style="{ '--pos': position, '--pos-m': positionMobile }" aria-labelledby="home-title">
    <div class="hv__media">
      <picture>
        <source v-if="posterMobile" :srcset="posterMobile" media="(max-width: 767px)">
        <img class="hv__poster" :src="poster" :alt="posterAlt" fetchpriority="high" width="1600" height="900">
      </picture>
      <video v-if="mode === 'video'" ref="video" class="hv__video" muted playsinline loop
             preload="metadata" disablepictureinpicture disableremoteplayback aria-hidden="true" tabindex="-1"
             @playing="playing = true" @pause="playing = false" />
      <button v-if="mode === 'video'" type="button" class="hv__toggle"
              :aria-label="playing ? 'Pause background video' : 'Play background video'" @click="toggle">
        {{ playing ? 'Pause' : 'Play' }}
      </button>
    </div>
    <div class="hv__board"><slot /></div>
    <p class="hv__credit small">Video: <a :href="credit.href" class="link" rel="noopener" target="_blank">{{ credit.text }}</a>,
      <a :href="credit.licenseUrl" class="link" rel="noopener license" target="_blank">{{ credit.license }}</a>. Not a Una Mattina event.</p>
  </section>
</template>
```

CSS essentials:
- `.hv__poster, .hv__video { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position: var(--pos) }` (`var(--pos-m)` < 768).
- `.hv__video { opacity:0; transition: opacity var(--dur-slow) var(--ease-out) } .is-playing .hv__video { opacity:1 }`. The poster stays underneath; no flash.
- Still mode (fallback): `.is-still .hv__poster { animation: hv-scale 24s var(--ease-in-out) infinite alternate }`, `@keyframes hv-scale { to { transform: scale(1.06) } }`; off under reduced motion.
- Board load motion: `translateY(16px) → 0`, 560 ms ease-out, 120 ms delay after the awning drop, **transform only** (no opacity, so it never delays LCP); off under reduced motion.
- `pages/index.vue` usage:
  ```vue
  <HeroVideo poster="/video/palm-sunset-poster-1600.webp" poster-mobile="/video/palm-sunset-poster-800x1000.webp"
    :sources="[{src:'/video/palm-sunset-1280.webm',type:'video/webm'},{src:'/video/palm-sunset-1280.mp4',type:'video/mp4'}]"
    :sources-mobile="[{src:'/video/palm-sunset-720.mp4',type:'video/mp4'}]" :credit="credits.heroVideo">…board…</HeroVideo>
  ```
- **Fallback** (if the clip is dropped): `<HeroVideo still :poster="naples-pier-sunset 1600 webp" position="50% 45%" :credit="credits.pier">`. Same component, same board; the slow scale is the only motion; caption "Naples Pier at dusk. Not a Una Mattina event."

---

## 3. Pages

### HOME (`pages/index.vue`) — 7 sections + footer
Field sequence: yellow fascia → apricot awning → video → cream → **apricot band** → cream-deep | sage → cream → cream-deep → cream planks → brown footer. That is one apricot band and no yellow band; the yellow appears only in the fascia and one plank.

**H1. Video hero + board.** *Claim:* one team for your whole party, in Naples. *Proof:* the three pillars named in the statement, plus the CTA.
- Composition: see §2. Type: H1 `sign-l` (mobile `clamp(2.5rem, 12vw, 2.875rem)`), `statement`.
- Motion: awning drop (existing), video fade-in on `playing`, board rise (transform only).
- Source: [ref: agrovas — 1 (muted loop as the first field, single CTA, lower-left anchor)] + [ref: mornibali — 4 (board overlapping media)] + [own: awning hanging over the video].
- Change: replace the `.hero` section (yellow field, `FoundPhoto` pier) with `<HeroVideo>`. Set `definePageMeta({ awning:'apricot', field:'yellow', media:true })`. Brown button → `.btn-primary`.
- Anti-slop: no rating row, no centred stack, no gradient scrim, no text on footage, one primary action, footage credited and not "ours". ✅ once the H1 is 2 lines.

**H2. Pillars × example party (merged; new `PillarExplorer.vue` replaces `EventAnatomy.vue` and the `.pillars` list).** *Claim:* take one part or all three. *Proof:* an example party (backyard 40th, 50 guests, labelled *example scope, not a past event*) lights up the pieces each pillar covers.
- H2 `sign-l` "Planned, styled, served" (desktop: "PLANNED, STYLED," / "SERVED"; <600 px use `sign-m`).
- Intro `statement`: "Take one part, or hand us all three. Pick one to see what it covers at an example party."
- ≥900, left 5 cols: 4 stacked `<button aria-pressed>` rows (3 pillars + "All three").
  - Each row: pillar name `sign-m`, one `body` line (from `pillars.line`), padding 24/28, cream-deep.
  - Active row: apricot plank (`::before` scaleX 0→1, origin left).
  - Under the rows: a text link "Everything in each part" → /services.
- ≥900, right 7 cols, sticky top 96 px:
  - `title` "Example: a backyard 40th, 50 guests" + `small` "An example scope, not a past event."
  - `<ul>` of the 8 `examplePieces`: name `step-1` 600 left, pillar `small` right (+ "with a partner").
  - Covered rows: yellow plank (`::before` scaleX, 240 ms ease-out, 30 ms stagger). Uncovered rows: no fill, `--ink-muted` (6.4:1, still legible).
  - CTA `.btn-primary` "Start with all three" / "Ask about {pillar}" → /inquire with `services` query [existing logic].
- <900: the 4 rows become a wrapping chip group (min-height 48), with the list below, not sticky.
- Motion: plank fills only. Reduced motion: instant.
- Source: [ref: agrovas — 3 (vertical tab list swaps content)] + [own: design-direction "Jedan događaj, ceo"] + [existing: data/pillars].
- Remove: 4×2 tile grid, "8 of 8" counter, Playfair pillar captions, the three "More" links.
- Anti-slop: not cards (a list with fills), no stat, no eyebrow. ✅

**H3. Stations band (apricot).** *Claim:* food made in front of your guests. *Proof:* six named stations; the griddle the brand started on.
- Full-bleed apricot field, `--ink-deep` text, padding `calc(var(--section) * .75)`.
- ≥900, left 7 cols:
  - H2 `sign-l` "Made in front / of your guests" (mobile `sign-m`).
  - Then a cream **plank** (`<p aria-hidden>`, `sign-m`, min-width 12ch, `overflow: clip`) showing one station name.
  - Then `statement`: "We started behind a crêpe griddle at the market. At your party, the same griddle comes with you." + text link "See all six stations" → /live-stations.
- ≥900, right 5 cols: `FoundPhoto` `crepe-griddle.jpg`, 4:5, ≤ 520 px wide. Caption: "A crêpe on a classic griddle. Not our station." + credit.
- New `StationRotator.vue`:
  - The name steps by **scroll progress** through the section (6 steps from section-top at 80 % viewport to section-bottom at 20 %). Outgoing `translateY(-100%)`, incoming from `100%`, 240 ms ease-out. A click on the plank advances.
  - No timer, so WCAG 2.2.2 is not triggered.
  - SR: a `.sr-only <ul>` of all six names.
  - Reduced motion: the plank shows all six names, comma-separated, in `title` size.
- Source: [ref: beanro — 7, partial: rotator only, straight plank, scroll-stepped].
- Change: replace `.stations` (sign-m heading over a 4-line sign-l names paragraph).
- Anti-slop: no tilted stickers, no marquee, full list available. ✅

**H4. Picnics | Bloom Cart (split halves).** *Claim:* two services nobody else in the market offers. *Proof:* what each one is, in one sentence each.
- Full-bleed 50/50 at ≥900; each half padded `clamp(28px, 4vw, 64px)`; both stretch to the taller half.
- Left half cream-deep:
  - `FoundPhoto` `vanderbilt-beach.jpg` (real Naples) 3:2 at the top of the half, ≤ 720 px. Caption "Vanderbilt Beach, Naples. A public beach, not one of our setups."
  - H2 `sign-m` "Luxury picnics" + `statement` (copy deck) + link "Plan a picnic" → /luxury-picnics.
- Right half sage:
  - H2 `sign-m` "Bloom Cart" in `--ink-deep` + `statement` + link "See the Bloom Cart".
  - `FoundPhoto` `flower-market-buckets.jpg`, 4:5, cropped right 60 % (removes "Gulik"), ≤ 520 px. Caption "A flower-market stall. Not our cart."
- <900: stacked, picnic first.
- Source: [own].
- Remove: H2 "Picnics and a flower cart", the 1.55fr/1fr grid, `BrandSign` on the Bloom card.
- Anti-slop: no icon card; two halves differ in content. ✅

**H5. Where we set up.** *Claim:* we come to you. *Proof:* real Naples + the occasions list + the permits promise.
- Full-bleed `FoundPhoto` `naples-pier-sunset.jpg`, 21:9, `object-position: 50% 45%`. Caption right-aligned "Naples Pier at dusk. Not a Una Mattina event."
- Then H2 `sign-l` "At home or / on the beach" (≤ 13 chars/line; the current 3-line H2 is replaced).
- Then a 7/5 row: left, occasions `<ul>` in Montserrat 500 step-2, CSS `columns: 2` ≥900. Right: `body` places + permits note + link "How we work" → /how-we-work.
- Source: [own] [existing copy].
- Change: from the apricot field → cream; the pier photo moves here from the old hero; drop the per-item stagger.
- Anti-slop: a real list, real place, credited. ✅

**H6. Origin (cream-deep band).** *Claim:* it started with a crêpe. *Proof:* the market stand (labelled concept) + the live market status.
- Grid: `ConceptImage booth` 5 cols left (≤ 690 px, 4:3); text 7 cols right.
- H2 `sign-l` "It started / with a crêpe" (now 7 cols → 2 lines). `body` copy + `<MarketStatus/>` line + links "Our story" /about, "Crêpes at the market" /crepes.
- Source: [existing] + [own: live status].
- Change: background cream → `--surface`; text column 6 → 7 cols; add `MarketStatus`.
- Anti-slop: ✅

**H7. Close (`CloseCta` planks + steps).** *Claim:* asking is easy and isn't a commitment. *Proof:* what happens after you send it.
- Planks "Tell us / about your day".
- Right 5 cols: a `<ol class="next">` of 4 `statement`-step-1 sentences with no numerals, order by position:
  1. "Tell us the date, the place and the idea."
  2. "We talk it through, by call or over coffee."
  3. "You get a proposal built on your event."
  4. "We run the day, from setup to pack-out."
- Then `.btn-primary` "Start an inquiry".
- Source: [ref: beanro — 12] (shared) + [existing copy].
- Removes: the "How it goes" section (icon-topped 4 columns) and the yellow `.close` band.
- Anti-slop: no icons, no 01–04, no identical cards. ✅

Reference count (decisions, excl. close): agrovas 3 (video, headroom, tab list) / beanro 1 / mornibali 1 / own 5 → max 30 %. ✅

---

### SERVICES (`pages/services.vue`) — 5 sections + close. Field apricot, awning yellow.

**S1. Hero, split.** H1 `sign-l` "Three parts, / one team" (7 cols) + `body` "Book one service or hand us the whole event." + `.btn-ink`.
- Side (5 cols, bottom-aligned): `statement` in `--ink-deep`: "When we do all three, one person leads your event from the first call to the last box packed."
- [ref: mornibali — 2]. Change: fill the empty right half (G8 `split`).

**S2. Planning & coordination (cream).** Left 5 cols: H2 `sign-l` + `statement` "Planning is its own service, not an add-on to the food." Right 7 cols: two plain lists side by side with `title` heads "Planning" / "Production", items step-1.
- [existing content]. Change: delete the two cream-deep boxes; WordList heads → `title` (G4).

**S3. Design, florals & setup (yellow band).** H2 `sign-l` full width (1 line). Columns 3/5/4 — "Florals, in-house" gets the widest column + the `statement` "The flowers are ours: arranged in-house, not ordered in."
- [existing]. Change: unequal columns, heads → `title`.

**S4. Live station catering (cream).** `FoundPhoto` `cannoli-tray.jpg`, 4 cols, 4:5, ≤ 430 px. Caption "Sicilian cannoli. Not our station." Text 6 cols: H2 + body + `.btn-outline` "See the stations".
- [existing]. Change: replace `crepe-cone` (278 px source shown at ~290: soft, G12).

**S5. Who we bring in (cream-deep).** [existing] partners list. Move the rule statement to How We Work (H3), so the two pages don't repeat it; keep one sentence: "You still talk to one person."

**Close:** planks "Start with / one part".

Neighbours: split / name-left lists / full-width band 3-col / image+text / text+list band. ✅ Refs: mornibali 1/5. ✅ Anti-slop: Playfair word heads fixed; no cards. ✅

---

### LIVE STATIONS (`pages/live-stations.vue`) — 3 sections + close. Field yellow, awning apricot.

**L1. Hero, type-led.**
- H1 `sign-xl` full width "Made in front of your guests" (2 lines at 1440: ≤ 15 chars/line; mobile `clamp(2.1rem, 9.4vw, 2.6rem)`).
- Under it a 7/5 row: `body` lead + `.btn-primary` "Set up your counter" (#counter) | `statement` "Every station is cooked, layered or poured live by our attendants."
- [own; laws: fill with scale]. Change: G8 `type` layout.
- Later: when real griddle footage exists, the side becomes the beanro-6 "cabana window" (`HeroVideo` reused). **Do not build the scroll-grow on a still or AI image.**

**L2. Stations + sticky frame (cream)** [ref: lattetemplate — 3].
- Left 7 cols: `<ul>` of 6 stations, each `sign-m` name + `statement`-step-1 note, rows 48–64 px apart, **no rules**. Keep the TBC line "Descriptions to be confirmed".
- Right 5 cols: sticky (top 96) 4:5 frame that swaps by active row (IO `rootMargin: '-45% 0px -45% 0px'`), opacity crossfade 240 ms ease-out:
  - Crêpe → `FoundPhoto crepe-griddle` ("A crêpe on a classic griddle. Not our station.").
  - Cannoli → `FoundPhoto cannoli-tray`.
  - Others → `ShootSlot tone="apricot" subject="{station name}"`.
- <900: not sticky; one `crepe-griddle` frame above the list.
- Reduced motion: no crossfade.
- Change: replaces the hairline 2-col grid and the full-width `ShootSlot` section.

**L3. One counter, many stations + `StationCounter` (cream-deep band, merged)** [own — design-direction "Postavi stanice"].
- Left 5 cols: H2 `sign-m` "One counter, / many stations" (fixes the 4-line wrap), `body` modular base, then one Playfair sentence "Coming later: coffee and espresso, gelato, waffles and brunch, hot chocolate and lemonade."
- Right 7 cols: `<StationCounter id="counter">`. Its mini awning over the yellow counter is the page's one small strip.
- Change: merge the two sections; cut the restating sub-sentence ("Your choice is carried into the inquiry form" → keep only "Pick up to three, then ask us about them.").

**Close:** planks "Pick your / stations".

Refs: lattetemplate 1/3. ✅ Awnings: page + 1 strip. ✅

---

### LUXURY PICNICS (`pages/luxury-picnics.vue`) — 3 sections + close. Field apricot, awning yellow.

**P1. Hero, split.** H1 `sign-l` "A picnic, / already set" + lead + `.btn-ink` "Plan a picnic".
- Side 5 cols: `FoundPhoto clam-pass-sunset` 4:5 (top-60 % crop, sun + sea, no boardwalk sign), ≤ 600 px, bottom-aligned, running 64 px below the field into cream. Caption on cream: "Clam Pass Beach, Naples. A public beach, not one of our setups."
- [own]. Change: the full-width photo section merges into the hero.

**P2. What we bring, where, for whom (cream)** [ref: mornibali — 6, WHERE/WHEN grid translated].
- Left 5 cols: cream-deep signboard, `title` "What it can include", rows step-1.
- Right 7 cols: `<dl>` with `dt` `title` "Where" / "Who it's for", `dd` as step-2 Montserrat sentences ("Beach, park, private backyard, poolside, private property or a sunset spot.").
- Under the `dl`: `ShootSlot tone="yellow" subject="Sunset beach picnic" ratio="3 / 2"` (7 cols, max 420 px tall).
- Change: 3 columns with Playfair word heads + the giant slot → this grid.

**P3. Before you pick a spot (yellow band)** [ref: beanro — 11 via `Faq`].
- Left 5 cols: H2 `sign-m` "Public places / have rules" + `statement` (permits sentence).
- Right 7 cols: `Faq`:
  - "Can we do this on a public beach or in a park?" (answer from doc: rules + permits confirmed before booking).
  - "What if the weather turns?" `<Tbc>`
  - "How long does setup take?" `<Tbc>`
  - (only 2 of 3 answered from the doc, so drop the third if it's still TBC.)
- Change: sage → yellow (G: sage is Bloom-only).

**Close:** planks "Pick a spot / and a date".

Refs: mornibali 1/3, beanro 1/3. ✅

---

### BLOOM CART (`pages/bloom-cart.vue`) — 3 sections + close. Field sage, awning apricot [existing: an apricot awning over sage is correct; a sage awning over sage would vanish].

**B1. Hero, split.** H1 `sign-l` "Pick a stem, / take it home" + lead + `.btn-ink`.
- Side 5 cols: `FoundPhoto flower-market-buckets` 4:5, cropped right 60 %, ≤ 520 px. Caption "A flower-market stall. Not our cart."
- Change: remove the decorative `BrandSign`.

**B2. How it works (cream).**
- Left 7 cols: `<ol>` of 3 rows, no numerals. Clause `sign-m` ("We pick the flowers" / "The cart is set" / "Guests tie a bouquet"), `statement`-step-1 note under it, 40 px between rows. Then `statement` "Décor, an activity and a favour, from one cart."
- Right 5 cols: sticky `ShootSlot tone="yellow" subject="Bloom Cart at a shower"` 4:5.
- [own]. Change: replaces the 3 staggered cards and the giant slot section.

**B3. Ideal for + custom details (yellow band).** [existing]; heads → `title` (G4).

**Close:** planks "Bring the / Bloom Cart".

No FAQ (most answers would be TBC). Refs: own only. ✅

---

### HOW WE WORK (`pages/how-we-work.vue`) — 3 sections + close. Field apricot, awning yellow.

**W1. Hero, type-led.** H1 `sign-xl` "Simple for you" (1 line at 1440; 2 lines on mobile). Under it 7/5: empty | `statement` "There's a lot of production behind an event. Your side of it looks like this."
- [own]. Change: G8 `type`.

**W2. The journey (cream).** Three groups.
- Left 4 cols: sticky H2 `sign-m` phase titles: "Before you book" (Inquiry, Discovery, Concept & scope, Custom proposal, Contract), "While we plan" (Planning & design, Final production), "On the day, and after" (Event day, Follow-up).
- Right 8 cols: an `<ol start="n">` per group. Step name `title` step-2 + `statement`-step-1 sentence. Rows 32–40 px apart.
- **No visible numerals**, no tinted cards, no highlight.
- [own] (the catalog's "4 numbered boards" from agrovas-10 is rejected: identical boards + numerals).
- Change: replaces the 3×3 numbered grid.

**W3. The rule (yellow band).**
- `statement` large (36 px): "The person running your event never stands at a station or a bar at the same time." (doc rule 11, moved from Services)
- `body`: permits note (moved from under the grid).
- [own].

**Close:** planks "Start with / step one".

The "day by the clock" strip [ref: mornibali — 5] is **deferred**: it needs real photos, and clock times would be invented.

---

### ABOUT (`pages/about.vue`) — 5 sections + close. Field yellow, awning apricot.

**A1. Hero, split** [existing]. Apron concept image side, capped at 320 px wide (G12).

**A2. Market → Events → Café (cream)** [own — design-direction "three positions of the sun"].
- Unequal columns 5/4/3, no backgrounds.
- Each column: an apricot half-sun (the mark's sun, not an icon set) behind a shared baseline (`overflow: clip`) at 3 heights: Market 30 % risen, Events 65 %, Café full.
- H3 `sign-m` "Market, today" / "Events, next" / "A café, one day", then `body`. `<MarketStatus/>` + "Find the stand" under Market.
- Motion: suns rise `translateY` to their height, 560 ms ease-out, 120 ms stagger, once. Reduced motion: static.
- Change: replaces the 3 identical cards with italic eyebrows.

**A3. One mark, two mornings (apricot band)** [existing]. Keep.

**A4. Mediterranean mornings (cream).**
- Full-bleed `FoundPhoto amalfi-lemons` (top-60 % crop, lemon + leaf, on-palette), 21:9.
- Then 5/7: H2 `sign-m` "Mornings, / Gulf light" (fixes the 3-line H2) | `body`.
- Caption: "Amalfi lemons. Not a Una Mattina photo."
- Positano: drop it, or ≤ half width elsewhere. **Delete the caption claim** "the beach clubs our stripes come from" (an invented origin story; the stripes come from the apron).

**A5. Who we are (cream-deep, compact).** Text 7 cols (H2 `sign-m` + `<Tbc>` founders' names/story) | `ShootSlot tone="apricot" subject="Founders' portrait"` 4 cols.
- Change: **remove the in-body script sign-off**; the footer already carries the page's one script.

**Close:** planks "Tell us / about your day".

Neighbours: split / three suns / band / full-bleed photo + text / text + slot / planks. ✅

---

### INQUIRE (`pages/inquire.vue` + `InquiryForm.vue`) — 3 sections, no close. Field apricot, awning yellow.

**I1. Hero, compact split.**
- H1 `sign-l` "Tell us / about your day" (7 cols).
- Side: `statement` "No packages and no price list: we read every inquiry and reply with questions." + `<Tbc>` reply time.
- Bottom padding 56–72 px, so the first fields show at 1440×900.

**I2. Form + sticky summary (cream)** [ref: lattetemplate — 3, sticky side column].
- Form cols 1–7. Legends become whole-sentence Playfair questions: "Who are we talking to?" · "What are you celebrating?" · "When and where is it?" · "How many guests?" · "What would you like help with?" · "Anything else we should know?" "(required)" stays Montserrat `small`.
- Summary cols 9–12, sticky top 96: a cream-deep signboard, `title` "Your event so far".
  - Rows: `dt` `small` / `dd` `title`, for Event, Date, Place, Location, Guests, Help with, Stations. Empty value "Not yet" in `--ink-muted`.
  - `aria-live="polite"` on the board.
- <900: the summary is a `<details>` "Your event so far" placed directly above "Send inquiry".
- Prefill from query [existing].

**I3. What happens next (yellow band).**
- Left 5 cols: H2 `sign-m` "What happens next".
- Right 7 cols: `<ol>` of 3 `statement` sentences (no numerals):
  1. "We read it and reply with questions." `<Tbc>` reply time
  2. "We talk it through, by call or over coffee."
  3. "You get a written proposal built on your event's real scope."
- Then a `Faq` row "Why is there no price list?" (from doc: every event is quoted on its real scope; no packages).
- Change: new.

Refs: lattetemplate 1/3, beanro (Faq) 1/3. ✅

---

## 4. Anti-slop matrix (post-plan, every page)

| Check | Home | Services | Stations | Picnics | Bloom | HWW | About | Inquire |
|---|---|---|---|---|---|---|---|---|
| Centred pill hero | no | no | no | no | no | no | no | no |
| Identical icon/card rows | removed (How it goes, anatomy tiles) | – | – | – | removed | removed (3×3) | removed | – |
| Eyebrows / tiny tracked labels | – | – | – | – | – | – | removed (Today/Next) | – |
| Index numbering | – | – | – | – | `<ol>`, no numerals | removed 1–9 | – | `<ol>`, no numerals |
| Hairlines | – | – | removed | – | – | – | – | form fields only |
| Gradients / glass / emoji / shadows | none | none | none | none | none | none | none | none |
| One-italic-word headings | fixed (G4) | fixed | fixed | fixed | fixed | – | fixed | fixed (questions) |
| Restating subheads | – | – | cut | – | – | – | – | – |
| Same-layout neighbours | no | no | no | no | no | no | no | no |
| Invented proof | none (example labelled) | none | none | none | none | none (no clock times) | caption claim removed | none |

---

## 5. Definition of done (reviewer, per page)

1. `node builder/scripts/shoot.mjs una-mattina <url>` passes except the recorded brand exceptions (Montserrat, palette, 3 faces). Run the `taste-skill` inspector with only `--allow palette-claude`.
2. Every heading and the first-screen line is **≤ 2 lines at 360, 390, 768, 1280 and 1440 px**. Statements ≤ 25 words / 3 lines.
3. Sections ≤ 8; no two neighbours share a composition; no section is a grid of equal cards.
4. No eyebrow, no visible step numerals, no thin rules outside `<table>`/form fields, no gradient, shadow, glass or emoji. Playfair only on whole sentences. Exactly one script sign-off (footer).
5. Fields: at most one apricot and one yellow **band** per page (fascia, awning and planks don't count); sage only on Bloom Cart; every awning hangs over a non-cream field; at most one awning + one small strip.
6. Primary inquiry action: apricot on cream/yellow/board, brown on apricot/sage/header. On Home it is fully visible in the first viewport at 390×844, 360×640, 1280×720 and 1440×900.
7. Every picture: a `FoundPhoto` with caption + "not ours" + creator + licence, or a `ConceptImage` with the placeholder chip, or a `ShootSlot`. Display widths obey G12. No AI image above 320 px except `booth` (≤ 690).
8. Home video:
   - Poster ≤ 120 KB is the LCP element.
   - No video bytes are requested under reduced motion or Save-Data (check the network tab).
   - It pauses off-screen and on tab hide; the Pause/Play button works by keyboard.
   - The credit is visible.
   - No text sits on footage.
   - It still works with JS off (poster + board).
9. Motion: one authored moment per page; transform/opacity only; `--ease-out` (loop: `--ease-in-out`); all motion off or static under reduced motion; content visible without JS.
10. Contrast: body ≥ 4.5:1 (brown on apricot uses `--ink-deep`), large text on sage only in `--ink-deep`, focus rings visible on every field colour.
11. No invented facts: anything unknown renders `<Tbc>`; no prices, ratings, stats, testimonials or client names.
12. Reference budget per page ≤ ~1/3 (counts listed above); nothing copied from a reference's identity.
13. `build-log.md` updated with what changed and any rule defended.

---

## 6. Review notes for /crepes (from the 22:22 screenshots; builder owns it)

- The giant line is "CRÊPES", while the thing the visitor needs (where and when we are) is a small line under the featured dish. mornibali-1 as planned makes the **status** the giant line ("AT [MARKET] TODAY" / "NEXT: SAT 8 AM"), with "Crêpes" in the wordmark/title.
- "Buongiorno," is a single Playfair word above the H1: it reads as an eyebrow and an italic fragment. Make it part of a sentence ("Buongiorno, we're at …") or drop it.
- The first screen carries three actions (Find us ↗, See the menu, Follow on Instagram). Keep one primary (Get directions) and one text link; Instagram lives in its own band.
- There is a 2 px rule above the featured crêpe (the thin-rule ban). Use a tone step or space.
- Mobile weight: keep the booth image lazy and ≤ 150 KB, and `crepe-griddle.jpg` ≤ 120 KB (1:1 crop). It must be captioned as someone else's griddle (Simply Crêpes, NY, CC BY-SA).
- Sticky Directions/Instagram bar: make sure it doesn't cover the menu's last row or the footer credits, and that it respects the `env(safe-area-inset-bottom)` inset.
