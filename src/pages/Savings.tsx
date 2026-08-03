import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '../components/layout/PageLayout';
import { SavingsGoalCard } from '../components/SavingsGoalCard';
import { SavingsForm } from '../components/SavingsForm';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { LucideIcon } from '../components/ui/LucideIcon';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useSavings } from '../hooks/useSavings';
import { formatCurrency } from '../lib/utils';
import type { SavingsGoal } from '../types';

export function Savings() {
  const { goals, loading, addGoal, updateGoal, deleteGoal, togglePinGoal, totalSavings, totalTarget } = useSavings();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SavingsGoal | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const activeGoals = goals.filter((g) => !g.closed);
  const closedGoals = goals.filter((g) => g.closed);

  const overallProgress = totalTarget > 0 ? (totalSavings / totalTarget) * 100 : 0;

  const handleEdit = (goal: SavingsGoal) => {
    setEditingGoal(goal);
    setShowForm(true);
  };

  const handleSave = async (data: Omit<SavingsGoal, 'id' | 'currentAmount' | 'closed' | 'createdAt'>) => {
    if (editingGoal?.id) {
      await updateGoal(editingGoal.id, data);
    } else {
      await addGoal(data);
    }
    setShowForm(false);
    setEditingGoal(null);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingGoal(null);
  };

  const handleConfirmDelete = async () => {
    if (deleteTarget?.id) {
      await deleteGoal(deleteTarget.id);
    }
    setDeleteTarget(null);
    setShowDeleteConfirm(false);
  };

  return (
    <PageLayout title="Tabungan">
      <div className="space-y-5">
        {/* Summary */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 p-5 text-white shadow-lg shadow-amber-500/20">
          <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-white/10" />
          <div className="absolute -right-2 bottom-4 w-20 h-20 rounded-full bg-white/5" />
          <p className="text-[11px] font-medium text-amber-100 uppercase tracking-wider">Total Tabungan</p>
          <p className="text-3xl font-extrabold tracking-tight mt-1.5 tabular-nums">
            {formatCurrency(totalSavings)}
          </p>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-[12px] font-medium text-amber-100">
              dari {formatCurrency(totalTarget)}
            </span>
            <span className="text-[12px] font-bold text-white">
              ({overallProgress.toFixed(0)}%)
            </span>
          </div>
        </div>

        {/* Active Goals */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[13px] font-semibold text-text dark:text-text-dark">
              Goal Aktif ({activeGoals.length})
            </h3>
            <Button
              variant="ghost"
              size="sm"
              icon={<LucideIcon name="Plus" size={16} />}
              onClick={() => setShowForm(true)}
            >
              Baru
            </Button>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : activeGoals.length === 0 ? (
            <Card className="text-center py-8">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-3">
                <LucideIcon name="ChickenBank" size={28} className="text-amber-500" />
              </div>
              <p className="text-[13px] font-semibold text-text dark:text-text-dark mb-1">
                Belum ada tabungan
              </p>
              <p className="text-[11px] text-text-secondary dark:text-text-secondary-dark mb-4">
                Mulai tabungan pertamamu
              </p>
              <Button
                size="sm"
                icon={<LucideIcon name="Plus" size={16} />}
                onClick={() => setShowForm(true)}
              >
                Buat Goal
              </Button>
            </Card>
          ) : (
            <div className="space-y-3">
              {activeGoals.map((goal) => (
                <SavingsGoalCard
                  key={goal.id}
                  goal={goal}
                  onClick={() => navigate(`/savings/${goal.id}`)}
                  onEdit={() => handleEdit(goal)}
                  onTogglePin={() => togglePinGoal(goal.id!)}
                  onDelete={() => { setDeleteTarget(goal); setShowDeleteConfirm(true); }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Closed Goals */}
        {closedGoals.length > 0 && (
          <div>
            <h3 className="text-[13px] font-semibold text-text dark:text-text-dark mb-3">
              Selesai ({closedGoals.length})
            </h3>
            <div className="space-y-3">
              {closedGoals.map((goal) => (
                <SavingsGoalCard
                  key={goal.id}
                  goal={goal}
                  onClick={() => navigate(`/savings/${goal.id}`)}
                  onEdit={() => handleEdit(goal)}
                  onTogglePin={() => togglePinGoal(goal.id!)}
                  onDelete={() => { setDeleteTarget(goal); setShowDeleteConfirm(true); }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <SavingsForm
        key={editingGoal?.id ?? 'new'}
        isOpen={showForm}
        onClose={handleCloseForm}
        onSave={handleSave}
        initial={editingGoal || undefined}
        title={editingGoal ? 'Edit Tabungan' : 'Buat Tabungan'}
      />

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => { setShowDeleteConfirm(false); setDeleteTarget(null); }}
        onConfirm={handleConfirmDelete}
        title="Hapus Tabungan?"
        message={deleteTarget ? `Semua catatan untuk "${deleteTarget.name}" juga akan dihapus.` : ''}
      />
    </PageLayout>
  );
}
