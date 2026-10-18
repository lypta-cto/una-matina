# Final review verification: Events pages (Lido), 2026-10-18

Reviewer: a fresh verification pass, read-only on code. It checks `review/final-events.md` against the builder's "Events round 4" entry in `build-log.md`. Dev server: http://localhost:3001.

## Evidence

All evidence is under `review/final-events-verify/`.

- **Folds and full pages:** `fold/<page>-<w>.png` and `full/<page>-<w>.png`, covering 8 pages × 320/390/768/1024/1280/1440/1920.
  - Desktop widths are captured with `mouse.wheel` (Lenis on).
  - Widths under 1024 are captured with touch emulation.
  - Side-by-side strips: `<page>-fold-desk.jpg` (1024 · 1280 · 1920) and `<page>-fold-mobile.jpg` (320 · 390 · 768).
- **Motion:**
  - `motion/d-<page>-sheet.jpg`: 1440×900, real `mouse.wheel`, Lenis on.
  - `motion/m-<page>-sheet.jpg`: 390×844, CDP touch scroll gestures, Lenis off.
  - `motion/stations-<w>-sheet.jpg`: dense wheel sequences through the Live Stations frame at 1024/1280/1440/1920.
  - Raw frames and the `index.json` scroll positions are in the sub-folders. Summaries are in `motion/{d,m}-summary.json`.
- **Checks:**
  - `checks/findings.json`: per-finding measurements.
  - `checks/metrics.json`: overflow, headings, placeholder words, contrast and console, per page × width.
  - `checks/density.json`: real decoded pixels per device pixel.
  - `checks/rm-nojs.json`: reduced motion and JS off.
  - `checks/*.png|jpg`: screenshots per finding, named below.

## Verdict

| Page | Verdict | Score (was) | One line |
|---|---|---|---|
| Home `/` | **ship** | 8.5 (8.0) | The P0, P1-1, P1-5, P2-1, P2-2 and P2-3 fixes are all confirmed. The only miss is that the 21:9 pier band is soft at 1920@1× (a `sizes` bug, P2). |
| Services | **ship** | 7.5 (7.0) | The cannoli photo now sits in the first screen. The "Live station catering" band below it is thin: title, text, button and a lot of cream. |
| Live Stations | **ship** | 7.5 (6.5) | The signboards work: the frame changes colour and word at every station. No credit ghosting. JS off is clean. |
| Luxury Picnics | **ship** | 7.0 (6.0) | The "Where we set up" signboard and the plain-text FAQ fix the hole in the middle. Two-word places break onto two lines at 320 and 900–1099 (P2). |
| Bloom Cart | **ship** | 7.0 (7.0) | Unchanged and still fine. |
| How We Work | **ship** | 7.5 (7.5) | Yellow → apricot → cream-deep. On phones the first board is no longer apricot under the apricot hero. |
| About | **ship** | 7.5 (7.0) | No invented market line. The 768 split hero works. The apron is still soft (an accepted exception). |
| Inquire | **ship** | 8.0 (7.5) | The summary now says "Your answers appear here as you go." and rows rise in as they are answered. |

**Global checks, all pass:**
- 0 horizontal overflow on 56 page×width combinations. The only elements wider than the viewport are `hv__px` and `hv__poster`, the parallax oversize clipped by the hero.
- 0 console errors or warnings, including during client navigation.
- No visible placeholder words. The text scan covered placeholder / TBC / lorem / Styled shoot / Concept image / 000-0000 / Tomorrow / Open now / Next market / Not yet / @unamattina / Instagram / undefined / NaN.
- No headings over 2 lines. The 320 metric flagged "3–4 lines" on the closing H2 chips, but the highlighted inline spans fool the line counter: they render as 2 lines (`checks/close-h2-320-*.png`).
- Small-text contrast: 0 failures against solid backgrounds at every width.
- Lenis is on at desktop and off on touch.
- Desktop wheel walks: frame p95 17 ms, max 33–34 ms, 0 frames over 50 ms on every page. Mobile walks: p95 17 ms, max 50 ms.
- Header headroom: hidden at y≈2000 and back on the first wheel-up (header bottom 0 → 76).
- Client navigation through all 6 header links opens each page at scrollY 0, and Back works.
- Mobile sheet: focus goes to Close, and Esc returns focus to Menu.
- Reduced motion: 0 video requests, 0 content elements left at opacity 0 or hidden, on all 8 pages at 390 and 1440.
- JS off: 0 hidden content, 0 video requests, on all 8 pages at 390 and 1440.

## Prior findings: status

