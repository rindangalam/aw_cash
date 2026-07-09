# AGENTS.md — AW Cash

## Project Overview

**AW Cash** adalah aplikasi PWA manajemen keuangan personal yang berjalan offline dengan data tersimpan lokal di IndexedDB.

- **Tech Stack**: React 18 + TypeScript + Vite + Tailwind CSS 4
- **Database**: Dexie.js (IndexedDB wrapper)
- **State Management**: Zustand
- **Charts**: Recharts
- **Routing**: React Router v7
- **PWA**: vite-plugin-pwa

## Development Rules

### Code Style

- TypeScript strict mode
- Functional components + hooks only
- Naming: `camelCase` untuk variables/functions, `PascalCase` untuk components/interfaces
- File naming: `PascalCase.tsx` untuk components, `camelCase.ts` untuk utils/hooks/stores
- Selalu gunakan type/interface, jangan pakai `any`
- Tailwind CSS untuk semua styling — NO inline styles
- Components di `src/components/`, pages di `src/pages/`

### Database Convention

- Semua database logic di `src/lib/db.ts`
- Hook untuk akses data: `useTransactions.ts`, `useBudget.ts`, `useSettings.ts`
- Format currency default: IDR (Rp)
- Semua tanggal disimpan sebagai ISO string

### File Structure

```
src/
├── components/ui/       # Reusable UI primitives (Button, Input, Modal, Card)
├── components/layout/   # Header, BottomNav, PageLayout
├── components/          # Feature-specific components
├── pages/               # Route pages
├── hooks/               # Custom hooks (useTransactions, useBudget, useSettings)
├── stores/              # Zustand stores
├── lib/                 # db.ts, utils.ts, constants.ts
└── types/               # TypeScript interfaces
```

### Commit Convention

- `feat:` fitur baru
- `fix:` bug fix
- `refactor:` refactor tanpa ubah fungsionalitas
- `style:` styling changes
- `docs:` dokumentasi

### MUST DO Setiap Session

1. Baca `docs/phases.md` untuk tahu posisi saat ini
2. Baca `docs/app-flow.md` untuk referensi flow
3. Baca `docs/erd.md` untuk referensi database
4. Run `npm run lint` dan `npm run build` setelah selesai
5. Update `docs/phases.md` setelah menyelesaikan phase

###禁忌 (Larangan)

- JANGAN pakai library UI external (MUI, Chakra, dll) — buat custom
- JANGAN pakai backend/server — full offline
- JANGAN gunakan `any` type
- JANGAN hardcode values — gunakan constants
- JANGAN skip TypeScript types
- JANGAN menambah fitur di luar scope tanpa approval user
