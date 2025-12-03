// src/pages/OrdersPage.jsx
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer"; // ⭐ ADDED
import MarketplacePanel from "../components/Order/MarketplacePanel";
import MyOrdersPanel from "../components/Order/MyOrdersPanel";
import AnalyticsPanel from "../components/Order/AnalyticsPanel";
import toast from "react-hot-toast";

export default function OrdersPage() {
  const [view, setView] = useState("marketplace");

  const tabs = [
    { id: "marketplace", label: "Marketplace" },
    { id: "myorders", label: "My Orders" },
    { id: "analytics", label: "Analytics" },
  ];

  // ⭐ Toast with smooth feedback
  const handleTabChange = (tabId) => {
    setView(tabId);

    toast.success(`Switched to ${tabs.find(t => t.id === tabId)?.label}`, {
      icon: "🔄",
      duration: 1500,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col overflow-x-hidden page-fade">
      <Navbar />

      <div className="flex flex-1 pt-20">

        {/* LEFT SIDEBAR */}
        <aside className="hidden md:block w-64 bg-white border-r shadow-sm p-4 sticky top-20 h-[calc(100vh-80px)]">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Orders Center</h2>

          {tabs.map((t) => (
            <button
              key={t.id}
              className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition font-medium ${
                view === t.id
                  ? "bg-emerald-600 text-white shadow"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-800"
              }`}
              onClick={() => handleTabChange(t.id)}
            >
              {t.label}
            </button>
          ))}
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 p-5 pb-16"> {/* Extra bottom padding for footer */}
          {view === "marketplace" && <MarketplacePanel />}
          {view === "myorders" && <MyOrdersPanel />}
          {view === "analytics" && <AnalyticsPanel />}
        </main>
      </div>

      {/* FOOTER (always bottom, never overlaps content) */}
      <Footer />
    </div>
  );
}
