<script setup lang="ts">
import { stations } from '~/data/stations'
import { contact } from '~/data/site'

const route = useRoute()
const eventTypes = ['Birthday or milestone', 'Bridal or baby shower', 'Engagement or anniversary', 'Intimate wedding', 'Brunch or private dinner', 'Corporate or social', 'Something else']
const locationTypes = ['Private home or backyard', 'Beach', 'Park', 'Venue', 'Not sure yet']
const guestRanges = ['Under 20', '20–50', '50–100', '100+']
const services = [
  { id: 'planning', label: 'Planning & coordination' },
  { id: 'design', label: 'Design, florals & setup' },
  { id: 'stations', label: 'Live stations' },
  { id: 'picnic', label: 'Luxury picnic' },
  { id: 'bloom', label: 'Bloom Cart' },
  { id: 'unsure', label: 'Not sure yet' },
]
const q = (k: string) => String(route.query[k] ?? '').split(',').filter(Boolean)

const form = reactive({
  name: '', email: '', phone: '', eventType: '', date: '', flexible: false, area: '', locationType: '',
  // ?guests= from the Live Stations counter: only one of the four ranges is accepted
  guests: guestRanges.find(g => g === String(route.query.guests ?? '')) ?? '',
  services: q('services').filter(s => services.some(x => x.id === s)),
  stations: q('stations').filter(s => stations.some(x => x.id === s)),
  message: '', company: '',
})
// Prefilled stations imply the stations service.
if (form.stations.length && !form.services.includes('stations')) form.services.push('stations')

