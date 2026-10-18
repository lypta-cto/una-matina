<script setup lang="ts">
// Services (Events v2, events-v2-system.md §8). Apricot field, heavy hero.
// Signature: a sticky index of the three parts. The index (Planning / Design / Stations) holds still in the left
// column while the parts scroll past on the right; the part in the reading band is full ink with an apricot dot,
// the others muted; a rail and "One of three" follow progress; each name is a jump link. Phones: the same index as a
// brown bar stuck to the bottom of the screen while the parts are on screen (CSS sticky, no JS).
// One quiet move per part: Planning and Design draw their ruled boards (rule, then words), the florals photo unveils,
// the griddle half-bleed unveils. Without JS / reduced motion: everything final, the index still jumps.
import { credits } from '~/data/credits'
definePageMeta({ awning: 'yellow', field: 'apricot' })
usePageSeo({ title: 'Services', description: 'Event planning and coordination, event design with in-house florals and setup, and live station catering in Naples and Southwest Florida. Book one or all three.' })

const planning = [
  { title: 'Planning', items: ['Discovery and vision', 'Budget and priorities', 'Venue or location search', 'Vendor sourcing and communication', 'Food and beverage coordination'] },
  { title: 'Production', items: ['Floor plan and guest flow', 'Timeline and production schedule', 'Final confirmations', 'Event-day management', 'Setup and breakdown coordination'] },
]
const partners = ['DJs and live musicians', 'Photo booths', 'Chair, table and tent rentals', 'Lighting', 'Bakeries and cakes', 'Bartenders', 'Cleanup crews']
const design = [
  { title: 'Design', items: ['Colour palette', 'Tablescape', 'Linens and napkins', 'Tableware', 'Menus and place cards', 'Signage', 'Rugs, pillows and picnic styling', 'Decorations'] },
  { title: 'Setup & breakdown', items: ['Tables and high-tops', 'Décor installations', 'Rental coordination', 'On-site styling', 'Final detailing', 'Breakdown and pack-out'] },
]
const florals = { title: 'Florals, in-house', items: ['Centerpieces', 'Bud vases', 'Station florals', 'Picnic florals', 'Custom arrangements'] }

