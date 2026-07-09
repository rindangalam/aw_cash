import { useState, useEffect, useCallback } from 'react';
import db from '../lib/db';
import type { Transaction, Budget, Setting } from '../types';

export function useSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const loadSettings = useCallback(async () => {
    setLoading(true);
    const data = await db.settings.toArray();
    const mapped: Record<string, string> = {};
    data.forEach((s) => {
      mapped[s.key] = s.value;
    });
    setSettings(mapped);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const getSetting = useCallback(
    (key: string, defaultValue: string = ''): string => {
      return settings[key] || defaultValue;
    },
    [settings]
  );

  const setSetting = useCallback(
    async (key: string, value: string) => {
      const existing = await db.settings.get(key);
      if (existing) {
        await db.settings.update(key, { value });
      } else {
        await db.settings.add({ key, value });
      }
      if (key === 'theme') {
        localStorage.setItem('theme', value);
      }
      await loadSettings();
    },
    [loadSettings]
  );

  const backupData = useCallback(async (): Promise<string> => {
    const transactions = await db.transactions.toArray();
    const budgets = await db.budgets.toArray();
    const settingsData = await db.settings.toArray();

    const backup = {
      version: 1,
      createdAt: new Date().toISOString(),
      data: {
        transactions,
        budgets,
        settings: settingsData,
      },
    };

    return JSON.stringify(backup, null, 2);
  }, []);

  const restoreData = useCallback(
    async (jsonString: string): Promise<{ success: boolean; message: string }> => {
      try {
        const backup = JSON.parse(jsonString) as {
          version: number;
          data: {
            transactions: Transaction[];
            budgets: Budget[];
            settings: Setting[];
          };
        };

        if (!backup.data || !backup.version) {
          return { success: false, message: 'Format file tidak valid' };
        }

        await db.transaction('rw', db.transactions, db.budgets, db.settings, async () => {
          await db.transactions.clear();
          await db.budgets.clear();
          await db.settings.clear();

          if (backup.data.transactions.length > 0) {
            await db.transactions.bulkAdd(
              backup.data.transactions.map((t) => ({
                ...t,
                id: undefined,
              }))
            );
          }
          if (backup.data.budgets.length > 0) {
            await db.budgets.bulkAdd(
              backup.data.budgets.map((b) => ({
                ...b,
                id: undefined,
              }))
            );
          }
          if (backup.data.settings.length > 0) {
            await db.settings.bulkAdd(backup.data.settings);
          }
        });

        await loadSettings();
        return { success: true, message: 'Data berhasil dipulihkan' };
      } catch {
        return { success: false, message: 'Gagal memulihkan data' };
      }
    },
    [loadSettings]
  );

  return {
    settings,
    loading,
    getSetting,
    setSetting,
    backupData,
    restoreData,
    refresh: loadSettings,
  };
}
