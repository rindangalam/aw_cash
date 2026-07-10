import { useState } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { getTodayISO, parseCurrencyInput } from '../lib/utils';
import type { SavingsRecord } from '../types';

interface SavingsRecordFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<SavingsRecord, 'id' | 'createdAt'>) => void;
  goalId: number;
  defaultType?: 'setor' | 'ambil';
}

export function SavingsRecordForm({ isOpen, onClose, onSave, goalId, defaultType = 'setor' }: SavingsRecordFormProps) {
  const [type, setType] = useState<'setor' | 'ambil'>(defaultType);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(getTodayISO());

  const handleSave = () => {
    if (!amount || Number(parseCurrencyInput(amount)) <= 0) return;
    onSave({
      goalId,
      amount: Number(parseCurrencyInput(amount)),
      type,
      note: note.trim() || undefined,
      date,
    });
    setAmount('');
    setNote('');
    setDate(getTodayISO());
    setType(defaultType);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={type === 'setor' ? 'Setor Tabungan' : 'Ambil Tabungan'}>
      <div className="space-y-4">
        <Input
          label="Jumlah"
          currency
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
