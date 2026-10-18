# Hidden placeholders (Events polish, 2026-10-18)

Nothing below is visible on the site any more. Every item is still findable in code or in the DOM, so it can be
swapped in when the client confirms it.

How to find them:
- `grep -rn "<Tbc" app/app` or `document.querySelectorAll('[data-tbc]')` (the note is in `data-tbc-note`)
- `document.querySelectorAll('[data-shoot-slot]')` (value = what to photograph)
- `document.querySelectorAll('[data-concept]')` (value = the AI mockup file)
- `confirmed: false` in `app/app/data/site.ts`

## Mechanisms changed

| File | Before | Now |
|---|---|---|
| `components/Tbc.vue` | brown "to confirm" chip, dashed underline, tooltip, sr-only "(to confirm)" | renders only its content in `<span data-tbc data-tbc-note="…">`; nothing visible or announced |
| `components/ConceptImage.vue` | visible label "Concept image · placeholder" | no label; `data-concept="<src>"` on the figure; alt text now starts "Illustration of …" |
| `components/ShootSlot.vue` | apricot/yellow/sage box with "Styled shoot coming: …" + "This space is for a real photograph." | wordless brand panel, `aria-hidden`, `data-shoot-slot="<subject>"`: motif `sun` (half-sun rising out of the lower edge, rises once on view) or `mark` (close crop of the A mark) |
| `components/FoundPhoto.vue` | italic caption ("… Not our station." etc.) + credit with title-less links | caption prop optional (no page passes one); one small credit line "Photo: creator, licence" (links) |
| `components/HeroVideo.vue` | "Video: Sunset through Palm Tree, CC BY 2.0 (trimmed and looped). Not a Una Mattina event." | "Video: Johann Mynhardt, CC BY 2.0" (links), 13 px |
| `components/SiteFooter.vue` | email + phone with "to confirm" chips; fine print "Images labelled 'Concept image' are placeholders … not our events" | email / phone render only when `confirmed: true` (both hidden now); "Send us an inquiry" link is the contact; Instagram `@unamattina` shown, still wrapped in `<Tbc>`; a "Photo and video credits" disclosure (`<details>`, one click) with title, creator, licence and changes — what CC BY / BY-SA require; every photo also keeps its own "Photo: creator, licence" line |
| `data/site.ts` | `tbc: true` flags, phone `(239) 000-0000` | `confirmed: false` flags; phone value emptied (no fake number in the code either) |

## Per page

| Page / file | Hidden | Where it lives now |
|---|---|---|
| Home `pages/index.vue` | captions "A crêpe on a classic griddle. Not our station.", "Clam Pass Beach … not one of our setups.", "A flower-market stall. Not our cart.", "Naples Pier at dusk. Not a Una Mattina event." | removed (credit line stays) |
| Home | "Concept image · placeholder" on the market-tent mockup | `data-concept="/img/placeholder/booth.webp"` |
| Home hero | "Not a Una Mattina event." in the video credit | removed |
| Services `pages/services.vue` | caption "Sicilian cannoli. Not our station." | removed |
| Live stations `pages/live-stations.vue` | "Descriptions to be confirmed." (with chip) | removed; `data-tbc data-tbc-note="station descriptions"` on the station list |
| Live stations `components/LsStationList.vue` | 4 × "Styled shoot coming: tiramisu bar / fruit cup bar / charcuterie / cocktail & mocktail bar"; 2 × "Not our station." captions | brand panels (`data-shoot-slot`), the sun climbs station by station; captions removed |
| Luxury picnics `pages/luxury-picnics.vue` | FAQ "What if the weather turns?" answered "Our weather and rescheduling plan" (+ chip) | item kept in the `faq` array with `tbc: true`, filtered out of the page (`faqShown`) |
| Luxury picnics | "Styled shoot coming: sunset beach picnic" | brand panel (setting sun), `data-shoot-slot="sunset beach picnic"` |
| Luxury picnics | caption "Clam Pass Beach, Naples. A public beach, not one of our setups." | removed |
| Bloom Cart `pages/bloom-cart.vue` | "Styled shoot coming: Bloom Cart at a shower"; caption "… Not our cart, and not a Una Mattina event." | round 5: the credited flower photo fills that sticky frame (`data-shoot-slot="Bloom Cart at a shower"` on its wrapper); caption removed |
| About `pages/about.vue` | "Founders' names, photo and story to come." (+ chip); "Styled shoot coming: Founders' portrait"; "Concept image · placeholder" on the apron; caption "Amalfi lemons on a wall in Italy. Not a Una Mattina photo." | sentence replaced with copy.md's own line ("The same team you meet at the crêpe stand … plans, styles and serves your party.") + "Come and say hello at the market" link; portrait slot = A-mark panel `data-shoot-slot="founders' portrait"`; apron `data-concept`; caption removed |
| Inquire `pages/inquire.vue` | "We reply within two business days (to confirm)" in the hero; "Usually within two business days (to confirm)" in What happens next | rendered only when `contact.replyTime.confirmed` (hidden now) |
| Inquiry form `components/InquiryForm.vue` | success "We'll write to … within two business days (to confirm)"; error "… or write to hello@unamattina.com (to confirm)" | reply time and email appear only when confirmed; until then "send again in a moment." |
| Footer | see above (email, phone, placeholder sentence) | — |

## Round 4 (final review)
| Page / file | Hidden | Where it lives now |
|---|---|---|
| Footer (`components/SiteFooter.vue`) | Instagram `@unamattina` | renders only when `contact.instagram.confirmed` and a URL exist (both off); /crepes decides for itself |
| Home "Still at the market", About "Market, today" | `<MarketStatus>` ("Next market: Tomorrow, 9 am – 1 pm" / "Open now") computed from placeholder `data/markets.ts` | rendered only when `markets.some(m => !m.tbc)`; until then the neutral line "Find us at the Naples farmers markets." |
| Luxury picnics | the wordless 3:2 sun panel | an apricot "Where we set up" signboard (places from copy.md), still `data-shoot-slot="sunset beach picnic"` |
| Live stations | four wordless apricot panels | signboard panels with the station's name painted on, apricot / yellow alternating (`ShootSlot label`) |
| Inquire summary | six "Not yet" rows | one line "Your answers appear here as you go."; rows appear as they are answered |

## Still visible on purpose
- Station descriptions (data/stations.ts): shown as written, marked `data-tbc` internally.

## Not mine (/crepes, owned by the /crepes agent)
`pages/crepes.vue` had "Menu and prices to be confirmed." in an earlier version; the current file no longer renders it
(rendered-HTML grep of /crepes for "confirm|placeholder|TBC|Concept image|Styled shoot|000-0000" is clean). /crepes
already hid its Tbc chips in `layouts/crepes.vue`; with the new Tbc those rules simply match nothing.
