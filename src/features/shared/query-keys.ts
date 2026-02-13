// Minimal query keys for cache invalidation and organization
// Not using react-query, but useful for organizing fetch cache keys

export const queryKeys = {
  products: {
    all: ['products'] as const,
    lists: () => [...queryKeys.products.all, 'list'] as const,
    list: (params?: Record<string, unknown>) => 
      [...queryKeys.products.lists(), params] as const,
    details: () => [...queryKeys.products.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.products.details(), id] as const,
    search: (query: string) => 
      [...queryKeys.products.all, 'search', query] as const,
    category: (slug: string) => 
      [...queryKeys.products.all, 'category', slug] as const,
  },
  categories: {
    all: ['categories'] as const,
    list: () => [...queryKeys.categories.all, 'list'] as const,
  },
} as const;
