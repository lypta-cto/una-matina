<script setup lang="ts">
import { comingLater } from '~/data/stations'
definePageMeta({ awning: 'apricot', field: 'yellow' })
usePageSeo({ title: 'Live stations', description: 'Live station catering in Naples, FL: crêpe station, tiramisu bar, fruit cup bar, charcuterie, cannoli bar and cocktail or mocktail bar, prepared in front of your guests.' })
const later = computed(() => {
  const l = comingLater.map(x => x.replace(' & ', ' and ').toLowerCase())
  return `${l.slice(0, -1).join(', ')} and ${l.at(-1)}`
})
</script>

<template>
  <div class="ls">
    <!-- L1: type-led hero, the headline is the picture until real griddle footage exists -->
    <PageHero id="ls-title" layout="type" title="Made in front of your guests" lead="One modular counter that changes with the event, dressed with our own florals.">
      <template #actions><a href="#counter" class="btn btn-primary">Set up your counter</a></template>
      <template #side><p class="statement">Every station is cooked, layered or poured live by our attendants.</p></template>
    </PageHero>

    <!-- L2: the six stations beside a sticky frame that follows the row you are reading -->
    <section class="wrap list" aria-labelledby="list-title">
      <div class="list__head">
        <h2 id="list-title" v-lines class="sign-l">Six stations</h2>
      </div>
      <LsStationList data-tbc data-tbc-note="station descriptions" />
    </section>

    <!-- L3: the modular base and the live counter, one cream-deep band -->
    <section id="counter" class="base" aria-labelledby="base-title">
      <div class="wrap base__grid">
        <div class="base__text">
          <h2 id="base-title" v-lines class="sign-m">One counter, many stations</h2>
          <p class="base__body">One elegant base, changed for each concept: griddles and batter for crêpes, cold wells for fruit and tiramisu, ice bins for the bar, serving tools for charcuterie. Our own florals dress every station.</p>
          <p class="statement base__later">Coming later: {{ later }}.</p>
        </div>
        <StationCounter v-reveal="200" class="base__counter" />
      </div>
    </section>

    <CloseCta :lines="['Pick your', 'stations']" label="Ask about stations" :to="{ path: '/inquire', query: { services: 'stations' } }" />
  </div>
</template>

<style scoped>
/* sign-xl, capped so "MADE IN FRONT" / "OF YOUR GUESTS" stay two lines from 600px up */
@media (min-width: 600px) { .ls :deep(.ph__title) { font-size: min(var(--step-5), calc(8 * var(--vw) + 0.5rem)); } }

.list { padding-block: var(--section); }
.list__head { display: grid; gap: 12px; margin-bottom: clamp(40px, 5vw, 72px); }

.base { background: var(--surface); padding-block: var(--section); }
.base__grid { display: grid; grid-template-columns: minmax(0, 1fr); gap: clamp(40px, 5vw, 56px); }
.base__body { margin-top: 20px; font-size: var(--step-1); line-height: 1.45; max-width: 40ch; }
.base__later { margin-top: 28px; font-size: var(--step-1); max-width: 34ch; }
@media (min-width: 1100px) {
  .base__grid { grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: clamp(40px, 4vw, 72px); align-items: start; }
}
</style>
