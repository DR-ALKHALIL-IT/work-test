'use client';

import { cn } from '@/lib/utils';
import type { SortOption, SortOrder } from '../types';

interface SortSelectProps {
  sortBy: SortOption;
  order: SortOrder;
  onSortChange: (sortBy: SortOption, order: SortOrder) => void;
  className?: string;
}

export function SortSelect({ sortBy, order, onSortChange, className }: SortSelectProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [newSortBy, newOrder] = e.target.value.split('-') as [SortOption, SortOrder];
    onSortChange(newSortBy, newOrder);
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <label 
        htmlFor="sort" 
        className="text-sm font-medium text-foreground whitespace-nowrap sr-only sm:not-sr-only"
      >
        Sort by
      </label>
      <select
        id="sort"
        value={`${sortBy}-${order}`}
        onChange={handleChange}
        className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Sort products by"
      >
        <option value="title-asc">Name (A-Z)</option>
        <option value="title-desc">Name (Z-A)</option>
        <option value="price-asc">Price (Low to High)</option>
        <option value="price-desc">Price (High to Low)</option>
        <option value="rating-desc">Rating (High to Low)</option>
      </select>
    </div>
  );
}
