import Dexie, { type EntityTable } from 'dexie';
import type { Transaction, Budget, Setting } from '../types';

const db = new Dexie('AWCashDB') as Dexie & {
  transactions: EntityTable<Transaction, 'id'>;
  budgets: EntityTable<Budget, 'id'>;
  settings: EntityTable<Setting, 'key'>;
};

db.version(1).stores({
  transactions: '++id, type, category, date, createdAt',
  budgets: '++id, category, [month+year]',
  settings: 'key',
});

export default db;
