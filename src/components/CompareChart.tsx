import { useMemo, memo } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { formatCurrency, getMonthName } from '../lib/utils';
import { LucideIcon } from './ui/LucideIcon';
import type { Transaction } from '../types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface CompareChartProps {
  transactions: Transaction[];
}

interface MonthTotals {
  label: string;
  fullLabel: string;
  pemasukan: number;
  pengeluaran: number;
}

function getMonthTotals(transactions: Transaction[], monthOffset: number): MonthTotals {
  const now = new Date();
  const date = new Date(now.getFullYear(), now.getMonth() - monthOffset, 1);
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const filtered = transactions.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() + 1 === month && d.getFullYear() === year;
  });

  return {
    label: getMonthName(month).slice(0, 3),
    fullLabel: `${getMonthName(month)} ${year}`,
    pemasukan: filtered
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0),
    pengeluaran: filtered
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0),
  };
}

export const CompareChart = memo(function CompareChart({ transactions }: CompareChartProps) {
  const { current, previous, change } = useMemo(() => {
    const cur = getMonthTotals(transactions, 0);
    const prev = getMonthTotals(transactions, 1);

    const incomeChange = prev.pemasukan > 0
      ? Math.round(((cur.pemasukan - prev.pemasukan) / prev.pemasukan) * 100)
      : cur.pemasukan > 0 ? 100 : 0;
    const expenseChange = prev.pengeluaran > 0
      ? Math.round(((cur.pengeluaran - prev.pengeluaran) / prev.pengeluaran) * 100)
      : cur.pengeluaran > 0 ? 100 : 0;

    return {
      current: cur,
      previous: prev,
      change: { income: incomeChange, expense: expenseChange },
    };
  }, [transactions]);

  const hasData = current.pemasukan > 0 || current.pengeluaran > 0 ||
    previous.pemasukan > 0 || previous.pengeluaran > 0;

  if (!hasData) {
    return (
      <div className="text-center py-8">
        <div className="w-14 h-14 rounded-2xl bg-surface-alt dark:bg-surface-alt-dark flex items-center justify-center mx-auto mb-3">
          <LucideIcon name="BarChart3" size={24} className="text-text-secondary dark:text-text-secondary-dark" />
        </div>
        <p className="text-[13px] font-medium text-text-secondary dark:text-text-secondary-dark">Belum ada data untuk dibandingkan</p>
      </div>
    );
  }

  const data = {
    labels: [current.label, previous.label],
    datasets: [
      {
        label: 'Pemasukan',
        data: [current.pemasukan, previous.pemasukan],
        backgroundColor: '#0EA5E9',
        borderRadius: 6,
        barPercentage: 0.65,
      },
      {
        label: 'Pengeluaran',
        data: [current.pengeluaran, previous.pengeluaran],
        backgroundColor: '#DC2626',
        borderRadius: 6,
        barPercentage: 0.65,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false as const,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 16,
          font: { family: 'Plus Jakarta Sans', size: 11, weight: 500 },
          color: '#78716C',
        },
      },
      tooltip: {
        backgroundColor: '#1C1917',
        titleFont: { family: 'Plus Jakarta Sans', size: 12, weight: 500 },
        bodyFont: { family: 'Plus Jakarta Sans', size: 12, weight: 500 },
        padding: 10,
        cornerRadius: 12,
        callbacks: {
          label: (ctx: { dataset: { label?: string }; parsed: { y: number | null } }) => {
            const val = ctx.parsed.y;
            return ` ${ctx.dataset.label}: ${val !== null ? formatCurrency(val) : '-'}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: {
          font: { family: 'Plus Jakarta Sans', size: 11, weight: 500 },
          color: '#78716C',
        },
      },
      y: {
        grid: { color: '#E7E5E4', drawBorder: false },
        border: { display: false },
        ticks: {
          font: { family: 'Plus Jakarta Sans', size: 11, weight: 500 },
          color: '#78716C',
          callback: (value: number | string) => {
            const num = typeof value === 'string' ? parseFloat(value) : value;
            return num >= 1000000 ? `${(num / 1000000).toFixed(0)}jt` : `${(num / 1000).toFixed(0)}rb`;
          },
        },
      },
    },
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-medium text-text-secondary dark:text-text-secondary-dark">Pemasukan</span>
            {change.income !== 0 && (
              <span className={`inline-flex items-center gap-0.5 text-[11px] font-bold tabular-nums ${change.income > 0 ? 'text-primary' : 'text-danger'}`}>
                <LucideIcon name={change.income > 0 ? 'ArrowUpRight' : 'ArrowDownRight'} size={12} />
                {change.income > 0 ? '+' : ''}{change.income}%
              </span>
            )}
          </div>
          <p className="text-[11px] text-text-secondary dark:text-text-secondary-dark mt-0.5">
            {current.fullLabel} vs {previous.fullLabel}
          </p>
        </div>
      </div>

      <div className="w-full h-[200px]">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
});
