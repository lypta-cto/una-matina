# Imagery review: Una Mattina

Imagery pass, 2026-10-17. All nine pages were shot (`screens/img-*`). Every `<img>` was measured at 1440×900 and 390×844, both at 2× DPR (rendered CSS size, source pixels, bytes actually transferred). Each figure was also captured in context.

**How to read the numbers:** "src/CSS" is the number of source pixels per CSS pixel. G12 wants at least 1.5. KB is what the browser actually downloaded on a 2× screen.

---

## 0. The system problem: every found photo downloads at 1600 px

`FoundPhoto.vue` (and `ConceptImage.vue`) render `<NuxtImg :width="photo.w" densities="x1 x2">` with no `sizes` and no `format`.

- The srcset is always `s_1600… 1x, s_3200… 2x`. A 2× phone downloads the full 1600 px JPEG even for a 320 px tile.
- IPX does not enlarge, so the "2x" file is still the 1600 px one.
- `image.format: ['avif','webp']` in nuxt.config only affects `<NuxtPicture>`. NuxtImg serves re-encoded **JPEG**.

The result is 200–400 KB per found photo.

The asset side is fixed by the pre-cropped files below: they cap each request at what the frame needs. The builder should still make code fix C0.

---

## 1. Files created or replaced

All new world crops use the same gentle warm grade, "UM warm v1": R ×1.03 +3, G +2, B ×0.93 +4, saturation 0.94. They are mozjpeg q80 and documented in `app/public/img/world/credits.json`, with crop box, grade and a `derivedFrom` field. Originals are untouched.

| New file (`app/public/img/world/`) | px | KB | From | Why |
|---|---|---|---|---|
| `crepe-griddle-4x5.jpg` | 880×1100 | 89 | crepe-griddle.jpg, x700–1580 | The current `-1000` file gives only 600×750 px in a 4:5 frame, so it is soft at 520–560 CSS. The new crop is tighter on the crêpe edge and rim, with fewer batter drips and no signage. |
| `flower-market-buckets-4x5.jpg` | 848×1060 | 141 | right 53 % | Removes the **"Gulik"** and "Venhuijzen" grower names, which Home currently shows. 289 KB becomes 141 KB. |
| `cannoli-tray-4x5.jpg` | 880×1100 | 189 | centre 4:5, resized | Was 398 KB. Drops the stray pastries at the left. |
| `vanderbilt-beach-3x2.jpg` | 1200×800 | 91 | 3:2 centre, resized | Was 204 KB. Still 1.9× at 640 CSS. |
| `naples-pier-sunset-21x9.jpg` | 2400×1029 | 218 | y552–2198 of the 3840 px Commons file | More sky and less sea-grape. Rebuilt from hi-res (§3). Was 303 KB at 1.1×. |
| `amalfi-lemons-21x9.jpg` | 2400×1029 | 239 | top 60 % of the 2592 px original | Lemons and leaves only. **No price card and no chillies.** On mobile 16:9 the old crop showed both. Rebuilt from hi-res (§3). |
| `clam-pass-sunset-4x5.jpg` | 960×1200 | 113 | sky-and-sea window of the 3840 px file | The window the `width:300%` CSS hack shows: sun, sea and beach, no boardwalk, no beach sign. Now 2× at 480 CSS (§3). Was 334 KB at 1.1×. |

Other files:

| File | Change |
|---|---|
| `app/public/img/placeholder/booth.webp` | **Replaced.** Retouched the **Square logo** off the POS terminal: a 20 px patch cloned from the terminal face. Nothing else changed, the label stays in the component, webp q82, 193 KB. The original was a crop of `assets/brand/farmers-market-booth-mockup.png`, which is unchanged. |
| `app/public/og.png` | **Replaced.** The old card was a raw 1200×630 screenshot: the nav was cut at the right edge, the headline was clipped at the bottom, and it weighed 818 KB. The new card shows the yellow fascia with the wordmark, the apricot awning, the palm-sunset poster frame and the cream board "YOUR PARTY, ONE TEAM / Events & catering in Naples and Southwest Florida." It is a 256-colour PNG at **185 KB**. |
| `app/public/og.jpg` | New. The same card as JPEG, **87 KB** (optional switch, see C9). |
| `video/credits.json` | Lists the poster variants (`-1600.webp`, `-800x1000.webp`) and records that og.png/og.jpg use the poster frame. |
| `img/world/credits.json` | 7 derived entries, plus a back-filled entry for `crepe-griddle-1000.jpg`, which was on the site with no credits record. |

