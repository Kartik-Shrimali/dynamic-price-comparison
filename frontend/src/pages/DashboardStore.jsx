import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faBell, faRightFromBracket, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


export function DashboardStore() {
    const token = localStorage.getItem("token");
    const [products, setProducts] = useState([]);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await fetch("http://localhost:3000/api/v1/store/products/", {
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
                console.log(err)
            }
        }
        fetchProducts();
    }, []);
    const navigate = useNavigate();
    return (
        <div className="bg-gray-100 h-screen flex">
            <div className="bg-white shadow-lg w-1/5 flex flex-col mb-5">{/* sidebar*/}
                <div className=" font-bold m-3 flex justify-center items-center">
                    <FontAwesomeIcon icon={faUser} className="border-4 border-gray-800 rounded-full p-2 text-xl" />
                    <div className="m-5 text-2xl">Welcome User</div>
                </div>

                <div className="flex justify-center items-center m-5">
                    <button className="w-full p-3 text-xl text-left text-gray-700 font-semibold hover:bg-gray-200 rounded-lg flex justify-center items-center gap-2" onClick={() => {
                        localStorage.removeItem("token");
                        navigate("/");
                        alert("Logged out successfully")
                    }}>
                        <FontAwesomeIcon icon={faRightFromBracket} />
                        <div>
                            Logout
                        </div>
                    </button>
                </div>

            </div>

            <div className="flex-1 p-8">

                <div className="flex items-center bg-white shadow p-3 rounded-lg mb-6">
                    <FontAwesomeIcon icon={faMagnifyingGlass} className="text-gray-500" />
                    <input type="text" placeholder="Search for products..." className="ml-3 w-full p-2 outline-none" />
                </div>

                <h2 className="text-xl font-bold mb-4">Manage Your Products</h2>
                <div className="bg-white shadow p-4 rounded-lg">
                    {products.length === 0 ?
                        <p>No products available.</p>

                        : (products.map((product) => (
                            <div key={product.id}>
                                <p>{product.name}</p>
                                <p>{product.brand}</p>
                                <p>{product.category}</p>
                                <p>{product.price}</p>
                                <p>{product.available ? "Available" : "Not Available"}</p>
                            </div>
                        )))


                    }

                </div>

            </div>
        </div>
    )
}
