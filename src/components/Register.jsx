import React, { useState } from "react";
import "./Register.css";
import "../styles/common.css";
import { authService } from "../services/authAPI.js";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        password: "",
        email: "",
        firstName: "",
        lastName: "",
        phone: "",
        address: "",
        fullName: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [toast, setToast] = useState("");

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await authService.register(form);
            if (res?.success) {
                setToast("Register successful ✓ Redirecting...");
                setTimeout(() => navigate("/login", { replace: true }), 1000);
            } else {
                setError("Registration failed, please try again.");
            }
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to register.");
        } finally {
            setLoading(false);
            setTimeout(() => setToast(""), 2000);
        }
    };

    const isFilled = form.username && form.password && form.email && form.fullName;

    return (
        <div className="register-page">
            <nav className="navbar">
                <div className="nav-container">
                    <a href="/" className="navbar-brand">
                        <span className="cart-icon">🛒</span>
                        Shopping Cart System
                    </a>
                    <div className="nav-links">
                        <a href="/" className="nav-link">Home</a>
                        <a href="/products" className="nav-link">Products</a>
                        <a href="/login" className="nav-link">Login</a>
                    </div>
                </div>
            </nav>

            {toast && <div className="toast">{toast}</div>}

            <main className="container">
                <div className="register-card">
                    <h1>Create Account</h1>
                    <p className="muted">Please fill in your information</p>

                    {error && (
                        <div className="alert">
                            <span className="alert-icon">⚠️</span> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="row-2">
                            <div className="form-group">
                                <label>Username</label>
                                <input
                                    name="username"
                                    value={form.username}
                                    onChange={onChange}
                                    className="form-input"
                                    placeholder="Enter username"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={onChange}
                                    className="form-input"
                                    placeholder="Enter password"
                                    required
                                />
                            </div>
                        </div>

                        <div className="row-2">
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={onChange}
                                    className="form-input"
                                    placeholder="example@gmail.com"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Phone</label>
                                <input
                                    name="phone"
                                    value={form.phone}
                                    onChange={onChange}
                                    className="form-input"
                                    placeholder="e.g. 15879091005"
                                />
                            </div>
                        </div>

                        <div className="row-2">
                            <div className="form-group">
                                <label>First Name</label>
                                <input
                                    name="firstName"
                                    value={form.firstName}
                                    onChange={onChange}
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label>Last Name</label>
                                <input
                                    name="lastName"
                                    value={form.lastName}
                                    onChange={onChange}
                                    className="form-input"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                name="fullName"
                                value={form.fullName}
                                onChange={onChange}
                                className="form-input"
                                placeholder="Terrenc Yaqi Chen"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Address</label>
                            <textarea
                                name="address"
                                value={form.address}
                                onChange={onChange}
                                className="form-textarea"
                                placeholder="Enter your address"
                                rows="2"
                            />
                        </div>

                        <button
                            type="submit"
                            className={`btn-primary ${!isFilled || loading ? "disabled" : ""}`}
                            disabled={!isFilled || loading}
                        >
                            {loading ? "Registering…" : "Register Now"}
                        </button>
                    </form>

                    <p className="muted center">
                        Already have an account? <a href="/login" className="link">Login here</a>
                    </p>
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