No video was re-encoded. The posters are within budget: 88 KB desktop and 54 KB mobile webp. The 1280 webm is 1.5 MB and the 720 mp4 is 0.57 MB.

---

## 2. Verdicts, page by page

### Home `/`

| Picture | CSS (desktop / mobile) | Verdict |
|---|---|---|
| Hero poster/video, palm-sunset | 1440×600 / 390×388 | ✅ Sun and frond are top-right and the board sits on even sky. The mobile poster (800×1000) at `75% 50%` keeps the sun in frame. The credit line says "Not a Una Mattina event." |
| Crêpe griddle (stations) | 520×650 / 403×504 | ❌ G12: 1.15× soft. Fixed by `crepe-griddle-4x5.jpg` (1.7×). |
| Vanderbilt (picnic half) | 640×427 / 358×239 | ✅ Sharp. ⚠ The alt text says "a row of beachfront buildings", but there are none in frame (C6). Teal is off-palette; the warm grade helps a little. It is fine at half width. |
| Flowers (bloom half) | 420×525 | ❌ **"Gulik" brand on the paper wrap is visible** (`50% 50%`). Fixed by `flower-market-buckets-4x5.jpg`. |
| Naples Pier band, 21:9 full bleed | 1440×617 / 390×167 | ❌ G12: 1600 px source at 1440 CSS is 1.1×, soft on 2×. ✅ Fixed by the hi-res 2400×1029 file (1.67×, §3). On mobile the pier is a thin line at 167 px tall: use 16:9 (C4). |
| Booth placeholder (origin) | 543×407 | ✅ 2.5×, label present. The Square logo is now removed. |

### Services

| Picture | CSS | Verdict |
|---|---|---|
| Cannoli tray | 430×538 / 320×400 | ✅ Sharp. ❌ Weight was 398 KB; use `cannoli-tray-4x5.jpg` (189 KB). The red is loud but works at this size. Caption says "Not our station." |

### Live Stations

| Picture | CSS | Verdict |
|---|---|---|
| Sticky frame: crêpe | 440×550 | ❌ 1.36× soft. Fixed by the griddle 4:5 file (2×). |
| Sticky frame: cannoli | 440×550 | ✅ With the new file it is 2× and 189 KB. |
| Other stations: ShootSlot apricot | — | ✅ Honest empty frames. |

### Luxury Picnics

| Picture | CSS | Verdict |
|---|---|---|
| Clam Pass 4:5 hero | 480×600 (the img itself renders 1440×1080 inside it) | ❌ The window comes from a CSS hack (`width:300%; margin-left:-86.3%`) on a 3200-px request. It shows about 533 source px across 480 CSS, which is **1.1×, visibly soft**, and costs 334 KB. Use `clam-pass-sunset-4x5.jpg` and delete the hack (C3). ✅ Rebuilt from the 3840 px original as 960×1200 (2×, 113 KB, §3). |
| "Sunset beach picnic" ShootSlot | — | ✅ |

### Bloom Cart

| Picture | CSS | Verdict |
|---|---|---|
| Flowers hero 4:5 | 520×650 | ✅ The crop is right (`100% 50%` hides Gulik) and it is 1.6×. ❌ 289 KB. Switch to the pre-cropped file and drop the object-position (C5). Caption says "not our cart, and not a Una Mattina event." |
| ShootSlot "Bloom Cart at a shower" | — | ✅ |

### How We Work · Inquire
There are no images. ✅

### About

| Picture | CSS | Verdict |
|---|---|---|
| Apron placeholder | 320×471 / 240×353 | ⚠ At the G12 cap (≤320). The 350 px source is 1.09×, slightly soft on 2×. Allowed. Capping at 240 would make it fully sharp. |
| Amalfi lemons 21:9 full bleed | 1440×617 / 390×219 (16:9) | ❌ G12: 1.1× on desktop. ❌ The **mobile 16:9 shows the price card and a strip of chillies.** Fixed by `amalfi-lemons-21x9.jpg` plus a mobile object-position (C7). ✅ Desktop is now 1.67× from the hi-res file (§3). |
| Founders' ShootSlot | — | ✅ |

