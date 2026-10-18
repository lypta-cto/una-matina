# References — Una Mattina

Klijentkinja je poslala samo **konkurenciju** (mapa tržišta, ne uzori). Sajtove koji joj se sviđaju šalje naknadno —
do tada su inspiracione reference izabrane iz `taste-skill/library/sites.json`, van event sektora.

## A. Mapa tržišta (konkurencija — ne uzimamo ništa vizuelno)

| Sajt | Šta nude | Kako prikazuju | Tokeni (izmereno) |
|---|---|---|---|
| `comp-swflweddingplanners` (KC Weddings & Events) | full-service wedding + event planning, SW & South Florida | Wix; crni krug + zlatni logo, akvarel cveće u uglovima, roze nav traka, Georgia italik naslov, Great Vibes script, blokovi teksta, „See Our Services/Team/Gallery/Blog" kartice sa akvarel ramom; ~400px prazno ispod loga | Georgia 16/30 body, zlatna `rgb(193,157,82)`, script 30px |
| `comp-stalievents` | dizajn, cveće (tropsko, heliconia) | Wix; „Stali Events" serif levo, Home/About/Contact, jedna uspravna fotka cveća na tamnosivoj traci, Wix chat | Avenir light 17–18px, Fraunces light naslovi 38–44 |
| `comp-eventsbymarleny` | wedding + corporate planning & design | Wix; zlatni Dancing Script logo, Cinzel bold nav, „See Our Work" script, 3 fotke u redu, roze blok + script naslov „Full-Service Wedding & Corporate Event Planning", Google 5.0 widget, About u ovalnoj kapsuli, „xoxo" potpis | Nunito/Avenir, Dancing Script 72–95px, Cinzel |
| `comp-thebeachpicnicco` | beach picnics + weddings, Naples | Wix; plavo-beli umbrella logo preko zamućene fotke, **~17 imenovanih tematskih paketa** („That's Amore", „Boho Chic", „Glitz & Glam"…) u cik-cak foto+naslov redovima, Cabana Lounge, Jewelry Charm Bar | Avenir/Futura light 18px, Playfair italik 47px naslovi paketa, plava `rgb(25,77,145)` |

**Šta svi rade (= šta mi NE radimo):**
- script/kaligrafski naslovi i logoi u zlatnoj; akvarel cveće kao ukras; roze/blush polja;
- sve centrirano, uski stub teksta, generički „Full-Service … Planning in Southwest Florida" naslov;
- dokaz = galerija fotki događaja + Google zvezdice; mi to još nemamo i ne smemo da izmislimo;
- **paketi sa imenima tema** (Beach Picnic Co) — tačno suprotno od naše poruke „no fixed packages";
- Wix chat balon, nav sa 6+ stavki, More dropdown.

**Rupe na tržištu (naša šansa):**
- niko ne prikazuje **hranu koja se pravi pred gostima** — live stations ne postoje kod njih;
- niko nema **in-house cveće kao aktivnost** (Bloom Cart);
- niko nema **jednu priču od marketa do kafea** — svi su „planner";
- niko ne pokazuje **proces** (šta se dešava posle upita) — samo „Start Planning" dugme.

## B. Inspiracione reference (decisions, not identity)

### 1. `lepetitbleu` — Le Petit Bleu (café, New Orleans) — izabrano jer: kafić sa krepovima čija **prugasta tkanina postaje ceo sistem**
- **Šta se voli:** pruge sa enterijera postaju logika celog sajta; meni kao niz uokvirenih redova (kategorija + „+"), naslovi sekcija („MENU", „ABOUT", „CONTACT") toliko veliki da 4–7 slova popune kolonu; radno vreme i adresa uvek vidljivi u kartici odmah ispod heroa; mobile je jedan stub kartica.
- **U brojevima:** body 15px light serif (Self Modern), labele 13px bold caps (Matter SQ), meni redovi u mono caps ~16px, visina reda ~36px; naslov sekcije ≈ 1 kolona širine (56px+ na mobilnom, raste do pune širine); jedna boja mastila (teal `rgb(19,167,178)`) na skoro-beloj `rgb(252,251,247)`, ~85% podloga / ~15% mastilo; tanki dupli obrubi, radius ~12px, gap 12px; nula senki; tranzicije 0.1–0.2s ease, marquee 15s linear.
- **Prenosivo:** (a) materijal brenda (pruga) kao sistem, ne kao ukras; (b) meni = redovi sa jasnim imenom levo i cenom desno, velika čitljivost; (c) „gde i kada" kao fiksna kartica odmah ispod prvog ekrana; (d) jedna boja mastila.
- **Identitet (ne diramo):** teal, dupli obrubi kao menu-card, brush script logo, Self Modern, fotka enterijera.

### 2. `sarahandmatt` — Sarah & Matt Wedding — izabrano jer: **papirni predmet događaja postaje komponenta sajta**
- **Šta se voli:** hero je fizička pozivnica (objekat), a njeni delovi (rubovi, sitne caps linije sa datumom/adresom, separator „|") postaju komponente kroz ceo sajt; detalji („The finer details") kao harmonika; vremenska linija priče kao horizontalni red.
- **U brojevima:** Instrument Sans 16–18px body, sitne extended caps 12–14px za datume/adrese (tracking ~0.1em), naslovi light serif ~5vw (64–96px); jedan ogroman italik red u footeru (~317px, iseče se); boje: topla bela `rgb(250,247,245)` + mastilo 72% + jedan zemljani akcent `rgb(155,121,72)`; tranzicije 0.15s `cubic-bezier(.4,0,.2,1)`, ulasci 0.5s `cubic-bezier(0,0,.2,1)`.
- **Prenosivo:** (a) **event stationery** (meni kartica, place card, tabla, potpis) kao UI jezik — kod nas su to tabla sa menijem, salveta, place card, kartica stanice; (b) troslojna tipografija sa jasnim poslom svakog sloja; (c) jedan preveliki red teksta koji izlazi iz ekrana kao završni akcent.
- **Identitet (ne diramo):** blush + zlatna filigranska ornamentika, swash italik imena, fotke para.

### 3. `coloniazacamil` — Colonia Zacamil — izabrano jer: **rečenica je layout, a slika stoji u rupi umesto reči**
- **Šta se voli:** „FLY ___ TO ZACAMIL": jedan red ogromnih slova preko cele širine, a u rupi između reči je traka videa visoka tačno kao slova; ispod samo jedno malo dugme. Nema nav-a na prvom ekranu.
- **U brojevima:** display 187px (~13vw), lh ~1.12; caption 24px serif; 10px mono labela; razmak između display i caption ~8:1; topla siva podloga `rgb(235,230,224)` + crno; jedan easing za sve `cubic-bezier(.645,.045,.355,1)` 0.5–1.3s; clip-path reveal 1.3s.
- **Prenosivo:** (a) slika/oblik koji zauzima mesto slova u liniji — kod nas **sunce u znaku „A"** može da bude rupa u reči, a „A" naopako kornet; (b) jedan easing kroz ceo sajt; (c) clip-path otkrivanje.
- **Identitet (ne diramo):** ultra-condensed crni caps, aerial video, mono labele.

## Zajednički imenitelji
- **Materijal/predmet brenda postaje sistem** (pruga → Le Petit Bleu; pozivnica → Sarah & Matt; rečenica → Zacamil). Za Una Mattina: **znak A/kornet, cabana pruga, tabla sa menijem**.
- Jedna boja mastila na svetloj podlozi, bez senki, akcent retko.
- Tri tipografska sloja, svaki sa jednim poslom.
- Mobilni = jedan stub, informacija (vreme/mesto) visoko.

## Tenzije
- Le Petit Bleu je gust i uokviren (kartice svuda) ↔ Zacamil je prazan i plakatski. Za /crepes (gužva, sunce, palac) bliže Le Petit Bleu; za Events Home bliže Zacamil/Sarah & Matt.
- Sarah & Matt je venčanje (blizu wedding-planner registra koji izbegavamo) — od nje uzimamo samo „predmet kao komponenta", ne romantiku.

## Anti-reference (iz briefa + konkurencija)
- Crno-zlatni luksuzni wedding planner, serif svuda → zato nikad zlatna, nikad crna podloga; Playfair samo italik akcent.
- Boho-rustik (pampas, juta, makrame — vidi pampas na beachpicnicco hero fotki).
- Šablonska event-agencija i Wix obrasci gore: script naslovi, akvarel cveće, imenovani paketi, Google zvezdice, chat balon.

## C. Lukine reference (runda 2)

Luka je poslao 4 Framer šablona (2026-10-17). Ceo katalog sekcija sa presudama i mapom po stranici: **`sections-catalog.md`**. Snimci u `agrovas/`, `beanro/`, `lattetemplate/`, `mornibali/` (`scroll-NN.png` = korak po korak).

### 4. `agrovas` — agritech šablon — Luka voli: **hero sa videom** (struktura Events sajta)
- **Šta se voli:** pun ekran videa koji se vrti bez zvuka, tekst nisko, jedno dugme. Nav preko videa nestaje kad skroluješ dole, a vraća se (bela traka) kad skroluješ gore.
- **U brojevima:** video 1920×1010, petlja 6 s, **8,5 MB, bez postera**, cover; scrim `linear-gradient(transparent 20% → #263415)`; H1 Geist 64/67 −3.5px (mobilni 38px, hero 587px ≈ 70svh); dugme 46px r12; nav 86px, skriva se −90px. Ostatak: fade-up 20–40px, kartice r16, Geist 16/25.6.
- **Prenosivo:** video kao prvo polje; nav koji se skriva i vraća; tekst dole levo; 4 koraka u jednom redu (kao table, ne foto-kartice); vertikalna lista imena koja menja sliku (za stanice).
- **Identitet / šablon (ne diramo):** ocena i „12k+ customers", gradijent scrim, centrirani stek, marquee ključnih reči, kartice sa ikonama, testimonijali, statistike, blog, newsletter.

### 5. `beanro` — šablon za hladnu kafu — izabrano jer: **velika slova kao tabla + video koji raste na skrol**
- **Šta se voli:** rečenica u velikim slovima sa slikama umetnutim između reči; video koji je zakačen na ekranu i raste dok skroluješ; reč koja se okreće u slotu rečenice; FAQ harmonika; naslov čiji je svaki red na svojoj obojenoj dasci.
- **U brojevima:** Boldonse 70/105 i 48/72, Bayon 32, Manrope 18/27; braon `#7d2c0f`, narandžasta `#ff8342`, krem `#fcf7ee`; video sticky, scale 0.5→1.5 (440×250 → 1320×750), opacity 0.5→1; rotator rotateX ~2 s; r32 svuda.
- **Prenosivo:** slike u liniji teksta (kvadratne, Home uvod); „prozor kabine" koji raste (Live Stations); rotator imena stanica na apricot tabli; FAQ kao redovi sa linijama; završni CTA na ravnim daskama (bez nagiba).
- **Identitet / šablon (ne diramo):** AI cut-out sa prskanjem, nalepnice pod uglom, ocene na proizvodima, marquee testimonijali, r32 paneli, Boldonse/Bayon.

### 6. `lattetemplate` — Latte Haven kafić — izabrano jer: **lista pored zakačene fotke**
- **Šta se voli:** meni po kategorijama, a pored svake kategorije fotka koja stoji (sticky) dok lista prolazi; strane se smenjuju levo/desno.
- **U brojevima:** Poppins; stavka 16/600 + opis 14/18.2, korak reda ~87px; fotka 640×720 sticky top 40px; panel `#fff5e0` r32, padding 40; razmak sekcija 120px.
- **Prenosivo:** stanica = tabla + zakačen kvadratni placeholder (Live Stations); sticky rezime „your event so far" pored forme (Inquire).
- **Identitet / šablon (ne diramo):** Google ★ pill, coverflow karusel, blog, Google Maps iframe, crni pill dugmići, r32.

### 7. `mornibali` — Morni, Bali (all-day doručak) — Lukin kandidat za **/crepes**
- **Šta se voli:** svaka sekcija je ravno polje jedne boje, uglovi 0, ogromna verzal slova, meni kao redovi sa linijom (ime levo, cena desno, kategorija ispod cene), WHERE/WHEN blok sa „Get directions", u footeru wordmark preko cele širine. Najbliže Lido pravcu od sve četiri.
- **U brojevima:** Mona Sans verzal H2 104/93.6, hero 190 (mobilni 92); Inter 17/25.5, labele 13/600 caps +0.9px; vino `#6a1b2a` kao jedino mastilo na krem `#f2e9da` / roze / nebo plavoj; red menija ~144px (mobilni ~160), linija 1px; gutter 48 (mob. 20), sekcija 120px; radius 0 (100 samo dugmad); hero shade gradijent .5→.72; foto-traka marquee ~32px/s; nalepnica sa paralaksom −0.06.
- **Prenosivo:** kompozicija prvog ekrana (pozdrav + ogroman status dole levo, „istaknut krep + mesto ◆ sati"), ali na ravnom apricot polju bez fotke; anatomija reda menija; WHERE/WHEN po marketu; tabla preko fotke/videa (za Events video hero); „dan po satu" (How We Work, kao red koji korisnik sam skroluje, ne marquee).
- **Identitet (ne diramo):** njihova fotka hrane preko celog ekrana sa gradijentom, roze/plava paleta, kondenzovani Mona Sans, nalepnica šolje, pocepani papir, sunce u slovu O (ne crtati naša slova kao sunca, koristimo naš logo kakav jeste).

**Napomena:** brief stavlja „hero video" u šablonske event agencije. Zato video ide pod tendu, bez teksta na snimku (naslov je na krem tabli koja ga preklapa), sa poštenim, potpisanim open-licence snimkom i dugmetom za pauzu. Specifikacija je u `sections-catalog.md` → „Video hero spec". /crepes nema video.

## D. Runda 3 — istraživanje sekcija

Luka (2026-10-18): na /crepes su loše dve sekcije, „Folded hot" (krem kartica + stock fotka čokoladnog krepa) i „Made in front of you" (traka od 5 fotki tuđeg roštilja). Hero je dobar, ali treba mu još malo pokreta. Pregledano 34 sajta: 4 Lukina + 30 novih (Framer šabloni iz kategorija restaurant, food, catering, food truck, events, plus Awwwards food i taste biblioteka).
**Celo istraživanje sa specifikacijama: `section-library.md`.** Okviri po sajtu: `r3-motion/<slug>/` (`scroll-sheet.jpg` korak po korak, `m-scroll-sheet.jpg`, `load-sheet.jpg`, `key-*.jpg`, `probe-*.json` sa izmerenim WAAPI trajanjima i easing krivama i sticky elementima). Pune snimke: `r2-curbside/`, `r2-cateringgco/`, `r2-dollop/`, `r2-cenere/`, `r2-moka/`, `r2-glacee/`. Isečci Lukine AI slike za sekvencu: `r3-made-crops/`.

**Najkorisniji novi uzori**
- `curbside` (Adam Kansky, food truck + catering, najbliži našem modelu). Tabla nedelje (dan krupno, mesto, sati, „Get directions", red za danas označen); priča o pripremi (zakačena fotka levo, koraci prolaze desno, 2785 px); hero meta red „Today · mesto · sati" iznad naslova na mobilnom.
- `truckfare` / „Griddlecar". „Today's stop, and the rest of the week": živa kartica sa satom, prošli dani prigušeni na ~35 %. „Taken apart": proizvod rastavljen na slojeve dok skroluješ (pin 2700 px).
- `cenere`. Proces ispričan brojkama o zanatu (24 h / 250 g / 485°) i cene kao odometar (900 ms, +70 ms po cifri, `cubic-bezier(.16,.84,.24,1)`).
- `peel` / `hinoki`. Tri sticky „sobe" preko celog ekrana koje klize jedna preko druge (čist CSS); red fotki stepenasto sa tačkom „Now" po stvarnom satu.
- `dollop`. Sticky kartice koje se slažu jedna preko druge; Instagram blok bez feed-a, karte se lepezasto razmaknu na skrol.
- `cateringgco`. Točak prilika (red se pomera na 2 s, 600 ms, susedni redovi 50 % / 10 %).

**Izmereno:** premium šabloni koriste jednu ease-out familiju sa dugim repom (0,9–1,4 s; curbside i peel imaju tačno naš `cubic-bezier(.22,1,.36,1)`), a za velike skrol momente čist CSS sticky. Jeftini šabloni koriste blur-in, scale od 0,5 i nalepnice.

**Odluke za /crepes (detalji u `section-library.md` §3)**
- „Made in front of you": builder je već napravio `CrpSequence.vue` (kamera kroz jednu sliku). To je pravi obrazac. Ispravke:
  - zum najviše ~1,6 na desktopu, ili tražiti 2× render izvora (1672 px je premalo za 2,1×);
  - okvir 4:5, širok ≤ 480–520 px, sa kadrovima iz `r3-made-crops/`;
  - tekst koraka ulazi kroz masku umesto da se samo zameni;
  - indeks: lista naslova (aktivni 100 %, ostali 35 %) + „02 / 05" + linija napretka umesto sitnih sličica;
  - kraj sekvence prelazi na apricot polje sa znakom korneta („At the market it leaves in a paper cone."), jer slika pokazuje tanjir, a tekst obećava kornet;
  - krem polje umesto braon;
  - ukloniti menu band, da se ista AI slika ne vidi tri puta zaredom.
- „Folded hot": ne vraćati. Njene tri činjenice se raspoređuju: „cooked to order" u 1. korak, kornet u finale sekvence, raspon cena u zaglavlje menija (odometar). Opcija B je „The fold": disk → pola → četvrt → kornet, ravni oblici u bojama brenda.
- Hero, dodaci po vrednosti:
  1. pulsirajuća tačka „Open now" samo dok je market stvarno otvoren;
  2. „zavesa": hero ostaje sticky, intro klizi preko njega, tekst odlazi −12vh;
  3. odometar cene na tabli;
  4. nav pada odozgo, a pill se otvara iz sredine.
- „Find the stand": izbaciti tamnu pariz-fotku (tuđa radnja, noć, para). Umesto nje tabla dana sa današnjim redom na apricot dasci, trakom radnog vremena i tačkom „Now".
- Instagram: handle kao naslov + 4 kvadratne karte (označeni koncept / mockup) koje se raziđu ravno, bez rotacije.

**Events (prioritet niži)**
- Home: tri usluge kao sticky poglavlja (svaka na svom polju) umesto krivog splita Picnics | Bloom Cart.
- Prilike: točak.
- How We Work: sticky table sa linijom napretka.
- Live Stations: kvadratni prozor koji se otvara (potvrđuje rundu 2).

**Odbačeno:** zvezdice i testimonijali, lučne foto-kartice, „640+ events / 4.9" statistike, cene po gostu, trake sa nalepnicama, blur-in naslovi, karuseli, tamne „fine dining" palete, AI cut-out sa prskanjem, mape kao iframe.