const parts = [
  { id: 'planning', idx: 'Planning', t: 'Planning & coordination', note: 'Vision, budget, vendors and the day itself.' },
  { id: 'design', idx: 'Design', t: 'Design, florals & setup', note: 'One concept, with flowers we arrange ourselves.' },
  { id: 'stations', idx: 'Stations', t: 'Live station catering', note: 'Six stations, made in front of your guests.' },
]
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
const read = () => {
  tick = 0
  const y = window.scrollY
  if (Math.abs(y - lastY) > 6) { down = y > lastY; lastY = y }
  const top = root.value?.getBoundingClientRect().top ?? 0
  away.value = top > 0 || down
}
const onScroll = () => { if (!tick) tick = requestAnimationFrame(read) }
onMounted(() => {
  lastY = window.scrollY
  read()
  requestAnimationFrame(() => { ready.value = true })
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => { io?.disconnect(); window.removeEventListener('scroll', onScroll); cancelAnimationFrame(tick) })
</script>

<template>
  <div class="svc">
    <PageHero id="services-title" layout="heavy" title="Three parts, one team" :lines="['Three parts,', 'one team']" lead="Book one service or hand us the whole event. When we do all three, one person leads it from first call to last box packed.">
      <template #actions><NuxtLink to="/inquire" class="pill pill--ink">Start an inquiry <span class="pill__arrow" aria-hidden="true">→</span></NuxtLink></template>
      <template #side>
        <Board tone="cream" valance="yellow" drop flush="right" as="nav" class="svc-hb" aria-label="The three parts">
          <a v-for="p in parts" :key="p.id" :href="`#${p.id}`" class="svc-hb__row">
            <span class="svc-hb__t">{{ p.t }}</span>
            <span class="svc-hb__note italic-line">{{ p.note }}</span>
            <span class="svc-hb__arrow" aria-hidden="true">↓</span>
          </a>
        </Board>
      </template>
    </PageHero>

    <!-- The three parts: sticky index left, the parts scroll past on the right -->
    <section ref="root" class="svc-parts" aria-label="The three parts">
      <div class="wrap svc-parts__grid">
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

        <div class="svc-parts__flow">
          <!-- Planning (+ who we bring in) -->
          <article id="planning" class="svc-part svc-part--plan" data-i="0" aria-labelledby="planning-title">
            <RiseText id="planning-title" :lines="['Planning &', 'coordination']" />
            <p class="statement svc-part__statement">Planning is its own service, not an add-on to the food.</p>
            <SvcRuled class="svc-part__board" :groups="planning" />
            <div class="svc-partners">
              <h3 class="display-m svc-partners__title">Who we bring in</h3>
              <p class="svc-partners__body">We lead the creative direction. For what doesn't need to live with us, we work with trusted partners.</p>
              <SvcRuled class="svc-partners__list" split :groups="[{ items: partners }]" />
              <p class="statement svc-partners__one">You still talk to one person.</p>
            </div>
          </article>

          <!-- Design, florals & setup -->
          <article id="design" class="svc-part svc-part--design" data-i="1" aria-labelledby="design-title">
            <RiseText id="design-title" :lines="['Design, florals', '& setup']" />
            <p class="lead svc-part__lead">We design each event as one concept, from the palette to the place cards.</p>
            <div class="svc-florals">
              <FoundPhoto class="svc-florals__img" unveil sizes="sm:100vw md:340px lg:340px" :photo="credits.flowers" ratio="4 / 5" alt="Buckets of cut flowers at a flower-market stall" />
              <div class="svc-florals__text">
                <SvcRuled :groups="[florals]" />
                <p class="statement svc-florals__statement">The flowers are ours: arranged in-house, not ordered in.</p>
              </div>
            </div>
            <SvcRuled class="svc-part__board" :groups="design" />
          </article>

          <!-- Live station catering: the griddle runs to the right edge -->
          <article id="stations" class="svc-part svc-part--stations" data-i="2" aria-labelledby="stations-title">
            <div class="svc-st__text">
              <RiseText id="stations-title" :lines="['Live station', 'catering']" />
              <p class="lead svc-st__body">Six stations, cooked, layered or poured in front of your guests on one modular counter: crêpes, tiramisu, fruit cups, charcuterie, cannoli, cocktails and mocktails.</p>
              <NuxtLink to="/live-stations" class="pill pill--sun pill--on-light">See the stations <span class="pill__arrow" aria-hidden="true">→</span></NuxtLink>
            </div>
            <FoundPhoto class="svc-st__img" unveil sizes="sm:100vw md:50vw lg:620px" :photo="credits.griddle" ratio="4 / 5" alt="A thin crêpe cooking on a round cast-iron griddle" />
          </article>
        </div>
      </div>

      <!-- phones: the index as a bar stuck to the bottom while the parts are on screen -->
      <nav class="svc-bar" :class="{ 'is-away': away, 'is-ready': ready }" aria-label="Parts on this page">
        <a v-for="(p, i) in parts" :key="p.id" :href="`#${p.id}`" class="svc-bar__a" :class="{ 'is-on': i === active }" :aria-current="i === active ? 'true' : undefined">{{ p.idx }}</a>
      </nav>
    </section>

    <CloseCta field="yellow" :lines="['Start with', 'one part']" />
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

.svc-partners { margin-top: var(--space-block); display: grid; }
.svc-partners__title { font-size: min(var(--display-m), 9vw); }
.svc-partners__body { margin-top: var(--space-tight); font-size: var(--step-1); line-height: 1.45; max-width: 40ch; }
.svc-partners__list { margin-top: clamp(20px, 2.4vw, 32px); }
.svc-partners__one { margin-top: clamp(20px, 2.4vw, 32px); }

.svc-florals { margin-top: var(--space-head); display: grid; gap: clamp(24px, 3vw, 40px); }
.svc-florals__img { width: 100%; max-width: 340px; }
.svc-florals__statement { margin-top: clamp(20px, 2.4vw, 28px); max-width: 20ch; }
@media (min-width: 640px) {
  .svc-florals { grid-template-columns: minmax(0, 5fr) minmax(0, 6fr); align-items: start; }
  .svc-florals__img { max-width: none; }
}

/* stations: text, then the griddle running to the viewport edge (phones: edge to edge) */
.svc-part--stations { gap: clamp(32px, 4vw, 48px); }
.svc-st__body { margin: var(--space-tight) 0 clamp(24px, 3vw, 32px); }
.svc-st__img { margin-inline: calc(-1 * var(--gutter)); }
.svc-st__img :deep(.found__cap) { padding-inline: var(--gutter); }
@media (min-width: 640px) and (max-width: 899px) {
  .svc-part--stations { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); align-items: end; }
  .svc-st__img { margin-inline: 0 calc(-1 * var(--gutter)); }
  .svc-st__img :deep(.found__cap) { padding-inline: 0 var(--gutter); }
}

