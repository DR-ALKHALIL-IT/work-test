'use client'

import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { addToCart } from '../utils'

interface AddToCartButtonProps {
  productId: number
  productTitle: string
  className?: string
}

export function AddToCartButton({ productId, productTitle, className }: AddToCartButtonProps) {
  const { toast } = useToast()

  const handleAddToCart = () => {
    addToCart(productId)
    toast({
      title: 'Added to cart',
      description: `"${productTitle}" has been added to your cart.`,
    })
  }

  return (
    <Button onClick={handleAddToCart} className={className}>
      Add to Cart
    </Button>
  )
}
