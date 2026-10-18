# Sections catalog — Luka's references, round 2

Captured 2026-10-17 with `builder/scripts/capture-refs.mjs` (desktop 1440×900, mobile 390×844), plus scroll and timing probes in headless Playwright.
Each folder holds `desktop*.png`, `mobile*.png`, `tokens.json` and step-by-step viewport shots (`scroll-NN.png` desktop at 0.85 vh steps, `scroll-m-NN.png` mobile, plus named extras such as `agrovas/scroll-nav-scrollup.png`, `beanro/scroll-video-0..3.png`).
Measurements are computed styles at 1440 px unless stated. These are **decisions, not identity**: no text, logos or images get copied.

Verdict key: **TAKE** = use the decision, translated into Lido (`DESIGN.md`) · **PARTIAL** = use one part only · **SKIP** = don't use, with the reason.

Hard rules that drive the verdicts (brief + DESIGN.md): no invented proof (testimonials, ratings, client logos, stats, "12k+ customers"), no event prices, images are labelled placeholders or credited found photos, stripes only in the awning and small strips (never behind text), square corners, no shadows and no gradients, Montserrat caps for signboard headlines, Playfair Italic only for whole sentences.

---

## 1. agrovas.framer.website (agritech template, Framer)
Tokens: Geist 500 everywhere; H1 64/67 px −3.5 px tracking, H2 48/50 −2 px, H3 36, body 16/25.6 `#4f4f4f`, labels 14 px inside 100 px-radius outline pills. Ground `#f6f6f3`, sage tint `#e6eee5`, ink `#131509`, accent lime `#caf036`. Radius 12 (buttons) / 16 (cards and images). Side gutter 88 px (content 1264 px). Motion: every block fades up 20–40 px at opacity 0→1 when it enters (Framer appear); colour transitions 0.4 s.

1. **Hero with video** (0–900, 100 vh). *Role: hero.*
   - Full-bleed `<video autoplay muted loop playsinline preload="auto">`, mp4 1920×1010, **6 s loop, 8.5 MB, no poster**, `object-fit: cover`, centred crop. Footage: two people in a greenhouse, slow handheld, natural movement.
   - Scrim: one layer, `linear-gradient(transparent 20%, #263415 100%)` (dark green, bottom-heavy). The top 20 % is untouched, so the nav sits on the raw footage.
   - Copy: centred stack in the lower half (top of stack at y≈467): rating row (4.7 ★ + "12k+ satisfied customers", 14 px), H1 64 px white in 2 lines (606 px wide), sub 18/28.8 `#f6f6f3` 480 px wide, one white button 175×46, radius 12, at y≈754.
   - Nav over the video: logo left, 4 links 14 px, dark "Get started" button right, 86 px tall, transparent background. It is **fixed with headroom behaviour**: hides on scroll down (translateY −90 px) and comes back on scroll up with a solid white bar (`scroll-nav-scrollup.png`).
   - Mobile: the hero shrinks to 587 px (~70 svh), the video re-crops to the centre, H1 is 38/40 px in 3 centred lines, nav = logo + burger. No pause control and no reduced-motion fallback.
   - Why it feels modern: real motion fills the whole first screen; text sits low, so the footage reads first.
   - **Verdict: TAKE the mechanism, PARTIAL on composition** → Events Home. Take: full-bleed muted loop as the first field, nav that hides and returns, a single primary CTA, a lower-left text anchor. Skip: the rating row (invented proof), the centred pill + headline + button stack (generic), the gradient scrim (DESIGN bans gradients), the 8.5 MB file with no poster. See "Video hero spec".
