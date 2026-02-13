import { getStockStatus, type StockStatus } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface StockBadgeProps {
  stock: number;
  className?: string;
}

const VARIANTS: Record<StockStatus, { text: string; className: string }> = {
  out: { text: 'Out of Stock', className: 'bg-destructive/10 text-destructive border-destructive/30' },
  low: { text: 'Low Stock', className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30' },
  in: { text: 'In Stock', className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' },
};

export function StockBadge({ stock, className }: StockBadgeProps) {
  const status = getStockStatus(stock);
  const { text, className: variantClass } = VARIANTS[status];

  return (
    <Badge className={cn('border', variantClass, className)}>
      {text}
    </Badge>
  );
}