| # | Finding | Status | Evidence |
|---|---|---|---|
| P0-1 | Invented market time (Home "Still at the market", About "Market, today") | **Resolved** | Both pages read "Find us at the Naples farmers markets." No "Next market / Open now / Tomorrow" anywhere, and no pulsing dot. This also holds with the clock frozen to **Saturday 17 Oct 2026, 09:30 ET**, the case that used to render "Open now". See `checks/p0-{home,about}{,-sat}.png`. |
| P1-1 | Home hero credit hidden under the board at 768–1199 | **Resolved** | At 768/900/1024/1199 the board is 640 px wide. The credit sits in its own row: no overlap with the board, and `elementFromPoint` hits the credit. At 1024×768 the CTA bottom is 676 (≤ 768). The footage now shows to the right of the board. See `checks/p1-1-strip.jpg` and `p1-1-home-*.png`. |
| P1-2 | Live Stations frame shows four empty apricot panels | **Resolved** | The panels read TIRAMISU BAR (yellow), FRUIT CUP BAR (apricot), CHARCUTERIE (yellow), then the cannoli photo, then COCKTAIL & MOCKTAIL BAR (yellow). Each label fits its box at every width ("CHARCUTERIE" stays on 1 line). The sun climbs visibly. Old captions are hidden during the cross-fade: at most one visible credit in 51 wheel frames. See `motion/stations-{1024,1280,1440,1920}-sheet.jpg` and `stations-*/log.json`. |
| P1-3 | Picnics credit below AA on apricot | **Resolved** | The credit is `rgb(78,36,18)`. At 1440 the caption now lands on cream: 12.5:1. At 390 it sits under the photo on cream (`checks/full-luxury-picnics-390-cols.jpg`). The contrast scan found 0 low-contrast items. |
| P1-4 | Picnics thin middle (wordless panel, one-item accordion) | **Resolved** | "Where we set up" is an apricot signboard listing Beach / Park / Private backyard / Poolside / Private property / Sunset spots, with a half-sun. The FAQ is a question plus a plain answer. The remaining `<details>` is the footer credits disclosure. See `checks/p1-4-picnics-{bring,rules}-{390,1440}.png`. |
| P1-5 | Hero video upscaled at desktop | **Resolved** | Source picked per device: 1440@1 → `palm-sunset-1920.webm` and the `poster-1920`; 1920@1 → 1920; 1024@2 → 1920; 1024@1 → 1280; 390@3 → 720. All of them play. At 1920@1 the video is painted at 2074 CSS px from 1920 px, about 0.93×; that is the ceiling of the source. |
| P2-1 | Chapter 3 narrower than chapters 1–2 | **Resolved** | All three `.chap` grids are 1440 wide at 1440. |
| P2-2 | Statements over 3 lines on phones | **Resolved on Home and About.** **New 4-line case** on Picnics. | Home has 0 statements over 3 lines at 320/360/390/768/1024/1280. Picnics `bring__for` ("For proposals, anniversaries, …", 31 px) runs 4 lines at 1024. That statement was moved there in this round. |
| P2-3 | Pause button before the primary CTA in tab order | **Resolved** | Tab order: Skip, logo, the 6 nav links, Start an inquiry, See what we do, Pause, credit. |
| P2-4 | Image density on Retina | **Partial (accepted exception), plus one new fixable cause** | The apron is a 350 px source shown at 320 CSS px@2× (0.55). The builder accepted this exception. **New:** the 21:9 bands (Home pier, About lemons) have `sizes="(max-width:1279px) 100vw, 1440px"`, but they are full-bleed. At 1920@1× the browser picks the 1440w file for a 1920–2035 px band, so the bands render at 0.66× on a plain 1080p monitor. See below (N-1). |
| P2-5 | Inquire summary "Not yet" × 6 | **Resolved** | Empty state is "Your answers appear here as you go." with "0 of 6". After one chip, one row ("Event: Birthday or milestone") shows "1 of 6". See `checks/p2-5-inquire-{empty,one}.png`. |
| P2-6 | How We Work: apricot hero followed by an apricot board on phones | **Resolved** | Boards are yellow, then apricot, then cream-deep (`checks/p2-6-hww-390.png`). |
| P2-7 | About at 768: tiny apron in an empty field | **Resolved** | Split hero at 768 and 820 (`checks/p2-7-about-*.png`, `about-fold-mobile.jpg`, right). At 390 the apron is still 200 px wide and left-aligned, with half the width empty. Minor. |
| P2-8 | Services first screen has no picture | **Resolved** | The cannoli photo is in the hero at 1024 and 1280 (`checks/p2-8-services-*.png`). |
| P2-9 | Unconfirmed Instagram handle in the footer | **Resolved** | The footer has no "Instagram" or "@" handle on any Events page. |
| P2-10 | Live Stations with JS off: frame stuck on the griddle | **Resolved** | No sticky frame. The lead photo sits above the list (`checks/nojs-live-stations-1440-cols.jpg`). |

Score: **all P0/P1 resolved; 9 of 10 P2 resolved; 1 partial** (P2-4: an accepted source limit plus a newly found `sizes` cause).

## New findings from the fresh look

None of these blocks shipping.

