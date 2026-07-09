import { useState, useEffect, useCallback } from 'react';
import db from '../lib/db';
import type { Budget } from '../types';

export function useBudget(month?: number, year?: number) {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBudgets = useCallback(async () => {
    setLoading(true);
    let collection = db.budgets.toCollection();
    if (month && year) {
      collection = db.budgets.where('[month+year]').equals([month, year]);
    }
    const data = await collection.toArray();
    setBudgets(data);
    setLoading(false);
  }, [month, year]);

  useEffect(() => {
    loadBudgets();
  }, [loadBudgets]);

  const addBudget = useCallback(
    async (budget: Omit<Budget, 'id' | 'createdAt'>) => {
      const existing = await db.budgets
        .where('[month+year]')
        .equals([budget.month, budget.year])
        .filter((b) => b.category === budget.category)
        .first();

      if (existing) {
        await db.budgets.update(existing.id!, {
          amount: budget.amount,
          updatedAt: new Date().toISOString(),
        });
      } else {
        await db.budgets.add({
          ...budget,
          createdAt: new Date().toISOString(),
        });
      }
      await loadBudgets();
    },
    [loadBudgets]
  );

  const updateBudget = useCallback(
    async (id: number, data: Partial<Budget>) => {
      await db.budgets.update(id, {
        ...data,
        updatedAt: new Date().toISOString(),
      });
      await loadBudgets();
    },
    [loadBudgets]
  );

  const deleteBudget = useCallback(
    async (id: number) => {
      await db.budgets.delete(id);
      await loadBudgets();
    },
    [loadBudgets]
  );

  const getByCategory = useCallback(
    async (category: string) => {
      if (!month || !year) return null;
      return await db.budgets
        .where('[month+year]')
        .equals([month, year])
        .filter((b) => b.category === category)
        .first();
    },
    [month, year]
  );

  return {
    budgets,
    loading,
    addBudget,
    updateBudget,
    deleteBudget,
    getByCategory,
    refresh: loadBudgets,
  };
}
