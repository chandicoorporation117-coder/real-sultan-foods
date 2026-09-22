import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { getProduct } from '../data/catalog';
import { site } from '../data/site';
import type { CartLine, Product, Variant } from '../types';

const STORAGE_KEY = 'rsf.cart.v1';

export interface ResolvedLine extends CartLine {
  product: Product;
  variant: Variant;
  lineTotal: number;
}

interface CartApi {
  lines: CartLine[];
  items: ResolvedLine[];
  count: number;
  subtotal: number;
  delivery: number;
  total: number;
  freeDeliveryGap: number;
  isOpen: boolean;
  add: (slug: string, variantId: string, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartApi | null>(null);

const keyFor = (slug: string, variantId: string) => `${slug}::${variantId}`;

const readStored = (): CartLine[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Drop anything that no longer exists in the catalog.
    return parsed.filter(
      (l: CartLine) =>
        l &&
        typeof l.slug === 'string' &&
        typeof l.variantId === 'string' &&
        Number.isFinite(l.qty) &&
        getProduct(l.slug)?.variants.some((v) => v.id === l.variantId)
    );
  } catch {
    return [];
  }
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(readStored);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* private mode / quota — the cart just won't survive a reload */
    }
  }, [lines]);

  const add = useCallback((slug: string, variantId: string, qty = 1) => {
    setLines((prev) => {
      const key = keyFor(slug, variantId);
      const existing = prev.find((l) => l.key === key);
      if (existing) {
        return prev.map((l) =>
          l.key === key ? { ...l, qty: Math.min(99, l.qty + qty) } : l
        );
      }
      return [...prev, { key, slug, variantId, qty: Math.min(99, qty) }];
    });
    setIsOpen(true);
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => l.key !== key)
        : prev.map((l) => (l.key === key ? { ...l, qty: Math.min(99, qty) } : l))
    );
  }, []);

  const remove = useCallback((key: string) => {
    setLines((prev) => prev.filter((l) => l.key !== key));
  }, []);

  const clear = useCallback(() => setLines([]), []);
  // Stable identities: consumers use these in effect dependency lists.
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const items = useMemo<ResolvedLine[]>(() => {
    return lines.flatMap((line) => {
      const product = getProduct(line.slug);
      const variant = product?.variants.find((v) => v.id === line.variantId);
      if (!product || !variant) return [];
      return [{ ...line, product, variant, lineTotal: variant.price * line.qty }];
    });
  }, [lines]);

  const subtotal = items.reduce((sum, l) => sum + l.lineTotal, 0);
  const delivery =
    subtotal === 0 || subtotal >= site.freeDeliveryThreshold ? 0 : site.deliveryFee;

  const value: CartApi = {
    lines,
    items,
    count: items.reduce((sum, l) => sum + l.qty, 0),
    subtotal,
    delivery,
    total: subtotal + delivery,
    freeDeliveryGap: Math.max(0, site.freeDeliveryThreshold - subtotal),
    isOpen,
    add,
    setQty,
    remove,
    clear,
    openCart,
    closeCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
