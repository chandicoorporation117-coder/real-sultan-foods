import { Link } from 'react-router-dom';
import { site } from '../data/site';
import { brands, categories } from '../data/catalog';
import { asset } from '../lib/format';
import { enquiryUrl } from '../lib/whatsapp';
import { MailIcon, PhoneIcon, PinIcon, WhatsAppIcon } from './icons';

export default function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden bg-forest-950 text-cream/75">
      <div
        aria-hidden
        className="absolute -top-32 -left-24 size-80 rounded-full bg-leaf-500/15 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -right-20 -bottom-28 size-96 rounded-full bg-gold-500/12 blur-3xl"
      />

      <div className="container-page relative py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid size-14 place-items-center rounded-2xl bg-cream p-1.5">
                <img
                  src={asset('images/logo.webp')}
                  alt=""
                  className="size-full object-contain"
                  width={56}
                  height={56}
                />
              </span>
              <span>
                <span className="block font-display text-xl font-extrabold text-cream">
                  {site.name}
                </span>
                <span className="block text-[10px] font-bold tracking-[0.3em] text-gold-400 uppercase">
                  {site.tagline}
                </span>
              </span>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed">
              Juices, basil seed drinks, fizzy drinks and bottled water — made and
              bottled in Lahore, delivered to your door with cash on delivery.
            </p>
            <a
              href={enquiryUrl()}
              target="_blank"
              rel="noreferrer"
              className="btn btn-md mt-6 bg-[#25D366] text-forest-950 hover:brightness-105"
            >
              <WhatsAppIcon className="size-[18px]" />
              Order on WhatsApp
            </a>
          </div>

          <nav aria-label="Shop by category">
            <h3 className="mb-4 text-[11px] font-bold tracking-[0.24em] text-gold-400 uppercase">
              Categories
            </h3>
            <ul className="space-y-2.5 text-sm">
              {categories.map((c) => (
                <li key={c.id}>
                  <Link
                    to={`/shop?category=${c.id}`}
                    className="link-underline hover:text-cream"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Our brands">
            <h3 className="mb-4 text-[11px] font-bold tracking-[0.24em] text-gold-400 uppercase">
              Our brands
            </h3>
            <ul className="space-y-2.5 text-sm">
              {brands.map((b) => (
                <li key={b.id}>
                  <Link to={`/shop?brand=${b.id}`} className="link-underline hover:text-cream">
                    {b.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/about" className="link-underline hover:text-cream">
                  Our story
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <h3 className="mb-4 text-[11px] font-bold tracking-[0.24em] text-gold-400 uppercase">
              Get in touch
            </h3>
            <ul className="space-y-3.5 text-sm">
              <li className="flex gap-3">
                <PhoneIcon className="mt-0.5 size-[18px] shrink-0 text-gold-400" />
                <a href={`tel:+${site.whatsappNumber}`} className="hover:text-cream">
                  {site.phoneDisplay}
                </a>
              </li>
              <li className="flex gap-3">
                <MailIcon className="mt-0.5 size-[18px] shrink-0 text-gold-400" />
                <a href={`mailto:${site.email}`} className="break-all hover:text-cream">
                  {site.email}
                </a>
              </li>
              <li className="flex gap-3">
                <PinIcon className="mt-0.5 size-[18px] shrink-0 text-gold-400" />
                <span>{site.address}</span>
              </li>
            </ul>
            <p className="mt-5 rounded-2xl border border-cream/10 bg-cream/5 px-4 py-3 text-[13px]">
              <b className="text-cream">Order hours</b>
              <br />
              {site.hours}
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-cream/10 pt-6 text-[12.5px] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>Cash on Delivery</span>
            <span aria-hidden className="text-gold-500">
              •
            </span>
            <span>{site.deliveryNote}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
