import React from "react";
import Icon from "./Icon";

export default function ToolSwitcher({ active, setActive }) {
  return (
    <div className="flex justify-center mb-8">
      <div role="tablist" aria-label="Tool selector" className="rounded-full bg-white/60 p-1 inline-flex shadow-inner">
        <button
          role="tab"
          aria-selected={active === "crop"}
          onClick={() => setActive("crop")}
          className={`px-6 md:px-8 py-2 rounded-full font-bold transition duration-300 text-sm ${active === "crop" ? "active-tab-green" : "text-gray-600 hover:text-green-600"}`}
        >
          <Icon name="Sprout" className="inline-block mr-2 w-4 h-4" /> Crop Recommendation
        </button>

        <button
          role="tab"
          aria-selected={active === "disease"}
          onClick={() => setActive("disease")}
          className={`px-6 md:px-8 py-2 rounded-full font-bold transition duration-300 text-sm ${active === "disease" ? "active-tab-blue" : "text-gray-600 hover:text-blue-600"}`}
        >
          <Icon name="Target" className="inline-block mr-2 w-4 h-4" /> Disease Detection
        </button>
      </div>
    </div>
  );
}
