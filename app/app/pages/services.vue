<script setup lang="ts">
// Services (Events v2, events-v2-system.md §8). Apricot field, heavy hero.
// Signature: a sticky index of the three parts with a picture frame under it. The index (Planning / Design / Stations,
// heavy caps fitted to the column) holds still on the left while the parts scroll past on the right; the part in the
// reading band is full ink with an apricot dot, the others muted; "One of three" + a rail follow progress; each name
// is a jump link. The frame wipes to the active part's picture (the Live Stations frame: clip-path up, 1.06 → 1):
// Planning = the market-tent concept (planned and set by us), Design = the flower stall, Stations = the crêpe concept.
// Phones: the picture sits in each part; the index is a brown bar at the bottom (CSS sticky; with JS it shows for a
// moment when a new part comes up and whenever you scroll up). Each part is ONE menu board (name + a Playfair
// half-line, the /crepes menu shape); the full lists sit behind a disclosure. Without JS / reduced motion: final.
import { credits } from '~/data/credits'
definePageMeta({ awning: 'yellow', field: 'apricot' })
usePageSeo({ title: 'Services', description: 'Event planning and coordination, event design with in-house florals and setup, and live station catering in Naples and Southwest Florida. Book one or all three.' })

// The menu boards: the most telling items, each with a half-line (new copy, listed for Luka in the build log).
const planMenu = [
  { t: 'Discovery and vision', note: 'The people, the feel and the budget, before anything is booked.' },
  { t: 'Venue or location search', note: 'A beach, a backyard or a room, and what each one allows.' },
  { t: 'Vendors, sourced and briefed', note: 'We find them, brief them and do the talking.' },
  { t: 'Floor plan and guest flow', note: 'Where people arrive, eat, sit and dance.' },
  { t: 'Event-day management', note: 'One person runs the day, start to finish.' },
  { t: 'Who we bring in', note: 'DJs and musicians, photo booths, rentals, lighting, cakes, bartenders, cleanup crews.' },
]
const designMenu = [
  { t: 'Color palette', note: 'One palette, from the linens to the place cards.' },
  { t: 'Tablescape', note: 'Linens, tableware, menus and candles, set as one table.' },
  { t: 'Florals, in-house', note: 'Arranged by us, not ordered in.' },
  { t: 'Signage', note: 'Welcome signs, menus and station boards in your palette.' },
  { t: 'Setup and breakdown', note: 'We set it, style it and pack it all out.' },
]
const stationsMenu = [
  { t: 'Six stations', note: 'Crêpes, tiramisu, fruit cups, charcuterie, cannoli, cocktails and mocktails.' },
  { t: 'One modular counter', note: 'Changed for each concept, from griddles to ice.' },
  { t: 'Our own attendants', note: 'Every station is cooked, layered or poured live.' },
  { t: 'Our own florals', note: 'The flowers that dress each station are ours.' },
]
// The full lists, behind a disclosure.
const planning = [
  { title: 'Planning', items: ['Discovery and vision', 'Budget and priorities', 'Venue or location search', 'Vendor sourcing and communication', 'Food and beverage coordination'] },
  { title: 'Production', items: ['Floor plan and guest flow', 'Timeline and production schedule', 'Final confirmations', 'Event-day management', 'Setup and breakdown coordination'] },
  { title: 'Partners we bring in', items: ['DJs and live musicians', 'Photo booths', 'Chair, table and tent rentals', 'Lighting', 'Bakeries and cakes', 'Bartenders', 'Cleanup crews'] },
]
const design = [
  { title: 'Design', items: ['Color palette', 'Tablescape', 'Linens and napkins', 'Tableware', 'Menus and place cards', 'Signage', 'Rugs, pillows and picnic styling', 'Decorations'] },
  { title: 'Florals, in-house', items: ['Centerpieces', 'Bud vases', 'Station florals', 'Picnic florals', 'Custom arrangements'] },
  { title: 'Setup & breakdown', items: ['Tables and high-tops', 'Décor installations', 'Rental coordination', 'On-site styling', 'Final detailing', 'Breakdown and pack-out'] },
]
const count = (g: { items: string[] }[]) => g.reduce((n, x) => n + x.items.length, 0)

