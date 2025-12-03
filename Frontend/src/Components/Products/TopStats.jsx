// src/components/product/TopStats.jsx
import React, { useEffect, useState } from "react";
import { getAllProducts } from "../../api/productApi";
import { BarChart, Bar, ResponsiveContainer } from "recharts";

/**
 * This component shows simple cards: Total products, Revenue (dummy if missing), Sold (dummy).
 * If backend provides stats in future replace accordingly.
 */
export default function TopStats() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await getAllProducts();
        setProducts(res.products || []);
      } catch (err) {
        console.warn("TopStats: getAllProducts failed", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Dummy analytics derived from product list when BE doesn't provide analytics
  const totalProducts = products.length;
  const dummyRevenue = products.reduce((s, p) => s + ((p.price || 0) * ((p.ordersCount || 1))), 0) || 12432;
  const dummySold = products.reduce((s, p) => s + (p.ordersCount || Math.floor(Math.random() * 50)), 0) || 3899;

  // mini chart data
  const chartData = [
    { name: "Mon", v: Math.floor(dummyRevenue * 0.08) },
    { name: "Tue", v: Math.floor(dummyRevenue * 0.12) },
    { name: "Wed", v: Math.floor(dummyRevenue * 0.15) },
    { name: "Thu", v: Math.floor(dummyRevenue * 0.2) },
    { name: "Fri", v: Math.floor(dummyRevenue * 0.18) },
    { name: "Sat", v: Math.floor(dummyRevenue * 0.12) },
    { name: "Sun", v: Math.floor(dummyRevenue * 0.15) },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard title="Total Products" value={totalProducts} subtitle="+12 product vs last week">
        <MiniChart data={chartData} />
      </StatCard>

      <StatCard title="Product Revenue" value={`₹${formatNumber(dummyRevenue)}`} subtitle="+5% vs last week">
        <MiniChart data={chartData} color="#10B981" />
      </StatCard>

      <StatCard title="Product Sold" value={dummySold} subtitle="+2% vs last week">
        <MiniChart data={chartData} color="#111827" />
      </StatCard>
    </div>
  );
}

function StatCard({ title, value, subtitle, children }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <div className="text-2xl font-semibold mt-2">{value}</div>
        <div className="text-xs text-gray-400 mt-1">{subtitle}</div>
      </div>

      <div style={{ width: 120, height: 60 }}>
        {children}
      </div>
    </div>
  );
}

function MiniChart({ data, color = "#3b82f6" }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <Bar dataKey="v" fill={color} radius={[4, 4, 4, 4]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function formatNumber(n) {
  if (!n && n !== 0) return "-";
  return n.toLocaleString();
}
