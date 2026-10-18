<script setup lang="ts">
import { credits } from '~/data/credits'
import { markets } from '~/data/markets'
// The live market line only once the client has confirmed at least one market; until then no day or time is shown.
const marketsConfirmed = markets.some(m => !m.tbc)
definePageMeta({ hero: 'photo', field: 'yellow' })
// Desktop: the full 1600 × 1200 original; phones: the credited 4:5 crop.
const heroPhoto = { ...credits.griddle, src: '/img/world/crepe-griddle.jpg', w: 1600, h: 1200 }
usePageSeo({ title: 'About', description: 'Una Mattina means "one morning". We started with crêpes at the Naples farmers markets; Events & Catering is next, and one day a café.' })
// Events v2 (events-v2-system.md §8 About, review 2): a photo-led first screen (the crêpe on the griddle: "it started
// with a crêpe"), whose letter rise lands on the Ê (its circumflex drops last, page CSS); the brown market board with
// its valance; curtain into the cream sheet → three suns at three heights → the sign flip (signature) → the title over
// the lemons band → who we are (a statement board) → close.
// Motion budget: hero load + curtain · suns (scrubbed) · sign flip · band title rise · board title rise · close.
// Three positions of the same sun: low over the market, higher for events, fully up for the café.
const stages = [
  { id: 'market', t: ['Market,', 'today'], rise: 0.3, d: 'Crêpes at the Naples farmers markets, where we try every new recipe first.' },
  { id: 'events', t: ['Events,', 'next'], rise: 0.65, d: 'Planning, our own florals and stations made in front of your guests, at your home or on the beach.' },
  { id: 'cafe', t: ['A café,', 'one day'], rise: 1, d: 'An Una Mattina café: a place for mornings.' },
]

// The suns climb out from behind the horizon to their heights. Where the browser has scroll-driven animations the rise
// is scrubbed by the scroll (pure CSS); elsewhere it plays once when the horizon enters view. Final position is the
// default (no JS, reduced motion).
const sky = ref<HTMLElement>()
const waiting = ref(false)
const risen = ref(false)
let io: IntersectionObserver | undefined
onMounted(() => {
  const el = sky.value
  if (!el || !('IntersectionObserver' in window)) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const scrubbed = CSS.supports?.('animation-timeline: view()')
  if (!scrubbed) {
    if (el.getBoundingClientRect().top < window.innerHeight * 0.85) return
    waiting.value = true
  }
  // Once it is morning it stays morning: when the horizon passes 40 % from the top the suns are fully up
  // (the scrub ends there), so the scrub is dropped and scrolling back up never sets them again.
  io = new IntersectionObserver((entries) => {
    if (!entries.some(e => e.isIntersecting || e.boundingClientRect.top < 0)) return
    if (scrubbed) risen.value = true
    else waiting.value = false
    io?.disconnect()
  }, { rootMargin: scrubbed ? '0px 0px -60% 0px' : '0px 0px -20% 0px' })
  io.observe(el)
})
onBeforeUnmount(() => io?.disconnect())
</script>

