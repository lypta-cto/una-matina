<script setup lang="ts">
// Holds the place of a photograph from the upcoming styled shoots, drawn as a brand panel: the field colour and the
// geometry of the "A" mark, so it reads as design, not as an empty frame. Decorative (aria-hidden), no text.
// Find every slot with `document.querySelectorAll('[data-shoot-slot]')` (the value is the subject to shoot).
//   motif "sun"    the half-sun of the mark rising out of the lower edge (`rise` 0–1 sets how high it stands)
//   motif "mark"   a close crop of the mark: the two strokes over the sun, like a painted sign seen up close
// (A cabana-stripe textile was tried: its cream stripes dissolve into the cream page and read as a barcode.)
// `label`: a name painted on the panel like a lido signboard (Live Stations: the station's name), so consecutive panels
// read as different boards, not as the same missing picture. Still aria-hidden: the page text carries the names.
// Motion: the sun comes up / the sign unrolls once when the panel enters (v-stage / v-unveil); final state by default.
const props = withDefaults(defineProps<{
  subject: string
  tone?: 'apricot' | 'yellow' | 'sage'
  ratio?: string
  motif?: 'sun' | 'mark'
  rise?: number
  label?: string
}>(), { tone: 'apricot', ratio: '4 / 5', motif: 'sun', rise: 1, label: '' })
const vars = computed(() => ({
  // the sun is never cream (it would read as a hole in the panel on the cream page): yellow on apricot, apricot elsewhere
  apricot: { '--slot-bg': 'var(--accent)', '--slot-sun': 'var(--field)', '--slot-ink': 'var(--ink-deep)', '--slot-alt': 'var(--ground)' },
  yellow: { '--slot-bg': 'var(--field)', '--slot-sun': 'var(--accent)', '--slot-ink': 'var(--ink)', '--slot-alt': 'var(--ground)' },
  sage: { '--slot-bg': 'var(--field-2)', '--slot-sun': 'var(--accent)', '--slot-ink': 'var(--ink-deep)', '--slot-alt': 'var(--ground)' },
})[props.tone])
// the label is as large as the panel allows: 13 % of its width, smaller only if the longest word would not fit in 84 %
const longest = computed(() => Math.max(1, ...props.label.split(/\s+/).map(w => w.length)))
const labelSize = computed(() => `min(13cqi, calc(84cqi / ${(longest.value * 0.74).toFixed(2)}))`)
</script>

<template>
  <div
    v-if="props.motif === 'sun'"
    v-stage
    class="slot slot--sun"
    :data-shoot-slot="props.subject"
    aria-hidden="true"
    :style="{ ...vars, aspectRatio: props.ratio, '--rise': props.rise }"
  >
    <span class="slot__sun" />
    <span v-if="props.label" class="slot__label" :style="{ fontSize: labelSize }">{{ props.label }}</span>
  </div>
  <div
    v-else
    v-unveil
    class="slot slot--mark"
    :data-shoot-slot="props.subject"
    aria-hidden="true"
    :style="{ ...vars, aspectRatio: props.ratio }"
  >
    <svg class="slot__svg" viewBox="60 80 520 480" preserveAspectRatio="xMidYMax slice" focusable="false">
      <path d="M140 540 A180 180 0 0 1 500 540 Z" fill="var(--slot-sun)" />
      <polyline points="40,600 320,46 600,600" fill="none" stroke="var(--slot-ink)" stroke-width="40" stroke-linejoin="round" />
    </svg>
  </div>
</template>

<style scoped>
.slot { container-type: inline-size; position: relative; display: block; width: 100%; max-height: min(70svh, 640px); overflow: hidden; background: var(--slot-bg); }

/* sun: a disc as wide as 64 % of the panel, sunk into the lower edge; --rise 1 = a half-sun */
.slot__sun {
  position: absolute; left: 50%; bottom: 0; width: 64%; aspect-ratio: 1; border-radius: 50%; background: var(--slot-sun);
  transform: translate(-50%, calc(100% - var(--rise, 1) * 50%));
}
.slot--sun[data-stage="armed"] .slot__sun { transform: translate(-50%, 100%); }
.slot--sun[data-stage="in"] .slot__sun { transition: transform 1100ms var(--ease-out) 120ms; }

.slot__label {
  position: absolute; left: 8%; right: 8%; top: 8%;
  font-family: var(--font-text); font-weight: 400; line-height: 0.98; text-transform: uppercase; letter-spacing: 0.02em; color: var(--slot-ink);
  overflow-wrap: anywhere; text-wrap: balance;
}
.slot__svg { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
</style>
