import { Link } from 'react-router-dom'
import { useStore } from '../store'
import { CATEGORIES } from '../data'
import ProductCard from '../components/ProductCard'

const ICONS = { Kitchen: '☕', Decor: '🪴', Textiles: '🧶', Wellness: '🕯️' }

export default function Home() {
  const { products } = useStore()
  const featured = products.filter((p) => p.featured).slice(0, 4)

  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">Handmade in small batches</p>
          <h1>Everyday things, made slowly and made well.</h1>
          <p className="lead">Stoneware, handloom textiles and home goods from independent makers across India.</p>
          <Link to="/shop" className="btn btn-lg">Shop the collection</Link>
        </div>
        <div className="hero-art" aria-hidden="true">
          <span>☕</span><span>🪴</span><span>🧶</span><span>🕯️</span>
        </div>
      </section>

      <section>
        <h2>Shop by category</h2>
        <div className="cat-grid">
          {CATEGORIES.map((c) => (
            <Link key={c} to={`/shop?category=${c}`} className="cat">
              <span className="cat-icon">{ICONS[c]}</span>
              <span>{c}</span>
              <small>{products.filter((p) => p.category === c).length} products</small>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="row-between">
          <h2>Featured</h2>
          <Link to="/shop">View all →</Link>
        </div>
        <div className="grid">
          {featured.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      <section className="perks">
        <div><strong>Free shipping</strong><span>on orders above ₹999</span></div>
        <div><strong>7-day returns</strong><span>no questions asked</span></div>
        <div><strong>Secure checkout</strong><span>UPI, cards and COD</span></div>
      </section>
    </>
  )
}
