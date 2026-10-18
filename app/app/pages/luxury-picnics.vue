<script setup lang="ts">
// Luxury Picnics (Events v2, events-v2-system.md §8; round 2 after review/v2-review-1.md P-P1-1…P-P2-1).
// Signature: the curtain hero + the "Where we set up" board.
//   Hero   full-bleed Clam Pass sunset under a flat brown multiply tint, "A PICNIC, / ALREADY SET" letters rising,
//          the brown "What it can include" board flush to the bottom-right corner with an apricot valance.
//          Phones: the board is not in the hero (it would hide the sun under a 500 px brown band); the same rows
//          open the cream sheet instead (CSS swaps them, one copy is ever rendered to assistive tech).
//   Sheet  (cream, slides over the hero) a half-bleed daytime Gulf (Vanderbilt Beach, credited) beside "WHERE WE /
//          SET UP" + six places in fitted heavy caps on a brown board. Move: the photo unrolls; each place rises out
//          of its own line, 90 ms apart, then the apricot half-sun rises from the board's lower edge.
//   Before / after (yellow) two boards built only from the page's own claims (set before you arrive, taken away
//          after, permits checked before booking). Move: the boards slide in from their edges, then the half-sun
//          crosses from the first board to the second and sets into its lower edge.
//   Close  (cream) CloseCta.
import { credits } from '~/data/credits'
definePageMeta({ hero: 'photo', field: 'apricot' })
usePageSeo({ title: 'Luxury picnics', description: 'Luxury picnics in Naples, FL: on the beach, in a park, a backyard or poolside at sunset. Low tables, cushions, florals, food, setup and breakdown.' })

const heroPhoto = { ...credits.clamPass, src: '/img/world/clam-pass-sunset.jpg', w: 1600, h: 1200 }
const where = ['Beach', 'Park', 'Private backyard', 'Poolside', 'Private property', 'Sunset spots']
const include = ['Low tables, rugs and cushions', 'Linens, tableware and candles', 'Fresh florals and signage', 'Charcuterie or desserts', 'Custom details', 'Setup and breakdown']
// The weather / rescheduling answer is not confirmed by the client yet, so it is not on the page (no placeholder).
// Vanderbilt Beach, Naples (CC BY 2.0, public/img/world/credits.json). Not in data/credits.ts yet (frozen for page
// agents): the credit shows under the picture; the footer list needs the entry (shared-file request).
const beach = { src: '/img/world/vanderbilt-beach.jpg', w: 1600, h: 989, title: 'Vanderbilt Beach, Naples, Florida', creator: 'Charles Patrick Ewing', license: 'CC BY 2.0', licenseUrl: 'https://creativecommons.org/licenses/by/2.0/', page: 'https://commons.wikimedia.org/wiki/File:Vanderbilt_Beach,_Naples,_Florida.jpg', changes: 'cropped' }
const inquiry = { path: '/inquire', query: { services: 'picnic' } }
// the places rise one line after another; the sun follows the last one
const PLACE_STEP = 90
const sunDelay = 200 + where.length * PLACE_STEP + 260

// Curtain companion: while the hero holds and its words drift up 12vh, the header (cream once scrolled) would sit
// on top of the voice line and the title's first line. Each steps aside (240 ms fade, PageHero's tuck timing) as soon
// as it reaches the header's lower edge. One rAF per scroll event; off under reduced motion (no curtain there).
onMounted(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const hdr = document.querySelector<HTMLElement>('.site > header, header')
  const els = [...document.querySelectorAll<HTMLElement>('.pic .phx__voice, .pic .phx__title')]
  if (!hdr || !els.length) return
  let raf = 0
  const frame = () => {
    raf = 0
    const edge = Math.max(0, hdr.getBoundingClientRect().bottom)
    for (const el of els) el.classList.toggle('pic-under', window.scrollY > 0 && el.getBoundingClientRect().top < edge + 8)
  }
  const onScroll = () => { if (!raf) raf = requestAnimationFrame(frame) }
  window.addEventListener('scroll', onScroll, { passive: true })
  onBeforeUnmount(() => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf) })
})
</script>

