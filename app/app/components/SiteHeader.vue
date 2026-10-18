<script setup lang="ts">
// Fascia of the lido (Events v2, events-v2-system.md §Header). wordmark · one pill of links (centred) · Inquire pill.
// Two modes, from the layout:
//   field (default)  sticky on the page field, the valance hangs under it (layouts/default.vue)
//   over             photo-led heroes (page meta `hero: 'photo'`): fixed over the picture, transparent, cream ink,
//                    no top valance, like the /crepes nav. Once you leave the top it turns cream in both modes.
// Headroom: hides on scroll down, returns on scroll up (and whenever focus is inside).
// First page of a visit (CSS, SSR-safe): the fascia drops from −100 %, the pill opens from its centre, its links
// follow 80 ms apart (the /crepes nav). Later route changes keep it still. Mobile: "Menu" pill opens a cream sheet.
import { eventsNav, moreNav } from '~/data/site'
const props = withDefaults(defineProps<{ over?: boolean, field?: string }>(), { over: false, field: 'yellow' })
const open = ref(false)
const hidden = ref(false)
const scrolled = ref(false)
const root = ref<HTMLElement>()
const menuBtn = ref<HTMLButtonElement>()
const route = useRoute()
const arriving = useState('head-arriving', () => true)
onMounted(() => { setTimeout(() => { arriving.value = false }, 1600) })
watch(() => route.fullPath, () => { open.value = false; hidden.value = false })
// over a photo until you scroll (or open the sheet): cream ink, cream Inquire
const onPhoto = computed(() => props.over && !scrolled.value && !open.value)

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
// lock the page behind the open sheet (a push-down sheet, not a modal: focus stays free); Lenis paused too
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
  <header
    ref="root" class="head"
    :class="[`head--${props.field}`, { 'head--over': props.over, 'is-photo': onPhoto, 'is-hidden': hidden, 'is-scrolled': scrolled, 'is-open': open, 'is-arriving': arriving }]"
    @focusin="hidden = false"
  >
    <div class="wrap head__bar">
      <NuxtLink to="/" class="head__logo" aria-label="Una Mattina Events & Catering, home"><Wordmark /></NuxtLink>
      <nav class="head__nav" aria-label="Main">
        <NuxtLink v-for="(l, i) in eventsNav" :key="l.to" :to="l.to" class="head__link" :style="{ '--i': i }">{{ l.label }}</NuxtLink>
      </nav>
      <div class="head__end">
        <NuxtLink to="/inquire" class="pill pill--s head__cta" :class="onPhoto ? 'pill--cream' : 'pill--ink'">Inquire</NuxtLink>
        <button ref="menuBtn" type="button" class="pill pill--s head__menu" :class="onPhoto ? 'pill--ghost' : 'pill--line'" :aria-expanded="open" aria-controls="mobile-menu" @click="open = !open">{{ open ? 'Close' : 'Menu' }}</button>
      </div>
    </div>
    <Transition name="sheet">
      <div v-show="open" id="mobile-menu" class="sheet" data-lenis-prevent>
        <nav aria-label="Main, mobile" class="sheet__nav">
          <NuxtLink v-for="l in [...eventsNav, ...moreNav]" :key="l.to" :to="l.to" class="sheet__link">{{ l.label }}</NuxtLink>
        </nav>
        <NuxtLink to="/inquire" class="pill pill--sun pill--on-light sheet__cta">Start an inquiry <span class="pill__arrow" aria-hidden="true">→</span></NuxtLink>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.head {
  --nav-pill: var(--accent); --nav-ink: var(--ink-deep);
  position: sticky; top: 0; z-index: 40; background: var(--page-field); color: var(--page-ink);
  transition: transform var(--dur-base) var(--ease-out), background-color var(--dur-slow) var(--ease-out), color var(--dur-slow) var(--ease-out);
}
/* on the apricot field the pill is cream (an apricot pill would vanish) */
.head--apricot { --nav-pill: var(--ground); --nav-ink: var(--ink); }
.head--over { position: fixed; left: 0; right: 0; background: transparent; }
.head.is-photo { color: var(--on-field-dark); --focus-ring: var(--on-field-dark); --logo-sun: var(--accent); }
.head.is-photo :focus-visible { outline-color: var(--on-field-dark); }
.head.is-scrolled, .head.is-open { background: var(--ground); color: var(--ink); --nav-pill: var(--accent); --nav-ink: var(--ink-deep); }
.head.is-hidden { transform: translateY(-100%); }

