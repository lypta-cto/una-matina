<script setup lang="ts">
// /crepes — QR landing from the market stand. Structure after Luka's reference (mornibali): a full-bleed
// photo hero, then one flat colour field per section. Una Mattina's own idea runs through it: the "A"
// of the mark turned upside down is a crêpe in its paper cone.
// Motion budget: the hero is the signature; every other section has one authored move, triggered once
// by v-inview (only for sections still below the fold at load, never under reduced motion, never
// without JS), in the --ease-out family. Springs only where something physically turns (the sign).
import type { Directive } from 'vue'
import { menu } from '~/data/menu'
import { markets, mapsUrl } from '~/data/markets'
import { contact } from '~/data/site'

definePageMeta({ layout: 'crepes' })
usePageSeo({
  title: 'Crêpes at the market',
  description: 'Una Mattina crêpes at the Naples farmers markets: the sweet and savory menu, where to find the stand this week, and our Instagram.',
})
useHead({ meta: [{ name: 'theme-color', content: '#5B3A2E' }] }) // brown, the hero's tint colour (token --field-dark)

const { status } = useMarketStatus()
const nextMarket = computed(() => status.value.market ?? markets[0] ?? null)
const directions = computed(() => (nextMarket.value ? mapsUrl(nextMarket.value) : null))

// Instagram: the URL is not confirmed yet. Never guess an external link: until it exists the handle is
// shown as text only and the bar's second button is "See the menu".
const igUrl = contact.instagram.url || ''

// "Sweet $8–11 · Savory $10–11", from the menu data (rolls in with the odometer).
const ranges = menu.filter(s => s.items.length).map((s) => {
  const p = s.items.map(i => i.price)
  const lo = Math.min(...p), hi = Math.max(...p)
  return { title: s.title, text: lo === hi ? `$${lo}` : `$${lo}–${hi}` }
})

const igCards = [
  { src: '/img/crepes/ig-booth-600.webp', alt: 'Illustration of the cream Una Mattina tent at a market, the crêpe counter in front' },
  { src: '/img/crepes/ig-griddles-600.webp', alt: 'Illustration of two crêpe griddles on the stand, fruit and toppings beside them' },
  { src: '/img/crepes/ig-latte-600.webp', alt: 'A latte with a leaf drawn in the foam, a striped linen towel beside it' },
  { src: '/img/crepes/ig-apron-600.webp', alt: 'Illustration of an apricot and cream striped Una Mattina apron' },
]

const allItems = menu.flatMap(s => s.items)
const featured = allItems.find(i => i.name === 'Pistachio Bliss') ?? allItems[0] ?? null

/**
 * v-inview: arms a section that is below the fold at load (adds .crp-armed, which the CSS uses as the
 * waiting state) and adds .crp-in once when it enters. Visible without JS and with reduced motion.
 */
const vInview: Directive<HTMLElement> = {
  mounted(el) {
    if (!('IntersectionObserver' in window)) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (el.getBoundingClientRect().top < window.innerHeight * 0.85) return
    el.classList.add('crp-armed')
    const io = new IntersectionObserver((entries) => {
      if (!entries.some(e => e.isIntersecting)) return
      io.disconnect()
      requestAnimationFrame(() => el.classList.add('crp-in'))
    }, { rootMargin: '0px 0px -18% 0px' })
    io.observe(el)
  },
}

