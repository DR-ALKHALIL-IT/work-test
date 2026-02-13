import { fetchJson } from '@/lib/api';
import { buildQueryString } from '@/lib/utils';
import type { ProductsResponse, CategoryParams } from '../../types';

/**
 * GET /products/category/{slug} - Products by category.
 * Passes sortBy and order when supported by the API.
 * DummyJSON category endpoint may not support sort params; client-side sort
 * is applied as fallback for consistent behavior with pagination.
 */
export async function getProductsByCategory(
  params: CategoryParams & { sortBy?: string; order?: 'asc' | 'desc' },
  signal?: AbortSignal
): Promise<ProductsResponse> {
  const { slug, limit, skip, sortBy, order } = params;
  const queryString = buildQueryString({ limit, skip, sortBy, order });
  return fetchJson<ProductsResponse>(
    `/products/category/${slug}${queryString}`,
    { signal }
  );
}
