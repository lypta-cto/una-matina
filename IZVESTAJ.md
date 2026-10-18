# Una Mattina — jutarnji izveštaj

**Dev:** http://localhost:3001 (Events) · http://localhost:3001/crepes (QR landing)
**Build:** `npm run build` prolazi (check:tokens ok). CLS 0,000 na svim stranicama u produkcijskom buildu, bez grešaka u konzoli i bez horizontalnog skrola od 320 do 2560 px.
**Snimci:** `screens/final-*-{desktop,mobile}{,-fold}.png` · snimci animacija: `review/motion-frames/`, `review/crepes-motion/`

## Stanje (ocene nezavisnih revizora)

| Stranica | Ocena | Presuda |
|---|---|---|
| /crepes | 8/10 vs mornibali (≈9 sa novom hero slikom) | spremno; QR ne štampati pre potvrde marketa |
| Home | 8,5 | spremno |
| Inquire | 8 | spremno |
| Services, Live Stations, How We Work, About | 7,5 | spremno |
| Luxury Picnics, Bloom Cart | 7–7,5 | spremno (ceo svoj potencijal dostižu tek sa pravim fotkama) |

Unutrašnje stranice ograničava to što nema pravih fotki. Revizori kažu da posle styled shoota sve skače za 1–1,5 poen.

## Šta je urađeno preko noći
- **/crepes (6 krugova):**
  - hero kao kod Morni, sa tvojom slikom: CRÊPES izlazi slovo po slovo, a „^" pada poslednji; slika se smiruje iz blagog zuma; hero se na izlasku „zatvara kao zavesa";
  - „Open now" puls (samo dok je market zaista otvoren) i cene koje se vrte kao cifre;
  - znak A koji se okreće u kornet;
  - „Made in front of you" kao zalepljena sekvenca kroz detalje tvoje slike, sa finalom u kornetu;
  - meni sa linijama koje se iscrtavaju;
  - nedeljna tabla marketa sa danima;
  - Instagram blok bez feed-a;
  - wordmark u footeru koji izlazi slovo po slovo;
  - traka za palac na telefonu.
- **Events:**
  - video hero;
  - tanka tenda umesto velike;
  - glatko skrolovanje (Lenis, samo sa mišem) i prelazi između stranica;
  - naslovi izlaze ispod maske, a fotke se otkrivaju odozgo nadole;
  - tri usluge kao zalepljena poglavlja preko celog ekrana;
  - „točak" prilika i stepenice sa koracima posle upita;
  - zalepljene table sa trakom napretka na How We Work;
  - brojač stanica sa „oprugom";
  - forma sa pregledom „Your event so far";
  - Services i Bloom Cart imaju svoje prve ekrane.
- **Kvalitet:**
  - prave težine Montserrata (400–700);
  - slike u pravim veličinama (webp, `sizes`), fotke sa Wikimedije u punoj rezoluciji, video 1920 za velike ekrane;
  - pristupačnost: fokus vidljiv svuda, tastatura, smanjen pokret, sve radi i bez JS-a;
  - API odbija neispravne i prevelike upite.
- **Placeholderi:** svi vidljivi „to confirm" i „placeholder" su sklonjeni. Interno su obeleženi `data-tbc`, `data-shoot-slot` i `data-concept`, a spisak je u `review/hidden-placeholders.md`.

## Šta treba da potvrdite ti ili klijentkinja (pre lansiranja)
1. **Marketi** (`app/app/data/markets.ts`): nazivi, adrese, dani i sati. Do tada `/crepes` prikazuje primer (subota 8–12, nedelja 9–1) kao da je stvaran, a dugme „Get directions" otvara opštu pretragu. **QR se ne štampa dok se ovo ne potvrdi.** Na Events stranicama status marketa se ne prikazuje dok bar jedan market nije potvrđen.
2. **Instagram:** handle i URL (`data/site.ts`). Do tada `/crepes` prikazuje handle kao tekst, bez dugmeta „Follow".
3. **Email, telefon i rok za odgovor:** sakriveni su dok se ne potvrde; kontakt ide kroz formu.
4. **Gde stižu upiti:** `server/api/inquiry.post.ts` validira i loguje, ali ne šalje dalje. Treba ga povezati sa emailom ili CRM-om.
5. **Meni i cene** (`data/menu.ts`): imena i cene su sa makete table. Opise punjenja smo napisali mi.
6. **Opisi stanica** (`data/stations.ts`) i naslovi koje su napisali agenti: „Sweet, savory, folded hot", „Come find the griddle", završna rečenica sekvence „Then it is yours. / Enjoy it on the walk around the market.", „Still at the market".
7. **Domen** (`site.config.ts`: `unamattina.com` je pretpostavka).
8. **Zvanične boje logoa:** PNG logo ima tamniji braon i prigušeniji apricot od palete.
9. **Script font** za „Good Food, Brighter Days": Mrs Saint Delafield je zamena.

## Preporuke
- **Hero slika za /crepes:** kompozicija je skoro kopija Morni fotke (konobar, zvono za kolače, bokal, latte, peškir), što je rizik za autorska prava. Pored toga prikazuje kafić, a ne štand. Predlog: nova generacija sa vašom kompozicijom (ploča za krep i papirni kornet, napolju, jutarnje svetlo), **≥ 3344 px širine**. Sekvenca „Made in front of you" koristi istu sliku, pa će i ona postati oštrija.
- **Pravi vektori logoa:** wordmark je trasiran iz PNG-a, a znak „A" je nacrtan geometrijski. Za štampu (QR nalepnice, kecelje) tražiti originalne vektore od dizajnera.
- **Styled shoot:** mesta za fotke su obeležena (`data-shoot-slot`): sunset beach picnic, Bloom Cart na showeru, 4 live stanice, portret osnivača, štand na marketu.
- **Provera na pravom telefonu** (iOS i Android): zalepljene sekvence, „sticky hover" i safe-area.

## Fajlovi
`brief.md` · `PRODUCT.md` · `design-direction.md` (Pravac 2 „Lido") · `DESIGN.md` · `copy.md` · `section-plan.md` · `references/` (`sections-catalog.md`, `section-library.md`) · `review/` (svi pregledi i verifikacije) · `build-log.md` (pun dnevnik) · `app/` (Nuxt)
