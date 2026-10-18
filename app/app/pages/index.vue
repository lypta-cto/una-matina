<script setup lang="ts">
import { credits, heroVideo } from '~/data/credits'
import { markets } from '~/data/markets'
// The live market line only once the client has confirmed at least one market; until then no day or time is shown.
const marketsConfirmed = markets.some(m => !m.tbc)

definePageMeta({ awning: 'apricot', field: 'yellow', media: true })
usePageSeo({
  title: 'Events & Catering in Naples, FL',
  description: 'Private celebrations in Naples and Southwest Florida: planning, design with in-house florals, and live food stations made in front of your guests. No packages.',
})
const nextSteps = ['Tell us the date, the place and the idea.', 'We talk it through, by call or over coffee.', 'You get a proposal built on your event.', 'We run the day, from setup to pack\u2011out.']
const occasions = ['Birthdays & milestones', 'Bridal & baby showers', 'Engagements & anniversaries', 'Intimate weddings', 'Rehearsal dinners', 'Brunches & private dinners', 'Corporate & social gatherings']
const videoCredit = { creator: heroVideo.credit.creator, href: heroVideo.credit.page, license: heroVideo.credit.license, licenseUrl: heroVideo.credit.licenseUrl }
</script>

<template>
  <div>
    <!-- H1: video under the awning, headline on a cream board -->
    <HeroVideo
      labelledby="home-title"
      poster="/video/palm-sunset-poster-1600.webp"
      poster-mobile="/video/palm-sunset-poster-800x1000.webp"
      :sources="[{ src: heroVideo.webm, type: 'video/webm' }, { src: heroVideo.mp4, type: 'video/mp4' }]"
      :sources-mobile="[{ src: heroVideo.mobile, type: 'video/mp4' }]"
      :sources-large="[{ src: heroVideo.largeWebm, type: 'video/webm' }, { src: heroVideo.largeMp4, type: 'video/mp4' }]"
      :poster-large="heroVideo.posterLarge"
      :credit="videoCredit"
    >
      <h1 id="home-title" class="sign-l home__title">
        <span class="m-line"><span class="m-line__i m-rise" style="--m-n: 0">Your party,</span></span>
        <span class="m-line"><span class="m-line__i m-rise" style="--m-n: 1">one team</span></span>
      </h1>
      <p class="statement home__statement m-follow">Planning, our own florals and food made in front of your guests in Naples and Southwest Florida.</p>
      <div class="home__actions m-follow">
        <NuxtLink to="/inquire" class="btn btn-primary">Start an inquiry</NuxtLink>
        <NuxtLink to="/services" class="link link-draw home__more">See what we do</NuxtLink>
      </div>
    </HeroVideo>

    <!-- H2: three pillars × example party -->
    <section class="wrap pillars" aria-labelledby="pillars-title">
      <div class="pillars__head">
        <h2 id="pillars-title" v-lines class="sign-l pillars__title">Planned, styled, served</h2>
        <p class="statement pillars__intro">Take one part, or hand us all three. Pick one to see what it covers at an example party.</p>
      </div>
      <PillarExplorer />
    </section>

    <!-- H3: three chapters (E2, peel / hinoki / UND NY). From 900 px each one is a full-screen field, sticky at the top;
         the next field wipes up over it with a scalloped top edge (the half-sun scallop of the valance, in solid tone).
         Phones, short screens and reduced motion: three plain bands. -->
    <div id="home-chapters" class="chapters">
      <section id="home-stations" class="chap chap--stations" aria-labelledby="stations-title">
        <ChapterEdge />
        <div class="wrap chap__grid">
          <div class="chap__text">
            <h2 id="stations-title" class="sign-l chap__title chap__title--long">Made in front of your guests</h2>
            <StationRotator target="#home-stations" class="chap__rot" />
            <p class="statement chap__statement">We started behind a crêpe griddle at the market. Now the griddle comes to your party.</p>
            <NuxtLink to="/live-stations" class="link link-draw chap__link">See all six stations</NuxtLink>
          </div>
          <FoundPhoto class="chap__photo" sizes="sm:100vw lp:560px" :photo="credits.griddle" ratio="4 / 5" alt="A thin crêpe cooking on a round cast-iron griddle" />
        </div>
      </section>
      <section class="chap chap--picnic" aria-labelledby="picnic-title">
        <ChapterEdge />
        <div class="wrap chap__grid">
          <div class="chap__text">
            <h2 id="picnic-title" class="sign-l chap__title">Luxury picnics</h2>
            <p class="statement chap__statement">A low table on the sand, florals and something sweet, set before you arrive and gone after you leave.</p>
            <NuxtLink to="/luxury-picnics" class="link link-draw chap__link">Plan a picnic</NuxtLink>
          </div>
          <FoundPhoto class="chap__photo chap__photo--sea" sizes="sm:100vw lp:560px" :photo="credits.clamPass" ratio="4 / 5" alt="The sun going down behind clouds over the calm Gulf at Clam Pass Beach, Naples" />
        </div>
      </section>
      <section class="chap chap--bloom" aria-labelledby="bloom-title">
        <ChapterEdge />
        <div class="wrap chap__grid">
          <div class="chap__text">
            <h2 id="bloom-title" class="sign-l chap__title">Bloom Cart</h2>
            <p class="statement chap__statement">Guests pick their stems and tie a bouquet to take home: décor, an activity and a favour in one.</p>
            <NuxtLink to="/bloom-cart" class="link link-draw chap__link">See the Bloom Cart</NuxtLink>
          </div>
          <FoundPhoto class="chap__photo" sizes="sm:100vw lp:560px" :photo="credits.flowers" ratio="4 / 5" alt="Buckets of fresh cut flowers at a flower market stall" />
        </div>
      </section>
    </div>

    <!-- H5: where we set up -->
    <section class="where" aria-labelledby="where-title">
      <div class="wrap"><h2 id="where-title" v-lines class="sign-l where__title">At home or on the beach</h2></div>
      <FoundPhoto class="where__photo" unveil bleed :photo="credits.pier" ratio="21 / 9" :parallax="0.07" alt="The Naples Pier at dusk, seen across the beach and sea grapes" />
      <div class="wrap">
        <div class="where__grid">
          <OccasionWheel :items="occasions" label="Occasions we set up for" />
          <div class="where__side">
            <p>We set up at private homes, backyards, beaches and parks across Naples and Southwest Florida. For public places we confirm the rules and any permits before we finalise.</p>
            <NuxtLink to="/how-we-work" class="link link-draw where__link">How we work</NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- H6: origin -->
    <section class="origin" aria-labelledby="origin-title">
      <div class="wrap origin__grid">
        <ConceptImage class="origin__img" unveil src="/img/placeholder/booth.webp" alt="Illustration of a cream market tent printed with Una Mattina Crêpes, with a crêpe counter and a striped side table" :width="1374" :height="1145" ratio="4 / 3" sizes="sm:100vw lp:40vw" />
        <div class="origin__text">
          <h2 id="origin-title" v-lines class="sign-l origin__title">Still at the market</h2>
          <p class="origin__body">Una Mattina began at the farmers market with one griddle and a striped apron. The market is still where most people meet us; events are where we bring everything else. One day there'll be a café.</p>
          <MarketStatus v-if="marketsConfirmed" class="origin__status" />
          <p v-else class="origin__status">Find us at the Naples farmers markets.</p>
          <div class="origin__links">
            <NuxtLink to="/about" class="link link-draw">Our story</NuxtLink>
            <NuxtLink to="/crepes" class="link link-draw">Crêpes at the market</NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- H7: close. Under it, what happens next as a stair of four flat boards (B4, peel / hinoki): each step stands a
         little higher, from the first message to the day itself. Static, no motion (the planks above are the moment). -->
    <CloseCta :lines="['Tell us', 'about your day']">
      <template #after>
        <ol class="stair" aria-label="What happens next">
          <li v-for="(n, i) in nextSteps" :key="n" class="stair__step" :class="`stair__step--${i}`" :style="{ '--i': i }">
            <p class="stair__t">{{ n }}</p>
          </li>
        </ol>
        <NuxtLink to="/how-we-work" class="link link-draw stair__more">How we work, step by step</NuxtLink>
      </template>
    </CloseCta>
  </div>
