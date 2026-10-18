<script setup lang="ts">
import { credits } from '~/data/credits'
import { markets } from '~/data/markets'
// The live market line only once the client has confirmed at least one market; until then no day or time is shown.
const marketsConfirmed = markets.some(m => !m.tbc)
definePageMeta({ awning: 'apricot', field: 'yellow' })
usePageSeo({ title: 'About', description: 'Una Mattina means "one morning". We started with crêpes at the Naples farmers markets; Events & Catering is next, and one day a café.' })
// Three positions of the same sun: low over the market, higher for events, fully up for the café.
const stages = [
  { id: 'market', t: 'Market, today', rise: 0.3, d: 'Crêpes at the Naples farmers markets. Where we test every recipe and meet most of our neighbours.' },
  { id: 'events', t: 'Events, next', rise: 0.65, d: 'Planning, our own florals and stations made in front of your guests, at your home or on the beach.' },
  { id: 'cafe', t: 'A café, one day', rise: 1, d: 'An Una Mattina café: a place for mornings.' },
]

// A2 signature: a sunrise. Each sun climbs out from behind the horizon to its height.
// Where the browser has scroll-driven animations, the rise is scrubbed by the scroll (pure CSS, see styles).
// Elsewhere it plays once when the horizon enters view. Final position is the default (no JS, reduced motion).
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
    <!-- A1: split hero, the apron concept image capped at 320 px -->
    <PageHero id="about-title" class="ab-hero" title="It started with a crêpe">
      <template #lead><i lang="it">Una mattina</i> means "one morning" in Italian. Ours start at the farmers market, with a cream tent, a striped apron and a griddle.</template>
      <template #actions><NuxtLink to="/inquire" class="btn btn-primary">Start an inquiry</NuxtLink></template>
      <template #side>
        <ConceptImage class="ab-hero__img" src="/img/placeholder/apron.webp" alt="Illustration of a person in a white T-shirt and an apricot and cream striped Una Mattina apron, head out of frame" :width="350" :height="515" ratio="350 / 515" sizes="320px" />
      </template>
    </PageHero>

    <!-- A2: one sun at three heights over a real horizon: sky on cream, the land is a cream-deep band -->
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
            <h3 class="sign-m stage__t">{{ s.t }}</h3>
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

    <!-- A3: the mark, apricot band -->
    <section class="mark" aria-labelledby="mark-title">
      <div class="wrap mark__grid">
        <div class="mark__signs">
          <BrandSign class="mark__sign" label="The Una Mattina A with a rising sun" />
          <BrandSign class="mark__sign" inverted label="The same mark upside down, like a crêpe in a paper cone" />
        </div>
        <div>
          <h2 id="mark-title" v-lines class="sign-m">One mark, two mornings</h2>
          <p class="statement mark__body">The A in our name is a sunrise. Turn it upside down and it's a crêpe in its paper cone.</p>
        </div>
      </div>
    </section>

    <!-- A4: full-bleed lemons, then the morning we cook for -->
    <section class="med" aria-labelledby="med-title">
      <FoundPhoto class="med__photo" bleed :photo="credits.lemons" ratio="21 / 9" :parallax="0.07" alt="Amalfi lemons with their leaves hanging against a white wall" />
      <div class="wrap med__grid">
        <h2 id="med-title" v-lines class="sign-m">Mornings, Gulf light</h2>
        <p class="med__body">Coffee, something warm from the griddle, fruit, flowers on the table and nowhere to be. That's the morning we cook for, whether it's a Saturday at the market or a party in your backyard.</p>
      </div>
    </section>

    <!-- A5: who we are, compact -->
    <section class="team" aria-labelledby="team-title">
      <div class="wrap team__grid">
        <div class="team__text">
          <h2 id="team-title" v-lines class="sign-m">Who we are</h2>
          <p class="team__body">The same team you meet at the crêpe stand on market mornings plans, styles and serves your party.</p>
          <NuxtLink to="/crepes" class="link link-draw team__link">Come and say hello at the market</NuxtLink>
        </div>
        <ShootSlot class="team__slot" subject="founders' portrait" tone="apricot" motif="mark" ratio="1 / 1" />
      </div>
    </section>

    <CloseCta :lines="['Tell us', 'about your day']" />
  </div>
</template>

<style scoped>
/* A1 */
@media (max-width: 767px) { .ab-hero :deep(.ph__actions .btn) { width: 100%; justify-content: center; } }
.ab-hero__img { width: 100%; max-width: 320px; }
@media (min-width: 900px) { .ab-hero :deep(.ph__side) { display: grid; justify-items: end; } }
/* 768–899: the split layout already, so the apron sits beside the title instead of leaving half the field empty */
@media (min-width: 768px) and (max-width: 899px) {
  .ab-hero :deep(.ph__grid) { grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); align-items: end; }
  .ab-hero :deep(.ph__side) { display: grid; justify-items: end; }
  .ab-hero.ph :deep(.ph__title) { font-size: 6.4vw; }
}
@media (min-width: 900px) and (max-width: 1099px) { .ab-hero.ph :deep(.ph__title) { font-size: 6vw; } }
@media (max-width: 599px) { .ab-hero.ph :deep(.ph__title) { font-size: clamp(2.1rem, 10.4vw, 2.6rem); } .ab-hero__img { max-width: 240px; } }

