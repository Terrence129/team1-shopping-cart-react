import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./OrderDetail.css";
import "../styles/common.css";
import orderService from "../services/orderAPI.js";

export default function OrderDetail({ user, onLogout }) {
    const { orderId } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);

    const fmt = (n) => (Number(n) || 0).toFixed(2);

    useEffect(() => {
        const fetchOrder = async () => {
            setLoading(true);
            setErr(null);
            try {
                const data = await orderService.getOrder(orderId);
                setOrder(data);
            } catch (e) {
                setErr("Failed to load order. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [orderId]);

    if (loading) {
        return (
            <div className="order-detail-page">
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
            <div className="order-detail-page">
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

    const items = order?.items || [];
    const isPending = order?.status === "PENDING";

    return (
        <div className="order-detail-page">
            {/* Top bar */}
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

            {/* Body */}
            <main className="container">
                <header className="detail-header">
                    <div>
                        <h1>Order Detail</h1>
                        <div className="muted">
                            Order No. <strong>{order.orderNumber}</strong>
                        </div>
                    </div>
                    <div className={`status-badge ${isPending ? "pending" : "normal"}`}>
                        {order.status}
                    </div>
                </header>

                <div className="detail-grid">
                    {/* Left: Shipping & Payment */}
                    <section className="panel">
                        <h3 className="panel-title">Shipping Information</h3>
                        <div className="info-row">
                            <span className="info-label">Recipient</span>
                            <span className="info-value">{order.recipientName}</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">Phone</span>
                            <span className="info-value">{order.recipientPhone}</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">Address</span>
                            <span className="info-value">{order.shippingAddr}</span>
                        </div>

                        <h3 className="panel-title mt">Payment</h3>
                        <div className="info-row">
                            <span className="info-label">Method</span>
                            <span className="info-value">{order.paymentMethod}</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">Created</span>
                            <span className="info-value">{new Date(order.createdAt).toLocaleString()}</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">Updated</span>
                            <span className="info-value">{new Date(order.updatedAt).toLocaleString()}</span>
                        </div>
                        {order.notes && (
                            <>
                                <h3 className="panel-title mt">Notes</h3>
                                <div className="info-row">
                                    <span className="info-value">{order.notes}</span>
                                </div>
                            </>
                        )}
                    </section>

                    {/* Right: Items & Total */}
                    <aside className="summary">
                        <h3 className="panel-title">Items</h3>
                        <div className="summary-list">
                            {items.length === 0 ? (
                                <div className="muted">No items.</div>
                            ) : (
                                items.map((it, idx) => (
                                    <div key={`${it.productId}-${idx}`} className="summary-item">
                                        <img
                                            className="item-thumb"
                                            src={it.imageUrl || "/images/default-product.jpg"}
                                            alt={it.productName}
                                            onError={(e) => {
                                                e.currentTarget.src = "/images/default-product.jpg";
                                            }}
                                        />
                                        <div className="item-info">
                                            <div className="item-title">{it.productName}</div>
                                            <div className="item-sub">{it.quantity} × ¥ {fmt(it.unitPrice)}</div>
                                        </div>
                                        <div className="item-amt">¥ {fmt(it.subtotal)}</div>
                                    </div>
                                ))
                            )}
                        </div>

                        <hr className="hr"/>
                        <div className="summary-row">
                            <span>Total Quantity</span>
                            <span>{order.totalQuantity ?? items.reduce((a, b) => a + (b.quantity || 0), 0)}</span>
                        </div>
                        <div className="summary-row strong">
                            <span>Total Amount</span>
                            <span>¥ {fmt(order.totalPrice ?? items.reduce((a, b) => a + (Number(b.subtotal) || 0), 0))}</span>
                        </div>

                        <div className="summary-actions">
                            <button className="btn-ghost-dark" onClick={() => navigate("/orders")}>
                                Back to Orders
                            </button>
                            {isPending && (
                                <button
                                    className="btn-primary"
                                    onClick={() => navigate(`/payment/${order.orderId}`)}
                                >
                                    Pay Now
                                </button>
                            )}
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