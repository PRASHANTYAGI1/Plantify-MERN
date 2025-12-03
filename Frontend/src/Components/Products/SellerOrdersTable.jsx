// src/components/product/SellerOrdersTable.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function SellerOrdersTable() {
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/orders/seller", {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      setOrders(res.data.orders || []);
    } catch (err) {
      console.warn("SellerOrders fetch failed", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  if (loading) return <div className="p-6 bg-white rounded-xl shadow">Loading...</div>;

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-4">Seller Orders</h3>

      {orders.length === 0 ? (
        <div className="text-gray-500">No orders yet</div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o._id} className="p-3 border rounded flex items-center justify-between">
              <div>
                <div className="font-medium">{o.product?.title || "Product"}</div>
                <div className="text-xs text-gray-500">Buyer: {o.buyer?.name || "-"}</div>
              </div>

              <div className="text-right">
                <div className="font-bold">₹{o.totalAmount}</div>
                <div className="text-xs text-gray-500 capitalize">{o.orderStatus}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
