// Crêpe menu. Names and prices from the stand mockup; descriptions written by us. ALL to be confirmed. [[TBC]]
export interface Crepe { name: string, note: string, price: number }
export const menu: { title: string, items: Crepe[] }[] = [
  {
    title: 'Sweet',
    items: [
      { name: 'Nutella & Banana', note: 'Warm Nutella, sliced banana, powdered sugar.', price: 10 },
      { name: 'Strawberry Dream', note: 'Fresh strawberries, whipped cream, chocolate drizzle.', price: 10 },
      { name: 'Pistachio Bliss', note: 'Pistachio cream and crushed pistachios.', price: 11 },
      { name: 'Classic Sugar', note: 'Butter, sugar and a squeeze of lemon.', price: 8 },
      { name: 'Build Your Own', note: 'Pick your spread and fruit.', price: 10 },
    ],
  },
  {
    title: 'Savory',
    items: [
      { name: 'Mediterranean', note: 'Feta, olives, tomato and oregano.', price: 11 },
      { name: 'Caprese', note: 'Mozzarella, tomato, basil, olive oil.', price: 11 },
      { name: 'Ham & Cheese', note: 'Ham and melted cheese.', price: 10 },
      { name: 'Spinach & Feta', note: 'Sautéed spinach and feta.', price: 10 },
    ],
  },
]
