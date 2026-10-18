# Motion and performance review: Una Mattina

Review date: 2026-10-17. Checked against `review-animations`, `animation-performance`, `emil-design-eng`, DESIGN.md (motion tokens) and section-plan.md G9.

## How this was measured

- **Code:** every motion source in scope was read: Awning, default layout, SiteHeader, HeroVideo, StationRotator, PillarExplorer, StationCounter, LsStationList, `plugins/reveal.ts`, ConceptImage, crepes, about, CloseCta, MenuTable, InquiryForm and `main.css`.
- **Production build:** `nuxt build` was run on a copy of `app/` taken at 23:14, in the scratchpad. `nitro.compressPublicAssets` was added only in that copy. The build was served on :3011. The dev server (:3001) is unbundled, so it serves 8 MB of JS, which says nothing about weight. Dev also hides finding P1-3 (CSS order).
- **Browser:** Playwright 1.64 (Chromium).
  - Desktop: 1440×900 at DPR 1.
  - Mobile: 390×844, DPR 3, `isMobile`, CPU throttled 4×.
  - "Slow 4G" means 1.6 Mbit/s with 150 ms RTT.
  - LCP and CLS come from `PerformanceObserver`, recorded through load and a full wheel-scroll of each page.
- **Scroll traces:** DevTools timeline traces of `/`, `/live-stations` and `/crepes` while scrolling at 4×, counting forced layouts, scroll handler cost and frames.
- **Video tests:**
  - with `reducedMotion: 'reduce'`
  - with Save-Data (`navigator.connection` stubbed)
  - pausing and playing
  - with the hero off-screen
  - with the tab hidden and shown again (`visibilitychange`)
- **Concurrent edit:** another agent changed `components/FoundPhoto.vue`, `components/ConceptImage.vue` and `data/credits.ts` at 23:26, during this review. That change follows imagery.md C0. Finding P0-1 is about that new code, checked live on :3001. The weight table below is from the 23:14 build, before the change.

## Verdict

**Block, for one reason: P0-1.** The motion system itself is close to approval:
- every animation uses the token easing and durations;
- transform and opacity only;
- no `transition: all` and no `ease-in`;
- reduced motion is covered by a global kill-switch plus per-component fallbacks;
- content is visible without JS;
- no frames were dropped while scrolling at 4×;
- no forced layouts inside scroll handlers.

The real problems are listed below. Most of them are the hero video's pause and playback lifecycle, LCP images, one CSS-order CLS bug, and G9 budget creep. Most of the blocking work is outside the animations.

---

## Numbers per page

LCP and CLS are taken on production. Transfer is everything downloaded while loading and fully scrolling the page at 1440 (390 where it differs).

| Route | LCP 1440 local | LCP 390 local, 4× | LCP 1440 slow 4G | LCP 390 slow 4G, 4× | LCP element | CLS 1440 | CLS 390 | Images 1440 / 390 | Video |
|---|---|---|---|---|---|---|---|---|---|
| `/` | 780 ms | 300 ms | 2304 ms | 2044 ms | poster (video once it plays) | 0.000 | 0.000 | 1159 / 1124 KB | 1520 KB webm / 572 KB mp4 (after `load`) |
| `/services` | 32 | 116 | 476 | 512 | h1 | 0.000 | 0.000 | 399 / 399 | 0 |
| `/live-stations` | 36 | 104 | 492 | 520 | h1 | 0.000 | **0.027** (font swap) | 490 / 91 | 0 |
| `/luxury-picnics` | 96 | 172 | **3660** | **3500** | hero photo (lazy) | **0.076** (CSS order, P1-3) | 0.000 | 335 / 335 | 0 |
| `/bloom-cart` | 116 | 152 | **3412** | **3284** | hero photo (lazy) | 0.000 | 0.000 | 289 / 289 | 0 |
| `/how-we-work` | 28 | 96 | 468 | 508 | h1 / statement | 0.000 | 0.000 | 0 | 0 |
| `/about` | 80 | 192 | 1900 | 1840 | apron image (lazy) | 0.000 | 0.000 | 363 / 363 | 0 |
| `/inquire` | 36 | 116 | 504 | 532 | h1 / statement | **0.032** (font swap) | 0.000 | 0 | 0 |
| `/crepes` | 148 | 236 | **2640** | **2592** | booth image (drift) | 0.000 | 0.012 (font swap) | 343 / 343 | 0 |

