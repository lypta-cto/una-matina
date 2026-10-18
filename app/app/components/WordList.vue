<script setup lang="ts">
// A titled list set like a painted board column. Real <ul>, no icons.
defineProps<{ title: string, items: string[], tone?: 'plain' | 'board' }>()
</script>

<template>
  <div class="wl" :class="{ 'wl--board': tone === 'board' }">
    <h3 class="wl__title">{{ title }}</h3>
    <ul class="wl__list">
      <li v-for="i in items" :key="i">{{ i }}</li>
    </ul>
  </div>
</template>

<style scoped>
.wl--board { background: var(--surface); padding: clamp(20px, 2.6vw, 36px); }
.wl__title { font-family: var(--font-text); font-weight: 600; font-size: var(--step-1); text-transform: none; letter-spacing: 0; line-height: 1.25; margin-bottom: 12px; }
.wl__list { list-style: none; margin: 0; padding: 0; display: grid; gap: 6px; font-size: var(--step-1); line-height: 1.35; font-weight: 500; }
</style>
