import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";
import "../styles/common.css";
import cartService from "../services/cartAPI.js";

export default function Cart({ user, onLogout }) {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lineBusy, setLineBusy] = useState(null); // 正在更新哪一行（按 productId）
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => { fetchCart(); }, []);

    const fetchCart = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await cartService.getCart();
            setCart(data);
        } catch {
            setError("Failed to load cart. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // 数量变更：delta = +1 / -1
    const changeQty = async (it, delta) => {
        if (!it || !it.productId) return;
        if (delta < 0 && it.quantity <= 1) return; // 不减到 0 以下
        try {
            setLineBusy(it.productId);
            setError(null);
            if (delta > 0) {
                await cartService.addItemToCart(it.productId, 1);
            } else {
                await cartService.removeItemFromCart(it.productId, 1);
            }
            await fetchCart();
        } catch (e) {
            setError(e?.response?.data?.message || "Failed to update quantity.");
        } finally {
            setLineBusy(null);
        }
    };

    const fmt = (n) => (Number(n) || 0).toFixed(2);

    const handleCheckout = () => {
        if (!cart?.items?.length) return;
        const cartItemIds = cart.items.map(it => it.cartItemId);
        sessionStorage.setItem("checkoutCartItemIds", JSON.stringify(cartItemIds));
        navigate("/checkout", { state: { cartItemIds } });
    };

    if (loading) {
        return (
            <div className="cart-page">
                <nav className="navbar">
                    <div className="nav-inner">
                        <a href="/" className="brand">🛒 Shopping Cart System</a>
                    </div>
                </nav>
                <main className="container"><div className="loading">Loading…</div></main>
            </div>
        );
    }

    if (error) {
        // 有错误仍然展示页面，提示放上方
    }

    const isEmpty = !cart || !cart.items || cart.items.length === 0;

    return (
        <div className="cart-page">
            <nav className="navbar">
                <div className="nav-container">
                    <a href="/" className="navbar-brand">
                        <span className="cart-icon">🛒</span>
                        Shopping Cart System
                    </a>
                    <div className="nav-links">
                        <a href="/" className="nav-link">Home</a>
                        <a href="/products" className="nav-link">Products</a>
                        <a href="/cart" className="nav-link active">Cart</a>
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

            <main className="container">
                <h2>My Cart</h2>

                {error && (
                    <div className="alert">
                        <span className="alert-icon">⚠️</span>{error}
                    </div>
                )}

                {isEmpty ? (
                    <div className="empty">
                        <div className="empty-icon">🛒</div>
                        <h3>Your cart is empty</h3>
                        <p className="muted">Go pick something you like!</p>
                        <a className="btn-primary" href="/products">Shop Now</a>
                    </div>
                ) : (
                    <div className="grid">
                        {/* Items */}
                        <section>
                            <div className="list-header">
                                <h4>Items</h4>
                            </div>

                            <div>
                                {cart.items.map((it) => (
                                    <article className="card" key={it.productId}>
                                        <div className="row">
                                            <div className="thumb-col">
                                                <img
                                                    className="thumb"
                                                    loading="lazy"
                                                    src={it.imageUrl || "/images/default-product.jpg"}
                                                    alt={it.productName}
                                                    onError={(e) => {
                                                        e.currentTarget.src = "/images/default-product.jpg";
                                                    }}
                                                />
                                            </div>

                                            <div className="info-col">
                                                <a className="title"
                                                   href={`/products/${it.productId}`}>{it.productName}</a>
                                                <p className="muted">Unit price: ¥ {fmt(it.unitPrice)}</p>

                                                {/* 数量调节 */}
                                                <div className="qty-row">
                                                    <button
                                                        className="btn-ghost-dark"
                                                        onClick={() => changeQty(it, -1)}
                                                        disabled={lineBusy === it.productId || it.quantity <= 1}
                                                        title="Decrease"
                                                    >−
                                                    </button>

                                                    <span className="qty-num">{it.quantity}</span>

                                                    <button
                                                        className="btn-ghost-dark"
                                                        onClick={() => changeQty(it, +1)}
                                                        disabled={lineBusy === it.productId}
                                                        title="Increase"
                                                    >＋
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="sum-col">
                                                <div className="price">¥ {fmt(it.subtotal)}</div>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </section>

                        {/* Summary */}
                        <aside className="summary">
                            <h4>Order Summary</h4>
                            <div className="summary-row">
                                <span>Total items:</span>
                                <span>{cart.totalQuantity}</span>
                            </div>
                            <div className="summary-row">
                                <span>Total:</span>
                                <span>¥ {fmt(cart.totalPrice)}</span>
                            </div>

                            <div className="summary-actions">
                                <button className="btn-primary" onClick={handleCheckout}>
                                    Checkout
                                </button>
                                <a className="btn-ghost-dark" href="/products">Continue Shopping</a>
                            </div>
                        </aside>
                    </div>
                )}
            </main>
            <footer className="footer">
                <div className="container">
                    <p>&copy; 2025 WLLCH Co., Ltd. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}