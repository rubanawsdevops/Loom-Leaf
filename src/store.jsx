import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { seedProducts, seedOffer, FREE_SHIPPING_ABOVE, SHIPPING_FEE } from './data'

const StoreContext = createContext(null)

function load(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key))
    return value ?? fallback
  } catch {
    return fallback
  }
}

// useState that also saves to localStorage, so data survives a page refresh.
function usePersistentState(key, initial) {
  const [value, setValue] = useState(() => load(key, initial))
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* storage unavailable: the app still works for this visit */
    }
  }, [key, value])
  return [value, setValue]
}

export function StoreProvider({ children }) {
  const [products, setProducts] = usePersistentState('ll_products', seedProducts)
  const [offer, setOffer] = usePersistentState('ll_offer', seedOffer)
  const [cart, setCart] = usePersistentState('ll_cart', []) // [{ id, qty }]
  const [orders, setOrders] = usePersistentState('ll_orders', [])
  const [coupon, setCoupon] = usePersistentState('ll_coupon', '')

  // ----- cart -----
  const addToCart = (id, qty = 1) => {
    const product = products.find((p) => p.id === id)
    if (!product) return
    setCart((prev) => {
      const line = prev.find((l) => l.id === id)
      const next = Math.min((line?.qty ?? 0) + qty, product.stock)
      if (next <= 0) return prev
      return line ? prev.map((l) => (l.id === id ? { ...l, qty: next } : l)) : [...prev, { id, qty: next }]
    })
  }
  const setQty = (id, qty) => {
    const product = products.find((p) => p.id === id)
    const safe = Math.max(0, Math.min(qty, product?.stock ?? 0))
    setCart((prev) => (safe === 0 ? prev.filter((l) => l.id !== id) : prev.map((l) => (l.id === id ? { ...l, qty: safe } : l))))
  }
  const removeFromCart = (id) => setCart((prev) => prev.filter((l) => l.id !== id))

  // ----- totals -----
  const totals = useMemo(() => {
    const lines = cart
      .map((l) => ({ ...l, product: products.find((p) => p.id === l.id) }))
      .filter((l) => l.product)
    const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.qty, 0)
    const couponValid = offer.active && coupon && coupon.toUpperCase() === offer.code.toUpperCase()
    const discount = couponValid ? Math.round((subtotal * offer.percent) / 100) : 0
    const afterDiscount = subtotal - discount
    const shipping = lines.length === 0 || afterDiscount >= FREE_SHIPPING_ABOVE ? 0 : SHIPPING_FEE
    const count = lines.reduce((sum, l) => sum + l.qty, 0)
    return { lines, subtotal, discount, shipping, total: afterDiscount + shipping, count, couponValid }
  }, [cart, products, offer, coupon])

  // ----- orders -----
  const placeOrder = (customer) => {
    const order = {
      id: 'LL' + Date.now().toString().slice(-8),
      date: new Date().toISOString(),
      customer,
      items: totals.lines.map((l) => ({ id: l.id, name: l.product.name, price: l.product.price, qty: l.qty })),
      subtotal: totals.subtotal,
      discount: totals.discount,
      shipping: totals.shipping,
      total: totals.total,
      status: 'New',
    }
    setOrders((prev) => [order, ...prev])
    // reduce stock for what was bought
    setProducts((prev) =>
      prev.map((p) => {
        const line = totals.lines.find((l) => l.id === p.id)
        return line ? { ...p, stock: Math.max(0, p.stock - line.qty) } : p
      }),
    )
    setCart([])
    setCoupon('')
    return order
  }
  const setOrderStatus = (id, status) => setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)))

  // ----- admin: products -----
  const saveProduct = (product) => {
    setProducts((prev) =>
      product.id && prev.some((p) => p.id === product.id)
        ? prev.map((p) => (p.id === product.id ? product : p))
        : [{ ...product, id: 'p' + Date.now() }, ...prev],
    )
  }
  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
    removeFromCart(id)
  }
  const resetDemo = () => {
    setProducts(seedProducts)
    setOffer(seedOffer)
    setOrders([])
    setCart([])
    setCoupon('')
  }

  const value = {
    products, offer, setOffer, cart, orders, coupon, setCoupon, totals,
    addToCart, setQty, removeFromCart, placeOrder, setOrderStatus,
    saveProduct, deleteProduct, resetDemo,
  }
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export const useStore = () => useContext(StoreContext)
