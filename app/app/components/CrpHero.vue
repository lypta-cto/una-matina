<script setup lang="ts">
// /crepes first screen, after Luka's reference (mornibali): a full-bleed photograph from the top edge,
// nav over it, "Buongiorno," + one giant word bottom-left, the featured crêpe and the live market line
// bottom-right. Text sits on a flat brown tint over the photo (no gradient), measured ≥ 4.5:1.
// Load choreography (CSS only, so it plays without JS and ends visible): the photo settles from 1.06,
// the letters of CRÊPES rise out of their baseline mask one by one and the circumflex lands last,
// then the lead, actions and featured crêpe follow. Reduced motion: final state, no travel.
import type { Crepe } from '~/data/menu'

const props = defineProps<{ featured: Crepe | null, directions: string | null, menuHref: string }>()
const newTab = ' (opens in a new tab)'

const letters = ['C', 'R', 'Ê', 'P', 'E', 'S']

useHead({
  link: [
    { rel: 'preload', as: 'image', type: 'image/webp', media: '(max-width: 699px)', imagesrcset: '/img/crepes/hero-ai-m-640.webp 640w, /img/crepes/hero-ai-m-828.webp 828w', imagesizes: '100vw', fetchpriority: 'high' },
    { rel: 'preload', as: 'image', type: 'image/webp', media: '(min-width: 700px)', imagesrcset: '/img/crepes/hero-ai-1280.webp 1280w, /img/crepes/hero-ai-1920.webp 1920w', imagesizes: '100vw', fetchpriority: 'high' },
  ],
})
</script>

<template>
  <section id="crepes-hero" class="hero" aria-labelledby="crepes-title">
    <div class="hero__media">
      <picture>
        <source media="(max-width: 699px)" srcset="/img/crepes/hero-ai-m-640.webp 640w, /img/crepes/hero-ai-m-828.webp 828w" sizes="100vw" type="image/webp">
        <img
          class="hero__img" src="/img/crepes/hero-ai-1920.webp" srcset="/img/crepes/hero-ai-1280.webp 1280w, /img/crepes/hero-ai-1920.webp 1920w" sizes="100vw"
          width="1920" height="1081" fetchpriority="high" decoding="async"
          alt="Illustrative image: folded crêpes with berries and cream on a café counter, syrup being poured from a small steel jug"
        >
      </picture>
      <div class="hero__tint" />
    </div>

    <div class="hero__body wrap">
      <p class="hero__hello statement" lang="it"><span class="hero__mask"><span class="hero__line" style="--d: 120ms">Buongiorno,</span></span></p>
      <h1 id="crepes-title" class="hero__word">
        <span class="sr-only">Crêpes</span>
        <span class="hero__letters" aria-hidden="true">
          <span v-for="(l, i) in letters" :key="i" class="hero__cell" :style="{ '--i': i }">
            <span class="hero__lmask"><span class="hero__glyph">{{ l === 'Ê' ? 'E' : l }}</span></span>
            <span v-if="l === 'Ê'" class="hero__acc">Ê</span>
          </span>
        </span>
      </h1>
      <div class="hero__actions hero__in" style="--d: 720ms">
        <a v-if="props.directions" :href="props.directions" class="crp-btn crp-btn--sun" target="_blank" rel="noopener">Get directions <span class="crp-btn__arrow" aria-hidden="true">↗</span><span class="sr-only">{{ newTab }}</span></a>
        <a :href="props.menuHref" class="crp-btn crp-btn--ghost">See the menu</a>
      </div>
      <p class="hero__lead hero__in" style="--d: 560ms">Thin crêpes made to order, sweet or savory, folded into a paper cone so you can keep walking the market.</p>
      <div class="hero__plank hero__in" style="--d: 760ms" aria-hidden="true"><Awning variant="valance" tone="apricot" class="hero__valance" /></div>
      <div class="hero__side">
        <Awning variant="valance" tone="apricot" class="hero__valance hero__valance--side" />
        <div v-if="props.featured" class="hero__feat hero__in hero__in--side" style="--d: 820ms">
          <p class="hero__feat-name"><span>{{ props.featured.name }}</span><span class="tnum"><Tbc note="price"><CrpOdo :value="`$${props.featured.price}`" :delay="1150" /></Tbc></span></p>
          <p class="hero__feat-note">{{ props.featured.note }}</p>
        </div>
        <MarketStatus class="hero__status hero__in" style="--d: 640ms" />
      </div>
    </div>

  </section>
</template>

