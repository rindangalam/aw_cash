import { memo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { getCategoryById } from '../lib/constants';
import { formatCurrency } from '../lib/utils';
import { LucideIcon } from './ui/LucideIcon';
import type { Transaction } from '../types';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ExpensePieChartProps {
  transactions: Transaction[];
  month: number;
  year: number;
}

interface ChartDataItem {
  name: string;
  value: number;
  color: string;
}

export const ExpensePieChart = memo(function ExpensePieChart({ transactions, month, year }: ExpensePieChartProps) {
  const expenseData = transactions
    .filter((t) => {
      if (t.type !== 'expense') return false;
      const date = new Date(t.date);
      return date.getMonth() + 1 === month && date.getFullYear() === year;
    })
    .reduce<Record<string, number>>((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const chartDataItems: ChartDataItem[] = Object.entries(expenseData)
    .map(([category, value]) => {
      const cat = getCategoryById(category);
      return {
        name: cat?.name || category,
        value,
        color: cat?.color || '#78716C',
      };
    })
    .sort((a, b) => b.value - a.value);

  if (chartDataItems.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-14 h-14 rounded-2xl bg-surface-alt dark:bg-surface-alt-dark flex items-center justify-center mx-auto mb-3">
          <LucideIcon name="PieChart" size={24} className="text-text-secondary dark:text-text-secondary-dark" />
        </div>
        <p className="text-[13px] font-medium text-text-secondary dark:text-text-secondary-dark">Belum ada pengeluaran bulan ini</p>
      </div>
    );
  }

  const data = {
    labels: chartDataItems.map((d) => d.name),
    datasets: [
      {
        data: chartDataItems.map((d) => d.value),
        backgroundColor: chartDataItems.map((d) => d.color),
        borderWidth: 2,
        borderColor: '#fff',
        hoverBorderWidth: 3,
        hoverOffset: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false as const,
    cutout: '55%',
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 12,
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
          label: (ctx: { label: string; parsed: number }) => ` ${ctx.label}: ${formatCurrency(ctx.parsed)}`,
        },
      },
    },
  };

  return (
    <div className="w-full h-[280px]">
      <Doughnut data={data} options={options} />
    </div>
  );
});
