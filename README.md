# Loom & Leaf — React e-commerce store

A demo online store for handmade home goods, with a working admin panel.

**Live demo:** _add your Netlify link here_

## Features

**Store**
- Product catalogue with categories, search, sorting and an in-stock filter
- Product pages with stock status and related products
- Cart with quantity controls, coupon code and free-shipping threshold
- Checkout with form validation and an order confirmation (demo, no real payment)
- Responsive layout for mobile, tablet and desktop

**Admin panel (`/admin`)**
- Add, edit and delete products (price, MRP, stock, image, featured flag)
- Turn the site-wide offer banner on or off and change the coupon code and discount
- See orders and update their status; stock goes down when an order is placed

## Tech stack

React 18, React Router 6, Vite, plain CSS. Data is stored in the browser's
localStorage, so there is no backend to set up.

## Run locally

```bash
npm install
npm run dev
```

## Project structure

```
src/
  data.js          starting products, offer, shipping rules
  store.jsx        app state (products, cart, orders) + localStorage
  App.jsx          routes and page layout
  components/      Header, ProductCard
  pages/           Home, Shop, Product, Cart, Checkout, Admin
  styles.css       all styling
```


