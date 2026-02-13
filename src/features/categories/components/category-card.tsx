import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import type { Category } from '../types'

interface CategoryCardProps {
  category: Category
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/categories/${category.slug}`}>
      <Card className="h-full transition-all hover:shadow-lg hover:scale-[1.02]">
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold capitalize">
              {category.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              View products
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
