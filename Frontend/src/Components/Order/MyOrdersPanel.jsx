// src/components/orders/MyOrdersPanel.jsx
import React, { useState, useEffect } from "react";
import { getMyOrders, cancelOrder } from "../../api/orderApi";
import StatusBadge from "./StatusBadge";
import toast from "react-hot-toast";
import {
  XCircle,
  Truck,
  FileText,
  ArrowRight,
  Calendar,
  ShoppingBag,
} from "lucide-react";

export default function MyOrdersPanel() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load orders on mount
  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);
      const res = await getMyOrders();
      setOrders(res.orders || []);
    } catch (e) {
      toast.error("Failed to load your orders");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    try {
      await cancelOrder(id);
      toast.success("Order cancelled successfully");
      load();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Unable to cancel order");
    }
  };

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="animate-fadeIn">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
        <ShoppingBag className="text-emerald-600" /> My Orders
      </h2>

      {/* LOADING STATE */}
      {loading && (
        <div className="text-center py-10 text-gray-500 animate-pulse">
          Loading your orders...
        </div>
      )}

      {/* ORDERS LIST */}
      <div className="space-y-5">
        {!loading &&
          orders.map((o) => (
            <div
              key={o._id}
              className="bg-white p-5 rounded-xl shadow hover:shadow-md border transition-all"
            >
              <div className="flex flex-col md:flex-row justify-between gap-5">

                {/* PRODUCT + BASIC INFO */}
                <div className="flex gap-4">
                  <img
                    src={o.product.productImages?.[0] || "/placeholder.png"}
                    className="w-24 h-24 object-cover rounded-lg shadow-sm"
                  />

                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      {o.product.title}
                    </h3>

                    <div className="text-sm text-gray-600">
                      Seller:
                      <span className="font-medium text-gray-800">
                        {" "}{o.seller?.name || "Unknown"}
                      </span>
                    </div>

                    <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <Calendar size={12} /> Ordered on: {formatDate(o.createdAt)}
                    </div>

                    <div className="mt-2">
                      <StatusBadge status={o.orderStatus} />
                    </div>
                  </div>
                </div>

                {/* PRICE + ACTIONS */}
                <div className="flex flex-col justify-between items-end">

                  {/* PRICE INFO */}
                  <div className="text-right">
                    <div className="text-gray-500 text-sm">Total Amount</div>
                    <div className="text-xl font-semibold text-gray-800">
                      ₹{o.totalAmount}
                    </div>

                    <div className="text-xs text-gray-500 mt-1">
                      Qty: {o.quantity} • {o.orderType.toUpperCase()}
                    </div>
                  </div>

                  {/* BUTTONS */}
                  <div className="flex gap-2 mt-3">

                    {/* CANCEL ORDER */}
                    {o.orderStatus === "pending" && (
                      <button
                        onClick={() => handleCancel(o._id)}
                        className="flex items-center gap-1 px-3 py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
                      >
                        <XCircle size={16} /> Cancel
                      </button>
                    )}

                    {/* TRACK ORDER */}
                    {["shipped", "in-use"].includes(o.orderStatus) && (
                      <button className="flex items-center gap-1 px-3 py-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition">
                        <Truck size={16} /> Track
                      </button>
                    )}

                    {/* VIEW INVOICE */}
                    {o.paymentStatus === "PAID" && (
                      <button className="flex items-center gap-1 px-3 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition">
                        <FileText size={16} /> Invoice
                      </button>
                    )}

                    {/* GO TO PRODUCT PAGE */}
                    <button
                      className="flex items-center gap-1 px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition"
                      onClick={() =>
                        window.location.assign(`/products/${o.product._id}`)
                      }
                    >
                      View <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* EMPTY STATE */}
      {!loading && orders.length === 0 && (
        <div className="text-center py-16 text-gray-600">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4076/4076500.png"
            className="w-24 h-24 mx-auto mb-4 opacity-70"
          />
          <p className="text-lg font-medium">No orders yet.</p>
          <p className="text-sm text-gray-500 mt-1">
            Start exploring and place your first order!
          </p>

          <button
            onClick={() => window.location.assign("/products")}
            className="mt-4 px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Browse Products
          </button>
        </div>
      )}
    </div>
  );
}
