<script setup lang="ts">
// The featured crêpe as a small notification card (Luka: "a pop-up, like a notice"). It pops in shortly
// after the hero has loaded, stays only while the hero is on screen, and can be dismissed for the session.
// Client-only and position: fixed, so it never shifts layout; with JS off the menu below still lists it.
import type { Crepe } from '~/data/menu'

const props = defineProps<{ featured: Crepe | null, menuHref: string, target: string }>()
const KEY = 'um-pick-dismissed'

const mounted = ref(false)
const ready = ref(false) // the load delay has passed
const inView = ref(true) // the hero is still on screen
const dismissed = ref(false)
const show = computed(() => mounted.value && ready.value && inView.value && !dismissed.value && !!props.featured)

let io: IntersectionObserver | undefined
let timer: ReturnType<typeof setTimeout> | undefined

function dismiss() {
  dismissed.value = true
  try { sessionStorage.setItem(KEY, '1') } catch {}
}
function onKey(e: KeyboardEvent) { if (e.key === 'Escape' && show.value) dismiss() }

onMounted(() => {
  try { dismissed.value = sessionStorage.getItem(KEY) === '1' } catch {}
  mounted.value = true
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  timer = setTimeout(() => (ready.value = true), reduce ? 400 : 1600)
  const hero = document.querySelector(props.target)
  if (hero && 'IntersectionObserver' in window) {
    io = new IntersectionObserver(([e]) => (inView.value = !!e && e.intersectionRatio > 0.4), { threshold: [0, 0.4, 1] })
    io.observe(hero)
  }
  window.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => { io?.disconnect(); clearTimeout(timer); window.removeEventListener('keydown', onKey) })
</script>

<template>
  <Teleport to="body">
    <Transition name="pick">
      <aside v-if="show && props.featured" class="pick" aria-label="Featured crêpe">
        <CrpConeMark class="pick__mark" aria-hidden="true" />
        <div class="pick__body">
          <p class="pick__name"><span>{{ props.featured.name }}</span><span class="pick__price tnum"><Tbc note="price">${{ props.featured.price }}</Tbc></span></p>
          <p class="pick__note">{{ props.featured.note }}</p>
          <a :href="props.menuHref" class="pick__link" @click="dismiss">See the menu <span aria-hidden="true">↓</span></a>
        </div>
        <button type="button" class="pick__close" aria-label="Dismiss" @click="dismiss"><span aria-hidden="true">×</span></button>
      </aside>
    </Transition>
  </Teleport>
</template>

<style scoped>
.pick {
  position: fixed; z-index: 45; left: 12px; right: 12px; bottom: calc(12px + env(safe-area-inset-bottom));
  display: grid; grid-template-columns: auto minmax(0, 1fr) auto; gap: 14px; align-items: start;
  padding: 16px 12px 16px 16px; border-radius: 18px;
  background: var(--ground); color: var(--ink);
  /* It truly floats over the photo, so it gets the one shadow on the page. */
  box-shadow: 0 18px 40px -18px color-mix(in srgb, var(--field-dark) 70%, transparent), 0 2px 6px color-mix(in srgb, var(--field-dark) 25%, transparent);
  --focus-ring: var(--ink);
  /* the /crepes spring (its token lives on .crp, which the teleported card is outside of) */
  --pick-spring: linear(0, 0.009, 0.035 2.1%, 0.141 4.4%, 0.723 12.9%, 0.938 16.7%, 1.017 19.4%, 1.067, 1.099 24.3%, 1.108 26%, 1.103, 1.088 30.4%, 1.019 39.4%, 0.993 44.5%, 0.986 48.2%, 0.99 53.6%, 1.003 66.5%, 1 100%);
}
@media (min-width: 700px) { .pick { left: auto; right: 24px; bottom: 24px; width: 360px; } }
.pick__mark { width: 40px; color: var(--ink); margin-top: 2px; }
.pick__body { display: grid; gap: 3px; min-width: 0; }
.pick__name { display: flex; justify-content: space-between; gap: 12px; font-weight: 700; font-size: 1.125rem; line-height: 1.25; }
.pick__price { flex: none; }
.pick__note { font-size: 0.9375rem; line-height: 1.4; color: var(--ink-muted); }
.pick__link { justify-self: start; margin-top: 6px; font-weight: 600; font-size: 0.9375rem; color: var(--ink); text-decoration: underline; text-decoration-thickness: 2px; text-underline-offset: 4px; text-decoration-color: var(--accent); padding: 6px 0; }
.pick__close {
  width: 44px; height: 44px; margin: -10px -6px 0 0; border: 0; border-radius: 50%; background: transparent; color: var(--ink);
  font: 400 1.75rem/1 var(--font-text); cursor: pointer; touch-action: manipulation;
  transition: background-color var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out);
}
.pick__close:active { transform: scale(0.92); }
@media (hover: hover) and (pointer: fine) { .pick__close:hover { background: var(--surface); } .pick__link:hover { text-decoration-color: var(--ink); } }

/* Pop in like a notification: up from below with a little spring; leave quicker. */
.pick-enter-active { transition: transform 620ms var(--pick-spring), opacity 260ms var(--ease-out); }
.pick-leave-active { transition: transform 220ms var(--ease-in-out), opacity 200ms var(--ease-out); }
.pick-enter-from { opacity: 0; transform: translateY(24px) scale(0.96); }
.pick-leave-to { opacity: 0; transform: translateY(12px); }
@media (prefers-reduced-motion: reduce) {
  .pick-enter-active, .pick-leave-active { transition: opacity 200ms linear; }
  .pick-enter-from, .pick-leave-to { transform: none; }
}
</style>
