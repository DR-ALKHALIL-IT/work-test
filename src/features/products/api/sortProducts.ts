import { fetchJson } from "@/lib/api";
import { buildQueryString } from "@/lib/utils";
import type { ProductsResponse, SortOption, SortOrder } from "../types";

export async function sortProductsAPI(
  sortBy: SortOption,
  order: SortOrder,
  limit?: number,
  skip?: number,
  signal?: AbortSignal,
): Promise<ProductsResponse> {
  const queryString = buildQueryString({ sortBy, order, limit, skip });
  return fetchJson<ProductsResponse>(`/products${queryString}`, { signal });
}
