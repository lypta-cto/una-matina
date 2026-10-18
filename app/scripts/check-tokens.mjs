#!/usr/bin/env node
// Fails while any design token or site setting is still a placeholder, or a stock colour sneaks into templates.
import { readFileSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
const problems = []

for (const f of ['app/assets/css/tokens.css', 'site.config.ts']) {
  readFileSync(path.join(root, f), 'utf8').split('\n').forEach((line, i) => {
    if (line.includes('__TOKEN__') && !line.trim().startsWith('//') && !line.trim().startsWith('*')) problems.push(`${f}:${i + 1} unset: ${line.trim()}`)
  })
}
const site = readFileSync(path.join(root, 'site.config.ts'), 'utf8')
if (!/fonts:\s*\[[^\]]*name:/s.test(site.replace(/\/\/.*$/gm, ''))) problems.push('site.config.ts: fonts[] is empty — list the families from DESIGN.md')

const og = site.match(/ogImage:\s*'([^']+)'/)?.[1]
if (og && !og.startsWith('http')) { try { statSync(path.join(root, 'public', og)) } catch { problems.push(`public${og} missing — 1200×630 OG image (screenshot of the hero is fine)`) } }

// Raw colours or stock Tailwind palette in templates
const walk = (d) => readdirSync(d).flatMap((n) => {
  const p = path.join(d, n)
  return statSync(p).isDirectory() ? walk(p) : /\.(vue|ts)$/.test(n) ? [p] : []
})
const stock = /\b(?:bg|text|border|from|to|via|ring|fill|stroke)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|white|black)(?:-\d{2,3})?\b/
for (const f of walk(path.join(root, 'app'))) {
  readFileSync(f, 'utf8').split('\n').forEach((line, i) => {
    const rel = path.relative(root, f)
    if (/(?<!["'\w&/])#[0-9a-f]{3,8}\b/i.test(line) && !/^\s*(\/\/|\*|<!--)/.test(line)) problems.push(`${rel}:${i + 1} raw hex colour — use a token`)
    const m = line.match(stock)
    if (m) problems.push(`${rel}:${i + 1} stock Tailwind colour "${m[0]}" — use a token`)
  })
}

if (problems.length) {
  console.error(`check:tokens — ${problems.length} problem(s):\n  ` + problems.join('\n  '))
  process.exit(1)
}
console.log('check:tokens — ok')
