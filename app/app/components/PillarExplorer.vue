<script setup lang="ts">
// Home's live thing: choose a service (or all three) and see which pieces of an example party it covers.
// Starts on Planning so the contrast (4 of 8 lit) explains the idea before anyone clicks.
// Motion: the chosen row's apricot plank is painted left → right; covered pieces get a yellow plank painted in
// a short cascade (20 ms, capped at 3 steps); pieces that drop out un-paint at once (system response, no delay).
import { examplePieces, pillars, type PillarId } from '~/data/pillars'
type Sel = PillarId | 'all'
const sel = ref<Sel>('planning')
const rows = [...pillars.map(p => ({ id: p.id as Sel, name: p.name, line: p.line })), { id: 'all' as Sel, name: 'All three', line: 'One team from the first call to the last box packed.' }]
const isOn = (by: PillarId) => sel.value === 'all' || sel.value === by
const short = (id: PillarId) => pillars.find(p => p.id === id)!.short
const to = computed(() => ({ path: '/inquire', query: { services: sel.value === 'all' ? 'planning,design,stations' : sel.value } }))
const status = computed(() => {
  const n = examplePieces.filter(p => isOn(p.by)).length
  const who = sel.value === 'all' ? 'All three' : pillars.find(p => p.id === sel.value)!.name
  return `${who}: covers ${n} of ${examplePieces.length} pieces of the example party.`
})
const ctaLabel = computed(() => (sel.value === 'all' ? 'Start with all three' : `Ask about ${pillars.find(p => p.id === sel.value)!.short.toLowerCase()}`))
</script>

<template>
  <div class="px">
    <div class="px__rows" role="group" aria-label="Choose a service to see what it covers">
      <button v-for="r in rows" :key="r.id" type="button" class="px__row" :aria-pressed="sel === r.id" @click="sel = r.id">
        <span class="px__name">{{ r.name }}</span>
        <span class="px__line">{{ r.line }}</span>
      </button>
      <NuxtLink to="/services" class="link px__all">Everything in each part</NuxtLink>
    </div>
    <div class="px__party">
      <p class="px__title">Example: a backyard 40th, 50 guests</p>
      <p class="px__note">An example scope, not a past event.</p>
      <p class="sr-only" aria-live="polite">{{ status }}</p>
      <ul class="px__list">
        <li v-for="(p, i) in examplePieces" :key="p.name" class="px__piece" :class="{ 'is-on': isOn(p.by) }" :style="{ '--i': Math.min(examplePieces.filter((q, j) => j < i && isOn(q.by)).length, 3) }">
          <span class="px__pname">{{ p.name }}</span>
          <span class="px__by">{{ short(p.by) }}<template v-if="p.partner">, with a partner</template><span v-if="!isOn(p.by)" class="sr-only"> (not included)</span></span>
        </li>
      </ul>
      <NuxtLink :to="to" class="btn btn-primary px__cta">{{ ctaLabel }}</NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.px { display: grid; gap: clamp(28px, 4vw, 56px); align-items: start; }
.px__rows { display: flex; flex-wrap: wrap; gap: 8px; align-content: start; }
.px__row {
  position: relative; isolation: isolate; text-align: left; border: 0; cursor: pointer; color: var(--ink); font: inherit;
  background: var(--surface); padding: 12px 16px; min-height: 48px; display: grid; gap: 2px; touch-action: manipulation;
}
.px__row::before { content: ""; position: absolute; inset: 0; z-index: -1; background: var(--accent); transform: scaleX(0); transform-origin: left; transition: transform var(--dur-fast) var(--ease-out); }
.px__row[aria-pressed="true"]::before { transform: scaleX(1); transition-duration: var(--dur-base); }
.px__row[aria-pressed="true"] { color: var(--ink-deep); }
/* not colour alone: the pressed row also carries a brown edge */
.px__row::after { content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: var(--ink-deep); transform: scaleY(0); transition: transform var(--dur-fast) var(--ease-out); }
.px__row[aria-pressed="true"]::after { transform: scaleY(1); transition-duration: var(--dur-base); }
.px__row:active { transform: translateY(1px); }
.px__name { font-weight: 600; font-size: 1rem; }
.px__line { display: none; }
.px__all { font-weight: 600; flex-basis: 100%; margin-top: 8px; }
.px__party { position: relative; }
.px__title { font-weight: 600; font-size: var(--step-1); }
.px__note { color: var(--ink-muted); font-size: 0.9375rem; margin-top: 2px; }
.px__list { list-style: none; margin: 18px 0 24px; padding: 0; display: grid; gap: 4px; }
.px__piece { position: relative; isolation: isolate; display: flex; justify-content: space-between; gap: 16px; padding: 12px 14px; color: var(--ink-muted); transition: color var(--dur-base) var(--ease-out); }
.px__piece::before { content: ""; position: absolute; inset: 0; z-index: -1; background: var(--field); transform: scaleX(0); transform-origin: left; transition: transform var(--dur-fast) var(--ease-out); }
.px__piece.is-on { color: var(--ink); }
.px__piece.is-on::before { transform: scaleX(1); transition: transform var(--dur-base) var(--ease-out) calc(var(--i) * 20ms); }
.px__pname { font-weight: 600; font-size: var(--step-1); line-height: 1.25; }
.px__by { font-size: 0.9375rem; text-align: right; align-self: center; }
@media (min-width: 900px) {
  .px { grid-template-columns: 5fr 7fr; }
  .px__rows { display: grid; gap: 8px; }
  .px__row { padding: 22px 26px; gap: 6px; }
  .px__name { font-family: var(--font-display); font-weight: 500; text-transform: uppercase; letter-spacing: 0.03em; font-size: var(--step-2); line-height: 1.05; }
  .px__line { display: block; font-size: 1rem; line-height: 1.45; }
  .px__party { position: sticky; top: 96px; }
}
@media (prefers-reduced-motion: reduce) { .px__row::before, .px__row::after, .px__piece::before { transition: none !important; } }
</style>
