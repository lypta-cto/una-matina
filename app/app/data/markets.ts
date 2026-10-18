// Market schedule for /crepes. ALL placeholder until confirmed by the client. [[TBC]]
// day: 0 = Sunday … 6 = Saturday. Times are local Naples time (America/New_York).
export interface Market { day: number, open: string, close: string, name: string, address: string, mapsQuery: string, tbc: boolean }

export const TIMEZONE = 'America/New_York'

export const markets: Market[] = [
  { day: 6, open: '08:00', close: '12:00', name: 'Saturday market', address: 'Address to confirm, Naples, FL', mapsQuery: 'Naples FL farmers market', tbc: true },
  { day: 0, open: '09:00', close: '13:00', name: 'Sunday market', address: 'Address to confirm, Naples, FL', mapsQuery: 'Naples FL farmers market', tbc: true },
]

export const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export function fmtTime(hhmm: string) {
  const [h, m] = hhmm.split(':').map(Number)
  const suffix = h >= 12 ? 'pm' : 'am'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return m ? `${h12}:${String(m).padStart(2, '0')} ${suffix}` : `${h12} ${suffix}`
}

export function mapsUrl(m: Market) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(m.mapsQuery)}`
}

/** Where the stand is right now, or next. Pure: pass "now" as Naples weekday + minutes. */
export function marketStatus(weekday: number, minutes: number) {
  const toMin = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + m }
  const open = markets.find(m => m.day === weekday && minutes >= toMin(m.open) && minutes < toMin(m.close))
  if (open) return { state: 'open' as const, market: open, inDays: 0 }
  let best: { market: Market, inDays: number } | null = null
  for (const m of markets) {
    let d = (m.day - weekday + 7) % 7
    if (d === 0 && minutes >= toMin(m.close)) d = 7
    if (d === 0 && minutes < toMin(m.open)) d = 0
    if (!best || d < best.inDays || (d === best.inDays && toMin(m.open) < toMin(best.market.open))) best = { market: m, inDays: d }
  }
  return best ? { state: 'next' as const, ...best } : { state: 'none' as const, market: null, inDays: -1 }
}