// Curtain (section-library A2): the hero holds still (sticky) while the intro slides over it like a sheet;
// the hero's words drift up and fade, the picture leans in a little. One rAF per scroll event, transform
// and opacity only. Off under reduced motion (the hero then scrolls away normally).
// Sticky thumb bar (phones): appears once the intro has covered the hero, steps aside while you read
// downwards and comes back as soon as you scroll up or reach the end (like Safari's toolbar).
const pastHero = ref(false)
const goingUp = ref(true)
const showBar = computed(() => pastHero.value && goingUp.value)
onMounted(() => {
  const hero = document.getElementById('crepes-hero')
  const sheet = document.querySelector<HTMLElement>('.intro-sec')
  if (!hero || !sheet) return
  const body = hero.querySelector<HTMLElement>('.hero__body')
  const pic = hero.querySelector<HTMLElement>('.hero__media picture')
  const tucks = [...hero.querySelectorAll<HTMLElement>('.hero__hello, .hero__word, .hero__lead, .hero__actions, .hero__side, .hero__feat, .hero__status, .hero__plank')]
  const curtain = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const place = () => { if (curtain) hero.style.top = `${Math.min(0, window.innerHeight - hero.offsetHeight)}px` }
  if (curtain) { hero.classList.add('is-curtain'); place() }
  let lastY = window.scrollY
  let tick = 0
  const frame = () => {
    tick = 0
    const vh = window.innerHeight
    const top = sheet.getBoundingClientRect().top
    pastHero.value = top <= 1
    if (curtain) {
      const p = Math.min(1, Math.max(0, (vh - top) / vh))
      if (body) body.style.transform = p ? `translate3d(0, ${(-12 * p).toFixed(2)}vh, 0)` : ''
      // Each block of words steps aside just before the sheet reaches it, so nothing is ever read through it.
      const entering = top < vh - 1 // the sheet has started to cover the hero
      for (const el of tucks) el.classList.toggle('is-tucked', entering && el.getBoundingClientRect().bottom > top - 24)
      if (pic) pic.style.transform = p ? `scale(${(1 + 0.06 * p).toFixed(4)})` : ''
    }
    const y = window.scrollY
    const atEnd = y + vh >= document.documentElement.scrollHeight - 160
    if (Math.abs(y - lastY) > 6) goingUp.value = y < lastY || atEnd
    lastY = y
  }
  const onScroll = () => { if (!tick) tick = requestAnimationFrame(frame) }
  const onResize = () => { place(); onScroll() }
  frame()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onResize, { passive: true })
  onBeforeUnmount(() => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onResize) })
})
</script>

