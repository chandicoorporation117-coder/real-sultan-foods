import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

interface Toast {
  id: number;
  text: string;
  tone: 'success' | 'error';
}

const ToastContext = createContext<{
  notify: (text: string, tone?: Toast['tone']) => void;
} | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);

  const notify = useCallback((text: string, tone: Toast['tone'] = 'success') => {
    const id = nextId.current++;
    setToasts((prev) => [...prev.slice(-2), { id, text, tone }]);
    window.setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      3200
    );
  }, []);

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-[90] flex flex-col items-center gap-2 px-4 sm:bottom-6"
        role="status"
        aria-live="polite"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`animate-pop pointer-events-auto flex max-w-sm items-center gap-2.5 rounded-full px-5 py-3 text-sm font-semibold shadow-glow ${
              t.tone === 'success'
                ? 'bg-forest-800 text-cream'
                : 'bg-red-600 text-white'
            }`}
          >
            <span aria-hidden className="text-base">
              {t.tone === 'success' ? '✓' : '!'}
            </span>
            {t.text}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
