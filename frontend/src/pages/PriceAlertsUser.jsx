import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_API_BASE_URL } from '../config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faEdit, faTrash, faSave, faTimes, faDollarSign } from '@fortawesome/free-solid-svg-icons';

export const PriceAlertsUser = () => {
    // LOGIC REMAINS UNCHANGED
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [alertToEdit, setAlertToEdit] = useState(null);


    const fetchAlerts = async () => {
        try {
            const token = localStorage.getItem("token"); 
        
            const res = await fetch(`${BACKEND_API_BASE_URL}/api/v1/user/alerts/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || "Failed to fetch alerts");
            }
        
            const data = await res.json();
        
            setAlerts(data); 
        } catch (err) {
            setError(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchAlerts();
    }, []);
    
    
    const handleUpdateAlert = async () => {
        const token = localStorage.getItem("token");
    
        try {
            const res = await fetch(
                `${BACKEND_API_BASE_URL}/api/v1/user/alerts/${alertToEdit.id}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(alertToEdit), 
                }
            );
        
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || "Failed to update alert");
            }
        
            fetchAlerts(); 
            setAlertToEdit(null); 
        } catch (err) {
            setError(err.message || "An error occurred while updating the alert");
        }
    };

    
    const handleDeleteAlert = async (alertId) => {
        const token = localStorage.getItem("token");
    
        try {
            const res = await fetch(`${BACKEND_API_BASE_URL}/api/v1/user/alerts/delete`, { 
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: alertId }),
            });
        
            if (!res.ok) {
                const errorText = await res.text(); 
                throw new Error(errorText || "Failed to delete alert");
            }

            fetchAlerts();
        } catch (err) {
            setError(err.message || "An error occurred while deleting the alert");
        }
    };

    if (loading) return (
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <p className="text-xl font-semibold text-gray-600">Loading alerts...</p>
        </div>
    );
    if (error) return (
        <div className="min-h-screen flex justify-center items-center bg-red-50">
            <p className="text-xl font-semibold text-red-700">Error: {error}</p>
        </div>
    );

    return (
        // Applying the standard PriceWise user background
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 pt-12">
            <div className="max-w-3xl mx-auto">
                {/* Themed Title */}
                <h2 className="text-4xl font-extrabold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    <FontAwesomeIcon icon={faBell} className="mr-3 text-blue-500"/>
                    Your Price Alerts
                </h2>

                {alerts.length === 0 ? (
                    // Themed Empty State
                    <div className="text-center p-10 bg-white rounded-2xl shadow-lg border-2 border-dashed border-blue-200">
                        <p className="text-xl text-gray-500 font-medium">
                            You haven't set any price alerts yet. Start saving money!
                        </p>
                    </div>
                ) : (
                    alerts.map((alert) => (
                        // Themed Alert Card
                        <div
                            key={alert.id}
                            className="bg-white rounded-xl shadow-lg p-6 mb-4 border-l-4 border-blue-500 hover:shadow-xl transition-shadow duration-300"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-gray-500 text-sm">Product ID</p>
                                    <p className="text-xl font-bold text-gray-800">{alert.product_id}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-gray-500 text-sm">Target Price</p>
                                    {/* Gradient Price Tag */}
                                    <p className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
                                        ₹{alert.max_payable_amount}
                                    </p>
                                </div>
                            </div>

                            {/* Notification Status Badge */}
                            <div className="mb-4">
                                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${
                                    alert.notification_enabled
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }`}>
                                    {alert.notification_enabled ? "Alerts Enabled" : "Alerts Disabled"}
                                </span>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex space-x-4 pt-2 border-t border-gray-100 mt-4">
                                {/* Edit Button (Themed) */}
                                <button
                                    className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-200 shadow-md"
                                    onClick={() => setAlertToEdit(alert)}
                                >
                                    <FontAwesomeIcon icon={faEdit} /> Edit
                                </button>
                                {/* Delete Button (Themed) */}
                                <button
                                    className="flex items-center justify-center gap-2 px-4 py-2 border border-red-500 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors duration-200"
                                    onClick={() => handleDeleteAlert(alert.id)}
                                >
                                    <FontAwesomeIcon icon={faTrash} /> Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}

                {/* Edit Alert Modal/Form - Applying Themed Styling */}
                {alertToEdit && (
                    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md transform transition-all duration-300">
                            <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
                                <FontAwesomeIcon icon={faEdit} className="text-blue-500"/>
                                Edit Alert: <span className="text-lg font-mono text-blue-600">{alertToEdit.product_id}</span>
                            </h3>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleUpdateAlert(); 
                                }}
                            >
                                <div className="mb-6">
                                    <label className="block text-md font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                        <FontAwesomeIcon icon={faDollarSign} className="text-green-500" /> Max Payable Amount (₹)
                                    </label>
                                    {/* Themed Input */}
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={alertToEdit.max_payable_amount}
                                        onChange={(e) => setAlertToEdit({ ...alertToEdit, max_payable_amount: e.target.value })}
                                        className="p-3 w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                        required
                                    />
                                </div>
                                <div className="mb-6">
                                    <label className="block text-md font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                        <FontAwesomeIcon icon={faBell} className="text-blue-500" /> Notification Enabled
                                    </label>
                                    {/* Themed Select */}
                                    <select
                                        value={alertToEdit.notification_enabled}
                                        onChange={(e) =>
                                            setAlertToEdit({ ...alertToEdit, notification_enabled: e.target.value === "true" })
                                        }
                                        className="p-3 w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                    >
                                        <option value={true}>Enabled</option>
                                        <option value={false}>Disabled</option>
                                    </select>
                                </div>

                                {/* Themed Action Buttons */}
                                <div className="flex justify-end space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setAlertToEdit(null)}
                                        className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors duration-200"
                                    >
                                        <FontAwesomeIcon icon={faTimes} /> Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-bold hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
                                    >
                                        <FontAwesomeIcon icon={faSave} /> Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};