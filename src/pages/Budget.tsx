import { useState, useMemo } from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { BudgetCard } from '../components/BudgetCard';
import { BudgetForm } from '../components/BudgetForm';
import { SpendingAlerts } from '../components/SpendingAlerts';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Modal } from '../components/ui/Modal';

import { LucideIcon } from '../components/ui/LucideIcon';
import { useBudget } from '../hooks/useBudget';
import { useTransactions } from '../hooks/useTransactions';
import { getCurrentMonth, getCurrentYear, getMonthName, formatCurrency, formatDate } from '../lib/utils';
import { getCategoryById } from '../lib/constants';
import type { Budget } from '../types';

export function Budget() {
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [selectedYear, setSelectedYear] = useState(getCurrentYear());
  const { transactions, loading: transactionsLoading } = useTransactions();
  const { budgets, loading: budgetsLoading, addBudget, updateBudget, deleteBudget } = useBudget(
    selectedMonth,
    selectedYear
  );

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [showBalance, setShowBalance] = useState(true);

  const loading = transactionsLoading || budgetsLoading;

  const spendingByCategory = useMemo(() => {
    const spending: Record<string, number> = {};
    transactions
      .filter((t) => {
        if (t.type !== 'expense') return false;
        const date = new Date(t.date);
        return (
          date.getMonth() + 1 === selectedMonth &&
          date.getFullYear() === selectedYear
        );
      })
      .forEach((t) => {
        spending[t.category] = (spending[t.category] || 0) + t.amount;
      });
    return spending;
  }, [transactions, selectedMonth, selectedYear]);

  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);

  const monthlyIncome = transactions
    .filter((t) => {
      if (t.type !== 'income') return false;
      const date = new Date(t.date);
      return (
        date.getMonth() + 1 === selectedMonth &&
        date.getFullYear() === selectedYear
      );
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const budgetDiff = monthlyIncome - totalBudget;

  const transactionsForBudget = useMemo(() => {
    if (!selectedBudget) return [];
    return transactions.filter((t) => {
      if (t.type !== 'expense' || t.category !== selectedBudget.category) return false;
      const date = new Date(t.date);
      return (
        date.getMonth() + 1 === selectedMonth &&
        date.getFullYear() === selectedYear
      );
    });
  }, [transactions, selectedBudget, selectedMonth, selectedYear]);

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setDeletingId(id);
  };

  const handleConfirmDelete = async () => {
    if (deletingId !== null) {
      await deleteBudget(deletingId);
      setDeletingId(null);
    }
  };

  const handleSave = async (
    data: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    if (editingBudget?.id) {
      await updateBudget(editingBudget.id, data);
    } else {
      await addBudget(data);
    }
    setEditingBudget(null);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingBudget(null);
  };

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = [getCurrentYear() - 1, getCurrentYear()];

  const fmt = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  });

  return (
    <PageLayout title="Budget">
      <div className="space-y-5">
        {/* Month/Year Filter */}
        <div className="flex gap-2">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="flex-1 px-3 py-2.5 bg-surface-alt dark:bg-surface-alt-dark rounded-xl text-[13px] font-medium text-text dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/30 border border-border dark:border-border-dark"
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
            className="w-24 px-3 py-2.5 bg-surface-alt dark:bg-surface-alt-dark rounded-xl text-[13px] font-medium text-text dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/30 border border-border dark:border-border-dark"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* Summary */}
        {budgets.length > 0 && (
          <>
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-semibold text-text dark:text-text-dark">
                Ringkasan
              </p>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="p-2 -mr-2 rounded-xl hover:bg-surface-alt dark:hover:bg-surface-alt-dark text-text-secondary dark:text-text-secondary-dark transition-colors cursor-pointer"
                aria-label={showBalance ? 'Sembunyikan saldo' : 'Tampilkan saldo'}
              >
                <LucideIcon name={showBalance ? 'Eye' : 'EyeOff'} size={16} />
              </button>
            </div>
            <div className="flex gap-3">
            <div className="flex-1 p-4 bg-surface dark:bg-surface-dark rounded-2xl border border-border/60 dark:border-border-dark/60">
              <p className="text-[11px] font-medium text-text-secondary dark:text-text-secondary-dark">
                Total Budget
              </p>
              <p className="text-lg font-bold text-text dark:text-text-dark tabular-nums mt-1">
                {showBalance ? fmt.format(totalBudget) : 'Rp ••••••'}
              </p>
            </div>
            <div className="flex-1 p-4 bg-surface dark:bg-surface-dark rounded-2xl border border-border/60 dark:border-border-dark/60">
              <p className="text-[11px] font-medium text-text-secondary dark:text-text-secondary-dark">
                Selisih Budget
              </p>
              <p
                className={`text-lg font-bold tabular-nums mt-1 ${
                  showBalance && budgetDiff >= 0 ? 'text-primary' : 'text-danger'
                }`}
              >
                {showBalance ? fmt.format(budgetDiff) : 'Rp ••••••'}
              </p>
              <p className="text-[10px] font-medium text-text-secondary dark:text-text-secondary-dark mt-0.5">
                Pemasukan − Budget
              </p>
            </div>
          </div>
          </>
        )}

        {/* Spending Alerts */}
        <SpendingAlerts month={selectedMonth} year={selectedYear} />

        {/* Budget List */}
        {loading ? (
          <LoadingSpinner />
        ) : budgets.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-surface-alt dark:bg-surface-alt-dark flex items-center justify-center mx-auto mb-3">
              <LucideIcon name="PieChart" size={28} className="text-text-secondary dark:text-text-secondary-dark" />
            </div>
            <p className="font-semibold text-text dark:text-text-dark text-[14px]">Belum ada budget</p>
            <p className="text-[12px] text-text-secondary dark:text-text-secondary-dark mt-1">Atur budget per kategori</p>
          </div>
        ) : (
          <div className="space-y-3">
            {budgets.map((budget) => (
              <BudgetCard
                key={budget.id}
                budget={budget}
                spent={spendingByCategory[budget.category] || 0}
                onClick={() => setSelectedBudget(budget)}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        )}

        {/* FAB */}
        <button
          onClick={() => setIsFormOpen(true)}
          className="fixed bottom-20 right-4 w-14 h-14 bg-primary hover:bg-primary-light text-white rounded-2xl shadow-lg shadow-primary/30 flex items-center justify-center transition-all duration-200 cursor-pointer z-30 active:scale-95"
        >
          <LucideIcon name="Plus" size={24} className="text-white" />
        </button>

        {/* Form Modal */}
        <BudgetForm
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          onSave={handleSave}
          initialData={editingBudget}
          month={selectedMonth}
          year={selectedYear}
        />

        {/* Confirm Dialog */}
        <ConfirmDialog
          isOpen={deletingId !== null}
          onClose={() => setDeletingId(null)}
          onConfirm={handleConfirmDelete}
          title="Hapus Budget"
          message="Apakah kamu yakin ingin menghapus budget ini?"
        />

        {/* Detail Modal */}
        <Modal
          isOpen={selectedBudget !== null}
          onClose={() => setSelectedBudget(null)}
          title={selectedBudget ? getCategoryById(selectedBudget.category)?.name || selectedBudget.category : ''}
        >
          {selectedBudget && (
            <div className="space-y-3">
              {transactionsForBudget.length === 0 ? (
                <p className="text-[13px] text-text-secondary dark:text-text-secondary-dark text-center py-6">
                  Belum ada transaksi di kategori ini
                </p>
              ) : (
                <>
                  {transactionsForBudget.map((t) => (
                    <div key={t.id} className="flex items-center justify-between py-2.5 border-b border-border/50 dark:border-border-dark/50 last:border-0">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: `${getCategoryById(t.category)?.color}15` }}
                          >
                            <LucideIcon name={getCategoryById(t.category)?.icon || 'Package'} size={14} className="text-current" style={{ color: getCategoryById(t.category)?.color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-medium text-text dark:text-text-dark truncate">
                              {t.note || getCategoryById(t.category)?.name || t.category}
                            </p>
                            <p className="text-[11px] text-text-secondary dark:text-text-secondary-dark">
                              {formatDate(t.date)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <span className="text-[13px] font-bold text-danger ml-3 tabular-nums">
                        -{formatCurrency(t.amount)}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-2 border-t border-border dark:border-border-dark">
                    <span className="text-[13px] font-medium text-text-secondary dark:text-text-secondary-dark">
                      Total ({transactionsForBudget.length} transaksi)
                    </span>
                    <span className="text-[14px] font-bold text-danger tabular-nums">
                      {formatCurrency(transactionsForBudget.reduce((sum, t) => sum + t.amount, 0))}
                    </span>
                  </div>
                </>
              )}
            </div>
          )}
        </Modal>
      </div>
    </PageLayout>
  );
}