### Crêpes

| Picture | CSS | Verdict |
|---|---|---|
| Booth hero (drift) | 558×651 / 358×269 | ✅ 1.76×, label present. |
| Crêpe griddle (card section) | 560×700 | ❌ 1.07×, the softest photo on the site. Fixed by the griddle 4:5 file (1.57×). |
| Morning strip: booth, crêpe-cone, napkins-yellow, apron, tote | **340** px wide (desktop) | ❌ G12: cone 278 px, tote 280 px and napkins 243 px are all shown at 340 CSS, which is 0.7–0.8×. They are blurry, and **napkins-yellow shows garbled AI text ("A TASTEMERRANEAN")** at a readable size. Fix in C8. |
| Visit photo: napkins-apricot | **460×575** | ❌❌ The worst image on the site: a 272 px source at 460 CSS (0.6×), with the **garbled tagline "A TASTERRA&NEAI & MORNINGS" big and blurry**. Replace it (C8). |

### Social / OG
❌ The old og.png was a clipped screenshot at 818 KB. ✅ It is now replaced: a composed 1200×630 card at 185 KB.

### Cross-page consistency
- The ratios are now consistent: found photos at 4:5 for portraits, 3:2 for the one landscape half, and 21:9 for full-bleed bands.
- All found photos carry the same grade.
- Every found photo carries a "not ours" caption and a creator/licence credit.
- CC BY and BY-SA require changes to be indicated. The derived files are cropped and graded, so the credit line should say so (C1).

---

## 3. Hi-res rebuild (done after Luka approved the downloads)

Luka approved the downloads, relayed by the coordinator. The larger Commons files were fetched with `assets.mjs --get`. Each crop was then rebuilt with the same framing and the same "UM warm v1" grade, and **the file names are unchanged**.

| File | Source fetched | New px | KB | src/CSS at display |
|---|---|---|---|---|
| `naples-pier-sunset-21x9.jpg` | commons:107547081, 3840×2880 | **2400×1029** | 218 (q78) | 1.67× at 1440 |
| `amalfi-lemons-21x9.jpg` | commons:9524162, 2592×1728 (the full original; a little soft at 100 %) | **2400×1029** | 239 (q69) | 1.67× at 1440 |
| `clam-pass-sunset-4x5.jpg` | commons:107591103, 3840×2880 | **960×1200** | 113 (q80) | 2.0× at 480 |

- **Crop boxes:**
  - Pier: x0–3840, y552–2198.
  - Lemons: x0–2419, y0–1037.
  - Clam Pass: x1092–2398, y0–1632. The right edge stays left of the beach sign.
- **Downloaded originals:** they are kept out of `public/` (scratchpad only, about 5.6 MB). Their auto-added credits rows were removed. The derived rows in `credits.json` now carry `image`, `sourceWidth`/`sourceHeight`, the new `width`/`height`/`bytes` and the full `changes` text.
- **All other found photos are now ≥ 1.5× at their display size:** griddle 1.57×, flowers 1.63×, cannoli 2×, Vanderbilt 1.9×. Nothing else needed fetching.
- **The max-width caps suggested earlier are no longer needed.**
- ⚠ **IPX re-encodes these files as JPEG q80, which inflates them:** lemons 289 KB, pier 252 KB. With `format="webp"` from C0 they are 246 / 169 KB. C0 is therefore needed to keep the bands ≤ 250 KB.

---

## 4. Exact code edits for the builder

**C0. `components/FoundPhoto.vue`:** add `sizes` and webp.

```vue
const props = withDefaults(defineProps<{ photo: Found, alt: string, caption: string, ratio?: string, sizes?: string }>(), { ratio: '', sizes: '(min-width: 900px) 520px, 92vw' })
<NuxtImg :src="props.photo.src" :alt="props.alt" :width="props.photo.w" :height="props.photo.h"
  :sizes="props.sizes" format="webp" loading="lazy" class="found__img" />   <!-- drop densities -->
```

Per use, pass `sizes`:
- pier and lemons: `"100vw"`
- Vanderbilt: `"(min-width: 900px) 640px, 92vw"`
- Home flowers: `"(min-width: 900px) 420px, 92vw"`
- services cannoli: `"(min-width: 600px) 430px, 320px"`
- live-stations frames: `"440px"`
- picnic: `"480px"`

