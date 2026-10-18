<script setup lang="ts">
// Home (Events v2, events-v2-system.md §8 Home). The /crepes language for the events business:
//   hero    the palm-sunset loop full bleed under a flat brown multiply tint, the header over it. "Buonasera," +
//           YOUR PARTY, / ALL IN HAND rising letter by letter bottom-left; the lead on a brown plate; the inquiry pill.
//           Bottom-right a brown board with an apricot valance: the three ways in + the video's Pause and credit.
//   curtain the hero holds while the cream sheet (PLANNED, STYLED, SERVED + the example party) slides over it.
//   rooms   the signature: three service chapters, each a field half + a photo half that runs to the viewport edge for
//           the whole chapter height, on alternating sides. ≥ 900 × 600 with motion allowed they are sticky rooms the
//           next one slides over (scalloped field edge); the photo inside an arriving room lags behind its window
//           (counter-parallax, transform on the img only). Otherwise three plain rooms / bands.
//   where   AT HOME OR / ON THE BEACH over the Naples pier band (title on brown planks), the occasions list under it.
//   crêpes  the market stand (HomeCrepes): CRÊPES / AT THE MARKET on brown, the pour under an apricot valance → /crepes.
//   close   CloseCta (cream) + the stair of four steps that rise.
import { credits, heroVideo, type Found } from '~/data/credits'
import { pillars } from '~/data/pillars'

definePageMeta({ hero: 'photo', field: 'yellow', awning: 'apricot' })
usePageSeo({
  title: 'Events & Catering in Naples, FL',
  description: 'Private celebrations in Naples and Southwest Florida: planning, design with in-house florals, and live food stations cooked at your party. No packages.',
})

const hv = ref<{ toggle: () => void, playing: boolean, available: boolean } | null>(null)
const videoCredit = heroVideo.credit

// The three rooms. Photos are the full-size originals, cropped by object-position into a tall half (phones: 1:1).
// Stations uses Luka's AI crêpe image (the one /crepes ships), framed on the hand serving the plate, not on the pour
// that /crepes' hero is built around. `rows`: what the room holds, as a ruled list (data from the service pages).
interface Room { id: string, lines: string[], field: string, pill: string, to: string, label: string, statement: string, rows: string[], alt: string, pos: string, posM: string, photo?: Found, concept?: { src: string, w: number, h: number } }
const chapters: Room[] = [
  {
    id: 'stations', lines: ['Live', 'stations'], field: 'apricot', pill: 'pill--ink', to: '/live-stations', label: 'See all six stations',
    rows: ['Crêpes, tiramisu, fruit cups', 'Charcuterie and cannoli', 'Cocktails & mocktails'],
    statement: 'Cooked at the party: the griddle from our market stand, brought to yours.',
    concept: { src: '/img/crepes/seq-source-3344.webp', w: 3344, h: 1882 }, pos: '35% 62%', posM: '40% 62%',
    alt: 'Illustration of folded crêpes with berries and cream, handed across a café counter on a plate',
  },
  {
    id: 'picnic', lines: ['Luxury', 'picnics'], field: 'yellow', pill: 'pill--ink', to: '/luxury-picnics', label: 'Plan a picnic',
    rows: ['Low tables, rugs and cushions', 'Linens, tableware and candles', 'Setup and breakdown'],
    statement: 'On the sand or in a park: set before you arrive, gone after you leave.',
    photo: { ...credits.clamPass, src: '/img/world/clam-pass-sunset.jpg', w: 1600, h: 1200 }, pos: '52% 50%', posM: '52% 40%',
    alt: 'The sun going down behind clouds over the calm Gulf at Clam Pass Beach, Naples',
  },
  {
    id: 'bloom', lines: ['Bloom', 'Cart'], field: 'sage', pill: 'pill--cream', to: '/bloom-cart', label: 'See the Bloom Cart',
    rows: ['We pick the flowers', 'The cart is set', 'Guests tie a bouquet'],
    statement: 'Décor, an activity and a favor in one: every guest goes home with flowers.',
    photo: { ...credits.flowers, src: '/img/world/flower-market-buckets.jpg', w: 1600, h: 1066 }, pos: '40% 60%', posM: '40% 60%',
    alt: 'Buckets of fresh cut flowers at a flower market stall',
  },
]

