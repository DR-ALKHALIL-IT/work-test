import { fetchJson } from '@/lib/api';
import type { CategoryOption } from '../../types';

export async function getCategories(): Promise<CategoryOption[]> {
  const data = await fetchJson<Array<{ slug: string; name: string }>>(
    '/products/categories'
  );
  return data.map((c) => ({ slug: c.slug, name: c.name }));
}
