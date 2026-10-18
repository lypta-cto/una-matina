<script setup lang="ts">
// Live Stations L2: the six stations as a painted list (no rules, space only) beside a sticky 4:5 frame
// that swaps to the row in the middle of the viewport. Found photos only where one honestly exists
// (griddle, cannoli); every other station shows a signboard panel (ShootSlot with the station's name painted on it,
// apricot / yellow alternating, the sun a little higher each time). <900px: no sticky frame, one photo above.
import { stations } from '~/data/stations'
import { credits } from '~/data/credits'

const photos: Record<string, { photo: typeof credits.griddle, alt: string }> = {
  crepe: { photo: credits.griddle, alt: 'A thin crêpe cooking on a round cast-iron griddle' },
  cannoli: { photo: credits.cannoli, alt: 'A tray of Sicilian cannoli filled with ricotta, finished with pistachio and candied cherry' },
}
// stations without an honest photo get the brand panel; its sun climbs a little higher with every station
const rise = (i: number) => 0.25 + (0.75 * i) / (stations.length - 1)

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
  <div class="lsl">
    <div class="lsl__main">
      <FoundPhoto class="lsl__lead-photo" unveil sizes="360px" :photo="credits.cannoli" ratio="4 / 5" :alt="photos.cannoli!.alt" />
      <ul class="lsl__list">
        <li v-for="(s, i) in stations" :key="s.id" ref="rows" :data-i="i" class="lsl__row" :class="{ 'is-active': i === active }" :style="{ '--n': s.name.length }">
          <h3 class="sign-m lsl__name"><span>{{ s.name }}</span></h3>
          <p class="statement lsl__note">{{ s.note }}</p>
        </li>
      </ul>
    </div>
    <div ref="aside" class="lsl__aside">
      <div class="lsl__frame">
        <div v-for="(s, i) in stations" :key="s.id" class="lsl__layer" :class="{ 'is-on': i === active }" :inert="i !== active">
          <FoundPhoto v-if="photos[s.id]" sizes="sm:100vw lp:440px" :photo="photos[s.id]!.photo" ratio="4 / 5" :alt="photos[s.id]!.alt" />
          <ShootSlot v-else :tone="i % 2 ? 'yellow' : 'apricot'" :label="s.name" :subject="s.name.toLowerCase()" ratio="4 / 5" :rise="rise(i)" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lsl { display: grid; gap: clamp(40px, 5vw, 64px); }
.lsl__lead-photo { max-width: 360px; margin-bottom: 88px; }
.lsl__list { list-style: none; margin: 0; padding: 0; display: grid; gap: clamp(48px, 5vw, 64px); }
.lsl__row { display: grid; gap: 12px; }
.lsl__note { font-size: var(--step-1); max-width: 38ch; }
.lsl__aside { display: none; }

@media (min-width: 900px) {
  .lsl { grid-template-columns: 7fr 5fr; gap: clamp(32px, 4vw, 64px); align-items: start; }
  .lsl__lead-photo { display: none; }
  /* the active row's name sits on an apricot plank, the same plank as the close */
  .lsl__name span { position: relative; z-index: 0; display: inline; -webkit-box-decoration-break: clone; box-decoration-break: clone; }
  .lsl__name { position: relative; isolation: isolate; width: fit-content; }
  /* the name never wraps beside the frame (a wrapped name would leave the plank wider than its second line):
     as large as sign-m allows, smaller only when its characters would not fit the column */
  .lsl__row { container-type: inline-size; }
  .lsl__name { white-space: nowrap; font-size: min(var(--step-3), calc(100cqi / (var(--n) * 0.74))); }
  .lsl__name::before { content: ""; position: absolute; inset: -0.08em -0.24em -0.04em; z-index: -1; background: var(--accent); transform: scaleX(0); transform-origin: left; transition: transform var(--dur-base) var(--ease-out); }
  .lsl__row.is-active .lsl__name::before { transform: scaleX(1); }
  .lsl__aside { display: block; position: sticky; top: 96px; }
  /* the frame always fits the viewport under the header with its caption */
  .lsl__frame { display: grid; width: min(100%, 440px, calc((100svh - 96px - 120px) * 0.8)); margin-left: auto; }
  /* the incoming layer fades in ON TOP of the outgoing one, which stays opaque underneath (no dip to the field),
     then the outgoing layer leaves the render. The incoming picture settles from 1.04 while it fades. */
  .lsl__layer { grid-area: 1 / 1; opacity: 0; visibility: hidden; transition: opacity 0s linear var(--dur-base), visibility 0s linear var(--dur-base); }
  .lsl__layer.is-on { z-index: 1; opacity: 1; visibility: visible; transition: opacity var(--dur-base) var(--ease-out), visibility 0s; }
  .lsl__layer :deep(.found__img) { transform: scale(1.04); transition: transform 0s linear var(--dur-base); }
  .lsl__layer.is-on :deep(.found__img) { transform: none; transition: transform var(--dur-slow) var(--ease-out); }
  /* the outgoing photo's credit must not show under the incoming panel during the cross-fade */
  .lsl__layer:not(.is-on) :deep(.found__cap) { visibility: hidden; }
}
@media (prefers-reduced-motion: reduce) {
  .lsl__layer, .lsl__name::before { transition: none !important; }
  .lsl__layer :deep(.found__img) { transition: none !important; transform: none !important; }
}
</style>

<style>
/* Without JS the frame cannot follow the list (it would sit on the griddle while all six stations scroll past):
   no sticky frame, the lead photo above the list instead, as on phones. html.js is set before first paint. */
@media (min-width: 900px) {
  html:not(.js) .lsl__aside { display: none; }
  html:not(.js) .lsl__lead-photo { display: block; }
  html:not(.js) .lsl { grid-template-columns: minmax(0, 1fr); }
}
</style>
