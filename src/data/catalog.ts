import type { BrandId, CategoryId, PackType, Product } from '../types';

export const categories: { id: CategoryId; name: string; blurb: string; emoji: string }[] = [
  { id: 'fruit-drinks', name: 'Fruit Drinks', blurb: 'Mango, apple, peach, guava & pomegranate', emoji: '🥭' },
  { id: 'basil-seed', name: 'Basil Seed Drinks', blurb: 'Tukh malanga in six flavours', emoji: '🍹' },
  { id: 'carbonated', name: 'Fizzy Drinks', blurb: 'Gold Lychee & Gold Apple', emoji: '🥤' },
  { id: 'energy', name: 'Energy Drinks', blurb: 'Caffeine + ginseng kick', emoji: '⚡' },
  { id: 'water', name: 'Drinking Water', blurb: 'Ab e Hayat bottled water', emoji: '💧' },
];

export const brands: { id: BrandId; name: string; blurb: string; accent: string }[] = [
  { id: 'mary-diamond', name: 'Mary Diamond', blurb: 'Fruit drinks in PET, glass & tetra', accent: '#1F3A93' },
  { id: 'diamond-way', name: 'Diamond Way', blurb: 'Basil seed drinks & juices', accent: '#1F8A4C' },
  { id: 'sultan-gold', name: 'Sultan Gold', blurb: 'Fizzy drinks & energy', accent: '#D4A017' },
  { id: 'ab-e-hayat', name: 'Ab e Hayat', blurb: 'Bottled drinking water', accent: '#2563C9' },
];

export const packLabels: Record<PackType, string> = {
  'pet-bottle': 'PET bottle',
  'glass-bottle': 'Glass bottle',
  'tetra-pack': 'Tetra pack',
};

const img = (name: string) => `images/products/${name}.jpg`;
const banner = (name: string) => `images/${name}.jpg`;

type FruitSeed = {
  flavour: string;
  accent: string;
  note: string;
  fruit: string;
  popularity: number;
};

/* ------------------------------------------------------------------ */
/* Mary Diamond — PET fruit drinks                                     */
/* ------------------------------------------------------------------ */

const maryDiamondPet: FruitSeed[] = [
  { flavour: 'Mango', accent: '#F5A524', note: 'Thick, sun-ripened Chaunsa sweetness.', fruit: 'mango', popularity: 98 },
  { flavour: 'Apple', accent: '#D93A3A', note: 'Crisp red apple with a clean finish.', fruit: 'apple', popularity: 88 },
  { flavour: 'Peach', accent: '#F2884B', note: 'Soft, syrupy peach — a family favourite.', fruit: 'peach', popularity: 80 },
  { flavour: 'Pomegranate', accent: '#C42A44', note: 'Deep ruby anaar with a tart edge.', fruit: 'pomegranate', popularity: 74 },
  { flavour: 'Guava', accent: '#E86A8B', note: 'Tropical amrood, thick and fragrant.', fruit: 'guava', popularity: 69 },
];

const petProducts: Product[] = maryDiamondPet.map((f) => ({
  slug: `mary-diamond-${f.fruit}-pet`,
  name: `Mary Diamond ${f.flavour}`,
  tagline: `${f.flavour} Fruit Drink · PET bottle`,
  brand: 'mary-diamond' as BrandId,
  category: 'fruit-drinks' as CategoryId,
  pack: 'pet-bottle' as PackType,
  flavour: f.flavour,
  accent: f.accent,
  images: [img(`mary-diamond-pet-${f.fruit}`), banner('mary-diamond-pet-banner')],
  description: `${f.note} Mary Diamond ${f.flavour} is our everyday fruit drink in a resealable PET bottle — chilled for lunch boxes, dawats and long drives. Bottled fresh at our Lahore plant.`,
  highlights: [
    `Real ${f.flavour.toLowerCase()} taste in every bottle`,
    'Resealable PET — drink half now, half later',
    'Shelf stable; no refrigeration needed until opened',
    'Available in 500 ml and 1.5 litre',
  ],
  ingredients:
    'Water, sugar, fruit pulp/concentrate, acidity regulator (INS 330), stabiliser, permitted flavour and colour, preservative (INS 211).',
  variants: [
    { id: '500ml', label: '500 ml', price: 90, compareAt: 100, units: 1 },
    { id: '1500ml', label: '1.5 litre', price: 180, compareAt: 200, units: 1 },
    { id: 'case-500-12', label: 'Case · 12 × 500 ml', price: 980, compareAt: 1080, units: 12 },
  ],
  badges: f.popularity > 90 ? ['Best seller'] : undefined,
  popularity: f.popularity,
}));

