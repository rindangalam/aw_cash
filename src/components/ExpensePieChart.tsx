import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { getCategoryById } from '../lib/constants';
import { formatCurrency } from '../lib/utils';
import { LucideIcon } from './ui/LucideIcon';
import type { Transaction } from '../types';

interface ExpensePieChartProps {
  transactions: Transaction[];
  month: number;
  year: number;
}

interface ChartData {
  name: string;
  value: number;
  color: string;
  icon: string;
}

export function ExpensePieChart({ transactions, month, year }: ExpensePieChartProps) {
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

  const chartData: ChartData[] = Object.entries(expenseData)
    .map(([category, value]) => {
      const cat = getCategoryById(category);
      return {
        name: cat?.name || category,
        value,
        color: cat?.color || '#78716C',
        icon: cat?.icon || 'Package',
      };
    })
    .sort((a, b) => b.value - a.value);

  if (chartData.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-14 h-14 rounded-2xl bg-surface-alt dark:bg-surface-alt-dark flex items-center justify-center mx-auto mb-3">
          <LucideIcon name="PieChart" size={24} className="text-text-secondary dark:text-text-secondary-dark" />
        </div>
        <p className="text-[13px] font-medium text-text-secondary dark:text-text-secondary-dark">Belum ada pengeluaran bulan ini</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="40%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => formatCurrency(Number(value))}
            contentStyle={{
              backgroundColor: '#1C1917',
              border: 'none',
              borderRadius: '12px',
              color: '#FAFAF9',
              fontSize: '12px',
              fontFamily: 'Plus Jakarta Sans',
              fontWeight: 500,
            }}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value: string) => (
              <span className="text-[11px] font-medium text-text dark:text-text-dark">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