const occasions = ['Birthdays & milestones', 'Bridal & baby showers', 'Engagements & anniversaries', 'Intimate weddings', 'Rehearsal dinners', 'Brunches & private dinners', 'Corporate & social gatherings']
const steps = [
  { t: 'Tell us', s: 'The date, the place and the idea.' },
  { t: 'We talk', s: 'By call or over coffee.' },
  { t: 'Proposal', s: 'Built on your event, never a package.' },
  { t: 'The day', s: 'We run it, from setup to pack‑out.' },
]

// Curtain companion (as Picnics): while the hero holds and its words drift up 12vh, the voice and the title would be
// cut by the header (cream once scrolled) or, with the header away, by the top edge. Each steps aside (PageHero's
// 240 ms tuck) as soon as it reaches that edge. Off under reduced motion (no curtain there).
onMounted(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const hdr = document.querySelector<HTMLElement>('.site > header, header')
  const els = [...document.querySelectorAll<HTMLElement>('.home .phx__voice, .home .phx__title')]
  if (!els.length) return
  let raf = 0
  const frame = () => {
    raf = 0
    const edge = Math.max(0, hdr?.getBoundingClientRect().bottom ?? 0)
    for (const el of els) el.classList.toggle('home-under', window.scrollY > 0 && el.getBoundingClientRect().top < edge + 8)
  }
  const onScroll = () => { if (!raf) raf = requestAnimationFrame(frame) }
  window.addEventListener('scroll', onScroll, { passive: true })
  onBeforeUnmount(() => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf) })
})

// Rooms (only while they are sticky: same media query as the CSS). Each room after the first starts 45svh below the
// previous one's end (its margin), so the pinned room holds, whole and uncovered, for 45svh before the next arrives.
// One rAF per scroll event (native touch, Lenis):
//   the arriving room's photo lags behind its window (transform on the <img> only);
//   the room being covered lets its words drift up (−6vh) and steps each block aside just before the next room's
//   edge reaches it (the hero curtain's tuck), so no words are ever read through the room sliding over them.
//   A block that holds focus is never stepped aside, and focusing into a room scrolls it to its pinned position.
const rooms = ref<HTMLElement | null>(null)
const { $lenis } = useNuxtApp()
onMounted(() => {
  const root = rooms.value
  if (!root) return
  const mq = matchMedia('(min-width: 900px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)')
  const secs = [...root.querySelectorAll<HTMLElement>('.chap')].map(s => ({
    s,
    img: s.querySelector<HTMLElement>('.chap__photo img'),
    text: s.querySelector<HTMLElement>('.chap__text'),
  }))
  let tick = 0
  const frame = () => {
    tick = 0
    const vh = window.innerHeight
    const act = document.activeElement
    secs.forEach(({ s, img, text }, i) => {
      if (i > 0 && img) {
        const p = Math.min(1, Math.max(0, s.getBoundingClientRect().top / vh)) // 1 = arriving at the bottom, 0 = pinned
        img.style.transform = p ? `translate3d(0, ${(-p * 0.3 * vh).toFixed(1)}px, 0)` : ''
      }
      const next = secs[i + 1]
      if (!next || !text) return
      const edge = next.s.getBoundingClientRect().top - 16 // the scallops ride 16 px above the next room
      const q = Math.min(1, Math.max(0, (vh - edge) / vh))
      const holdsFocus = !!act && text.contains(act)
      text.style.transform = q && !holdsFocus ? `translate3d(0, ${(-6 * q).toFixed(2)}vh, 0)` : ''
      for (const b of text.children as HTMLCollectionOf<HTMLElement>) b.classList.toggle('is-tucked', !b.contains(act) && edge < vh - 1 && b.getBoundingClientRect().bottom > edge - 24)
    })
  }
  const onScroll = () => { if (!tick) tick = requestAnimationFrame(frame) }
  // where room i sits pinned: the rooms' natural tops (sticky offsets ignored) = sum of the earlier heights + margins
  const pinnedY = (i: number) => {
    let y = root.getBoundingClientRect().top + window.scrollY
    for (let j = 0; j <= i; j++) {
      const el = secs[j]!.s
      y += parseFloat(getComputedStyle(el).marginTop) || 0
      if (j < i) y += el.offsetHeight
    }
    return y
  }
  const onFocus = (e: FocusEvent) => {
    if (!mq.matches) return
    const i = secs.findIndex(x => x.s.contains(e.target as Node))
    if (i < 0) return
    const y = pinnedY(i)
    if ($lenis) $lenis.scrollTo(y, { immediate: true, force: true })
    else window.scrollTo({ top: y, behavior: 'instant' as ScrollBehavior })
    frame()
  }
  const reset = () => {
    for (const { img, text } of secs) {
      if (img) img.style.transform = ''
      if (text) { text.style.transform = ''; for (const b of text.children) b.classList.remove('is-tucked') }
    }
  }
  const bind = () => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onScroll)
    if (mq.matches) { window.addEventListener('scroll', onScroll, { passive: true }); window.addEventListener('resize', onScroll, { passive: true }); frame() }
    else reset()
  }
  mq.addEventListener('change', bind)
  root.addEventListener('focusin', onFocus)
  bind()
  onBeforeUnmount(() => { mq.removeEventListener('change', bind); root.removeEventListener('focusin', onFocus); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(tick) })
})
</script>

