import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Register";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import ProductDashboard from "./pages/ProductDashboard";
import OrdersPage from "./pages/OrdersPage";
import SubscriptionPage from "./pages/SubscriptionPage";
import About from "./pages/About";
import MLTools from "./pages/MLTools";  // ✅ NEW IMPORT

import { AuthContext } from "./context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="pt-40 text-center">Checking session...</div>;

  return user ? children : <Navigate to="/login" replace />;
};

const RoleRoute = ({ children, allowed }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="pt-40 text-center">Validating...</div>;

  if (!user) return <Navigate to="/login" replace />;

  return allowed.includes(user.role)
    ? children
    : <Navigate to="/" replace />;
};

export default function App() {
  return (
    <Routes>

      {/* PUBLIC ROUTES */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/products" element={<ProductDashboard />} />

      {/* ML TOOLS PAGE (Private Route) */}
      <Route
        path="/ml-tools"
        element={
          <PrivateRoute>
            <MLTools />
          </PrivateRoute>
        }
      />

      {/* SUBSCRIPTION PAGE */}
      <Route
        path="/subscription"
        element={
          <PrivateRoute>
            <SubscriptionPage />
          </PrivateRoute>
        }
      />

      {/* USER & SELLER ORDERS */}
      <Route
        path="/orders"
        element={
          <PrivateRoute>
            <RoleRoute allowed={["user", "seller"]}>
              <OrdersPage />
            </RoleRoute>
          </PrivateRoute>
        }
      />

      {/* USER DASHBOARD */}
      <Route
        path="/dashboard/user"
        element={
          <PrivateRoute>
            <RoleRoute allowed={["user"]}>
              <Dashboard />
            </RoleRoute>
          </PrivateRoute>
        }
      />

      {/* SELLER DASHBOARD */}
      <Route
        path="/dashboard/seller"
        element={
          <PrivateRoute>
            <RoleRoute allowed={["seller"]}>
              <ProductDashboard />
            </RoleRoute>
          </PrivateRoute>
        }
      />

      {/* ADMIN */}
      <Route
        path="/dashboard/admin"
        element={
          <PrivateRoute>
            <RoleRoute allowed={["admin"]}>
              <Dashboard />
            </RoleRoute>
          </PrivateRoute>
        }
      />

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
