// Where the crêpe stand is right now, or next, computed in Naples time.
// The clock lives in useState, so the server's value travels in the payload and hydration matches;
// the client then re-reads the real clock on mount and every minute (a cached page corrects itself).
import { TIMEZONE, dayNames, fmtTime, marketStatus } from '~/data/markets'

function naplesNow() {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: TIMEZONE, weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date())
  const get = (t: string) => parts.find(p => p.type === t)?.value ?? '0'
  return { weekday: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday')), minutes: Number(get('hour')) * 60 + Number(get('minute')) }
}

export function useMarketStatus() {
  const now = useState('crp-naples-now', naplesNow)
  onMounted(() => {
    now.value = naplesNow()
    const t = setInterval(() => (now.value = naplesNow()), 60_000)
    onBeforeUnmount(() => clearInterval(t))
  })
  const status = computed(() => marketStatus(now.value.weekday, now.value.minutes))
  /** "Today", "Tomorrow", "Sunday", or "Saturday next week" when the same weekday's market has closed. */
  const when = computed(() => {
    const s = status.value
    if (s.state === 'open') return 'Open now'
    if (s.state !== 'next' || !s.market) return ''
    if (s.inDays === 0) return 'Today'
    if (s.inDays === 1) return 'Tomorrow'
    if (s.inDays >= 7) return `${dayNames[s.market.day]} next week`
    return dayNames[s.market.day]
  })
  const hours = computed(() => (status.value.market ? `${fmtTime(status.value.market.open)} – ${fmtTime(status.value.market.close)}` : ''))
  return { status, when, hours, now }
}
