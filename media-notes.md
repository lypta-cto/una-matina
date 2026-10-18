# Media notes: Una Mattina

Written by the media pass on 2026-10-17. Paths are relative to `una-mattina/`. Every found clip and picture is openly licensed and credited (`app/public/video/credits.json`, `app/public/img/world/credits.json`). All of them show **the world around the brand**. None of them shows Una Mattina's own events, food, team or setups, so captions must never say or suggest that they do.

---

## 1. Hero video

### Pick: `palm-sunset`, for the Events Home hero

Sunset light through one palm frond. The camera is static, the frond sways slowly, and the sky is soft apricot to dusty rose. It sits close to Apricot #F4A878 and Cream without any grade. It names no place, so it never claims to be Naples. The lower-left of the frame is an even gradient sky, which leaves room for the headline.

| File | Size | Dimensions | Duration |
|---|---|---|---|
| `app/public/video/palm-sunset-1280.mp4` (H.264, faststart, CRF 27, no audio) | 1.6 MB | 1280×720 | 13.5 s loop |
| `app/public/video/palm-sunset-1280.webm` (VP9, no audio) | 1.6 MB | 1280×720 | 13.5 s |
| `app/public/video/palm-sunset-720.mp4` (mobile, CRF 28) | 0.6 MB | 720×406 | 13.5 s |
| `app/public/video/palm-sunset-poster.jpg` (first frame of the loop, q80) | 374 KB | 1600×900 | n/a |

**Credit line:** "Free video clip - Sunset through Palm Tree" by Johann Mynhardt, CC BY 2.0, via Wikimedia Commons (trimmed, looped). Source: https://commons.wikimedia.org/wiki/File:Free_video_clip_-_Sunset_through_Palm_Tree.webm
**Changes:** the whole 15 s source is used. The last 1.5 s cross-fades into the start, which makes a seamless loop of 13.5 s. Audio removed, scaled down, re-encoded. No colour change.

### Alternates (already encoded, same set of files)

| Clip | Files | Loop | Sizes (1280 mp4 / webm / 720 mp4) | Fits | Credit |
|---|---|---|---|---|---|
| `beach-drone`: slow drone glide along a palm-lined beach in full sun. It looks like the SW Florida Gulf but is **Brazil**, so never caption it as Naples. | `app/public/video/beach-drone-{1280.mp4,1280.webm,720.mp4,poster.jpg}` | 8.6 s | 2.4 / 2.6 / 0.8 MB | A bright daytime alternative, e.g. for Luxury Picnics. The colours are blue and teal, cooler than the palette. | "Beach filmed with a drone" by Nicolas de Camaret, CC BY 2.0, via Wikimedia Commons (trimmed, looped, colour-graded) |
| `izola-sunset`: calm Adriatic sea at sunset (Izola, Slovenia), steps and a handrail into the water. | `app/public/video/izola-sunset-{1280.mp4,1280.webm,720.mp4,poster.jpg}` | 12.5 s | 2.5 / 3.0 / 1.1 MB | A Mediterranean evening mood. Calm, but the sky is fairly blue. | "Sonnenuntergang Izola Isola Adria Slowenien -reisenundleben" by Reisen Und Leben Reiseblog Reisefotografie, CC BY 3.0, via Wikimedia Commons (trimmed, looped, colour-graded) |

Both alternates have a gentle warm grade (`colorbalance` +red/−blue in shadows, mids and highlights, saturation 0.95). It is noted in credits.json. Neither licence is share-alike, but the change is noted anyway.

### /crepes: no video

No honest, usable crêpe footage exists in the open collections. The only clips are 480p home and commercial-kitchen pans, with branded jars, hands and steel benches (rejected below). For /crepes use the still `img/world/crepe-griddle.jpg`, captioned as general (see §3), or the labelled booth placeholder. Do not fake motion with a Ken Burns on AI images.

### How to use it (advice for the Vue agent, nothing has been edited)

```html
<video class="hero-video" autoplay muted loop playsinline preload="metadata"
       poster="/video/palm-sunset-poster.jpg" aria-hidden="true">
  <source src="/video/palm-sunset-720.mp4"   type="video/mp4"  media="(max-width: 767px)">
  <source src="/video/palm-sunset-1280.webm" type="video/webm">
  <source src="/video/palm-sunset-1280.mp4"  type="video/mp4">
</video>
```

