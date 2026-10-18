# Events v2: second final review (Bloom Cart, How We Work, About, Inquire vs /crepes)

Fresh reviewer, 2026-10-18. Code was only read, not changed.

**Setup**
- Dev server: `localhost:3001`.
- Playwright: `builder/node_modules/playwright`, Chromium headless.
- Desktop scrolls use `page.mouse.wheel`, so Lenis is engaged. Phones use CDP touch `synthesizeScrollGesture` with `isMobile` and `hasTouch` set.
- Widths: 320×568, 360×640, 390×844, 768×1024, 1024×768, 1280×800, 1440×900, 1920×1080.
- Every POST to `/api/inquiry` was intercepted, so nothing was sent.

**Evidence** is in `review/v2-review-2/` (all paths below are relative to it):
- `widths/`: `<page>-<w>x<h>-fold.png`, `-scroll.jpg` (wheel scroll, one frame per 0.85 viewport), `folds-phones.png`, `folds-tablet.png`, `folds-1920.png`, `metrics-*.json`.
- `motion/<page>-d1440|m390/`: `load-sheet.jpg` (0–3 s), `scroll-sheet.jpg` plus raw frames, `log.json` (CLS, LCP, frame times, console).
- `motion/*-seq.jpg`: fine films through the pinned sections.
- `checks/`: reduced motion and JS-off strips at 390 and 1440, keyboard shots, `*-checks.json` (tab order, heading lines), lemons contrast, anchors, image zooms.
- `form/`: the /inquire states and `form-log.json`.

**Gap in my reading.** `events-v2-system.md` was read through §0 only; the permission layer blocked the rest of the output. I took the per-page briefs from the "Events v2" sections of `build-log.md` and from the header comments in each page, which restate them. Of `DESIGN.md` I used only the brand facts that the system file's opening repeats (palette, typefaces, the banned list).

## The bar: what /crepes does that these pages must match

I loaded /crepes at every width, plus load and scroll films (`motion/crepes-d1440/`, `crepes-m390/`, `widths/crepes-*`).
- **The picture leads.** The first screen is a full-bleed photo with the word over it, and a brown board flush to the corner.
- **Every screen of scroll changes the picture or the field.** There are 5 sections, each its own field.
- **One authored move per section.** Each is a different verb: letter rise, accent drop, odometer, pinned camera with 5 different photos, sign flip, week board, wordmark rise.
- **Copy is short and concrete, in US English** ("savory").

**Measured on all four Events pages (all clean):**
- No horizontal overflow at any of the 8 widths.
- No console errors or warnings in 40 page loads.
- No visible placeholder words.
- Reduced motion and JS off: every heading and paragraph is visible, with 0 hidden text elements (`checks/*-reduced-*`, `*-nojs-*`).
- Scroll: p50 and p95 16.7 ms, 0 frames over 34 ms (wheel at 1440, touch at 390).

CLS and LCP (dev server, local, so not production numbers):

| Page | CLS | LCP |
|---|---|---|
| Bloom Cart | 0 | 88 / 148 ms |
| How We Work | 0 | 64 / 68 ms |
| About | 0.0014 (desktop RiseText, at 54 ms) | 72 / 84 ms |
| Inquire | 0 | 48 / 72 ms |

**There are no P0s.** What separates these pages from /crepes is craft, imagery and pacing, not breakage.

---

## Bloom Cart: **fix**, 6.5 / 10 vs /crepes

The page with the most /crepes DNA: a pinned camera, a sage field and a brown board. But it shows the same photo twice, and the camera's second stop frames an empty bucket.

### P1-B1. The same photograph twice, on one screen
**Problem.** The hero's 4:5 picture (`flower-market-buckets-4x5.jpg`) is a crop of the same stall the sequence opens on (`flower-market-buckets.jpg`, stop 1 = the whole stall). Both are on screen together at 1440 (`motion/bloom-cart-d1440-seq.jpg`, frames 1–2) and at 390 (`motion/bloom-cart-m390-seq.jpg`, frames 1–3).

