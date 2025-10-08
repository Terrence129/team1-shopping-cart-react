import React from "react";
import "./Home.css";
import "../styles/common.css";

export default function Home({ user, onLogout }) {
    return (
        <div className="home-page">
            {/* Navbar */}
            <nav className="navbar">
                <div className="nav-container">
                    <a href="/" className="navbar-brand">
                        <span className="cart-icon">🛒</span>
                        Shopping Cart System
                    </a>
                    <div className="nav-links">
                        <a href="/" className="nav-link active">Home</a>
                        <a href="/products" className="nav-link">Products</a>
                        <a href="/orders" className="nav-link">Orders</a>
                        {user && (
                            <div className="user-section">
                                <div className="user-info">
                                    <span className="user-icon">👤</span>
                                    <span className="user-name">{user || "User"}</span>
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

            {/* Hero */}
            <section className="hero">
                <div className="container hero-inner">
                    <h1>Welcome to Shopping Cart System</h1>
                    <p className="lead">Discover curated products and enjoy a simple checkout experience.</p>
                    <div className="hero-actions">
                        <a href="/products" className="btn-hero">Start Shopping</a>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="container features">
                <h2 className="section-title">Why Choose Us</h2>
                <p className="muted center">We focus on speed, security, and friendly service.</p>

                <div className="feature-grid">
                    <div className="feature-card">
                        <div className="feature-emoji">⚡</div>
                        <h3>Fast & Simple</h3>
                        <p className="muted">Clean UI that makes shopping effortless.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-emoji">🛡️</div>
                        <h3>Secure</h3>
                        <p className="muted">Your data is protected with modern practices.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-emoji">🎧</div>
                        <h3>Always Here</h3>
                        <p className="muted">Friendly support whenever you need it.</p>
                    </div>
                </div>
            </section>

            {/* Quick links */}
            <section className="quicklinks">
                <div className="container">
                    <h3 className="section-title">Quick Links</h3>
                    <p className="muted center">Jump right into what you need.</p>
                    <div className="link-grid">
                        <a href="/products" className="link-btn">Browse Products</a>
                        {!user && <a href="/login" className="link-btn info">Login</a>}
                        {!user && <a href="/register" className="link-btn info">Register</a>}
                        {user && <a href="/orders" className="link-btn warn">My Orders</a>}
                    </div>
                </div>
            </section>

            <footer className="footer">
                <div className="container">
                    <p>&copy; 2025 WLLCH Co., Ltd. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}