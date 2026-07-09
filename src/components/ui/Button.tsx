import { type ButtonHTMLAttributes, type ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  icon?: ReactNode;
}

const variantStyles = {
  primary: 'bg-primary text-white hover:bg-primary-light active:bg-primary-dark shadow-sm shadow-primary/20',
  secondary: 'bg-surface-alt dark:bg-surface-alt-dark text-text dark:text-text-dark hover:bg-border dark:hover:bg-border-dark border border-border dark:border-border-dark',
  danger: 'bg-danger text-white hover:bg-red-400 active:bg-danger-dark shadow-sm shadow-danger/20',
  ghost: 'bg-transparent text-text-secondary dark:text-text-secondary-dark hover:text-text dark:hover:text-text-dark hover:bg-surface-alt dark:hover:bg-surface-alt-dark active:bg-surface-alt dark:active:bg-surface-alt-dark',
};

const sizeStyles = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-4 py-2.5 text-sm rounded-xl',
  lg: 'px-6 py-3 text-sm rounded-xl',
};

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  icon,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