<template>
  <div class="crepes">
    <CrpNav :directions="directions" />
    <main id="main">
    <div class="curtain">
    <CrpHero :featured="featured" :directions="directions" menu-href="#menu" />

    <!-- The mark: A (morning) turns into the cone (crêpe). It slides over the hero like a sheet. -->
    <section class="intro-sec" aria-labelledby="intro-title">
      <div class="wrap intro">
      <CrpSignFlip class="intro__sign" />
      <div class="intro__text">
        <h2 id="intro-title" class="sign-l intro__title">One morning, one crêpe</h2>
        <p class="intro__body"><span lang="it">Una Mattina</span> is Italian for "one morning". Our sign is an A with the sun coming up inside it. Turn it upside down and it is a crêpe in its paper cone, which is how every one leaves our griddle.</p>
        <p class="intro__body">Tap or click the sign to turn it.</p>
      </div>
      </div>
    </section>
    </div>

    <!-- Menu: yellow field, two ruled columns -->
    <section id="menu" v-inview class="menu" aria-labelledby="menu-title">
      <div class="wrap">
        <div class="menu__head">
          <h2 id="menu-title" class="sign-l menu__title">Sweet, savory, folded hot</h2>
          <div class="menu__side">
            <p v-if="ranges.length" class="menu__prices"><Tbc note="prices follow the confirmed menu"><template v-for="(r, k) in ranges" :key="r.title"><span v-if="k" class="menu__dot" aria-hidden="true"> · </span>{{ r.title }} <CrpOdo :value="r.text" :delay="200 + k * 160" /></template></Tbc></p>
            <p class="menu__note">Prices in US dollars. Ask us about allergens, we are happy to help.</p>
          </div>
        </div>
        <div class="menu__cols">
          <MenuTable v-for="section in menu.filter(s => s.items.length)" :key="section.title" :title="section.title" :items="section.items" />
        </div>
      </div>
    </section>

    <!-- How a crêpe is made: pinned scroll sequence through one picture -->
    <CrpSequence />

    <!-- Find the stand: sage field, the week board -->
    <section id="visit" v-inview class="visit" aria-labelledby="visit-title">
      <div class="wrap">
        <h2 id="visit-title" class="sign-l visit__title">Come find the griddle</h2>
        <div class="visit__grid">
          <CrpWeekBoard v-if="markets.length" class="visit__board" />
          <p v-else class="visit__none">Market dates coming soon. Instagram will have them first.</p>
          <div class="visit__side">
            <p class="visit__heads"><strong>Heads up.</strong> Weather or a sold-out batter can close us early. Instagram has the latest.</p>
            <a v-if="igUrl" :href="igUrl" class="link visit__say" target="_blank" rel="noopener">Say hi on Instagram<span class="sr-only"> (opens in a new tab)</span></a>
          </div>
        </div>
      </div>
    </section>

    <!-- Instagram, without a feed: the handle is the headline, four of our pictures deal out -->
    <section id="follow" v-inview class="ig" aria-labelledby="ig-title">
      <div class="wrap ig__wrap">
        <div class="ig__head">
          <h2 id="ig-title" class="sign-l ig__handle"><Tbc note="Instagram handle">{{ contact.instagram.handle }}</Tbc></h2>
          <p class="ig__line">Where the stand is this week, what is new on the griddle, and the mornings we close early.</p>
          <a v-if="igUrl" :href="igUrl" class="crp-btn crp-btn--ink ig__btn" target="_blank" rel="noopener">Follow on Instagram <span class="crp-btn__arrow" aria-hidden="true">↗</span><span class="sr-only"> (opens in a new tab)</span></a>
        </div>
        <ul class="ig__cards">
          <li v-for="(c, i) in igCards" :key="c.src" class="ig__card" :style="{ '--i': i, zIndex: 4 - i }">
            <img :src="c.src" width="600" height="600" loading="lazy" decoding="async" :alt="c.alt">
          </li>
        </ul>
      </div>
    </section>

    </main>

    <!-- Footer: brown, sign-off + columns + full-width wordmark where the sun rises -->
    <footer v-inview class="foot">
      <div class="wrap">
        <div class="foot__top">
          <p class="signoff foot__sign">Good Food, Brighter Days</p>
          <div class="foot__cols">
            <div>
              <p class="foot__h">Follow</p>
              <a v-if="igUrl" :href="igUrl" class="link" target="_blank" rel="noopener">Instagram <Tbc note="Instagram handle">{{ contact.instagram.handle }}</Tbc><span class="sr-only"> (opens in a new tab)</span></a>
              <p v-else>Instagram <Tbc note="Instagram handle">{{ contact.instagram.handle }}</Tbc></p>
            </div>
            <div>
              <p class="foot__h">We also do events</p>
              <p class="foot__p">A live crêpe station, picnics and whole private celebrations at your home or on the beach.</p>
              <NuxtLink to="/" class="link">Una Mattina Events &amp; Catering</NuxtLink>
            </div>
          </div>
        </div>
        <div class="foot__mark"><CrpWordmarkRise /></div>
        <p class="foot__meta">© {{ new Date().getFullYear() }} Una Mattina ◆ Naples, Florida</p>
      </div>
    </footer>

    <!-- Sticky thumb bar (phones): a slim valance over a brown field -->
    <div class="bar" :class="{ 'is-on': showBar }" :aria-hidden="!showBar" :inert="!showBar || undefined">
      <Awning variant="valance" tone="apricot" :drop="false" class="bar__valance" />
      <div class="bar__row" :class="{ 'is-one': !directions }">
        <a v-if="directions" :href="directions" class="crp-btn crp-btn--sun" target="_blank" rel="noopener">Directions <span class="crp-btn__arrow" aria-hidden="true">↗</span><span class="sr-only"> (opens in a new tab)</span></a>
        <a v-if="igUrl" :href="igUrl" class="crp-btn crp-btn--cream" target="_blank" rel="noopener">Instagram</a>
        <a v-else href="#menu" class="crp-btn crp-btn--cream">See the menu</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.crepes { position: relative; }
