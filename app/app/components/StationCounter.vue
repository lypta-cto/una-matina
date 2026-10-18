<script setup lang="ts">
// Live Stations' live thing: pick up to three stations and see your counter under the awning.
// The counter always shows three places; a picked station's sign drops onto its hook (the one spring on the site:
// a hung sign really does settle), the others slide over when one is taken down (FLIP via TransitionGroup move).
import { stations } from '~/data/stations'
const MAX = 3
const picked = ref<string[]>(['crepe'])
const last = ref('')
function toggle(id: string) {
  const s = stations.find(x => x.id === id)!
  if (picked.value.includes(id)) { picked.value = picked.value.filter(x => x !== id); last.value = `${s.short} removed.` }
  else if (picked.value.length < MAX) { picked.value = [...picked.value, id]; last.value = `${s.short} added.` }
  else last.value = 'Three is the most. Remove one first.'
}
const chosen = computed(() => picked.value.map(id => stations.find(s => s.id === id)!))
const slots = computed(() => [
  ...chosen.value.map(s => ({ key: s.id, s })),
  ...Array.from({ length: MAX - chosen.value.length }, (_, i) => ({ key: `empty-${chosen.value.length + i}`, s: null })),
])
const full = computed(() => picked.value.length >= MAX)
const to = computed(() => ({ path: '/inquire', query: { services: 'stations', stations: picked.value.join(',') } }))
</script>

<template>
  <div class="sc">
    <fieldset class="sc__pick">
      <legend class="sc__legend">Pick up to three. <span class="sc__count tnum">{{ picked.length }} of {{ MAX }} picked</span></legend>
      <div class="sc__chips">
        <button
          v-for="s in stations" :key="s.id" type="button" class="sc__chip"
          :aria-pressed="picked.includes(s.id)"
          :aria-disabled="!picked.includes(s.id) && full ? 'true' : undefined"
          @click="toggle(s.id)"
        >{{ s.short }}</button>
      </div>
    </fieldset>
    <p class="sr-only" aria-live="polite">{{ last }} {{ picked.length }} of {{ MAX }} picked.</p>
    <div class="sc__counter">
      <Awning tone="apricot" size="m" :drop="false" />
      <TransitionGroup tag="div" name="sc" class="sc__top">
        <div v-for="slot in slots" :key="slot.key" class="sc__sign" :class="{ 'is-empty': !slot.s }">
          <template v-if="slot.s">
            <p class="sc__name">{{ slot.s.name }}</p>
            <p class="sc__note italic-line">{{ slot.s.note }}</p>
          </template>
          <p v-else class="sc__add">Add a station</p>
        </div>
      </TransitionGroup>
    </div>
    <NuxtLink v-if="chosen.length" :to="to" class="btn btn-primary sc__cta">Ask about {{ chosen.length > 1 ? 'these stations' : 'this station' }}</NuxtLink>
    <p v-else class="sc__hint">Pick at least one station to ask about it.</p>
  </div>
</template>

<style scoped>
.sc { min-width: 0; }
.sc__pick { border: 0; margin: 0; padding: 0; min-width: 0; }
.sc__legend { font-weight: 600; font-size: var(--step-1); line-height: 1.35; margin-bottom: 16px; }
.sc__count { display: block; margin-top: 4px; font-size: 0.9375rem; font-weight: 500; color: var(--ink-muted); }
.sc__chips { display: flex; flex-wrap: wrap; gap: 8px; }
.sc__chip {
  display: inline-flex; align-items: center; gap: 0.45em;
  min-height: 46px; padding: 0 18px; border: 2px solid var(--ink); background: var(--ground); color: var(--ink);
  font: 600 0.9375rem var(--font-text); cursor: pointer; touch-action: manipulation; user-select: none; -webkit-user-select: none;
  transition: background-color var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out);
}
.sc__chip:active { transform: translateY(1px); }
/* picked: apricot fill + a drawn check mark, so the state is not colour alone */
.sc__chip[aria-pressed="true"] { background: var(--accent); color: var(--on-accent); }
.sc__chip[aria-pressed="true"]::before { content: ""; width: 0.7em; height: 0.38em; border-left: 2px solid currentColor; border-bottom: 2px solid currentColor; transform: translateY(-0.12em) rotate(-45deg); }
@media (hover: hover) and (pointer: fine) { .sc__chip[aria-pressed="false"]:not([aria-disabled]):hover { background: var(--surface); } }
.sc__chip[aria-disabled="true"] { opacity: 0.55; cursor: not-allowed; }
.sc__counter { margin-top: clamp(24px, 3vw, 40px); background: var(--field); }
.sc__top { position: relative; display: grid; gap: 12px; padding: 20px clamp(16px, 2.4vw, 32px) clamp(20px, 3vw, 36px); }
.sc__sign { background: var(--ground); padding: 18px 20px; display: grid; gap: 4px; align-content: start; min-height: 112px; transform-origin: 50% 0; }
.sc__sign.is-empty { background: var(--surface); align-content: center; }
.sc__name { font-family: var(--font-display); font-weight: 500; text-transform: uppercase; letter-spacing: 0.03em; font-size: var(--step-1); line-height: 1.1; }
.sc__note { font-size: 1rem; }
.sc__add { font-weight: 600; font-size: 1rem; color: var(--ink-muted); }
.sc__cta { margin-top: 20px; }
.sc__hint { margin-top: 20px; min-height: 52px; display: flex; align-items: center; font-weight: 600; color: var(--ink-muted); }
/* signs: picked ones drop onto the hook (spring), taken-down ones lift off quickly, neighbours glide over */
.sc-move { transition: transform var(--dur-base) var(--ease-out); }
.sc-enter-active { transition: transform var(--dur-slow) var(--ease-spring), opacity var(--dur-fast) var(--ease-out); }
.sc-enter-from { transform: translateY(-18px); opacity: 0; }
.sc-enter-from.is-empty { transform: none; }
.sc-leave-active { position: absolute; visibility: hidden; }
@media (min-width: 640px) { .sc__top { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
@media (prefers-reduced-motion: reduce) { .sc-move, .sc-enter-active { transition: none; } }
</style>
