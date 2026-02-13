import { fetchJson } from '@/lib/api';
import { buildQueryString } from '@/lib/utils';
import type { ProductsResponse } from '../../types';

export async function getProductsPaginated(
  limit: number,
  skip: number,
  signal?: AbortSignal
): Promise<ProductsResponse> {
  const queryString = buildQueryString({ limit, skip });
  return fetchJson<ProductsResponse>(`/products${queryString}`, { signal });
}