/* Small phones: the section signs stay at two lines. */
@media (max-width: 399px) { .crepes :is(.intro__title, .menu__title, .visit__title) { font-size: min(var(--step-4), 10vw); } }
.foot, .bar { --focus-ring: var(--on-field-dark); }
.foot :focus-visible, .bar :focus-visible { outline-color: var(--on-field-dark); }

/* ---------- Intro: the sign turns ---------- */
.intro-sec { position: relative; z-index: 1; background: var(--ground); }
.intro { display: grid; gap: clamp(32px, 5vw, 72px); padding-block: var(--section); align-items: center; }
.intro__sign { width: min(68vw, 300px); justify-self: center; }
.intro__text { display: grid; gap: 16px; align-content: center; }
.intro__title { font-weight: 600; letter-spacing: -0.01em; }
@media (min-width: 900px) { .intro__title { font-size: min(var(--step-4), 5.2vw, 5.25rem); } }
.intro__body { font-size: var(--step-1); line-height: 1.45; max-width: 38ch; }
.intro__body + .intro__body { font-size: 1rem; color: var(--ink-muted); }
@media (min-width: 900px) {
  .intro { grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); }
  .intro__sign { width: min(32vw, 440px); justify-self: start; }
}

/* ---------- Menu ---------- */
.menu { background: var(--field); padding-block: var(--section); }
.menu__head { display: grid; gap: 12px; margin-bottom: clamp(28px, 4vw, 56px); }
.menu__title { font-weight: 600; letter-spacing: -0.01em; }
.menu__side { display: grid; gap: 6px; }
@media (min-width: 1280px) { .menu__head { grid-template-columns: minmax(0, 1fr) auto; align-items: end; } .menu__side { justify-items: end; text-align: right; } }
.menu__prices { font-weight: 700; font-size: var(--step-1); line-height: 1.2; }
.menu__note { max-width: 36ch; }
.menu__cols { display: grid; gap: 88px clamp(36px, 5vw, 64px); }
@media (min-width: 900px) {
  .menu__cols { grid-template-columns: 1fr 1fr; align-items: start; }
}
/* Title: one rise, then MenuTable draws its rules (one move for the section). */
.crp-armed .menu__title { opacity: 0; transform: translateY(20px); }
.crp-armed.crp-in .menu__title { opacity: 1; transform: none; transition: opacity 600ms var(--ease-out), transform 700ms var(--ease-out); }

/* ---------- Find the stand ---------- */
.visit { background: var(--field-2); color: var(--ink-deep); padding-block: var(--section); position: relative; z-index: 1; }
.visit__title { font-weight: 600; letter-spacing: -0.01em; }
.visit__grid { display: grid; gap: clamp(28px, 3vw, 40px); margin-top: clamp(28px, 3vw, 44px); grid-template-columns: minmax(0, 1fr); align-items: start; }
.visit__side { display: grid; gap: 14px; justify-items: start; max-width: 34ch; }
.visit__heads { font-size: 1.0625rem; line-height: 1.5; }
.visit__say { font-weight: 600; display: inline-block; padding-block: 10px; margin-block: -10px; }
.visit__none { font-size: var(--step-1); }
@media (min-width: 1024px) { .visit__grid { grid-template-columns: minmax(0, 8fr) minmax(0, 4fr); } .visit__side { padding-top: 8px; } }
/* The board's rows rise in, one after another. */
.crp-armed .visit__board :deep(.wb__row) { opacity: 0; transform: translateY(28px); }
.crp-armed.crp-in .visit__board :deep(.wb__row) { opacity: 1; transform: none; transition: opacity 560ms var(--ease-out) calc(120ms + var(--i) * 90ms), transform 760ms var(--ease-out) calc(120ms + var(--i) * 90ms); }

