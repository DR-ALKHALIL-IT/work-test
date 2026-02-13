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

export function removeFromCart(productId: number): number[] {
  const items = getCartIds()
  const index = items.indexOf(productId)
  if (index === -1) return items
  const updated = [...items.slice(0, index), ...items.slice(index + 1)]
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updated))
  window.dispatchEvent(new CustomEvent('cart-updated'))
  return updated
}

export function clearCart(): void {
  localStorage.removeItem(CART_STORAGE_KEY)
  window.dispatchEvent(new CustomEvent('cart-updated'))
}
