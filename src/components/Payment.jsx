import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./Payment.css";
import "../styles/common.css";
import orderService from "../services/orderAPI.js";

export default function Payment({ user, onLogout }) {
    const { orderId } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paying, setPaying] = useState(false);
    const [error, setError] = useState("");

    const fmt = (n) => (Number(n) || 0).toFixed(2);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setLoading(true);
                setError("");
                const data = await orderService.getOrder(orderId);
                if (mounted) setOrder(data);
            } catch (e) {
                setError("Failed to load order. Please try again.");
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, [orderId]);

    const canPay = order && order.status === "PENDING" && !paying;

    const handlePay = async () => {
        if (!canPay) return;
        try {
            setPaying(true);
            setError("");
            const res = await orderService.payOrder(order.orderId);
            if (res?.success) {
                navigate("/orders", { replace: true });
            } else {
                setError("Payment failed. Please try again.");
            }
        } catch (e) {
            setError("Payment failed. Please try again.");
        } finally {
            setPaying(false);
        }
    };

    if (loading) {
        return (
            <div className="payment-page">
                <nav className="navbar">
                    <div className="nav-container">
                        <a href="/" className="navbar-brand">
                            <span className="cart-icon">🛒</span> Shopping Cart System
                        </a>
                    </div>
                </nav>
                <main className="container"><div className="loading">Loading…</div></main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="payment-page">
                <nav className="navbar">
                    <div className="nav-container">
                        <a href="/" className="navbar-brand">
                            <span className="cart-icon">🛒</span> Shopping Cart System
                        </a>
                    </div>
                </nav>
                <main className="container">
                    <div className="alert"><span className="alert-icon">⚠️</span>{error}</div>
                    <Link className="btn-ghost-dark" to="/orders">Back to Orders</Link>
                </main>
            </div>
        );
    }

    const items = order?.items || [];

    return (
        <div className="payment-page">
            {/* Navbar */}
            <nav className="navbar">
                <div className="nav-container">
                    <a href="/" className="navbar-brand">
                        <span className="cart-icon">🛒</span> Shopping Cart System
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
                                    <span className="user-name">{user || "User"}</span>
                                </div>
                                <button onClick={onLogout} className="logout-btn">
                                    <span className="logout-icon">🚪</span> Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Content */}
            <main className="container">
                <div className="page-header">
                    <div className="header-content">
                        <h1>Payment</h1>
                        <div className="sub">
                            <span>Order No.</span>
                            <strong className="mono">{order.orderNumber}</strong>
                            <span className={`badge ${order.status === "PENDING" ? "bg-warning" : "bg-success"}`}>
                {order.status}
              </span>
                        </div>
                    </div>
                    <Link className="btn-ghost-dark" to="/orders">Back</Link>
                </div>

                <div className="payment-grid">
                    {/* Left: Order info */}
                    <section className="panel">
                        <h3 className="panel-title">Items</h3>
                        {items.length === 0 ? (
                            <div className="muted">No items in this order.</div>
                        ) : (
                            <div className="list">
                                {items.map((it, idx) => (
                                    <article className="card" key={idx}>
                                        <div className="row">
                                            <img
                                                className="thumb"
                                                src={it.imageUrl || "/images/default-product.jpg"}
                                                alt={it.productName}
                                                onError={(e) => {
                                                    e.currentTarget.src = "/images/default-product.jpg";
                                                }}
                                            />
                                            <div className="info">
                                                <div className="title">{it.productName}</div>
                                                <div className="muted">{it.quantity} × ¥ {fmt(it.unitPrice)}</div>
                                            </div>
                                            <div className="sum">¥ {fmt(it.subtotal)}</div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}

                        <h3 className="panel-title mt">Shipping</h3>
                        <div className="kv">
                            <div><span className="k">Recipient</span><span className="v">{order.recipientName}</span>
                            </div>
                            <div><span className="k">Phone</span><span className="v">{order.recipientPhone}</span></div>
                            <div><span className="k">Address</span><span className="v">{order.shippingAddr}</span></div>
                        </div>

                        <h3 className="panel-title mt">Payment Method</h3>
                        <div className="kv">
                            <div><span className="k">Method</span><span className="v">{order.paymentMethod}</span></div>
                        </div>
                    </section>

                    {/* Right: Summary & Pay */}
                    <aside className="summary">
                        <h3 className="panel-title">Order Summary</h3>
                        <div className="summary-row">
                            <span>Items</span>
                            <span>{order.totalQuantity}</span>
                        </div>
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>¥ {fmt(order.totalPrice)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping</span>
                            <span className="text-success">Free</span>
                        </div>
                        <hr className="hr"/>
                        <div className="summary-row strong">
                            <span>Amount Due</span>
                            <span>¥ {fmt(order.totalPrice)}</span>
                        </div>

                        {error && (
                            <div className="alert mt">
                                <span className="alert-icon">⚠️</span>{error}
                            </div>
                        )}

                        <div className="summary-actions">
                            <button
                                className={`btn-primary ${!canPay ? "disabled" : ""}`}
                                disabled={!canPay}
                                onClick={handlePay}
                            >
                                {paying ? "Processing…" : "Pay Now"}
                            </button>
                            <Link className="btn-ghost-dark" to="/orders">Cancel</Link>
                        </div>
                    </aside>
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