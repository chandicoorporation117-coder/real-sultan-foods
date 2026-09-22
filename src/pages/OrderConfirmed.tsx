import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { recallOrder } from '../lib/whatsapp';
import { money } from '../lib/format';
import { site } from '../data/site';
import { useToast } from '../lib/toast';
import type { PlacedOrder } from '../types';
import { CashIcon, CheckIcon, TruckIcon, WhatsAppIcon } from '../components/icons';

export default function OrderConfirmed() {
  const [order, setOrder] = useState<PlacedOrder | null>(null);
  const { notify } = useToast();

  useEffect(() => setOrder(recallOrder()), []);

  const copyMessage = async () => {
    if (!order) return;
    try {
      await navigator.clipboard.writeText(order.message);
      notify('Order details copied');
    } catch {
      notify('Could not copy — please select the text manually.', 'error');
    }
  };

  if (!order) {
    return (
      <div className="container-page py-20">
        <div className="card-surface mx-auto flex max-w-lg flex-col items-center gap-5 px-6 py-16 text-center">
          <span className="text-6xl">📦</span>
          <div>
            <h1 className="font-display text-2xl font-black">No recent order</h1>
            <p className="mt-2 text-sm text-ink/60">
              We couldn&rsquo;t find an order in this session. If you already sent us a
              WhatsApp message, we have it — we&rsquo;ll reply shortly.
            </p>
          </div>
          <Link to="/shop" className="btn btn-lg btn-gold">
            Back to shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-10 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <div className="animate-rise relative overflow-hidden rounded-[2rem] bg-forest-900 p-8 text-center text-cream sm:p-12">
          <div
            aria-hidden
            className="absolute -top-24 left-1/2 size-72 -translate-x-1/2 rounded-full bg-leaf-500/30 blur-3xl"
          />
          <div className="relative">
            <span className="animate-pop mx-auto grid size-20 place-items-center rounded-full bg-leaf-500 text-cream shadow-glow">
              <CheckIcon className="size-10" strokeWidth={2.4} />
            </span>
            <h1 className="mt-6 font-display text-[clamp(1.8rem,5vw,2.75rem)] font-black">
              Order placed!
            </h1>
            <p className="mt-3 text-[15px] text-cream/75">
              Order <b className="text-gold-300">{order.id}</b> is on its way to our
              team.
            </p>

            <div className="mt-6 rounded-2xl border border-gold-400/30 bg-gold-400/10 px-5 py-4 text-left text-[13.5px] leading-relaxed text-cream/85">
              <b className="text-gold-300">One last step:</b> WhatsApp should have
              opened with your order already written out. Press <b>send</b> so it
              reaches us. If it didn&rsquo;t open, use the button below.
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <a
                href={order.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-lg bg-[#25D366] text-forest-950 hover:brightness-105"
              >
                <WhatsAppIcon className="size-5" />
                Send on WhatsApp
              </a>
              <button
                type="button"
                onClick={copyMessage}
                className="btn btn-lg btn-outline-gold"
              >
                Copy order details
              </button>
            </div>
          </div>
        </div>

        <div className="card-surface mt-6 p-6">
          <h2 className="font-display text-lg font-extrabold">Order summary</h2>

          <ul className="mt-4 divide-y divide-forest-800/8">
            {order.items.map((item, i) => (
              <li key={i} className="flex items-start justify-between gap-4 py-3">
                <div>
                  <p className="text-[14.5px] font-bold">{item.name}</p>
                  <p className="text-[12.5px] text-ink/55">
                    {item.variant} · {item.qty} × {money(item.unitPrice)}
                  </p>
                </div>
                <p className="font-bold">{money(item.lineTotal)}</p>
              </li>
            ))}
          </ul>

          <dl className="mt-4 space-y-2 border-t border-forest-800/10 pt-4 text-[15px]">
            <div className="flex justify-between">
              <dt className="text-ink/60">Subtotal</dt>
              <dd className="font-semibold">{money(order.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink/60">Delivery</dt>
              <dd className="font-semibold">
                {order.delivery === 0 ? (
                  <span className="text-leaf-500">FREE</span>
                ) : (
                  money(order.delivery)
                )}
              </dd>
            </div>
            <div className="flex justify-between border-t border-forest-800/10 pt-3 font-display text-xl font-black">
              <dt>Total (cash on delivery)</dt>
              <dd>{money(order.total)}</dd>
            </div>
          </dl>

          <div className="mt-6 grid gap-4 rounded-2xl bg-sand p-4 sm:grid-cols-2">
            <div>
              <p className="text-[11px] font-bold tracking-[0.18em] text-ink/45 uppercase">
                Delivering to
              </p>
              <p className="mt-1.5 text-[14px] font-semibold">{order.customer.name}</p>
              <p className="text-[13px] text-ink/65">
                {order.customer.address}
                {order.customer.area && `, ${order.customer.area}`}
                <br />
                {order.customer.city}
              </p>
              <p className="mt-1 text-[13px] text-ink/65">{order.customer.phone}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold tracking-[0.18em] text-ink/45 uppercase">
                What happens next
              </p>
              <ul className="mt-1.5 space-y-2 text-[13px] text-ink/70">
                <li className="flex gap-2">
                  <WhatsAppIcon className="mt-0.5 size-4 shrink-0 text-[#128C4B]" />
                  We confirm your order on WhatsApp.
                </li>
                <li className="flex gap-2">
                  <TruckIcon className="mt-0.5 size-4 shrink-0 text-gold-600" />
                  {site.deliveryNote}
                </li>
                <li className="flex gap-2">
                  <CashIcon className="mt-0.5 size-4 shrink-0 text-forest-700" />
                  Pay the rider in cash on arrival.
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/shop" className="btn btn-md btn-forest">
            Continue shopping
          </Link>
          <Link to="/contact" className="btn btn-md btn-ghost">
            Need help with this order?
          </Link>
        </div>
      </div>
    </div>
  );
}
