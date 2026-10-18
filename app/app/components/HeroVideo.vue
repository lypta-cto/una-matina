<script setup lang="ts">
// Home's first field: a muted loop under the valance, with the headline on a cream board overlapping its bottom edge.
// Video bytes load only after JS has checked reduced motion and Save-Data; SSR / no-JS / fallback = poster still.
// Playback has one rule (sync): loaded, not paused by the visitor, on screen and tab visible.
// The video fades in once on its first frame and never fades back: Pause freezes the frame.
interface Src { src: string, type: string }
const props = withDefaults(defineProps<{
  poster: string
  posterMobile?: string
  sources?: Src[]
  sourcesMobile?: Src[]
  sourcesLarge?: Src[]
  posterLarge?: string
  position?: string
  positionMobile?: string
  credit: { creator: string, href: string, license: string, licenseUrl: string }
  still?: boolean
  labelledby?: string
}>(), { position: '50% 60%', positionMobile: '75% 50%', still: false, posterMobile: '', posterLarge: '', labelledby: '' })

const video = ref<HTMLVideoElement>()
const mode = ref<'still' | 'video'>('still')
const playing = ref(false)
const ready = ref(false)
const loaded = ref(false)
const userPaused = ref(false)
let io: IntersectionObserver | undefined
let inView = true

function pick() {
  const small = matchMedia('(max-width: 767px)').matches
  const large = matchMedia('(min-width: 1200px)').matches || (devicePixelRatio > 1.5 && matchMedia('(min-width: 768px)').matches)
  if (small && props.sourcesMobile?.length) return props.sourcesMobile
  if (large && props.sourcesLarge?.length) return props.sourcesLarge
  return props.sources ?? []
}
const shouldPlay = () => loaded.value && !userPaused.value && inView && !document.hidden
function sync() {
  const v = video.value
  if (!v || !loaded.value) return
  if (shouldPlay()) v.play().catch(() => { userPaused.value = true })
  else v.pause()
}
function fail() { mode.value = 'still'; loaded.value = false } // 404 / unsupported: poster only, no dead button
function watchPlayback() {
  if (io || !video.value) return
  io = new IntersectionObserver(([e]) => { inView = !!e?.isIntersecting; sync() }, { threshold: 0.1 })
  io.observe(video.value)
  document.addEventListener('visibilitychange', sync)
}
function load() {
  const v = video.value
  if (!v) return
  v.muted = true
  v.defaultMuted = true
  v.setAttribute('muted', '')
  const els = pick().map(s => Object.assign(document.createElement('source'), s))
  els.at(-1)?.addEventListener('error', fail) // <source> errors don't bubble; the last one failing means none played
  v.replaceChildren(...els)
  v.load()
  loaded.value = true
  watchPlayback()
  sync()
}
function toggle() {
  if (!loaded.value) { userPaused.value = false; load(); return }
  userPaused.value = playing.value
  sync()
}
function onPlaying() { playing.value = true; ready.value = true }
onMounted(async () => {
  if (props.still || !props.sources?.length) return
  mode.value = 'video'
  await nextTick()
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  const c = (navigator as Navigator & { connection?: { saveData?: boolean, effectiveType?: string } }).connection
  const lowData = !!c?.saveData || ['slow-2g', '2g'].includes(c?.effectiveType ?? '')
  if (reduce || lowData) { userPaused.value = true; return }
  load()
})
onBeforeUnmount(() => { io?.disconnect(); document.removeEventListener('visibilitychange', sync) })
</script>

<template>
  <section class="hv" :class="{ 'is-ready': ready, 'is-static': still }" :style="{ '--pos': position, '--pos-m': positionMobile }" :aria-labelledby="labelledby || undefined">
    <div class="hv__media">
      <!-- the footage drifts a little slower than the page (v-parallax, fine pointers); scaled 1.08 so no edge ever shows -->
      <div v-parallax="0.035" class="hv__px">
        <picture>
          <source v-if="posterMobile" :srcset="posterMobile" media="(max-width: 767px)">
          <source v-if="posterLarge" :srcset="posterLarge" media="(min-width: 1200px)">
          <img class="hv__poster" :src="poster" alt="" fetchpriority="high" width="1600" height="900">
        </picture>
        <video v-if="mode === 'video'" ref="video" class="hv__video" muted playsinline loop preload="none" disablepictureinpicture disableremoteplayback aria-hidden="true" tabindex="-1" @playing="onPlaying" @pause="playing = false" @error="fail" />
      </div>
    </div>
    <div class="hv__board"><slot /></div>
    <!-- after the board in the DOM, so the first Tab reaches the headline's primary action before the video control;
         visually it still sits on the footage (grid row 1) -->
    <button v-if="mode === 'video'" type="button" class="hv__toggle" :aria-label="playing ? 'Pause background video' : 'Play background video'" @click="toggle">
      <span class="hv__icon" :class="playing ? 'is-pause' : 'is-play'" aria-hidden="true" />{{ playing ? 'Pause' : 'Play' }}
    </button>

    <p class="hv__credit">Video: <a :href="credit.href" class="hv__a" rel="noopener" target="_blank">{{ credit.creator }}<span class="sr-only"> (opens in a new tab)</span></a>, <a :href="credit.licenseUrl" class="hv__a" rel="noopener license" target="_blank">{{ credit.license }}<span class="sr-only"> (opens in a new tab)</span></a></p>
  </section>
