<script setup lang="ts">
// Page close: the headline painted on two flat planks (apricot, yellow), action on the right.
// Motion (v-stage, once, below the fold only): each plank is painted left → right, then its words rise out of it;
// the second plank follows 100 ms later. Default state = final state (no JS, reduced motion).
import type { RouteLocationRaw } from 'vue-router'
withDefaults(defineProps<{ lines: [string, string], body?: string, label?: string, to?: RouteLocationRaw }>(), {
  body: "Date, place, guests, what you're imagining. We reply with questions, not a price list.",
  label: 'Start an inquiry',
  to: '/inquire',
})
</script>

<template>
  <section class="close" aria-labelledby="close-title">
    <div class="wrap close__grid">
      <h2 id="close-title" v-stage class="close__title">
        <span class="plank plank--a"><span class="plank__t">{{ lines[0] }}</span></span>
        <span class="plank plank--b"><span class="plank__t">{{ lines[1] }}</span></span>
      </h2>
      <div class="close__side">
        <slot />
        <p v-if="body" class="close__body">{{ body }}</p>
        <NuxtLink :to="to" class="btn btn-primary">{{ label }}</NuxtLink>
      </div>
    </div>
    <div v-if="$slots.after" class="wrap close__after"><slot name="after" /></div>
  </section>
</template>

<style scoped>
.close { padding-block: var(--section); }
.close__grid { display: grid; gap: clamp(28px, 4vw, 48px); align-items: end; }
.close__title { display: grid; gap: 8px; justify-items: start; font-size: clamp(1.75rem, 8.4vw, 2.5rem); text-transform: uppercase; }
.plank { position: relative; isolation: isolate; display: block; width: fit-content; max-width: 100%; padding: 0.06em 0.28em 0.04em; color: var(--ink); overflow: clip; white-space: nowrap; }
.plank::before { content: ""; position: absolute; inset: 0; z-index: -1; background: var(--plank); transform-origin: left; }
.plank__t { display: block; }
.plank--a { --plank: var(--accent); --d: 0ms; color: var(--ink-deep); }
.plank--b { --plank: var(--field); --d: 100ms; }
/* armed (below the fold, motion allowed): unpainted planks, words below their plank's lower edge */
.close__title[data-stage="armed"] .plank::before { transform: scaleX(0); }
.close__title[data-stage="armed"] .plank__t { transform: translateY(110%); }
.close__title[data-stage="in"] .plank::before { transition: transform var(--dur-slow) var(--ease-out) var(--d); }
.close__title[data-stage="in"] .plank__t { transition: transform var(--dur-slow) var(--ease-out) calc(var(--d) + 140ms); }
.close__after { margin-top: clamp(48px, 6vw, 88px); }
.close__side { display: grid; gap: 20px; justify-items: start; }
.close__body { font-size: var(--step-1); line-height: 1.45; max-width: 34ch; }
@media (max-width: 599px) { .plank { white-space: normal; } }
@media (min-width: 768px) { .close__title { font-size: min(var(--step-4), calc(3.8 * var(--vw) + 0.75rem)); } }
@media (min-width: 900px) { .close__grid { grid-template-columns: 7fr 5fr; } }
</style>
