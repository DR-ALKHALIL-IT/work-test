import { fetchJson } from '@/lib/api';
import { buildQueryString } from '@/lib/utils';
import type { ProductsResponse, SearchParams } from '../../types';

export async function searchProducts(
  params: SearchParams,
  signal?: AbortSignal
): Promise<ProductsResponse> {
  const queryString = buildQueryString(params);
  return fetchJson<ProductsResponse>(`/products/search${queryString}`, { signal });
}
