import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function buildQueryString<T extends object>(params: T): string {
  const searchParams = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value))
    }
  }
  const str = searchParams.toString()
  return str ? `?${str}` : ''
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}

export type StockStatus = 'out' | 'low' | 'in'

export function getStockStatus(stock: number): StockStatus {
  if (stock === 0) return 'out'
  if (stock <= 5) return 'low'
  return 'in'
}
