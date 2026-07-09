import { useState } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { LucideIcon } from './ui/LucideIcon';
import { SAVINGS_GOAL_ICONS, SAVINGS_GOAL_COLORS } from '../lib/constants';
import type { SavingsGoal } from '../types';

interface SavingsFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<SavingsGoal, 'id' | 'currentAmount' | 'closed' | 'createdAt'>) => void;
  initial?: Partial<SavingsGoal>;
  title?: string;
}

export function SavingsForm({ isOpen, onClose, onSave, initial, title = 'Tabungan Baru' }: SavingsFormProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [targetAmount, setTargetAmount] = useState(initial?.targetAmount?.toString() ?? '');
  const [icon, setIcon] = useState(initial?.icon ?? SAVINGS_GOAL_ICONS[0]);
  const [color, setColor] = useState(initial?.color ?? SAVINGS_GOAL_COLORS[0]);
  const [deadline, setDeadline] = useState(initial?.deadline ?? '');

  const handleSave = () => {
    if (!name.trim() || !targetAmount) return;
    onSave({
      name: name.trim(),
      targetAmount: Number(targetAmount),
      icon,
      color,
      deadline: deadline || undefined,
    });
    setName('');
    setTargetAmount('');
    setIcon(SAVINGS_GOAL_ICONS[0]);
    setColor(SAVINGS_GOAL_COLORS[0]);
    setDeadline('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-4">
        <Input
          label="Nama Tabungan"
          placeholder="Contoh: Dana Darurat"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          label="Target Jumlah"
          type="number"
          placeholder="0"
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
        />
        <Input
          label="Deadline (opsional)"
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />

        {/* Icon Picker */}
        <div>
          <label className="text-[13px] font-semibold text-text dark:text-text-dark block mb-2">
            Icon
          </label>
          <div className="grid grid-cols-6 gap-2">
            {SAVINGS_GOAL_ICONS.map((name) => (
              <button
                key={name}
                onClick={() => setIcon(name)}
                className={`w-full aspect-square rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                  icon === name
                    ? 'ring-2 ring-primary ring-offset-2 ring-offset-surface dark:ring-offset-surface-dark'
                    : 'hover:bg-surface-alt dark:hover:bg-surface-alt-dark'
                }`}
              >
                <LucideIcon
                  name={name}
                  size={20}
                  style={{ color: icon === name ? color : undefined }}
                  className={icon === name ? '' : 'text-text-secondary dark:text-text-secondary-dark'}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Color Picker */}
        <div>
          <label className="text-[13px] font-semibold text-text dark:text-text-dark block mb-2">
            Warna
          </label>
          <div className="flex gap-2 flex-wrap">
            {SAVINGS_GOAL_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-8 h-8 rounded-full transition-all cursor-pointer ${
                  color === c ? 'ring-2 ring-offset-2 ring-offset-surface dark:ring-offset-surface-dark scale-110' : 'hover:scale-105'
                }`}
                style={{
                  backgroundColor: c,
                }}
              />
            ))}
          </div>
        </div>

        <Button onClick={handleSave} className="w-full" disabled={!name.trim() || !targetAmount}>
          Simpan
        </Button>
      </div>
    </Modal>
  );
}
