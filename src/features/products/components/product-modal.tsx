"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import { getSingleProduct } from "../api/getSingleProduct";
import { ProductGallery } from "./product-gallery";
import { Rating } from "./rating";
import { StockBadge } from "./stock-badge";
import { calculateDiscountedPrice } from "../utils";
import { AddToCartButton } from "@/features/cart/components/add-to-cart-button";
import type { Product } from "../types";

interface ProductModalProps {
  productId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductModal({
  productId,
  isOpen,
  onClose,
}: ProductModalProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !productId) {
      setProduct(null);
      setError(null);
      return;
    }

    const abortController = new AbortController();

    async function fetchProduct() {
      if (!productId) return;
      setLoading(true);
      setError(null);

      try {
        const data = await getSingleProduct(productId, abortController.signal);
        setProduct(data);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();

    return () => {
      abortController.abort();
    };
  }, [productId, isOpen]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <div className="grid grid-cols-4 gap-2">
              <Skeleton className="aspect-square rounded-md" />
              <Skeleton className="aspect-square rounded-md" />
              <Skeleton className="aspect-square rounded-md" />
              <Skeleton className="aspect-square rounded-md" />
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="py-12 text-center">
          <div className="inline-flex flex-col items-center gap-4">
            <div className="rounded-full bg-destructive/10 p-3">
              <svg
                className="h-6 w-6 text-destructive"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-foreground">
                Failed to Load Product
              </p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
            <Button onClick={onClose} variant="outline" size="sm">
              Close
            </Button>
          </div>
        </div>
      );
    }

    if (!product) return null;

    const discountedPrice = calculateDiscountedPrice(
      product.price,
      product.discountPercentage,
    );

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Gallery Column */}
        <div className="md:sticky md:top-0 md:self-start">
          <ProductGallery images={product.images} alt={product.title} />
        </div>

        {/* Details Column */}
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                {product.category}
              </span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              {product.title}
            </h2>
            {product.brand && (
              <p className="text-sm text-muted-foreground">
                by{" "}
                <span className="font-medium text-foreground">
                  {product.brand}
                </span>
              </p>
            )}
          </div>

          {/* Rating & Stock */}
          <div className="flex items-center gap-4 flex-wrap">
            <Rating rating={product.rating} showValue={true} />
            <StockBadge stock={product.stock} />
          </div>

          <Separator />

          {/* Price */}
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

          {/* Description */}
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">
              About this product
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Product Details: SKU, Dimensions, Weight */}
          {(product.sku || product.dimensions || product.weight != null) && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">
                  Product details
                </h3>
                <dl className="grid gap-2 text-sm">
                  {product.sku && (
                    <div>
                      <dt className="text-muted-foreground">SKU</dt>
                      <dd className="font-medium text-foreground">
                        {product.sku}
                      </dd>
                    </div>
                  )}
                  {product.weight != null && (
                    <div>
                      <dt className="text-muted-foreground">Weight</dt>
                      <dd className="font-medium text-foreground">
                        {product.weight} kg
                      </dd>
                    </div>
                  )}
                  {product.dimensions && (
                    <div>
                      <dt className="text-muted-foreground">Dimensions</dt>
                      <dd className="font-medium text-foreground">
                        {product.dimensions.width} × {product.dimensions.height}{" "}
                        × {product.dimensions.depth} cm
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </>
          )}

          {/* Warranty & Shipping */}
          {(product.warrantyInformation || product.shippingInformation) && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">
                  Warranty & Shipping
                </h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {product.warrantyInformation && (
                    <li>
                      <span className="font-medium text-foreground">
                        Warranty:
                      </span>{" "}
                      {product.warrantyInformation}
                    </li>
                  )}
                  {product.shippingInformation && (
                    <li>
                      <span className="font-medium text-foreground">
                        Shipping:
                      </span>{" "}
                      {product.shippingInformation}
                    </li>
                  )}
                </ul>
              </div>
            </>
          )}

          {/* Customer Reviews (show at least 3 slots per PDF) */}
          <Separator />
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">Customer reviews</h3>
            {(() => {
              const MIN_REVIEWS_DISPLAY = 3;
              const reviews = product.reviews ?? [];
              const minSlots = Math.max(MIN_REVIEWS_DISPLAY, reviews.length);
              const slots = Array.from({ length: minSlots }, (_, i) =>
                i < reviews.length ? reviews[i] : null
              );
              return (
                <div className="space-y-3">
                  {slots.map((review, idx) =>
                    review ? (
                      <div
                        key={`${review.reviewerName}-${idx}`}
                        className="rounded-lg border bg-muted/30 p-3 text-sm"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-foreground">
                            {review.reviewerName}
                          </span>
                          <span className="text-muted-foreground">•</span>
                          <Rating
                            rating={review.rating}
                            showValue={true}
                            size="sm"
                          />
                        </div>
                        <p className="text-muted-foreground">{review.comment}</p>
                      </div>
                    ) : (
                      <div
                        key={`placeholder-${idx}`}
                        className="rounded-lg border border-dashed bg-muted/20 p-3 text-sm text-muted-foreground italic"
                      >
                        No reviews yet. Be the first to review!
                      </div>
                    )
                  )}
                </div>
              );
            })()}
          </div>

          {/* Add to Cart */}
          <div className="flex gap-3 pt-2">
            {product.stock === 0 ? (
              <Button size="lg" className="flex-1 h-12" disabled>
                Out of Stock
              </Button>
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
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      {renderContent()}
    </Modal>
  );
}
