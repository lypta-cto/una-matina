<script setup lang="ts">
// Home: a full-bleed photo band with words over it (events-v2-system.md §3, "Full-bleed band with words over it").
// FoundPhoto's bleed band, plus what Home needs from it: a separate phone source (the 4:3 original, so a 4:5 phone
// crop is never an upscaled slice of the 21:9 file) and its own crop per width. A flat brown multiply tint, the words
// in the default slot bottom-left (inside .wrap, so they share the page's left edge), the credit on a brown plate
// (top-left under 1100 px, clear of the words and of the room's credit above; from 1100 px bottom-right).
// Parallax ±parallax × the frame (v-parallax: fine pointer + Lenis only; touch / reduced motion = a still crop).
interface Photo { src: string, w: number, h: number, creator: string, license: string, licenseUrl: string, page: string }
const props = withDefaults(defineProps<{
  photo: Photo
  photoMobile?: { src: string, w: number, h: number }
  alt: string
  tint?: number
  position?: string
  positionMobile?: string
  parallax?: number
}>(), { tint: 0.45, position: '50% 50%', positionMobile: '', parallax: 0.07, photoMobile: undefined })
const img = useImage()
const setFor = (p: { src: string, w: number }) => {
  const ws = [640, 960, 1280, 1600, 1920, 2400].filter(w => w < p.w)
  ws.push(p.w)
  return ws.map(w => `${img(p.src, { width: w, format: 'webp', quality: 80 })} ${w}w`).join(', ')
}
const mainSet = computed(() => setFor(props.photo))
const mobileSet = computed(() => (props.photoMobile ? setFor(props.photoMobile) : ''))
const fallback = computed(() => img(props.photo.src, { width: Math.min(1600, props.photo.w), format: 'webp', quality: 80 }))
</script>

<template>
  <figure class="hband" :style="{ '--pos': position, '--pos-m': positionMobile || position, '--px': parallax, '--tint': tint, '--tint-wide': tint }">
    <div class="hband__frame">
      <div v-parallax="parallax" class="hband__px">
        <picture>
          <!-- phones: a 4:5 frame cut from the 4:3 original (rendered ≈ 1.67 × the viewport wide) -->
          <source v-if="photoMobile" media="(max-width: 767px)" :srcset="mobileSet" sizes="167vw" type="image/webp">
          <img class="hband__img" :src="fallback" :srcset="mainSet" sizes="100vw" :width="photo.w" :height="photo.h" :alt="alt" loading="lazy" decoding="async">
        </picture>
      </div>
      <div class="tint" />
      <div class="hband__over on-photo"><div class="wrap"><slot /></div></div>
    </div>
    <figcaption class="hband__cap">
      Photo: <a :href="photo.page" class="hband__a" rel="noopener" target="_blank">{{ photo.creator }}<span class="sr-only"> (opens in a new tab)</span></a>, <a :href="photo.licenseUrl" class="hband__a" rel="noopener license" target="_blank">{{ photo.license }}<span class="sr-only"> (opens in a new tab)</span></a>
    </figcaption>
  </figure>
</template>

<style scoped>
.hband { position: relative; margin: 0; }
.hband__frame { position: relative; overflow: hidden; background: var(--field-dark); aspect-ratio: 4 / 5; }
@media (min-width: 600px) { .hband__frame { aspect-ratio: 4 / 3; } }
@media (min-width: 768px) { .hband__frame { aspect-ratio: 16 / 9; } }
@media (min-width: 1100px) { .hband__frame { aspect-ratio: 21 / 9; } }
/* the parallax layer is taller than the frame by --px at both ends, so no edge ever shows */
.hband__px { position: absolute; left: 0; right: 0; top: calc(var(--px) * -100%); bottom: calc(var(--px) * -100%); transform: translate3d(0, var(--py, 0px), 0); }
.hband__px picture { display: block; height: 100%; }
.hband__img { width: 100%; height: 100%; object-fit: cover; object-position: var(--pos-m); display: block; }
@media (min-width: 768px) { .hband__img { object-position: var(--pos); } }
.hband__over { position: absolute; inset: auto 0 0 0; z-index: 1; padding-bottom: clamp(22px, 3.4vw, 56px); }
.hband__cap {
  position: absolute; top: 0; left: 0; z-index: 2; padding: 6px 12px; background: var(--field-dark); color: var(--on-field-dark);
  font-size: 0.8125rem; line-height: 1.4; --focus-ring: var(--on-field-dark);
}
.hband__a { color: inherit; text-decoration: underline 1px; text-underline-offset: 3px; text-decoration-color: color-mix(in srgb, currentColor 55%, transparent); }
.hband__a:focus-visible { outline-color: var(--on-field-dark); }
/* wide: the words own the bottom-left, the credit takes the bottom-right corner (clear of the room above) */
@media (min-width: 1100px) { .hband__cap { top: auto; bottom: 0; left: auto; right: 0; } }
@media (hover: hover) and (pointer: fine) { .hband__a:hover { text-decoration-color: currentColor; } }
</style>
