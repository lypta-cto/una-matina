<script setup lang="ts">
// Fascia of the lido: sits on the page field at the top; headroom behaviour (hides on scroll down, returns on scroll up).
// Background crossfades field → cream once you leave the top. Mobile sheet unrolls top-down like the valance.
import { eventsNav, moreNav } from '~/data/site'
const open = ref(false)
const hidden = ref(false)
const scrolled = ref(false)
const root = ref<HTMLElement>()
const menuBtn = ref<HTMLButtonElement>()
const route = useRoute()
// A4 (curbside / peel): on the first page of a visit the fascia's contents drop in from above (CSS, SSR-safe,
// so it runs before hydration); later route changes keep the header still.
const arriving = useState('head-arriving', () => true)
onMounted(() => { setTimeout(() => { arriving.value = false }, 1400) })
watch(() => route.fullPath, () => { open.value = false; hidden.value = false })

let lastY = 0
let headH = 80
let ticking = false
function update() {
  ticking = false
  const y = window.scrollY
  scrolled.value = y > 8
  const focusInside = !!root.value?.contains(document.activeElement)
  if (open.value || focusInside) hidden.value = false
  else if (y > lastY && y > headH + 140) hidden.value = true
  else if (y < lastY) hidden.value = false
  lastY = y
}
function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update) } }
function onKey(e: KeyboardEvent) {
  if (e.key !== 'Escape' || !open.value) return
  const inSheet = !!document.getElementById('mobile-menu')?.contains(document.activeElement)
  open.value = false
  if (inSheet) menuBtn.value?.focus()
}
function onDoc(e: PointerEvent) { if (open.value && !root.value?.contains(e.target as Node)) open.value = false }
// lock the page behind the open sheet (it is a push-down sheet, not a modal: focus stays free).
// Smooth scroll (plugins/smooth-scroll.ts) scrolls programmatically, so it is paused too; the sheet keeps its own wheel.
const { $lenis } = useNuxtApp()
watch(open, (v) => {
  document.documentElement.style.overflow = v ? 'hidden' : ''
  if (v) $lenis?.stop()
  else $lenis?.start()
})
let ro: ResizeObserver | undefined
onMounted(() => {
  lastY = window.scrollY
  scrolled.value = lastY > 8
  if (root.value) {
    headH = root.value.offsetHeight
    ro = new ResizeObserver(() => { headH = root.value?.offsetHeight ?? headH })
    ro.observe(root.value)
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKey)
  document.addEventListener('pointerdown', onDoc)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKey)
  document.removeEventListener('pointerdown', onDoc)
  ro?.disconnect()
  document.documentElement.style.overflow = ''
  if (open.value) $lenis?.start()
})
</script>

<template>
  <header ref="root" class="head" :class="{ 'is-hidden': hidden, 'is-scrolled': scrolled, 'is-open': open }" @focusin="hidden = false">
    <div class="wrap head__bar" :class="{ 'is-arriving': arriving }">
      <NuxtLink to="/" class="head__logo" aria-label="Una Mattina Events & Catering, home"><Wordmark /></NuxtLink>
      <nav class="head__nav" aria-label="Main">
        <NuxtLink v-for="l in eventsNav" :key="l.to" :to="l.to" class="head__link">{{ l.label }}</NuxtLink>
      </nav>
      <NuxtLink to="/inquire" class="btn btn-ink head__cta">Inquire</NuxtLink>
      <button ref="menuBtn" type="button" class="head__menu" :aria-expanded="open" aria-controls="mobile-menu" @click="open = !open">{{ open ? 'Close' : 'Menu' }}</button>
    </div>
    <Transition name="sheet">
      <div v-show="open" id="mobile-menu" class="sheet" data-lenis-prevent>
        <nav aria-label="Main, mobile" class="sheet__nav">
          <NuxtLink v-for="l in [...eventsNav, ...moreNav]" :key="l.to" :to="l.to" class="sheet__link">{{ l.label }}</NuxtLink>
        </nav>
        <NuxtLink to="/inquire" class="btn btn-primary sheet__cta">Start an inquiry</NuxtLink>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.head {
  position: sticky; top: 0; z-index: 40; background: var(--page-field); color: var(--page-ink);
  /* the field colour crossfades between pages (and to cream once you leave the top) at the slow tempo, with the page field */
  transition: transform var(--dur-base) var(--ease-out), background-color var(--dur-slow) var(--ease-out), color var(--dur-slow) var(--ease-out);
}
.head.is-scrolled, .head.is-open { background: var(--ground); color: var(--ink); }
.head.is-hidden { transform: translateY(-100%); }
.head__bar.is-arriving { animation: head-drop 900ms var(--ease-out) 120ms both; }
@keyframes head-drop { from { transform: translateY(-100%); } }
.head__bar { display: flex; align-items: center; gap: clamp(16px, 2.4vw, 36px); min-height: 56px; padding-block: 6px; }
@media (min-width: 1100px) { .head__bar { min-height: 76px; } }
/* 44 px tap target around an 18 px wordmark */
.head__logo { width: clamp(160px, 17vw, 240px); flex: none; color: inherit; padding-block: 13px; }
.head__nav { display: none; gap: clamp(14px, 1.8vw, 28px); margin-left: auto; }
.head__link { position: relative; color: inherit; text-decoration: none; font-weight: 500; font-size: 1rem; padding: 10px 0; }
.head__link::after { content: ""; position: absolute; left: 0; right: 0; bottom: 4px; height: 2px; background: currentColor; transform: scaleX(0); transform-origin: left; transition: transform var(--dur-base) var(--ease-out); }
.head__link.router-link-active::after { transform: scaleX(1); }
@media (hover: hover) and (pointer: fine) { .head__link:hover::after { transform: scaleX(1); } }
.head__cta { display: none; min-height: 46px; }
.head__menu { margin-left: auto; min-height: 44px; padding: 0 4px; background: none; border: 0; color: inherit; font: 600 1rem var(--font-text); text-decoration: underline; text-underline-offset: 5px; text-decoration-thickness: 2px; cursor: pointer; }
/* landscape phones: the sheet scrolls inside itself instead of hiding "Start an inquiry" */
.sheet {
  background: var(--ground); color: var(--ink); padding: 8px var(--gutter) 28px; display: grid; gap: 16px;
  max-height: calc(100dvh - 56px); overflow-y: auto; overscroll-behavior: contain;
}
.sheet__nav { display: grid; gap: 4px; }
.sheet__link { color: inherit; text-decoration: none; font-size: var(--step-1); font-weight: 500; padding: 14px 0; }
.sheet-enter-active { transition: clip-path var(--dur-base) var(--ease-out); }
.sheet-leave-active { transition: clip-path var(--dur-fast) var(--ease-out); }
.sheet-enter-from, .sheet-leave-to { clip-path: inset(0 0 100% 0); }
@media (min-width: 1100px) {
  .head__nav { display: flex; }
  .head__cta { display: inline-flex; }
  .head__menu, .sheet { display: none !important; }
}
@media (prefers-reduced-motion: reduce) { .head { transition: none; } .head__bar.is-arriving { animation: none; } }
</style>
