'use client';

import { Container } from '@/components/layout/container';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/lib/utils';
import { ProductGallery } from '../components/product-gallery';
import { Rating } from '../components/rating';
import { StockBadge } from '../components/stock-badge';
import { calculateDiscountedPrice } from '../utils';
import { AddToCartButton } from '@/features/cart/components/add-to-cart-button';
import type { Product } from '../types';

interface ProductDetailViewProps {
  initialProduct: Product;
}

export function ProductDetailView({ initialProduct }: ProductDetailViewProps) {
  const product = initialProduct;

  if (!product) {
    return (
      <Container className="py-8">
        <div className="text-center">
          <p className="text-red-600">Product not found</p>
        </div>
      </Container>
    );
  }

  const discountedPrice = calculateDiscountedPrice(product.price, product.discountPercentage);

  return (
    <div className="min-h-screen bg-background">
      <Container className="max-w-7xl py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Gallery Column */}
          <div className="md:sticky md:top-24 md:self-start">
            <ProductGallery images={product.images} alt={product.title} />
          </div>

          {/* Details Column */}
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                  {product.category}
                </span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground">
                {product.title}
              </h1>
              {product.brand && (
                <p className="text-sm text-muted-foreground">
                  by <span className="font-medium text-foreground">{product.brand}</span>
                </p>
              )}
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              <Rating rating={product.rating} showValue={true} />
              <StockBadge stock={product.stock} />
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-4xl font-bold text-foreground">
                  {formatPrice(discountedPrice)}
                </span>
                {product.discountPercentage > 0 && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">
                      {formatPrice(product.price)}
                    </span>
                    <span className="inline-flex items-center rounded-md bg-destructive/10 px-2.5 py-1 text-sm font-semibold text-destructive">
                      {product.discountPercentage.toFixed(0)}% OFF
                    </span>
                  </>
                )}
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h2 className="font-semibold text-foreground">About this product</h2>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            <div className="flex gap-3 pt-4">
              {product.stock === 0 ? (
                <button 
                  disabled 
                  className="flex-1 h-12 text-base rounded-md bg-muted text-muted-foreground cursor-not-allowed font-semibold"
                  aria-label="Product out of stock"
                >
                  Out of Stock
                </button>
              ) : (
                <AddToCartButton
                  productId={product.id}
                  productTitle={product.title}
                  className="flex-1 h-12 text-base font-semibold"
                />
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