Do the same in `ConceptImage.vue`: keep `sizes`, drop `densities`, add `format="webp"`.

**C1. `data/credits.ts`:** point at the new files and add a `changes` note.

```ts
pier:       f('/img/world/naples-pier-sunset-21x9.jpg',   2400, 1029, …)
clamPass:   f('/img/world/clam-pass-sunset-4x5.jpg',        960, 1200, …)
vanderbilt: f('/img/world/vanderbilt-beach-3x2.jpg',       1200,  800, …)
flowers:    f('/img/world/flower-market-buckets-4x5.jpg',   848, 1060, …)
griddle:    f('/img/world/crepe-griddle-4x5.jpg',           880, 1100, …)
cannoli:    f('/img/world/cannoli-tray-4x5.jpg',            880, 1100, …)
lemons:     f('/img/world/amalfi-lemons-21x9.jpg',         2400, 1029, …)
heroVideo.poster = '/video/palm-sunset-poster-1600.webp'   // .jpg (374 KB) is no longer used
```

Add `changes: 'cropped, colour-graded'` to `Found` (it can apply to all world entries). In `FoundPhoto.vue`, render it after the licence: `…, CC BY-SA 4.0 (cropped, colour-graded)`.

**C2. Home (`pages/index.vue`):** no ratio changes are needed. The new files match 4:5 and 3:2.

**C3. `pages/luxury-picnics.vue`:** delete line 59. No max-width cap needed: the file is 960×1200.

```css
.pic__photo :deep(.found__img) { width: 300%; max-width: none; height: auto; margin-left: -86.3%; }
```

**C4. `pages/index.vue`, mobile pier:** add

```css
@media (max-width: 767px) { .where__photo :deep(.found__frame) { aspect-ratio: 16 / 9 !important; } .where__photo :deep(.found__img) { object-position: 0% 50%; } }
```

**C5. `pages/bloom-cart.vue`:** delete line 60, `.bc-hero__photo :deep(.found__img) { object-position: 100% 50%; }`, because the file is now pre-cropped.

**C6. `pages/index.vue:60`:** change the Vanderbilt alt to `"Vanderbilt Beach in Naples: calm turquoise Gulf water and one tall summer cloud"`.

**C7. `pages/about.vue`:** keep `.med__photo … object-position: 50% 0%`. Add mobile `@media (max-width: 767px) { .med__photo :deep(.found__img) { object-position: 0% 0%; } }` so the 16:9 window keeps all the lemons.

**C8. `pages/crepes.vue`:**
- **Morning strip:** change `.morning__item` width to `clamp(200px, 22vw, 240px)` (G12). Remove the `9:30 Sweet or savory?` item (napkins-yellow, garbled text). If a fifth beat is wanted, reuse `booth.webp` at 5:4. The other tiles then sit at 0.9–1.2×, the best these 230–350 px AI crops allow.
- **Visit photo:** replace the napkins `ConceptImage` with an honest empty frame. There is no on-brand found photo of a market stand.

  ```vue
  <ShootSlot v-reveal="120" class="visit__photo" tone="yellow" subject="the stand at the market" ratio="4 / 5" />
  ```

  It sits on a sage field, so the `yellow` tone reads. Alternative: `tone="apricot"`.

**C9. `site.config.ts`, optional:** `ogImage: '/og.jpg'` (87 KB instead of the 185 KB PNG). Either works. Keep `og.png` if unsure about crawler caching.

---

## 5. Weight after the edits (desktop, 2×)

| Page | Image bytes before | After C0/C1 |
|---|---|---|
| Home (excl. video) | 1 156 KB | ≈ 740 KB |
| Services | 398 KB | ≈ 190 KB |
| Live Stations | 489 KB | ≈ 280 KB |
| Luxury Picnics | 334 KB | ≈ 50 KB |
| Bloom Cart | 289 KB | ≈ 140 KB |
| About | 362 KB | ≈ 180 KB |
| Crêpes | 340 KB | ≈ 330 KB (napkins tile dropped) |

Every image is now ≤ 250 KB. The largest is cannoli at 189 KB, and webp via C0 cuts a further ~25–30 %. The posters are ≤ 120 KB.
