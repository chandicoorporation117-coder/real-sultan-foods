import { useEffect, useState, type FormEvent } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { site } from '../data/site';
import { categories } from '../data/catalog';
import { asset } from '../lib/format';
import { useCart } from '../lib/cart';
import { enquiryUrl } from '../lib/whatsapp';
import {
  CartIcon,
  CloseIcon,
  MenuIcon,
  SearchIcon,
  WhatsAppIcon,
} from './icons';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/wholesale', label: 'Wholesale' },
  { to: '/about', label: 'Our Story' },
  { to: '/contact', label: 'Contact' },
];

const ticker = [
  'Cash on delivery all over Pakistan',
  `Free delivery over Rs ${site.freeDeliveryThreshold.toLocaleString('en-PK')}`,
  'Order on WhatsApp in 30 seconds',
  'Bottled fresh in Lahore',
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState('');
  const { count, openCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => setMenuOpen(false), [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const submitSearch = (e: FormEvent) => {
    e.preventDefault();
    navigate(query.trim() ? `/shop?q=${encodeURIComponent(query.trim())}` : '/shop');
    setQuery('');
    setMenuOpen(false);
  };

  return (
    <>
      {/* announcement ticker */}
      <div className="relative overflow-hidden bg-forest-950 py-2 text-[12px] font-semibold tracking-wide text-gold-300">
        <div className="animate-marquee flex w-max gap-10 whitespace-nowrap pr-10">
          {[...ticker, ...ticker, ...ticker, ...ticker].map((t, i) => (
            <span key={i} className="flex items-center gap-2">
              <span aria-hidden className="text-gold-500">
                ✦
              </span>
              {t}
            </span>
          ))}
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-forest-900/95 shadow-glow backdrop-blur-xl'
            : 'bg-forest-900'
        }`}
      >
        <div className="container-page flex h-[68px] items-center gap-3 sm:h-[76px] sm:gap-5">
          <Link
            to="/"
            className="flex shrink-0 items-center gap-2.5"
            aria-label={`${site.name} home`}
          >
            <span className="grid size-11 place-items-center rounded-2xl bg-cream p-1 shadow-gold sm:size-12">
              <img
                src={asset('images/logo.webp')}
                alt=""
                className="size-full object-contain"
                width={48}
                height={48}
              />
            </span>
            <span className="leading-tight">
              <span className="block font-display text-[17px] font-extrabold text-cream">
                Real Sultan
              </span>
              <span className="block text-[10px] font-bold tracking-[0.28em] text-gold-400 uppercase">
                Foods
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-cream/12 text-gold-300'
                      : 'text-cream/80 hover:bg-cream/8 hover:text-cream'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <form onSubmit={submitSearch} className="ml-auto hidden flex-1 md:block md:max-w-xs">
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-3.5 size-[18px] -translate-y-1/2 text-cream/50" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="search"
                placeholder="Search mango, basil seed, 1.5 L…"
                aria-label="Search products"
                className="h-11 w-full rounded-full border border-cream/15 bg-cream/8 pr-4 pl-11 text-sm text-cream placeholder:text-cream/45 transition-colors focus:border-gold-400/70 focus:bg-cream/12 focus:outline-none"
              />
            </div>
          </form>

          <div className="ml-auto flex items-center gap-2 md:ml-0">
            <a
              href={enquiryUrl()}
              target="_blank"
              rel="noreferrer"
              className="btn btn-sm hidden border border-[#25D366]/40 bg-[#25D366]/12 text-[#7bf0a9] hover:bg-[#25D366]/20 xl:inline-flex"
            >
              <WhatsAppIcon className="size-[17px]" />
              {site.phoneDisplay}
            </a>

            <button
              type="button"
              onClick={openCart}
              className="relative grid size-11 place-items-center rounded-full bg-gold-500 text-forest-950 shadow-gold transition-transform hover:scale-105 active:scale-95"
              aria-label={`Open cart, ${count} item${count === 1 ? '' : 's'}`}
            >
              <CartIcon className="size-[21px]" />
              {count > 0 && (
                <span className="animate-pop absolute -top-1 -right-1 grid min-w-5.5 place-items-center rounded-full bg-forest-950 px-1.5 text-[11px] font-bold text-gold-300 ring-2 ring-forest-900">
                  {count}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="grid size-11 place-items-center rounded-full border border-cream/15 text-cream lg:hidden"
              aria-label="Open menu"
            >
              <MenuIcon className="size-[22px]" />
            </button>
          </div>
        </div>
      </header>

      {/* mobile menu */}
      <div
        className={`fixed inset-0 z-[70] lg:hidden ${menuOpen ? '' : 'pointer-events-none'}`}
        aria-hidden={!menuOpen}
      >
        <div
          onClick={() => setMenuOpen(false)}
          className={`absolute inset-0 bg-forest-950/70 backdrop-blur-sm transition-opacity duration-300 ${
            menuOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div
          className={`absolute inset-y-0 right-0 flex w-[86%] max-w-sm flex-col bg-forest-900 transition-transform duration-300 ${
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex h-[68px] items-center justify-between px-5">
            <span className="font-display text-lg font-extrabold text-cream">Menu</span>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="grid size-10 place-items-center rounded-full border border-cream/15 text-cream"
              aria-label="Close menu"
            >
              <CloseIcon />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 pb-8">
            <form onSubmit={submitSearch} className="relative mb-5">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-3.5 size-[18px] -translate-y-1/2 text-cream/50" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="search"
                placeholder="Search products…"
                aria-label="Search products"
                className="h-12 w-full rounded-2xl border border-cream/15 bg-cream/8 pr-4 pl-11 text-sm text-cream placeholder:text-cream/45 focus:border-gold-400/70 focus:outline-none"
              />
            </form>

            <nav className="flex flex-col">
              {navLinks.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === '/'}
                  className={({ isActive }) =>
                    `border-b border-cream/8 py-3.5 font-display text-xl font-bold ${
                      isActive ? 'text-gold-300' : 'text-cream'
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
            </nav>

            <p className="mt-6 mb-3 text-[11px] font-bold tracking-[0.22em] text-cream/45 uppercase">
              Shop by category
            </p>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <Link
                  key={c.id}
                  to={`/shop?category=${c.id}`}
                  className="chip border-cream/15 bg-cream/8 text-cream"
                >
                  <span aria-hidden>{c.emoji}</span>
                  {c.name}
                </Link>
              ))}
            </div>

            <a
              href={enquiryUrl()}
              target="_blank"
              rel="noreferrer"
              className="btn btn-md mt-7 w-full bg-[#25D366] text-forest-950"
            >
              <WhatsAppIcon className="size-[18px]" />
              WhatsApp {site.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