</template>

<style scoped>
.home__statement { margin-top: 14px; font-size: var(--step-1); max-width: 40ch; }
.home__actions { display: flex; flex-wrap: wrap; align-items: center; gap: 16px 28px; margin-top: 22px; }
.home__more { font-weight: 600; }
/* standalone text links: 44 px tap targets */
.home__more, .where__link, .origin__links .link { display: inline-block; padding-block: 9px; }
.home__statement { --m-d: 260ms; }
.home__actions { --m-d: 340ms; }
.home__title .m-rise { --m-d: 140ms; }
@media (max-width: 767px) {
  .home__title { font-size: clamp(2.1rem, 10.5vw, 2.6rem); }
  .home__actions { order: 2; margin-top: 18px; }
  .home__actions .btn { flex: 1 1 100%; }
  .home__statement { order: 3; }
  :deep(.hv__board) { display: flex; flex-direction: column; }
}

.pillars { padding-block: var(--section); }
.pillars__head { display: grid; gap: 16px; margin-bottom: clamp(28px, 4vw, 56px); }
.pillars__intro { max-width: 30ch; }
@media (max-width: 599px) { .pillars__title { font-size: var(--step-3); } }
@media (min-width: 900px) {
  .pillars__head { grid-template-columns: 7fr 5fr; align-items: end; }
  /* "PLANNED, STYLED," stays one line in 7 cols at 1024–1440 (2 lines total) */
  .pillars__title { font-size: min(var(--step-4), calc(4 * var(--vw) + 0.45rem)); }
}

