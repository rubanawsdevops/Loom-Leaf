import { Link } from 'react-router-dom'
import { useStore } from '../store'
import { inr } from '../data'

// Shows the product photo if an image URL was set in admin,
// otherwise a coloured tile with the product's emoji.
export function Thumb({ product, large = false }) {
  if (product.image) {
    return <img className={'thumb' + (large ? ' thumb-lg' : '')} src={product.image} alt={product.name} loading="lazy" />
  }
  const h = product.hue ?? 30
  return (
    <div
      className={'thumb' + (large ? ' thumb-lg' : '')}
      style={{ background: `linear-gradient(135deg, hsl(${h} 60% 90%), hsl(${(h + 30) % 360} 55% 80%))` }}
      role="img"
      aria-label={product.name}
    >
      <span>{product.emoji || '🛍️'}</span>
    </div>
  )
}

export function Price({ product }) {
  const off = product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0
  return (
    <div className="price">
      <strong>{inr(product.price)}</strong>
      {off > 0 && (
        <>
          <s>{inr(product.mrp)}</s>
          <span className="off">{off}% off</span>
        </>
      )}
    </div>
  )
}

export default function ProductCard({ product }) {
  const { addToCart, cart } = useStore()
  const inCart = cart.find((l) => l.id === product.id)?.qty ?? 0
  const soldOut = product.stock === 0
  const maxed = inCart >= product.stock

  return (
    <article className="card">
      <Link to={`/product/${product.id}`}>
        <Thumb product={product} />
      </Link>
      <div className="card-body">
        <span className="tag">{product.category}</span>
        <Link to={`/product/${product.id}`} className="card-title">{product.name}</Link>
        <Price product={product} />
        <button className="btn btn-block" disabled={soldOut || maxed} onClick={() => addToCart(product.id)}>
          {soldOut ? 'Sold out' : maxed ? 'Max in cart' : inCart ? `Add another (${inCart} in cart)` : 'Add to cart'}
        </button>
      </div>
    </article>
  )
}