2. **Keyword marquee** (950–1000). A 50 px band on `#e6eee5` with 7 feature phrases separated by logo glyphs, infinite linear marquee. **SKIP**: buzzword filler and a template cliché. The scalloped awning valance already does the "decorative band" job.
3. **Tabbed solutions** (950–1789). Left 4 cols: pill label, H2 48 px, then a **vertical text tab list** (4 items, 16 px; active item = 100 % ink with a 24 px dash, inactive = 50 % opacity). Middle: tall image 464×579 r16. Right: small image 281×328 plus a 16 px paragraph. Clicking a tab swaps the images and the text. Fade-up 20 px. **TAKE the mechanism** → Live Stations or Home: 6 station names as signboard rows (`title` size). The active row gets an apricot fill and swaps one square placeholder frame. Works without photos and keeps all 6 names visible.
4. **"Our story"** (1789–2909). Centred H2 with two short centred paragraphs and an icon divider, then a white card (r16) with centred text next to a photo, on a faint line-pattern gradient field. **SKIP**: centred filler, a founder name used as decoration, card + gradient.
5. **Why choose us** (2909–4130). A small 14 px label in the left 3 cols and a large 30 px grey statement across the right 8 cols, then a 2×2 grid of white icon cards (icon, title, text, "Read more"); the 4th card is dark with a CTA. **PARTIAL**: take only the *small label left + big statement right* asymmetry (as a `statement` in Playfair Italic). The icon cards are a banned pattern.
6. **CTA banner** (4130–4719). r24 band over a blurred photo with a centred pill, H2, 3 bullets and a button. **SKIP**: generic mid-page CTA, blur and gradient.
7. **Testimonials** (4719–5479). Centred H2 and a carousel of portrait + quote cards with arrow buttons. **SKIP**: invented proof.
8. **Split with checklist** (5478–6415). Sage-tint field: H2, text and button left, 3 checklist rows in white cards, tall photo right (646 wide). **SKIP**: checklist cards are filler. Coloured-field splits are already in our system.
9. **Impact stats** (6415–7562). Full-width photo r16 with 4 stats on the bottom; digits **roll like an odometer** when the block enters. **SKIP**: stats would be invented. (The rolling digits could later animate a real countdown on /crepes. Optional, not needed.)
10. **How it works** (7562–8244). Label + H2 left, button right; **4 equal image cards** (301×351 r16) with a 2-line title on a bottom gradient. **PARTIAL**: keep the *4 steps in one row with a header row above* → How We Work. Use numbered painted boards (flat fields, sign-m numerals), not photo cards with gradients.
11. **Blog** (8244–9105): 2 post cards. **SKIP**: no blog.
12. **Final CTA** (9105–9738): photo band r16 with a rating pill, white H2 and a button. **SKIP**: rating plus gradient over the photo.
13. **Footer** (9738–10116): newsletter field, 3 link columns, bottom bar with logo, ©, socials. **SKIP**: we have no newsletter. Our footer is defined in DESIGN.md.

## 2. beanro.framer.website (cold-coffee template)
Tokens: display **Boldonse** caps 70/105 (hero), 48/72 (H2), 72/108 (statement); **Bayon** 32/35 for card titles and FAQ; Manrope 16–18/27 body. Brown `#7d2c0f`, rust `#af4f28`, orange `#ff8342`, cream `#fcf7ee` / `#f9eedc`, yellow `#fed16a`, green `#485f4e`. Radius 32 (panels), 24, 100 (pills); light shadows on buttons. Faint 5-column vertical guide lines run behind the whole page. Fixed 143 px header (announcement bar + nav).

