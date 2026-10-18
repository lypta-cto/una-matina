<script setup lang="ts">
// AI mockup from the brand board, standing in until the styled shoots. No visible label: the alt text says it is an
// illustration, and data-concept marks it for the swap (`document.querySelectorAll('[data-concept]')`).
const props = withDefaults(defineProps<{ src: string, alt: string, width: number, height: number, ratio?: string, sizes?: string, eager?: boolean, drift?: boolean, unveil?: boolean | number }>(), { ratio: '', sizes: 'sm:100vw', eager: false, drift: false, unveil: false })
const unveilDelay = computed(() => (props.unveil === false ? false : props.unveil === true ? 0 : props.unveil))
</script>

<template>
  <figure v-unveil="unveilDelay" class="concept" :data-concept="props.src" :style="props.ratio ? { aspectRatio: props.ratio } : undefined">
    <NuxtImg :src="props.src" :alt="props.alt" :width="props.width" :height="props.height" format="webp" :sizes="props.sizes" :loading="props.eager ? 'eager' : 'lazy'" :fetchpriority="props.eager ? 'high' : undefined" :preload="props.eager" class="concept__img" :class="{ 'is-drift': props.drift }" />
  </figure>
</template>

<style scoped>
:where(.concept) { margin: 0; }
.concept { position: relative; overflow: hidden; background: var(--surface); }
.concept__img { width: 100%; height: 100%; object-fit: cover; display: block; }
/* drift: one slow settle that ends (no endless loop without a pause control, WCAG 2.2.2) */
.is-drift { animation: drift 5s var(--ease-out) both; transform-origin: 60% 40%; }
@keyframes drift { from { transform: scale(1.06) translateY(-1.5%); } to { transform: none; } }
</style>
