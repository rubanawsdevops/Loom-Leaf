import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../store'
import { inr } from '../data'
import { Summary } from './Cart'

const empty = { name: '', phone: '', email: '', address: '', city: '', pincode: '', payment: 'UPI' }

function validate(f) {
  const e = {}
  if (f.name.trim().length < 2) e.name = 'Enter your full name'
  if (!/^[6-9]\d{9}$/.test(f.phone)) e.phone = 'Enter a 10-digit mobile number'
  if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = 'Enter a valid email'
  if (f.address.trim().length < 8) e.address = 'Enter your full address'
  if (!f.city.trim()) e.city = 'Enter your city'
  if (!/^\d{6}$/.test(f.pincode)) e.pincode = 'Enter a 6-digit PIN code'
  return e
}

export default function Checkout() {
  const { totals, placeOrder } = useStore()
  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState({})
  const [order, setOrder] = useState(null)

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    const found = validate(form)
    setErrors(found)
    if (Object.keys(found).length === 0) setOrder(placeOrder(form))
  }

  if (order) {
    return (
      <div className="empty">
        <div className="tick">✓</div>
        <h1>Order placed</h1>
        <p>Thank you, {order.customer.name}. Your order <strong>{order.id}</strong> for {inr(order.total)} is confirmed.</p>
        <p className="muted">This is a demo store, so nothing was charged. The order now shows up in the admin panel.</p>
        <div className="row-center">
          <Link className="btn" to="/shop">Keep shopping</Link>
          <Link className="btn btn-ghost" to="/admin">See it in admin</Link>
        </div>
      </div>
    )
  }

  if (totals.lines.length === 0) {
    return (
      <div className="empty">
        <h1>Nothing to check out</h1>
        <Link className="btn" to="/shop">Go to shop</Link>
      </div>
    )
  }

  const field = (key, label, props = {}) => (
    <label className="field">
      <span>{label}</span>
      <input value={form[key]} onChange={set(key)} aria-invalid={!!errors[key]} {...props} />
      {errors[key] && <em>{errors[key]}</em>}
    </label>
  )

  return (
    <>
      <h1>Checkout</h1>
      <div className="two-col">
        <form className="form" onSubmit={submit} noValidate>
          <h2>Delivery details</h2>
          {field('name', 'Full name', { autoComplete: 'name' })}
          <div className="field-row">
            {field('phone', 'Mobile number', { inputMode: 'numeric', maxLength: 10, autoComplete: 'tel' })}
            {field('email', 'Email', { type: 'email', autoComplete: 'email' })}
          </div>
          {field('address', 'Address', { autoComplete: 'street-address' })}
          <div className="field-row">
            {field('city', 'City')}
            {field('pincode', 'PIN code', { inputMode: 'numeric', maxLength: 6 })}
          </div>

          <h2>Payment</h2>
          <div className="pay">
            {['UPI', 'Card', 'Cash on delivery'].map((m) => (
              <label key={m} className={'pay-opt' + (form.payment === m ? ' pay-on' : '')}>
                <input type="radio" name="payment" value={m} checked={form.payment === m} onChange={set('payment')} /> {m}
              </label>
            ))}
          </div>
          <p className="muted small">Demo checkout: no payment is taken.</p>
          <button className="btn btn-lg btn-block" type="submit">Place order · {inr(totals.total)}</button>
        </form>

        <Summary>
          <ul className="mini">
            {totals.lines.map(({ product, qty }) => (
              <li key={product.id}><span>{qty} × {product.name}</span><span>{inr(product.price * qty)}</span></li>
            ))}
          </ul>
        </Summary>
      </div>
    </>
  )
}
