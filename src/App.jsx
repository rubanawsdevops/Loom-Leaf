import { useEffect } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Admin from './pages/Admin'
import { useStore } from './store'

function OfferBar() {
  const { offer } = useStore()
  if (!offer.active) return null
  return (
    <div className="offer-bar">
      {offer.text} · use code <strong>{offer.code}</strong> at checkout
    </div>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <OfferBar />
      <Header />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin" element={<Admin />} />
          <Route
            path="*"
            element={
              <div className="empty">
                <h1>Page not found</h1>
                <Link className="btn" to="/">Back to home</Link>
              </div>
            }
          />
        </Routes>
      </main>
      <footer className="footer">
        <div className="container footer-inner">
          <span>🌿 Loom &amp; Leaf · a demo store, no real orders are taken</span>
          <span>
            <Link to="/shop">Shop</Link> · <Link to="/admin">Admin</Link>
          </span>
        </div>
      </footer>
    </>
  )
}
