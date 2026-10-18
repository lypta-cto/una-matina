// Live stations (from the business plan). Descriptions written by us, to be confirmed by the client.
// sign: the one-line label painted on Home's rotating plank (≤ 11 characters so it never wraps at 320 px).
export interface Station { id: string, name: string, short: string, note: string, sign?: string }
export const stations: Station[] = [
  { id: 'crepe', name: 'Crêpe station', short: 'Crêpes', note: 'Thin crêpes cooked to order, sweet and savory. The station we started with.' },
  { id: 'tiramisu', name: 'Tiramisu bar', short: 'Tiramisu', note: 'Layered in cups in front of guests, with toppings they choose.' },
  { id: 'fruit', name: 'Fruit cup bar', short: 'Fruit cups', note: 'Fresh-cut fruit, built to order and served cold.' },
  { id: 'charcuterie', name: 'Charcuterie', short: 'Charcuterie', note: 'Cured meats, cheeses, fruit and bread, arranged and served by an attendant.' },
  { id: 'cannoli', name: 'Cannoli bar', short: 'Cannoli', note: 'Shells filled to order, so they stay crisp.' },
  { id: 'bar', name: 'Cocktail & mocktail bar', short: 'Cocktails & mocktails', sign: 'Cocktails', note: 'Drinks made for your event. Bar service follows legal requirements and the event model we agree on.' },
]
export const comingLater = ['Coffee & espresso', 'Gelato', 'Waffles & brunch', 'Hot chocolate', 'Lemonade']
