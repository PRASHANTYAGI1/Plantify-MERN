import React, { useState } from "react";
import { Scan, Sparkles, ShoppingBag, ArrowRight } from "lucide-react";

export default function UltraModernHeroSection() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    setMousePos({ x, y });
  };
  const handleclick=()=>{
    window.location.href="/ML-tools";
  }
  const handleclick2=()=>{
    window.location.href="/orders";
  }

  return (
    <section
      onMouseMove={handleMouseMove}
      className="relative w-full min-h-[calc(100vh-80px)] bg-white pt-24 pb-20 overflow-hidden transition-all"
    >
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#e5e7eb_1px,transparent_1px)] bg-[size:34px_34px] opacity-40"></div>

      {/* Soft Blobs */}
      <div className="absolute top-1/4 left-[15%] w-56 h-56 bg-green-100/60 rounded-full blur-[100px] animate-blob"></div>
      <div className="absolute bottom-1/4 right-[10%] w-60 h-60 bg-blue-100/60 rounded-full blur-[120px] animate-blob-delay"></div>

      <div className="max-w-[1400px] relative z-10 mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center relative">
          {/* LEFT CONTENT */}
          <div
            className="order-1 relative z-20 text-center lg:text-left space-y-8 pb-10 transition-transform duration-300"
            style={{
              transform: `translate3d(${mousePos.x / 5}px, ${
                mousePos.y / 7
              }px, 0)`,
            }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-100 rounded-full mx-auto lg:mx-0">
              <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></div>
              <span className="text-sm font-medium text-green-700">
                AI for Agriculture
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight text-gray-900">
              Detect. Predict.
              <br />
              <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 bg-clip-text text-transparent">
                Grow Smarter.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 max-w-xl mx-auto lg:mx-0">
             Detect diseases early with AI-ML tools, choose crops backed by real data, and find the right farming products — all in one place
            </p>

            {/* CTA BUTTONS */}
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <button
                className="
                px-8 py-4 bg-green-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2
                transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03] active:scale-95
                shadow-md hover:shadow-green-400/50
              "
              onClick={handleclick}
              >
                Scan Your Plant <ArrowRight className="w-5 h-5" />
              </button>

              <button
                className="
                px-8 py-4 bg-white rounded-xl border border-gray-300 font-semibold
                hover:border-green-600 hover:text-green-600
                hover:-translate-y-1 hover:scale-[1.03] transition-all active:scale-95
              "
              onClick={handleclick2}
              >
                Marketplace
              </button>
            </div>

            {/* Stats */}
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-10 pt-4">
              {[
                ["97.6%", "Disease Accuracy"],
                ["25K+", "Daily Predictions"],
                ["50+", "Crops Supported"],
              ].map(([num, label]) => (
                <div
                  key={num}
                  className="text-center transition-transform hover:scale-110"
                >
                  <div className="text-4xl font-extrabold text-gray-900">
                    {num}
                  </div>
                  <p className="text-sm text-gray-500">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT IMAGE + FLOATING CARDS */}
          <div className="order-2 relative flex items-center justify-center mt-[-40px] sm:mt-[-60px] lg:mt-0 z-10">
            {/* Hero Image */}
            <div
              className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg transition-transform duration-300"
              style={{
                transform: `translate3d(${mousePos.x / 10}px, ${
                  mousePos.y / 10
                }px, 0)`,
              }}
            >
              {/* Floating animation */}
              <div className="relative animate-imgFloat hover:scale-[1.03] transition-all duration-500">
                {/* DROP SHADOW UNDER IMAGE */}
                <div
                  className="absolute bottom-[-25px] left-1/2 -translate-x-1/2 w-[70%] h-10 
        rounded-full bg-black/25 blur-2xl opacity-50"
                ></div>

                <img
                  src="hero1.png"
                  alt="Smart farming"
                  className="w-100 h-auto rounded-2xl drop-shadow-2xl"
                />
              </div>
            </div>

            {/* FLOATING CARDS – Left & Right */}
            <div className="hidden lg:block pointer-events-none">
              {[
                // RIGHT SIDE
                {
                  pos: "top-[25%] left-[50%]",
                  color: "#10b981",
                  bg: "bg-green-500",
                  icon: <Scan className="w-5 h-5" />,
                  title: "Leaf Spot",
                  subtitle: "88% confidence",
                },
                {
                  pos: "top-40 left-[4%] -translate-y-1/2",
                  color: "#3b82f6",
                  bg: "bg-blue-500",
                  icon: <Sparkles className="w-5 h-5" />,
                  title: "Rice Crop",
                  subtitle: "Ideal for your soil",
                },
                {
                  pos: "bottom-[15%] left-[50%]",
                  color: "#f59e0b",
                  bg: "bg-amber-500",
                  icon: <ShoppingBag className="w-5 h-5" />,
                  title: "Organic Fertilizer",
                  subtitle: "Boosts growth",
                },

                // LEFT SIDE
                {
                  pos: "top-[55%] left-[18%] -translate-y-1/2",
                  color: "#ef4444",
                  bg: "bg-red-500",
                  icon: <Scan className="w-5 h-5" />,
                  title: "Early Detection",
                  subtitle: "High accuracy",
                },
              ].map((card, index) => (
                <div
                  key={index}
                  className={`absolute ${card.pos} w-56 animate-cardFloat transition-all duration-500`}
                  style={{ pointerEvents: "auto" }}
                >
                  <div
                    className="
          relative p-4 rounded-2xl backdrop-blur-xl
          bg-white/30 border border-white/40
          hover:-translate-y-3 hover:scale-[1.08]
          transition-all duration-500
        "
                    style={{
                      boxShadow: `
            0 12px 35px ${card.color}55,
            0 0 35px ${card.color}35,
            inset 0 0 25px ${card.color}20
          `,
                    }}
                  >
                    {/* Glass Shine Layer */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/60 to-transparent opacity-30 pointer-events-none"></div>

                    <div className="relative flex items-start gap-3">
                      <div
                        className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center text-white shadow-xl`}
                      >
                        {card.icon}
                      </div>

                      <div className="flex flex-col">
                        {/* Smart readable label */}
                        <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                          AI Insight
                        </p>

                        {/* Smart dark title for white BG */}
                        <p className="text-[15px] font-bold text-slate-900">
                          {card.title}
                        </p>

                        {/* Color subtitle */}
                        <p
                          className="text-xs font-medium"
                          style={{ color: card.color }}
                        >
                          {card.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0) scale(1);
          }
          50% {
            transform: translate(10px, -10px) scale(1.05);
          }
        }
        @keyframes blobDelay {
          0%,
          100% {
            transform: translate(0) scale(1);
          }
          50% {
            transform: translate(-10px, 10px) scale(1.05);
          }
        }
        @keyframes cardFloat {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }
        .animate-cardFloat {
          animation: cardFloat 7s ease-in-out infinite;
        }

        @keyframes imgFloat {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-12px);
          }
        }
        .animate-imgFloat {
          animation: imgFloat 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
