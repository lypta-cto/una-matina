#!/usr/bin/env node
// Opt-in i18n: npm run enable:i18n -- sr en   (first = default locale; codes as used in URLs)
import { execSync } from 'node:child_process'
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs'

const locales = process.argv.slice(2)
if (locales.length < 2) { console.error('usage: npm run enable:i18n -- <default> <other> [...]'); process.exit(1) }
execSync('npm install @nuxtjs/i18n@^10', { stdio: 'inherit' })
mkdirSync('i18n/locales', { recursive: true })
for (const code of locales) {
  const f = `i18n/locales/${code}.json`
  if (!existsSync(f)) writeFileSync(f, '{}\n')
}
const siteUrl = readFileSync('site.config.ts', 'utf8').match(/url:\s*'([^']+)'/)?.[1]
writeFileSync('i18n/config.json', JSON.stringify({
  baseUrl: siteUrl && siteUrl !== '__TOKEN__' ? siteUrl : undefined,
  customRoutes: 'meta',
  defaultLocale: locales[0],
  strategy: 'prefix_except_default',
  locales: locales.map((code) => ({ code, language: code, name: code.toUpperCase(), file: `${code}.json` })),
  detectBrowserLanguage: false,
}, null, 2) + '\n')
console.log(`i18n enabled: ${locales.join(', ')} — strings in i18n/locales/*.json, use $t('key') / useI18n(); set each locale's "language" (e.g. sr-Latn-RS) in i18n/config.json; translated paths per page: definePageMeta({ i18n: { paths: { en: '/fleet' } } }); html lang + hreflang: useLocaleHead({ seo: true }) in app.vue`)
