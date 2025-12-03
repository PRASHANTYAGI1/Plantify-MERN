import React from "react";
import { Users, ArrowRight } from "lucide-react";

const bgAnimation = `
  @keyframes floatGlow {
    0%, 100% { transform: translateY(0); opacity: 0.15; }
    50% { transform: translateY(-10px); opacity: 0.25; }
  }
  .glow {
    position: absolute;
    border-radius: 9999px;
    filter: blur(30px);
    animation: floatGlow 6s ease-in-out infinite;
    pointer-events: none;
  }
`;
const handleClick = () => {
  window.location.href = "/about";
}

export default function CommunityCTA() {
  return (
    <section className="py-10 sm:py-14 bg-white relative overflow-hidden font-inter">
      <style>{bgAnimation}</style>

      {/* Small stylish glowing background */}
      <div className="absolute inset-0">
        <div
          className="glow bg-emerald-300 w-40 h-40"
          style={{ top: "20%", left: "10%", animationDelay: "0s" }}
        ></div>
        <div
          className="glow bg-emerald-400 w-32 h-32"
          style={{ bottom: "15%", right: "12%", animationDelay: "1.2s" }}
        ></div>
        <div
          className="glow bg-emerald-500 w-24 h-24"
          style={{ top: "50%", right: "40%", animationDelay: "0.6s" }}
        ></div>
      </div>

      <div className="relative max-w-3xl mx-auto px-6">
        <div
          className="
            bg-white/80 backdrop-blur-md border border-gray-200
            rounded-2xl p-8 shadow-lg text-center 
            transition hover:shadow-emerald-300/40 hover:scale-[1.01]
          "
        >
          {/* Icon */}
          <div className="flex items-center justify-center mb-3">
            <Users className="w-10 h-10 text-emerald-600 p-2 bg-emerald-50 rounded-xl shadow-sm" />
          </div>

          {/* Title */}
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-snug">
            Join India’s Smart Farming Community
          </h2>

          {/* Subtext */}
          <p className="text-gray-600 mt-2 mb-6 text-base sm:text-lg">
            Access AI tools, expert guidance, and real-time data to grow smarter.
          </p>

          {/* CTA */}
          <button
            className="
              inline-flex items-center gap-2 
              bg-emerald-600 text-white px-6 py-2.5 
              rounded-xl text-lg font-semibold shadow-md
              hover:bg-emerald-700 transition
            "
            onClick={handleClick}
          >
             see more about us
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
