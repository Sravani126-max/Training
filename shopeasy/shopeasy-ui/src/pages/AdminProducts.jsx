import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminProducts() {
    const [products, setProducts] = useState([]);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setError("");

            const response = await api.get("/products");

            setProducts(response.data);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                error.response?.data ||
                "Failed to load products"
            );
        }
    };

    const resetForm = () => {
        setName("");
        setDescription("");
        setPrice("");
        setStock("");
        setImageUrl("");
        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setMessage("");

        const product = {
            name,
            description,
            price: Number(price),
            stock: Number(stock),
            imageUrl
        };

        try {
            if (editingId) {
                await api.put(
                    `/products/${editingId}`,
                    product
                );

                setMessage("Product updated successfully.");
            } else {
                await api.post("/products", product);

                setMessage("Product added successfully.");
            }

            resetForm();
            fetchProducts();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                error.response?.data ||
                "Failed to save product"
            );
        }
    };

    const handleEdit = (product) => {
        setEditingId(product.id);
        setName(product.name);
        setDescription(product.description || "");
        setPrice(product.price);
        setStock(product.stock);
        setImageUrl(product.imageUrl || "");

        setError("");
        setMessage("");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");
            setMessage("");

            await api.delete(`/products/${id}`);

            setMessage("Product deleted successfully.");

            fetchProducts();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                error.response?.data ||
                "Failed to delete product"
            );
        }
    };

    return (
        <div className="admin-products-page">

            {/* Header */}
            <div className="admin-products-header">

                <div>
                    <span className="admin-page-label">
                        ADMIN PANEL
                    </span>

                    <h1>Product Management</h1>

                    <p>
                        Add, edit, and manage products in your store.
                    </p>
                </div>

                <button
                    className="admin-products-home-button"
                    onClick={() => navigate("/")}
                >
                    ← Back to Home
                </button>

            </div>

            {/* Messages */}
            {message && (
                <div className="admin-product-success">
                    ✓ {message}
                </div>
            )}

            {error && (
                <div className="admin-product-error">
                    ✕ {error}
                </div>
            )}

            {/* Main Content */}
            <div className="admin-products-container">

                {/* Product Form */}
                <div className="product-form-card">

                    <div className="product-form-heading">

                        <div className="product-form-icon">
                            {editingId ? "✏️" : "➕"}
                        </div>

                        <div>
                            <h2>
                                {editingId
                                    ? "Edit Product"
                                    : "Add Product"}
                            </h2>

                            <p>
                                {editingId
                                    ? "Update product information"
                                    : "Create a new product"}
                            </p>
                        </div>

                    </div>

                    <form onSubmit={handleSubmit}>

                        {/* Name */}
                        <div className="form-group">
                            <label>
                                Product Name
                            </label>

                            <input
                                type="text"
                                placeholder="Enter product name"
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                                required
                            />
                        </div>

                        {/* Description */}
                        <div className="form-group">
                            <label>
                                Description
                            </label>

                            <textarea
                                placeholder="Enter product description"
                                value={description}
                                onChange={(e) =>
                                    setDescription(e.target.value)
                                }
                            />
                        </div>

                        {/* Price + Stock */}
                        <div className="form-row">

                            <div className="form-group">
                                <label>
                                    Price (₹)
                                </label>

                                <input
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    placeholder="0.00"
                                    value={price}
                                    onChange={(e) =>
                                        setPrice(e.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Stock
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    placeholder="0"
                                    value={stock}
                                    onChange={(e) =>
                                        setStock(e.target.value)
                                    }
                                    required
                                />
                            </div>

                        </div>

                        {/* Image URL */}
                        <div className="form-group">
                            <label>
                                Image URL
                            </label>

                            <input
                                type="text"
                                placeholder="https://example.com/image.jpg"
                                value={imageUrl}
                                onChange={(e) =>
                                    setImageUrl(e.target.value)
                                }
                            />
                        </div>

                        {/* Image Preview */}
                        {imageUrl && (
                            <div className="admin-image-preview">

                                <img
                                    src={imageUrl}
                                    alt="Product preview"
                                    onError={(e) => {
                                        e.currentTarget.style.display =
                                            "none";

                                        if (
                                            e.currentTarget
                                                .nextSibling
                                        ) {
                                            e.currentTarget
                                                .nextSibling
                                                .style.display = "flex";
                                        }
                                    }}
                                />

                                <div
                                    className="admin-preview-placeholder"
                                    style={{
                                        display: "none"
                                    }}
                                >
                                    Image preview unavailable
                                </div>

                            </div>
                        )}

                        {/* Buttons */}
                        <div className="form-buttons">

                            <button
                                type="submit"
                                className="save-product-button"
                            >
                                {editingId
                                    ? "✓ Update Product"
                                    : "＋ Add Product"}
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    className="cancel-edit-button"
                                    onClick={resetForm}
                                >
                                    Cancel
                                </button>
                            )}

                        </div>

                    </form>

                </div>

                {/* Product List */}
                <div className="admin-product-list-section">

                    <div className="admin-product-list-header">

                        <div>
                            <h2>Products</h2>

                            <p>
                                {products.length}{" "}
                                {products.length === 1
                                    ? "product"
                                    : "products"}{" "}
                                in your store
                            </p>
                        </div>

                    </div>

                    {products.length === 0 ? (
                        <div className="no-products">

                            <div>📦</div>

                            <h3>No Products Found</h3>

                            <p>
                                Add your first product using
                                the form.
                            </p>

                        </div>
                    ) : (
                        <div className="admin-product-grid">

                            {products.map((product) => (
                                <div
                                    className="admin-product-card"
                                    key={product.id}
                                >

                                    {/* Image */}
                                    <div className="admin-product-image">

                                        {product.imageUrl ? (
                                            <img
                                                src={product.imageUrl}
                                                alt={product.name}
                                                onError={(e) => {
                                                    e.currentTarget.style.display =
                                                        "none";

                                                    if (
                                                        e.currentTarget
                                                            .nextSibling
                                                    ) {
                                                        e.currentTarget
                                                            .nextSibling
                                                            .style.display =
                                                            "flex";
                                                    }
                                                }}
                                            />
                                        ) : null}

                                        <div
                                            className="admin-image-placeholder"
                                            style={{
                                                display:
                                                    product.imageUrl
                                                        ? "none"
                                                        : "flex"
                                            }}
                                        >
                                            No Image
                                        </div>

                                    </div>

                                    {/* Details */}
                                    <div className="admin-product-info">

                                        <div className="admin-product-title-row">

                                            <h3>
                                                {product.name}
                                            </h3>

                                            <span className="product-id">
                                                #{product.id}
                                            </span>

                                        </div>

                                        <p className="admin-product-description">
                                            {product.description ||
                                                "No description available."}
                                        </p>

                                        <p className="admin-product-price">
                                            ₹{product.price}
                                        </p>

                                        <p
                                            className={
                                                product.stock > 0
                                                    ? "admin-stock"
                                                    : "admin-out-of-stock"
                                            }
                                        >
                                            {product.stock > 0
                                                ? `✓ ${product.stock} in stock`
                                                : "✕ Out of Stock"}
                                        </p>

                                        {/* Actions */}
                                        <div className="admin-product-actions">

                                            <button
                                                className="edit-product-button"
                                                onClick={() =>
                                                    handleEdit(product)
                                                }
                                            >
                                                ✏️ Edit
                                            </button>

                                            <button
                                                className="delete-product-button"
                                                onClick={() =>
                                                    handleDelete(
                                                        product.id
                                                    )
                                                }
                                            >
                                                🗑️ Delete
                                            </button>

                                        </div>

                                    </div>

                                </div>
                            ))}

                        </div>
                    )}

                </div>

            </div>

        </div>
    );
}

export default AdminProducts;