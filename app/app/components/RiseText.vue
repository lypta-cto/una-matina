<script setup lang="ts">
// Events v2 heading primitive (events-v2-system.md §Type, §Motion): heavy Montserrat caps in authored lines, each
// line fitted to its column so a heading is never more than its authored lines at any width (320–1920), and each
// letter / word rising out of its own baseline mask (the /crepes CRÊPES move).
//   lines    authored lines (≤ 2 for headings). Each one stays on one line: the size is
//            min(--display-<size>, 100cqi / (longest line × --cap-w)), so a long line gets smaller instead of wrapping.
//   by       'letter' (hero H1 only, ≤ 16 characters per line) · 'word' (section headings) · 'line'
//   trigger  'load' (CSS animation, plays without JS: heroes) · 'view' (v-stage: once, only if below the fold)
// Screen readers get the plain text once (sr-only); the masked cells are aria-hidden. Attributes (id, class) go on
// the heading element itself. Reduced motion / no JS (view): final state.
defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<{
  lines: string[]
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  size?: 'xl' | 'l' | 'm'
  by?: 'letter' | 'word' | 'line'
  trigger?: 'load' | 'view'
  delay?: number
  fit?: boolean
  /** per-heading average cap width in em for the fit (default from CSS --cap-w ≈ 0.7; use ~0.74 for lines heavy in W/M) */
  capW?: number
}>(), { as: 'h2', size: 'l', by: 'word', trigger: 'view', delay: 0, fit: true, capW: undefined })

const step = computed(() => (props.by === 'letter' ? 30 : props.by === 'word' ? 55 : 0))
const lineStep = computed(() => (props.by === 'line' ? 90 : 120))
// one row per line; each row = words; each word = cells (letters, or the whole word)
const rows = computed(() => props.lines.map((line, li) => {
  let n = 0
  return line.split(/\s+/).filter(Boolean).map((word) => {
    const parts = props.by === 'letter' ? Array.from(word) : [word]
    return parts.map((t) => {
      const ms = props.delay + li * lineStep.value + (props.by === 'line' ? 0 : n++ * step.value)
      return { t, ms }
    })
  })
}))
const total = computed(() => Math.max(0, ...rows.value.flat(2).map(c => c.ms)) - props.delay)
const longest = computed(() => Math.max(1, ...props.lines.map(l => Array.from(l).length)))
</script>

<template>
  <div class="rt" :class="[`rt--${props.size}`, { 'rt--fit': props.fit }]" :style="{ '--fit-n': longest, ...(props.capW ? { '--cap-w': String(props.capW) } : {}) }">
    <component
      :is="props.as"
      v-stage="props.trigger === 'view' ? total : false"
      v-bind="$attrs"
      class="rt__h"
      :class="[`display-${props.size}`, `rt--${props.trigger}`]"
    >
      <span class="sr-only">{{ props.lines.join(' ') }}</span>
      <span class="rt__vis" aria-hidden="true">
        <span v-for="(row, li) in rows" :key="li" class="rt__line">
          <template v-for="(word, wi) in row" :key="wi">
            <span class="rt__word"><span v-for="(c, ci) in word" :key="ci" class="rt__mask"><span class="rt__c" :style="{ '--t': `${c.ms}ms` }">{{ c.t }}</span></span></span>{{ wi < row.length - 1 ? ' ' : '' }}
          </template>
        </span>
      </span>
    </component>
  </div>
</template>

<style scoped>
.rt { width: 100%; min-width: 0; }
.rt--fit { container-type: inline-size; }
.rt--fit.rt--xl .rt__h { font-size: min(var(--display-xl), calc(100cqi / (var(--fit-n) * var(--cap-w)))); }
.rt--fit.rt--l .rt__h { font-size: min(var(--display-l), calc(100cqi / (var(--fit-n) * var(--cap-w)))); }
.rt--fit.rt--m .rt__h { font-size: min(var(--display-m), calc(100cqi / (var(--fit-n) * var(--cap-w)))); }
.rt__h { margin: 0; text-wrap: initial; }
.rt__vis { display: block; }
.rt__line { display: block; }
.rt--fit .rt__line { white-space: nowrap; }
.rt__word { display: inline-block; white-space: nowrap; }
/* the mask: clips below the baseline (commas and accents have room: padding cancelled by margin, so the line box
   is unchanged) */
.rt__mask { display: inline-block; overflow: hidden; vertical-align: top; padding: 0.24em 0.02em 0.14em; margin: -0.24em -0.02em -0.14em; }
.rt__c { display: inline-block; }
.rt--load .rt__c { animation: m-letter var(--dur-rise) var(--ease-out) both; animation-delay: var(--t); }
[data-stage="armed"] .rt__c { transform: translateY(118%); }
[data-stage="in"] .rt__c { transition: transform var(--dur-rise) var(--ease-out) var(--t); }
@media (prefers-reduced-motion: reduce) { .rt--load .rt__c { animation: none; } }
</style>
