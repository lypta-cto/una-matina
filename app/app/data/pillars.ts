// The three service pillars (from the business plan) and the example event used on Home.
export type PillarId = 'planning' | 'design' | 'stations'
export const pillars: { id: PillarId, name: string, short: string, line: string, to: string }[] = [
  { id: 'planning', name: 'Planning & coordination', short: 'Planning', line: 'From the first idea and budget to vendors, layout, timeline and the day itself.', to: '/services#planning' },
  { id: 'design', name: 'Design, florals & setup', short: 'Design & florals', line: 'The concept, tablescapes, signage and rentals. Florals are arranged by us, in-house. We set up and we pack out.', to: '/services#design' },
  { id: 'stations', name: 'Live station catering', short: 'Live stations', line: 'Stations prepared in front of your guests, from crêpes to cannoli to cocktails.', to: '/live-stations' },
]

// Example scope from the business plan: a backyard 40th birthday for 50 guests. Not a past event.
export const examplePieces: { name: string, by: PillarId, partner?: boolean }[] = [
  { name: 'Concept & budget', by: 'planning' },
  { name: 'Layout & rentals', by: 'planning' },
  { name: 'Florals & tablescape', by: 'design' },
  { name: 'DJ & entertainment', by: 'planning', partner: true },
  { name: 'Cocktail station', by: 'stations' },
  { name: 'Crêpe & dessert station', by: 'stations' },
  { name: 'Staff on the day', by: 'planning' },
  { name: 'Day-of coordination', by: 'planning' },
]
