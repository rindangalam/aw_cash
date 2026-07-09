import { useState, useMemo } from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { Card } from '../components/ui/Card';
import { LucideIcon } from '../components/ui/LucideIcon';
import { useTransactions } from '../hooks/useTransactions';
import { getCategoryById } from '../lib/constants';
import { getCurrentMonth, getCurrentYear, getMonthName } from '../lib/utils';
import type { Transaction } from '../types';

type PeriodType = 'weekly' | 'monthly' | 'yearly';

interface CategoryBreakdown {
  category: string;
  name: string;
  icon: string;
  color: string;
  count: number;
  total: number;
}

function getDateRange(
  period: PeriodType,
  month: number,
  year: number
): { start: Date; end: Date } {
  const now = new Date();
  let start: Date;
  let end: Date;

  switch (period) {
    case 'weekly': {
      const dayOfWeek = now.getDay();
      const monday = new Date(now);
      monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));
      start = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate());
      end = new Date(start);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      break;
    }
    case 'monthly': {
      start = new Date(year, month - 1, 1);
      end = new Date(year, month, 0, 23, 59, 59, 999);
      break;
    }
    case 'yearly': {
      start = new Date(year, 0, 1);
      end = new Date(year, 11, 31, 23, 59, 59, 999);
      break;
    }
  }

  return { start, end };
}

function filterByPeriod(
  transactions: Transaction[],
  period: PeriodType,
  month: number,
  year: number
): Transaction[] {
  const { start, end } = getDateRange(period, month, year);
  return transactions.filter((t) => {
    const date = new Date(t.date);
    return date >= start && date <= end;
  });
}