**Fix (crepes level).** Make the hero the /crepes hero and let the sequence start close.
- `pages/bloom-cart.vue`:
  ```vue
  definePageMeta({ awning: 'apricot', field: 'sage', hero: 'photo' })
  const stall = { src: '/img/world/flower-market-buckets.jpg', w: 1600, h: 1066, creator: credits.flowers.creator, license: credits.flowers.license, licenseUrl: credits.flowers.licenseUrl, page: credits.flowers.page }
  const stallM = { ...stall, src: credits.flowers.src, w: 848, h: 1060 }
  <PageHero id="bc-title" layout="photo" curtain :photo="stall" :photo-mobile="stallM" position="50% 70%" :tint="0.6" :tint-wide="0.55"
    alt="Buckets of tulips wrapped in paper, hellebores and hyacinths at a flower-market stall" title="Pick a stem, take it home" :lines="['Pick a stem,', 'take it home']" lead="…">
    <template #actions> <NuxtLink :to="inquiry" class="pill pill--sun">Ask about it →</NuxtLink> <a href="#bouquet-title" class="pill pill--ghost">How it works ↓</a> </template>
    <template #board> <Board tone="brown" valance="sage" drop flush="right"> (the "Custom details" rows) </Board> </template>
    <template #sheet><BcSequence /></template>
  </PageHero>
  ```
- `components/BcSequence.vue`: drop the whole-stall stop and start on the tulips, so there are 2 camera stops plus the end line:
  - `steps = [tulips, hyacinths]`
  - `RUN_STEPS = 70`
- Re-measure title contrast on pixels: the white wraps are bright, so it may need tint 0.62 or more.
- The "Ideal for" board then loses its "Custom details" (moved to the hero board) and becomes a full-width list.

**Cheap alternative.** Keep the heavy hero, but replace the side photo with the brown "Custom details" board. The picture still arrives one screen later in the sequence.

### P1-B2. Stop 2 frames an empty black bucket and a vendor's brand, captioned as our cart
**Problem.** In `BcSequence.vue`, `crop: [466, 337, 449, 561]` puts the empty bucket in the lower half of the frame. The "Gulik" logo on the wrap is centred, under "The cart is set: Wrap, ribbon and mini vases, with signage for your event." It is also visibly soft at 1.9× zoom.
- See `motion/bloom-cart-d1440/scroll-005-y1285.jpg` and `checks/bloom-seq-crops.png` (red box).
- It also bends the house rule in `credits.ts`: found photos are "never presented as Una Mattina's own events". Three found market crops are captioned as our three process steps.

**Fix.**
- Crop: `[430, 180, 449, 561]`. That gives tulip heads, wraps and the daisies, with the bucket rim only at the bottom edge.
- Step copy describes what is in the frame. The process stays in the sentence. Copy for Luka:
  - Stop 1: "Stems in season" / "We match the flowers to your palette and the time of year."
  - Stop 2: "Wrapped by the bunch" / "Paper, ribbon and mini vases on the cart; signage with your event's name."
  - End: "Guests pick, tie and take one home."
- When Luka's own cart pictures arrive, they replace these stops.

### P2-B3. Empty sage band between title and lead (≥ 1280: 180–260 px)
**Problem.** See `widths/bloom-cart-1440x900-fold.png` and `folds-1920.png`. Moot if B1 is done as proposed.

**Fix (`bloom-cart.vue`, ≥ 900 rule).**
- `grid-template-rows: auto auto auto 1fr`
- `.bc :deep(.phx--heavy .phx__lead) { align-self: start; }`

### P2-B4. Tablet 600–899 leaves a dead right column
**Problem.** The photo is held to 60 % and left-aligned (`widths/folds-tablet.png`).

