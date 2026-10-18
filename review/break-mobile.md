# Una Mattina — break-ui + mobile-native stress test

Date: 2026-10-17 · Dev server http://localhost:3001 · Playwright 1.64 Chromium (from `builder/node_modules`)
Viewports: 360×640, 390×844, 412×915, 768×1024 (isMobile + hasTouch), plus 320, 280 (Fold cover) and 640×360 landscape where relevant.
Screenshots are in `review/shots/` (paths below are relative to `review/`).

**Method (no source edits, no demo toggle).** I supplied the worst-case data at the module boundary. Playwright `page.route()` intercepted `/_nuxt/data/{markets,menu,site}.ts` and appended `markets.splice(...)`, `menu.splice(...)` and `Object.assign(contact, …)`. The test then loaded `/about` and SPA-navigated to `/crepes`, so the client rendered only the mocked data. `page.clock.setFixedTime()` pinned Naples time, and `marketStatus()` was also unit-tested in node (`ms-test.ts`). For network faults, `/api/inquiry` was routed to return 500 or a 4 s delay, and the video files to return 404. `HTMLMediaElement.play` was stubbed to reject, to simulate blocked autoplay.

Severity: **P0** breaks a primary job or crashes the page · **P1** visible breakage on a real phone or a realistic data change · **P2** polish, fragile, or only on edge devices.

---

## Part 1 — What broke