1. **Announcement bar** (0–47): brown, caps 18 px line + link + close ✕. **SKIP**: e-commerce pattern. /crepes gets its own live "where we are" status instead.
2. **Header** (47–143): links left, **centred logo**, orange pill CTA right; sticky. **SKIP**: DESIGN.md puts the wordmark left with one apricot "Inquire" button.
3. **Hero** (143–898): centred 2-line display caps 70 px brown on cream; an AI product cut-out (cup with splash) overlaps the headline bottom and is cropped by the fold. Static. **SKIP**: centred stack, AI splash render, nothing honest to cut out.
4. **About statement with inline images** (1058–1537): orange caps label, then 4 centred lines of 48/72 caps with **photos set inside rounded capsules between words** (image-in-text, ~130×80 px chips sized to cap height). **TAKE** → Events Home intro: one `sign-l` sentence ("We plan · We design · We create…") with 2 **square** chips in the line, one with the A-sun mark and one with a labelled placeholder. Left-aligned, not centred. (Same family as coloniazacamil's "image in the hole of the sentence"; 2 references agree.)
5. **Signature brews grid** (1697–3271): r32 panel; H2 left with a caps note right; 3 filter pill tabs; 3×2 product cards (r24, star rating, cut-out, Bayon name, price, "Get this brew →"). **SKIP**: ratings are invented, and this is a template product grid. On /crepes a Sweet/Savory toggle would hide half the menu from someone standing in the queue, so show both lists.
6. **Pinned video that grows on scroll** (3431–5572, sticky 1641 px over 2141 px of scroll). H2 caps centred, then a muted loop video (1920×1080) whose wrapper **scales 0.5 → 1.5 (440×250 → 1320×750) and fades 0.5 → 1, linked to scroll**, r60 at small size. Small caps labels ("smooth cold brew", "balanced sweetness") sit in the corners and drift. **TAKE** → Live Stations page opener: a framed "cabana window" of griddle footage grows from 6 columns to full width under the awning while pinned. Use `clip-path: inset()` instead of scale + radius (square corners), and put station names in the corners as small `title` labels on cream chips. Reduced motion: static full width.
7. **Statement + word rotator** (5732–6645): brown r32 panel with 4 lines of 72/108 white caps. One slot is a tilted orange sticker whose word **flips in 3D (rotateX, ~2 s cycle: "CHILL UP" → "LIGHT UP" …)**, and 4 tilted pill stickers wobble with scroll (rotate ±15° → ±12.5°). **PARTIAL**: take the **word rotator** → Home stations teaser: "Made in front of your guests: [CRÊPES / TIRAMISU / CANNOLI / FRUIT CUPS / CHARCUTERIE / COCKTAILS]". The slot is a straight apricot board (sign-m, brown ink) and flips vertically like a lido sign being turned. `aria-live="off"`, the full list in visually-hidden text, reduced motion = static list. Skip the tilted stickers: sticker language is a trend that doesn't belong to the brand.
8. **3 value cards** (6805–7224): cream r32 cards, big numbers 01–03 in a badge, title, text. **SKIP**: a row of identical value cards.
9. **Testimonial marquee** (7384–8109): cards with 5 ★ and anonymous "— A Loyal Patron" caps quotes, auto-scrolling. **SKIP**: invented proof.
10. **Image + text split** (8269–8789): photo 675 wide with asymmetric radius (64 on one side), H2, text and pill button; the image reveals from blurred to sharp. **SKIP**: generic split, and the blur reveal is costly and off-brand.
11. **FAQ accordion** (8949–9923): H2 left, caps note right; 5 full-width rows (cream r32, Bayon 32 question, orange ↓ arrow); answers 18/27 at max 602 px; rows fade in with a stagger. **TAKE** → Picnics, Bloom Cart, Live Stations, Inquire: the brief has real worries to answer (permits for beach/park, weather, guest count, how pricing works without listing prices, dietary needs). Translate: square signboard rows with 1 px `line` rules, question in `title` 600, a "+/−" sign, native `<details>`.
12. **CTA on painted bars** (10083–10793): 2 headline lines in 64/96 cream caps, **each line on its own flat colour bar** (brown, rust), tilted ~2°, flanked by 2 cut-out drinks; sub 18 px and an orange pill button. **TAKE (straightened)** → Home closing CTA and Inquire teaser: each line of the `sign-l` headline sits on its own flat apricot or yellow plank, brown ink, no tilt, square. Literally a lido signboard. Skip the cut-outs.
13. **Word marquee band** (~10800): orange band with huge cream caps words and dot separators. **SKIP**: same cliché as agrovas 2. Cream on orange is also below 3:1.
14. **Footer**: brown field, logo + tagline, 3 columns of Bayon caps links, © bar, **giant clipped wordmark** at the bottom. **Confirms DESIGN.md** (brown field + full-width stacked wordmark). Nothing new to take.

## 3. lattetemplate.framer.website (Latte Haven café template)
Tokens: Poppins only. H1 58/69.6 600, H2 42/50, H3 24/33.6, item 16/20.8, description 14/18.2 `#383838`. Ground `#fffbf0`, panel `#fff5e0`, ink black. Radius 32 (panels, images), pill buttons in black. Section gap 120 px, panel padding 40 px. No motion except the carousel.

1. **Header**: hand-lettered logo left, 2 links right, fixed. **SKIP**: generic.
2. **Hero**: centred "Google ★★★★★ (4.9)" pill, H1, sub, black pill button; below, a **coverflow carousel** of 5 photo cards (centre 388×540 raised 48 px, sides smaller, edges faded by a radial-gradient mask) with ‹ › buttons. **SKIP**: invented rating, centred stack, a carousel that hides content, AI photos.
3. **Menu with sticky photo, zig-zag** (1148–4400). 4 category blocks. Each pairs a **menu panel** (`#fff5e0` r32, 40 px padding; category H3 24; rows = name 16/600 left, price 16 right, 14 px description below, 87 px row pitch, no rules) with a **sticky photo 640×720 (sticky top 40 px)** labelled by a pill. The sides alternate left/right per category. **TAKE the sticky-photo-beside-list mechanism** → Live Stations: each station is a signboard (what it is, the options, what we need on site; no prices) next to a sticky square placeholder frame (`Styled shoot coming: crêpe station`), alternating sides. Mobile: frame above the board, not sticky. Also → Inquire: the sticky right column holds the "your event so far" summary. Skip the r32 panels and pill labels.
4. **News**: 3 blog cards. **SKIP**.
5. **About + location panel**: r32 panel with photo left, logo, H2, text, address and button. **SKIP**: generic. /crepes covers address and hours better (see mornibali 6).
6. **Footer with map**: hours, phone and address list left, a **Google Maps iframe** 600×680 right. **PARTIAL**: the hours list layout only. Skip the map embed: the brief says link to Maps, no embed (weight + cookies).

## 4. mornibali.framer.website (all-day breakfast café, Bali; Luka's pick for /crepes)
Tokens: display **Mona Sans** caps, H2 104/93.6 −1 px, hero 190/163 (mobile 92/79); statements 34/38 sentence case; dish names 26/28.6; body Inter 17/25.5; labels Inter 13/600 caps +0.9 px. Cream `#f2e9da`, wine `#6a1b2a` (only ink), pink `#e6aeb9`, sky `#a8cbe8`, olive `#bfc76b`, dark `#2f1c14`. **Radius 0 on images and fields**, 100 only on buttons. No shadows. Gutter 48 px (mobile 20), section padding 120 px. Every section is a **flat full-width colour field**: cream → pink → wine → cream → sky → wine. This is the closest of the four to Lido.

1. **Hero** (0–900 = 100 vh; mobile 100 svh). Full-bleed photo (cover) under a 4-stop **gradient shade** `rgba(47,28,20)` .50 → .08 → .12 → .72. Nav: logo left, **centred wine pill with 3 links**, cream "Find us ↗" pill right. Bottom-left: 34 px greeting + **190 px caps headline** + 20/27 intro (400 wide). Bottom-right: a **featured dish card** (26 px name, 17 px description, 13 px caps meta line "PLACE ◆ OPEN DAILY 7:00–17:00"). Static. Mobile: the text stack moves to the top (H1 92 px), the photo shows below, nav = logo + Find us + burger.
   **TAKE composition** → /crepes first screen: greeting + giant status lower-left, "featured crêpe + place ◆ hours" meta lower-right (on mobile stacked under it). Translate onto a **flat apricot field under a short yellow awning, no photo and no gradient**: `statement` "Buongiorno," + `sign-xl` "AT [MARKET] TODAY" + hours + primary "Get directions" + secondary "See the menu". The "Find us ↗" pill → "Get directions ↗" rectangle top-right.
2. **About** (900–2004, cream). 13 px caps label; **H2 104 caps across 8 cols left, a 34 px statement + 17 px paragraph in the right 4 cols**. Then a **staggered 3-photo row** (370 / 555 / 370 wide, vertical offsets 0 / +160 / +80) with a hand-drawn cup sticker rotated −9° that moves with **parallax (≈ −0.06 × scroll)**. Photos fade up 28 px from opacity .35. **TAKE the title split** (big caps left, Playfair statement + body right) → Services, Luxury Picnics, About openers. **SKIP** the sticker (we have no illustration language) and the staggered photos on /crepes (weight; no own photos yet).
3. **Menu** (2004–3207, pink field). Label + H2 caps left, a short 17 px note right aligned to the bottom. **2-column list, each row** = 1 px wine rule on top, 16 px padding; name 26 px left; description 17/25.5 below (max 389 px); **price 26 px right** with a 13 px caps category under it (SWEET / SAVOURY). Row ≈ 144 px. Wine pill "See the full menu ↗". Mobile: 1 column, same row anatomy, about 160 px per row. **TAKE** → /crepes menu (= the DESIGN.md signboard): yellow or cream-deep field, `Sweet` / `Savory` group titles in sign-m, name in `title` 600, description in Playfair Italic, price right in tabular figures, 1 px `line` rule. Prices 8–11 marked TBC.
4. **Coffee card over photo** (3208–4128, wine field). Photo 645 wide bleeding out of the section at the bottom-left; a **cream card (780 wide) overlapping the photo by ~80 px with a 1 px dashed inset border 16 px inside** (reads as a printed menu card or coupon). Inside: caps label, H2 caps, 17 px paragraph, rule, **3 facts row** (34 px figure + 15 px caption). **TAKE the overlap** → Events Home video hero: the headline lives on a cream signboard overlapping the video's bottom edge, so text never sits on footage. **PARTIAL facts row**: only verifiable operational facts (e.g. "6 live stations", "1 team from plan to clean-up"), never performance stats. Skip the dashed border (it reads as a coupon, not a lido sign).
5. **One day strip** (4128–5132, cream). H2 caps + note, then a **slow time-based marquee** of photos (≈ 32 px/s linear, infinite, not scroll-linked) with alternating sizes (300×385 / 420×345) and vertical offsets, each captioned **"07:20 · First pour"** (13 px caps time + 15 px label). **PARTIAL** → How We Work: "the day itself" as a clock-time strip of the documented example event (backyard 40th, 50 guests; labelled *example*): "3:00 pm set-up · 5:00 pm Bloom Cart opens · 6:30 pm crêpe station…". Placeholder frames, a **scroll-snap row the user controls** instead of an auto marquee (a marquee hides content and fails reduced motion).
6. **Visit** (5131–5971, sky field). Left 6 cols: label, **H2 caps 2 lines, 1 px rule, 2-col grid of WHERE / WHEN** (13 px caps label + 17/25.5 text), SAY HI email, wine "Get directions ↗". Right: photo 632×830 with a torn-paper edge. **TAKE the WHERE / WHEN grid** → /crepes "This week's markets" (one block per market: WHERE address + Maps link, WHEN day + hours, all TBC). Also agrees with lepetitbleu's where-and-when card from round 1. Skip the torn paper.
7. **Footer** (5971–6685, wine). 34 px statement left, EXPLORE / SAY HI columns right, then a **full-width wordmark 1344×270** with a sun in its O, a 1 px rule and a 13 px caps meta line (© · place ◆ hours). **Confirms DESIGN.md footer.** Take only the closing caps meta line "Naples, FL ◆ Saturday markets (TBC)". Caution: their sun-in-the-letter wordmark is close to our A-sun idea, so use our own logo file as is and do not redraw letters as suns.

---

## Generic patterns rejected (all four sites)
Rating pills ("4.7 ★ 12k+ customers", "Google 4.9") · testimonial carousels and marquees · stats counters · centred pill + headline + button heroes · rows of identical icon or value cards · keyword marquees · blurred-photo CTA banners · blog teasers · newsletter footers · coverflow carousels · AI product cut-outs with splashes · tilted "sticker" pills · gradient scrims · map iframes · Framer template badges.

---

## Proposed section map
Every page starts under the awning (stripes 56/44/28 px, scalloped valance) over a flat field. Stripes are never behind text. Fields: cream ~45 %, one apricot and one yellow band max per page, sage only on Bloom Cart, brown footer. `[own]` = brief / design-direction / DESIGN.md. Counts at the end of each page keep any single reference ≤ ~1/3.

### Events Home (goal: inquiry)
1. Header (wordmark left, 5 links, apricot Inquire), hides on scroll down and returns on scroll up `[ref: agrovas — 1 (nav behaviour)]`
2. Apricot awning → **video hero**: video as the field under the valance, headline on a cream signboard overlapping its lower-left edge, "Start an inquiry" `[ref: agrovas — 1 + mornibali — 4 (board overlapping media)]`
3. Intro sentence with 2 square inline chips (A-sun mark, placeholder) `[ref: beanro — 4]`
4. Three pillars as one signboard table (Planning · Design & in-house florals · Live stations) `[own]`
5. "Made in front of your guests: [rotating station name]" on an apricot board + link to Live Stations `[ref: beanro — 7]`
6. Picnics | Bloom Cart split, yellow field + sage field, one sentence + link each `[own]`
7. "One event, whole": anatomy of the example backyard 40th, pillar toggles `[own — design-direction]`
8. How we work in 4 numbered boards + link `[ref: agrovas — 10, as boards]`
9. From the market: Market → Events → Café + live link to /crepes status `[own]`
10. Closing CTA: headline lines on flat apricot/yellow planks → Inquire `[ref: beanro — 12, straightened]`
11. Brown footer, full-width wordmark, sign-off `[own — DESIGN.md]`
→ agrovas 3/11, beanro 3/11, mornibali 1/11, own 4/11.

### Services
1. Apricot awning + title split: sign-xl caps left, Playfair statement + body right `[ref: mornibali — 2]`
2. Each pillar as a full-width signboard: name sign-l left, "what's included" rows right `[own — DESIGN signboard]`
3. "Take one part or the whole day": choice chips that pre-fill the inquiry `[own — design-direction]`
4. FAQ (rentals, travel area, what happens on the day) `[ref: beanro — 11]`
5. Inquiry CTA band `[own]`
→ mornibali 1, beanro 1, own 3.

### Live Stations
1. Apricot awning + title, then the **pinned "cabana window" video that grows** (griddle footage), station names in the corners `[ref: beanro — 6]`
2. "One elegant base, many concepts": the modular base explained `[own]`
3. 6 stations: signboard beside a sticky square placeholder, alternating sides `[ref: lattetemplate — 3]`
4. "Set up your stations": pick 1–3, they line up under a mini awning → inquiry pre-filled `[own — design-direction]`
5. FAQ (space, power, dietary, staffing) `[ref: beanro — 11]`
6. CTA `[own]`
→ beanro 2/6, lattetemplate 1/6, own 3/6.

### Luxury Picnics
1. Yellow awning + title split with one labelled placeholder frame `[ref: mornibali — 2]`
2. Where: beach · park · backyard · pool as a WHERE / NOTES grid, "permits checked before we confirm" `[ref: mornibali — 6]`
3. What's included as signboard rows (no prices) `[own]`
4. Occasions as a large type list `[own]`
5. FAQ (weather plan, permits, timing, guest count) `[ref: beanro — 11]`
6. Inquiry CTA with "Luxury picnic" pre-selected `[own]`
→ mornibali 2/6, beanro 1/6, own 3/6.

### Bloom Cart
1. Sage awning + title + one Playfair sentence `[own]`
2. How it works: 3 numbered boards (choose stems → we wrap → take it home) `[ref: agrovas — 10, as boards]`
3. Occasions + labelled placeholder ("Styled shoot coming: Bloom Cart") `[own]`
4. Custom details (ribbon, tags, palette) as signboard rows `[own]`
5. FAQ (stems per guest, timing, indoor/outdoor) `[ref: beanro — 11]`
6. CTA `[own]`
→ agrovas 1, beanro 1, own 4.

### How We Work
1. Awning + title `[own]`
2. Small label left, big Playfair statement right ("Simple for you, even if a lot happens behind it") `[ref: agrovas — 5, statement only]`
3. 9 steps compressed to 4 moments, numbered boards on one line `[ref: agrovas — 10]`
4. "The day itself": clock-time strip of the example event, scroll-snap, labelled *example* `[ref: mornibali — 5]`
5. The rule "the person running your event never stands at a station" as a statement `[own]`
6. CTA `[own]`
→ agrovas 2/6, mornibali 1/6, own 3/6.

### About
1. Awning + title split `[ref: mornibali — 2]`
2. Market → Events → Café as three positions of the sun `[own]`
3. "Where it started": the stand, with a live link to /crepes status `[own]`
4. Founders block (TBC, placeholder) `[own]`
5. CTA `[own]`

### Inquire
1. Awning + title + "No packages. Tell us what you picture." `[own]`
2. Single-page form left; **sticky "your event so far" summary right** (mobile: summary collapses above the submit button) `[ref: lattetemplate — 3 (sticky side column)]`
3. What happens next: 3 short boards (reply → call → concept) `[own]`
4. Short FAQ (how pricing works without a price list, response time TBC) `[ref: beanro — 11]`
5. Footer `[own]`

### /crepes (standalone, mobile-first, no main nav)
1. Short yellow awning (64–88 px), small wordmark left, "Instagram ↗" text link right `[own]`
2. **Status first screen** on a flat apricot field: Playfair "Buongiorno," + sign-xl "AT [MARKET] TODAY · 8–1" (or "NEXT: SAT 8 AM, [MARKET]"), full-width "Get directions", then "See the menu" `[ref: mornibali — 1 composition, no photo]` + "where we are this morning" logic `[own]`
3. Menu signboard: Sweet / Savory, name · Playfair description · price right, 1 px rules, "menu to be confirmed" `[ref: mornibali — 3]`
4. This week's markets: one WHERE / WHEN block per market with a Maps link `[ref: lepetitbleu (round 1) + mornibali — 6 label format]`
5. Instagram band: handle in sign-m + Follow button `[own]`
6. "We also do events": one sentence + link to Home `[own]`
7. Brown footer, stacked wordmark, "Good Food, Brighter Days" `[own — DESIGN.md]`
→ mornibali 2.5/7 (hero composition, menu rows, half of the markets block) ≈ 1/3. Luka wants mornibali as the model for /crepes. We take its **structure and rhythm** (flat colour field per section, giant caps status, ruled menu rows, WHERE / WHEN, square corners). Its full-bleed food photo, gradient shade, pink/sky palette and condensed face stay with mornibali.

---

## Video hero spec (Events Home)

**Tension to note:** the brief lists "template event agency (hero video + Services cards + testimonials)" under "what we are not". Video alone does not make that cliché. Video + centred white headline + rating + service cards does. We keep the video and drop the rest: it gets framed by the awning, the text sits on a painted board, and the footage is honest and credited.

**Composition (desktop ≥ 1200 px)**
- Cream header bar (wordmark, 5 links, apricot Inquire), 72–80 px, headroom behaviour (hide on scroll down, solid cream on scroll up). Never transparent over video.
- Apricot awning under it: 56 px stripes, total 120–140 px with a scalloped valance. The scallops **hang over the top edge of the video by one radius** (28 px), so the awning reads as hanging above the field. The awning is DOM/SVG and the video sits on a lower layer.
- Video field: full bleed, height `clamp(520px, calc(100svh − header − awning), 820px)`, `object-fit: cover`, `object-position` set per clip, **square corners, no overlay, no gradient**.
- Signboard: cream `#FFF7EA` block, cols 1–7 (≈ 760 px), padding 40/48 px, anchored bottom-left, **overlapping the video's bottom edge by 96 px** into the cream section below (mornibali-4 move). Inside: `sign-xl` brown caps headline in 2 lines max, one Playfair `statement` line, primary apricot button "Start an inquiry" + text link "See live stations". Text never sits on video, so contrast is constant: brown on cream **9.45:1**.
- Nothing else on the video except the pause control.

**Contrast rule if anything ever has to sit on footage:** only a flat (not gradient) brown `#5B3A2E` tint qualifies. Against a worst-case white frame, cream text needs tint ≥ **0.75** for 4.5:1 (4.62; 0.70 gives only 4.04), and ≥ 0.60 for large text at 3:1 (3.13). That much tint kills the footage, which is why the board approach is the rule.

**Media**
- Sources: `<source type="video/webm; codecs=av1">` + H.264 MP4 fallback. **1280×720, 8–12 s seamless loop, 24–25 fps, no audio track, ≤ 2.5 MB** (agrovas ships 1920×1010, 6 s, 8.5 MB, no poster: don't).
- Mobile file: separate 720×900 (4:5) crop, ≤ 1.2 MB, chosen with `media` / JS on width.
- Poster: first frame as AVIF + JPEG ≤ 120 KB (1600 w). The poster is the LCP element, and the video loads after it (`preload="none"`, start on `loadeddata` after first paint).
- `muted autoplay loop playsinline disablepictureinpicture`. Pause when off-screen (IntersectionObserver).
- **Pause/Play button** (WCAG 2.2.2, moving content > 5 s): 44×44 square cream button bottom-right inside the video, Montserrat 600 label "Pause", `aria-pressed`.
- `prefers-reduced-motion: reduce` or `Save-Data` / slow `effectiveType`: no autoplay. Show the poster still with a "Play" button.
- No-JS: poster `<img>` inside the frame.

**Mobile (< 768 px)**
- Header 56 px, awning 64–88 px (28 px stripes).
- Video field in 4:5 (≈ 390×488) or 56 svh, whichever is smaller.
- Board below the video, overlapping it by 48 px, full width minus 16 px gutters. Headline `sign-xl` ≈ 52–60 px in 2 lines, button full width, visible in the first viewport together with the bottom of the video (agrovas gets the headline into 587 px at 38 px; ours is bigger because the board isn't stacked on the footage).

**Footage (open licence: Pexels / Mixkit / Coverr; we have none of our own)**
- Best fits, one continuous shot, no montage: close-up of hands spreading crêpe batter on a round griddle with a wooden T-rake; a fruit cup being built or berries dropped into glass cups; stems placed into a bucket or flower cart; linen and low table on sand at golden hour with the Gulf behind; striped umbrellas moving in the wind; lemonade poured over ice.
- Rules: warm daylight, locked-off or slow handheld, hands and objects rather than faces, no couples or weddings, nothing that reads as "our event" or "our team".
- Credit under the video (outside it) on a cream-deep chip: "Footage: [creator] / [platform], licence — not a Una Mattina event". Swap for our own styled-shoot footage later in the same frame.

**/crepes: no video.** The visitor is at the market on mobile data in sunlight with about 10 seconds of attention, and the stand is in front of them. A video costs data, battery and the first screen. The status ("where we are now") is the hero. At most one ≤ 150 KB still of a crêpe in a paper cone, and only once a real photo exists.