**Fix.** At that width, put the photo beside the lead:
```css
@media (min-width: 600px) and (max-width: 899px) {
  .bc :deep(.phx--heavy.phx--side .phx__body) { grid-template-columns: 1fr 1fr; grid-template-areas: "title title" "lead side" "actions side"; }
  .bc__photo { max-width: none; }
}
```

### P2-B5. "Ideal for" reads as a block of capitals
**Problem.** "Bridal showers" and "Wedding showers" overlap, and 7 lines at a 0.12 em gap read as one block (`motion/bloom-cart-m390/scroll-sheet.jpg` frame 5).

**Fix.**
- Drop "Wedding showers" from `ideal`.
- `.ideal__list { gap: 0.22em; }`

### P2-B6. British spellings on a US site
"favour" (`BcSequence.vue` `ending`) and "Personalised signage" (`bloom-cart.vue` `custom`) → "favor" and "Personalized". See X2.

### Bloom Cart: 3 biggest wins to /crepes level
1. A photo-led hero with the curtain into the sequence (B1). That is the /crepes first screen, and it removes the repeated picture.
2. Fix crop 2 and the captions (B2), so every camera stop is crisp and honest.
3. The "Ideal for" band trimmed and opened up (B5), so the page ends on one clear idea before the close.

---

## How We Work: **fix**, 5.5 / 10 vs /crepes

The stacked boards are a real idea, and the hero is strong. But two boards vanish into the page, the stack ends in a yellow-on-yellow blob, and nine half-empty boards make the longest scroll on the site for nine one-line sentences.

### P1-H1. Cream boards on the cream ground are invisible
**Problem.** Steps 3 and 6 are `tone: 'cream'` on `--ground`. "Planning & design" reads as loose page text with 60 % empty space below it (`motion/how-we-work-m390/scroll-005-y3608.jpg`; also `motion/how-we-work-d1440-seq.jpg` frames 7 and 15).

**Fix (`components/HwSteps.vue`).**
```ts
const tones = ['yellow', 'deep', 'apricot', 'yellow', 'deep', 'apricot', 'yellow', 'deep', 'apricot'] as const
```
```css
.hw-step--apricot { background: var(--accent); color: var(--ink-deep); }
.hw-step--apricot .hw-step__n { color: var(--field); }
```

### P1-H2. The last board runs into the yellow band
**Problem.** Board 9 (yellow) leaves the stack straight into `.hw-rule.field-yellow`. On release they read as one L-shaped yellow mass with a floating "9" (`motion/how-we-work-d1440/scroll-022-y5705.jpg`; `motion/how-we-work-m390-seq.jpg` frames 25–26).

**Fix.** H1 makes board 9 apricot, which solves it. Alternatively, set the band to `field-apricot` in `how-we-work.vue`.

### P1-H3. Pacing: nine near-empty screens, numbers hidden
**Problem.**
- Each board is `--bh` ≈ 560 px with its text in the top third.
- The big number sits at `bottom: -0.06em`, under the next board, so you mostly see half-glyphs of "3", "5", "7" (`motion/how-we-work-d1440-seq.jpg` frames 5, 7, 11, 13).
- The stack costs about 4,500 px of scroll on desktop and about 5,300 px on phones for nine 6–12-word sentences.
- /crepes gives each of its 5 steps a new photograph.

**Fix (`HwSteps.vue`).**
```css
.hw { --bh: clamp(260px, 44svh, 420px); }
.hw-step__t { margin-top: clamp(16px, 3svh, 40px); }
.hw-step__n { top: clamp(14px, 2vw, 28px); bottom: auto; font-size: clamp(4.5rem, 2.5rem + 6 * var(--vw), 9rem); }
```
The number then stays readable while its board is current, and the run is about 40 % shorter.

### P1-H4. Desktop: the left column is nearly empty for the whole stack
**Problem.** Once "FROM INQUIRY TO FOLLOW-UP" scrolls away, a 4/12 column holds a 24 px phase list and a 15 px counter (`motion/how-we-work-d1440/scroll-016-y4145.jpg`). Bloom's index and /crepes' index use heavy fitted caps. Under reduced motion or no JS the column is completely empty for about 4,000 px (`checks/how-we-work-reduced-1440.jpg`).

