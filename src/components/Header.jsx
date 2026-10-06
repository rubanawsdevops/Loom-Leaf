import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useStore } from '../store'

export default function Header() {
  const { totals } = useStore()
  const [q, setQ] = useState('')
  const navigate = useNavigate()

  const onSearch = (e) => {
    e.preventDefault()
    navigate(q.trim() ? `/shop?q=${encodeURIComponent(q.trim())}` : '/shop')
  }

  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="logo">🌿 Loom &amp; Leaf</Link>
        <form className="search" onSubmit={onSearch} role="search">
          <input
            type="search"
            placeholder="Search products"
            aria-label="Search products"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </form>
        <nav className="nav">
          <NavLink to="/shop">Shop</NavLink>
          <NavLink to="/admin">Admin</NavLink>
          <NavLink to="/cart" className="cart-link">
            Cart <span className="badge">{totals.count}</span>
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
