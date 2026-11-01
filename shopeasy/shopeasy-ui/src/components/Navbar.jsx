import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Navbar() {
    const navigate = useNavigate();

    const { cart } = useCart();

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
    };

    return (
        <header className="navbar">

            <h1
                className="logo"
                onClick={() => navigate("/")}
            >
                ShopEasy
            </h1>

            <nav className="nav-buttons">

                <button onClick={() => navigate("/")}>
                    Home
                </button>

                <button onClick={() => navigate("/cart")}>
                    🛒 Cart ({cart.length})
                </button>

                {token && (
                    <button onClick={() => navigate("/orders")}>
                        My Orders
                    </button>
                )}

                {role === "ADMIN" && (
                    <>
                        <button
                            onClick={() =>
                                navigate("/admin/products")
                            }
                        >
                            Products
                        </button>

                        <button
                            onClick={() =>
                                navigate("/admin/orders")
                            }
                        >
                            Orders
                        </button>
                    </>
                )}

                {!token ? (
                    <>
                        <button
                            onClick={() => navigate("/login")}
                        >
                            Login
                        </button>

                        <button
                            onClick={() => navigate("/register")}
                        >
                            Register
                        </button>
                    </>
                ) : (
                    <button onClick={handleLogout}>
                        Logout
                    </button>
                )}

            </nav>

        </header>
    );
}

export default Navbar;