<script setup lang="ts">
// Live Stations, the page's signature: the six stations as a menu board (the /crepes menu, MenuTable's language).
// Each row: the name in heavy caps (display-m, every row the same size, fitted to the longest name) and its note in
// Playfair. Once, when the board enters: each rule draws left → right, then the name and the note rise out of it,
// 70 ms per row. Rows lean 6 px on hover (fine pointer).
// ≥ 900 px: a sticky 4:5 frame on the right follows the row in the reading band: the incoming picture wipes up over
// the outgoing one (clip-path, 700 ms) while it settles 1.06 → 1; under it the station's name and "Three of six".
// Found photos only where one honestly exists (griddle, cannoli); the others are signboard panels with the station's
// name (ShootSlot). Phones / no JS: no frame, the griddle photo under the board. Reduced motion: final, instant swaps.
// The notes are unconfirmed wording: wrapped in <Tbc> (invisible marker).
import { stations } from '~/data/stations'
import { credits } from '~/data/credits'

const photos: Record<string, { photo: typeof credits.griddle, alt: string }> = {
  crepe: { photo: credits.griddle, alt: 'A thin crêpe cooking on a round cast-iron griddle' },
  cannoli: { photo: credits.cannoli, alt: 'A tray of Sicilian cannoli filled with ricotta, finished with pistachio and candied cherry' },
}
const tones = ['apricot', 'yellow', 'brown'] as const
const rise = (i: number) => 0.3 + (0.7 * i) / (stations.length - 1)
const words = ['One', 'Two', 'Three', 'Four', 'Five', 'Six']
const longest = Math.max(...stations.map(s => s.name.length))

const active = ref(0)
const rows = ref<HTMLElement[]>([])
const aside = ref<HTMLElement>()
let io: IntersectionObserver | undefined
onMounted(() => {
  if (!('IntersectionObserver' in window)) return
  io = new IntersectionObserver((entries) => {
    if (aside.value?.contains(document.activeElement)) return // never inert the layer a keyboard user is in
    for (const e of entries) {
      if (!e.isIntersecting) continue
      const i = Number((e.target as HTMLElement).dataset.i)
      if (!Number.isNaN(i)) active.value = i
    }
  }, { rootMargin: '-45% 0px -45% 0px' })
  rows.value.forEach(r => io!.observe(r))
})
onBeforeUnmount(() => io?.disconnect())
</script>

<template>
  <div class="lsl" :style="{ '--n': longest }">
    <ul v-stage="900" class="lsl__board">
      <li v-for="(s, i) in stations" :id="`st-${s.id}`" :key="s.id" ref="rows" :data-i="i" class="lsl__row" :class="{ 'is-active': i === active }" :style="{ '--i': i }">
        <span class="lsl__rule st-draw" aria-hidden="true" />
        <h3 class="lsl__name st-in"><span class="lsl__lean">{{ s.name }}</span></h3>
        <p class="lsl__note italic-line st-in"><span class="lsl__lean"><Tbc note="station description">{{ s.note }}</Tbc></span></p>
        <span v-if="i === stations.length - 1" class="lsl__rule lsl__rule--end st-draw" aria-hidden="true" />
      </li>
    </ul>
    <FoundPhoto class="lsl__lead-photo" unveil sizes="sm:100vw md:440px" :photo="credits.griddle" ratio="4 / 5" :alt="photos.crepe!.alt" />
    <div ref="aside" class="lsl__aside">
      <div class="lsl__frame">
        <div v-for="(s, i) in stations" :key="s.id" class="lsl__layer" :class="{ 'is-on': i === active }" :inert="i !== active">
          <FoundPhoto v-if="photos[s.id]" sizes="sm:100vw lp:440px" :photo="photos[s.id]!.photo" ratio="4 / 5" :alt="photos[s.id]!.alt" />
          <ShootSlot v-else :tone="tones[i % 3]" :label="s.sign || s.short" :subject="s.name.toLowerCase()" ratio="4 / 5" :rise="rise(i)" />
        </div>
      </div>
      <p class="lsl__cap" aria-hidden="true">
        <span class="lsl__capmask"><Transition name="lsl-cap" mode="out-in"><span :key="active" class="lsl__capname">{{ stations[active]!.name }}</span></Transition></span>
        <span class="lsl__count">{{ words[active] }} of six</span>
      </p>
    </div>
  </div>
</template>

<style scoped>
.lsl { display: grid; grid-template-columns: minmax(0, 1fr); gap: clamp(32px, 4vw, 56px); }
.lsl__lead-photo { width: 100%; max-width: 440px; }