/* A2: the sky row and the text row share one column template, so each sun stands over its own stage.
   The sky clips at its bottom edge, which is the top edge of the land band: the horizon is a change of tone, not a rule. */
.stages { padding-top: calc(var(--section) * 0.6); }
.stages__sky, .stages__list { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); column-gap: clamp(16px, 4vw, 48px); }
.stages__sky { --d: clamp(76px, 24vw, 132px); height: calc(var(--d) * 1.1); overflow: clip; }
.stages__cell { position: relative; display: block; }
.stages__sun {
  position: absolute; left: 0; top: 100%; width: var(--d); height: var(--d); border-radius: 50%; background: var(--accent);
  transform: translateY(calc(var(--rise) * -100%));
}
.stages__cell:nth-child(2) .stages__sun { transition-delay: 120ms; }
.stages__cell:nth-child(3) .stages__sun { transition-delay: 240ms; }
.stages__sun { transition: transform var(--dur-slow) var(--ease-out); }
.stages__sky.is-waiting .stages__sun { transform: none; transition: none; }
/* Scrubbed sunrise: the suns come up one after another while the horizon scrolls from the bottom of the screen to its middle. */
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

.stages__land { background: var(--surface); padding-block: clamp(36px, 4vw, 56px) clamp(72px, 8vw, 120px); }
.stages__list { list-style: none; margin: 0; grid-template-columns: minmax(0, 1fr); row-gap: clamp(64px, 9vw, 80px); }
.stage { display: grid; gap: 14px; align-content: start; }
.stage__d { max-width: 36ch; }
.stage__more { display: grid; gap: 8px; justify-items: start; margin-top: 6px; }
.stage__link { display: inline-block; padding-block: 9px; font-weight: 600; }
.stage__where { font-weight: 500; }
/* from 700 px the three stages stand side by side under their suns */
@media (min-width: 700px) { .stages__list { grid-template-columns: repeat(3, minmax(0, 1fr)); column-gap: 32px; } .stages__sky { column-gap: 32px; } }
@media (min-width: 900px) {
  .stages__sky { --d: clamp(132px, 13vw, 196px); }
  .stages__sky, .stages__list { grid-template-columns: minmax(0, 5fr) minmax(0, 4fr) minmax(0, 3fr); column-gap: 48px; }
}

/* A3 */
.mark { background: var(--accent); color: var(--ink-deep); padding-block: var(--section); }
.mark__grid { display: grid; gap: 36px; align-items: center; }
.mark__signs { display: flex; gap: clamp(24px, 4vw, 64px); }
.mark__sign { width: clamp(110px, 16vw, 220px); color: var(--ink-deep); --accent: var(--ground); }
.mark__body { margin-top: 18px; max-width: 30ch; }
@media (max-width: 599px) { .mark__body { font-size: 1.1875rem; } }
@media (min-width: 900px) { .mark__grid { grid-template-columns: 1fr 1fr; } }

/* A4 */
.med { padding-bottom: var(--section); }
.med__photo :deep(.found__img) { object-position: 50% 0%; }
.med__photo :deep(.found__cap) { max-width: var(--max); margin-inline: auto; padding-inline: var(--gutter); }
.med__grid { display: grid; gap: 20px; margin-top: clamp(80px, 8vw, 120px); }
.med__body { font-size: var(--step-1); line-height: 1.45; max-width: 42ch; }
@media (max-width: 767px) { .med__photo :deep(.found__frame) { aspect-ratio: 16 / 9 !important; } .med__photo :deep(.found__img) { object-position: 0% 0%; } }
@media (min-width: 900px) { .med__grid { grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: 48px; align-items: start; } }

/* A5 */
.team { background: var(--surface); padding-block: calc(var(--section) * 0.5); }
.team__grid { display: grid; gap: 32px; }
.team__body { margin-top: 18px; font-size: var(--step-1); line-height: 1.45; max-width: 36ch; }
.team__link { display: inline-block; margin-top: 14px; padding-block: 9px; font-weight: 600; }
.team__slot { max-width: 320px; }
@media (min-width: 900px) {
  .team__grid { grid-template-columns: minmax(0, 7fr) minmax(0, 4fr); column-gap: calc(100% / 12 + 48px); align-items: center; }
  .team__slot { max-width: 320px; justify-self: end; }
}
</style>
