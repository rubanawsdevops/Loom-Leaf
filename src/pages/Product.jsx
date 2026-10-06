import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useStore } from '../store'
import ProductCard, { Thumb, Price } from '../components/ProductCard'

export default function Product() {
  const { id } = useParams()
  const { products, addToCart, cart } = useStore()
  const navigate = useNavigate()
  const [qty, setQty] = useState(1)
  const product = products.find((p) => p.id === id)

  if (!product) {
    return (
      <div className="empty">
        <h1>Product not found</h1>
        <Link className="btn" to="/shop">Back to shop</Link>
      </div>
    )
  }

  const inCart = cart.find((l) => l.id === id)?.qty ?? 0
  const available = product.stock - inCart
  const related = products.filter((p) => p.category === product.category && p.id !== id).slice(0, 4)

  return (
    <>
      <p className="crumbs">
        <Link to="/shop">Shop</Link> / <Link to={`/shop?category=${product.category}`}>{product.category}</Link> / {product.name}
      </p>
      <div className="product">
        <Thumb product={product} large />
        <div>
          <span className="tag">{product.category}</span>
          <h1>{product.name}</h1>
          <Price product={product} />
          <p className="lead">{product.description}</p>
          <p className={product.stock === 0 ? 'stock out' : product.stock <= 5 ? 'stock low' : 'stock'}>
            {product.stock === 0 ? 'Sold out' : product.stock <= 5 ? `Only ${product.stock} left` : 'In stock'}
          </p>

          {available > 0 ? (
            <div className="buy">
              <div className="qty">
                <button onClick={() => setQty((n) => Math.max(1, n - 1))} aria-label="Decrease quantity">−</button>
                <span>{Math.min(qty, available)}</span>
                <button onClick={() => setQty((n) => Math.min(available, n + 1))} aria-label="Increase quantity">+</button>
              </div>
              <button className="btn btn-lg" onClick={() => { addToCart(id, Math.min(qty, available)); setQty(1) }}>
                Add to cart
              </button>
              <button className="btn btn-lg btn-ghost" onClick={() => { addToCart(id, Math.min(qty, available)); navigate('/cart') }}>
                Buy now
              </button>
            </div>
          ) : (
            product.stock > 0 && <p className="muted">All available stock is already in your cart.</p>
          )}
          {inCart > 0 && <p className="muted">{inCart} in your cart · <Link to="/cart">View cart</Link></p>}
        </div>
      </div>

      {related.length > 0 && (
        <section>
          <h2>More in {product.category}</h2>
          <div className="grid">{related.map((p) => <ProductCard key={p.id} product={p} />)}</div>
        </section>
      )}
    </>
  )
}
