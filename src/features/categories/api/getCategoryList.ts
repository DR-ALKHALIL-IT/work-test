import { fetchJson } from '@/lib/api'
import type { Category } from '../types'

export async function getCategoryList(signal?: AbortSignal): Promise<Category[]> {
  const response = await fetchJson<unknown>('/products/category-list', { signal })
  
  // Handle both string[] and Category[] responses
  if (Array.isArray(response)) {
    if (response.length === 0) return []
    
    // Check if first item is a string
    if (typeof response[0] === 'string') {
      return (response as string[]).map((slug) => ({
        slug,
        name: slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' '),
        url: `/products/category/${slug}`
      }))
    }
    
    // Assume it's already Category[]
    return response as Category[]
  }
  
  return []
}
