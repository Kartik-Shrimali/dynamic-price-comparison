import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_API_BASE_URL } from '../config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faStore } from '@fortawesome/free-solid-svg-icons'; // Using the store icon

export function SigninShop() {
    const [shopname, setShopname] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    // Logic remains unchanged as requested
    async function handleSignin() {
        try {
            let response = await fetch(`${BACKEND_API_BASE_URL}/api/v1/shopkeeper/signin`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    shopname: shopname,
                    password: password
                })
            })

            let data = await response.json();
            console.log(data)
            if (data.token) {
                localStorage.setItem("token", data.token);
                alert("Signin successful")
                navigate("/dashboard/store")
            }
            else {
                alert(data.msg || "Signin failed! Please try again. " + data.errors.msg)
            }
        } catch (error) {
            alert("Network error! Please check your connection.")
            console.log(error)
        }
    }

    return (
        // Applied soft background gradient consistent with LandingPage
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">

            {/* Applied theme-consistent card styling (rounded-3xl, shadow-2xl) */}
            <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md border border-gray-100 transform transition-transform duration-300">
                
                {/* Icon and Header */}
                <div className="text-center mb-8">
                    {/* Icon container uses store purple theme */}
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <FontAwesomeIcon icon={faStore} className="text-3xl" />
                    </div>
                    {/* Applied gradient text to the title */}
                    <h2 className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        Store Sign In
                    </h2>
                    <p className="text-gray-500 mt-2">Manage inventory and product prices.</p>
                </div>

                <div className="space-y-4">
                    {/* Applied themed input styling. Changed to shopname */}
                    <input 
                        type="text" 
                        placeholder="Enter your shop name" 
                        className="p-4 rounded-xl w-full border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 text-lg" 
                        onChange={(e) => { setShopname(e.target.value.trim()) }} 
                        value={shopname}
                    />
                    {/* CRITICAL CORRECTION: type="password" for security. Inputs focus on purple theme. */}
                    <input 
                        type="password" 
                        placeholder="Enter your password" 
                        className="p-4 rounded-xl w-full border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 text-lg" 
                        onChange={(e) => { setPassword(e.target.value) }}
                        value={password}
                    />

                    {/* Primary Signin Button - Applied purple gradient and hover effects */}
                    <button 
                        className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-4 rounded-xl font-bold text-xl hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 mt-6" 
                        onClick={handleSignin}
                    >
                        Sign In
                        <FontAwesomeIcon icon={faArrowRight} />
                    </button>
                </div>

                {/* Secondary Signup Link - Applied outline style matching the theme */}
                <div className="mt-6 text-center">
                    <p className="text-gray-600 mb-4">New to PriceWise?</p>
                    <Link to="/signup/store">
                        <button 
                            className="w-full border-2 border-purple-500 text-purple-600 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-all duration-200 text-lg"
                        >
                            Create Store Account
                        </button>
                    </Link>
                </div>
            </div>

        </div>
    )
}