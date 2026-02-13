import { getStockStatus, type StockStatus } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface StockBadgeProps {
  stock: number;
  className?: string;
}

const VARIANTS: Record<StockStatus, { text: string; className: string }> = {
  out: { text: 'Out of Stock', className: 'bg-red-100 text-red-700 border-red-200' },
  low: { text: 'Low Stock', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  in: { text: 'In Stock', className: 'bg-green-100 text-green-700 border-green-200' },
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