<template>
  <div class="home">
    <PageHero
      id="home-title" layout="photo" title="Your party, all in hand" :lines="['Your party,', 'all in hand']" voice="Buonasera," voice-lang="it"
      :tint="0.55" :tint-wide="0.5" curtain
    >
      <template #media>
        <HeroVideo
          ref="hv"
          poster="/video/palm-sunset-poster-1600.webp"
          poster-mobile="/video/palm-sunset-poster-800x1000.webp"
          :poster-large="heroVideo.posterLarge"
          :sources="[{ src: heroVideo.webm, type: 'video/webm' }, { src: heroVideo.mp4, type: 'video/mp4' }]"
          :sources-mobile="[{ src: heroVideo.mobile, type: 'video/mp4' }]"
          :sources-large="[{ src: heroVideo.largeWebm, type: 'video/webm' }, { src: heroVideo.largeMp4, type: 'video/mp4' }]"
          position="50% 62%" position-mobile="100% 50%" video-position-mobile="96% 50%"
        />
      </template>
      <template #lead>Planning, design with our own florals, and live food stations, across Naples and Southwest Florida.</template>
      <template #actions>
        <NuxtLink to="/inquire" class="pill pill--sun">Start an inquiry <span class="pill__arrow" aria-hidden="true">→</span></NuxtLink>
        <a href="#pillars" class="pill pill--ghost home__more">What we do <span class="pill__arrow pill__arrow--down" aria-hidden="true">↓</span></a>
      </template>
      <template #board>
        <Board tone="brown" valance="apricot" drop flush="right" class="hb">
          <nav aria-label="What we do">
            <ul class="hb__ways">
              <li v-for="(p, i) in pillars" :key="p.id" class="hb__row m-in" :style="{ '--m-d': `${980 + i * 80}ms` }">
                <NuxtLink :to="p.to" class="hb__way"><span class="hb__name">{{ p.name }}</span><span class="hb__arrow" aria-hidden="true">→</span></NuxtLink>
              </li>
            </ul>
          </nav>
          <div class="hb__foot m-in" style="--m-d: 1220ms">
            <button
              type="button" class="pill pill--s pill--ghost hb__toggle" :class="{ 'is-off': !hv?.available }" :tabindex="hv?.available ? undefined : -1"
              :aria-hidden="hv?.available ? undefined : 'true'" :aria-label="hv?.playing ? 'Pause background video' : 'Play background video'" @click="hv?.toggle()"
            >
              <span class="hb__icon" :class="hv?.playing ? 'is-pause' : 'is-play'" aria-hidden="true" />{{ hv?.playing ? 'Pause' : 'Play' }}
            </button>
            <p class="hb__credit">
              Video: <a :href="videoCredit.page" class="hb__a" rel="noopener" target="_blank">{{ videoCredit.creator }}<span class="sr-only"> (opens in a new tab)</span></a>, <a :href="videoCredit.licenseUrl" class="hb__a" rel="noopener license" target="_blank">{{ videoCredit.license }}<span class="sr-only"> (opens in a new tab)</span></a>
            </p>
          </div>
        </Board>
      </template>

      <!-- the cream sheet that slides over the hero: three parts × an example party -->
      <template #sheet>
        <section id="pillars" v-stage class="pillars" aria-labelledby="pillars-title">
          <div class="wrap">
            <div class="pillars__head">
              <RiseText id="pillars-title" :lines="['Planned, styled,', 'served']" size="l" />
              <p class="statement pillars__intro st-in" style="--i: 2">Take one part, or hand us all three. Pick one to see what it covers at an example party.</p>
            </div>
            <PillarExplorer />
          </div>
        </section>
      </template>
    </PageHero>

    <!-- the signature: three rooms, a field half and a photo half to the viewport edge, sticky from 900 × 600 -->
    <div id="home-chapters" ref="rooms" class="chapters">
      <section
        v-for="(c, i) in chapters" :id="`home-${c.id}`" :key="c.id" class="chap" :class="[`chap--${c.id}`, `chap--${c.field}`, { 'chap--flip': i % 2 === 1 }]"
        :aria-labelledby="`${c.id}-title`"
      >
        <ChapterEdge class="chap__edge" />
        <div class="chap__room">
          <div class="chap__field">
            <div v-stage class="chap__text">
              <RiseText :id="`${c.id}-title`" :lines="c.lines" size="l" class="chap__title" />
              <ul class="chap__rows">
                <li v-for="(r, k) in c.rows" :key="r" class="chap__row"><span class="chap__rule st-draw" :style="{ '--i': k + 1 }" aria-hidden="true" /><span class="chap__rt st-in" :style="{ '--i': k + 1.5 }">{{ r }}</span></li>
              </ul>
              <p class="statement chap__statement st-in" style="--i: 4">{{ c.statement }}</p>
              <NuxtLink :to="c.to" class="pill st-in" :class="c.pill" style="--i: 5">{{ c.label }} <span class="pill__arrow" aria-hidden="true">→</span></NuxtLink>
            </div>
          </div>
          <div class="chap__window">
            <ConceptImage v-if="c.concept" class="chap__photo" :src="c.concept.src" :width="c.concept.w" :height="c.concept.h" :alt="c.alt" sizes="xs:100vw sm:100vw md:100vw lp:100vw" :position="c.pos" :style="{ '--pos-m': c.posM }" />
            <FoundPhoto v-else-if="c.photo" class="chap__photo" :photo="c.photo" :alt="c.alt" credit="over" sizes="xs:100vw sm:100vw md:100vw lp:100vw" :position="c.pos" :style="{ '--pos-m': c.posM }" />
          </div>
        </div>
      </section>
    </div>

    <!-- where: the title over the pier band, the occasions under it -->
    <section class="where" aria-labelledby="where-title">
      <HomeBand
        :photo="credits.pier" :photo-mobile="{ src: '/img/world/naples-pier-sunset.jpg', w: 1600, h: 1200 }"
        alt="The Naples Pier at dusk, seen across the beach and sea grapes" :tint="0.22" position="42% 62%" position-mobile="34% 50%"
      >
        <RiseText id="where-title" :lines="['At home or', 'on the beach']" size="l" :cap-w="0.78" class="where__title" />
      </HomeBand>
      <div v-stage class="wrap where__body">
        <div class="where__grid">
          <ul class="where__occ" aria-label="Occasions we set up for">
            <li v-for="(o, k) in occasions" :key="o" class="where__o st-rise" :style="{ '--i': k * 0.75 }">{{ o }}</li>
          </ul>
          <div class="where__side st-in" style="--i: 1">
            <p class="where__p">We set up at private homes, backyards, beaches and parks across Naples and Southwest Florida. For public places we confirm the rules and any permits before we finalize.</p>
            <NuxtLink to="/how-we-work" class="pill pill--line">How we work <span class="pill__arrow" aria-hidden="true">→</span></NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- the market stand: the way to /crepes -->
    <HomeCrepes />

    <!-- close: the planks, then what happens next as a stair of four boards, each a little higher -->
    <CloseCta :lines="['Pick a date,', 'leave the rest']" field="cream">
      <template #after>
        <ol v-stage class="stair" aria-label="What happens next">
          <li v-for="(n, i) in steps" :key="n.t" class="stair__step st-rise" :class="`stair__step--${i}`" :style="{ '--i': i }">
            <p class="stair__t">{{ n.t }}</p>
            <p class="stair__s">{{ n.s }}</p>
          </li>
        </ol>
        <NuxtLink to="/how-we-work" class="link link-draw stair__more">How we work, step by step</NuxtLink>
      </template>
    </CloseCta>
  </div>
