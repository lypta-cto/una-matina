<script setup lang="ts">
import { credits } from '~/data/credits'
definePageMeta({ awning: 'yellow', field: 'apricot' })
usePageSeo({ title: 'Luxury picnics', description: 'Luxury picnics in Naples, FL: on the beach, in a park, a backyard or poolside at sunset. Low tables, cushions, florals, food, setup and breakdown.' })
const where = ['Beach', 'Park', 'Private backyard', 'Poolside', 'Private property', 'Sunset spots']
const include = ['Low tables, rugs and cushions', 'Linens, tableware and candles', 'Fresh florals and signage', 'Charcuterie or desserts', 'Custom details', 'Setup and breakdown']
const faq = [
  { q: 'Can we do this on a public beach or in a park?', a: 'It depends on the spot. Beaches and parks each have their own rules for commercial setups, alcohol, wind, sunset times and cleanup. We confirm the rules and any permits for your spot before we finalise your booking.' },
  { q: 'What if the weather turns?', a: 'Our weather and rescheduling plan', tbc: true },
]
// Answers the client has not confirmed yet stay out of the page (no placeholder answers); kept here for the swap.
const faqShown = faq.filter(f => !f.tbc)
</script>

<template>
  <div class="pic">
    <!-- P1: split hero; the photo hangs below the field into the cream -->
    <PageHero id="lp-title" title="A picnic, already set" lead="A standalone service, not a décor add-on: we bring the table, the textiles, the flowers and the food, set it up before you arrive, and take it all away after.">
      <template #actions><NuxtLink :to="{ path: '/inquire', query: { services: 'picnic' } }" class="btn btn-ink">Plan a picnic</NuxtLink></template>
      <template #side>
        <FoundPhoto class="pic__photo" eager sizes="sm:100vw lp:480px" :photo="credits.clamPass" ratio="4 / 5" alt="The sun setting into the Gulf of Mexico at Clam Pass Beach, Naples, with its reflection on calm water" />
      </template>
    </PageHero>

    <!-- P2: what we bring (cream-deep board) and who it's for on the left; where we set up on the right, an apricot
         signboard with the places painted in sign capitals and the half-sun on its lower edge. The signboard also marks
         where the styled-shoot photo of a beach picnic will go (data-shoot-slot). -->
    <section class="wrap bring" aria-labelledby="bring-title">
      <div class="bring__board">
        <h2 id="bring-title" v-lines class="bring__title">What it can include</h2>
        <ul class="bring__list">
          <li v-for="i in include" :key="i">{{ i }}</li>
        </ul>
      </div>
      <div class="bring__sign" data-shoot-slot="sunset beach picnic" aria-labelledby="where-title" role="group">
        <h2 id="where-title" class="bring__title">Where we set up</h2>
        <ul v-reveal="120" class="bring__where">
          <li v-for="w in where" :key="w" class="sign-m">{{ w }}</li>
        </ul>
      </div>
      <p class="statement bring__for"><span class="bring__for-k">For</span> proposals, anniversaries, birthdays, showers, girls' gatherings and sunset dinners.</p>
    </section>

    <!-- P3: the one yellow band, rules first, then the questions people ask -->
    <section class="rules" aria-labelledby="rules-title">
      <div class="wrap rules__grid">
        <div>
          <h2 id="rules-title" v-lines class="sign-m">Public places have rules</h2>
          <p class="statement rules__statement">We check the rules for your spot before we book it.</p>
        </div>
        <!-- one confirmed answer: plain text (a single accordion reads like a bug); the Faq comes back with a second answer -->
        <div v-if="faqShown.length === 1" v-reveal="200" class="rules__qa">
          <h3 class="rules__q">{{ faqShown[0]!.q }}</h3>
          <p class="rules__answer">{{ faqShown[0]!.a }}</p>
        </div>
        <Faq v-else v-reveal="200" :items="faqShown" />
      </div>
    </section>

    <CloseCta :lines="['Pick a spot', 'and a date']" label="Plan a picnic" :to="{ path: '/inquire', query: { services: 'picnic' } }" />
  </div>
