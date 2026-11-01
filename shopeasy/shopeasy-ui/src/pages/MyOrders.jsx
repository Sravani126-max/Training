import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get("/orders/my");

                setOrders(response.data);
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    error.response?.data ||
                    "Failed to load orders"
                );
            }
        };

        fetchOrders();
    }, []);

    const getStatusStep = (status) => {
        const steps = {
            PLACED: 1,
            CONFIRMED: 2,
            SHIPPED: 3,
            DELIVERED: 4
        };

        return steps[status] || 0;
    };

    return (
        <div className="orders-page">

            {/* Header */}
            <div className="orders-header">
                <div>
                    <h1>My Orders</h1>
                    <p>
                        View your order history and order details.
                    </p>
                </div>

                <button
                    className="orders-back-button"
                    onClick={() => navigate("/")}
                >
                    ← Continue Shopping
                </button>
            </div>

            {/* Error */}
            {error && (
                <div className="orders-error">
                    {error}
                </div>
            )}

            {/* No Orders */}
            {orders.length === 0 && !error ? (
                <div className="empty-orders">

                    <div className="empty-orders-icon">
                        📦
                    </div>

                    <h2>No orders found</h2>

                    <p>
                        You haven't placed any orders yet.
                    </p>

                    <button
                        className="orders-shop-button"
                        onClick={() => navigate("/")}
                    >
                        Start Shopping
                    </button>

                </div>
            ) : (

                /* Orders */
                <div className="orders-list">

                    {orders.map((order) => {

                        const currentStep =
                            getStatusStep(order.status);

                        return (
                            <div
                                className="order-card"
                                key={order.id}
                            >

                                {/* Order Header */}
                                <div className="order-card-header">

                                    <div>
                                        <h2>
                                            Order #{order.id}
                                        </h2>

                                        <p className="order-date">
                                            {new Date(
                                                order.createdAt
                                            ).toLocaleString()}
                                        </p>
                                    </div>

                                    <span
                                        className={`order-status status-${order.status?.toLowerCase()}`}
                                    >
                                        {order.status}
                                    </span>

                                </div>

                                {/* Order Progress */}
                                {order.status !== "CANCELLED" && (
                                    <div className="order-progress">

                                        <div
                                            className={`progress-step ${
                                                currentStep >= 1
                                                    ? "active"
                                                    : ""
                                            }`}
                                        >
                                            <span>1</span>
                                            <p>Placed</p>
                                        </div>

                                        <div
                                            className={`progress-line ${
                                                currentStep >= 2
                                                    ? "active"
                                                    : ""
                                            }`}
                                        ></div>

                                        <div
                                            className={`progress-step ${
                                                currentStep >= 2
                                                    ? "active"
                                                    : ""
                                            }`}
                                        >
                                            <span>2</span>
                                            <p>Confirmed</p>
                                        </div>

                                        <div
                                            className={`progress-line ${
                                                currentStep >= 3
                                                    ? "active"
                                                    : ""
                                            }`}
                                        ></div>

                                        <div
                                            className={`progress-step ${
                                                currentStep >= 3
                                                    ? "active"
                                                    : ""
                                            }`}
                                        >
                                            <span>3</span>
                                            <p>Shipped</p>
                                        </div>

                                        <div
                                            className={`progress-line ${
                                                currentStep >= 4
                                                    ? "active"
                                                    : ""
                                            }`}
                                        ></div>

                                        <div
                                            className={`progress-step ${
                                                currentStep >= 4
                                                    ? "active"
                                                    : ""
                                            }`}
                                        >
                                            <span>4</span>
                                            <p>Delivered</p>
                                        </div>

                                    </div>
                                )}

                                {/* Cancelled Message */}
                                {order.status === "CANCELLED" && (
                                    <div className="cancelled-order">
                                        ❌ This order has been cancelled.
                                    </div>
                                )}

                                {/* Order Total */}
                                <div className="order-total-section">

                                    <span>
                                        Total Amount
                                    </span>

                                    <strong>
                                        ₹{order.totalAmount}
                                    </strong>

                                </div>

                                {/* Items */}
                                <div className="order-items-section">

                                    <h3>Items</h3>

                                    {order.items?.map((item) => (
                                        <div
                                            className="order-item"
                                            key={item.id}
                                        >

                                            <div className="order-item-info">

                                                <h4>
                                                    {item.product?.name}
                                                </h4>

                                                <p>
                                                    Quantity:{" "}
                                                    {item.quantity}
                                                </p>

                                            </div>

                                            <div className="order-item-price">

                                                <p>
                                                    ₹{item.unitPrice}
                                                </p>

                                                <span>
                                                    Subtotal: ₹
                                                    {item.unitPrice *
                                                        item.quantity}
                                                </span>

                                            </div>

                                        </div>
                                    ))}

                                </div>

                            </div>
                        );
                    })}

                </div>
            )}

            {/* Bottom Button */}
            <div className="orders-bottom-button">

                <button
                    onClick={() => navigate("/")}
                >
                    Continue Shopping
                </button>

            </div>

        </div>
    );
}

export default MyOrders;