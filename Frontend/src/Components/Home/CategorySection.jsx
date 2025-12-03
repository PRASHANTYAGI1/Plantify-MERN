import React from "react";
import { ArrowRight, Star, Bolt, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

// ⭐ Star Rating Component
const StarRating = ({ rating, count }) => (
  <div className="flex items-center justify-center space-x-1 text-amber-400">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating
            ? "fill-amber-400 stroke-amber-500"
            : "fill-transparent stroke-amber-400"
        }`}
        strokeWidth={2}
      />
    ))}
    <span className="ml-1 text-xs font-semibold text-gray-500">
      ({count})
    </span>
  </div>
);

export default function UltraAestheticProductSection() {
  const navigate = useNavigate();

  const products = [
    {
      title: "Organic NPK Fertilizer (5kg)",
      price: "₹549",
      image:
        "https://i.pinimg.com/1200x/6e/38/7b/6e387b8c9b95077bfe71a3f99bb4602a.jpg",
      category: "Fertilizers",
      rating: 5,
      reviews: 420,
    },
    {
      title: "Self-Watering Smart Pot (Medium)",
      price: "₹699",
      image:
        "https://i.pinimg.com/1200x/ef/49/13/ef49132ec80abc759bc0a78da9c9495a.jpg",
      category: "Plant Pots",
      rating: 4,
      reviews: 182,
    },
    {
      title: "IoT Soil Moisture Sensor Kit",
      price: "₹1,899",
      image:
        "https://i.pinimg.com/1200x/a6/ca/2f/a6ca2f839f4e15ea3e0a736c93da250f.jpg",
      category: "Tools & Tech",
      rating: 5,
      reviews: 388,
    },
  ];

  return (
    <section className="relative py-12 px-6 sm:px-10 md:px-14 bg-white overflow-hidden">

      {/* BACKGROUND BLOBS */}
      <div className="absolute inset-0 -z-10 opacity-70 pointer-events-none">
        <div className="absolute top-10 left-0 w-72 h-72 bg-emerald-200/40 blur-[140px] rounded-full animate-blob-slow"></div>
        <div className="absolute bottom-10 right-0 w-80 h-80 bg-emerald-100/30 blur-[160px] rounded-full animate-blob-medium"></div>
      </div>

      {/* HEADER */}
      <div className="text-center max-w-3xl mx-auto mb-10 relative z-10">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
          Handpicked Essentials
        </p>

        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
          Top-Rated{" "}
          <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
            Farming Products
          </span>
        </h2>

        <p className="text-gray-600 text-base mt-3">
          Trusted, lab-tested, and used by modern growers across India.
        </p>
      </div>

      {/* PRODUCT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto relative z-10">
        {products.map((p, i) => (
          <div
            key={i}
            className="
              group bg-white/90 backdrop-blur-md rounded-2xl p-6 pb-10
              shadow-[0_10px_35px_rgba(16,185,129,0.08)]
              hover:shadow-[0_18px_55px_rgba(16,185,129,0.17)]
              transition-all duration-500 hover:-translate-y-2 text-center
            "
          >
            {/* IMAGE */}
            <div className="w-36 h-36 mx-auto rounded-full overflow-hidden mb-5 shadow-lg">
              <img
                src={p.image}
                alt={p.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>

            {/* CATEGORY */}
            <span className="text-xs font-bold uppercase tracking-wide text-emerald-700 bg-emerald-100/50 px-3 py-1 rounded-full inline-block mb-3">
              {p.category}
            </span>

            {/* TITLE */}
            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">
              {p.title}
            </h3>

            {/* RATING */}
            <StarRating rating={p.rating} count={p.reviews} />

            {/* PRICE */}
            <p className="mt-1 text-lg font-semibold text-gray-800 group-hover:text-emerald-600 transition-colors">
              {p.price}
            </p>

            {/* BUTTONS */}
            <div className="flex items-center justify-center gap-4 mt-6">

              {/* ⚡ GET NOW */}
              <button
                onClick={() => navigate("/orders")}
                className="
                  px-4 py-2 rounded-full bg-emerald-600 text-white text-sm font-medium
                  flex items-center gap-2
                  hover:bg-emerald-700 hover:scale-[1.05] active:scale-95
                  transition-all shadow-md hover:shadow-lg
                "
              >
                <Bolt className="w-4 h-4" />
                Get Now
              </button>

              {/* ℹ INFO BUTTON (replaced cart button) */}
              <button
                onClick={() => navigate("/orders")}
                className="
                  w-12 h-12 rounded-full bg-gray-900 text-white 
                  flex items-center justify-center
                  hover:bg-black hover:scale-[1.08] active:scale-95
                  transition-all shadow-md hover:shadow-lg
                "
                title="More Details"
              >
                <Info className="w-5 h-5" />
              </button>

            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center mt-12 relative z-10">
        <button
          onClick={() => navigate("/orders")}
          className="
            inline-flex items-center gap-3 px-9 py-4 rounded-2xl
            bg-gray-900 text-white font-semibold text-lg
            hover:bg-black transition-all hover:scale-[1.02] active:scale-[0.97]
            shadow-xl shadow-gray-900/30 hover:shadow-emerald-600/40
          "
        >
          View All Products
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* BLOB ANIMATIONS */}
      <style jsx>{`
        @keyframes blob-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(40px, -60px) scale(1.08); }
        }
        @keyframes blob-medium {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-50px, 50px) scale(0.95); }
        }
        .animate-blob-slow { animation: blob-slow 20s infinite alternate ease-in-out; }
        .animate-blob-medium { animation: blob-medium 18s infinite alternate-reverse ease-in-out; }
      `}</style>
    </section>
  );
}
