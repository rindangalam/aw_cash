# AW Cash

> **Offline-first personal finance management PWA**  
> Complete financial control stored locally on your device — no server, no internet required, no data leaks.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![PWA](https://img.shields.io/badge/PWA-Enabled-4285F4?logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![Offline-first](https://img.shields.io/badge/Offline--first-100%25-16a34a)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Offline_and_background_operation)
[![License](https://img.shields.io/badge/License-MIT-16a34a)](LICENSE)

---

## 📋 Overview

**AW Cash** is an offline-first personal finance management application built as a Progressive Web App (PWA). All data is stored locally on your device using IndexedDB — no backend servers, no internet dependency, and complete privacy control.

### Core Philosophy
- **Privacy-first**: All data stays on your device
- **Offline-capable**: Works without internet connection
- **Zero backend**: Pure client-side application
- **Simple & powerful**: Easy to use with comprehensive features

---

## ✨ Features

### 💰 Dashboard
- **Balance toggle** — Switch between current month and total balance with one tap
- **Privacy mode** — Hide/show all numbers with eye icon button
- **Visual analytics**:
  - Pie chart for expenses by category
  - 6-month trend line chart
  - Monthly comparison bar chart
- **Smart alerts** — Budget warnings when spending approaches limits
- **Savings summary** — Track progress toward savings goals

### 📝 Transactions
- **Quick entry** — Add income/expense with category, date, and notes
- **Dual view modes** — List view or calendar view
- **Smart filtering**:
  - All transactions (view only, no add button)
  - Income only (blue FAB, form locked to income)
  - Expense only (red FAB, form locked to expense)
- **Search** — Find transactions by note text or category name
- **Date filtering** — Filter by month/year

### 📊 Budget Management
- **Category budgets** — Set monthly or yearly budgets per category
- **Visual progress** — Color-coded progress bars (green/yellow/red)
- **Drill-down analysis** — Click any category card to see detailed transactions
- **Smart summaries**:
  - Remaining budget (decreases as budget is consumed)
  - Money outside budget (Income − Budget − non-budgeted expenses)
- **Custom categories** — Create custom expense categories directly from budget form

### 🎯 Savings Goals
- **Goal tracking** — Create savings goals with target amount, deadline, icon, and color
- **Deposit/Withdraw** — Automatically recorded as transactions
- **Goal management**:
  - Pin important goals to top
  - Edit goals inline
  - Delete with confirmation
- **Transaction history** — View deposit/withdrawal history per goal with delete confirmation

### 📈 Reports
- **Flexible periods** — Weekly / Monthly / Yearly / All Time
- **Category breakdown** — Income and expense analysis by category
- **Excel export** — Download complete data as .xlsx file with 4 sheets:
  - Transactions
  - Budgets
  - Savings Goals
  - Savings Records

### ⚙️ Settings
- **Theme control** — Light / Dark / System
- **Data management** — Backup and restore data (JSON format)

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | UI library with modern features |
| **TypeScript (strict)** | Type-safe development |
| **Vite 8** | Lightning-fast build tool |
| **Tailwind CSS 4** | Utility-first styling |
| **Dexie.js** | IndexedDB wrapper (6 tables) |
| **Zustand** | Lightweight state management |
| **React Router 7** | Client-side routing |
| **Chart.js** | Data visualization |
| **vite-plugin-pwa** | PWA / offline capabilities |
| **SheetJS (xlsx)** | Excel export functionality |

---

## 📁 Project Structure

```
aw_cash/
├── src/
│   ├── components/
│   │   ├── ui/                 # UI primitives (Button, Input, Modal, Card, Badge, etc.)
│   │   ├── layout/             # Header, BottomNav, PageLayout
│   │   └── ...                 # Feature components (BudgetCard, SavingsGoalCard, etc.)
│   ├── pages/                  # Route pages
│   │   ├── Dashboard.tsx
│   │   ├── Transactions.tsx
│   │   ├── Budget.tsx
│   │   ├── Savings.tsx
│   │   ├── Reports.tsx
│   │   └── Settings.tsx
│   ├── hooks/                  # Custom hooks
│   │   ├── useTransactions.ts
│   │   ├── useBudget.ts
│   │   ├── useSavings.ts
│   │   └── useSettings.ts
│   ├── stores/                 # Zustand state stores
│   ├── lib/                    # Core utilities
│   │   ├── db.ts               # Dexie database schema
│   │   ├── constants.ts        # App constants
│   │   ├── utils.ts            # Helper functions
│   │   └── export.ts           # Excel export logic
│   └── types/                  # TypeScript interfaces
├── public/                     # Static assets
├── scripts/                    # Build scripts
├── CHANGELOG.md                # Version history
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 20.19+ or 22.12+
- **npm** (comes with Node.js)

### Installation

```bash
# Clone repository
git clone https://github.com/rindangalam/aw_cash.git
cd aw_cash

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
# TypeScript check + production build
npm run build

# Preview production build locally
npm run preview
```

### Linting

```bash
# Run oxlint
npm run lint
```

---

## 📱 Installing as PWA

### Android (Chrome/Edge)
1. Open the app in Chrome or Edge browser
2. Tap the menu icon (three dots)
3. Select **"Install app"** or **"Add to Home Screen"**
4. Follow the on-screen instructions
5. App icon appears on home screen

### iOS (Safari)
1. Open the app in Safari browser
2. Tap the **Share** button (square with arrow)
3. Scroll and tap **"Add to Home Screen"**
4. Tap **"Add"**
5. App icon appears on home screen

### Desktop (Chrome/Edge)
1. Look for install icon in address bar
2. Click **"Install"** button
3. App opens in standalone window

### After Installation
- Launch app like any native app
- Works completely offline (after first load)
- All data remains stored locally
- Updates automatically when online

---

## 🗄️ Database Schema

**6 IndexedDB Tables via Dexie:**

1. **transactions** — Income and expense records
2. **categories** — Expense and income categories
3. **budgets** — Budget limits per category
4. **savings_goals** — Savings targets
5. **savings_records** — Deposit/withdrawal history
6. **settings** — User preferences (theme, etc.)

---

## 🔐 Privacy & Data Security

### 100% Local Storage
- All data stored in **IndexedDB** (browser database)
- **No data sent to any server**
- **No backend/server** — pure client-side application
- Hosting only serves static files (HTML/JS/CSS)
- Each user's data is completely isolated

### Important Considerations

⚠️ **Data Loss Scenarios:**
- Clearing browser data will delete all transactions
- Switching devices won't transfer data automatically
- Uninstalling PWA may clear data (browser-dependent)

✅ **Data Protection:**
- Use **Backup** feature regularly (exports JSON file)
- Use **Restore** feature to import backup on new device
- Keep backup files in safe location (cloud storage, USB drive)

---

## 🎨 Features in Detail

### Smart Context Filtering
The transaction page FAB (Floating Action Button) changes based on selected filter:
- **All** filter → No FAB (view-only mode)
- **Income** filter → Blue FAB (add income only)
- **Expense** filter → Red FAB (add expense only)

### Budget Intelligence
- Budget cards show real-time progress
- Color indicators: Green (safe) → Yellow (warning) → Red (exceeded)
- Click any budget card to drill down into specific category transactions
- Remaining budget calculation accounts for all spending

### Savings Goal Features
- Visual progress bars with percentage completion
- Pin frequently accessed goals to top of list
- Color-coded goals for easy identification
- Automatic transaction recording for deposits/withdrawals

### Excel Export Structure
4-sheet workbook includes:
1. **Transactions** — All income/expense records with dates and categories
2. **Budgets** — Current budget settings per category
3. **Savings Goals** — Target amounts, deadlines, and progress
4. **Savings Records** — Detailed deposit/withdrawal history

---

## 🧪 Development Conventions

### Commit Messages
Follow conventional commits:
- `feat:` — New features
- `fix:` — Bug fixes
- `refactor:` — Code refactoring
- `style:` — UI/styling changes
- `docs:` — Documentation updates
- `perf:` — Performance improvements

### TypeScript
- **Strict mode** enabled
- All components fully typed
- No `any` types (use proper interfaces)

### Code Quality
- Run `npm run build` before committing
- Ensure TypeScript compilation passes
- Use oxlint for code consistency

---

## 🚀 Deployment

### Static Hosting Options
Since this is a pure client-side app, deploy to any static hosting:

- **Vercel**: Connect GitHub repo, auto-deploy
- **Netlify**: Drag-and-drop build folder or connect repo
- **GitHub Pages**: Enable in repository settings
- **Cloudflare Pages**: Connect repo for auto-deployment

Build command: `npm run build`  
Output directory: `dist`

---

## 📊 Performance

- **Offline-first**: Works without internet after initial load
- **Fast**: Vite HMR for instant development feedback
- **Lightweight**: Minimal dependencies, optimized bundle
- **Installable**: PWA capabilities for native-like experience

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the [MIT License](LICENSE).

Copyright © 2026 rindangalam

---

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for complete version history.

---

## 👤 Author

**Rindang Alam Nur Muhammad**  
GitHub: [@rindangalam](https://github.com/rindangalam)

---

## 🙏 Acknowledgments

Built with:
- [React](https://react.dev/) - UI library
- [Vite](https://vitejs.dev/) - Build tool
- [Dexie.js](https://dexie.org/) - IndexedDB wrapper
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework
- [Chart.js](https://www.chartjs.org/) - Data visualization
- [Zustand](https://zustand-demo.pmnd.rs/) - State management

---

## 📧 Support

For issues or feature requests:
- Open an issue on [GitHub Issues](https://github.com/rindangalam/aw_cash/issues)
- Check [CHANGELOG.md](CHANGELOG.md) for recent updates

---

*Take control of your finances. Completely offline. Completely private.*
