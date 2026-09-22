import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { asset, discountPercent, money } from '../lib/format';
import { brandName, packLabels } from '../data/catalog';
import { useCart } from '../lib/cart';
import { useToast } from '../lib/toast';
import { PlusIcon } from './icons';

export default function ProductCard({
  product,
  index = 0,
}: {
  product: Product;
  index?: number;
}) {
  const { add } = useCart();
  const { notify } = useToast();

  // The cheapest variant is what the card prices and what quick-add uses.
  const cheapest = product.variants.reduce((a, b) => (b.price < a.price ? b : a));
  const off = discountPercent(cheapest.price, cheapest.compareAt);

  const quickAdd = () => {
    add(product.slug, cheapest.id, 1);
    notify(`${product.name} · ${cheapest.label} added`);
  };

  return (
    <article
      className="group animate-rise relative flex flex-col overflow-hidden rounded-3xl border border-forest-800/8 bg-white transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-28px_rgba(6,23,15,0.45)]"
      style={{ animationDelay: `${Math.min(index, 11) * 45}ms` }}
    >
      <Link
        to={`/product/${product.slug}`}
        className="relative block aspect-4/5 overflow-hidden"
        style={{
          background: `linear-gradient(160deg, ${product.accent}1f, ${product.accent}08 55%, #ffffff)`,
        }}
      >
        <img
          src={asset(product.images[0])}
          alt={product.name}
          loading={index < 4 ? 'eager' : 'lazy'}
          className="size-full object-cover transition-transform duration-[700ms] ease-out group-hover:scale-107"
          width={800}
          height={1000}
        />

        <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
          {off > 0 && (
            <span className="chip border-transparent bg-red-600 text-white shadow-sm">
              −{off}%
            </span>
          )}
          {product.isNew && (
            <span className="chip border-transparent bg-forest-800 text-gold-300 shadow-sm">
              New
            </span>
          )}
          {product.badges?.map((b) => (
            <span
              key={b}
              className="chip border-transparent bg-white/92 text-forest-900 shadow-sm backdrop-blur-sm"
            >
              {b}
            </span>
          ))}
        </div>

        <span
          className="absolute right-3 bottom-3 rounded-full px-2.5 py-1 text-[11px] font-bold text-white/95 backdrop-blur-sm"
          style={{ background: `${product.accent}cc` }}
        >
          {packLabels[product.pack]}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] font-bold tracking-[0.16em] text-ink/40 uppercase">
          {brandName(product.brand)}
        </p>
        <h3 className="mt-1 font-display text-[17px] leading-snug font-extrabold">
          <Link to={`/product/${product.slug}`} className="hover:text-forest-700">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-ink/55">
          {product.tagline}
        </p>

        <div className="mt-3 flex flex-wrap gap-1">
          {product.variants.slice(0, 3).map((v) => (
            <span
              key={v.id}
              className="rounded-md bg-sand px-1.5 py-0.5 text-[11px] font-semibold text-forest-800"
            >
              {v.label}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-end justify-between gap-3 pt-3">
          <div>
            <p className="text-[11px] font-semibold text-ink/45">From</p>
            <p className="flex items-baseline gap-1.5">
              <span className="font-display text-xl font-extrabold">
                {money(cheapest.price)}
              </span>
              {cheapest.compareAt && (
                <span className="text-[13px] text-ink/35 line-through">
                  {money(cheapest.compareAt)}
                </span>
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={quickAdd}
            className="btn btn-sm btn-forest shrink-0 px-3.5"
            aria-label={`Add ${product.name} ${cheapest.label} to cart`}
          >
            <PlusIcon className="size-4" />
            Add
          </button>
        </div>
      </div>
    </article>
  );
}
