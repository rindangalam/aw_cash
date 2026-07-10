import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  accent?: 'sky' | 'red' | 'amber' | 'violet';
}

const accentBorder = {
  sky: 'border-l-sky-500',
  red: 'border-l-red-500',
  amber: 'border-l-amber-500',
  violet: 'border-l-violet-500',
};

export function Card({ children, className = '', onClick, accent }: CardProps) {
  return (
    <div
      className={`bg-surface dark:bg-surface-dark rounded-2xl p-4 border border-border dark:border-border-dark shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.06)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2),0_1px_2px_rgba(0,0,0,0.12)] ${accent ? `border-l-[3px] ${accentBorder[accent]}` : ''} ${onClick ? 'cursor-pointer active:scale-[0.98] transition-transform' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