</template>

<style scoped>
.hv { display: grid; grid-template-columns: var(--gutter) minmax(0, 1fr) var(--gutter); grid-template-rows: auto auto auto; background: var(--ground); }
.hv__media { grid-column: 1 / -1; grid-row: 1; position: relative; overflow: hidden; background: var(--surface); height: clamp(260px, 46svh, 420px); }
.hv__px { position: absolute; inset: 0; transform: translate3d(0, var(--py, 0px), 0) scale(1.08); animation: hv-px-settle 1400ms var(--ease-out) backwards; }
/* the footage settles into the frame on load (curbside / peel hero settle, 1.14 → 1.08 here because the layer is
   pre-scaled for the parallax); backwards fill only, so the parallax transform owns it afterwards */
@keyframes hv-px-settle { from { transform: translate3d(0, 0, 0) scale(1.14); } }
.hv__poster, .hv__video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: var(--pos-m); }
/* first frame only: fades in over the matching poster and stays (pause = frozen frame, never the poster again) */
.hv__video { opacity: 0; transition: opacity var(--dur-slow) var(--ease-out); }
.is-ready .hv__video { opacity: 1; }
/* still mode only (no clip at all): a slow 1.04 settle that ends, so nothing loops without a pause control */
.is-static .hv__poster { animation: hv-settle 5s var(--ease-out) both; }
@keyframes hv-settle { from { transform: scale(1.04); } }
.hv__toggle {
  grid-column: 1 / -1; grid-row: 1; justify-self: end; align-self: start; margin: 20px 16px 0 0; position: relative; z-index: 1;
  display: inline-flex; align-items: center; gap: 8px; min-width: 44px; min-height: 44px; padding: 0 14px;
  background: var(--ground); color: var(--ink); border: 0; font: 600 0.9375rem var(--font-text); cursor: pointer; touch-action: manipulation;
  transition: background-color var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out);
}
.hv__toggle:active { transform: translateY(1px); background: var(--field); }
@media (hover: hover) and (pointer: fine) { .hv__toggle:hover { background: var(--field); } }
/* drawn glyphs (no icon font): two bars ↔ a triangle */
.hv__icon { position: relative; width: 10px; height: 12px; flex: none; }
.hv__icon.is-pause { border-inline: 3px solid currentColor; }
.hv__icon.is-play { clip-path: polygon(0 0, 100% 50%, 0 100%); background: currentColor; }

.hv__board {
  grid-column: 2; grid-row: 2; margin-top: -48px; position: relative; background: var(--ground); color: var(--ink);
  padding: 20px; animation: hv-board var(--dur-slow) var(--ease-out) 80ms both;
}
@keyframes hv-board { from { transform: translateY(24px); } }
.hv__credit { grid-column: 2; grid-row: 3; padding: 8px 20px 0; font-size: 0.8125rem; line-height: 1.4; color: var(--ink-muted); }
.hv__a { color: inherit; text-decoration: underline 1px; text-underline-offset: 3px; text-decoration-color: color-mix(in srgb, currentColor 45%, transparent); transition: text-decoration-color var(--dur-fast) var(--ease-out); }
.hv__a:focus-visible { text-decoration-color: currentColor; }
@media (hover: hover) and (pointer: fine) { .hv__a:hover { text-decoration-color: currentColor; } }
@media (min-width: 768px) {
  .hv__poster, .hv__video { object-position: var(--pos); }
  .hv { grid-template-rows: auto 96px; }
  .hv__media { height: clamp(440px, calc(100svh - 220px), 720px); }
  .hv__board { grid-row: 1 / 3; align-self: end; margin-top: 0; width: min(100%, 860px); padding: clamp(24px, 3.4vw, 48px); }
  .hv__credit { grid-row: 2; justify-self: end; align-self: center; text-align: right; max-width: 34ch; padding: 0 0 0 24px; }
}
/* until the board stops being (nearly) full width, the toggle stays top-right, clear of the board */
/* 768–1199: a ~640 px board leaves the footage visible, and the credit gets its own row under it (CC BY: visible) */
@media (min-width: 768px) and (max-width: 1199px) {
  .hv { grid-template-rows: auto 96px auto; }
  .hv__board { width: min(100%, 640px); }
  .hv__credit { grid-row: 3; justify-self: end; padding-top: 10px; max-width: none; }
}
@media (min-width: 1200px) {
  .hv__toggle { align-self: end; margin: 0 16px 16px 0; }
  .hv__board { width: min(58%, 860px); }
  .hv__credit { max-width: 40%; }
}
@media (prefers-reduced-motion: reduce) { .hv__poster, .hv__board, .hv__px { animation: none; } }
</style>
