<script setup lang="ts">
// /crepes/menu — the stand's printed menu (Una Mattina Menu.pdf) as a page, for the QR code on the stand.
// ≥ 900 px it is the printed sheet: every size is in the print's points (the sheet is 768 pt wide) times
// --u, so the layout scales like the PDF. Below that it is the same sheet re-flowed for a phone: one
// column, the savory four and the make-your-own groups stacked, same type, same colours.
import { menu, makeYourOwn, menuNotices, menuTagline } from '~/data/menu'

definePageMeta({ layout: 'crepes' })
usePageSeo({
  title: 'Crêpe menu',
  description: 'The Una Mattina crêpe menu: ten sweet crêpes, four savory, and make your own with spreads, toppings and sauces. Prices in US dollars.',
})
useHead({ meta: [{ name: 'theme-color', content: '#FFFFFF' }] }) // white, the sheet (token --sheet)

const sweet = menu.find(s => s.title === 'Sweet')?.items ?? []
const savory = menu.find(s => s.title === 'Savory')?.items ?? []
const raw = useId()
</script>

<template>
  <main id="main" class="mn-sheet-page">
    <div class="mn-paper">
      <header class="mn-top">
        <h1 class="mn-top__title"><span class="sr-only">Una Mattina crêpes: </span>Menu</h1>
        <CrpConeMark class="mn-top__cone" sun="var(--sheet-sun)" />
      </header>

      <!-- Sweet -->
      <section class="mn-sec mn-sec--sweet" aria-labelledby="m-sweet">
        <div class="mn-sec__head">
          <h2 id="m-sweet" class="mn-sec__title">Sweet crêpes</h2>
          <span class="mn-rule" aria-hidden="true" />
          <p class="mn-tagline">{{ menuTagline }}</p>
        </div>
        <ul class="mn-sweet" role="list">
          <li v-for="c in sweet" :key="c.name" class="mn-sweet__item">
            <h3 class="mn-name">{{ c.name }}</h3>
            <p class="mn-note">{{ c.note }}</p>
            <p class="mn-price tnum"><span class="sr-only">Price: </span>${{ c.price }}</p>
          </li>
        </ul>
      </section>

      <!-- Savory -->
      <section class="mn-sec mn-sec--savory" aria-labelledby="m-savory">
        <div class="mn-sec__head">
          <h2 id="m-savory" class="mn-sec__title">Savory crêpes</h2>
          <span class="mn-rule" aria-hidden="true" />
        </div>
        <ul class="mn-savory" role="list">
          <li v-for="c in savory" :key="c.name" class="mn-savory__item" :class="{ 'mn-is-raw': c.raw }">
            <div class="mn-savory__top">
              <svg v-if="c.raw" class="mn-badge" viewBox="0 0 100 100" role="img" :aria-labelledby="raw">
                <title :id="raw">Raw food</title>
                <circle cx="50" cy="50" r="44" fill="var(--sheet-badge)" />
                <circle v-for="k in 24" :key="k" :cx="50 + 44 * Math.cos(k * Math.PI / 12)" :cy="50 + 44 * Math.sin(k * Math.PI / 12)" r="6.5" fill="var(--sheet-badge)" />
                <circle cx="50" cy="50" r="38" fill="var(--sheet-badge-in)" />
                <text x="50" y="46" text-anchor="middle" class="mn-badge__t1">RAW</text>
                <text x="50" y="63" text-anchor="middle" class="mn-badge__t2">FOOD</text>
                <text x="50" y="77" text-anchor="middle" class="mn-badge__t3">100%</text>
              </svg>
              <h3 class="mn-name">{{ c.name }}</h3>
              <p class="mn-price tnum"><span class="sr-only">Price: </span>${{ c.price }}</p>
            </div>
            <p class="mn-note">{{ c.note }}</p>
            <p v-if="c.addOn" class="mn-addon">{{ c.addOn }}</p>
          </li>
        </ul>
      </section>

      <!-- Make your own -->
      <section class="mn-sec mn-sec--own" aria-labelledby="m-own">
        <div class="mn-sec__head">
          <h2 id="m-own" class="mn-sec__title">Make your own</h2>
          <span class="mn-rule" aria-hidden="true" />
          <p class="mn-price mn-price--own tnum"><span class="sr-only">Price: </span>${{ makeYourOwn.price }}</p>
        </div>
        <div class="mn-own">
          <section v-for="g in makeYourOwn.groups" :key="g.title" class="mn-own__group" :aria-label="g.title">
            <h3 class="mn-pill">{{ g.title }}<span v-if="g.extra" class="mn-pill__extra"><span class="sr-only">, add </span>+${{ g.extra }}<span class="sr-only"> each</span></span></h3>
            <ul class="mn-own__lines" role="list">
              <li v-for="(line, l) in g.lines" :key="l" class="mn-own__line">
                <template v-for="(item, k) in line" :key="item"><span v-if="k" class="mn-sq" aria-hidden="true" /><span class="mn-own__item">{{ item }}</span><span v-if="k < line.length - 1" class="sr-only">, </span></template>
              </li>
            </ul>
          </section>
        </div>
      </section>

      <footer class="mn-fine">
        <p>{{ menuNotices.consumer }}</p>
        <p>{{ menuNotices.allergen }}<br>{{ menuNotices.allergenAsk }}</p>
        <NuxtLink to="/crepes" class="mn-fine__back">Where to find the stand <span aria-hidden="true">→</span></NuxtLink>
      </footer>
    </div>
  </main>
