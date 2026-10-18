<script setup lang="ts">
// How We Work signature (events-v2-system.md §8): the nine steps as boards that stick and cover each other.
// Each board sticks one lip (12 px) lower than the last, so the top edges of the earlier boards stay visible above the
// current one, like signboards hung one in front of the other. A meter follows: the phase index (active in full ink
// with an apricot dot), "Four of nine" in words and a rail (scaleX). Desktop: the meter sits in a sticky left column
// under the heading; phones and tablets: a slim sticky bar above the stack.
// Pinned only after mount, with motion allowed and a screen ≥ 560 px tall (`is-pinned`). SSR, no JS, reduced motion,
// landscape phones: the same boards simply follow each other (same flow, same spacing, so pinning shifts nothing).
// One rAF per scroll event, getBoundingClientRect only: follows native touch scroll and Lenis alike.
const phases = [
  { id: 'before', title: 'Before you book' },
  { id: 'plan', title: 'While we plan' },
  { id: 'day', title: 'On the day, and after' },
] as const
const steps = [
  { p: 0, t: 'Inquiry', d: 'You tell us the date, the place, the guest count and what you have in mind.' },
  { p: 0, t: 'Discovery', d: 'A call or a coffee about the people, the feel and the budget.' },
  { p: 0, t: 'Concept & scope', d: 'We sketch a concept and agree what we handle.' },
  { p: 0, t: 'Custom proposal', d: "A written proposal built on your event's real scope. No packages." },
  { p: 0, t: 'Contract', d: 'We confirm the details and hold your date.' },
  { p: 1, t: 'Planning & design', d: 'Vendors, layout, florals, menus and timeline come together.' },
  { p: 1, t: 'Final production', d: 'Final confirmations, rentals arrive, flowers are arranged.' },
  { p: 2, t: 'Event day', d: 'We set up, run the day and pack out.' },
  { p: 2, t: 'Follow-up', d: 'We check in after the party.' },
]
const N = steps.length
const words = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine']
// yellow → cream-deep → cream, except that the stack never ends on a cream board on the cream ground
const tones = ['yellow', 'deep', 'cream', 'yellow', 'deep', 'cream', 'yellow', 'deep', 'yellow'] as const
const firstOf = (p: number) => steps.findIndex(s => s.p === p)

const root = ref<HTMLElement | null>(null)
const stack = ref<HTMLElement | null>(null)
const rail = ref<HTMLElement | null>(null)
const rail2 = ref<HTMLElement | null>(null)
const pinned = ref(false)
const active = ref(0)
const activePhase = computed(() => steps[active.value]!.p)

let raf = 0
const boards = () => [...(stack.value?.querySelectorAll<HTMLElement>('.hw-step') ?? [])]
const stickTop = (b: HTMLElement) => Number.parseFloat(getComputedStyle(b).top) || 0
// Document scroll position at which board i sticks: the stack's top + the boards above it − its sticky offset.
function arrival(i: number, bs = boards()) {
  const s = stack.value!
  const top = s.getBoundingClientRect().top + window.scrollY
  let sum = 0
  for (let k = 0; k < i; k++) sum += bs[k]!.offsetHeight
  return top + sum - stickTop(bs[i]!)
}
function read() {
  raf = 0
  if (!pinned.value || !stack.value) return
  const bs = boards()
  const y = window.scrollY
  const a0 = arrival(0, bs)
  const aN = arrival(N - 1, bs)
  let i = 0
  for (let k = 1; k < N; k++) if (y >= arrival(k, bs) - 2) i = k
  active.value = i
  const p = Math.min(1, Math.max(0, (y - a0) / Math.max(1, aN - a0)))
  for (const r of [rail.value, rail2.value]) if (r) r.style.transform = `scaleX(${p.toFixed(4)})`
}
const onScroll = () => { if (!raf) raf = requestAnimationFrame(read) }
const check = () => { pinned.value = !matchMedia('(prefers-reduced-motion: reduce)').matches && window.innerHeight >= 560 }
const onResize = () => { check(); onScroll() }

