/**
 * Smooth scrolling (Lenis) + the scroll-linked details that ride on it.
 *
 * Lenis is on only for a mouse / trackpad ((hover: hover) and (pointer: fine)) and never under prefers-reduced-motion;
 * touch keeps native momentum. It drives the real window scroll, so everything else stays native: position: sticky,
 * IntersectionObserver reveals (plugins/reveal.ts), scroll listeners (header headroom, StationRotator, /crepes bar),
 * CSS scroll-driven animations (About suns), focus scrolling and keyboard scrolling (Space / PageDown / arrows are not
 * intercepted; Lenis just re-syncs from the native scroll event).
 *
 *   anchors      in-page links (#menu, #counter, the skip link #main) glide to their target and respect
 *                html { scroll-padding-top } (and scroll-margin-top); the URL hash and the focus starting point are
 *                the browser's own fragment navigation.
 *   nested       anything that scrolls by itself (mobile sheet, the /crepes strip, textareas) keeps its own wheel.
 *   routes       a route change cancels any glide and pauses wheel input until the router has restored the position
 *                (top for a new page, the saved position for back / forward), then Lenis re-syncs from it.
 *
 * Also here, both only while Lenis runs (so: fine pointer, motion allowed):
 *   v-parallax="0.07"  the element drifts through ±(value × its parent's height) while the parent crosses the
 *                      viewport. Writes one custom property (--py) on the element; the element's own CSS turns it into
 *                      a transform and must already be oversized so no edge shows (FoundPhoto parallax, HeroVideo).
 *   valance flutter    the scallops under the header stretch a few pixels with scroll velocity, then settle.
 */
import Lenis from 'lenis'

declare module '#app' {
  interface NuxtApp { $lenis: Lenis | null }
}

interface Px { el: HTMLElement, amount: number, on: boolean }

export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.server) {
    nuxtApp.vueApp.directive('parallax', { getSSRProps: () => ({}) })
    nuxtApp.provide('lenis', null)
    return
  }
  const px = new Map<HTMLElement, Px>()
  const pxIo = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries) => {
        for (const e of entries) {
          const p = [...px.values()].find(x => x.el.parentElement === e.target)
          if (p) p.on = e.isIntersecting
        }
        updateParallax()
      }, { rootMargin: '10% 0px' })
    : null

  // the directive is registered either way (SSR-safe no-op when Lenis is off)
  nuxtApp.vueApp.directive<HTMLElement, number>('parallax', {
    getSSRProps: () => ({}),
    mounted(el, b) {
      if (!lenis || !el.parentElement) return
      px.set(el, { el, amount: Number(b.value) || 0.06, on: false })
      pxIo?.observe(el.parentElement)
      requestAnimationFrame(updateParallax)
    },
    unmounted(el) {
      if (el.parentElement) pxIo?.unobserve(el.parentElement)
      px.delete(el)
    },
  })

  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  let lenis: Lenis | null = null
  if (fine && !reduce) {
    lenis = new Lenis({
      autoRaf: true,
      lerp: 0.11,
      wheelMultiplier: 1,
      anchors: true,
      allowNestedScroll: true,
      stopInertiaOnNavigate: true,
    })
  }
  nuxtApp.provide('lenis', lenis)
  if (!lenis) return
  const L = lenis

  /* ── routes ───────────────────────────────────────────────────────────── */
  const router = useRouter()
  let resume = 0
  router.beforeEach((to, from) => {
    if (to.path === from.path) return
    clearTimeout(resume)
    L.stop() // cancels the glide; wheel input is swallowed during the ~400 ms page transition
  })
  const restart = () => {
    clearTimeout(resume)
    // the router scrolls one frame after the transition promise; start after that, then sync from the real position
    resume = window.setTimeout(() => { L.start(); L.resize() }, 120)
  }
  nuxtApp.hook('page:loading:end', () => {
    const t = (nuxtApp as unknown as { '~transitionPromise'?: Promise<void> })['~transitionPromise']
    if (t) t.then(restart)
    else restart()
  })
  nuxtApp.hook('app:error', () => L.start())

  /* ── parallax ─────────────────────────────────────────────────────────── */
  function updateParallax() {
    if (!px.size) return
    const vh = window.innerHeight
    const reads: [Px, number][] = []
    for (const p of px.values()) {
      if (!p.on || !p.el.parentElement) continue
      const r = p.el.parentElement.getBoundingClientRect()
      // -1 when the frame enters at the bottom, +1 when it leaves at the top
      const t = Math.max(-1, Math.min(1, (vh / 2 - (r.top + r.height / 2)) / (vh / 2 + r.height / 2)))
      reads.push([p, t * p.amount * r.height])
    }
    for (const [p, y] of reads) p.el.style.setProperty('--py', `${y.toFixed(1)}px`)
  }

  /* ── valance flutter ──────────────────────────────────────────────────── */
  let row: HTMLElement | null = null
  let flap = 0
  let settle = 0
  function flutter(v: number) {
    if (!row || !row.isConnected) row = document.querySelector<HTMLElement>('.site__awning .awning__row')
    if (!row) return
    if (window.scrollY > 240 && flap === 0) return // out of sight under the header
    const target = Math.min(Math.abs(v), 60) / 60 // 0..1
    flap += (target - flap) * 0.25
    if (flap < 0.004) flap = 0
    row.style.transform = flap ? `scaleY(${(1 + flap * 0.5).toFixed(3)})` : ''
    cancelAnimationFrame(settle)
    if (flap) settle = requestAnimationFrame(() => flutter(0)) // ease back to rest once the scroll stops
  }

  L.on('scroll', (l: Lenis) => {
    updateParallax()
    flutter(l.velocity)
  })
  window.addEventListener('resize', () => requestAnimationFrame(updateParallax), { passive: true })
})
