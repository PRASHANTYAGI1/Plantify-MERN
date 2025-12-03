// src/components/product/StatusBadge.jsx
import React from "react";

export default function StatusBadge({ stock = 0, isOutdated = false }) {
  if (isOutdated) {
    return <span className="px-2 py-1 rounded text-xs bg-yellow-50 text-yellow-700">Outdated</span>;
  }
  if (stock <= 0) {
    return <span className="px-2 py-1 rounded text-xs bg-red-50 text-red-600">Out of Stock</span>;
  }
  if (stock <= 5) {
    return <span className="px-2 py-1 rounded text-xs bg-orange-50 text-orange-600">Low Stock</span>;
  }
  return <span className="px-2 py-1 rounded text-xs bg-green-50 text-emerald-700">In Stock</span>;
}
