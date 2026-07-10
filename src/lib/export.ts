import * as XLSX from 'xlsx';
import db from './db';
import { getCategoryById } from './constants';
import { getMonthName } from './utils';

const fmt = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0,
});

export async function exportToExcel(): Promise<void> {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Transaksi
  const transactions = await db.transactions.toArray();
  const txData = transactions.map((t) => {
    const cat = getCategoryById(t.category);
    return {
      Tanggal: t.date,
      Tipe: t.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
      Kategori: cat?.name || t.category,
      Nominal: t.amount,
      'Nominal Format': fmt.format(t.amount),
      Catatan: t.note || '',
    };
  });
  const txSheet = XLSX.utils.json_to_sheet(txData.length > 0 ? txData : [{ Tanggal: '-', Tipe: '-', Kategori: '-', Nominal: 0, 'Nominal Format': '-', Catatan: '-' }]);
  XLSX.utils.book_append_sheet(wb, txSheet, 'Transaksi');

  // Sheet 2: Budget
  const budgets = await db.budgets.toArray();
  const budgetData = budgets.map((b) => {
    const cat = getCategoryById(b.category);
    return {
      Kategori: cat?.name || b.category,
      Bulan: getMonthName(b.month),
      Tahun: b.year,
      Budget: b.amount,
      'Budget Format': fmt.format(b.amount),
    };
  });
  const budgetSheet = XLSX.utils.json_to_sheet(budgetData.length > 0 ? budgetData : [{ Kategori: '-', Bulan: '-', Tahun: 0, Budget: 0, 'Budget Format': '-' }]);
  XLSX.utils.book_append_sheet(wb, budgetSheet, 'Budget');

  // Sheet 3: Tabungan Goals
  const goals = await db.savingsGoals.toArray();
  const goalData = goals.map((g) => ({
    'Nama Goal': g.name,
    Target: g.targetAmount,
    'Target Format': fmt.format(g.targetAmount),
    Terkumpul: g.currentAmount,
    'Terkumpul Format': fmt.format(g.currentAmount),
    Persentase: g.targetAmount > 0 ? `${Math.round((g.currentAmount / g.targetAmount) * 100)}%` : '0%',
    Deadline: g.deadline || '-',
    Status: g.closed ? 'Selesai' : 'Aktif',
  }));
  const goalSheet = XLSX.utils.json_to_sheet(goalData.length > 0 ? goalData : [{ 'Nama Goal': '-', Target: 0, 'Target Format': '-', Terkumpul: 0, 'Terkumpul Format': '-', Persentase: '-', Deadline: '-', Status: '-' }]);
  XLSX.utils.book_append_sheet(wb, goalSheet, 'Tabungan Goals');

  // Sheet 4: Tabungan Records
  const records = await db.savingsRecords.toArray();
  const recordData = records.map((r) => {
    const goal = goals.find((g) => g.id === r.goalId);
    return {
      'Nama Goal': goal?.name || '-',
      Tanggal: r.date,
      Tipe: r.type === 'setor' ? 'Setor' : 'Ambil',
      Jumlah: r.amount,
      'Jumlah Format': fmt.format(r.amount),
      Catatan: r.note || '',
    };
  });
  const recordSheet = XLSX.utils.json_to_sheet(recordData.length > 0 ? recordData : [{ 'Nama Goal': '-', Tanggal: '-', Tipe: '-', Jumlah: 0, 'Jumlah Format': '-', Catatan: '-' }]);
  XLSX.utils.book_append_sheet(wb, recordSheet, 'Tabungan Records');

  // Generate & download
  const date = new Date().toISOString().split('T')[0];
  XLSX.writeFile(wb, `laporan-aw-cash-${date}.xlsx`);
}
