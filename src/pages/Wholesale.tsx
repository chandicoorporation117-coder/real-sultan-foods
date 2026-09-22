import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { brands, categories, products } from '../data/catalog';
import { site } from '../data/site';
import { whatsappUrl } from '../lib/whatsapp';
import { useToast } from '../lib/toast';
import { outletTypes, wholesaleFaqs } from '../data/wholesale';
import {
  CashIcon,
  CheckIcon,
  PhoneIcon,
  PinIcon,
  SparkIcon,
  TruckIcon,
  WhatsAppIcon,
} from '../components/icons';

/* NOTE FOR REAL SULTAN FOODS —————————————————————————————————————
   The commercial terms below are placeholders written to a sensible
   default. Replace them with your real policy before this page goes
   live; distributors will hold you to whatever is printed here.
   Search for "TODO:" to find every number that needs confirming.
   ———————————————————————————————————————————————————————————————— */

const reasons = [
  {
    icon: CashIcon,
    title: 'Margin a shopkeeper can live on',
    // TODO: confirm the real retailer margin band.
    text: 'Carton rates are set so a retailer still clears a workable margin at the printed consumer price, not a token two rupees.',
  },
  {
    icon: TruckIcon,
    title: 'Mixed cartons, not full pallets',
    text: 'Start with a mixed load across flavours and pack sizes. You find out what moves in your area before committing to volume.',
  },
  {
    icon: PinIcon,
    title: 'Direct from the Lahore plant',
    text: 'No middle tier taking a cut. You buy from the people who fill, cap and label the bottles at Bata Pur, Jallo Mor.',
  },
  {
    icon: SparkIcon,
    title: 'Four labels, one delivery',
    text: 'Fruit drinks, basil seed coolers, fizzy drinks, an energy drink and bottled water on a single invoice and a single drop.',
  },
];

const steps = [
  {
    title: 'Send an enquiry',
    text: 'Tell us your city, the area you cover and the kind of outlets you supply — general stores, tuck shops, caterers, wholesale market.',
  },
  {
    title: 'Get the trade price list',
    text: 'We send current carton rates for every SKU, plus the minimum first order and delivery terms for your district.',
  },
  {
    title: 'Trial load',
    text: 'A mixed first order across the ranges that suit your market, so you can test demand before scaling.',
  },
  {
    title: 'Regular supply',
    text: 'Once volumes settle we agree a re-order cycle and, where volumes justify it, territory exclusivity.',
  },
];

