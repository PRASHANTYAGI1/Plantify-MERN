// src/components/orders/MarketplacePanel.jsx
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getAllProducts } from "../../api/productApi";
import { placeOrder } from "../../api/orderApi";
import OrderCard from "./OrderCard";
import toast from "react-hot-toast";

export default function MarketplacePanel() {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);
      const res = await getAllProducts();

      const data = res.products.filter((p) => {
        const sellerId = p?.seller?._id || p?.seller; // handles populated or ID value
        return sellerId !== user?._id;
      });

      setProducts(data);
    } catch (err) {
      toast.error("Failed to load marketplace products");
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async (productId) => {
    if (!user) return toast.error("Please login first!");

    if (user.profileStatus !== "complete") {
      return toast.error("Complete your profile before placing an order.");
    }

    try {
      const orderObj = {
        productId,
        quantity: 1,
        orderType: "purchase",
      };

      await placeOrder(orderObj);

      toast.success("Order placed successfully!");
      load(); // refresh UI
    } catch (err) {
      const message =
        err?.response?.data?.message || "Order failed. Try again.";
      toast.error(message);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-800">🛒 Marketplace</h2>

      {loading && (
        <div className="text-center text-gray-500 text-sm py-4">
          Loading products...
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <OrderCard
            key={p._id}
            product={p}
            onBuy={() => handleBuy(p._id)}
          />
        ))}
      </div>

      {!loading && products.length === 0 && (
        <div className="text-gray-600 mt-6 text-center">
          No products available right now.
        </div>
      )}
    </div>
  );
}