/* H3 chapters */
.chap { position: relative; --chap-bg: var(--accent); --chap-ink: var(--ink-deep); background: var(--chap-bg); color: var(--chap-ink); padding-block: calc(var(--section) * 0.7); }
.chap--picnic { --chap-bg: var(--field); --chap-ink: var(--ink); }
.chap--bloom { --chap-bg: var(--field-2); --chap-ink: var(--ink-deep); }
.chap__grid { display: grid; grid-template-columns: minmax(0, 1fr); gap: clamp(28px, 4vw, 56px); }
.chap__text { display: grid; gap: 20px; justify-items: start; align-content: end; min-width: 0; }
.chap__statement { max-width: 32ch; }
/* phones: whole sentences stay within three lines */
@media (max-width: 599px) { .chap__statement, .home__statement { font-size: 1.1875rem; } }
@media (max-width: 359px) { .home__statement { font-size: 1.0625rem; } :deep(.hv__board) { padding-inline: 14px; } }
.chap__link { display: inline-block; padding-block: 9px; font-weight: 600; }
.chap__photo { width: 100%; max-width: 440px; }
.chap__photo :deep(.found__credit) { color: var(--chap-ink); }
.chap__photo :deep(.found__img) { transition: transform var(--dur-slow) var(--ease-out); }
.chap__photo--sea :deep(.found__img) { object-position: 50% 50%; }
.chap--stations .chap__photo :deep(.found__img) { object-position: 50% 45%; }
@media (hover: hover) and (pointer: fine) { .chap:has(.chap__link:hover) .chap__photo :deep(.found__img) { transform: scale(1.04); } }
@media (max-width: 599px) { .chap__title--long { font-size: var(--step-3); } }
@media (min-width: 900px) {
  .chap__grid { grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); align-items: end; }
  .chap__title--long { font-size: min(var(--step-4), calc(4.4 * var(--vw) + 0.4rem)); }
  .chap__photo { justify-self: end; max-width: 560px; }
}
/* the pinned version: a full screen per chapter, each sticky at the top, so the next one slides over it */
@media (min-width: 900px) and (min-height: 600px) and (prefers-reduced-motion: no-preference) {
  .chap { position: sticky; top: 0; height: 100svh; padding-block: clamp(104px, 13svh, 136px) clamp(40px, 7svh, 72px); display: grid; align-items: end; }
  .chap__photo { width: min(100%, calc((100svh - 250px) * 0.8), 560px); }
  /* a grid item with margin-inline: auto shrinks to its content: keep every chapter's grid the same width */
  .chap > .wrap { width: 100%; }
}

