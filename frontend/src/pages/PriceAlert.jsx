import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function PriceAlertsUser() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/v1/user/alerts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setAlerts(data);
      } catch (error) {
        console.error("Error fetching alerts:", error);
      }
    };

    fetchAlerts();
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">📢 Your Price Alerts</h1>

      <button
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={() => navigate("/dashboard/user")}
      >
        ← Back to Dashboard
      </button>

      {alerts.length === 0 ? (
        <p className="text-gray-600">You haven't set any price alerts yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
            >
              <h2 className="text-xl font-semibold mb-2">{alert.product_name}</h2>
              <p className="text-gray-700 mb-1">
                Max Payable Amount: <span className="font-bold">₹{alert.max_payable_amount}</span>
              </p>
              <p className="text-gray-700 mb-1">
                Notifications:{" "}
                <span
                  className={`font-semibold ${
                    alert.notification_enabled ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {alert.notification_enabled ? "Enabled" : "Disabled"}
                </span>
              </p>
              {/* You can add Edit/Delete buttons here */}
              <div className="mt-3 flex gap-2">
                <button className="px-3 py-1 text-sm bg-yellow-400 text-white rounded hover:bg-yellow-500">
                  Edit
                </button>
                <button className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
