import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../lib/cart';
import { useToast } from '../lib/toast';
import { site } from '../data/site';
import { asset, isValidPkPhone, money } from '../lib/format';
import { makeOrderId } from '../lib/orderId';
import { createOrder, rememberOrder } from '../lib/whatsapp';
import type { CustomerDetails } from '../types';
import { CashIcon, CheckIcon, TruckIcon, WhatsAppIcon } from '../components/icons';

const cities = [
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Karachi',
  'Faisalabad',
  'Multan',
  'Gujranwala',
  'Sialkot',
  'Sargodha',
  'Bahawalpur',
  'Peshawar',
  'Quetta',
];

const empty: CustomerDetails = {
  name: '',
  phone: '',
  address: '',
  city: '',
  area: '',
  notes: '',
};

type Errors = Partial<Record<keyof CustomerDetails, string>>;

export default function Checkout() {
  const { items, subtotal, delivery, total, clear } = useCart();
  const { notify } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState<CustomerDetails>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  const set = (key: keyof CustomerDetails, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = (): Errors => {
    const next: Errors = {};
    if (form.name.trim().length < 3) next.name = 'Please enter your full name.';
    if (!isValidPkPhone(form.phone))
      next.phone = 'Enter a valid mobile number, e.g. 0300 1234567.';
    if (form.address.trim().length < 10)
      next.address = 'Please give a complete address with house/shop number.';
    if (form.city.trim().length < 2) next.city = 'Which city should we deliver to?';
    return next;
  };

  const placeOrder = (e: FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) {
      notify('Please check the highlighted fields.', 'error');
      const firstKey = Object.keys(found)[0];
      document.getElementById(firstKey)?.focus();
      return;
    }

    setSubmitting(true);
    const order = createOrder(makeOrderId(), form, items, subtotal, delivery);
    rememberOrder(order);

    // Opened synchronously from the submit so mobile browsers don't block it.
    window.open(order.whatsappUrl, '_blank', 'noopener,noreferrer');

    clear();
    navigate('/order-confirmed', { replace: true });
  };

  if (items.length === 0) {
    return (
      <div className="container-page py-20">
        <div className="card-surface mx-auto flex max-w-lg flex-col items-center gap-5 px-6 py-16 text-center">
          <span className="text-6xl">🛒</span>
          <div>
            <h1 className="font-display text-2xl font-black">Nothing to check out</h1>
            <p className="mt-2 text-sm text-ink/60">
              Add a few bottles to your cart first.
            </p>
          </div>
          <Link to="/shop" className="btn btn-lg btn-gold">
            Browse drinks
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-8 sm:py-12">
      <nav aria-label="Breadcrumb" className="mb-3 text-[12.5px] font-semibold text-ink/45">
        <Link to="/cart" className="hover:text-forest-700">
          Cart
        </Link>
        <span aria-hidden className="mx-1.5">/</span>
        <span className="text-forest-800">Checkout</span>
      </nav>

      <h1 className="font-display text-[clamp(1.9rem,5vw,3rem)] font-black">Checkout</h1>
      <p className="mt-2 max-w-2xl text-[15px] text-ink/60">
        Cash on delivery only. When you place the order, WhatsApp opens with your
        details already written out — just press send and we&rsquo;ll confirm it.
      </p>

      <form onSubmit={placeOrder} className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="flex flex-col gap-6">
          <section className="card-surface p-5 sm:p-6">
            <h2 className="mb-5 flex items-center gap-2.5 font-display text-lg font-extrabold">
              <span className="grid size-7 place-items-center rounded-full bg-forest-800 text-[13px] font-bold text-gold-300">
                1
              </span>
              Delivery details
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                id="name"
                label="Full name"
                required
                value={form.name}
                onChange={(v) => set('name', v)}
                error={errors.name}
                placeholder="Ahmed Raza"
                autoComplete="name"
              />
              <Field
                id="phone"
                label="Mobile number"
                required
                value={form.phone}
                onChange={(v) => set('phone', v)}
                error={errors.phone}
                placeholder="0300 1234567"
                type="tel"
                autoComplete="tel"
                hint="We confirm every order on this number."
              />
              <div className="sm:col-span-2">
                <Field
                  id="address"
                  label="Delivery address"
                  required
                  value={form.address}
                  onChange={(v) => set('address', v)}
                  error={errors.address}
                  placeholder="House 12, Street 4, Block C"
                  autoComplete="street-address"
                  multiline
                />
              </div>
              <Field
                id="area"
                label="Area / locality"
                value={form.area}
                onChange={(v) => set('area', v)}
                placeholder="Johar Town"
              />
              <div>
                <label htmlFor="city" className="label">
                  City <span className="text-red-600">*</span>
                </label>
                <input
                  id="city"
                  list="pk-cities"
                  value={form.city}
                  onChange={(e) => set('city', e.target.value)}
                  placeholder="Lahore"
                  autoComplete="address-level2"
                  className={`field ${errors.city ? 'border-red-500 ring-4 ring-red-500/10' : ''}`}
                  aria-invalid={!!errors.city}
                />
                <datalist id="pk-cities">
                  {cities.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
                {errors.city && (
                  <p className="mt-1.5 text-[12.5px] font-semibold text-red-600">
                    {errors.city}
                  </p>
                )}
              </div>
              <div className="sm:col-span-2">
                <Field
                  id="notes"
                  label="Order notes (optional)"
                  value={form.notes}
                  onChange={(v) => set('notes', v)}
                  placeholder="Nearest landmark, preferred delivery time, gate code…"
                  multiline
                />
              </div>
            </div>
          </section>

          <section className="card-surface p-5 sm:p-6">
            <h2 className="mb-5 flex items-center gap-2.5 font-display text-lg font-extrabold">
              <span className="grid size-7 place-items-center rounded-full bg-forest-800 text-[13px] font-bold text-gold-300">
                2
              </span>
              Payment method
            </h2>

            <div className="flex items-start gap-3 rounded-2xl border-2 border-forest-800 bg-forest-800/4 p-4">
              <span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-xl bg-forest-800 text-gold-300">
                <CashIcon className="size-5" />
              </span>
              <div>
                <p className="flex items-center gap-2 font-display text-[15px] font-extrabold">
                  Cash on Delivery
                  <CheckIcon className="size-4 text-leaf-500" />
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-ink/60">
                  Pay the rider in cash when your order reaches you. No advance
                  payment, no online transfer. Please keep the exact amount ready if
                  possible.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* ---------------------------------------------------- summary */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="card-surface overflow-hidden">
            <div className="border-b border-forest-800/8 p-5">
              <h2 className="font-display text-lg font-extrabold">
                Your order
                <span className="ml-2 text-[13px] font-semibold text-ink/45">
                  ({items.length} item{items.length === 1 ? '' : 's'})
                </span>
              </h2>
            </div>

            <ul className="max-h-72 divide-y divide-forest-800/6 overflow-y-auto px-5">
              {items.map((line) => (
                <li key={line.key} className="flex gap-3 py-3">
                  <span
                    className="relative size-14 shrink-0 overflow-hidden rounded-xl"
                    style={{ background: `${line.product.accent}14` }}
                  >
                    <img
                      src={asset(line.product.images[0])}
                      alt=""
                      className="size-full object-cover"
                      loading="lazy"
                    />
                    <span className="absolute -top-1 -right-1 grid size-5 place-items-center rounded-full bg-forest-800 text-[11px] font-bold text-gold-300">
                      {line.qty}
                    </span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] font-bold">
                      {line.product.name}
                    </span>
                    <span className="block text-[12px] text-ink/55">
                      {line.variant.label}
                    </span>
                  </span>
                  <span className="text-[14px] font-bold">{money(line.lineTotal)}</span>
                </li>
              ))}
            </ul>

            <div className="border-t border-forest-800/8 p-5">
              <dl className="space-y-2 text-[15px]">
                <div className="flex justify-between">
                  <dt className="text-ink/60">Subtotal</dt>
                  <dd className="font-semibold">{money(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="flex items-center gap-1.5 text-ink/60">
                    <TruckIcon className="size-4" />
                    Delivery
                  </dt>
                  <dd className="font-semibold">
                    {delivery === 0 ? (
                      <span className="text-leaf-500">FREE</span>
                    ) : (
                      money(delivery)
                    )}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-forest-800/10 pt-3 font-display text-2xl font-black">
                  <dt>Total</dt>
                  <dd>{money(total)}</dd>
                </div>
              </dl>

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-lg mt-5 w-full bg-[#25D366] text-forest-950 shadow-[0_18px_40px_-16px_rgba(37,211,102,0.9)] hover:brightness-105"
              >
                <WhatsAppIcon className="size-5" />
                {submitting ? 'Opening WhatsApp…' : 'Place order on WhatsApp'}
              </button>

              <p className="mt-3 text-center text-[12px] leading-relaxed text-ink/55">
                Your order summary is sent to {site.whatsappDisplay}. Press{' '}
                <b>send</b> in WhatsApp to confirm — we reply within working hours.
              </p>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  hint,
  required,
  multiline,
  ...rest
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  required?: boolean;
  multiline?: boolean;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
}) {
  const className = `field ${error ? 'border-red-500 ring-4 ring-red-500/10' : ''}`;
  return (
    <div>
      <label htmlFor={id} className="label">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      {multiline ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className={`${className} resize-y`}
          aria-invalid={!!error}
          {...rest}
        />
      ) : (
        <input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={className}
          aria-invalid={!!error}
          {...rest}
        />
      )}
      {error ? (
        <p className="mt-1.5 text-[12.5px] font-semibold text-red-600">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-[12.5px] text-ink/45">{hint}</p>
      ) : null}
    </div>
  );
}