<style scoped>
.hero {
  --on: var(--on-field-dark);
  --hero-max: var(--max);
  --focus-ring: var(--on-field-dark);
  position: relative; isolation: isolate; color: var(--on); overflow-x: clip;
  min-height: max(100svh, 600px);
  display: grid; grid-template-rows: 1fr;
  padding-top: var(--crp-nav-h, 76px);
}
@media (min-width: 900px) { .hero { min-height: clamp(640px, 100svh, 1600px); } }
/* Very wide screens: the text column follows the photo out instead of sitting in a 1440 box. */
@media (min-width: 1680px) { .hero { --hero-max: min(92vw, 2200px); } .hero__body.wrap { max-width: var(--hero-max); } }

/* Photo + flat tint (no gradient). The tint is the measured scrim: see build-log for the numbers. */
.hero__media { position: absolute; inset: 0; z-index: -1; overflow: hidden; background: var(--field-dark); }
.hero__img { width: 100%; height: 100%; object-fit: cover; object-position: 66% 60%; display: block; transform-origin: 66% 60%; animation: hero-settle 1600ms var(--ease-out) both; }
/* Multiply keeps the photo's colour (warm and deep) where a normal alpha tint would grey it. */
.hero__tint { position: absolute; inset: 0; background: var(--field-dark); opacity: var(--tint, 0.62); mix-blend-mode: multiply; }
/* A lighter tint keeps the food appetising; small text gets its own flat brown plate instead (lead on
   desktop, lead + featured band on phones, the signboard bottom-right). */
.hero__tint { --tint: 0.66; }
@media (min-width: 900px) { .hero__tint { --tint: 0.54; } .hero__img { filter: saturate(1.08); } }
@media (min-width: 1680px) { .hero__tint { --tint: 0.6; } }
@keyframes hero-settle { from { transform: scale(1.06); } to { transform: none; } }
/* Curtain (pages/crepes.vue adds .is-curtain and the top offset): the hero holds while the intro slides over. */
.hero.is-curtain { position: sticky; z-index: 0; }
.hero :is(.hero__hello, .hero__word, .hero__lead, .hero__actions, .hero__side, .hero__feat, .hero__status, .hero__plank) { transition: opacity 240ms var(--ease-out), visibility 0s linear 0s; }
.hero .is-tucked { opacity: 0 !important; visibility: hidden; transition: opacity 240ms var(--ease-out), visibility 0s linear 240ms; }
.hero__media picture { display: block; height: 100%; transform-origin: 60% 60%; }
.hero__body { will-change: auto; }

@keyframes hero-fade { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: none; } }

/* Body: phone = everything you need first (greeting, word, status, actions), the rest at the bottom. */
.hero__body {
  display: grid; width: 100%; align-content: start;
  grid-template-columns: minmax(0, 1fr);
  grid-template-areas: "hello" "word" "status" "actions" "." "lead" "feat";
  grid-template-rows: auto auto auto auto minmax(76px, 1fr) auto auto;
  padding-top: clamp(20px, 6svh, 56px); padding-bottom: 20px;
}
.hero__hello { grid-area: hello; font-size: clamp(1.625rem, 1.2rem + 1.6vw, 2.25rem); line-height: 1.15; }
.hero__word { grid-area: word; }
.hero__status { grid-area: status; margin-top: 14px; max-width: 34ch; }
.hero__actions { grid-area: actions; display: flex; flex-wrap: wrap; gap: 10px; margin-top: 22px; }
.hero__lead { grid-area: lead; font-size: 1.0625rem; line-height: 1.5; max-width: 34ch; }
.hero__body { isolation: isolate; }
/* Local scrim: a solid brown signboard behind the small text that sits over the busy part of the picture
   (phone: lead + featured at the bottom; desktop: featured + market line, bottom right). No gradient. */
.hero__plank { grid-row: 6 / 8; grid-column: 1 / -1; margin: -36px calc(-1 * var(--gutter)) -20px; background: var(--field-dark); z-index: -1; }
.hero__valance { position: absolute; top: 0; left: 0; right: 0; }
.hero__side { display: contents; }
.hero__valance--side { display: none; }
.hero__valance.awning--drop { animation-delay: 1050ms; }
.hero__plank { position: relative; }
.hero__feat { grid-area: feat; margin-top: 18px; display: grid; gap: 4px; max-width: 26rem; }
.hero__feat-name { display: flex; justify-content: space-between; gap: 16px; font-weight: 600; font-size: 1.375rem; line-height: 1.2; }
.hero__feat-note { font-size: 1rem; line-height: 1.45; }
.hero :deep(.tbc) { text-decoration-color: var(--on); }
.hero :deep(.tbc__tag) { background: transparent; color: var(--on); outline: 1px solid var(--on); outline-offset: -1px; font-size: 0.75rem; font-weight: 600; padding: 0.1em 0.45em; vertical-align: 0.25em; }
.hero :deep(.ms__dot) { background: var(--accent); }
.hero :focus-visible { outline-color: var(--on-field-dark); }
@media (max-width: 599px) { .hero__actions .crp-btn { flex: 1 1 0; padding: 0 14px; } .hero__actions .crp-btn--ghost { background: var(--field-dark); } }

