<script setup lang="ts">
// "Find the stand" as a week board (section-library D1): one row per market, the next one first.
// Today's row sits on an apricot plank; while it is open it shows the opening-hours bar with a "Now" dot
// (placed from the clock, moved once a minute, no animation) and the live pulse. A market that already
// closed today is dimmed and says when it is back. Server and client share the clock via useMarketStatus.
import { markets, dayNames, fmtTime, mapsUrl } from '~/data/markets'

const { now } = useMarketStatus()
const toMin = (t: string) => { const [h, m] = t.split(':').map(Number); return (h ?? 0) * 60 + (m ?? 0) }
const short = (d: number) => dayNames[d]!.slice(0, 3)
const cleanAddress = (a: string) => a.replace(/^address to confirm,?\s*/i, '') || 'Naples, FL'

const rows = computed(() => {
  const { weekday, minutes } = now.value
  return markets.map((m) => {
    const o = toMin(m.open), c = toMin(m.close)
    const today = m.day === weekday
    const open = today && minutes >= o && minutes < c
    const done = today && minutes >= c
    let inDays = (m.day - weekday + 7) % 7
    if (done) inDays = 7
    const t = open ? (minutes - o) / (c - o) : 0
    const note = open
      ? `Open now, until ${fmtTime(m.close)}`
      : today && !done ? `Today, from ${fmtTime(m.open)}`
      : done ? `Back next ${dayNames[m.day]}`
      : inDays === 1 ? 'Tomorrow' : `This ${dayNames[m.day]}`
    return { m, today: today && !done, open, done, inDays, t, note }
  }).sort((a, b) => a.inDays - b.inDays || toMin(a.m.open) - toMin(b.m.open))
})
</script>

<template>
  <ol class="wb">
    <li v-for="(r, i) in rows" :key="r.m.name + r.m.day" class="wb__row" :class="{ 'is-today': r.today, 'is-open': r.open, 'is-done': r.done }" :style="{ '--i': i }">
      <p class="wb__day"><span>{{ short(r.m.day) }}</span></p>
      <div class="wb__what">
        <p v-if="!r.m.name.toLowerCase().includes(dayNames[r.m.day]!.toLowerCase())" class="wb__name"><Tbc note="market name">{{ r.m.name }}</Tbc></p>
        <p class="wb__addr" :class="{ 'wb__addr--lead': r.m.name.toLowerCase().includes(dayNames[r.m.day]!.toLowerCase()) }"><Tbc note="market address">{{ cleanAddress(r.m.address) }}</Tbc></p>
        <p class="wb__note"><span v-if="r.open" class="wb__pulse" aria-hidden="true" />{{ r.note }}</p>
      </div>
      <p class="wb__hours tnum">{{ fmtTime(r.m.open) }} – {{ fmtTime(r.m.close) }}</p>
      <a :href="mapsUrl(r.m)" class="crp-btn crp-btn--line wb__dir" target="_blank" rel="noopener">Directions <span class="crp-btn__arrow" aria-hidden="true">↗</span><span class="sr-only"> (opens in a new tab)</span></a>
      <div v-if="r.open" class="wb__bar" role="img" :aria-label="`${Math.round(r.t * 100)} percent of today's market hours have passed`">
        <span class="wb__fill" :style="{ transform: `scaleX(${r.t})` }" />
        <span class="wb__now" :style="{ left: `${r.t * 100}%` }"><span class="wb__nowlabel">Now</span></span>
      </div>
    </li>
  </ol>
</template>

<style scoped>
.wb { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
.wb__row {
  display: grid; align-items: center; gap: 8px 20px; padding: clamp(18px, 2.2vw, 26px) clamp(18px, 2.4vw, 30px);
  background: var(--ground); color: var(--ink);
  grid-template-columns: auto minmax(0, 1fr); grid-template-areas: "day what" "day hours" "dir dir";
  transition: opacity 240ms var(--ease-out);
}
.wb__day { grid-area: day; align-self: start; min-width: 2.6em; font-weight: 700; font-size: var(--step-3); line-height: 1; letter-spacing: -0.01em; text-transform: uppercase; }
.wb__day span { display: inline-block; padding: 0.14em 0.22em; margin: -0.14em -0.22em; }
.is-today .wb__day span { background: var(--accent); color: var(--ink-deep); }
.wb__what { grid-area: what; min-width: 0; }
.wb__name { font-weight: 700; font-size: var(--step-1); line-height: 1.2; overflow-wrap: anywhere; }
.wb__addr { font-size: 1rem; line-height: 1.4; overflow-wrap: anywhere; }
.wb__addr--lead { font-weight: 700; font-size: var(--step-1); line-height: 1.2; }
.wb__note { margin-top: 4px; font-weight: 600; font-size: 0.9375rem; display: flex; align-items: center; gap: 8px; }
.wb__hours { grid-area: hours; font-weight: 600; font-size: 1.0625rem; }
.wb__dir { grid-area: dir; justify-self: start; min-height: 44px; padding: 0 18px; font-size: 0.9375rem; color: var(--ink); border-color: var(--ink); margin-top: 6px; }
.is-done { background: color-mix(in srgb, var(--ground) 55%, transparent); color: var(--ink-muted); }
.is-done .wb__day { color: var(--ink-muted); }

/* Live pulse: only while a market is open right now. */
.wb__pulse { position: relative; flex: none; width: 10px; height: 10px; border-radius: 50%; background: var(--accent); outline: 1.5px solid var(--ink); outline-offset: 0; }
.wb__pulse::after { content: ""; position: absolute; inset: 0; outline: none; border-radius: inherit; background: inherit; animation: wb-pulse 2000ms linear infinite; }
@keyframes wb-pulse { 0% { transform: scale(1); opacity: 0.6; } 70%, 100% { transform: scale(2.4); opacity: 0; } }

/* Opening-hours bar with the "Now" dot. */
.wb__bar { grid-column: 1 / -1; position: relative; height: 2px; margin: 18px 0 8px; background: color-mix(in srgb, var(--ink) 20%, transparent); }
.wb__fill { position: absolute; inset: 0; background: var(--ink); transform-origin: left center; }
.wb__now { position: absolute; top: 50%; width: 12px; height: 12px; margin: -6px 0 0 -6px; border-radius: 50%; background: var(--accent); outline: 2px solid var(--ink); }
.wb__nowlabel { position: absolute; bottom: 16px; left: 50%; transform: translateX(-50%); font-weight: 700; font-size: 0.8125rem; }

@media (min-width: 700px) {
  .wb__row { grid-template-columns: max-content minmax(0, 1fr) auto auto; grid-template-areas: "day what hours dir"; }
  .wb__dir { margin-top: 0; }
  .wb__day { align-self: center; }
}
@media (prefers-reduced-motion: reduce) { .wb__pulse::after { display: none; } }
</style>
