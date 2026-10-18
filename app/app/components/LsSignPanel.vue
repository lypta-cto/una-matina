<script setup lang="ts">
// Live Stations: a station's signboard for the sticky frame, until the styled shoot gives it a photo. Not an empty
// panel: the station's name in heavy caps and its note set in Playfair like a hand-lettered menu card, over the
// half-sun of the mark rising from the lower edge (it stands a little higher with every station). Decorative
// (aria-hidden): the menu board beside it carries the same words for screen readers.
// The note is unconfirmed wording (<Tbc>), like the board's.
const props = withDefaults(defineProps<{ name: string, note: string, tone?: 'apricot' | 'yellow' | 'brown' | 'deep', rise?: number }>(), { tone: 'apricot', rise: 0.6 })
const longest = computed(() => Math.max(1, ...props.name.split(/\s+/).map(w => w.length)))
// two lines at most: the whole name must fit in two lines of the panel's measure
const total = computed(() => Array.from(props.name).length)
</script>

<template>
  <div class="lsp" :class="`lsp--${props.tone}`" :style="{ '--rise': props.rise, '--long': longest, '--total': total }" aria-hidden="true">
    <span class="lsp__sun" />
    <div class="lsp__words">
      <p class="lsp__name">{{ props.name }}</p>
      <p class="lsp__note"><Tbc note="station description">{{ props.note }}</Tbc></p>
    </div>
  </div>
</template>

<style scoped>
.lsp { container-type: inline-size; position: relative; overflow: hidden; aspect-ratio: 4 / 5; background: var(--lsp-bg); color: var(--lsp-ink); }
.lsp--apricot { --lsp-bg: var(--accent); --lsp-ink: var(--ink-deep); --lsp-sun: var(--field); }
.lsp--yellow { --lsp-bg: var(--field); --lsp-ink: var(--ink); --lsp-sun: var(--accent); }
.lsp--brown { --lsp-bg: var(--field-dark); --lsp-ink: var(--on-field-dark); --lsp-sun: var(--accent); }
.lsp--deep { --lsp-bg: var(--surface); --lsp-ink: var(--ink); --lsp-sun: var(--accent); }
/* the half-sun: a disc 64 % of the panel wide, sunk into the lower edge */
.lsp__sun {
  position: absolute; left: 50%; bottom: 0; width: 64%; aspect-ratio: 1; border-radius: 50%; background: var(--lsp-sun);
  transform: translate(-50%, calc(100% - var(--rise) * 50%));
}
.lsp__words { position: absolute; inset: 9% 9% auto; display: grid; gap: 5cqi; }
.lsp__name {
  font-family: var(--font-display); font-weight: 700; text-transform: uppercase; letter-spacing: -0.02em; line-height: 0.92;
  font-size: min(12.5cqi, calc(82cqi / (var(--long) * 0.7)), calc(150cqi / (var(--total) * 0.7))); text-wrap: balance;
}
.lsp__note { font-family: var(--font-accent); font-style: italic; font-size: max(1rem, 5.6cqi); line-height: 1.25; max-width: 19ch; text-wrap: pretty; }
</style>
