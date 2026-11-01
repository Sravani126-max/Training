import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/CartContext";

function Checkout() {
    const { cart, clearCart } = useCart();

    const [error, setError] = useState("");

    const navigate = useNavigate();

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const handlePlaceOrder = async () => {
        setError("");

        if (cart.length === 0) {
            setError("Your cart is empty.");
            return;
        }

        try {
            const orderRequest = {
                items: cart.map((item) => ({
                    productId: item.id,
                    quantity: item.quantity
                }))
            };

            await api.post("/orders", orderRequest);

            clearCart();

            navigate("/orders");

        } catch (error) {
            setError(
                error.response?.data?.message ||
                error.response?.data ||
                "Failed to place order"
            );
        }
    };

    if (cart.length === 0) {
        return (
            <div className="checkout-page">
                <div className="empty-checkout">
                    <div className="empty-checkout-icon">
                        🛒
                    </div>

                    <h1>Checkout</h1>

                    <p>Your cart is empty.</p>

                    <button
                        className="checkout-primary-button"
                        onClick={() => navigate("/")}
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page">

            <div className="checkout-header">
                <div>
                    <h1>Checkout</h1>
                    <p>Review your order before placing it.</p>
                </div>

                <button
                    className="checkout-back-button"
                    onClick={() => navigate("/cart")}
                >
                    ← Back to Cart
                </button>
            </div>

            {error && (
                <div className="checkout-error">
                    {error}
                </div>
            )}

            <div className="checkout-container">

                {/* Order Items */}
                <div className="checkout-items">

                    <h2>Order Summary</h2>

                    {cart.map((item) => (
                        <div
                            className="checkout-item"
                            key={item.id}
                        >

                            <div className="checkout-image-container">
                                {item.imageUrl ? (
                                    <img
                                        src={item.imageUrl}
                                        alt={item.name}
                                        className="checkout-image"
                                        onError={(e) => {
                                            e.currentTarget.style.display =
                                                "none";

                                            e.currentTarget.nextSibling.style.display =
                                                "flex";
                                        }}
                                    />
                                ) : null}

                                <div
                                    className="checkout-image-placeholder"
                                    style={{
                                        display: item.imageUrl
                                            ? "none"
                                            : "flex"
                                    }}
                                >
                                    No Image
                                </div>
                            </div>

                            <div className="checkout-item-info">
                                <h3>{item.name}</h3>

                                <p>
                                    Price: ₹{item.price}
                                </p>

                                <p>
                                    Quantity: {item.quantity}
                                </p>

                                <p className="checkout-subtotal">
                                    Subtotal: ₹
                                    {item.price *
                                        item.quantity}
                                </p>
                            </div>

                        </div>
                    ))}

                </div>

                {/* Payment / Total Summary */}
                <div className="checkout-summary">

                    <h2>Order Total</h2>

                    <div className="checkout-summary-row">
                        <span>Subtotal</span>
                        <span>₹{total}</span>
                    </div>

                    <div className="checkout-summary-row">
                        <span>Delivery</span>
                        <span>Free</span>
                    </div>

                    <hr />

                    <div className="checkout-total">
                        <span>Total</span>
                        <span>₹{total}</span>
                    </div>

                    <button
                        className="place-order-button"
                        onClick={handlePlaceOrder}
                    >
                        Place Order
                    </button>

                    <button
                        className="checkout-secondary-button"
                        onClick={() => navigate("/cart")}
                    >
                        Back to Cart
                    </button>

                </div>

            </div>

        </div>
    );
}

export default Checkout;