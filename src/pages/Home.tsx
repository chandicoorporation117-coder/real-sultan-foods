import { Link } from 'react-router-dom';
import { brands, categories, products } from '../data/catalog';
import { site } from '../data/site';
import { asset } from '../lib/format';
import { enquiryUrl } from '../lib/whatsapp';
import ProductCard from '../components/ProductCard';
import {
  CashIcon,
  CheckIcon,
  ChevronRight,
  LeafIcon,
  SparkIcon,
  TruckIcon,
  WhatsAppIcon,
} from '../components/icons';

const heroBottles = [
  { src: 'images/products/gold-lychee.jpg', label: 'Gold Lychee', className: 'left-0 top-6 w-[42%] rotate-[-6deg]', delay: '0s' },
  { src: 'images/products/mary-diamond-pet-mango.jpg', label: 'Mary Diamond Mango', className: 'left-[28%] top-0 w-[46%] z-20', delay: '-2.2s' },
  { src: 'images/products/diamond-way-basil-mango.jpg', label: 'Diamond Way Basil Seed', className: 'right-0 top-10 w-[40%] rotate-[7deg]', delay: '-4.1s' },
];

const promises = [
  { icon: CashIcon, title: 'Cash on delivery', text: 'Pay the rider. No cards, no advance, no account needed.' },
  { icon: TruckIcon, title: 'Free over Rs 3,000', text: site.deliveryNote },
  { icon: LeafIcon, title: 'Bottled in Lahore', text: 'Made at our own plant at Bata Pur, Jallo Mor.' },
  { icon: SparkIcon, title: 'Wholesale rates', text: 'Cases and cartons priced for shops and caterers.' },
];

