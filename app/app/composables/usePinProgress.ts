/**
 * Events v2: scroll progress of a tall section with a sticky stage inside (the /crepes pinned camera sequence,
 * CrpSequence.vue, generalised). `progress` runs 0 → 1 while the section's top travels from the viewport top to
 * (section height − viewport height). One rAF per window scroll event, getBoundingClientRect only, so it follows
 * native touch scroll and Lenis (which moves the real window scroll).
 *
 * `enabled` is false under reduced motion, without IntersectionObserver, and on screens shorter than `minHeight`
 * (landscape phones): render the static version then (a list of the steps with one still each), which is also the
 * SSR / no-JS markup. Only switch to the pinned layout after mount when `enabled` is true.
 *
 *   const root = ref<HTMLElement | null>(null)
 *   const { progress, enabled } = usePinProgress(root)
 *   const step = computed(() => Math.min(N - 1, Math.floor(progress.value * N)))
 */
export function usePinProgress(target: Ref<HTMLElement | null>, opts: { minHeight?: number } = {}) {
  const progress = ref(0)
  const enabled = ref(false)
  let raf = 0
  const read = () => {
    raf = 0
    const el = target.value
    if (!el) return
    const r = el.getBoundingClientRect()
    const run = el.offsetHeight - window.innerHeight
    progress.value = run > 0 ? Math.min(1, Math.max(0, -r.top / run)) : 0
  }
  const onScroll = () => { if (!raf) raf = requestAnimationFrame(read) }
  const check = () => {
    enabled.value = !matchMedia('(prefers-reduced-motion: reduce)').matches && window.innerHeight >= (opts.minHeight ?? 520)
  }
  const onResize = () => { check(); onScroll() }
  onMounted(() => {
    check()
    read()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })
  })
  onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onResize)
    cancelAnimationFrame(raf)
  })
  return { progress, enabled }
}
