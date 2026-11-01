import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/CartContext";

function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setError("");

                const response = await api.get(`/products/${id}`);

                setProduct(response.data);
            } catch (error) {
                setError("Failed to load product");
                console.error(error);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        addToCart(product);
        setMessage("Product added to cart!");
    };

    if (error) {
        return (
            <div className="details-page">
                <div className="details-error-card">
                    <h2>Something went wrong</h2>

                    <p className="error-message">
                        {error}
                    </p>

                    <button
                        className="back-button"
                        onClick={() => navigate("/")}
                    >
                        ← Back to Products
                    </button>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="details-page">
                <div className="details-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading product...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="details-page">

            {/* Back Button */}
            <button
                className="back-button"
                onClick={() => navigate("/")}
            >
                ← Back to Products
            </button>

            {/* Product Details */}
            <div className="product-details-card">

                {/* Product Image */}
                <div className="details-image-section">

                    <div className="details-image-wrapper">

                        {product.imageUrl ? (
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="details-image"
                                onError={(e) => {
                                    e.currentTarget.style.display =
                                        "none";

                                    e.currentTarget.nextSibling.style.display =
                                        "flex";
                                }}
                            />
                        ) : null}

                        <div
                            className="details-image-placeholder"
                            style={{
                                display: product.imageUrl
                                    ? "none"
                                    : "flex"
                            }}
                        >
                            No Image Available
                        </div>

                    </div>

                </div>

                {/* Product Information */}
                <div className="details-info">

                    <span className="details-category">
                        ShopEasy Product
                    </span>

                    <h1>{product.name}</h1>

                    <div className="details-rating">
                        ★★★★★
                        <span> Product</span>
                    </div>

                    <p className="details-description">
                        {product.description ||
                            "No description available for this product."}
                    </p>

                    <div className="details-price-box">
                        <span className="details-price-label">
                            Price
                        </span>

                        <p className="details-price">
                            ₹{product.price}
                        </p>
                    </div>

                    {/* Stock */}
                    <div className="details-stock-box">

                        <p
                            className={
                                product.stock > 0
                                    ? "details-stock"
                                    : "details-out-of-stock"
                            }
                        >
                            {product.stock > 0
                                ? `✓ In Stock (${product.stock} available)`
                                : "✕ Out of Stock"}
                        </p>

                    </div>

                    {/* Success Message */}
                    {message && (
                        <p className="success-message">
                            ✓ {message}
                        </p>
                    )}

                    {/* Actions */}
                    <div className="details-actions">

                        <button
                            className="add-cart-button"
                            onClick={handleAddToCart}
                            disabled={product.stock <= 0}
                        >
                            {product.stock > 0
                                ? "🛒 Add to Cart"
                                : "Out of Stock"}
                        </button>

                        <button
                            className="view-cart-button"
                            onClick={() => navigate("/cart")}
                        >
                            View Cart
                        </button>

                    </div>

                    {/* Product Features */}
                    <div className="product-features">

                        <div className="feature-item">
                            <span>🚚</span>
                            <div>
                                <strong>Fast Delivery</strong>
                                <p>Quick and reliable delivery</p>
                            </div>
                        </div>

                        <div className="feature-item">
                            <span>🔒</span>
                            <div>
                                <strong>Secure Shopping</strong>
                                <p>Safe and secure checkout</p>
                            </div>
                        </div>

                        <div className="feature-item">
                            <span>✓</span>
                            <div>
                                <strong>Quality Products</strong>
                                <p>Products you can trust</p>
                            </div>
                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default ProductDetails;