<script setup lang="ts">
// Home → /crepes: the market stand, as one brown section in the /crepes language (Luka: "the crêpes page linked
// somewhere on the homepage"). Heavy caps CRÊPES / AT THE MARKET in cream, one Playfair sentence, a sun pill to /crepes.
// The picture is a close crop of the /crepes hero concept (the syrup pour over the folded crêpes, a framing used nowhere
// else on Home; `img/home/pour-*.webp`, cut from `img/crepes/seq-source-3344.webp`), hung under the apricot valance like
// the stand's awning and run flush to the section's bottom-right corner (the /crepes hero board's corner).
// Market days and times stay out until the markets are confirmed (MarketStatus only behind that guard).
// Motion (once, below the fold only): title words rise; the picture unrolls from under its valance (v-unveil); the
// sentence and the pill lift. Reduced motion / no JS: final state. CLS 0: the frame has its ratio before load.
import { markets } from '~/data/markets'
const marketsConfirmed = markets.some(m => !m.tbc)
</script>

<template>
  <section v-stage class="hc field-brown" aria-labelledby="crepes-title">
    <div class="wrap hc__grid">
      <div class="hc__text">
        <RiseText id="crepes-title" :lines="['Crêpes', 'at the market']" size="l" />
        <p class="statement hc__say st-in" style="--i: 3">Before the parties, there was one griddle at the farmers market. It is still there, folding crêpes to order.</p>
        <MarketStatus v-if="marketsConfirmed" class="hc__status st-in" style="--i: 4" />
        <NuxtLink to="/crepes" class="pill pill--sun hc__pill st-in" style="--i: 5">See the menu &amp; market days <span class="pill__arrow" aria-hidden="true">→</span></NuxtLink>
      </div>
      <figure class="hc__stand" data-concept="/img/home/pour-1200.webp">
        <Awning variant="valance" tone="apricot" :drop="false" class="hc__valance" />
        <div v-unveil="160" class="hc__frame">
          <img
            class="hc__img" src="/img/home/pour-720.webp" srcset="/img/home/pour-720.webp 720w, /img/home/pour-1200.webp 1200w"
            sizes="(min-width: 900px) 42vw, 100vw" width="1200" height="1500" loading="lazy" decoding="async"
            alt="Illustration of syrup poured from a small steel jug over folded crêpes with cream and berries"
          >
        </div>
      </figure>
    </div>
  </section>
</template>

<style scoped>
.hc { padding-top: var(--space-section); overflow-x: clip; }
.hc__grid { display: grid; grid-template-columns: minmax(0, 1fr); gap: var(--space-head); }
.hc__text { display: grid; gap: var(--space-tight); justify-items: start; min-width: 0; }
.hc__say { font-size: var(--step-1); line-height: 1.35; max-width: 30ch; }
.hc__pill { margin-top: 10px; }
/* phones: the stand runs edge to edge and sits on the section's lower edge */
.hc__stand { position: relative; margin: 0 calc(-1 * var(--gutter)); padding-top: 14px; }
.hc .hc__valance { position: absolute; top: 0; left: 0; right: 0; z-index: 1; }
.hc__frame { aspect-ratio: 4 / 5; overflow: hidden; background: var(--field-dark); }
.hc__img { width: 100%; height: 100%; object-fit: cover; display: block; }
@media (min-width: 600px) and (max-width: 899px) { .hc__frame { aspect-ratio: 4 / 3; } .hc__img { object-position: 50% 62%; } }
@media (max-width: 599px) { .hc__pill { width: 100%; } }
@media (max-width: 379px) { .hc__pill { padding-inline: 16px; font-size: 0.9375rem; } }
@media (min-width: 900px) {
  .hc__grid { grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); column-gap: clamp(32px, 5vw, 96px); align-items: end; }
  .hc__text { align-self: end; padding-bottom: var(--space-section); }
  /* the stand: flush to the viewport's right edge and the section's bottom, like the /crepes hero board */
  .hc__stand { margin: 0 calc(-1 * (max(0px, (100vw - var(--max)) / 2) + var(--gutter))) 0 0; }
  .hc__frame { aspect-ratio: auto; height: clamp(520px, 72svh, 760px); }
}
</style>
