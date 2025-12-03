// src/components/dashboard/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { getAdminDashboard } from "../../api/dashboardApi";
import Loader from "../Loader";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const dash = await getAdminDashboard();
        setData(dash);
      } catch (err) {
        console.warn("Admin dashboard fetch error", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading || !data) return <Loader />;

  const monthly = data.charts.monthlyRevenue || {};
  const monthlyData = Object.entries(monthly).map(([k, v]) => ({ name: k, value: v }));

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-xl shadow flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Platform Overview</h2>
          <p className="text-gray-500">High level platform KPIs</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold">Total Revenue</h3>
          <div className="mt-3 text-2xl font-bold">₹{data.summary.totalRevenue}</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold">Total Orders</h3>
          <div className="mt-3 text-2xl font-bold">{data.summary.totalOrders}</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold">Total Sellers</h3>
          <div className="mt-3 text-2xl font-bold">{data.summary.totalSellers}</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="font-semibold mb-4">Monthly Revenue</h3>
        <div style={{ height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={monthlyData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold mb-3">Top Sellers</h3>
          {data.insights.topSellers.map((s, i) => (
            <div key={i} className="flex justify-between py-2 border-b">
              <div>{s.seller}</div>
              <div className="font-bold">₹{s.totalSales}</div>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold mb-3">Recent Orders</h3>
          {data.recentOrders.length === 0 ? (
            <p className="text-gray-500">No recent orders</p>
          ) : (
            data.recentOrders.map((o) => (
              <div key={o._id} className="flex justify-between py-2 border-b">
                <div>{o.product?.title}</div>
                <div>₹{o.totalAmount}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
