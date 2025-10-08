import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ProductDetail.css";
import "../styles/common.css";
import { productService } from "../services/productAPI.js";
import cartService from "../services/cartAPI.js";

export default function ProductDetail({ user, onLogout }) {
    const { productId } = useParams();
    const navigate = useNavigate();

    const [p, setP] = useState(null);
    const [qty, setQty] = useState(1);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [err, setErr] = useState(null);
    const [toast, setToast] = useState("");

    const fmt = (n) => (Number(n) || 0).toFixed(2);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            setErr(null);
            try {
                const data = await productService.getProduct(productId);
                setP(data);
                setQty(1);
            } catch (e) {
                setErr("Failed to load product. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [productId]);

    const addToCart = async () => {
        if (!p) return;
        setSubmitting(true);
        setErr(null);
        try {
            await cartService.addItemToCart(p.id, qty);
            setToast("Added to cart ✓");
            setTimeout(() => setToast(""), 1200);
        } catch (e) {
            setErr("Failed to add to cart. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="product-detail-page">
                <nav className="navbar">
                    <div className="nav-container">
                        <a href="/" className="navbar-brand">
                            <span className="cart-icon">🛒</span>
                            Shopping Cart System
                        </a>
                    </div>
                </nav>
                <main className="container">
                    <div className="loading">Loading…</div>
                </main>
            </div>
        );
    }

    if (err) {
        return (
            <div className="product-detail-page">
                <nav className="navbar">
                    <div className="nav-container">
                        <a href="/" className="navbar-brand">
                            <span className="cart-icon">🛒</span>
                            Shopping Cart System
                        </a>
                    </div>
                </nav>
                <main className="container">
                    <div className="alert">
                        <span className="alert-icon">⚠️</span>
                        {err}
                    </div>
                    <button className="btn-primary" onClick={() => navigate(-1)}>Go Back</button>
                </main>
            </div>
        );
    }

    const inStock = Number(p?.stock) > 0;

    return (
        <div className="product-detail-page">
            <nav className="navbar">
                <div className="nav-container">
                    <a href="/" className="navbar-brand">
                        <span className="cart-icon">🛒</span>
                        Shopping Cart System
                    </a>
                    <div className="nav-links">
                        <a href="/" className="nav-link">Home</a>
                        <a href="/products" className="nav-link">Products</a>
                        <a href="/cart" className="nav-link">Cart</a>
                        <a href="/orders" className="nav-link">Orders</a>
                        {user && (
                            <div className="user-section">
                                <div className="user-info">
                                    <span className="user-icon">👤</span>
                                    <span className="user-name">{user?.username || user?.name || "User"}</span>
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

            {toast && <div className="toast">{toast}</div>}

            <main className="container">
                <div className="detail-header">
                    <h1>{p.name}</h1>
                    <div className={`stock-badge ${inStock ? "ok" : "out"}`}>
                        {inStock ? `In Stock (${p.stock})` : "Out of Stock"}
                    </div>
                </div>

                <div className="pd-grid">
                    {/* Image */}
                    <section className="panel pd-media">
                        <img
                            className="pd-hero"
                            src={p.imageUrl || "/images/default-product.jpg"}
                            alt={p.name}
                            onError={(e) => {
                                e.currentTarget.src = "/images/default-product.jpg";
                            }}
                        />
                    </section>

                    {/* Info & actions */}
                    <section className="panel pd-info">
                        <div className="pd-price">¥ {fmt(p.price)}</div>
                        <p className="pd-desc">{p.description || "Great product with excellent performance."}</p>

                        <div className="pd-rows">
                            <div className="row">
                                <span className="muted">Brand</span>
                                <span>{p.brand || "-"}</span>
                            </div>
                            <div className="row">
                                <span className="muted">Category</span>
                                <span>{p.category || "-"}</span>
                            </div>
                            <div className="row">
                                <span className="muted">Updated</span>
                                <span>{new Date(p.updatedAt).toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="pd-actions">
                            <label className="qty">
                                Qty
                                <input
                                    type="number"
                                    min="1"
                                    max={Math.max(1, Number(p.stock) || 1)}
                                    value={qty}
                                    onChange={(e) => setQty(Math.max(1, Math.min(Number(e.target.value) || 1, Number(p.stock) || 1)))}
                                />
                            </label>
                            <button
                                className={`btn-primary ${(!inStock || submitting) ? "disabled" : ""}`}
                                disabled={!inStock || submitting}
                                onClick={addToCart}
                            >
                                {submitting ? "Adding…" : "Add to Cart"}
                            </button>
                            <button className="btn-ghost-dark" onClick={() => navigate("/products")}>
                                Back to Products
                            </button>
                        </div>
                    </section>
                </div>
            </main>
            <footer className="footer">
                <div className="container">
                    <p>&copy; 2025 WLLCH Co., Ltd. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}