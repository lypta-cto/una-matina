<script setup lang="ts">
// Odometer digits for real prices (section-library A3): each digit is a 0–9 column that rolls into place,
// 900 ms, +70 ms per digit, once, when it comes into view (after `delay` ms). The server renders the final
// digits, so without JS or with reduced motion it is simply the number. Screen readers get the plain text.
const props = withDefaults(defineProps<{ value: string, delay?: number }>(), { delay: 0 })
const chars = computed(() => [...props.value].map((c, k) => ({ c, k, digit: /\d/.test(c) ? Number(c) : -1, cell: /\d/.test(c) ? (Number(c) + 9) % 10 : -1 })))
const el = ref<HTMLElement | null>(null)
const armed = ref(false)
const rolled = ref(false)
let io: IntersectionObserver | null = null
let timer: ReturnType<typeof setTimeout> | undefined
onMounted(() => {
  if (!el.value || !('IntersectionObserver' in window)) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  armed.value = true
  io = new IntersectionObserver((entries) => {
    if (!entries.some(e => e.isIntersecting)) return
    io?.disconnect()
    timer = setTimeout(() => (rolled.value = true), props.delay)
  }, { rootMargin: '0px' })
  io.observe(el.value)
})
onBeforeUnmount(() => { io?.disconnect(); clearTimeout(timer) })
</script>

<template>
  <span ref="el" class="odo" :class="{ 'is-armed': armed, 'is-in': rolled }">
    <span class="sr-only">{{ props.value }}</span>
    <span class="odo__vis" aria-hidden="true">
      <template v-for="ch in chars" :key="ch.k">
        <span v-if="ch.digit >= 0" class="odo__win"><span class="odo__col" :style="{ '--d': ch.cell, '--i': ch.k }" /></span>
        <span v-else class="odo__ch">{{ ch.c }}</span>
      </template>
    </span>
  </span>
</template>

<style scoped>
.odo { font-variant-numeric: tabular-nums; white-space: nowrap; }
.odo__vis { display: inline-flex; align-items: baseline; }
.odo__win { display: inline-block; height: 1.1em; line-height: 1.1em; overflow: hidden; vertical-align: bottom; }
.odo__col { display: block; transform: translateY(calc(var(--d) * -1.1em)); }
/* The strip is generated content (never read as text), ordered 1…9, 0 so a roll never flashes a 0 that isn't there. */
.odo__col::before { content: "1\A 2\A 3\A 4\A 5\A 6\A 7\A 8\A 9\A 0"; display: block; white-space: pre; line-height: 1.1em; }
.odo.is-armed:not(.is-in) .odo__col { transform: translateY(1.1em); } /* one cell below: blank, never a fake 0 */
/* Never show a fake number: the digits stay invisible until they start rolling to the real value. */
.odo.is-armed:not(.is-in) .odo__vis { opacity: 0; }
.odo.is-armed.is-in .odo__vis { opacity: 1; transition: opacity 200ms var(--ease-out); }
.odo.is-armed.is-in .odo__col { transition: transform 900ms cubic-bezier(0.16, 0.84, 0.24, 1) calc(var(--i) * 70ms); }
</style>