The same on every route:
- **JS:** about 95–99 KB gzip on the critical path, in 16–19 files. NuxtLink then prefetches all other routes while idle, about 125 KB gzip more.
- **CSS:** entry file is 4 KB gzip. Component CSS adds about 20–26 KB raw, inlined in the HTML.
- **HTML:** 13–18 KB gzip.
- **Fonts:** 75 KB, which includes Mrs Saint Delafield for the footer sign-off only.

`motion-v` adds 0 bytes (tree-shaken; it is not used).

**Video:**
- Reduced motion: 0 bytes, on desktop and mobile.
- Save-Data: 0 bytes.
- Normal: the video starts after `load` (3.0 s on slow 4G), so it does not compete with the poster LCP. Good.

**Scroll at 4× CPU:**

| Route | Scroll handler time | Forced layouts in JS | Long tasks while scrolling | Dropped frames |
|---|---|---|---|---|
| `/` | 64 events, max 4 ms | 0 | 0 | 0 |
| `/live-stations` | 38 events, max 3 ms | 0 | 0 | 0 |
| `/crepes` | 51 events, max 0 ms | 0 | 0 | 0 |

At load, `v-reveal` `mounted` forces about 5.6 ms of style and layout on /crepes (4×). That is minor.

---

## P0

### P0-1. The new `sizes` on FoundPhoto and ConceptImage makes every photo download as a 2×2 px image (live on :3001)

The new code follows imagery.md C0 and passes CSS-syntax `sizes`, like `"(min-width: 900px) 520px, 92vw"` and the default `"100vw"`. @nuxt/image v2 does not read that syntax. A `vw` value without a breakpoint prefix is resolved against a screen 1 px wide. This was checked in the dev server's SSR and in a test build:

```
sizes="92vw" srcset="/_ipx/f_webp&q_80&s_1x1/…crepe-griddle-4x5.jpg 1w, /_ipx/f_webp&q_80&s_2x2/… 2w"
```

What the browser does with it:
- Every FoundPhoto, and every ConceptImage whose `sizes` uses `vw`, downloads a **2×2 px** webp. The pier and the lemons get **2×686**.
- The browser stretches that over the frame, so the page shows a flat brown/grey blur (checked with a screenshot of `/` at 1440, Home flowers).
- Only the px-only `sizes="320px"` works.

**Fix: use @nuxt/image's own syntax.**
- A bare value is the default.
- `bp:value` applies from that breakpoint up.
- `vw` only works with a prefix.
- Add a 900 screen so it matches the site's breakpoint.

```ts
// nuxt.config.ts
image: { quality: 80, screens: { xs: 320, sm: 640, md: 768, lp: 900, lg: 1024, xl: 1280, xxl: 1536 } },
```

```vue
<!-- components/FoundPhoto.vue -->
const props = withDefaults(defineProps<{ photo: Found, alt: string, caption: string, ratio?: string, sizes?: string, eager?: boolean }>(),
  { ratio: '', sizes: 'sm:100vw lp:520px', eager: false })
<NuxtImg :src="props.photo.src" :alt="props.alt" :width="props.photo.w" :height="props.photo.h" :sizes="props.sizes" format="webp"
  :loading="props.eager ? 'eager' : 'lazy'" :fetchpriority="props.eager ? 'high' : undefined" :preload="props.eager" class="found__img" />

<!-- components/ConceptImage.vue -->
{ …, sizes: 'sm:100vw', … }
<NuxtImg … :sizes="props.sizes" format="webp" :loading="props.eager ? 'eager' : 'lazy'" :fetchpriority="props.eager ? 'high' : undefined" :preload="props.eager" … />
```

