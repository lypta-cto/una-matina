// Filled from brief.md and DESIGN.md.
export default {
  url: 'https://unamattina.com', // [[TBC: domain]]
  name: 'Una Mattina',
  lang: 'en',
  description: 'Una Mattina Events & Catering: planning, design with in-house florals and live food stations for private celebrations in Naples and Southwest Florida.',
  ogImage: '/og.png',
  skipLabel: 'Skip to content',
  fonts: [
    // variable Montserrat: one face covering 400–700, so 500 / 600 / 700 are real weights, never synthesised
    { name: 'Montserrat', provider: 'google', weights: ['400 700'], styles: ['normal'], preload: true },
    { name: 'Playfair Display', provider: 'google', weights: [400], styles: ['italic'], preload: true },
    { name: 'Mrs Saint Delafield', provider: 'google', weights: [400], styles: ['normal'] },
  ] as { name: string, provider?: string, weights?: (number | string)[], styles?: ('normal' | 'italic')[], preload?: boolean }[],
}
