import React, { useState } from "react";
import Navbar from "../components/Navbar";

import TopStats from "../components/products/TopStats";
import ProductsTable from "../components/products/ProductsTable";
import MyProductsTable from "../components/products/MyProductsTable";
import SellerOrdersTable from "../components/products/SellerOrdersTable";
import AddProductModal from "../components/products/AddProductModal";
import EditProductModal from "../components/products/EditProductModal";
import Footer from "../components/Footer";

import {
  LayoutGrid,
  List,
  ShoppingBag,
  PlusCircle,
} from "lucide-react";

export default function ProductDashboard() {
  const [view, setView] = useState("all");

  const [isAddOpen, setAddOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleEditOpen = (product) => {
    setSelectedProduct(product);
    setEditOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col overflow-x-hidden page-fade">
      {/* Navbar */}
      <Navbar />

      {/* Wrapper */}
      <div className="flex-1 pt-20 px-4 sm:px-6 max-w-7xl mx-auto w-full space-y-6">

        {/* 🌿 Modern Page Title */}
        <h1 className="text-2xl font-bold text-gray-900">
          Product Console
        </h1>

        {/* 🌿 Modern Top Controls */}
        <div className="flex flex-wrap gap-3 items-center justify-between bg-white p-4 rounded-xl shadow-sm border">

          {/* Left Nav Buttons */}
          <div className="flex flex-wrap gap-3">

            {/* All Products */}
            <button
              onClick={() => setView("all")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition text-sm font-medium 
              ${view === "all"
                ? "bg-emerald-600 text-white shadow-md"
                : "bg-gray-100 hover:bg-gray-200 text-gray-800"
              }`}
            >
              <LayoutGrid size={16} /> All Products
            </button>

            {/* My Products */}
            <button
              onClick={() => setView("my")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition text-sm font-medium 
              ${view === "my"
                ? "bg-emerald-600 text-white shadow-md"
                : "bg-gray-100 hover:bg-gray-200 text-gray-800"
              }`}
            >
              <List size={16} /> My Products
            </button>

            {/* Seller Orders */}
            <button
              onClick={() => setView("orders")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition text-sm font-medium 
              ${view === "orders"
                ? "bg-emerald-600 text-white shadow-md"
                : "bg-gray-100 hover:bg-gray-200 text-gray-800"
              }`}
            >
              <ShoppingBag size={16} /> Seller Orders
            </button>
          </div>

          {/* Right Side – Add Product */}
          <button
            onClick={() => setAddOpen(true)}
            className="flex items-center gap-2 px-5 py-2 bg-emerald-600 text-white rounded-lg shadow hover:bg-emerald-700 transition font-medium"
          >
            <PlusCircle size={18} /> Add Product
          </button>
        </div>

        {/* Stats */}
        <TopStats />

        {/* Render Correct Table */}
        <div className="bg-white rounded-xl shadow-sm border p-4 overflow-x-auto">

          {view === "all" && (
            <ProductsTable onEdit={handleEditOpen} />
          )}

          {view === "my" && (
            <MyProductsTable onEdit={handleEditOpen} />
          )}

          {view === "orders" && (
            <SellerOrdersTable />
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="flex-shrink-0 mt-10">
        <Footer />
      </footer>

      {/* Modals */}
      <AddProductModal open={isAddOpen} onClose={() => setAddOpen(false)} />

      <EditProductModal
        open={isEditOpen}
        product={selectedProduct}
        onClose={() => setEditOpen(false)}
        onUpdated={() => window.location.reload()}
      />
    </div>
  );
}
