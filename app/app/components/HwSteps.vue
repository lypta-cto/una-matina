<script setup lang="ts">
// How We Work signature (events-v2-system.md §8): the nine steps as boards that stick and cover each other.
// Each board sticks one lip (12 px) lower than the last, so the top edges of the earlier boards stay visible above the
// current one, like signboards hung one in front of the other. Boards are short (≈ 30 % of the screen) and full:
// number top-right, title, sentence; the nine together take about 2.5 screens.
// Index: desktop (≥ 1024 px) holds a sticky left column with the nine step names in heavy caps (the /crepes
// sequence index: active in full ink with an apricot dot), "Four of nine" and a rail. It is real navigation (links to
// the boards), so it renders and works without JS and under reduced motion too (sticky is not motion). Phones/tablets:
// a slim sticky bar (phase · count · rail) while pinned.
// Pinned (boards sticky) only after mount, with motion allowed and a screen ≥ 560 px tall (`is-pinned`). SSR, no JS,
// reduced motion, landscape phones: the same boards in flow, same sizes, so pinning shifts nothing.
// The tops follow the header: when it slides away (headroom) the bar and the boards move up with it (unscoped CSS).
// One rAF per scroll event, getBoundingClientRect only: follows native touch scroll and Lenis alike.
import { credits } from '~/data/credits'

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
// every board contrasts with the cream ground and with its neighbours; the last one (apricot) never meets the yellow band
const tones = ['yellow', 'deep', 'apricot', 'yellow', 'deep', 'apricot', 'yellow', 'deep', 'apricot'] as const
const groups = phases.map((ph, k) => ({ ...ph, items: steps.map((s, i) => ({ ...s, i })).filter(s => s.p === k) }))
const DAY = steps.findIndex(s => s.t === 'Event day')

const stack = ref<HTMLElement | null>(null)
const rail = ref<HTMLElement | null>(null)
const rail2 = ref<HTMLElement | null>(null)
const pinned = ref(false)
const active = ref(0)
const activePhase = computed(() => steps[active.value]!.p)

let raf = 0
const boards = () => [...(stack.value?.querySelectorAll<HTMLElement>('.hw-step') ?? [])]
const px = (v: string) => Number.parseFloat(v) || 0
// Document scroll position at which board i sticks: the stack's top + the boards above it − its sticky offset.
// `hdrAfter` = the header height once the scroll has happened (it hides on the way down, returns on the way up).
function arrival(i: number, bs = boards(), hdrAfter?: number) {
  const s = stack.value!
  const top = s.getBoundingClientRect().top + window.scrollY
  let sum = 0
  for (let k = 0; k < i; k++) sum += bs[k]!.offsetHeight
  let stick = px(getComputedStyle(bs[i]!).top)
  if (hdrAfter !== undefined) stick += hdrAfter - px(getComputedStyle(s).getPropertyValue('--hdr'))
  return top + sum - stick
}
function read() {
  raf = 0
  const bs = boards()
  if (!bs.length) return
  let i = 0
  let p = 0
  if (pinned.value) {
    const y = window.scrollY
    for (let k = 1; k < N; k++) if (y >= arrival(k, bs) - 2) i = k
    const a0 = arrival(0, bs)
    const aN = arrival(N - 1, bs)
    p = Math.min(1, Math.max(0, (y - a0) / Math.max(1, aN - a0)))
  }
  else {
    // in flow: the current step is the last board whose top has passed 45 % of the screen
    const line = window.innerHeight * 0.45
    for (let k = 1; k < N; k++) if (bs[k]!.getBoundingClientRect().top <= line) i = k
    p = i / (N - 1)
  }
  active.value = i
  for (const r of [rail.value, rail2.value]) if (r) r.style.transform = `scaleX(${p.toFixed(4)})`
}
const onScroll = () => { if (!raf) raf = requestAnimationFrame(read) }
const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches
const check = () => { pinned.value = !reduce() && window.innerHeight >= 560 }
const onResize = () => { check(); onScroll() }

