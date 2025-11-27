import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_API_BASE_URL } from '../config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faUserLock } from '@fortawesome/free-solid-svg-icons';

export function SigninUser() {
    const [email, setEmail] = useState(""); 
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    
    // Logic remains unchanged as requested
    async function handleSignin() {
        try {
            let response = await fetch(`${BACKEND_API_BASE_URL}/api/v1/users/signin`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email.trim(),
                    password: password
                })
            })

            let data = await response.json();

            if (data.token) {
                localStorage.setItem("token", data.token);
                alert("Signin successful")
                navigate("/dashboard/user")
            }
            else {
                alert(data.msg|| "Signin failed! Please try again.")
            }
        } catch (error) {
            alert("Network error! Please check your connection.")
            console.log(error)
        }
    }


    return (
        // Applied soft background gradient
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">

            {/* Applied theme-consistent card styling */}
            <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md border border-gray-100 transform transition-transform duration-300">
                
                {/* Icon and Header */}
                <div className="text-center mb-8">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <FontAwesomeIcon icon={faUserLock} className="text-3xl" />
                    </div>
                    {/* Applied gradient text to the title */}
                    <h2 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Shopper Sign In
                    </h2>
                    <p className="text-gray-500 mt-2">Access your price alerts and savings.</p>
                </div>

                <div className="space-y-4">
                    {/* Applied themed input styling */}
                    <input 
                        type="email" 
                        placeholder="Enter your email" 
                        className="p-4 rounded-xl w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-lg" 
                        onChange={(e) => { setEmail(e.target.value) }} 
                        value={email}
                    />
                    {/* CRITICAL CORRECTION: type="password" for security */}
                    <input 
                        type="password" 
                        placeholder="Enter your password" 
                        className="p-4 rounded-xl w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-lg" 
                        onChange={(e) => { setPassword(e.target.value) }}
                        value={password}
                    />

                    {/* Primary Signin Button - Applied blue gradient and hover effects */}
                    <button 
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-xl font-bold text-xl hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 mt-6" 
                        onClick={handleSignin}
                    >
                        Sign In
                        <FontAwesomeIcon icon={faArrowRight} />
                    </button>
                </div>

                {/* Secondary Signup Link - Applied outline style matching the theme */}
                <div className="mt-6 text-center">
                    <p className="text-gray-600 mb-4">Don't have an account?</p>
                    <Link to="/signup/user">
                        <button 
                            className="w-full border-2 border-blue-500 text-blue-600 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-200 text-lg"
                        >
                            Sign Up for PriceWise
                        </button>
                    </Link>
                </div>
            </div>

        </div>
    )
}