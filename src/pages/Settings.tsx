import { useState, useRef, useEffect } from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { LucideIcon } from '../components/ui/LucideIcon';
import { useSettings } from '../hooks/useSettings';

type Theme = 'light' | 'dark' | 'system';

function applyTheme(theme: Theme) {
  if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

export function Settings() {
  const { getSetting, setSetting, backupData, restoreData } = useSettings();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [pendingRestore, setPendingRestore] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const currentTheme = (getSetting('theme', (localStorage.getItem('theme') as Theme) || 'system') as Theme) || 'system';

  useEffect(() => {
    applyTheme(currentTheme);
    if (currentTheme !== 'system') return;

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => applyTheme('system');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [currentTheme]);

  const handleThemeChange = async (theme: Theme) => {
    await setSetting('theme', theme);
    applyTheme(theme);
  };

  const handleBackup = async () => {
    try {
      const data = await backupData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `aw-cash-backup-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      showMessage('success', 'Backup berhasil diunduh');
    } catch {
      showMessage('error', 'Gagal membuat backup');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setPendingRestore(content);
      setShowRestoreModal(true);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleConfirmRestore = async () => {
    if (!pendingRestore) return;
    const result = await restoreData(pendingRestore);
    setShowRestoreModal(false);
    setPendingRestore(null);
    showMessage(result.success ? 'success' : 'error', result.message);
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const themeOptions = [
    { value: 'light' as const, label: 'Terang', icon: 'Sun' },
    { value: 'dark' as const, label: 'Gelap', icon: 'Moon' },
    { value: 'system' as const, label: 'Sistem', icon: 'Monitor' },
  ];

  return (
    <PageLayout title="Pengaturan">
      <div className="space-y-5">
        {/* Message Toast */}
        {message && (
          <div
            className={`fixed top-4 left-4 right-4 z-50 px-4 py-3 rounded-xl text-sm font-semibold text-white shadow-lg ${
              message.type === 'success' ? 'bg-primary shadow-primary/30' : 'bg-danger shadow-danger/30'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Theme */}
        <div>
          <h3 className="text-[11px] font-semibold text-text-secondary dark:text-text-secondary-dark uppercase tracking-wider mb-2.5">
            Tema
          </h3>
          <Card>
            <div className="flex gap-2">
              {themeOptions.map((t) => (
                <button
                  key={t.value}
                  onClick={() => handleThemeChange(t.value)}
                  className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl text-[12px] font-medium transition-all duration-200 cursor-pointer ${
                    currentTheme === t.value
                      ? 'bg-primary/10 ring-2 ring-primary text-primary'
                      : 'bg-surface-alt dark:bg-surface-alt-dark hover:bg-border dark:hover:bg-border-dark text-text-secondary dark:text-text-secondary-dark'
                  }`}
                >
                  <LucideIcon name={t.icon} size={22} />
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Backup */}
        <div>
          <h3 className="text-[11px] font-semibold text-text-secondary dark:text-text-secondary-dark uppercase tracking-wider mb-2.5">
            Data
          </h3>
          <Card>
            <div className="space-y-2">
              <button
                onClick={handleBackup}
                className="w-full flex items-center gap-3 p-3.5 rounded-xl hover:bg-surface-alt dark:hover:bg-surface-alt-dark transition-colors cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <LucideIcon name="Download" size={18} className="text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-[13px] font-semibold text-text dark:text-text-dark">
                    Backup Data
                  </p>
                  <p className="text-[11px] text-text-secondary dark:text-text-secondary-dark">
                    Unduh semua data ke file JSON
                  </p>
                </div>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center gap-3 p-3.5 rounded-xl hover:bg-surface-alt dark:hover:bg-surface-alt-dark transition-colors cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                  <LucideIcon name="Upload" size={18} className="text-amber-600 dark:text-amber-400" />
                </div>
                <div className="text-left">
                  <p className="text-[13px] font-semibold text-text dark:text-text-dark">
                    Restore Data
                  </p>
                  <p className="text-[11px] text-text-secondary dark:text-text-secondary-dark">
                    Pulihkan data dari file backup
                  </p>
                </div>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </Card>
        </div>

        {/* About */}
        <div>
          <h3 className="text-[11px] font-semibold text-text-secondary dark:text-text-secondary-dark uppercase tracking-wider mb-2.5">
            Tentang
          </h3>
          <Card>
            <div className="space-y-3">
              {[
                { label: 'Nama Aplikasi', value: 'AW Cash' },
                { label: 'Versi', value: '1.0.0' },
                { label: 'Platform', value: 'PWA' },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center">
                  <span className="text-[13px] text-text-secondary dark:text-text-secondary-dark">
                    {item.label}
                  </span>
                  <span className="text-[13px] font-semibold text-text dark:text-text-dark">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Restore Confirmation Modal */}
      <Modal
        isOpen={showRestoreModal}
        onClose={() => {
          setShowRestoreModal(false);
          setPendingRestore(null);
        }}
        title="Konfirmasi Restore"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 bg-danger/5 rounded-xl">
            <LucideIcon name="CircleAlert" size={20} className="text-danger shrink-0 mt-0.5" />
            <p className="text-[13px] text-text-secondary dark:text-text-secondary-dark leading-relaxed">
              Semua data saat ini akan digantikan dengan data dari file backup.
              Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                setShowRestoreModal(false);
                setPendingRestore(null);
              }}
              className="flex-1"
            >
              Batal
            </Button>
            <Button variant="danger" onClick={handleConfirmRestore} className="flex-1">
              Restore
            </Button>
          </div>
        </div>
      </Modal>
    </PageLayout>
  );
}
