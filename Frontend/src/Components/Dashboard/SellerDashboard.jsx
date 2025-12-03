// src/components/dashboard/SellerDashboard.jsx
import React, { useEffect, useState, useContext } from "react";
import { getSellerDashboard } from "../../api/dashboardApi";
import { getWeatherSummary } from "../../api/weatherApi";
import { AuthContext } from "../../context/AuthContext";
import Loader from "../Loader";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { MapContainer, TileLayer, Marker } from "react-leaflet";

export default function SellerDashboard() {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loc, setLoc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const dash = await getSellerDashboard();
        setData(dash);

        let lat = user?.location?.lat;
        let lng = user?.location?.lng;
        if (!lat || !lng) {
          try {
            const pos = await new Promise((res, rej) =>
              navigator.geolocation.getCurrentPosition(res, rej)
            );
            lat = pos.coords.latitude;
            lng = pos.coords.longitude;
          } catch {
            lat = 28.7041;
            lng = 77.1025;
          }
        }
        setLoc({ lat, lng });

        const w = await getWeatherSummary(lat, lng);
        setWeather(w);
      } catch (err) {
        console.warn("Seller dashboard error", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Loader />;

  const summary = data.summary;
  const monthly = data.charts?.monthlySales || {};
  const monthlyData = Object.entries(monthly).map(([k, v]) => ({ name: k, value: v }));

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-xl shadow flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Seller: {user?.name}</h2>
          <p className="text-gray-500">Products: {summary.totalProducts} — Orders: {summary.totalOrders}</p>
        </div>

        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-lg bg-emerald-600 text-white">Update Profile</button>
          <button className="px-4 py-2 rounded-lg bg-white border">Update Location</button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold mb-4">Monthly Sales</h3>
          <div style={{ height: 260 }}>
            <ResponsiveContainer>
              <LineChart data={monthlyData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line dataKey="value" stroke="#10B981" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold mb-2">Weather</h3>
          {weather ? (
            <div>
              <div className="text-3xl font-bold">{weather.current.temperature ?? "--"}°C</div>
              <p className="text-sm text-gray-500">Humidity: {weather.current.humidity ?? "--"}%</p>
              <p className="text-sm text-gray-500">Wind: {weather.current.windspeed ?? "--"} m/s</p>
            </div>
          ) : (
            <p className="text-gray-500">No weather data</p>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="font-semibold mb-3">Top Products</h3>
        <div className="grid gap-3">
          {data.charts.topProducts.map(([title, qty], i) => (
            <div key={i} className="flex justify-between items-center">
              <div>{title}</div>
              <div className="text-emerald-600 font-bold">{qty}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="font-semibold mb-3">Recent Orders</h3>
        {data.recentOrders.length === 0 ? (
          <p className="text-gray-500">No orders yet</p>
        ) : (
          <ul className="space-y-3">
            {data.recentOrders.map((o) => (
              <li key={o._id} className="flex justify-between p-3 border rounded">
                <div>
                  <p className="font-semibold">{o.product?.title}</p>
                  <p className="text-xs text-gray-500">Buyer: {o.buyer?.name}</p>
                </div>
                <div className="font-bold">₹{o.totalAmount}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
