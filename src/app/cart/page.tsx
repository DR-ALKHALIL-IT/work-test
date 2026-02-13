'use client'

import { useState, useEffect } from 'react'
import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { getCartIds, removeFromCart } from '@/features/cart/utils'
import { getSingleProduct } from '@/features/products/api/queries/getSingleProduct'
import type { Product } from '@/features/products/types'
import { Trash2 } from 'lucide-react'

export default function CartPage() {
  const [itemIds, setItemIds] = useState<number[]>([])
  const [products, setProducts] = useState<Map<number, Product | null>>(new Map())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setItemIds(getCartIds())

    const handleCartUpdate = () => {
      setItemIds(getCartIds())
    }

    window.addEventListener('cart-updated', handleCartUpdate)
    return () => window.removeEventListener('cart-updated', handleCartUpdate)
  }, [])

  useEffect(() => {
    if (itemIds.length === 0) {
      setProducts(new Map())
      setLoading(false)
      return
    }

    const uniqueIds = [...new Set(itemIds)]
    let cancelled = false

    setLoading(true)
    Promise.all(
      uniqueIds.map((id) =>
        getSingleProduct(id).catch(() => null)
      )
    ).then((results) => {
      if (cancelled) return
      const map = new Map<number, Product | null>()
      uniqueIds.forEach((id, i) => map.set(id, results[i]))
      setProducts(map)
    }).finally(() => {
      if (!cancelled) setLoading(false)
    })

    return () => { cancelled = true }
  }, [itemIds.join(',')])

  const handleRemove = (productId: number) => {
    removeFromCart(productId)
  }

  return (
    <div className="min-h-screen bg-background">
      <Container className="max-w-4xl py-8">
        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">Shopping Cart</h1>
            <p className="text-lg text-muted-foreground">
              {itemIds.length === 0 ? 'Your cart is empty' : `${itemIds.length} item${itemIds.length === 1 ? '' : 's'} in your cart`}
            </p>
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
                  {itemIds.map((id, index) => {
                    const product = products.get(id)
                    return (
                      <div
                        key={`${id}-${index}`}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-4"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {loading ? (
                            <Skeleton className="h-16 w-16 rounded-lg shrink-0" />
                          ) : product?.thumbnail ? (
                            <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-muted shrink-0">
                              <img
                                src={product.thumbnail}
                                alt={product.title}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center shrink-0">
                              <span className="text-xs font-medium text-muted-foreground">#{id}</span>
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            {loading ? (
                              <>
                                <Skeleton className="h-4 w-32 mb-2" />
                                <Skeleton className="h-3 w-20" />
                              </>
                            ) : (
                              <>
                                <p className="text-sm font-medium text-foreground line-clamp-2">
                                  {product?.title ?? `Product #${id}`}
                                </p>
                                <p className="text-xs text-muted-foreground">#{id}</p>
                              </>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemove(id)}
                          className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                          aria-label={`Remove product ${id} from cart`}
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </Button>
                      </div>
                    )
                  })}
                </div>
                <div className="mt-6 pt-6 border-t space-y-3">
                  <div className="flex items-center justify-between text-lg font-semibold">
                    <span>Total Items:</span>
                    <span>{itemIds.length}</span>
                  </div>
                  <Button className="w-full" size="lg">
                    Proceed to Checkout
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </Container>
    </div>
  )
}
