import { Link } from 'react-router-dom';
import { brands, products } from '../data/catalog';
import { site } from '../data/site';
import { asset } from '../lib/format';
import { enquiryUrl } from '../lib/whatsapp';
import { CashIcon, CheckIcon, LeafIcon, TruckIcon, WhatsAppIcon } from '../components/icons';

const values = [
  {
    icon: LeafIcon,
    title: 'Made here, not imported',
    text: 'Every bottle is filled, capped and labelled at our own plant at Bata Pur, Jallo Mor in Lahore.',
  },
  {
    icon: CheckIcon,
    title: 'One recipe, every batch',
    text: 'The mango you buy today tastes like the mango you bought last month. Consistency is the whole job.',
  },
  {
    icon: TruckIcon,
    title: 'Built for shopkeepers',
    text: 'Cases, cartons and mixed pallets priced so a retailer can still make a margin.',
  },
  {
    icon: CashIcon,
    title: 'Cash on delivery',
    text: 'No cards, no advance transfers. You see the order, then you pay the rider.',
  },
];

export default function About() {
  return (
    <>
      <section className="relative overflow-hidden bg-forest-900 py-16 text-cream sm:py-20">
        <div
          aria-hidden
          className="animate-float-slow absolute -top-20 right-0 size-96 rounded-full bg-gold-500/20 blur-[100px]"
        />
        <div className="container-page relative max-w-3xl">
          <span className="chip border-gold-400/35 bg-gold-400/10 text-gold-300">
            Since the first crate left Jallo Mor
          </span>
          <h1 className="mt-5 font-display text-[clamp(2.2rem,6vw,3.8rem)] leading-[1] font-black">
            A Lahore beverage house with
            <span className="gold-text"> four labels</span> and one standard.
          </h1>
          <p className="mt-6 text-[15px] leading-relaxed text-cream/75 sm:text-lg">
            Real Sultan Foods makes and bottles fruit drinks, basil seed coolers,
            carbonated drinks and drinking water. We started supplying shops and
            caterers around Lahore, and this store is simply the shortest line between
            our plant and your fridge.
          </p>
        </div>
      </section>

      <section className="container-page py-14 sm:py-18">
        <div className="grid gap-4 sm:grid-cols-2">
          {values.map(({ icon: Icon, title, text }) => (
            <div key={title} className="card-surface flex gap-4 p-6">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-forest-800 text-gold-300">
                <Icon className="size-6" />
              </span>
              <div>
                <h2 className="font-display text-lg font-extrabold">{title}</h2>
                <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink/65">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page pb-14 sm:pb-18">
        <h2 className="mb-6 font-display text-[clamp(1.6rem,4vw,2.4rem)] font-black">
          The four labels
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {brands.map((b) => {
            const list = products.filter((p) => p.brand === b.id);
            return (
              <Link
                key={b.id}
                to={`/shop?brand=${b.id}`}
                className="group card-surface flex gap-4 overflow-hidden p-4 transition-transform hover:-translate-y-1"
              >
                <span
                  className="size-28 shrink-0 overflow-hidden rounded-2xl"
                  style={{ background: `${b.accent}1f` }}
                >
                  <img
                    src={asset(list[0].images[0])}
                    alt=""
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-lg font-extrabold">
                    {b.name}
                  </span>
                  <span className="mt-1 block text-[13.5px] text-ink/60">{b.blurb}</span>
                  <span className="mt-2 block text-[12.5px] font-bold text-forest-700">
                    {list.length} products ·{' '}
                    {Array.from(new Set(list.map((p) => p.flavour)))
                      .slice(0, 4)
                      .join(', ')}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="container-page pb-16">
        <div className="relative overflow-hidden rounded-[2rem] bg-forest-800 p-8 text-cream sm:p-12">
          <div
            aria-hidden
            className="absolute -right-16 -bottom-16 size-72 rounded-full bg-gold-500/20 blur-3xl"
          />
          <div className="relative grid items-center gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <h2 className="font-display text-[clamp(1.6rem,4vw,2.4rem)] font-black">
                Come see the plant, or just message us
              </h2>
              <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-cream/75">
                {site.address}. We&rsquo;re open {site.hours.toLowerCase()} — retailers,
                caterers and distributors are welcome to visit or send a list on
                WhatsApp for a same-day quote.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <a
                href={enquiryUrl()}
                target="_blank"
                rel="noreferrer"
                className="btn btn-lg bg-[#25D366] text-forest-950 hover:brightness-105"
              >
                <WhatsAppIcon className="size-5" />
                {site.phoneDisplay}
              </a>
              <Link to="/shop" className="btn btn-lg btn-outline-gold">
                Browse the catalogue
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
