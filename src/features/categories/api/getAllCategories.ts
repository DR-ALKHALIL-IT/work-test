import { fetchJson } from '@/lib/api'
import type { Category } from '../types'

export async function getAllCategories(signal?: AbortSignal): Promise<Category[]> {
  const slugs = await fetchJson<string[]>('/products/categories', { signal })
  
  return slugs.map((slug) => ({
    slug,
    name: slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' '),
    url: `/products/category/${slug}`
  }))
}
