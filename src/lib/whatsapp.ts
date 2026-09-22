import { site } from '../data/site';
import { money, normalisePkPhone } from './format';
import type { CustomerDetails, PlacedOrder } from '../types';
import type { ResolvedLine } from './cart';

const formatWhen = (date: Date) =>
  date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

/**
 * Builds the order message that lands in the owner's WhatsApp.
 * The store is a static site, so the customer's own WhatsApp sends it —
 * see README for the server-side alternative.
 */
export function buildOrderMessage(
  order: Omit<PlacedOrder, 'message' | 'whatsappUrl'>
): string {
  const { customer } = order;
  const lines: string[] = [];

  lines.push('*NEW ORDER — Real Sultan Foods*');
  lines.push(`Order: *${order.id}*`);
  lines.push(formatWhen(new Date(order.placedAt)));
  lines.push('');
  lines.push('*CUSTOMER DETAILS*');
  lines.push(`Name: ${customer.name}`);
  lines.push(`Phone: ${normalisePkPhone(customer.phone)}`);
  lines.push(`Address: ${customer.address}`);
  if (customer.area.trim()) lines.push(`Area: ${customer.area}`);
  lines.push(`City: ${customer.city}`);
  if (customer.notes.trim()) lines.push(`Notes: ${customer.notes}`);
  lines.push('');
  lines.push('*ORDER*');

  order.items.forEach((item, i) => {
    lines.push(`${i + 1}. ${item.name} — ${item.variant}`);
    lines.push(`   ${item.qty} × ${money(item.unitPrice)} = ${money(item.lineTotal)}`);
  });

  lines.push('');
  lines.push(`Subtotal: ${money(order.subtotal)}`);
  lines.push(
    order.delivery === 0 ? 'Delivery: FREE' : `Delivery: ${money(order.delivery)}`
  );
  lines.push(`*TOTAL: ${money(order.total)}*`);
  lines.push('');
  lines.push('Payment: *Cash on Delivery*');
  lines.push(`Please confirm this order. ${site.deliveryNote}`);

  return lines.join('\n');
}

export const whatsappUrl = (message: string, phone = site.whatsappNumber) =>
  `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

export function createOrder(
  id: string,
  customer: CustomerDetails,
  items: ResolvedLine[],
  subtotal: number,
  delivery: number
): PlacedOrder {
  const base = {
    id,
    placedAt: new Date().toISOString(),
    customer,
    items: items.map((l) => ({
      name: l.product.name,
      variant: l.variant.label,
      qty: l.qty,
      unitPrice: l.variant.price,
      lineTotal: l.lineTotal,
    })),
    subtotal,
    delivery,
    total: subtotal + delivery,
  };
  const message = buildOrderMessage(base);
  return { ...base, message, whatsappUrl: whatsappUrl(message) };
}

const ORDER_KEY = 'rsf.lastOrder.v1';

export const rememberOrder = (order: PlacedOrder) => {
  try {
    window.sessionStorage.setItem(ORDER_KEY, JSON.stringify(order));
  } catch {
    /* ignore */
  }
};

export const recallOrder = (): PlacedOrder | null => {
  try {
    const raw = window.sessionStorage.getItem(ORDER_KEY);
    return raw ? (JSON.parse(raw) as PlacedOrder) : null;
  } catch {
    return null;
  }
};

/** Pre-filled enquiry link used by the header, footer and product pages. */
export const enquiryUrl = (about?: string) =>
  whatsappUrl(
    about
      ? `Assalam-o-Alaikum! I'd like to ask about ${about} from Real Sultan Foods.`
      : `Assalam-o-Alaikum! I'd like to ask about your products.`
  );
