import React from "react";
import { Star, Store, UserCheck, Zap, Award, TrendingUp, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const sellers = [
  {
    name: "Kisan Agro Supplies",
    rating: 4.8,
    desc: "Reliable seeds, fertilizers, and everyday farm essentials trusted nationwide.",
    icon: Store,
    tag: "Top Rated",
  },
  {
    name: "EcoGrow Green Solutions",
    rating: 4.6,
    desc: "Organic soil boosters, compost mixes, and sustainable farming products.",
    icon: UserCheck,
    tag: "Eco Friendly",
  },
  {
    name: "AgriTech Innovation Hub",
    rating: 4.9,
    desc: "Modern irrigation tools, smart sensors, and precision agriculture equipment.",
    icon: Zap,
    tag: "Trending",
  },
];

export default function TopSellersSection() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/products");
  };

  return (
    <section className="relative py-20 px-4 sm:px-10 lg:px-12 bg-gradient-to-br from-white to-gray-50 overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 -z-10 opacity-50">
        <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-200/10 rounded-full blur-[70px]"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-slate-200/10 rounded-full blur-[70px]"></div>
      </div>

      {/* Header */}
      <div className="text-center mb-16 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-50 text-emerald-700 text-sm font-bold rounded-full shadow-md uppercase tracking-widest mb-4">
          <Award className="w-4 h-4" />
          Verified Marketplace Partners
        </div>

        <h2 className="text-4xl md:text-4xl font-extrabold text-gray-900 leading-tight">
          Trusted Sellers &{" "}
          <span className="bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent underline decoration-emerald-900 decoration-2 capitalize">
            Popular Farming Stores
          </span>
        </h2>

        <p className="text-gray-600 text-xl mt-4 max-w-xl mx-auto">
          Shop high-quality farm products from our verified and top-performing sellers.
        </p>
      </div>

      {/* Sellers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
        {sellers.map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={i}
              onClick={handleClick}
              className="
                group relative bg-white rounded-3xl p-8 text-center shadow-2xl shadow-gray-200/80 cursor-pointer
                transition-all duration-500 border border-gray-100
                hover:shadow-emerald-300/60 hover:-translate-y-1.5 transform-gpu flex flex-col items-center
              "
            >

              {/* Tag */}
              <div className="absolute top-5 right-5 z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded-lg shadow-sm">
                  <TrendingUp className="w-3.5 h-3.5" />
                  {s.tag}
                </span>
              </div>

              {/* Icon */}
              <div className="
                w-20 h-20 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-6 border-4 border-white
                transition-all duration-500 group-hover:bg-emerald-100 group-hover:shadow-lg group-hover:shadow-emerald-100/50
              ">
                <Icon className="w-10 h-10 text-emerald-600 transition-transform duration-500 group-hover:scale-105" />
              </div>

              {/* Name */}
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {s.name}
              </h3>

              {/* Rating */}
              <div className="flex justify-center items-center gap-1.5 text-yellow-500 mb-5 px-3 py-1 rounded-full bg-yellow-50/50">
                <Star className="w-4 h-4 fill-yellow-500" />
                <span className="font-bold text-gray-800 text-sm">{s.rating}</span>
                <span className="text-gray-500 text-xs">(2,400+ reviews)</span>
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-8 text-base leading-relaxed flex-grow">
                {s.desc}
              </p>

            </div>
          );
        })}
      </div>

      {/* Footer CTA */}
      <div className="text-center mt-16">
        <button
          onClick={handleClick}
          className="
            inline-flex items-center gap-2 text-lg font-semibold
            text-emerald-600 hover:text-emerald-700 transition-colors duration-300
            border-b-2 border-emerald-300 hover:border-emerald-600 pb-0.5
          "
        >
          Explore All Sellers
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </section>
  );
}