- `object-fit: cover`, with `object-position: 30% 60%`, keeps the sun and frond top-right and the text area clear. On narrow portrait screens, crop toward the sun (`object-position: 75% 50%`).
- **Reduced motion:** under `prefers-reduced-motion: reduce`, do not autoplay. Render only the poster (or set `autoplay` false and call `pause()`). The loop runs longer than 5 s, so WCAG 2.2.2 also wants a visible pause/play toggle. A small text button such as "Pause" fits the house rules.
- **Data saving:** if `navigator.connection.saveData` is set, or `effectiveType` is `2g`/`slow-2g`, show the poster only.
- **Fallback if video is dropped:** the poster `palm-sunset-poster.jpg`, or a slow (20–30 s) scale 1.0→1.06 Ken Burns on `img/world/naples-pier-sunset.jpg`. That photo really is Naples, FL.
- **Text over the video:** the sky behind the copy is a mid-tone rose. Cream text needs a flat Brown #5B3A2E overlay at about 25–35 % opacity on the left half. A gradient would break the "no gradients" rule, so use a solid tinted block or full overlay.
- **Caption/credit:** place a small line in the hero corner or the footer credits: *Video: Johann Mynhardt, CC BY 2.0 (trimmed).* Never caption it "our sunset picnic" or similar.

---

## 2. Imagery audit (existing files)

Display sizes: hero ≈1440 px wide, half ≈720 px, small ≈320 px. "Max" is the largest CSS width that stays sharp on a 2× screen, with the 1× limit in brackets.

### `img/placeholder/` (AI mockups, must always carry the "Concept image · placeholder" chip)

| File | Shows | px | Max display | Suggested use / crop |
|---|---|---|---|---|
| `booth.webp` | Cream canopy market stand "CRÊPES · UNA MATTINA", apricot/yellow table skirts, palms behind | 1374×1145 | ~690 (1× 1370) | The only placeholder good enough for **half-width** (e.g. /crepes intro). It is not a 1440 hero. Crop 4:3 or 1:1 centred on the canopy. |
| `crepe-cone.webp` | Branded paper cone with strawberry and chocolate crêpe, hand | 278×470 | **small only**, ≤240 (1× 278) | 9:16 / 3:5 portrait tile. Do not present it as a menu item. |
| `coffee-cup.webp` | Hand holding a branded cream cup, blurred citrus behind | 272×470 | **small only**, ≤240 | Portrait tile. |
| `apron.webp` | Apricot cabana-stripe apron on a person (head cropped, torso only) | 350×515 | **small only**, ≤320 | 2:3 portrait. Shows a body, so it must not read as "our team". |
| `tote.webp` | Yellow-stripe tote bag, lemons behind | 280×282 | **small only**, ≤240 | 1:1. |
| `napkins-apricot.webp` | Stack of apricot-stripe napkins with logo | 272×282 | **small only**, ≤200 | 1:1. **Garbled AI text** in the tagline ("TASTERRAANEAN"). Show it tiny or crop to the stripes only. |
| `napkins-yellow.webp` | Same in yellow | 243×282 | **small only**, ≤200 | Same garbled tagline. Same rule. |
| `caps.webp` | Cream and sage caps with the A-sun sign | 228×282 | **small only**, ≤180 | Merch strip thumbnail only. |

Except for `booth.webp`, all placeholder crops come from AI boards and are 230–350 px wide. Use them only in small merch or brand strips, never above about 320 px.

### `img/world/` (found photographs; caption with creator and licence)

| File | Shows | px | Max display | Suggested use / crop |
|---|---|---|---|---|
| `naples-pier-sunset.jpg` | Naples Pier from 8th Ave Beach at dusk, pastel sky, sea-grape dune in front | 1600×1200 | 800 sharp (1× 1600). Usable as a 1440 hero at 1×, slightly soft on 2×. | Best **real-Naples** wide image. 16:9 or 21:9 crop at `object-position: 50% 45%` keeps pier and horizon and drops most of the foliage. Fallback hero. |
| `clam-pass-sunset.jpg` | Golden sunset over the Gulf at Clam Pass, Naples. Boardwalk, kayak and paddleboard in front, tiny silhouettes | 1600×1200 | 800 (1× 1600) | Luxury Picnics / Home band. A 21:9 crop of the top 60 % (sun and sea) loses the boardwalk sign. |
| `positano-umbrellas.jpg` | Aerial of rows of blue and white umbrellas, Positano | 1600×1067 | 800 (1× 1600) | About ("Mediterranean mornings"). Blue is off-palette, so use it at half-width. People are tiny, not protagonists. |

---

## 3. New found images (added to `img/world/`, all ≤1600 px, credits in credits.json)

