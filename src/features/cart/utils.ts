const CART_STORAGE_KEY = 'cart_product_ids'

/** Cart storage: { [productId]: quantity }. Legacy: array of ids is migrated on read. */
function getCartRaw(): Record<string, number> {
  if (typeof window === 'undefined') return {}
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    if (!stored) return {}
    const parsed = JSON.parse(stored) as unknown
    if (Array.isArray(parsed)) {
      const migrated = parsed.reduce<Record<string, number>>((acc, id) => {
        const k = String(id)
        acc[k] = (acc[k] ?? 0) + 1
        return acc
      }, {})
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(migrated))
      return migrated
    }
    if (typeof parsed === 'object' && parsed !== null) return parsed as Record<string, number>
    return {}
  } catch {
    return {}
  }
}

export interface CartItem {
  productId: number
  quantity: number
}

export function getCartItems(): CartItem[] {
  const raw = getCartRaw()
  return Object.entries(raw)
    .filter(([, qty]) => qty > 0)
    .map(([id, quantity]) => ({ productId: Number(id), quantity }))
}

/** @deprecated Use getCartItems() instead. Returns list of product ids (one per quantity for legacy compat). */
export function getCartIds(): number[] {
  return getCartItems().flatMap(({ productId, quantity }) => Array(quantity).fill(productId))
}

export function addToCart(productId: number): CartItem[] {
  const raw = getCartRaw()
  const k = String(productId)
  raw[k] = (raw[k] ?? 0) + 1
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(raw))
  window.dispatchEvent(new CustomEvent('cart-updated'))
  return getCartItems()
}

export function removeFromCart(productId: number): CartItem[] {
  const raw = getCartRaw()
  delete raw[String(productId)]
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(raw))
  window.dispatchEvent(new CustomEvent('cart-updated'))
  return getCartItems()
}

/** Decrease quantity by 1; remove product if quantity becomes 0. */
export function decreaseCartQuantity(productId: number): CartItem[] {
  const raw = getCartRaw()
  const k = String(productId)
  const current = raw[k] ?? 0
  if (current <= 1) {
    delete raw[k]
  } else {
    raw[k] = current - 1
  }
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(raw))
  window.dispatchEvent(new CustomEvent('cart-updated'))
  return getCartItems()
}

export function getCartCount(): number {
  const raw = getCartRaw()
  return Object.values(raw).reduce((sum, qty) => sum + qty, 0)
}
