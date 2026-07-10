import type { Category } from '../types';

export const INCOME_CATEGORIES: Category[] = [
  { id: 'salary', name: 'Gaji', icon: 'Briefcase', color: '#0EA5E9' },
  { id: 'freelance', name: 'Freelance', icon: 'Laptop', color: '#2563EB' },
  { id: 'investment', name: 'Investasi', icon: 'TrendingUp', color: '#7C3AED' },
  { id: 'savings_withdraw', name: 'Ambil Tabungan', icon: 'ChickenBank', color: '#0EA5E9' },
  { id: 'other_income', name: 'Lainnya', icon: 'Wallet', color: '#78716C' },
];

export const EXPENSE_CATEGORIES: Category[] = [
  { id: 'food', name: 'Makanan', icon: 'UtensilsCrossed', color: '#DC2626' },
  { id: 'transport', name: 'Transport', icon: 'Car', color: '#EA580C' },
  { id: 'shopping', name: 'Belanja', icon: 'ShoppingBag', color: '#DB2777' },
  { id: 'bills', name: 'Tagihan', icon: 'Receipt', color: '#7C3AED' },
  { id: 'health', name: 'Kesehatan', icon: 'Heart', color: '#0284C7' },
  { id: 'entertainment', name: 'Hiburan', icon: 'Gamepad2', color: '#CA8A04' },
  { id: 'education', name: 'Pendidikan', icon: 'GraduationCap', color: '#2563EB' },
  { id: 'savings', name: 'Tabungan', icon: 'ChickenBank', color: '#0EA5E9' },
  { id: 'other_expense', name: 'Lainnya', icon: 'Package', color: '#78716C' },
];

export const ALL_CATEGORIES = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];

export function getCategoryById(id: string): Category | undefined {
  return ALL_CATEGORIES.find((c) => c.id === id);
}

export function getCategoriesByType(type: 'income' | 'expense'): Category[] {
  return type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
}

export const SAVINGS_GOAL_ICONS = [
  'Smartphone', 'Plane', 'Shield', 'Car', 'Home', 'GraduationCap',
  'Gift', 'Heart', 'Umbrella', 'Laptop', 'Camera', 'Music',
];

export const SAVINGS_GOAL_COLORS = [
  '#0EA5E9', '#2563EB', '#7C3AED', '#DB2777', '#DC2626',
  '#EA580C', '#CA8A04', '#16A34A', '#0891B2', '#6366F1',
];