/* ------------------------------------------------------------------ */
/* Mary Diamond — 250 ml glass bottles                                 */
/* ------------------------------------------------------------------ */

const maryDiamondGlass: FruitSeed[] = [
  { flavour: 'Mango', accent: '#F5A524', note: 'Our signature mango, served cold in glass.', fruit: 'mango', popularity: 95 },
  { flavour: 'Lychee', accent: '#E58AA8', note: 'Perfumed lychee — light and floral.', fruit: 'lychee', popularity: 86 },
  { flavour: 'Apple', accent: '#B3452F', note: 'Amber apple with a cider-like nose.', fruit: 'apple', popularity: 78 },
  { flavour: 'Peach', accent: '#F2884B', note: 'Blushing peach, gently tart.', fruit: 'peach', popularity: 72 },
  { flavour: 'Pomegranate', accent: '#C42A44', note: 'Bright ruby anaar in a swing-top bottle.', fruit: 'pomegranate', popularity: 70 },
];

const glassProducts: Product[] = maryDiamondGlass.map((f) => ({
  slug: `mary-diamond-${f.fruit}-glass`,
  name: `Mary Diamond ${f.flavour} Glass`,
  tagline: `${f.flavour} Fruit Drink · 250 ml glass`,
  brand: 'mary-diamond' as BrandId,
  category: 'fruit-drinks' as CategoryId,
  pack: 'glass-bottle' as PackType,
  flavour: f.flavour,
  accent: f.accent,
  images: [img(`mary-diamond-glass-${f.fruit}`), banner('mary-diamond-glass-banner')],
  description: `${f.note} The 250 ml glass bottle is what restaurants, marquees and event caterers order from us — it pours like a premium drink and keeps the flavour clean.`,
  highlights: [
    'Premium 250 ml glass with swing-top cap',
    'Table-ready for restaurants, events and gifting',
    'Chills faster than plastic and pours crystal clear',
    'Sold singly or by the case of 24',
  ],
  ingredients:
    'Water, sugar, fruit pulp/concentrate, acidity regulator (INS 330), permitted flavour and colour, preservative (INS 211).',
  variants: [
    { id: 'single', label: 'Single · 250 ml', price: 70, units: 1 },
    { id: 'pack-6', label: 'Pack of 6', price: 400, compareAt: 420, units: 6 },
    { id: 'case-24', label: 'Case of 24', price: 1550, compareAt: 1680, units: 24 },
  ],
  badges: ['Restaurant pick'],
  popularity: f.popularity,
}));

/* ------------------------------------------------------------------ */
/* Mary Diamond — 200 ml tetra packs                                   */
/* ------------------------------------------------------------------ */

