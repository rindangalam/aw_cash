# Phases — AW Cash Development

## Status Legend

- 🔴 Belum dikerjakan
- 🟡 Sedang dikerjakan
- 🟢 Selesai

---

## Phase 1: Project Setup & Foundation

**Status: 🟢 Selesai**

### Tasks:
- [x] Init project React + Vite + TypeScript
- [x] Setup Tailwind CSS 4
- [x] Setup folder structure (`components/`, `pages/`, `hooks/`, `lib/`, `stores/`, `types/`)
- [x] Setup Dexie.js database (`db.ts`)
- [x] Definisikan TypeScript types (`types/index.ts`)
- [x] Buat constants kategori default (`lib/constants.ts`)
- [x] Buat utility functions (`lib/utils.ts`) — formatCurrency, formatDate, generateId
- [x] Setup React Router v7
- [x] Buat komponen UI dasar:
  - [x] Button
  - [x] Input
  - [x] Modal
  - [x] Card
  - [x] Badge
  - [x] Toggle
- [x] Buat layout components:
  - [x] Header
  - [x] BottomNav
  - [x] PageLayout
- [x] Run `npm run lint` & `npm run build`

### Deliverable:
App bisa jalan dengan navigasi antar halaman kosong. ✅

---

## Phase 2: Transaksi CRUD

**Status: 🟢 Selesai**

### Tasks:
- [x] Buat `useTransactions` hook (add, update, delete, getAll, getById)
- [x] Buat `TransactionForm` component
  - [x] Toggle type (income/expense)
  - [x] Dropdown kategori
  - [x] Input nominal
  - [x] Date picker
  - [x] Input catatan
- [x] Buat `TransactionList` component
- [x] Buat `TransactionItem` component
- [x] Buat halaman `Transactions.tsx`
  - [x] Filter by type
  - [x] Filter by month/year
  - [x] Search by note
  - [x] Sort by date (terbaru)
- [x] Implementasi add/edit/delete
- [x] Validasi form
- [x] Run `npm run lint` & `npm run build`

### Deliverable:
User bisa tambah, edit, hapus, dan lihat daftar transaksi. ✅

---

## Phase 3: Dashboard & Charts

**Status: 🟢 Selesai**

### Tasks:
- [x] Buat halaman `Dashboard.tsx`
- [x] Buat `SummaryCard` component (3 cards: saldo, pemasukan, pengeluaran)
- [x] Buat `ExpensePieChart` component (pengeluaran per kategori)
- [x] Buat `TrendLineChart` component (6 bulan terakhir)
- [x] Install & setup Recharts
- [x] Hitung total dari transactions (useTransactions)
- [x] Run `npm run lint` & `npm run build`

### Deliverable:
Dashboard menampilkan summary dan grafik dari data transaksi. ✅

---

## Phase 4: Budget

**Status: 🟢 Selesai**

### Tasks:
- [x] Buat `useBudget` hook (add, update, delete, getByMonth)
- [x] Buat `BudgetCard` component dengan progress bar
- [x] Buat `BudgetForm` component (modal)
- [x] Buat halaman `Budget.tsx`
  - [x] Filter bulan/tahun
  - [x] List budget per kategori
  - [x] Indikator warna (hijau/kuning/merah)
- [x] Hitung actual spending dari transactions
- [x] Run `npm run lint` & `npm run build`

### Deliverable:
User bisa set budget dan lihat progress per kategori. ✅

---

## Phase 5: Laporan & Export

**Status: 🟢 Selesai**

### Tasks:
- [x] Buat halaman `Reports.tsx`
- [x] Filter periode: mingguan, bulanan, tahunan
- [x] Tabel breakdown per kategori
- [x] Summary: total pemasukan, pengeluaran, selisih
- [x] Export ke CSV
- [x] Run `npm run lint` & `npm run build`

### Deliverable:
User bisa lihat laporan dan export data ke CSV. ✅

---

## Phase 6: Settings & PWA

**Status: 🟢 Selesai**

### Tasks:
- [x] Buat `useSettings` hook
- [x] Buat halaman `Settings.tsx`
  - [x] Toggle tema (dark/light/system)
  - [x] Backup data ke JSON
  - [x] Restore data dari JSON dengan konfirmasi
- [x] Implementasi dark mode dengan Tailwind
- [x] Install & setup vite-plugin-pwa
- [x] Buat manifest.json (via vite-plugin-pwa)
- [x] Setup service worker (generateSW)
- [x] Buat PWA icons (favicon.svg)
- [x] Run `npm run lint` & `npm run build`

### Deliverable:
App bisa di-install sebagai PWA, berfungsi offline, support dark mode. ✅

---

## Phase 7: Final Polish

**Status: 🟢 Selesai**

### Tasks:
- [x] Responsive design testing
- [x] Empty states (belum ada data)
- [x] Loading states
- [x] Error handling
- [x] Konfirmasi dialog untuk delete
- [x] Animasi transisi halaman
- [x] Final testing semua fitur
- [x] Update dokumentasi

### Deliverable:
Aplikasi production-ready. ✅

---

## Semua Phase Selesai! 🎉

**AW Cash** sudah siap digunakan. Untuk menjalankan aplikasi:

```bash
# Development mode
npm run dev

# Build untuk production
npm run build

# Preview production build
npm run preview
```
