interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger';
  children: React.ReactNode;
  className?: string;
}

const variantStyles = {
  default: 'bg-surface-alt dark:bg-surface-alt-dark text-text-secondary dark:text-text-secondary-dark',
  success: 'bg-primary/10 text-primary',
  warning: 'bg-warning/10 text-warning',
  danger: 'bg-danger/10 text-danger',
};

export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded-full ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}
