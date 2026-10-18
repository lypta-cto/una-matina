<script setup lang="ts">
// Shared copy of CrpWordmarkRise.vue (/crepes keeps its own): the horizontal wordmark built from the traced logo
// paths, in ten clipped letter slices, so it rises letter by letter out of its baseline and then its sun comes up.
// The slices tile the full width, so the resting state is the exact logo. Triggers itself once when it enters
// (only if it was below the fold at mount); SSR, no JS and reduced motion = the static logo.
import raw from '~/assets/logo/wordmark-horizontal.svg?raw'

const paths = [...raw.matchAll(/<path\b([^>]*)\/?>/g)].map(m => m[1] ?? '')
const attr = (s: string, name: string) => s.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1] ?? ''
const ink = paths[0] ?? ''
const sun = paths[1] ?? ''
const inkD = attr(ink, 'd')
const inkRule = (attr(ink, 'fill-rule') || 'nonzero') as 'nonzero' | 'evenodd'
const sunD = attr(sun, 'd')
const view = raw.match(/viewBox="([^"]+)"/)?.[1] ?? '0 0 2400 265'
// Letter columns in viewBox units: U N A · M A T T I N A
const cuts = [0, 240, 495, 850, 1208, 1500, 1600, 1745, 1835, 2095, 2400]
const slices = cuts.slice(0, -1).map((x, i) => ({ x, w: cuts[i + 1]! - x, i }))

const el = ref<SVGSVGElement | null>(null)
const stage = ref<'' | 'armed' | 'in'>('')
let io: IntersectionObserver | null = null
onMounted(() => {
  const s = el.value
  if (!s || !('IntersectionObserver' in window)) return
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
  if (s.getBoundingClientRect().top < window.innerHeight * 0.95) return
  stage.value = 'armed'
  io = new IntersectionObserver((entries) => {
    if (!entries.some(e => e.isIntersecting)) return
    io?.disconnect()
    requestAnimationFrame(() => requestAnimationFrame(() => (stage.value = 'in')))
  }, { rootMargin: '0px 0px -6% 0px' })
  io.observe(s)
})
onBeforeUnmount(() => io?.disconnect())
</script>

<template>
  <svg ref="el" class="wmr" :class="stage && `is-${stage}`" :viewBox="view" role="img" aria-label="Una Mattina">
    <defs>
      <path id="wmr-ink" :d="inkD" :fill-rule="inkRule" fill="currentColor" />
      <clipPath v-for="s in slices" :id="`wmr-c${s.i}`" :key="s.i"><rect :x="s.x - 1.5" y="-40" :width="s.w + 3" height="305" /></clipPath>
    </defs>
    <g v-for="s in slices" :key="s.i" :clip-path="`url(#wmr-c${s.i})`">
      <use href="#wmr-ink" class="wmr__l" :style="{ '--i': s.i }" />
    </g>
    <path class="wmr__sun" :d="sunD" />
  </svg>
</template>

<style scoped>
.wmr { display: block; width: 100%; height: auto; overflow: hidden; }
.wmr__sun { fill: var(--logo-sun, var(--accent)); }
.wmr__l, .wmr__sun { transform-box: view-box; }
.is-armed .wmr__l, .is-in .wmr__l { transform: translateY(105%); }
.is-armed .wmr__sun, .is-in .wmr__sun { transform: translateY(42%); opacity: 0; }
.is-in .wmr__l { transform: none; transition: transform 900ms var(--ease-out) calc(80ms + var(--i) * 55ms); }
.is-in .wmr__sun { transform: none; opacity: 1; transition: transform 1100ms var(--ease-out) 820ms, opacity 500ms var(--ease-out) 820ms; }
</style>
