<script setup lang="ts">
// Live Stations (Events v2, events-v2-system.md §8). Photo hero on the cannoli tray, yellow page field.
// Signature: the six stations as a menu board (the /crepes menu language): each row's rule draws, then the name and
// its note rise, 70 ms per row; rows lean on hover; a sticky frame beside it wipes to the photo or signboard of the
// row you are reading. The hero curtain slides the board's cream sheet over the picture.
// Second, quieter beat: the counter (StationCounter) on the yellow field. Close: cream.
import { credits } from '~/data/credits'
import { stations, comingLater } from '~/data/stations'
definePageMeta({ hero: 'photo', field: 'yellow', awning: 'apricot' })
usePageSeo({ title: 'Live stations', description: 'Live station catering in Naples, FL: crêpe station, tiramisu bar, fruit cup bar, charcuterie, cannoli bar and cocktail or mocktail bar, prepared in front of your guests.' })
const hero = { ...credits.cannoli, src: '/img/world/cannoli-tray.jpg', w: 1600, h: 1280 }
const later = computed(() => {
  const l = comingLater.map(x => x.replace(' & ', ' and ').toLowerCase())
  return `${l.slice(0, -1).join(', ')} and ${l.at(-1)}`
})
</script>

<template>
  <div class="ls">
    <PageHero
      id="ls-title" layout="photo" curtain title="Made in front of your guests" :lines="['Made in front', 'of your guests']"
      :photo="hero" :photo-mobile="credits.cannoli" position="50% 42%" position-mobile="50% 40%" :tint-wide="0.6"
      alt="A tray of Sicilian cannoli filled with ricotta, finished with pistachio and candied cherry"
      lead="Each station is cooked, layered or poured live by our attendants, on one modular counter that changes with the event."
    >
      <template #actions>
        <a href="#counter" class="pill pill--sun">Pick stations <span class="pill__arrow pill__arrow--down" aria-hidden="true">↓</span></a>
        <a href="#stations" class="pill pill--ghost">See all six</a>
      </template>
      <template #board>
        <Board tone="brown" valance="apricot" drop flush="right" as="nav" class="ls-hb" aria-label="The six stations">
          <a v-for="s in stations" :key="s.id" :href="`#st-${s.id}`" class="ls-hb__row"><span class="ls-hb__t">{{ s.name }}</span><span class="ls-hb__arrow" aria-hidden="true">↓</span></a>
        </Board>
      </template>
      <template #sheet>
        <!-- the menu board: the cream sheet that slides over the hero -->
        <section id="stations" class="ls-menu" aria-labelledby="menu-title">
          <div class="wrap">
            <div class="ls-menu__head">
              <RiseText id="menu-title" :lines="['Six stations,', 'all made live']" />
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
/* the ghost pill is small text over the picture: it sits on its own brown fill at every width (measured p98 4.2:1 without) */
.ls :deep(.phx__actions .pill--ghost) { background: var(--field-dark); }

/* ── hero board: the six names, each a jump to its row on the menu board ── */
.ls-hb.board { gap: 0; padding-bottom: clamp(20px, 3svh, 36px); }
.ls-hb__row {
  display: flex; align-items: baseline; justify-content: space-between; gap: 16px; padding: 7px 0; min-height: 44px;
  color: inherit; text-decoration: none; touch-action: manipulation;
}
.ls-hb__t { font-weight: 700; font-size: clamp(1.1875rem, 1rem + 0.5 * var(--vw), 1.5rem); line-height: 1.15; letter-spacing: -0.01em; transition: transform 280ms var(--ease-out); }
.ls-hb__arrow { font-weight: 600; opacity: 0; transform: translateY(-4px); transition: opacity 200ms var(--ease-out), transform 280ms var(--ease-out); }
.ls-hb__row:focus-visible { outline-offset: 2px; }
.ls-hb__row:focus-visible .ls-hb__arrow { opacity: 1; transform: none; }
@media (hover: hover) and (pointer: fine) {
  .ls-hb__row:hover .ls-hb__t { transform: translateX(6px); }
  .ls-hb__row:hover .ls-hb__arrow { opacity: 1; transform: none; }
}
/* phones and tablets (the board is a band under the lead): two columns of names, so the band stays short */
@media (max-width: 899px) {
  .ls-hb.board { grid-template-columns: repeat(2, minmax(0, 1fr)); column-gap: 16px; }
  .ls-hb__t { font-size: 1.0625rem; }
  .ls-hb__row { align-items: center; }
  .ls-hb__arrow { display: none; }
}
@media (min-width: 600px) and (max-width: 899px) { .ls-hb__t { font-size: 1.25rem; } }

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
