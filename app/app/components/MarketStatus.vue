<script setup lang="ts">
// Compact live status line for /crepes: "Open now at the Saturday market, until 12 pm" or
// "Next market: Sunday, 9 am – 1 pm, Sunday market". Never guesses: no markets → "dates coming soon".
import { dayNames, fmtTime } from '~/data/markets'
const { status, when, hours } = useMarketStatus()
// "Next market: Saturday, 8 am – 12 pm" — the market's own name only when it adds something beyond the day.
const showName = computed(() => {
  const m = status.value.market
  return !!m && !m.name.toLowerCase().includes(dayNames[m.day]!.toLowerCase())
})
</script>

<template>
  <p class="ms" aria-live="polite">
    <template v-if="status.state === 'open' && status.market"><span class="ms__dot" aria-hidden="true" />Open now<template v-if="showName"> at the <Tbc note="market name">{{ status.market.name }}</Tbc></template>, <span class="ms__hours">until {{ fmtTime(status.market.close) }}</span></template>
    <template v-else-if="status.state === 'next' && status.market">Next market: {{ when }}, <span class="tnum ms__hours">{{ hours }}</span><template v-if="showName">, <Tbc note="market name">{{ status.market.name }}</Tbc></template></template>
    <template v-else>Market dates coming soon</template>
  </p>
</template>

<style scoped>
.ms { font-weight: 600; font-size: 1rem; line-height: 1.45; }
.ms__hours { white-space: nowrap; }
.ms__dot { position: relative; display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: var(--accent); margin-right: 10px; vertical-align: 0.05em; }
/* Live pulse: this only renders while a market is open right now, so the motion never lies. */
.ms__dot::after { content: ""; position: absolute; inset: 0; border-radius: inherit; background: inherit; animation: ms-pulse 2000ms linear infinite; }
@keyframes ms-pulse { 0% { transform: scale(1); opacity: 0.6; } 70%, 100% { transform: scale(2.4); opacity: 0; } }
@media (prefers-reduced-motion: reduce) { .ms__dot::after { display: none; } }
</style>
