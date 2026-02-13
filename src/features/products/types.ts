export interface ProductReview {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail?: string;
}

export interface ProductDimensions {
  width: number;
  height: number;
  depth: number;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
  // Extended fields from DummyJSON single product API
  sku?: string;
  weight?: number;
  dimensions?: ProductDimensions;
  warrantyInformation?: string;
  shippingInformation?: string;
  reviews?: ProductReview[];
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface SearchParams {
  q?: string;
  limit?: number;
  skip?: number;
  sortBy?: string;
  order?: "asc" | "desc";
}

export interface CategoryParams {
  slug: string;
  limit?: number;
  skip?: number;
  sortBy?: string;
  order?: SortOrder;
}

export interface CategoryOption {
  slug: string;
  name: string;
}

export type SortOption = "title" | "price" | "rating";
export type SortOrder = "asc" | "desc";