@media (min-width: 900px) {
  .hero__body {
    align-content: end; column-gap: clamp(32px, 5vw, 96px);
    grid-template-columns: minmax(0, 1fr) minmax(280px, 25rem);
    grid-template-areas: "hello ." "word ." "lead side" "actions side";
    grid-template-rows: auto auto auto auto;
    padding-bottom: clamp(56px, 8svh, 88px);
  }
  .hero__lead { margin-top: 22px; font-size: 1.25rem; line-height: 1.4; max-width: 30ch; align-self: end; justify-self: start; background: var(--field-dark); padding: 14px 20px 16px; margin-left: -20px; }
  .hero__actions { margin-top: 28px; align-self: end; }
  .hero__feat { margin-top: 0; align-self: end; }
  .hero__plank { display: none; }
  /* Desktop: one compact brown signboard, flush to the bottom-right corner, a valance on its top edge. */
  .hero__side {
    grid-area: side; align-self: end; position: relative; display: grid; gap: 18px; align-content: start;
    margin: 0 calc(-1 * (max(0px, (100vw - var(--hero-max)) / 2) + var(--gutter))) calc(-1 * clamp(56px, 8svh, 88px)) 0;
    padding: 40px var(--gutter) clamp(28px, 4svh, 44px) clamp(24px, 2.4vw, 36px);
    background: var(--field-dark); animation: hero-in-side 700ms var(--ease-out) 760ms both;
  }
  .hero__valance--side { display: block; }
  .hero__side > * { min-width: 0; }
  .hero__side > .hero__feat, .hero__side > .hero__status { grid-area: auto; }
  .hero__feat-name { font-size: 1.625rem; }
  .hero__feat-note { font-size: 1.0625rem; }
  .hero__status { margin-top: 0; --d: 900ms !important; }
}

/* The word: heavy, tight, cream. Each letter rises out of its own baseline mask. */
.hero__word { font-weight: 700; letter-spacing: -0.035em; line-height: 0.86; text-transform: none; font-size: min(21.5vw, 7.5rem); margin: 0.06em 0 0 -0.045em; }
@media (min-width: 900px) { .hero__word { font-size: min(12.6vw, 17rem); } }
/* Landscape phones: size the word by height too, so both actions stay in the first screen. */
@media (max-height: 480px) and (max-width: 899px) { .hero__word { font-size: min(13vw, 22svh); } .hero__body { padding-top: 12px; } .hero__actions { margin-top: 14px; } }
/* Tablet portrait: a tablet composition, not a stretched phone. */
@media (min-width: 600px) and (max-width: 899px) and (min-height: 600px) { .hero__word { font-size: min(24vw, 11rem); } .hero__hello { font-size: 2.5rem; } .hero__status { font-size: 1.125rem; } }
.hero__letters { display: inline-flex; padding-top: 0.2em; margin-top: -0.2em; }
.hero__cell { position: relative; display: inline-block; }
.hero__lmask { display: inline-block; overflow: hidden; vertical-align: top; padding: 0 0.02em; margin: 0 -0.02em; }
.hero__glyph { display: inline-block; animation: hero-letter var(--crp-rise) var(--ease-out) both; animation-delay: calc(180ms + var(--i) * 55ms); }
/* The circumflex is the real Ê glyph, clipped to the part above the cap height, so it lines up exactly. */
.hero__acc { position: absolute; left: 0.02em; top: 0; clip-path: inset(-0.6em -0.1em calc(100% - 0.075em) -0.1em); animation: hero-acc 620ms var(--crp-spring) both; animation-delay: 760ms; pointer-events: none; }
@keyframes hero-letter { from { transform: translateY(104%); } to { transform: none; } }
@keyframes hero-acc { from { transform: translateY(-0.45em); opacity: 0; } 30% { opacity: 1; } to { transform: none; opacity: 1; } }

/* Greeting rises out of its mask; the rest follows in reading order. */
.hero__mask { display: inline-block; overflow: hidden; padding-bottom: 0.12em; margin-bottom: -0.12em; padding-right: 0.1em; }
.hero__line { display: inline-block; animation: hero-letter 800ms var(--ease-out) both; animation-delay: var(--d); }
.hero__in { animation: hero-in 700ms var(--ease-out) both; animation-delay: var(--d); }
.hero__in--side { animation-name: hero-in-side; }
@keyframes hero-in { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
@keyframes hero-in-side { from { opacity: 0; transform: translateX(24px); } to { opacity: 1; transform: none; } }

</style>
