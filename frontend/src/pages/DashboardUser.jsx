import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function DashboardUser() {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [priceData, setPriceData] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/v1/user/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log("Fetched products:", data); // Log the response to verify the structure

      if (res.ok) {
        setProducts(data); // Set the products array directly
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
        `http://localhost:3000/api/v1/user/products/${productId}/compare`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (res.ok) {
        setPriceData(data); // Store the price data for the selected product
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
        "http://localhost:3000/api/v1/user/alerts/add",
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

  return (
    <div className="flex">
      <aside className="w-64 h-screen p-4 shadow bg-white">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Welcome User</h2>
          <button
            onClick={() => navigate("/price-alert")}
            className="text-blue-600 hover:underline flex items-center gap-2 mb-4"
          >
            <span>🔔</span> Price Alerts!!
          </button>
          <button
            onClick={handleLogout}
            className="bg-gray-100 px-4 py-2 rounded shadow w-full text-left"
          >
            ⬅ Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 bg-gray-100 min-h-screen">
        <input
          type="text"
          placeholder="Search for products..."
          className="w-full mb-4 p-2 border rounded"
        />

        <h2 className="text-xl font-bold mb-4">All Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white p-4 rounded shadow cursor-pointer hover:bg-gray-100 transition"
              onClick={() => handleProductClick(product.id)}
            >
              <h3 className="text-lg font-medium">{product.name}</h3>
              <p className="text-gray-500">
                {product.brand} - {product.category}
              </p>
            </div>
          ))}
        </div>

        {selectedProductId && (
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-4">
              Price Comparison for Product ID: {selectedProductId}
            </h3>

            <table className="w-full table-auto border">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border">Store</th>
                  <th className="p-2 border">Price</th>
                  <th className="p-2 border">Available</th>
                  <th className="p-2 border">Rating</th>
                  <th className="p-2 border">Delivery (days)</th>
                </tr>
              </thead>
              <tbody>
                {priceData.length > 0 ? (
                  priceData.map((store, index) => (
                    <tr key={index}>
                      <td className="p-2 border">{store.store_name}</td>
                      <td className="p-2 border text-green-600 font-medium">
                        ₹{(store.price && !isNaN(store.price))
                          ? store.price
                          : "N/A"}
                      </td>
                      <td className="p-2 border">
                        {store.available ? "Yes" : "No"}
                      </td>
                      <td className="p-2 border">{store.rating}</td>
                      <td className="p-2 border">{store.delivery_time_days}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-2 border text-center">
                      No price data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <button
              onClick={handleSetAlert}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              ➕ Set Price Alert
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
