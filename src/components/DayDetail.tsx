import { getCategoryById } from '../lib/constants';
import { formatCurrency } from '../lib/utils';
import { LucideIcon } from './ui/LucideIcon';
import type { Transaction } from '../types';

interface DayDetailProps {
  day: number;
  month: number;
  year: number;
  transactions: Transaction[];
  dayData?: { income: number; expense: number; count: number };
  onClose: () => void;
}

export function DayDetail({ day, month, year, transactions, dayData, onClose }: DayDetailProps) {
  const dateLabel = new Date(year, month - 1, day).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="animate-fade-in bg-surface dark:bg-surface-dark rounded-2xl border border-border/60 dark:border-border-dark/60 p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[13px] font-bold text-text dark:text-text-dark">{dateLabel}</p>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-surface-alt dark:hover:bg-surface-alt-dark text-text-secondary dark:text-text-secondary-dark transition-colors cursor-pointer"
        >
          <LucideIcon name="X" size={16} />
        </button>
      </div>

      {dayData && (
        <div className="flex gap-3 mb-3">
          {dayData.income > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-[11px] font-semibold text-primary tabular-nums">
                +{formatCurrency(dayData.income)}
              </span>
            </div>
          )}
          {dayData.expense > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-danger" />
              <span className="text-[11px] font-semibold text-danger tabular-nums">
                -{formatCurrency(dayData.expense)}
              </span>
            </div>
          )}
        </div>
      )}

      {transactions.length === 0 ? (
        <p className="text-[12px] text-text-secondary dark:text-text-secondary-dark text-center py-3">
          Tidak ada transaksi
        </p>
      ) : (
        <div className="space-y-2">
          {transactions.map((t) => {
            const cat = getCategoryById(t.category);
            const isIncome = t.type === 'income';

            return (
              <div key={t.id} className="flex items-center gap-2.5 py-1.5">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${cat?.color}15` }}
                >
                  <LucideIcon name={cat?.icon || 'Package'} size={14} style={{ color: cat?.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[12px] font-semibold text-text dark:text-text-dark">
                    {cat?.name || t.category}
                  </span>
                  {t.note && (
                    <span className="text-[11px] text-text-secondary dark:text-text-secondary-dark ml-1.5 truncate">
                      {t.note}
                    </span>
                  )}
                </div>
                <span className={`text-[12px] font-bold tabular-nums shrink-0 ${isIncome ? 'text-primary' : 'text-danger'}`}>
                  {isIncome ? '+' : '-'}{formatCurrency(t.amount)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
