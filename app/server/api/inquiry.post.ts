// Inquiry endpoint. Validates and acknowledges. Delivery (email / CRM) is not wired yet: [[TBC: where inquiries go]].
// Everything is type-checked and length-capped here, whatever the form sends (the form also sets maxlength).
import { stations } from '../../app/data/stations'

const required = ['name', 'email', 'eventType', 'area', 'guests'] as const
const SERVICE_IDS = ['planning', 'design', 'stations', 'picnic', 'bloom', 'unsure']
const STATION_IDS = stations.map(s => s.id)
const MAX_BODY = 32 * 1024

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '')
// arrays: strings only, known ids only, at most 10
const list = (v: unknown, known: string[]) =>
  Array.isArray(v) ? [...new Set(v.filter((x): x is string => typeof x === 'string' && known.includes(x)))].slice(0, 10) : []

export default defineEventHandler(async (event) => {
  const size = Number(getRequestHeader(event, 'content-length') ?? 0)
  if (size > MAX_BODY) throw createError({ statusCode: 413, statusMessage: 'Inquiry too long' })
  const body = await readBody<Record<string, unknown>>(event)
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw createError({ statusCode: 400, statusMessage: 'Invalid body' })
  if (body.company) return { ok: true } // honeypot

  const textKeys = ['name', 'email', 'phone', 'eventType', 'date', 'area', 'locationType', 'guests', 'message'] as const
  const badType = textKeys.filter(k => body[k] !== undefined && typeof body[k] !== 'string')
  if (badType.length) throw createError({ statusCode: 422, statusMessage: 'Invalid field types', data: { invalid: badType } })

  const clean = {
    name: str(body.name, 120),
    email: str(body.email, 254),
    phone: str(body.phone, 40),
    eventType: str(body.eventType, 60),
    date: /^\d{4}-\d{2}-\d{2}$/.test(str(body.date, 10)) ? str(body.date, 10) : '',
    flexible: body.flexible === true,
    area: str(body.area, 120),
    locationType: str(body.locationType, 60),
    guests: str(body.guests, 20),
    services: list(body.services, SERVICE_IDS),
    stations: list(body.stations, STATION_IDS),
    message: str(body.message, 4000),
  }

  const missing = required.filter(k => !clean[k])
  if (missing.length) throw createError({ statusCode: 422, statusMessage: 'Missing fields', data: { missing } })
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean.email)) throw createError({ statusCode: 422, statusMessage: 'Invalid email', data: { missing: ['email'] } })
  // TODO before launch: forward `clean` to the client's inbox or CRM.
  console.info('[inquiry]', JSON.stringify({ ...clean, receivedAt: new Date().toISOString() }))
  return { ok: true }
})
