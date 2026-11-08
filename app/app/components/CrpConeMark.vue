<script setup lang="ts">
const id = useId()
// `sun`: the filling's colour — cream on the apricot finale card (default), apricot on cream surfaces.
const props = withDefaults(defineProps<{ sun?: string }>(), { sun: 'var(--ground)' })
// The brand's "A" upside down: a crêpe in a paper cone, the half-sun as the filling at its mouth.
</script>

<template>
  <svg viewBox="0 0 640 600" aria-hidden="true" focusable="false">
    <defs><clipPath :id="id"><rect x="0" y="0" width="640" height="560" /></clipPath></defs>
    <g transform="rotate(180 320 313)">
      <path d="M140 560 A180 180 0 0 1 500 560 Z" :fill="props.sun" />
      <polyline points="40,600 320,66 600,600" fill="none" stroke="currentColor" stroke-width="40" stroke-linejoin="round" :clip-path="`url(#${id})`" />
    </g>
  </svg>
</template>