const tetraProducts: Product[] = [
  { flavour: 'Mango', accent: '#F5A524', fruit: 'mango', popularity: 92 },
  { flavour: 'Apple', accent: '#D93A3A', fruit: 'apple', popularity: 84 },
].map((f) => ({
  slug: `mary-diamond-${f.fruit}-tetra`,
  name: `Mary Diamond ${f.flavour} Tetra`,
  tagline: `${f.flavour} Fruit Drink · 200 ml tetra pack`,
  brand: 'mary-diamond' as BrandId,
  category: 'fruit-drinks' as CategoryId,
  pack: 'tetra-pack' as PackType,
  flavour: f.flavour,
  accent: f.accent,
  images: [img(`mary-diamond-tetra-${f.fruit}`), banner('mary-diamond-tetra-banner')],
  description: `The lunch-box size. A 200 ml tetra pack of Mary Diamond ${f.flavour} — light to carry, impossible to spill, and the size school canteens reorder every week.`,
  highlights: [
    '200 ml tetra pack — built for lunch boxes',
    'Six-layer carton keeps it fresh without refrigeration',
    'Bulk cartons for canteens, offices and events',
    'No glass, no breakage in transit',
  ],
  ingredients:
    'Water, sugar, fruit pulp/concentrate, acidity regulator (INS 330), permitted flavour and colour.',
  variants: [
    { id: 'single', label: 'Single · 200 ml', price: 60, units: 1 },
    { id: 'pack-12', label: 'Pack of 12', price: 680, compareAt: 720, units: 12 },
    { id: 'carton-24', label: 'Carton of 24', price: 1320, compareAt: 1440, units: 24 },
  ],
  badges: ['School favourite'],
  popularity: f.popularity,
  isNew: true,
}));

/* ------------------------------------------------------------------ */
/* Diamond Way — basil seed drinks                                     */
/* ------------------------------------------------------------------ */

const basilSeeds = [
  { flavour: 'Mango', accent: '#F5A524', slug: 'mango', popularity: 96 },
  { flavour: 'Strawberry', accent: '#E8395C', slug: 'strawberry', popularity: 90 },
  { flavour: 'Lychee', accent: '#E9A7BC', slug: 'lychee', popularity: 85 },
  { flavour: 'Green Apple', accent: '#7CB518', slug: 'green-apple', popularity: 83 },
  { flavour: 'Cocktail', accent: '#2F6FD0', slug: 'cocktail', popularity: 76 },
  { flavour: 'Pine Apple', accent: '#EFC02B', slug: 'pineapple', popularity: 71 },
];

const basilProducts: Product[] = basilSeeds.map((f) => ({
  slug: `diamond-way-${f.slug}-basil`,
  name: `Diamond Way ${f.flavour}`,
  tagline: `${f.flavour} flavour drink with basil seeds · 290 ml`,
  brand: 'diamond-way' as BrandId,
  category: 'basil-seed' as CategoryId,
  pack: 'glass-bottle' as PackType,
  flavour: f.flavour,
  accent: f.accent,
  images: [img(`diamond-way-basil-${f.slug}`), banner('diamond-way-basil-banner')],
  description: `${f.flavour} with whole tukh malanga suspended through the bottle. Shake it, watch the seeds swirl, and drink something that actually has texture. 290 ml of the cooler everyone orders in summer.`,
  highlights: [
    'Real basil seeds (tukh malanga) in every bottle',
    '290 ml ± 10 ml tapered glass bottle',
    'Shake well before use — the seeds settle',
    'A summer counter favourite across Lahore',
  ],
  ingredients:
    'Water, sugar, basil seeds, acidity regulator (INS 330), permitted flavour and colour, preservative (INS 211).',
  variants: [
    { id: 'single', label: 'Single · 290 ml', price: 120, units: 1 },
    { id: 'pack-6', label: 'Pack of 6', price: 690, compareAt: 720, units: 6 },
    { id: 'case-24', label: 'Case of 24', price: 2650, compareAt: 2880, units: 24 },
  ],
  badges: f.popularity > 90 ? ['Best seller'] : undefined,
  popularity: f.popularity,
  isNew: true,
}));

/* ------------------------------------------------------------------ */
/* Diamond Way — fruit drinks                                          */
/* ------------------------------------------------------------------ */

const dwJuice: FruitSeed[] = [
  { flavour: 'Mango', accent: '#F5A524', note: 'Golden mango, poured thick.', fruit: 'mango', popularity: 89 },
  { flavour: 'Apple', accent: '#E2622B', note: 'Sweet-tart apple, easy to drink.', fruit: 'apple', popularity: 77 },
  { flavour: 'Pomegranate', accent: '#D4213B', note: 'Bold anaar red, properly tart.', fruit: 'pomegranate', popularity: 73 },
  { flavour: 'Peach', accent: '#F2884B', note: 'Mellow peach with a smooth body.', fruit: 'peach', popularity: 68 },
];

