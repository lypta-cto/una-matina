<script setup lang="ts">
// "Made in front of you": a pinned scroll sequence (section-library §3.1).
// One 4:5 frame (≤ 480 CSS px) stays put; a camera pans and zooms through Luka's picture in five framings
// (≤ 1.2 CSS px per source px, zoom ≤ 1.9), the step titles form an index (active full ink, others 35 %),
// a "02 / 05" counter and a rail follow progress, the step line rises through a mask. The run ends by
// wiping the frame to an apricot field with the cone mark: "At the market it leaves in a paper cone."
// Progress is read from the section's rect in one rAF per window scroll event, so it follows native touch
// scroll and Lenis (which moves the real window scroll). Reduced motion / no JS: the SSR markup, a list of
// the steps with a still crop each and the cone card last.

const IW = 1672
const IH = 941
const ZMAX = 1.9

// Crops (x, y, w, h) in source px of the 1672×941 picture; the camera frames each crop.
const steps = [
  { title: 'Made when you order', text: 'Nothing waits under a lamp. Every crêpe is cooked when you ask for it.', still: 'counter', alt: 'A cook setting down a plate of folded crêpes while syrup is poured over them', crop: [500, 0, 752, 940] },
  { title: 'Folded while it is soft', text: 'Thin enough to fold in four without a crack.', still: 'folds', alt: 'The layered golden edges of folded crêpes dusted with sugar', crop: [640, 441, 400, 500] },
  { title: 'Filled the way you like', text: 'Sweet or savory, straight from the menu or your own mix.', still: 'topping', alt: 'Whipped cream, strawberries and blackberries on top of the crêpes', crop: [890, 400, 400, 500] },
  { title: 'A last drizzle', text: 'Finished on top while it is still hot.', still: 'pour', alt: 'Syrup pouring in a thin stream from a small steel jug', crop: [905, 40, 400, 500] },
  { title: 'Into your hands, warm', text: 'Handed over the moment it is ready.', still: 'handed', alt: 'A hand setting a plate of crêpes down on a wooden counter', crop: [380, 380, 400, 500] },
] as const
const N = steps.length
const words = ['One', 'Two', 'Three', 'Four', 'Five', 'Six']

// Run (in svh of scroll): 4 × 70 for the camera, 60 for the cone finale, 30 for the release.
const RUN_STEPS = 280
const RUN_FINALE = 60
const RUN_RELEASE = 30
const RUN = RUN_STEPS + RUN_FINALE + RUN_RELEASE

const root = ref<HTMLElement | null>(null)
const frame = ref<HTMLElement | null>(null)
const layer = ref<HTMLImageElement | null>(null)
const finale = ref<HTMLElement | null>(null)
const stage = ref<HTMLElement | null>(null)
const rail = ref<HTMLElement | null>(null)
const pinned = ref(false)
const active = ref(0)
const ended = ref(false)
const layerSrc = ref('/img/crepes/hero-ai-1920.webp')
// Phones pin the sequence, so the SSR list's stills are never seen there: the server sends a 1×1 source for
// small screens (no download). When the static list is what the visitor gets, the real stills are restored.
const stillsEverywhere = ref(false)

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))
const inOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)

let raf = 0
let base = 1
let fw = 0
let fh = 0
const cams = steps.map(() => ({ x: 0, y: 0, z: 1 }))

function measure() {
  const f = frame.value
  const l = layer.value
  if (!f || !l) return
  fw = f.clientWidth
  fh = f.clientHeight
  base = Math.max(fw / IW, fh / IH)
  steps.forEach((s, i) => {
    const [x, y, w, h] = s.crop
    cams[i] = { x: x + w / 2, y: y + h / 2, z: clamp(Math.max(fw / (w * base), fh / (h * base)), 1, ZMAX) }
  })
  // Laid out at the largest size it will show, then only scaled down.
  l.style.width = `${IW * base * ZMAX}px`
  l.style.height = `${IH * base * ZMAX}px`
}

