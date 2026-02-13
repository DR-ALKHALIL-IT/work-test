import { fetchJson } from '@/lib/api';
import type { Product } from '../../types';

export async function deleteProduct(
  id: number,
  signal?: AbortSignal
): Promise<Product> {
  return fetchJson<Product>(`/products/${id}`, {
    method: 'DELETE',
    signal,
  });
}
