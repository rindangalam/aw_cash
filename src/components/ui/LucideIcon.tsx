import {
  Briefcase, Laptop, TrendingUp, Wallet, UtensilsCrossed, Car,
  ShoppingBag, Receipt, Heart, Gamepad2, GraduationCap, Package,
  Home, PieChart, BarChart3, Settings, Plus, Pencil, Trash2,
  Sun, Moon, Monitor, Download, Upload, Search, X, Calendar,
  ArrowUpRight, ArrowDownRight, TrendingDown, FileText, CircleAlert,
  Loader2, ChevronLeft, ChevronRight,
} from 'lucide-react';
import type { CSSProperties } from 'react';

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string; style?: CSSProperties }>> = {
  Briefcase, Laptop, TrendingUp, Wallet, UtensilsCrossed, Car,
  ShoppingBag, Receipt, Heart, Gamepad2, GraduationCap, Package,
  Home, PieChart, BarChart3, Settings, Plus, Pencil, Trash2,
  Sun, Moon, Monitor, Download, Upload, Search, X, Calendar,
  ArrowUpRight, ArrowDownRight, TrendingDown, FileText, CircleAlert,
  Loader2, ChevronLeft, ChevronRight,
};

export function LucideIcon({ name, size = 20, className, style }: { name: string; size?: number; className?: string; style?: CSSProperties }) {
  const Icon = iconMap[name];
  if (!Icon) return <Package size={size} className={className} style={style} />;
  return <Icon size={size} className={className} style={style} />;
}
