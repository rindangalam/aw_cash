import { Card } from './ui/Card';
import { LucideIcon } from './ui/LucideIcon';
import { getCategoryById } from '../lib/constants';
import { formatCurrency } from '../lib/utils';
import type { Budget } from '../types';

interface BudgetCardProps {
  budget: Budget;
  spent: number;
  onClick?: () => void;
  onEdit: (budget: Budget) => void;
  onDelete: (id: number) => void;
}

export function BudgetCard({ budget, spent, onClick, onEdit, onDelete }: BudgetCardProps) {
  const percentage = Math.min((spent / budget.amount) * 100, 100);
  const isOver = spent > budget.amount;

  let barColor = 'bg-primary';
  let textColor = 'text-primary';
  let accent: 'sky' | 'red' | 'amber' = 'sky';
  if (isOver) {
    barColor = 'bg-danger';
    textColor = 'text-danger';
    accent = 'red';
  } else if (percentage >= 75) {
    barColor = 'bg-warning';
    textColor = 'text-warning';
    accent = 'amber';
  }

  return (
    <Card accent={accent} onClick={onClick}>
      <div className="flex items-center justify-between mb-2.5">
        <span className="font-semibold text-[13px] text-text dark:text-text-dark">
          {getCategoryById(budget.category)?.name || budget.category}
        </span>
        <div className="flex gap-0.5">
          <button
            onClick={() => onEdit(budget)}
            className="p-2 rounded-xl hover:bg-surface-alt dark:hover:bg-surface-alt-dark text-text-secondary dark:text-text-secondary-dark transition-colors cursor-pointer"
          >
            <LucideIcon name="Pencil" size={14} />
          </button>
          <button
            onClick={() => budget.id && onDelete(budget.id)}
            className="p-2 rounded-xl hover:bg-danger/10 text-text-secondary dark:text-text-secondary-dark hover:text-danger transition-colors cursor-pointer"
          >
            <LucideIcon name="Trash2" size={14} />
          </button>
        </div>
      </div>

      <div className="flex items-baseline gap-2 mb-3">
        <span className={`text-lg font-bold tabular-nums ${textColor}`}>
          {formatCurrency(spent)}
        </span>
        <span className="text-[12px] font-medium text-text-secondary dark:text-text-secondary-dark">
          / {formatCurrency(budget.amount)}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2.5 bg-surface-alt dark:bg-surface-alt-dark rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex justify-between mt-1.5">
        <span className="text-[11px] font-medium text-text-secondary dark:text-text-secondary-dark">
          {Math.round(percentage)}% terpakai
        </span>
        {isOver && (
          <span className="text-[11px] font-semibold text-danger">
            Melebihi budget!
          </span>
        )}
      </div>
    </Card>
  );
}
