import { type InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-[13px] font-semibold text-text dark:text-text-dark">
            {label}
          </label>
        )}
        <input
          ref={ref}
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
