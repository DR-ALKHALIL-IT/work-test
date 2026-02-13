'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { getSingleProduct } from '@/features/products/api/queries/getSingleProduct';
import { calculateDiscountedPrice } from '@/features/products/utils';
import { formatPrice } from '@/lib/utils';
import { removeFromCart } from '../utils';
import type { Product } from '@/features/products/types';

interface CartItemRowProps {
  productId: number;
  onRemoved: () => void;
}

export function CartItemRow({ productId, onRemoved }: CartItemRowProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    getSingleProduct(productId, controller.signal)
      .then(setProduct)
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [productId]);

  const handleRemove = () => {
    removeFromCart(productId);
    onRemoved();
  };

  if (loading) {
    return (
      <div className="flex items-center gap-4 p-4 border rounded-lg animate-pulse">
        <div className="h-16 w-16 rounded-lg bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 bg-muted rounded" />
          <div className="h-3 w-1/4 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
        <span className="text-sm text-muted-foreground">Product #{productId} (unavailable)</span>
        <Button variant="ghost" size="sm" onClick={handleRemove}>
          Remove
        </Button>
      </div>
    );
  }

  const price = calculateDiscountedPrice(product.price, product.discountPercentage);

  return (
    <div className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
      <a href={`/products/${product.id}`} className="shrink-0">
        <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-muted">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="h-full w-full object-cover"
          />
        </div>
      </a>
      <div className="flex-1 min-w-0">
        <a href={`/products/${product.id}`} className="block">
          <p className="font-medium text-foreground truncate hover:underline">{product.title}</p>
        </a>
        <p className="text-sm text-muted-foreground">{product.brand}</p>
        <p className="text-sm font-semibold text-foreground mt-1">{formatPrice(price)}</p>
      </div>
      <Button variant="outline" size="sm" onClick={handleRemove} className="shrink-0">
        Remove
      </Button>
    </div>
  );
}
