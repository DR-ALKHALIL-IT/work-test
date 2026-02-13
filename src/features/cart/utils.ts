const CART_STORAGE_KEY = 'cart_product_ids'

export function getCartIds(): number[] {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function addToCart(productId: number): number[] {
  const items = getCartIds()
  items.push(productId)
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  
  // Dispatch custom event for cart updates
  window.dispatchEvent(new CustomEvent('cart-updated'))
  
  return items
}

export function getCartCount(): number {
  return getCartIds().length
}

export function clearCart(): void {
  localStorage.removeItem(CART_STORAGE_KEY)
  window.dispatchEvent(new CustomEvent('cart-updated'))
}
