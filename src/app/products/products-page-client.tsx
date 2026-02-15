'use client'

import { ProductsDashboardView } from '@/features/products/views/products-dashboard-view'
import { ErrorBoundary, ErrorBoundaryContent } from '@/features/shared/error-boundary'

export function ProductsPageClient() {
  return (
    <ErrorBoundary
      fallback={(error, reset) => (
        <ErrorBoundaryContent
          error={error}
          reset={() => window.location.reload()}
        />
      )}
    >
      <ProductsDashboardView />
    </ErrorBoundary>
  )
}
