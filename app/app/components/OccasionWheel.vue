<script setup lang="ts">
// E1 occasions wheel (cateringgco "Who we serve"): a 5-row window, the middle row in full ink, its neighbours
// fading out (50 % / 15 %); one row every 2 s with a 600 ms glide (cubic-bezier(.44,0,.56,1), measured).
// The real list is a <ul> in the DOM at all times. Where the wheel runs (JS, ≥ 600 px, motion allowed: decided in CSS
// from html.js, so the layout is right from the first paint) that list is visually hidden and the wheel is an
// aria-hidden copy. Phones, no JS and reduced motion get the plain list.
// WCAG 2.2.2: it moves for more than 5 s, so it has a visible Pause button; it also holds on hover / focus,
// off screen and in a background tab.
const props = withDefaults(defineProps<{ items: string[], label?: string }>(), { label: '' })
const n = props.items.length
const loop = computed(() => [...props.items, ...props.items, ...props.items])
const k = ref(n - 2) // index of the window's top row: the middle row (k + 2) is items[0] of the second copy
const glide = ref(true)
const paused = ref(false)
const hold = ref(false)
const root = ref<HTMLElement>()
let timer = 0
let io: IntersectionObserver | undefined
let inView = false
let live = false

const op = (i: number) => {
  const d = Math.abs(i - (k.value + 2))
  return d === 0 ? 'is-c' : d === 1 ? 'is-1' : d === 2 ? 'is-2' : 'is-off'
}
function step() {
  glide.value = true
  k.value++
  if (k.value >= 2 * n - 2) {
    // the middle row is now the first item of the third copy: jump back one copy without a glide, after this one lands
    window.setTimeout(() => { glide.value = false; k.value -= n; requestAnimationFrame(() => requestAnimationFrame(() => { glide.value = true })) }, 650)
  }
}
function sync() {
  const run = live && !paused.value && !hold.value && inView && !document.hidden
  if (run && !timer) timer = window.setInterval(step, 2000)
  if (!run && timer) { clearInterval(timer); timer = 0 }
}
watch([paused, hold], sync)
onMounted(() => {
  const mq = matchMedia('(min-width: 600px) and (prefers-reduced-motion: no-preference)')
  const check = () => { live = mq.matches; sync() }
  mq.addEventListener('change', check)
  io = new IntersectionObserver(([e]) => { inView = !!e?.isIntersecting; sync() })
  if (root.value) io.observe(root.value)
  document.addEventListener('visibilitychange', sync)
  check()
  onBeforeUnmount(() => mq.removeEventListener('change', check))
})
onBeforeUnmount(() => { clearInterval(timer); io?.disconnect(); document.removeEventListener('visibilitychange', sync) })
</script>

<template>
  <div ref="root" class="ow" @mouseenter="hold = true" @mouseleave="hold = false" @focusin="hold = true" @focusout="hold = false">
    <ul class="ow-list" :aria-label="props.label || undefined">
      <li v-for="o in props.items" :key="o">{{ o }}</li>
    </ul>
    <div class="ow-win" aria-hidden="true">
      <ul class="ow-track" :class="{ 'is-glide': glide }" :style="{ '--k': k }">
        <li v-for="(o, i) in loop" :key="i" class="ow-row" :class="op(i)">{{ o }}</li>
      </ul>
    </div>
    <button type="button" class="ow-toggle" :aria-pressed="paused" @click="paused = !paused">
      <span class="ow-icon" :class="paused ? 'is-play' : 'is-pause'" aria-hidden="true" />{{ paused ? 'Play' : 'Pause' }}<span class="sr-only"> the moving list of occasions</span>
    </button>
  </div>
</template>

<style>
/* Unscoped: the wheel / list choice keys on html.js (set before first paint, nuxt.config). */
.ow-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.7em; font-weight: 700; font-size: var(--step-1); line-height: 1.25; letter-spacing: -0.01em; }
@media (min-width: 900px) { .ow-list { columns: 2; column-gap: 32px; display: block; } .ow-list li { margin-bottom: 0.7em; break-inside: avoid; } }
.ow-win, .ow-toggle { display: none; }

@media (min-width: 600px) and (prefers-reduced-motion: no-preference) {
  html.js .ow-list { position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; overflow: hidden; clip-path: inset(50%); white-space: nowrap; border: 0; }
  html.js .ow-win {
    --row: 1.3em; display: block; height: calc(var(--row) * 5); overflow: clip;
    font-size: min(2.5rem, 4.6vw); font-weight: 700; letter-spacing: -0.015em; line-height: var(--row);
  }
  html.js .ow-toggle {
    display: inline-flex; align-items: center; gap: 8px; min-height: 44px; margin-top: 12px; padding: 0 14px 0 0;
    background: none; border: 0; color: inherit; font: 600 0.9375rem var(--font-text); cursor: pointer; touch-action: manipulation;
  }
}
@media (min-width: 900px) and (prefers-reduced-motion: no-preference) { html.js .ow-win { font-size: min(2.75rem, calc(2.9 * var(--vw))); } }

.ow-track { list-style: none; margin: 0; padding: 0; transform: translateY(calc(var(--k) * -1 * var(--row))); }
.ow-track.is-glide { transition: transform 600ms cubic-bezier(0.44, 0, 0.56, 1); }
.ow-row { height: var(--row); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; opacity: 0; }
.ow-track.is-glide .ow-row { transition: opacity 600ms cubic-bezier(0.44, 0, 0.56, 1); }
.ow-row.is-c { opacity: 1; }
.ow-row.is-1 { opacity: 0.5; }
.ow-row.is-2 { opacity: 0.15; }
.ow-icon { position: relative; width: 10px; height: 12px; flex: none; }
.ow-icon.is-pause { border-inline: 3px solid currentColor; }
.ow-icon.is-play { clip-path: polygon(0 0, 100% 50%, 0 100%); background: currentColor; }
@media (hover: hover) and (pointer: fine) { .ow-toggle:hover { text-decoration: underline; text-underline-offset: 5px; text-decoration-thickness: 2px; } }
</style>
