# Changelog

Semua perubahan penting pada AW Cash dicatat di file ini.

Format mengikuti [Keep a Changelog](https://keepachangelog.com/id-ID/1.1.0/), dan versi mengikuti [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [1.0.0]

### Added
- **Kategori custom pengeluaran**: tombol + di Tambah Budget (menggantikan "Lainnya"), kategori otomatis muncul di pilihan kategori pengeluaran; ikut di-backup/restore
- Ringkasan **Sisa Budget** (Total Budget − terpakai, berkurang saat dipakai) & **Uang di Luar Budget** (Pemasukan − Budget − pengeluaran non-budget, termasuk setor tabungan)
- Tombol **Hapus** untuk tabungan aktif (tanpa harus diselesaikan dulu)
- Fitur **Pin tabungan** (tombol pin di kartu)
- **Dashboard**: toggle saldo Bulan Ini ↔ Keseluruhan + tombol mata untuk sembunyikan angka
- Transaksi: **FAB sesuai filter** (Semua tanpa FAB, Pemasukan biru, Pengeluaran merah, form terkunci jenis)
- Laporan: periode **Semua Waktu**
- Pencarian transaksi termasuk nama kategori

### Changed
- Card "Selisih Budget" → **Sisa Budget** & **Uang di Luar Budget**
- Long-press tabungan → tombol Edit/Pin/Hapus di kartu
- Backup data v3 (termasuk kategori custom)

### Fixed
- Klik Edit/Hapus di kartu Budget tidak lagi membuka modal drill-down
- Konfirmasi hapus catatan tabungan
- Input nominal titik ribuan
- Migrasi chart **Recharts → Chart.js** (memperbaiki glitch grafik di Android)

### Performance
- Code-split per halaman (bundle awal 900 KB → 235 KB)