A test build gave this for `sizes="sm:100vw md:520px"`:

```
sizes="(max-width: 767px) 100vw, 520px"   srcset: 520w, 640w, 1040w, 1280w
```

That is correct.

**Values for each call site.** Rewrite every CSS-syntax value:

| Use | `sizes` |
|---|---|
| Home `where__photo`, About `med__photo` (full bleed) | `sm:100vw xl:1440px` |
| Home `halves__beach` | `sm:100vw lp:720px` |
| Home `halves__flowers` | `sm:100vw lp:420px` |
| Home `origin__img` | `sm:100vw lp:40vw` |
| Services `stations__img` | `sm:100vw lp:430px` |
| LsStationList frame layers | `sm:100vw lp:440px` |
| LsStationList `lsl__lead-photo` | `360px` |
| Crepes `hero__photo` | `sm:100vw lp:45vw` |
| Crepes `visit__photo` | `sm:100vw lp:460px` |
| Crepes `morning` | `320px` already works |
| Picnics `pic__photo` | see below |

**Picnics photo:**
- `pages/luxury-picnics.vue:59` still has `.pic__photo :deep(.found__img) { width: 300%; margin-left: -86.3% }`.
- The new `clam-pass-sunset-4x5.jpg` is already that crop, so the hack now zooms 3× into it.
- Delete both properties and use `sizes="sm:100vw lp:480px"`.

**Expected weight once fixed:** Home at 1440 goes from 1159 KB to **about 360 KB** in webp. At 390 / DPR 3, each photo is 65–125 KB.

---

## P1

### P1-1. HeroVideo: Pause fades the video back to the poster

**Where:** `components/HeroVideo.vue:90-91`.

**Problem:** `opacity` follows `playing`. So Pause, scrolling away and tab-hide all fade the video out over 560 ms and show the poster, which is a different frame. Checked: after Pause, the video's computed opacity is `0`. Pause should freeze the frame, not reset the hero.

**Fix:** fade in once, on the first frame, and never fade out.

```ts
const ready = ref(false)
```

```vue
<section class="hv" :class="{ 'is-ready': ready, 'is-still': mode === 'still' }" …>
<video … @playing="playing = true; ready = true" @pause="playing = false" />
```

```css
.hv__video { opacity: 0; transition: opacity var(--dur-slow) var(--ease-out); }
.is-ready .hv__video { opacity: 1; }   /* was .is-playing */
```

### P1-2. HeroVideo: playback rules only exist on the autoplay path, and a returning tab resumes the video off-screen

**Where:** `HeroVideo.vue:39-67`.

**Problems (all checked):**
1. Reduced-motion and Save-Data visitors who press **Play** never get the IntersectionObserver or the `visibilitychange` listener. After Play, scrolling to the bottom leaves the video **playing**, and hiding the tab also leaves it **playing**.
2. `onVis` calls `play()` whenever the tab returns, without checking whether the hero is on screen. Scroll away (video paused), hide the tab, show it again: the video **plays off-screen**.

**Fix:** one place decides whether to play, and it is wired up whenever the video loads.

