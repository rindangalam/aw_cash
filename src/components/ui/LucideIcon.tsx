import {
  Briefcase, Laptop, TrendingUp, Wallet, UtensilsCrossed, Car,
  ShoppingBag, Receipt, Heart, Gamepad2, GraduationCap, Package,
  Home, PieChart, BarChart3, Settings, Plus, Pencil, Trash2,
  Sun, Moon, Monitor, Download, Upload, Search, X, Calendar,
  ArrowUpRight, ArrowDownRight, ArrowDownLeft, ArrowLeft,
  TrendingDown, FileText, CircleAlert, Loader2,
  ChevronLeft, ChevronRight, Check, RotateCcw,
  Smartphone, Plane, Shield, Gift, Umbrella, Camera, Music,
} from 'lucide-react';
import type { CSSProperties } from 'react';

function ChickenBank({ size = 20, className, style }: { size?: number; className?: string; style?: CSSProperties }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M12 17c-3.5 0-6-2.5-6-6 0-3.5 2.5-6 6-6 2 0 3.5.8 4.5 2" />
      <path d="M16.5 7.2c.8-.8 1.5-1.7 1.5-3.2 0-1.1-.9-2-2-2s-2 .9-2 2" />
      <circle cx="13" cy="9" r="0.5" fill="currentColor" />
      <path d="M17 10c1.5.5 2.5 1.5 2.5 3 0 1.5-1 2.5-2.5 2.5" />
      <path d="M7 11c-1.5.5-2.5 1.5-2.5 3 0 1.5 1 2.5 2.5 2.5" />
      <path d="M12 17v3" />
      <path d="M9 20h6" />
      <path d="M10 5l1 2" />
      <path d="M14 5l-1 2" />
    </svg>
  );
}

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string; style?: CSSProperties }>> = {
  Briefcase, Laptop, TrendingUp, Wallet, UtensilsCrossed, Car,
  ShoppingBag, Receipt, Heart, Gamepad2, GraduationCap, Package,
  Home, PieChart, BarChart3, Settings, Plus, Pencil, Trash2,
  Sun, Moon, Monitor, Download, Upload, Search, X, Calendar,
  ArrowUpRight, ArrowDownRight, ArrowDownLeft, ArrowLeft,
  TrendingDown, FileText, CircleAlert, Loader2,
  ChevronLeft, ChevronRight, Check, RotateCcw, ChickenBank,
  Smartphone, Plane, Shield, Gift, Umbrella, Camera, Music,
};

export function LucideIcon({ name, size = 20, className, style }: { name: string; size?: number; className?: string; style?: CSSProperties }) {
  const Icon = iconMap[name];
  if (!Icon) return <Package size={size} className={className} style={style} />;
  return <Icon size={size} className={className} style={style} />;
}
