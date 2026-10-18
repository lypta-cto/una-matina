<script setup lang="ts">
// Internal marker for a fact the client still has to confirm. Renders only its content, nothing visible:
// list them with `grep -rn "<Tbc" app` or `document.querySelectorAll('[data-tbc]')` (the note is in data-tbc-note).
defineProps<{ note?: string }>()
</script>

<template>
  <span data-tbc :data-tbc-note="note || undefined"><slot /></span>
</template>

<style scoped>
/* nothing visible on purpose: the content reads as ordinary text */
[data-tbc] { display: inline; }
</style>