<template>
  <div>
    <div class="ab-hero">
      <PageHero
        id="about-title" layout="photo" curtain title="It started with a crêpe" :lines="['It started', 'with a crêpe']"
        :photo="heroPhoto" :photo-mobile="credits.griddle" position="50% 62%" position-mobile="50% 40%" :tint="0.66" :tint-wide="0.6"
        alt="A thin crêpe cooking on a round cast-iron griddle on a steel counter"
      >
        <template #lead><i lang="it">Una mattina</i> means "one morning" in Italian. Ours start at the farmers market, with a cream tent, a striped apron and a griddle.</template>
        <template #actions>
          <NuxtLink to="/inquire" class="pill pill--sun">Start an inquiry <span class="pill__arrow" aria-hidden="true">→</span></NuxtLink>
          <a href="#story" class="pill pill--ghost">Our story <span class="pill__arrow pill__arrow--down" aria-hidden="true">↓</span></a>
        </template>
        <template #board>
          <Board tone="brown" valance="apricot" drop flush="right" class="ab-board">
            <p class="title-board ab-board__t">Crêpes at the market</p>
            <MarketStatus v-if="marketsConfirmed" />
            <p v-else class="ab-board__p">Find us at the Naples farmers markets.</p>
            <NuxtLink to="/crepes" class="link link-draw ab-board__link">Find the stand <span aria-hidden="true">→</span></NuxtLink>
          </Board>
        </template>

        <template #sheet>
          <!-- one sun at three heights over a real horizon: sky on cream, the land is a cream-deep band -->
          <section id="story" class="stages" aria-labelledby="stages-title">
            <h2 id="stages-title" class="sr-only">Market, events, café</h2>
            <div class="wrap">
              <div ref="sky" class="stages__sky" :class="{ 'is-waiting': waiting, 'is-risen': risen }" aria-hidden="true">
                <span v-for="s in stages" :key="s.id" class="stages__cell"><span class="stages__sun" :style="{ '--rise': s.rise }" /></span>
              </div>
            </div>
            <div class="stages__land">
              <ol class="wrap stages__list">
                <li v-for="s in stages" :key="s.id" class="stage">
                  <!-- phones: each stage has its own small horizon, so every sun stands over its stage -->
                  <span class="stage__sky" aria-hidden="true"><span class="stage__sun" :style="{ '--rise': s.rise }" /></span>
                  <h3 class="display-m stage__t">{{ s.t[0] }}<br>{{ s.t[1] }}</h3>
                  <p class="stage__d">{{ s.d }}</p>
                </li>
              </ol>
            </div>
          </section>
        </template>
      </PageHero>
    </div>

    <!-- signature: the mark turns from the sunrise A into the crêpe cone (apricot field) -->
    <section class="mark field-apricot" aria-labelledby="mark-title">
      <div class="wrap mark__grid">
        <div class="mark__text">
          <RiseText id="mark-title" :lines="['One mark,', 'two mornings']" size="l" />
          <p class="mark__hint">Tap or click the sign to turn it.</p>
        </div>
        <SignFlip class="mark__flip" :captions="['The A in our name is a sunrise.', 'Upside down, a crêpe in its cone.']" />
      </div>
    </section>

    <!-- the title over the lemons band; the words of the morning below it -->
    <section class="med" aria-labelledby="med-title">
      <FoundPhoto class="med__photo" bleed :photo="credits.lemons" ratio="21 / 9" :tint="0.62" credit="over" :parallax="0.07" alt="Amalfi lemons with their leaves hanging against a white wall">
        <div class="wrap med__over">
          <RiseText id="med-title" class="med__title" :lines="['Mediterranean', 'mornings']" size="l" />
        </div>
      </FoundPhoto>
      <div class="wrap med__grid">
        <p class="med__body">Coffee, something warm from the griddle, fruit, flowers on the table and nowhere to be. That's the morning we cook for, whether it's a Saturday at the market or a party in your backyard.</p>
      </div>
    </section>

    <!-- who we are: until the founders' portrait exists, words on a board (no stand-in picture) -->
    <section class="team field-deep" aria-labelledby="team-title">
      <div class="wrap">
        <Board tone="brown" valance="apricot" class="team__board" data-shoot-slot="founders' portrait">
          <RiseText id="team-title" class="team__title" :lines="['Who we are']" size="l" />
          <p class="statement team__s">The team from the crêpe stand runs your party, with the florists and staff we trust.</p>
          <NuxtLink to="/crepes" class="pill pill--ghost team__pill">Say hello at the market <span class="pill__arrow" aria-hidden="true">→</span></NuxtLink>
        </Board>
      </div>
    </section>

    <CloseCta :lines="['Bring us', 'your morning']" />
  </div>
</template>

