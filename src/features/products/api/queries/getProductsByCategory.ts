import { fetchJson } from '@/lib/api';
import { buildQueryString } from '@/lib/utils';
import type { ProductsResponse, CategoryParams } from '../../types';

export async function getProductsByCategory(
  params: CategoryParams,
  signal?: AbortSignal
): Promise<ProductsResponse> {
  const { slug, limit, skip, sortBy, order } = params;
  const queryString = buildQueryString({ limit, skip, sortBy, order });
  return fetchJson<ProductsResponse>(
    `/products/category/${slug}${queryString}`,
    { signal }
  );
}
