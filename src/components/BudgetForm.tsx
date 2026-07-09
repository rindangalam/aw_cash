import { useState, useEffect } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { LucideIcon } from './ui/LucideIcon';
import { EXPENSE_CATEGORIES } from '../lib/constants';
import type { Budget } from '../types';

interface BudgetFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>) => void;
  initialData?: Budget | null;
  month: number;
  year: number;
}

export function BudgetForm({
  isOpen,
  onClose,
  onSave,
  initialData,
  month,
  year,
}: BudgetFormProps) {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState<{ category?: string; amount?: string }>({});

  useEffect(() => {
    if (initialData) {
      setCategory(initialData.category);
      setAmount(String(initialData.amount));
    } else {
      setCategory('');
      setAmount('');
    }
    setErrors({});
  }, [initialData, isOpen]);

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
      category,
      amount: Number(amount),
      month,
      year,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Budget' : 'Tambah Budget'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Category */}
        <div>
          <label className="text-[13px] font-semibold text-text dark:text-text-dark mb-2 block">
            Kategori
          </label>
          <div className="grid grid-cols-4 gap-2">
            {EXPENSE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                disabled={!!initialData}
                className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl text-[11px] transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
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
          label="Budget Nominal"
          type="number"
          placeholder="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          error={errors.amount}
          min="1"
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
