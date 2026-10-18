# Final review: Events pages (Lido), 2026-10-18

Reviewer: fresh final pass, read-only on code. Dev server http://localhost:3001.
Evidence is under `review/final-events/`:
- `fold/<page>-<w>.png` and `full/<page>-<w>.png`: 8 pages × 320/390/768/1024/1280/1440/1920.
- `<page>-fold-desk.jpg` (1024 · 1280 · 1920) and `<page>-fold-mobile.jpg` (320 · 390 · 768): side-by-side strips.
- `motion/{d,m}-<page>-sheet.jpg`: real-input walks. `d` = 1440×900 with `mouse.wheel`, Lenis on. `m` = 390×844 with CDP touch scroll gestures, Lenis off. Frames are in `motion/{d,m}-<page>/`.
- `seq/{chapters,boards,stations}-{1024,1280,1440,1920}-sheet.jpg`: dense wheel sequences through every pinned section.
- `checks/`:
  - `nojs-*`, `rm-*` (reduced motion);
  - `kbd-*`, `trans*` (page transitions), `wheel-*` (occasions wheel);
  - `header-*`, `m-sheet.png`, `form-errors-390.png`;
  - `crepes-*` (global header and footer on /crepes).
- `metrics.json`: per page × width. It holds the inquiry CTA position, overflow, headings > 2 lines, placeholder words and console errors.

## Verdict

| Page | Verdict | Score | One line |
|---|---|---|---|
| Home `/` | **fix** (P0 + 2 × P1) | 8.0 | Strongest page. The hero video, the chapter stack and the wheel are at template level. It shows an invented market time, and the video credit is hidden at tablet widths. |
| Services | ship | 7.0 | Clean and well set. It is typographic only: one photo, and every section is "title + lists". |
| Live Stations | **fix** (P1) | 6.5 | The sticky frame shows four near-identical apricot panels out of six stations, so the signature moment reads as "image missing". |
| Luxury Picnics | **fix** (P1) | 6.0 | The thinnest page: a big wordless panel, a one-item accordion, and a credit below AA. |
| Bloom Cart | ship | 7.0 | Good fields (sage owns it). The sage sun panel is the weak spot. |
| How We Work | ship | 7.5 | The stacked boards and the rail work without jumps at every desktop size. The mobile fallback is clean. |
| About | **fix** (P0, shared) | 7.0 | The suns and the flipped mark are good. It repeats the invented "Next market: Tomorrow" line. |
| Inquire | ship | 7.5 | Solid form: validation focuses the first error. The summary panel is "Not yet" × 6. |

Global checks: all pass unless listed below.
- **Overflow and console:** no horizontal overflow on any page at any width. 0 console errors or warnings on all 8 pages and on /crepes.
- **Headings:** every heading is ≤ 2 lines at 320–1920.
- **Placeholder words:** no visible "placeholder / TBC / Styled shoot / Concept image / 000-0000". The only "confirm" hits are real copy ("we confirm the rules and any permits").
- **Smooth scroll:** Lenis is on at desktop and off on touch.
- **Header:** headroom hides at y≈360 and returns on the first wheel-up.
- **Page transitions:** 160 ms out, ≈ 35 ms of empty field, 240 ms in. No scroll jump: the new page opens at 0, and Back restores 1441.
- **Mobile sheet:** focus moves to Close; Esc returns focus to Menu.
- **Reduced motion:** no video bytes are requested, every sticky stack becomes plain bands, no content is left at opacity 0, and nothing animates.
- **JS off:** all content is visible, with chapters and boards as plain bands.
- **CLS:** 0.0000–0.0002. LCP: Home poster 68–72 ms (dev server). The 2.2 s LCPs on Services and Live Stations are the scripted-scroll artefact already noted in the build log.
- **`npm run check:tokens`:** ok.
- **/crepes:** renders with its own nav and footer, directly and through client navigation; no overflow.

---

## P0: must fix before anyone sees it

