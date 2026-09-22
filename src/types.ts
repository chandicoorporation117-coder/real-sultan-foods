export type CategoryId =
  | 'fruit-drinks'
  | 'basil-seed'
  | 'carbonated'
  | 'energy'
  | 'water';

export type BrandId = 'mary-diamond' | 'diamond-way' | 'sultan-gold' | 'ab-e-hayat';

export type PackType = 'pet-bottle' | 'glass-bottle' | 'tetra-pack';

export interface Variant {
  /** stable id, used in the cart key */
  id: string;
  /** what the shopper picks, e.g. "500 ml" or "Pack of 6" */
  label: string;
  price: number;
  /** optional was-price for the discount badge */
  compareAt?: number;
  /** units of the base pack, used in the WhatsApp order summary */
  units?: number;
}

export interface Product {
  slug: string;
  name: string;
  /** flavour or sub-title shown under the name */
  tagline: string;
  brand: BrandId;
  category: CategoryId;
  pack: PackType;
  flavour: string;
  /** hex accent used for flavour-tinted cards and detail pages */
  accent: string;
  images: string[];
  description: string;
  highlights: string[];
  ingredients: string;
  variants: Variant[];
  badges?: string[];
  /** drives the "Best sellers" rail and default sort */
  popularity: number;
  isNew?: boolean;
}

export interface CartLine {
  key: string;
  slug: string;
  variantId: string;
  qty: number;
}

export interface CustomerDetails {
  name: string;
  phone: string;
  address: string;
  city: string;
  area: string;
  notes: string;
}

export interface PlacedOrder {
  id: string;
  placedAt: string;
  customer: CustomerDetails;
  items: {
    name: string;
    variant: string;
    qty: number;
    unitPrice: number;
    lineTotal: number;
  }[];
  subtotal: number;
  delivery: number;
  total: number;
  whatsappUrl: string;
  message: string;
}
