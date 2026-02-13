import { fetchJson } from '@/lib/api'
import type { Category } from '../types'

/**
 * GET /products/categories - Returns array of category objects or slugs.
 * Transforms to { slug, name, url } for UI consistency.
 */
export async function getCategoryList(signal?: AbortSignal): Promise<Category[]> {
  const response = await fetchJson<unknown>('/products/categories', { signal })

  if (!Array.isArray(response) || response.length === 0) return []

  const first = response[0]
  if (typeof first === 'string') {
    return (response as string[]).map((slug) => ({
      slug,
      name: slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' '),
      url: `/products/category/${slug}`,
    }))
  }

  return (response as { slug: string; name?: string }[]).map((item) => ({
    slug: item.slug,
    name: item.name ?? item.slug.charAt(0).toUpperCase() + item.slug.slice(1).replace(/-/g, ' '),
    url: `/products/category/${item.slug}`,
  }))
}
