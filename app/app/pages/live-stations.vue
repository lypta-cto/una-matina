<script setup lang="ts">
// Live Stations (Events v2, events-v2-system.md §8). Photo hero on the cannoli tray, yellow page field.
// Signature: the six stations as a menu board (the /crepes menu language): each row's rule draws, then the name and
// its note rise, 70 ms per row; rows lean on hover; a sticky frame beside it wipes to the photo or signboard of the
// row you are reading. The hero curtain slides the board's cream sheet over the picture.
// Second, quieter beat: the counter (StationCounter) on the yellow field. Close: cream.
import { credits } from '~/data/credits'
import { stations, comingLater } from '~/data/stations'
definePageMeta({ hero: 'photo', field: 'yellow', awning: 'apricot' })
usePageSeo({ title: 'Live stations', description: 'Live station catering in Naples, FL: crêpe station, tiramisu bar, fruit cup bar, charcuterie, cannoli bar and cocktail or mocktail bar, made live at your party by our own attendants.' })
const featured = stations[0]!
const hero = { ...credits.cannoli, src: '/img/world/cannoli-tray.jpg', w: 1600, h: 1280 }
const later = computed(() => {
  const l = comingLater.map(x => x.replace(' & ', ' and ').toLowerCase())
  return `${l.slice(0, -1).join(', ')} and ${l.at(-1)}`
})
</script>

<template>
  <div class="ls">
    <PageHero
      id="ls-title" layout="photo" curtain title="At the party, not before it" :lines="['At the party,', 'not before it']"
      :photo="hero" :photo-mobile="credits.cannoli" position="50% 20%" position-mobile="50% 40%" :tint-wide="0.66"
      alt="A tray of Sicilian cannoli filled with ricotta, finished with pistachio and candied cherry"
      lead="Each station is cooked, layered or poured live by our attendants, on one modular counter that changes with the event."
    >
      <template #actions>
        <a href="#counter" class="pill pill--sun">Pick stations <span class="pill__arrow pill__arrow--down" aria-hidden="true">↓</span></a>
      </template>
      <template #board>
        <!-- one featured station (the one we started with), not a third copy of the six names -->
        <Board tone="brown" valance="apricot" drop flush="right" class="ls-hb">
          <p class="ls-hb__t">{{ featured.name }}</p>
          <p class="ls-hb__note italic-line"><Tbc note="station description">{{ featured.note }}</Tbc></p>
          <a href="#stations" class="pill pill--s pill--ghost ls-hb__all">All six stations <span class="pill__arrow pill__arrow--down" aria-hidden="true">↓</span></a>
        </Board>
      </template>
      <template #sheet>
        <!-- the menu board: the cream sheet that slides over the hero -->
        <section id="stations" class="ls-menu" aria-labelledby="menu-title">
          <div class="wrap">
            <div class="ls-menu__head">
              <RiseText id="menu-title" :lines="['Six stations', 'to pick from']" />
              <p class="statement ls-menu__side">Every station is run by our own attendants, and dressed with our own flowers.</p>
            </div>
            <LsStationList />
          </div>
        </section>
      </template>
    </PageHero>

    <!-- the counter: the second, quieter beat -->
    <section id="counter" class="ls-counter" aria-labelledby="counter-title">
      <div class="wrap ls-counter__grid">
        <div class="ls-counter__text">
          <RiseText id="counter-title" :lines="['One counter,', 'many stations']" />
          <p class="lead ls-counter__body">One base, changed for each concept: griddles for crêpes, cold wells for fruit and tiramisu, ice for the bar. Pick up to three to see your counter, then ask us about it.</p>
          <p class="ls-counter__later">Coming later: {{ later }}.</p>
        </div>
        <StationCounter class="ls-counter__sc" />
      </div>
    </section>

    <CloseCta field="cream" :lines="['Pick your', 'stations']" label="Ask about stations" :to="{ path: '/inquire', query: { services: 'stations' } }" />
  </div>
</template>

<style scoped>
/* ── hero board: the featured station ── */
.ls-hb.board { gap: 8px; padding-bottom: clamp(22px, 3svh, 36px); }
.ls-hb__t { font-weight: 700; font-size: clamp(1.5rem, 1.2rem + 0.9 * var(--vw), 2.25rem); line-height: 1.05; letter-spacing: -0.015em; }
.ls-hb__note { font-size: clamp(1.0625rem, 1rem + 0.25 * var(--vw), 1.25rem); line-height: 1.35; max-width: 30ch; }
.ls-hb__all { justify-self: start; margin-top: 10px; }

/* ── the menu board (cream sheet) ── */
.ls-menu { padding-block: var(--space-section); }
.ls-menu__head { display: grid; gap: var(--space-tight) clamp(32px, 5vw, 96px); margin-bottom: var(--space-head); }
.ls-menu__side { max-width: 24ch; font-size: clamp(1.25rem, 1.05rem + 0.6 * var(--vw), 1.75rem); }
@media (min-width: 900px) {
  .ls-menu__head { grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); align-items: end; }
}

/* ── the counter (yellow) ── */
.ls-counter { background: var(--field); color: var(--ink); padding-block: var(--space-section); }
.ls-counter__grid { display: grid; grid-template-columns: minmax(0, 1fr); gap: var(--space-block); }
.ls-counter__body { margin-top: var(--space-tight); }
.ls-counter__later { margin-top: 22px; font-size: 1rem; line-height: 1.5; max-width: 40ch; }
@media (min-width: 1100px) {
  .ls-counter__grid { grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: clamp(40px, 5vw, 96px); align-items: start; }
  .ls-counter__text { position: sticky; top: 120px; }
}
</style>
