'use client'

import { useState, useEffect } from 'react'
import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CartItemRow } from '@/features/cart/components/cart-item-row'
import { ProductModal } from '@/features/products/components/product-modal'
import { getCartIds } from '@/features/cart/utils'

export default function CartPage() {
  const [itemIds, setItemIds] = useState<number[]>([])
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    setItemIds(getCartIds())

    const handleCartUpdate = () => {
      setItemIds(getCartIds())
    }

    window.addEventListener('cart-updated', handleCartUpdate)
    return () => window.removeEventListener('cart-updated', handleCartUpdate)
  }, [])

  const handleRemoveItem = () => {
    setItemIds(getCartIds())
  }

  const handleProductClick = (productId: number) => {
    setSelectedProductId(productId)
    setIsModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <Container className="max-w-4xl py-8">
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight text-foreground">Shopping Cart</h1>
              <p className="text-lg text-muted-foreground">
                {itemIds.length === 0 ? 'Your cart is empty' : `${itemIds.length} item${itemIds.length === 1 ? '' : 's'} in your cart`}
              </p>
            </div>
          </div>

          {itemIds.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="rounded-full bg-muted/50 p-6 mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-muted-foreground/60"
                    aria-hidden="true"
                  >
                    <circle cx="8" cy="21" r="1" />
                    <circle cx="19" cy="21" r="1" />
                    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                  </svg>
                </div>
                <p className="text-xl font-semibold text-foreground mb-2">Your cart is empty</p>
                <p className="text-muted-foreground mb-6">Start shopping to add items to your cart</p>
                <Button asChild>
                  <a href="/products">Browse Products</a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Cart Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {itemIds.map((id, index) => (
                    <CartItemRow
                      key={`${id}-${index}`}
                      productId={id}
                      onRemoved={handleRemoveItem}
                      onProductClick={handleProductClick}
                    />
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center justify-between text-lg font-semibold">
                    <span>Total Items:</span>
                    <span>{itemIds.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <ProductModal
          productId={selectedProductId}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </Container>
    </div>
  )
}
