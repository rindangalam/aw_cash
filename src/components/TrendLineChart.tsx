import { memo, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { formatCurrency, getMonthName } from '../lib/utils';
import { LucideIcon } from './ui/LucideIcon';
import type { Transaction } from '../types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

interface TrendLineChartProps {
  transactions: Transaction[];
}

interface MonthData {
  month: string;
  pemasukan: number;
  pengeluaran: number;
}

export const TrendLineChart = memo(function TrendLineChart({ transactions }: TrendLineChartProps) {
  const last6Months = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const result: MonthData[] = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth - i, 1);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const monthName = getMonthName(month).slice(0, 3);

      const monthTransactions = transactions.filter((t) => {
        const d = new Date(t.date);
        return d.getMonth() + 1 === month && d.getFullYear() === year;
      });

      const pemasukan = monthTransactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const pengeluaran = monthTransactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      result.push({ month: monthName, pemasukan, pengeluaran });
    }

    return result;
  }, [transactions]);

  const hasData = last6Months.some((d) => d.pemasukan > 0 || d.pengeluaran > 0);

  if (!hasData) {
    return (
      <div className="text-center py-8">
        <div className="w-14 h-14 rounded-2xl bg-surface-alt dark:bg-surface-alt-dark flex items-center justify-center mx-auto mb-3">
          <LucideIcon name="TrendingUp" size={24} className="text-text-secondary dark:text-text-secondary-dark" />
        </div>
        <p className="text-[13px] font-medium text-text-secondary dark:text-text-secondary-dark">Belum ada data 6 bulan terakhir</p>
      </div>
    );
  }

  const data = {
    labels: last6Months.map((d) => d.month),
    datasets: [
      {
        label: 'Pemasukan',
        data: last6Months.map((d) => d.pemasukan),
        borderColor: '#0EA5E9',
        backgroundColor: 'rgba(14, 165, 233, 0.08)',
        borderWidth: 2.5,
        pointRadius: 4,
        pointBackgroundColor: '#0EA5E9',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 6,
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Pengeluaran',
        data: last6Months.map((d) => d.pengeluaran),
        borderColor: '#DC2626',
        backgroundColor: 'rgba(220, 38, 38, 0.08)',
        borderWidth: 2.5,
        pointRadius: 4,
        pointBackgroundColor: '#DC2626',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 6,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false as const,
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
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
        displayColors: true,
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
    <div className="w-full h-[280px]">
      <Line data={data} options={options} />
    </div>
  );
});
