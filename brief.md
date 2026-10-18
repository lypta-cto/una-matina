# Brief — una-mattina

> Izvor: Lukin prompt + `assets/docs/business-project.txt` (interni strateški dokument, 2026) + brend materijal u `assets/brand/` i `assets/logo/`.
> Bez oznake = iz prompta/dokumenta. `(pretpostavka)` = Claudeova odluka.

## 1. Biznis i cilj
- **Ko je klijent i čime se bavi:** Una Mattina, Naples / Southwest Florida. Počinje kao štand sa krepovima na farmers marketima („A Taste of Mediterranean Mornings"), raste u **Una Mattina Events & Catering** (planiranje, dizajn i cveće, live station catering, luxury picnics, Bloom Cart), dugoročno **Una Mattina Café**. Ime i glavni logo zajednički za sve faze.
- **Šta ih razlikuje:**
  - jedan tim radi ceo događaj — klijent ne koordinira više firmi (planiranje + dizajn + hrana + cveće);
  - **cveće rade sami, in-house** (dokument: „Florals are not automatically outsourced");
  - **live stations** — hrana se pravi pred gostima (crepe station, tiramisu bar, fruit cup bar, charcuterie, cannoli bar, cocktail/mocktail bar), na jednoj modularnoj bazi;
  - **Bloom Cart** — gosti biraju stabljike i prave mali buket koji nose kući (dekor + aktivnost + poklon u jednom);
  - nema fiksnih paketa, svaki događaj dobija sopstveni koncept;
  - brend je nastao na marketu: ljudi ih prvo upoznaju preko krepa, pa tek onda kao event tim.
- **Primarna akcija:** A (events) — poslat upit (tip događaja, datum, lokacija + tip lokacije, broj gostiju, usluge, poruka). B (/crepes) — doći na štand i zapratiti Instagram.
- **Sekundarne akcije:** A — Instagram, pregled stanica/piknika/Bloom Carta. B — „We also do events" → glavni sajt.
- **Metrika:** A — broj poslatih upita (pretpostavka: kvalifikovan upit = ima datum + broj gostiju). B — klikovi na Instagram i „Get directions" sa QR posete (pretpostavka).
- **Rok / faze:** prvo **B (/crepes)** — treba odmah (market je faza 1). Zatim **A**. Dokument kaže da se Events promoviše tek kad su spremni (posle styled shootova) — sajt A mora da radi i bez pravih fotki.

## 2. Publika
- **Ko dolazi:**
  - B: posetilac marketa, stoji pred štandom ili u redu, telefon u ruci, sunce, skenira QR. Pažnja ~10 sekundi. Ili neko ko je sutradan našao kesu/salvetu sa QR-om.
  - A: domaćin privatne proslave u Naples/SWFL (rođendan, bridal/baby shower, veridba, manje venčanje, brunch, korporativno). Često mobilni, često sa Instagrama. Lokacija: kuća, dvorište, plaža, park.
- **Prvo pitanje:**
  - B: „Šta ima i koliko košta?" pa „Gde ste sledeći put?"
  - A: „Mogu li vam predati ceo događaj, i da li to izgleda lepo kao što zamišljam?"
- **Šta ih brine:** A — da će morati da koordiniraju 4 firme; da je „paket" šablonski; nema pravih fotki (nova firma); cena nepoznata; dozvole za plažu/park. B — da li ima nešto slano/bez orašastih (pretpostavka), da li primaju kartice (pretpostavka).

## 3. Ton brenda
| Jeste | Nije |
|---|---|
| Topao, sunčan, mediteranski | Generički luksuzni wedding planner (crno-zlatno, serif sve) |
| Elegantan ali opušten | Boho-rustik (juta, makrame, pampas) |
| Jutarnji, svež, lagan | Šablonska event-agencija (hero video + „Services" kartice + testimonijali) |

- **Kao osoba:** domaćica koja te dočeka sa kafom i krepom na terasi i već je sve smislila — ti samo dođeš.
- **Slogani koji ostaju:** „A Taste of Mediterranean Mornings" (tagline logoa), „Good Food, Brighter Days" (potpis, script), „We plan • We design • We create experiences" (iz dokumenta), „Same symbol. A brighter day. / A sweeter way." (sa simbol-kartice).

## 4. Stranice i sadržaj
| Stranica | Svrha | Sadržaj koji postoji | Šta fali |
|---|---|---|---|
| **/crepes (B)** | QR landing sa štanda: meni, gde/kada, Instagram | Meni-predlog sa mockupa (sweet/savory + cene sa table) | Lokacije i termini marketa, Instagram handle, potvrđen meni i cene |
| Home (A) | Ko smo, 3 stuba, posebne usluge, upit | Dokument (vizija, model, primer događaja) | Fotke |
| Services | 3 stuba pojedinačno ili zajedno | Detaljne liste iz dokumenta (str. 6–7) | — |
| Live Stations | 6 stanica + modularna baza + „future" | Lista stanica, budući koncepti | Fotke stanica, opisi po stanici (Claude piše, klijent potvrđuje) |
| Luxury Picnics | Lokacije, šta uključuje, prilike, dozvole | Str. 11 + 18 | Fotke |
| Bloom Cart | Kako radi, za koje prilike, custom detalji | Str. 9 | Fotke |
| How We Work | 9 koraka klijenta, uprošćeno | Str. 16 (Inquiry → Follow-up) | — |
| About | Market → Events → Café | Str. 2, 3, 20, 21 | Imena/priča osnivača |
| Inquire | Forma upita | Polja iz prompta | Backend za slanje, email primaoca |

- **Stvarni dokazi:** nijedan (nema klijenata, citata, brojki, press-a). Dokument eksplicitno: styled shootovi se ne prikazuju kao stvarni događaji. Ne izmišljati.
- **Forme / integracije:** forma upita (A). Backend `(pretpostavka)`: Nuxt server ruta `/api/inquiry` koja za sada vraća OK i loguje — prava dostava (email / Lypta / Formspree) `[[potvrditi]]`. Instagram link. Mapa/„Get directions" link za market (Google Maps URL, bez embeda — pretpostavka, zbog brzine i kolačića).

## 5. Reference
Klijentkinja je poslala samo **konkurenciju** — mapa tržišta, ne uzori:
1. swflweddingplanners.com
2. stalievents.com
3. eventsbymarleny.com
4. thebeachpicnicco.com

Sajtovi koji joj se sviđaju stižu naknadno. Do tada Claude bira 2–3 inspiracione reference van sektora (pretpostavka).

## 6. Anti-reference
- Crno-zlatni luksuzni wedding planner, serif svuda.
- Boho-rustik.
- Šablonske event-agencije (vidi konkurenciju gore — razlikovati se od njih).

## 7. Postojeći asseti
- **Logo:** `assets/logo/` — stacked, horizontal, sign (PNG; SVG su rasteri u SVG omotaču). Horizontal i stacked PNG su čisti, transparentni, visoke rezolucije. Sign PNG je AI raster na belom, 1536×1024, sa neravnim ivicama.
- **Boje (obavezne):** Cream `#FFF7EA`, Apricot `#F4A878`, Yellow `#F6D67A`, Sage `#9EAD83`, Brown `#5B3A2E`.
  - Napomena: wordmark u PNG logou koristi tamniji braon (~`#4E2412`) i prigušeniji apricot (~`#D4906A`) od palete — `[[potvrditi: koja vrednost je zvanična]]`.
- **Fontovi (obavezni):** Montserrat (Light, Regular), Playfair Display Italic za akcente. Script samo za kratke potpise („Good Food, Brighter Days"), nikad za tekst.
- **Motivi:** znak „A" sa izlazećim suncem (morning); isti znak naopako = kornet krepa (crepe); apricot i yellow cabana pruge (kecelje, salvete, tote).
- **Fotografije:** `assets/brand/*` su AI mockupi — samo privremeni placeholderi, jasno označeni, nikad kao „naši događaji". Prave fotke posle styled shootova (beach picnic, backyard, shower, live stations).
- **Postojeći sajt:** nema.

## 8. Stack
- **Framework:** Nuxt 4 + Tailwind 4 (builder/starter).
- **Hosting / domen:** `[[potvrditi: domen]]` (pretpostavka: `unamattina.com`, /crepes kao ruta istog sajta — QR kod štampati na `…/crepes`).
- **CMS:** statičan sadržaj (pretpostavka); meni i market termini u jednom data fajlu da se lako menjaju.
- **Ograničenja:** /crepes mora da se učita brzo na mobilnom internetu na otvorenom (mali JS, bez teških slika, visok kontrast na suncu). Bez kolačića za analitiku dok se ne odluči (pretpostavka).

## 9. Jezik
- **Primarni jezik:** engleski.
- **Dodatni:** nema (pretpostavka; italijanski samo kao ukrasne reči — „Una Mattina", „buongiorno" — ne kao i18n).
- **Pismo:** latinica.
- **Copy:** Claude piše, klijent odobrava.

## Pretpostavke (Claude)
1. Nema blokirajućih pitanja: biznis, akcije, brend i jezik su jasni iz prompta i dokumenta.
2. **Montserrat** je na listi zabranjenih „AI fontova" kao glavno pismo, ali je brend obavezan → koristimo ga, a karakter dolazi iz **logo slova** (prilagođena geometrijska deco slova) kao display uređaja i Playfair Italic akcenata. Izuzetak upisan u DESIGN.md; `shoot.mjs` font-flag se svesno ignoriše.
3. Krem `#FFF7EA` kao podloga je **odluka iz brenda** (paleta, šator, salvete), ne default.
4. /crepes je deo istog Nuxt projekta, sa sopstvenim layoutom (bez glavne navigacije, bez footera glavnog sajta).
5. Meni (sweet/savory) i cene preuzeti sa mockup table; označeni „menu to be confirmed" i u kodu `[[potvrditi]]`. Na tabli: Sweet — Nutella & Banana 10, Strawberry Dream 10, Pistachio Bliss 11, Classic Sugar 8, Build Your Own 10; Savory — Mediterranean 11, Caprese 11, Ham & Cheese 10, Spinach & Feta 10.
6. Nema javnih cena za evente; nema „paketa".
7. Forma upita: jedna stranica, bez višekoračnog wizarda (pretpostavka; kraće = više upita). Polja: ime, email, telefon (opciono), tip događaja, datum (ili „flexible"), lokacija (grad/area), tip lokacije (home/backyard, beach, park, venue, other), broj gostiju (opseg), usluge (checkbox: planning, design & florals, live stations, luxury picnic, Bloom Cart, „not sure yet"), poruka, kako su čuli (opciono).
8. Placeholder fotke: AI mockupi iz `assets/brand/` sa vidljivom oznakom „Placeholder — concept image"; portfolio slotovi (beach picnic, backyard, shower, live stations) kao prazni okviri sa oznakom „Styled shoot coming".
9. Za javne lokacije (plaža/park) sajt kaže da se pravila i dozvole proveravaju pre potvrde — iz dokumenta.
10. Instagram handle placeholder `@unamattina` `[[potvrditi]]`.
