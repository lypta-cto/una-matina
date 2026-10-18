<script setup lang="ts">
// Inner-page opening on the page field. "split": title 7 cols + a required side (statement, picture or slot).
// "type": the title runs full width at sign-xl, lead and side in a 7/5 row under it.
// Load motion: the title rises out of its own lower edge as one sign (CSS only, so it runs without JS and on
// client navigation too); lead, actions and side follow with a short lift. Short titles (≤ 14 characters, e.g.
// "Simple for you") get a larger phone size so the page does not open small.
const props = withDefaults(defineProps<{ title: string, lead?: string, id: string, layout?: 'split' | 'type' }>(), { layout: 'split', lead: '' })
const short = computed(() => props.title.length <= 14)
</script>

<template>
  <section class="under-awning ph" :class="[`ph--${layout}`, { 'ph--short': short }]" :aria-labelledby="id">
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
</template>

<style scoped>
.ph { padding-bottom: clamp(56px, 7vw, 104px); }
.ph__grid { display: grid; gap: clamp(28px, 4vw, 56px); padding-top: clamp(24px, 4vw, 64px); }
.ph__lead { margin-top: clamp(16px, 2vw, 24px); font-size: var(--step-1); line-height: 1.45; max-width: 40ch; }
.ph__actions { display: flex; flex-wrap: wrap; gap: 16px 24px; align-items: center; margin-top: clamp(22px, 3vw, 32px); }
.ph__side :deep(.statement) { max-width: 26ch; }
.ph__row { display: grid; gap: clamp(24px, 3vw, 48px); }
.ph--type .ph__lead { margin-top: 0; }
/* the title's mask line, then the rest follows (valance unrolls at 0) */
.ph__rise { --m-d: 60ms; }
.ph__f1 { --m-d: 240ms; }
.ph__f2 { --m-d: 320ms; }
/* a side picture settles into its frame on load (curbside / peel: 1.04 → 1, 1400 ms); the frame crops it */
.ph__side :deep(.found__img), .ph__side :deep(.concept__img) { animation: ph-settle 1400ms var(--ease-out) both; }
@keyframes ph-settle { from { transform: scale(1.04); } }
@media (prefers-reduced-motion: reduce) { .ph__side :deep(.found__img), .ph__side :deep(.concept__img) { animation: none; } }
@media (max-width: 599px) {
  .ph--split .ph__title { font-size: clamp(2.1rem, 11.5vw, 3rem); }
  .ph--type .ph__title { font-size: clamp(1.875rem, 9.4vw, 2.6rem); }
  .ph--type.ph--short .ph__title { font-size: clamp(2.75rem, 13vw, 3.5rem); }
}
/* phones: the first-viewport action is full width (DESIGN, <768px) */
@media (max-width: 767px) {
  .ph__actions :deep(.btn) { width: 100%; }
}
@media (min-width: 900px) and (max-width: 1279px) { .ph--split .ph__title { font-size: min(var(--step-4), calc(4.2vw + 0.6rem)); } }
@media (min-width: 900px) {
  .ph--split .ph__grid { grid-template-columns: 7fr 5fr; align-items: end; }
  .ph__row { grid-template-columns: 7fr 5fr; align-items: end; }
}
</style>
