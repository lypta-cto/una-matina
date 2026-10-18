<script setup lang="ts">
import { credits } from '~/data/credits'
definePageMeta({ awning: 'yellow', field: 'apricot' })
usePageSeo({ title: 'Services', description: 'Event planning and coordination, event design with in-house florals and setup, and live station catering in Naples and Southwest Florida. Book one or all three.' })
const planning = {
  a: { title: 'Planning', items: ['Discovery and vision', 'Budget and priorities', 'Venue or location search', 'Vendor sourcing and communication', 'Food and beverage coordination'] },
  b: { title: 'Production', items: ['Floor plan and guest flow', 'Timeline and production schedule', 'Final confirmations', 'Event-day management', 'Setup and breakdown coordination'] },
}
const design = {
  design: { title: 'Design', items: ['Colour palette', 'Tablescape', 'Linens and napkins', 'Tableware', 'Menus and place cards', 'Signage', 'Rugs, pillows and picnic styling', 'Decorations'] },
  florals: { title: 'Florals, in-house', items: ['Centerpieces', 'Bud vases', 'Station florals', 'Picnic florals', 'Custom arrangements'] },
  setup: { title: 'Setup & breakdown', items: ['Tables and high-tops', 'Décor installations', 'Rental coordination', 'On-site styling', 'Final detailing', 'Breakdown and pack-out'] },
}
const parts = [
  { href: '#planning', t: 'Planning & coordination' },
  { href: '#design', t: 'Design, florals & setup' },
  { href: '#stations', t: 'Live station catering' },
]
const partners = ['DJs and live musicians', 'Photo booths', 'Chair, table and tent rentals', 'Lighting', 'Bakeries and cakes', 'Bartenders', 'Cleanup crews']
</script>

<template>
  <div class="svc">
    <!-- S1: split hero, the right half carries the one-team promise -->
    <!-- S1: type-led hero (the title runs the full width), the three parts hung beside the lead as painted planks that
         jump to their sections. Its own first screen: no photo here (Picnics, Bloom and About open on pictures). -->
    <PageHero id="services-title" layout="type" class="svc-hero" title="Three parts, one team" lead="Book one service or hand us the whole event. When we do all three, one person leads it from first call to last box packed.">
      <template #actions><NuxtLink to="/inquire" class="btn btn-ink">Start an inquiry</NuxtLink></template>
      <template #side>
        <nav class="svc-parts" aria-label="The three parts">
          <a v-for="(p, i) in parts" :key="p.href" :href="p.href" class="svc-part" :class="`svc-part--${i}`"><span class="svc-part__t">{{ p.t }}</span><span class="svc-part__arrow" aria-hidden="true">↓</span></a>
        </nav>
      </template>
    </PageHero>

    <!-- S2: name left, two plain lists right -->
    <section id="planning" class="wrap plan" aria-labelledby="planning-title">
      <div class="plan__head">
        <h2 id="planning-title" v-lines class="sign-l plan__title">Planning &amp; coordination</h2>
        <p class="statement plan__statement">Planning is its own service, not an add-on to the food.</p>
      </div>
      <div v-reveal="200" class="plan__lists">
        <WordList :title="planning.a.title" :items="planning.a.items" />
        <WordList :title="planning.b.title" :items="planning.b.items" />
      </div>
    </section>

    <!-- S3: the page's one yellow band; florals get the widest column -->
    <section id="design" class="design" aria-labelledby="design-title">
      <div class="wrap">
        <h2 id="design-title" v-lines class="sign-l design__title">Design, florals &amp; setup</h2>
        <p class="design__lead">We design each event as one concept, from the palette to the place cards.</p>
        <div v-reveal="200" class="design__cols">
          <WordList class="design__col" :title="design.design.title" :items="design.design.items" />
          <div class="design__col design__col--florals">
            <WordList :title="design.florals.title" :items="design.florals.items" />
            <p class="statement design__statement">The flowers are ours: arranged in-house, not ordered in.</p>
          </div>
          <WordList class="design__col" :title="design.setup.title" :items="design.setup.items" />
        </div>
      </div>
    </section>

    <!-- S4: a credited photo beside the pointer to the stations page -->
    <section id="stations" class="wrap stations" aria-labelledby="st-title">
      <FoundPhoto class="stations__img" unveil sizes="sm:100vw lp:430px" :photo="credits.cannoli" ratio="4 / 5" alt="A tray of Sicilian cannoli filled with ricotta, finished with pistachio and candied cherry" />
      <div class="stations__text">
        <h2 id="st-title" v-lines class="sign-l stations__title">Live station catering</h2>
        <p class="stations__body">Six stations, cooked, layered or poured in front of your guests on one modular counter: crêpes, tiramisu, fruit cups, charcuterie, cannoli, cocktails and mocktails.</p>
        <NuxtLink to="/live-stations" class="btn btn-outline">See the stations</NuxtLink>
      </div>
    </section>

    <!-- S5: partners as a plain list on the cream-deep tone step -->
    <section class="partners" aria-labelledby="partners-title">
      <div class="wrap partners__grid">
        <div>
          <h2 id="partners-title" v-lines class="sign-m">Who we bring in</h2>
          <p class="partners__body">We lead the creative direction. For what doesn't need to live with us, we work with trusted partners.</p>
          <p class="statement partners__one">You still talk to one person.</p>
        </div>
        <ul v-reveal="200" class="partners__list">
          <li v-for="p in partners" :key="p">{{ p }}</li>
        </ul>
      </div>
    </section>

    <CloseCta :lines="['Start with', 'one part']" />
  </div>
</template>

