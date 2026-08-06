import { useState, useEffect, useCallback } from 'react';
import db from '../lib/db';
import { ALL_CATEGORIES, CUSTOM_CATEGORY_COLORS, registerCustomCategories } from '../lib/constants';
import type { CustomCategory } from '../types';

export function useCustomCategories(type: 'income' | 'expense') {
  const [categories, setCategories] = useState<CustomCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await db.customCategories.where('type').equals(type).toArray();
    data.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    setCategories(data);
    registerCustomCategories(data);
    setLoading(false);
  }, [type]);

  useEffect(() => {
    load();
  }, [load, type]);

  const addCategory = useCallback(
    async (rawName: string): Promise<{ success: boolean; message?: string }> => {
      const name = rawName.trim();
      if (!name) return { success: false, message: 'Nama kategori wajib diisi' };
      if (name.length > 20) return { success: false, message: 'Maksimal 20 karakter' };

      const lower = name.toLowerCase();
      const existsDefault = ALL_CATEGORIES.some((c) => c.name.toLowerCase() === lower);
      const existsCustom = categories.some((c) => c.name.toLowerCase() === lower);
      if (existsDefault || existsCustom) {
        return { success: false, message: 'Kategori sudah ada' };
      }

      const color = CUSTOM_CATEGORY_COLORS[categories.length % CUSTOM_CATEGORY_COLORS.length];
      await db.customCategories.add({
        type,
        name,
        color,
        createdAt: new Date().toISOString(),
      });
      await load();
      return { success: true };
    },
    [categories, type, load]
  );

  return { categories, loading, addCategory, refresh: load };
}