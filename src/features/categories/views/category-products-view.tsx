'use client'

import { useState, useEffect } from 'react'
import { Container } from '@/components/layout/container'
import { Skeleton } from '@/components/ui/skeleton'
import { ProductGrid } from '@/features/products/components/product-grid'
import { ProductModal } from '@/features/products/components/product-modal'
import { EmptyState } from '@/features/products/components/empty-state'
import { getProductsByCategory } from '@/features/products/api/queries/getProductsByCategory'
import { ErrorBoundaryContent } from '@/features/shared/error-boundary'
import type { Product } from '@/features/products/types'

interface CategoryProductsViewProps {
  slug: string
}

export function CategoryProductsView({ slug }: CategoryProductsViewProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    getProductsByCategory({ slug }, controller.signal)
      .then((response) => setProducts(response.products))
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError(err)
        }
      })
      .finally(() => setIsLoading(false))

    return () => controller.abort()
  }, [slug])

  const handleProductClick = (product: Product) => {
    setSelectedProductId(product.id)
    setIsModalOpen(true)
  }

  if (error) {
    return (
      <Container className="py-8">
        <ErrorBoundaryContent error={error} reset={() => window.location.reload()} />
      </Container>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Container className="max-w-7xl py-8">
        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight capitalize text-foreground">
              {slug.replace(/-/g, ' ')}
            </h1>
            <p className="text-lg text-muted-foreground">
              {isLoading ? 'Loading products...' : `${products.length} products in this category`}
            </p>
          </div>

          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-[420px] rounded-lg" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <EmptyState />
          ) : (
            <ProductGrid products={products} onProductClick={handleProductClick} />
          )}

          <ProductModal
            productId={selectedProductId}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </div>
      </Container>
    </div>
  )
}
