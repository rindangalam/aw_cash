import { Card } from './ui/Card';
import { LucideIcon } from './ui/LucideIcon';
import { formatCurrency } from '../lib/utils';

interface SummaryCardProps {
  title: string;
  amount: number;
  icon: string;
  variant?: 'default' | 'income' | 'expense';
}

const variantConfig = {
  default: { iconColor: 'text-text-secondary dark:text-text-secondary-dark', bg: 'bg-surface-alt dark:bg-surface-alt-dark' },
  income: { iconColor: 'text-primary', bg: 'bg-primary/10' },
  expense: { iconColor: 'text-danger', bg: 'bg-danger/10' },
};

const amountColor = {
  default: 'text-text dark:text-text-dark',
  income: 'text-primary',
  expense: 'text-danger',
};

export function SummaryCard({ title, amount, icon, variant = 'default' }: SummaryCardProps) {
  const config = variantConfig[variant];
  return (
    <Card className="flex-1 min-w-[140px]">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${config.bg}`}>
          <LucideIcon name={icon} size={20} className={config.iconColor} />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-medium text-text-secondary dark:text-text-secondary-dark truncate">{title}</p>
          <p className={`text-base font-bold tracking-tight tabular-nums ${amountColor[variant]}`}>
            {formatCurrency(amount)}
          </p>
        </div>
      </div>
    </Card>
  );
}