### N-1 (P2): full-bleed 21:9 bands are soft on a 1080p desktop
- **Where:** Home "At home or on the beach" (pier) and About "Mornings, Gulf light" (lemons).
- **Problem:** the bands are 100vw, plus the parallax oversize. `sizes` caps them at 1440px, so at 1920@1× they load the 1440w file: 0.66 device px per CSS px (`checks/density.json`, `home-1920@1` and `about-1920@1`).
- **Fix:** set `sizes="100vw"` on those `FoundPhoto`s, or `110vw` to account for the parallax.
- **Note:** the 2880w ipx variant is upscaled from a ≤ 2400 px original. Cap the srcset at the original's width so phones at 3× do not download upscaled bytes.

### N-2 (P2): Picnics "Where we set up": two-word places split onto two lines
- **Where:** at 320 and from 900 to 1099 px.
- **Problem:** "PRIVATE BACKYARD" and "PRIVATE PROPERTY" each wrap, so the unbulleted all-caps list reads as "PRIVATE / BACKYARD / POOLSIDE / PRIVATE / PROPERTY" (`checks/new-picnics-where-1024.png`, `checks/full-luxury-picnics-1024-cols.jpg`). It is fine at 390–899 and at ≥ 1100.
- **Fix:** `white-space: nowrap` on `.bring__where li`, plus a container-query font size (the same approach as the ShootSlot labels). Or add row spacing between items so a wrapped item stays visibly one item.

### N-3 (P2): Live Stations active-row highlight overhangs the wrapped title
- **Where:** "COCKTAIL & MOCKTAIL BAR" wraps to 2 lines at 1024 and at 1920.
- **Problem:** the apricot `::before` block keeps the full row width (547 px at 1024, 780 px at 1920), while the text ends at 390 / 699. That leaves a 160–190 px empty apricot slab beside the second line (`checks/new-ls-highlight-1024.png`, `-1920-crop.png`). At 1280/1440 the title is on one line and the highlight hugs it.
- **Fix:** highlight the inline text instead of the block: `display: inline; box-decoration-break: clone; background: …` on an inner span. This matches the closing-heading chips, which already do it.
- **Also:** at 1920 the title wraps although the column is wide. Check the `max-width` on `.lsl__row h3`.

### N-4 (P2): Picnics `bring__for` statement is 4 lines at 1024
- **Fix:** at 900–1199 put it under both boards at full width, or use `--step-1`.

### N-5 (P2, verify on production): load-time layout shift on /inquire in dev
- **Measured:** CLS 0.0376 once at about 50 ms after navigation. The sources are `wrap body` 473→390, `ph__side` and `f__chips` going 0→56 px high. Picnics shows 0.0065 (`ph__main`, `m-line__i`).
- **Why it may be dev-only:** this looks like dev-mode CSS arriving late. The builder reports CLS 0.000 on a production build.
- **Next step:** re-measure on the production build before calling it fixed. If it reproduces, reserve the chips' height.

### N-6 (craft, not a defect): the same five photos repeat across pages, and the inner pages share one hero
- **Photo reuse:**
  - cannoli: Services hero and Live Stations lead;
  - Clam Pass: Home chapter and Picnics hero;
  - flower buckets: Home chapter and Bloom hero;
  - griddle: Home chapter and the Live Stations frame.
- **Hero template:** Services, Picnics, Bloom and About all use the same layout: colour field, H1 + lead + button on the left, a 4:5 photo on the right with its credit.
- **Effect:** clicking between inner pages feels like one template recoloured. The references (beanro, lattetemplate) vary the first screen per page and never reuse a hero image.
- **Not a blocker:** the real fix is still the styled shoot, already wired through `data-shoot-slot`. Until then, a cheap change would vary the composition on one or two pages: e.g. Bloom with a full-bleed photo band, or Services with a typographic hero and the photo lower down.

### Smaller notes
- Services "Live station catering" (S4) is now title + text + button in a tall cream band. It is the emptiest stretch on that page at 1440 (`checks/full-services-1440-cols.jpg`, col 3). Fine, but plain.
- How We Work at 1440: the last board ("On the day, and after") is about 560 px tall with content only in its top 70 px; the half-sun fills the rest (`motion/hww-frames-10-12.jpg`). This is inherent to the stacked boards and acceptable.
- Live Stations builder: the "Add a station" empty cells read as UI, not as placeholders. OK.
- About 390: the apron image is 200 px wide and left-aligned in a 358 px column. It could be centred or widened to 260 px, which still respects the ≤ 320 CSS px AI-image rule.

## Craft versus the references

- **Home:** with the sharper video and the credit fixed it reads at template level from 768 to 1920. The pinned chapters, wheel and page transitions are on par with agrovas and beanro in motion quality, with zero dropped frames in the walks.
- **Live Stations:** this was the weakest page and is now a real authored moment. The named signboards alternate colour, and the sun climbs from station to station.
- **The gap:** inner pages are still below beanro and latte on imagery, as the previous review said, and the shared hero template makes that more visible (N-6).
- **Next upgrade:** the shoot. After that, vary one or two inner-page heroes.

## Not verified
- Real iOS Safari or Android hardware: emulation only.
- A real Save-Data client.
- Production-build CLS for N-5 (dev server only).
