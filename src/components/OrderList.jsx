import React, { useEffect, useState } from "react";
import {replace, useNavigate} from "react-router-dom";
import "./OrderList.css";
import "../styles/common.css";
import orderService from "../services/orderAPI.js";

export default function OrderList({ user, onLogout }) {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError("");
            try {
                const data = await orderService.getOrders(); // ← returns the array you showed
                console.log(data);
                setOrders(Array.isArray(data) ? data : []);
            } catch (e) {
                setError("Failed to load orders. Please try again.");
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const payOrder = (orderId) => {
        navigate(`/payment/${orderId}`);
    }


    const fmt = (n) => (Number(n) || 0).toFixed(2);
    const fmtTime = (iso) => (iso ? new Date(iso).toLocaleString() : "—");

    const badgeClass = (status) => {
        switch ((status || "").toUpperCase()) {
            case "PENDING": return "badge warning";
            case "PAID": return "badge info";
            case "SHIPPED": return "badge primary";
            case "DELIVERED": return "badge success";
            case "CANCELLED": return "badge dark";
            default: return "badge gray";
        }
    };

    if (loading) {
        return (
            <div className="orders-page">
                <nav className="navbar">
                    <div className="nav-container">
                        <a href="/" className="navbar-brand">
                            <span className="cart-icon">🛒</span>
                            Shopping Cart System
                        </a>
                    </div>
                </nav>
                <main className="container"><div className="loading">Loading…</div></main>
            </div>
        );
    }

    return (
        <div className="orders-page">
            {/* Navbar */}
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
                        <a href="/orders" className="nav-link active">Orders</a>
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

            {/* Page header */}
            <main className="container">
                <div className="page-header">
                    <div className="header-content">
                        <h1>My Orders</h1>
                        <p className="muted">
                            Total <strong>{orders.length}</strong> {orders.length === 1 ? "order" : "orders"}
                        </p>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="alert">
                        <span className="alert-icon">⚠️</span>{error}
                    </div>
                )}

                {/* Empty */}
                {!error && orders.length === 0 && (
                    <div className="empty">
                        <div className="empty-icon">📭</div>
                        <h3>No Orders Yet</h3>
                        <p className="muted">You haven't placed any orders. Go pick something you like!</p>
                        <a className="btn-primary" href="/products">Shop Now</a>
                    </div>
                )}

                {/* List */}
                <div className="orders-list">
                    {orders.map((o) => (
                        <article className="order-card" key={o.orderId}>
                            <div className="order-header">
                                <div className="order-left">
                                    <h3 className="order-number">
                                        Order #: <a href={`/orders/${o.orderId}`}>{o.orderNumber}</a>
                                    </h3>
                                    <div className="order-time muted">Created: {fmtTime(o.createdAt)}</div>
                                </div>
                                <div className="order-right">
                                    <span className={badgeClass(o.status)}>{o.status || "UNKNOWN"}</span>
                                    <div className="order-amount">¥ {fmt(o.totalPrice)}</div>
                                </div>
                            </div>

                            <div className="order-body">
                                <div className="ship-info">
                                    <div className="muted">
                                        Recipient: <strong>{o.recipientName || "—"}</strong>
                                        <span className="sep">·</span>
                                        Phone: <strong>{o.recipientPhone || "—"}</strong>
                                    </div>
                                    <div className="muted">Address: {o.shippingAddr || "—"}</div>
                                </div>

                                {/* Items preview (first 3) */}
                                {o.items && o.items.length > 0 && (
                                    <div className="thumbs">
                                        {o.items.slice(0, 3).map((it, idx) => (
                                            <img
                                                key={idx}
                                                className="thumb"
                                                src={it.imageUrl || "/images/default-product.jpg"}
                                                alt={it.productName}
                                                onError={(e) => {
                                                    e.currentTarget.src = "/images/default-product.jpg";
                                                }}
                                            />
                                        ))}
                                        {o.items.length > 3 && (
                                            <div className="thumb more">+{o.items.length - 3}</div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="order-actions">
                                <a className="btn-outline" href={`/orders/${o.orderId}`}>View Details</a>
                                {String(o.status).toUpperCase() === "PENDING" && (
                                    <button className="btn-primary" onClick={() => payOrder(o.orderId)}>Pay Now</button>
                                )}
                            </div>
                        </article>
                    ))}
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