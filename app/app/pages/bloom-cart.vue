<script setup lang="ts">
// Bloom Cart (Events v2, events-v2-system.md §8). Sage is this page's own field.
//   Hero   heavy "PICK A STEM, / TAKE IT HOME" (letters rise), the flower-market photo 4:5 beside it (settles,
//          credit below). From 900 px the title shares the row with the photo instead of running over it.
//   Signature: BcSequence, a pinned camera through the same photo in three stops (cream).
//   Ideal  (yellow) "IDEAL FOR" + the seven occasions in fitted heavy caps, one per line; the custom details on a
//          brown board with a sage valance. Move: the occasions rise 60 ms apart, the board slides in from its edge.
//   Close  (cream) CloseCta.
import { credits } from '~/data/credits'
definePageMeta({ awning: 'apricot', field: 'sage' })
usePageSeo({ title: 'Bloom Cart', description: 'The Una Mattina Bloom Cart: fresh flowers in your event palette; guests pick their stems and tie a small bouquet to take home. Naples, FL.' })
const ideal = ['Bridal showers', 'Baby showers', 'Birthdays', 'Wedding showers', 'Corporate activations', 'Brunches', 'Garden parties']
const custom = ['Personalised signage', 'Branded wrap or ribbon', 'Mini vases', 'Your flower palette', 'Paired with a picnic or a live station']
const inquiry = { path: '/inquire', query: { services: 'bloom' } }
const longest = Math.max(...ideal.map(o => o.length))
</script>

<template>
  <div class="bc">
    <PageHero
      id="bc-title" layout="heavy" title="Pick a stem, take it home" :lines="['Pick a stem,', 'take it home']"
      lead="A cart of fresh flowers in your event's palette. Guests choose their stems, tie a small bouquet and take it home."
    >
      <template #actions>
        <NuxtLink :to="inquiry" class="pill pill--ink">Ask about it <span class="pill__arrow" aria-hidden="true">→</span></NuxtLink>
        <a href="#bouquet-title" class="pill pill--line">How it works <span class="pill__arrow pill__arrow--down" aria-hidden="true">↓</span></a>
      </template>
      <template #side>
        <FoundPhoto class="bc__photo" eager settle sizes="sm:100vw md:60vw lp:440px" :photo="credits.flowers" ratio="4 / 5" alt="Buckets of tulips wrapped in paper, hellebores and hyacinths at a flower-market stall" />
      </template>
    </PageHero>

    <BcSequence />

    <section v-stage="ideal.length * 60 + 700" class="ideal field-yellow sec" aria-labelledby="ideal-title">
      <div class="wrap ideal__grid">
        <div class="ideal__main">
          <RiseText id="ideal-title" :lines="['Ideal for']" size="l" />
          <ul class="ideal__list" :style="{ '--n': longest }">
            <li v-for="(o, i) in ideal" :key="o" class="ideal__o st-rise" :style="{ '--i': i, '--st-step': '60ms', '--st-d': '240ms' }">{{ o }}</li>
          </ul>
        </div>
        <Board tone="brown" valance="sage" flush="right" class="ideal__board st-side" style="--st-d: 360ms">
          <h3 class="ideal__bt">Custom details</h3>
          <ul class="ideal__rows">
            <li v-for="c in custom" :key="c" class="ideal__row">{{ c }}</li>
          </ul>
        </Board>
      </div>
    </section>

    <CloseCta :lines="['Bring the', 'Bloom Cart']" label="Ask about the Bloom Cart" :to="inquiry" field="cream" />
  </div>
</template>

<style scoped>
/* Board's valance must be out of flow from the first paint: in the production CSS order Awning's own
   position: relative can land after Board's position: absolute, so the board is 36 px taller until hydration (CLS).
   Pinned here until Board.vue raises its selector (shared-file request in the build log). */
.bc :deep(.board > .board__valance) { position: absolute; top: 0; left: 0; right: 0; }
/* ── Hero ── */
.bc__photo { width: 100%; max-width: 440px; }
/* the credit hangs on sage: logo brown for AA (5.5:1), not the muted ink */
.bc__photo :deep(.found__credit) { color: var(--ink-deep); }
/* "PICK A STEM," / "TAKE IT HOME" measure 0.61 em per capital; 0.65 keeps a 6 % margin and a bigger word */
.bc :deep(.phx__title .rt) { --cap-w: 0.65; }
@media (min-width: 900px) {
  /* the title shares the row with the photo: title + lead + actions on the left (8), the 4:5 photo on the right (4) */
  .bc :deep(.phx--heavy.phx--side .phx__body) {
    grid-template-columns: minmax(0, 8fr) minmax(0, 4fr);
    grid-template-areas: "voice side" "title side" "lead side" "actions side";
    grid-template-rows: auto auto 1fr auto; padding-top: clamp(28px, 3.4vw, 56px);
  }
  .bc :deep(.phx--heavy .phx__side) { margin-top: 0; align-self: start; }
  .bc :deep(.phx--heavy .phx__lead) { align-self: end; }
  .bc__photo { max-width: none; }
}
@media (min-width: 600px) and (max-width: 899px) { .bc__photo { max-width: 60%; } }

/* ── Ideal for ── */
.ideal__grid { display: grid; gap: var(--space-block); }
.ideal__main { display: grid; gap: var(--space-head); align-content: start; min-width: 0; }
/* seven occasions, one per line, all at the size of the longest fitted to the column */
.ideal__list { container-type: inline-size; list-style: none; margin: 0; padding: 0; display: grid; gap: 0.12em; }
.ideal__o {
  font-weight: 700; text-transform: uppercase; letter-spacing: var(--track-m); line-height: 1; white-space: nowrap;
  font-size: min(var(--display-m), calc(100cqi / (var(--n) * var(--cap-w))));
}
.board.ideal__board { align-self: end; gap: 16px; }
.ideal__bt { font-weight: 700; font-size: var(--step-2); line-height: 1.1; letter-spacing: -0.01em; text-transform: none; }
.ideal__rows { list-style: none; margin: 0; padding: 0; }
.ideal__row { padding: 11px 0 12px; border-top: 1px solid color-mix(in srgb, var(--on-field-dark) 28%, transparent); font-size: 1.0625rem; line-height: 1.35; }
.ideal__row:last-child { border-bottom: 1px solid color-mix(in srgb, var(--on-field-dark) 28%, transparent); }
@media (max-width: 899px) { .board.ideal__board { margin-left: calc(-1 * var(--gutter)); padding-left: var(--gutter); } }
@media (min-width: 900px) {
  .ideal__grid { grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); column-gap: clamp(40px, 5vw, 96px); align-items: end; }
}
</style>
