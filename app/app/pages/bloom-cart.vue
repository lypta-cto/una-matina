<script setup lang="ts">
import { credits } from '~/data/credits'
definePageMeta({ awning: 'apricot', field: 'sage' })
usePageSeo({ title: 'Bloom Cart', description: 'The Una Mattina Bloom Cart: fresh flowers in your event palette; guests pick their stems and tie a small bouquet to take home. Naples, FL.' })
const steps = [
  { t: 'We pick the flowers', d: 'Stems chosen to match your palette and the season.' },
  { t: 'The cart is set', d: 'Wrap, ribbon and mini vases, with signage for your event.' },
  { t: 'Guests tie a bouquet', d: 'They choose their stems, tie them and take them home.' },
]
const ideal = ['Bridal showers', 'Baby showers', 'Birthdays', 'Wedding showers', 'Corporate activations', 'Brunches', 'Garden parties']
const custom = ['Personalised signage', 'Branded wrap or ribbon', 'Mini vases', 'Your flower palette', 'Paired with a picnic or a live station']
const inquiry = { path: '/inquire', query: { services: 'bloom' } }
</script>

<template>
  <div>
    <!-- B1: split hero on sage, a found flower stall beside the title (cropped to the right 60 %) -->
    <PageHero id="bc-title" class="bc-hero" title="Pick a stem, take it home" lead="A cart of fresh flowers in your event's palette. Guests choose their stems, tie a small bouquet and take it home.">
      <template #actions><NuxtLink :to="inquiry" class="btn btn-ink">Ask about the Bloom Cart</NuxtLink></template>
      <!-- its own first screen: a tall cream signboard of the occasions (the flower photo moves to the steps below,
           so this page does not open on the same picture as Home's Bloom chapter) -->
      <template #side>
        <div class="bc-sign">
          <h2 class="bc-sign__k">Ideal for</h2>
          <ul class="bc-sign__list">
            <li v-for="o in ideal" :key="o">{{ o }}</li>
          </ul>
        </div>
      </template>
    </PageHero>

    <!-- B2: three plain rows beside the sticky flower photo (credited; also the slot for the styled shoot of the cart at a shower).
         Signature: each step is painted up out of its own baseline as it reaches the eye (v-lines, one row at a time). -->
    <section class="wrap how" aria-labelledby="how-title">
      <div class="how__text">
        <h2 id="how-title" v-lines class="sign-l how__title">From bucket to bouquet</h2>
        <ol class="how__steps">
          <li v-for="(s, i) in steps" :key="s.t" class="how__step">
            <h3 v-lines="i * 80" class="sign-m how__t">{{ s.t }}</h3>
            <p class="italic-line how__d">{{ s.d }}</p>
          </li>
        </ol>
        <p class="statement how__statement">Décor, an activity and a favour, from one cart.</p>
      </div>
      <div class="how__side" data-shoot-slot="Bloom Cart at a shower">
        <FoundPhoto class="how__photo" unveil sizes="sm:100vw lp:440px" :photo="credits.flowers" ratio="4 / 5" alt="Buckets of tulips, hyacinths and mixed stems at a flower-market stall" />
      </div>
    </section>

    <!-- B3: yellow band, occasions + what we can tailor -->
    <section class="lists" aria-labelledby="lists-title">
      <div class="wrap lists__grid">
        <div class="lists__head">
          <h2 id="lists-title" v-lines class="sign-m">For showers and parties</h2>
        </div>
        <WordList v-reveal="120" title="Custom details" :items="custom" tone="board" />
      </div>
    </section>

    <CloseCta :lines="['Bring the', 'Bloom Cart']" label="Ask about the Bloom Cart" :to="inquiry" />
  </div>
</template>

<style scoped>
/* B1 */
@media (max-width: 767px) { .bc-hero :deep(.ph__actions .btn) { width: 100%; justify-content: center; } }
/* PageHero's sign-l in 7 cols runs to 3 lines between 900 and 1099 px */
@media (min-width: 900px) and (max-width: 1099px) { .bc-hero.ph :deep(.ph__title) { font-size: 6vw; } }
@media (min-width: 900px) { .bc-hero :deep(.ph__side) { display: grid; justify-items: end; } }
.bc-sign { position: relative; overflow: clip; width: 100%; max-width: 480px; background: var(--ground); color: var(--ink); padding: clamp(22px, 3vw, 40px) clamp(22px, 3vw, 40px) clamp(72px, 9vw, 112px); }
.bc-sign__k { font-family: var(--font-text); font-weight: 600; font-size: var(--step-1); line-height: 1.25; text-transform: none; letter-spacing: 0; margin-bottom: 14px; }
/* one occasion per line, painted in sign capitals as large as the board allows */
.bc-sign__list { container-type: inline-size; list-style: none; margin: 0; padding: 0; display: grid; gap: 0.2em; }
.bc-sign__list li { white-space: nowrap; text-transform: uppercase; letter-spacing: 0.03em; line-height: 1.05; font-size: min(var(--step-2), 7cqi); }
/* the mark's half-sun stands on the board's lower edge, in sage like the field it hangs on */
.bc-sign::after { content: ""; position: absolute; right: clamp(22px, 3vw, 40px); bottom: 0; width: clamp(96px, 10vw, 150px); aspect-ratio: 2 / 1; border-radius: 999px 999px 0 0; background: var(--accent); }

/* B2 */
.how { padding-block: var(--section); display: grid; gap: clamp(48px, 6vw, 72px); }
/* "FROM BUCKET / TO BOUQUET": two lines at every width */
.how__title { font-size: clamp(2.5rem, 11.2vw, 3rem); }
@media (min-width: 600px) { .how__title { font-size: min(var(--step-4), calc(4.4 * var(--vw) + 1rem)); } }
.how__steps { list-style: none; margin: clamp(48px, 5vw, 64px) 0 0; padding: 0; display: grid; gap: 40px; }
.how__step { display: grid; gap: 10px; }
.how__d { font-size: var(--step-1); line-height: 1.4; max-width: 34ch; }
.how__statement { margin-top: clamp(40px, 5vw, 72px); max-width: 24ch; }
.how__side { width: 100%; max-width: 420px; }
.how__photo { width: 100%; }
@media (min-width: 900px) {
  .how { grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); align-items: start; }
  .how__side { position: sticky; top: 96px; max-width: none; }
}

/* B3 */
.lists { background: var(--field); padding-block: var(--section); }
.lists__grid { display: grid; gap: 36px; }
@media (min-width: 768px) {
  .lists__grid { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); align-items: start; gap: 48px; }
  .lists__head { grid-column: 1 / -1; }
}
@media (min-width: 1100px) {
  .lists__grid { grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); }
  .lists__head { grid-column: auto; }
}
@media (max-width: 380px) { .how__title { font-size: clamp(1.75rem, 9vw, 2.1rem); } }
</style>
