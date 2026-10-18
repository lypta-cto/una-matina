<script setup lang="ts">
// Bloom Cart signature (events-v2-system.md §8): a pinned camera sequence through the flower-market photo (the hero's
// picture), in three close stops beside "Stems in season / Wrapped by the bunch / Picked by hand". The /crepes technique (CrpSequence.vue) on the shared usePinProgress: one image layer laid out at
// its largest size and only scaled down; the camera holds 40 % of each segment and travels on an ease-in-out, zoom
// interpolated in log space. Source 1600 × 1066, zoom ≤ 1.9, frame ≤ 672 px tall, so ≤ 1.2 CSS px per source px.
// The step titles are the index (heavy caps; active full ink with the sage half-sun, others muted; click = jump),
// "Two of three" + a rail follow progress, the step sentence rises through a mask. After the last stop the end line
// rises ("Décor, an activity and a favor, from one cart.") and the frame eases back 3 % as the section releases.
// SSR / no JS / reduced motion / screens < 520 px tall: a static list, one 4:5 still per step (CSS crops of the
// same file, so it is one download).
import { credits } from '~/data/credits'

const IW = 1600
const IH = 1066
const ZMAX = 1.9
const SRC = '/img/world/flower-market-buckets.jpg'

// crops [x, y, w, h] in source px, each 4:5; the camera frames each one (z = 1 is the full height). The hero above
// shows the whole stall, so the camera starts already in: the hellebores and white tulips (z 1.5) → the paper-wrapped tulips
// (z 1.9, framed above the wraps' printed vendor name) → the hyacinth stems (z 1.9). The words describe what is in
// the frame (a found market photo, not our cart); what we do stays in the sentence. Luka's own cart photos replace
// these stops when they exist.
const steps = [
  { title: 'Stems in season', text: 'We match the flowers to your palette and the time of year.', crop: [860, 120, 568, 710], alt: 'Pale green hellebores, white tulips and daisies on a flower stall' },
  { title: 'Wrapped by the bunch', text: "Paper, ribbon and mini vases on the cart, with signage in your event's name.", crop: [440, 30, 449, 561], alt: 'Bunches of pink tulips standing in white paper wraps' },
  { title: 'Picked by hand', text: 'Guests choose their stems, tie a small bouquet and take it home.', crop: [816, 505, 449, 561], alt: 'Bunches of hyacinth stems in cellophane, standing in a bucket' },
] as const
const N = steps.length
const words = ['One', 'Two', 'Three']
const ending = 'Décor, an activity and a favor, from one cart.'

// Run (svh of scroll): 2 × 70 for the camera, 40 for the end line, 30 for the release.
const RUN_STEPS = 140
const RUN_END = 40
const RUN_RELEASE = 30
const RUN = RUN_STEPS + RUN_END + RUN_RELEASE

const img = useImage()
const layerSrc = img(SRC, { width: 1600, format: 'webp', quality: 82 })
const stillSrc = img(SRC, { width: 1600, format: 'webp', quality: 80 })
// static still: the crop is laid out with percentages of the 4:5 frame (no measuring, works in SSR)
const stillStyle = (c: readonly number[]) => ({ width: `${(IW / c[2]!) * 100}%`, left: `${(-c[0]! / c[2]!) * 100}%`, top: `${(-c[1]! / c[3]!) * 100}%` })

const root = ref<HTMLElement | null>(null)
const frame = ref<HTMLElement | null>(null)
const layer = ref<HTMLImageElement | null>(null)
const stage = ref<HTMLElement | null>(null)
const rail = ref<HTMLElement | null>(null)
const { progress, enabled } = usePinProgress(root)
const pinned = ref(false)
const active = ref(0)
const ended = ref(false)

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))
const inOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)

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
  l.style.width = `${IW * base * ZMAX}px`
  l.style.height = `${IH * base * ZMAX}px`
}

