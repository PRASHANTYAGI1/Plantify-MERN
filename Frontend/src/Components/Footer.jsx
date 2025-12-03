import React from "react";
import { Leaf, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-gray-950 text-gray-300 pt-32 pb-6 font-inter overflow-hidden">

      {/* Top Signup Banner */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30">
        <a
          href="/signup"
          className="
            bg-gradient-to-r from-emerald-500 to-emerald-700
            text-white px-8 py-2.5 font-bold text-sm sm:text-base
            rounded-xl shadow-lg shadow-emerald-500/40 border border-emerald-300/60
            transform -rotate-2 hover:rotate-0 hover:scale-110
            transition-all duration-300 block
          "
        >
          🚀 JOIN PLANTIFY — FREE SIGNUP
        </a>
      </div>

      {/* Glow Background */}
      <div
        className="absolute inset-0 opacity-25 -z-10"
        style={{
          background:
            "radial-gradient(circle at center, rgba(16,185,129,0.20) 0%, transparent 70%)",
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-6 sm:px-10">

        {/* GRID LAYOUT */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">

          {/* BRANDING */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Leaf className="w-7 h-7 text-emerald-500 mr-2" />
              <h3 className="text-2xl font-bold text-white">Plantify</h3>
            </div>

            <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
              Smart, AI-driven agriculture solutions for crop health detection,
              predictive insights, and marketplace growth.
            </p>

            <div className="space-y-2 text-sm mt-4">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400" />
                <span>contact@plantify.io</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>+91 90000-00000</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>India (HQ)</span>
              </div>
            </div>
          </div>

          {/* EXPLORE LINKS */}
          <div>
            <h4 className="text-lg font-bold text-white mb-3 pb-1 border-b border-gray-800">
              Explore
            </h4>

            <ul className="space-y-2 text-sm">
              <li><a href="/products" className="hover:text-emerald-400 transition">Marketplace</a></li>
              <li><a href="/about" className="hover:text-emerald-400 transition">Community</a></li>
              <li><a href="/ml-tools" className="hover:text-emerald-400 transition">AI Tools</a></li>
              <li><a href="/about" className="hover:text-emerald-400 transition">About Us</a></li>
            </ul>
          </div>

          {/* SUPPORT LINKS */}
          <div>
            <h4 className="text-lg font-bold text-white mb-3 pb-1 border-b border-gray-800">
              Support
            </h4>

            <ul className="space-y-2 text-sm">
              <li><a href="/subscription" className="hover:text-emerald-400 transition">Help Center</a></li>
              <li><a href="/about" className="hover:text-emerald-400 transition">Privacy Policy</a></li>
              <li><a href="/about" className="hover:text-emerald-400 transition">Terms & Conditions</a></li>
              <li><a href="/home" className="hover:text-emerald-400 transition">Back To Home</a></li>
            </ul>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="border-t border-gray-800 mt-12 pt-4"></div>

        {/* CREDITS */}
        <p className="text-center text-xs text-gray-500 leading-relaxed">
          © 2025 Plantify Technologies. All rights reserved.
          <br />
          <span className="text-emerald-400 font-semibold">
            Crafted with ❤️ by Prashant & Team
          </span>
        </p>

      </div>
    </footer>
  );
}
