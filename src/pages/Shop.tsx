import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  brands,
  categories,
  priceRange,
  products,
  sizeFilters,
} from '../data/catalog';
import ProductCard from '../components/ProductCard';
import { CloseIcon, SearchIcon, SlidersIcon } from '../components/icons';
import { money } from '../lib/format';

const sorts = [
  { id: 'popular', label: 'Most popular' },
  { id: 'price-asc', label: 'Price: low to high' },
  { id: 'price-desc', label: 'Price: high to low' },
  { id: 'new', label: 'New arrivals' },
  { id: 'name', label: 'A – Z' },
];

const maxCatalogPrice = Math.max(...products.map((p) => priceRange(p).max));

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const q = params.get('q') ?? '';
  const category = params.get('category') ?? '';
  const brand = params.get('brand') ?? '';
  const size = params.get('size') ?? '';
  const sort = params.get('sort') ?? 'popular';
  const maxPrice = Number(params.get('max') ?? maxCatalogPrice);

  const [searchDraft, setSearchDraft] = useState(q);
  useEffect(() => setSearchDraft(q), [q]);

  // Debounce the search box so typing doesn't spam history entries.
  useEffect(() => {
    if (searchDraft === q) return;
    const id = window.setTimeout(() => update('q', searchDraft), 280);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchDraft]);

  const update = (key: string, value: string) => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (!value || value === 'popular') next.delete(key);
        else next.set(key, value);
        return next;
      },
      { replace: true }
    );
  };

  const clearAll = () => setParams({}, { replace: true });

  const activeCount =
    (q ? 1 : 0) +
    (category ? 1 : 0) +
    (brand ? 1 : 0) +
    (size ? 1 : 0) +
    (maxPrice < maxCatalogPrice ? 1 : 0);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let list = products.filter((p) => {
      if (category && p.category !== category) return false;
      if (brand && p.brand !== brand) return false;
      if (size) {
        const rule = sizeFilters.find((s) => s.id === size);
        if (rule && !p.variants.some((v) => rule.match(v.label))) return false;
      }
      if (priceRange(p).min > maxPrice) return false;
      if (needle) {
        const haystack = [
          p.name,
          p.tagline,
          p.flavour,
          p.description,
          p.brand,
          p.category,
          ...p.variants.map((v) => v.label),
        ]
          .join(' ')
          .toLowerCase();
        if (!needle.split(/\s+/).every((word) => haystack.includes(word))) return false;
      }
      return true;
    });

    list = [...list];
    switch (sort) {
      case 'price-asc':
        list.sort((a, b) => priceRange(a).min - priceRange(b).min);
        break;
      case 'price-desc':
        list.sort((a, b) => priceRange(b).min - priceRange(a).min);
        break;
      case 'new':
        list.sort(
          (a, b) => Number(!!b.isNew) - Number(!!a.isNew) || b.popularity - a.popularity
        );
        break;
      case 'name':
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        list.sort((a, b) => b.popularity - a.popularity);
    }
    return list;
  }, [q, category, brand, size, sort, maxPrice]);

  const heading =
    categories.find((c) => c.id === category)?.name ??
    brands.find((b) => b.id === brand)?.name ??
    'All drinks';

  const filterPanel = (
    <div className="flex flex-col gap-7">
      <FilterGroup title="Category">
        <div className="flex flex-wrap gap-2">
          <FilterChip active={!category} onClick={() => update('category', '')}>
            All
          </FilterChip>
          {categories.map((c) => (
            <FilterChip
              key={c.id}
              active={category === c.id}
              onClick={() => update('category', category === c.id ? '' : c.id)}
            >
              <span aria-hidden>{c.emoji}</span>
              {c.name}
            </FilterChip>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Brand">
        <div className="flex flex-wrap gap-2">
          <FilterChip active={!brand} onClick={() => update('brand', '')}>
            All
          </FilterChip>
          {brands.map((b) => (
            <FilterChip
              key={b.id}
              active={brand === b.id}
              onClick={() => update('brand', brand === b.id ? '' : b.id)}
            >
              {b.name}
            </FilterChip>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Pack size">
        <div className="flex flex-wrap gap-2">
          <FilterChip active={!size} onClick={() => update('size', '')}>
            Any
          </FilterChip>
          {sizeFilters.map((s) => (
            <FilterChip
              key={s.id}
              active={size === s.id}
              onClick={() => update('size', size === s.id ? '' : s.id)}
            >
              {s.label}
            </FilterChip>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title={`Max price · ${money(maxPrice)}`}>
        <input
          type="range"
          min={40}
          max={maxCatalogPrice}
          step={10}
          value={maxPrice}
          onChange={(e) =>
            update(
              'max',
              Number(e.target.value) >= maxCatalogPrice ? '' : e.target.value
            )
          }
          className="w-full accent-gold-500"
          aria-label="Maximum price"
        />
        <div className="mt-1 flex justify-between text-[12px] font-semibold text-ink/45">
          <span>{money(40)}</span>
          <span>{money(maxCatalogPrice)}+</span>
        </div>
      </FilterGroup>

      {activeCount > 0 && (
        <button
          type="button"
          onClick={clearAll}
          className="btn btn-md btn-ghost w-full"
        >
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <>
      <div className="border-b border-forest-800/8 bg-gradient-to-b from-sand to-cream">
        <div className="container-page py-8 sm:py-10">
          <nav aria-label="Breadcrumb" className="mb-3 text-[12.5px] font-semibold text-ink/45">
            <Link to="/" className="hover:text-forest-700">
              Home
            </Link>
            <span aria-hidden className="mx-1.5">
              /
            </span>
            <span className="text-forest-800">Shop</span>
          </nav>
          <h1 className="font-display text-[clamp(1.9rem,5vw,3rem)] font-black">
            {heading}
          </h1>
          <p className="mt-2 text-[15px] text-ink/60">
            {results.length} product{results.length === 1 ? '' : 's'}
            {q && (
              <>
                {' '}
                for <b className="text-forest-800">&ldquo;{q}&rdquo;</b>
              </>
            )}
          </p>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-4 size-[18px] -translate-y-1/2 text-ink/35" />
              <input
                value={searchDraft}
                onChange={(e) => setSearchDraft(e.target.value)}
                type="search"
                placeholder="Search by flavour, brand or size…"
                aria-label="Search products"
                className="field h-12 pl-11"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                className="btn btn-md btn-ghost h-12 shrink-0 px-4 lg:hidden"
              >
                <SlidersIcon className="size-[18px]" />
                Filters
                {activeCount > 0 && (
                  <span className="grid size-5 place-items-center rounded-full bg-forest-800 text-[11px] font-bold text-gold-300">
                    {activeCount}
                  </span>
                )}
              </button>
              <label className="relative min-w-0 flex-1 sm:w-56 sm:flex-none">
                <span className="sr-only">Sort products</span>
                <select
                  value={sort}
                  onChange={(e) => update('sort', e.target.value)}
                  className="field h-12 appearance-none pr-10 font-semibold"
                >
                  {sorts.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <span
                  aria-hidden
                  className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-ink/40"
                >
                  ▾
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="container-page grid gap-8 py-8 lg:grid-cols-[250px_1fr] lg:py-10">
        <aside className="hidden lg:block">
          <div className="sticky top-28">{filterPanel}</div>
        </aside>

        <div>
          {results.length === 0 ? (
            <div className="card-surface flex flex-col items-center gap-4 px-6 py-16 text-center">
              <span className="text-5xl">🔍</span>
              <div>
                <p className="font-display text-xl font-extrabold">No drinks matched</p>
                <p className="mt-1 text-sm text-ink/60">
                  Try a different flavour, or clear the filters to see all 26 products.
                </p>
              </div>
              <button type="button" onClick={clearAll} className="btn btn-md btn-forest">
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3">
              {results.map((p, i) => (
                <ProductCard key={p.slug} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* mobile filter sheet */}
      <div
        className={`fixed inset-0 z-[75] lg:hidden ${filtersOpen ? '' : 'pointer-events-none'}`}
        aria-hidden={!filtersOpen}
      >
        <div
          onClick={() => setFiltersOpen(false)}
          className={`absolute inset-0 bg-forest-950/60 backdrop-blur-sm transition-opacity ${
            filtersOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div
          className={`absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto rounded-t-[2rem] bg-cream p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] transition-transform duration-300 ${
            filtersOpen ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-xl font-extrabold">Filters</h2>
            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              className="grid size-10 place-items-center rounded-full border border-forest-800/12"
              aria-label="Close filters"
            >
              <CloseIcon />
            </button>
          </div>
          {filterPanel}
          <button
            type="button"
            onClick={() => setFiltersOpen(false)}
            className="btn btn-lg btn-gold mt-6 w-full"
          >
            Show {results.length} product{results.length === 1 ? '' : 's'}
          </button>
        </div>
      </div>
    </>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="mb-3 text-[11px] font-bold tracking-[0.2em] text-ink/45 uppercase">
        {title}
      </h3>
      {children}
    </section>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`chip ${
        active
          ? 'border-forest-800 bg-forest-800 text-cream'
          : 'border-forest-800/15 bg-white text-forest-900 hover:border-forest-800/40'
      }`}
    >
      {children}
    </button>
  );
}
