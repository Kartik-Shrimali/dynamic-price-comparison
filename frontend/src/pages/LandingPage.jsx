import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faStore, faArrowRight } from '@fortawesome/free-solid-svg-icons';

export function LandingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-12">
                <div className="text-center mb-16 pt-12">
                    <div className="inline-block mb-4 animate-bounce">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                            Price Comparison Platform
                        </div>
                    </div>
                    <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Welcome to PriceWise
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Compare prices across stores and never overpay again. Join thousands of smart shoppers and sellers.
                    </p>
                </div>

                {/* Cards Container */}
                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 mb-12">
                    {/* User Card */}
                    <div className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 transform hover:-translate-y-2">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-8 text-white">
                            <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
                                <FontAwesomeIcon icon={faUser} className="text-3xl" />
                            </div>
                            <h2 className="text-3xl font-bold mb-2">For Shoppers</h2>
                            <p className="text-blue-100">Find the best deals and set price alerts</p>
                        </div>
                        
                        <div className="p-8 space-y-4">
                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <span>Compare prices across multiple stores</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <span>Set custom price alerts</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <span>Save on every purchase</span>
                                </div>
                            </div>

                            <Link to="/signup/user">
                                <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center gap-2 group">
                                    Sign Up as Shopper
                                    <FontAwesomeIcon icon={faArrowRight} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </Link>
                            
                            <Link to="/signin/user">
                                <button className="w-full border-2 border-blue-500 text-blue-600 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-200">
                                    Already have an account? Sign In
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* Store Card */}
                    <div className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 transform hover:-translate-y-2">
                        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-8 text-white">
                            <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
                                <FontAwesomeIcon icon={faStore} className="text-3xl" />
                            </div>
                            <h2 className="text-3xl font-bold mb-2">For Stores</h2>
                            <p className="text-purple-100">Manage inventory and reach more customers</p>
                        </div>
                        
                        <div className="p-8 space-y-4">
                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                    <span>Manage your product catalog</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                    <span>Update prices in real-time</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                    <span>Attract more customers</span>
                                </div>
                            </div>

                            <Link to="/signup/store">
                                <button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center gap-2 group">
                                    Sign Up as Store
                                    <FontAwesomeIcon icon={faArrowRight} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </Link>
                            
                            <Link to="/signin/store">
                                <button className="w-full border-2 border-purple-500 text-purple-600 py-4 rounded-xl font-semibold hover:bg-purple-50 transition-all duration-200">
                                    Already have an account? Sign In
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="max-w-5xl mx-auto mt-20 text-center">
                    <h3 className="text-2xl font-bold text-gray-800 mb-12">Why Choose PriceWise?</h3>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="p-6 hover:scale-105 transition-transform duration-300">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">💰</span>
                            </div>
                            <h4 className="font-semibold text-lg mb-2">Save Money</h4>
                            <p className="text-gray-600 text-sm">Compare prices and find the best deals instantly</p>
                        </div>
                        <div className="p-6 hover:scale-105 transition-transform duration-300">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">🔔</span>
                            </div>
                            <h4 className="font-semibold text-lg mb-2">Price Alerts</h4>
                            <p className="text-gray-600 text-sm">Get notified when prices drop below your target</p>
                        </div>
                        <div className="p-6 hover:scale-105 transition-transform duration-300">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">⚡</span>
                            </div>
                            <h4 className="font-semibold text-lg mb-2">Real-time Updates</h4>
                            <p className="text-gray-600 text-sm">Live price tracking across all stores</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}