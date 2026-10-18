<script setup lang="ts">
// "Your event so far": a read-back of the inquiry form, so nothing has to be remembered while scrolling.
// Rows are a real <dl>. Until the first answer it is one calm line; after that a row appears as soon as its question
// has an answer (no column of "Not yet"). Not a live region: the person hears their own choice
// from the control they just used, so announcing it again here would only repeat it.
// Motion: a changed answer rises into its row from the row's own baseline while the old one leaves upward
// (the site's "rise" verb, 240 ms, interruptible). Reduced motion: the text simply changes.
const props = defineProps<{ rows: { k: string, v: string }[] }>()
// The leaving copy stays in the DOM for 240 ms; hide it from assistive tech so the row never reads twice.
const hide = (el: Element) => el.setAttribute('aria-hidden', 'true')
const filled = computed(() => props.rows.filter(r => r.v))
</script>

<template>
  <p v-if="!filled.length" class="sum__empty">Your answers appear here as you go.</p>
  <TransitionGroup v-else tag="dl" name="sum-row" class="sum">
    <div v-for="r in filled" :key="r.k" class="sum__row">
      <dt class="sum__k">{{ r.k }}</dt>
      <dd class="sum__v">
        <!-- the guest range is a real number the visitor picked: it rolls in (Odometer), a fresh roll per choice -->
        <span v-if="r.k === 'Guests'" :key="r.v" class="sum__t"><Odometer :value="r.v" :delay="80" /></span>
        <Transition v-else name="sum-swap" @before-leave="hide">
          <span :key="r.v" class="sum__t">{{ r.v }}</span>
        </Transition>
      </dd>
    </div>
  </TransitionGroup>
</template>

<style scoped>
.sum { margin: 0; display: grid; gap: 10px; }
/* on the brown board (and the brown phone disclosure) the keys are cream at 80 % (≥ 6:1) */
:global(.board--brown) .sum, :global(.board--brown) .sum__empty, :global(.inq__mob) .sum, :global(.inq__mob) .sum__empty { --sum-muted: color-mix(in srgb, var(--on-field-dark) 80%, var(--field-dark)); }
.sum__row { padding-top: 10px; border-top: 1px solid var(--sum-rule, color-mix(in srgb, var(--on-field-dark) 26%, transparent)); }
.sum__row { display: grid; gap: 2px; }
/* ruled two-column rows (key | answer) wherever the board is wide enough: the board stays inside one screen */
@container (min-width: 300px) { .sum__row { grid-template-columns: 6.25rem minmax(0, 1fr); column-gap: 14px; align-items: baseline; } }
.sum__k { font-weight: 500; font-size: 0.875rem; line-height: 1.45; color: var(--sum-muted, var(--ink-muted)); }
/* One grid cell holds the old and the new answer while they swap; the clip is the row's baseline mask. */
.sum__v { margin: 0; display: grid; overflow: clip; overflow-clip-margin: 2px; }
.sum__t { grid-area: 1 / 1; font-weight: 600; font-size: 1.125rem; line-height: 1.3; overflow-wrap: anywhere; }
.sum__empty { font-size: var(--step-1); line-height: 1.4; color: var(--sum-muted, var(--ink-muted)); font-family: var(--font-accent); font-style: italic; max-width: 13em; min-height: calc(2 * 1.4em); }
/* a new row rises in under the ones already there */
.sum-row-enter-active { transition: transform var(--dur-slow) var(--ease-out), opacity var(--dur-slow) var(--ease-out); }
.sum-row-enter-from { transform: translateY(10px); opacity: 0; }
.sum-row-move { transition: transform var(--dur-base) var(--ease-out); }
.sum-swap-enter-active, .sum-swap-leave-active { transition: transform var(--dur-base) var(--ease-out), opacity var(--dur-base) var(--ease-out); }
.sum-swap-enter-from { transform: translateY(100%); }
.sum-swap-leave-to { transform: translateY(-100%); opacity: 0; }
@media (prefers-reduced-motion: reduce) {
  .sum-swap-enter-active, .sum-swap-leave-active, .sum-row-enter-active, .sum-row-move { transition: none; }
}
</style>
