import React, { useEffect, useState } from "react";
import {replace, useLocation, useNavigate} from "react-router-dom";
import "./Checkout.css";
import "../styles/common.css";
import orderService from "../services/orderAPI.js";
import cartService from "../services/cartAPI.js";

export default function Checkout({ user, onLogout }) {
    const navigate = useNavigate();
    const location = useLocation();

    const initialCartIds = (location.state && location.state.cartItemIds) || [];
    const [cart, setCart] = useState(null);
    const [cartItemIds, setCartItemIds] = useState(initialCartIds);

    const [form, setForm] = useState({
        recipientName: "",
        recipientPhone: "",
        shippingAddr: "",
        paymentMethod: "Online",
        notes: "",
    });

    const [submitting, setSubmitting] = useState(false);
    const [loadingCart, setLoadingCart] = useState(true);
    const [error, setError] = useState(null);
    const [toast, setToast] = useState(null);

    const fmt = (n) => (Number(n) || 0).toFixed(2);

    useEffect(() => {
        setError(null);
        fetchCart();
    }, []);

    useEffect(() => {

    })

    const fetchCart = async () => {
        setLoadingCart(true);
        try {
            const data = await cartService.getCart();
            setCart(data);

            if (!initialCartIds.length && data?.items?.length) {
                const ids = data.items.map((it) => it.cartItemId);
                setCartItemIds(ids);
            }
        } catch (e) {
            setError("Failed to load cart. Please try again.");
        } finally {
            setLoadingCart(false);
        }
    };

    // 表单校验
    const isPhoneValid = (p) => /^1[3-9]\d{9}$/.test((p || "").trim());

    const getValidationError = () => {
        if (loadingCart) return 'Loading cart...';
        if (!cartItemIds.length) return 'No cart items selected.';
        if (!form.recipientName.trim()) return 'Recipient Name is required.';
        if (!form.recipientPhone.trim()) return 'Phone is required.';
        if (!isPhoneValid(form.recipientPhone)) return 'Invalid phone number.';
        if (!form.shippingAddr.trim()) return 'Address is required.';
        return null;
    };

    const canSubmit = !getValidationError() && !submitting;

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setError(null);
    };

    const checkout = async (checkoutReq) => {
        console.log(checkoutReq);
        setSubmitting(true);
        setError(null);
        try {
            const data = await orderService.checkout(checkoutReq);
            console.log(data);
            setToast("Order submitted successfully ✓");
            if (data.success) {
                if (data.orderId){
                    const oid = data.orderId
                    navigate(`/payment/${oid}`, {replace: true});
                }else{
                    navigate("/orders", { replace: true });
                }
            }else{
                setError("Something went wrong");
            }
        } catch (e) {
            setError("Failed to checkout. Please try again. Msg: " + e.response.data.message);
        } finally {
            setSubmitting(false);
            setTimeout(() => setToast(""), 1500);
        }
    };

    const handleSubmit = (e) => {
        console.log("test-submit")
        e.preventDefault();
        const ve = getValidationError();
        if (ve) {
            setError(ve);
            return;
        }

        const payload = {
            cartItemIds,
            paymentMethod: form.paymentMethod,
            recipientName: form.recipientName,
            recipientPhone: form.recipientPhone,
            shippingAddr: form.shippingAddr,
            notes: form.notes,
        };
        checkout(payload);
    };

    if (loadingCart) {
        return (
            <div className="checkout-page">
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

    const items = cart?.items || [];
    const isEmpty = !items.length;

    return (

        <div className="checkout-page">
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

            {toast && <div className="toast">{toast}</div>}

            <main className="container">
                <div className="page-header">
                    <div className="header-content">
                        <h1>Checkout</h1>
                    </div>
                </div>

                {(error) && (
                    <div className="alert">
                        <span className="alert-icon">⚠️</span>
                        {error || getValidationError()}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="checkout-grid">
                        {/* Left: form */}
                        <section className="panel">
                            <h3 className="panel-title">Shipping Information</h3>

                            <div className="row-2">
                                <div className="form-group">
                                    <label htmlFor="recipientName">Recipient Name <span className="req">*</span></label>
                                    <input
                                        id="recipientName"
                                        name="recipientName"
                                        className="form-input"
                                        placeholder="Full name"
                                        value={form.recipientName}
                                        onChange={onChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="recipientPhone">Phone <span className="req">*</span></label>
                                    <input
                                        id="recipientPhone"
                                        name="recipientPhone"
                                        className="form-input"
                                        placeholder="e.g. 15879091005"
                                        value={form.recipientPhone}
                                        onChange={onChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="shippingAddr">Shipping Address <span className="req">*</span></label>
                                <textarea
                                    id="shippingAddr"
                                    name="shippingAddr"
                                    rows="3"
                                    className="form-textarea"
                                    placeholder="Street, city, state, ZIP"
                                    value={form.shippingAddr}
                                    onChange={onChange}
                                    required
                                />
                            </div>

                            <h3 className="panel-title">Payment Method</h3>
                            <div className="row-2">
                                {["Online", "Cash on Delivery", "WeChat Pay", "Alipay"].map((pm) => (
                                    <label key={pm} className="radio">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value={pm}
                                            checked={form.paymentMethod === pm}
                                            onChange={onChange}
                                        />
                                        <span>{pm}</span>
                                    </label>
                                ))}
                            </div>

                            <h3 className="panel-title">Order Notes</h3>
                            <div className="form-group">
                <textarea
                    name="notes"
                    rows="3"
                    className="form-textarea"
                    placeholder="Any special requests (optional)"
                    value={form.notes}
                    onChange={onChange}
                />
                            </div>
                        </section>

                        <aside className="summary">
                            <h3 className="panel-title">Order Summary</h3>

                            <div className="summary-list">
                                {isEmpty ? (
                                    <div className="muted">No items in cart. Please return to your cart.</div>
                                ) : (
                                    items.map((it) => (
                                        <div key={it.cartItemId} className="summary-item">
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
                                <span>Subtotal</span>
                                <span>¥ {fmt(cart?.totalPrice)}</span>
                            </div>
                            <div className="summary-row">
                                <span>Shipping</span>
                                <span className="text-success">Free</span>
                            </div>
                            <div className="summary-row">
                                <span>Discount</span>
                                <span className="text-success">- 0.00</span>
                            </div>
                            <hr className="hr"/>
                            <div className="summary-row strong">
                                <span>Amount Due</span>
                                <span>¥ {fmt(cart?.totalPrice)}</span>
                            </div>

                            <div className="summary-actions">
                                <button
                                    type="submit"
                                    className={`btn-primary ${!canSubmit ? "disabled" : ""}`}
                                    disabled={!canSubmit || submitting}
                                >
                                    {submitting ? "Processing…" : "Place Order"}
                                </button>
                                <a className="btn-ghost-dark" href="/cart">Back to Cart</a>
                            </div>
                        </aside>
                    </div>
                </form>
            </main>
            <footer className="footer">
                <div className="container">
                    <p>&copy; 2025 WLLCH Co., Ltd. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}