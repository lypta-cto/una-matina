<script setup lang="ts">
// Bloom Cart (Events v2, events-v2-system.md §8; round 2 after review/v2-review-2.md B1–B6).
//   Hero   the /crepes first screen: the whole flower stall full-bleed under the flat brown tint, "PICK A STEM, /
//          TAKE IT HOME" letters rising bottom-left, the brown "Custom details" board flush to the corner with a sage
//          valance (desktop; phones keep the photo clear and get the rows in the sage band). Curtain into the sheet.
//   Sheet  BcSequence: the camera goes into the same stall, three close stops (cream, pinned).
//   Ideal  (sage, Bloom's own field) "IDEAL FOR" + six occasions in fitted heavy caps, one per line. Move: the
//          occasions rise 60 ms apart. One idea before the close.
//   Close  (cream) CloseCta.
import { credits } from '~/data/credits'
definePageMeta({ hero: 'photo', awning: 'apricot', field: 'sage' })
usePageSeo({ title: 'Bloom Cart', description: 'The Una Mattina Bloom Cart: fresh flowers in your event palette; guests pick their stems and tie a small bouquet to take home. Naples, FL.' })
const stall = { ...credits.flowers, src: '/img/world/flower-market-buckets.jpg', w: 1600, h: 1066 }
const ideal = ['Bridal showers', 'Baby showers', 'Birthdays', 'Corporate activations', 'Brunches', 'Garden parties']
const custom = ['Personalized signage', 'Branded wrap or ribbon', 'Mini vases', 'Your flower palette', 'Paired with a picnic or a live station']
const inquiry = { path: '/inquire', query: { services: 'bloom' } }
const longest = Math.max(...ideal.map(o => o.length))
</script>

<template>
  <div class="bc">
    <PageHero
      id="bc-title" layout="photo" curtain
      title="Pick a stem, take it home" :lines="['Pick a stem,', 'take it home']"
      lead="A cart of fresh flowers in your event's palette. Guests choose their stems, tie a small bouquet and take it home."
      :photo="stall" :photo-mobile="credits.flowers" position="50% 60%" position-mobile="50% 40%" :tint="0.62" :tint-wide="0.6"
      alt="A flower-market stall: buckets of pink tulips in paper wraps, daisies, hellebores and hyacinths"
    >
      <template #actions>
        <NuxtLink :to="inquiry" class="pill pill--sun">Ask about it <span class="pill__arrow" aria-hidden="true">→</span></NuxtLink>
        <a href="#bouquet-title" class="pill pill--ghost">How it works <span class="pill__arrow pill__arrow--down" aria-hidden="true">↓</span></a>
      </template>
      <template #board>
        <Board tone="brown" valance="sage" drop flush="right" class="cd">
          <h2 class="cd__title">Custom details</h2>
          <ul class="cd__list">
            <li v-for="c in custom" :key="c" class="cd__row">{{ c }}</li>
          </ul>
        </Board>
      </template>
      <template #sheet>
        <BcSequence />
      </template>
    </PageHero>

    <section v-stage="ideal.length * 60 + 700" class="ideal field-sage sec" aria-labelledby="ideal-title">
      <div class="wrap ideal__grid">
        <RiseText id="ideal-title" :lines="['Ideal for']" size="l" />
        <ul class="ideal__list" :style="{ '--n': longest }">
          <li v-for="(o, i) in ideal" :key="o" class="ideal__o st-rise" :style="{ '--i': i, '--st-step': '60ms', '--st-d': '240ms' }">{{ o }}</li>
        </ul>
        <!-- phones: the custom details (the hero board is desktop only) -->
        <Board tone="brown" valance="yellow" flush="right" class="cd cd--m">
          <h3 class="cd__title">Custom details</h3>
          <ul class="cd__list">
            <li v-for="c in custom" :key="c" class="cd__row">{{ c }}</li>
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
/* fixed line boxes: the board sets the hero's height (bottom-aligned), so it must not change with the web font */
.board.cd { gap: 18px; }
.cd__title { font-weight: 700; font-size: var(--step-1); line-height: 1.2; height: 1.2em; letter-spacing: -0.01em; white-space: nowrap; text-transform: none; }
.cd__list { list-style: none; margin: 0; padding: 0; }
.cd__row { display: flex; align-items: center; height: 44px; white-space: nowrap; border-top: 1px solid color-mix(in srgb, var(--on-field-dark) 28%, transparent); font-size: 1.0625rem; line-height: 1.35; }
.cd__row:last-child { border-bottom: 1px solid color-mix(in srgb, var(--on-field-dark) 28%, transparent); }
@media (max-width: 899px) {
  .bc :deep(.phx__board) { display: none; }
  /* the outline pill crosses the white paper wraps: the brown fill PageHero gives it < 600, up to 899 */
  .bc :deep(.phx__actions .pill--ghost) { background: var(--field-dark); }
  .cd__row { height: auto; min-height: 44px; white-space: normal; padding: 8px 0; }
}

@media (min-width: 900px) and (max-height: 820px) { .cd__row { height: 38px; } }

/* ── Ideal for ── */
.ideal__grid { display: grid; gap: var(--space-head); align-items: start; }
/* six occasions, one per line, all at the size of the longest fitted to the column, with air between them */
.ideal__list { container-type: inline-size; list-style: none; margin: 0; padding: 0; display: grid; gap: 0.22em; min-width: 0; }
.ideal__o {
  font-weight: 700; text-transform: uppercase; letter-spacing: var(--track-m); line-height: 1; white-space: nowrap;
  font-size: min(var(--display-m), calc(100cqi / (var(--n) * var(--cap-w))));
}
.board.cd--m { margin-top: var(--space-tight); margin-left: calc(-1 * var(--gutter)); padding-left: var(--gutter); }
@media (min-width: 900px) {
  .ideal__grid { grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); column-gap: clamp(40px, 5vw, 96px); }
  .ideal__o { font-size: min(4.25rem, calc(100cqi / (var(--n) * var(--cap-w)))); }
  .cd--m { display: none !important; }
}
</style>
