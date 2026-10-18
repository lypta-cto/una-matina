<script setup lang="ts">
// AI mockup from the brand board, standing in until the styled shoots. No visible label: the alt text says it is an
// illustration, and data-concept marks it for the swap (`document.querySelectorAll('[data-concept]')`).
// Events v2: `tint` (0–1) lays the flat brown multiply tint over it and the default slot puts text over its
// bottom-left (as FoundPhoto); `position` sets the crop; `settle` = the 1.06 → 1 load settle (first screen only).
const props = withDefaults(defineProps<{ src: string, alt: string, width: number, height: number, ratio?: string, sizes?: string, eager?: boolean, drift?: boolean, unveil?: boolean | number, tint?: number, position?: string, settle?: boolean }>(), { ratio: '', sizes: 'sm:100vw', eager: false, drift: false, unveil: false, tint: 0, position: '', settle: false })
const slots = useSlots()
const unveilDelay = computed(() => (props.unveil === false ? false : props.unveil === true ? 0 : props.unveil))
</script>

<template>
  <figure v-unveil="unveilDelay" class="concept" :data-concept="props.src" :style="{ ...(props.ratio ? { aspectRatio: props.ratio } : {}), ...(props.position ? { '--concept-pos': props.position } : {}) }">
    <NuxtImg :src="props.src" :alt="props.alt" :width="props.width" :height="props.height" format="webp" :sizes="props.sizes" :loading="props.eager ? 'eager' : 'lazy'" :fetchpriority="props.eager ? 'high' : undefined" :preload="props.eager" class="concept__img" :class="{ 'is-drift': props.drift, 'is-settle': props.settle }" />
    <div v-if="props.tint" class="tint" :style="{ '--tint': props.tint, '--tint-wide': props.tint }" />
    <figcaption v-if="slots.default" class="concept__over on-photo"><slot /></figcaption>
  </figure>
</template>

<style scoped>
:where(.concept) { margin: 0; }
.concept { position: relative; overflow: hidden; background: var(--surface); }
.concept__img { width: 100%; height: 100%; object-fit: cover; display: block; object-position: var(--concept-pos, 50% 50%); }
.concept__over { position: absolute; inset: auto 0 0 0; z-index: 1; padding: clamp(20px, 3vw, 48px) var(--gutter); }
.is-settle { animation: m-settle var(--dur-settle) var(--ease-out) both; }
@media (prefers-reduced-motion: reduce) { .is-settle { animation: none; } }
/* drift: one slow settle that ends (no endless loop without a pause control, WCAG 2.2.2) */
.is-drift { animation: drift 5s var(--ease-out) both; transform-origin: 60% 40%; }
@keyframes drift { from { transform: scale(1.06) translateY(-1.5%); } to { transform: none; } }
</style>
