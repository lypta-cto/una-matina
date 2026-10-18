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
const props = withDefaults(defineProps<{ photo: { src: string, w: number, h: number, title: string, creator: string, license: string, licenseUrl: string, page: string, changes?: string }, alt: string, caption?: string, ratio?: string, sizes?: string, eager?: boolean, unveil?: boolean | number, parallax?: number, bleed?: boolean }>(), { caption: '', ratio: '', sizes: 'sm:100vw lp:520px', eager: false, unveil: false, parallax: 0, bleed: false })
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
  <figure class="found">
    <div v-unveil="unveilDelay" class="found__frame" :style="props.ratio ? { aspectRatio: props.ratio } : undefined">
      <div v-if="props.parallax" v-parallax="props.parallax" class="found__px" :style="{ '--px': props.parallax }">
        <img v-if="props.bleed" :src="img(props.photo.src, { width: Math.min(1920, props.photo.w), format: 'webp', quality: 80 })" :srcset="bleedSet" sizes="100vw" :alt="props.alt" :width="props.photo.w" :height="props.photo.h" :loading="props.eager ? 'eager' : 'lazy'" decoding="async" class="found__img">
        <NuxtImg v-else :src="props.photo.src" :alt="props.alt" :width="props.photo.w" :height="props.photo.h" :sizes="props.sizes" format="webp" :loading="props.eager ? 'eager' : 'lazy'" :fetchpriority="props.eager ? 'high' : undefined" :preload="props.eager" class="found__img" />
      </div>
      <NuxtImg v-else :src="props.photo.src" :alt="props.alt" :width="props.photo.w" :height="props.photo.h" :sizes="props.sizes" format="webp" :loading="props.eager ? 'eager' : 'lazy'" :fetchpriority="props.eager ? 'high' : undefined" :preload="props.eager" class="found__img" />
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
.found__img { width: 100%; height: 100%; object-fit: cover; display: block; }
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
