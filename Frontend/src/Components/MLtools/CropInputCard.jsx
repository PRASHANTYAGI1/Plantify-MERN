import React from "react";
import Icon from "./Icon";
import Spinner from "./Spinner";

/**
 * Crop input card (form).
 * Props:
 * - cropInput, onChange, onSubmit, loading
 */
export default function CropInputCard({ cropInput, onChange, onSubmit, loading }) {
  return (
    <div className="p-6 rounded-2xl crystal-card border crystal-border shadow-lg">
      <h4 className="font-bold text-xl mb-4 text-gray-900 flex items-center gap-2">
        <Icon name="Pencil" className="w-5 h-5 text-green-700" /> Enter Soil & Weather Values
      </h4>

      <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="grid grid-cols-1 sm:grid-cols-2 gap-4" aria-label="Crop input form">
        {Object.keys(cropInput).map((k) => (
          <label key={k} className="flex flex-col">
            <span className="text-xs text-gray-700 mb-1 font-medium">{k.toUpperCase()}</span>
            <input
              name={k}
              value={cropInput[k]}
              onChange={onChange}
              type="number"
              step="any"
              placeholder={k.toUpperCase()}
              className="p-3 rounded-xl border border-gray-200 bg-white/60 focus:ring-2 focus:ring-green-300 outline-none transition"
              aria-label={k}
            />
          </label>
        ))}

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className={`mt-2 w-full px-6 py-3 rounded-xl text-white font-bold shadow ${loading ? "bg-gray-400" : "bg-gradient-to-r from-green-600 to-teal-500 hover:scale-[1.01]"}`}
            aria-disabled={loading}
          >
            {loading ? (<><Spinner /> Predicting...</>) : "Predict Crop"}
          </button>
        </div>
      </form>
    </div>
  );
}
