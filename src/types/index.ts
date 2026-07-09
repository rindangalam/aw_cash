export interface Transaction {
  id?: number;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  date: string;
  note?: string;
  createdAt: string;
}

export interface Budget {
  id?: number;
  category: string;
  amount: number;
  month: number;
  year: number;
  createdAt: string;
  updatedAt?: string;
}

export interface Setting {
  key: string;
  value: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}
