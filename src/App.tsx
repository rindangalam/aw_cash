import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { registerCustomCategories } from './lib/constants';
import db from './lib/db';

const Dashboard = lazy(() => import('./pages/Dashboard').then((m) => ({ default: m.Dashboard })));
const Transactions = lazy(() => import('./pages/Transactions').then((m) => ({ default: m.Transactions })));
const Budget = lazy(() => import('./pages/Budget').then((m) => ({ default: m.Budget })));
const Reports = lazy(() => import('./pages/Reports').then((m) => ({ default: m.Reports })));
const Settings = lazy(() => import('./pages/Settings').then((m) => ({ default: m.Settings })));
const Savings = lazy(() => import('./pages/Savings').then((m) => ({ default: m.Savings })));
const SavingsDetail = lazy(() => import('./pages/SavingsDetail').then((m) => ({ default: m.SavingsDetail })));

function PageFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner />
    </div>
  );
}

function App() {
  useEffect(() => {
    db.customCategories.toArray().then((data) => {
      registerCustomCategories(data);
    });
  }, []);

  return (
    <BrowserRouter>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/savings" element={<Savings />} />
          <Route path="/savings/:id" element={<SavingsDetail />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
