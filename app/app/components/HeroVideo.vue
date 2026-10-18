<script setup lang="ts">
// Home's moving picture (Events v2): the palm-sunset loop, rendered into PageHero's `#media` slot, so it sits under
// the hero's flat brown multiply tint with the header over it. Media only: the Pause control and the credit live on
// the hero board (pages/index.vue reads `playing` / `available` and calls `toggle()` through a template ref).
// Bytes: SSR / no JS = the poster only. The clip loads after mount, and never under prefers-reduced-motion or
// Save-Data / 2g (the poster stays; the board then offers "Play"). One playback rule (sync): loaded, not paused by the
// visitor, on screen, not yet covered by the curtain sheet, and the tab visible. The first frame fades in over the
// matching poster and stays (Pause freezes the frame, never the poster again).
// Phones get a 4:5 poster cut from the frame (source x 833–1553 of 1600, full height): `positionMobile` places the poster,
// `videoPositionMobile` the 16:9 clip so both show the same window (poster 100 % ≈ clip 96 % for any portrait phone).
// Load: the picture settles 1.06 → 1 (1600 ms, CSS, the /crepes hero settle); the curtain scales the layer above it.
interface Src { src: string, type: string }
const props = withDefaults(defineProps<{
  poster: string
  posterMobile?: string
  posterLarge?: string
  sources?: Src[]
  sourcesMobile?: Src[]
  sourcesLarge?: Src[]
  position?: string
  positionMobile?: string
  videoPositionMobile?: string
}>(), { posterMobile: '', posterLarge: '', position: '50% 60%', positionMobile: '70% 50%', videoPositionMobile: '' })

const root = ref<HTMLElement>()
const video = ref<HTMLVideoElement>()
const mode = ref<'still' | 'video'>('still')
const playing = ref(false)
const ready = ref(false)
const loaded = ref(false)
const userPaused = ref(false)
let io: IntersectionObserver | undefined
let inView = true
let covered = false
let sheet: HTMLElement | null = null
let tick = 0

function pick() {
  const small = matchMedia('(max-width: 767px)').matches
  const large = matchMedia('(min-width: 1200px)').matches || (devicePixelRatio > 1.5 && matchMedia('(min-width: 768px)').matches)
  if (small && props.sourcesMobile?.length) return props.sourcesMobile
  if (large && props.sourcesLarge?.length) return props.sourcesLarge
  return props.sources ?? []
}
const shouldPlay = () => loaded.value && !userPaused.value && inView && !covered && !document.hidden
function sync() {
  const v = video.value
  if (!v || !loaded.value) return
  if (shouldPlay()) v.play().catch(() => { userPaused.value = true })
  else v.pause()
}
function fail() { mode.value = 'still'; loaded.value = false; playing.value = false } // 404 / unsupported: poster only, no dead control
// the curtain sheet (PageHero #sheet) covers the sticky hero while it is still "in view": pause once it has
function onScroll() {
  if (tick) return
  tick = requestAnimationFrame(() => {
    tick = 0
    const was = covered
    covered = !!sheet && sheet.getBoundingClientRect().top <= 0
    if (covered !== was) sync()
  })
}
function watchPlayback() {
  if (io || !root.value) return
  io = new IntersectionObserver(([e]) => { inView = !!e?.isIntersecting; sync() }, { threshold: 0.05 })
  io.observe(root.value)
  document.addEventListener('visibilitychange', sync)
  sheet = root.value.closest('.phx-wrap')?.querySelector<HTMLElement>(':scope > .phx__sheet') ?? null
  if (sheet) window.addEventListener('scroll', onScroll, { passive: true })
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
  if (!props.sources?.length) return
  mode.value = 'video'
  await nextTick()
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  const c = (navigator as Navigator & { connection?: { saveData?: boolean, effectiveType?: string } }).connection
  const lowData = !!c?.saveData || ['slow-2g', '2g'].includes(c?.effectiveType ?? '')
  if (reduce || lowData) { userPaused.value = true; return }
  load()
})
onBeforeUnmount(() => {
  io?.disconnect()
  document.removeEventListener('visibilitychange', sync)
  window.removeEventListener('scroll', onScroll)
  cancelAnimationFrame(tick)
})
// `available`: there is a clip to control (false for SSR / no JS / a failed clip, so no dead button is rendered)
const available = computed(() => mode.value === 'video')
defineExpose({ toggle, playing, available })
</script>

<template>
  <div ref="root" class="hv" :class="{ 'is-ready': ready }" :style="{ '--pos': position, '--pos-m': positionMobile, '--vpos-m': videoPositionMobile || positionMobile }">
    <div class="hv__layer">
      <picture>
        <source v-if="posterMobile" :srcset="posterMobile" media="(max-width: 767px)">
        <source v-if="posterLarge" :srcset="posterLarge" media="(min-width: 1200px)">
        <img class="hv__poster" :src="poster" alt="" fetchpriority="high" decoding="async" width="1600" height="900">
      </picture>
      <video v-if="mode === 'video'" ref="video" class="hv__video" muted playsinline loop preload="none" disablepictureinpicture disableremoteplayback aria-hidden="true" tabindex="-1" @playing="onPlaying" @pause="playing = false" @error="fail" />
    </div>
  </div>
</template>

<style scoped>
.hv { position: absolute; inset: 0; overflow: hidden; background: var(--field-dark); }
/* the whole picture (poster and clip together, one layer from SSR on) settles into the frame on load, like the /crepes
   hero photo */
.hv__layer { position: absolute; inset: 0; transform-origin: 60% 55%; animation: m-settle var(--dur-settle) var(--ease-out) both; }
.hv__layer > picture, .hv__video { position: absolute; inset: 0; display: block; }
.hv__poster, .hv__video { width: 100%; height: 100%; object-fit: cover; object-position: var(--pos-m); display: block; }
/* phones: the poster is a 4:5 crop of the frame, so the clip needs its own position to land on the same crop
   (videoPositionMobile), or the picture would jump when the first frame fades in */
.hv__video { object-position: var(--vpos-m); }
@media (min-width: 768px) { .hv__poster, .hv__video { object-position: var(--pos); } }
/* first frame only: fades in over the matching poster and stays */
.hv__video { opacity: 0; transition: opacity var(--dur-slow) var(--ease-out); }
.is-ready .hv__video { opacity: 1; }
@media (prefers-reduced-motion: reduce) { .hv__layer { animation: none; } }
</style>
