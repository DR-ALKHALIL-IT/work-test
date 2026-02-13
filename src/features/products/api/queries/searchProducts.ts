import { fetchJson } from '@/lib/api';
import { buildQueryString } from '@/lib/utils';
import type { ProductsResponse, SearchParams } from '../../types';

/**
 * GET /products/search - Search products.
 * Passes sortBy and order when supported by the API.
 * DummyJSON search endpoint may not support sort params; client-side sort
 * is applied as fallback for consistent behavior with pagination.
 */
export async function searchProducts(
  params: SearchParams,
  signal?: AbortSignal
): Promise<ProductsResponse> {
  const queryString = buildQueryString(params);
  return fetchJson<ProductsResponse>(`/products/search${queryString}`, { signal });
}