const errors = ref<Record<string, string>>({})
const tried = ref(false)
const state = ref<'idle' | 'sending' | 'sent' | 'error'>('idle')
const failure = ref<'timeout' | 'server'>('server')
const sentEl = ref<HTMLElement>()
const submitBtn = ref<HTMLButtonElement>()
// Limits match what a reply can use; the textarea shows a counter near the end.
const MAX = { name: 120, email: 254, phone: 40, area: 160, message: 4000 }
// Today in Naples, set on the client only (no SSR/hydration mismatch at midnight).
const today = ref('')
onMounted(() => { today.value = new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' }) })
const showStations = computed(() => form.services.includes('stations'))

function toggle(list: string[], id: string) {
  const i = list.indexOf(id)
  if (i >= 0) list.splice(i, 1)
  else list.push(id)
}
function validate() {
  const e: Record<string, string> = {}
  if (!form.name.trim()) e.name = 'Please tell us your name.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = 'Please enter an email we can reply to.'
  if (!form.eventType) e.eventType = 'Choose the closest type of event.'
  if (form.date && !form.flexible && today.value && form.date < today.value) e.date = 'That date has passed. Pick a future date, or tick "Dates are flexible".'
  if (!form.area.trim()) e.area = 'Tell us the city or area.'
  if (!form.guests) e.guests = 'Choose a guest count range.'
  errors.value = e
  return Object.keys(e).length === 0
}
// After a first failed attempt, errors clear as soon as the answer is fixed.
watch(form, () => { if (tried.value) validate() }, { deep: true })

// Where focus goes for each error, in form order.
const focusOrder: [string, string][] = [['name', '#f-name'], ['email', '#f-email'], ['eventType', 'input[name="eventType"]'], ['date', '#f-date'], ['area', '#f-area'], ['guests', 'input[name="guests"]']]
const TIMEOUT_MS = 15000
async function submit() {
  // The button stays focusable while sending (aria-disabled), so focus never drops to <body>; repeats are ignored here.
  if (state.value === 'sending') return
  tried.value = true
  if (!validate()) {
    await nextTick()
    const first = focusOrder.find(([k]) => errors.value[k])
    if (first) document.querySelector<HTMLElement>(first[1])?.focus()
    return
  }
  state.value = 'sending'
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS)
  try {
    await $fetch('/api/inquiry', { method: 'POST', body: { ...form, name: form.name.trim(), email: form.email.trim(), area: form.area.trim() }, signal: ctrl.signal, retry: 0 })
    state.value = 'sent'
    await nextTick()
    sentEl.value?.focus()
  }
  catch {
    failure.value = ctrl.signal.aborted ? 'timeout' : 'server'
    state.value = 'error'
    await nextTick()
    submitBtn.value?.focus()
  }
  finally {
    clearTimeout(timer)
  }
}

// Summary rows. The free-text city settles after a pause, so a screen reader isn't read every keystroke.
const areaSettled = ref(form.area)
let areaTimer: ReturnType<typeof setTimeout> | undefined
watch(() => form.area, (v) => { clearTimeout(areaTimer); areaTimer = setTimeout(() => { areaSettled.value = v.trim() }, 700) })
onBeforeUnmount(() => clearTimeout(areaTimer))
const fmtDate = (d: string) => {
  const [y, m, day] = d.split('-').map(Number)
  if (!y || !m || !day) return ''
  return new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(Date.UTC(y, m - 1, day))
}
const rows = computed(() => {
  const r = [
    { k: 'Event', v: form.eventType },
    { k: 'Date', v: form.flexible ? 'Flexible' : (form.date ? fmtDate(form.date) : '') },
    { k: 'Place', v: areaSettled.value },
    { k: 'Location', v: form.locationType },
    { k: 'Guests', v: form.guests },
    { k: 'Help with', v: services.filter(s => form.services.includes(s.id)).map(s => s.label).join(', ') },
  ]
  if (showStations.value) r.push({ k: 'Stations', v: stations.filter(s => form.stations.includes(s.id)).map(s => s.short).join(', ') })
  return r
})
// How much of the read-back is filled: the "Two of six" count.
const answered = computed(() => rows.value.filter(r => r.v).length)
const mobOpen = ref(false)
// The count reads in words ("Two of six"), like the step counters elsewhere on the site.
const words = ['None', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven']
const countText = computed(() => (answered.value ? `${words[answered.value]} of ${words[rows.value.length]!.toLowerCase()}` : `${words[rows.value.length]} questions`))
// What happens after sending: the foot of the summary board (was its own band).
const next = [
  'We read it and reply with questions.',
  'We talk it through, by call or over coffee.',
  "You get a written proposal built on your event's real scope.",
]
const firstName = computed(() => form.name.trim().split(/\s+/)[0])
</script>

<template>
  <div class="inq">
    <div class="inq__main">
      <div v-if="state === 'sent'" ref="sentEl" class="sent m-follow" role="status" tabindex="-1">
        <p class="statement">Thank you, {{ firstName }}.</p>
        <p class="sent__body">We'll write to <span class="sent__email">{{ form.email.trim() }}</span><template v-if="contact.replyTime.confirmed"> {{ contact.replyTime.value }}</template> with a few questions about your day.</p>
      </div>

      <form v-else class="f" novalidate @submit.prevent="submit">
        <fieldset class="f__group">
          <legend class="f__legend">Who are we talking to?</legend>
          <div class="f__row f__row--3">
            <div class="f__field">
              <label for="f-name" class="f__label">Your name <span class="f__req">(required)</span></label>
              <input id="f-name" v-model="form.name" class="f__input" autocomplete="name" :maxlength="MAX.name" :aria-invalid="!!errors.name" :aria-describedby="errors.name ? 'e-name' : undefined">
              <p v-if="errors.name" id="e-name" class="f__err">{{ errors.name }}</p>
            </div>
            <div class="f__field">
              <label for="f-email" class="f__label">Email <span class="f__req">(required)</span></label>
              <input id="f-email" v-model="form.email" type="email" inputmode="email" autocomplete="email" class="f__input" :maxlength="MAX.email" :aria-invalid="!!errors.email" :aria-describedby="errors.email ? 'e-email' : undefined">
              <p v-if="errors.email" id="e-email" class="f__err">{{ errors.email }}</p>
            </div>
            <div class="f__field">
              <label for="f-phone" class="f__label">Phone</label>
              <input id="f-phone" v-model="form.phone" type="tel" inputmode="tel" autocomplete="tel" class="f__input" :maxlength="MAX.phone">
            </div>
          </div>
        </fieldset>

        <fieldset class="f__group" :aria-describedby="errors.eventType ? 'e-type' : undefined">
          <legend class="f__legend">What are you celebrating? <span class="f__req">(required)</span></legend>
          <div class="f__chips" :class="{ 'is-invalid': errors.eventType }">
            <label v-for="t in eventTypes" :key="t" class="chip"><input v-model="form.eventType" type="radio" name="eventType" :value="t" class="chip__in" :aria-invalid="!!errors.eventType" :aria-describedby="errors.eventType ? 'e-type' : undefined"><span class="chip__face">{{ t }}</span></label>
          </div>
          <p v-if="errors.eventType" id="e-type" class="f__err">{{ errors.eventType }}</p>
        </fieldset>

        <fieldset class="f__group">
          <legend class="f__legend">When and where is it?</legend>
          <div class="f__row f__row--2">
            <div class="f__field">
              <label for="f-date" class="f__label">Date</label>
              <input id="f-date" v-model="form.date" type="date" class="f__input" :min="today || undefined" :disabled="form.flexible" :aria-invalid="!!errors.date" :aria-describedby="errors.date ? 'e-date' : undefined">
              <p v-if="errors.date" id="e-date" class="f__err">{{ errors.date }}</p>
              <label class="f__check"><input v-model="form.flexible" type="checkbox"> Dates are flexible</label>
            </div>
            <div class="f__field">
              <label for="f-area" class="f__label">City or area <span class="f__req">(required)</span></label>
              <input id="f-area" v-model="form.area" class="f__input" placeholder="e.g. Naples, Bonita Springs, Marco Island" autocomplete="address-level2" :maxlength="MAX.area" :aria-invalid="!!errors.area" :aria-describedby="errors.area ? 'e-area' : undefined">
              <p v-if="errors.area" id="e-area" class="f__err">{{ errors.area }}</p>
            </div>
          </div>
          <div class="f__sub-group" role="radiogroup" aria-labelledby="f-loc-label">
            <p id="f-loc-label" class="f__sub">Type of location</p>
            <div class="f__chips">
              <label v-for="t in locationTypes" :key="t" class="chip"><input v-model="form.locationType" type="radio" name="locationType" :value="t" class="chip__in"><span class="chip__face">{{ t }}</span></label>
            </div>
          </div>
        </fieldset>

        <fieldset class="f__group" :aria-describedby="errors.guests ? 'e-guests' : undefined">
          <legend class="f__legend">How many guests? <span class="f__req">(required)</span></legend>
          <div class="f__chips" :class="{ 'is-invalid': errors.guests }">
            <label v-for="g in guestRanges" :key="g" class="chip"><input v-model="form.guests" type="radio" name="guests" :value="g" class="chip__in" :aria-invalid="!!errors.guests" :aria-describedby="errors.guests ? 'e-guests' : undefined"><span class="chip__face tnum">{{ g }}</span></label>
          </div>
          <p v-if="errors.guests" id="e-guests" class="f__err">{{ errors.guests }}</p>
        </fieldset>

        <fieldset class="f__group">
          <legend class="f__legend">What would you like help with? <span class="f__req">(pick any)</span></legend>
          <div class="f__chips">
            <label v-for="s in services" :key="s.id" class="chip"><input type="checkbox" :checked="form.services.includes(s.id)" class="chip__in" @change="toggle(form.services, s.id)"><span class="chip__face">{{ s.label }}</span></label>
          </div>
          <div v-if="showStations" class="f__sub-group" role="group" aria-labelledby="f-st-label">
            <p id="f-st-label" class="f__sub">Which stations?</p>
            <div class="f__chips">
              <label v-for="s in stations" :key="s.id" class="chip"><input type="checkbox" :checked="form.stations.includes(s.id)" class="chip__in" @change="toggle(form.stations, s.id)"><span class="chip__face">{{ s.short }}</span></label>
            </div>
          </div>
        </fieldset>

        <div class="f__group">
          <label for="f-msg" class="f__legend">Anything else we should know?</label>
          <textarea id="f-msg" v-model="form.message" rows="5" class="f__input f__area" :maxlength="MAX.message" :aria-describedby="form.message.length > MAX.message - 500 ? 'f-msg-count' : undefined" placeholder="The occasion, the feel you're after, colours, anything you've already booked." />
          <p v-if="form.message.length > MAX.message - 500" id="f-msg-count" class="f__count tnum">{{ form.message.length }} of {{ MAX.message }} characters</p>
        </div>

        <div class="f__hp" aria-hidden="true"><label for="f-company">Company</label><input id="f-company" v-model="form.company" tabindex="-1" autocomplete="off"></div>

        <div class="f__end">
          <details class="inq__mob" @toggle="mobOpen = ($event.target as HTMLDetailsElement).open">
            <summary class="inq__mob-sum"><span>Your event so far</span><span class="inq__mob-n">{{ countText }}</span><span class="inq__plus" aria-hidden="true" /></summary>
            <div v-if="mobOpen" class="inq__mob-body"><InqSummary :rows="rows" /></div>
          </details>

          <div class="f__submit">
            <button ref="submitBtn" type="submit" class="pill pill--sun pill--on-light f__send" :aria-disabled="state === 'sending' ? 'true' : undefined">{{ state === 'sending' ? 'Sending…' : 'Send inquiry' }} <span v-if="state !== 'sending'" class="pill__arrow" aria-hidden="true">→</span></button>
            <p v-if="state === 'error'" class="f__err f__fail" role="alert">
              {{ failure === 'timeout' ? 'This is taking too long, so we stopped trying. Your answers are still here: check your connection and send again' : 'Something went wrong on our side. Your answers are still here: send again in a moment' }}<template v-if="contact.email.confirmed">, or write to <a :href="`mailto:${contact.email.value}`" class="link">{{ contact.email.value }}</a></template>.
            </p>
          </div>
        </div>
      </form>
      <slot />
    </div>

    <aside class="inq__side" aria-labelledby="inq-sum-title">
      <Board tone="brown" valance="apricot" class="inq__board">
        <div class="inq__live">
          <div class="inq__head">
            <h2 id="inq-sum-title" class="inq__title">{{ state === 'sent' ? 'What you sent us' : 'Your event so far' }}</h2>
            <p class="inq__n">{{ countText }}</p>
          </div>
          <InqSummary :rows="rows" />
        </div>
        <div class="inq__next">
          <h2 class="inq__next-t">What happens next</h2>
          <ol class="inq__steps">
            <li v-for="(n, i) in next" :key="n" class="inq__step">
              <span class="inq__step-n" aria-hidden="true">{{ i + 1 }}</span>
              <span>{{ n }}<template v-if="i === 0 && contact.replyTime.confirmed"> Usually {{ contact.replyTime.value }}.</template></span>
            </li>
          </ol>
        </div>
      </Board>
    </aside>
  </div>
</template>

<style scoped>
.inq { display: grid; grid-template-columns: minmax(0, 1fr); gap: var(--space-block); }
.inq__main { min-width: 0; }
@media (min-width: 900px) {
  .inq { grid-template-columns: repeat(12, minmax(0, 1fr)); column-gap: clamp(24px, 2.4vw, 40px); align-items: start; }
  .inq__main { grid-column: 1 / span 7; }
  .inq__side { grid-column: 8 / span 5; position: sticky; top: 96px; }
  .inq__mob { display: none; }
}
@media (min-width: 1200px) { .inq__side { grid-column: 9 / span 4; } }

/* Summary: a brown board with an apricot valance (the /crepes hero board). Phones: only its foot (what happens next)
   is shown, after the form; the read-back itself is the disclosure above the submit. */
.inq__board.board { gap: 0; padding-bottom: clamp(24px, 2.6vw, 36px); }
.inq__live { display: none; container-type: inline-size; }
@media (min-width: 900px) { .inq__live { display: grid; gap: 22px; padding-bottom: clamp(26px, 2.6vw, 34px); } }
.inq__head { display: grid; gap: 4px; }
.inq__title { font: 700 var(--step-2)/1.1 var(--font-display); letter-spacing: -0.01em; text-transform: none; }
.inq__n { font-weight: 500; font-size: 0.9375rem; color: color-mix(in srgb, var(--on-field-dark) 80%, var(--field-dark)); }
.inq__next { display: grid; gap: 14px; }
@media (min-width: 900px) { .inq__next { padding-top: clamp(12px, 1.6vw, 20px); } }
.inq__next-t { font: 700 1.0625rem/1.3 var(--font-text); letter-spacing: 0; text-transform: none; }
.inq__steps { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
.inq__step { display: grid; grid-template-columns: 1.6em minmax(0, 1fr); font-family: var(--font-accent); font-style: italic; font-size: 1.125rem; line-height: 1.35; }
.inq__step-n { font: 600 0.9375rem/1.6 var(--font-text); font-style: normal; color: var(--accent); }

.inq__mob { background: var(--field-dark); color: var(--on-field-dark); --focus-ring: var(--on-field-dark); }
.inq__mob :focus-visible { outline-color: var(--on-field-dark); }
.inq__mob-sum { display: flex; align-items: center; gap: 16px; min-height: 56px; padding: 14px 20px; cursor: pointer; list-style: none; font-weight: 700; font-size: 1.125rem; line-height: 1.3; }
.inq__mob-sum::-webkit-details-marker { display: none; }
.inq__mob-n { margin-left: auto; font-weight: 500; font-size: 0.875rem; white-space: nowrap; color: color-mix(in srgb, var(--on-field-dark) 80%, var(--field-dark)); }
.inq__plus { position: relative; flex: none; width: 16px; height: 16px; }
.inq__plus::before, .inq__plus::after { content: ""; position: absolute; left: 0; right: 0; top: 7px; height: 2px; background: currentColor; }
.inq__plus::after { transform: rotate(90deg); transition: transform var(--dur-base) var(--ease-out); }
.inq__mob[open] .inq__plus::after { transform: rotate(0deg); }
.inq__mob-body { padding: 4px 20px 22px; container-type: inline-size; }

.f { display: grid; gap: clamp(76px, 6vw, 88px); }
.f__group { border: 0; margin: 0; padding: 0; display: grid; gap: 14px; min-width: 0; }
.f__legend { display: block; font-family: var(--font-accent); font-style: italic; font-weight: 400; font-size: var(--step-2); line-height: 1.2; margin-bottom: 10px; padding: 0; }
.f__legend .f__req { font-family: var(--font-text); font-style: normal; font-size: 0.875rem; font-weight: 500; white-space: nowrap; }
.f__row { display: grid; gap: 18px; }
@media (min-width: 1200px) { .f__row--3 { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); } .f__row--3 > :first-child { grid-column: 1 / -1; } }
@media (min-width: 640px) { .f__row--2 { grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr); } }
.f__field { display: grid; gap: 8px; align-content: start; min-width: 0; }
.f__label, .f__sub { font-weight: 500; font-size: 0.9375rem; }
.f__sub-group { display: grid; gap: 10px; margin-top: 8px; }
.f__req { font-weight: 400; color: var(--ink-muted); }
.f__input {
  width: 100%; min-height: 52px; padding: 12px 14px; font: 400 1rem/1.4 var(--font-text); color: var(--ink);
  background: var(--ground); border: 0; border-bottom: 2px solid var(--line); border-radius: 0;
  transition: border-color var(--dur-fast) var(--ease-out), background-color var(--dur-fast) var(--ease-out);
}
.f__input:focus { outline: none; border-bottom-color: var(--ink); background: var(--surface); }
.f__input:focus-visible { outline: 3px solid var(--ink); outline-offset: 2px; }
/* Chrome focuses the date's inner sub-fields, so :focus-visible never matches the input itself */
.f__input[type="date"]:focus { outline: 3px solid var(--ink); outline-offset: 2px; }
.f__input[aria-invalid="true"] { border-bottom-color: var(--danger); }
.f__input:disabled { opacity: 0.5; }
.f__area { min-height: 140px; resize: vertical; }
.f__count { font-size: var(--step--1); color: var(--ink-muted); }
.f__check { display: inline-flex; align-items: center; gap: 10px; min-height: 44px; font-size: 0.9375rem; cursor: pointer; justify-self: start; }
.f__check input { width: 20px; height: 20px; accent-color: var(--ink); }

/* Chips are pills (the half-round ends of the site's actions). A drawn marker says what kind of choice it is (circle = one, square = any) and carries the selected
   state without relying on colour: a dot or a tick appears inside it. Width never changes, so rows never reflow. */
.f__chips { display: flex; flex-wrap: wrap; gap: 8px; }
.chip { position: relative; cursor: pointer; -webkit-tap-highlight-color: transparent; }
.chip__in { position: absolute; opacity: 0; width: 1px; height: 1px; }
.chip__face {
  position: relative; display: inline-flex; align-items: center; min-height: 48px; padding: 0 20px 0 44px; border: 2px solid var(--ink); border-radius: 999px; background: var(--ground);
  font-weight: 500; font-size: 0.9375rem; white-space: nowrap; user-select: none; -webkit-user-select: none; -webkit-touch-callout: none;
  transition: background-color var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out);
}
.chip__face::before { content: ""; position: absolute; left: 17px; top: 50%; width: 16px; height: 16px; margin-top: -8px; border: 2px solid currentColor; box-sizing: border-box; }
.chip__in[type="radio"] + .chip__face::before { border-radius: 50%; }
.chip__face::after {
  content: ""; position: absolute; opacity: 0; transform: scale(0.6);
  transition: opacity var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out);
}
/* radio: a dot */
.chip__in[type="radio"] + .chip__face::after { left: 21px; top: 50%; width: 8px; height: 8px; margin-top: -4px; border-radius: 50%; background: currentColor; }
/* checkbox: a tick drawn from two borders */
.chip__in[type="checkbox"] + .chip__face::after { left: 22px; top: 50%; width: 6px; height: 10px; margin-top: -7px; border: solid currentColor; border-width: 0 2px 2px 0; transform: rotate(45deg) scale(0.6); }
.chip__in:checked + .chip__face { background: var(--accent); color: var(--on-accent); }
.chip__in:checked + .chip__face::after { opacity: 1; transform: none; }
.chip__in[type="checkbox"]:checked + .chip__face::after { transform: rotate(45deg); }
.chip:active .chip__face { transform: scale(0.97); }
.chip__in:checked + .chip__face::before { border-color: currentColor; }
.chip__in:focus-visible + .chip__face { outline: 3px solid var(--ink); outline-offset: 3px; }
.is-invalid .chip__face { border-color: var(--danger); }
.is-invalid .chip__in:focus + .chip__face { outline: 3px solid var(--ink); outline-offset: 3px; }
@media (hover: hover) and (pointer: fine) { .chip:hover .chip__in:not(:checked) + .chip__face { background: var(--surface); } }
@media (max-width: 379px) { .chip__face { white-space: normal; padding-block: 10px; line-height: 1.3; } }

.f__err { color: var(--danger); font-weight: 500; font-size: 0.9375rem; }
.f__fail { max-width: 46ch; overflow-wrap: anywhere; }
.f__hp { position: absolute; left: -9999px; }
.f__end { display: grid; gap: 16px; }
.f__submit { display: grid; gap: 12px; justify-items: start; }
@media (max-width: 599px) { .f__send { width: 100%; } }
.sent .statement { font-size: var(--step-3); line-height: 1.15; overflow-wrap: anywhere; }
.sent { background: var(--surface); padding: clamp(24px, 4vw, 56px); display: grid; gap: 12px; min-width: 0; }
.sent:focus { outline: none; }
.sent:focus-visible { outline: 3px solid var(--ink); outline-offset: 3px; }
.sent__body { font-size: var(--step-1); line-height: 1.45; max-width: 44ch; }
.sent__email { overflow-wrap: anywhere; }
</style>
