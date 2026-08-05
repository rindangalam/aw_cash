import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { BottomNav } from '../components/layout/BottomNav';
import { SavingsRecordItem } from '../components/SavingsRecordItem';
import { SavingsRecordForm } from '../components/SavingsRecordForm';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LucideIcon } from '../components/ui/LucideIcon';
import { Badge } from '../components/ui/Badge';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useSavings } from '../hooks/useSavings';
import { formatCurrency, formatDate } from '../lib/utils';
import type { SavingsGoal, SavingsRecord } from '../types';

export function SavingsDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { goals, closeGoal, reopenGoal, getRecords, addRecord, deleteRecord } = useSavings();

  const [goal, setGoal] = useState<SavingsGoal | null>(null);
  const [records, setRecords] = useState<SavingsRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRecordForm, setShowRecordForm] = useState(false);
  const [recordFormType, setRecordFormType] = useState<'setor' | 'ambil'>('setor');
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [deleteRecordTarget, setDeleteRecordTarget] = useState<SavingsRecord | null>(null);

  const goalId = Number(id);

  const loadData = useCallback(async () => {
    setLoading(true);
    const found = goals.find((g) => g.id === goalId);
    if (found) {
      setGoal(found);
      const recs = await getRecords(goalId);
      setRecords(recs);
    }
    setLoading(false);
  }, [goals, goalId, getRecords]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) return (
    <>
      <Header title="Detail Tabungan" rightAction={<button onClick={() => navigate('/savings')} className="p-2 -mr-2 rounded-xl hover:bg-surface-alt dark:hover:bg-surface-alt-dark text-text-secondary dark:text-text-secondary-dark transition-colors cursor-pointer"><LucideIcon name="ArrowLeft" size={20} /></button>} />
      <main className="pb-20 px-4 pt-4 max-w-lg mx-auto"><LoadingSpinner /></main>
      <BottomNav />
    </>
  );

  if (!goal) return (
    <>
      <Header title="Detail Tabungan" rightAction={<button onClick={() => navigate('/savings')} className="p-2 -mr-2 rounded-xl hover:bg-surface-alt dark:hover:bg-surface-alt-dark text-text-secondary dark:text-text-secondary-dark transition-colors cursor-pointer"><LucideIcon name="ArrowLeft" size={20} /></button>} />
      <main className="pb-20 px-4 pt-4 max-w-lg mx-auto">
        <p className="text-center text-text-secondary dark:text-text-secondary-dark py-10">Goal tidak ditemukan</p>
      </main>
      <BottomNav />
    </>
  );

  const progress = goal.targetAmount > 0
    ? Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)
    : 0;

  const daysLeft = goal.deadline
    ? Math.max(0, Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  return (
    <>
      <Header title="Detail Tabungan" rightAction={<button onClick={() => navigate('/savings')} className="p-2 -mr-2 rounded-xl hover:bg-surface-alt dark:hover:bg-surface-alt-dark text-text-secondary dark:text-text-secondary-dark transition-colors cursor-pointer"><LucideIcon name="ArrowLeft" size={20} /></button>} />
      <main className="pb-20 px-4 pt-4 max-w-lg mx-auto space-y-5">
        {/* Goal Header */}
        <Card>
          <div className="flex items-start gap-3.5 mb-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${goal.color}15` }}
            >
              <LucideIcon name={goal.icon} size={26} className="opacity-90" style={{ color: goal.color }} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-text dark:text-text-dark">{goal.name}</h2>
                {goal.closed && <Badge variant="success">Selesai</Badge>}
              </div>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-xl font-extrabold tabular-nums text-text dark:text-text-dark">
                  {formatCurrency(goal.currentAmount)}
                </span>
                <span className="text-[12px] font-medium text-text-secondary dark:text-text-secondary-dark">
                  / {formatCurrency(goal.targetAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-3">
            <div className="h-3 bg-border/60 dark:bg-border-dark/60 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%`, backgroundColor: goal.color }}
              />
            </div>
            <div className="flex justify-between items-center mt-1.5">
              <p className="text-[11px] font-semibold text-text-secondary dark:text-text-secondary-dark tabular-nums">
                {progress.toFixed(0)}%
              </p>
              {daysLeft !== null && !goal.closed && (
                <p className="text-[11px] font-semibold text-text-secondary dark:text-text-secondary-dark">
                  {daysLeft} hari lagi
                </p>
              )}
            </div>
          </div>

          {goal.deadline && (
            <p className="text-[11px] text-text-secondary dark:text-text-secondary-dark mb-3">
              Deadline: {formatDate(goal.deadline)}
            </p>
          )}

          {/* Actions */}
          {!goal.closed && (
            <div className="space-y-2">
              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  icon={<LucideIcon name="ArrowDownLeft" size={16} />}
                  onClick={() => { setRecordFormType('setor'); setShowRecordForm(true); }}
                >
                  Setor
                </Button>
                <Button
                  variant="danger"
                  className="flex-1"
                  icon={<LucideIcon name="ArrowUpRight" size={16} />}
                  onClick={() => { setRecordFormType('ambil'); setShowRecordForm(true); }}
                >
                  Ambil
                </Button>
              </div>
              <Button
                variant="secondary"
                className="w-full"
                icon={<LucideIcon name="Check" size={16} />}
                onClick={() => setShowCloseConfirm(true)}
              >
                Selesai
              </Button>
            </div>
          )}
          {goal.closed && (
            <Button
              variant="secondary"
              className="w-full"
              icon={<LucideIcon name="RotateCcw" size={16} />}
              onClick={() => reopenGoal(goalId)}
            >
              Buka Kembali
            </Button>
          )}
        </Card>

        {/* Records */}
        <div>
          <h3 className="text-[13px] font-semibold text-text dark:text-text-dark mb-3">
            Riwayat ({records.length})
          </h3>
          {records.length === 0 ? (
            <Card className="text-center py-6">
              <p className="text-[12px] text-text-secondary dark:text-text-secondary-dark">
                Belum ada catatan
              </p>
            </Card>
          ) : (
            <Card>
              {records.map((record) => (
                <SavingsRecordItem
                  key={record.id}
                  record={record}
                  onDelete={(r) => setDeleteRecordTarget(r)}
                />
              ))}
            </Card>
          )}
        </div>
      </main>
      <BottomNav />

      {/* Forms */}
      <SavingsRecordForm
        key={recordFormType}
        isOpen={showRecordForm}
        onClose={() => setShowRecordForm(false)}
        onSave={addRecord}
        goalId={goalId}
        defaultType={recordFormType}
      />
      <ConfirmDialog
        isOpen={showCloseConfirm}
        onClose={() => setShowCloseConfirm(false)}
        onConfirm={() => closeGoal(goalId)}
        title="Tandai Selesai?"
        message={`Tabungan "${goal.name}" akan ditandai sebagai selesai.`}
        confirmLabel="Selesai"
        variant="primary"
      />
      <ConfirmDialog
        isOpen={deleteRecordTarget !== null}
        onClose={() => setDeleteRecordTarget(null)}
        onConfirm={() => {
          if (deleteRecordTarget) {
            deleteRecord(deleteRecordTarget);
          }
          setDeleteRecordTarget(null);
        }}
        title="Hapus Catatan?"
        message="Catatan setor/ambil dan transaksi terkait akan dihapus. Lanjutkan?"
      />
    </>
  );
}
