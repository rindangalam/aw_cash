import { useState, useMemo } from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { TransactionList } from '../components/TransactionList';
import { TransactionForm } from '../components/TransactionForm';
import { CalendarGrid } from '../components/CalendarGrid';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { LucideIcon } from '../components/ui/LucideIcon';
import { useTransactions } from '../hooks/useTransactions';
import { getCurrentMonth, getCurrentYear, getMonthName } from '../lib/utils';
import type { Transaction } from '../types';

type FilterType = 'all' | 'income' | 'expense';
type ViewMode = 'list' | 'calendar';

export function Transactions() {
  const { transactions, loading, addTransaction, updateTransaction, deleteTransaction } =
    useTransactions();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [selectedYear, setSelectedYear] = useState(getCurrentYear());
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const date = new Date(t.date);
      const tMonth = date.getMonth() + 1;
      const tYear = date.getFullYear();

      const matchType = filterType === 'all' || t.type === filterType;
      const matchMonth = tMonth === selectedMonth && tYear === selectedYear;
      const matchSearch =
        !searchQuery ||
        t.note?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchType && matchMonth && matchSearch;
    });
  }, [transactions, filterType, selectedMonth, selectedYear, searchQuery]);

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setDeletingId(id);
  };

  const handleConfirmDelete = async () => {
    if (deletingId !== null) {
      await deleteTransaction(deletingId);
      setDeletingId(null);
    }
  };

  const handleSave = async (data: Omit<Transaction, 'id' | 'createdAt'>) => {
    if (editingTransaction?.id) {
      await updateTransaction(editingTransaction.id, data);
    } else {
      await addTransaction(data);
    }
    setEditingTransaction(null);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTransaction(null);
  };

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = [getCurrentYear() - 1, getCurrentYear()];

  return (
    <PageLayout title="Transaksi">
      <div className="space-y-4">
        {/* View Mode Toggle + Month/Year */}
        <div className="flex gap-2">
          <div className="flex gap-1 p-1 bg-surface-alt dark:bg-surface-alt-dark rounded-xl">
            {([
              { value: 'list' as const, icon: 'FileText' },
              { value: 'calendar' as const, icon: 'Calendar' },
            ]).map((v) => (
              <button
                key={v.value}
                onClick={() => setViewMode(v.value)}
                className={`p-2 rounded-lg transition-all duration-200 cursor-pointer ${
                  viewMode === v.value
                    ? 'bg-primary text-white shadow-sm shadow-primary/20'
                    : 'text-text-secondary dark:text-text-secondary-dark hover:text-text dark:hover:text-text-dark'
                }`}
              >
                <LucideIcon name={v.icon} size={16} />
              </button>
            ))}
          </div>

          <div className="flex gap-2 flex-1">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="flex-1 px-3 py-2 bg-surface-alt dark:bg-surface-alt-dark rounded-xl text-[13px] font-medium text-text dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/30 border border-border dark:border-border-dark"
            >
              {months.map((m) => (
                <option key={m} value={m}>
                  {getMonthName(m)}
                </option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-20 px-3 py-2 bg-surface-alt dark:bg-surface-alt-dark rounded-xl text-[13px] font-medium text-text dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/30 border border-border dark:border-border-dark"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* List View */}
        {viewMode === 'list' && (
          <>
            {/* Search */}
            <div className="relative">
              <LucideIcon name="Search" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary dark:text-text-secondary-dark" />
              <input
                type="text"
                placeholder="Cari catatan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-surface-alt dark:bg-surface-alt-dark rounded-xl text-[13px] text-text dark:text-text-dark placeholder:text-text-secondary dark:placeholder:text-text-secondary-dark focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-surface dark:focus:bg-surface-dark transition-all border border-transparent focus:border-primary/30"
              />
            </div>

            {/* Filter Type */}
            <div className="flex gap-2 p-1 bg-surface-alt dark:bg-surface-alt-dark rounded-xl">
              {(['all', 'income', 'expense'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`flex-1 py-2 rounded-lg text-[12px] font-semibold transition-all duration-200 cursor-pointer ${
                    filterType === t
                      ? 'bg-primary text-white shadow-sm shadow-primary/20'
                      : 'text-text-secondary dark:text-text-secondary-dark hover:text-text dark:hover:text-text-dark'
                  }`}
                >
                  {t === 'all' ? 'Semua' : t === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                </button>
              ))}
            </div>

            {/* Transaction List */}
            {loading ? (
              <LoadingSpinner />
            ) : (
              <TransactionList
                transactions={filteredTransactions}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
              />
            )}
          </>
        )}

        {/* Calendar View */}
        {viewMode === 'calendar' && (
          <CalendarGrid month={selectedMonth} year={selectedYear} />
        )}

        {/* FAB */}
        <button
          onClick={() => setIsFormOpen(true)}
          className="fixed bottom-20 right-4 w-14 h-14 bg-primary hover:bg-primary-light text-white rounded-2xl shadow-lg shadow-primary/30 flex items-center justify-center transition-all duration-200 cursor-pointer z-30 active:scale-95"
        >
          <LucideIcon name="Plus" size={24} className="text-white" />
        </button>

        {/* Form Modal */}
        <TransactionForm
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          onSave={handleSave}
          initialData={editingTransaction}
        />

        {/* Confirm Dialog */}
        <ConfirmDialog
          isOpen={deletingId !== null}
          onClose={() => setDeletingId(null)}
          onConfirm={handleConfirmDelete}
          title="Hapus Transaksi"
          message="Apakah kamu yakin ingin menghapus transaksi ini? Tindakan ini tidak dapat dibatalkan."
        />
      </div>
    </PageLayout>
  );
}