| # | Sev | Where | Worst case | What happens | Shot |
|---|---|---|---|---|---|
| 1 | P0 | /crepes Instagram CTAs | `contact.instagram.url = ''` (the current data) | Four "Instagram" buttons and links render as `<a target=_blank>` with **no href**. "Follow on Instagram" (hero) and "Instagram" (sticky bar) do nothing when tapped. The QR page's second job is dead. | `shots/crepes-bar-bottom-m390.png` |
| 2 | P0 | /crepes, `markets` = `[]` | 0 markets | `mapsUrl(markets[0]!)` throws (`Cannot read … 'mapsQuery'`). The "Market dates coming soon" branch in `MarketStatus` can never be reached. On a client navigation the page fails to render. On SSR it is a 500 (inferred). | `shots/crepes-status-zero-markets.png` |
| 3 | P0 | /crepes, `menu[0].items` = `[]` | empty first section | `menu[0]!.items[0]!` throws (`… reading 'name'`), with the same crash as #2. | — |
| 4 | P1 | Home `StationRotator` at ≤412 px | the real station "Cocktails & mocktails" | The plank is `white-space: nowrap`, and its grid track grows to min-content. **The page gets 50 px of horizontal scroll at 360 (scrollWidth 410)** each time the rotator reaches the last station. On Android the page zooms out, and the photo and statement run off the edge. | `shots/home-rotator-cocktails-overflow-360.png`, `shots/home-rotator-cocktails-360.png` |
| 5 | P1 | /crepes Visit, long Instagram handle | `@una.mattina.crepes.naples.fl` (29 chars, within Instagram's 30-char limit) | The unbreakable handle widens `.visit__grid`'s auto column. **The whole section overflows to 385 px at 360.** The H2, the "When" column and the "Heads up" text are clipped. | `shots/crepes-worst-visit-m360.png` |
| 6 | P1 | /inquire success state | email `bartholomew.fitzgerald@northwind-industries-holdings.example.com` | The `.sent` card is 434 px wide at 360 (the `.inq` grid track grows to the email's min-content), which gives horizontal scroll on the thank-you screen. | `shots/inquire-sent-longemail-360.png` |
| 7 | P1 | Header mobile sheet, landscape phone 640×360 | — | The sheet is 572 px tall inside a `position: sticky` header and nothing in it scrolls. "About", "Crêpes at the market" and **"Start an inquiry" are unreachable**: wheel and swipe scroll the page behind the sheet instead. | `shots/header-sheet-640x360.png` |
| 8 | P1 | `MarketStatus` SSR vs client | server clock ≠ client clock (cached HTML, `nuxt generate`, CDN, or a minute boundary) | `ref(naplesNow())` is evaluated separately on the server and on the client. Reproduced: **"Hydration completed but contains mismatches"** in `<MarketStatus>`. With static or cached HTML, a market-goer on slow 3G sees the wrong status ("Next: …" while the stand is open) until JS loads. | console log from the `/about` and `/crepes` runs |
| 9 | P1 | `marketStatus()` with 1 market | Saturday 13:00, after close | The line reads "Next: **Saturday**, 8 am – 12 pm" **on a Saturday**, which reads as today. inDays = 7 is not distinguished from 2–6. | `shots/crepes-status-next-week-1-market.png` |
| 10 | P1 | `btn-primary` everywhere (sticky bar "Instagram", "Send inquiry", "Start an inquiry") | bright sun | 15 px/600 `--on-accent #5B3A2E` on apricot = **5.13:1**. That passes AA, but in direct sun at a market it is the weakest text on the site. `--ink-deep` on the same apricot is already 6.76:1. | `shots/base-crepes-m390.png` |
| 11 | P1 | `/api/inquiry` | 2 MB message, `name: ["x"]`, `eventType: {}` | Returns 200 `{ok:true}` and logs the whole body. There is no length or type limit on the client (`maxlength` is absent) or on the server. This becomes abuse and email-size trouble once delivery is wired up. | curl result |
| 12 | P2 | `marketStatus()` bad data | `close: '12'` / `close: '00:00'` / `name: ''` | `'12'` turns into `NaN` and the market is never open. A midnight close is never open (shows "Next: Friday" while open). An empty name renders "Open now at the ⟨to confirm⟩, until 12 pm". | `shots/crepes-status-one-market-empty-name.png`, `shots/crepes-worst-visit-m360.png` (3rd market) |
| 13 | P2 | HeroVideo, video 404 or unsupported | `/video/*.mp4` → 404 | The poster stays (good), but the **"Play" button stays and does nothing** (networkState 3). `toggle()` calls `v.play()` without `.catch`, which gives an unhandled rejection when autoplay is blocked. | `shots/home-video-404.png`, `shots/home-video-autoplay-blocked.png` |
| 14 | P2 | `.hv__toggle:hover` (phones), `.head__link:hover`, `.nav__links a:hover` (iPad) | tap | **Sticky hover**: after a tap the toggle stays yellow (`rgb(246,214,122)` measured after the tap). These are the only ungated `:hover` rules left. | `shots/home-video-404.png` |
| 15 | P2 | /crepes morning strip | swipe | It snaps every slide **flush to x = 0**, losing the 16 px gutter (`scroll-padding` is `auto`). Measured item lefts after a snap: `[-234, 0, 234, …]`. | `shots/crepes-strip-snap-m390.png` |
| 16 | P2 | /inquire error state | 500 from API | The submit button becomes `disabled` while sending, so **focus drops to `<body>`**. After the error the user is at the top of the tab order. The fallback email is plain text, not `mailto:`. | `shots/inquire-server-error-360.png` |
| 17 | P2 | /inquire slow network | the request never returns | `$fetch` has no timeout, so the button shows "Sending…" forever (verified at 4 s; there is no upper bound). | `shots/inquire-sending-360.png` |
| 18 | P2 | /inquire date | `2020-01-01` | A past date is accepted, and the summary shows "Wed, Jan 1, 2020". | `shots/inquire-worst-summary-360.png` |
| 19 | P2 | /inquire chips | long-press | `.chip__face` has `user-select: auto`, so a long press selects the label text and opens the iOS callout. | — (needs a device) |
| 20 | P2 | /live-stations `StationCounter` | deselect all | The CTA gets `pointer-events: none` but **stays keyboard-focusable** with `href=/inquire?services=stations&stations=`, and its label is "Ask about this station" with 0 stations. At 3 picked, the other chips are `disabled`, which removes them from the tab order without saying why. | `shots/ls-counter-empty-360.png`, `shots/ls-counter-max3-360.png` |
| 21 | P2 | /crepes `.card__facts` | menu with a $125 item | "$8–11" is hard-coded and stays wrong when prices change (the menu count is computed, the range isn't). Prices render as raw numbers: `9.5`, not `9.50`. | `shots/crepes-worst-menu-m360.png` |
| 22 | P2 | /crepes markets list, 5 entries | 5 markets | Each market block is about 250 px tall, so the Visit section is about 1,300 px on a phone. The list follows data order, not "next one first". The open or next market is not highlighted. | `shots/crepes-worst-visit-m360.png` |
| 23 | P2 | Tap targets < 44 px (standalone, not inline in text) | — | Logo links are 150×17 (`/crepes`) and 160×18 (header). "Directions ↗" is 103×26. Home links ("See what we do", "Plan a picnic", …) are 26–29 px tall. Footer nav list items are 20 px tall with 6 px gaps (26 px pitch). | `shots/base-home-m360.png`, `shots/footer-credits-360.png` |
| 24 | P2 | Small text on sage (`/crepes` Visit, Home Bloom half) | sun | `--ink-deep` on `--field-2` = **5.53:1** for 14–16 px text (dt "Where", "Directions", photo credits). Muted credits on `--surface` = 5.79:1. | `shots/base-crepes-m360.png` |
| 25 | P2 | Header sheet, portrait | open the menu, then scroll | No scroll lock: the page scrolls behind the open sheet. A tap outside doesn't close it. At 360×640 the sheet ends at 609 of 640 px, one link away from #7. | `shots/header-sheet-360x640.png` |
| 26 | P2 | Meta | — | No `theme-color` (the status bar won't match the apricot or yellow top). No `viewport-fit=cover`, so `env(safe-area-inset-bottom)` in `.bar` is always 0. That is fine in Safari's tabbed mode but wrong in standalone or landscape. | `curl` of the `<head>` |
| 27 | P2 | /crepes hero word at 280 px (Galaxy Fold cover) | — | `clamp(4.75rem, 21vw, 9rem)` gives a 307 px word, so there is 39 px of horizontal scroll at 280. At 320 it bleeds into the gutter (right = 319). | `shots/crepes-hero-280.png`, `shots/crepes-hero-320.png` |
| 28 | P2 | Footer contacts | — | The email and phone are plain text, not `mailto:` / `tel:`. On a phone the user has to copy them. They are TBC values, but wire them as links when they are confirmed. | `shots/footer-credits-360.png` |
| 29 | P2 | Empty `Tbc` content | market `name: ''` | Renders a lone "to confirm" tag on its own line ("Where ⟨to confirm⟩"). | `shots/crepes-worst-visit-m360.png` |

---

## Fixes (file + code)

**#1 Instagram with no URL** — `app/app/data/site.ts` + `app/app/pages/crepes.vue:18`
```ts
// site.ts: derive the URL from the handle until the client confirms it
instagram: { handle: '@unamattina', url: 'https://www.instagram.com/unamattina/', tbc: true },
```
```ts
// crepes.vue — never render a dead CTA
const igHref = contact.instagram.url || `https://www.instagram.com/${contact.instagram.handle.replace(/^@/, '')}/`
```
If the handle itself is unconfirmed, hide the three CTAs with `v-if="contact.instagram.url"` and change the sticky bar to `grid-template-columns: 1fr` when Instagram is absent.

**#2 / #3 empty markets or menu** — `pages/crepes.vue:17-19`
```ts
const directions = computed(() => { const m = status.value.market ?? markets[0]; return m ? mapsUrl(m) : undefined })
const featured = menu.flatMap(s => s.items).find(i => i.name === 'Pistachio Bliss') ?? menu.flatMap(s => s.items)[0]
```
Then wrap `.hero__feat-name` / `.hero__feat-note` in `v-if="featured"`. Render "Find us", "Get directions" and the bar's Directions only `v-if="directions"`. Wrap `.visit__markets` in `v-if="markets.length"` with a `<p v-else>Market days are posted on Instagram.</p>`.

**#4 Rotator overflow** — `components/StationRotator.vue` styles + `pages/index.vue`
```css
.plank { max-width: 100%; }               /* keep */
.plank__t { white-space: normal; text-wrap: balance; }   /* allow 2 lines for "COCKTAILS & / MOCKTAILS" */
```
```css
/* index.vue: never let a grid track grow to min-content */
.stations__grid { grid-template-columns: minmax(0, 1fr); }
.stations__text { min-width: 0; }
```
Alternatively, rotate `s.short` and drop the longest label to "Cocktails" (keeping the full name in the sr-only list). Either way, also set `min-height: 2.3em` on `.plank` if you allow wrapping, so the statement below doesn't jump.

**#5 Visit overflow** — `pages/crepes.vue` styles (`.visit__*`)
```css
.visit__grid > * { min-width: 0; }
.visit__dl { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); }
.visit__dl dd { overflow-wrap: anywhere; }
```

**#6 Sent overflow** — `components/InquiryForm.vue:211, 274`
```css
.inq { display: grid; grid-template-columns: minmax(0, 1fr); gap: 48px; }
.sent__body { font-size: var(--step-1); line-height: 1.45; max-width: 44ch; overflow-wrap: anywhere; }
```

**#7 / #25 Header sheet** — `components/SiteHeader.vue:63`
```css
.sheet { max-height: calc(100dvh - 56px); overflow-y: auto; overscroll-behavior: contain; }
```
```ts
// close on outside tap + lock page scroll while open
watch(open, v => { document.documentElement.style.overflow = v ? 'hidden' : '' })
function onDoc(e: PointerEvent) { if (open.value && !root.value?.contains(e.target as Node)) open.value = false }
onMounted(() => document.addEventListener('pointerdown', onDoc))
onBeforeUnmount(() => { document.removeEventListener('pointerdown', onDoc); document.documentElement.style.overflow = '' })
```

**#8 Hydration mismatch** — `composables/useMarketStatus.ts:12`
```ts
const now = useState('naples-now', () => naplesNow())   // client hydrates with the server's value…
onMounted(() => { now.value = naplesNow(); /* …then corrects; interval as before */ })
```
If the site is prerendered (`nuxt generate`), also wrap `<MarketStatus>` in `<ClientOnly>` with a neutral fallback (`<template #fallback><p class="ms">Market days below</p></template>`), so a stale "Open now" is never baked into HTML.

**#9 "Next: Saturday" on a Saturday** — `composables/useMarketStatus.ts:23-25`
```ts
if (s.inDays === 0) return 'Today'
if (s.inDays === 1) return 'Tomorrow'
if (s.inDays === 7) return `Next ${dayNames[s.market.day]}`
return dayNames[s.market.day]
```

**#10 / #24 Contrast in sun** — `assets/css/tokens.css`
```css
--on-accent: #4E2412;   /* was #5B3A2E: 5.13 → 6.76:1 on apricot (all btn-primary, chips, counter) */
--on-field-2: #2E1209;  /* 7.26:1 on sage; use it for small text on sage */
```
```css
/* crepes.vue, index.vue: small text on sage */
.visit, .halves__bloom { color: var(--on-field-2); }
```
Keep `--ink-deep` for display sizes on sage. Credits on `--surface`: `--ink-muted: #6A4734` gives 6.96:1 on surface and 7.7:1 on cream.

**#11 Unbounded inquiry** — `InquiryForm.vue` inputs + `server/api/inquiry.post.ts`
```html
<input id="f-name" maxlength="120"> <input id="f-email" maxlength="254"> <input id="f-phone" maxlength="40">
<input id="f-area" maxlength="160"> <textarea id="f-msg" maxlength="4000"></textarea>
```
```ts
const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '')
const clean = { name: str(body.name, 120), email: str(body.email, 254), phone: str(body.phone, 40), eventType: str(body.eventType, 60),
  date: str(body.date, 10), flexible: body.flexible === true, area: str(body.area, 160), locationType: str(body.locationType, 60), guests: str(body.guests, 20),
  services: Array.isArray(body.services) ? body.services.filter(s => typeof s === 'string').slice(0, 10) : [],
  stations: Array.isArray(body.stations) ? body.stations.filter(s => typeof s === 'string').slice(0, 10) : [], message: str(body.message, 4000) }
```
Validate `clean` instead of `body`. Reject bodies over 32 KB (check `getRequestHeader(event, 'content-length')`). Show a character counter under the textarea from 3,500 chars.

**#12 Data validation** — `data/markets.ts`
```ts
const toMin = (t: string) => { const m = /^(\d{1,2}):(\d{2})$/.exec(t); if (!m) throw new Error(`markets.ts: bad time "${t}"`); return +m[1] * 60 + +m[2] }
// treat close <= open as "closes after midnight": minutes < close + (close <= open ? 1440 : 0)
```
Run a `markets.every(m => m.name.trim())` assert in dev, or in `scripts/check-tokens.mjs`.

**#13 Video failure** — `components/HeroVideo.vue`
```html
<video … @error.capture="mode = 'still'" />
```
```ts
function load() { …; const last = v.lastElementChild; last?.addEventListener('error', () => { mode.value = 'still' }) ; v.play().catch(() => { userPaused.value = true }) }
// toggle():
else { userPaused.value = false; v.play().catch(() => { userPaused.value = true }) }
```
(`<source>` errors don't bubble to `<video>`, so listen on the last `<source>`.)

**#14 Sticky hover** — `HeroVideo.vue:99`, `SiteHeader.vue:60`, `pages/crepes.vue:189`
```css
@media (hover: hover) and (pointer: fine) { .hv__toggle:hover { background: var(--field); } }
.hv__toggle:active { background: var(--field); }
.head__link.router-link-active::after { transform: scaleX(1); }
@media (hover: hover) and (pointer: fine) { .head__link:hover::after { transform: scaleX(1); } }
@media (hover: hover) and (pointer: fine) { .nav__links a:hover { text-decoration: underline; … } }
```
For consistency, also tighten `main.css`, `InquiryForm.vue:265` and `StationCounter.vue:51` from `(hover: hover)` to `(hover: hover) and (pointer: fine)`.

**#15 Strip snap** — `pages/crepes.vue:255`
```css
.morning__strip { …; scroll-padding-inline: var(--gutter); }
```

**#16 Error focus / mailto** — `InquiryForm.vue:69-71, 195`
```ts
catch { state.value = 'error'; await nextTick(); document.querySelector<HTMLElement>('.f__submit .btn')?.focus() }
```
```html
<a :href="`mailto:${contact.email.value}`" class="link">…</a>
```
Better still: use `aria-disabled="true"` plus an early `if (state.value === 'sending') return` instead of `disabled`, so focus never leaves the button.

**#17 Timeout** — `InquiryForm.vue:64`
```ts
await $fetch('/api/inquiry', { method: 'POST', body: …, timeout: 15000, retry: 0 })
```

**#18 Past date** — `InquiryForm.vue:142`
```html
<input id="f-date" … :min="today">
```
```ts
const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' })
```
Also add `if (form.date && form.date < today) e.date = 'That date has passed. Pick a future date or tick “flexible”.'` in `validate()`.

**#19 Chip long-press** — `InquiryForm.vue:257`
```css
.chip__face { …; user-select: none; -webkit-user-select: none; -webkit-touch-callout: none; }
.chip__in:active + .chip__face { transform: translateY(1px); }   /* press feedback on touch */
```

**#20 Counter CTA** — `components/StationCounter.vue:19, 34`
```html
<NuxtLink v-if="chosen.length" :to="to" class="btn btn-primary sc__cta">Ask about {{ chosen.length > 1 ? 'these stations' : 'this station' }}</NuxtLink>
<span v-else class="btn btn-primary sc__cta is-off" aria-disabled="true">Pick a station first</span>
```
Use `:aria-disabled` plus a guard in `toggle()` instead of `:disabled` on the chips. That keeps them focusable, and pressing one at the limit can announce "Three is the maximum. Remove one first." through the existing `aria-live`.

**#21 Price formatting and range** — `components/MenuTable.vue:17`, `pages/crepes.vue:61, 105`
```ts
const usd = new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 }) // 9.5 → "9.50" with min 2 if any decimals
const prices = menu.flatMap(s => s.items.map(i => i.price)); const range = `$${Math.min(...prices)}–${Math.max(...prices)}`
```
Add `white-space: nowrap` on `.mt__price`.

**#22 Many markets** — `pages/crepes.vue`: sort by next occurrence (`markets.toSorted((a, b) => marketStatusFor(a).inDays - marketStatusFor(b).inDays)`), mark the current one with `aria-current="true"` and an apricot rule, and from 4 markets on show day + hours in one line with the address folded under `<details>`.

**#23 Tap targets** — the matching component styles
```css
.nav__logo, .head__logo { padding-block: 13px; }                 /* 17–18 → 44 px */
.visit__dir, .home__more, .px__all, .stations__link, .halves__link, .where__link, .origin__links .link { display: inline-block; padding-block: 9px; }
.foot__list { gap: 0; } .foot__list .link { display: inline-block; padding-block: 11px; }   /* SiteFooter.vue */
```
Credits inside the paragraph are inline text links (a WCAG 2.5.8 exception). Leave them, or move them into a `<details>Photo credits</details>` list to shorten the 1,544 px footer.

**#26 Meta** — `nuxt.config.ts` `app.head`
```ts
meta: [
  { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
  { name: 'theme-color', content: '#F6D67A' },
],
```
Use `#F4A878` per page on /crepes with `useHead({ meta: [{ name: 'theme-color', content: '#F4A878' }] })`. With `viewport-fit=cover`, also add `padding-inline: max(var(--gutter), env(safe-area-inset-left))` to `.wrap` for landscape.

**#27 Fold cover** — `pages/crepes.vue:195`: `font-size: clamp(3.5rem, 21vw, 9rem);` (the 21vw term already scales; the 4.75rem floor is what overflows below 330 px).

**#28** — `SiteFooter.vue:23-24`: `<a :href="`mailto:${contact.email.value}`">`, `<a :href="`tel:${contact.phone.value.replace(/[^\d+]/g, '')}`">`.

**#29** — `Tbc.vue`: when the slot text is empty, render the note: `<slot>{{ note }}</slot>`. Or skip rendering the market until it has a name.

---

## Part 2 — Decisions for you

- **Instagram CTA when the handle is unconfirmed:** hide it (my recommendation) or link the placeholder handle. A dead button on a QR page is worse than no button.
- **Rotator long name:** wrap to two lines, or shorten to "Cocktails". I recommend shortening, because the plank is a sign and two lines read as a paragraph.
- **Markets list ≥ 4:** a compact one-line-per-market list with the next one first, versus the current tall blocks.
- **MarketStatus with prerendering:** ClientOnly with a fallback (no wrong status ever), versus SSR with `useState` (status in HTML, possibly stale). For a QR page used live at the stand, use ClientOnly.
- **`btn-primary` text colour:** changing `--on-accent` to logo brown changes every apricot chip and button sitewide. That is a brand call, but it is the cheapest sun-legibility win.

## Part 3 — What held up

- **No horizontal overflow** with current data at 360/390/412/768 on any of the four pages (scrollWidth = viewport).
- **Inputs never zoom**: all text inputs, the date input and the textarea are 16.08 px. Only the "flexible" checkbox is 15 px, and checkboxes don't trigger zoom.
- **No `100vh`** anywhere; `svh` on the hero and `dvh` on the crêpes layout. `-webkit-tap-highlight-color: transparent` and `text-size-adjust` are present. `touch-action: manipulation` is on `.btn`, the pillar rows and the counter chips.
- **Double submit**: double-click plus Enter in two fields sent **1 request**. The form keeps all answers after a server error, and the error is announced (`role="alert"`).
- **Validation**: an empty submit focuses `#f-name`. Errors clear live after the first attempt. Arrow keys move within the radio chips, and every chip shows a visible 3 px focus ring. The tab order follows the visual order.
- **Non-Latin, RTL and emoji** (李小龍, السلام, 🌸) in name and area render correctly. "Thank you, Aleksandra." picks the first name properly. The summary uses `overflow-wrap: anywhere` and handles all chips selected.
- **5,000-char paste** stays in a 140 px textarea with vertical resize; no layout jump.
- **Menu table** handles 60-char names, 3-digit prices, empty notes, a two-letter name ("Jo") and a long section title without breaking columns (`shots/crepes-worst-menu-m360.png`).
- **`marketStatus()`**: open, later today, tomorrow and 2–6 days out are all correct, including the open-boundary minute (08:00 open, 12:00 closed) and two markets on the same day.
- **Long, CJK and diacritic market names and addresses** wrap cleanly. The Tbc tag wraps as a unit.
- **Video**: the poster shows when the video 404s or autoplay is blocked (no blank hero). Reduced motion and Save-Data skip the download.
- **StationCounter** enforces the max of 3 correctly, and deselect works. **PillarExplorer** rows are 50 px tall with `:active` feedback and no hover dependence.
- **Sticky bar** on /crepes clears the footer (96 px bottom padding) and hides on ≥600 px.

## Needs a real phone

Sticky hover (#14) and chip long-press (#19) were inferred from CSS plus emulation. Safe-area (#26), the iOS status bar colour, and how the sticky bar sits with Safari's bottom toolbar (tested only with `env()` = 0) need a device. Whether Lightning CSS emits `-webkit-user-select` for `.btn` couldn't be confirmed from the Chromium CSSOM. Check `.btn` long-press in iOS Safari.

Test scripts (scratch, not in the repo): `audit.cjs`, `crepes-worst.cjs`, `crepes-states.cjs`, `inquire.cjs`, `home.cjs`, `rot2.cjs`, `header.cjs`, `strip.cjs`, `ms-test.ts`.
