<script setup lang="ts">
// /crepes page header: sits over the hero photo (wordmark · one apricot plank of in-page links · "Find us").
// Its own landmark, outside <main>, so the skip link skips it.
const props = defineProps<{ directions: string | null }>()
</script>

<template>
  <header class="nav">
    <div class="wrap nav__in">
      <NuxtLink to="/crepes" class="nav__logo" aria-label="Una Mattina crêpes, top of page"><Wordmark /></NuxtLink>
      <nav class="nav__links" aria-label="On this page">
        <a href="#menu">Menu</a><a href="#made">How it's made</a><a href="#visit">Visit</a>
      </nav>
      <a v-if="props.directions" :href="props.directions" class="crp-btn crp-btn--cream nav__find" target="_blank" rel="noopener">Find us <span class="crp-btn__arrow" aria-hidden="true">↗</span><span class="sr-only"> (opens in a new tab)</span></a>
      <a v-else href="#visit" class="crp-btn crp-btn--cream nav__find">Find us</a>
    </div>
  </header>
</template>

<style scoped>
.nav { --focus-ring: var(--on-field-dark); position: absolute; z-index: 5; top: 0; left: 0; right: 0; color: var(--on-field-dark); animation: nav-in 900ms var(--ease-out) 300ms both; }
.nav__in.wrap { max-width: var(--crp-wide, var(--max)); }
@media (min-width: 1680px) { .nav__in.wrap { max-width: min(92vw, 2200px); } }
.nav__in { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; gap: 16px; padding-top: clamp(14px, 2.2vw, 28px); }
@media (min-width: 900px) { .nav__in { grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr); } }
.nav :focus-visible { outline-color: var(--on-field-dark); }
.nav__logo { display: flex; align-items: center; justify-self: start; min-height: 44px; width: clamp(140px, 15vw, 236px); color: inherit; --logo-sun: var(--accent); }
.nav__links { display: none; background: var(--accent); border-radius: 999px; padding: 4px; white-space: nowrap; }
.nav__links a {
  display: inline-flex; align-items: center; min-height: 44px; padding: 0 clamp(12px, 1.3vw, 18px); border-radius: 999px; white-space: nowrap;
  color: var(--ink-deep); font-weight: 600; font-size: 0.9375rem; text-decoration: none;
  transition: background-color var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out), transform 120ms var(--ease-out);
  touch-action: manipulation; user-select: none; -webkit-user-select: none;
}
.nav__links a:active { transform: scale(0.96); }
.nav__links a:focus-visible { outline-color: var(--ink-deep); outline-offset: -3px; }
.nav__find { justify-self: end; min-height: 44px; padding: 0 18px; font-size: 0.9375rem; }
@media (hover: hover) and (pointer: fine) { .nav__links a:hover { background: var(--ground); color: var(--ink); } }
@media (min-width: 900px) { .nav__links { display: flex; } }
@keyframes nav-in { from { transform: translateY(-100%); } to { transform: none; } }
/* The pill opens from its centre, then its links come in one by one. */
.nav__links { animation: nav-pill 700ms var(--ease-out) 500ms both; }
.nav__links a { animation: nav-link 420ms var(--ease-out) both; }
.nav__links a:nth-child(1) { animation-delay: 860ms; }
.nav__links a:nth-child(2) { animation-delay: 940ms; }
.nav__links a:nth-child(3) { animation-delay: 1020ms; }
@keyframes nav-pill { from { clip-path: inset(0 50% round 999px); } to { clip-path: inset(0 0 round 999px); } }
@keyframes nav-link { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
</style>
