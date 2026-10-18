<script setup lang="ts">
// One column of the crêpe menu as a real table: name and filling left, price right.
// The menu's one authored move (driven by v-inview on the parent section, see pages/crepes.vue):
// each row's rule draws left → right, then its words rise into place. Visible without JS / reduced motion.
import type { Crepe } from '~/data/menu'
defineProps<{ title: string, items: Crepe[] }>()
</script>

<template>
  <table class="mt">
    <caption class="sign-m mt__title">{{ title }}</caption>
    <thead class="sr-only"><tr><th scope="col">Crêpe</th><th scope="col">Price in US dollars</th></tr></thead>
    <tbody>
      <tr v-for="(item, i) in items" :key="item.name" class="mt__row" :style="{ '--r': i }">
        <th scope="row" class="mt__name">
          <span class="mt__n mt__w">{{ item.name }}</span>
          <span class="mt__note italic-line mt__w">{{ item.note }}</span>
        </th>
        <td class="mt__price tnum"><span class="mt__w">{{ item.price }}</span></td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.mt { width: 100%; border-collapse: collapse; text-align: left; }
.mt__title { text-align: left; margin-bottom: clamp(14px, 2vw, 22px); font-weight: 700; letter-spacing: -0.01em; }
.mt__row { position: relative; }
.mt__row::before, .mt__row:last-child::after { content: ""; position: absolute; left: 0; right: 0; top: 0; height: 1px; background: var(--ink-deep); transform-origin: left center; }
.mt__row:last-child::after { top: auto; bottom: 0; }
.mt__name { padding: 18px 16px 20px 0; font-weight: 400; vertical-align: top; }
.mt__n { display: block; font-weight: 600; font-size: var(--step-1); line-height: 1.2; }
.mt__note { display: block; margin-top: 4px; font-size: 1.0625rem; line-height: 1.4; max-width: 34ch; }
.mt__price { padding: 18px 0; text-align: right; vertical-align: top; font-weight: 600; font-size: var(--step-1); line-height: 1.2; }
.mt__w { display: inline-block; }
/* Pointer detail: the row leans in, name and price drawing towards each other. */
.mt__name, .mt__price { transition: transform 280ms var(--ease-out); }
@media (hover: hover) and (pointer: fine) {
  .mt__row:hover .mt__name { transform: translateX(6px); }
  .mt__row:hover .mt__price { transform: translateX(-6px); }
}
.mt__n.mt__w, .mt__note.mt__w { display: block; }

/* Armed (section below the fold at load, motion allowed): rules wait at zero width, words wait low.
   Written as whole :global() selectors because Vue drops anything after a leading :global(). */
:global(.crp-armed .mt__row::before), :global(.crp-armed .mt__row:last-child::after) { transform: scaleX(0); }
:global(.crp-armed .mt__w) { opacity: 0; transform: translateY(14px); }
:global(.crp-armed.crp-in .mt__row::before), :global(.crp-armed.crp-in .mt__row:last-child::after) {
  transform: none; transition: transform 720ms var(--ease-out) calc(var(--r) * 70ms);
}
:global(.crp-armed.crp-in .mt__row:last-child::after) { transition-delay: calc(var(--r) * 70ms + 140ms); }
:global(.crp-armed.crp-in .mt__w) {
  opacity: 1; transform: none;
  transition: opacity 560ms var(--ease-out) calc(var(--r) * 70ms + 180ms), transform 560ms var(--ease-out) calc(var(--r) * 70ms + 180ms);
}
:global(.crp-armed.crp-in .mt__note) { transition-delay: calc(var(--r) * 70ms + 230ms); }
</style>
