'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ProductGalleryProps {
  images: string[];
  alt: string;
}

export function ProductGallery({ images, alt }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (images.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="aspect-square overflow-hidden rounded-lg bg-muted">
        <img
          src={images[selectedIndex]}
          alt={`${alt} - Image ${selectedIndex + 1}`}
          className="h-full w-full object-cover"
        />
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                'aspect-square overflow-hidden rounded-md border-2 transition-all',
                selectedIndex === index
                  ? 'border-primary ring-2 ring-primary ring-offset-2'
                  : 'border-border hover:border-muted-foreground/50'
              )}
            >
              <img
                src={image}
                alt={`${alt} thumbnail ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
