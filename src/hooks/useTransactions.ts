import { useState, useEffect, useCallback } from 'react';
import db from '../lib/db';
import type { Transaction } from '../types';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAll = useCallback(async () => {
    setLoading(true);
    const data = await db.transactions
      .orderBy('date')
      .reverse()
      .toArray();
    setTransactions(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const addTransaction = useCallback(
    async (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
      await db.transactions.add({
        ...transaction,
        createdAt: new Date().toISOString(),
      });
      await loadAll();
    },
    [loadAll]
  );

  const updateTransaction = useCallback(
    async (id: number, data: Partial<Transaction>) => {
      await db.transactions.update(id, data);
      await loadAll();
    },
    [loadAll]
  );

  const deleteTransaction = useCallback(
    async (id: number) => {
      await db.transactions.delete(id);
      await loadAll();
    },
    [loadAll]
  );

  const getById = useCallback(async (id: number) => {
    return await db.transactions.get(id);
  }, []);

  return {
    transactions,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getById,
    refresh: loadAll,
  };
}
