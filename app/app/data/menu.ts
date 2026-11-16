// Crêpe menu, from the stand's printed menu ("Una Mattina Menu.pdf", Nov 2026). /crepes shows it in two
// columns, /crepes/menu reproduces the printed sheet. Names are stored in title case; the sheet sets them
// in capitals with CSS. One typo fixed against the print: "Fanstasy" → "Fantasy".
export interface Crepe {
  name: string
  note: string
  price: number
  /** extra offered on this crêpe, e.g. "Add prosciutto +$2" */
  addOn?: string
  /** marked with the printed "Raw food" badge (see the consumer advisory) */
  raw?: boolean
}

export const menu: { title: string, items: Crepe[] }[] = [
  {
    title: 'Sweet',
    items: [
      { name: 'The Classic Favorite', note: 'Nutella, banana & strawberries', price: 13 },
      { name: 'Nutty Berry', note: 'Peanut Nutella & strawberries', price: 13 },
      { name: 'Biscoffana', note: 'Biscoff cookie butter, banana & Biscoff cookie crumble', price: 13 },
      { name: 'S\'more Love', note: 'Nutella, graham crackers & marshmallows', price: 13 },
      { name: 'Cookies & Cream', note: 'White chocolate & Oreo cookie crumble', price: 13 },
      { name: 'Ferrero Fantasy', note: 'Dark hazelnut cream & hazelnut crumble', price: 13 },
      { name: 'Coconut Kiss', note: 'White chocolate, coconut & hazelnut crumble', price: 14 },
      { name: 'Kinder Crush', note: 'White and dark hazelnut creams, raspberries & Bueno wafer', price: 14 },
      { name: 'The Dubai', note: 'Dark hazelnut cream, crispy kataifi, pistachio cream & crushed pistachios', price: 15 },
      { name: 'Pistachio Dream', note: 'Pistachio cream, white hazelnut cream, raspberries & crushed pistachios', price: 15 },
    ],
  },
  {
    title: 'Savory',
    items: [
      { name: 'Ham & Cheese', note: 'Ham, cheese & sour cream', price: 14 },
      { name: 'Caprese', note: 'Pesto, mozzarella, tomato & fresh basil, balsamic glaze', price: 15, addOn: 'Add prosciutto +$2' },
      { name: 'Turkey BLT', note: 'Turkey breast, bacon, lettuce, tomato & mayo', price: 15 },
      { name: 'Smoked Salmon', note: 'Smoked salmon, cream cheese, capers, dill, tomato', price: 16, raw: true },
    ],
  },
]

/** "Make your own": a plain crêpe, then spreads and toppings at +$2 each; sauces have no price on the menu.
 *  `lines` keeps the printed line breaks, so the sheet at /crepes/menu breaks where the print does. */
export const makeYourOwn: { price: number, groups: { title: string, extra: number | null, lines: string[][] }[] } = {
  price: 10,
  groups: [
    { title: 'Spreads', extra: 2, lines: [['Nutella', 'Peanut Nutella'], ['Pistachio', 'Biscoff'], ['White Chocolate', 'Dark Hazelnut'], ['White Hazelnut']] },
    { title: 'Toppings', extra: 2, lines: [['Banana', 'Strawberries', 'Raspberries'], ['Oreo', 'M&M', 'Coconut', 'Marshmallows'], ['Pistachios', 'Hazelnuts', 'Kataifi'], ['Biscoff Cookies', 'Graham Cookies']] },
    { title: 'Topping Sauces', extra: null, lines: [['Milk Chocolate', 'White Chocolate'], ['Pistachio', 'Biscoff'], ['White Hazelnut', 'Caramel'], ['Whipped Cream']] },
  ],
}

export const menuTagline = 'Made with finest Italian ingredients'

export const menuNotices = {
  consumer: 'Consumer Advisory: Consuming raw or undercooked meats, poultry, seafood, shellfish, or eggs may increase your risk of foodborne illness.',
  allergen: 'ALLERGEN NOTICE: Our crêpes contain gluten, dairy, and eggs. Cross-contact with nuts, soy, and other allergens may occur.',
  allergenAsk: 'Please inform us of any food allergies.',
}
