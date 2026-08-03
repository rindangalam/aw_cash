import { Card } from './ui/Card';
import { LucideIcon } from './ui/LucideIcon';
import { Badge } from './ui/Badge';
import { formatCurrency } from '../lib/utils';
import type { SavingsGoal } from '../types';

interface SavingsGoalCardProps {
  goal: SavingsGoal;
  onClick: () => void;
  onEdit: () => void;
  onTogglePin: () => void;
  onDelete: () => void;
}

export function SavingsGoalCard({ goal, onClick, onEdit, onTogglePin, onDelete }: SavingsGoalCardProps) {
  const progress = goal.targetAmount > 0
    ? Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)
    : 0;

  const daysLeft = goal.deadline
    ? Math.max(0, Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  return (
    <Card onClick={onClick} className={goal.closed ? 'opacity-60' : ''}>
      <div className="flex items-start gap-3.5">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${goal.color}15` }}
        >
          <LucideIcon name={goal.icon} size={22} className="opacity-90" style={{ color: goal.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-[13px] font-bold text-text dark:text-text-dark truncate">
              {goal.name}
            </h3>
            {goal.closed && <Badge variant="success">Selesai</Badge>}
          </div>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-sm font-extrabold tabular-nums text-text dark:text-text-dark">
              {formatCurrency(goal.currentAmount)}
            </span>
            <span className="text-[11px] font-medium text-text-secondary dark:text-text-secondary-dark">
              / {formatCurrency(goal.targetAmount)}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <div className="flex gap-0.5">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(); }}
              className="p-2 rounded-xl hover:bg-surface-alt dark:hover:bg-surface-alt-dark text-text-secondary dark:text-text-secondary-dark transition-colors cursor-pointer"
            >
              <LucideIcon name="Pencil" size={14} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onTogglePin(); }}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                goal.pinned
                  ? 'text-amber-500 bg-amber-500/10'
                  : 'text-text-secondary dark:text-text-secondary-dark hover:bg-surface-alt dark:hover:bg-surface-alt-dark'
              }`}
            >
              <LucideIcon name="Pin" size={14} className="rotate-45" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="p-2 rounded-xl text-text-secondary dark:text-text-secondary-dark hover:bg-danger/10 hover:text-danger transition-colors cursor-pointer"
            >
              <LucideIcon name="Trash2" size={14} />
            </button>
          </div>
          {daysLeft !== null && !goal.closed && (
            <p className="text-[11px] font-semibold text-text-secondary dark:text-text-secondary-dark">
              {daysLeft} hari
            </p>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-3">
        <div className="h-2 bg-border/60 dark:bg-border-dark/60 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              backgroundColor: goal.color,
            }}
          />
        </div>
        <p className="text-[11px] font-semibold text-text-secondary dark:text-text-secondary-dark mt-1.5 text-right tabular-nums">
          {progress.toFixed(0)}%
        </p>
      </div>
    </Card>
  );
}
