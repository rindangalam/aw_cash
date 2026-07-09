import { TransactionItem } from './TransactionItem';
import { LucideIcon } from './ui/LucideIcon';
import type { Transaction } from '../types';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: number) => void;
}

export function TransactionList({
  transactions,
  onEdit,
  onDelete,
}: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 rounded-2xl bg-surface-alt dark:bg-surface-alt-dark flex items-center justify-center mx-auto mb-3">
          <LucideIcon name="Receipt" size={28} className="text-text-secondary dark:text-text-secondary-dark" />
        </div>
        <p className="font-semibold text-text dark:text-text-dark text-[14px]">Belum ada transaksi</p>
        <p className="text-[12px] text-text-secondary dark:text-text-secondary-dark mt-1">Tambah transaksi pertamamu</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {transactions.map((t, i) => (
        <div key={t.id} className="animate-fade-in" style={{ animationDelay: `${Math.min(i * 30, 150)}ms` }}>
          <TransactionItem
            transaction={t}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      ))}
    </div>
  );
}
