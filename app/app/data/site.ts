// Contact and social facts. `confirmed: false` = not yet confirmed by the client: the UI does not show it
// (a wrong phone number or email would break silently; the inquiry form is the channel until then).
// Flip to `confirmed: true` once the client confirms, and it appears in the footer / form fallback.
// Instagram follows the same rule on the Events pages (footer); /crepes decides for itself what it shows.
export const contact = {
  instagram: { handle: '@unamattina', url: '', confirmed: false }, // [[TBC: handle + URL]]
  email: { value: 'hello@unamattina.com', confirmed: false }, // [[TBC]]
  phone: { value: '', confirmed: false }, // [[TBC]] no number yet
  area: 'Naples & Southwest Florida',
  replyTime: { value: 'within two business days', confirmed: false }, // [[TBC]]
}

export const eventsNav = [
  { to: '/services', label: 'Services' },
  { to: '/live-stations', label: 'Live stations' },
  { to: '/luxury-picnics', label: 'Picnics' },
  { to: '/bloom-cart', label: 'Bloom Cart' },
  { to: '/how-we-work', label: 'How we work' },
]
export const moreNav = [{ to: '/about', label: 'About' }, { to: '/crepes', label: 'Crêpes at the market' }]
