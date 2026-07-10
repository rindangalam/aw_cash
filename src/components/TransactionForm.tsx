import { useState, useEffect } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { LucideIcon } from './ui/LucideIcon';
import { getCategoriesByType } from '../lib/constants';
import { parseCurrencyInput } from '../lib/utils';
import { getTodayISO } from '../lib/utils';
import type { Transaction } from '../types';

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Transaction, 'id' | 'createdAt'>) => void;
  initialData?: Transaction | null;
}

export function TransactionForm({
  isOpen,
  onClose,
  onSave,
  initialData,
}: TransactionFormProps) {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(getTodayISO());
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState<{ category?: string; amount?: string }>({});

  useEffect(() => {
    if (initialData) {
      setType(initialData.type);
      setCategory(initialData.category);
      setAmount(String(initialData.amount));
      setDate(initialData.date);
      setNote(initialData.note || '');
    } else {
      setType('expense');
      setCategory('');
      setAmount('');
      setDate(getTodayISO());
      setNote('');
    }
    setErrors({});
  }, [initialData, isOpen]);

  const categories = getCategoriesByType(type).filter(
    (c) => c.id !== 'savings' && c.id !== 'savings_withdraw'
  );

  const validate = (): boolean => {
    const newErrors: { category?: string; amount?: string } = {};
    if (!category) newErrors.category = 'Pilih kategori';
    if (!amount || Number(amount) <= 0) newErrors.amount = 'Nominal harus lebih dari 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      type,
      category,
      amount: Number(parseCurrencyInput(amount)),
      date,
      note: note || undefined,
    });
    onClose();
  };

  const handleTypeChange = (newType: 'income' | 'expense') => {
    setType(newType);
    setCategory('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Transaksi' : 'Tambah Transaksi'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type Toggle */}
        <div className="flex gap-2 p-1 bg-surface-alt dark:bg-surface-alt-dark rounded-xl">
          {(['income', 'expense'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => handleTypeChange(t)}
              className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 cursor-pointer ${
                type === t
                  ? t === 'expense'
                    ? 'bg-danger text-white shadow-sm shadow-danger/20'
                    : 'bg-primary text-white shadow-sm shadow-primary/20'
                  : 'text-text-secondary dark:text-text-secondary-dark hover:text-text dark:hover:text-text-dark'
              }`}
            >
              {t === 'expense' ? 'Pengeluaran' : 'Pemasukan'}
            </button>
          ))}
        </div>

        {/* Category Grid */}
        <div>
          <label className="text-[13px] font-semibold text-text dark:text-text-dark mb-2 block">
            Kategori
          </label>
          <div className="grid grid-cols-4 gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl text-[11px] transition-all duration-150 cursor-pointer ${
                  category === cat.id
                    ? 'bg-primary/10 ring-2 ring-primary shadow-sm'
                    : 'bg-surface-alt dark:bg-surface-alt-dark hover:bg-border dark:hover:bg-border-dark'
                }`}
              >
                <LucideIcon
                  name={cat.icon}
                  size={20}
                  className={category === cat.id ? 'text-primary' : 'text-text-secondary dark:text-text-secondary-dark'}
                />
                <span className="truncate w-full text-center font-medium">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
          {errors.category && (
            <span className="text-[11px] font-medium text-danger mt-1.5 block">{errors.category}</span>
          )}
        </div>

        {/* Amount */}
        <Input
          label="Nominal"
          currency
          placeholder="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          error={errors.amount}
        />

        {/* Date */}
        <Input
          label="Tanggal"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        {/* Note */}
        <Input
          label="Catatan (opsional)"
          placeholder="Tambahkan catatan..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Batal
          </Button>
          <Button type="submit" className="flex-1" icon={<LucideIcon name="Plus" size={16} className="text-white" />}>
            Simpan
          </Button>
        </div>
      </form>
    </Modal>
  );
}
