<script setup lang="ts">
// Live Stations' live thing (the quieter second beat after the menu board): pick up to three stations and see your
// counter under its awning, on a brown board. A picked station's sign drops onto its hook (spring: a hung sign really
// does settle); when one is taken down the others slide over (FLIP via TransitionGroup move).
// Optional: a rough guest count. Only when the visitor picks one does the board show it, rolling in on the odometer
// (a real number the visitor chose, events-v2-system.md §6). The ask carries both to the inquiry.
import { stations } from '~/data/stations'
const MAX = 3
const words = ['None', 'One', 'Two', 'Three']
const ranges = ['Under 20', '20–50', '50–100', '100+']
const picked = ref<string[]>(['crepe'])
const guests = ref('')
const last = ref('')
function toggle(id: string) {
  const s = stations.find(x => x.id === id)!
  if (picked.value.includes(id)) { picked.value = picked.value.filter(x => x !== id); last.value = `${s.short} removed.` }
  else if (picked.value.length < MAX) { picked.value = [...picked.value, id]; last.value = `${s.short} added.` }
  else last.value = 'Three is the most. Remove one first.'
}
function pickGuests(r: string) {
  guests.value = guests.value === r ? '' : r
  last.value = guests.value ? `About ${guests.value} guests.` : 'Guest count cleared.'
}
const chosen = computed(() => picked.value.map(id => stations.find(s => s.id === id)!))
const slots = computed(() => [
  ...chosen.value.map(s => ({ key: s.id, s })),
  ...Array.from({ length: MAX - chosen.value.length }, (_, i) => ({ key: `empty-${chosen.value.length + i}`, s: null })),
])
const full = computed(() => picked.value.length >= MAX)
const to = computed(() => ({ path: '/inquire', query: { services: 'stations', stations: picked.value.join(','), ...(guests.value ? { guests: guests.value } : {}) } }))
</script>

<template>
  <div class="sc">
    <fieldset class="sc__pick">
      <legend class="sc__legend">Pick up to three. <span class="sc__count">{{ words[picked.length] }} of three picked</span></legend>
      <div class="sc__chips">
        <button
          v-for="s in stations" :key="s.id" type="button" class="sc__chip"
          :aria-pressed="picked.includes(s.id)"
          :aria-disabled="!picked.includes(s.id) && full ? 'true' : undefined"
          @click="toggle(s.id)"
        >{{ s.short }}</button>
      </div>
    </fieldset>
    <fieldset class="sc__pick sc__pick--guests">
      <legend class="sc__legend sc__legend--s">Roughly how many guests? <span class="sc__opt">(optional)</span></legend>
      <div class="sc__chips">
        <button v-for="r in ranges" :key="r" type="button" class="sc__chip sc__chip--s tnum" :aria-pressed="guests === r" @click="pickGuests(r)">{{ r }}</button>
      </div>
    </fieldset>
    <p class="sr-only" aria-live="polite">{{ last }} {{ words[picked.length] }} of three picked.</p>

    <div class="sc__board on-dark">
      <Awning tone="apricot" size="m" :drop="false" />
      <TransitionGroup tag="div" name="sc" class="sc__top">
        <div v-for="slot in slots" :key="slot.key" class="sc__sign" :class="{ 'is-empty': !slot.s }">
          <template v-if="slot.s">
            <p class="sc__name">{{ slot.s.name }}</p>
            <p class="sc__note italic-line"><Tbc note="station description">{{ slot.s.note }}</Tbc></p>
          </template>
          <p v-else class="sc__add">Add a station</p>
        </div>
      </TransitionGroup>
      <div class="sc__foot">
        <p v-if="guests" class="sc__guests">For <Odometer :key="guests" :value="guests" class="tnum" /> guests</p>
        <NuxtLink v-if="chosen.length" :to="to" class="pill pill--sun sc__cta">Ask about {{ chosen.length > 1 ? 'these stations' : 'this station' }} <span class="pill__arrow" aria-hidden="true">→</span></NuxtLink>
        <p v-else class="sc__hint">Pick at least one station to ask about it.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sc { min-width: 0; display: grid; grid-template-columns: minmax(0, 1fr); gap: clamp(22px, 2.6vw, 32px); }
