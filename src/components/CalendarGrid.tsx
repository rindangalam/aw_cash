import { useMemo, useState } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { DayDetail } from './DayDetail';

interface CalendarGridProps {
  month: number;
  year: number;
}

interface DayData {
  date: number;
  income: number;
  expense: number;
  count: number;
}

export function CalendarGrid({ month, year }: CalendarGridProps) {
  const { transactions } = useTransactions();
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const dayNames = ['Sn', 'Sl', 'Rb', 'Km', 'Jm', 'Sb', 'Mg'];

  const { days, firstDayOffset, totalDays } = useMemo(() => {
    const totalDays = new Date(year, month, 0).getDate();
    const firstDay = new Date(year, month - 1, 1).getDay();
    const firstDayOffset = firstDay === 0 ? 6 : firstDay - 1;

    const dayMap: Record<number, DayData> = {};

    transactions
      .filter((t) => {
        const d = new Date(t.date);
        return d.getMonth() + 1 === month && d.getFullYear() === year;
      })
      .forEach((t) => {
        const day = new Date(t.date).getDate();
        if (!dayMap[day]) {
          dayMap[day] = { date: day, income: 0, expense: 0, count: 0 };
        }
        dayMap[day].count += 1;
        if (t.type === 'income') dayMap[day].income += t.amount;
        else dayMap[day].expense += t.amount;
      });

    return { days: dayMap, firstDayOffset, totalDays };
  }, [transactions, month, year]);

  const today = new Date();
  const isCurrentMonth = today.getMonth() + 1 === month && today.getFullYear() === year;

  const selectedDayData = selectedDay !== null ? days[selectedDay] : null;

  const selectedDayTransactions = useMemo(() => {
    if (selectedDay === null) return [];
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
    return transactions.filter((t) => t.date === dateStr);
  }, [transactions, month, year, selectedDay]);

  const cells = [];
  for (let i = 0; i < firstDayOffset; i++) {
    cells.push(<div key={`empty-${i}`} className="h-14" />);
  }

  for (let d = 1; d <= totalDays; d++) {
    const dayData = days[d];
    const isToday = isCurrentMonth && today.getDate() === d;
    const isSelected = selectedDay === d;
    const hasData = !!dayData;

    cells.push(
      <button
        key={d}
        onClick={() => setSelectedDay(isSelected ? null : d)}
        className={`h-14 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all duration-150 cursor-pointer relative ${
          isSelected
            ? 'bg-primary/10 ring-2 ring-primary'
            : isToday
            ? 'bg-surface-alt dark:bg-surface-alt-dark ring-1 ring-primary/30'
            : 'hover:bg-surface-alt dark:hover:bg-surface-alt-dark'
        }`}
      >
        <span className={`text-[12px] font-semibold ${
          isToday ? 'text-primary' : isSelected ? 'text-primary' : 'text-text dark:text-text-dark'
        }`}>
          {d}
        </span>

        {hasData && (
          <div className="flex gap-0.5">
            {dayData.income > 0 && (
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            )}
            {dayData.expense > 0 && (
              <span className="w-1.5 h-1.5 rounded-full bg-danger" />
            )}
          </div>
        )}
      </button>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-7 gap-1">
        {dayNames.map((name) => (
          <div key={name} className="text-center text-[11px] font-semibold text-text-secondary dark:text-text-secondary-dark py-1">
            {name}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells}
      </div>

      {selectedDay !== null && (
        <DayDetail
          day={selectedDay}
          month={month}
          year={year}
          transactions={selectedDayTransactions}
          dayData={selectedDayData ?? undefined}
          onClose={() => setSelectedDay(null)}
        />
      )}
    </div>
  );
}