**Fix (`HwSteps.vue`).**
```css
.hw__meter { container-type: inline-size; }
.hw__ph { font: 700 min(var(--display-m), calc(100cqi / (21 * var(--cap-w)))) / 1 var(--font-display); text-transform: uppercase; letter-spacing: var(--track-m); }
@media (min-width: 1024px) { .hw:not(.is-pinned) .hw__side { position: sticky; top: var(--top); align-self: start; } }
```
Sticky is not motion, so it is fine under reduced motion.

### P2-H5. The phase is printed twice on phones
**Problem.** The bar says "While we plan" and the board under it says it again (`scroll-005-y3608.jpg`).

**Fix.** `@media (max-width: 1023px) { .is-pinned .hw-step__phase { display: none; } }`

### P2-H6. Phones: a 56 px dead strip above the sticky bar when the header hides
**Problem.** See the same frame. `SiteHeader` adds `.is-hidden`.

**Fix.**
- Unscoped CSS: `html:has(.head.is-hidden) .hw__bar { top: 0; transition: top 300ms var(--ease-out); }`
- Make `.hw { --top }` follow the same rule, so the boards rise with it.

### P2-H7. Not one picture on the page
**Fix.** Give the "Event day" board the one honest moment of the day. The credited griddle photo (`credits.griddle`) goes as a 4:5 inset in the board's empty right half from 900 px up, with the credit under it.

### How We Work: 3 biggest wins to /crepes level
1. Shorter, fuller boards with visible numbers (H3). This is the difference between a signature and a long scroll.
2. Boards that always read as boards: no cream on cream, no yellow into yellow (H1, H2).
3. A heavy-caps phase index that holds the left column, as the /crepes sequence index does (H4).

---

## About: **fix**, 6 / 10 vs /crepes

Good bones: the Ê drop lands, the lemons band works, the suns rise on scroll. But the first screen is exactly the pattern §0 of the system file calls the Events problem ("a field colour, a thin title and a small framed picture"). That picture has visible AI artefacts, and the people section is an abstract square.

### P1-A1. Hero picture: small, upscaled, garbled AI text
**Problem.**
- `placeholder/apron.webp` is **350×515**, shown at 320 CSS px, so about 1.8× upscaled on 2× screens.
- Its printed tagline reads "A NEDITERR…NEAN MORKINGS" (`checks/about-apron-tagline-zoom.png`).
- It sits as a thumbnail in a cream frame (`widths/about-1440x900-fold.png`, `about-390x844-fold.png`).

**Fix.**
- **Luka:** re-render the apron at ≥ 1400×2060 with the tagline removed or spelled right.
- **Builder:** show it large, as Home's rooms do: the picture half to the viewport edge, full hero height. In `about.vue`:
  - Drop the `Board`.
  - `<ConceptImage class="ab-hero__img" … ratio="4 / 5" settle />`
  - CSS:
    ```css
    @media (min-width: 900px) {
      .ab-hero.ab-hero :deep(.phx__side) { align-self: stretch; margin-right: calc(-1 * (max(0px, (100vw - var(--max)) / 2) + var(--gutter))); }
      .ab-hero__img { height: 100%; }
      .ab-hero__img :deep(img) { object-fit: cover; height: 100%; }
    }
    ```
  - Keep the `.ab-hero__board`-style fixed width on phones for CLS.

### P1-A2. "Who we are" shows no people
**Problem.** The founders' ShootSlot is an apricot square with a half-sun (`motion/about-d1440/scroll-013-y3365.jpg`). It is the fourth sun on the page (stages, sign flip, slot, footer). On the people section it reads as a missing photo, not as design.

