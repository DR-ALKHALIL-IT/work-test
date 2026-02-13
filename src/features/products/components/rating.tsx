'use client'

import { useId } from 'react';
import { cn } from '@/lib/utils';

interface RatingProps {
  rating: number;
  maxRating?: number;
  className?: string;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function Rating({ 
  rating, 
  maxRating = 5, 
  className, 
  showValue = true,
  size = 'md' 
}: RatingProps) {
  const baseId = useId().replace(/:/g, '-');
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  const sizeClasses = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className={cn('flex items-center gap-1.5', className)} role="img" aria-label={`Rating: ${rating.toFixed(1)} out of ${maxRating} stars`}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxRating }).map((_, index) => {
          const isFilled = index < fullStars;
          const isHalf = index === fullStars && hasHalfStar;

          return (
            <svg
              key={index}
              className={cn(
                sizeClasses[size],
                isFilled ? 'fill-yellow-400 text-yellow-400' : 'fill-none text-muted-foreground/30'
              )}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden="true"
            >
              {isHalf ? (
                <>
                  <defs>
                    <linearGradient id={`${baseId}-half-${index}`}>
                      <stop offset="50%" stopColor="currentColor" className="text-yellow-400" />
                      <stop offset="50%" stopColor="currentColor" className="text-muted-foreground/30" />
                    </linearGradient>
                  </defs>
                  <path
                    fill={`url(#${baseId}-half-${index})`}
                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                  />
                </>
              ) : (
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              )}
            </svg>
          );
        })}
      </div>
      {showValue && (
        <span className={cn('font-medium text-muted-foreground', textSizes[size])}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
