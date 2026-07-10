import { type InputHTMLAttributes, type ChangeEvent, forwardRef } from 'react';
import { formatCurrencyInput, parseCurrencyInput } from '../../lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  currency?: boolean;
  onCurrencyChange?: (rawValue: string) => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', currency, onCurrencyChange, onChange, value, ...props }, ref) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (currency) {
        const raw = parseCurrencyInput(e.target.value);
        const formatted = formatCurrencyInput(raw);
        e.target.value = formatted;
        onCurrencyChange?.(raw);
      }
      onChange?.(e);
    };

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-[13px] font-semibold text-text dark:text-text-dark">
            {label}
          </label>
        )}
        <input
          ref={ref}
          type={currency ? 'text' : props.type}
          inputMode={currency ? 'numeric' : undefined}
          value={currency && typeof value === 'string' ? formatCurrencyInput(value.replace(/\D/g, '')) : value}
          onChange={handleChange}
          className={`px-3.5 py-2.5 border rounded-xl bg-surface dark:bg-surface-dark text-text text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all placeholder:text-text-secondary dark:placeholder:text-text-secondary-dark dark:text-text-dark ${
            error
              ? 'border-danger focus:ring-danger/30'
              : 'border-border dark:border-border-dark'
          } ${className}`}
          {...props}
        />
        {error && (
          <span className="text-[11px] font-medium text-danger">{error}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