// Jump to a step: while pinned the boards above it are stuck, so their rects can't be used; the arrival position is
// computed from the flow instead. Smooth via Lenis when it runs, otherwise native.
const { $lenis } = useNuxtApp() as unknown as { $lenis: { scrollTo: (y: number, o?: object) => void } | null }
function go(i: number) {
  const bs = boards()
  const el = bs[i]
  if (!el) return
  const y = pinned.value ? arrival(i, bs) + 1 : el.getBoundingClientRect().top + window.scrollY - Number.parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop || '0')
  if ($lenis) $lenis.scrollTo(y, { duration: 1.1 })
  else window.scrollTo({ top: y, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  // focus follows for keyboard users without a second jump
  el.focus({ preventScroll: true })
}
defineExpose({ go })

onMounted(() => {
  check()
  nextTick(read)
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onResize, { passive: true })
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onResize)
  cancelAnimationFrame(raf)
})
</script>

<template>
  <section ref="root" class="hw" :class="{ 'is-pinned': pinned }" aria-labelledby="hw-steps-title">
    <div class="wrap hw__grid">
      <div class="hw__side">
        <RiseText id="hw-steps-title" class="hw__title" :lines="['From inquiry', 'to follow-up']" size="l" />
        <div v-if="pinned" class="hw__meter" aria-hidden="true">
          <ol class="hw__phases">
            <li v-for="(ph, k) in phases" :key="ph.id">
              <button type="button" class="hw__ph" :class="{ 'is-on': k === activePhase }" tabindex="-1" @click="go(firstOf(k))">{{ ph.title }}</button>
            </li>
          </ol>
          <p class="hw__count tnum">{{ words[active] }} of nine</p>
          <span class="hw__railbox"><span ref="rail" class="hw__rail" /></span>
        </div>
      </div>

      <div class="hw__main">
        <!-- phones / tablets: the meter is a slim bar that sticks above the stack -->
        <div class="hw__bar" aria-hidden="true">
          <p class="hw__bar-ph">{{ phases[activePhase]!.title }}</p>
          <p class="hw__count tnum">{{ words[active] }} of nine</p>
          <span class="hw__railbox"><span ref="rail2" class="hw__rail" /></span>
        </div>
        <ol ref="stack" class="hw__stack">
          <li
            v-for="(s, i) in steps" :id="`hw-s-${i + 1}`" :key="s.t" class="hw-step" :class="[`hw-step--${tones[i]}`, { 'is-day': s.t === 'Event day', 'is-up': pinned && i <= active }]"
            :style="{ '--i': i }" tabindex="-1"
          >
            <p class="hw-step__phase">{{ phases[s.p]!.title }}</p>
            <span class="hw-step__n" aria-hidden="true">{{ i + 1 }}</span>
            <h3 class="display-m hw-step__t">{{ s.t }}</h3>
            <p class="statement hw-step__d">{{ s.d }}</p>
            <span v-if="s.t === 'Event day'" class="hw-step__sun" aria-hidden="true" />
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hw { --lip: 12px; --top: 68px; --bh: clamp(320px, calc(100svh - var(--top) - 9 * var(--lip) - 40px), 560px); background: var(--ground); color: var(--ink); padding-block: var(--space-section); }
@media (min-width: 1100px) { .hw { --top: 96px; } }
.hw__grid { display: grid; gap: var(--space-head); }
.hw__side { min-width: 0; }
.hw__main { min-width: 0; }

/* the boards: flat panels, square corners; a brown rule on the top edge is the lip that stays visible in the stack */
.hw__stack { list-style: none; margin: 0; padding: 0; }
.hw-step {
  position: relative; overflow: clip; display: grid; grid-template-rows: auto auto 1fr; align-content: start; gap: clamp(12px, 1.4vw, 20px);
  min-height: var(--bh); padding: clamp(22px, 3vw, 44px) clamp(22px, 3.4vw, 52px) clamp(26px, 3.4vw, 48px);
  border-top: 2px solid var(--ink); scroll-margin-top: calc(var(--top) + var(--i) * var(--lip));
}
.hw-step:focus { outline: none; }
.hw-step:focus-visible { outline: 3px solid var(--ink); outline-offset: -3px; }
.hw-step--yellow { background: var(--field); }
.hw-step--deep { background: var(--surface); }
.hw-step--cream { background: var(--ground); }
.hw-step__phase { font-weight: 600; font-size: 1rem; line-height: 1.3; }
.hw-step__phase, .hw-step__t, .hw-step__d { position: relative; z-index: 1; }
/* the step's number, painted large in the corner like the number on a lido board (decorative: the list is an <ol>) */
.hw-step__n {
  position: absolute; bottom: -0.06em; right: clamp(18px, 3vw, 44px); z-index: 0;
  font: 700 clamp(7rem, 4rem + 12 * var(--vw), 15rem)/0.8 var(--font-display); letter-spacing: -0.04em; color: var(--accent);
  font-variant-numeric: tabular-nums; user-select: none; pointer-events: none;
}
.hw-step--yellow .hw-step__n { color: var(--accent); }
.hw-step--deep .hw-step__n, .hw-step--cream .hw-step__n { color: var(--field); }
.hw-step__t { margin-top: clamp(28px, 6svh, 72px); max-width: 14ch; text-wrap: balance; font-size: clamp(1.875rem, 1.1rem + 3 * var(--vw), 4rem); line-height: 0.95; letter-spacing: var(--track-l); }
.hw-step__d { font-size: var(--step-2); line-height: 1.3; max-width: 24ch; align-self: start; }
/* the day itself: the mark's half-sun stands on the board's lower edge (rises when the board arrives in the stack) */
.hw-step__sun {
  position: absolute; left: clamp(22px, 3.4vw, 52px); bottom: 0; width: clamp(96px, 16vw, 200px); aspect-ratio: 2 / 1;
  border-radius: 999px 999px 0 0; background: var(--accent);
}
@media (max-width: 599px) { .hw-step__sun { width: 112px; } }

