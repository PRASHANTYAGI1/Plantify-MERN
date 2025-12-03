import React from "react";
import { Leaf } from "lucide-react";

export default function Loader() {
  return (
    <div className="w-full h-[60vh] flex flex-col items-center justify-center gap-4 animate-fadeIn">
      {/* Leaf rotating animation */}
      <div className="animate-spin-slow p-4 bg-emerald-100 rounded-full shadow-md">
        <Leaf className="w-10 h-10 text-emerald-600" />
      </div>

      {/* Text */}
      <p className="text-gray-600 font-medium text-lg">Loading dashboard...</p>
    </div>
  );
}