```ts
let inView = true
const shouldPlay = () => loaded.value && !userPaused.value && inView && !document.hidden
function sync() { const v = video.value; if (!v) return; shouldPlay() ? v.play().catch(() => { userPaused.value = true }) : v.pause() }
function watchPlayback() {
  if (io || !video.value) return
  io = new IntersectionObserver(([e]) => { inView = e!.isIntersecting; sync() }, { threshold: 0.1 })
  io.observe(video.value)
  document.addEventListener('visibilitychange', sync)
}
function load() {
  const v = video.value; if (!v) return
  v.muted = true; v.defaultMuted = true; v.setAttribute('muted', '')
  v.replaceChildren(...pick().map(s => Object.assign(document.createElement('source'), s)))
  v.load(); loaded.value = true
  watchPlayback(); sync()
}
function toggle() {
  if (!loaded.value) { userPaused.value = false; load(); return }
  userPaused.value = playing.value; sync()
}
onMounted(async () => {
  if (props.still || !props.sources?.length) return
  mode.value = 'video'; await nextTick()
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  const c = (navigator as Navigator & { connection?: { saveData?: boolean, effectiveType?: string } }).connection
  if (reduce || c?.saveData || ['slow-2g', '2g'].includes(c?.effectiveType ?? '')) { userPaused.value = true; return }
  load()
})
onBeforeUnmount(() => { io?.disconnect(); document.removeEventListener('visibilitychange', sync) })
```

Remove the old `onVis`.

### P1-3. Hydration CLS from CSS order: child `margin: 0` beats parent overrides only in production SSR

**Where:**
- `components/FoundPhoto.vue:19` `.found { margin: 0; }`
- `ConceptImage.vue:14` `.concept { …margin: 0… }`
- `ShootSlot.vue:18` `.slot { margin: 0 }`

**Why it happens:** these have the same specificity (0,2,0) as the parent overrides, for example `.pic__photo[data-v-…]`. So the rule that comes later wins.
- In the SSR inline `<style>` order, the child component comes later. The parent's margins are dropped.
- After hydration, the route CSS files load in a different order. The parent wins, and the layout jumps.

**Measured (production only; dev does not show it):**
- `/luxury-picnics` 1440: **CLS 0.076**. The hero side is 600 px tall and drops to 435 when the -165 px margin applies. The h1 moves up 165 px.
- `/live-stations` 390: the page grows 88 px (`.lsl__lead-photo { margin-bottom: 88px }`).
- Home 1440: +12 px (`halves__*` margin-top) and +40 px (`where__photo`).
- No-JS visitors keep the wrong layout.

**Fix:** give the resets zero specificity.

```css
/* FoundPhoto.vue */   :where(.found) { margin: 0; }
/* ConceptImage.vue */ .concept { position: relative; overflow: hidden; background: var(--surface); }  :where(.concept) { margin: 0; }
/* ShootSlot.vue */    :where(.slot) { margin: 0; }  .slot { display: flex; max-height: min(70svh, 640px); width: 100%; }
```

### P1-4. LCP images are lazy and oversized

**Problem:** FoundPhoto is always `loading="lazy"`, and ConceptImage is lazy by default. Under slow 4G the LCP is:
- `/luxury-picnics`: **3.66 s**
- `/bloom-cart`: **3.41 s**
- `/crepes`: 2.64 s (eager, but a 183 KB 1374 px image)
- `/about`: 1.90 s

**Fix:** use P0-1's `eager` (that is `fetchpriority="high"` plus `preload`) on the first-viewport image of each page:

```vue
<!-- pages/luxury-picnics.vue --> <FoundPhoto class="pic__photo" … eager sizes="sm:100vw lp:480px" />
<!-- pages/bloom-cart.vue -->     <FoundPhoto class="bc-hero__photo" … eager />
<!-- pages/about.vue -->          <ConceptImage class="ab-hero__img" … sizes="240px sm:320px" eager />
<!-- pages/crepes.vue -->         <ConceptImage class="hero__photo" … sizes="sm:100vw lp:45vw" eager />
```

Expected result: 0.6–1.5 s, because the files are about 30–60 KB in webp at display size.

**Home poster:** it ends at 2.7 s on slow 4G, behind the JS and the three fonts. It is already `fetchpriority="high"`. The poster itself is fine; the gain is in P2-9 (fonts).

### P1-5. G9 motion budget is exceeded

G9 says `v-reveal` goes only on section headings and at most one block per section, and lists longer than 4 get no per-item stagger. These break it:

| File | Now | Change to |
|---|---|---|
| `components/MenuTable.vue:12` | `<tr v-for … v-reveal="i * 60">` (10 rows). Each row is observed on its own, so the "stagger" is just added delay as each row scrolls in. | Remove `v-reveal` from `<tr>`. The menu heading already reveals. |
| `components/InquiryForm.vue:110,130,138,160,168,181` | `v-reveal` on six legends/labels | Remove all six. This is the conversion form: when someone tabs into a field, its legend should not slide 24 px under their focus. |
| `pages/crepes.vue:100-101` | photo **and** card reveal | Keep `v-reveal` on `.card` only. |
| `pages/crepes.vue:134,148` | every market **and** the photo reveal | Keep the heading only (or one block). |
| `pages/inquire.vue:33,39` | `ol` (80) **and** `Faq` (160) | Keep the `ol`. |
| `pages/how-we-work.vue:55-56` | two `p` reveals | Keep the statement. |
| `pages/crepes.vue:71` | `ConceptImage … drift`: an 18 s infinite loop on the QR landing's LCP image, a second authored moment (inner pages = awning drop only), and it moves a "Concept image · placeholder" | Remove `drift`. If nothing else uses it, delete `.is-drift` and `@keyframes drift` from ConceptImage. |

### P1-6. Crêpes morning strip: mandatory snap with no `scroll-padding` drops the gutter

**Where:** `pages/crepes.vue:254-257`.

**Problem:** with `scroll-snap-type: x mandatory`, `padding-inline: var(--gutter)` and `scroll-padding: auto`, the strip snaps the first card flush to the screen edge as soon as it lays out. Measured at 390: `scrollLeft` is 16 at rest. The 16 px gutter is lost, and every later snap also lands at x = 0.

**Fix:**

```css
.morning__strip { …; scroll-padding-inline: var(--gutter); }
```

---

## P2

1. **Awning drop: keyframe value and feel.**
   - Where: `components/Awning.vue:34`.
   - The keyframe uses `scaleY(0.55)`, but DESIGN.md says `0.6`. Fix it to match the token.
   - On taste: `scaleY` squashes the half-sun scallops into flat ovals during the drop (seen at 60 ms). Sliding the row out from under the fascia reads as an awning unrolling and keeps the scallops round. It is still transform-only. The sticky header (z-index 40) covers the top; on /crepes the row comes from above the viewport.
     ```css
     @keyframes awning-drop { from { transform: translateY(-40%); } to { transform: none; } }
     ```
   - `:key="route.path"` (`layouts/default.vue:18`) replays the drop and remounts 72 spans on every client-side navigation. If "once" in DESIGN.md means once per visit:
     ```vue
     <Awning :key="route.path" :tone="awning" :drop="!dropped" />   // const dropped = useState('awningDropped', () => false); onMounted(() => setTimeout(() => dropped.value = true, 600))
     ```

2. **SiteHeader.**
   - Where: `SiteHeader.vue:51-52, 12-21, 60`.
   - `is-scrolled` switches the background from the field to cream in one frame at y > 8. Add it to the transition: `transition: transform var(--dur-base) var(--ease-out), background-color var(--dur-base) var(--ease-out), color var(--dur-base) var(--ease-out);`
   - Scroll handler hygiene. It measured ≤4 ms per event at 4×, so this is not jank: wrap `onScroll` in `requestAnimationFrame` and cache `offsetHeight` with a `ResizeObserver` instead of reading it on every scroll.
   - The `.head__link:hover::after` underline is not gated, so it sticks after a tap on touch screens. Wrap it in `@media (hover: hover) and (pointer: fine)`. The same applies to `.hv__toggle:hover` (`HeroVideo.vue:99`).