<style scoped>
/* ── hero: the market board (brown, apricot valance, flush right on desktop) ── */
.ab-board.board { gap: 10px; }
.ab-board__t { margin-bottom: 2px; }
.ab-board__p { font-size: 1.0625rem; line-height: 1.5; max-width: 30ch; }
.ab-board__link { display: inline-block; justify-self: start; padding-block: 9px; font-weight: 600; }
/* the letter rise lands on the Ê: the E rises with the other letters, then its circumflex drops onto it with the
   turn spring (the /crepes CRÊPES move). The cell's own glyph is clipped below the circumflex; a copy of the glyph,
   clipped to the circumflex only, falls into place. Final state without the animation = the plain Ê. */
.ab-hero { --hat: 0.07em; --hat-ink: var(--on-field-dark); }
.ab-hero.ab-hero :deep(.rt__line:nth-child(2) .rt__word:nth-child(3) .rt__mask:nth-child(3) .rt__c) { position: relative; color: transparent; }
.ab-hero.ab-hero :deep(.rt__line:nth-child(2) .rt__word:nth-child(3) .rt__mask:nth-child(3) .rt__c)::before,
.ab-hero.ab-hero :deep(.rt__line:nth-child(2) .rt__word:nth-child(3) .rt__mask:nth-child(3) .rt__c)::after {
  content: "Ê" / ""; position: absolute; left: 0; top: 0; color: var(--hat-ink);
}
.ab-hero.ab-hero :deep(.rt__line:nth-child(2) .rt__word:nth-child(3) .rt__mask:nth-child(3) .rt__c)::before { clip-path: inset(var(--hat) -0.2em -0.3em -0.2em); }
.ab-hero.ab-hero :deep(.rt__line:nth-child(2) .rt__word:nth-child(3) .rt__mask:nth-child(3) .rt__c)::after {
  clip-path: inset(-0.6em -0.2em calc(100% - var(--hat)) -0.2em); animation: ab-hat 700ms var(--spring-turn) 1320ms both;
}
/* until it drops, the hat waits far above the mask (the E below it is still rising out of its own mask) */
@keyframes ab-hat { 0% { transform: translateY(-2em); } 0.1% { transform: translateY(-0.62em); } }
@media (prefers-reduced-motion: reduce) { .ab-hero.ab-hero :deep(.rt__line:nth-child(2) .rt__word:nth-child(3) .rt__mask:nth-child(3) .rt__c)::after { animation: none; } }

/* ── stages: the sky row and the text row share one column template, so each sun stands over its own stage.
   The sky clips at its bottom edge, which is the top edge of the land band: the horizon is a change of tone. ── */
.stages { padding-top: calc(var(--space-section) * 0.7); }
.stages__sky, .stages__list { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); column-gap: clamp(16px, 4vw, 48px); }
.stages__sky { --d: clamp(76px, 24vw, 132px); height: calc(var(--d) * 1.1); overflow: clip; }
.stages__cell { position: relative; display: block; }
.stages__sun {
  position: absolute; left: 0; top: 100%; width: var(--d); height: var(--d); border-radius: 50%; background: var(--accent);
  transform: translateY(calc(var(--rise) * -100%)); transition: transform var(--dur-slow) var(--ease-out);
}
.stages__cell:nth-child(2) .stages__sun { transition-delay: 120ms; }
.stages__cell:nth-child(3) .stages__sun { transition-delay: 240ms; }
.stages__sky.is-waiting .stages__sun { transform: none; transition: none; }
@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    .stages__sky { view-timeline: --sunrise block; }
    .stages__sun { transition: none; animation: sun-rise both var(--ease-out); animation-timeline: --sunrise; animation-range: cover 0% cover 30%; }
    .stages__cell:nth-child(2) .stages__sun { animation-range: cover 8% cover 40%; }
    .stages__cell:nth-child(3) .stages__sun { animation-range: cover 16% cover 50%; }
    .stages__sky.is-risen .stages__sun { animation: none; }
  }
}
@keyframes sun-rise { from { transform: none; } to { transform: translateY(calc(var(--rise) * -100%)); } }
.stages__land { background: var(--surface); padding-block: clamp(36px, 4vw, 56px) var(--space-section); }
.stages__list { list-style: none; margin: 0; grid-template-columns: minmax(0, 1fr); row-gap: clamp(72px, 14vw, 112px); }
.stage { display: grid; gap: var(--space-tight); align-content: start; }
.stage__t { margin: 0; }
.stage__d { font-size: 1.0625rem; max-width: 34ch; }
.stage__sky { --d: 64px; position: relative; display: block; width: var(--d); height: calc(var(--d) * 0.55); overflow: clip; margin-bottom: 4px; }
.stage__sun { position: absolute; left: 0; top: 100%; width: var(--d); height: var(--d); border-radius: 50%; background: var(--accent); transform: translateY(calc(var(--rise) * -50%)); }
@media (max-width: 899px) { .stages__sky { display: none; } .stages { padding-top: 0; } .stages__land { padding-top: var(--space-section); } }
@media (min-width: 900px) { .stage__sky { display: none; } }
@media (min-width: 900px) {
  .stages__sky { --d: clamp(132px, 13vw, 196px); }
  .stages__sky, .stages__list { grid-template-columns: minmax(0, 5fr) minmax(0, 4fr) minmax(0, 3fr); column-gap: 48px; }
}