function exportToCSV(data: Transaction[]) {
  const headers = ['Tanggal', 'Tipe', 'Kategori', 'Nominal', 'Catatan'];
  const rows = data.map((t) => {
    const cat = getCategoryById(t.category);
    return [
      t.date,
      t.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
      cat?.name || t.category,
      t.amount,
      t.note || '',
    ];
  });

  const csvContent =
    '\uFEFF' +
    [headers, ...rows].map((row) => row.join(',')).join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `laporan-aw-cash-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

const fmt = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0,
});

export function Reports() {
  const { transactions } = useTransactions();
  const [period, setPeriod] = useState<PeriodType>('monthly');
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [selectedYear, setSelectedYear] = useState(getCurrentYear());

  const filteredTransactions = useMemo(
    () => filterByPeriod(transactions, period, selectedMonth, selectedYear),
    [transactions, period, selectedMonth, selectedYear]
  );

  const summary = useMemo(() => {
    let income = 0;
    let expense = 0;
    filteredTransactions.forEach((t) => {
      if (t.type === 'income') income += t.amount;
      else expense += t.amount;
    });
    return { income, expense, balance: income - expense };
  }, [filteredTransactions]);

  const expenseBreakdown = useMemo((): CategoryBreakdown[] => {
    const breakdown: Record<string, { count: number; total: number }> = {};
    filteredTransactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        if (!breakdown[t.category]) {
          breakdown[t.category] = { count: 0, total: 0 };
        }
        breakdown[t.category].count += 1;
        breakdown[t.category].total += t.amount;
      });

    return Object.entries(breakdown)
      .map(([cat, data]) => {
        const category = getCategoryById(cat);
        return {
          category: cat,
          name: category?.name || cat,
          icon: category?.icon || 'Package',
          color: category?.color || '#78716C',
          ...data,
        };
      })
      .sort((a, b) => b.total - a.total);
  }, [filteredTransactions]);

  const incomeBreakdown = useMemo((): CategoryBreakdown[] => {
    const breakdown: Record<string, { count: number; total: number }> = {};
    filteredTransactions
      .filter((t) => t.type === 'income')
      .forEach((t) => {
        if (!breakdown[t.category]) {
          breakdown[t.category] = { count: 0, total: 0 };
        }
        breakdown[t.category].count += 1;
        breakdown[t.category].total += t.amount;
      });

    return Object.entries(breakdown)
      .map(([cat, data]) => {
        const category = getCategoryById(cat);
        return {
          category: cat,
          name: category?.name || cat,
          icon: category?.icon || 'Package',
          color: category?.color || '#78716C',
          ...data,
        };
      })
      .sort((a, b) => b.total - a.total);
  }, [filteredTransactions]);

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = [getCurrentYear() - 1, getCurrentYear()];

  return (
    <PageLayout title="Laporan">
      <div className="space-y-5">
        {/* Period Filter */}
        <div className="flex gap-2 p-1 bg-surface-alt dark:bg-surface-alt-dark rounded-xl">
          {([
            { value: 'weekly', label: 'Mingguan' },
            { value: 'monthly', label: 'Bulanan' },
            { value: 'yearly', label: 'Tahunan' },
          ] as const).map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`flex-1 py-2.5 rounded-lg text-[12px] font-semibold transition-all duration-200 cursor-pointer ${
                period === p.value
                  ? 'bg-primary text-white shadow-sm shadow-primary/20'
                  : 'text-text-secondary dark:text-text-secondary-dark hover:text-text dark:hover:text-text-dark'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Date Selector */}
        {period === 'weekly' && (
          <div className="flex items-center justify-center gap-2 py-2 text-[13px] font-medium text-text-secondary dark:text-text-secondary-dark">
            <LucideIcon name="Calendar" size={16} />
            Minggu ini
          </div>
        )}
        {period === 'monthly' && (
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
        )}
        {period === 'yearly' && (
          <div className="flex gap-2">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="flex-1 px-3 py-2.5 bg-surface-alt dark:bg-surface-alt-dark rounded-xl text-[13px] font-medium text-text dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/30 border border-border dark:border-border-dark"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Summary Cards */}
        <div className="flex gap-3">
          <Card className="flex-1" accent="teal">
            <p className="text-[11px] font-medium text-text-secondary dark:text-text-secondary-dark">
              Pemasukan
            </p>
            <p className="text-lg font-bold text-primary tabular-nums mt-1">
              {fmt.format(summary.income)}
            </p>
          </Card>
          <Card className="flex-1" accent="red">
            <p className="text-[11px] font-medium text-text-secondary dark:text-text-secondary-dark">
              Pengeluaran
            </p>
            <p className="text-lg font-bold text-danger tabular-nums mt-1">
              {fmt.format(summary.expense)}
            </p>
          </Card>
        </div>

        <Card>
          <p className="text-[11px] font-medium text-text-secondary dark:text-text-secondary-dark">
            Selisih
          </p>
          <p
            className={`text-lg font-bold tabular-nums mt-1 ${
              summary.balance >= 0 ? 'text-primary' : 'text-danger'
            }`}
          >
            {summary.balance >= 0 ? '+' : ''}
            {fmt.format(summary.balance)}
          </p>
        </Card>

        {/* Expense Breakdown */}
        {expenseBreakdown.length > 0 && (
          <div>
            <h3 className="text-[13px] font-semibold text-text dark:text-text-dark mb-3">
              Pengeluaran per Kategori
            </h3>
            <Card>
              <div className="space-y-3.5">
                {expenseBreakdown.map((item) => (
                  <div key={item.category} className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${item.color}15` }}
                    >
                      <LucideIcon name={item.icon} size={18} className="opacity-80" style={{ color: item.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-semibold text-text dark:text-text-dark truncate">
                          {item.name}
                        </span>
                        <span className="text-[13px] font-bold text-danger ml-2 tabular-nums">
                          {fmt.format(item.total)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[11px] text-text-secondary dark:text-text-secondary-dark font-medium">
                          {item.count} transaksi
                        </span>
                        <span className="text-[11px] text-text-secondary dark:text-text-secondary-dark font-medium">
                          {summary.expense > 0
                            ? Math.round((item.total / summary.expense) * 100)
                            : 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Income Breakdown */}
        {incomeBreakdown.length > 0 && (
          <div>
            <h3 className="text-[13px] font-semibold text-text dark:text-text-dark mb-3">
              Pemasukan per Kategori
            </h3>
            <Card>
              <div className="space-y-3.5">
                {incomeBreakdown.map((item) => (
                  <div key={item.category} className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${item.color}15` }}
                    >
                      <LucideIcon name={item.icon} size={18} className="opacity-80" style={{ color: item.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-semibold text-text dark:text-text-dark truncate">
                          {item.name}
                        </span>
                        <span className="text-[13px] font-bold text-primary ml-2 tabular-nums">
                          {fmt.format(item.total)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[11px] text-text-secondary dark:text-text-secondary-dark font-medium">
                          {item.count} transaksi
                        </span>
                        <span className="text-[11px] text-text-secondary dark:text-text-secondary-dark font-medium">
                          {summary.income > 0
                            ? Math.round((item.total / summary.income) * 100)
                            : 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Empty State */}
        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-surface-alt dark:bg-surface-alt-dark flex items-center justify-center mx-auto mb-3">
              <LucideIcon name="BarChart3" size={28} className="text-text-secondary dark:text-text-secondary-dark" />
            </div>
            <p className="font-semibold text-text dark:text-text-dark text-[14px]">Tidak ada data</p>
            <p className="text-[12px] text-text-secondary dark:text-text-secondary-dark mt-1">Tidak ada transaksi di periode ini</p>
          </div>
        )}

        {/* Export Button */}
        {filteredTransactions.length > 0 && (
          <button
            onClick={() => exportToCSV(filteredTransactions)}
            className="w-full flex items-center justify-center gap-2 py-3 bg-surface-alt dark:bg-surface-alt-dark text-text dark:text-text-dark rounded-xl font-semibold text-[13px] hover:bg-border dark:hover:bg-border-dark transition-colors cursor-pointer border border-border dark:border-border-dark"
          >
            <LucideIcon name="Download" size={16} />
            Export ke CSV
          </button>
        )}
      </div>
    </PageLayout>
  );
}
