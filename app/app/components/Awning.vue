<script setup lang="ts">
// The brand's cabana stripe as a beach-club awning. Each stripe ends in a half-circle scallop:
// the same half-sun as the "A" mark. Pure DOM blocks (no gradients). Never put text on it.
// variant="valance": the slim edge of a café awning seen from across the street (stripe 14–16 px,
// 15–18 px tall in total). Hang it over a coloured field (cream-deep, yellow, apricot, sage or brown).
const props = withDefaults(defineProps<{
  tone?: 'apricot' | 'yellow' | 'sage'
  size?: 'l' | 'm' | 's'
  drop?: boolean
  variant?: 'default' | 'valance'
}>(), { tone: 'apricot', size: 'l', drop: true, variant: 'default' })
const count = computed(() => (props.variant === 'valance' ? 160 : 72))
</script>

<template>
  <div class="awning" :class="[`awning--${props.tone}`, `awning--${props.size}`, `awning--v-${props.variant}`, { 'awning--drop': props.drop }]" aria-hidden="true">
    <div class="awning__row">
      <span v-for="i in count" :key="i" class="awning__stripe" :class="i % 2 ? 'is-color' : 'is-ground'" />
    </div>
  </div>
</template>

<style scoped>
.awning { --w: var(--stripe); --h: clamp(56px, 9vw, 150px); position: relative; overflow-x: clip; height: calc(var(--h) + var(--w) / 2); }
.awning--m { --h: clamp(44px, 6vw, 96px); }
.awning--s { --h: clamp(20px, 2.4vw, 36px); }
/* Valance: narrow stripes, small scallops, total 15 px (phone) → 18 px (desktop). */
.awning--v-valance { --w: 14px; --h: 8px; }
@media (min-width: 768px) { .awning--v-valance { --w: 16px; --h: 10px; } }
.awning--apricot { --c: var(--accent); }
.awning--yellow { --c: var(--field); }
.awning--sage { --c: var(--field-2); }
.awning__row { display: flex; justify-content: center; height: var(--h); transform-origin: top center; }
.awning__stripe { position: relative; flex: none; width: var(--w); height: 100%; }
.awning__stripe::after {
  content: ""; position: absolute; left: 0; top: 100%;
  width: var(--w); height: calc(var(--w) / 2);
  border-radius: 0 0 var(--w) var(--w);
  background: inherit;
}
.is-color { background: var(--c); }
.is-ground { background: var(--stripe-ground); }
.awning--drop .awning__row { animation: awning-drop var(--dur-slow) var(--ease-out) both; }
/* The valance unrolls from its rod: the row clips open top-down, so scallops stay round (no squash). */
.awning--v-valance.awning--drop .awning__row { animation: none; }
.awning--v-valance.awning--drop { animation: valance-unroll var(--dur-slow) var(--ease-out) both; }
@keyframes awning-drop { from { transform: scaleY(0.6); } to { transform: none; } }
@keyframes valance-unroll { from { clip-path: inset(0 0 100% 0); } to { clip-path: inset(0 0 -2px 0); } }
</style>
