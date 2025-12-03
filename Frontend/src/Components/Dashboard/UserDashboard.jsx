// src/components/dashboard/UserDashboard.jsx
import React, { useEffect, useState, useContext } from "react";
import { getUserDashboard } from "../../api/dashboardApi";
import { getWeatherSummary } from "../../api/weatherApi";
import { AuthContext } from "../../context/AuthContext";
import Loader from "../Loader";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function UserDashboard() {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loc, setLoc] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const dash = await getUserDashboard();
        setData(dash);

        // ----------------------------
        // Location detection (smart)
        // ----------------------------
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
            lat = 28.7041; // fallback – New Delhi
            lng = 77.1025;
          }
        }

        setLoc({ lat, lng });

        const w = await getWeatherSummary(lat, lng);
        setWeather(w);
      } catch (err) {
        console.warn("UserDashboard fetch error", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Refresh Weather manually
  const refreshWeather = async () => {
    if (!loc) return;
    setLoading(true);
    const w = await getWeatherSummary(loc.lat, loc.lng);
    setWeather(w);
    setLoading(false);
  };

  if (loading) return <Loader />;

  // ----------------------------
  // Monthly Spend Chart Data
  // ----------------------------
  const monthly = data?.charts?.monthlySpend || { Jan: 300, Feb: 200, Mar: 450 };
  const monthlyData = Object.entries(monthly).map(([k, v]) => ({
    name: k,
    value: v,
  }));

  // ----------------------------
  // Weather Chart Data (Line Chart)
  // ----------------------------
  const last30 = weather?.last30;
  const last30Data =
    last30?.dailyDates?.map((d, idx) => ({
      date: d.substring(5), // "MM-DD"
      max: last30.dailyMax[idx],
      min: last30.dailyMin[idx],
    })) || [];

  return (
    <div className="space-y-8">

      {/* =======================================================
          USER SUMMARY + ACTION BUTTONS
      ======================================================= */}
      <div className="bg-white p-6 rounded-xl shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Hello, {user?.name}</h2>
          <p className="text-gray-500">Here’s your quick overview</p>

          <div className="mt-4 flex gap-4">
            <SummaryCard label="Purchases" value={data.summary.totalPurchases} />
            <SummaryCard label="Spent" value={`₹${data.summary.totalSpent}`} />
            <SummaryCard
              label="Fav Category"
              value={data.summary.favoriteCategory}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => (window.location.href = "/dashboard/user")}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg shadow hover:scale-[1.01]"
          >
            Update Profile
          </button>

          <button
            onClick={refreshWeather}
            className="px-4 py-2 bg-white border rounded-lg shadow"
          >
            Refresh Weather
          </button>
        </div>
      </div>

      {/* =======================================================
          CHARTS SECTION
      ======================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Monthly Spend Line Chart */}
        <ChartCard title="Monthly Spend">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#059669"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Temperature Trend Line Chart */}
        <ChartCard title="Last 30 Days Temperature Trend">
          {last30Data.length === 0 ? (
            <p className="text-gray-500">Weather data not available</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={last30Data.slice(-14)}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="max"
                  stroke="#10B981"
                  strokeWidth={2}
                />

                <Line
                  type="monotone"
                  dataKey="min"
                  stroke="#3B82F6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

      </div>

      {/* =======================================================
          MAP + WEATHER SIDEBAR
      ======================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Map */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold mb-3">Your Farm Location</h3>

          <div className="h-72 rounded overflow-hidden">
            {loc ? (
              <MapContainer center={[loc.lat, loc.lng]} zoom={12} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[loc.lat, loc.lng]}>
                  <Popup>You are here</Popup>
                </Marker>
              </MapContainer>
            ) : (
              <p>No location found.</p>
            )}
          </div>
        </div>

        {/* Weather */}
        <WeatherCard weather={weather} refreshWeather={refreshWeather} />
      </div>

      {/* =======================================================
          RECENT ORDERS
      ======================================================= */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="font-semibold mb-3">Recent Orders</h3>

        {data.recentOrders.length === 0 ? (
          <p className="text-gray-500">No recent orders.</p>
        ) : (
          <ul className="space-y-3">
            {data.recentOrders.map((o) => (
              <li key={o._id} className="flex justify-between items-center p-3 border rounded">
                <div>
                  <p className="font-semibold">{o.product?.title ?? "Product"}</p>
                  <p className="text-xs text-gray-500">Seller: {o.seller?.name}</p>
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

/* =======================================================
    SMALL REUSABLE COMPONENTS
======================================================= */

function SummaryCard({ label, value }) {
  return (
    <div className="p-3 bg-gray-50 rounded-lg">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-lg font-bold">{value}</p>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="font-semibold mb-3">{title}</h3>
      {children}
    </div>
  );
}

function WeatherCard({ weather, refreshWeather }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="font-semibold mb-3">Weather</h3>

      {!weather ? (
        <>
          <p className="text-gray-500">Weather not available</p>
          <button
            onClick={refreshWeather}
            className="mt-3 px-3 py-2 bg-emerald-600 text-white rounded-lg"
          >
            Try Again
          </button>
        </>
      ) : (
        <>
          <div className="space-y-2">
            <div className="text-4xl font-bold">{weather.current.temperature ?? "--"}°C</div>
            <div className="text-sm text-gray-500">
              Humidity: {weather.current.humidity ?? "--"}%
            </div>
            <div className="text-sm text-gray-500">
              Wind: {weather.current.windspeed ?? "--"} m/s
            </div>
          </div>

          <button
            onClick={refreshWeather}
            className="w-full mt-4 px-3 py-2 bg-emerald-600 text-white rounded-lg"
          >
            Refresh
          </button>
        </>
      )}
    </div>
  );
}