const dwJuiceProducts: Product[] = dwJuice.map((f) => ({
  slug: `diamond-way-${f.fruit}-juice`,
  name: `Diamond Way ${f.flavour}`,
  tagline: `${f.flavour} Fruit Drink · 250 ml / 500 ml / 1 litre`,
  brand: 'diamond-way' as BrandId,
  category: 'fruit-drinks' as CategoryId,
  pack: 'pet-bottle' as PackType,
  flavour: f.flavour,
  accent: f.accent,
  images: [img(`diamond-way-juice-${f.fruit}`), banner('diamond-way-juice-banner')],
  description: `${f.note} Diamond Way ${f.flavour} comes in three sizes so you can grab one for the road or a litre for the table. Same recipe, same plant, priced for everyday.`,
  highlights: [
    'Three sizes: 250 ml, 500 ml and 1 litre',
    'Grip-shaped bottle that holds cold longer',
    'Great value for shops and wholesale buyers',
    'Bottled and sealed at our Lahore facility',
  ],
  ingredients:
    'Water, sugar, fruit pulp/concentrate, acidity regulator (INS 330), stabiliser, permitted flavour and colour, preservative (INS 211).',
  variants: [
    { id: '250ml', label: '250 ml', price: 50, units: 1 },
    { id: '500ml', label: '500 ml', price: 90, compareAt: 100, units: 1 },
    { id: '1000ml', label: '1 litre', price: 160, compareAt: 180, units: 1 },
  ],
  popularity: f.popularity,
}));

/* ------------------------------------------------------------------ */
/* Sultan Gold + Ab e Hayat                                            */
/* ------------------------------------------------------------------ */

