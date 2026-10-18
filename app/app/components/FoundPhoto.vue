<script setup lang="ts">
// A credited photograph of the world around the brand (never presented as an Una Mattina event).
// The licence needs attribution, so every photo carries one small credit line: "Photo: creator, licence" (links);
// title and changes are listed once in the footer credits.
// `unveil`: the frame unrolls top-down when it scrolls into view (v-unveil; pass a number to delay it in ms).
// `parallax`: full-bleed photos only. The picture sits in a layer `parallax` × the frame height taller at both ends
// (CSS, so SSR / touch / reduced motion just show a slightly closer crop) and drifts through it while the page
// scrolls (plugins/smooth-scroll.ts, transform only, fine pointers only).
// `bleed`: a full-width band. sizes="100vw" and a hand-made srcset capped at the original's width, so a 1080p monitor
// gets the 1920 file and a 3× phone never downloads an upscaled one.
// Events v2 (events-v2-system.md §Photo):
// `tint`: a flat brown multiply layer over the picture (0–1), for text set over the photo (the text itself lives in
//   the default slot, which is laid over the frame bottom-left; small text inside it needs a .plate).
// `credit="over"`: the credit line sits on a small brown plate in the frame's bottom-right corner instead of under it
//   (full-bleed bands with text over them, where a line under the picture would read as a caption of the next section).
// `position`: object-position of the crop. `settle`: the picture settles 1.06 → 1 on load (above-the-fold only).
const props = withDefaults(defineProps<{ photo: { src: string, w: number, h: number, title: string, creator: string, license: string, licenseUrl: string, page: string, changes?: string }, alt: string, caption?: string, ratio?: string, sizes?: string, eager?: boolean, unveil?: boolean | number, parallax?: number, bleed?: boolean, tint?: number, credit?: 'below' | 'over', position?: string, settle?: boolean }>(), { caption: '', ratio: '', sizes: 'sm:100vw lp:520px', eager: false, unveil: false, parallax: 0, bleed: false, tint: 0, credit: 'below', position: '', settle: false })
const slots = useSlots()
const img = useImage()
const bleedSet = computed(() => {
  if (!props.bleed) return ''
  const ws = [640, 960, 1280, 1600, 1920, 2400, 2880].filter(w => w <= props.photo.w)
  if (!ws.includes(props.photo.w)) ws.push(props.photo.w)
  return ws.map(w => `${img(props.photo.src, { width: w, format: 'webp', quality: 80 })} ${w}w`).join(', ')
})
const unveilDelay = computed(() => (props.unveil === false ? false : props.unveil === true ? 0 : props.unveil))
</script>

<template>
  <figure class="found" :class="{ 'found--over': props.credit === 'over', 'found--text': !!slots.default, 'found--settle': props.settle }" :style="props.position ? { '--found-pos': props.position } : undefined">
    <div v-unveil="unveilDelay" class="found__frame" :style="props.ratio ? { aspectRatio: props.ratio } : undefined">
      <div v-if="props.parallax" v-parallax="props.parallax" class="found__px" :style="{ '--px': props.parallax }">
        <img v-if="props.bleed" :src="img(props.photo.src, { width: Math.min(1920, props.photo.w), format: 'webp', quality: 80 })" :srcset="bleedSet" sizes="100vw" :alt="props.alt" :width="props.photo.w" :height="props.photo.h" :loading="props.eager ? 'eager' : 'lazy'" decoding="async" class="found__img">
        <NuxtImg v-else :src="props.photo.src" :alt="props.alt" :width="props.photo.w" :height="props.photo.h" :sizes="props.sizes" format="webp" :loading="props.eager ? 'eager' : 'lazy'" :fetchpriority="props.eager ? 'high' : undefined" :preload="props.eager" class="found__img" />
      </div>
      <template v-else>
        <img v-if="props.bleed" :src="img(props.photo.src, { width: Math.min(1920, props.photo.w), format: 'webp', quality: 80 })" :srcset="bleedSet" sizes="100vw" :alt="props.alt" :width="props.photo.w" :height="props.photo.h" :loading="props.eager ? 'eager' : 'lazy'" :fetchpriority="props.eager ? 'high' : undefined" decoding="async" class="found__img">
        <NuxtImg v-else :src="props.photo.src" :alt="props.alt" :width="props.photo.w" :height="props.photo.h" :sizes="props.sizes" format="webp" :loading="props.eager ? 'eager' : 'lazy'" :fetchpriority="props.eager ? 'high' : undefined" :preload="props.eager" class="found__img" />
      </template>
      <div v-if="props.tint" class="tint" :style="{ '--tint': props.tint, '--tint-wide': props.tint }" />
      <div v-if="slots.default" class="found__over on-photo"><slot /></div>
    </div>
    <figcaption class="found__cap">
      <span v-if="props.caption" class="found__line">{{ props.caption }}</span>
      <span class="found__credit">Photo: <a :href="props.photo.page" class="found__a" rel="noopener" target="_blank">{{ props.photo.creator }}<span class="sr-only"> (opens in a new tab)</span></a>, <a :href="props.photo.licenseUrl" class="found__a" rel="noopener license" target="_blank">{{ props.photo.license }}<span class="sr-only"> (opens in a new tab)</span></a></span>
    </figcaption>
  </figure>
</template>

<style scoped>
:where(.found) { margin: 0; }
.found__frame { position: relative; overflow: hidden; background: var(--surface); }
.found__img { width: 100%; height: 100%; object-fit: cover; display: block; object-position: var(--found-pos, 50% 50%); }
/* v2: text over the photo (default slot), laid over the frame's bottom-left; the frame keeps its ratio */
.found__over { position: absolute; inset: auto 0 0 0; z-index: 1; padding: clamp(20px, 3vw, 48px) var(--gutter); }
.found--settle .found__img { animation: m-settle var(--dur-settle) var(--ease-out) both; }
@media (prefers-reduced-motion: reduce) { .found--settle .found__img { animation: none; } }
/* v2: credit on a brown plate in the bottom-right corner of the frame */
.found--over { position: relative; }
.found--over .found__cap { position: absolute; right: 0; bottom: 0; z-index: 2; padding: 6px 12px; background: var(--field-dark); color: var(--on-field-dark); }
.found--over .found__credit { color: inherit; }
.found--over.found--text .found__cap { bottom: auto; top: 0; }
.found__px { position: absolute; left: 0; right: 0; top: calc(var(--px) * -100%); bottom: calc(var(--px) * -100%); transform: translate3d(0, var(--py, 0px), 0); }
.found__cap { display: grid; gap: 2px; padding-top: 8px; }
.found__line { font-size: var(--step--1); }
/* the credit: small, quiet, still a real link (underline on hover/focus) and ≥ 4.5:1 */
.found__credit { font-size: 0.8125rem; line-height: 1.4; color: var(--ink-muted); }
.found__a {
  color: inherit; text-decoration: underline 1px; text-underline-offset: 3px;
  text-decoration-color: color-mix(in srgb, currentColor 45%, transparent);
  transition: text-decoration-color var(--dur-fast) var(--ease-out);
}
.found__a:focus-visible { text-decoration-color: currentColor; }
@media (hover: hover) and (pointer: fine) { .found__a:hover { text-decoration-color: currentColor; } }
</style>
