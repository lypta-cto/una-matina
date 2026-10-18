/**
 * Scroll motion directives (shared vocabulary, see assets/css/motion.css). None of them ever hides content
 * by default: SSR, no-JS, reduced motion and anything already in the first viewport render final.
 * Only elements still below the fold are "armed" on mount and play once when they enter.
 *
 *   v-lines            section headline: each rendered line rises from its own baseline mask
 *                      (560 ms, --ease-out, 70 ms per line). Text-only headings; anything with child
 *                      elements falls back to v-reveal. v-lines="120" adds a start delay in ms.
 *   v-unveil           picture frame: unrolls top-down (clip-path) while the image settles 1.06 → 1.
 *                      Put it on the element that crops the picture (FoundPhoto/ConceptImage: `unveil` prop).
 *                      v-unveil="false" turns it off.
 *   v-reveal           one supporting block: rises 16 px and fades in. v-reveal="80" delays it.
 *   v-stage            component-authored choreography: sets data-stage="armed" on mount and "in" when it
 *                      enters, then removes the attribute. Write the CSS for [data-stage="armed"] (start) and
 *                      [data-stage="in"] (transition to the default state). The default must be the final state.
 *
 * One IntersectionObserver for all of them. During a client-side navigation, the check for "is it in the
 * first viewport" assumes the new page starts at the top, and observing waits until the page transition
 * has finished (otherwise the old scroll position would fire everything at once).
 */
type Kind = 'lines' | 'unveil' | 'reveal' | 'stage'
interface Job { kind: Kind, delay: number }

export default defineNuxtPlugin((nuxtApp) => {
  const names: Kind[] = ['lines', 'unveil', 'reveal', 'stage']
  if (import.meta.server) {
    for (const n of names) nuxtApp.vueApp.directive(n, { getSSRProps: () => ({}) })
    return
  }

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  const jobs = new WeakMap<HTMLElement, Job>()
  const timers = new WeakMap<HTMLElement, number>()
  const pending = new Set<HTMLElement>()
  let navigating = false

  const io = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries) => {
        for (const e of entries) if (e.isIntersecting) play(e.target as HTMLElement)
      }, { rootMargin: '0px 0px -8% 0px' })
    : null

  const router = useRouter()
  router.beforeEach((to, from) => { if (to.path !== from.path) navigating = true })
  const flush = () => {
    if (!navigating) return
    navigating = false
    // the router scrolls to the top right after the transition hook; observe after that
    setTimeout(() => { for (const el of pending) io?.observe(el); pending.clear() }, 60)
  }
  nuxtApp.hook('page:transition:finish', flush)
  nuxtApp.hook('page:finish', () => setTimeout(flush, 700)) // fallback when no transition runs

  function frame(fn: () => void) { requestAnimationFrame(() => requestAnimationFrame(fn)) }

  /** Group the heading's words by rendered line and wrap each line in a mask. Returns the line inners. */
  function splitLines(el: HTMLElement): HTMLElement[] {
    const text = el.textContent ?? ''
    const words = text.trim().split(/\s+/)
    el.textContent = ''
    const spans = words.map((w, i) => {
      const s = document.createElement('span')
      s.textContent = w
      el.append(s)
      if (i < words.length - 1) el.append(' ')
      return s
    })
    const lines: string[][] = []
    let top = Number.NaN
    for (const s of spans) {
      if (s.offsetTop !== top) { lines.push([]); top = s.offsetTop }
      lines.at(-1)!.push(s.textContent ?? '')
    }
    el.textContent = ''
    return lines.map((ws, i) => {
      const outer = document.createElement('span')
      outer.className = 'm-line'
      const inner = document.createElement('span')
      inner.className = 'm-line__i'
      inner.textContent = ws.join(' ')
      outer.append(inner)
      el.append(outer)
      if (i < lines.length - 1) el.append(' ')
      return inner
    })
  }

  function play(el: HTMLElement) {
    io?.unobserve(el)
    const job = jobs.get(el)
    if (!job) return
    jobs.delete(el)
    const ease = 'var(--ease-out)'
    const dur = 'var(--dur-slow)'

    if (job.kind === 'lines') {
      const text = el.dataset.mText ?? el.textContent ?? ''
      const inners = splitLines(el)
      for (const i of inners) i.style.transform = 'translateY(118%)'
      el.style.opacity = ''
      frame(() => inners.forEach((i, n) => {
        i.style.transition = `transform ${dur} ${ease} ${job.delay + n * 70}ms`
        i.style.transform = ''
      }))
      // back to the plain text node once settled, so later re-wraps (resize, font swap) stay native
      timers.set(el, window.setTimeout(() => { el.textContent = text; delete el.dataset.mText }, job.delay + inners.length * 70 + 700))
      return
    }

    if (job.kind === 'stage') {
      frame(() => { el.dataset.stage = 'in' })
      timers.set(el, window.setTimeout(() => { delete el.dataset.stage }, job.delay + 1400))
      return
    }

    if (job.kind === 'unveil') {
      const img = el.querySelector<HTMLElement>('img')
      el.style.transition = `clip-path ${dur} ${ease} ${job.delay}ms`
      if (img) img.style.transition = `transform ${dur} ${ease} ${job.delay}ms`
      frame(() => { el.style.clipPath = ''; if (img) img.style.transform = '' })
      timers.set(el, window.setTimeout(() => { el.style.transition = ''; if (img) img.style.transition = '' }, job.delay + 700))
      return
    }

    el.style.transition = `opacity ${dur} ${ease} ${job.delay}ms, transform ${dur} ${ease} ${job.delay}ms`
    frame(() => { el.style.opacity = ''; el.style.transform = '' })
    timers.set(el, window.setTimeout(() => { el.style.transition = '' }, job.delay + 700))
  }

  function arm(kind: Kind) {
    return {
      getSSRProps: () => ({}),
      mounted(el: HTMLElement, b: { value?: number | boolean }) {
        if (!io || reduce || b.value === false) return
        const r = el.getBoundingClientRect()
        const top = navigating ? r.top + window.scrollY : r.top
        if (top < window.innerHeight * 0.9) return
        let k = kind
        if (k === 'lines' && el.children.length) k = 'reveal'
        jobs.set(el, { kind: k, delay: Number(b.value ?? 0) || 0 })
        if (k === 'lines') {
          el.dataset.mText = el.textContent ?? ''
          el.style.opacity = '0' // split happens at play time, after web fonts have settled the line breaks
        }
        else if (k === 'stage') {
          el.dataset.stage = 'armed'
        }
        else if (k === 'unveil') {
          el.style.clipPath = 'inset(0 0 100% 0)'
          const img = el.querySelector<HTMLElement>('img')
          if (img) img.style.transform = 'scale(1.06)'
        }
        else {
          el.style.opacity = '0'
          el.style.transform = 'translateY(16px)'
        }
        if (navigating) pending.add(el)
        else io.observe(el)
      },
      unmounted(el: HTMLElement) {
        io?.unobserve(el)
        pending.delete(el)
        clearTimeout(timers.get(el))
      },
    }
  }
  for (const n of names) nuxtApp.vueApp.directive(n, arm(n))
})
