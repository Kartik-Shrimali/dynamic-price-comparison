import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { BACKEND_API_BASE_URL } from '../config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faStore, faStar, faTruck } from '@fortawesome/free-solid-svg-icons';

export function SignupShop() {

    const [shopname, setShopname] = useState("");
    // CRITICAL: Initialize rating/delivery to match default values if not provided
    const [password, setPassword] = useState("");
    const [rating, setRating] = useState(3.0); // Changed default to neutral 3.0
    const [delivery_time_days, setDelivery_time_days] = useState(2); // Changed default to 2 days
    const navigate = useNavigate();

    // Logic remains unchanged as requested
    async function handleSignup() {
        try {
            let response = await fetch(`${BACKEND_API_BASE_URL}/api/v1/shopkeeper/signup`, {
                method: "POST",
                body: JSON.stringify({
                    shopname: shopname,
                    password: password,
                    rating: rating,
                    delivery_time_days: delivery_time_days
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            })

            let data = await response.json();
            if (data.token) {
                localStorage.setItem("token", data.token);
                alert("Signup successful")
                navigate("/dashboard/store")
            }
            else {
                alert(data.message || "Signup failed! Please try again. " + data.errors.message)
            }
        } catch (err) {
            alert("Network error! Please check your connection.")
            console.log(err)
        }
    };

    return (
        // Applied soft background gradient
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">

            {/* Applied theme-consistent card styling */}
            <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md border border-gray-100 transform transition-transform duration-300">
                
                {/* Icon and Header */}
                <div className="text-center mb-8">
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <FontAwesomeIcon icon={faStore} className="text-3xl" />
                    </div>
                    {/* Applied gradient text to the title */}
                    <h2 className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        Register Your Shop
                    </h2>
                    <p className="text-gray-500 mt-2">Join PriceWise to attract new customers.</p>
                </div>

                <div className="space-y-4">
                    {/* Shop Name Input */}
                    <input 
                        type="text" 
                        placeholder="Shop Name" 
                        className="p-4 rounded-xl w-full border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 text-lg" 
                        onChange={(e) => { setShopname(e.target.value) }}
                    />

                    {/* Password Input (Corrected Type) */}
                    <input 
                        type="password" // CRITICAL FIX
                        placeholder="Password" 
                        className="p-4 rounded-xl w-full border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 text-lg" 
                        onChange={(e) => { setPassword(e.target.value) }}
                    />
                    
                    {/* Rating Input (Used Slider for better UX and theme compliance) */}
                    <div className="pt-2">
                        <label className="flex items-center text-gray-700 font-semibold mb-2">
                            <FontAwesomeIcon icon={faStar} className="text-purple-500 mr-2" />
                            Initial Rating: <span className="ml-2 font-bold text-purple-600">{rating.toFixed(1)} / 5.0</span>
                        </label>
                        <input 
                            type="range"
                            min="1.0"
                            max="5.0"
                            step="0.1"
                            value={rating}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg accent-purple-600"
                            onChange={(e) => { setRating(parseFloat(e.target.value)) }}
                        />
                    </div>

                    {/* Delivery Time Input (Corrected Type) */}
                    <div className="pt-2">
                        <label className="flex items-center text-gray-700 font-semibold mb-2">
                            <FontAwesomeIcon icon={faTruck} className="text-purple-500 mr-2" />
                            Estimated Delivery Time (Days): <span className="ml-2 font-bold text-purple-600">{delivery_time_days}</span>
                        </label>
                        <input 
                            type="number" // FIX: Use number type
                            min="1"
                            placeholder="Delivery time in days" 
                            value={delivery_time_days}
                            className="p-4 rounded-xl w-full border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 text-lg" 
                            onChange={(e) => { setDelivery_time_days(parseInt(e.target.value)) }}
                        />
                    </div>
                    

                    {/* Primary Signup Button - Applied purple gradient and hover effects */}
                    <button 
                        className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-4 rounded-xl font-bold text-xl hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 mt-8" 
                        onClick={handleSignup}
                    >
                        Create Account
                        <FontAwesomeIcon icon={faArrowRight} />
                    </button>
                </div>

                {/* Secondary Signin Link - Applied outline style matching the theme */}
                <div className="mt-6 text-center">
                    <p className="text-gray-600 mb-4">Already registered?</p>
                    <Link to="/signin/store">
                        <button 
                            className="w-full border-2 border-purple-500 text-purple-600 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-all duration-200 text-lg"
                        >
                            Sign In to Your Store
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    )
}