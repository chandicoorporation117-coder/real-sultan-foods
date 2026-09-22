import { brandName, categories, categoryName, getProduct, packLabels, priceRange, products } from '../data/catalog';
import { site } from '../data/site';
import { wholesaleFaqs } from '../data/wholesale';
import type { Product } from '../types';

/** Canonical origin. Every canonical, OG and JSON-LD URL is built from this. */
export const ORIGIN = 'https://realsultanfoods.com';

export const abs = (path: string) => {
  if (/^https?:\/\//.test(path)) return path;
  return `${ORIGIN}/${String(path).replace(/^\.?\//, '')}`;
};

export interface SeoMeta {
  title: string;
  description: string;
  canonical: string;
  image: string;
  /** Keep thin, transactional and duplicate-prone pages out of the index. */
  noindex?: boolean;
  /** JSON-LD graph nodes emitted into the page. */
  jsonLd?: Record<string, unknown>[];
}

const DEFAULT_IMAGE = abs('images/logo.webp');

/* ------------------------------------------------------------------ */
/* Reusable JSON-LD nodes                                              */
/* ------------------------------------------------------------------ */

const ORG_ID = `${ORIGIN}/#organization`;
const SITE_ID = `${ORIGIN}/#website`;

/** Address is split once here so Organization and LocalBusiness agree. */
const postalAddress = {
  '@type': 'PostalAddress',
  streetAddress: 'Bata Pur, Jallo Mor',
  addressLocality: 'Lahore',
  addressRegion: 'Punjab',
  addressCountry: 'PK',
};

export const organizationNode = (): Record<string, unknown> => ({
  '@type': ['Organization', 'LocalBusiness', 'FoodEstablishment'],
  '@id': ORG_ID,
  name: site.name,
  alternateName: site.shortName,
  url: ORIGIN,
  logo: DEFAULT_IMAGE,
  image: DEFAULT_IMAGE,
  description:
    'Beverage manufacturer and wholesale supplier in Lahore, Pakistan. Producer of Mary Diamond fruit drinks, Diamond Way basil seed drinks, Sultan Gold fizzy and energy drinks, and Ab e Hayat bottled water.',
  telephone: `+${site.whatsappNumber}`,
  email: site.email,
  address: postalAddress,
  areaServed: { '@type': 'Country', name: 'Pakistan' },
  currenciesAccepted: site.currency,
  paymentAccepted: 'Cash on delivery',
  openingHours: 'Mo-Sa 09:00-20:00',
  sameAs: [`https://wa.me/${site.whatsappNumber}`],
});

const websiteNode = (): Record<string, unknown> => ({
  '@type': 'WebSite',
  '@id': SITE_ID,
  url: ORIGIN,
  name: site.name,
  publisher: { '@id': ORG_ID },
  inLanguage: 'en-PK',
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${ORIGIN}/shop?q={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
});

export const breadcrumbNode = (
  trail: { name: string; path: string }[]
): Record<string, unknown> => ({
  '@type': 'BreadcrumbList',
  itemListElement: trail.map((crumb, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: crumb.name,
    item: abs(crumb.path),
  })),
});

/** Product node with a real offer range so Google can show prices. */
export const productNode = (product: Product): Record<string, unknown> => {
  const { min, max } = priceRange(product);
  const url = abs(`product/${product.slug}`);
  return {
    '@type': 'Product',
    '@id': `${url}#product`,
    name: product.name,
    description: product.description,
    image: product.images.map(abs),
    sku: product.slug,
    category: categoryName(product.category),
    brand: { '@type': 'Brand', name: brandName(product.brand) },
    manufacturer: { '@id': ORG_ID },
    url,
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'Packaging', value: packLabels[product.pack] },
      { '@type': 'PropertyValue', name: 'Flavour', value: product.flavour },
    ],
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: site.currency,
      lowPrice: min,
      highPrice: max,
      offerCount: product.variants.length,
      availability: 'https://schema.org/InStock',
      seller: { '@id': ORG_ID },
      url,
    },
  };
};

