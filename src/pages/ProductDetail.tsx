import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  brandName,
  categoryName,
  getProduct,
  packLabels,
  products,
} from '../data/catalog';
import { site } from '../data/site';
import { asset, discountPercent, money } from '../lib/format';
import { useCart } from '../lib/cart';
import { useToast } from '../lib/toast';
import { enquiryUrl } from '../lib/whatsapp';
import QuantityStepper from '../components/QuantityStepper';
import ProductCard from '../components/ProductCard';
import NotFound from './NotFound';
import {
  CashIcon,
  CheckIcon,
  ChevronDown,
  LeafIcon,
  TruckIcon,
  WhatsAppIcon,
} from '../components/icons';

export default function ProductDetail() {
  const { slug = '' } = useParams();
  const product = getProduct(slug);

  const [variantId, setVariantId] = useState(product?.variants[0].id ?? '');
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const { add, openCart } = useCart();
  const { notify } = useToast();

  // Reset local state when navigating between products.
  useEffect(() => {
    setVariantId(product?.variants[0].id ?? '');
    setQty(1);
    setActiveImage(0);
  }, [slug, product]);

  const related = useMemo(
    () =>
      products
        .filter(
          (p) =>
            p.slug !== slug &&
            (p.brand === product?.brand || p.category === product?.category)
        )
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 4),
    [slug, product]
  );

  if (!product) return <NotFound />;

  const variant =
    product.variants.find((v) => v.id === variantId) ?? product.variants[0];
  const off = discountPercent(variant.price, variant.compareAt);
  const lineTotal = variant.price * qty;

  const addToCart = () => {
    add(product.slug, variant.id, qty);
    notify(`${product.name} · ${variant.label} × ${qty} added`);
  };

  return (
    <>
      <div className="container-page pt-6">
        <nav aria-label="Breadcrumb" className="text-[12.5px] font-semibold text-ink/45">
          <Link to="/" className="hover:text-forest-700">
            Home
          </Link>
          <span aria-hidden className="mx-1.5">/</span>
          <Link to="/shop" className="hover:text-forest-700">
            Shop
          </Link>
          <span aria-hidden className="mx-1.5">/</span>
          <Link
            to={`/shop?category=${product.category}`}
            className="hover:text-forest-700"
          >
            {categoryName(product.category)}
          </Link>
          <span aria-hidden className="mx-1.5">/</span>
          <span className="text-forest-800">{product.name}</span>
        </nav>
      </div>

      <div className="container-page grid gap-8 py-6 lg:grid-cols-2 lg:gap-14 lg:py-10">
        {/* ------------------------------------------------------ gallery */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div
            className="relative aspect-4/5 overflow-hidden rounded-[1.75rem]"
            style={{
              background: `linear-gradient(155deg, ${product.accent}26, ${product.accent}0a 60%, #ffffff)`,
            }}
          >
            <img
              key={activeImage}
              src={asset(product.images[activeImage])}
              alt={`${product.name} — view ${activeImage + 1}`}
              className="animate-pop size-full object-cover"
              width={800}
              height={1000}
            />
            {off > 0 && (
              <span className="absolute top-4 left-4 rounded-full bg-red-600 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
                Save {off}%
              </span>
            )}
          </div>

          {product.images.length > 1 && (
            <div className="mt-3 flex gap-3">
              {product.images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  aria-label={`Show image ${i + 1}`}
                  aria-current={i === activeImage}
                  className={`size-20 overflow-hidden rounded-2xl border-2 transition-all sm:size-24 ${
                    i === activeImage
                      ? 'border-gold-500 shadow-gold'
                      : 'border-transparent opacity-65 hover:opacity-100'
                  }`}
                  style={{ background: `${product.accent}14` }}
                >
                  <img
                    src={asset(src)}
                    alt={`${product.name} ${product.tagline} — view ${i + 1}`}
                    className="size-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* --------------------------------------------------- buy column */}
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to={`/shop?brand=${product.brand}`}
              className="chip border-forest-800/15 bg-white text-forest-800 hover:border-forest-800/40"
            >
              {brandName(product.brand)}
            </Link>
            <span
              className="chip border-transparent text-white"
              style={{ background: product.accent }}
            >
              {product.flavour}
            </span>
            <span className="chip border-forest-800/12 bg-sand text-forest-800">
              {packLabels[product.pack]}
            </span>
          </div>

          <h1 className="mt-4 font-display text-[clamp(1.9rem,5vw,2.9rem)] leading-[1.05] font-black">
            {product.name}
          </h1>
          <p className="mt-2 text-[15px] text-ink/60">{product.tagline}</p>

          <div className="mt-5 flex flex-wrap items-baseline gap-3">
            <span className="font-display text-4xl font-black text-forest-800">
              {money(variant.price)}
            </span>
            {variant.compareAt && (
              <span className="text-lg text-ink/35 line-through">
                {money(variant.compareAt)}
              </span>
            )}
            <span className="text-[13px] font-semibold text-ink/50">
              per {variant.label.toLowerCase()}
            </span>
          </div>

          <p className="mt-5 text-[15px] leading-relaxed text-ink/75">
            {product.description}
          </p>

          {/* variants */}
          <fieldset className="mt-7">
            <legend className="label">Choose size or pack</legend>
            <div className="grid gap-2 sm:grid-cols-3">
              {product.variants.map((v) => {
                const selected = v.id === variant.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setVariantId(v.id)}
                    aria-pressed={selected}
                    className={`rounded-2xl border-2 p-3 text-left transition-all ${
                      selected
                        ? 'border-forest-800 bg-forest-800 text-cream shadow-glow'
                        : 'border-forest-800/12 bg-white hover:border-forest-800/40'
                    }`}
                  >
                    <span className="block text-[13px] font-bold">{v.label}</span>
                    <span
                      className={`mt-0.5 block font-display text-[17px] font-extrabold ${
                        selected ? 'text-gold-300' : 'text-forest-800'
                      }`}
                    >
                      {money(v.price)}
                    </span>
                    {v.units && v.units > 1 && (
                      <span
                        className={`mt-0.5 block text-[11px] ${
                          selected ? 'text-cream/60' : 'text-ink/45'
                        }`}
                      >
                        {money(Math.round(v.price / v.units))} per bottle
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* qty + add */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <QuantityStepper value={qty} onChange={setQty} />
            <button
              type="button"
              onClick={addToCart}
              className="btn btn-lg btn-gold flex-1 min-w-[12rem]"
            >
              Add to cart · {money(lineTotal)}
            </button>
          </div>

          <div className="mt-3 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                addToCart();
                openCart();
              }}
              className="btn btn-md btn-forest flex-1"
            >
              Buy now
            </button>
            <a
              href={enquiryUrl(`${product.name} (${variant.label})`)}
              target="_blank"
              rel="noreferrer"
              className="btn btn-md flex-1 border border-[#25D366]/50 bg-[#25D366]/10 text-[#128C4B] hover:bg-[#25D366]/20"
            >
              <WhatsAppIcon className="size-[18px]" />
              Ask about this
            </a>
          </div>

          {/* assurances */}
          <ul className="mt-7 grid gap-3 rounded-3xl border border-forest-800/8 bg-white p-5 sm:grid-cols-3">
            {[
              { icon: CashIcon, title: 'Cash on delivery', text: 'Pay when it arrives' },
              {
                icon: TruckIcon,
                title: 'Free over Rs 3,000',
                text: `Otherwise ${money(site.deliveryFee)}`,
              },
              { icon: LeafIcon, title: 'Bottled fresh', text: 'At our Lahore plant' },
            ].map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-2.5">
                <Icon className="mt-0.5 size-5 shrink-0 text-gold-600" />
                <span>
                  <span className="block text-[13px] font-bold text-forest-900">{title}</span>
                  <span className="block text-[12px] text-ink/55">{text}</span>
                </span>
              </li>
            ))}
          </ul>

          {/* details */}
          <div className="mt-6 divide-y divide-forest-800/10 border-y border-forest-800/10">
            <Accordion title="Why people order it" defaultOpen>
              <ul className="space-y-2">
                {product.highlights.map((h) => (
                  <li key={h} className="flex gap-2.5 text-[14.5px] text-ink/75">
                    <CheckIcon className="mt-0.5 size-4 shrink-0 text-leaf-500" />
                    {h}
                  </li>
                ))}
              </ul>
            </Accordion>
            <Accordion title="Ingredients">
              <p className="text-[14.5px] leading-relaxed text-ink/75">
                {product.ingredients}
              </p>
              <p className="mt-3 text-[13px] text-ink/50">
                Store in a cool, dry place away from direct sunlight. Best served
                chilled. Refrigerate after opening.
              </p>
            </Accordion>
            <Accordion title="Delivery & payment">
              <p className="text-[14.5px] leading-relaxed text-ink/75">
                {site.deliveryNote} Orders are confirmed on WhatsApp before dispatch,
                and you pay the rider in cash when your order arrives. Delivery is{' '}
                {money(site.deliveryFee)}, free on orders over{' '}
                {money(site.freeDeliveryThreshold)}.
              </p>
            </Accordion>
          </div>
        </div>
      </div>

      {/* related */}
      {related.length > 0 && (
        <section className="container-page pt-6 pb-20 lg:pb-10">
          <h2 className="mb-6 font-display text-[clamp(1.5rem,4vw,2.2rem)] font-black">
            You might also like
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {related.map((p, i) => (
              <ProductCard key={p.slug} product={p} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* sticky mobile buy bar */}
      <div className="fixed inset-x-0 bottom-0 z-[55] border-t border-forest-800/10 bg-cream/95 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-lg lg:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12px] font-semibold text-ink/55">
              {variant.label}
            </p>
            <p className="font-display text-xl leading-none font-extrabold">
              {money(lineTotal)}
            </p>
          </div>
          <button type="button" onClick={addToCart} className="btn btn-md btn-gold px-6">
            Add to cart
          </button>
        </div>
      </div>
    </>
  );
}

function Accordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 py-4 text-left font-display text-[15px] font-bold"
      >
        {title}
        <ChevronDown
          className={`size-4 shrink-0 text-ink/45 transition-transform ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  );
}