### P0-1 Invented market time shown as live fact (Home "Still at the market", About "Market, today")
- **Evidence:**
  - `motion/d-home/013.jpg` and `motion/d-about/001.jpg` show "Next market: Tomorrow, 9 am – 1 pm".
  - `data/markets.ts` line 1 says: "Market schedule … ALL placeholder until confirmed by the client".
  - On Saturdays 8–12 the same component renders "Open now" with a pulsing dot.
- **Why it matters:** this is the one place the site gives a visitor a time and a reason to show up, and none of it is confirmed. It breaks the brief's honesty rule (§5 DoD 11: no invented facts).
- **Fix:** in `app/app/components/MarketStatus.vue`, never compute a day or time from unconfirmed data:
  ```vue
  <script setup lang="ts">
  import { dayNames, fmtTime, markets } from '~/data/markets'
  const confirmed = markets.some(m => !m.tbc)
  …
  </script>
  <template>
    <p class="ms" aria-live="polite">
      <template v-if="!confirmed">Find us at the Naples farmers markets.</template>
      <template v-else-if="status.state === 'open' && status.market">…</template>
      …
  ```
- **Owner check:** /crepes also uses this component (hero board, week board). Tell the /crepes owner. The same rule applies there, but that page is reviewed separately.

---

## P1: fix in this round

### P1-1 Home hero: the video credit is hidden under the board at 768–1199 px
- **Evidence:** `fold/home-1024.png` shows only "dt, CC BY 2.0" next to the CTA. At 768 (`home-fold-mobile.jpg`, right) the credit is gone completely.
- **Cause:** from 768 px, `.hv__board` is `width: min(100%, 860px)` and spans rows 1–3. `.hv__credit` sits in row 2 with `justify-self: end`, under the board. The board only drops to 58 % at ≥ 1200 px. CC BY requires a visible credit.
- **Side effect:** at 1024 the board is 860 px wide around ~520 px of content, so it covers almost all of the footage.
- **Fix** in `app/app/components/HeroVideo.vue`:
  ```css
  @media (min-width: 768px) and (max-width: 1199px) {
    .hv { grid-template-rows: auto 96px auto; }
    .hv__board { width: min(100%, 640px); }
    .hv__credit { grid-row: 3; justify-self: end; padding-top: 10px; }
  }
  ```
- **Check:** 768 and 1024 folds. The CTA must still be inside 1024×768. It is at 624–676 now and will not move.

### P1-2 Live Stations: the sticky frame is four empty apricot panels
- **Evidence:** `seq/stations-1440-sheet.jpg` and `motion/d-live-stations/002.jpg`.
- **The problem:** tiramisu, fruit cups, charcuterie and cocktails all swap to the same apricot rectangle with a yellow half-sun that rises a few percent each time. The swap is the page's authored moment, but 4 of 6 swaps show no visible change. A wordless empty box at 440×550 reads as a missing image, the opposite of "no visible placeholders".
- **Fix:** make each panel a signboard that changes visibly.
  - `ShootSlot.vue` gets an optional `label` prop, rendered top-left on the panel in `sign-l` caps, `--slot-ink`:
    ```vue
    <span v-if="props.label" class="slot__label">{{ props.label }}</span>
    ```
    ```css
    .slot__label { position: absolute; left: 8%; top: 8%; right: 8%; font: 400 var(--step-4)/0.95 var(--font-text); text-transform: uppercase; letter-spacing: .02em; color: var(--slot-ink); }
    ```
    The panel stays `aria-hidden`, since the list already carries the names.
  - In `LsStationList.vue`, pass `:label="s.name"`. Alternate the tone so consecutive panels differ: `:tone="i % 2 ? 'yellow' : 'apricot'"`. The frame then changes colour and word at every station.
  - Optionally, raise the `rise` step so the sun's climb is readable: `0.25 + 0.75 * i / (n − 1)`.
