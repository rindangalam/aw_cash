import { useState, useEffect, useCallback } from 'react';
import db from '../lib/db';
import type { SavingsGoal, SavingsRecord } from '../types';

export function useSavings() {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [loading, setLoading] = useState(true);

  const loadGoals = useCallback(async () => {
    setLoading(true);
    const data = await db.savingsGoals.orderBy('createdAt').reverse().toArray();
    setGoals(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadGoals();
  }, [loadGoals]);

  const addGoal = useCallback(
    async (goal: Omit<SavingsGoal, 'id' | 'currentAmount' | 'closed' | 'createdAt'>) => {
      await db.savingsGoals.add({
        ...goal,
        currentAmount: 0,
        closed: false,
        createdAt: new Date().toISOString(),
      });
      await loadGoals();
    },
    [loadGoals]
  );

  const updateGoal = useCallback(
    async (id: number, data: Partial<SavingsGoal>) => {
      await db.savingsGoals.update(id, data);
      await loadGoals();
    },
    [loadGoals]
  );

  const deleteGoal = useCallback(
    async (id: number) => {
      const records = await db.savingsRecords.where('goalId').equals(id).toArray();
      const transactionIds = records.filter((r) => r.transactionId).map((r) => r.transactionId!);
      if (transactionIds.length > 0) {
        await db.transactions.bulkDelete(transactionIds);
      }
      await db.savingsRecords.where('goalId').equals(id).delete();
      await db.savingsGoals.delete(id);
      await loadGoals();
    },
    [loadGoals]
  );

  const closeGoal = useCallback(
    async (id: number) => {
      await db.savingsGoals.update(id, { closed: true });
      await loadGoals();
    },
    [loadGoals]
  );

  const reopenGoal = useCallback(
    async (id: number) => {
      await db.savingsGoals.update(id, { closed: false });
      await loadGoals();
    },
    [loadGoals]
  );

  const getRecords = useCallback(async (goalId: number): Promise<SavingsRecord[]> => {
    return await db.savingsRecords
      .where('goalId')
      .equals(goalId)
      .reverse()
      .sortBy('date');
  }, []);

  const addRecord = useCallback(
    async (record: Omit<SavingsRecord, 'id' | 'createdAt'>) => {
      const now = new Date().toISOString();

      const transactionId = await db.transactions.add({
        type: record.type === 'setor' ? 'expense' : 'income',
        category: record.type === 'setor' ? 'savings' : 'savings_withdraw',
        amount: record.amount,
        date: record.date,
        note: record.note || `Tabungan: ${record.type === 'setor' ? 'Setor' : 'Ambil'}`,
        createdAt: now,
      });

      await db.savingsRecords.add({
        ...record,
        transactionId,
        createdAt: now,
      });

      const goal = await db.savingsGoals.get(record.goalId);
      if (goal) {
        const delta = record.type === 'setor' ? record.amount : -record.amount;
        const newAmount = Math.max(0, goal.currentAmount + delta);
        await db.savingsGoals.update(record.goalId, { currentAmount: newAmount });
      }

      await loadGoals();
    },
    [loadGoals]
  );

  const deleteRecord = useCallback(
    async (record: SavingsRecord) => {
      if (record.transactionId) {
        await db.transactions.delete(record.transactionId);
      }

      await db.savingsRecords.delete(record.id!);

      const goal = await db.savingsGoals.get(record.goalId);
      if (goal) {
        const delta = record.type === 'setor' ? -record.amount : record.amount;
        const newAmount = Math.max(0, goal.currentAmount + delta);
        await db.savingsGoals.update(record.goalId, { currentAmount: newAmount });
      }

      await loadGoals();
    },
    [loadGoals]
  );

  const totalSavings = goals
    .filter((g) => !g.closed)
    .reduce((sum, g) => sum + g.currentAmount, 0);

  const totalTarget = goals
    .filter((g) => !g.closed)
    .reduce((sum, g) => sum + g.targetAmount, 0);

  return {
    goals,
    loading,
    addGoal,
    updateGoal,
    deleteGoal,
    closeGoal,
    reopenGoal,
    getRecords,
    addRecord,
    deleteRecord,
    totalSavings,
    totalTarget,
    refresh: loadGoals,
  };
}
