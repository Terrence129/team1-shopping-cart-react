import React, { useState } from 'react'
import { authService } from '../services/authAPI.js'
import './Login.css'
import '../styles/common.css'

function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('') // Clear error when user types
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await authService.login(formData)
      console.log(response)
      if (response.success) {
        localStorage.setItem('username', response.username)
        onLogin(response.username)

      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login, Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = formData.username.trim() && formData.password.trim()

  return (
    <div className="login-page">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <a href="/" className="navbar-brand">
            <span className="cart-icon">🛒</span>
            Shopping Cart System
          </a>
          <div className="nav-links">
            <a href="/" className="nav-link">Home</a>
            <a href="/products" className="nav-link">Products</a>
          </div>
        </div>
      </nav>

      <div className="container">
        <div className="login-container">
          <div className="login-card">
            {/* Login Header */}
            <div className="login-header">
              <div className="login-icon">🔐</div>
              <h1>User Login</h1>
              <p>Enter your info to login</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="alert alert-danger">
                <span className="alert-icon">⚠️</span>
                {error}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="username">
                  <span className="label-icon">👤</span>
                  用户名
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Please enter username"
                  className="form-input"
                  required
                  autoComplete="username"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  <span className="label-icon">🔒</span>
                  密码
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Please enter password"
                  className="form-input"
                  required
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                className={`login-btn ${loading ? 'loading' : ''} ${!isFormValid ? 'disabled' : ''}`}
                disabled={loading || !isFormValid}
              >
                {loading ? (
                  <>
                    <span className="spinner">⏳</span>
                    Logining...
                  </>
                ) : (
                  <>
                    <span className="btn-icon">🚀</span>
                    Login now
                  </>
                )}
              </button>
            </form>

            {/* Login Footer */}
            <div className="login-footer">
              <div className="divider">
                <span>OR</span>
              </div>
              <div className="guest-access">
                <button className="guest-btn" onClick={() => window.location.href = '/products'}>
                  <span className="guest-icon">👁️</span>
                  View as a guest
                </button>
              </div>
              <p className="signup-prompt">
                Do not have an account？<a href="#" className="signup-link">Sign up now</a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2025 WLLCH Co., Ltd. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Login