</template>

<style scoped>
/* ── hero ── */
/* phones: the primary keeps its full label; the jump shrinks to its word */
@media (max-width: 599px) {
  .home :deep(.phx__actions) .pill--sun { flex: 1 1 auto; }
  .home :deep(.phx__actions) .home__more { flex: 0 1 auto; }
}
@media (max-width: 359px) { .home__more { padding-inline: 12px; } }
/* under 900 px the jump pill can land on the sunlit part of the clip: it gets the brown plate fill (≥ 4.5:1) */
@media (max-width: 899px) { .home__more:not(:hover) { background: var(--field-dark); } }
/* phones / tablets: the moving picture owns the first screen (title + actions on it); the lead and the board follow as
   the hero's brown band, the way the /crepes hero hands over to its signboard */
@media (max-width: 899px) and (min-height: 560px) { .home :deep(.phx--photo) { min-height: calc(100svh + 200px); } }

/* the board: three ways in, then the video's control and credit */
.hb__ways { list-style: none; margin: 0; padding: 0; }
.hb__way {
  display: flex; align-items: center; justify-content: space-between; gap: 16px; min-height: 48px; padding-block: 6px;
  color: inherit; text-decoration: none; touch-action: manipulation;
}
.hb__name { font-weight: 700; font-size: clamp(1.125rem, 0.8rem + 0.7vw, 1.5rem); line-height: 1.15; letter-spacing: -0.01em; white-space: nowrap; /* one line in any font: a webfont swap never changes the board's height (CLS 0) */ transition: transform var(--dur-base) var(--ease-out); }
.hb__arrow { flex: none; font-weight: 600; transition: transform var(--dur-base) var(--ease-out); }
.hb__way:focus-visible { outline-offset: 2px; }
.hb__way:active .hb__name { transform: translateX(3px); }
@media (hover: hover) and (pointer: fine) {
  .hb__way:hover .hb__name { transform: translateX(6px); }
  .hb__way:hover .hb__arrow { transform: translateX(3px); color: var(--accent); }
}
.hb__foot { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 16px; margin-top: 4px; } /* + the board's own 14 px gap */
.hb__toggle { gap: 8px; min-width: 7.5rem; } /* fixed: Play ↔ Pause never reflows the foot (CLS 0) */
.hb__toggle.is-off { visibility: hidden; }
.hb__icon { position: relative; width: 10px; height: 12px; flex: none; }
.hb__icon.is-pause { border-inline: 3px solid currentColor; }
.hb__icon.is-play { clip-path: polygon(0 0, 100% 50%, 0 100%); background: currentColor; }
.hb__credit { font-size: 0.8125rem; line-height: 1.4; }
.hb__a { color: inherit; text-decoration: underline 1px; text-underline-offset: 3px; text-decoration-color: color-mix(in srgb, currentColor 55%, transparent); }
@media (hover: hover) and (pointer: fine) { .hb__a:hover { text-decoration-color: currentColor; } }

