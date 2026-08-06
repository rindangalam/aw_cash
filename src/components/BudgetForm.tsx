import { useState, useEffect } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { LucideIcon } from './ui/LucideIcon';
import { EXPENSE_CATEGORIES, mergeCategories, CUSTOM_CATEGORY_ICON } from '../lib/constants';
import { parseCurrencyInput } from '../lib/utils';
import { useCustomCategories } from '../hooks/useCustomCategories';
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
  const { categories: customCategories, addCategory } = useCustomCategories('expense');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState<{ category?: string; amount?: string }>({});
  const [showAddInput, setShowAddInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [addError, setAddError] = useState('');

  useEffect(() => {
    if (initialData) {
      setCategory(initialData.category);
      setAmount(String(initialData.amount));
    } else {
      setCategory('');
      setAmount('');
    }
    setErrors({});
    setShowAddInput(false);
    setNewCategoryName('');
    setAddError('');
  }, [initialData, isOpen]);

  const standardCategories = EXPENSE_CATEGORIES.filter(
    (c) => c.id !== 'savings' && c.id !== 'other_expense'
  );
  const categories = mergeCategories(standardCategories, customCategories);

  const isEdit = !!initialData;
  const isEditingOtherCategory = isEdit && !categories.some((c) => c.id === initialData?.category);

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
      amount: Number(parseCurrencyInput(amount)),
      month,
      year,
    });
    onClose();
  };

  const handleAddCategory = async () => {
    const result = await addCategory(newCategoryName);
    if (!result.success) {
      setAddError(result.message || 'Gagal menambah kategori');
      return;
    }
    setCategory(newCategoryName.trim());
    setShowAddInput(false);
    setNewCategoryName('');
    setAddError('');
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
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                disabled={isEdit}
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

            {isEditingOtherCategory && (
              <button
                type="button"
                disabled
                className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl text-[11px] bg-primary/10 ring-2 ring-primary shadow-sm opacity-50 cursor-not-allowed"
              >
                <LucideIcon name="Package" size={20} className="text-primary" />
                <span className="truncate w-full text-center font-medium">
                  Lainnya
                </span>
              </button>
            )}

            {!isEdit && (
              <button
                type="button"
                onClick={() => {
                  setShowAddInput(!showAddInput);
                  setAddError('');
                }}
                className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl text-[11px] border-2 border-dashed border-primary/40 text-primary hover:bg-primary/5 transition-all duration-150 cursor-pointer"
              >
                <LucideIcon name="Plus" size={20} />
                <span className="truncate w-full text-center font-semibold">
                  Tambah
                </span>
              </button>
            )}
          </div>

          {showAddInput && !isEdit && (
            <div className="mt-3 p-3 bg-surface-alt dark:bg-surface-alt-dark rounded-xl space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nama kategori baru"
                  value={newCategoryName}
                  maxLength={20}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  autoFocus
                  className="flex-1 px-3 py-2 bg-surface dark:bg-surface-dark rounded-lg text-[13px] text-text dark:text-text-dark placeholder:text-text-secondary dark:placeholder:text-text-secondary-dark focus:outline-none focus:ring-2 focus:ring-primary/30 border border-border dark:border-border-dark"
                />
                <Button
                  type="button"
                  size="sm"
                  icon={<LucideIcon name="Check" size={14} className="text-white" />}
                  onClick={handleAddCategory}
                >
                  Simpan
                </Button>
              </div>
              {addError && (
                <p className="text-[11px] font-medium text-danger">{addError}</p>
              )}
              <p className="text-[11px] text-text-secondary dark:text-text-secondary-dark flex items-center gap-1.5">
                <LucideIcon name={CUSTOM_CATEGORY_ICON} size={12} />
                Kategori custom juga muncul di pilihan kategori pengeluaran
              </p>
            </div>
          )}

          {errors.category && (
            <span className="text-[11px] font-medium text-danger mt-1.5 block">{errors.category}</span>
          )}
        </div>

        {/* Amount */}
        <Input
          label="Budget Nominal"
          currency
          placeholder="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          error={errors.amount}
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
