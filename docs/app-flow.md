# App Flow — AW Cash

## Navigation Structure

```
┌─────────────────────────────────────────┐
│              AW Cash Header             │
├─────────────────────────────────────────┤
│                                         │
│              [Page Content]             │
│                                         │
├─────────────────────────────────────────┤
│  🏠      💰      📊      📈      ⚙️   │
│ Home  Transaksi Budget  Laporan Setting │
└─────────────────────────────────────────┘
```

## Flow per Halaman

### 1. Dashboard (Home)

```
User buka app
    ↓
Lihat summary cards:
  - Saldo saat ini (Pemasukan - Pengeluaran)
  - Total Pemasukan bulan ini
  - Total Pengeluaran bulan ini
    ↓
Lihat grafik:
  - Pie chart: Pengeluaran per kategori
  - Line chart: Trend 6 bulan terakhir
    ↓
Klik "Tambah Transaksi" → buka modal form
Klik "Lihat Semua" → pindah ke halaman Transaksi
```

### 2. Transaksi

```
Halaman Transaksi
    ↓
Filter bar:
  - Toggle: Semua | Pemasukan | Pengeluaran
  - Pilih bulan/tahun
  - Search by catatan
    ↓
List transaksi (sorted by date terbaru)
  - Set item: kategori icon, nama kategori, catatan, nominal, tanggal
  - Swipe/klik untuk edit atau delete
    ↓
FAB (+) → Buka modal Tambah/Edit Transaksi
```

### 3. Form Transaksi (Modal)

```
User klik tambah/edit
    ↓
Form fields:
  - Type: Pemasukan / Pengeluaran (toggle button)
  - Kategori: dropdown pilihan
  - Nominal: input angka
  - Tanggal: date picker (default: hari ini)
  - Catatan: text input (optional)
    ↓
Validasi:
  - Kategori wajib diisi
  - Nominal harus > 0
    ↓
Simpan → tutup modal → refresh list
```

### 4. Budget

```
Halaman Budget
    ↓
Pilih bulan/tahun
    ↓
List budget per kategori:
  - Nama kategori
  - Budget amount vs Actual amount
  - Progress bar:
    - Hijau: < 75% terpakai
    - Kuning: 75-90% terpakai
    - Merah: > 90% atau over budget
    ↓
Klik "+ Tambah Budget"
  - Pilih kategori
  - Set nominal budget
  - Bulan/tahun otomatis dari filter
    ↓
Klik budget item → Edit atau Hapus
```

### 5. Laporan

```
Halaman Laporan
    ↓
Filter:
  - Periode: Mingguan | Bulanan | Tahunal
  - Pilih tanggal spesifik
    ↓
Summary:
  - Total Pemasukan
  - Total Pengeluaran
  - Selisih (Surplus/Defisit)
    ↓
Tabel breakdown per kategori:
  - Kategori | Jumlah Transaksi | Total Nominal | Persentase
    ↓
Tombol "Export CSV" → download file
```

### 6. Pengaturan (Settings)

```
Halaman Settings
    ↓
Menu:
  - Tema: Terang / Gelap (toggle)
  - Mata Uang: IDR (default)
  - Backup Data → download JSON
  - Restore Data → upload JSON
  - Tentang Aplikasi
    ↓
Restore: konfirmasi dialog sebelum replace data
```

## Data Flow

```
User Action → Component → Hook → Dexie.js → IndexedDB
                                    ↓
                              Update State (Zustand)
                                    ↓
                              Re-render Component
```

## Offline Behavior

1. Semua data tersimpan di IndexedDB (lokal)
2. Tidak ada network request
3. Service worker cache semua aset
4. Bisa diinstall sebagai PWA dari browser