**Fix.**
- Until the portrait exists, move the re-rendered apron here (it is the team's uniform), or drop the slot.
- Let the section be a one-column statement: `.team__grid { grid-template-columns: minmax(0, 8fr); }` and a bigger `team__body` (`font-size: var(--step-2)`).

### P1-A3. "Mornings, Gulf light" over Amalfi lemons
**Problem.** The photo is credited "Amalfi lemons", so the headline promises the Gulf and shows the Mediterranean.

**Fix.** Pick one:
- **Copy (Luka):** `:lines="['A Mediterranean', 'morning']"`. This matches the photo and the brand tagline. Check that it fits in 2 lines at 320: "MEDITERRANEAN" is 13 capitals; set `--cap-w: 0.72`.
- **Picture:** keep the words and use a Gulf photo. `world/vanderbilt-beach.jpg` (1600×989) exists, but it needs an entry in `data/credits.ts` from `public/img/world/credits.json`.

**Contrast on pixels** (lemons, tint 0.62, text hidden, 98th percentile): title ≥ 3.37:1 at all 8 widths (large text, passes); credit 9.45:1 on its plate (`checks/about-lemons-*.png`).

### P2-A4. Phone stages: the suns don't stand over their stages
**Problem.** Three suns sit in a 3-column sky above a 1-column list, so suns 2 and 3 stand over nothing (`widths/about-390x844-scroll.jpg` frame 2).

**Fix (`about.vue`).**
- Under 900 px, hide `.stages__sky`.
- Put the sun inline at each stage's title: `<span class="stage__sun" :style="{'--rise': s.rise}" />` with a 56 px half-disc clipped at the title's baseline.

### P2-A5. Hero gap between lead and pill (about 150 px at 1440)
**Problem.** The tall side board stretches the `1fr` row (`widths/about-1440x900-fold.png`).

**Fix.** `grid-template-rows: auto auto auto 1fr` and `.ab-hero.ab-hero :deep(.phx__actions) { align-self: start; }`

### P2-A6. Copy that claims more than we know
- "Where we test every recipe and meet most of our neighbours" is a fragment and an unverifiable claim. Suggest: "Crêpes at the Naples farmers markets, where we try every new recipe first."
- "The same team you meet at the crêpe stand … plans, styles and serves your party" contradicts Services' "Who we bring in" partners. Suggest: "The team from the crêpe stand runs your party, with the florists and staff we trust."
- Both lines are for Luka to confirm.

### P2-A7. The sign flip repeats /crepes nearly word for word
**Problem.** "One morning, one crêpe" with the same A → cone turn. Visitors from the QR see the same trick twice.

**Fix.** Acceptable as the brand story. If kept, change the second caption to the Events reading: "Upside down, a cone; right way up, the sun over your party."

### About: 3 biggest wins to /crepes level
1. A large, sharp, honest hero picture instead of the framed thumbnail (A1). This is the single biggest visual lift on the four pages.
2. People, or the apron, in "Who we are" instead of the fourth sun (A2).
3. A headline that matches its photo (A3), plus suns that stand over their stages on phones (A4).

---

## Inquire: **ship** (with P2s), 7.5 / 10 vs /crepes

The form works and the summary board is a genuine /crepes-grade idea: a brown board, a valance, rows rising in, and the guest range rolling on the odometer.

**Form test** (`form/form-log.json`):

| Test | Result |
|---|---|
| Empty submit | 5 inline errors; focus goes to `#f-name` (in view); 0 requests |
| Prefill `?services=planning&stations=crepe&guests=50–100` | Chips: 50–100, Planning & coordination, Live stations, Crêpes. Board: Guests 50–100, Help with Planning & coordination, Live stations, Stations Crêpes. Count "Three of seven" on the board and the phone disclosure |
| Server 500 (and route abort) | `role=alert` "Something went wrong on our side…"; focus on the submit; answers kept |
| Success | "Thank you, Ana. We'll write to …" focused; board retitled "What you sent us" |

Keyboard: all chips show a ring on their face. The date's picker button (its 4th tab stop) has no visible ring; this is minor.

### P2-I1. The sent board still counts "Six of seven"
**Problem.** After sending, it reads as if something is missing (`form/1440-5-success.png`).

**Fix (`InquiryForm.vue`).** `<p v-if="state !== 'sent'" class="inq__n">{{ countText }}</p>`

### P2-I2. The footer pill "Start an inquiry →" on /inquire links to itself
**Problem.** On every page it also repeats the CloseCta pill one screen later (`widths/inquire-1440x900-scroll.jpg` frame 4).

**Fix (`components/SiteFooter.vue`).**
- `const route = useRoute()`
- `<NuxtLink v-if="route.path !== '/inquire'" to="/inquire" class="pill pill--sun foot__cta">`
- Consider dropping the pill site-wide: every Events page already ends on a CloseCta.

### P2-I3. The payoff has no move
**Problem.** Success is a flat cream-deep box. /crepes would land it.

**Fix (`InquiryForm.vue`).**
- Inside the Board: `<span v-if="state === 'sent'" class="inq__sun" aria-hidden="true" />`
- CSS:
  ```css
  .inq__sun { position: absolute; right: clamp(22px, 2.6vw, 36px); bottom: 0; width: 120px; aspect-ratio: 2 / 1; border-radius: 999px 999px 0 0; background: var(--accent); animation: inq-sun 1100ms var(--ease-out) both; }
  @keyframes inq-sun { from { transform: translateY(100%); } }
  @media (prefers-reduced-motion: reduce) { .inq__sun { animation: none; } }
  ```
- Set "Thank you, Ana." with `RiseText` (by word).

### P2-I4. The error message offers no other way to reach us
**Problem.** `contact.email.confirmed` is false, so "send again in a moment" is the only path (`form/390-4-server-error.png`).

**Fix.** Content, for Luka: confirm the email (and the reply time, which also turns on "We reply …" in the hero).

### Inquire: 3 biggest wins to /crepes level
1. A finished success moment (I3, I1).
2. No self-link or duplicate pill at the end of the page (I2).
3. Confirmed email and reply time (I4). That gives the hero its second line and the error its fallback.

---

## Across the four pages

- **X1. One hero template four times.** Bloom, How We Work, About and Inquire all use `heavy`: field colour, caps top-left, a box on the right (`widths/folds-1920.png`). Home, Picnics, Live Stations and /crepes lead with a photograph. B1 (Bloom gets a photo hero) and A1 (About's picture goes large) break the pattern. How We Work and Inquire can stay type-led.
- **X2. US spelling.** /crepes writes "savory". Events copy has "favour" (`BcSequence.vue`), "Personalised" (`bloom-cart.vue`), "finalise" (`how-we-work.vue`, `index.vue`, `luxury-picnics.vue`), "neighbours" (`about.vue`) and "colours" (`InquiryForm.vue` placeholder). Change all of them to US spelling.
- **X3. "Tell us about your day"** is About's close, Home's close and Inquire's H1. About's close lands on a page with the same headline. Suggest About: `:lines="['Bring us', 'your morning']"` (for Luka).
- **X4. 1920.** Display sizes are frozen at 1440, so heroes sit in the left half of a 1920 screen and Bloom's photo is about 430 px wide (`widths/folds-1920.png`). Acceptable, and moot for Bloom after B1.
- **X5. Duplicate end CTA** (I2) affects all four pages.

## Priority order for the builder
1. **H1, H2, H3, H4.** One file, `HwSteps.vue`, with the biggest jump in score.
2. **B1 and B2.** `bloom-cart.vue` and `BcSequence.vue`, then re-measure contrast.
3. **A2, A4, A5** and the copy in **A3** (code). **A1** waits for Luka's apron re-render.
4. **I1, I2, I3**, then **X2**.
5. Re-run this suite (`scratchpad/tools/r2/*.mjs`), then measure CLS and LCP on a production build.
