import React from "react";
import Icon from "./Icon";
import Spinner from "./Spinner";

/**
 * Disease input card.
 * Props:
 * - potatoImage, potatoPreview, onFileChange, onPredict, loading, clear
 */
export default function DiseaseInputCard({ potatoImage, potatoPreview, onFileChange, onPredict, loading, onClear, potatoResult, topConfidence, LOW_CONF_THRESHOLD }) {
  return (
    <div className="p-6 rounded-2xl crystal-card border crystal-border shadow-lg">
      <h4 className="font-bold text-xl mb-4 text-gray-900 flex items-center gap-2">
        <Icon name="Camera" className="w-5 h-5 text-blue-700" /> Capture / Upload Leaf Image
      </h4>

      <div className="flex flex-col gap-4">
        <div className="p-3 rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-400 transition bg-white/60">
          <label htmlFor="file-upload" className="flex items-center justify-between gap-3 cursor-pointer text-blue-700 font-semibold">
            <div className="flex items-center gap-2">
              <Icon name="Upload" className="w-5 h-5" />
              <span>{potatoImage ? "Change Image" : "Click to Upload / Capture"}</span>
            </div>
            <div className="text-xs text-gray-500">JPEG / PNG • recommended 800×800</div>
          </label>
          <input id="file-upload" type="file" accept="image/*" capture="environment" onChange={onFileChange} className="sr-only" aria-label="Upload leaf image" />
        </div>

        {potatoPreview && (
          <div className="relative w-full h-48 rounded-xl overflow-hidden shadow-md border border-gray-200">
            <img src={potatoPreview} alt="Leaf preview" className="w-full h-full object-cover" />
            {potatoResult && topConfidence(potatoResult.probabilities) < LOW_CONF_THRESHOLD && (
              <div className="absolute inset-0 bg-red-600/40 flex items-center justify-center">
                <span className="text-white text-sm font-bold p-2 bg-red-700/80 rounded">LOW CONFIDENCE — RETAKE IMAGE</span>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-3 items-center">
          <button
            onClick={onPredict}
            disabled={loading}
            className={`mt-1 w-full px-6 py-3 rounded-xl text-white font-bold shadow ${loading ? "bg-gray-400" : "bg-gradient-to-r from-blue-600 to-indigo-500 hover:scale-[1.01]"}`}
            aria-disabled={loading}
          >
            {loading ? (<><Spinner /> Detecting...</>) : "Predict Disease"}
          </button>

          <button onClick={onClear} className="hidden sm:inline-block px-4 py-2 rounded-xl border border-gray-300 bg-white text-sm font-medium hover:bg-gray-50">Clear</button>
        </div>
      </div>
    </div>
  );
}
