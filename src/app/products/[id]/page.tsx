import { getSingleProduct } from '@/features/products/api/queries/getSingleProduct'
import { ProductDetailView } from '@/features/products/views/product-detail-view'
import { notFound } from 'next/navigation'

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  
  try {
    const product = await getSingleProduct(Number(id))
    return <ProductDetailView initialProduct={product} />
  } catch (error) {
    notFound()
  }
}