</template>

<style scoped>
/* The sheet is white like the print, edge to edge (also behind the browser's overscroll). */
:global(html:has(.mn-sheet-page)), :global(body:has(.mn-sheet-page)) { background: var(--sheet); }
.mn-sheet-page { background: var(--sheet); color: var(--sheet-ink); min-height: 100dvh; }

/* ── Phone first: the sheet re-flowed into one column ── */
.mn-paper { --pad: 20px; max-width: 560px; margin-inline: auto; padding: 22px var(--pad) calc(36px + env(safe-area-inset-bottom)); }

.mn-top { display: grid; justify-items: center; }
.mn-top__title { font: 400 4.25rem/1 var(--font-sheet-display); letter-spacing: 0.3em; margin-right: -0.3em; text-transform: uppercase; text-shadow: 2px 2px 3px color-mix(in srgb, var(--sheet-fine) 40%, transparent); }
.mn-top__cone { width: 44px; margin-top: 6px; color: var(--sheet-cone); }

.mn-sec { margin-top: 34px; }
.mn-sec__head { display: grid; grid-template-columns: auto minmax(24px, 1fr); align-items: end; column-gap: 14px; }
.mn-sec__title { font: 400 clamp(1.375rem, 6.4vw, 1.75rem)/1 var(--font-text); white-space: nowrap; letter-spacing: 0.08em; text-transform: uppercase; text-shadow: 1px 1px 2px color-mix(in srgb, var(--sheet-fine) 35%, transparent); }
/* the yellow brush rule: tapered at both ends, heavier towards the right */
.mn-rule { display: block; height: 4px; margin-bottom: 4px; background: var(--sheet-rule); clip-path: polygon(0 55%, 45% 15%, 88% 0, 100% 50%, 88% 100%, 45% 85%, 0 70%); }
.mn-tagline { grid-column: 1 / -1; margin-top: 10px; font: 400 0.8125rem/1.2 var(--font-sheet-display); letter-spacing: 0.02em; text-transform: uppercase; text-align: right; }

/* Item type: Gelasio bold, names in spaced capitals, fillings in italic. */
.mn-name { font: 700 0.9375rem/1.25 var(--font-sheet); letter-spacing: 0.16em; text-transform: uppercase; text-shadow: 1px 1px 1px color-mix(in srgb, var(--sheet-fine) 30%, transparent); }
.mn-note { font: italic 700 0.9375rem/1.35 var(--font-sheet); letter-spacing: 0.03em; }
.mn-price { font: 400 1.375rem/1 var(--font-sheet-display); white-space: nowrap; }

.mn-sweet { display: grid; gap: 20px; margin-top: 22px; }
.mn-sweet__item { display: grid; grid-template-columns: minmax(0, 1fr) auto; grid-template-areas: "name price" "note note"; column-gap: 16px; row-gap: 3px; }
.mn-sweet__item .mn-name { grid-area: name; align-self: end; }
.mn-sweet__item .mn-note { grid-area: note; padding-right: 8px; }
.mn-sweet__item .mn-price { grid-area: price; }

.mn-savory { margin-top: 18px; }
.mn-savory__item { padding-block: 18px; border-top: 2px solid var(--sheet-divider); }
.mn-savory__item:first-child { border-top: 0; padding-top: 4px; }
.mn-savory__top { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; column-gap: 8px; }
.mn-is-raw .mn-savory__top { grid-template-columns: auto minmax(0, 1fr) auto; }
.mn-savory__item .mn-note { margin-top: 6px; }
.mn-addon { margin-top: 6px; font: italic 700 0.875rem/1.3 var(--font-sheet); letter-spacing: 0.03em; text-align: right; }
.mn-badge { grid-column: 1; width: 30px; height: 30px; margin-right: 2px; }
.mn-badge text { font-family: var(--font-text); fill: var(--sheet-ink); }
.mn-badge__t1 { font-size: 19px; font-weight: 600; }
.mn-badge__t2 { font-size: 17px; font-weight: 500; }
.mn-badge__t3 { font-size: 11px; font-weight: 500; }

