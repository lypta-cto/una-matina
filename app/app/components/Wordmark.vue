<script setup lang="ts">
// Traced from the client's PNG wordmarks (assets/logo/traced). Ink = currentColor, sun = --logo-sun.
import horizontal from '~/assets/logo/wordmark-horizontal.svg?raw'
import stacked from '~/assets/logo/wordmark-stacked.svg?raw'
const props = withDefaults(defineProps<{ variant?: 'horizontal' | 'stacked' }>(), { variant: 'horizontal' })
const svg = computed(() => (props.variant === 'stacked' ? stacked : horizontal).replace('<svg ', '<svg aria-hidden="true" focusable="false" '))
</script>

<template>
  <span class="wordmark" role="img" aria-label="Una Mattina" v-html="svg" />
</template>

<style scoped>
.wordmark { display: block; line-height: 0; }
.wordmark :deep(svg) { width: 100%; height: auto; display: block; }
</style>
