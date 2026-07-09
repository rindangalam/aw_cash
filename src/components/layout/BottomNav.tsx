import { NavLink } from 'react-router-dom';
import { LucideIcon } from '../ui/LucideIcon';

const navItems = [
  { to: '/', label: 'Beranda', icon: 'Home' },
  { to: '/transactions', label: 'Transaksi', icon: 'Wallet' },
  { to: '/budget', label: 'Budget', icon: 'PieChart' },
  { to: '/savings', label: 'Tabungan', icon: 'PiggyBank' },
  { to: '/reports', label: 'Laporan', icon: 'BarChart3' },
  { to: '/settings', label: 'Lainnya', icon: 'Settings' },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-surface/80 dark:bg-surface-dark/80 backdrop-blur-xl border-t border-border/50 dark:border-border-dark/50">
      <div className="flex justify-around items-center h-[68px] max-w-lg mx-auto px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl transition-all duration-200 relative ${
                isActive
                  ? 'text-primary'
                  : 'text-text-secondary dark:text-text-secondary-dark hover:text-text dark:hover:text-text-dark'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-5 h-[3px] bg-primary rounded-full" />
                )}
                <LucideIcon
                  name={item.icon}
                  size={22}
                  className={isActive ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}
                />
                <span className={`text-[10px] ${isActive ? 'font-semibold' : 'font-medium'}`}>
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