/* the board */
.lsl__board { --st-step: 70ms; list-style: none; margin: 0; padding: 0; container-type: inline-size; }
.lsl__row { position: relative; padding: clamp(18px, 2.2vw, 28px) 0 clamp(20px, 2.4vw, 30px); scroll-margin-top: 96px; }
.lsl__rule { position: absolute; left: 0; right: 0; top: 0; height: 2px; background: var(--ink-deep); }
.lsl__rule--end { top: auto; bottom: -2px; --st-d: 140ms; }
.lsl__name {
  font-family: var(--font-display); font-weight: 700; text-transform: uppercase; letter-spacing: var(--track-m); line-height: 1;
  font-size: var(--display-m); text-wrap: balance; --st-d: 180ms;
}
.lsl__note { margin-top: 10px; font-size: clamp(1.125rem, 1rem + 0.4 * var(--vw), 1.375rem); line-height: 1.35; max-width: 40ch; --st-d: 240ms; }
.lsl__lean { display: block; transition: transform 280ms var(--ease-out); }
@media (hover: hover) and (pointer: fine) {
  .lsl__row:hover .lsl__name .lsl__lean { transform: translateX(6px); }
  .lsl__row:hover .lsl__note .lsl__lean { transform: translateX(6px); transition-delay: 30ms; }
}
.lsl__aside { display: none; }

/* every name one size, one line, fitted to the longest (0.7 em per capital, --cap-w) */
@media (min-width: 600px) {
  .lsl__name { white-space: nowrap; font-size: min(var(--display-m), calc(100cqi / ((var(--n) + 1) * var(--cap-w)))); }
}

@media (min-width: 900px) {
  .lsl { grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); gap: clamp(32px, 5vw, 96px); align-items: start; }
  .lsl__lead-photo { display: none; }
  /* the row in the reading band: an apricot sun-dot lands before its name, which steps aside for it */
  .lsl__name { position: relative; }
  .lsl__name::before {
    content: ""; position: absolute; left: 0; top: 50%; width: 0.36em; height: 0.36em; margin-top: -0.2em; border-radius: 50%;
    background: var(--accent); transform: scale(0); transition: transform 360ms var(--ease-out);
  }
  .lsl__name > .lsl__lean { transition: transform 280ms var(--ease-out), translate 360ms var(--ease-out); }
  .lsl__row.is-active .lsl__name::before { transform: scale(1); }
  .lsl__row.is-active .lsl__name > .lsl__lean { translate: 0.6em 0; }
  .lsl__aside { display: grid; gap: 14px; position: sticky; top: 112px; justify-items: end; }
  .lsl__frame { display: grid; width: min(100%, 460px, calc((100svh - 112px - 120px) * 0.8)); }
  .lsl__cap { width: min(100%, 460px, calc((100svh - 112px - 120px) * 0.8)); display: flex; justify-content: space-between; align-items: baseline; gap: 16px; }
  .lsl__capmask { display: block; overflow: hidden; padding-block: 0.1em; margin-block: -0.1em; }
  .lsl__capname { display: block; font-weight: 700; font-size: 1.125rem; line-height: 1.2; }
  .lsl__count { flex: none; font-weight: 600; font-size: 0.9375rem; }
  .lsl-cap-enter-active { transition: transform 420ms var(--ease-out); }
  .lsl-cap-leave-active { transition: transform 160ms var(--ease-in-out, ease-in); }
  .lsl-cap-enter-from { transform: translateY(110%); }
  .lsl-cap-leave-to { transform: translateY(-110%); }

  /* the swap: the incoming layer wipes up over the outgoing one, which stays put underneath until it is covered */
  .lsl__layer { grid-area: 1 / 1; z-index: 0; clip-path: inset(100% 0 0 0); visibility: hidden; transition: clip-path 0s linear 720ms, visibility 0s linear 720ms; }
  .lsl__layer.is-on { z-index: 1; clip-path: inset(0); visibility: visible; transition: clip-path 700ms var(--ease-out), visibility 0s; }
  .lsl__layer :deep(.found__img), .lsl__layer :deep(.slot) { transform: scale(1.06); transition: transform 0s linear 720ms; }
  .lsl__layer.is-on :deep(.found__img), .lsl__layer.is-on :deep(.slot) { transform: none; transition: transform 1100ms var(--ease-out); }
  .lsl__layer :deep(.found__frame), .lsl__layer :deep(.slot) { overflow: hidden; }
}
@media (prefers-reduced-motion: reduce) {
  .lsl__layer, .lsl__layer.is-on, .lsl__name::before, .lsl__lean { transition: none !important; }
  .lsl__layer :deep(.found__img), .lsl__layer :deep(.slot) { transition: none !important; transform: none !important; }
  .lsl-cap-enter-active, .lsl-cap-leave-active { transition: none; }
}
</style>

<style>
/* Without JS the frame cannot follow the board: no sticky frame, the griddle photo under the board instead. */
@media (min-width: 900px) {
  html:not(.js) .lsl__aside { display: none; }
  html:not(.js) .lsl__lead-photo { display: block; }
  html:not(.js) .lsl { grid-template-columns: minmax(0, 1fr); }
}
</style>