- **Small related fix:** during the 240 ms cross-fade, the outgoing photo's "Photo: DanielPenfield…" credit stays visible under the incoming panel (`motion/d-live-stations/002.jpg`). Hide outgoing captions at once:
  ```css
  .lsl__layer:not(.is-on) :deep(.found__cap) { visibility: hidden; }
  ```

### P1-3 Luxury Picnics: credit contrast 3.48:1 on apricot
- **Evidence:** contrast check at 390 and 1440. "Photo: P,TO 19104, CC BY-SA 4.0" (13–14 px `--ink-muted`) sits on the apricot field because the caption hangs inside it.
- **Fix** in `pages/luxury-picnics.vue`:
  ```css
  .pic__photo :deep(.found__credit) { color: var(--ink-deep); }
  ```
  That gives about 6.6:1. Alternatively, increase `--hang` so the caption lands on cream.

### P1-4 Luxury Picnics: the page is thin, and the middle reads as unfinished
- **Evidence:** `motion/d-luxury-picnics-sheet.jpg`, frames 2–4.
  - Section 2 ends in a 630 px-wide wordless apricot panel with a sun.
  - The yellow band holds a heading plus one collapsed accordion. One `<details>` on its own looks like a bug, not a FAQ.
- **Fix:**
  - (a) Render the single answer as text, not an accordion. In the page:
    ```vue
    <p v-if="faqShown.length === 1" class="rules__answer">{{ faqShown[0].a }}</p>
    <Faq v-else :items="faqShown" />
    ```
    with `.rules__answer { font-size: var(--step-1); max-width: 40ch; }`.
  - (b) Replace the `bring__slot` panel with the signboard panel from P1-2 (label "Sunset picnic", tone yellow), or drop it and let the definition list breathe.
  - Until the shoot, the page has one honest photo. Don't add a second wordless box.

### P1-5 Home hero video is upscaled at every desktop width
- **Evidence:** the clip is 1280 px wide and painted at 1555 CSS px at 1440 (layer scaled 1.08) and at 2074 CSS px at 1920. That is 0.82× and 0.62× device pixel per CSS pixel at 1×, and about 0.4× on Retina.
- **Impact:** the poster is 1600 px (1.03× at 1440@1×). On a 2× laptop the palm fronds visibly soften. The source is 1920×1080 (`public/video/credits.json`: `sourceWidth: 1920`).
- **Fix:**
  - Encode `palm-sunset-1920.webm/.mp4` from the source (crf ≈ 32 for webm, keep it ≤ 2.5 MB).
  - Export `palm-sunset-poster-2400.webp`, ≤ 160 KB, preloaded only ≥ 1200 px.
  - In `HeroVideo.vue`, extend `pick()`:
    ```ts
    const large = matchMedia('(min-width: 1200px)').matches || (devicePixelRatio > 1.5 && matchMedia('(min-width: 768px)').matches)
    return (small && props.sourcesMobile?.length ? props.sourcesMobile : large && props.sourcesLarge?.length ? props.sourcesLarge : props.sources) ?? []
    ```
    Pass `:sources-large` from `pages/index.vue`.

---

## P2: polish

1. **Home chapter 3 (Bloom Cart) is smaller and shifted versus chapters 1–2.**
   - Evidence: at 1440 the grid is 650 + 465 px against 760 + 543, and the photo top moves 160 → 229 (`seq/chapters-1440-sheet.jpg`, frames 9–11).
   - Cause: in the pinned layout `.chap` is `display: grid`, and the `.wrap` child has `margin-inline: auto`, so it shrinks to its content.
   - Fix in `pages/index.vue`, inside the sticky media query: `.chap > .wrap { width: 100%; }`.
2. **Statements over 3 lines on phones.**
   - Home hero statement is 4–5 lines at 320–390. Chapter statements are 4–5 lines (picnic and bloom at 320–390; picnic also at 1024). About "The A in our name…" is 4 lines at 320. DoD 2 says ≤ 3.
   - Fix: `@media (max-width: 599px) { .chap__statement, .home__statement { font-size: var(--step-0); } }` or shorten the copy ("A low table on the sand, set before you arrive, gone after you leave.").