/* ---------- Instagram ---------- */
.ig { background: var(--surface); padding-block: var(--section); overflow: hidden; }
.ig__wrap { display: grid; gap: clamp(32px, 4vw, 56px); }
.ig__head { display: grid; gap: 14px; justify-items: start; align-content: end; }
.ig__handle { font-weight: 700; letter-spacing: -0.02em; text-transform: none; font-size: min(var(--step-4), 11vw); overflow-wrap: break-word; }
@media (min-width: 1100px) { .ig__handle { font-size: min(var(--step-4), 4.4vw); } }
.ig__line { font-size: var(--step-1); line-height: 1.45; max-width: 36ch; }
.ig__btn { margin-top: 6px; }
.ig__cards { --g: 16px; list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--g); }
.ig__card { position: relative; aspect-ratio: 1; overflow: hidden; background: var(--field-dark); }
.ig__card img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 700ms var(--ease-out); }
@media (hover: hover) and (pointer: fine) { .ig__card:hover img { transform: scale(1.04); } }
@media (min-width: 900px) {
  .ig__cards { grid-template-columns: repeat(4, minmax(0, 1fr)); }
}
@media (min-width: 1100px) {
  /* Handle and line on the left, the four cards fill the right: no empty quarter, tiles ≤ ~190 px. */
  .ig__wrap { grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); align-items: end; }
}
/* Dealt out from a stack: straight cards, translate only (house style: no rotation). */
.crp-armed .ig__card { transform: translateY(32px); opacity: 0; }
.crp-armed.crp-in .ig__card { transform: none; opacity: 1; transition: transform 900ms var(--ease-out) calc(var(--i) * 80ms), opacity 400ms var(--ease-out) calc(var(--i) * 80ms); }
@media (min-width: 900px) {
  .crp-armed .ig__card { opacity: 1; transform: translateX(calc((0 - var(--i)) * (100% + var(--g)))); }
  .crp-armed .ig__cards { opacity: 0; }
  .crp-armed.crp-in .ig__cards { opacity: 1; transition: opacity 300ms var(--ease-out); }
}

/* ---------- Footer ---------- */
.foot { background: var(--field-dark); color: var(--on-field-dark); padding-top: clamp(56px, 8vw, 112px); padding-bottom: 40px; --logo-sun: var(--accent); }
.foot__top { display: grid; gap: 32px; }
.foot__cols { display: grid; gap: 28px; }
.foot__h { font-weight: 700; margin-bottom: 6px; }
.foot__p { margin-bottom: 8px; max-width: 34ch; }
.foot .link { display: inline-block; padding-block: 10px; margin-block: -10px; }
.foot__mark { margin-top: clamp(40px, 6vw, 88px); color: var(--on-field-dark); overflow: hidden; }
.foot__meta { margin-top: 20px; font-size: 0.875rem; }
.foot :deep(.tbc) { text-decoration-color: var(--on-field-dark); }
.foot :deep(.tbc__tag) { background: var(--ground); color: var(--ink); }
@media (min-width: 900px) { .foot__top { grid-template-columns: 1fr 1fr; align-items: start; } .foot__cols { grid-template-columns: 1fr 1.3fr; } }
@media (max-width: 599px) { .foot { padding-bottom: 120px; } }
/* The wordmark rises letter by letter, then its sun comes up: see CrpWordmarkRise. */

/* ---------- Sticky thumb bar (phones) ---------- */
.bar {
  position: fixed; z-index: 40; left: 0; right: 0; bottom: 0; background: var(--field-dark);
  padding-bottom: env(safe-area-inset-bottom);
  transform: translateY(calc(100% + 24px)); transition: transform 420ms var(--ease-out);
}
.bar.is-on { transform: none; }
.bar__valance { position: absolute; left: 0; right: 0; top: 0; }
.bar__row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 30px var(--gutter) 12px; }
.bar__row.is-one { grid-template-columns: 1fr; }
.bar__row .crp-btn { min-width: 0; padding: 0 12px; }
@media (min-width: 600px) { .bar { display: none; } }
</style>
