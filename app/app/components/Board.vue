<script setup lang="ts">
// Events v2 signboard (events-v2-system.md §Boards): one flat panel, square corners, no shadow, optional slim
// valance hanging from its top edge (the /crepes hero board). Use it for a hero side board, a list board, a summary.
//   tone     brown (cream ink) · cream · deep (cream-deep) · yellow · apricot · sage
//   valance  the scallop colour on its top edge, or 'none'. Never the same colour as the board; never over cream
//            on a cream page (it would vanish). Unrolls once on load (`drop`) at --m-d + 300 ms.
//   flush    'right' / 'left': the board runs to that viewport edge (out of the .wrap gutter), like the /crepes hero board.
const props = withDefaults(defineProps<{
  tone?: 'brown' | 'cream' | 'deep' | 'yellow' | 'apricot' | 'sage'
  valance?: 'apricot' | 'yellow' | 'sage' | 'none'
  flush?: 'none' | 'left' | 'right'
  drop?: boolean
  as?: string
}>(), { tone: 'brown', valance: 'none', flush: 'none', drop: false, as: 'div' })
</script>

<template>
  <component :is="props.as" class="board" :class="[`board--${props.tone}`, `board--flush-${props.flush}`, { 'board--valance': props.valance !== 'none' }]">
    <Awning v-if="props.valance !== 'none'" variant="valance" :tone="props.valance" :drop="props.drop" class="board__valance" />
    <slot />
  </component>
</template>

<style scoped>
.board { position: relative; display: grid; gap: 14px; align-content: start; padding: clamp(22px, 2.6vw, 36px); min-width: 0; }
.board--valance { padding-top: calc(clamp(22px, 2.6vw, 36px) + 14px); }
.board__valance { position: absolute; top: 0; left: 0; right: 0; }
.board__valance.awning--drop { animation-delay: calc(var(--m-d, 0ms) + 300ms); }
.board--brown { background: var(--field-dark); color: var(--on-field-dark); --focus-ring: var(--on-field-dark); }
.board--cream { background: var(--ground); color: var(--ink); }
.board--deep { background: var(--surface); color: var(--ink); }
.board--yellow { background: var(--field); color: var(--ink); }
.board--apricot { background: var(--accent); color: var(--ink-deep); }
.board--sage { background: var(--field-2); color: var(--ink-deep); }
/* run to the viewport edge from inside a .wrap (max 1440 + gutter) */
.board--flush-right { margin-right: calc(-1 * (max(0px, (100vw - var(--max)) / 2) + var(--gutter))); padding-right: max(var(--gutter), clamp(22px, 2.6vw, 36px)); }
.board--flush-left { margin-left: calc(-1 * (max(0px, (100vw - var(--max)) / 2) + var(--gutter))); padding-left: max(var(--gutter), clamp(22px, 2.6vw, 36px)); }
</style>
