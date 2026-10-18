<script setup lang="ts">
// The scalloped top edge of a rising colour field (Home chapters): a row of half-suns in the field's own colour
// (currentColor = --chap-bg), the same half-circle as the valance scallops and the "A" mark. Solid tone, no stripes
// (DESIGN: one awning per page). SVG pattern, centred on the page so both ends match.
const id = useId()
</script>

<template>
  <svg class="edge" aria-hidden="true" focusable="false">
    <defs>
      <pattern :id="id" x="50%" y="0" width="32" height="16" patternUnits="userSpaceOnUse">
        <circle cx="16" cy="16" r="16" fill="currentColor" />
      </pattern>
    </defs>
    <rect width="100%" height="16" :fill="`url(#${id})`" />
    <!-- closes the hairline seams where two scallops meet at the base -->
    <rect y="14" width="100%" height="3" fill="currentColor" />
  </svg>
</template>

<style scoped>
.edge { position: absolute; left: 0; bottom: calc(100% - 1px); width: 100%; height: 17px; display: block; color: var(--chap-bg, var(--accent)); pointer-events: none; }
</style>
