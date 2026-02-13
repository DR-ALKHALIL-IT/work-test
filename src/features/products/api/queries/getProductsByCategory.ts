import { fetchJson } from '@/lib/api';
import { buildQueryString } from '@/lib/utils';
import type { ProductsResponse, CategoryParams } from '../../types';

export async function getProductsByCategory(
  params: CategoryParams,
  signal?: AbortSignal
): Promise<ProductsResponse> {
  const { slug, limit, skip } = params;
  const queryString = buildQueryString({ limit, skip });
  return fetchJson<ProductsResponse>(
    `/products/category/${slug}${queryString}`,
    { signal }
  );
}
