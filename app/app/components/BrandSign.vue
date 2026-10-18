<script setup lang="ts">
// The "A" mark, drawn as clean geometry (the supplied PNG is an AI raster). Inverted, it reads as a crêpe cone.
const props = withDefaults(defineProps<{ inverted?: boolean, label?: string }>(), { inverted: false, label: '' })
const cid = useId() // unique clipPath id: the mark can appear more than once per page
</script>

<template>
  <svg viewBox="0 0 640 560" :class="{ 'is-inverted': props.inverted }" :role="props.label ? 'img' : undefined" :aria-label="props.label || undefined" :aria-hidden="props.label ? undefined : 'true'">
    <defs><clipPath :id="cid"><rect x="0" y="0" width="640" height="540" /></clipPath></defs>
    <g :transform="props.inverted ? 'rotate(180 320 280)' : undefined">
      <path d="M140 540 A180 180 0 0 1 500 540 Z" fill="var(--accent)" />
      <polyline :clip-path="`url(#${cid})`" points="40,580 320,46 600,580" fill="none" stroke="currentColor" stroke-width="40" stroke-linejoin="round" />
    </g>
  </svg>
</template>
