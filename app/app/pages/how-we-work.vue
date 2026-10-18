<script setup lang="ts">
definePageMeta({ awning: 'yellow', field: 'apricot' })
usePageSeo({ title: 'How we work', description: 'How an Una Mattina event comes together, from your first inquiry to the follow-up: discovery, concept, a custom proposal, planning and the event day.' })
// Events v2 (events-v2-system.md §8 How We Work): heavy hero → the nine steps as stacked sticky boards (signature,
// HwSteps) → the staffing rule on a yellow band → close. The hero board's three ↓ links jump into the stack.
const jumps = [
  { to: 1, t: 'Before you book', n: 'Steps one to five' },
  { to: 6, t: 'While we plan', n: 'Steps six and seven' },
  { to: 8, t: 'On the day, and after', n: 'Steps eight and nine' },
]
const stepsEl = ref<{ go: (i: number) => void } | null>(null)
function jump(e: MouseEvent, n: number) {
  if (!stepsEl.value) return
  // ours, not Lenis' anchor glide: the boards above the target are stuck, so its rect can't be the target
  e.preventDefault()
  e.stopPropagation()
  stepsEl.value.go(n - 1)
  history.replaceState(history.state, '', `#hw-s-${n}`)
}
</script>

<template>
  <div>
    <div class="hw-hero"><PageHero id="hw-title" layout="heavy" title="Simple for you" :lines="['Simple', 'for you']" lead="There's a lot of production behind an event. Your side of it looks like this.">
      <template #side>
        <Board tone="brown" valance="yellow" drop class="hw-hero__board" style="--m-d: 640ms">
          <p class="title-board hw-hero__bt">Three phases,<br> nine steps</p>
          <ul class="hw-jumps">
            <li v-for="j in jumps" :key="j.to">
              <a :href="`#hw-s-${j.to}`" class="hw-jump" @click="jump($event, j.to)">
                <span class="hw-jump__t">{{ j.t }}</span>
                <span class="hw-jump__n">{{ j.n }}</span>
                <span class="hw-jump__arrow" aria-hidden="true">↓</span>
              </a>
            </li>
          </ul>
        </Board>
      </template>
    </PageHero></div>

    <HwSteps ref="stepsEl" />

    <!-- the one rule, yellow band: a heavy title, the rule itself as a sentence, the permits note -->
    <section class="hw-rule field-yellow" aria-labelledby="hw-rule-title">
      <div class="wrap hw-rule__grid">
        <RiseText id="hw-rule-title" class="hw-rule__t" :lines="['Running it,', 'not serving it']" size="l" />
        <div v-stage class="hw-rule__side">
          <p class="statement hw-rule__s st-in">The person running your event never stands at a station or a bar at the same time.</p>
          <p class="hw-rule__note st-in" style="--i: 2">For beaches, parks and other public places, we confirm the rules and any permits before we finalise your booking.</p>
        </div>
      </div>
    </section>

    <CloseCta :lines="['Start with', 'step one']" label="Send an inquiry" />
  </div>
</template>

<style scoped>
/* hero board: three ruled rows, each a jump into the stack */
.hw-hero__board { width: 100%; max-width: 30rem; }
@media (min-width: 900px) {
  /* the board stands beside the title (not under it), so the field right of SIMPLE is never empty */
  .hw-hero.hw-hero :deep(.phx--heavy.phx--side .phx__body) { grid-template-areas: "title side" "lead side"; grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); }
  .hw-hero.hw-hero :deep(.phx__side) { justify-self: end; align-self: end; width: 100%; max-width: 30rem; margin-top: 0; }
}
.hw-hero__bt { margin-bottom: 4px; }
.hw-jumps { list-style: none; margin: 0; padding: 0; }
.hw-jumps li { border-top: 1px solid color-mix(in srgb, var(--on-field-dark) 34%, transparent); }
.hw-jump {
  display: grid; grid-template-columns: minmax(0, 1fr) auto; column-gap: 16px; align-items: center; min-height: 64px; padding: 10px 0;
  color: inherit; text-decoration: none; touch-action: manipulation;
}
.hw-jump__t { font-weight: 700; font-size: 1.125rem; line-height: 1.2; }
.hw-jump__n { grid-row: 2; font-size: 0.875rem; line-height: 1.4; color: color-mix(in srgb, var(--on-field-dark) 80%, var(--field-dark)); }
.hw-jump__arrow { grid-row: 1 / span 2; grid-column: 2; font-weight: 600; font-size: 1.25rem; transition: transform var(--dur-base) var(--ease-out); }
.hw-jump:active .hw-jump__arrow { transform: translateY(3px); }
@media (hover: hover) and (pointer: fine) {
  .hw-jump__t { transition: transform var(--dur-base) var(--ease-out); }
  .hw-jump:hover .hw-jump__t { transform: translateX(6px); }
  .hw-jump:hover .hw-jump__arrow { transform: translateY(3px); }
}
.hw-jump:focus-visible { outline-offset: 2px; }

/* the rule */
.hw-rule { padding-block: var(--space-section); }
.hw-rule__grid { display: grid; gap: var(--space-head); }
.hw-rule__side { display: grid; gap: var(--space-tight); align-content: end; }
.hw-rule__s { max-width: 24ch; }
.hw-rule__note { font-size: var(--step-0); line-height: 1.55; max-width: 40ch; margin-top: 8px; }
@media (min-width: 1100px) { .hw-rule__grid { grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); align-items: end; column-gap: clamp(40px, 5vw, 96px); } }
</style>

<style>
/* page-unique class, unscoped: the italic sentence hangs its opening punctuation where supported */
.hw-rule__s { hanging-punctuation: first; }
</style>