/* ── the index ── */
.svc-index { display: none; }
@media (min-width: 900px) {
  .svc-parts__grid { grid-template-columns: minmax(0, 3fr) minmax(0, 9fr); column-gap: clamp(32px, 4vw, 72px); align-items: start; }
  .svc-index { display: grid; gap: 22px; position: sticky; top: 112px; padding-bottom: var(--space-section); }
  .svc-index__list { list-style: none; margin: 0; padding: 0; display: grid; gap: 4px; }
  .svc-index__a {
    position: relative; display: inline-block; padding: 6px 0; color: var(--ink-muted); text-decoration: none;
    font-weight: 700; text-transform: uppercase; letter-spacing: var(--track-m); line-height: 1;
    font-size: clamp(1.75rem, 0.9rem + 1.5 * var(--vw), 2.75rem);
    transition: color 240ms var(--ease-out), transform 360ms var(--ease-out); touch-action: manipulation;
  }
  /* the apricot dot = the half-sun's colour; it lands as the name steps in */
  .svc-index__a::before { content: ""; position: absolute; left: 0; top: 50%; width: 10px; height: 10px; margin-top: -5px; border-radius: 50%; background: var(--accent); transform: translateX(-4px) scale(0); transition: transform 360ms var(--ease-out); }
  .svc-index__a.is-on { color: var(--ink); transform: translateX(22px); }
  .svc-index__a.is-on::before { transform: translateX(-22px) scale(1); }
  .svc-index__a:active { transform: translateX(14px) scale(0.98); }
  .svc-index__meter { display: grid; gap: 10px; max-width: 220px; }
  .svc-index__count { font-weight: 600; font-size: 0.9375rem; }
  .svc-index__railbox { height: 2px; background: color-mix(in srgb, var(--ink) 18%, transparent); overflow: hidden; }
  .svc-index__rail { display: block; height: 100%; background: var(--ink); transform: scaleX(0); transform-origin: left center; }

  .svc-parts__flow { gap: calc(var(--space-section) * 1.2); }
  .svc-part__board { max-width: 880px; }
  .svc-part--plan, .svc-part--design { max-width: 900px; }
  /* the stations part: text in the column, the griddle to the viewport's right edge */
  .svc-part--stations { grid-template-columns: minmax(0, 5fr) minmax(0, 5fr); column-gap: clamp(32px, 4vw, 64px); align-items: end; }
  .svc-st__img { margin: 0 calc(-1 * (max(0px, (100vw - var(--max)) / 2) + var(--gutter))) 0 0; }
  .svc-st__img :deep(.found__cap) { padding-inline: 0 var(--gutter); }
  .svc-st__img :deep(.found__frame) { aspect-ratio: auto !important; height: clamp(520px, 72svh, 760px); }
}
@media (hover: hover) and (pointer: fine) { .svc-index__a:hover { color: var(--ink); } }
html:not(.js) .svc-index__meter { display: none; }

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
