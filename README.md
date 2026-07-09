# AW Cash

Aplikasi manajemen keuangan personal offline-first (PWA).

## Fitur

### Dashboard
- Ringkasan saldo bulanan (pemasukan - pengeluaran)
- Perbandingan bulanan (bulan ini vs bulan lalu)
- Grafik pie pengeluaran per kategori
- Grafik trend 6 bulan terakhir
- Widget tabungan (total & progress)
- Spending alerts (warning jika budget > 75%)

### Transaksi
- Catat pemasukan & pengeluaran
- 8 kategori pemasukan (Gaji, Freelance, Investasi, dll)
- 8 kategori pengeluaran (Makanan, Transport, Belanja, dll)
- Filter & search transaksi
- Toggle list/calendar view
- Edit & hapus transaksi

### Budget
- Atur budget per kategori per bulan
- Progress bar real-time
- Alert jika mendekati batas budget

### Tabungan
- Buat multiple savings goals (Dana Darurat, Liburan, Beli HP, dll)
- Catat setor & ambil manual
- Kolom catatan/deskripsi
- Progress bar per goal
- Deadline tracking
- Goal bisa ditutup/dihapus
- Widget di dashboard

### Laporan
- Grafik perbandingan bulanan
- Breakdown per kategori
- Export data ke CSV

### Pengaturan
- Light/Dark/System theme
- Backup & restore data (JSON)
- Format currency: IDR (Rp)

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