// Jump to a step. While pinned the boards above the target are stuck, so their rects can't be the target: the arrival
// position is computed from the flow (with the header as it will be after the scroll). Lenis when it runs.
const { $lenis } = useNuxtApp() as unknown as { $lenis: { scrollTo: (y: number, o?: object) => void } | null }
function go(i: number) {
  const bs = boards()
  const el = bs[i]
  if (!el) return
  let y: number
  if (pinned.value) {
    const down = arrival(i, bs) > window.scrollY
    const hdr = down ? 0 : px(getComputedStyle(stack.value!).getPropertyValue('--hdr-full'))
    y = arrival(i, bs, hdr) + 1
  }
  else {
    y = el.getBoundingClientRect().top + window.scrollY - px(getComputedStyle(document.documentElement).scrollPaddingTop)
  }
  if ($lenis) $lenis.scrollTo(y, { duration: 1.1 })
  else window.scrollTo({ top: y, behavior: reduce() ? 'auto' : 'smooth' })
  el.focus({ preventScroll: true })
}
// links keep their #hash for no-JS; with JS the scroll is ours (not Lenis' anchor glide)
function jump(e: MouseEvent, i: number) {
  e.preventDefault()
  e.stopPropagation()
  go(i)
  history.replaceState(history.state, '', `#hw-s-${i + 1}`)
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
  <section class="hw" :class="{ 'is-pinned': pinned }" aria-labelledby="hw-steps-title">
    <div class="wrap hw__grid">
      <div class="hw__side">
        <div class="hw__hold">
          <RiseText id="hw-steps-title" class="hw__title" :lines="['From inquiry', 'to follow-up']" size="l" />
          <nav class="hw__index" aria-label="The nine steps">
            <ol v-for="g in groups" :key="g.id" class="hw__group" :start="g.items[0]!.i + 1">
              <li v-for="s in g.items" :key="s.t">
                <a :href="`#hw-s-${s.i + 1}`" class="hw__ix" :class="{ 'is-on': s.i === active }" :aria-current="s.i === active ? 'step' : undefined" @click="jump($event, s.i)">{{ s.t }}</a>
              </li>
            </ol>
          </nav>
          <div class="hw__meter" aria-hidden="true">
            <span class="hw__count">{{ words[active] }} of nine</span>
            <span class="hw__railbox"><span ref="rail" class="hw__rail" /></span>
          </div>
        </div>
      </div>

      <div class="hw__main">
        <!-- phones / tablets: a slim bar that sticks above the stack (space reserved in SSR) -->
        <div class="hw__bar" aria-hidden="true">
          <span class="hw__bar-ph">{{ phases[activePhase]!.title }}</span>
          <span class="hw__count">{{ words[active] }} of nine</span>
          <span class="hw__railbox"><span ref="rail2" class="hw__rail" /></span>
        </div>
        <ol ref="stack" class="hw__stack">
          <li
            v-for="(s, i) in steps" :id="`hw-s-${i + 1}`" :key="s.t" class="hw-step" :class="[`hw-step--${tones[i]}`, { 'hw-step--pic': i === DAY }]"
            :style="{ '--i': i }" tabindex="-1"
          >
            <div class="hw-step__words">
              <p class="hw-step__phase">{{ phases[s.p]!.title }}</p>
              <h3 class="display-m hw-step__t">{{ s.t }}</h3>
              <p class="statement hw-step__d">{{ s.d }}</p>
            </div>
            <span class="hw-step__n" aria-hidden="true">{{ i + 1 }}</span>
            <!-- the day itself gets the one picture: a crêpe on the griddle we bring -->
            <FoundPhoto v-if="i === DAY" class="hw-step__pic" :photo="credits.griddle" credit="over" sizes="lp:420px" alt="A thin crêpe cooking on a round cast-iron griddle" />
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hw {
  --lip: 12px;
  --hdr-full: 56px; --hdr: var(--hdr-full);
  --bar: 0px;
  --top: calc(var(--hdr) + var(--bar) + 12px);
  --bh: clamp(232px, 30svh, 300px);
  background: var(--ground); color: var(--ink); padding-block: var(--space-section);
}
@media (min-width: 1100px) { .hw { --hdr-full: 76px; } }
.hw__grid { display: grid; gap: var(--space-head); }
.hw__side, .hw__main { min-width: 0; }

/* ── boards: flat panels, square corners; the brown rule on the top edge is the lip that stays visible in the stack ── */
.hw__stack { list-style: none; margin: 0; padding: 0; }
.hw-step {
  position: relative; overflow: clip; display: grid; grid-template-columns: minmax(0, 1fr) auto; column-gap: 16px; align-items: start;
  min-height: var(--bh); padding: clamp(20px, 2.4vw, 32px) clamp(20px, 3vw, 44px) clamp(22px, 2.6vw, 34px);
  border-top: 2px solid var(--ink); scroll-margin-top: calc(var(--top) + var(--i) * var(--lip));
}
.hw-step:focus { outline: none; }
.hw-step:focus-visible { outline: 3px solid var(--ink); outline-offset: -3px; }
.hw-step--yellow { background: var(--field); color: var(--ink); --n: var(--accent); }
.hw-step--deep { background: var(--surface); color: var(--ink); --n: var(--accent); }
.hw-step--apricot { background: var(--accent); color: var(--ink-deep); --n: var(--field); }
.hw-step__words { display: grid; gap: clamp(8px, 1vw, 14px); align-content: start; min-width: 0; }
.hw-step__phase { font-weight: 600; font-size: 0.9375rem; line-height: 1.3; }
.hw-step__t { margin-top: clamp(6px, 1.4svh, 18px); max-width: 16ch; text-wrap: balance; font-size: clamp(1.75rem, 1rem + 3 * var(--vw), 3.75rem); line-height: 0.95; letter-spacing: var(--track-l); }
.hw-step__d { font-size: clamp(1.25rem, 1rem + 1.2 * var(--vw), 2.125rem); line-height: 1.25; max-width: 30ch; }
/* the step's number, painted large in the top corner like the number on a lido board (the list is an <ol>) */
.hw-step__n {
  grid-column: 2; grid-row: 1; margin-top: -0.06em;
  font: 700 clamp(4.25rem, 2.5rem + 6 * var(--vw), 9rem)/0.8 var(--font-display); letter-spacing: -0.04em; color: var(--n);
  font-variant-numeric: tabular-nums; user-select: none; pointer-events: none;
}
/* Event day: the picture fills the board's right third, full height; the number sits beside it */
.hw-step__pic { display: none; }
@media (min-width: 700px) {
  .hw-step--pic { grid-template-columns: minmax(0, 1fr) auto minmax(0, 0.62fr); padding-right: 0; padding-block-end: 0; }
  .hw-step--pic .hw-step__words { padding-bottom: clamp(22px, 2.6vw, 34px); }
  .hw-step__pic { display: block; grid-column: 3; grid-row: 1; align-self: stretch; margin-top: calc(-1 * clamp(20px, 2.4vw, 32px)); min-height: calc(var(--bh) - 2px); }
  .hw-step__pic :deep(.found__frame) { position: absolute; inset: 0; }
  .hw-step__pic { position: relative; }
}

/* ── index (desktop): heavy caps fitted to the column, active in full ink with an apricot dot ── */
.hw__index { display: none; }
.hw__group { list-style: none; margin: 0; padding: 0; display: grid; gap: 0; }
.hw__group + .hw__group { margin-top: clamp(12px, 1.6svh, 20px); }
.hw__ix {
  position: relative; display: block; width: fit-content; padding: 3px 0; text-decoration: none; white-space: nowrap;
  font: 500 min(var(--display-m), calc(100cqi / (17 * var(--cap-w)))) / 1.02 var(--font-display); text-transform: uppercase; letter-spacing: var(--track-m);
  color: var(--ink-muted); transition: color 240ms var(--ease-out), transform 240ms var(--ease-out); touch-action: manipulation;
}
.hw__ix::before { content: ""; position: absolute; left: -2px; top: 50%; width: 9px; height: 9px; margin-top: -4.5px; border-radius: 50%; background: var(--accent); transform: scale(0); transition: transform 240ms var(--ease-out); }
.hw__ix.is-on { color: var(--ink); font-weight: 700; transform: translateX(20px); }
.hw__ix.is-on::before { transform: translateX(-20px) scale(1); }
.hw__ix:active { transform: translateX(10px) scale(0.98); }
@media (hover: hover) and (pointer: fine) { .hw__ix:hover { color: var(--ink); } }
.hw__ix:focus-visible { outline-offset: 2px; }

.hw__meter { display: none; }
.hw__count { font-weight: 600; font-size: 0.9375rem; white-space: nowrap; }
.hw__railbox { display: block; height: 2px; background: color-mix(in srgb, var(--ink) 18%, transparent); overflow: hidden; }
.hw__rail { display: block; height: 100%; background: var(--ink); transform: scaleX(0); transform-origin: left center; }

/* ── pinned ── */
.is-pinned .hw-step { position: sticky; top: calc(var(--top) + var(--i) * var(--lip)); transition: top 300ms var(--ease-out); }
/* the last board holds for a moment before the stack leaves */
.is-pinned .hw__stack::after { content: ""; display: block; height: 20svh; }
.hw.is-pinned { padding-bottom: calc(var(--space-section) * 0.4); }

@media (max-width: 1023px) {
  .hw { --bar: 56px; --bh: clamp(232px, 31svh, 290px); }
  .hw__bar {
    display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; align-content: center; column-gap: 16px; row-gap: 8px;
    position: sticky; top: var(--hdr); z-index: 2; height: 56px; background: var(--ground); visibility: hidden; transition: top 300ms var(--ease-out);
  }
  .is-pinned .hw__bar { visibility: visible; }
  .hw__bar .hw__railbox { grid-column: 1 / -1; }
  .hw__bar .hw__count { min-width: 8.5em; text-align: right; } /* "Seven of nine" never pushes the phase name */
  .hw__bar-ph { font-weight: 700; font-size: 0.9375rem; line-height: 1.2; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  /* the bar already names the phase */
  .is-pinned .hw-step__phase { display: none; }
}
@media (min-width: 1024px) {
  .hw { --bar: 0px; }
  .hw__bar { display: none; }
  .hw__grid { grid-template-columns: minmax(0, 4fr) minmax(0, 8fr); column-gap: clamp(32px, 4vw, 72px); align-items: start; }
  .hw__side { align-self: stretch; }
  .hw__hold { display: grid; gap: var(--space-head); container-type: inline-size; }
  .hw__index { display: block; }
  .hw__meter { display: grid; gap: 12px; max-width: 22rem; }
}
/* the whole left column holds beside the stack whenever the screen is tall enough for it (motion or not) */
@media (min-width: 1024px) and (min-height: 700px) {
  .hw__hold { position: sticky; top: calc(var(--hdr) + 24px); transition: top 300ms var(--ease-out); }
}
</style>

<style>
/* Unscoped (unique class names): when the header slides away the stack's tops follow it. */
html:has(.head.is-hidden) .hw { --hdr: 0px; }
</style>
