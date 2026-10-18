<script setup lang="ts">
definePageMeta({ awning: 'yellow', field: 'apricot' })
usePageSeo({ title: 'How we work', description: 'How an Una Mattina event comes together, from your first inquiry to the follow-up: discovery, concept, a custom proposal, planning and the event day.' })
const phases = [
  {
    id: 'before', title: 'Before you book', steps: [
      { t: 'Inquiry', d: 'You tell us the date, the place, the guest count and what you have in mind.' },
      { t: 'Discovery', d: 'A call or a coffee about the people, the feel and the budget.' },
      { t: 'Concept & scope', d: 'We sketch a concept and agree what we handle.' },
      { t: 'Custom proposal', d: "A written proposal built on your event's real scope. No packages." },
      { t: 'Contract', d: 'We confirm the details and hold your date.' },
    ],
  },
  {
    id: 'plan', title: 'While we plan', steps: [
      { t: 'Planning & design', d: 'Vendors, layout, florals, menus and timeline come together.' },
      { t: 'Final production', d: 'Final confirmations, rentals arrive, flowers are arranged.' },
    ],
  },
  {
    id: 'day', title: 'On the day, and after', steps: [
      { t: 'Event day', d: 'We set up, run the day and pack out.' },
      { t: 'Follow-up', d: 'We check in after the party.' },
    ],
  },
]
// <ol start> keeps the order of the whole journey for assistive tech; no numerals are drawn.
const starts = phases.map((_, i) => phases.slice(0, i).reduce((n, p) => n + p.steps.length, 1))

// W2 (B3, dollop / élan): the three phases are painted boards that stack. From 900 px (and tall enough screens, motion
// allowed) each board is sticky a little lower than the last, so the next one slides up and covers it while the edges of
// the earlier boards stay visible above it, like signs hung one in front of the other. A sticky rail above them shows
// where you are (fill = scaleX, the current phase label in full ink). The rail is decorative (aria-hidden): the boards'
// own H2s carry the structure. Phones / short screens / reduced motion / no JS: the boards simply follow each other.
const journey = ref<HTMLElement>()
const progress = ref(0)
const active = ref(0)
const railShift = ref(0) // the rail leaves together with the stack once the last board lets go
let raf = 0
function measure() {
  raf = 0
  const el = journey.value
  if (!el) return
  const boards = [...el.querySelectorAll<HTMLElement>('.hw-board')]
  if (!boards.length || getComputedStyle(boards[0]!).position !== 'sticky') return
  // each board "arrives" when its top reaches its own sticky offset; progress runs piecewise between arrivals
  const gaps = boards.map(b => b.getBoundingClientRect().top - Number.parseFloat(getComputedStyle(b).top))
  railShift.value = Math.min(0, gaps.at(-1)!)
  let i = 0
  while (i < gaps.length - 1 && gaps[i + 1]! <= 0.5) i++
  active.value = i
  if (i >= gaps.length - 1) { progress.value = 1; return }
  // the next board's travel from the moment this one arrived (its gap then) down to 0; offsetTop is useless here
  // because sticky boxes report their stuck position, so the span comes from this board's box + the next board's top margin − one lip
  const cur = boards[i]!
  const lip = Number.parseFloat(getComputedStyle(el).getPropertyValue('--lip')) || 18
  const span = cur.offsetHeight + Number.parseFloat(getComputedStyle(boards[i + 1]!).marginTop) - lip
  const f = Math.min(1, Math.max(0, 1 - gaps[i + 1]! / span))
  progress.value = (i + (gaps[0]! > 0.5 ? 0 : f)) / (gaps.length - 1)
}
function onScroll() { if (!raf) raf = requestAnimationFrame(measure) }
onMounted(() => {
  measure()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
})
onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
})
</script>

<template>
  <div>
    <!-- W1: type-led hero, the title runs the full width -->
    <PageHero id="hw-title" layout="type" title="Simple for you">
      <template #actions><NuxtLink to="/inquire" class="btn btn-ink">Send an inquiry</NuxtLink></template>
      <template #side><p class="statement hw-hero__statement">There's a lot of production behind an event. Your side of it looks like this.</p></template>
    </PageHero>

    <!-- W2: the journey as three painted boards that stack, a progress rail above them -->
    <div ref="journey" class="wrap hw-journey">
      <div class="hw-rail" aria-hidden="true" :style="railShift ? { transform: `translateY(${railShift}px)` } : undefined">
        <div class="hw-rail__track"><span class="hw-rail__fill" :style="{ transform: `scaleX(${progress})` }" /></div>
        <ol class="hw-rail__ticks">
          <li v-for="(p, i) in phases" :key="p.id" class="hw-rail__tick" :class="{ 'is-on': i === active, 'is-done': i < active }">{{ p.title }}</li>
        </ol>
      </div>
      <section v-for="(p, i) in phases" :key="p.id" class="hw-board" :class="`hw-board--${i}`" :style="{ '--i': i }" :aria-labelledby="`phase-${p.id}`">
        <h2 :id="`phase-${p.id}`" class="sign-m hw-board__title">{{ p.title }}</h2>
        <ol class="hw-board__steps" :class="{ 'is-long': p.steps.length > 3 }" :start="starts[i]">
          <li v-for="st in p.steps" :key="st.t" class="hw-board__step">
            <h3 class="hw-board__t">{{ st.t }}</h3>
            <p class="italic-line hw-board__d">{{ st.d }}</p>
          </li>
        </ol>
      </section>
      <div class="hw-tail" aria-hidden="true" />
    </div>

    <!-- W3: the one rule, yellow band -->
    <section class="rule" aria-label="How we staff your event">
      <div class="wrap rule__grid">
        <p v-reveal class="statement rule__statement">The person running your event never stands at a station or a bar at the same time.</p>
        <p class="rule__note">For beaches, parks and other public places, we confirm the rules and any permits before we finalise your booking.</p>
      </div>
    </section>

    <CloseCta :lines="['Start with', 'step one']" label="Send an inquiry" />
  </div>
