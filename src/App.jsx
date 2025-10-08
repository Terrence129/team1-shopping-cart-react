import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Products from './components/Products'
import Login from './components/Login'
import Cart from './components/Cart'
import './App.css'
import Checkout from "./components/Checkout.jsx";
import OrderList from "./components/OrderList.jsx";
import Payment from "./components/Payment.jsx";
import OrderDetail from "./components/OrderDetail.jsx";
import ProductDetail from "./components/ProductDetail.jsx";
import Home from "./components/Home.jsx";

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setUser(null)
    // Check for existing user session on app load
    const username = localStorage.getItem('username')
    console.log(username)
    if (username) {
      try {
        setUser(username)
      } catch (error) {
        console.error('Error parsing user data:', error)
        localStorage.removeItem('username')
      }
    }
    setLoading(false)
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
  }

  const handleLogout = () => {
    localStorage.removeItem('username')
    setUser(null)
  }

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner">
          <span className="spinner-icon">⏳</span>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            user ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} /> // replace means it will not keep '/login' as a history
          }
        />
        <Route path="/" element={<Home user={user} onLogout={handleLogout} />}/>
        <Route
          path="/products"
          element={
            user ? <Products user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />
          }
        />
        <Route path="/products/:productId" element={<ProductDetail user={user} onLogout={handleLogout} />} />
        <Route path="/cart"
               element={user ? <Cart user={user} onLogout={handleLogout}/> : <Navigate to="/login" replace />} />
        <Route path="/checkout"
               element={user ? <Checkout user={user} onLogout={handleLogout}/> : <Navigate to="/login" replace />} />
        <Route
            path="/orders"
            element={user ? <OrderList user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />}
        />
        <Route
            path="/payment/:orderId"
            element={
              user ? <Payment user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />
            }
        />
        <Route path="/orders/:orderId" element={<OrderDetail user={user} onLogout={handleLogout} />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App