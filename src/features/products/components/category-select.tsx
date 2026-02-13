'use client';

import { cn } from '@/lib/utils';
import type { CategoryOption } from '../types';

interface CategorySelectProps {
  categories: CategoryOption[];
  value: string;
  onChange: (slug: string) => void;
  className?: string;
}

export function CategorySelect({
  categories,
  value,
  onChange,
  className,
}: CategorySelectProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <label
        htmlFor="category"
        className="text-sm font-medium text-foreground whitespace-nowrap sr-only sm:not-sr-only"
      >
        Category
      </label>
      <select
        id="category"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Filter products by category"
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat.slug} value={cat.slug}>
            {cat.name}
          </option>
        ))}
      </select>
    </div>
  );
}
