'use client';

import { useState, useEffect } from 'react';
import { getCategoryList } from '@/features/categories/api/getCategoryList';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface CategorySelectProps {
  value: string | undefined;
  onChange: (category: string | undefined) => void;
  className?: string;
}

interface Category {
  slug: string;
  name: string;
}

export function CategorySelect({ value, onChange, className }: CategorySelectProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    getCategoryList(controller.signal)
      .then(setCategories)
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const handleValueChange = (val: string) => {
    onChange(val === 'all' ? undefined : val);
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <label
        htmlFor="category"
        className="text-sm font-medium text-foreground whitespace-nowrap sr-only sm:not-sr-only"
      >
        Category
      </label>
      <Select value={value ?? 'all'} onValueChange={handleValueChange} disabled={loading}>
        <SelectTrigger id="category" className="w-full sm:w-[180px]" aria-label="Filter by category">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((cat) => (
            <SelectItem key={cat.slug} value={cat.slug}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