/* the meter */
.hw__phases { list-style: none; margin: 0; padding: 0; display: grid; gap: 2px; }
.hw__ph {
  position: relative; display: block; border: 0; background: none; padding: 6px 0; text-align: left; cursor: pointer;
  font: 500 clamp(1.125rem, 0.9rem + 0.6vw, 1.5rem)/1.2 var(--font-display); letter-spacing: -0.01em; color: var(--ink-muted);
  transition: color 240ms var(--ease-out), transform 240ms var(--ease-out); touch-action: manipulation; user-select: none;
}
.hw__ph::before { content: ""; position: absolute; left: -2px; top: 50%; width: 8px; height: 8px; margin-top: -4px; border-radius: 50%; background: var(--accent); transform: scale(0); transition: transform 240ms var(--ease-out); }
.hw__ph.is-on { color: var(--ink); font-weight: 700; transform: translateX(18px); }
.hw__ph.is-on::before { transform: translateX(-18px) scale(1); }
.hw__ph:active { transform: translateX(10px) scale(0.98); }
@media (hover: hover) and (pointer: fine) { .hw__ph:hover { color: var(--ink); } }
.hw__count { font-weight: 600; font-size: 0.9375rem; white-space: nowrap; }
.hw__railbox { display: block; height: 2px; background: color-mix(in srgb, var(--ink) 18%, transparent); overflow: hidden; }
.hw__rail { display: block; height: 100%; background: var(--ink); transform: scaleX(0); transform-origin: left center; }
.hw__meter { display: none; }
.hw__bar { display: none; }

/* pinned */
.is-pinned .hw-step { position: sticky; top: calc(var(--top) + var(--i) * var(--lip)); height: var(--bh); }
/* the last board holds for a moment before the stack leaves */
.is-pinned .hw__stack::after { content: ""; display: block; height: 28svh; }
.hw.is-pinned { padding-bottom: 0; }
.hw-step.is-day .hw-step__sun { transition: transform 1100ms var(--ease-out) 160ms; }
.is-pinned .hw-step.is-day:not(.is-up) .hw-step__sun { transform: translateY(100%); }

@media (max-width: 1023px) {
  .hw { --top: 120px; }
  .hw__bar { visibility: hidden; }
  .is-pinned .hw__bar { visibility: visible; }
  .hw__bar {
    display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; column-gap: 16px; row-gap: 8px;
    position: sticky; top: 56px; z-index: 2; height: 56px; align-content: center; background: var(--ground);
  }
  .hw__bar .hw__railbox { grid-column: 1 / -1; }
  .hw__bar .hw__count { min-width: 8.5em; text-align: right; } /* "Seven of nine" never pushes the phase name */
  .hw__bar-ph { font-weight: 700; font-size: 0.9375rem; line-height: 1.2; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
}
@media (min-width: 1024px) {
  .hw__grid { grid-template-columns: minmax(0, 4fr) minmax(0, 8fr); column-gap: clamp(32px, 4vw, 72px); align-items: start; }
  /* the heading scrolls on; only the meter (phases, count, rail) holds beside the stack */
  .hw__side { align-self: stretch; }
  .is-pinned .hw__meter { display: grid; gap: 14px; margin-top: var(--space-head); max-width: 22rem; position: sticky; top: var(--top); }
  .hw__meter .hw__count { margin-top: 18px; }
}
</style>
