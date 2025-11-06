import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { BACKEND_API_BASE_URL } from './config';

export const Store_Update_Product = () => {
  const [product, setProduct] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${BACKEND_API_BASE_URL}/api/v1/store/products/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch product data");

        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${BACKEND_API_BASE_URL}/api/v1/store/products/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          price: parseFloat(product.price),
          available: parseInt(product.available),
        }),
      });

      if (!response.ok) throw new Error("Failed to update product");

      navigate("/dashboard/store");
    } catch (error) {
      console.error("Error updating product:", error);
      alert("An error occurred while updating the product.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">Update Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Read-only fields */}
        <div>
          <label className="block text-sm font-medium">Product Name</label>
          <input
            type="text"
            name="name"
            value={product.name || ""}
            disabled
            className="w-full mt-1 p-2 border border-gray-300 rounded bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Brand</label>
          <input
            type="text"
            name="brand"
            value={product.brand || ""}
            disabled
            className="w-full mt-1 p-2 border border-gray-300 rounded bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Category</label>
          <input
            type="text"
            name="category"
            value={product.category || ""}
            disabled
            className="w-full mt-1 p-2 border border-gray-300 rounded bg-gray-100"
          />
        </div>

        {/* Editable fields */}
        <div>
          <label className="block text-sm font-medium">Price (₹)</label>
          <input
            type="number"
            name="price"
            value={product.price || ""}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded"
            required
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Availability (Quantity)</label>
          <input
            type="number"
            name="available"
            value={product.available || ""}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded"
            required
            min="0"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Update Product
        </button>

        <div className="text-center mt-4">
          <Link
            to="/dashboard/store"
            className="text-blue-600 hover:underline text-sm"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </form>
    </div>
  );
};