</template>

<style scoped>
.hw-hero__statement { color: var(--ink-deep); }
/* DESIGN: sign-xl ≈ 52–64 px on phones (PageHero's type layout drops to ~34 px); 2 lines at 360 */
@media (max-width: 599px) { .ph.ph--type :deep(.ph__title) { font-size: clamp(2.75rem, 13vw, 3.5rem); } }
@media (max-width: 767px) { .ph :deep(.ph__actions .btn) { width: 100%; justify-content: center; } }

/* W2 */
.hw-journey { --rail-top: 96px; --rail-h: 64px; --lip: 18px; padding-block: calc(var(--section) * 0.6) var(--section); display: grid; gap: 24px; }
.hw-rail { display: none; }
.hw-board { --bg: var(--field); --fg: var(--ink); background: var(--bg); color: var(--fg); padding: clamp(24px, 4vw, 56px); display: grid; gap: clamp(20px, 3vw, 36px); }
.hw-board--1 { --bg: var(--accent); --fg: var(--ink-deep); }
/* yellow first: the hero field above is apricot, so the first board must not be apricot too (phones read them as one block) */
.hw-board--2 { --bg: var(--surface); --fg: var(--ink); position: relative; overflow: clip; }
@media (max-width: 899px) { .hw-board--2 { padding-bottom: calc(clamp(96px, 16vw, 220px) / 2 + 28px); } }
/* the last board is the day itself: the mark's half-sun comes up from its lower edge (static) */
.hw-board--2::after { content: ""; position: absolute; right: clamp(24px, 4vw, 56px); bottom: 0; width: clamp(96px, 16vw, 220px); aspect-ratio: 2 / 1; border-radius: 999px 999px 0 0; background: var(--accent); }
.hw-board__steps { list-style: none; margin: 0; padding: 0; display: grid; gap: clamp(20px, 2.4vw, 32px); }
.hw-board__step { display: grid; gap: 4px; align-content: start; }
.hw-board__t { font-family: var(--font-text); font-weight: 600; font-size: var(--step-1); text-transform: none; letter-spacing: 0; line-height: 1.25; }
.hw-board__d { font-size: var(--step-1); line-height: 1.4; max-width: 34ch; }
@media (min-width: 700px) { .hw-board__steps.is-long { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); column-gap: 40px; } }
@media (min-width: 900px) {
  .hw-board { min-height: min(560px, 62svh); align-content: start; }
  .hw-board__steps:not(.is-long) { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); column-gap: 40px; }
}
@media (min-width: 1100px) { .hw-board { grid-template-columns: minmax(0, 4fr) minmax(0, 8fr); column-gap: 48px; align-items: start; } }
/* W3 */
.rule { background: var(--field); padding-block: calc(var(--section) * 0.7); }
.rule__grid { display: grid; gap: clamp(24px, 3vw, 40px); }
.rule__statement { font-size: clamp(1.375rem, 0.95rem + 1.5 * var(--vw), 2.25rem); max-width: 27em; }
.rule__note { font-size: var(--step-1); line-height: 1.45; max-width: 34ch; }
@media (min-width: 900px) {
  .rule__grid { grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); align-items: end; gap: 48px; }
}
</style>

<style>
/* How we work W2, pinned state. Unscoped (class names are unique to this page) prefixed with html to outrank the scoped base rules. */
/* pinned: rail sticky, each board sticky one lip lower than the last; space between boards = the time each one is read */
@media (min-width: 900px) and (min-height: 640px) and (prefers-reduced-motion: no-preference) {
  /* spacing sits on the next board's top margin and on an empty tail after the last board, never on a board's bottom
     margin or the journey's padding: a sticky box's margin box must stay inside its container's content box */
  html .hw-journey.hw-journey { gap: 0; padding-bottom: 0; }
  html .hw-journey .hw-tail { height: 30svh; }
  html .hw-journey .hw-rail {
    display: block; position: sticky; top: var(--rail-top); z-index: 3; height: var(--rail-h); margin-bottom: 8px;
    background: var(--ground); padding-top: 10px;
  }
  html .hw-journey .hw-rail__track { position: relative; height: 2px; background: color-mix(in srgb, var(--ink) 18%, transparent); }
  html .hw-journey .hw-rail__fill { position: absolute; inset: 0; background: var(--ink); transform-origin: left center; transition: transform 120ms linear; }
  html .hw-journey .hw-rail__ticks { list-style: none; margin: 12px 0 0; padding: 0; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); font-size: 0.875rem; font-weight: 600; color: var(--ink-muted); }
  html .hw-journey .hw-rail__tick:nth-child(2) { text-align: center; }
  html .hw-journey .hw-rail__tick:nth-child(3) { text-align: right; }
  html .hw-journey .hw-rail__tick { transition: color var(--dur-base) var(--ease-out); }
  html .hw-journey .hw-rail__tick.is-on, html .hw-journey .hw-rail__tick.is-done { color: var(--ink); }
  html .hw-journey .hw-board { position: sticky; top: calc(var(--rail-top) + var(--rail-h) + 8px + var(--i) * var(--lip)); }
  html .hw-journey .hw-board + .hw-board { margin-top: 22svh; }
}
</style>
