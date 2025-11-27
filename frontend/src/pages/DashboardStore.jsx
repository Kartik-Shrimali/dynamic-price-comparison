import { Link } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BACKEND_API_BASE_URL } from '../config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStore, faSearch, faPlus, faTrash, faEdit, faSignOutAlt, faTag, faDollarSign, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

export function DashboardStore() {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [newProduct, setNewProduct] = useState({ name: '', brand: '', category: '', price: '', available: 1 });
    const navigate = useNavigate();

    const token = localStorage.getItem('token');

    // --- Data Handlers (Logic Unchanged) ---
    const fetchProducts = async () => {
        // ... (fetchProducts logic remains here)
        try {
            const response = await fetch(`${BACKEND_API_BASE_URL}/api/v1/store/products/?search=${searchTerm}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setProducts(data);
            } else {
                alert("Failed to fetch products");
            }
        } catch (err) {
            alert("There was some internal server error");
            console.log(err);
        }
    };

    useEffect(() => {
        // Debounce search term fetching to prevent excessive API calls
        const delaySearch = setTimeout(() => {
            fetchProducts();
        }, 300); // 300ms debounce time
        return () => clearTimeout(delaySearch);
    }, [searchTerm, token]);
    
    // ... (handleAddProduct logic remains here)
    const handleAddProduct = async () => {
        const response = await fetch(`${BACKEND_API_BASE_URL}/api/v1/store/products/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                product_name: newProduct.name,
                brand: newProduct.brand,
                category: newProduct.category,
                price: newProduct.price,
                available: newProduct.available
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.msg);
            setNewProduct({ name: '', brand: '', category: '', price: '', available: 1 });
            fetchProducts();
        } else {
            alert(data.msg || "Error adding product");
        }
    };

    // ... (handleDelete logic remains here)
    const handleDelete = async (id) => {
        const response = await fetch(`${BACKEND_API_BASE_URL}/api/v1/store/products/delete`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ id }) 
        });
    
        const data = await response.json();
    
        if (response.ok) {
            alert(data.msg);
            fetchProducts();
        } else {
            alert(data.msg || "Error deleting product");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };
    // --- End Data Handlers ---

    return (
        // Theme Background
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
            
            {/* Header Section */}
            <div className="container mx-auto flex justify-between items-center mb-10 pt-4">
                <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-3">
                    <FontAwesomeIcon icon={faStore} className="text-purple-600" />
                    Store Manager Dashboard
                </h1>
                <button 
                    onClick={handleLogout} 
                    className="bg-red-600 text-white px-6 py-2 rounded-xl font-semibold shadow-md hover:bg-red-700 transition duration-200 flex items-center gap-2"
                >
                    <FontAwesomeIcon icon={faSignOutAlt} />
                    Logout
                </button>
            </div>

            {/* --- Search Bar --- */}
            <div className="container mx-auto mb-8">
                <div className="relative">
                    <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search products by name, brand, or category..."
                        // Theme Inputs
                        className="pl-12 pr-4 py-3 border border-gray-300 rounded-xl w-full text-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 shadow-md"
                    />
                </div>
            </div>

            {/* --- Add New Product Card --- */}
            <div className="container mx-auto bg-white p-8 rounded-3xl shadow-xl border border-gray-100 mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <FontAwesomeIcon icon={faPlus} className="text-purple-500" />
                    Add New Product
                </h2>
                
                <div className="grid md:grid-cols-5 gap-4 items-end">
                    {/* Inputs - Styled to match theme */}
                    <input type="text" placeholder="Name" value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        className="p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    />
                    <input type="text" placeholder="Brand" value={newProduct.brand}
                        onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                        className="p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    />
                    <input type="text" placeholder="Category" value={newProduct.category}
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                        className="p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    />
                    <input type="number" placeholder="Price (₹)" value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || '' })} // Use parseFloat for price
                        className="p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    />
                    
                    {/* Available Checkbox and Button */}
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-center h-10">
                            <input type="checkbox" checked={newProduct.available === 1}
                                onChange={(e) => setNewProduct({ ...newProduct, available: e.target.checked ? 1 : 0 })}
                                className="w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 cursor-pointer"
                            />
                            <span className="ml-2 text-gray-700 font-medium">Available</span>
                        </div>
                        
                        {/* Primary Add Button with Purple Theme */}
                        <button onClick={handleAddProduct}
                            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2">
                            <FontAwesomeIcon icon={faPlus} />
                            Add Product
                        </button>
                    </div>
                </div>
            </div>
            
            {/* --- Product List Table --- */}
            <div className="container mx-auto bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <FontAwesomeIcon icon={faTag} className="text-purple-500" />
                    Current Product Catalog ({products.length})
                </h2>
                
                {products.length === 0 ? (
                    <p className="text-center text-gray-500 py-10">No products found matching your search. Try adding one!</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-purple-100 text-gray-700 uppercase text-sm leading-normal">
                                    <th className="py-3 px-6 text-left">Product Name</th>
                                    <th className="py-3 px-6 text-left">Brand</th>
                                    <th className="py-3 px-6 text-left">Category</th>
                                    <th className="py-3 px-6 text-center">Price</th>
                                    <th className="py-3 px-6 text-center">Available</th>
                                    <th className="py-3 px-6 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-600 text-sm font-light">
                                {products.map(product => (
                                    <tr key={product.id} className="border-b border-gray-200 hover:bg-purple-50 transition duration-150">
                                        <td className="py-3 px-6 font-medium">{product.name}</td>
                                        <td className="py-3 px-6">{product.brand}</td>
                                        <td className="py-3 px-6">{product.category}</td>
                                        
                                        <td className="py-3 px-6 text-center font-bold text-green-600">
                                            <FontAwesomeIcon icon={faDollarSign} className="mr-1 text-xs" />
                                            {product.price || 'N/A'}
                                        </td>
                                        
                                        <td className="py-3 px-6 text-center">
                                            {product.available === 1 ? (
                                                <span className="text-green-500 font-semibold flex items-center justify-center gap-1">
                                                    <FontAwesomeIcon icon={faCheckCircle} /> Yes
                                                </span>
                                            ) : (
                                                <span className="text-red-500 font-semibold flex items-center justify-center gap-1">
                                                    <FontAwesomeIcon icon={faTimesCircle} /> No
                                                </span>
                                            )}
                                        </td>
                                        
                                        <td className="py-3 px-6 text-center whitespace-nowrap">
                                            {/* Edit Button - Themed Yellow */}
                                            <button
                                                onClick={() => navigate(`/update/${product.id}`)}
                                                className="bg-yellow-500 text-white px-3 py-1 rounded-lg font-medium mr-2 hover:bg-yellow-600 transition duration-150 shadow-sm"
                                            >
                                                <FontAwesomeIcon icon={faEdit} className="mr-1" /> Edit
                                            </button>
                                            
                                            {/* Delete Button - Themed Red */}
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="bg-red-600 text-white px-3 py-1 rounded-lg font-medium hover:bg-red-700 transition duration-150 shadow-sm"
                                            >
                                                <FontAwesomeIcon icon={faTrash} className="mr-1" /> Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}