</template>

<style scoped>
/* P1 photo: a 4:5 window on the top 55% of the frame, sun and sea only (no boardwalk, no beach sign), hanging 64px past the field */
.pic__photo { position: relative; z-index: 1; width: 100%; max-width: 480px; margin-bottom: calc(-1 * (clamp(56px, 7vw, 104px) + var(--hang))); --hang: 40px; }
.pic__photo :deep(.found__cap) { position: absolute; top: 100%; left: 0; right: 0; }
/* the credit hangs on the apricot field: logo brown for AA (6.6:1), not the muted ink */
.pic__photo :deep(.found__credit) { color: var(--ink-deep); }
@media (min-width: 900px) { .pic__photo { --hang: 64px; margin-left: auto; } }

/* P2 */
.bring { padding-top: calc(var(--section) + 104px); padding-bottom: var(--section); display: grid; gap: clamp(40px, 5vw, 64px); }
.bring__board { background: var(--surface); padding: clamp(24px, 3vw, 44px); align-self: start; }
.bring__title { font-family: var(--font-text); font-weight: 600; font-size: var(--step-1); line-height: 1.25; text-transform: none; letter-spacing: 0; margin-bottom: 18px; }
.bring__list { list-style: none; margin: 0; padding: 0; display: grid; gap: 12px; font-size: var(--step-1); line-height: 1.35; font-weight: 500; }
.bring__sign { position: relative; overflow: clip; background: var(--accent); color: var(--ink-deep); padding: clamp(24px, 3vw, 44px) clamp(24px, 3vw, 44px) clamp(96px, 12vw, 150px); }
.bring__sign .bring__title { color: var(--ink-deep); }
.bring__where { container-type: inline-size; list-style: none; margin: 0; padding: 0; display: grid; gap: 0.18em; }
/* one place per line, always: the longest ("PRIVATE PROPERTY", 16 capitals ≈ 11.6 em) fits the board's width */
.bring__where li { white-space: nowrap; font-size: min(clamp(1.75rem, 1.2rem + 2.2 * var(--vw), 3.25rem), 8.4cqi); }
/* the half-sun of the mark on the signboard's lower edge */
.bring__sign::after { content: ""; position: absolute; right: clamp(24px, 3vw, 44px); bottom: 0; width: clamp(112px, 14vw, 200px); aspect-ratio: 2 / 1; border-radius: 999px 999px 0 0; background: var(--field); }
.bring__for { max-width: 40ch; }
@media (max-width: 599px) { .bring__for { font-size: 1.1875rem; } }
@media (min-width: 900px) and (max-width: 1199px) { .bring__for { font-size: var(--step-1); } }
.bring__for-k { font-family: var(--font-text); font-style: normal; font-weight: 600; font-size: var(--step-1); }
@media (min-width: 900px) {
  .bring { grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: clamp(32px, 4vw, 64px) clamp(40px, 5vw, 88px); align-items: stretch; }
  .bring__sign { grid-column: 2; grid-row: 1 / span 2; }
  .bring__for { grid-column: 1; grid-row: 2; align-self: end; max-width: 26ch; }
}

/* P3 */
.rules { background: var(--field); color: var(--on-field); padding-block: var(--section); }
.rules__grid { display: grid; gap: clamp(32px, 4vw, 56px); }
.rules__statement { margin-top: 20px; max-width: 22ch; }
.rules__qa { display: grid; gap: 12px; max-width: 40rem; }
.rules__q { font-family: var(--font-text); font-weight: 600; font-size: var(--step-1); line-height: 1.3; text-transform: none; letter-spacing: 0; }
.rules__answer { font-size: var(--step-1); line-height: 1.45; max-width: 40ch; }
@media (min-width: 1024px) { .rules__grid { grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); align-items: start; } }
</style>
