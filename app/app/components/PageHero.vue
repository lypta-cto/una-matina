<script setup lang="ts">
// Inner-page opening. Four layouts:
//   split  (legacy) title 7 cols + a required side (statement, picture or slot), sign-l
//   type   (legacy) the title runs full width at sign-xl, lead and side in a 7/5 row under it
//   heavy  (Events v2) on the page field: optional voice line, the title in heavy caps (Montserrat 700, −0.03em) in
//          authored `lines`, each fitted to the full width; lead + actions left, `side` slot right (a Board, a
//          FoundPhoto, a list board)
//   photo  (Events v2, the /crepes hero) a full-bleed picture under a flat brown multiply tint, the header over it
//          (page meta `hero: 'photo'`); voice + heavy title + lead (on a brown plate) + pill actions bottom-left,
//          optional `board` slot bottom-right (a <Board tone="brown" valance="apricot" drop flush="right">), the
//          photo credit as one small line. `#media` replaces the picture (e.g. a video).
// `curtain` (photo/heavy, one per page): the hero holds still while the `#sheet` slot (the next section, a cream
// field) slides over it like a sheet; the hero's words drift up and step aside, the picture leans in to 1.06.
// Load choreography (CSS only: plays without JS and on client navigation, ends visible; reduced motion = final):
//   picture settles 1.06 → 1 (1600 ms) · voice rises out of its mask (800 ms, +120) · title letters rise out of
//   their baseline masks (900 ms, +180, 30 ms per letter, 120 ms per line) · lead +560 · actions +720 ·
//   board slides in from its edge +760 and its valance unrolls +1060 · credit +900.
interface HeroPhoto { src: string, w: number, h: number, creator?: string, license?: string, licenseUrl?: string, page?: string }
const props = withDefaults(defineProps<{
  title: string
  lead?: string
  id: string
  layout?: 'split' | 'type' | 'heavy' | 'photo'
  lines?: string[]
  voice?: string
  photo?: HeroPhoto
  photoMobile?: HeroPhoto
  alt?: string
  position?: string
  positionMobile?: string
  tint?: number
  tintWide?: number
  curtain?: boolean
}>(), { layout: 'split', lead: '', lines: () => [], voice: '', alt: '', position: '50% 50%', positionMobile: '', tint: undefined, tintWide: undefined, curtain: false })
const slots = useSlots()
const short = computed(() => props.title.length <= 14)
const v2 = computed(() => props.layout === 'heavy' || props.layout === 'photo')
const titleLines = computed(() => (props.lines.length ? props.lines : [props.title]))

// Picture: hand-made srcset capped at the original's width (a 3× phone never gets an upscaled file).
const img = useImage()
const setFor = (p?: HeroPhoto) => {
  if (!p) return ''
  const ws = [640, 960, 1280, 1600, 1920, 2400].filter(w => w < p.w)
  ws.push(p.w)
  return ws.map(w => `${img(p.src, { width: w, format: 'webp', quality: 80 })} ${w}w`).join(', ')
}
const mainSet = computed(() => setFor(props.photo))
const mobileSet = computed(() => setFor(props.photoMobile))
const fallbackSrc = computed(() => (props.photo ? img(props.photo.src, { width: Math.min(1600, props.photo.w), format: 'webp', quality: 80 }) : ''))
const credit = computed(() => (props.layout === 'photo' && !slots.media && props.photo?.creator ? props.photo : null))
if (props.layout === 'photo' && props.photo) {
  useHead({
    link: [
      ...(props.photoMobile ? [{ rel: 'preload', as: 'image', type: 'image/webp', media: '(max-width: 699px)', imagesrcset: mobileSet.value, imagesizes: '100vw', fetchpriority: 'high' as const }] : []),
      { rel: 'preload', as: 'image', type: 'image/webp', ...(props.photoMobile ? { media: '(min-width: 700px)' } : {}), imagesrcset: mainSet.value, imagesizes: '100vw', fetchpriority: 'high' as const },
    ],
  })
}
const tintStyle = computed(() => ({ ...(props.tint != null ? { '--tint': props.tint } : {}), ...(props.tintWide != null ? { '--tint-wide': props.tintWide } : {}) }))
const imgStyle = computed(() => ({ '--pos': props.position, '--pos-m': props.positionMobile || props.position }))

