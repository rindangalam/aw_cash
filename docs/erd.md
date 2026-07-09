# ERD — AW Cash

## Database: IndexedDB (via Dexie.js)

```
┌─────────────────────────────────────────────────────────────────┐
│                        AWCashDB                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │  transactions   │  │    budgets      │  │    settings     │ │
│  ├─────────────────┤  ├─────────────────┤  ├─────────────────┤ │
│  │ id (PK, auto)   │  │ id (PK, auto)   │  │ key (PK)        │ │
│  │ type            │  │ category        │  │ value           │ │
│  │ category        │  │ amount          │  │                 │ │
│  │ amount          │  │ month           │  │                 │ │
│  │ date            │  │ year            │  │                 │ │
│  │ note            │  │ createdAt       │  │                 │ │
│  │ createdAt       │  │ updatedAt       │  │                 │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Table Details

### transactions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | number | auto | Primary key, auto-increment |
| type | 'income' \| 'expense' | ✓ | Tipe transaksi |
| category | string | ✓ | ID kategori (lihat constants) |
| amount | number | ✓ | Nominal transaksi (positif) |
| date | string | ✓ | ISO date string (YYYY-MM-DD) |
| note | string | - | Catatan tambahan |
| createdAt | string | ✓ | ISO datetime string |

**Indexes**: `type`, `category`, `date`

---

### budgets

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | number | auto | Primary key, auto-increment |
| category | string | ✓ | ID kategori |
| amount | number | ✓ | Budget nominal |
| month | number | ✓ | Bulan (1-12) |
| year | number | ✓ | Tahun |
| createdAt | string | ✓ | ISO datetime string |
| updatedAt | string | - | ISO datetime string |

**Indexes**: `category`, `[month+year]` (compound)

**Unique**: `[category+month+year]` — satu budget per kategori per bulan

---

### settings

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| key | string | ✓ | Primary key (e.g., 'theme', 'currency') |
| value | string | ✓ | Nilai setting |

**Predefined keys**:
- `theme`: 'light' | 'dark' | 'system'
- `currency`: 'IDR' | 'USD' | lainnya
- `lastBackup`: ISO datetime string

---

## Kategori Default

```typescript
// src/lib/constants.ts

export const CATEGORIES = {
  income: [
    { id: 'salary', name: 'Gaji', icon: '💼', color: '#22C55E' },
    { id: 'freelance', name: 'Freelance', icon: '💻', color: '#3B82F6' },
    { id: 'investment', name: 'Investasi', icon: '📈', color: '#8B5CF6' },
    { id: 'other_income', name: 'Lainnya', icon: '💰', color: '#6B7280' },
  ],
  expense: [
    { id: 'food', name: 'Makanan', icon: '🍔', color: '#EF4444' },
    { id: 'transport', name: 'Transport', icon: '🚗', color: '#F97316' },
    { id: 'shopping', name: 'Belanja', icon: '🛒', color: '#EC4899' },
    { id: 'bills', name: 'Tagihan', icon: '📄', color: '#8B5CF6' },
    { id: 'health', name: 'Kesehatan', icon: '🏥', color: '#14B8A6' },
    { id: 'entertainment', name: 'Hiburan', icon: '🎮', color: '#F59E0B' },
    { id: 'education', name: 'Pendidikan', icon: '📚', color: '#3B82F6' },
    { id: 'other_expense', name: 'Lainnya', icon: '📦', color: '#6B7280' },
  ],
};
```

---

## TypeScript Types

```typescript
// src/types/index.ts

export interface Transaction {
  id?: number;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  date: string;
  note?: string;
  createdAt: string;
}

export interface Budget {
  id?: number;
  category: string;
  amount: number;
  month: number;
  year: number;
  createdAt: string;
  updatedAt?: string;
}

export interface Setting {
  key: string;
  value: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}
```

---

## Relationships

```
transactions.category ──→ CATEGORIES[id]
budgets.category ──→ CATEGORIES[id]
```

Tidak ada foreign key di IndexedDB, relasi dilakukan di application layer melalui constant ID.
