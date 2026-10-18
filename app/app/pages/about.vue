<script setup lang="ts">
import { credits } from '~/data/credits'
import { markets } from '~/data/markets'
// The live market line only once the client has confirmed at least one market; until then no day or time is shown.
const marketsConfirmed = markets.some(m => !m.tbc)
definePageMeta({ awning: 'apricot', field: 'yellow' })
usePageSeo({ title: 'About', description: 'Una Mattina means "one morning". We started with crêpes at the Naples farmers markets; Events & Catering is next, and one day a café.' })
// Events v2 (events-v2-system.md §8 About): heavy hero whose letter rise lands on the Ê (its circumflex drops last,
// page CSS) → three suns at three heights → the sign flip (signature) → the title over the lemons band → who we are
// → close. Motion budget: hero load · suns (scrubbed) · sign flip · band title rise · founders' panel unveil · close.
// Three positions of the same sun: low over the market, higher for events, fully up for the café.
const stages = [
  { id: 'market', t: ['Market,', 'today'], rise: 0.3, d: 'Crêpes at the Naples farmers markets. Where we test every recipe and meet most of our neighbours.' },
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
      <PageHero id="about-title" layout="heavy" title="It started with a crêpe" :lines="['It started', 'with a crêpe']">
        <template #lead><i lang="it">Una mattina</i> means "one morning" in Italian. Ours start at the farmers market, with a cream tent, a striped apron and a griddle.</template>
        <template #actions><NuxtLink to="/inquire" class="pill pill--ink">Start an inquiry <span class="pill__arrow" aria-hidden="true">→</span></NuxtLink></template>
        <template #side>
          <Board tone="deep" valance="apricot" drop class="ab-hero__board">
            <ConceptImage class="ab-hero__img" src="/img/placeholder/apron.webp" alt="Illustration of a person in a white T-shirt and an apricot and cream striped Una Mattina apron, head out of frame" :width="350" :height="515" ratio="350 / 515" sizes="320px" settle />
          </Board>
        </template>
      </PageHero>
    </div>

    <!-- one sun at three heights over a real horizon: sky on cream, the land is a cream-deep band -->
    <section class="stages" aria-labelledby="stages-title">
      <h2 id="stages-title" class="sr-only">Market, events, café</h2>
      <div class="wrap">
        <div ref="sky" class="stages__sky" :class="{ 'is-waiting': waiting, 'is-risen': risen }" aria-hidden="true">
          <span v-for="s in stages" :key="s.id" class="stages__cell"><span class="stages__sun" :style="{ '--rise': s.rise }" /></span>
        </div>
      </div>
      <div class="stages__land">
        <ol class="wrap stages__list">
          <li v-for="s in stages" :key="s.id" class="stage">
            <h3 class="display-m stage__t">{{ s.t[0] }}<br>{{ s.t[1] }}</h3>
            <p class="stage__d">{{ s.d }}</p>
            <div v-if="s.id === 'market'" class="stage__more">
              <MarketStatus v-if="marketsConfirmed" />
              <p v-else class="stage__where">Find us at the Naples farmers markets.</p>
              <NuxtLink to="/crepes" class="link link-draw stage__link">Find the stand</NuxtLink>
            </div>
          </li>
        </ol>
      </div>
    </section>

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
          <RiseText id="med-title" class="med__title" :lines="['Mornings,', 'Gulf light']" size="l" />
        </div>
      </FoundPhoto>
      <div class="wrap med__grid">
        <p class="med__body">Coffee, something warm from the griddle, fruit, flowers on the table and nowhere to be. That's the morning we cook for, whether it's a Saturday at the market or a party in your backyard.</p>
      </div>
    </section>

    <!-- who we are -->
    <section class="team field-deep" aria-labelledby="team-title">
      <div class="wrap team__grid">
        <div class="team__text">
          <RiseText id="team-title" :lines="['Who we are']" size="l" />
          <p class="lead team__body">The same team you meet at the crêpe stand on market mornings plans, styles and serves your party.</p>
          <NuxtLink to="/crepes" class="link link-draw team__link">Come and say hello at the market</NuxtLink>
        </div>
        <ShootSlot class="team__slot" subject="founders' portrait" tone="apricot" motif="sun" :rise="0.8" ratio="1 / 1" />
      </div>
    </section>

    <CloseCta :lines="['Tell us', 'about your day']" />
  </div>
</template>

<style scoped>
/* ── hero: the apron board stands beside the title from 900 px ── */
/* fixed widths (never shrink-to-fit): the picture's frame has its height before the file arrives (CLS 0) */
.ab-hero.ab-hero :deep(.phx__side) { width: 100%; }
.ab-hero__board { width: calc(320px + 2 * clamp(22px, 2.6vw, 36px)); max-width: 100%; }
.ab-hero__img { width: 100%; }
@media (max-width: 599px) { .ab-hero__board { width: calc(240px + 2 * clamp(22px, 2.6vw, 36px)); } }
@media (min-width: 900px) {
  .ab-hero.ab-hero :deep(.phx--heavy.phx--side .phx__body) {
    grid-template-columns: minmax(0, 8fr) minmax(0, 4fr);
    grid-template-areas: "title side" "lead side" "actions side";
    grid-template-rows: auto auto 1fr;
  }
  .ab-hero.ab-hero :deep(.phx__side) { display: grid; justify-items: end; align-self: start; margin-top: 0; }
  .ab-hero.ab-hero :deep(.phx__lead) { align-self: start; }
}
/* the letter rise lands on the Ê: the E rises with the other letters, then its circumflex drops onto it with the
   turn spring (the /crepes CRÊPES move). The cell's own glyph is clipped below the circumflex; a copy of the glyph,
   clipped to the circumflex only, falls into place. Final state without the animation = the plain Ê. */
.ab-hero { --hat: 0.07em; }
.ab-hero.ab-hero :deep(.rt__line:nth-child(2) .rt__word:nth-child(3) .rt__mask:nth-child(3) .rt__c) { position: relative; color: transparent; }
.ab-hero.ab-hero :deep(.rt__line:nth-child(2) .rt__word:nth-child(3) .rt__mask:nth-child(3) .rt__c)::before,
.ab-hero.ab-hero :deep(.rt__line:nth-child(2) .rt__word:nth-child(3) .rt__mask:nth-child(3) .rt__c)::after {
  content: "Ê" / ""; position: absolute; left: 0; top: 0; color: var(--page-ink, var(--ink));
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
.stage__more { display: grid; gap: 8px; justify-items: start; margin-top: 6px; }
.stage__link { display: inline-block; padding-block: 9px; font-weight: 600; }
.stage__where { font-weight: 500; }
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
.med__title { max-width: 11em; }
.med__title :deep(.rt__h) { color: var(--on-field-dark); }
@media (max-width: 699px) { .med__photo :deep(.found__frame) { aspect-ratio: 4 / 5 !important; } .med__photo { --found-pos: 62% 50%; } }
.med__grid { display: grid; margin-top: var(--space-block); }
.med__body { font-size: var(--step-1); line-height: 1.45; max-width: 40ch; }
@media (min-width: 900px) { .med__body { max-width: 46ch; } }

/* ── who we are ── */
.team { padding-block: var(--space-section); }
.team__grid { display: grid; gap: var(--space-block); }
.team__body { margin-top: var(--space-tight); }
.team__link { display: inline-block; margin-top: 18px; padding-block: 9px; font-weight: 600; }
.team__slot { max-width: 320px; }
@media (min-width: 900px) {
  .team__grid { grid-template-columns: minmax(0, 7fr) minmax(0, 4fr); column-gap: calc(100% / 12 + 48px); align-items: end; }
  .team__slot { max-width: 360px; justify-self: end; }
}
</style>
