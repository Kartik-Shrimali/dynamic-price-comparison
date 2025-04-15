import { Link } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function DashboardStore() {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [newProduct, setNewProduct] = useState({ name: '', brand: '', category: '', price: '', available: 1 });  // Default 'available' to 1
    const navigate = useNavigate();

    const token = localStorage.getItem('token');

    const fetchProducts = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/v1/store/products/?search=${searchTerm}`, {
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
        fetchProducts();
    }, [searchTerm, token]);

    const handleAddProduct = async () => {
        const response = await fetch("http://localhost:3000/api/v1/store/products/add", {
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
                available: newProduct.available  // Send 0 or 1 instead of true or false
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.msg);
            setNewProduct({ name: '', brand: '', category: '', price: '', available: 1 });  // Default 'available' to 1
            fetchProducts();
        } else {
            alert(data.msg || "Error adding product");
        }
    };

    const handleDelete = async (id) => {
        const response = await fetch(`http://localhost:3000/api/v1/store/products/delete`, {
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

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Store Dashboard</h1>
                <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Logout</button>
            </div>

            <div className="mb-6">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search product..."
                    className="border border-gray-300 p-2 rounded w-full"
                />
            </div>

            <div className="bg-white p-6 rounded shadow mb-8">
                <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
                <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="Name" value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        className="border border-gray-300 p-2 rounded"
                    />
                    <input type="text" placeholder="Brand" value={newProduct.brand}
                        onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                        className="border border-gray-300 p-2 rounded"
                    />
                    <input type="text" placeholder="Category" value={newProduct.category}
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                        className="border border-gray-300 p-2 rounded"
                    />
                    <input type="number" placeholder="Price" value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: parseInt(e.target.value) })}
                        className="border border-gray-300 p-2 rounded"
                    />
                    <div className="col-span-2 flex items-center">
                        <input type="checkbox" checked={newProduct.available === 1}  // Check for 1, not true
                            onChange={(e) => setNewProduct({ ...newProduct, available: e.target.checked ? 1 : 0 })}  // Set 1 for checked, 0 for unchecked
                            className="mr-2"
                        />
                        <span>Available</span>
                    </div>
                    <button onClick={handleAddProduct}
                        className="col-span-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        Add Product
                    </button>
                </div>
            </div>

            <div className="bg-white p-6 rounded shadow">
                <h2 className="text-xl font-semibold mb-4">Your Products</h2>
                {products.length === 0 ? (
                    <p>No products found.</p>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="p-2">Name</th>
                                <th className="p-2">Brand</th>
                                <th className="p-2">Category</th>
                                <th className="p-2">Price</th>
                                <th className="p-2">Available</th>
                                <th className="p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product.id} className="border-t">
                                    <td className="p-2">{product.name}</td>
                                    <td className="p-2">{product.brand}</td>
                                    <td className="p-2">{product.category}</td>
                                    <td className="p-2">₹{product.price || '-'}</td>
                                    <td className="p-2">{product.available === 1 ? "Yes" : "No"}</td> 
                                    <td className="p-2">
                                        <button
                                            onClick={() => navigate(`/update/${product.id}`)}
                                            className="bg-yellow-400 text-white px-2 py-1 rounded mr-2"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="bg-red-500 text-white px-2 py-1 rounded"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
