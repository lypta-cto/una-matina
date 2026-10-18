<script setup lang="ts">
// Page close (Events v2): the headline painted on two flat planks in heavy caps (Montserrat 700, −0.025em), body and
// one pill action on the right. `field` sets the section's ground; the planks always differ from it
// (cream: apricot + yellow · yellow: apricot + cream · apricot: yellow + cream · sage: cream + yellow).
// Never `brown`: the footer is brown and follows directly.
// Motion (v-stage, once, below the fold only): each plank is painted left → right, then its words rise out of it;
// the second plank follows 100 ms later. Default state = final state (no JS, reduced motion).
import type { RouteLocationRaw } from 'vue-router'
withDefaults(defineProps<{ lines: [string, string], body?: string, label?: string, to?: RouteLocationRaw, field?: 'cream' | 'yellow' | 'apricot' | 'sage' }>(), {
  body: "Date, place, guests, what you're imagining. We reply with questions, not a price list.",
  label: 'Start an inquiry',
  to: '/inquire',
  field: 'cream',
})
</script>

<template>
  <section class="close" :class="`close--${field}`" aria-labelledby="close-title">
    <div class="wrap close__grid">
      <h2 id="close-title" v-stage class="close__title">
        <span class="plank plank--a"><span class="plank__t">{{ lines[0] }}</span></span>
        <span class="plank plank--b"><span class="plank__t">{{ lines[1] }}</span></span>
      </h2>
      <div class="close__side">
        <slot />
        <p v-if="body" class="close__body">{{ body }}</p>
        <NuxtLink :to="to" class="pill" :class="field === 'cream' ? 'pill--sun pill--on-light' : 'pill--ink'">{{ label }} <span class="pill__arrow" aria-hidden="true">→</span></NuxtLink>
      </div>
    </div>
    <div v-if="$slots.after" class="wrap close__after"><slot name="after" /></div>
  </section>
</template>

<style scoped>
.close { padding-block: var(--space-section); }
.close--cream { background: var(--ground); color: var(--ink); --pa: var(--accent); --pa-ink: var(--ink-deep); --pb: var(--field); --pb-ink: var(--ink); }
.close--yellow { background: var(--field); color: var(--ink); --pa: var(--accent); --pa-ink: var(--ink-deep); --pb: var(--ground); --pb-ink: var(--ink); }
.close--apricot { background: var(--accent); color: var(--ink-deep); --pa: var(--field); --pa-ink: var(--ink); --pb: var(--ground); --pb-ink: var(--ink); }
.close--sage { background: var(--field-2); color: var(--ink-deep); --pa: var(--ground); --pa-ink: var(--ink); --pb: var(--field); --pb-ink: var(--ink); }
.close__grid { display: grid; gap: clamp(28px, 4vw, 48px); align-items: end; }
.close__title {
  display: grid; gap: 8px; justify-items: start; margin: 0;
  font-weight: 700; letter-spacing: var(--track-l); line-height: 0.95; text-transform: uppercase;
  font-size: clamp(1.75rem, 8vw, 2.5rem);
}
.plank { position: relative; isolation: isolate; display: block; width: fit-content; max-width: 100%; padding: 0.08em 0.26em 0.04em; overflow: clip; white-space: nowrap; }
.plank::before { content: ""; position: absolute; inset: 0; z-index: -1; background: var(--plank); transform-origin: left; }
.plank__t { display: block; }
.plank--a { --plank: var(--pa); --d: 0ms; color: var(--pa-ink); }
.plank--b { --plank: var(--pb); --d: 100ms; color: var(--pb-ink); }
/* armed (below the fold, motion allowed): unpainted planks, words below their plank's lower edge */
.close__title[data-stage="armed"] .plank::before { transform: scaleX(0); }
.close__title[data-stage="armed"] .plank__t { transform: translateY(110%); }
.close__title[data-stage="in"] .plank::before { transition: transform var(--dur-slow) var(--ease-out) var(--d); }
.close__title[data-stage="in"] .plank__t { transition: transform var(--dur-rise) var(--ease-out) calc(var(--d) + 140ms); }
.close__after { margin-top: var(--space-block); }
.close__side { display: grid; gap: 20px; justify-items: start; }
.close__body { font-size: var(--step-1); line-height: 1.45; max-width: 34ch; }
@media (max-width: 599px) { .plank { white-space: normal; } .close__side .pill { width: 100%; } }
@media (min-width: 768px) { .close__title { font-size: min(var(--display-l), calc(3.8 * var(--vw) + 0.75rem)); } }
@media (min-width: 900px) { .close__grid { grid-template-columns: 7fr 5fr; } }
</style>
