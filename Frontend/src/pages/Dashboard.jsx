import React, { useContext, useState } from "react";
import UserDashboard from "../components/dashboard/UserDashboard";
import SellerDashboard from "../components/dashboard/SellerDashboard";
import AdminDashboard from "../components/dashboard/AdminDashboard";
import AlertMessage from "../Components/AlertMessage";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

import { AuthContext } from "../context/AuthContext";

export default function DashboardPage() {
  const { user } = useContext(AuthContext);
  const [mode, setMode] = useState("user");

  React.useEffect(() => {
    if (user?.role === "admin") setMode("admin");
  }, [user]);

  const showSellerToggle = user && user.canSell && user.role !== "admin";

  return (
    <div className="min-h-screen bg-gray-50 pt-24 page-fade">
      <Navbar />
      <div className="max-w-7xl mx-auto p-6">

        {/* ========== PAGE TITLE + SWITCH ========== */}
        <div className="flex items-center justify-between mb-4 gap-4">
          <h1 className="text-2xl font-bold">
            {mode === "admin" ? "Admin Dashboard" : mode === "seller" ? "Seller Dashboard" : "User Dashboard"}
          </h1>

          <div className="flex items-center gap-3">
            {showSellerToggle && (
              <div className="bg-white p-1 rounded-full shadow flex items-center gap-1">
                <button
                  onClick={() => setMode("user")}
                  className={`px-3 py-1 rounded-full ${mode === "user" ? "bg-emerald-600 text-white" : "text-gray-700"}`}
                >
                  Buyer View
                </button>
                <button
                  onClick={() => setMode("seller")}
                  className={`px-3 py-1 rounded-full ${mode === "seller" ? "bg-emerald-600 text-white" : "text-gray-700"}`}
                >
                  Seller View
                </button>
              </div>
            )}

            {user?.role === "admin" && (
              <div className="text-sm text-gray-600 px-3 py-1 rounded-md bg-white shadow">
                Admin Mode
              </div>
            )}
          </div>
        </div>

        {/* ========== AUTO ALERTS ========== */}
        <div className="space-y-3 mb-6">

          {user && !user.profileCompleted && (
            <AlertMessage
              type="warning"
              message="Your profile is incomplete. Please update to unlock full features."
            />
          )}

          {user && !user.mobileVerified && (
            <AlertMessage
              type="danger"
              message="Your mobile number is unverified. Please verify for security."
            />
          )}

          {user && user.subscriptionPlan === "free" && user.canSell && (
            <AlertMessage
              type="info"
              message="You are on the Free Seller Plan. Upgrade to increase monthly product limits."
            />
          )}

          {user && user.accountStatus === "pending" && (
            <AlertMessage
              type="info"
              message="Your seller account is under verification. Some functions are temporarily restricted."
            />
          )}

        </div>

        {/* ========== DASHBOARD CONTENT ========== */}
        <div>
          {mode === "admin" && <AdminDashboard />}
          {mode === "seller" && <SellerDashboard />}
          {mode === "user" && <UserDashboard />}
        </div>

      </div>
      <Footer />
    </div>
  );
}
