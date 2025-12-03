import React, { useState, useEffect, useContext } from "react";
import { getAllProducts, deleteProduct } from "../../api/productApi";
import { AuthContext } from "../../context/AuthContext";
import { Pencil, Trash2 } from "lucide-react";
import StatusBadge from "./StatusBadge";

export default function MyProductsTable({ onEdit }) {
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState([]);

  const fetchProducts = async () => {
    const res = await getAllProducts();
    const mine = res.products.filter(
      (p) => String(p?.seller?._id || p.seller) === String(user._id)
    );
    setItems(mine);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    await deleteProduct(id);
    setItems((prev) => prev.filter((p) => p._id !== id));
    alert("Product deleted");
  };

  return (
    <div className="space-y-3">
      {items.map((p) => (
        <div
          key={p._id}
          className="flex items-center justify-between p-3 border rounded-lg shadow-sm hover:shadow transition"
        >
          <div className="flex items-center gap-3">
            <img
              src={p.productImages?.[0] || "/placeholder.png"}
              className="w-16 h-16 rounded object-cover"
              alt=""
            />
            <div>
              <div className="font-semibold">{p.title}</div>
              <div className="text-xs text-gray-500">{p.category}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-semibold">₹{p.price}</span>
            <StatusBadge stock={p.stock} isOutdated={p.isOutdated} />

            {/* EDIT */}
            <button
              onClick={() => onEdit(p)}
              className="p-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
            >
              <Pencil size={16} />
            </button>

            {/* DELETE */}
            <button
              onClick={() => handleDelete(p._id)}
              className="p-2 bg-red-50 text-red-600 rounded hover:bg-red-100"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