const parts = [
  { id: 'planning', idx: 'Planning', t: 'Planning & coordination', note: 'Vision, budget, vendors and the day itself.' },
  { id: 'design', idx: 'Design', t: 'Design, florals & setup', note: 'One concept, with flowers we arrange ourselves.' },
  { id: 'stations', idx: 'Stations', t: 'Live station catering', note: 'Six stations, made live at the party.' },
]
const pics = {
  booth: { src: '/img/svc/booth-4x5-880.webp', w: 880, h: 1100, alt: 'Illustration: the Una Mattina tent set up at a market, crêpe griddles, a menu board and a lemonade table under it' },
  crepes: { src: '/img/svc/crepes-plate-4x5-880.webp', w: 880, h: 1100, alt: 'Illustration: syrup poured over folded crêpes with berries and cream at a counter' },
  flowers: 'Buckets of cut flowers at a flower-market stall',
}
const words = ['One', 'Two', 'Three']

// The part in the reading band (40–55 % of the viewport) is the active one.
const root = ref<HTMLElement | null>(null)
const { progress } = usePinProgress(root, { minHeight: 0 })
const active = ref(0)
let io: IntersectionObserver | undefined
onMounted(() => {
  if (!('IntersectionObserver' in window) || !root.value) return
  io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) active.value = Number((e.target as HTMLElement).dataset.i)
  }, { rootMargin: '-40% 0px -55% 0px' })
  root.value.querySelectorAll<HTMLElement>('.svc-part').forEach(el => io!.observe(el))
})
// phones: the bar shows once the parts fill the screen; it steps aside while you read downwards and comes back when
// you scroll up (like the /crepes bar). Without JS it simply stays stuck to the bottom of the section.
const away = ref(false)
const ready = ref(false)
let lastY = 0
let down = false
let tick = 0
let hold = false
let holdTimer: ReturnType<typeof setTimeout> | undefined
const read = () => {
  tick = 0
  const y = window.scrollY
  if (Math.abs(y - lastY) > 6) { down = y > lastY; lastY = y }
  const top = root.value?.getBoundingClientRect().top ?? 0
  away.value = top > 0 || (down && !hold)
}
// a new part coming up shows the bar for a moment, so a reader who only scrolls down still sees where they are
watch(active, () => {
  hold = true
  clearTimeout(holdTimer)
  holdTimer = setTimeout(() => { hold = false; read() }, 1400)
  read()
})
const onScroll = () => { if (!tick) tick = requestAnimationFrame(read) }
onMounted(() => {
  lastY = window.scrollY
  read()
  requestAnimationFrame(() => { ready.value = true })
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => { io?.disconnect(); window.removeEventListener('scroll', onScroll); cancelAnimationFrame(tick); clearTimeout(holdTimer) })
</script>

<template>
  <div class="svc">
    <PageHero id="services-title" layout="heavy" title="One part or all three" :lines="['One part', 'or all three']" lead="Book one service or hand us the whole event. When we do all three, one person leads it from first call to last box packed.">
      <template #actions><NuxtLink to="/inquire" class="pill pill--ink">Start an inquiry <span class="pill__arrow" aria-hidden="true">→</span></NuxtLink></template>
      <template #side>
        <Board tone="cream" valance="apricot" drop flush="right" as="nav" class="svc-hb" aria-label="The three parts">
          <a v-for="p in parts" :key="p.id" :href="`#${p.id}`" class="svc-hb__row">
            <span class="svc-hb__t">{{ p.t }}</span>
            <span class="svc-hb__note italic-line">{{ p.note }}</span>
            <span class="svc-hb__arrow" aria-hidden="true">↓</span>
          </a>
        </Board>
      </template>
    </PageHero>

    <!-- The three parts: sticky index + picture frame left, the parts scroll past on the right -->
    <section ref="root" class="svc-parts" aria-label="The three parts">
      <div class="wrap svc-parts__grid">
        <div class="svc-side">
          <nav class="svc-index" aria-label="Parts on this page">
            <ol class="svc-index__list">
              <li v-for="(p, i) in parts" :key="p.id">
                <a :href="`#${p.id}`" class="svc-index__a" :class="{ 'is-on': i === active }" :aria-current="i === active ? 'true' : undefined">{{ p.idx }}</a>
              </li>
            </ol>
            <div class="svc-index__meter" aria-hidden="true">
              <span class="svc-index__count">{{ words[active] }} of three</span>
              <span class="svc-index__railbox"><span class="svc-index__rail" :style="{ transform: `scaleX(${progress.toFixed(4)})` }" /></span>
            </div>
          </nav>
          <div class="svc-frame">
            <div class="svc-frame__layer" :class="{ 'is-on': active === 0 }" :inert="active !== 0"><ConceptImage sizes="lg:440px" :src="pics.booth.src" :width="pics.booth.w" :height="pics.booth.h" ratio="4 / 5" :alt="pics.booth.alt" /></div>
            <div class="svc-frame__layer" :class="{ 'is-on': active === 1 }" :inert="active !== 1"><FoundPhoto sizes="lg:440px" :photo="credits.flowers" ratio="4 / 5" :alt="pics.flowers" /></div>
            <div class="svc-frame__layer" :class="{ 'is-on': active === 2 }" :inert="active !== 2"><ConceptImage sizes="lg:440px" :src="pics.crepes.src" :width="pics.crepes.w" :height="pics.crepes.h" ratio="4 / 5" :alt="pics.crepes.alt" /></div>
          </div>
        </div>

        <div class="svc-parts__flow">
          <!-- Planning & coordination -->
          <article id="planning" class="svc-part" data-i="0" aria-labelledby="planning-title">
            <RiseText id="planning-title" :lines="['Planning &', 'coordination']" />
            <p class="statement svc-part__statement">Planning is its own service, not an add-on to the food.</p>
            <ConceptImage class="svc-part__pic" unveil sizes="sm:100vw md:100vw" :src="pics.booth.src" :width="pics.booth.w" :height="pics.booth.h" ratio="4 / 5" :alt="pics.booth.alt" />
            <SvcRuled class="svc-part__board" :groups="[{ items: planMenu }]" />
            <p class="statement svc-part__one">You still talk to one person.</p>
            <details class="svc-more">
              <summary class="pill pill--line pill--s svc-more__sum">Everything in planning ({{ count(planning) }}) <span class="pill__arrow pill__arrow--down svc-more__arrow" aria-hidden="true">↓</span></summary>
              <SvcRuled class="svc-more__list" :groups="planning" />
            </details>
          </article>

          <!-- Design, florals & setup -->
          <article id="design" class="svc-part" data-i="1" aria-labelledby="design-title">
            <RiseText id="design-title" :lines="['Design, florals', '& setup']" />
            <p class="lead svc-part__lead">We design each event as one concept, from the palette to the place cards.</p>
            <FoundPhoto class="svc-part__pic" unveil sizes="sm:100vw md:100vw" :photo="credits.flowers" ratio="4 / 5" :alt="pics.flowers" />
            <SvcRuled class="svc-part__board" :groups="[{ items: designMenu }]" />
            <details class="svc-more">
              <summary class="pill pill--line pill--s svc-more__sum">Everything in design ({{ count(design) }}) <span class="pill__arrow pill__arrow--down svc-more__arrow" aria-hidden="true">↓</span></summary>
              <SvcRuled class="svc-more__list" :groups="design" />
            </details>
          </article>

          <!-- Live station catering -->
          <article id="stations" class="svc-part" data-i="2" aria-labelledby="stations-title">
            <RiseText id="stations-title" :lines="['Live station', 'catering']" />
            <p class="lead svc-part__lead">One counter at your party, changed for the menu you pick, run by our own attendants.</p>
            <ConceptImage class="svc-part__pic" unveil sizes="sm:100vw md:100vw" :src="pics.crepes.src" :width="pics.crepes.w" :height="pics.crepes.h" ratio="4 / 5" :alt="pics.crepes.alt" />
            <SvcRuled class="svc-part__board" :groups="[{ items: stationsMenu }]" />
            <div class="svc-part__act"><NuxtLink to="/live-stations" class="pill pill--sun pill--on-light">See the six stations <span class="pill__arrow" aria-hidden="true">→</span></NuxtLink></div>
          </article>
        </div>
      </div>

      <!-- phones: the index as a bar stuck to the bottom while the parts are on screen -->
      <nav class="svc-bar" :class="{ 'is-away': away, 'is-ready': ready }" aria-label="Parts on this page">
        <a v-for="(p, i) in parts" :key="p.id" :href="`#${p.id}`" class="svc-bar__a" :class="{ 'is-on': i === active }" :aria-current="i === active ? 'true' : undefined">{{ p.idx }}</a>
      </nav>
    </section>

    <CloseCta field="yellow" :lines="['Start with', 'a date']" />
  </div>
</template>

<style scoped>
/* ── hero side: the three parts on a cream board, flush to the hero's bottom-right corner (the /crepes board), so it
   runs straight into the cream of the parts below ── */
.svc :deep(.phx--heavy) { padding-bottom: 0; }
@media (min-width: 900px) { .svc :deep(.phx--heavy .phx__actions) { margin-bottom: clamp(56px, 7vw, 104px); } }
.svc-hb.board { gap: 0; padding-bottom: clamp(10px, 1.4vw, 18px); }
@media (max-width: 899px) { .svc-hb.board.board--flush-right { margin-left: calc(-1 * var(--gutter)); padding-left: var(--gutter); } }
.svc-hb__row {
  position: relative; display: grid; grid-template-columns: minmax(0, 1fr) auto; column-gap: 16px; align-items: center;
  padding: 14px 0 15px; color: var(--ink); text-decoration: none; touch-action: manipulation;
}
.svc-hb__row + .svc-hb__row::before { content: ""; position: absolute; left: 0; right: 0; top: 0; height: 2px; background: var(--ink); }
/* phones: names only (a wrapped note under a wrapped name reads as a three-line heading) */
@media (max-width: 599px) { .svc-hb__note { display: none; } .svc-hb__row { padding: 16px 0 17px; } }
.svc-hb__t { font-weight: 700; font-size: clamp(1.25rem, 1.05rem + 0.7 * var(--vw), 1.625rem); line-height: 1.1; letter-spacing: -0.01em; }
.svc-hb__note { grid-column: 1; font-size: 1.0625rem; line-height: 1.35; margin-top: 3px; }
.svc-hb__arrow { grid-column: 2; grid-row: 1 / span 2; font-size: 1.375rem; font-weight: 600; transition: transform var(--dur-base) var(--ease-out); }
.svc-hb__t, .svc-hb__note { transition: transform 280ms var(--ease-out); }
@media (hover: hover) and (pointer: fine) {
  .svc-hb__row:hover :is(.svc-hb__t, .svc-hb__note) { transform: translateX(6px); }
  .svc-hb__row:hover .svc-hb__arrow { transform: translateY(4px); }
}
.svc-hb__row:active .svc-hb__arrow { transform: translateY(6px); }
.svc-hb__row:focus-visible { outline-offset: -3px; }

/* ── the parts ── */
.svc-parts { position: relative; overflow: clip; background: var(--ground); color: var(--ink); padding-top: var(--space-block); }
@media (min-width: 900px) { .svc-parts { padding-top: var(--space-section); } }
.svc-parts__grid { display: grid; grid-template-columns: minmax(0, 1fr); }
.svc-parts__flow { display: grid; gap: calc(var(--space-section) * 1.1); padding-bottom: var(--space-section); }
.svc-part { display: grid; align-content: start; scroll-margin-top: 96px; }
.svc-part__statement { margin-top: var(--space-tight); max-width: 24ch; }
.svc-part__lead { margin-top: var(--space-tight); }
.svc-part__board { margin-top: var(--space-head); }
.svc-part__one { margin-top: clamp(22px, 2.6vw, 32px); }
.svc-part__act { margin-top: clamp(24px, 3vw, 36px); }
/* phones: each part carries its picture, edge to edge */
.svc-part__pic { margin: var(--space-head) calc(-1 * var(--gutter)) 0; }
@media (min-width: 600px) and (max-width: 899px) { .svc-part__pic { margin-inline: 0; width: min(100%, 520px); } }

/* the full lists, behind a disclosure */
.svc-more { margin-top: clamp(22px, 2.6vw, 32px); }
.svc-more__sum { list-style: none; cursor: pointer; width: fit-content; user-select: none; -webkit-user-select: none; touch-action: manipulation; }
.svc-more__sum::-webkit-details-marker { display: none; }
.svc-more__arrow { transition: transform 280ms var(--ease-out); }
.svc-more[open] .svc-more__arrow { transform: rotate(180deg); }
@media (hover: hover) and (pointer: fine) { .svc-more[open] .svc-more__sum:hover .svc-more__arrow { transform: rotate(180deg) translateY(3px); } }
.svc-more__list { margin-top: clamp(20px, 2.4vw, 28px); }
.svc-more[open] .svc-more__list { animation: m-in 560ms var(--ease-out) both; }
.svc-more__list :deep(.svr__lean) { font-size: 1.0625rem; }
@media (min-width: 1100px) { .svc-more__list.svr--two { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
@media (prefers-reduced-motion: reduce) { .svc-more[open] .svc-more__list { animation: none; } .svc-more__arrow { transition: none; } }

/* ── the sticky side: index + frame ── */
.svc-side { display: none; }
@media (min-width: 900px) {
  .svc-parts__grid { grid-template-columns: minmax(0, 4fr) minmax(0, 8fr); column-gap: clamp(40px, 5vw, 96px); align-items: start; }
  .svc-part__pic { display: none; }
  .svc-side { display: grid; gap: clamp(20px, 3svh, 32px); position: sticky; top: 104px; padding-bottom: var(--space-section); container-type: inline-size; }
  .svc-index { display: grid; gap: 14px; }
  .svc-index__list { list-style: none; margin: 0; padding: 0; display: grid; gap: 2px; }
  .svc-index__a {
    position: relative; display: inline-block; padding: 2px 0; color: var(--ink-muted); text-decoration: none;
    font-weight: 700; text-transform: uppercase; letter-spacing: var(--track-l); line-height: 0.98;
    /* the longest name ("Planning") at the column's width, less the step for the dot */
    font-size: min(3.5rem, calc((100cqi - 30px) / (8.4 * var(--cap-w))), 6.2svh);
    transition: color 240ms var(--ease-out), transform 360ms var(--ease-out); touch-action: manipulation;
  }
  .svc-index__a::before { content: ""; position: absolute; left: 0; top: 50%; width: 0.22em; height: 0.22em; margin-top: -0.13em; border-radius: 50%; background: var(--accent); transform: translateX(-4px) scale(0); transition: transform 360ms var(--ease-out); }
  .svc-index__a.is-on { color: var(--ink); transform: translateX(0.4em); }
  .svc-index__a.is-on::before { transform: translateX(-0.4em) scale(1); }
  .svc-index__a:active { transform: translateX(0.3em) scale(0.98); }
  .svc-index__meter { display: flex; align-items: center; gap: 14px; }
  .svc-index__count { flex: none; font-weight: 600; font-size: 0.9375rem; }
  .svc-index__railbox { flex: 1; height: 2px; background: color-mix(in srgb, var(--ink) 18%, transparent); overflow: hidden; }
  .svc-index__rail { display: block; height: 100%; background: var(--ink); transform: scaleX(0); transform-origin: left center; }

  /* the frame: fits under the index in one screen */
  .svc-frame { display: grid; width: min(100%, 460px, calc((81.4svh - 234px) * 0.8)); }
  .svc-frame__layer { grid-area: 1 / 1; z-index: 0; clip-path: inset(100% 0 0 0); visibility: hidden; transition: clip-path 0s linear 720ms, visibility 0s linear 720ms; }
  .svc-frame__layer.is-on { z-index: 1; clip-path: inset(0); visibility: visible; transition: clip-path 700ms var(--ease-out), visibility 0s; }
  .svc-frame__layer :deep(:is(.found__img, .concept__img)) { scale: 1.06; transition: scale 0s linear 720ms; }
  .svc-frame__layer.is-on :deep(:is(.found__img, .concept__img)) { scale: 1; transition: scale 1100ms var(--ease-out); }
  .svc-frame__layer:not(.is-on) :deep(.found__cap) { visibility: hidden; transition: none; }

  .svc-parts__flow { gap: calc(var(--space-section) * 1.2); }
  .svc-part { max-width: 860px; }
}
@media (hover: hover) and (pointer: fine) { .svc-index__a:hover { color: var(--ink); } }
html:not(.js) .svc-index__meter, html:not(.js) .svc-frame { display: none; }
@media (min-width: 900px) { html:not(.js) .svc-part__pic { display: block; max-width: 520px; margin-inline: 0; } }
@media (prefers-reduced-motion: reduce) {
  .svc-index__a, .svc-index__a::before { transition: none; }
  .svc-frame__layer, .svc-frame__layer.is-on { transition: none !important; }
  .svc-frame__layer :deep(:is(.found__img, .concept__img)) { transition: none !important; scale: 1 !important; }
}

/* ── phones: the bottom bar ── */
.svc-bar {
  position: sticky; bottom: 0; z-index: 5; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px;
  padding: 8px var(--gutter) calc(8px + env(safe-area-inset-bottom)); background: var(--field-dark); color: var(--on-field-dark); --focus-ring: var(--on-field-dark);
}
.svc-bar.is-ready { transition: transform 420ms var(--ease-out); }
.svc-bar.is-away:not(:focus-within) { transform: translateY(calc(100% + 8px)); }
.svc-bar__a {
  display: grid; place-items: center; min-height: 44px; border-radius: 999px; padding: 0 8px; color: inherit; text-decoration: none;
  font-weight: 700; font-size: 0.9375rem; transition: background-color 200ms var(--ease-out), color 200ms var(--ease-out), transform 120ms var(--ease-out);
  touch-action: manipulation; user-select: none; -webkit-user-select: none; -webkit-tap-highlight-color: transparent;
}
.svc-bar__a.is-on { background: var(--accent); color: var(--ink-deep); }
.svc-bar__a:active { transform: scale(0.97); }
.svc-bar__a:focus-visible { outline-color: var(--on-field-dark); }
@media (min-width: 900px) { .svc-bar { display: none; } }
@media (prefers-reduced-motion: reduce) { .svc-index__a, .svc-index__a::before { transition: none; } }
</style>
