<script setup lang="ts">
// Lido shopfront: the header is the fascia on the page's field, a slim valance hangs under it over the first field
// (or over the video on Home, meta.media). Pages continue the field with class "under-awning".
// The valance unrolls once per visit; later route changes only cross-fade the field colour.
// Events v2: page meta `hero: 'photo'` = a full-bleed photo-led PageHero. The header then sits over the picture
// (fixed, transparent, cream ink) and there is no top valance: the hero's own board carries it (like /crepes).
import site from '~~/site.config'
const route = useRoute()
const awning = computed(() => (route.meta.awning as 'apricot' | 'yellow' | 'sage') || 'apricot')
const fieldKey = computed(() => (route.meta.field as string) || 'yellow')
const field = computed(() => ({ yellow: 'var(--field)', apricot: 'var(--accent)', sage: 'var(--field-2)' } as Record<string, string>)[fieldKey.value])
const ink = computed(() => (fieldKey.value === 'yellow' ? 'var(--ink)' : 'var(--ink-deep)'))
const media = computed(() => !!route.meta.media)
const over = computed(() => route.meta.hero === 'photo')
const dropped = useState('valance-dropped', () => false)
onMounted(() => { setTimeout(() => { dropped.value = true }, 700) })
const themeColor = computed(() => (over.value ? '#5B3A2E' : ({ yellow: '#F6D67A', apricot: '#F4A878', sage: '#9EAD83' } as Record<string, string>)[fieldKey.value]))
useHead({ meta: [{ name: 'theme-color', content: themeColor }] })
</script>

<template>
  <div class="site" :class="{ 'site--over': over }" :style="{ '--page-field': field, '--page-ink': ink }">
    <a href="#main" class="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:bg-ink focus:text-ground focus:px-3 focus:py-2">{{ site.skipLabel }}</a>
    <SiteHeader :over="over" :field="fieldKey" />
    <div v-if="!over" class="under-awning site__awning" :class="{ 'is-media': media }">
      <Awning variant="valance" :tone="awning" :drop="!dropped" />
    </div>
    <main id="main"><slot /></main>
    <SiteFooter />
  </div>
</template>

<style>
.site {
  /* Events: the content column stops at 1440 px, so the fluid type stops there too (no 3-line headings at 1920+).
     Same scale as tokens.css, with --vw (1vw capped at 14.4 px) instead of vw. /crepes keeps the global tokens. */
  --step-0: clamp(1rem, 0.96rem + 0.2 * var(--vw), 1.0625rem);
  --step-1: clamp(1.25rem, 1.1rem + 0.6 * var(--vw), 1.5rem);
  --step-2: clamp(1.375rem, 1.1rem + 1.2 * var(--vw), 2.25rem);
  --step-3: clamp(1.75rem, 1.3rem + 2 * var(--vw), 3.25rem);
  --step-4: clamp(2.5rem, 1.6rem + 4.2 * var(--vw), 6rem);
  --step-5: clamp(3.25rem, 1.6rem + 7.4 * var(--vw), 9rem);
  --display-xl: clamp(3rem, 1rem + 12 * var(--vw), 8.75rem);
  --display-l: clamp(2.5rem, 1.6rem + 4.2 * var(--vw), 6rem);
  --display-m: clamp(1.75rem, 1.3rem + 2 * var(--vw), 3.25rem);
}
/* full-bleed pieces (Board flush, 100vw bands) never cause a sideways scroll; clip keeps position: sticky working */
.site { overflow-x: clip; }
.under-awning { background: var(--page-field); color: var(--page-ink); transition: background-color var(--dur-slow) var(--ease-out), color var(--dur-slow) var(--ease-out); }
.site__awning { position: relative; z-index: 2; }
.site__awning .awning__stripe { transition: background-color var(--dur-slow) var(--ease-out); }
/* the scallops flutter with scroll velocity (plugins/smooth-scroll.ts writes a small scaleY on the row) */
.site__awning .awning__row { will-change: transform; }
/* Home: the valance hangs from the fascia straight over the video; its scallops overlap the footage by one radius. */
.site__awning.is-media { background: transparent; }
.site__awning.is-media .awning { overflow-y: visible; margin-bottom: calc(var(--w) / -2); }
</style>
