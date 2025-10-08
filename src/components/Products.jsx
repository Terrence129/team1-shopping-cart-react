import React, { useState, useEffect } from 'react'
import { productService } from '../services/productAPI.js'
import { useNavigate, useParams } from "react-router-dom";
import './Products.css'
import '../App.css'
import '../styles/common.css'
import cartService from "../services/cartAPI.js";

function Products({ user, onLogout }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(0)

  // API data states
  const [productsData, setProductsData] = useState({
    content: [],
    page: 0,
    size: 12,
    totalPages: 0,
    total: 0,
    hasNext: false
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // NEW: per-item adding spinner + lightweight toast
  const [addingId, setAddingId] = useState(null)
  const [toast, setToast] = useState('')

  const itemsPerPage = 12

  useEffect(() => {
    fetchProducts()
  }, [searchTerm, currentPage])

  const fetchProducts = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = { page: currentPage, size: itemsPerPage, keyword: searchTerm }
      const data = await productService.getProducts(params)
      setProductsData(data)
    } catch (err) {
      console.error('Failed to fetch products:', err)
      setError('Failed to load products. Please try again later.')
      setProductsData({ content: [], page: 0, size: itemsPerPage, totalPages: 0, total: 0, hasNext: false })
    } finally {
      setLoading(false)
    }
  }

  // NEW: super-simple add-to-cart
  const addItemToCart = async (productId, quantity = 1) => {
    if (!user) {
      setToast('Please login to add items')
      setTimeout(() => setToast(''), 1500)
      return
    }
    try {
      setAddingId(productId)
      await cartService.addItemToCart(productId, quantity)
      setToast('Added to cart ✓')
    } catch (err) {
      console.error(err)
      setToast(err?.response?.data?.message || 'Failed to add, please retry.')
    } finally {
      setAddingId(null)
      setTimeout(() => setToast(''), 1500)
    }
  }

  const resetFilters = () => {
    setSearchTerm('')
    setCurrentPage(0)
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < productsData.totalPages) setCurrentPage(newPage)
  }

  const productDetails = (productId) => {
    navigate(`/products/${productId}`)
  }

  return (
      <div className="products-page">
        {/* Navigation */}
        <nav className="navbar">
          <div className="nav-container">
            <a href="/" className="navbar-brand">
              <span className="cart-icon">🛒</span>
              Shopping Cart System
            </a>
            <div className="nav-links">
              <a href="/" className="nav-link">Home</a>
              <a href="/products" className="nav-link active">Products</a>
              <a href="/cart" className="nav-link">Cart</a>
              <a href="/orders" className="nav-link">Orders</a>
              {user && (
                  <div className="user-section">
                    <div className="user-info">
                      <span className="user-icon">👤</span>
                      <span className="user-name">{user || 'User'}</span>
                    </div>
                    <button onClick={onLogout} className="logout-btn">
                      <span className="logout-icon">🚪</span>
                      Logout
                    </button>
                  </div>
              )}
            </div>
          </div>
        </nav>

        <div className="container">
          {/* Page Title and Search */}
          <div className="page-header">
            <div className="header-content">
              <h1>Product List</h1>
              {searchTerm && (
                  <div className="search-info">
                    <span className="search-icon">🔍</span>
                    Search Results: <strong>{searchTerm}</strong>
                    <span className="results-count">Found {productsData.total} products</span>
                  </div>
              )}
            </div>
            <div className="search-container">
              <div className="search-box">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <button className="search-btn">🔍</button>
              </div>
              <button onClick={resetFilters} className="reset-btn">
                <span className="icon">🔄</span> Reset
              </button>
            </div>
          </div>

          {/* Products List */}
          <main className="products-main">
            {/* Results Info */}
            <div className="products-header">
              <div className="results-info">
                {loading ? 'Loading...' : (
                    `Showing ${productsData.content.length > 0 ? 1 : 0} - ${productsData.content.length} of ${productsData.total} products`
                )}
              </div>
            </div>

            {/* Loading */}
            {loading && (
                <div className="loading-state">
                  <div className="loading-spinner">⏳ Loading products...</div>
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="error-state">
                  <div className="error-message">
                    <span className="error-icon">⚠️</span>
                    {error}
                    <button onClick={fetchProducts} className="retry-btn">Retry</button>
                  </div>
                </div>
            )}

            {/* Toast (NEW) */}
            {toast && <div className="toast">{toast}</div>}

            {/* Products Grid */}
            {!loading && !error && productsData.content.length === 0 ? (
                <div className="no-products">
                  <div className="no-products-icon">📦</div>
                  <h3>No Products Found</h3>
                  <p>No products match your current search. Try different keywords.</p>
                </div>
            ) : (
                !loading && !error && (
                    <div className="products-grid">
                      {productsData.content.map(product => (
                          <div
                              key={product.id}
                              className="product-card"
                              onClick={() => productDetails(product.id)}
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => (e.key === 'Enter' ? productDetails(product.id) : null)}
                          >
                            <div className="product-image-container">
                              <img
                                  src={product.imageUrl || `https://picsum.photos/seed/product${product.id}/300/300.jpg`}
                                  alt={product.name}
                                  className="product-image"
                                  loading="lazy"
                              />
                            </div>
                            <div className="product-body">
                              <h3 className="product-name">{product.name}</h3>
                              <p className="product-description">
                                {product.description || 'High-quality product with excellent features and performance.'}
                              </p>

                              {/* Price and Stock */}
                              <div className="product-meta">
                                <span className="price">${product.price?.toFixed(2) || '0.00'}</span>
                                <span className="stock">Stock: {product.stock ?? '—'}</span>
                              </div>

                              {/* Actions */}
                              <div className="product-actions">
                                {/* 2) 按钮点击时阻止冒泡，否则会触发外层 onClick 跳详情 */}
                                <button
                                    className="btn-outline"
                                    onClick={(e) => {
                                      e.stopPropagation();           // this can stop outside action
                                      addItemToCart(product.id, 1);
                                    }}
                                    disabled={addingId === product.id}
                                    title={addingId === product.id ? 'Adding…' : 'Add to Cart'}
                                >
                                  {addingId === product.id ? '⏳ Adding…' : '🛒 Add to Cart'}
                                </button>
                              </div>
                            </div>
                          </div>
                      ))}
                    </div>
                )
            )}

            {/* Pagination */}
            {!loading && !error && productsData.totalPages > 1 && (
                <div className="pagination">
                  <button
                      onClick={() => handlePageChange(productsData.page - 1)}
                      disabled={productsData.page === 0}
                      className="page-btn"
                  >
                    ←
                  </button>

                  {Array.from({ length: productsData.totalPages }, (_, i) => {
                    if (i >= productsData.page - 2 && i <= productsData.page + 2) {
                      return (
                          <button
                              key={i}
                              onClick={() => handlePageChange(i)}
                              className={`page-btn ${productsData.page === i ? 'active' : ''}`}
                          >
                            {i + 1}
                          </button>
                      )
                    }
                    return null
                  })}

                  <button
                      onClick={() => handlePageChange(productsData.page + 1)}
                      disabled={!productsData.hasNext}
                      className="page-btn"
                  >
                    →
                  </button>
                </div>
            )}
          </main>
        </div>

        <footer className="footer">
          <div className="container">
            <p>&copy; 2025 WLLCH Co., Ltd. All rights reserved.</p>
          </div>
        </footer>
      </div>
  )
}

export default Products