// Curtain (section-library A2, /crepes): one rAF per scroll event, transform/opacity only. Off under reduced motion.
const heroEl = ref<HTMLElement | null>(null)
const sheetEl = ref<HTMLElement | null>(null)
onMounted(() => {
  const hero = heroEl.value
  const sheet = sheetEl.value
  if (!props.curtain || !hero || !sheet || matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const body = hero.querySelector<HTMLElement>('.phx__body')
  const pic = hero.querySelector<HTMLElement>('.phx__pic')
  const tucks = [...hero.querySelectorAll<HTMLElement>('.phx__tuck')]
  const place = () => { hero.style.top = `${Math.min(0, window.innerHeight - hero.offsetHeight)}px` }
  hero.classList.add('is-curtain')
  place()
  let tick = 0
  const frame = () => {
    tick = 0
    const vh = window.innerHeight
    const top = sheet.getBoundingClientRect().top
    const p = Math.min(1, Math.max(0, (vh - top) / vh))
    if (body) body.style.transform = p ? `translate3d(0, ${(-12 * p).toFixed(2)}vh, 0)` : ''
    const entering = top < vh - 1
    for (const el of tucks) el.classList.toggle('is-tucked', entering && el.getBoundingClientRect().bottom > top - 24)
    if (pic) pic.style.transform = p ? `scale(${(1 + 0.06 * p).toFixed(4)})` : ''
  }
  const onScroll = () => { if (!tick) tick = requestAnimationFrame(frame) }
  const onResize = () => { place(); onScroll() }
  frame()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onResize, { passive: true })
  onBeforeUnmount(() => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onResize); cancelAnimationFrame(tick) })
})
</script>

<template>
  <!-- legacy layouts: unchanged markup -->
  <section v-if="!v2" class="under-awning ph" :class="[`ph--${layout}`, { 'ph--short': short }]" :aria-labelledby="id">
    <div class="wrap ph__grid">
      <div class="ph__main">
        <h1 :id="id" class="ph__title" :class="layout === 'type' ? 'sign-xl' : 'sign-l'"><span class="m-line"><span class="m-line__i m-rise ph__rise">{{ title }}</span></span></h1>
        <template v-if="layout === 'split'">
          <p v-if="lead || $slots.lead" class="ph__lead m-follow ph__f1"><slot name="lead">{{ lead }}</slot></p>
          <div v-if="$slots.actions" class="ph__actions m-follow ph__f2"><slot name="actions" /></div>
        </template>
      </div>
      <div v-if="layout === 'type'" class="ph__row">
        <div>
          <p v-if="lead || $slots.lead" class="ph__lead m-follow ph__f1"><slot name="lead">{{ lead }}</slot></p>
          <div v-if="$slots.actions" class="ph__actions m-follow ph__f2"><slot name="actions" /></div>
        </div>
        <div class="ph__side m-lift ph__f2"><slot name="side" /></div>
      </div>
      <div v-else class="ph__side m-lift ph__f2"><slot name="side" /></div>
    </div>
  </section>

  <!-- Events v2: heavy / photo -->
  <div v-else class="phx-wrap">
    <section
      ref="heroEl" class="phx" :class="[`phx--${layout}`, layout === 'photo' ? 'on-photo' : 'under-awning', { 'phx--board': $slots.board, 'phx--side': $slots.side }]"
      :aria-labelledby="id"
    >
      <div v-if="layout === 'photo'" class="phx__media">
        <div class="phx__pic">
          <slot name="media">
            <picture v-if="photo">
              <source v-if="photoMobile" media="(max-width: 699px)" :srcset="mobileSet" sizes="100vw" type="image/webp">
              <img class="phx__img m-settle" :src="fallbackSrc" :srcset="mainSet" sizes="100vw" :width="photo.w" :height="photo.h" :alt="alt" fetchpriority="high" decoding="async" :style="imgStyle">
            </picture>
          </slot>
        </div>
        <div class="tint" :style="tintStyle" />
      </div>
      <div class="wrap phx__body">
        <p v-if="voice" class="voice phx__voice phx__tuck"><span class="phx__vmask"><span class="phx__vline">{{ voice }}</span></span></p>
        <div class="phx__title phx__tuck"><RiseText :id="id" as="h1" size="xl" by="letter" trigger="load" :delay="voice ? 260 : 180" :lines="titleLines" /></div>
        <p v-if="lead || $slots.lead" class="lead phx__lead phx__tuck m-in" style="--m-d: 560ms"><slot name="lead">{{ lead }}</slot></p>
        <div v-if="$slots.actions" class="pills phx__actions phx__tuck m-in" style="--m-d: 720ms"><slot name="actions" /></div>
        <div v-if="$slots.side" class="phx__side phx__tuck m-in-side" style="--m-d: 640ms"><slot name="side" /></div>
        <div v-if="$slots.board" class="phx__board phx__tuck m-in-side" style="--m-d: 760ms"><slot name="board" /></div>
        <p v-if="credit" class="phx__credit phx__tuck m-in" style="--m-d: 900ms">
          Photo: <a :href="credit.page" class="phx__a" rel="noopener" target="_blank">{{ credit.creator }}<span class="sr-only"> (opens in a new tab)</span></a>, <a :href="credit.licenseUrl" class="phx__a" rel="noopener license" target="_blank">{{ credit.license }}<span class="sr-only"> (opens in a new tab)</span></a>
        </p>
      </div>
    </section>
    <div v-if="$slots.sheet" ref="sheetEl" class="phx__sheet"><slot name="sheet" /></div>
  </div>
