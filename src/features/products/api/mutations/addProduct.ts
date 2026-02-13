import { fetchJson } from '@/lib/api';
import type { Product } from '../../types';

export async function addProduct(
  product: Omit<Product, 'id'>,
  signal?: AbortSignal
): Promise<Product> {
  return fetchJson<Product>('/products/add', {
    method: 'POST',
    body: JSON.stringify(product),
    signal,
  });
}