/* ------------------------------------------------------------------ */
/* Route metadata                                                      */
/* ------------------------------------------------------------------ */

const titleSuffix = ` | ${site.name}`;
/** Titles are capped so Google doesn't truncate them in the SERP. */
const withSuffix = (t: string) => (t.length + titleSuffix.length <= 62 ? t + titleSuffix : t);

const HOME: SeoMeta = {
  title: 'Juice, Basil Seed & Energy Drink Manufacturer in Lahore',
  description:
    'Real Sultan Foods manufactures Mary Diamond fruit drinks, Diamond Way basil seed drinks, Sultan Gold fizzy and energy drinks, and Ab e Hayat water in Lahore. Retail delivery and wholesale supply across Pakistan.',
  canonical: ORIGIN + '/',
  image: DEFAULT_IMAGE,
  jsonLd: [
    organizationNode(),
    websiteNode(),
    breadcrumbNode([{ name: 'Home', path: '' }]),
  ],
};

const staticRoutes: Record<string, SeoMeta> = {
  '/': HOME,

  '/shop': {
    title: 'Shop All Drinks — Prices in PKR',
    description: `Browse all ${products.length} Real Sultan Foods drinks: fruit drinks, basil seed drinks, fizzy drinks, energy drinks and bottled water. PET, glass and tetra packs with case pricing. Cash on delivery across Pakistan.`,
    canonical: `${ORIGIN}/shop`,
    image: DEFAULT_IMAGE,
    jsonLd: [
      organizationNode(),
      breadcrumbNode([
        { name: 'Home', path: '' },
        { name: 'Shop', path: 'shop' },
      ]),
      {
        '@type': 'ItemList',
        name: 'Real Sultan Foods drinks',
        numberOfItems: products.length,
        itemListElement: products.map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: p.name,
          url: abs(`product/${p.slug}`),
        })),
      },
    ],
  },

  '/wholesale': {
    title: 'Beverage Distributorship & Wholesale Supply, Pakistan',
    description:
      'Become a Real Sultan Foods distributor. Wholesale fruit drinks, basil seed drinks, fizzy drinks, energy drinks and bottled water direct from our Lahore plant. Carton rates, protected territories, price list on request.',
    canonical: `${ORIGIN}/wholesale`,
    image: DEFAULT_IMAGE,
    jsonLd: [
      organizationNode(),
      breadcrumbNode([
        { name: 'Home', path: '' },
        { name: 'Wholesale', path: 'wholesale' },
      ]),
      {
        '@type': 'FAQPage',
        mainEntity: wholesaleFaqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  },

  '/about': {
    title: 'About Real Sultan Foods — Our Lahore Beverage Plant',
    description:
      'Real Sultan Foods is a Lahore beverage manufacturer producing fruit drinks, basil seed drinks, carbonated and energy drinks and bottled water for retail and wholesale customers across Pakistan.',
    canonical: `${ORIGIN}/about`,
    image: DEFAULT_IMAGE,
    jsonLd: [
      organizationNode(),
      breadcrumbNode([
        { name: 'Home', path: '' },
        { name: 'About', path: 'about' },
      ]),
    ],
  },

  '/contact': {
    title: 'Contact Real Sultan Foods — Lahore',
    description: `Contact Real Sultan Foods in Lahore. WhatsApp ${site.whatsappDisplay} for retail orders, wholesale rates and distributorship enquiries. ${site.hours}.`,
    canonical: `${ORIGIN}/contact`,
    image: DEFAULT_IMAGE,
    jsonLd: [
      organizationNode(),
      breadcrumbNode([
        { name: 'Home', path: '' },
        { name: 'Contact', path: 'contact' },
      ]),
      {
        '@type': 'ContactPage',
        url: `${ORIGIN}/contact`,
        mainEntity: { '@id': ORG_ID },
      },
    ],
  },

  /* Transactional pages: useful to shoppers, worthless in search. */
  '/cart': {
    title: 'Your Cart',
    description: 'Review the drinks in your Real Sultan Foods cart before checking out.',
    canonical: `${ORIGIN}/cart`,
    image: DEFAULT_IMAGE,
    noindex: true,
  },
  '/checkout': {
    title: 'Checkout',
    description: 'Complete your Real Sultan Foods cash-on-delivery order.',
    canonical: `${ORIGIN}/checkout`,
    image: DEFAULT_IMAGE,
    noindex: true,
  },
  '/order-confirmed': {
    title: 'Order Confirmed',
    description: 'Your Real Sultan Foods order has been placed.',
    canonical: `${ORIGIN}/order-confirmed`,
    image: DEFAULT_IMAGE,
    noindex: true,
  },
};

const notFoundMeta: SeoMeta = {
  title: 'Page Not Found',
  description: 'That page does not exist. Browse the full Real Sultan Foods drinks range instead.',
  canonical: `${ORIGIN}/404`,
  image: DEFAULT_IMAGE,
  noindex: true,
};

/** Singular forms, so a description reads "a fruit drink" rather than
 *  "fruit drinks in a pet bottle". */
const singularCategory: Record<string, string> = {
  'fruit-drinks': 'fruit drink',
  'basil-seed': 'basil seed drink',
  carbonated: 'fizzy drink',
  energy: 'energy drink',
  water: 'bottled drinking water',
};

/** Product pages carry the richest copy on the site, so the description
 *  leads with the flavour and pack rather than a boilerplate sentence. */
const productMeta = (product: Product): SeoMeta => {
  const { min } = priceRange(product);
  const kind = singularCategory[product.category] ?? categoryName(product.category).toLowerCase();
  const pack = packLabels[product.pack];
  const firstLine = product.description.split('. ')[0].replace(/\.$/, '');
  return {
    title: `${product.name} — ${pack}`,
    description:
      `${product.name}: ${product.flavour.toLowerCase()} ${kind} in a ${pack}. ` +
      `${firstLine}. From Rs ${min}, case rates available. ` +
      `Order direct from Real Sultan Foods, Lahore — cash on delivery across Pakistan.`,
    canonical: abs(`product/${product.slug}`),
    image: abs(product.images[0]),
    jsonLd: [
      organizationNode(),
      productNode(product),
      breadcrumbNode([
        { name: 'Home', path: '' },
        { name: 'Shop', path: 'shop' },
        { name: categoryName(product.category), path: `shop?category=${product.category}` },
        { name: product.name, path: `product/${product.slug}` },
      ]),
    ],
  };
};

/** Single source of truth for both the prerenderer and the client router. */
export function seoForPath(pathname: string): SeoMeta {
  const clean = ('/' + pathname.replace(/^\/+|\/+$/g, '')).replace('//', '/') || '/';

  const stat = staticRoutes[clean];
  if (stat) return { ...stat, title: withSuffix(stat.title) };

  const match = clean.match(/^\/product\/(.+)$/);
  if (match) {
    const product = getProduct(decodeURIComponent(match[1]));
    if (product) {
      const meta = productMeta(product);
      return { ...meta, title: withSuffix(meta.title) };
    }
  }

  return { ...notFoundMeta, title: withSuffix(notFoundMeta.title) };
}

/** Every URL the sitemap and prerenderer should emit. */
export const indexableRoutes = (): string[] => [
  ...Object.entries(staticRoutes)
    .filter(([, meta]) => !meta.noindex)
    .map(([path]) => path),
  ...products.map((p) => `/product/${p.slug}`),
];

/** Routes to prerender — includes noindex pages so they still load fast. */
export const allRoutes = (): string[] => [
  ...Object.keys(staticRoutes),
  ...products.map((p) => `/product/${p.slug}`),
];

export const categoryList = categories;
