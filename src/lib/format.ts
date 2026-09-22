/** Rs 1,250 — no decimals, the way prices are quoted locally. */
export const money = (value: number) =>
  'Rs ' + Math.round(value).toLocaleString('en-PK', { maximumFractionDigits: 0 });

/** Resolves a catalog image path against the Vite base, so it survives
 *  being deployed under a GitHub Pages project subpath. */
export const asset = (path: string) =>
  import.meta.env.BASE_URL.replace(/\/$/, '') + '/' + path.replace(/^\//, '');

export const discountPercent = (price: number, compareAt?: number) =>
  compareAt && compareAt > price ? Math.round(((compareAt - price) / compareAt) * 100) : 0;

/** Accepts 03104181750, +923104181750, 0310-418 1750 … */
export const isValidPkPhone = (value: string) => {
  const digits = value.replace(/\D/g, '');
  if (digits.startsWith('92')) return digits.length === 12;
  if (digits.startsWith('0')) return digits.length === 11;
  return digits.length === 10;
};

export const normalisePkPhone = (value: string) => {
  const digits = value.replace(/\D/g, '');
  if (digits.startsWith('92')) return '+' + digits;
  if (digits.startsWith('0')) return '+92' + digits.slice(1);
  return '+92' + digits;
};
