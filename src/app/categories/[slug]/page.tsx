import { CategoryProductsView } from '@/features/categories/views/category-products-view'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  return <CategoryProductsView slug={slug} />
}
