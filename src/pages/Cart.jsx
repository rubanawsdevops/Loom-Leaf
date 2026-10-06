import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../store'
import { inr, FREE_SHIPPING_ABOVE } from '../data'
import { Thumb } from '../components/ProductCard'

export function Summary({ children }) {
  const { totals, offer } = useStore()
  return (
    <aside className="summary">
      <h2>Order summary</h2>
      <dl>
        <div><dt>Subtotal</dt><dd>{inr(totals.subtotal)}</dd></div>
        {totals.discount > 0 && <div className="green"><dt>Discount ({offer.code})</dt><dd>−{inr(totals.discount)}</dd></div>}
        <div><dt>Shipping</dt><dd>{totals.shipping === 0 ? 'Free' : inr(totals.shipping)}</dd></div>
        <div className="total"><dt>Total</dt><dd>{inr(totals.total)}</dd></div>
      </dl>
      {totals.shipping > 0 && (
        <p className="muted small">Add {inr(FREE_SHIPPING_ABOVE - (totals.subtotal - totals.discount))} more for free shipping.</p>
      )}
      {children}
    </aside>
  )
}

export default function Cart() {
  const { totals, setQty, removeFromCart, coupon, setCoupon, offer } = useStore()
  const [code, setCode] = useState(coupon)
  const [msg, setMsg] = useState('')

  const apply = (e) => {
    e.preventDefault()
    const ok = offer.active && code.trim().toUpperCase() === offer.code.toUpperCase()
    setCoupon(ok ? code.trim().toUpperCase() : '')
    setMsg(ok ? `Code applied: ${offer.percent}% off` : 'That code is not valid.')
  }

  if (totals.lines.length === 0) {
    return (
      <div className="empty">
        <h1>Your cart is empty</h1>
        <Link className="btn" to="/shop">Start shopping</Link>
      </div>
    )
  }

  return (
    <>
      <h1>Your cart</h1>
      <div className="two-col">
        <div>
          {totals.lines.map(({ product, qty }) => (
            <div className="line" key={product.id}>
              <Link to={`/product/${product.id}`}><Thumb product={product} /></Link>
              <div className="line-info">
                <Link to={`/product/${product.id}`} className="card-title">{product.name}</Link>
                <span className="muted">{inr(product.price)} each</span>
                <div className="line-actions">
                  <div className="qty">
                    <button onClick={() => setQty(product.id, qty - 1)} aria-label="Decrease quantity">−</button>
                    <span>{qty}</span>
                    <button onClick={() => setQty(product.id, qty + 1)} disabled={qty >= product.stock} aria-label="Increase quantity">+</button>
                  </div>
                  <button className="link" onClick={() => removeFromCart(product.id)}>Remove</button>
                </div>
              </div>
              <strong>{inr(product.price * qty)}</strong>
            </div>
          ))}
        </div>

        <Summary>
          <form className="coupon" onSubmit={apply}>
            <input placeholder="Coupon code" aria-label="Coupon code" value={code} onChange={(e) => setCode(e.target.value)} />
            <button className="btn btn-ghost" type="submit">Apply</button>
          </form>
          {msg && <p className={'small ' + (totals.couponValid ? 'green' : 'red')}>{msg}</p>}
          <Link className="btn btn-lg btn-block" to="/checkout">Proceed to checkout</Link>
        </Summary>
      </div>
    </>
  )
}
