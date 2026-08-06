# AW Cash

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-Yes-4285F4?logo=pwa&logoColor=white)
![Offline-first](https://img.shields.io/badge/Offline--first-100%25-16a34a)
![License](https://img.shields.io/badge/License-MIT-16a34a)

Aplikasi manajemen keuangan personal **offline-first** berbasis PWA. Semua data tersimpan lokal di perangkat — tanpa server, tanpa internet, tanpa khawatir data bocor.

## Daftar Isi

- [Fitur Utama](#fitur-utama)
- [Tech Stack](#tech-stack)
- [Struktur Proyek](#struktur-proyek)
- [Development](#development)
- [Instalasi PWA](#instalasi-pwa)
- [Privasi & Keamanan Data](#privasi--keamanan-data)
- [Lisensi](#lisensi)
- [Changelog](#changelog)

## Fitur Utama

### Dashboard
- Saldo bulan ini ↔ **saldo keseluruhan** (toggle sekali tap)
- **Tombol mata** untuk menyembunyikan/menampilkan semua angka
- Chart pengeluaran (pie per kategori), trend 6 bulan, dan perbandingan bulanan
- Spending alerts (peringatan budget hampir habis) & ringkasan tabungan

### Transaksi
- Input pemasukan/pengeluaran dengan kategori, tanggal, dan catatan
- Tampilan **list** dan **kalender**
- Filter **Semua / Pemasukan / Pengeluaran** dengan FAB kontekstual:
  - Semua → hanya rincian (tanpa tombol tambah)
  - Pemasukan → tombol + biru, form terkunci untuk pemasukan
  - Pengeluaran → tombol + merah, form terkunci untuk pengeluaran
- Pencarian berdasarkan catatan **dan nama kategori**
- Filter bulan/tahun

### Budget
- Atur budget per kategori (per bulan/tahun)
- Progress bar per kategori (hijau/kuning/merah)
- Klik kartu → **drill-down transaksi** kategori tersebut
- Ringkasan **Sisa Budget** (berkurang saat budget terpakai) & **Uang di Luar Budget** (Pemasukan − Budget − pengeluaran non-budget)
- Tombol **+** untuk membuat **kategori pengeluaran sendiri** (custom) langsung dari form budget

### Tabungan
- Buat goal tabungan (target, deadline, ikon, warna)
- **Setor / Ambil** — otomatis tercatat sebagai transaksi
- **Pin** tabungan ke atas list, **Edit**, dan **Hapus** langsung dari kartu (dengan konfirmasi)
- Riwayat setor/ambil per goal + konfirmasi hapus catatan

### Laporan
- Periode: **Mingguan / Bulanan / Tahunan / Semua Waktu**
- Breakdown pemasukan & pengeluaran per kategori
- **Export ke Excel** (.xlsx, 4 sheets: Transaksi, Budget, Tabungan Goals, Tabungan Records)

### Pengaturan
- Tema terang/gelap/sistem
- Backup & restore data (JSON)

## Tech Stack

| Teknologi | Kegunaan |
|---|---|
| React 19 + TypeScript | UI & tipe aman |
| Vite 8 + Tailwind CSS 4 | Build & styling |
| Dexie.js (IndexedDB) | Database lokal (6 tabel) |
| Zustand | State management |
| React Router 7 | Navigasi |
| Chart.js | Grafik |
| vite-plugin-pwa | PWA / offline |
| SheetJS (xlsx) | Export Excel |

## Struktur Proyek

```
src/
├── components/
│   ├── ui/            # UI primitives (Button, Input, Modal, Card, Badge, ConfirmDialog, ...)
│   ├── layout/        # Header, BottomNav, PageLayout
│   └── ...            # Komponen fitur (BudgetCard, SavingsGoalCard, TransactionForm, ...)
├── pages/             # Halaman rute (Dashboard, Transaksi, Budget, Tabungan, Laporan, Pengaturan)
├── hooks/             # Custom hooks (useTransactions, useBudget, useSavings, useSettings, ...)
├── stores/            # Zustand stores
├── lib/               # db.ts, constants.ts, utils.ts, export.ts
└── types/             # TypeScript interfaces
```

## Development

### Prerequisites

- Node.js 20.19+ atau 22.12+
- npm

### Menjalankan

```bash
npm install    # install dependencies
npm run dev    # development server
npm run build  # production build (tsc + vite)
npm run lint   # oxlint
```

### Catatan

- Aplikasi berjalan **full offline** — semua data di IndexedDB, tanpa backend
- Gunakan `npm run build` sebelum push untuk memastikan TypeScript lulus
- Konvensi commit: `feat:` / `fix:` / `refactor:` / `style:` / `docs:` / `perf:`

## Instalasi PWA

### Android
1. Buka app di Chrome
2. Tap menu (3 titik) → "Install app" / "Add to Home Screen"
3. Ikuti instruksi
4. App muncul di home screen

### iOS (iPhone)
1. Buka app di Safari
2. Tap tombol Share (kotak dengan panah)
3. Tap "Add to Home Screen"
4. Tap "Add"
5. App muncul di home screen

### Setelah Install
- App bisa dibuka seperti app biasa
- Bekerja offline (setelah pertama kali dibuka)
- Data tetap tersimpan di lokal

## Privasi & Keamanan Data

**Semua data tersimpan LOKAL di device kamu.**

- Data disimpan di IndexedDB (database browser)
- Tidak ada data yang dikirim ke server
- Tidak ada backend/server — murni client-side
- Hosting hanya menyimpan kode app, bukan data user
- Setiap user terisolasi total satu sama lain

> ⚠️ Penting:
> - Jika clear browser data → data hilang
> - Jika ganti HP → data tidak otomatis pindah
> - Gunakan fitur Backup/Restore untuk export/import data

## Lisensi

Distributed under the [MIT License](LICENSE). Copyright © 2026 rindangalam.

## Changelog

Lihat [CHANGELOG.md](CHANGELOG.md) untuk riwayat perubahan lengkap.