3. **Home tab order:** the video Pause button (DOM: inside `.hv__media`) gets focus before the H1's "Start an inquiry". Move the `<button>` after the board's slot in `HeroVideo.vue` (it stays absolutely positioned), so the first Tab after the nav reaches the primary action.
4. **Image density on Retina.**
   - Below 1.5× at 2×: Clam Pass gulf in chapter 2 (960 px tall source into a 650 px frame, about 1.48×), the Naples pier at 1440@2× (1.67×, and 1.25× at 1920 with the parallax oversize), and the apron on About (350 px source at 320 CSS px = 1.09×).
   - Export the apron at 640 px wide (still the ≤ 320 CSS px AI rule) and the pier 21:9 at 3200 px if the original allows.
5. **Inquire "Your event so far":** six "Not yet" rows read as an empty template. Until the first answer, show one line ("Your answers appear here as you go.") and reveal each row when it gets a value (`InqSummary.vue`).
6. **How We Work on phones:** the apricot hero is followed straight away by the apricot "Before you book" board, two apricot blocks with a 24 px cream gap (`motion/m-how-we-work-sheet.jpg`, frame 0). On < 900 px give the first board `--bg: var(--surface)`, or add section spacing above the boards.
7. **About at 768:** the apron hero image is 200 px wide in a 768 px field and leaves the right half empty (`about-fold-mobile.jpg`, right). From 768 use the 2-column hero layout that starts at 900 now, or centre a larger image.
8. **Services first screen at 1024–1280:** a short apricot block with the italic statement floating bottom-right over a lot of empty field. It is fine, but it is the page's only moment. Consider moving the cannoli photo up into the hero `#side` slot (as on Picnics and Bloom), so Services gets a picture in its first viewport.
9. **Instagram `@unamattina`** is still shown unconfirmed in the footer on every page. It is accepted in `hidden-placeholders.md`, but it is the last visible unverified fact. Hide it with `confirmed: false`, like email and phone, until the client confirms.
10. **Live Stations with JS off:** the sticky frame stays on the griddle while the list scrolls past all six stations. Hide `.lsl__aside` under `html:not(.js)` and show `.lsl__lead-photo` instead.

---

## Craft versus the references (agrovas, beanro, lattetemplate; r2 captures)

- **Where we match or beat them:**
  - Home's first screen: the video under the valance and the cream board with a real primary action. Agrovas's centred-on-photo hero is more generic.
  - The E2 chapter stack: pure CSS, no jump, correct at 900×600 through 2560×1440.
  - The How We Work board stack with its rail: equal to dollop and élan, better spacing discipline.
  - Motion vocabulary: one ease-out family, long tails, no blur or bounce.
  - Page transitions and Lenis are tuned like a Framer site.
- **Where we fall short, and why:**
  - The references sell with photography: every section on beanro and latte has a crafted, art-directed image. We have three honest found photos and one AI mockup.
  - Inner pages (Services, Picnics, Bloom, Live Stations) are therefore typographic documents with one picture each. Where a picture should be, they show wordless panels.
  - The fix is not more decoration. Make the panels carry type (P1-2, P1-4) so they read as signboards, not holes. The real fix is the styled shoot. Everything is wired for it (`data-shoot-slot`), so it is a drop-in.
- **Biggest single upgrade after the P0/P1 fixes:** replace the Live Stations panels with named signboards (P1-2). It turns the weakest pinned sequence into a second authored moment on par with Home's chapters.

## Not verified
- **Valance flutter on scroll velocity:** not measured frame by frame. The header headroom was verified.
- **Real Save-Data:** Chromium's `Save-Data` header does not set `navigator.connection.saveData`, so the check could not be emulated. The code path (`HeroVideo.vue` `onMounted`) is correct on reading.
- **Real-device iOS Safari:** emulation only.