</template>

<style scoped>
/* ── legacy ── */
.ph { padding-bottom: clamp(56px, 7vw, 104px); }
.ph__grid { display: grid; gap: clamp(28px, 4vw, 56px); padding-top: clamp(24px, 4vw, 64px); }
.ph__lead { margin-top: clamp(16px, 2vw, 24px); font-size: var(--step-1); line-height: 1.45; max-width: 40ch; }
.ph__actions { display: flex; flex-wrap: wrap; gap: 16px 24px; align-items: center; margin-top: clamp(22px, 3vw, 32px); }
.ph__side :deep(.statement) { max-width: 26ch; }
.ph__row { display: grid; gap: clamp(24px, 3vw, 48px); }
.ph--type .ph__lead { margin-top: 0; }
.ph__rise { --m-d: 60ms; }
.ph__f1 { --m-d: 240ms; }
.ph__f2 { --m-d: 320ms; }
.ph__side :deep(.found__img), .ph__side :deep(.concept__img) { animation: ph-settle 1400ms var(--ease-out) both; }
@keyframes ph-settle { from { transform: scale(1.04); } }
@media (prefers-reduced-motion: reduce) { .ph__side :deep(.found__img), .ph__side :deep(.concept__img) { animation: none; } }
@media (max-width: 599px) {
  .ph--split .ph__title { font-size: clamp(2.1rem, 11.5vw, 3rem); }
  .ph--type .ph__title { font-size: clamp(1.875rem, 9.4vw, 2.6rem); }
  .ph--type.ph--short .ph__title { font-size: clamp(2.75rem, 13vw, 3.5rem); }
}
@media (max-width: 767px) { .ph__actions :deep(.btn) { width: 100%; } }
@media (min-width: 900px) and (max-width: 1279px) { .ph--split .ph__title { font-size: min(var(--step-4), calc(4.2vw + 0.6rem)); } }
@media (min-width: 900px) {
  .ph--split .ph__grid { grid-template-columns: 7fr 5fr; align-items: end; }
  .ph__row { grid-template-columns: 7fr 5fr; align-items: end; }
}

/* ── v2 shared ── */
.phx { position: relative; isolation: isolate; overflow-x: clip; }
.phx__body { display: grid; width: 100%; grid-template-columns: minmax(0, 1fr); align-content: start; }
.phx__voice { grid-area: voice; }
.phx__vmask { display: inline-block; overflow: hidden; padding: 0.1em 0.12em 0.14em 0; margin: -0.1em 0 -0.14em; }
.phx__vline { display: inline-block; animation: m-letter 800ms var(--ease-out) 120ms both; }
.phx__title { grid-area: title; margin-top: 0.12em; min-width: 0; }
.phx__lead { grid-area: lead; }
.phx__actions { grid-area: actions; }
.phx__side { grid-area: side; min-width: 0; }
.phx__board { grid-area: board; min-width: 0; }
.phx__credit { grid-area: credit; }
@media (prefers-reduced-motion: reduce) { .phx__vline { animation: none; } }
/* Curtain: the hero holds (sticky, top set in JS) while the sheet slides over; blocks step aside before it reaches them. */
.phx.is-curtain { position: sticky; z-index: 0; }
.phx__tuck { transition: opacity 240ms var(--ease-out), visibility 0s linear 0s; }
.phx .is-tucked { opacity: 0 !important; visibility: hidden; transition: opacity 240ms var(--ease-out), visibility 0s linear 240ms; }
.phx__sheet { position: relative; z-index: 1; background: var(--ground); }

