import { fetchJson } from './api';
import { buildQueryString } from './utils';
import type {
  Product,
  ProductsResponse,
  SearchParams,
  CreateProductInput,
  UpdateProductInput,
} from '@/features/shared/types';

// Endpoint paths
export const ENDPOINTS = {
  PRODUCTS: '/products',
  PRODUCT_BY_ID: (id: number) => `/products/${id}`,
  PRODUCTS_SEARCH: '/products/search',
  PRODUCTS_CATEGORIES: '/products/categories',
  PRODUCTS_CATEGORY_LIST: '/products/category-list',
  PRODUCTS_BY_CATEGORY: (slug: string) => `/products/category/${slug}`,
  PRODUCTS_ADD: '/products/add',
  PRODUCTS_UPDATE: (id: number) => `/products/${id}`,
  PRODUCTS_DELETE: (id: number) => `/products/${id}`,
} as const;

// API functions
export async function getProducts(params?: SearchParams): Promise<ProductsResponse> {
  const queryString = params ? buildQueryString(params) : '';
  const url = `${ENDPOINTS.PRODUCTS}${queryString}`;
  return fetchJson<ProductsResponse>(url);
}

export async function getProductById(id: number): Promise<Product> {
  return fetchJson<Product>(ENDPOINTS.PRODUCT_BY_ID(id));
}

export async function searchProducts(query: string, params?: Omit<SearchParams, 'q'>): Promise<ProductsResponse> {
  const queryString = buildQueryString({ q: query, ...params });
  const url = `${ENDPOINTS.PRODUCTS_SEARCH}${queryString}`;
  return fetchJson<ProductsResponse>(url);
}

export async function getProductsByCategory(slug: string, params?: SearchParams): Promise<ProductsResponse> {
  const queryString = params ? buildQueryString(params) : '';
  const url = `${ENDPOINTS.PRODUCTS_BY_CATEGORY(slug)}${queryString}`;
  return fetchJson<ProductsResponse>(url);
}

export async function getCategories(): Promise<string[]> {
  return fetchJson<string[]>(ENDPOINTS.PRODUCTS_CATEGORIES);
}

export async function getCategoryList(): Promise<string[]> {
  return fetchJson<string[]>(ENDPOINTS.PRODUCTS_CATEGORY_LIST);
}

export async function addProduct(product: CreateProductInput): Promise<Product> {
  return fetchJson<Product>(ENDPOINTS.PRODUCTS_ADD, {
    method: 'POST',
    body: JSON.stringify(product),
  });
}

export async function updateProduct(data: UpdateProductInput): Promise<Product> {
  const { id, ...product } = data;
  return fetchJson<Product>(ENDPOINTS.PRODUCTS_UPDATE(id), {
    method: 'PUT',
    body: JSON.stringify(product),
  });
}

export async function patchProduct(data: UpdateProductInput): Promise<Product> {
  const { id, ...product } = data;
  return fetchJson<Product>(ENDPOINTS.PRODUCTS_UPDATE(id), {
    method: 'PATCH',
    body: JSON.stringify(product),
  });
}

export async function deleteProduct(id: number): Promise<{ id: number; isDeleted: boolean }> {
  return fetchJson<{ id: number; isDeleted: boolean }>(ENDPOINTS.PRODUCTS_DELETE(id), {
    method: 'DELETE',
  });
}
