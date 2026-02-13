import { fetchJson } from '@/lib/api';
import type { ProductsResponse } from '../../types';

export async function getAllProducts(signal?: AbortSignal): Promise<ProductsResponse> {
  return fetchJson<ProductsResponse>('/products', { signal });
}