3. **StationRotator.**
   - Where: `StationRotator.vue:31,37`.
   - `mode="out-in"` makes each step 480 ms (240 out, then 240 in) and queues steps on a fast scroll.
   - The plank resizes instantly from 408 px to 721 px at "Cocktails & mocktails" (measured), while the text is still sliding.
   - Fix: run enter and leave together in one grid cell, size the plank to the longest label, and keep the scroll read in rAF.
     ```vue
     <button …class="plank sign-m"><span class="plank__stack">
       <span v-for="s in stations" :key="s.id" class="plank__sizer">{{ s.short }}</span>
       <Transition name="rot"><span :key="idx" class="plank__t">{{ stations[idx]!.short }}</span></Transition>
     </span></button>
     ```
     ```css
     .plank__stack { display: grid; } .plank__stack > * { grid-area: 1 / 1; } .plank__sizer { visibility: hidden; white-space: nowrap; }
     ```

4. **StationCounter.**
   - Where: `StationCounter.vue:25,61-63`.
   - `TransitionGroup` has no move handling. A removed sign keeps its grid cell for 240 ms, then the others jump.
   - Fix: let the exit snap (a system response) and let the rest glide:
     ```css
     .sc-move { transition: transform var(--dur-base) var(--ease-out); }
     .sc-leave-active { display: none; }
     ```

5. **LsStationList frame.**
   - Where: `LsStationList.vue:73-74`.
   - Both layers cross-fade at the same time, so mid-way both are about 50 % and the field shows through (a "dip").
   - Fix: keep the outgoing layer opaque under the incoming one.
     ```css
     .lsl__layer { grid-area: 1 / 1; opacity: 0; visibility: hidden; transition: opacity 0s linear var(--dur-base), visibility 0s linear var(--dur-base); }
     .lsl__layer.is-on { z-index: 1; opacity: 1; visibility: visible; transition: opacity var(--dur-base) var(--ease-out), visibility 0s; }
     ```

6. **PillarExplorer.**
   - Where: `PillarExplorer.vue:55`.
   - A 30 ms × i stagger over 8 pieces means the last fill starts 210 ms after a click. That is a list longer than 4 (G9) on a control people click repeatedly.
   - Fix: cap the stagger, and only stagger the fill-in (un-filling snaps).
     ```css
     .px__piece::before { …; transition: transform var(--dur-base) var(--ease-out); }
     .px__piece.is-on::before { transform: scaleX(1); transition-delay: calc(min(var(--i), 3) * 20ms); }
     ```

7. **`plugins/reveal.ts` hygiene.**
   - Problems:
     - no `unmounted` cleanup, so observers leak when you navigate away before an element reveals;
     - the inline `transition` stays on the element forever;
     - one IntersectionObserver per element;
     - 24 px of travel, while the other entrances use 16 px (board), 14/8 px (counter) and 60 % (rotator).
   - Fix: unify on 16 px.
     ```ts
     export default defineNuxtPlugin((nuxtApp) => {
       if (import.meta.server) { nuxtApp.vueApp.directive('reveal', { getSSRProps: () => ({}) }); return }
       const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
       const delays = new WeakMap<Element, number>()
       const io = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
         for (const e of entries) {
           if (!e.isIntersecting) continue
           const el = e.target as HTMLElement
           io!.unobserve(el)
           el.style.transition = `opacity var(--dur-slow) var(--ease-out) ${delays.get(el) ?? 0}ms, transform var(--dur-slow) var(--ease-out) ${delays.get(el) ?? 0}ms`
           el.style.opacity = ''; el.style.transform = ''
           el.addEventListener('transitionend', () => { el.style.transition = '' }, { once: true })
         }
       }, { rootMargin: '0px 0px -8% 0px' }) : null
       nuxtApp.vueApp.directive<HTMLElement, number | undefined>('reveal', {
         getSSRProps: () => ({}),
         mounted(el, b) {
           if (!io || reduce || el.getBoundingClientRect().top < innerHeight * 0.9) return
           delays.set(el, Number(b.value ?? 0)); el.style.opacity = '0'; el.style.transform = 'translateY(16px)'; io.observe(el)
         },
         unmounted(el) { io?.unobserve(el) },
       })
     })
     ```