.where { padding-block: var(--section); }
.where__photo { margin-top: clamp(24px, 3vw, 40px); }
.where__photo :deep(.found__cap) { padding-inline: var(--gutter); text-align: right; }
@media (max-width: 767px) { .where__photo :deep(.found__frame) { aspect-ratio: 4 / 3 !important; } }
@media (max-width: 599px) { .where__title { font-size: clamp(2rem, 11vw, 2.875rem); } }

.where__grid { display: grid; gap: 28px; margin-top: clamp(24px, 3vw, 40px); }
.where__side { display: grid; gap: 14px; align-content: end; justify-items: start; font-size: var(--step-1); line-height: 1.45; max-width: 40ch; }
.where__link { font-weight: 600; }
@media (min-width: 900px) { .where__grid { grid-template-columns: 7fr 5fr; } }

.origin { background: var(--surface); padding-block: var(--section); }
.origin__grid { display: grid; gap: clamp(36px, 5vw, 64px); align-items: center; }
/* stacked: heading first, then the picture */
@media (max-width: 899px) { .origin__text { order: -1; } }
.origin__img { max-width: 690px; width: 100%; }
.origin__body { margin-top: 18px; font-size: var(--step-1); line-height: 1.45; max-width: 42ch; }
.origin__status { margin-top: 16px; }
.origin__links { display: flex; flex-wrap: wrap; gap: 12px 28px; margin-top: 20px; font-weight: 600; }
@media (min-width: 900px) { .origin__grid { grid-template-columns: 5fr 7fr; } }
@media (min-width: 900px) and (max-width: 1199px) { .origin__title { font-size: min(var(--step-4), calc(4.4vw + 0.75rem)); } }

.stair { list-style: none; margin: 0; padding: 36px 0 0; display: grid; gap: 8px; }
.stair__step { --bg: var(--surface); --fg: var(--ink); background: var(--bg); color: var(--fg); padding: 18px 20px 20px; margin-left: calc(var(--i) * 6%); display: flex; align-items: flex-end; }
.stair__step--1 { --bg: var(--field); }
.stair__step--2 { --bg: var(--accent); --fg: var(--ink-deep); }
.stair__step--3 { --bg: var(--ink); --fg: var(--ground); position: relative; }
/* the day itself: the mark's half-sun stands on the last step */
.stair__step--3::before { content: ""; position: absolute; left: 22px; bottom: 100%; width: 56px; height: 28px; border-radius: 56px 56px 0 0; background: var(--accent); }
.stair__t { font-family: var(--font-accent); font-style: italic; font-size: var(--step-1); line-height: 1.35; max-width: 24ch; }
.stair__more { display: inline-block; margin-top: 16px; padding-block: 9px; font-weight: 600; }
@media (max-width: 767px) { .stair__step--3 { margin-top: 28px; } }
@media (min-width: 768px) {
  .stair { grid-template-columns: repeat(4, minmax(0, 1fr)); align-items: end; gap: 12px; }
  .stair__step { margin-left: 0; min-height: calc(132px + var(--i) * 52px); padding: 20px 22px 22px; }
}
</style>
