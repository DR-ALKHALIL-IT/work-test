'use client'

import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { sortProductsAPI } from '../api/queries/sortProducts'
import { searchProducts } from '../api/queries/searchProducts'
import { getProductsByCategory } from '../api/queries/getProductsByCategory'
import { sortProducts } from '../utils'
import type { SortOption, SortOrder } from '../types'

const PAGE_SIZE = 12

interface UseProductsQueryParams {
  limit: number
  skip: number
  sortBy: SortOption
  order: SortOrder
  searchQuery?: string
  category?: string
}

export function useProductsQuery({
  limit,
  skip,
  sortBy,
  order,
  searchQuery,
  category,
}: UseProductsQueryParams) {
  const hasSearch = Boolean(searchQuery?.trim())
  const hasCategory = Boolean(category)

  const productsQuery = useQuery({
    queryKey: [
      'products',
      { limit, skip, sortBy, order, searchQuery: searchQuery || null, category: category || null },
    ],
    queryFn: async ({ signal }) => {
      if (hasSearch) {
        const res = await searchProducts(
          { q: searchQuery!, limit: 100, sortBy, order },
          signal
        )
        let filtered = res.products
        if (category) {
          filtered = filtered.filter((p) => p.category === category)
        }
        const total = filtered.length
        const paginated = filtered.slice(skip, skip + limit)
        return { products: sortProducts(paginated, sortBy, order), total }
      }
      if (hasCategory) {
        const res = await getProductsByCategory(
          { slug: category!, limit, skip, sortBy, order },
          signal
        )
        return { products: sortProducts(res.products, sortBy, order), total: res.total }
      }
      return sortProductsAPI(sortBy, order, limit, skip, signal)
    },
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
    retry: 1,
  })

  return {
    products: productsQuery.data?.products ?? [],
    total: productsQuery.data?.total ?? 0,
    isLoading: productsQuery.isLoading,
    isError: productsQuery.isError,
    error: productsQuery.error,
    isFetching: productsQuery.isFetching,
  }
}

export { PAGE_SIZE }