.sc__pick { border: 0; margin: 0; padding: 0; min-width: 0; }
.sc__legend { font-weight: 700; font-size: var(--step-1); line-height: 1.3; margin-bottom: 14px; }
.sc__legend--s { font-size: 1.0625rem; margin-bottom: 10px; }
.sc__count { margin-left: 0.35em; font-size: 1rem; font-weight: 500; }
.sc__opt { font-weight: 500; }
.sc__chips { display: flex; flex-wrap: wrap; gap: 8px; }
/* chips are pills: ink outline on the yellow field, apricot fill + a drawn check when picked (not colour alone) */
.sc__chip {
  display: inline-flex; align-items: center; gap: 0.45em; min-height: 48px; padding: 0 20px; border-radius: 999px;
  border: 2px solid var(--ink); background: transparent; color: var(--ink);
  font: 600 1rem var(--font-text); cursor: pointer; touch-action: manipulation; user-select: none; -webkit-user-select: none; -webkit-tap-highlight-color: transparent;
  transition: background-color 160ms var(--ease-out), color 160ms var(--ease-out), border-color 160ms var(--ease-out), transform 120ms var(--ease-out);
}
.sc__chip--s { min-height: 44px; padding: 0 16px; font-size: 0.9375rem; }
.sc__chip:active { transform: scale(0.97); }
.sc__chip[aria-pressed="true"] { background: var(--accent); border-color: var(--ink); color: var(--ink-deep); }
.sc__chip[aria-pressed="true"]::before { content: ""; width: 0.7em; height: 0.38em; border-left: 2px solid currentColor; border-bottom: 2px solid currentColor; transform: translateY(-0.12em) rotate(-45deg); }
@media (hover: hover) and (pointer: fine) { .sc__chip[aria-pressed="false"]:not([aria-disabled]):hover { background: var(--ground); } }
.sc__chip[aria-disabled="true"] { opacity: 0.5; cursor: not-allowed; }

/* the counter: a brown board under the awning */
.sc__board { background: var(--field-dark); color: var(--on-field-dark); }
.sc__top { position: relative; display: grid; gap: 10px; padding: 18px clamp(16px, 2.4vw, 28px) 0; }
.sc__sign { background: var(--ground); color: var(--ink); padding: 18px 20px 20px; display: grid; gap: 6px; align-content: start; min-height: 120px; transform-origin: 50% 0; }
.sc__sign.is-empty { background: transparent; color: var(--on-field-dark); align-content: center; justify-items: center; outline: 2px solid var(--accent); outline-offset: -2px; }
.sc__name { font-weight: 700; font-size: var(--step-1); line-height: 1.1; letter-spacing: -0.01em; }
.sc__note { font-size: 1rem; line-height: 1.4; }
.sc__add { font-weight: 600; font-size: 1rem; }
.sc__foot { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 14px 24px; padding: clamp(20px, 2.6vw, 28px) clamp(16px, 2.4vw, 28px) clamp(22px, 2.8vw, 32px); }
.sc__guests { font-weight: 700; font-size: var(--step-1); line-height: 1.2; }
.sc__cta { margin-left: auto; }
.sc__hint { min-height: 52px; display: flex; align-items: center; font-weight: 600; }
@media (max-width: 599px) { .sc__cta { width: 100%; justify-content: center; margin-left: 0; } }
/* signs: picked ones drop onto the hook (spring), taken-down ones leave at once, neighbours glide over */
.sc-move { transition: transform var(--dur-base) var(--ease-out); }
.sc-enter-active { transition: transform var(--dur-slow) var(--ease-spring), opacity var(--dur-fast) var(--ease-out); }
.sc-enter-from { transform: translateY(-18px); opacity: 0; }
.sc-enter-from.is-empty { transform: none; }
.sc-leave-active { position: absolute; visibility: hidden; }
@media (min-width: 640px) {
  .sc__top { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  /* three signs side by side: the name alone, as on a real counter sign (the notes are on the menu board above) */
  .sc__note { display: none; }
  .sc__sign { align-content: end; min-height: 132px; }
  .sc__name { font-size: clamp(1.25rem, 1rem + 0.7 * var(--vw), 1.75rem); text-wrap: balance; }
}
@media (prefers-reduced-motion: reduce) { .sc-move, .sc-enter-active { transition: none; } }
</style>