/* ── heavy: on the page field ── */
.phx--heavy { padding-bottom: clamp(56px, 7vw, 104px); }
.phx--heavy .phx__body {
  padding-top: clamp(28px, 4.4vw, 72px); column-gap: clamp(32px, 5vw, 96px);
  grid-template-areas: "voice" "title" "lead" "actions" "side";
}
.phx--heavy .phx__lead { margin-top: var(--space-tight); }
.phx--heavy .phx__actions { margin-top: clamp(22px, 2.6vw, 32px); }
.phx--heavy .phx__side { margin-top: clamp(32px, 4vw, 48px); }
@media (min-width: 900px) {
  .phx--heavy.phx--side .phx__body { grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); grid-template-areas: "voice voice" "title title" "lead side" "actions side"; }
  .phx--heavy .phx__lead { margin-top: clamp(24px, 2.6vw, 40px); align-self: end; }
  .phx--heavy .phx__side { align-self: end; margin-top: clamp(24px, 2.6vw, 40px); }
}

/* ── photo: full bleed under the header ── */
.phx--photo {
  --on: var(--on-field-dark);
  color: var(--on); min-height: max(100svh, 560px); display: grid; grid-template-rows: 1fr;
  padding-top: 56px; background: var(--field-dark);
}
@media (min-width: 900px) { .phx--photo { min-height: clamp(640px, 100svh, 1200px); } }
@media (min-width: 1100px) { .phx--photo { padding-top: 76px; } }
.phx__media { position: absolute; inset: 0; z-index: -1; overflow: hidden; background: var(--field-dark); }
.phx__pic { position: absolute; inset: 0; transform-origin: 60% 60%; }
.phx__pic :deep(picture), .phx__pic :deep(video) { display: block; width: 100%; height: 100%; }
.phx__img, .phx__pic :deep(video) { width: 100%; height: 100%; object-fit: cover; display: block; }
.phx__img { object-position: var(--pos-m); transform-origin: 60% 50%; }
@media (min-width: 700px) { .phx__img { object-position: var(--pos); } }

/* phone: what you need first (voice, word, actions), then the band at the bottom (lead + board on brown) */
.phx--photo .phx__body {
  grid-template-areas: "voice" "title" "actions" "." "lead" "board" "credit";
  grid-template-rows: auto auto auto minmax(56px, 1fr) auto auto auto;
  padding-top: clamp(20px, 6svh, 56px);
}
.phx--photo .phx__actions { margin-top: 22px; }
.phx--photo .phx__lead { background: var(--field-dark); margin: 0 calc(-1 * var(--gutter)); padding: 20px var(--gutter) 4px; max-width: none; font-size: 1.0625rem; line-height: 1.5; }
@media (max-width: 899px) {
  .phx--photo .phx__board { margin: 0 calc(-1 * var(--gutter)); }
  .phx--photo .phx__board > :deep(*) { width: 100%; margin: 0; }
}
.phx__credit { background: var(--field-dark); margin: 0 calc(-1 * var(--gutter)); padding: 8px var(--gutter) 14px; font-size: 0.8125rem; line-height: 1.4; }
.phx__a { color: inherit; text-decoration: underline 1px; text-underline-offset: 3px; text-decoration-color: color-mix(in srgb, currentColor 55%, transparent); }
@media (hover: hover) and (pointer: fine) { .phx__a:hover { text-decoration-color: currentColor; } }
@media (max-width: 599px) { .phx--photo .phx__actions :deep(.pill--ghost) { background: var(--field-dark); } }

@media (min-width: 900px) {
  .phx--photo .phx__body {
    align-content: end; column-gap: clamp(32px, 5vw, 96px);
    grid-template-columns: minmax(0, 1fr) minmax(280px, 26rem);
    grid-template-areas: "voice voice" "title title" "lead board" "actions board" "credit board";
    grid-template-rows: auto auto auto auto auto;
    padding-top: 0; padding-bottom: clamp(48px, 7svh, 80px);
  }
  .phx--photo .phx__lead { margin: 22px 0 0 -20px; padding: 14px 20px 16px; max-width: 32ch; font-size: 1.25rem; line-height: 1.4; justify-self: start; }
  .phx--photo .phx__actions { margin-top: 28px; }
  .phx__credit { margin: 22px 0 0 -12px; padding: 6px 12px; justify-self: start; }
  /* the board sits flush to the bottom edge (and to the right edge with <Board flush="right">) */
  .phx--photo .phx__board { align-self: end; margin: 0 0 calc(-1 * clamp(48px, 7svh, 80px)); }
}
/* landscape phones: size the word by height too, so the actions stay in the first screen */
@media (max-height: 480px) and (max-width: 899px) { .phx--photo .phx__body { padding-top: 12px; } .phx--photo .phx__actions { margin-top: 14px; } }
</style>
