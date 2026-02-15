"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { sortProductsAPI } from "../api/sortProducts";
import { searchProducts } from "../api/searchProducts";
import { getProductsByCategory } from "../api/getProductsByCategory";
import { sortProducts } from "../utils";
import type { SortOption, SortOrder } from "../types";

const PAGE_SIZE = 12;

interface UseProductsQueryParams {
  limit: number;
  skip: number;
  sortBy: SortOption;
  order: SortOrder;
  searchQuery?: string;
  category?: string;
}

export function useProductsQuery({
  limit,
  skip,
  sortBy,
  order,
  searchQuery,
  category,
}: UseProductsQueryParams) {
  const hasSearch = Boolean(searchQuery?.trim());
  const hasCategory = Boolean(category);

  const productsQuery = useQuery({
    queryKey: [
      "products",
      {
        limit,
        skip,
        sortBy,
        order,
        searchQuery: searchQuery || null,
        category: category || null,
      },
    ],
    queryFn: async ({ signal }) => {
      // Search + Category: fetch category products then filter by search (so "search within category" works)
      if (hasSearch && hasCategory) {
        const res = await getProductsByCategory(
          { slug: category!, limit: 100, skip: 0, sortBy, order },
          signal,
        );
        const products = res.products ?? [];
        const q = (searchQuery ?? "").toLowerCase().trim();
        const filtered = products.filter(
          (p) =>
            (p.title ?? "").toLowerCase().includes(q) ||
            (p.description ?? "").toLowerCase().includes(q) ||
            (p.brand ?? "").toLowerCase().includes(q),
        );
        const total = filtered.length;
        const paginated = filtered.slice(skip, skip + limit);
        return {
          products: sortProducts(paginated, sortBy, order),
          total,
        };
      }
      // Search only: use search API then paginate
      if (hasSearch) {
        const res = await searchProducts(
          { q: searchQuery!, limit: 100, sortBy, order },
          signal,
        );
        const total = res.products.length;
        const paginated = res.products.slice(skip, skip + limit);
        return {
          products: sortProducts(paginated, sortBy, order),
          total,
        };
      }
      // Category only: use category API with pagination
      if (hasCategory) {
        const res = await getProductsByCategory(
          { slug: category!, limit, skip, sortBy, order },
          signal,
        );
        return {
          products: sortProducts(res.products, sortBy, order),
          total: res.total,
        };
      }
      return sortProductsAPI(sortBy, order, limit, skip, signal);
    },
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
    retry: 1,
  });

  return {
    products: productsQuery.data?.products ?? [],
    total: productsQuery.data?.total ?? 0,
    isLoading: productsQuery.isLoading,
    isError: productsQuery.isError,
    error: productsQuery.error,
    isFetching: productsQuery.isFetching,
  };
}

export { PAGE_SIZE };
