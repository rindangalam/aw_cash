import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '../components/layout/PageLayout';
import { SpendingAlerts } from '../components/SpendingAlerts';
import { CompareChart } from '../components/CompareChart';
import { ExpensePieChart } from '../components/ExpensePieChart';
import { TrendLineChart } from '../components/TrendLineChart';
import { DashboardSavingsWidget } from '../components/DashboardSavingsWidget';
import { Card } from '../components/ui/Card';
import { LucideIcon } from '../components/ui/LucideIcon';
import { useTransactions } from '../hooks/useTransactions';
import { getCurrentMonth, getCurrentYear, getMonthName } from '../lib/utils';

export function Dashboard() {
  const { transactions } = useTransactions();
  const navigate = useNavigate();
  const currentMonth = getCurrentMonth();
  const currentYear = getCurrentYear();

  const monthlyData = useMemo(() => {
    const now = new Date();
    return transactions
      .filter((t) => {
        const date = new Date(t.date);
        return (
          date.getMonth() + 1 === now.getMonth() + 1 &&
          date.getFullYear() === now.getFullYear()
        );
      })
      .reduce(
        (acc, t) => {
          if (t.type === 'income') acc.income += t.amount;
          else acc.expense += t.amount;
          return acc;
        },
        { income: 0, expense: 0 }
      );
  }, [transactions]);

  const overallData = useMemo(() => {
    return transactions.reduce(
      (acc, t) => {
        if (t.type === 'income') acc.income += t.amount;
        else acc.expense += t.amount;
        return acc;
      },
      { income: 0, expense: 0 }
    );
  }, [transactions]);

  const [showOverall, setShowOverall] = useState(false);
  const [showBalance, setShowBalance] = useState(true);

  const displayData = showOverall ? overallData : monthlyData;
  const balance = displayData.income - displayData.expense;
  const masked = 'Rp ••••••';
  const fmt = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  });

  return (
    <PageLayout title="AW Cash">
      <div className="space-y-5">
        {/* Hero Saldo */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-sky-800 p-5 text-white shadow-lg shadow-primary/20">
          <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-white/10" />
          <div className="absolute -right-2 bottom-4 w-20 h-20 rounded-full bg-white/5" />
          <div className="relative flex items-center justify-between">
            <p className="text-[11px] font-medium text-sky-100 uppercase tracking-wider">
              {showOverall ? 'Saldo Keseluruhan' : 'Saldo Bulan Ini'}
            </p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                aria-label={showBalance ? 'Sembunyikan saldo' : 'Tampilkan saldo'}
              >
                <LucideIcon name={showBalance ? 'Eye' : 'EyeOff'} size={16} className="text-sky-100" />
              </button>
              <button
                onClick={() => setShowOverall(!showOverall)}
                className="flex items-center gap-1.5 pl-2.5 pr-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
              >
                <LucideIcon name="ArrowLeftRight" size={14} className="text-sky-100" />
                <span className="text-[11px] font-semibold text-sky-100">
                  {showOverall ? 'Bulan Ini' : 'Keseluruhan'}
                </span>
              </button>
            </div>
          </div>
          <p className={`text-3xl font-extrabold tracking-tight mt-3 tabular-nums ${showBalance && balance >= 0 ? '' : 'text-red-200'}`}>
            {showBalance ? fmt.format(balance) : masked}
          </p>
          <div className="flex gap-6 mt-3">
            <div>
              <div className="flex items-center gap-1.5">
                <LucideIcon name="ArrowDownRight" size={14} className="text-sky-200" />
                <span className="text-[11px] font-medium text-sky-200">Pemasukan</span>
              </div>
              <p className="text-sm font-bold tabular-nums mt-0.5">
                {showBalance ? fmt.format(displayData.income) : masked}
              </p>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <LucideIcon name="ArrowUpRight" size={14} className="text-red-200" />
                <span className="text-[11px] font-medium text-sky-200">Pengeluaran</span>
              </div>
              <p className="text-sm font-bold tabular-nums mt-0.5">
                {showBalance ? fmt.format(displayData.expense) : masked}
              </p>
            </div>
          </div>
        </div>

        {/* Spending Alerts */}
        <SpendingAlerts limit={3} />

        {/* Savings Widget */}
        <DashboardSavingsWidget />

        {/* Compare Chart */}
        <Card>
          <h3 className="text-[13px] font-semibold text-text dark:text-text-dark mb-3">
            Perbandingan Bulanan
          </h3>
          <CompareChart transactions={transactions} />
        </Card>

        {/* Charts */}
        <Card>
          <h3 className="text-[13px] font-semibold text-text dark:text-text-dark mb-3">
            Pengeluaran {getMonthName(currentMonth)} {currentYear}
          </h3>
          <ExpensePieChart
            transactions={transactions}
            month={currentMonth}
            year={currentYear}
          />
        </Card>

        <Card>
          <h3 className="text-[13px] font-semibold text-text dark:text-text-dark mb-3">
            Trend 6 Bulan Terakhir
          </h3>
          <TrendLineChart transactions={transactions} />
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/transactions')}
            className="flex items-center gap-3 p-4 bg-surface dark:bg-surface-dark rounded-2xl border border-border/60 dark:border-border-dark/60 hover:bg-surface-alt dark:hover:bg-surface-alt-dark transition-colors cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <LucideIcon name="Wallet" size={20} className="text-primary" />
            </div>
            <div className="text-left">
              <p className="text-[13px] font-semibold text-text dark:text-text-dark">Transaksi</p>
              <p className="text-[11px] text-text-secondary dark:text-text-secondary-dark">Kelola data</p>
            </div>
          </button>
          <button
            onClick={() => navigate('/reports')}
            className="flex items-center gap-3 p-4 bg-surface dark:bg-surface-dark rounded-2xl border border-border/60 dark:border-border-dark/60 hover:bg-surface-alt dark:hover:bg-surface-alt-dark transition-colors cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
              <LucideIcon name="BarChart3" size={20} className="text-violet-600 dark:text-violet-400" />
            </div>
            <div className="text-left">
              <p className="text-[13px] font-semibold text-text dark:text-text-dark">Laporan</p>
              <p className="text-[11px] text-text-secondary dark:text-text-secondary-dark">Analisis data</p>
            </div>
          </button>
        </div>
      </div>
    </PageLayout>
  );
}
