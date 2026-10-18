<script setup lang="ts">
// Questions as cream-deep planks with native <details>. Max 4. Unknown answers use <Tbc> in the slot content.
defineProps<{ items: { q: string, a: string, tbc?: boolean }[] }>()
</script>

<template>
  <div class="faq">
    <details v-for="it in items" :key="it.q" class="faq__item">
      <summary class="faq__q"><span>{{ it.q }}</span><span class="faq__plus" aria-hidden="true" /></summary>
      <p class="faq__a"><Tbc v-if="it.tbc" note="answer">{{ it.a }}</Tbc><template v-else>{{ it.a }}</template></p>
    </details>
  </div>
</template>

<style scoped>
.faq { display: grid; gap: 8px; }
.faq__item { background: var(--surface); color: var(--ink); }
.faq__q { display: flex; justify-content: space-between; align-items: center; gap: 16px; padding: 18px 20px; min-height: 56px; cursor: pointer; list-style: none; font-weight: 600; font-size: var(--step-1); line-height: 1.3; }
.faq__q::-webkit-details-marker { display: none; }
.faq__plus { position: relative; flex: none; width: 16px; height: 16px; }
.faq__plus::before, .faq__plus::after { content: ""; position: absolute; background: currentColor; left: 0; right: 0; top: 7px; height: 2px; }
.faq__plus::after { transform: rotate(90deg); transition: transform var(--dur-base) var(--ease-out); }
details[open] .faq__plus::after { transform: rotate(0deg); }
.faq__a { padding: 0 20px 20px; max-width: 62ch; }
/* opening: the answer lifts in under its question (the "+" turns at the same time); closing is instant */
details[open] .faq__a { animation: faq-a var(--dur-base) var(--ease-out); }
@keyframes faq-a { from { opacity: 0; transform: translateY(-6px); } }
@media (prefers-reduced-motion: reduce) { details[open] .faq__a { animation: none; } }
</style>
