import { getCategoryById } from '../lib/constants';
import { formatCurrency, formatDate } from '../lib/utils';
import { LucideIcon } from './ui/LucideIcon';
import type { Transaction } from '../types';

interface TransactionItemProps {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: number) => void;
}

export function TransactionItem({
  transaction,
  onEdit,
  onDelete,
}: TransactionItemProps) {
  const category = getCategoryById(transaction.category);
  const isIncome = transaction.type === 'income';

  return (
    <div className="flex items-center gap-3 p-3.5 bg-surface dark:bg-surface-dark rounded-2xl border border-border/60 dark:border-border-dark/60 active:scale-[0.98] transition-transform">
      {/* Category Icon */}
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${category?.color}15` }}
      >
        <LucideIcon name={category?.icon || 'Package'} size={20} className="opacity-80" style={{ color: category?.color }} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="font-semibold text-[13px] text-text dark:text-text-dark truncate">
            {category?.name || transaction.category}
          </span>
          <span
            className={`font-bold text-[13px] tabular-nums shrink-0 ${
              isIncome ? 'text-primary' : 'text-danger'
            }`}
          >
            {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
          </span>
        </div>
        <div className="flex items-center justify-between mt-0.5">
          <span className="text-[11px] text-text-secondary dark:text-text-secondary-dark truncate">
            {transaction.note || '\u00A0'}
          </span>
          <span className="text-[11px] text-text-secondary dark:text-text-secondary-dark shrink-0">
            {formatDate(transaction.date)}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-0.5 shrink-0">
        <button
          onClick={() => onEdit(transaction)}
          className="p-2 rounded-xl hover:bg-surface-alt dark:hover:bg-surface-alt-dark text-text-secondary dark:text-text-secondary-dark transition-colors cursor-pointer"
        >
          <LucideIcon name="Pencil" size={15} />
        </button>
        <button
          onClick={() => transaction.id && onDelete(transaction.id)}
          className="p-2 rounded-xl hover:bg-danger/10 text-text-secondary dark:text-text-secondary-dark hover:text-danger transition-colors cursor-pointer"
        >
          <LucideIcon name="Trash2" size={15} />
        </button>
      </div>
    </div>
  );
}