.home :deep(.home-under) { opacity: 0 !important; visibility: hidden; transition: opacity 240ms var(--ease-out), visibility 0s linear 240ms; }

/* ── the sheet ── */
.pillars { padding-block: var(--space-section); background: var(--ground); color: var(--ink); }
.pillars__head { display: grid; gap: var(--space-tight); margin-bottom: var(--space-head); }
.pillars__intro { max-width: 30ch; font-size: var(--step-1); }
@media (min-width: 900px) {
  .pillars__head { grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); align-items: end; column-gap: clamp(32px, 5vw, 96px); }
  .pillars__intro { padding-bottom: 0.4em; }
}

/* ── the rooms ── */
.chap { position: relative; --chap-bg: var(--accent); --chap-ink: var(--ink-deep); background: var(--chap-bg); color: var(--chap-ink); }
.chap--yellow { --chap-bg: var(--field); --chap-ink: var(--ink); }
.chap--sage { --chap-bg: var(--field-2); --chap-ink: var(--ink-deep); }
.chap .chap__edge { z-index: 2; }
.chap__room { display: grid; grid-template-columns: minmax(0, 1fr); }
.chap__field { display: grid; align-content: end; padding: clamp(40px, 9vw, 72px) var(--gutter) clamp(36px, 8vw, 56px); }
.chap__text { display: flex; flex-direction: column; align-items: flex-start; gap: 20px; min-width: 0; }
/* the three signs share one size: the fit is computed for the longest of them ("stations", 8) */
.chap :deep(.rt) { --fit-n: 8 !important; }
.chap__statement { max-width: 30ch; font-size: var(--step-1); line-height: 1.35; }
@media (min-width: 1100px) { .chap__statement { font-size: clamp(1.5rem, 0.9rem + 0.9 * var(--vw), 1.75rem); max-width: 27ch; } }
.chap__rows { list-style: none; margin: 4px 0 0; padding: 0; width: min(100%, 28rem); }
/* a ruled list, as the /crepes menu: each 2 px rule draws left → right, then its words rise */
.chap__row { position: relative; padding: 12px 0 13px; font-weight: 700; font-size: var(--step-1); line-height: 1.2; letter-spacing: -0.01em; }
.chap__row:last-child { padding-bottom: 0; }
.chap__rule { position: absolute; left: 0; right: 0; top: 0; height: 2px; background: currentColor; }
.chap__rt { display: block; }
.chap__window { position: relative; aspect-ratio: 1 / 1; overflow: hidden; background: var(--field-dark); }
.chap__photo { position: absolute; inset: 0; }
.chap .chap__photo { position: absolute; inset: 0; }
.chap .chap__photo :deep(.found__frame) { height: 100%; }
.chap .chap__photo :deep(.found__img), .chap .chap__photo :deep(.concept__img) { object-position: var(--pos-m); }
/* phones: the next room's scallops overlap this photo's lower edge, so the credit sits top-right */
.chap .chap__photo :deep(.found__cap) { top: 0; bottom: auto; }
@media (min-width: 600px) and (max-width: 899px) { .chap__window { aspect-ratio: 4 / 3; } }

