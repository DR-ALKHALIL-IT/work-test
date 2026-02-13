'use client'

import { useState, useEffect } from 'react'
import { Container } from '@/components/layout/container'
import { Skeleton } from '@/components/ui/skeleton'
import { CategoryList } from '../components/category-list'
import { getCategoryList } from '../api/getCategoryList'
import { ErrorBoundaryContent } from '@/features/shared/error-boundary'
import type { Category } from '../types'

export function CategoriesView() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    getCategoryList(controller.signal)
      .then(setCategories)
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError(err)
        }
      })
      .finally(() => setIsLoading(false))

    return () => controller.abort()
  }, [])

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
            <h1 className="text-4xl font-bold tracking-tight text-foreground">Categories</h1>
            <p className="text-lg text-muted-foreground">
              Explore products organized by category
            </p>
          </div>

          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-40 rounded-lg" />
              ))}
            </div>
          ) : (
            <CategoryList categories={categories} />
          )}
        </div>
      </Container>
    </div>
  )
}