export default function Home() {
  const bestSellers = [...products].sort((a, b) => b.popularity - a.popularity).slice(0, 8);
  const newArrivals = products.filter((p) => p.isNew).slice(0, 4);

  return (
    <>
      {/* ---------------------------------------------------------- hero */}
      <section className="relative overflow-hidden bg-forest-900 text-cream">
        <div
          aria-hidden
          className="animate-float-slow absolute -top-24 -left-24 size-[28rem] rounded-full bg-leaf-500/25 blur-[90px]"
        />
        <div
          aria-hidden
          className="animate-float absolute -right-20 bottom-0 size-[32rem] rounded-full bg-gold-500/22 blur-[100px]"
        />
        <div aria-hidden className="noise absolute inset-0 opacity-[0.06] mix-blend-overlay" />

        <div className="container-page relative grid items-center gap-12 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          <div className="animate-rise">
            <span className="chip border-gold-400/35 bg-gold-400/10 text-gold-300">
              <span aria-hidden>👑</span>
              {site.name} · {site.tagline}
            </span>

            <h1 className="mt-5 font-display text-[clamp(2.4rem,7vw,4.5rem)] leading-[0.95] font-black">
              Taste the
              <br />
              <span className="gold-text">Sultan</span> of
              <br />
              refreshment.
            </h1>

            <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-cream/75 sm:text-base">
              Mary Diamond fruit drinks, Diamond Way basil seed coolers, Gold fizzy
              drinks, Gold Power energy and Ab e Hayat water — straight from our
              Lahore plant to your door. Cash on delivery, always.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/shop" className="btn btn-lg btn-gold">
                Shop all drinks
                <ChevronRight className="size-[18px]" />
              </Link>
              <a
                href={enquiryUrl()}
                target="_blank"
                rel="noreferrer"
                className="btn btn-lg btn-outline-gold"
              >
                <WhatsAppIcon className="size-[18px]" />
                Order on WhatsApp
              </a>
            </div>

            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-cream/12 pt-6">
              {[
                ['26', 'products'],
                ['4', 'brands'],
                ['COD', 'nationwide'],
              ].map(([value, label]) => (
                <div key={label}>
                  <dt className="font-display text-2xl font-black text-gold-300 sm:text-3xl">
                    {value}
                  </dt>
                  <dd className="text-[12px] tracking-wide text-cream/55 uppercase">{label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <div
              aria-hidden
              className="animate-spin-slow absolute inset-[8%] rounded-full border border-dashed border-gold-400/25"
            />
            <div className="relative mx-auto aspect-square w-full max-w-[26rem]">
              {heroBottles.map((b) => (
                <Link
                  key={b.src}
                  to="/shop"
                  className={`animate-float absolute overflow-hidden rounded-[2rem] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)] ring-1 ring-cream/15 transition-transform duration-300 hover:scale-105 ${b.className}`}
                  style={{ animationDelay: b.delay }}
                  aria-label={b.label}
                >
                  <img
                    src={asset(b.src)}
                    alt={b.label}
                    className="size-full object-cover"
                    width={400}
                    height={500}
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="relative border-t border-cream/10 bg-forest-950/60">
          <div className="container-page grid gap-x-8 gap-y-5 py-6 sm:grid-cols-2 lg:grid-cols-4">
            {promises.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gold-500/15 text-gold-300">
                  <Icon className="size-5" />
                </span>
                <div>
                  <p className="font-display text-sm font-bold text-cream">{title}</p>
                  <p className="text-[12.5px] leading-snug text-cream/55">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ categories */}
      <section className="container-page py-14 sm:py-18">
        <SectionHead
          eyebrow="Pick your mood"
          title="Shop by category"
          action={{ to: '/shop', label: 'All products' }}
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((c, i) => (
            <Link
              key={c.id}
              to={`/shop?category=${c.id}`}
              className="group animate-rise relative overflow-hidden rounded-3xl bg-forest-800 p-5 text-cream transition-transform duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <span
                aria-hidden
                className="absolute -right-6 -bottom-6 size-24 rounded-full bg-gold-500/20 blur-2xl transition-all duration-500 group-hover:bg-gold-400/35"
              />
              <span className="relative block text-3xl">{c.emoji}</span>
              <h3 className="relative mt-3 font-display text-lg font-extrabold">{c.name}</h3>
              <p className="relative mt-1 text-[12.5px] leading-snug text-cream/60">{c.blurb}</p>
              <span className="relative mt-4 inline-flex items-center gap-1 text-[12.5px] font-bold text-gold-300">
                Browse
                <ChevronRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ----------------------------------------------------- bestsellers */}
      <section className="container-page pb-14 sm:pb-18">
        <SectionHead
          eyebrow="Reordered every week"
          title="Best sellers"
          action={{ to: '/shop?sort=popular', label: 'See all' }}
        />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {bestSellers.map((p, i) => (
            <ProductCard key={p.slug} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------- brands */}
      <section className="relative overflow-hidden bg-forest-900 py-16 text-cream">
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-500/60 to-transparent"
        />
        <div className="container-page">
          <div className="mb-8 text-center">
            <p className="text-[11px] font-bold tracking-[0.3em] text-gold-400 uppercase">
              Four labels, one house
            </p>
            <h2 className="mt-2 font-display text-[clamp(1.9rem,4.5vw,3rem)] font-black">
              Our <span className="gold-text">brands</span>
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {brands.map((b, i) => {
              const sample = products.find((p) => p.brand === b.id)!;
              const count = products.filter((p) => p.brand === b.id).length;
              return (
                <Link
                  key={b.id}
                  to={`/shop?brand=${b.id}`}
                  className="group animate-rise overflow-hidden rounded-3xl border border-cream/10 bg-cream/5 transition-all duration-300 hover:-translate-y-1.5 hover:border-gold-400/40"
                  style={{ animationDelay: `${i * 70}ms` }}
                >
                  <div
                    className="aspect-16/11 overflow-hidden"
                    style={{ background: `${b.accent}26` }}
                  >
                    <img
                      src={asset(sample.images[1])}
                      alt={b.name}
                      loading="lazy"
                      className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-lg font-extrabold">{b.name}</h3>
                    <p className="mt-0.5 text-[12.5px] text-cream/60">{b.blurb}</p>
                    <p className="mt-3 text-[12px] font-bold text-gold-300">
                      {count} product{count === 1 ? '' : 's'} →
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- new arrivals */}
      {newArrivals.length > 0 && (
        <section className="container-page py-14 sm:py-18">
          <SectionHead
            eyebrow="Fresh off the line"
            title="New arrivals"
            action={{ to: '/shop?sort=new', label: 'See all' }}
          />
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {newArrivals.map((p, i) => (
              <ProductCard key={p.slug} product={p} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* ------------------------------------------------------- wholesale */}
      <section className="container-page pb-16">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-gold-500 via-gold-400 to-gold-600 p-8 sm:p-12">
          <div
            aria-hidden
            className="absolute -top-20 -right-10 size-64 rounded-full bg-white/25 blur-3xl"
          />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <p className="text-[11px] font-bold tracking-[0.28em] text-forest-900/70 uppercase">
                Shops · Caterers · Marquees · Offices
              </p>
              <h2 className="mt-3 font-display text-[clamp(1.8rem,4.5vw,2.8rem)] leading-tight font-black text-forest-950">
                Buying by the carton?
                <br />
                Let&rsquo;s talk rates.
              </h2>
              <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-forest-900/80">
                We supply cases and cartons across Punjab with dedicated pricing for
                retailers, event caterers and distributors. Send us your list on
                WhatsApp and we&rsquo;ll quote the same day.
              </p>
              <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                {[
                  'Case & carton pricing',
                  'Mixed-flavour pallets',
                  'Delivery to your shop',
                  'Regular supply schedules',
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm font-semibold text-forest-900"
                  >
                    <CheckIcon className="size-4 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-3">
              <a
                href={enquiryUrl('wholesale rates')}
                target="_blank"
                rel="noreferrer"
                className="btn btn-lg w-full bg-forest-950 text-cream hover:bg-forest-900"
              >
                <WhatsAppIcon className="size-[18px]" />
                WhatsApp for wholesale
              </a>
              <Link
                to="/contact"
                className="btn btn-lg w-full border border-forest-900/25 text-forest-950 hover:bg-white/40"
              >
                Contact the team
              </Link>
              <p className="text-center text-[12.5px] font-semibold text-forest-900/70">
                {site.phoneDisplay} · {site.hours}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function SectionHead({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action?: { to: string; label: string };
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <p className="text-[11px] font-bold tracking-[0.28em] text-gold-600 uppercase">
          {eyebrow}
        </p>
        <h2 className="mt-1.5 font-display text-[clamp(1.6rem,4vw,2.4rem)] font-black">
          {title}
        </h2>
      </div>
      {action && (
        <Link
          to={action.to}
          className="group hidden shrink-0 items-center gap-1 text-sm font-bold text-forest-700 sm:inline-flex"
        >
          {action.label}
          <ChevronRight className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}
