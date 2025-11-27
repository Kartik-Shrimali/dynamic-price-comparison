import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_API_BASE_URL } from '../config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faSearch, faSignOutAlt, faStore, faTruck, faStar, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

export function DashboardUser() {
    const [products, setProducts] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [priceData, setPriceData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const fetchProducts = async () => {
        try {
            const res = await fetch(`${BACKEND_API_BASE_URL}/api/v1/user/products`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (res.ok) {
                setProducts(data);
            } else {
                alert("Failed to fetch products");
            }
        } catch (err) {
            console.error("Error fetching products:", err);
        }
    };

    const fetchPriceComparison = async (productId) => {
        try {
            const res = await fetch(
                `${BACKEND_API_BASE_URL}/api/v1/user/products/${productId}/compare`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const data = await res.json();
            if (res.ok) {
                setPriceData(data);
            } else {
                alert("Failed to fetch price comparison");
            }
        } catch (err) {
            console.error("Error fetching price comparison:", err);
        }
    };

    const handleProductClick = (productId) => {
        setSelectedProductId(productId);
        fetchPriceComparison(productId);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    const handleSetAlert = async () => {
        const amount = prompt("Enter your maximum payable amount:");
        if (!amount || isNaN(amount)) return alert("Please enter a valid number");

        try {
            const res = await fetch(
                `${BACKEND_API_BASE_URL}/api/v1/user/alerts/add`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        product_id: selectedProductId,
                        max_payable_amount: parseFloat(amount),
                    }),
                }
            );

            const data = await res.json();
            if (res.ok) {
                alert("Price alert set successfully!");
            } else {
                alert(data.msg || "Failed to set price alert");
            }
        } catch (err) {
            console.error("Error setting alert:", err);
            alert("Error setting alert");
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-lg fixed h-screen">
                <div className="p-6">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8">
                        PriceWise
                    </h2>

                    <nav className="space-y-4">
                        <button
                            onClick={() => navigate("/price-alert")}
                            className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all duration-200"
                        >
                            <FontAwesomeIcon icon={faBell} className="text-lg" />
                            <span className="font-medium">Price Alerts</span>
                        </button>

                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                        >
                            <FontAwesomeIcon icon={faSignOutAlt} className="text-lg" />
                            <span className="font-medium">Logout</span>
                        </button>
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-64 flex-1 p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back!</h1>
                    <p className="text-gray-600">Find the best deals on your favorite products</p>
                </div>

                {/* Search Bar */}
                <div className="mb-8">
                    <div className="relative max-w-2xl">
                        <FontAwesomeIcon 
                            icon={faSearch} 
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                        <input
                            type="text"
                            placeholder="Search for products..."
                            className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Products Grid */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">All Products</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProducts.map((product) => (
                            <div
                                key={product.id}
                                onClick={() => handleProductClick(product.id)}
                                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl cursor-pointer transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-blue-500"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-gray-800 mb-2">{product.name}</h3>
                                        <p className="text-sm text-gray-500">{product.brand}</p>
                                    </div>
                                </div>
                                <div className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-lg text-sm font-medium">
                                    {product.category}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Price Comparison Table */}
                {selectedProductId && (
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800">Price Comparison</h3>
                                <p className="text-gray-600 mt-1">Product ID: {selectedProductId}</p>
                            </div>
                            <button
                                onClick={handleSetAlert}
                                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
                            >
                                <FontAwesomeIcon icon={faBell} />
                                Set Price Alert
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b-2 border-gray-200">
                                        <th className="text-left py-4 px-4 font-semibold text-gray-700">
                                            <div className="flex items-center gap-2">
                                                <FontAwesomeIcon icon={faStore} />
                                                Store
                                            </div>
                                        </th>
                                        <th className="text-left py-4 px-4 font-semibold text-gray-700">Price</th>
                                        <th className="text-left py-4 px-4 font-semibold text-gray-700">Available</th>
                                        <th className="text-left py-4 px-4 font-semibold text-gray-700">
                                            <div className="flex items-center gap-2">
                                                <FontAwesomeIcon icon={faStar} />
                                                Rating
                                            </div>
                                        </th>
                                        <th className="text-left py-4 px-4 font-semibold text-gray-700">
                                            <div className="flex items-center gap-2">
                                                <FontAwesomeIcon icon={faTruck} />
                                                Delivery
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {priceData.length > 0 ? (
                                        priceData.map((store, index) => (
                                            <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                <td className="py-4 px-4 font-medium text-gray-800">{store.store_name}</td>
                                                <td className="py-4 px-4">
                                                    <span className="text-lg font-bold text-green-600">
                                                        ₹{(store.price && !isNaN(store.price)) ? store.price : "N/A"}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4">
                                                    {store.available ? (
                                                        <span className="flex items-center gap-2 text-green-600">
                                                            <FontAwesomeIcon icon={faCheckCircle} />
                                                            Yes
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-2 text-red-600">
                                                            <FontAwesomeIcon icon={faTimesCircle} />
                                                            No
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className="flex items-center gap-1">
                                                        <span className="font-medium">{store.rating}</span>
                                                        <FontAwesomeIcon icon={faStar} className="text-yellow-400 text-sm" />
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 text-gray-600">{store.delivery_time_days} days</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="py-8 text-center text-gray-500">
                                                No price data available
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}