.mn-sec--own .mn-sec__head { grid-template-columns: auto minmax(24px, 1fr) auto; }
.mn-price--own { align-self: end; }
.mn-own { display: grid; margin-top: 22px; }
.mn-own__group { display: grid; justify-items: center; padding-block: 20px; }
.mn-own__group + .mn-own__group { border-top: 2px solid var(--sheet-divider); }
.mn-own__group:first-child { padding-top: 0; }
.mn-pill {
  display: inline-flex; align-items: center; gap: 1.1em; min-width: 200px; justify-content: center;
  padding: 8px 24px; border-radius: 999px; background: var(--sheet-pill);
  font: 700 0.875rem/1.2 var(--font-sheet); letter-spacing: 0.06em; text-transform: uppercase;
}
.mn-own__lines { margin-top: 14px; display: grid; gap: 4px; text-align: center; }
.mn-own__line { font: 700 0.9375rem/1.45 var(--font-sheet); letter-spacing: 0.01em; }
.mn-own__item { white-space: nowrap; }
.mn-sq { display: inline-block; width: 0.32em; height: 0.32em; margin: 0 0.55em 0 0.6em; vertical-align: 0.22em; background: var(--sheet-ink); }

.mn-fine { margin-top: 30px; display: grid; gap: 12px; text-align: center; color: var(--sheet-fine); font: 400 0.75rem/1.5 var(--font-text); }
.mn-fine__back {
  justify-self: center; margin-top: 18px; padding: 10px 4px; color: var(--sheet-ink); font: 600 0.9375rem/1.2 var(--font-text);
  text-decoration: underline; text-decoration-thickness: 2px; text-underline-offset: 5px; text-decoration-color: var(--sheet-divider);
}
@media (hover: hover) and (pointer: fine) { .mn-fine__back:hover { text-decoration-color: var(--sheet-ink); } }
.mn-fine__back:focus-visible { outline: 3px solid var(--sheet-ink); outline-offset: 3px; }