<template>
  <div class="pic">
    <PageHero
      id="lp-title" layout="photo" curtain
      title="A picnic, already set" :lines="['A picnic,', 'already set']" voice="Just arrive,"
      lead="Not a décor add-on: we bring the low table, the textiles, the flowers and the food, set it before you arrive and take it all away after."
      :photo="heroPhoto" :photo-mobile="credits.clamPass" position="50% 100%" position-mobile="58% 0%" :tint="0.62" :tint-wide="0.66"
      alt="The sun going down behind clouds over the calm Gulf at Clam Pass Beach, Naples, a white boardwalk leading to the sand"
    >
      <template #actions>
        <NuxtLink :to="inquiry" class="pill pill--sun">Plan a picnic <span class="pill__arrow" aria-hidden="true">→</span></NuxtLink>
        <a href="#where-title" class="pill pill--ghost">See where <span class="pill__arrow pill__arrow--down" aria-hidden="true">↓</span></a>
      </template>
      <template #board>
        <Board tone="brown" valance="apricot" drop flush="right" class="inc inc--hero">
          <h2 class="inc__title">What it can include</h2>
          <ul class="inc__list">
            <li v-for="i in include" :key="i" class="inc__row">{{ i }}</li>
          </ul>
        </Board>
      </template>

      <template #sheet>
        <!-- phones: what it can include, as the sheet's first block (the hero board is desktop only) -->
        <section class="wrap inc-m" aria-labelledby="inc-m-title">
          <h2 id="inc-m-title" class="display-m inc-m__title">What it can include</h2>
          <ul v-stage="include.length * 70" class="inc-m__list">
            <li v-for="(i, n) in include" :key="i" class="inc-m__row"><span class="inc-m__rule st-draw" :style="{ '--i': n }" aria-hidden="true" /><span class="st-in" :style="{ '--i': n }">{{ i }}</span></li>
          </ul>
        </section>

        <section id="where" class="where" aria-labelledby="where-title">
          <div class="wrap where__grid">
            <FoundPhoto class="where__photo" unveil ratio="4 / 5" sizes="sm:100vw lp:50vw" :photo="beach" position="34% 50%" alt="A tall white cloud over the calm turquoise Gulf at Vanderbilt Beach, Naples, on a clear afternoon" />
            <div class="where__main">
              <RiseText id="where-title" class="where__title" :lines="['Where we', 'set up']" size="l" />
              <Board tone="brown" valance="yellow" flush="right" class="where__board" :style="{ '--sun-d': `${sunDelay}ms` }">
                <ul v-stage="sunDelay + 600" class="where__list">
                  <li v-for="(w, n) in where" :key="w" class="where__place">
                    <span class="where__mask"><span class="where__w" :style="{ '--t': `${200 + n * PLACE_STEP}ms` }">{{ w }}</span></span>
                  </li>
                </ul>
                <span class="where__sun" aria-hidden="true" />
              </Board>
              <p class="statement where__for">For proposals, anniversaries, birthdays, showers and sunset dinners.</p>
            </div>
          </div>
        </section>
      </template>
    </PageHero>

    <section v-stage="1900" class="ba field-yellow sec" aria-label="Before you arrive and after you leave">
      <div class="wrap ba__grid">
        <Board tone="deep" class="ba__b ba__b--before">
          <RiseText :lines="['Before', 'you arrive']" as="h2" size="m" :fit="false" />
          <p class="statement ba__s">We set the low table, the rugs and cushions, the linens and candles, the flowers and the food.</p>
        </Board>
        <Board tone="brown" class="ba__b ba__b--after">
          <RiseText :lines="['After', 'you leave']" as="h2" size="m" :fit="false" />
          <p class="statement ba__s">We pack the table, the textiles and the flowers and take it all away with us.</p>
          <p class="ba__foot">On a public beach or in a park, we confirm the rules and any permits for your spot before we finalize your booking.</p>
        </Board>
        <span class="ba__sunbox" aria-hidden="true"><span class="ba__sun" /></span>
      </div>
    </section>

    <CloseCta :lines="['Pick a spot', 'and a date']" label="Plan a picnic" :to="inquiry" field="cream" />
  </div>
</template>

<style scoped>
/* Board's valance must be out of flow from the first paint: in the production CSS order Awning's own
   position: relative can land after Board's position: absolute, so the board is 36 px taller until hydration (CLS).
   Pinned here until Board.vue raises its selector (shared-file request in the build log). */