<style scoped>
@media (max-width: 767px) { .svc-hero :deep(.ph__actions .btn) { width: 100%; justify-content: center; } }
/* the three parts: flat planks on the apricot field, cream / yellow / cream-deep, each a jump link */
.svc-parts { container-type: inline-size; display: grid; gap: 8px; }
.svc-part {
  --bg: var(--ground); position: relative; isolation: isolate; overflow: hidden;
  display: flex; align-items: center; justify-content: space-between; gap: 16px; min-height: 64px; padding: 12px 20px;
  background: var(--bg); color: var(--ink); text-decoration: none;
}
.svc-part--1 { --bg: var(--field); }
.svc-part--2 { --bg: var(--surface); }
.svc-part__t { font-size: clamp(1.125rem, 0.9rem + 1 * var(--vw), 1.625rem); text-transform: uppercase; letter-spacing: 0.03em; line-height: 1.05; }
/* from 600 px each part stays on one line: the longest ("Planning & coordination", ≈ 16.5 em) fits beside the arrow */
@media (min-width: 600px) { .svc-part__t { white-space: nowrap; font-size: min(clamp(1.125rem, 0.9rem + 1 * var(--vw), 1.625rem), calc((100cqi - 80px) / 16.8)); } }
.svc-part__arrow { font-size: 1.25rem; transition: transform var(--dur-base) var(--ease-out); }
/* hover / focus: the ink paints across the plank (the site's "paint" verb), the arrow nudges down */
.svc-part::before { content: ""; position: absolute; inset: 0; z-index: -1; background: var(--ink); transform: scaleX(0); transform-origin: right; transition: transform var(--dur-base) var(--ease-out); }
.svc-part { transition: color var(--dur-fast) var(--ease-out) 80ms; }
.svc-part:focus-visible { color: var(--ground); }
.svc-part:focus-visible::before { transform: scaleX(1); transform-origin: left; }
.svc-part:focus-visible .svc-part__arrow { transform: translateY(3px); }
@media (hover: hover) and (pointer: fine) {
  .svc-part:hover { color: var(--ground); }
  .svc-part:hover::before { transform: scaleX(1); transform-origin: left; transition-duration: var(--dur-slow); }
  .svc-part:hover .svc-part__arrow { transform: translateY(3px); }
}
.svc-hero :deep(.ph__side) { width: 100%; }
@media (min-width: 600px) { .svc-hero.ph :deep(.ph__title) { font-size: min(var(--step-5), calc(8 * var(--vw) + 0.5rem)); } }

/* S2 */
.plan { padding-block: var(--section); display: grid; gap: clamp(36px, 5vw, 56px); }
.plan__head { display: grid; gap: clamp(16px, 2vw, 28px); align-content: start; }
.plan__statement { max-width: 22ch; }
.plan__lists { display: grid; gap: 36px; }
.plan__lists :deep(.wl__list) { gap: 10px; }
@media (min-width: 640px) { .plan__lists { grid-template-columns: 1fr 1fr; gap: clamp(24px, 3vw, 48px); } }
@media (max-width: 599px) { .plan__title { font-size: clamp(2rem, 10vw, 2.5rem); } }
/* 5/7 only where "COORDINATION" fits its column at a sign size */
@media (min-width: 1024px) {
  .plan { grid-template-columns: 5fr 7fr; gap: 48px; align-items: start; }
  .plan__title { font-size: min(calc(3.4 * var(--vw) + 0.5rem), var(--step-4)); }
  .plan__lists { padding-top: 0.5rem; }
}

/* S3 */
.design { background: var(--field); color: var(--on-field); padding-block: var(--section); }
.design__lead { margin-top: clamp(16px, 2vw, 24px); font-size: var(--step-1); line-height: 1.45; max-width: 40ch; }
.design__cols { display: grid; gap: 40px; margin-top: clamp(40px, 5vw, 72px); align-items: start; }
.design__statement { margin-top: 28px; max-width: 20ch; }
@media (max-width: 599px) { .design__title { font-size: 8.4vw; } }
@media (min-width: 900px) {
  .design__cols { grid-template-columns: 3fr 5fr 4fr; gap: clamp(32px, 3.4vw, 56px); }
}

/* S4 */
.stations { padding-block: var(--section); display: grid; gap: clamp(28px, 4vw, 56px); align-items: center; }
.stations__img { width: 100%; max-width: 430px; }
.stations__text { order: -1; } /* stacked: heading first, so the photo credit never sits above it like a kicker */
.stations__body { margin: 20px 0 28px; font-size: var(--step-1); line-height: 1.45; max-width: 40ch; }
@media (max-width: 599px) { .stations__title { font-size: clamp(2rem, 10vw, 2.5rem); } .stations__img { max-width: 320px; } }
@media (min-width: 900px) {
  .stations { grid-template-columns: repeat(12, minmax(0, 1fr)); gap: 0 clamp(16px, 2vw, 32px); }
  .stations__img { grid-column: 1 / span 4; }
  .stations__text { grid-column: 6 / -1; order: 0; }

}

/* S5 */
.partners { background: var(--surface); padding-block: var(--section); }
.partners__grid { display: grid; gap: 36px; }
.partners__body { margin-top: 18px; font-size: var(--step-1); line-height: 1.45; max-width: 34ch; }
.partners__one { margin-top: 24px; }
.partners__list { list-style: none; margin: 0; padding: 0; display: grid; gap: 6px; font-size: var(--step-2); line-height: 1.3; font-weight: 500; }
@media (min-width: 900px) { .partners__grid { grid-template-columns: 5fr 1fr 6fr; } .partners__list { grid-column: 3; } }
</style>
