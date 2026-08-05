# AW Cash

Aplikasi manajemen keuangan personal **offline-first** berbasis PWA. Semua data tersimpan lokal di perangkat — tanpa server, tanpa internet, tanpa khawatir data bocor.

## Fitur Utama

### Dashboard
- Saldo bulan ini ↔ **saldo keseluruhan** (toggle sekali tap)
- **Tombol mata** untuk menyembunyikan/menampilkan semua angka
- Chart pengeluaran (pie per kategori), trend 6 bulan, dan perbandingan bulanan
- Spending alerts (peringatan budget hampir habis) & ringkasan tabungan

### Transaksi
- Input pemasukan/pengeluaran dengan kategori, tanggal, dan catatan
- Tampilan **list** dan **kalender**
- Filter **Semua / Pemasukan / Pengeluaran**:
  - Semua → hanya rincian (tanpa tombol tambah)
  - Pemasukan → tombol + biru, form terkunci untuk pemasukan
  - Pengeluaran → tombol + merah, form terkunci untuk pengeluaran
- Pencarian berdasarkan catatan **dan nama kategori**
- Filter bulan/tahun

### Budget
- Atur budget per kategori (per bulan/tahun)
- Progress bar per kategori (hijau/kuning/merah)
- Klik kartu → **drill-down transaksi** kategori tersebut
- Ringkasan **Total Budget** & **Selisih Budget** (Pemasukan − Budget)

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

---

## Update Terbaru — Agustus 2026

- Tombol **Hapus** untuk tabungan aktif (tanpa harus diselesaikan dulu) + konfirmasi
- Fitur **Pin tabungan** (tombol pin di kartu, menggantikan long-press)
- **Dashboard**: toggle saldo Bulan Ini ↔ Keseluruhan + tombol mata untuk sembunyikan angka
- Budget: card **Selisih Budget** (Pemasukan − Budget) menggantikan "Terpakai"
- Transaksi: **FAB sesuai filter** (Semua tanpa FAB, Pemasukan biru, Pengeluaran merah, form terkunci jenis)
- Perbaikan bug: klik Edit/Hapus di kartu Budget tidak lagi membuka modal drill-down, konfirmasi hapus catatan tabungan, input nominal titik ribuan
- **Performance**: code-split per halaman (bundle awal 900 KB → 235 KB)
- Laporan: periode **Semua Waktu**; pencarian transaksi termasuk nama kategori
- Migrasi chart **Recharts → Chart.js** (memperbaiki glitch grafik di Android)

---

## Tech Stack

| Teknologi | Kegunaan |
|---|---|
| React 19 + TypeScript | UI & tipe aman |
| Vite 8 + Tailwind CSS 4 | Build & styling |
| Dexie.js (IndexedDB) | Database lokal (5 tabel) |
| Zustand | State management |
| React Router 7 | Navigasi |
| Chart.js | Grafik |
| vite-plugin-pwa | PWA / offline |
| SheetJS (xlsx) | Export Excel |

---

## Data Privacy & Security

**Semua data tersimpan LOKAL di device kamu.**

- Data disimpan di IndexedDB (database browser)
- Tidak ada data yang dikirim ke server
- Tidak ada backend/server - murni client-side
- Hosting hanya menyimpan kode app, bukan data user
- Setiap user terisolasi total satu sama lain

> ⚠️ Penting:
> - Jika clear browser data → data hilang
> - Jika ganti HP → data tidak otomatis pindah
> - Gunakan fitur Backup/Restore untuk export/import data

## Cara Install PWA

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