.pic :deep(.board > .board__valance) { position: absolute; top: 0; left: 0; right: 0; }
/* ── Hero ── */
/* the board: six short rows on brown, ruled like the /crepes menu (a real list, so rules are allowed) */
.board.inc { gap: 18px; }
/* fixed line boxes: the board sets the hero's height (bottom-aligned), so its height must not change when the web
   font replaces the fallback (CLS 0); every row is one line at this width */
.inc__title { font-weight: 700; font-size: var(--step-1); line-height: 1.2; height: 1.2em; letter-spacing: -0.01em; white-space: nowrap; }
.inc__list { list-style: none; margin: 0; padding: 0; }
.inc__row { display: flex; align-items: center; height: 44px; white-space: nowrap; border-top: 1px solid color-mix(in srgb, var(--on-field-dark) 28%, transparent); font-size: 1.0625rem; line-height: 1.35; }
.inc__row:last-child { border-bottom: 1px solid color-mix(in srgb, var(--on-field-dark) 28%, transparent); }
/* phones and small tablets: the hero keeps title, actions and the sun; the rows move into the sheet */
@media (max-width: 899px) {
  .pic :deep(.phx__board) { display: none; }
  /* the outline pill crosses the sun's reflection up to 899 px: give it the brown fill PageHero gives it < 600 */
  .pic :deep(.phx__actions .pill--ghost) { background: var(--field-dark); }
}
@media (min-width: 900px) { .inc-m { display: none; } }
/* 900–1199: the 4:3 picture fills the hero with no slack, which puts the sun behind "PICNIC,". Lean in 1.3× from the
   bottom edge (still ≤ 0.85 CSS px per source px) so the sun climbs above the title, under the header. */
@media (min-width: 900px) and (max-width: 1199px) { .pic :deep(.phx__img) { scale: 1.3; transform-origin: 50% 100%; } }

.pic :deep(.pic-under) { opacity: 0 !important; visibility: hidden; transition: opacity 240ms var(--ease-out), visibility 0s linear 240ms; }

/* ── Sheet ── */
.inc-m { padding-top: var(--space-section); }
.inc-m__title { font-size: min(var(--display-m), 8.4vw); margin-bottom: var(--space-tight); }
.inc-m__list { list-style: none; margin: 0; padding: 0; }
.inc-m__row { position: relative; padding: 12px 0 13px; font-size: 1.125rem; line-height: 1.35; font-weight: 500; }
.inc-m__rule { position: absolute; left: 0; right: 0; top: 0; height: 1px; background: var(--line); }
.inc-m__row:last-child { border-bottom: 1px solid var(--line); }

.where { padding-block: var(--space-section); }
.where__grid { display: grid; gap: var(--space-head); }
.where__main { display: grid; gap: var(--space-head); align-content: start; min-width: 0; }
.where__for { max-width: 26ch; }
/* "WHERE WE": three Ws run 0.74 em per capital, wider than the 0.7 the fit assumes */
.where__main > :deep(.rt) { --cap-w: 0.77; }
@media (max-width: 599px) { .where__for { font-size: 1.1875rem; } }
/* phones: title, board, statement, then the picture edge to edge closing the sheet, its credit under it */
.where__photo { margin-inline: calc(-1 * var(--gutter)); }
.where__photo :deep(.found__cap) { padding-inline: var(--gutter); }
@media (max-width: 899px) {
  .where__main { display: contents; }
  .where__main > :deep(.rt) { order: -3; }
  .board.where__board { order: -2; }
  .where__for { order: -1; }
  .where__photo { margin-top: var(--space-tight); }
}
.board.where__board { overflow: clip; padding-bottom: clamp(88px, 11vw, 168px); }
/* six places, one per line, all at the size of the longest (16 capitals) fitted to the board */
.where__list { container-type: inline-size; list-style: none; margin: 0; padding: 0; display: grid; gap: 0.06em; }
.where__place {
  font-weight: 700; text-transform: uppercase; letter-spacing: var(--track-l); line-height: var(--leading-l); white-space: nowrap;
  font-size: min(var(--display-l), calc(100cqi / (16 * var(--cap-w))));
}
.where__mask { display: inline-block; overflow: hidden; vertical-align: top; padding: 0.2em 0.04em 0.1em; margin: -0.2em -0.04em -0.1em; }
.where__w { display: inline-block; }
/* the half-sun of the mark stands on the board's lower edge */
.where__sun {
  position: absolute; right: clamp(22px, 4vw, 72px); bottom: 0; width: clamp(120px, 13vw, 200px); aspect-ratio: 2 / 1;
  border-radius: 999px 999px 0 0; background: var(--accent);
}
/* move (once, below the fold only): each place rises out of its line, then the sun comes up from the edge */
[data-stage="armed"] .where__w { transform: translateY(118%); }
[data-stage="in"] .where__w { transition: transform var(--dur-rise) var(--ease-out) var(--t); }
.where__board:has([data-stage="armed"]) .where__sun { transform: translateY(101%); }
.where__board:has([data-stage="in"]) .where__sun { transition: transform 1400ms var(--ease-out) var(--sun-d); }
@media (max-width: 899px) {
  .board.where__board { margin-left: calc(-1 * var(--gutter)); padding-left: var(--gutter); }
}
@media (min-width: 900px) {
  /* the picture runs to the left viewport edge for the section's full height (half-bleed panel) */
  .where { padding-block: 0; }
  .where__grid { grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); column-gap: clamp(40px, 5vw, 96px); align-items: stretch; }
  .where__photo { margin: 0 0 0 calc(-1 * (max(0px, (100vw - var(--max)) / 2) + var(--gutter))); display: grid; grid-template-rows: minmax(0, 1fr) auto; }
  .where__photo :deep(.found__cap) { padding: 8px 0 0 calc(max(0px, (100vw - var(--max)) / 2) + var(--gutter)); }
  .where__photo :deep(.found__frame) { aspect-ratio: auto !important; height: 100%; min-height: 560px; }
  .where__main { padding-block: var(--space-section); }
}

