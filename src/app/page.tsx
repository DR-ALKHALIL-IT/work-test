import { ProductsDashboardView } from '@/features/products/views/products-dashboard-view'
import { sortProductsAPI } from '@/features/products/api/queries/sortProducts'
import { searchProducts } from '@/features/products/api/queries/searchProducts'
import { getProductsByCategory } from '@/features/products/api/queries/getProductsByCategory'
import { getCategories } from '@/features/categories/api/getCategories'
import { sortProducts } from '@/features/products/utils'
import type { SortOption, SortOrder } from '@/features/products/types'

const PAGE_SIZE = 12

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{
    q?: string
    category?: string
    sortBy?: string
    order?: string
    page?: string
  }>
}) {
  const params = (await searchParams) ?? {}
  const q = params.q ?? ''
  const category = params.category ?? ''
  const sortBy = (params.sortBy ?? 'title') as SortOption
  const order = (params.order ?? 'asc') as SortOrder
  const page = Math.max(1, parseInt(params.page ?? '1', 10))
  const skip = (page - 1) * PAGE_SIZE

  const [categoriesRes, productsRes] = await Promise.all([
    getCategories(),
    (async () => {
      if (q) {
        const res = await searchProducts({ q, limit: 100 })
        let filtered = res.products
        if (category) {
          filtered = filtered.filter((p) => p.category === category)
        }
        const total = filtered.length
        const paginated = filtered.slice(skip, skip + PAGE_SIZE)
        const products = sortProducts(paginated, sortBy, order)
        return { products, total }
      }
      if (category) {
        const res = await getProductsByCategory({
          slug: category,
          limit: PAGE_SIZE,
          skip,
          sortBy,
          order,
        })
        const products =
          res.products.length > 0
            ? sortProducts(res.products, sortBy, order)
            : res.products
        return { products, total: res.total }
      }
      const res = await sortProductsAPI(sortBy, order, PAGE_SIZE, skip)
      return { products: res.products, total: res.total }
    })(),
  ])

  const categoryName =
    category && categoriesRes.find((c) => c.slug === category)?.name

  return (
    <ProductsDashboardView
      initialProducts={productsRes.products}
      initialTotal={productsRes.total}
      initialPage={page}
      initialSearch={q}
      initialCategory={category}
      initialCategoryName={categoryName ?? ''}
      initialCategories={categoriesRes}
      initialSortBy={sortBy}
      initialSortOrder={order}
    />
  )
}