/* Small tablets: the savory four sit two by two, divided like the print. */
@media (min-width: 600px) and (max-width: 899px) {
  .mn-paper { max-width: 720px; --pad: 32px; }
  .mn-savory { display: grid; grid-template-columns: 1fr 1fr; }
  .mn-savory__item { padding: 16px 20px 18px; border-top: 0; }
  .mn-savory__item:first-child { padding-top: 16px; }
  .mn-savory__item:nth-child(even) { border-left: 2px solid var(--sheet-divider); }
  .mn-savory__item:nth-child(n + 3) { border-top: 2px solid var(--sheet-divider); }
  .mn-own { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .mn-own__group { padding: 0 8px; }
  .mn-own__group + .mn-own__group { border-top: 0; border-left: 2px solid var(--sheet-divider); }
  .mn-own__line { font-size: 0.8125rem; }
  .mn-pill { min-width: 0; padding-inline: 16px; font-size: 0.75rem; }
}

/* ── ≥ 900 px: the printed sheet. Sizes are the print's points × --u (sheet = 768 pt wide). ── */
@media (min-width: 900px) {
  .mn-sheet-page { container-type: inline-size; }
  .mn-paper {
    --u: calc(min(100cqi, 1040px) / 768);
    max-width: 1040px; padding: calc(var(--u) * 12) calc(var(--u) * 49) calc(var(--u) * 26);
  }
  .mn-top__title { font-size: calc(var(--u) * 76); letter-spacing: 0.29em; margin-right: -0.29em; line-height: 0.9; text-shadow: calc(var(--u) * 2) calc(var(--u) * 2) calc(var(--u) * 3) color-mix(in srgb, var(--sheet-fine) 40%, transparent); }
  .mn-top__cone { width: calc(var(--u) * 62); margin-top: calc(var(--u) * -2); margin-bottom: calc(var(--u) * -12); position: relative; z-index: 1; }

  .mn-sec { margin-top: calc(var(--u) * 0); }
  .mn-sec__head { column-gap: calc(var(--u) * 16); }
  .mn-sec__title { font-size: calc(var(--u) * 34); letter-spacing: 0.085em; text-shadow: calc(var(--u) * 1.5) calc(var(--u) * 1.5) calc(var(--u) * 2) color-mix(in srgb, var(--sheet-fine) 35%, transparent); }
  .mn-rule { height: calc(var(--u) * 2.6); margin-bottom: calc(var(--u) * 1); }
  .mn-sec--sweet .mn-sec__head { grid-template-columns: auto minmax(0, 1fr); position: relative; }
  .mn-sec--sweet .mn-rule { margin-right: calc(var(--u) * -16); }
  .mn-tagline { position: absolute; right: calc(var(--u) * 12); bottom: calc(var(--u) * 5); margin: 0; font-size: calc(var(--u) * 9.6); }

  .mn-name { font-size: calc(var(--u) * 13.4); letter-spacing: 0.2em; line-height: 1.15; }
  .mn-note { font-size: calc(var(--u) * 12.8); letter-spacing: 0.035em; line-height: 1.22; }
  .mn-price { font-size: calc(var(--u) * 19.5); }

  .mn-sweet { gap: calc(var(--u) * 17); margin-top: calc(var(--u) * 22); padding-left: calc(var(--u) * 3); }
  .mn-sweet__item { column-gap: calc(var(--u) * 24); row-gap: calc(var(--u) * 1); grid-template-areas: "name price" "note price"; padding-right: calc(var(--u) * 8); }
  .mn-sweet__item .mn-price { align-self: start; margin-top: calc(var(--u) * -2); }

  .mn-sec--savory { margin-top: calc(var(--u) * 34); }
  .mn-sec--savory .mn-sec__head { grid-template-columns: auto minmax(0, 1fr); padding-right: calc(var(--u) * 50); }
  .mn-sec--savory .mn-rule { margin-left: calc(var(--u) * 16); }
  .mn-savory { display: grid; grid-template-columns: 0.94fr 1.27fr 1.17fr 1.04fr; margin-top: calc(var(--u) * 14); margin-right: calc(var(--u) * -18); }
  .mn-savory__item { padding: calc(var(--u) * 14) calc(var(--u) * 12) calc(var(--u) * 8) calc(var(--u) * 13); border-top: 0; }
  .mn-savory__item:first-child { padding-left: calc(var(--u) * 3); padding-top: calc(var(--u) * 14); }
  .mn-savory__item + .mn-savory__item { border-left: calc(var(--u) * 1.3) solid var(--sheet-divider); }
  .mn-savory__top { align-items: start; column-gap: calc(var(--u) * 6); min-height: calc(var(--u) * 38); }
  .mn-savory .mn-name { letter-spacing: 0.2em; }
  .mn-savory__item.mn-is-raw { padding-left: calc(var(--u) * 24); }
  .mn-is-raw .mn-savory__top { grid-template-columns: minmax(0, 1fr) auto; }
  .mn-savory .mn-price { margin-top: calc(var(--u) * -3); }
  .mn-savory__item .mn-note { margin-top: calc(var(--u) * 12); line-height: 1.36; }
  .mn-savory__item.mn-is-raw { position: relative; }
  .mn-badge { position: absolute; left: calc(var(--u) * 3); top: calc(var(--u) * 11); width: calc(var(--u) * 19.5); height: calc(var(--u) * 19.5); }
  .mn-addon { margin-top: calc(var(--u) * 8); font-size: calc(var(--u) * 10.6); }

  .mn-sec--own { margin-top: calc(var(--u) * 30); }
  .mn-sec--own .mn-sec__head { grid-template-columns: auto minmax(0, 1fr) auto; column-gap: calc(var(--u) * 18); }
  .mn-sec--own .mn-rule { margin-left: calc(var(--u) * 4); }
  .mn-price--own { margin-right: calc(var(--u) * 4); }
  .mn-own { grid-template-columns: 1fr 1.18fr 1.04fr; margin-top: calc(var(--u) * 20); margin-right: calc(var(--u) * -18); }
  .mn-own__group { padding: 0; align-content: start; }
  .mn-own__group + .mn-own__group { border-top: 0; border-left: calc(var(--u) * 1.3) solid var(--sheet-divider); }
  .mn-pill { min-width: calc(var(--u) * 144); padding: calc(var(--u) * 5) calc(var(--u) * 18); font-size: calc(var(--u) * 11.6); }
  .mn-own__lines { margin-top: calc(var(--u) * 16); gap: calc(var(--u) * 2.4); padding-bottom: calc(var(--u) * 10); }
  .mn-own__line { font-size: calc(var(--u) * 11.2); letter-spacing: 0; white-space: nowrap; }

  .mn-fine { margin-top: calc(var(--u) * 26); gap: calc(var(--u) * 12); font-size: calc(var(--u) * 9.4); line-height: 1.45; }
  .mn-fine__back { margin-top: calc(var(--u) * 10); font-size: 0.9375rem; }
}

/* One quiet detail: on load the sun settles into the cone. CSS only, final state without JS. */
@media (prefers-reduced-motion: no-preference) {
  .mn-top__cone :deep(path) { animation: sheet-sun 900ms var(--ease-out) 200ms both; }
}
@keyframes sheet-sun { from { transform: translateY(-60px); opacity: 0; } to { transform: none; opacity: 1; } }
</style>
