import { site } from './site';

/** Shared by the /wholesale page and the FAQPage structured data, so the
 *  answers Google shows can never drift from the answers on the page. */
export const wholesaleFaqs = [
  {
    q: 'What is the minimum order for wholesale?',
    // TODO: confirm MOQ.
    a: 'The minimum first order is a mixed load of cartons rather than a fixed rupee figure, so a new retailer can test several flavours at once. Exact carton counts are on the trade price list — ask for a copy on WhatsApp.',
  },
  {
    q: 'Do you offer exclusive distribution territories?',
    a: 'Yes, where sustained volume justifies it. New partners normally start non-exclusive in their own area, and exclusivity is agreed once a consistent re-order pattern is established.',
  },
  {
    q: 'Which areas do you supply?',
    a: 'We deliver across Punjab within 2–4 working days and nationwide within 3–6 working days. Lahore and the surrounding districts are served directly from the plant at Bata Pur, Jallo Mor.',
  },
  {
    q: 'What are the payment terms for distributors?',
    // TODO: confirm credit policy for trade accounts.
    a: 'Retail orders on this site are cash on delivery. Trade accounts are agreed case by case — discuss terms with us directly before your first load.',
  },
  {
    q: 'Can I get printed marketing material?',
    // TODO: confirm what point-of-sale material actually exists.
    a: 'Ask when you place a trade order. Tell us the outlet type and we will confirm what point-of-sale material we can send with the delivery.',
  },
  {
    q: 'Do you supply for export?',
    a: `Export enquiries are handled directly. Message ${site.whatsappDisplay} with your destination market and required volumes.`,
  },
] as const;

export const outletTypes = [
  'General stores & karyana',
  'Tuck shops & canteens',
  'Cash & carry',
  'Caterers & marquees',
  'Restaurants & dhabas',
  'Wholesale markets',
] as const;
