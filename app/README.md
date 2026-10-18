# Starter (Nuxt 4 + Tailwind 4)

Kopira ga `/novi-sajt` u `<sajt>/app/`. Ne razvijati sajtove ovde.

| Šta | Gde |
|---|---|
| Design tokeni (bez defaulta, sve `__TOKEN__`) | `app/assets/css/tokens.css` → Tailwind utility u `main.css` (`bg-ground`, `text-ink`, `font-display`, `text-step-3`, `rounded-m`, `shadow-1`…). Stock paleta, fontovi, radius, senke su uklonjeni. |
| Sajt: URL, ime, jezik, opis, fontovi | `site.config.ts` |
| Fontovi | `@nuxt/fonts` — self-host (GDPR), porodice iz `site.config.ts` |
| Slike | `@nuxt/image` (`<NuxtImg>`, avif/webp) |
| SEO | `usePageSeo()` po stranici (title, description, canonical, OG/Twitter), `@nuxtjs/sitemap` (`/sitemap.xml`), `@nuxtjs/robots` |
| Motion | `v-reveal` direktiva (`app/plugins/reveal.ts`: sadržaj vidljiv bez JS-a, skriva samo ono ispod folda) za ulaske; `motion-v` za springove, gestove, layout animacije |
| Fontovi sa Fontshare/Bunny | preko `@nuxt/fonts` providera u `site.config.ts` (`provider: 'fontshare'`), nikad `<link>` ka njihovom CSS-u |
| Slike | `<NuxtImg>` sa `sizes` traži i `width`/`height`; za dev bez problema koristi `densities="x1 x2"` |
| Dodatne boje (polje po sekciji) | nova uloga u `tokens.css` + mapiranje u `main.css` (`@theme inline`) |
| i18n (opcija) | `npm run enable:i18n -- sr en` |
| Provera | `npm run check:tokens` (i pre svakog `build`/`generate`): nepopunjeni tokeni, hex u templejtima, stock Tailwind boje |

**Zašto motion-v:** to je Motion (bivši Framer Motion) za Vue, isti engine i API koji koriste
Emil Kowalski skilovi, pa se njihovi saveti (springovi, prekidive animacije, `whileInView`, layout
animacije, reduced motion) prenose 1:1. Mali je, koristi hardverski ubrzan WAAPI gde može, deklarativan
je u template-u. GSAP (ScrollTrigger) dodati samo ako pravac traži složene scroll timeline-ove.
