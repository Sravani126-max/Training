import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Cart() {
    const {
        cart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart
    } = useCart();

    const navigate = useNavigate();

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    if (cart.length === 0) {
        return (
            <div className="cart-page">
                <div className="cart-header">
                    <h1>Your Cart</h1>

                    <button
                        onClick={() => navigate("/")}
                        className="back-button"
                    >
                        ← Continue Shopping
                    </button>
                </div>

                <div className="empty-cart">
                    <div className="empty-cart-icon">
                        🛒
                    </div>

                    <h2>Your cart is empty</h2>

                    <p>
                        Looks like you haven't added
                        anything to your cart yet.
                    </p>

                    <button
                        onClick={() => navigate("/")}
                        className="shop-button"
                    >
                        Start Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">

            {/* Header */}
            <div className="cart-header">

                <div>
                    <h1>Your Cart</h1>

                    <p>
                        {cart.length}{" "}
                        {cart.length === 1
                            ? "item"
                            : "items"}{" "}
                        in your cart
                    </p>
                </div>

                <button
                    onClick={() => navigate("/")}
                    className="back-button"
                >
                    ← Continue Shopping
                </button>

            </div>

            {/* Cart Items */}
            <div className="cart-container">

                <div className="cart-items">

                    {cart.map((item) => (
                        <div
                            className="cart-item"
                            key={item.id}
                        >

                            {/* Product Image */}
                            <div className="cart-image-container">

                                {item.imageUrl ? (
                                    <img
                                        src={item.imageUrl}
                                        alt={item.name}
                                        className="cart-image"
                                        onError={(e) => {
                                            e.currentTarget.style.display =
                                                "none";

                                            e.currentTarget.nextSibling.style.display =
                                                "flex";
                                        }}
                                    />
                                ) : null}

                                <div
                                    className="cart-image-placeholder"
                                    style={{
                                        display: item.imageUrl
                                            ? "none"
                                            : "flex"
                                    }}
                                >
                                    No Image
                                </div>

                            </div>

                            {/* Product Info */}
                            <div className="cart-item-info">

                                <h2>{item.name}</h2>

                                <p className="cart-item-price">
                                    ₹{item.price}
                                </p>

                                {/* Quantity */}
                                <div className="quantity-control">

                                    <button
                                        onClick={() =>
                                            decreaseQuantity(
                                                item.id
                                            )
                                        }
                                    >
                                        −
                                    </button>

                                    <span>
                                        {item.quantity}
                                    </span>

                                    <button
                                        onClick={() =>
                                            increaseQuantity(
                                                item.id
                                            )
                                        }
                                    >
                                        +
                                    </button>

                                </div>

                                <p className="cart-subtotal">
                                    Subtotal:{" "}
                                    <strong>
                                        ₹
                                        {item.price *
                                            item.quantity}
                                    </strong>
                                </p>

                                <button
                                    className="remove-button"
                                    onClick={() =>
                                        removeFromCart(
                                            item.id
                                        )
                                    }
                                >
                                    Remove
                                </button>

                            </div>

                        </div>
                    ))}

                </div>

                {/* Order Summary */}
                <div className="cart-summary">

                    <h2>Order Summary</h2>

                    <div className="summary-row">
                        <span>Items</span>

                        <span>
                            {cart.reduce(
                                (sum, item) =>
                                    sum +
                                    item.quantity,
                                0
                            )}
                        </span>
                    </div>

                    <div className="summary-row">
                        <span>Subtotal</span>

                        <span>
                            ₹{total}
                        </span>
                    </div>

                    <div className="summary-row">
                        <span>Delivery</span>

                        <span>Free</span>
                    </div>

                    <hr />

                    <div className="summary-total">
                        <span>Total</span>

                        <span>
                            ₹{total}
                        </span>
                    </div>

                    <button
                        className="checkout-button"
                        onClick={() =>
                            navigate("/checkout")
                        }
                    >
                        Proceed to Checkout
                    </button>

                    <button
                        className="clear-cart-button"
                        onClick={clearCart}
                    >
                        Clear Cart
                    </button>

                </div>

            </div>

        </div>
    );
}

export default Cart;