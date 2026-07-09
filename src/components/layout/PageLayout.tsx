import type { ReactNode } from 'react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';

interface PageLayoutProps {
  title: string;
  rightAction?: React.ReactNode;
  children: ReactNode;
}

export function PageLayout({ title, rightAction, children }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-bg dark:bg-bg-dark">
      <Header title={title} rightAction={rightAction} />
      <main className="pb-20 px-4 pt-4 max-w-lg mx-auto">{children}</main>
      <BottomNav />
    </div>
  );
}