| File | px | Shows | Page / section | Credit line |
|---|---|---|---|---|
| `vanderbilt-beach.jpg` | 1600×989 | Calm turquoise Gulf at Vanderbilt Beach, Naples, one tall summer cloud | **Luxury Picnics** hero/band (21:9 crop works). Real Naples. | "Vanderbilt Beach, Naples, Florida" by Charles Patrick Ewing, CC BY 2.0, via Wikimedia Commons |
| `flower-market-buckets.jpg` | 1600×1066 | Flower-market stall: tulips, hyacinths, mixed stems in black buckets | **Bloom Cart** ("pick your stems"). Caption it as a flower market, not our cart. A paper wrap shows the word "Gulik", so crop it out (crop right 60 %) or keep it small. | "Flower market buckets (Unsplash)" by Alisa Anton, CC0, via Wikimedia Commons |
| `crepe-griddle.jpg` | 1600×1200 | A thin crêpe on a round cast-iron crêpe griddle | **Live Stations → Crêpe station**, and **/crepes**. 1:1 crop on the griddle. Caption e.g. "A crêpe on a classic griddle". This is someone else's griddle (Simply Crêpes, NY), never "ours". | "SimplyCrepesPittsfordMapleCrepesGriddle" by DanielPenfield, CC BY-SA 4.0, via Wikimedia Commons (resized). Share-alike: altered versions stay CC BY-SA. |
| `cannoli-tray.jpg` | 1600×1280 | Tray of Sicilian cannoli with ricotta, pistachio and candied cherry | **Live Stations → Cannoli bar**, small or half-width. Caption as general Sicilian cannoli. The red is loud, so keep it small. | "Cannoli siciliani" by Stefano Mortellaro from Catania, Italy, CC BY 2.0, via Wikimedia Commons |
| `amalfi-lemons.jpg` | 1600×1066 | Amalfi lemons with leaves hung on a white wall above dried red chillies | **About** (Mediterranean mornings) or a citrus accent on /crepes. Crop the top 60 % for an all lemon-and-leaf frame with no price tag. | "Amalfi - limoni e peperoncini - 'lemons and red dried peppers'" by Yvon from Netherlands, CC BY 2.0, via Wikimedia Commons |
| `montepaone-beach.jpg` | 1600×1066 | Calabrian beach, closed blue-white striped umbrella, red rowing boat, calm sea | **About**: Italian beach-club stripe mood. It is an older compact-camera shot (2007), slightly soft, so use half-width at most. | "Spiaggia di Montepaone" by Mario, CC BY 2.0, via Wikimedia Commons |

The tool also added `changes` and accurate `width`/`height` to all entries in `img/world/credits.json`.

---

## 4. Rejected, and why

**Video**
- No Naples / SW Florida footage worth using exists on Wikimedia Commons, Internet Archive or NASA. Searches covered Naples, Vanderbilt, Marco Island, Sanibel, Bonita, Fort Myers, Sarasota and Gulf. Results were news, police and hurricane satellite loops. The only SW-FL clip, *Eudocimus albus – Bonita Beach* (ibises), is 640×480 and too small.
- *Amalfi-coast.webm*: labelled public domain, but generated by **Sora/OpenAI**. It is not real footage, so it is dishonest for this site.
- *The Sun Rises Over Palm Trees* (Joaquim Baeta, CC BY 4.0): on-theme ("morning"), but deep saturated orange, heavy silhouettes, a tropical Asian setting, and a 911 MB source. It is a possible future alternate if a "sunrise" story is wanted.
- *Sunset 2011 (HD)*, Santa Barbara: over-saturated HDR look, jump cuts, people.
- *Sunset in Pantai Kukup* (Java): mostly black silhouettes, too dark under text.
- *Positano J03-25/2D/26*: hyperlapse with a ship's mast in frame, letterboxed zooms.
- *Waves at Apollo Beach, FL*: overcast and grey. *USVI palms*: overcast resort.
- Crêpe clips (*Crepes.webmhd*, *Serbian Palacinke*): 480p 4:3, home or commercial kitchen pans, brand jars, hands. Not appetising or on-brand.
- *Morning in Naples*: Naples, **Italy**, overcast. It would confuse the Naples, FL story.

**Images**
- *Beach Picnic (Unsplash)*: a towel with watermelon looks like a styled picnic setup, so it could read as our product. The multicolour stripes are also off-palette.
- *Fresh cut flowers* chalkboard (Unsplash): dark wood and chalkboard, boho-rustic (anti-reference).
- *Create-a-Bouquet* station: people's faces are the protagonists, and it reads like someone else's Bloom Cart.
- *Thin crêpe on a dome griddle* (WP photo directory) and *Making of Crêpes 02*: a busy floor, a Nutella jar and foil.
- *Naples Florida Beach 1973*: archival look, not the brand's mood.
