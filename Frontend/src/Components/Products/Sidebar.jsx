// src/Components/Products/Sidebar.jsx
import React from "react";
import {
  Grid,
  List,
  PlusCircle,
  PieChart,
  Tag,
  Settings,
} from "lucide-react";

export default function Sidebar({ active = "all", onChange, onAdd }) {
  const items = [
    { id: "all", label: "All Products", icon: <Grid size={16} /> },
    { id: "my", label: "My Products", icon: <List size={16} /> },
    { id: "orders", label: "Seller Orders", icon: <PieChart size={16} /> },
    { id: "analytics", label: "Analytics", icon: <Tag size={16} /> },
    { id: "settings", label: "Settings", icon: <Settings size={16} /> },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6 flex items-center gap-3 px-2">
        <div className="w-10 h-10 rounded-lg bg-emerald-600/10 flex items-center justify-center text-emerald-700">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M12 5v14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <div>
          <div className="text-sm font-semibold">Seller Console</div>
          <div className="text-xs text-gray-500">Manage your listings</div>
        </div>
      </div>

      <nav className="flex-1 px-2 space-y-1">
        {items.map((it) => {
          const activeCls =
            it.id === active
              ? "bg-emerald-600/10 text-emerald-700 ring-1 ring-emerald-100 shadow-sm"
              : "text-gray-700 hover:bg-gray-50";
          return (
            <button
              key={it.id}
              onClick={() => onChange(it.id)}
              className={`w-full flex items-center gap-3 py-3 px-3 rounded-lg transition ${activeCls}`}
            >
              <div className="w-7 h-7 flex items-center justify-center">{it.icon}</div>
              <div className="text-sm font-medium">{it.label}</div>
            </button>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t">
        <button
          onClick={onAdd}
          className="flex items-center gap-2 w-full justify-center px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow"
        >
          <PlusCircle size={16} /> Add Product
        </button>

        <div className="mt-4 text-xs text-gray-500">
          <div>Tip: keep product titles short & clear for better discoverability.</div>
        </div>
      </div>
    </div>
  );
}