@media (min-width: 900px) {
  .chap__room { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); min-height: clamp(560px, 86svh, 960px); }
  .chap--flip .chap__window { order: -1; }
  /* the field half's words keep the page's outer edge (the 1440 column), the inner edge gets air */
  .chap__field { --edge: max(var(--gutter), calc((100vw - var(--max)) / 2 + var(--gutter))); align-content: stretch; padding: clamp(96px, 13svh, 136px) clamp(32px, 4.4vw, 80px) clamp(44px, 8svh, 80px) var(--edge); }
  /* the sign at the top of the room (it is what you read first as the room slides in), the rest at the bottom */
  .chap__field { display: flex; flex-direction: column; }
  .chap__text { flex: 1 1 auto; }
  /* the sign and its list read together at the top; the statement and the pill stand at the bottom */
  .chap__rows { margin-bottom: auto; padding-bottom: 28px; }
  .chap--flip .chap__field { padding-left: clamp(32px, 4.4vw, 80px); padding-right: var(--edge); }
  .chap__window { aspect-ratio: auto; min-height: 100%; }
  .chap .chap__photo :deep(.found__img) { object-position: var(--found-pos, 50% 50%); }
  .chap .chap__photo :deep(.concept__img) { object-position: var(--concept-pos, 50% 50%); }
  .chap .chap__photo :deep(.found__cap) { top: auto; bottom: 0; }
  /* the next room's scallops (16 px) peek over this photo's lower edge while it is pinned: the credit sits on them */
  .chap:not(:last-child) .chap__photo :deep(.found__cap) { bottom: 16px; }
  .chap.chap--flip .chap__photo :deep(.found__cap) { right: auto; left: 0; }
  /* the scallops run over the field half only; the photo half arrives with a clean edge */
  .chap .chap__edge { width: 50%; left: 0; }
  .chap--flip .chap__edge { left: 50%; }
}
/* pinned: each room holds a full screen while the next one slides over it; its photo lags behind its window */
@media (min-width: 900px) and (min-height: 600px) and (prefers-reduced-motion: no-preference) {
  .chap { position: sticky; top: 0; height: 100svh; }
  /* the hold: each room starts 45svh after the previous one ends, so the pinned room stays whole and uncovered for
     45svh of scroll before the next slides over it (the /crepes sequence holds at each stop) */
  .chap + .chap { margin-top: 45svh; }
  .chap__room { height: 100%; min-height: 0; }
  .chap + .chap .chap__photo :deep(:is(.found__img, .concept__img)) { height: calc(100% + 30svh); will-change: transform; }
  /* tucked = transparent and click-through but still focusable, so Shift+Tab can walk back into a covered room (the
     focus handler then scrolls it to its pinned position and the focused block never tucks) */
  .chap__text > * { transition: opacity 240ms var(--ease-out); }
  .chap__text > .is-tucked { opacity: 0 !important; pointer-events: none; }
  .chap__text > .is-tucked :deep(*) { opacity: 0 !important; transition: opacity 240ms var(--ease-out) !important; }
}

