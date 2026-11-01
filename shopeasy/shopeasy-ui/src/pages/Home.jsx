import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Home() {
    const [products, setProducts] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const fetchProducts = async (searchKeyword = "") => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/products", {
                params: {
                    keyword: searchKeyword
                }
            });

            setProducts(response.data.content || response.data);
        } catch (error) {
            setError("Failed to load products");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchProducts(keyword.trim());
    };

    const handleClearSearch = () => {
        setKeyword("");
        fetchProducts();
    };

    return (
        <div className="home-page">

            {/* Hero Section */}
            <section className="hero">
                <h2>Welcome to ShopEasy</h2>

                <p>
                    Find your favorite products at the best prices.
                </p>
            </section>

            {/* Search */}
            <form
                className="search-bar"
                onSubmit={handleSearch}
            >
                <input
                    type="text"
                    placeholder="Search products..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />

                <button type="submit">
                    Search
                </button>

                {keyword && (
                    <button
                        type="button"
                        className="clear-button"
                        onClick={handleClearSearch}
                    >
                        Clear
                    </button>
                )}
            </form>

            {/* Products */}
            <section className="products-section">

                <div className="products-header">
                    <h2>Products</h2>

                    {!loading && products.length > 0 && (
                        <span className="product-count">
                            {products.length} product
                            {products.length !== 1 ? "s" : ""}
                        </span>
                    )}
                </div>

                {error && (
                    <p className="error-message">
                        {error}
                    </p>
                )}

                {loading ? (
                    <div className="loading-message">
                        Loading products...
                    </div>
                ) : products.length === 0 ? (
                    <div className="empty-products">
                        <p>No products found.</p>

                        {keyword && (
                            <button
                                onClick={handleClearSearch}
                            >
                                View All Products
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="product-grid">

                        {products.map((product) => (
                            <div
                                className="product-card"
                                key={product.id}
                                onClick={() =>
                                    navigate(
                                        `/products/${product.id}`
                                    )
                                }
                            >

                                {/* Product Image */}
                                {product.imageUrl ? (
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="product-image"
                                        onError={(e) => {
                                            e.currentTarget.style.display =
                                                "none";

                                            if (
                                                e.currentTarget
                                                    .nextSibling
                                            ) {
                                                e.currentTarget.nextSibling.style.display =
                                                    "flex";
                                            }
                                        }}
                                    />
                                ) : null}

                                <div
                                    className="image-placeholder"
                                    style={{
                                        display: product.imageUrl
                                            ? "none"
                                            : "flex"
                                    }}
                                >
                                    No Image
                                </div>

                                {/* Product Information */}
                                <div className="product-info">

                                    <h3>
                                        {product.name}
                                    </h3>

                                    <p className="description">
                                        {product.description}
                                    </p>

                                    <p className="price">
                                        ₹{product.price}
                                    </p>

                                    <p
                                        className={
                                            product.stock > 0
                                                ? "stock"
                                                : "out-of-stock"
                                        }
                                    >
                                        {product.stock > 0
                                            ? `In Stock: ${product.stock}`
                                            : "Out of Stock"}
                                    </p>

                                    <button
                                        className="view-details-button"
                                        onClick={(e) => {
                                            e.stopPropagation();

                                            navigate(
                                                `/products/${product.id}`
                                            );
                                        }}
                                    >
                                        View Details
                                    </button>

                                </div>

                            </div>
                        ))}

                    </div>
                )}

            </section>

        </div>
    );
}

export default Home;