import Dexie, { type EntityTable } from 'dexie';
import type { Transaction, Budget, Setting, SavingsGoal, SavingsRecord } from '../types';

const db = new Dexie('AWCashDB') as Dexie & {
  transactions: EntityTable<Transaction, 'id'>;
  budgets: EntityTable<Budget, 'id'>;
  settings: EntityTable<Setting, 'key'>;
  savingsGoals: EntityTable<SavingsGoal, 'id'>;
  savingsRecords: EntityTable<SavingsRecord, 'id'>;
};

db.version(1).stores({
  transactions: '++id, type, category, date, createdAt',
  budgets: '++id, category, [month+year]',
  settings: 'key',
});

db.version(2).stores({
  savingsGoals: '++id, closed, createdAt',
  savingsRecords: '++id, goalId, date, createdAt',
});

db.version(3).stores({
  savingsRecords: '++id, goalId, transactionId, date, createdAt',
});

export default db;
