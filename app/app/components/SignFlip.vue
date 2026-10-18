<script setup lang="ts">
// The brand's own trick: the "A" with its rising half-sun, turned upside down, is a crêpe in a paper
// cone with the filling at its mouth ("Same symbol. A brighter day. / A sweeter way.").
// It turns once when it comes into view, then it is a button: tap to turn it back and forth.
// Physical turn: CSS transition on transform with a spring curve (≈900 ms, small overshoot), so a tap
// mid-turn retargets from where it is. Reduced motion: no rotation, the two states crossfade.
// Without JS (or above the fold at load) it simply shows the cone.
// Shared copy of CrpSignFlip.vue (/crepes keeps its own). Allowed only for the brand mark (A <-> cone), one per page.
const props = withDefaults(defineProps<{ captions?: [string, string], labels?: [string, string] }>(), {
  captions: () => ['Same symbol. A brighter day.', 'Same symbol. A sweeter way.'],
  labels: () => ['The Una Mattina sign: an A with the sun rising inside. Turn it into the crêpe cone.', 'The Una Mattina sign upside down: a crêpe in a paper cone. Turn it back to the A.'],
})
const clipId = `flip-base-${String(useId()).replace(/[^\w-]/g, "")}`
const cone = ref(true)
const root = ref<HTMLElement | null>(null)
let io: IntersectionObserver | null = null
let timer: ReturnType<typeof setTimeout> | undefined
// A tap always wins over the automatic first turn.
function turn() { io?.disconnect(); clearTimeout(timer); cone.value = !cone.value }

onMounted(() => {
  const el = root.value
  if (!el || !('IntersectionObserver' in window)) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  if (el.getBoundingClientRect().top < window.innerHeight * 0.8) return
  cone.value = false // start as the morning "A" while still out of view
  io = new IntersectionObserver((entries) => {
    if (!entries.some(e => e.isIntersecting)) return
    io?.disconnect()
    timer = setTimeout(() => (cone.value = true), 260)
  }, { rootMargin: '0px 0px -25% 0px' })
  io.observe(el)
})
onBeforeUnmount(() => { io?.disconnect(); clearTimeout(timer) })
</script>

<template>
  <figure ref="root" class="flip" :class="{ 'is-cone': cone }">
    <button type="button" class="flip__btn" :aria-pressed="cone" :aria-label="cone ? props.labels[1] : props.labels[0]" @click="turn">
      <svg class="flip__svg" viewBox="0 0 640 600" aria-hidden="true">
        <defs><clipPath :id="clipId"><rect x="0" y="0" width="640" height="560" /></clipPath></defs>
        <g class="flip__mark">
          <path class="flip__sun" d="M140 560 A180 180 0 0 1 500 560 Z" />
          <polyline :clip-path="`url(#${clipId})`" points="40,600 320,66 600,600" fill="none" stroke="currentColor" stroke-width="40" stroke-linejoin="round" />
        </g>
      </svg>
    </button>
    <figcaption class="flip__cap statement" aria-live="polite">
      <span class="flip__line" :class="{ 'is-on': !cone }">{{ props.captions[0] }}</span>
      <span class="flip__line" :class="{ 'is-on': cone }">{{ props.captions[1] }}</span>
    </figcaption>
  </figure>
</template>

<style scoped>
.flip { margin: 0; display: grid; gap: clamp(16px, 2vw, 28px); justify-items: start; }
.flip__btn {
  display: block; width: 100%; padding: 0; border: 0; background: none; color: var(--ink); cursor: pointer;
  touch-action: manipulation; -webkit-tap-highlight-color: transparent; border-radius: 4px;
}
.flip__svg { display: block; width: 100%; height: auto; overflow: visible; }
.flip__sun { fill: var(--accent); }
/* Rotate around the mark's visual centre (between apex and base), so it turns in place. */
.flip__mark { transform-box: view-box; transform-origin: 320px 313px; transition: transform 980ms var(--spring-turn); }
.flip.is-cone .flip__mark { transform: rotate(180deg); }
.flip__btn:active .flip__svg { transform: scale(0.98); }
.flip__svg { transition: transform 140ms var(--ease-out); }
@media (hover: hover) and (pointer: fine) {
  .flip__btn:hover .flip__mark { transform: rotate(-6deg); }
  .flip.is-cone .flip__btn:hover .flip__mark { transform: rotate(174deg); }
}

/* Caption: the two brand-board lines swap with the sign. */
.flip__cap { display: grid; font-size: var(--step-1); line-height: 1.3; }
.flip__line { grid-area: 1 / 1; opacity: 0; transform: translateY(8px); transition: opacity 360ms var(--ease-out), transform 360ms var(--ease-out); }
.flip__line.is-on { opacity: 1; transform: none; transition-delay: 220ms; }

@media (prefers-reduced-motion: reduce) {
  .flip__mark { transition: none; }
  .flip__line { transform: none; }
}
</style>