export default function Wholesale() {
  const { notify } = useToast();
  const [form, setForm] = useState({
    name: '',
    business: '',
    city: '',
    phone: '',
    outlets: outletTypes[0] as string,
    message: '',
  });

  const set = (key: keyof typeof form) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const send = (e: FormEvent) => {
    e.preventDefault();
    if (form.name.trim().length < 3 || form.city.trim().length < 2) {
      notify('Please add your name and your city.', 'error');
      return;
    }
    const text = [
      `*Distributor enquiry — ${site.name}*`,
      `Name: ${form.name}`,
      form.business.trim() && `Business: ${form.business}`,
      `City / area: ${form.city}`,
      form.phone.trim() && `Phone: ${form.phone}`,
      `Outlet type: ${form.outlets}`,
      '',
      form.message.trim() || 'Please send the trade price list.',
    ]
      .filter(Boolean)
      .join('\n');
    window.open(whatsappUrl(text), '_blank', 'noopener,noreferrer');
  };

  const field =
    'w-full rounded-2xl border border-forest-800/12 bg-white px-4 py-3 text-[15px] outline-none transition focus:border-forest-700 focus:ring-4 focus:ring-forest-700/10';

  return (
    <>
      {/* ---------------------------------------------------------------- */}
      <section className="relative overflow-hidden bg-forest-900 py-16 text-cream sm:py-20">
        <div
          aria-hidden
          className="animate-float-slow absolute -top-24 right-0 size-96 rounded-full bg-gold-500/20 blur-[100px]"
        />
        <div className="container-page relative max-w-3xl">
          <nav aria-label="Breadcrumb" className="mb-4 text-[12.5px] font-semibold text-cream/45">
            <Link to="/" className="hover:text-gold-300">
              Home
            </Link>
            <span aria-hidden className="mx-1.5">/</span>
            <span className="text-gold-300">Wholesale</span>
          </nav>

          <span className="chip border-gold-400/35 bg-gold-400/10 text-gold-300">
            Distributorship open across Pakistan
          </span>

          <h1 className="mt-5 font-display text-[clamp(2.1rem,6vw,3.6rem)] leading-[1.02] font-black">
            Wholesale drinks and
            <span className="gold-text"> distributorship</span> direct from our Lahore plant.
          </h1>

          <p className="mt-6 text-[15px] leading-relaxed text-cream/75 sm:text-lg">
            Real Sultan Foods supplies {products.length} beverage SKUs across{' '}
            {categories.length} categories to retailers, wholesalers and distributors
            throughout Pakistan — fruit drinks, basil seed coolers, carbonated drinks,
            an energy drink and bottled water. Carton and pallet rates, mixed first
            orders, and protected territories for partners who build volume.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={whatsappUrl(
                `*Distributor enquiry — ${site.name}*\nPlease send the trade price list.`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gold-400 px-6 py-3 text-[15px] font-bold text-forest-900 transition hover:bg-gold-300"
            >
              <WhatsAppIcon className="size-5" />
              Request the trade price list
            </a>
            <a
              href="#distributor-enquiry"
              className="inline-flex items-center gap-2 rounded-full border border-cream/25 px-6 py-3 text-[15px] font-bold text-cream transition hover:border-gold-300 hover:text-gold-300"
            >
              Apply to distribute
            </a>
          </div>

          <p className="mt-5 flex items-center gap-2 text-[13.5px] text-cream/55">
            <PhoneIcon className="size-4" />
            {site.whatsappDisplay} · {site.hours}
          </p>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      <section className="container-page py-14 sm:py-18">
        <h2 className="font-display text-[clamp(1.6rem,4vw,2.4rem)] font-black">
          Why retailers stock us
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {reasons.map(({ icon: Icon, title, text }) => (
            <div key={title} className="card-surface flex gap-4 p-6">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-forest-800 text-gold-300">
                <Icon className="size-6" />
              </span>
              <div>
                <h3 className="font-display text-lg font-bold">{title}</h3>
                <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink/70">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      <section className="border-y border-forest-800/8 bg-sand py-14 sm:py-18">
        <div className="container-page">
          <h2 className="font-display text-[clamp(1.6rem,4vw,2.4rem)] font-black">
            What you can carry
          </h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink/70">
            Four labels covering the everyday shelf: a fruit drink for the lunchbox, a
            basil seed cooler for the summer, a fizzy drink and an energy drink for the
            counter fridge, and water that moves all year.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {brands.map((b) => {
              const count = products.filter((p) => p.brand === b.id).length;
              return (
                <div key={b.id} className="card-surface p-6">
                  <span
                    aria-hidden
                    className="block size-3 rounded-full"
                    style={{ background: b.accent }}
                  />
                  <h3 className="mt-4 font-display text-lg font-bold">{b.name}</h3>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-ink/65">{b.blurb}</p>
                  <p className="mt-3 text-[13px] font-semibold text-forest-700">
                    {count} {count === 1 ? 'SKU' : 'SKUs'}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {outletTypes.map((o) => (
              <span
                key={o}
                className="rounded-full border border-forest-800/12 bg-white px-4 py-2 text-[13.5px] font-semibold text-ink/75"
              >
                {o}
              </span>
            ))}
          </div>

          <Link
            to="/shop"
            className="mt-8 inline-flex items-center gap-2 text-[15px] font-bold text-forest-700 underline underline-offset-4 hover:text-forest-900"
          >
            See the full range and consumer prices
          </Link>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      <section className="container-page py-14 sm:py-18">
        <h2 className="font-display text-[clamp(1.6rem,4vw,2.4rem)] font-black">
          How to become a distributor
        </h2>
        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.title} className="card-surface p-6">
              <span className="grid size-10 place-items-center rounded-full bg-gold-400 font-display text-base font-black text-forest-900">
                {i + 1}
              </span>
              <h3 className="mt-4 font-display text-base font-bold">{s.title}</h3>
              <p className="mt-1.5 text-[14px] leading-relaxed text-ink/70">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------------------------------------------------------------- */}
      <section id="distributor-enquiry" className="border-t border-forest-800/8 bg-sand py-14 sm:py-18">
        <div className="container-page grid gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <h2 className="font-display text-[clamp(1.6rem,4vw,2.4rem)] font-black">
              Apply to distribute
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink/70">
              Fill this in and it opens WhatsApp with your details ready to send. We
              reply with the current trade price list and the minimum first order for
              your area.
            </p>

            <form onSubmit={send} className="mt-7 grid gap-3.5">
              <div className="grid gap-3.5 sm:grid-cols-2">
                <label className="grid gap-1.5">
                  <span className="text-[13px] font-bold text-ink/70">Your name</span>
                  <input
                    className={field}
                    value={form.name}
                    onChange={(e) => set('name')(e.target.value)}
                    autoComplete="name"
                  />
                </label>
                <label className="grid gap-1.5">
                  <span className="text-[13px] font-bold text-ink/70">Business name</span>
                  <input
                    className={field}
                    value={form.business}
                    onChange={(e) => set('business')(e.target.value)}
                    autoComplete="organization"
                  />
                </label>
                <label className="grid gap-1.5">
                  <span className="text-[13px] font-bold text-ink/70">City / area covered</span>
                  <input
                    className={field}
                    value={form.city}
                    onChange={(e) => set('city')(e.target.value)}
                    autoComplete="address-level2"
                  />
                </label>
                <label className="grid gap-1.5">
                  <span className="text-[13px] font-bold text-ink/70">Phone</span>
                  <input
                    className={field}
                    value={form.phone}
                    onChange={(e) => set('phone')(e.target.value)}
                    inputMode="tel"
                    autoComplete="tel"
                  />
                </label>
              </div>

              <label className="grid gap-1.5">
                <span className="text-[13px] font-bold text-ink/70">What do you supply?</span>
                <select
                  className={field}
                  value={form.outlets}
                  onChange={(e) => set('outlets')(e.target.value)}
                >
                  {outletTypes.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </label>

              <label className="grid gap-1.5">
                <span className="text-[13px] font-bold text-ink/70">
                  Anything else? (volumes, brands you already carry)
                </span>
                <textarea
                  className={field}
                  rows={4}
                  value={form.message}
                  onChange={(e) => set('message')(e.target.value)}
                />
              </label>

              <button
                type="submit"
                className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-forest-800 px-6 py-3.5 text-[15px] font-bold text-cream transition hover:bg-forest-900"
              >
                <WhatsAppIcon className="size-5" />
                Send enquiry on WhatsApp
              </button>
            </form>
          </div>

          <div>
            <h2 className="font-display text-[clamp(1.6rem,4vw,2.4rem)] font-black">
              Wholesale questions
            </h2>
            <dl className="mt-7 grid gap-3">
              {wholesaleFaqs.map((f) => (
                <div key={f.q} className="card-surface p-5">
                  <dt className="flex gap-2.5 font-display text-[15.5px] font-bold">
                    <CheckIcon className="mt-0.5 size-5 shrink-0 text-forest-700" />
                    {f.q}
                  </dt>
                  <dd className="mt-2 pl-[30px] text-[14px] leading-relaxed text-ink/70">{f.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </>
  );
}

