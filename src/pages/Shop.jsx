import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useStore } from '../store'
import { CATEGORIES } from '../data'
import ProductCard from '../components/ProductCard'

export default function Shop() {
  const { products } = useStore()
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const category = params.get('category') ?? 'All'
  const [sort, setSort] = useState('featured')
  const [inStockOnly, setInStockOnly] = useState(false)

  const setCategory = (c) => {
    const next = new URLSearchParams(params)
    if (c === 'All') next.delete('category')
    else next.set('category', c)
    setParams(next)
  }

  const list = useMemo(() => {
    const term = q.toLowerCase()
    let out = products.filter(
      (p) =>
        (category === 'All' || p.category === category) &&
        (!inStockOnly || p.stock > 0) &&
        (!term || (p.name + ' ' + p.description + ' ' + p.category).toLowerCase().includes(term)),
    )
    if (sort === 'low') out = [...out].sort((a, b) => a.price - b.price)
    if (sort === 'high') out = [...out].sort((a, b) => b.price - a.price)
    if (sort === 'name') out = [...out].sort((a, b) => a.name.localeCompare(b.name))
    if (sort === 'featured') out = [...out].sort((a, b) => Number(b.featured) - Number(a.featured))
    return out
  }, [products, q, category, sort, inStockOnly])

  return (
    <>
      <h1>{q ? `Results for “${q}”` : category === 'All' ? 'All products' : category}</h1>

      <div className="toolbar">
        <div className="chips">
          {['All', ...CATEGORIES].map((c) => (
            <button key={c} className={'chip' + (c === category ? ' chip-on' : '')} onClick={() => setCategory(c)}>
              {c}
            </button>
          ))}
        </div>
        <div className="toolbar-right">
          <label className="check">
            <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} /> In stock only
          </label>
          <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort products">
            <option value="featured">Sort: Featured</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>
      </div>

      <p className="muted">{list.length} {list.length === 1 ? 'product' : 'products'}</p>

      {list.length === 0 ? (
        <div className="empty">
          <p>No products match. Try a different search or category.</p>
          <button className="btn" onClick={() => setParams({})}>Clear filters</button>
        </div>
      ) : (
        <div className="grid">
          {list.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </>
  )
}
