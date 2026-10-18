<script setup lang="ts">
// Services: a list as a ruled board (the /crepes menu language): each group is a small heading over rows; every
// row's rule draws left → right, then its words rise out of it, 70 ms per row (v-stage, once, below the fold only).
// Rows lean 6 px on hover (fine pointer). Default state = final (SSR, no JS, reduced motion).
//   groups  one or more lists, each { title?, items }. Two groups sit side by side from 640 px.
//   split   a single list runs in two columns from 640 px (rows fill the first column, then the second).
//   items   plain strings (a spec list), or { t, note } for a menu row: the name in 700 and a Playfair half-line.
type Item = string | { t: string, note?: string }
const props = withDefaults(defineProps<{ groups: { title?: string, items: Item[] }[], split?: boolean }>(), { split: false })
const name = (it: Item) => (typeof it === 'string' ? it : it.t)
const note = (it: Item) => (typeof it === 'string' ? '' : it.note || '')
const half = (n: number) => Math.ceil(n / 2)
// the last row of a column also draws a rule under itself
const ends = (n: number, i: number) => i === n - 1 || (props.split && i === half(n) - 1)
</script>

<template>
  <div v-stage="900" class="svr" :class="{ 'svr--two': groups.length > 1, 'svr--split': split }">
    <div v-for="(g, gi) in groups" :key="g.title || gi" class="svr__group" :style="{ '--g': `${gi * 120}ms` }">
      <h3 v-if="g.title" class="svr__h st-in">{{ g.title }}</h3>
      <ul class="svr__rows" :style="{ '--rows': half(g.items.length) }">
        <li v-for="(it, i) in g.items" :key="name(it)" class="svr__row" :class="{ 'svr__row--menu': note(it) }" :style="{ '--is': i + 1, '--ic': (i % half(g.items.length)) + 1 }">
          <span class="svr__rule st-draw" aria-hidden="true" />
          <span class="svr__t st-in"><span class="svr__lean">{{ name(it) }}</span></span>
          <span v-if="note(it)" class="svr__note italic-line st-in"><span class="svr__lean">{{ note(it) }}</span></span>
          <span v-if="ends(g.items.length, i)" class="svr__rule svr__rule--end st-draw" aria-hidden="true" />
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.svr { --st-step: 70ms; display: grid; gap: clamp(36px, 4vw, 48px) clamp(24px, 3vw, 48px); }
.svr__group { --st-d: var(--g); }
.svr__h { font-weight: 700; font-size: 1.0625rem; line-height: 1.3; margin-bottom: 12px; }
.svr__rows { list-style: none; margin: 0; padding: 0; display: grid; }
.svr__row { --i: var(--is); position: relative; padding: 13px 0 14px; }
.svr__rule { position: absolute; left: 0; right: 0; top: 0; height: 2px; background: var(--ink-deep); }
.svr__rule--end { top: auto; bottom: -2px; }
/* the words follow their rule */
.svr__t { display: block; --st-d: calc(var(--g) + 180ms); }
.svr__rule--end { --st-d: calc(var(--g) + 140ms); }
.svr__note { display: block; --st-d: calc(var(--g) + 240ms); margin-top: 4px; }
.svr__note .svr__lean { font-weight: 400; font-size: clamp(1.0625rem, 1rem + 0.3 * var(--vw), 1.3125rem); line-height: 1.35; max-width: 40ch; }
.svr__row--menu { padding: clamp(16px, 1.8vw, 22px) 0 clamp(18px, 2vw, 24px); }
.svr__row--menu .svr__t .svr__lean { font-weight: 700; font-size: clamp(1.25rem, 1.05rem + 0.7 * var(--vw), 1.75rem); letter-spacing: -0.01em; line-height: 1.15; }
.svr__lean { display: block; font-size: clamp(1.125rem, 1rem + 0.35 * var(--vw), 1.3125rem); font-weight: 500; line-height: 1.3; transition: transform 280ms var(--ease-out); }
@media (hover: hover) and (pointer: fine) { .svr__row:hover .svr__lean { transform: translateX(6px); } }
@media (min-width: 640px) {
  .svr--two { grid-template-columns: repeat(2, minmax(0, 1fr)); align-items: start; }
  .svr--split .svr__row { --i: var(--ic); }
  .svr--split .svr__rows { grid-template-columns: repeat(2, minmax(0, 1fr)); grid-template-rows: repeat(var(--rows), auto); grid-auto-flow: column; column-gap: clamp(24px, 3vw, 48px); }
}
@media (max-width: 639px) {
  /* one column: only the very last row closes the list */
  .svr--split .svr__row:not(:last-child) .svr__rule--end { display: none; }
}
</style>
