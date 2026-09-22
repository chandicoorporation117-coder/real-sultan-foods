import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../lib/cart';
import { asset, money } from '../lib/format';
import { site } from '../data/site';
import QuantityStepper from './QuantityStepper';
import { CartIcon, CloseIcon, TrashIcon, TruckIcon } from './icons';

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    setQty,
    remove,
    subtotal,
    delivery,
    total,
    freeDeliveryGap,
    count,
  } = useCart();
  const { pathname } = useLocation();

  // Leaving the page the drawer was opened from should dismiss it, however the
  // customer navigated — a link inside the drawer, the header, or the back button.
  useEffect(() => {
    closeCart();
  }, [pathname, closeCart]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeCart();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeCart]);

  const progress = Math.min(100, (subtotal / site.freeDeliveryThreshold) * 100);

  return (
    <div
      className={`fixed inset-0 z-[80] ${isOpen ? '' : 'pointer-events-none'}`}
      aria-hidden={!isOpen}
    >
      <div
        onClick={closeCart}
        className={`absolute inset-0 bg-forest-950/70 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-cream shadow-2xl transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-forest-800/10 px-5 py-4">
          <h2 className="flex items-center gap-2.5 font-display text-xl font-extrabold">
            <CartIcon className="size-5 text-forest-700" />
            Your cart
            {count > 0 && (
              <span className="rounded-full bg-forest-800 px-2.5 py-0.5 text-xs font-bold text-gold-300">
                {count}
              </span>
            )}
          </h2>
          <button
            type="button"
            onClick={closeCart}
            className="grid size-10 place-items-center rounded-full border border-forest-800/12 text-forest-800 hover:bg-white"
            aria-label="Close cart"
          >
            <CloseIcon />
          </button>
        </div>

        {items.length > 0 && (
          <div className="border-b border-forest-800/10 bg-white px-5 py-3">
            <p className="flex items-center gap-2 text-[13px] font-semibold text-forest-800">
              <TruckIcon className="size-4 shrink-0 text-gold-600" />
              {freeDeliveryGap > 0 ? (
                <>
                  Add <b>{money(freeDeliveryGap)}</b> more for free delivery
                </>
              ) : (
                <>You&rsquo;ve unlocked free delivery 🎉</>
              )}
            </p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-sand">
              <div
                className="h-full rounded-full bg-gradient-to-r from-gold-400 to-leaf-500 transition-[width] duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <span className="grid size-20 place-items-center rounded-full bg-sand text-4xl">
                🧃
              </span>
              <div>
                <p className="font-display text-lg font-bold">Your cart is empty</p>
                <p className="mt-1 text-sm text-ink/60">
                  Pick a flavour and we&rsquo;ll deliver it cash on delivery.
                </p>
              </div>
              <Link to="/shop" onClick={closeCart} className="btn btn-md btn-forest">
                Browse drinks
              </Link>
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {items.map((line) => (
                <li
                  key={line.key}
                  className="flex gap-3 rounded-2xl border border-forest-800/8 bg-white p-3"
                >
                  <Link
                    to={`/product/${line.slug}`}
                    onClick={closeCart}
                    className="size-20 shrink-0 overflow-hidden rounded-xl"
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
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        to={`/product/${line.slug}`}
                        onClick={closeCart}
                        className="font-display text-[15px] leading-tight font-bold hover:text-forest-700"
                      >
                        {line.product.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() => remove(line.key)}
                        className="shrink-0 rounded-lg p-1 text-ink/35 transition-colors hover:bg-red-50 hover:text-red-600"
                        aria-label={`Remove ${line.product.name}`}
                      >
                        <TrashIcon className="size-4" />
                      </button>
                    </div>
                    <p className="mt-0.5 text-[12.5px] text-ink/55">{line.variant.label}</p>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <QuantityStepper
                        size="sm"
                        value={line.qty}
                        onChange={(q) => setQty(line.key, q)}
                        min={0}
                        label={`Quantity for ${line.product.name}`}
                      />
                      <span className="font-display text-[15px] font-extrabold">
                        {money(line.lineTotal)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-forest-800/10 bg-white px-5 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
            <dl className="mb-3 space-y-1.5 text-sm">
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
              <div className="flex justify-between border-t border-forest-800/10 pt-2 font-display text-lg font-extrabold">
                <dt>Total</dt>
                <dd>{money(total)}</dd>
              </div>
            </dl>
            <Link to="/checkout" onClick={closeCart} className="btn btn-lg btn-gold w-full">
              Checkout · Cash on Delivery
            </Link>
            <Link
              to="/cart"
              onClick={closeCart}
              className="mt-2 block text-center text-[13px] font-semibold text-forest-700 underline underline-offset-4"
            >
              View full cart
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