const singles: Product[] = [
  {
    slug: 'gold-power-energy-drink',
    name: 'Gold Power',
    tagline: 'Energy drink with caffeine & ginseng · 250 ml',
    brand: 'sultan-gold',
    category: 'energy',
    pack: 'pet-bottle',
    flavour: 'Energy',
    accent: '#E0A400',
    images: [img('gold-power'), banner('gold-power-banner')],
    description:
      'Gold Power is our caffeine-and-ginseng energy drink in a 250 ml grip bottle. 120 kcal per serving, built for night shifts, long drives and the last hour of a double shift.',
    highlights: [
      'Caffeine + ginseng blend',
      '120 kcal per 250 ml serving (6% adult GDA)',
      'Sealed 250 ml bottle — easy to carry, easy to chill',
      'Not recommended for children or pregnant women',
    ],
    ingredients:
      'Carbonated water, sugar, acidity regulator (INS 330), taurine, caffeine, ginseng extract, permitted flavour and colour, preservative (INS 211).',
    variants: [
      { id: 'single', label: 'Single · 250 ml', price: 80, units: 1 },
      { id: 'pack-6', label: 'Pack of 6', price: 460, compareAt: 480, units: 6 },
      { id: 'case-24', label: 'Case of 24', price: 1780, compareAt: 1920, units: 24 },
    ],
    badges: ['High demand'],
    popularity: 94,
  },
  {
    slug: 'gold-lychee',
    name: 'Gold Lychee',
    tagline: 'Carbonated lychee flavoured drink',
    brand: 'sultan-gold',
    category: 'carbonated',
    pack: 'pet-bottle',
    flavour: 'Lychee',
    accent: '#EA6E8A',
    images: [img('gold-lychee'), banner('gold-lychee-banner')],
    description:
      'Lychee looovvee. A clear, hard-sparkling lychee soda that lands somewhere between a fruit drink and a proper fizzy. Best served ice cold straight off the freezer shelf.',
    highlights: [
      'Sharp carbonation that holds after the first pour',
      'Clear lychee flavour, no heavy syrup finish',
      '300 ml, 500 ml and 1.5 litre bottles',
      'The 1.5 litre is the dawat size',
    ],
    ingredients:
      'Carbonated water, sugar, acidity regulator (INS 330), permitted flavour, preservative (INS 211).',
    variants: [
      { id: '300ml', label: '300 ml', price: 50, units: 1 },
      { id: '500ml', label: '500 ml', price: 80, compareAt: 90, units: 1 },
      { id: '1500ml', label: '1.5 litre', price: 150, compareAt: 170, units: 1 },
    ],
    badges: ['Best seller'],
    popularity: 93,
  },
  {
    slug: 'gold-apple',
    name: 'Gold Apple',
    tagline: 'Carbonated apple flavoured drink',
    brand: 'sultan-gold',
    category: 'carbonated',
    pack: 'pet-bottle',
    flavour: 'Apple',
    accent: '#D98324',
    images: [img('gold-apple'), banner('gold-apple-banner')],
    description:
      'Fizzzy Funnnnn. Amber apple soda with a bite — the one that disappears first off a wedding table. Pours golden, finishes crisp.',
    highlights: [
      'Golden apple soda with a crisp, dry finish',
      'Holds its fizz in the big 1.5 litre bottle',
      'Three sizes for shops, homes and events',
      'Serve over ice with a wedge of lemon',
    ],
    ingredients:
      'Carbonated water, sugar, acidity regulator (INS 330), permitted flavour and colour, preservative (INS 211).',
    variants: [
      { id: '300ml', label: '300 ml', price: 50, units: 1 },
      { id: '500ml', label: '500 ml', price: 80, compareAt: 90, units: 1 },
      { id: '1500ml', label: '1.5 litre', price: 150, compareAt: 170, units: 1 },
    ],
    popularity: 87,
  },
  {
    slug: 'ab-e-hayat-water',
    name: 'Ab e Hayat',
    tagline: 'Bottled drinking water',
    brand: 'ab-e-hayat',
    category: 'water',
    pack: 'pet-bottle',
    flavour: 'Water',
    accent: '#2F86D4',
    images: [img('ab-e-hayat'), banner('ab-e-hayat-banner')],
    description:
      'Clean, filtered drinking water bottled under the Ab e Hayat label. Ordered by the carton for offices, shops, marquees and home coolers — and priced so you can keep reordering.',
    highlights: [
      'Multi-stage filtered and sealed on site',
      '500 ml and 1.5 litre bottles',
      'Cartons for offices, events and shops',
      'Tamper-evident cap on every bottle',
    ],
    ingredients: 'Purified drinking water with added minerals.',
    variants: [
      { id: '500ml', label: '500 ml', price: 40, units: 1 },
      { id: '1500ml', label: '1.5 litre', price: 80, units: 1 },
      { id: 'carton-1500-12', label: 'Carton · 12 × 1.5 L', price: 850, compareAt: 960, units: 12 },
    ],
    badges: ['Bulk friendly'],
    popularity: 82,
  },
];

export const products: Product[] = [
  ...petProducts,
  ...glassProducts,
  ...tetraProducts,
  ...basilProducts,
  ...dwJuiceProducts,
  ...singles,
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

export const priceRange = (p: Product) => {
  const prices = p.variants.map((v) => v.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
};

export const brandName = (id: BrandId) => brands.find((b) => b.id === id)?.name ?? id;
export const categoryName = (id: CategoryId) => categories.find((c) => c.id === id)?.name ?? id;

/** Distinct pack sizes, used by the shop page size filter. */
export const sizeFilters = [
  { id: 'small', label: 'Up to 300 ml', match: (l: string) => /200 ml|250 ml|290 ml|300 ml/.test(l) },
  { id: 'medium', label: '500 ml', match: (l: string) => /500 ml/.test(l) && !/×/.test(l) },
  { id: 'large', label: '1 litre & above', match: (l: string) => /1 litre|1\.5 litre/.test(l) },
  { id: 'bulk', label: 'Packs & cases', match: (l: string) => /Pack|Case|Carton/.test(l) },
];
