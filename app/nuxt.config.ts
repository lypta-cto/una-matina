import { existsSync, readFileSync } from 'node:fs'
import tailwindcss from '@tailwindcss/vite'
import site from './site.config'

// i18n is opt-in: `npm run enable:i18n -- sr en` installs @nuxtjs/i18n and writes i18n/config.json.
const i18nFile = new URL('./i18n/config.json', import.meta.url)
const i18n = existsSync(i18nFile) ? JSON.parse(readFileSync(i18nFile, 'utf8')) : null

export default defineNuxtConfig({
  compatibilityDate: '2026-10-01',
  devtools: { enabled: false },
  // restart the dev server when the site facts change (this file imports them once at startup)
  watch: ['site.config.ts'],

  modules: [
    '@nuxt/fonts',
    '@nuxt/image',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    ...(i18n ? ['@nuxtjs/i18n'] : []),
  ],
  ...(i18n ? { i18n } : {}),

  css: ['~/assets/css/main.css'],
  vite: { plugins: [tailwindcss()] },

  site: { url: site.url, name: site.name, defaultLocale: site.lang },

  app: {
    head: {
      htmlAttrs: { lang: site.lang },
      link: [{ rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
      // html.js before first paint: layouts that need JS (How we work's single signboard) are chosen without a shift
      script: [{ innerHTML: "document.documentElement.classList.add('js')", tagPosition: 'head' }],
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'theme-color', content: '#F6D67A' },
      ],
    },
    // Events routes cross-fade (leave 160 ms, enter 240 ms + 12 px settle); see assets/css/motion.css
    pageTransition: { name: 'page', mode: 'out-in' },
  },

  // Families come from DESIGN.md; @nuxt/fonts downloads and self-hosts them (no Google Fonts hotlink).
  fonts: {
    // global: emit @font-face even though the family is only referenced through a CSS variable
    families: site.fonts.map(f => ({ global: true, ...f })),
    defaults: { weights: [400], styles: ['normal'] },
  },

  image: { quality: 80, format: ['avif', 'webp'], screens: { xs: 320, sm: 640, md: 768, lp: 900, lg: 1024, xl: 1280, xxl: 1536 } },
})
