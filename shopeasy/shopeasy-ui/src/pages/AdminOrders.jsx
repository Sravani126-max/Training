import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const statuses = [
        "PLACED",
        "CONFIRMED",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED"
    ];

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setError("");

            const response = await api.get("/orders/admin");

            setOrders(response.data);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                error.response?.data ||
                "Failed to load orders"
            );
        }
    };

    const updateStatus = async (orderId, status) => {
        try {
            await api.put(
                `/orders/admin/${orderId}/status`,
                null,
                {
                    params: {
                        status
                    }
                }
            );

            fetchOrders();

        } catch (error) {
            setError(
                error.response?.data?.message ||
                error.response?.data ||
                "Failed to update order status"
            );
        }
    };

    return (
        <div className="admin-orders-page">

            {/* Header */}
            <div className="admin-orders-header">
                <div>
                    <h1>Admin Orders</h1>
                    <p>
                        Manage customer orders and update their status.
                    </p>
                </div>

                <button
                    className="admin-orders-home-button"
                    onClick={() => navigate("/")}
                >
                    ← Back to Home
                </button>
            </div>

            {/* Error */}
            {error && (
                <div className="admin-orders-error">
                    {error}
                </div>
            )}

            {/* No Orders */}
            {orders.length === 0 && !error ? (
                <div className="admin-empty-orders">

                    <div className="admin-empty-icon">
                        📦
                    </div>

                    <h2>No orders found</h2>

                    <p>
                        There are currently no customer orders.
                    </p>

                </div>
            ) : (

                /* Orders */
                <div className="admin-orders-list">

                    {orders.map((order) => (
                        <div
                            className="admin-order-card"
                            key={order.id}
                        >

                            {/* Order Header */}
                            <div className="admin-order-header">

                                <div>
                                    <h2>
                                        Order #{order.id}
                                    </h2>

                                    <p className="admin-order-date">
                                        {new Date(
                                            order.createdAt
                                        ).toLocaleString()}
                                    </p>
                                </div>

                                <span
                                    className={`admin-order-status status-${order.status?.toLowerCase()}`}
                                >
                                    {order.status}
                                </span>

                            </div>

                            {/* Customer Information */}
                            <div className="customer-section">

                                <h3>Customer</h3>

                                <div className="customer-details">

                                    <div>
                                        <span>Name</span>
                                        <strong>
                                            {order.user?.name}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Email</span>
                                        <strong>
                                            {order.user?.email}
                                        </strong>
                                    </div>

                                </div>

                            </div>

                            {/* Order Items */}
                            <div className="admin-items-section">

                                <h3>Order Items</h3>

                                {order.items?.map((item) => (
                                    <div
                                        className="admin-order-item"
                                        key={item.id}
                                    >

                                        <div>
                                            <h4>
                                                {item.product?.name}
                                            </h4>

                                            <p>
                                                Quantity:{" "}
                                                {item.quantity}
                                            </p>
                                        </div>

                                        <div className="admin-item-price">

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

                            {/* Total */}
                            <div className="admin-order-total">

                                <span>
                                    Total Amount
                                </span>

                                <strong>
                                    ₹{order.totalAmount}
                                </strong>

                            </div>

                            {/* Status Update */}
                            <div className="status-update-section">

                                <label>
                                    Update Order Status
                                </label>

                                <select
                                    value={order.status}
                                    onChange={(e) =>
                                        updateStatus(
                                            order.id,
                                            e.target.value
                                        )
                                    }
                                >
                                    {statuses.map((status) => (
                                        <option
                                            key={status}
                                            value={status}
                                        >
                                            {status}
                                        </option>
                                    ))}
                                </select>

                            </div>

                        </div>
                    ))}

                </div>
            )}

        </div>
    );
}

export default AdminOrders;