/* ── Before / after ── */
.ba__grid { --ba-gap: clamp(16px, 2vw, 32px); position: relative; display: grid; gap: var(--ba-gap); }
.board.ba__b { gap: var(--space-tight); align-content: start; padding: clamp(24px, 3vw, 48px) clamp(22px, 3vw, 48px) clamp(84px, 10vw, 140px); overflow: clip; }
.ba__s { max-width: 27ch; }
.ba__foot { margin-top: auto; font-size: 1.0625rem; line-height: 1.45; max-width: 40ch; }
.ba__b--after { color: var(--on-field-dark); }
@media (max-width: 599px) { .ba__s { font-size: 1.1875rem; } .board.ba__b { padding-bottom: 32px; } }
/* the half-sun: on phones it is not drawn (the boards stack); from 900 px it ends on the second board's lower edge */
.ba__sunbox { display: none; }
@media (min-width: 900px) {
  .ba__grid { grid-template-columns: 1fr 1fr; align-items: stretch; }
  .board.ba__b { grid-template-rows: auto auto 1fr; }
  .ba__sunbox {
    display: block; position: absolute; left: 0; bottom: 0; width: calc((100% - var(--ba-gap)) / 2); height: clamp(60px, 6.5vw, 100px);
    overflow: hidden; pointer-events: none; transform: translateX(calc(100% + var(--ba-gap)));
  }
  .ba__sun {
    position: absolute; right: clamp(22px, 3vw, 48px); bottom: 0; height: 100%; aspect-ratio: 2 / 1;
    border-radius: 999px 999px 0 0; background: var(--accent); transform: translateY(38%);
  }
  /* move (once, below the fold only): the boards slide in from their edges, then the sun crosses and sets */
  [data-stage="armed"] .ba__b--before { opacity: 0; transform: translateX(-48px); }
  [data-stage="armed"] .ba__b--after { opacity: 0; transform: translateX(48px); }
  [data-stage="armed"] .ba__sunbox { opacity: 0; transform: none; }
  [data-stage="armed"] .ba__sun { transform: none; }
  [data-stage="in"] .ba__b { transition: opacity 560ms var(--ease-out), transform 760ms var(--ease-out); }
  [data-stage="in"] .ba__b--after { transition-delay: 90ms; }
  [data-stage="in"] .ba__sunbox { transition: opacity 400ms var(--ease-out) 600ms, transform 1300ms var(--ease-in-out) 900ms; }
  [data-stage="in"] .ba__sun { transition: transform 700ms var(--ease-out) 2100ms; }
}
@media (min-width: 900px) and (max-height: 820px) { .inc__row { height: 38px; } }
</style>
