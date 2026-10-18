<script setup lang="ts">
// Standalone layout for the QR landing: no site navigation, no events footer.
// The page renders its own landmarks (header over the hero, <main id="main">, footer).
import site from '~~/site.config'
</script>

<template>
  <div class="crp min-h-dvh bg-ground text-ink">
    <a href="#main" class="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:bg-ink focus:text-ground focus:px-3 focus:py-2">{{ site.skipLabel }}</a>
    <slot />
  </div>
</template>

<style>
.crp {
  /* Page-scoped motion: one family. Springs only where something physical turns. */
  --crp-spring: linear(0, 0.009, 0.035 2.1%, 0.141 4.4%, 0.723 12.9%, 0.938 16.7%, 1.017 19.4%, 1.067, 1.099 24.3%, 1.108 26%, 1.103, 1.088 30.4%, 1.019 39.4%, 0.993 44.5%, 0.986 48.2%, 0.99 53.6%, 1.003 66.5%, 1 100%);
  --crp-rise: 900ms;
}

/* The /crepes nav is not sticky, so in-page anchors land flush (the site's 96 px header padding would
   leave a strip of the previous section above every target, Lenis honours it too). */
html:has(.crepes) { scroll-padding-top: 0; }

/* Owner's decision: unconfirmed facts stay wrapped in <Tbc> (data-tbc, greppable) but show no tag here. */
.crp .tbc .tbc__tag { display: none; }
.crp .tbc { text-decoration: none; }

/* Pill controls: /crepes only. The half-round ends repeat the half-sun of the mark (Luka: closer to the reference). */
.crp-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 0.5em;
  min-height: 52px; padding: 0 26px; border-radius: 999px; border: 2px solid transparent;
  font: 600 1rem/1 var(--font-text); letter-spacing: 0.005em; text-decoration: none; white-space: nowrap;
  cursor: pointer; touch-action: manipulation; user-select: none; -webkit-user-select: none;
  transition: background-color var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out), transform 120ms var(--ease-out);
}
.crp-btn:active { transform: scale(0.97); }
.crp-btn__arrow { display: inline-block; transition: transform var(--dur-base) var(--ease-out); }
.crp-btn--sun { background: var(--accent); color: var(--ink-deep); border-color: var(--accent); }
.crp-btn--cream { background: var(--ground); color: var(--ink); border-color: var(--ground); }
.crp-btn--ink { background: var(--ink); color: var(--ground); border-color: var(--ink); }
.crp-btn--ghost { background: transparent; color: var(--ground); border-color: var(--ground); }
.crp-btn--line { background: transparent; color: var(--ink-deep); border-color: var(--ink-deep); }
@media (hover: hover) and (pointer: fine) {
  .crp-btn:hover .crp-btn__arrow { transform: translate(2px, -2px); }
  .crp-btn--sun:hover { background: var(--ground); border-color: var(--ground); color: var(--ink); }
  .crp-btn--cream:hover { background: var(--accent); border-color: var(--accent); color: var(--ink-deep); }
  .crp-btn--ink:hover { background: var(--accent); border-color: var(--accent); color: var(--ink-deep); }
  .crp-btn--ghost:hover { background: var(--ground); color: var(--ink); }
  .crp-btn--line:hover { background: var(--ink-deep); color: var(--ground); }
}
.crp-btn:focus-visible { outline: 3px solid currentColor; outline-offset: 3px; }

/* Section choreography (v-inview in pages/crepes.vue): only sections below the fold are armed. */
@keyframes crp-rise { to { transform: none; opacity: 1; } }
</style>
