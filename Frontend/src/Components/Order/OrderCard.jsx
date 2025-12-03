// src/components/orders/OrderCard.jsx
import React from "react";
import toast from "react-hot-toast";
import {
  ShoppingCart,
  Store,
  MapPin,
  Package,
  ArrowRightCircle,
  Leaf,
} from "lucide-react";

export default function OrderCard({ product, onBuy, onRent }) {
  const seller = product.sellerInfo || product.seller;

  const isOutOfStock = product.stock <= 0;

  const handleBuyClick = () => {
    if (isOutOfStock) {
      toast.error("This product is out of stock");
      return;
    }
    onBuy();
  };

  const handleRentClick = () => {
    if (!product.rentalAvailable) {
      toast.error("This item is not available for rent");
      return;
    }
    onRent && onRent();
  };

  return (
    <div className="bg-white rounded-xl shadow border hover:shadow-xl hover:-translate-y-1 transition-all p-4">

      {/* Product Image */}
      <div className="w-full h-44 rounded-lg overflow-hidden">
        <img
          src={product.productImages?.[0] || "/placeholder.png"}
          className="w-full h-full object-cover"
          alt={product.title}
        />
      </div>

      {/* Title */}
      <h3 className="font-semibold mt-3 text-gray-900 text-lg line-clamp-1">
        {product.title}
      </h3>

      {/* Category */}
      <p className="text-gray-500 text-sm flex items-center gap-1">
        <Leaf size={14} className="text-emerald-600" />
        {product.category}
      </p>

      {/* Seller Details */}
      <div className="mt-3 text-sm text-gray-700 flex items-center gap-2">
        <Store size={16} className="text-emerald-600" />
        <span className="font-medium">{seller?.name || "Unknown Seller"}</span>
      </div>

      {/* Location */}
      <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
        <MapPin size={12} /> {product.location || "Not provided"}
      </div>

      {/* Stock */}
      <div className="text-xs text-gray-600 flex items-center gap-1 mt-1">
        <Package size={12} /> Stock:{" "}
        <span className="text-emerald-700 font-semibold">{product.stock}</span>
      </div>

      {/* Price Section */}
      <div className="mt-3">
        <div className="text-xl font-bold text-emerald-700">
          ₹{product.price}
        </div>

        {/* Discount Display */}
        {product.originalPrice && product.originalPrice > product.price && (
          <div className="text-sm text-gray-500 line-through">
            ₹{product.originalPrice}
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="mt-4 space-y-2">

        {/* BUY NOW BUTTON */}
        <button
          onClick={handleBuyClick}
          disabled={isOutOfStock}
          className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-white transition
            ${isOutOfStock ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700"}
          `}
        >
          <ShoppingCart size={18} /> Buy Now
        </button>

        {/* RENT BUTTON IF AVAILABLE */}
        {product.rentalAvailable && (
          <button
            onClick={handleRentClick}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
          >
            <ArrowRightCircle size={18} /> Rent This
          </button>
        )}
      </div>
    </div>
  );
}