function render(p: number) {
  const l = layer.value
  if (!l || !fw) return
  const pS = clamp(p * RUN / RUN_STEPS, 0, 1)
  const pE = clamp((p * RUN - RUN_STEPS) / RUN_END, 0, 1)
  const pR = clamp((p * RUN - RUN_STEPS - RUN_END) / RUN_RELEASE, 0, 1)
  const t = pS * (N - 1)
  const i = Math.min(N - 2, Math.floor(t))
  const f = inOut(clamp((t - i - 0.2) / 0.6, 0, 1))
  const a = cams[i]!
  const b = cams[i + 1]!
  const z = Math.exp(Math.log(a.z) + (Math.log(b.z) - Math.log(a.z)) * f)
  const cx = a.x + (b.x - a.x) * f
  const cy = a.y + (b.y - a.y) * f
  const s = base * z
  const tx = clamp(fw / 2 - cx * s, fw - IW * s, 0)
  const ty = clamp(fh / 2 - cy * s, fh - IH * s, 0)
  l.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0) scale(${(z / ZMAX).toFixed(4)})`
  if (stage.value) stage.value.style.setProperty('--rel', pR.toFixed(3))
  if (rail.value) rail.value.style.transform = `scaleX(${clamp(p * RUN / (RUN_STEPS + RUN_END), 0, 1).toFixed(4)})`
  active.value = Math.round(t)
  ended.value = pE > 0.6
}

// index buttons jump to their stop (smooth via Lenis when it runs, otherwise native)
const { $lenis } = useNuxtApp() as unknown as { $lenis: { scrollTo: (y: number, o?: object) => void } | null }
function go(i: number) {
  const el = root.value
  if (!el) return
  const run = el.offsetHeight - window.innerHeight
  const top = el.getBoundingClientRect().top + window.scrollY + run * (RUN_STEPS / RUN) * (i / (N - 1))
  if ($lenis) $lenis.scrollTo(top, { duration: 1.1 })
  else window.scrollTo({ top, behavior: 'smooth' })
}

const onResize = () => { measure(); render(progress.value) }
watch(progress, p => render(p))
watch(enabled, (on) => {
  pinned.value = on
  if (!on) return
  nextTick(() => { measure(); render(progress.value) })
}, { flush: 'post' })
onMounted(() => window.addEventListener('resize', onResize, { passive: true }))
onBeforeUnmount(() => window.removeEventListener('resize', onResize))
</script>

<template>
  <section id="bouquet" ref="root" class="bcs" :class="{ 'bcs--pin': pinned }" :style="{ '--run': `${RUN}svh` }" aria-labelledby="bouquet-title">
    <!-- Static version (SSR, no JS, reduced motion, short screens) -->
    <div v-if="!pinned" class="wrap bcs__static">
      <RiseText id="bouquet-title" :lines="['From bucket', 'to bouquet']" size="l" />
      <ol class="bcs__list">
        <li v-for="s in steps" :key="s.title" class="bcs__item">
          <div class="bcs__still"><img :src="stillSrc" :style="stillStyle(s.crop)" :width="IW" :height="IH" loading="lazy" decoding="async" :alt="s.alt"></div>
          <h3 class="bcs__name">{{ s.title }}</h3>
          <p class="bcs__text">{{ s.text }}</p>
        </li>
      </ol>
      <p class="statement bcs__end-static">{{ ending }}</p>
    </div>

    <!-- Pinned version -->
    <div v-else ref="stage" class="bcs__stage">
      <div class="wrap bcs__grid">
        <div ref="frame" class="bcs__frame">
          <img ref="layer" class="bcs__layer" :src="layerSrc" decoding="async" alt="Close views of a flower-market stall: white tulips and hellebores, pink tulips in paper wraps, hyacinth stems">
        </div>
        <div class="bcs__copy">
          <div class="bcs__head"><RiseText id="bouquet-title" :lines="['From bucket', 'to bouquet']" size="l" /></div>
          <ol class="bcs__index">
            <li v-for="(s, i) in steps" :key="s.title">
              <button type="button" class="bcs__idx" :class="{ 'is-on': i === active && !ended, 'is-past': i < active || ended }" :aria-current="i === active ? 'step' : undefined" @click="go(i)">{{ s.title }}</button>
            </li>
          </ol>
          <div class="bcs__meter" aria-hidden="true">
            <span class="bcs__count">{{ words[active] }} of three</span>
            <span class="bcs__railbox"><span ref="rail" class="bcs__rail" /></span>
          </div>
          <div class="bcs__lines" aria-live="off">
            <div v-for="(s, i) in steps" :key="s.title" class="bcs__mask" :class="{ 'is-on': i === active && !ended, 'is-past': i < active || ended }">
              <p class="bcs__lt"><span>{{ s.title }}</span></p>
              <p class="bcs__ll"><span>{{ s.text }}</span></p>
            </div>
            <div class="bcs__mask bcs__mask--end" :class="{ 'is-on': ended }">
              <p class="bcs__le"><span>{{ ending }}</span></p>
            </div>
          </div>
          <p class="bcs__credit">Photo: <a :href="credits.flowers.page" class="bcs__a" rel="noopener" target="_blank">{{ credits.flowers.creator }}<span class="sr-only"> (opens in a new tab)</span></a>, <a :href="credits.flowers.licenseUrl" class="bcs__a" rel="noopener license" target="_blank">{{ credits.flowers.license }}<span class="sr-only"> (opens in a new tab)</span></a></p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.bcs { background: var(--ground); color: var(--ink); }

/* ── Static list ── */
.bcs__static { padding-block: var(--space-section); display: grid; gap: var(--space-head); }
.bcs__list { list-style: none; margin: 0; padding: 0; display: grid; gap: clamp(36px, 4vw, 56px) clamp(24px, 3vw, 40px); }
.bcs__still { position: relative; overflow: hidden; aspect-ratio: 4 / 5; max-width: 480px; background: var(--surface); margin-bottom: 16px; }
.bcs__still img { position: absolute; max-width: none; height: auto; }
.bcs__name { font-weight: 700; font-size: var(--step-2); line-height: 1.1; letter-spacing: -0.01em; text-transform: none; }
.bcs__text { margin-top: 8px; font-size: var(--step-1); line-height: 1.45; max-width: 30ch; }
.bcs__end-static { max-width: 26ch; }
@media (min-width: 700px) { .bcs__list { grid-template-columns: repeat(3, minmax(0, 1fr)); } }

/* ── Pinned ── */
.bcs--pin { height: calc(100svh + var(--run)); }
.bcs__stage { position: sticky; top: 0; height: 100svh; overflow: hidden; }
/* phones: title, the frame filling its own row, then the meter and the step */
.bcs__grid { height: 100%; display: grid; grid-template-rows: auto minmax(0, 1fr) auto auto auto; gap: 14px; align-content: start; padding-top: max(72px, 9svh); padding-bottom: calc(18px + env(safe-area-inset-bottom)); }
.bcs__copy { display: contents; }
.bcs__head { order: -2; min-width: 0; }
.bcs__frame {
  order: -1; position: relative; overflow: hidden; background: var(--surface); min-height: 0;
  height: 100%; width: auto; max-width: 100%; max-height: 560px; aspect-ratio: 4 / 5; justify-self: start;
  transform: scale(calc(1 - var(--rel, 0) * 0.03)); transform-origin: 50% 0;
}
.bcs__layer { position: absolute; left: 0; top: 0; max-width: none; transform-origin: 0 0; will-change: transform; user-select: none; pointer-events: none; }
.bcs__index { display: none; }
.bcs__meter { display: flex; align-items: center; gap: 14px; }
.bcs__count { font-weight: 600; font-size: 0.9375rem; flex: none; }
.bcs__railbox { flex: 1; height: 2px; background: color-mix(in srgb, var(--ink) 18%, transparent); overflow: hidden; }
.bcs__rail { display: block; height: 100%; background: var(--ink); transform: scaleX(0); transform-origin: left center; }
.bcs__credit { font-size: 0.8125rem; line-height: 1.4; color: var(--ink-muted); }
.bcs__a { color: inherit; text-decoration: underline 1px; text-underline-offset: 3px; text-decoration-color: color-mix(in srgb, currentColor 45%, transparent); }
@media (hover: hover) and (pointer: fine) { .bcs__a:hover { text-decoration-color: currentColor; } }

/* step text through a mask: the outgoing line leaves upward, the incoming one rises in */
.bcs__lines { display: grid; min-height: 5.6rem; }
.bcs__mask { grid-area: 1 / 1; visibility: hidden; transition: visibility 0s linear 260ms; }
.bcs__mask.is-on { visibility: visible; transition-delay: 0s; }
.bcs__lt, .bcs__ll, .bcs__le { overflow: hidden; padding-bottom: 0.08em; }
.bcs__lt span, .bcs__ll span, .bcs__le span { display: block; transform: translateY(105%); transition: transform 240ms var(--ease-in-out); }
.bcs__mask.is-past :is(.bcs__lt, .bcs__ll) span { transform: translateY(-105%); }
.bcs__mask.is-on :is(.bcs__lt, .bcs__ll, .bcs__le) span { transform: none; transition: transform 560ms var(--ease-out) 120ms; }
.bcs__mask.is-on .bcs__ll span { transition-delay: 180ms; }
.bcs__lt { font-weight: 700; font-size: var(--step-2); line-height: 1.15; letter-spacing: -0.01em; }
.bcs__ll { margin-top: 6px; font-size: 1.0625rem; line-height: 1.45; max-width: 34ch; }
.bcs__le { font-family: var(--font-accent); font-style: italic; font-size: var(--step-1); line-height: 1.3; max-width: 26ch; }

@media (min-width: 600px) and (max-width: 899px) { .bcs__frame { max-height: min(640px, 62svh); } }
@media (min-width: 900px) {
  /* the frame on the left (≤ 672 px tall: 1.2 CSS px per source px at zoom 1.9), the copy on the right */
  .bcs__grid {
    grid-template-rows: none; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); align-content: center; align-items: center;
    column-gap: clamp(40px, 6vw, 112px); padding-block: 0;
  }
  .bcs__frame { order: 0; justify-self: start; height: auto; max-height: none; width: min(100%, 538px, calc(min(76svh, 672px) * 0.8)); transform-origin: 50% 50%; }
  .bcs__copy { display: grid; gap: clamp(18px, 3svh, 32px); align-content: center; padding-top: 48px; }
  .bcs__head { order: 0; }
  .bcs__index { display: grid; container-type: inline-size; list-style: none; margin: 0; padding: 0; gap: 4px; }
  .bcs__idx {
    position: relative; display: block; width: 100%; border: 0; background: none; padding: 6px 0 6px 0; text-align: left; cursor: pointer;
    font: 700 min(var(--display-m), calc(100cqi / (21 * var(--cap-w)))) / 1 var(--font-display); letter-spacing: var(--track-m); text-transform: uppercase;
    color: color-mix(in srgb, var(--ink) 62%, var(--ground)); min-height: 44px;
    transition: color 320ms var(--ease-out), transform 420ms var(--ease-out); touch-action: manipulation; user-select: none;
  }
  /* the sage half-sun marks the stop the camera is on */
  .bcs__idx::before {
    content: ""; position: absolute; left: 0; top: 50%; width: 0.9em; height: 0.45em; margin-top: -0.28em; border-radius: 999px 999px 0 0;
    background: var(--field-2); transform: scale(0); transform-origin: 50% 100%; transition: transform 420ms var(--ease-out);
  }
  .bcs__idx.is-on { color: var(--ink); transform: translateX(1.15em); }
  .bcs__idx.is-on::before { transform: translateX(-1.15em) scale(1); }
  .bcs__idx.is-past { color: color-mix(in srgb, var(--ink) 76%, var(--ground)); }
  .bcs__idx:active { transform: translateX(0.6em) scale(0.985); }
  .bcs__lt { display: none; }
  .bcs__ll { font-size: var(--step-1); }
  .bcs__lines { min-height: 4.6rem; }
}
@media (hover: hover) and (pointer: fine) { .bcs__idx:hover { color: var(--ink); } }
</style>
