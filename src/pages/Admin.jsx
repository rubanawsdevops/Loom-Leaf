import { useState } from 'react'
import { useStore } from '../store'
import { CATEGORIES, inr } from '../data'
import { Thumb } from '../components/ProductCard'

const blank = { id: '', name: '', category: CATEGORIES[0], price: '', mrp: '', stock: '', emoji: '🛍️', hue: 30, image: '', description: '', featured: false }

function ProductForm({ initial, onSave, onCancel }) {
  const [f, setF] = useState(initial)
  const [error, setError] = useState('')
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })

  const submit = (e) => {
    e.preventDefault()
    const price = Number(f.price)
    const mrp = Number(f.mrp || f.price)
    const stock = Number(f.stock)
    if (!f.name.trim()) return setError('Name is required.')
    if (!(price > 0)) return setError('Price must be more than 0.')
    if (mrp < price) return setError('MRP cannot be lower than the selling price.')
    if (!(stock >= 0) || !Number.isInteger(stock)) return setError('Stock must be a whole number, 0 or more.')
    onSave({ ...f, name: f.name.trim(), price, mrp, stock, hue: Number(f.hue) })
  }

  return (
    <form className="form admin-form" onSubmit={submit}>
      <h2>{initial.id ? 'Edit product' : 'Add product'}</h2>
      <label className="field"><span>Name</span><input value={f.name} onChange={set('name')} /></label>
      <div className="field-row">
        <label className="field"><span>Category</span>
          <select value={f.category} onChange={set('category')}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
        </label>
        <label className="field"><span>Stock</span><input type="number" min="0" value={f.stock} onChange={set('stock')} /></label>
      </div>
      <div className="field-row">
        <label className="field"><span>Selling price (₹)</span><input type="number" min="1" value={f.price} onChange={set('price')} /></label>
        <label className="field"><span>MRP (₹)</span><input type="number" min="1" value={f.mrp} onChange={set('mrp')} /></label>
      </div>
      <label className="field"><span>Description</span><textarea rows="3" value={f.description} onChange={set('description')} /></label>
      <label className="field"><span>Image URL (optional)</span><input placeholder="https://…" value={f.image} onChange={set('image')} /></label>
      <div className="field-row">
        <label className="field"><span>Emoji (used when there is no image)</span><input value={f.emoji} onChange={set('emoji')} maxLength={4} /></label>
        <label className="field"><span>Tile colour</span><input type="range" min="0" max="359" value={f.hue} onChange={set('hue')} /></label>
      </div>
      <label className="check"><input type="checkbox" checked={f.featured} onChange={set('featured')} /> Show on home page as featured</label>
      {error && <p className="red small">{error}</p>}
      <div className="row-center start">
        <button className="btn" type="submit">Save product</button>
        <button className="btn btn-ghost" type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  )
}

function Products() {
  const { products, saveProduct, deleteProduct } = useStore()
  const [editing, setEditing] = useState(null)

  if (editing) {
    return <ProductForm initial={editing} onCancel={() => setEditing(null)} onSave={(p) => { saveProduct(p); setEditing(null) }} />
  }
  return (
    <>
      <div className="row-between">
        <p className="muted">{products.length} products · {products.filter((p) => p.stock === 0).length} sold out</p>
        <button className="btn" onClick={() => setEditing(blank)}>+ Add product</button>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th></th><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th></th></tr></thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td><Thumb product={p} /></td>
                <td>{p.name}{p.featured && <span className="tag tag-inline">Featured</span>}</td>
                <td>{p.category}</td>
                <td>{inr(p.price)}</td>
                <td className={p.stock === 0 ? 'red' : ''}>{p.stock}</td>
                <td className="actions">
                  <button className="link" onClick={() => setEditing(p)}>Edit</button>
                  <button className="link red" onClick={() => window.confirm(`Delete "${p.name}"?`) && deleteProduct(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

function Offer() {
  const { offer, setOffer } = useStore()
  const [f, setF] = useState(offer)
  const [saved, setSaved] = useState(false)
  const set = (k) => (e) => { setSaved(false); setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }) }

  const submit = (e) => {
    e.preventDefault()
    const percent = Math.max(1, Math.min(90, Number(f.percent) || 1))
    const next = { ...f, percent, code: f.code.trim().toUpperCase() || 'OFFER' }
    setF(next)
    setOffer(next)
    setSaved(true)
  }
  return (
    <form className="form admin-form" onSubmit={submit}>
      <h2>Site-wide offer</h2>
      <label className="check"><input type="checkbox" checked={f.active} onChange={set('active')} /> Offer is live (shows the banner and accepts the code)</label>
      <label className="field"><span>Banner text</span><input value={f.text} onChange={set('text')} /></label>
      <div className="field-row">
        <label className="field"><span>Coupon code</span><input value={f.code} onChange={set('code')} /></label>
        <label className="field"><span>Discount %</span><input type="number" min="1" max="90" value={f.percent} onChange={set('percent')} /></label>
      </div>
      <div className="row-center start">
        <button className="btn" type="submit">Save offer</button>
        {saved && <span className="green small">Saved. The banner is updated.</span>}
      </div>
    </form>
  )
}

function Orders() {
  const { orders, setOrderStatus } = useStore()
  if (orders.length === 0) return <p className="muted">No orders yet. Place one from the store and it will appear here.</p>
  const revenue = orders.reduce((s, o) => s + o.total, 0)
  return (
    <>
      <p className="muted">{orders.length} orders · {inr(revenue)} total</p>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th></tr></thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>{o.id}<br /><small className="muted">{new Date(o.date).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</small></td>
                <td>{o.customer.name}<br /><small className="muted">{o.customer.city} · {o.customer.payment}</small></td>
                <td>{o.items.map((i) => `${i.qty} × ${i.name}`).join(', ')}</td>
                <td>{inr(o.total)}</td>
                <td>
                  <select value={o.status} onChange={(e) => setOrderStatus(o.id, e.target.value)} aria-label="Order status">
                    {['New', 'Packed', 'Shipped', 'Delivered', 'Cancelled'].map((s) => <option key={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default function Admin() {
  const { resetDemo, orders } = useStore()
  const [tab, setTab] = useState('Products')
  const tabs = { Products: <Products />, Offer: <Offer />, Orders: <Orders /> }

  return (
    <>
      <div className="row-between">
        <h1>Store admin</h1>
        <button className="link" onClick={() => window.confirm('Reset all products, offers and orders to the starting demo data?') && resetDemo()}>
          Reset demo data
        </button>
      </div>
      <p className="note">Demo admin: there is no login, and changes are saved in this browser only. A live store would put this page behind a sign-in and a database.</p>
      <div className="chips tabs">
        {Object.keys(tabs).map((t) => (
          <button key={t} className={'chip' + (t === tab ? ' chip-on' : '')} onClick={() => setTab(t)}>
            {t}{t === 'Orders' && orders.length > 0 ? ` (${orders.length})` : ''}
          </button>
        ))}
      </div>
      {tabs[tab]}
    </>
  )
}