.head__bar { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; gap: 16px; min-height: 56px; padding-block: 6px; }
@media (min-width: 1100px) { .head__bar { grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr); min-height: 76px; } }
/* 44 px tap target around an 18 px wordmark */
.head__logo { width: clamp(150px, 15vw, 224px); color: inherit; padding-block: 13px; justify-self: start; }

.head__nav { display: none; background: var(--nav-pill); border-radius: 999px; padding: 4px; white-space: nowrap; transition: background-color var(--dur-slow) var(--ease-out); }
.head__link {
  display: inline-flex; align-items: center; min-height: 44px; padding: 0 clamp(12px, 1.2vw, 18px); border-radius: 999px;
  color: var(--nav-ink); font-weight: 600; font-size: 0.9375rem; text-decoration: none; white-space: nowrap;
  transition: background-color var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out), transform 120ms var(--ease-out);
  touch-action: manipulation; user-select: none; -webkit-user-select: none;
}
.head__link:active { transform: scale(0.96); }
.head__link:focus-visible { outline-color: var(--nav-ink); outline-offset: -3px; }
/* the current page: a brown plank inside the pill */
.head__link.router-link-active { background: var(--ink); color: var(--ground); }
.head__link.router-link-active:focus-visible { outline-color: var(--ground); }
@media (hover: hover) and (pointer: fine) { .head__link:not(.router-link-active):hover { background: var(--ground); color: var(--ink); } }
.head--apricot:not(.is-scrolled):not(.is-photo) .head__link:not(.router-link-active):hover { background: var(--field); }

.head__end { display: flex; justify-content: flex-end; align-items: center; gap: 10px; }
.head__cta { display: none; }
.head__menu { padding: 0 18px; font-family: var(--font-text); }
@media (min-width: 1100px) {
  .head__nav { display: flex; }
  .head__cta { display: inline-flex; }
  .head__menu, .sheet { display: none !important; }
}

/* first page of a visit: drop, then the pill opens from its centre and its links come in one by one */
.head.is-arriving .head__bar { animation: m-drop 900ms var(--ease-out) 300ms both; }
.head.is-arriving .head__nav { animation: m-pill-open 700ms var(--ease-out) 500ms both; }
.head.is-arriving .head__link { animation: head-link 420ms var(--ease-out) both; animation-delay: calc(860ms + var(--i) * 80ms); }
@keyframes head-link { from { opacity: 0; transform: translateY(6px); } }

/* landscape phones: the sheet scrolls inside itself instead of hiding "Start an inquiry" */
.sheet {
  background: var(--ground); color: var(--ink); padding: 8px var(--gutter) 28px; display: grid; gap: 20px; justify-items: start;
  max-height: calc(100dvh - 56px); overflow-y: auto; overscroll-behavior: contain;
}
.sheet__nav { display: grid; gap: 0; width: 100%; }
.sheet__link {
  color: inherit; text-decoration: none; font-weight: 700; text-transform: uppercase; letter-spacing: var(--track-m);
  font-size: clamp(1.5rem, 1.1rem + 2vw, 2.25rem); line-height: 1; padding: 12px 0;
}
.sheet__link.router-link-active { text-decoration: underline; text-decoration-thickness: 3px; text-underline-offset: 6px; text-decoration-color: var(--accent); }
.sheet__cta { width: 100%; }
.sheet-enter-active { transition: clip-path var(--dur-base) var(--ease-out); }
.sheet-leave-active { transition: clip-path var(--dur-fast) var(--ease-out); }
.sheet-enter-from, .sheet-leave-to { clip-path: inset(0 0 100% 0); }
@media (prefers-reduced-motion: reduce) { .head { transition: none; } .head.is-arriving :is(.head__bar, .head__nav, .head__link) { animation: none; } }
</style>
