import { fetchJson } from '@/lib/api';
import type { Product } from '../../types';

export async function updateProduct(
  id: number,
  updates: Partial<Omit<Product, 'id'>>,
  method: 'PUT' | 'PATCH' = 'PATCH',
  signal?: AbortSignal
): Promise<Product> {
  return fetchJson<Product>(`/products/${id}`, {
    method,
    body: JSON.stringify(updates),
    signal,
  });
}