function render() {
  raf = 0
  const el = root.value
  const l = layer.value
  if (!el || !l) return
  const r = el.getBoundingClientRect()
  const run = el.offsetHeight - window.innerHeight
  const p = run > 0 ? clamp(-r.top / run, 0, 1) : 0
  const pS = clamp(p * RUN / RUN_STEPS, 0, 1)
  const pF = clamp((p * RUN - RUN_STEPS) / RUN_FINALE, 0, 1)
  const pR = clamp((p * RUN - RUN_STEPS - RUN_FINALE) / RUN_RELEASE, 0, 1)

  const t = pS * (N - 1)
  const i = Math.min(N - 2, Math.floor(t))
  const f = inOut(clamp((t - i - 0.2) / 0.6, 0, 1)) // hold 40 % of each segment
  const a = cams[i]!
  const b = cams[i + 1]!
  const z = Math.exp(Math.log(a.z) + (Math.log(b.z) - Math.log(a.z)) * f)
  const cx = a.x + (b.x - a.x) * f
  const cy = a.y + (b.y - a.y) * f
  const s = base * z
  const tx = clamp(fw / 2 - cx * s, fw - IW * s, 0)
  const ty = clamp(fh / 2 - cy * s, fh - IH * s, 0)
  l.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0) scale(${(z / ZMAX).toFixed(4)})`

  // Once the wipe is complete, drop the clip and hide the photo under it (no anti-aliased seam).
  l.style.visibility = pF >= 0.999 ? 'hidden' : ''
  if (finale.value) { finale.value.style.clipPath = pF >= 0.999 ? 'none' : `inset(0 0 0 ${((1 - inOut(pF)) * 100).toFixed(2)}%)`; finale.value.style.visibility = pF > 0 ? 'visible' : 'hidden'; finale.value.classList.toggle('is-done', pF > 0.97) }
  if (stage.value) stage.value.style.setProperty('--rel', pR.toFixed(3))
  if (rail.value) rail.value.style.transform = `scaleX(${clamp(p * RUN / (RUN_STEPS + RUN_FINALE), 0, 1).toFixed(4)})`
  active.value = Math.round(t)
  ended.value = pF > 0.5
}
const schedule = () => { if (!raf) raf = requestAnimationFrame(render) }
const onResize = () => { measure(); schedule() }

// Index buttons jump to their step (smooth via Lenis when it runs, otherwise native).
const { $lenis } = useNuxtApp() as unknown as { $lenis: { scrollTo: (y: number, o?: object) => void } | null }
function go(i: number) {
  const el = root.value
  if (!el) return
  const run = el.offsetHeight - window.innerHeight
  const top = el.getBoundingClientRect().top + window.scrollY + run * (RUN_STEPS / RUN) * (i / (N - 1))
  if ($lenis) $lenis.scrollTo(top, { duration: 1.1 })
  else window.scrollTo({ top, behavior: 'smooth' })
}

onMounted(() => {
  // Reduced motion, or a screen too short for a pinned stage (landscape phones): the static list.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.innerHeight < 520) { stillsEverywhere.value = true; return }
  // The 2× Lanczos source only where the frame is large enough to need it (desktop, fine pointer).
  if (window.matchMedia('(min-width: 600px)').matches) layerSrc.value = '/img/crepes/seq-source-3344.webp'
  pinned.value = true
  nextTick(() => {
    measure()
    render()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })
  })
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', schedule)
  window.removeEventListener('resize', onResize)
  if (raf) cancelAnimationFrame(raf)
})
</script>

<template>
  <section id="made" ref="root" class="seq" :class="{ 'seq--pin': pinned }" :style="{ '--run': `${RUN}svh` }" aria-labelledby="made-title">
    <!-- Static version (SSR, no JS, reduced motion) -->
    <div v-if="!pinned" class="wrap seq__static">
      <h2 id="made-title" class="sign-l seq__title">Made in front of you</h2>
      <ol class="seq__list">
        <li v-for="s in steps" :key="s.title" class="seq__item">
          <picture><source v-if="!stillsEverywhere" media="(max-width: 899px)" srcset="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="><img :src="`/img/crepes/step-${s.still}-600.webp`" width="600" height="750" loading="lazy" decoding="async" :alt="s.alt"></picture>
          <p class="seq__name">{{ s.title }}</p>
          <p class="seq__text">{{ s.text }}</p>
        </li>
        <li class="seq__item seq__item--cone">
          <div class="seq__conecard"><CrpConeMark class="seq__cone" /></div>
          <p class="seq__name">At the market it leaves in a paper cone.</p>
        </li>
      </ol>
    </div>

    <!-- Pinned version -->
    <div v-else ref="stage" class="seq__stage">
      <div class="seq__grid wrap">
        <div class="seq__copy">
          <h2 id="made-title" class="sign-l seq__title">Made in front of you</h2>
          <ol class="seq__index">
            <li v-for="(s, i) in steps" :key="s.title">
              <button type="button" class="seq__idx" :class="{ 'is-on': i === active }" :aria-current="i === active ? 'step' : undefined" @click="go(i)">{{ s.title }}</button>
            </li>
          </ol>
          <div class="seq__meter">
            <span class="seq__count" aria-hidden="true">{{ words[active] }} of {{ words[N - 1]!.toLowerCase() }}</span>
            <span class="seq__railbox" aria-hidden="true"><span ref="rail" class="seq__rail" /></span>
          </div>
          <div class="seq__lines">
            <div v-for="(s, i) in steps" :key="s.title" class="seq__mask" :class="{ 'is-on': i === active && !ended, 'is-past': i < active || ended }">
              <p class="seq__lt"><span>{{ s.title }}</span></p>
              <p class="seq__ll"><span>{{ s.text }}</span></p>
            </div>
            <div class="seq__mask seq__mask--end" :class="{ 'is-on': ended }">
              <p class="seq__lt"><span>Then it is yours.</span></p>
              <p class="seq__ll"><span>Enjoy it on the walk around the market.</span></p>
            </div>
          </div>
        </div>
        <div ref="frame" class="seq__frame">
          <img ref="layer" class="seq__layer" :src="layerSrc" decoding="async" alt="Folded crêpes with berries and cream on a café counter, syrup being poured">
          <div ref="finale" class="seq__finale" aria-hidden="true">
            <CrpConeMark class="seq__cone" />
            <p class="seq__finale-line">At the market it leaves in a paper cone.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.seq { background: var(--ground); color: var(--ink); scroll-margin-top: 0; }
.seq__title { font-weight: 600; letter-spacing: -0.01em; }

/* Static list */
.seq__static { padding-block: var(--section); display: grid; gap: clamp(28px, 4vw, 48px); }
.seq__list { list-style: none; margin: 0; padding: 0; display: grid; gap: clamp(36px, 4vw, 56px) clamp(24px, 3vw, 40px); }
.seq__item img, .seq__conecard { display: block; width: 100%; max-width: 480px; aspect-ratio: 4 / 5; object-fit: cover; margin-bottom: 14px; }
.seq__conecard { background: var(--accent); display: grid; place-items: center; color: var(--ink-deep); }
.seq__conecard .seq__cone { width: 46%; }
.seq__name { font-weight: 700; font-size: var(--step-2); line-height: 1.15; letter-spacing: -0.01em; max-width: 18ch; }
.seq__text { margin-top: 8px; font-size: var(--step-1); line-height: 1.45; max-width: 32ch; }
@media (min-width: 700px) { .seq__list { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (min-width: 1100px) { .seq__list { grid-template-columns: repeat(3, minmax(0, 1fr)); } }

/* Pinned */
.seq--pin { height: calc(100svh + var(--run)); }
.seq__stage { position: sticky; top: 0; height: 100svh; overflow: hidden; }
.seq__grid { height: 100%; display: grid; grid-template-rows: auto minmax(0, 1fr); align-content: start; gap: 16px; padding-top: max(76px, 9svh); padding-bottom: calc(16px + env(safe-area-inset-bottom)); }
.seq__copy { display: contents; }
.seq__title { order: -2; font-size: min(var(--step-3), 8.6vw); }
.seq__index { display: none; }
.seq__frame {
  order: -1; position: relative; overflow: hidden; background: var(--field-dark);
  /* Phones: the frame fills its own grid row (never the text's), 4:5 inside it. */
  height: 100%; width: auto; max-width: 100%; max-height: 520px; aspect-ratio: 4 / 5; justify-self: start; min-height: 0;
  transform: scale(calc(1 - var(--rel, 0) * 0.04)); transform-origin: 50% 0;
}
.seq__layer { position: absolute; left: 0; top: 0; max-width: none; transform-origin: 0 0; will-change: transform; user-select: none; pointer-events: none; }
.seq__finale {
  position: absolute; inset: -1px; background: var(--accent); color: var(--ink-deep);
  display: grid; place-content: center; justify-items: center; gap: 20px; padding: 24px; text-align: center;
  clip-path: inset(0 0 0 100%); visibility: hidden;
}
.seq__finale .seq__cone { width: min(46%, 200px); }
.seq__finale-line { opacity: 0; transform: translateY(10px); transition: opacity 360ms var(--ease-out), transform 520ms var(--ease-out); }
.seq__finale:not(.is-done) .seq__finale-line { visibility: hidden; }
.seq__finale.is-done .seq__finale-line { opacity: 1; transform: none; }
.seq__finale-line { font-family: var(--font-accent); font-style: italic; font-size: var(--step-1); line-height: 1.3; max-width: 16ch; }
.seq__meter { display: flex; align-items: center; gap: 14px; }
.seq__count { font-weight: 600; font-size: 0.9375rem; flex: none; }
.seq__railbox { flex: 1; height: 2px; background: color-mix(in srgb, var(--ink) 18%, transparent); overflow: hidden; }
.seq__rail { display: block; height: 100%; background: var(--ink); transform: scaleX(0); transform-origin: left center; }

/* Step text through a mask: the outgoing line leaves upward, the incoming one rises in. */
.seq__lines { display: grid; min-height: 6.4rem; }
.seq__mask { grid-area: 1 / 1; visibility: hidden; transition: visibility 0s linear 260ms; }
.seq__mask.is-on { visibility: visible; transition-delay: 0s; }
.seq__lt, .seq__ll { overflow: hidden; padding-bottom: 0.08em; }
.seq__lt span, .seq__ll span { display: block; transform: translateY(105%); transition: transform 240ms var(--ease-in-out); }
.seq__mask.is-past .seq__lt span, .seq__mask.is-past .seq__ll span { transform: translateY(-105%); }
.seq__mask.is-on .seq__lt span, .seq__mask.is-on .seq__ll span { transform: none; transition: transform 560ms var(--ease-out) 120ms; }
.seq__mask.is-on .seq__ll span { transition-delay: 180ms; }
.seq__lt { font-weight: 700; font-size: var(--step-2); line-height: 1.15; letter-spacing: -0.01em; }
.seq__ll { margin-top: 6px; font-size: 1.0625rem; line-height: 1.45; max-width: 34ch; }

@media (min-width: 600px) and (max-width: 899px) { .seq__frame { max-height: min(680px, 66svh); } }
@media (min-width: 900px) {
  .seq__grid { grid-template-rows: none; grid-template-columns: minmax(0, 6fr) minmax(0, 5fr); align-content: center; align-items: center; gap: clamp(32px, 5vw, 96px); padding-block: 0; }
  .seq__copy { display: grid; gap: clamp(20px, 3.4svh, 36px); align-content: center; }
  .seq__title { order: 0; font-size: min(var(--step-4), 4.6vw, 4.75rem); }
  .seq__index { display: grid; list-style: none; margin: 0; padding: 0; gap: 2px; }
  .seq__idx {
    border: 0; background: none; padding: 6px 0; text-align: left; cursor: pointer; color: var(--ink);
    font: 700 clamp(1.25rem, 0.9rem + 1vw, 1.875rem)/1.15 var(--font-display); letter-spacing: -0.01em;
    color: var(--ink-muted); font-weight: 500; transition: color 240ms var(--ease-out), transform 240ms var(--ease-out); touch-action: manipulation; user-select: none;
    position: relative;
  }
  .seq__idx::before { content: ""; position: absolute; left: -2px; top: 50%; width: 6px; height: 6px; margin-top: -3px; border-radius: 50%; background: var(--accent); transform: scale(0); transition: transform 240ms var(--ease-out); }
  .seq__idx.is-on { color: var(--ink); font-weight: 700; transform: translateX(16px); }
  .seq__idx.is-on::before { transform: translateX(-16px) scale(1); }
  .seq__idx:active { transform: translateX(10px) scale(0.98); }
  .seq__lt { display: none; }
  .seq__mask--end .seq__lt { display: block; font-size: var(--step-2); margin-bottom: 6px; }
  .seq__ll { font-size: var(--step-1); }
  .seq__lines { min-height: 4.4rem; }
  .seq__frame { order: 0; justify-self: end; height: auto; max-height: none; width: min(100%, 480px, calc(76svh * 0.8)); transform-origin: 50% 50%; }
}
@media (hover: hover) and (pointer: fine) { .seq__idx:hover { color: var(--ink); } }
</style>
