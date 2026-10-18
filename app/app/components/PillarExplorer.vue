<script setup lang="ts">
// Home's live thing (Events v2): choose a part of the service (or all three) and see which pieces of an example party
// it covers. Left: four heavy caps rows (display-m, fitted to the column); the chosen one is painted onto an apricot
// pill. Right: the example party as a ruled board (cream-deep) whose covered rows get a yellow plank and a filled dot.
// Starts on Planning so the contrast (five of eight lit) explains the idea before anyone clicks.
// Motion: the chosen pill is painted left → right (clip-path, 420 ms); covered rows are painted in a short cascade
// (20 ms, capped at 3 steps); rows that drop out un-paint at once (system response, no delay). Entry (v-stage on the
// parent section): rows rise 80 ms apart, the board slides in from its side. Reduced motion: colour swaps only.
import { examplePieces, pillars, type PillarId } from '~/data/pillars'
type Sel = PillarId | 'all'
const sel = ref<Sel>('planning')
const rows = [...pillars.map(p => ({ id: p.id as Sel, label: p.short, name: p.name, line: p.line })), { id: 'all' as Sel, label: 'All three', name: 'All three', line: 'One team from the first call to the last box packed.' }]
const isOn = (by: PillarId) => sel.value === 'all' || sel.value === by
const short = (id: PillarId) => pillars.find(p => p.id === id)!.short
const words = ['none', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten']
const n = computed(() => examplePieces.filter(p => isOn(p.by)).length)
const who = computed(() => (sel.value === 'all' ? 'All three' : pillars.find(p => p.id === sel.value)!.short))
const count = computed(() => `${who.value} ${sel.value === 'all' ? 'cover' : 'covers'} ${words[n.value] ?? n.value} of ${words[examplePieces.length] ?? examplePieces.length}.`)
const status = computed(() => `${who.value}: covers ${n.value} of ${examplePieces.length} pieces of the example party.`)
const to = computed(() => ({ path: '/inquire', query: { services: sel.value === 'all' ? 'planning,design,stations' : sel.value } }))
const ctaLabel = computed(() => (sel.value === 'all' ? 'Start with all three' : `Ask about ${pillars.find(p => p.id === sel.value)!.short.toLowerCase()}`))
const longest = Math.max(...rows.map(r => Array.from(r.label).length))
</script>

<template>
  <div class="px">
    <div class="px__pick">
      <div class="px__rows" role="group" aria-label="Choose a part to see what it covers">
        <button v-for="(r, i) in rows" :key="r.id" type="button" class="px__row st-rise" :style="{ '--i': i }" :aria-pressed="sel === r.id" :aria-describedby="`px-say-${r.id}`" @click="sel = r.id">
          <span class="px__fit" :style="{ '--fit-n': longest }"><span class="px__name display-m"><span class="px__pill" aria-hidden="true" /><span class="px__label">{{ r.label }}</span></span></span>
        </button>
      </div>
      <!-- what the chosen part covers, in one sentence: all four share one cell (sized by the longest), so choosing
           never moves anything; the new line rises out of the cell's lower edge as the old one drops away -->
      <div class="px__say st-in" style="--i: 4">
        <p v-for="r in rows" :id="`px-say-${r.id}`" :key="r.id" class="px__sayline statement" :class="{ 'is-on': sel === r.id }">{{ r.line }}</p>
      </div>
      <NuxtLink to="/services" class="link px__all st-in" style="--i: 5">Everything in each part</NuxtLink>
    </div>
    <Board tone="deep" class="px__party st-side" style="--i: 2">
      <h3 class="px__title title-board">Example: a backyard 40th, 50 guests</h3>
      <p class="px__note">An example scope, not a past event.</p>
      <p class="sr-only" aria-live="polite">{{ status }}</p>
      <table class="px__list">
        <caption class="sr-only">Pieces of the example party and which part covers each</caption>
        <thead class="sr-only"><tr><th scope="col">Piece</th><th scope="col">Covered by</th></tr></thead>
        <tbody>
          <tr v-for="(p, i) in examplePieces" :key="p.name" class="px__piece" :class="{ 'is-on': isOn(p.by) }" :style="{ '--k': Math.min(examplePieces.filter((q, j) => j < i && isOn(q.by)).length, 3) }">
            <th scope="row" class="px__pname"><span class="px__dot" aria-hidden="true" />{{ p.name }}<span v-if="p.partner" class="px__with"><span class="sr-only">, </span>with a partner</span></th>
            <td class="px__by">{{ short(p.by) }}<span v-if="!isOn(p.by)" class="sr-only"> (not included)</span></td>
          </tr>
        </tbody>
      </table>
      <div class="px__foot">
        <p class="px__count" aria-hidden="true">{{ count }}</p>
        <NuxtLink :to="to" class="pill pill--sun pill--on-light px__cta">{{ ctaLabel }} <span class="pill__arrow" aria-hidden="true">→</span></NuxtLink>
      </div>
    </Board>
  </div>
</template>

<style scoped>
.px { display: grid; grid-template-columns: minmax(0, 1fr); gap: clamp(36px, 5vw, 72px); align-items: start; }
.px__pick { display: grid; gap: 18px; justify-items: start; min-width: 0; }
.px__rows { display: grid; gap: 4px; width: 100%; }
.px__row {
  display: block; width: 100%; text-align: left; border: 0; background: none; cursor: pointer;
  color: var(--ink-muted); font: inherit; padding: 8px 0; touch-action: manipulation; -webkit-tap-highlight-color: transparent;
}
.px__row[aria-pressed="true"] { color: var(--ink-deep); }
.px__row:focus-visible { outline-offset: 2px; }
/* the name: heavy caps, fitted so the longest label ("Design & florals") stays on one line in its column */
.px__fit { display: block; width: 100%; container-type: inline-size; }
.px__name {
  position: relative; isolation: isolate; display: inline-block; white-space: nowrap; line-height: 1;
  font-size: min(var(--display-m), calc((100cqi - 0.9em) / (var(--fit-n) * var(--cap-w))));
  padding: 0.14em 0.45em 0.1em; margin-left: -0.45em;
  transition: transform var(--dur-base) var(--ease-out);
}
/* the pill: painted left → right when chosen, gone at once when not (system response) */
.px__pill { position: absolute; inset: 0; z-index: -1; border-radius: 999px; background: var(--accent); clip-path: inset(0 100% 0 0 round 999px); transition: clip-path var(--dur-fast) var(--ease-out); }
.px__row[aria-pressed="true"] .px__pill { clip-path: inset(0 0 0 0 round 999px); transition-duration: 420ms; }
@media (hover: hover) and (pointer: fine) {
  .px__row:not([aria-pressed="true"]):hover { color: var(--ink); }
  .px__row:not([aria-pressed="true"]):hover .px__name { transform: translateX(6px); }
}
.px__row:active .px__name { transform: scale(0.98); }
.px__say { display: grid; width: 100%; max-width: 34ch; overflow: clip; overflow-clip-margin: 0.3em; margin-top: 6px; }
.px__sayline {
  grid-area: 1 / 1; font-size: var(--step-1); line-height: 1.35; color: var(--ink);
  visibility: hidden; opacity: 0; transform: translateY(60%);
  transition: transform var(--dur-base) var(--ease-out), opacity 120ms var(--ease-out), visibility 0s linear var(--dur-base);
}
:global(html:not(.js)) .px__say { gap: 12px; }
:global(html:not(.js)) .px__sayline { grid-area: auto; visibility: visible; opacity: 1; transform: none; } /* no JS: every part's sentence */
.px__sayline.is-on { visibility: visible; opacity: 1; transform: none; transition: transform var(--dur-slow) var(--ease-out) 120ms, opacity var(--dur-base) var(--ease-out) 120ms, visibility 0s; }
.px__all { font-weight: 600; display: inline-block; padding-block: 10px; }

/* the example party: a ruled board */
.px__party { gap: 0; }
.px__title { font-size: var(--step-2); }
.px__note { color: var(--ink-muted); font-size: 0.9375rem; margin-top: 6px; }
/* a real table (piece | covered by), ruled like the /crepes menu board */
.px__list { width: 100%; margin: 22px 0 0; border-collapse: collapse; border-top: 1px solid var(--line); }
.px__piece { position: relative; color: var(--ink-muted); transition: color var(--dur-base) var(--ease-out); }
.px__piece > * { border-bottom: 1px solid var(--line); padding: 12px; vertical-align: middle; }
/* the plank behind a covered row: painted left → right in a short cascade, gone at once when the row drops out */
.px__piece::after { content: ""; position: absolute; inset: 0 0 1px; z-index: -1; background: var(--field); transform: scaleX(0); transform-origin: left; transition: transform var(--dur-fast) var(--ease-out); }
.px__list tbody { position: relative; z-index: 0; }
.px__piece.is-on { color: var(--ink); }
.px__piece.is-on::after { transform: scaleX(1); transition: transform var(--dur-slow) var(--ease-out) calc(var(--k) * 20ms); }
/* not colour alone: a filled dot for a covered piece, a ring for one this part leaves out */
.px__dot { display: inline-block; width: 10px; height: 10px; margin-right: 12px; border-radius: 50%; border: 2px solid currentColor; vertical-align: 0.05em; transition: background-color var(--dur-base) var(--ease-out); }
.px__piece.is-on .px__dot { background: currentColor; }
.px__pname { text-align: left; font-weight: 600; font-size: 1.125rem; line-height: 1.25; }
.px__by { font-size: 0.9375rem; text-align: right; }
.px__with { display: block; margin: 2px 0 0 22px; font-weight: 400; font-size: 0.9375rem; }
.px__by { white-space: nowrap; }

.px__foot { display: grid; gap: 16px; justify-items: start; margin-top: 24px; }
.px__count { font-weight: 700; font-size: var(--step-1); line-height: 1.2; letter-spacing: -0.01em; }
@media (max-width: 599px) {
  .px__by { font-size: 0.875rem; }
  .px__cta { width: 100%; }
  .px__party { margin-inline: calc(-1 * var(--gutter)); padding-inline: var(--gutter); }
}
@media (min-width: 900px) {
  .px { grid-template-columns: minmax(0, 6fr) minmax(0, 6fr); }
  .px__rows { gap: 6px; }
  .px__row { padding: 10px 0; }
  .px__pname { font-size: 1.25rem; }
}
@media (min-width: 1200px) { .px { grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); } }
@media (prefers-reduced-motion: reduce) { .px__pill, .px__piece::after, .px__name, .px__sayline { transition: none !important; transform: none !important; } }
</style>
