# Design direction — Una Mattina

Dve površine u jednom Nuxt projektu: **B `/crepes`** (QR landing sa štanda, prvo) i **A Events & Catering** (ceo sajt).
Svaki pravac ispod pokriva obe površine istim svetom.

---

## 1. Inventar subjekta (samo Una Mattina, ne konkurencija)
1. **Ime = „jedno jutro"** (ital. *una mattina*). Tagline „A Taste of Mediterranean Mornings".
2. **Znak „A" sa izlazećim suncem** — trougao bez prečke + apricot polukrug na osnovici.
3. **Isti znak naopako = kornet krepa** („Same symbol. A brighter day. / A sweeter way.") — znak je i jutro i proizvod.
4. **Cabana pruge** apricot/krem i žuto/krem — kecelja, salvete, tote, stolnjak za limunadu.
5. **Štand na marketu:** krem šator, kredna tabla sa menijem (Sweet / Savory, cene 8–11), korpa limuna, staklena posuda limunade.
6. **Kornet od papira** u kome se krep nosi u ruci; šolja za kafu sa logom.
7. **Hrana koja se pravi pred gostima** — live stations na jednoj modularnoj bazi („one elegant base, many concepts").
8. **Cveće rade sami** — Bloom Cart: gosti biraju stabljike i nose mali buket kući.
9. **Lokacije bez dvorane:** dvorište, pool, plaža, park, zalazak sunca na Golfu — „blank-canvas locations"; za javne lokacije prvo se provere dozvole.
10. **Rast u tri koraka pod istim imenom:** Market → Events & Catering → Café.
11. **Pravilo tima:** osoba koja vodi događaj nikad ne stoji istovremeno za crepe stanicom ili barom.
12. **Primer kompletnog događaja iz dokumenta:** dvorišni 40. rođendan, 50 gostiju — koncept, raspored, cveće, DJ, koktel stanica, crepe stanica, osoblje, koordinacija dana.

## 2. Argument stranica (tvrdnja → dokaz, po sekciji)

### B — `/crepes` (cilj: dođi na štand, zaprati Instagram)
| Sekcija | Tvrdnja | Dokaz |
|---|---|---|
| Prvi ekran | Ovo je Una Mattina, i evo gde smo ovog jutra. | Status „At the market now / Next market: [dan, vreme, mesto]" + „Get directions" |
| Meni | Krep sa Mediterana, slatki ili slani, 8–11 dolara. | Ceo meni sa cenama (za potvrdu) |
| Raspored | Svake nedelje na istim marketima. | Lista marketa: dan, sati, adresa, link na mapu (placeholderi) |
| Instagram | Tu objavljujemo gde smo i šta je novo. | Handle + dugme „Follow" |
| Events (diskretno) | Isti tim radi i proslave. | Jedna rečenica + link ka glavnom sajtu |

### A — Home (cilj: upit)
| Sekcija | Tvrdnja | Dokaz |
|---|---|---|
| Prvi ekran | Privatne proslave u Naples/SWFL, od ideje do poslednjeg tanjira, jedan tim. | Naslov + upit dugme + znak |
| Tri stuba | Možeš uzeti jedan deo ili ceo događaj. | Planning · Design & florals (in-house) · Live stations — svaki sa konkretnom listom |
| Made in front of you | Hrana se pravi pred gostima. | 6 stanica po imenu |
| Posebno | Piknik i Bloom Cart su samostalne usluge. | Lokacije piknika; kako Bloom Cart radi |
| Jedan događaj, ceo | Ne koordinišeš više firmi. | Anatomija primera: dvorišni 40. rođendan, 50 gostiju (iz dokumenta, označeno kao primer) |
| Proces | Jednostavno za tebe, iako je iza scene složeno. | 9 koraka sažeto u 4 trenutka |
| Odakle smo | Počeli smo na marketu. | Market → Events → Café |
| Upit | Nema paketa; reci nam šta zamišljaš. | Forma |

---

## 3. Seed i kandidati (impeccable new-work 1–4)

**Mehanizam:** jedan mali tim od ideje do pospremanja, sa cvećem i hranom koja se pravi pred gostima, bez paketa.
**Scena publike:** domaćin u Naples-u planira proslavu u dvorištu ili na plaži, gleda na telefonu sa Instagrama; posetilac marketa na suncu sa krepom u ruci.
**Rut kategorije:** script zlato + akvarel cveće + „Full-Service Planning in SWFL" + galerija + zvezdice (sva četiri konkurenta). **Predvidljiva suprotnost:** crno-beli minimalistički „luxury studio" sa serifom.

**Sedam kandidata iz sveta publike (po rezonanci):**
1. **Lido / italijanski beach club** — redovi suncobrana, prugasta platna, skalopirana ivica tende, oslikani znakovi. *Izgled:* krem + apricot/žute pruge, ravna tabla-slova. (tekstil)
2. **Štand na marketu** — šator, kredna A-tabla, korpa limuna. *Izgled:* krem platno, tabla, ručno pismo. (literalno čitanje briefa — trošimo samo ovaj jedan)
3. **Jedno jutro (ime)** — sunce koje izlazi, jutro u fazama od prvog svetla do brunča. *Izgled:* ravne trake neba koje se smenjuju, polukrug sunca na horizontu. (svetlo/vreme; literalno čitanje imena)
4. **Event stationery** — meni kartica, place card, tag sa trakom na buketu. *Izgled:* papir, sitna slova, mašna. (papir)
5. **Majolika za doručak (Vietri/Amalfi)** — ručno oslikani tanjiri i pločice sa limunom. *Izgled:* krem glazura, žuta/zelena/apricot boja četkom. (keramika)
6. **Cvećarska kanta sa tagovima** — stabljike u kantama, kartonski tag sa imenom cveta. (cveće)
7. **Zalazak na Naples Pier-u** — ritual aplauza suncu na plaži. (mesto)

**Dodeljen indeks: 3 → „Jedno jutro"** (seed: `seed:398c095fc554faea`).

**Izazivači (fuzionisani sa brendom, presuda):**
| Izazivač | Presuda | Šta pravac dobija (raise) |
|---|---|---|
| Kolajder event display | odbijen (gubi na obe ose) | **Jedan događaj prikazan ceo:** primer „backyard 40th, 50 guests" kao jedna kompozicija; izbor jednog stuba zatamni ostale → postaje živa stvar na Home |
| Cyworld minihompy soba | odbijen | **Izbor menja scenu:** u upitu izabrane usluge vidljivo slažu događaj (rezime „your event so far") |
| Rubber-hose cel | odbijen | **Jedan ritam za sve:** sav motion na jednom easing-u i trajanju; iris → **polukružni reveal (sunce)** |
| Blue Note omot | **konkurentan** (drži jasnoću proizvoda) | → pun alternativni pravac 3 |
| Cyclorama zora | odbijen kao zaseban, ali najbliži donor | **Trake horizonta kao struktura** i **diskretne imenovane faze** (ne gradijent) |
| Ikebana / ma | odbijen | **Asimetrični trougao i napeta praznina** — trougao znaka „A" kao zakon kompozicije, ne simetrično centriranje |

**Impeccable pick:** kandidat 1 (Lido) — rizik: najpoznatiji „italijansko leto" izgled.

---

## 4. Pravci

### Pravac 1 — „Una Mattina" (jedno jutro)  ← dodeljen seedom
**Ideja:** Na ovoj stranici **ime („jedno jutro") i sunce iz znaka A** postaju **horizont**: svaka stranica je jedno jutro u ravnim trakama neba, a apricot polukrug izlazi iz donje ivice sekcija dok skroluješ.
*Test konkurenta:* „KC Weddings postaje horizont jutra" — ne drži; sunce u A i ime su samo njihovi.

- **Tipografija** [brief: Montserrat + Playfair Italic, fiksno]
  - Display: Montserrat **Light 300**, verzal, 9–12vw na desktopu / 15–17vw na telefonu, tracking −0.02em, leading 0.9 — tanko i široko kao wordmark logoa. [skil: taste-skill — headline/body ≥ 4:1; ref: coloniazacamil — ~8:1 skok display/caption]
  - Tekst: Montserrat Regular 17/27px (telefon 16/25). Labele: Montserrat Medium 14px **sentence case** (ne sitni razmaknuti verzal). [skil: taste-skill house rules]
  - Playfair Display Italic: **samo cele rečenice** — izjave (24–32px), opisi jela u meniju, imena faza jutra. Nikad jedna reč u naslovu. [skil: anti-generic — „jedna italik reč"]
  - Script: jedan potpis po stranici, „Good Food, Brighter Days", kao SVG/lettering. [brief]
  - Izuzetak: Montserrat je na listi „AI fontova" — ovde obavezan brendom; karakter nosi Light težina na ogromnoj veličini + znak. [skil: taste-skill special cases — brand]
- **Paleta i proporcije** (strategija: *Full palette*, jutarnje faze) [ref: cyclorama raise; brief paleta]
  - `ground` Cream ~50% · `ink` Brown (sav tekst) · `sun` Apricot (polukrug, primarno dugme, 1 traka po stranici) · `day` Yellow (1 traka „sunce je gore") · `shade` Sage (traka „bašta / hlad", samo krupan tekst — braon na sage = 4.19:1) · Brown kao polje samo za footer („veče").
  - Redosled traka na Home: Apricot (prvo svetlo) → Cream → Yellow → Cream → Sage → Brown. Nikad gradijent, prelaz je tvrda ivica (horizont). [skil: taste-skill — „a section may change the whole field colour, nothing fades"]
- **Hero (A, Home):** levo poravnat naslov u 2 reda preko gornje polovine; dole preko cele širine horizont-linija na kojoj sedi ogroman apricot polukrug (~70vw) — u polukrug je maskirana fotografija (placeholder, označena) [ref: coloniazacamil — slika u obliku slova]; primarno dugme „Start an inquiry" na horizontu desno. Krakovi znaka A u braon idu od horizonta van kadra (asimetrični trougao, vrh odsečen gore desno) [raise: ikebana].
- **Hero (B, /crepes):** isti znak **okrenut** — V/kornet na apricot polju, u njemu status jutra: „At [Market] today · 8 am – 1 pm" najvećim slovima; ispod „Get directions" + „See the menu". Instagram traka odmah ispod.
- **Ritam sekcija:** trake pune širine, svaka sa drugačijom kompozicijom: (1) horizont-hero, (2) tri stuba kao jedna **tabela-lista** (naziv levo krupno, šta ulazi desno, bez kartica), (3) live stations kao **horizontalni red imena** u display veličini koji se pomera palcem, (4) „Jedan događaj, ceo" — anatomija primera kao polukrug podeljen na segmente (živa stvar), (5) proces kao 4 jutarnja trenutka na jednoj liniji horizonta, (6) Market → Events → Café kao tri položaja sunca (izlazi / gore / visoko), (7) upit.
- **Oblik:** uglovi kvadratni (0) za slike i polja; dugmad **puna pilula** (polukrug na krajevima = sunce) [skil: taste-skill — odluči jednom: kvadrat ili pilula]; bez linija osim horizont-linije (2px brown, jedina linija na sajtu); bez senki.
- **Slike:** AI mockupi samo u polukrug/trouglu maskama sa vidljivom oznakom „Concept image · placeholder"; portfolio slotovi (beach picnic, backyard, shower, live stations) kao prazne polukružne „rupe" sa tekstom „Styled shoot coming". Kasnije prave fotke u iste maske.
- **Motion:** potpis — **sunce izlazi**: polukrug se diže 0→100% visine kroz `clip-path: inset()` + `translateY` vezano za skrol (CSS scroll-driven animation, fallback statičan) [raise: rubber-hose iris → sunce]. Ulasci: naslov→tekst→slika, 70ms stagger, 24px, `cubic-bezier(.2,.7,.2,1)` 600ms — jedan easing za sve [ref: coloniazacamil — jedan easing]. Reduced motion: sunce stoji gore.
- **Jedna živa stvar:**
  - B: **„Gde smo jutros"** — iz rasporeda marketa (data fajl) izračuna: „We're at [X] right now, until 1 pm" / „Next: Saturday 8 am at [Y]" + odbrojavanje u satima. Bez JS-a: lista rasporeda.
  - A: **„Jedan događaj, ceo"** — anatomija primera (40. rođendan, 50 gostiju): 8 delova događaja na polukrugu; tapni stub (Planning / Design & florals / Live stations) i delovi koje taj stub pokriva se upale, ostali zatamne; „All three" upali sve → dugme „Start with all three" vodi u upit sa predizabranim uslugama. [raise: kolajder — jedan događaj ceo]
- **Namerno ne radi:** nema gradijenta neba, nema ilustrovanih oblaka/sunčevih zraka, nema script naslova, nema kartica sa ikonicama, nema galerije „naših događaja".
- **Rizici:** (1) šest boja traka može da izgleda kao „duga" — krem mora da drži ~50%, a apricot/yellow/sage po jedna traka na stranici; (2) „sunce izlazi" kao efekat može da postane trik ako se ponavlja — samo hero i jedan prelaz; (3) Montserrat Light na ogromnim veličinama je lep, ali je u malim veličinama tanak — tekst nikad ispod Regular.

### Pravac 2 — „Lido" (tenda beach cluba)  ← Impeccable pick
**Ideja:** Na ovoj stranici **cabana pruge sa kecelja i salveta** postaju **tenda italijanskog lida**: svaka stranica počinje ispod prugaste tende sa skalopiranom ivicom, a meni i usluge su ispisani kao oslikane table plaže.
*Test konkurenta:* Beach Picnic Co ima „Cabana Lounge" sa prugama — delimično prolazi samo zato što su naše pruge apricot/žute sa njihove kecelje; slabiji test nego pravac 1.

- **Tipografija:** Montserrat Regular verzal za „oslikane table" (naslovi 6–8vw, tracking +0.04em samo na display veličini, kao slova na tabli) [ref: lepetitbleu — naslov sekcije popuni kolonu]; Montserrat Regular 17px tekst; Playfair Italic za opise jela i imena stanica u listi.
- **Paleta:** krem 45% · pruge apricot/krem i yellow/krem kao polja (~30%) · brown mastilo · sage samo za Bloom Cart. Strategija *Committed* (pruga nosi stranu). [ref: lepetitbleu — materijal brenda postaje sistem]
- **Hero (A):** tenda pune širine (vertikalne pruge 56px, apricot/krem) zauzima gornjih ~35% sa skalopiranom donjom ivicom (SVG maska, polukrugovi = male sunčeve); ispod, split-stage: levo naslov i upit, desno sticky fotografija (placeholder) [taste: split-stage].
- **Hero (B):** žuto-krem tenda + ispod „lido tabla" — meni kao oslikana tabla sa imenom jela levo, cenom desno, red 56px, pun širine telefona [ref: lepetitbleu — meni redovi].
- **Ritam:** svaka usluga ima svoju tendu (Picnics = žuta, Live Stations = apricot, Bloom Cart = sage pruga) — sekcije se smenjuju tendom/bez tende.
- **Oblik:** skalopirana ivica kao jedini dekorativni oblik; uglovi 0; dugmad pravougaona sa malim skalopom? — ne: pravougaona, pun apricot fill.
- **Slike:** placeholder fotke u pravougaonim ramovima „kao kroz otvor kabine".
- **Motion:** tenda se lagano „spušta" pri učitavanju (scaleY od vrha, 500ms); pruge ne animiraju (vibracija). Ulazi kao pravac 1.
- **Živa stvar:** B — isto „Gde smo jutros". A — **„Postavi stanice"**: izaberi 1–3 live stanice i one se poređaju pod tendom kao šank (modularna baza + koncept), → upit.
- **Ne radi:** nema suncobrana-ilustracija, nema mornarskih motiva, nema plave.
- **Rizici:** najpoznatiji „Mediterranean summer" izgled (Aperol, Positano merch, beach club) — lako postaje kostim; velike pruge vibriraju na suncu i na OLED telefonu i bore se sa tekstom; dokument kaže da je ovo **brend za sve faze** (i kafe), a tenda vuče ka plaži.

### Pravac 3 — „Omot" (ravna polja + kosina znaka)  ← konkurentan izazivač, fuzionisan
**Ideja:** Na ovoj stranici **kosina kraka znaka A (i kornet kad se okrene)** postaje **rez omota ploče**: ravna polja jedne boje nose stranicu, a fotografija je u braon/apricot duotonu odsečena po kosini kraka i gurnuta u ugao.
*Test konkurenta:* niko na tržištu nema ni trougao ni duoton; prolazi.

- **Tipografija:** Montserrat Regular verzal, tesno (−0.01em), 7–10vw, levo dole na polju; Playfair Italic za jednu izjavu po stranici; tekst Montserrat 17px.
- **Paleta:** strategija *Committed* — svaka stranica ima **jednu svoju boju** na 40–60% površine: Home = apricot, Live Stations = apricot, Picnics = yellow, Bloom Cart = sage, How We Work = krem, /crepes = apricot. Brown mastilo (5.13:1 na apricot, 7.09:1 na žutoj). [izazivač: Blue Note — total commitment boje]
- **Slike:** **duoton braon + apricot** za sve placeholder fotke — ujedno jasno govori „ovo nije prava fotka događaja"; kad stignu styled shootovi, prave fotke idu u boji u isti trougaoni rez (razlika placeholder/pravo je vidljiva).
- **Hero (A):** apricot polje celog ekrana; duoton fotka u gornjem desnom uglu odsečena dijagonalom pod uglom kraka A (~62°); naslov levo dole; upit dugme ispod naslova.
- **Hero (B):** apricot polje, ogroman **V (kornet)** odsečen o donju ivicu, u njemu duoton krep; status marketa krupno gore levo; meni kao „spisak strana" — Sweet / Savory sa cenama kao trajanjem pesama (tabularne cifre).
- **Ritam:** polje boje (pun ekran) ↔ krem stranica teksta ↔ polje boje. Dijagonala se ponavlja samo u rezu slika.
- **Motion:** promena boje polja između stranica (view transition, 400ms); duoton fotka „klizi" po dijagonali 24px pri ulasku.
- **Živa stvar:** B — „Gde smo jutros". A — **„Jedan događaj, ceo"** (kao pravac 1), u formi „track liste" događaja.
- **Ne radi:** nema krugova/sunca kao dekoracije osim u logou, nema pruga.
- **Rizici:** najhladniji i najgrafičkiji — lako ode u „agencija/muzika", a brief traži toplo i opušteno; dijagonalni rezovi otežavaju responsive; duoton može da izgleda tužno za hranu (krep u braon tonu nije apetitlijiv).

---

## 5. Provera protiv zabrana i reference-pravila
- Nijedan pravac nema: ljubičasto, gradijente, centrirani hero sa pill + 2 dugmeta, grid ikonica-kartica, emoji, zabranjene fraze, izmišljene dokaze, glass, monospace.
- Krem podloga: **odluka iz brenda** (paleta, šator, salvete), zapisano.
- Montserrat: brend-izuzetak, zapisano (inspect `--allow` za font).
- Playfair Italic: samo cele rečenice; nikad jedna reč u naslovu.
- Raspodela izvora po pravcu: P1 — brief/brend ~45%, seed raises ~25%, coloniazacamil ~15%, lepetitbleu ~10%, taste-skill pravila ostalo → nijedna referenca > 1/3. P2 — lepetitbleu ~30% (granica), brief ~45%. P3 — Blue Note izazivač ~30%, brief ~50%.
- Sarah & Matt doprinos (svi pravci): **meni kartica / place card kao komponenta** (meni na /crepes, kartica stanice, potvrda upita kao „place card").

## Preporuka
**Pravac 1 — „Una Mattina".** Jedini drži ceo brend (ime + znak + jutro + kornet) i jedini prolazi test konkurenta bez ostatka. Raste u kafe bez promene (jutro je i kafa i doručak), dok Lido vuče ka plaži, a Omot ka hladnoj grafici. Na `/crepes` znak naopako postaje kornet i nosi status marketa, a to je ono što posetilac traži. Na Home „Jedan događaj, ceo" pokazuje glavnu poruku („ne koordinišeš više firmi") radnjom, ne tvrdnjom. Iz Lida uzimam samo prugu kao **materijal sitnih površina** (kecelja/salveta: traka iznad menija, ivica Instagram dugmeta), ne kao strukturu.

## Izabran pravac: Pravac 2 — „Lido" (Luka, 2026-10-17)

Ublažavanje rizika pri gradnji:
- pruge **nikad iza teksta** — samo u tendi, na trakama ivica i u malim površinama (kecelja/salveta); tekst uvek na ravnom krem/žutom/apricot polju;
- širina pruge fiksna po prelomu (desktop 56px, telefon 28px), boje pruge su paleta pune jačine bez prelaza;
- skalop = polukrug = sunce iz znaka: tenda i znak dele isti oblik, pa pravac ostaje vezan za brend, a ne za opšti „beach club";
- iz pravca 1 zadržavam „Gde smo jutros" (B) i „Jedan događaj, ceo" kao dodatak živoj stvari „Postavi stanice" (A) samo ako ne pretrpava Home.
