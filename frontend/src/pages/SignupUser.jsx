import { Link, useNavigate } from "react-router-dom";
import { BACKEND_API_BASE_URL } from '../config';
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

export function SignupUser() {
    const [firstname, setFirstname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSignup() {
        setLoading(true);
        try {
            let response = await fetch(`${BACKEND_API_BASE_URL}/api/v1/users/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    firstname: firstname,
                    email: email.trim(),
                    password: password
                })
            });

            let data = await response.json();

            if (data.token) {
                localStorage.setItem("token", data.token);
                alert("Signup successful");
                navigate("/dashboard/user");
            } else {
                alert(data.msg || "Signup failed! Please try again.");
            }
        } catch (error) {
            alert("Network error! Please check your connection.");
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Back Button */}
                <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors">
                    <FontAwesomeIcon icon={faArrowLeft} />
                    <span>Back to Home</span>
                </Link>

                {/* Card */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-8 text-white text-center">
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <FontAwesomeIcon icon={faUser} className="text-4xl" />
                        </div>
                        <h1 className="text-3xl font-bold">Create Account</h1>
                        <p className="text-blue-100 mt-2">Start saving money today</p>
                    </div>

                    {/* Form */}
                    <div className="p-8 space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <FontAwesomeIcon icon={faUser} className="text-gray-400" />
                                First Name
                            </label>
                            <input
                                type="text"
                                placeholder="Enter your first name"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                                onChange={(e) => setFirstname(e.target.value)}
                                value={firstname}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <FontAwesomeIcon icon={faEnvelope} className="text-gray-400" />
                                Email Address
                            </label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <FontAwesomeIcon icon={faLock} className="text-gray-400" />
                                Password
                            </label>
                            <input
                                type="password"
                                placeholder="Create a password"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                            />
                        </div>

                        <button
                            onClick={handleSignup}
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Creating Account..." : "Sign Up"}
                        </button>

                        <div className="text-center pt-4 border-t">
                            <p className="text-gray-600 text-sm">
                                Already have an account?{" "}
                                <Link to="/signin/user" className="text-blue-600 font-semibold hover:underline">
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}