/* ── where ── */
.where { background: var(--surface); color: var(--ink); padding-bottom: var(--space-section); }
.where__title { color: var(--on-field-dark); }
/* the title stands on its own brown planks (one per line, the CloseCta move in the night colour), so the picture can
   keep a light, warm tint: cream on brown is 9.45:1 whatever the photo does under it */
.where :deep(.rt__line) { width: fit-content; background: var(--field-dark); padding: 0.12em 0.24em 0.04em; }
.where :deep(.rt__line + .rt__line) { margin-top: 0.08em; }
.where__body { margin-top: var(--space-block); }
.where__grid { display: grid; gap: 32px; align-items: end; }
/* the occasions: seven heavy rows at one size, fitted so the longest ("Corporate & social gatherings") holds one line;
   they rise once, 60 ms apart (the wheel that ticked forever is gone) */
.where__occ { list-style: none; margin: 0; padding: 0; container-type: inline-size; }
.where__o { font-weight: 700; letter-spacing: -0.015em; line-height: 1.14; white-space: nowrap; font-size: min(2.75rem, calc(100cqi / (29 * 0.6))); }
.where__side { display: grid; gap: 20px; justify-items: start; }
.where__p { font-size: var(--step-1); line-height: 1.45; max-width: 36ch; }
@media (min-width: 900px) { .where__grid { grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); column-gap: clamp(32px, 5vw, 96px); } }

/* ── close: the stair ── */
.stair { list-style: none; margin: 0; padding: 36px 0 0; display: grid; gap: 8px; }
.stair__step { --bg: var(--surface); --fg: var(--ink); background: var(--bg); color: var(--fg); padding: 18px 20px 20px; margin-left: calc(var(--i) * 6%); display: grid; gap: 6px; align-content: end; }
.stair__step--1 { --bg: var(--field); }
.stair__step--2 { --bg: var(--accent); --fg: var(--ink-deep); }
.stair__step--3 { --bg: var(--ink); --fg: var(--ground); position: relative; }
/* the day itself: the mark's half-sun stands on the last step */
.stair__step--3::before { content: ""; position: absolute; left: 22px; bottom: 100%; width: 56px; height: 28px; border-radius: 56px 56px 0 0; background: var(--accent); }
.stair__t { font-weight: 700; text-transform: uppercase; letter-spacing: var(--track-m); line-height: 1; font-size: clamp(1.75rem, 1.3rem + 2 * var(--vw), 2.75rem); }
.stair__s { font-family: var(--font-accent); font-style: italic; font-size: 1.125rem; line-height: 1.35; max-width: 24ch; }
.stair__more { display: inline-block; margin-top: 16px; padding-block: 9px; font-weight: 600; }
@media (max-width: 767px) { .stair__step--3 { margin-top: 28px; } }
@media (min-width: 768px) {
  .stair { grid-template-columns: repeat(4, minmax(0, 1fr)); align-items: end; gap: 12px; }
  .stair__step { margin-left: 0; min-height: calc(150px + var(--i) * 52px); padding: 20px 22px 22px; }
  .stair__t { font-size: min(2.75rem, calc(2.6 * var(--vw))); }
}
</style>
