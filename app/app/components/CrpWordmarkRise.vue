<script setup lang="ts">
// The footer wordmark, built from the traced logo paths, so it can rise letter by letter out of its
// baseline and then let its sun come up. One <path> in <defs>, ten clipped <use> slices (the slices
// tile the full width, so the resting state is the exact logo). Motion only when the parent section
// is armed by v-inview (pages/crepes.vue); otherwise, with reduced motion or without JS, it is static.
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
</script>

<template>
  <svg class="wm" :viewBox="view" role="img" aria-label="Una Mattina">
    <defs>
      <path id="crp-wm-ink" :d="inkD" :fill-rule="inkRule" fill="currentColor" />
      <clipPath v-for="s in slices" :id="`crp-wm-c${s.i}`" :key="s.i"><rect :x="s.x - 1.5" y="-40" :width="s.w + 3" height="305" /></clipPath>
    </defs>
    <g v-for="s in slices" :key="s.i" :clip-path="`url(#crp-wm-c${s.i})`">
      <use href="#crp-wm-ink" class="wm__l" :style="{ '--i': s.i }" />
    </g>
    <path class="wm__sun" :d="sunD" />
  </svg>
</template>

<style scoped>
.wm { display: block; width: 100%; height: auto; overflow: hidden; }
.wm__sun { fill: var(--logo-sun, var(--accent)); }
.wm__l, .wm__sun { transform-box: view-box; }

:global(.crp-armed .wm__l) { transform: translateY(105%); }
:global(.crp-armed .wm__sun) { transform: translateY(42%); opacity: 0; }
:global(.crp-armed.crp-in .wm__l) { transform: none; transition: transform 900ms var(--ease-out) calc(80ms + var(--i) * 55ms); }
:global(.crp-armed.crp-in .wm__sun) { transform: none; opacity: 1; transition: transform 1100ms var(--ease-out) 820ms, opacity 500ms var(--ease-out) 820ms; }
</style>
