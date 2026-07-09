import { useState } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { getTodayISO } from '../lib/utils';
import type { SavingsRecord } from '../types';

interface SavingsRecordFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<SavingsRecord, 'id' | 'createdAt'>) => void;
  goalId: number;
}

export function SavingsRecordForm({ isOpen, onClose, onSave, goalId }: SavingsRecordFormProps) {
  const [type, setType] = useState<'setor' | 'ambil'>('setor');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(getTodayISO());

  const handleSave = () => {
    if (!amount || Number(amount) <= 0) return;
    onSave({
      goalId,
      amount: Number(amount),
      type,
      note: note.trim() || undefined,
      date,
    });
    setAmount('');
    setNote('');
    setDate(getTodayISO());
    setType('setor');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Catat Tabungan">
      <div className="space-y-4">
        {/* Type Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setType('setor')}
            className={`flex-1 py-3 rounded-xl text-[13px] font-bold transition-all cursor-pointer border-2 ${
              type === 'setor'
                ? 'bg-primary/10 border-primary text-primary'
                : 'bg-surface-alt dark:bg-surface-alt-dark border-transparent text-text-secondary dark:text-text-secondary-dark'
            }`}
          >
            Setor
          </button>
          <button
            onClick={() => setType('ambil')}
            className={`flex-1 py-3 rounded-xl text-[13px] font-bold transition-all cursor-pointer border-2 ${
              type === 'ambil'
                ? 'bg-danger/10 border-danger text-danger'
                : 'bg-surface-alt dark:bg-surface-alt-dark border-transparent text-text-secondary dark:text-text-secondary-dark'
            }`}
          >
            Ambil
          </button>
        </div>

        <Input
          label="Jumlah"
          type="number"
          placeholder="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Input
          label="Tanggal"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <Input
          label="Catatan (opsional)"
          placeholder="Contoh: gajian, bonus"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <Button onClick={handleSave} className="w-full" disabled={!amount || Number(amount) <= 0}>
          Simpan
        </Button>
      </div>
    </Modal>
  );
}
