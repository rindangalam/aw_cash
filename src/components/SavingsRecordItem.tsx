import { LucideIcon } from './ui/LucideIcon';
import { formatCurrency, formatDate } from '../lib/utils';
import type { SavingsRecord } from '../types';

interface SavingsRecordItemProps {
  record: SavingsRecord;
  onDelete?: (record: SavingsRecord) => void;
}

export function SavingsRecordItem({ record, onDelete }: SavingsRecordItemProps) {
  const isSetor = record.type === 'setor';

  return (
    <div className="flex items-center gap-3 py-3 border-b border-border/40 dark:border-border-dark/40 last:border-0">
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
        style={{
          backgroundColor: isSetor ? 'rgba(14,165,233,0.1)' : 'rgba(220,38,38,0.1)',
        }}
      >
        <LucideIcon
          name={isSetor ? 'ArrowDownLeft' : 'ArrowUpRight'}
          size={18}
          style={{ color: isSetor ? '#0EA5E9' : '#DC2626' }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className={`text-[13px] font-bold tabular-nums ${isSetor ? 'text-primary' : 'text-danger'}`}>
            {isSetor ? '+' : '-'}{formatCurrency(record.amount)}
          </span>
        </div>
        {record.note && (
          <p className="text-[11px] text-text-secondary dark:text-text-secondary-dark mt-0.5 truncate">
            {record.note}
          </p>
        )}
      </div>
      <div className="text-right shrink-0">
        <p className="text-[11px] font-medium text-text-secondary dark:text-text-secondary-dark">
          {formatDate(record.date)}
        </p>
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(record);
            }}
            className="text-[11px] font-medium text-danger/70 hover:text-danger transition-colors cursor-pointer mt-0.5"
          >
            Hapus
          </button>
        )}
      </div>
    </div>
  );
}
