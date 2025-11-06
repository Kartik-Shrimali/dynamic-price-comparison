import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_API_BASE_URL } from '../config';


export const PriceAlertsUser = () => {
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

  if (loading) return <p className="text-center text-gray-500">Loading alerts...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4 text-center">Your Price Alerts</h2>

      {alerts.length === 0 ? (
        <p className="text-center text-gray-500">No alerts set.</p>
      ) : (
        alerts.map((alert) => (
          <div
            key={alert.id}
            className="bg-white shadow-md rounded-lg p-4 mb-4 border border-gray-200"
          >
            <p className="text-gray-800 font-medium">
              <span className="text-gray-500">Product ID:</span> {alert.product_id}
            </p>
            <p className="text-gray-800 font-medium">
              <span className="text-gray-500">Max Payable Amount:</span> ₹{alert.max_payable_amount}
            </p>
            <p className="text-gray-800 font-medium">
              <span className="text-gray-500">Notification:</span>{" "}
              {alert.notification_enabled ? (
                <span className="text-green-600 font-semibold">Enabled</span>
              ) : (
                <span className="text-red-600 font-semibold">Disabled</span>
              )}
            </p>

            {/* Edit and Delete Buttons */}
            <button
              className="text-blue-500 hover:underline mr-4"
              onClick={() => setAlertToEdit(alert)}
            >
              Edit
            </button>
            <button
              className="text-red-500 hover:underline"
              onClick={() => handleDeleteAlert(alert.id)}
            >
              Delete
            </button>
          </div>
        ))
      )}

      {/* Edit Alert Form */}
      {alertToEdit && (
        <div className="bg-white shadow-md rounded-lg p-4 mt-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Edit Alert</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdateAlert(); 
            }}
          >
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Max Payable Amount</label>
              <input
                type="number"
                step="0.01"
                value={alertToEdit.max_payable_amount}
                onChange={(e) => setAlertToEdit({ ...alertToEdit, max_payable_amount: e.target.value })}
                className="mt-1 p-2 w-full border border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Notification Enabled</label>
              <select
                value={alertToEdit.notification_enabled}
                onChange={(e) =>
                  setAlertToEdit({ ...alertToEdit, notification_enabled: e.target.value === "true" })
                }
                className="mt-1 p-2 w-full border border-gray-300 rounded"
              >
                <option value={true}>Enabled</option>
                <option value={false}>Disabled</option>
              </select>
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setAlertToEdit(null)}
              className="px-4 py-2 bg-gray-300 text-black rounded"
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
