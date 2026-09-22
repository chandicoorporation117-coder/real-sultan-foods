import { MinusIcon, PlusIcon } from './icons';

interface Props {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md';
  label?: string;
}

export default function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  size = 'md',
  label = 'Quantity',
}: Props) {
  const btn =
    size === 'sm'
      ? 'size-8 rounded-lg'
      : 'size-10 rounded-xl';
  const wrap =
    size === 'sm'
      ? 'gap-0.5 rounded-xl p-0.5'
      : 'gap-1 rounded-2xl p-1';

  return (
    <div
      className={`inline-flex items-center border border-forest-800/12 bg-sand ${wrap}`}
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className={`${btn} grid place-items-center bg-white text-forest-800 shadow-sm transition-colors hover:bg-forest-800 hover:text-cream disabled:opacity-35 disabled:hover:bg-white disabled:hover:text-forest-800`}
        aria-label="Decrease quantity"
      >
        <MinusIcon className={size === 'sm' ? 'size-4' : 'size-[18px]'} />
      </button>
      <span
        className={`min-w-8 text-center font-display font-bold tabular-nums ${
          size === 'sm' ? 'text-sm' : 'text-base'
        }`}
        aria-live="polite"
      >
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className={`${btn} grid place-items-center bg-white text-forest-800 shadow-sm transition-colors hover:bg-forest-800 hover:text-cream disabled:opacity-35 disabled:hover:bg-white disabled:hover:text-forest-800`}
        aria-label="Increase quantity"
      >
        <PlusIcon className={size === 'sm' ? 'size-4' : 'size-[18px]'} />
      </button>
    </div>
  );
}