8. **Reduced-motion kill-switch.**
   - Where: `main.css:123-129`.
   - It zeroes durations but not delays, so a `transition-delay` (for example the stagger calcs) still holds a state change back.
   - Add `animation-delay: 0s !important; transition-delay: 0s !important;`.

9. **Fonts.**
   - The font swap causes CLS of 0.032 on `/inquire` (1440), 0.027 on `/live-stations` (390) and 0.012 on `/crepes` (390): text moves up about 30 px at 1.2–1.5 s.
   - Mrs Saint Delafield (18.7 KB, footer sign-off only) loads in the critical window and competes with the Home poster.
   - In `site.config.ts`, preload Montserrat and stop the script face from blocking: `{ name: 'Montserrat', …, preload: true }`. Either render the sign-off as an SVG, or give the script family `font-display: optional` through an @nuxt/fonts family override.

10. **HeroVideo SSR class.**
    - SSR renders `is-still`, so the 24 s ken-burns runs on the poster until hydration, then stops and snaps back.
    - The snap is negligible (scale ≤ 1.002 at a 3 s hydration).
    - To make it clean, only start the zoom when the component truly stays still: `.is-still.is-static .hv__poster { animation: … }`, with `is-static` set when `props.still` is true.

11. **Critical JS.**
    - About 95–99 KB gzip on every route for a mostly static site.
    - `motion-v/nuxt` is registered but unused (0 bytes shipped). Remove it from `modules` so nobody reaches for a JS spring where a CSS transition is enough.

---

## What passes (approved as is)

| Piece | Driver / properties | Timing | Reduced motion | Notes |
|---|---|---|---|---|
| Awning drop | CSS keyframes, `transform` | 560 ms ease-out, `both` | Global rule (static) | Visible without JS. The counter awning uses `:drop="false"`, which is correct. |
| Header headroom | CSS transition, `transform` | 240 ms ease-out | `transition: none` | Never hides with the menu open or focus inside. Measured: hides at 76 px and returns on a 60 px scroll-up. |
| Hero video load | JS gate | n/a | **0 video bytes** (checked) | Save-Data: 0 bytes. `preload="none"`. Loads after `load`. |
| Hero board rise | CSS keyframes, `transform` 16 px | 560 ms ease-out, 120 ms delay | `animation: none` | No opacity, so the headline is readable from the first paint. |
| PillarExplorer fills | `scaleX` on `::before` | 240 ms ease-out | `transition: none` | Composite-only and interruptible. Stagger: see P2-6. |
| LsStationList | IntersectionObserver (no scroll listener); `scaleX` plank; opacity layers | 240 ms | `transition: none` | Hidden layers become `visibility: hidden`, `inert`. Cross-fade: see P2-5. |
| About rising suns | `transform` on an absolute sun, 120 ms stagger over 3 | 560 ms ease-out | Final position is the default | Purposeful (three heights of one sun). Accepted as the page's content device, next to the awning. |
| CloseCta planks | `v-reveal`, 80 ms between 2 | 560 ms | Plugin skips | Fine. |
| Crêpes thumb bar | IntersectionObserver plus `transform` | 240 ms ease-out | Global rule | `aria-hidden` and `tabindex` follow visibility; hidden ≥600 px. |
| Buttons / links | colour plus 1 px press | 160 ms | Global rule | Hover is gated with `(hover: hover)` in `main.css`. |

There is no `transition: all`, no `ease-in`, no `scale(0)`, no layout-property animation, and no animated blur. Every duration and curve comes from tokens. The two 18–24 s loops use `--ease-in-out`, as the rules require.

Test scripts (Playwright, trace parsing and CLS isolation) and the production build used are in the session scratchpad: `measure.cjs`, `behave.cjs`, `trace.cjs`, `lcpthr.cjs`, `nojs.cjs`.
