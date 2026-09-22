/** Single place for the business details that appear across the store. */
export const site = {
  name: 'Real Sultan Foods',
  shortName: 'Sultan Foods',
  tagline: 'Food & Beverages',
  /** Owner's WhatsApp number in international format, digits only. */
  whatsappNumber: '923104181750',
  whatsappDisplay: '+92 310 4181750',
  phoneDisplay: '0310 4181750',
  email: 'syedahsanrazaraza5121472@gmail.com',
  address: 'Bata Pur, Jallo Mor, Lahore, Pakistan',
  hours: 'Mon – Sat, 9:00 am – 8:00 pm',
  currency: 'PKR',
  /** Flat cash-on-delivery charge; free above the threshold. */
  deliveryFee: 250,
  freeDeliveryThreshold: 3000,
  deliveryNote: 'Delivered in 2–4 working days across Punjab, 3–6 days nationwide.',
} as const;

export const socials = [
  { label: 'WhatsApp', href: `https://wa.me/${site.whatsappNumber}` },
  { label: 'Email', href: `mailto:${site.email}` },
] as const;
