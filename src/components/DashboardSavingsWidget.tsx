import { useNavigate } from 'react-router-dom';
import { Card } from './ui/Card';
import { LucideIcon } from './ui/LucideIcon';
import { formatCurrency } from '../lib/utils';
import { useSavings } from '../hooks/useSavings';

export function DashboardSavingsWidget() {
  const { goals, totalSavings, totalTarget } = useSavings();
  const navigate = useNavigate();

  const activeGoals = goals.filter((g) => !g.closed);
  if (activeGoals.length === 0) return null;

  const progress = totalTarget > 0 ? (totalSavings / totalTarget) * 100 : 0;

  return (
    <Card onClick={() => navigate('/savings')} className="cursor-pointer">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center">
          <LucideIcon name="ChickenBank" size={20} className="text-amber-600 dark:text-amber-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-[13px] font-semibold text-text dark:text-text-dark">Tabungan</h3>
          <p className="text-[11px] text-text-secondary dark:text-text-secondary-dark">
            {activeGoals.length} goal aktif
          </p>
        </div>
        <LucideIcon name="ChevronRight" size={18} className="text-text-secondary dark:text-text-secondary-dark" />
      </div>

      <div className="flex items-baseline gap-1.5">
        <span className="text-lg font-extrabold tabular-nums text-text dark:text-text-dark">
          {formatCurrency(totalSavings)}
        </span>
        <span className="text-[11px] font-medium text-text-secondary dark:text-text-secondary-dark">
          / {formatCurrency(totalTarget)}
        </span>
      </div>

      <div className="h-1.5 bg-border/60 dark:bg-border-dark/60 rounded-full overflow-hidden mt-2.5">
        <div
          className="h-full bg-amber-500 rounded-full transition-all duration-500"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
    </Card>
  );
}
