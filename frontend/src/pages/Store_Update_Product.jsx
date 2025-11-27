import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { BACKEND_API_BASE_URL } from '../config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStore, faBoxOpen, faTag, faPalette, faEdit, faDollarSign, faCube, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

export const Store_Update_Product = () => {
    // LOGIC REMAINS UNCHANGED
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
        // Applied Store Theme Background
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
            
            
            <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-xl border border-gray-100 transform transition-transform duration-300">
                
                <div className="text-center mb-8">
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <FontAwesomeIcon icon={faEdit} className="text-3xl" />
                    </div>
                    // Applied Gradient Title
                    <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        Update Inventory Price
                    </h1>
                    <p className="text-gray-500 mt-2">Modify the price and stock for Product ID: **{id}**</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    <div className="p-4 bg-gray-50 rounded-xl space-y-4 border border-gray-200">
                        <p className="text-lg font-bold text-gray-700 flex items-center gap-2">
                            <FontAwesomeIcon icon={faBoxOpen} className="text-purple-500"/> Product Details (Read-Only)
                        </p>
                        
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { label: "Name", value: product.name, icon: faTag },
                                { label: "Brand", value: product.brand, icon: faPalette },
                                { label: "Category", value: product.category, icon: faCube }
                            ].map((field, index) => (
                                <div key={index}>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">{field.label}</label>
                                    <div className="flex items-center p-3 border border-gray-300 rounded-xl bg-gray-200 text-sm font-semibold text-gray-700 truncate">
                                        <FontAwesomeIcon icon={field.icon} className="mr-2 text-gray-400" />
                                        {field.value || "Loading..."}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    
                    <div className="space-y-4">
                        
                       
                        <div>
                            <label className="block text-md font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                <FontAwesomeIcon icon={faDollarSign} className="text-purple-500" /> Current Price (₹)
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={product.price || ""}
                                onChange={handleChange}
                                className="p-4 rounded-xl w-full border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 text-lg"
                                required
                                min="0"
                            />
                        </div>

                       
                        <div>
                            <label className="block text-md font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                <FontAwesomeIcon icon={faCube} className="text-purple-500" /> Availability (Quantity)
                            </label>
                            <input
                                type="number"
                                name="available"
                                value={product.available || ""}
                                onChange={handleChange}
                                className="p-4 rounded-xl w-full border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 text-lg"
                                required
                                min="0"
                            />
                        </div>
                    </div>

                    
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-4 rounded-xl font-bold text-xl hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 mt-6"
                    >
                        Update Product Details
                    </button>

                    
                    <div className="text-center pt-2">
                        <Link
                            to="/dashboard/store"
                            className="text-purple-600 hover:text-purple-800 font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                            <FontAwesomeIcon icon={faArrowLeft} /> Back to Store Dashboard
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};