import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatCurrency, getMonthName } from '../lib/utils';
import { LucideIcon } from './ui/LucideIcon';
import type { Transaction } from '../types';

interface TrendLineChartProps {
  transactions: Transaction[];
}

interface MonthData {
  month: string;
  pemasukan: number;
  pengeluaran: number;
}

export function TrendLineChart({ transactions }: TrendLineChartProps) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const last6Months: MonthData[] = [];
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

    last6Months.push({ month: monthName, pemasukan, pengeluaran });
  }

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

  return (
    <div className="w-full h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={last6Months} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: '#78716C', fontFamily: 'Plus Jakarta Sans', fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#78716C', fontFamily: 'Plus Jakarta Sans', fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value: number) =>
              value >= 1000000 ? `${(value / 1000000).toFixed(0)}jt` : `${(value / 1000).toFixed(0)}rb`
            }
          />
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
          <Line
            type="monotone"
            dataKey="pemasukan"
            name="Pemasukan"
            stroke="#0F766E"
            strokeWidth={2.5}
            dot={{ r: 4, fill: '#0F766E', strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 6, fill: '#0F766E' }}
          />
          <Line
            type="monotone"
            dataKey="pengeluaran"
            name="Pengeluaran"
            stroke="#DC2626"
            strokeWidth={2.5}
            dot={{ r: 4, fill: '#DC2626', strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 6, fill: '#DC2626' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
