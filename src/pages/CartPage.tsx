import { Link } from 'react-router-dom';
import { useCart } from '../lib/cart';
import { asset, money } from '../lib/format';
import { site } from '../data/site';
import QuantityStepper from '../components/QuantityStepper';
import { CashIcon, TrashIcon, TruckIcon } from '../components/icons';

export default function CartPage() {
  const { items, setQty, remove, clear, subtotal, delivery, total, freeDeliveryGap } =
    useCart();

  if (items.length === 0) {
    return (
      <div className="container-page py-20">
        <div className="card-surface mx-auto flex max-w-lg flex-col items-center gap-5 px-6 py-16 text-center">
          <span className="text-6xl">🧃</span>
          <div>
            <h1 className="font-display text-2xl font-black">Your cart is empty</h1>
            <p className="mt-2 text-sm text-ink/60">
              Nothing chilling in here yet. Pick a flavour and we&rsquo;ll bring it over —
              cash on delivery.
            </p>
          </div>
          <Link to="/shop" className="btn btn-lg btn-gold">
            Start shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-8 sm:py-12">
      <nav aria-label="Breadcrumb" className="mb-3 text-[12.5px] font-semibold text-ink/45">
        <Link to="/" className="hover:text-forest-700">
          Home
        </Link>
        <span aria-hidden className="mx-1.5">/</span>
        <span className="text-forest-800">Cart</span>
      </nav>

      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <h1 className="font-display text-[clamp(1.9rem,5vw,3rem)] font-black">
          Your cart
        </h1>
        <button
          type="button"
          onClick={clear}
          className="text-[13px] font-semibold text-ink/50 underline underline-offset-4 hover:text-red-600"
        >
          Empty cart
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <ul className="flex flex-col gap-3">
          {items.map((line) => (
            <li
              key={line.key}
              className="card-surface flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
            >
              <Link
                to={`/product/${line.slug}`}
                className="size-28 shrink-0 overflow-hidden rounded-2xl sm:size-24"
                style={{ background: `${line.product.accent}14` }}
              >
                <img
                  src={asset(line.product.images[0])}
                  alt={line.product.name}
                  className="size-full object-cover"
                  loading="lazy"
                />
              </Link>

              <div className="min-w-0 flex-1">
                <Link
                  to={`/product/${line.slug}`}
                  className="font-display text-[17px] font-extrabold hover:text-forest-700"
                >
                  {line.product.name}
                </Link>
                <p className="mt-0.5 text-[13px] text-ink/55">
                  {line.variant.label} · {money(line.variant.price)} each
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <QuantityStepper
                    size="sm"
                    value={line.qty}
                    onChange={(q) => setQty(line.key, q)}
                    min={0}
                    label={`Quantity for ${line.product.name}`}
                  />
                  <button
                    type="button"
                    onClick={() => remove(line.key)}
                    className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-[12.5px] font-semibold text-ink/45 transition-colors hover:bg-red-50 hover:text-red-600"
                  >
                    <TrashIcon className="size-4" />
                    Remove
                  </button>
                </div>
              </div>

              <p className="font-display text-xl font-extrabold sm:text-right">
                {money(line.lineTotal)}
              </p>
            </li>
          ))}
        </ul>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="card-surface p-5">
            <h2 className="font-display text-lg font-extrabold">Order summary</h2>

            {freeDeliveryGap > 0 ? (
              <p className="mt-3 flex items-start gap-2 rounded-2xl bg-sand px-3.5 py-3 text-[13px] font-semibold text-forest-800">
                <TruckIcon className="mt-0.5 size-4 shrink-0 text-gold-600" />
                Add {money(freeDeliveryGap)} more and delivery is on us.
              </p>
            ) : (
              <p className="mt-3 flex items-start gap-2 rounded-2xl bg-leaf-500/10 px-3.5 py-3 text-[13px] font-semibold text-forest-700">
                <TruckIcon className="mt-0.5 size-4 shrink-0" />
                Free delivery unlocked.
              </p>
            )}

            <dl className="mt-4 space-y-2 text-[15px]">
              <div className="flex justify-between">
                <dt className="text-ink/60">Subtotal</dt>
                <dd className="font-semibold">{money(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink/60">Delivery</dt>
                <dd className="font-semibold">
                  {delivery === 0 ? (
                    <span className="text-leaf-500">FREE</span>
                  ) : (
                    money(delivery)
                  )}
                </dd>
              </div>
              <div className="flex justify-between border-t border-forest-800/10 pt-3 font-display text-xl font-black">
                <dt>Total</dt>
                <dd>{money(total)}</dd>
              </div>
            </dl>

            <Link to="/checkout" className="btn btn-lg btn-gold mt-5 w-full">
              Proceed to checkout
            </Link>

            <p className="mt-3 flex items-center justify-center gap-2 text-[12.5px] font-semibold text-ink/55">
              <CashIcon className="size-4 text-forest-700" />
              Cash on delivery · {site.deliveryNote.split('.')[0]}
            </p>

            <Link
              to="/shop"
              className="mt-4 block text-center text-[13px] font-semibold text-forest-700 underline underline-offset-4"
            >
              Continue shopping
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
