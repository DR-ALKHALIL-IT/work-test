'use client'

import { useEffect } from 'react'
import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <Container>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Something went wrong</h2>
          <p className="text-muted-foreground max-w-md">
            We encountered an unexpected error. Please try again or contact support if the problem persists.
          </p>
        </div>
        <Button onClick={reset} size="lg">
          Try Again
        </Button>
      </div>
    </Container>
  )
}
