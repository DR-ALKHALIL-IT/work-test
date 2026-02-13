'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';
import { Rating } from './rating';
import { StockBadge } from './stock-badge';
import { calculateDiscountedPrice } from '../utils';
import { AddToCartButton } from '@/features/cart/components/add-to-cart-button';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const discountedPrice = calculateDiscountedPrice(product.price, product.discountPercentage);

  return (
    <Card 
      className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
      onClick={() => onClick(product)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(product);
        }
      }}
      aria-label={`View details for ${product.title}`}
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {product.discountPercentage > 0 && (
          <Badge className="absolute top-3 right-3 bg-destructive text-destructive-foreground shadow-md">
            -{product.discountPercentage.toFixed(0)}%
          </Badge>
        )}
      </div>

      <div className="p-4 space-y-3">
        <div className="space-y-2">
          <Badge variant="secondary" className="text-xs font-medium">
            {product.category}
          </Badge>
          <h3 className="font-semibold text-foreground line-clamp-2 leading-tight min-h-[2.5rem]">
            {product.title}
          </h3>
        </div>

        <div className="space-y-1">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-xl font-bold text-foreground">
              {formatPrice(discountedPrice)}
            </span>
            {product.discountPercentage > 0 && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <Rating rating={product.rating} showValue={true} size="sm" />
          <StockBadge stock={product.stock} />
        </div>

        <div onClick={(e) => e.stopPropagation()} className="pt-1">
          {product.stock === 0 ? (
            <button 
              disabled 
              className="w-full h-10 rounded-md bg-muted text-muted-foreground text-sm font-medium cursor-not-allowed"
              aria-label="Product out of stock"
            >
              Out of Stock
            </button>
          ) : (
            <AddToCartButton
              productId={product.id}
              productTitle={product.title}
              className="w-full h-10 font-medium transition-colors hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2"
            />
          )}
        </div>
      </div>
    </Card>
  );
}