/* ── the mark ── */
.mark { padding-block: var(--space-section); }
.mark__grid { display: grid; gap: var(--space-head); align-items: center; }
.mark__hint { margin-top: var(--space-tight); font-weight: 500; }
.mark__flip { width: min(100%, 360px); }
/* on apricot the sun is yellow (an apricot sun would vanish) and the strokes logo brown */
.mark__flip :deep(.flip__sun) { fill: var(--field); }
.mark__flip :deep(.flip__btn) { color: var(--ink-deep); }
.mark__flip :deep(.flip__cap) { font-size: var(--step-2); }
.mark__flip :deep(.flip__line) { text-wrap: balance; }
@media (min-width: 900px) {
  .mark__grid { grid-template-columns: minmax(0, 6fr) minmax(0, 6fr); column-gap: clamp(32px, 5vw, 96px); }
  .mark__flip { order: -1; width: min(100%, 440px); justify-self: center; }
}

/* ── lemons band: heavy title over the picture, bottom-left, on the flat multiply tint ── */
.med { padding-bottom: var(--space-section); }
.med__photo :deep(.found__over) { padding: 0 0 clamp(24px, 4vw, 56px); }
.med__over { width: 100%; }
@media (min-width: 900px) { .med__title { width: 62%; } }
.med__title :deep(.rt__h) { color: var(--on-field-dark); }
@media (max-width: 699px) { .med__photo :deep(.found__frame) { aspect-ratio: 4 / 5 !important; } .med__photo { --found-pos: 62% 50%; } }
.med__grid { display: grid; margin-top: var(--space-block); }
.med__body { font-size: var(--step-1); line-height: 1.45; max-width: 40ch; }
@media (min-width: 900px) { .med__body { max-width: 46ch; } }

/* ── who we are: a statement board ── */
.team { padding-block: var(--space-section); }
/* one column that never grows past the board (a nowrap pill would widen an auto column) */
.team__board.board { grid-template-columns: minmax(0, 1fr); gap: var(--space-tight); padding: clamp(36px, 5vw, 72px) clamp(22px, 5vw, 72px) clamp(32px, 4.4vw, 64px); }
.team__title :deep(.rt__h) { color: var(--on-field-dark); }
.team__s { font-size: var(--step-2); line-height: 1.25; max-width: 30ch; }
.team__pill { justify-self: start; margin-top: clamp(8px, 1.4vw, 20px); }
@media (max-width: 599px) { .team__pill { width: 100%; white-space: normal; text-align: center; padding-block: 12px; } }
@media (min-width: 1100px) {
  .team__board.board { grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); grid-template-rows: auto 1fr; column-gap: clamp(32px, 4vw, 72px); align-items: start; }
  .team__title { grid-row: 1 / span 2; }
  .team__s { grid-column: 2; }
  .team__pill { grid-column: 2; }
}
</style>
