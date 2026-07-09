import { useMemo } from 'react';
import { LucideIcon } from './ui/LucideIcon';
import { useTransactions } from '../hooks/useTransactions';
import { useBudget } from '../hooks/useBudget';
import { getCategoryById } from '../lib/constants';
import { formatCurrency, getCurrentMonth, getCurrentYear } from '../lib/utils';

interface Alert {
  category: string;
  name: string;
  icon: string;
  color: string;
  spent: number;
  budget: number;
  percentage: number;
  level: 'warning' | 'danger' | 'over';
}

interface SpendingAlertsProps {
  month?: number;
  year?: number;
  limit?: number;
}

export function SpendingAlerts({ month, year, limit }: SpendingAlertsProps) {
  const m = month || getCurrentMonth();
  const y = year || getCurrentYear();
  const { transactions } = useTransactions();
  const { budgets } = useBudget(m, y);

  const spendingByCategory = useMemo(() => {
    const spending: Record<string, number> = {};
    transactions
      .filter((t) => {
        if (t.type !== 'expense') return false;
        const date = new Date(t.date);
        return date.getMonth() + 1 === m && date.getFullYear() === y;
      })
      .forEach((t) => {
        spending[t.category] = (spending[t.category] || 0) + t.amount;
      });
    return spending;
  }, [transactions, m, y]);

  const alerts = useMemo((): Alert[] => {
    return budgets
      .map((b) => {
        const spent = spendingByCategory[b.category] || 0;
        const percentage = Math.round((spent / b.amount) * 100);
        const cat = getCategoryById(b.category);

        let level: Alert['level'] = 'warning';
        if (percentage >= 100) level = 'over';
        else if (percentage >= 90) level = 'danger';

        return {
          category: b.category,
          name: cat?.name || b.category,
          icon: cat?.icon || 'Package',
          color: cat?.color || '#78716C',
          spent,
          budget: b.amount,
          percentage,
          level,
        };
      })
      .filter((a) => a.percentage >= 75)
      .sort((a, b) => b.percentage - a.percentage);
  }, [budgets, spendingByCategory]);

  if (alerts.length === 0) return null;

  const shown = limit ? alerts.slice(0, limit) : alerts;
  const overCount = alerts.filter((a) => a.level === 'over').length;

  const levelBg = {
    warning: 'bg-warning/5 border-warning/20',
    danger: 'bg-danger/5 border-danger/20',
    over: 'bg-danger/5 border-danger/20',
  };

  const levelText = {
    warning: 'text-warning',
    danger: 'text-danger',
    over: 'text-danger',
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-warning/10 flex items-center justify-center">
          <LucideIcon name="CircleAlert" size={15} className="text-warning" />
        </div>
        <span className="text-[13px] font-semibold text-text dark:text-text-dark">
          {shown.length} kategori mendekati batas
        </span>
        {overCount > 0 && (
          <span className="px-1.5 py-0.5 text-[10px] font-bold bg-danger/10 text-danger rounded-full">
            {overCount} over
          </span>
        )}
      </div>

      {shown.map((alert) => (
        <div
          key={alert.category}
          className={`flex items-center gap-3 p-3.5 rounded-xl border ${levelBg[alert.level]}`}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${alert.color}15` }}
          >
            <LucideIcon name={alert.icon} size={18} style={{ color: alert.color }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold text-text dark:text-text-dark truncate">
                {alert.name}
              </span>
              <span className={`text-[13px] font-bold tabular-nums ${levelText[alert.level]}`}>
                {alert.percentage}%
              </span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-[11px] text-text-secondary dark:text-text-secondary-dark font-medium">
                {formatCurrency(alert.spent)} / {formatCurrency(alert.budget)}
              </span>
              {alert.level === 'over' ? (
                <span className="text-[11px] font-semibold text-danger">
                  Lebih {formatCurrency(alert.spent - alert.budget)}
                </span>
              ) : (
                <span className="text-[11px] text-text-secondary dark:text-text-secondary-dark font-medium">
                  Sisa {formatCurrency(alert.budget - alert.spent)}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
