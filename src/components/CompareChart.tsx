import { useMemo, memo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatCurrency, getMonthName } from '../lib/utils';
import { LucideIcon } from './ui/LucideIcon';
import type { Transaction } from '../types';

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

  const chartData = [
    { name: current.label, Pemasukan: current.pemasukan, Pengeluaran: current.pengeluaran },
    { name: previous.label, Pemasukan: previous.pemasukan, Pengeluaran: previous.pengeluaran },
  ];

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

      <div className="w-full min-h-[200px]">
        <ResponsiveContainer width="100%" height={200} minWidth={0}>
          <BarChart data={chartData} barCategoryGap="35%">
            <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" vertical={false} />
            <XAxis
              dataKey="name"
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
            <Bar dataKey="Pemasukan" fill="#0EA5E9" radius={[6, 6, 0, 0]} isAnimationActive={false} />
            <Bar dataKey="Pengeluaran" fill="#DC2626" radius={[6, 6, 0, 0]} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});
