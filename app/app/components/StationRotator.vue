<script setup lang="ts">
// One station name on a cream plank, stepped by scroll progress through its section (no timer). Click advances.
// The plank is a roller sign: the next name rolls up out of the plank's lower edge while the old one rolls off the top
// (down when you scroll back). Both run at once in one grid cell; the plank is sized to the longest name, so it never jumps.
import { stations } from '~/data/stations'
const props = defineProps<{ target?: string }>()
const idx = ref(0)
const dir = ref<'up' | 'down'>('up')
const reduce = ref(false)
const el = ref<HTMLElement>()
const label = (s: typeof stations[number]) => s.sign ?? s.short
let sec: HTMLElement | null = null
let ticking = false
function go(n: number) {
  if (n === idx.value) return
  dir.value = n > idx.value || (idx.value === stations.length - 1 && n === 0) ? 'up' : 'down'
  idx.value = n
}
function measure() {
  ticking = false
  if (!sec) return
  const vh = window.innerHeight
  let p: number
  if (getComputedStyle(sec).position === 'sticky' && sec.parentElement) {
    // pinned chapter (Home): the section stands still while the next one covers it, so read the pin track instead.
    // 0 until the chapter is nearly pinned (track top at 20 % of the screen), 1 when the next one has covered 75 % of it.
    const top = sec.parentElement.getBoundingClientRect().top
    p = (vh * 0.2 - top) / (vh * 0.2 + vh * 0.75)
  }
  else {
    const r = sec.getBoundingClientRect()
    const start = vh * 0.8, end = vh * 0.2
    p = (start - r.top) / (start - end + r.height)
  }
  p = Math.min(1, Math.max(0, p))
  go(Math.min(stations.length - 1, Math.floor(p * stations.length)))
}
function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(measure) } }
onMounted(() => {
  reduce.value = matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce.value) return
  sec = (props.target ? document.querySelector(props.target) : el.value?.closest('section')) as HTMLElement | null
  window.addEventListener('scroll', onScroll, { passive: true })
  measure()
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <div ref="el" class="rot">
    <ul class="sr-only"><li v-for="s in stations" :key="s.id">{{ s.name }}</li></ul>
    <p v-if="reduce" class="sr-plain" aria-hidden="true">{{ stations.map(s => s.short).join(', ') }}</p>
    <button v-else type="button" class="plank display-m" aria-hidden="true" tabindex="-1" @click="go((idx + 1) % stations.length)">
      <span class="plank__stack">
        <span v-for="s in stations" :key="s.id" class="plank__sizer">{{ label(s) }}</span>
        <Transition :name="`rot-${dir}`"><span :key="idx" class="plank__t">{{ label(stations[idx]!) }}</span></Transition>
      </span>
    </button>
  </div>
</template>

<style scoped>
.rot { max-width: 100%; }
.plank { display: inline-block; max-width: 100%; padding: 0.16em 0.32em 0.1em; line-height: 1; font: inherit; font-family: var(--font-display); font-weight: 700; text-transform: uppercase; letter-spacing: var(--track-m); font-size: var(--display-m); background: var(--ground); color: var(--ink); border: 0; cursor: pointer; text-align: left; touch-action: manipulation; }
/* every label sits in one cell; the invisible sizers make the plank as wide as the longest one */
.plank__stack { display: grid; overflow: clip; overflow-clip-margin: 0.04em; }
.plank__stack > * { grid-area: 1 / 1; white-space: nowrap; }
.plank__sizer { visibility: hidden; }
.sr-plain { font-weight: 700; font-size: var(--step-1); line-height: 1.3; }
.rot-up-enter-active, .rot-up-leave-active, .rot-down-enter-active, .rot-down-leave-active { transition: transform var(--dur-base) var(--ease-out); }
.rot-up-enter-from, .rot-down-leave-to { transform: translateY(105%); }
.rot-up-leave-to, .rot-down-enter-from { transform: translateY(-105%); }
</style>
