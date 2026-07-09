import { type ReactNode, useEffect } from 'react';
import { LucideIcon } from './LucideIcon';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-surface dark:bg-surface-dark w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl p-6 shadow-2xl animate-slide-up max-h-[85vh] overflow-y-auto">
        {title && (
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-text dark:text-text-dark tracking-tight">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-2 -mr-2 rounded-xl hover:bg-surface-alt dark:hover:bg-surface-alt-dark text-text-secondary dark:text-text-secondary-dark transition-colors cursor-pointer"
            >
              <LucideIcon name="X" size={18} />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
