import React from "react";
import Icon from "./Icon";

/**
 * OutputCard handles both crop and disease outputs.
 * Props:
 * - forTool: "crop" | "disease"
 * - cropResult, potatoResult, topN, topConfidence
 */
export default function OutputCard({ forTool = "crop", cropResult, potatoResult, topN, topConfidence }) {
  // CROP
  if (forTool === "crop") {
    if (!cropResult) {
      return (
        <div className="p-6 rounded-2xl crystal-card border crystal-border min-h-[220px] flex items-center justify-center">
          <div className="text-gray-600 text-center">
            <Icon name="BarChart" className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            No prediction yet — run Crop Recommendation to see top crops.
          </div>
        </div>
      );
    }

    const top5 = topN(cropResult.probabilities, 5);
    const topProb = topConfidence(cropResult.probabilities);

    return (
      <div className="p-6 rounded-2xl crystal-card border crystal-border shadow-xl" role="region" aria-live="polite">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
          <h4 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Icon name="ListOrdered" className="w-5 h-5 text-green-600" /> Top 5 Crop Matches
          </h4>
          <div className="text-base text-gray-600">
            <span className="font-bold text-green-700">{cropResult.predictedCrop}</span>
          </div>
        </div>

        <div className="space-y-4">
          {top5.map((c) => (
            <div key={c.label} className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-100 border border-green-200 shrink-0">
                <span className="text-2xl">🌾</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <div className="font-semibold text-lg text-gray-800 capitalize">{c.label}</div>
                  <div className="text-base font-bold text-green-700">{(c.prob * 100).toFixed(1)}%</div>
                </div>

                <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-2.5 rounded-full" style={{ width: `${(c.prob * 100).toFixed(2)}%`, background: "linear-gradient(90deg, #10b981, #059669)" }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {topProb < 0.4 && (
          <div className="mt-6 p-3 rounded-xl bg-yellow-50 border border-yellow-300 text-yellow-800 flex items-start gap-3 shadow-sm">
            <span className="text-xl">⚠️</span>
            <div>
              <div className="text-sm font-bold">Expert Advice Recommended</div>
              <div className="text-xs text-gray-700">Top probability is low — consult an agronomist if unsure.</div>
            </div>
          </div>
        )}

        <div className="mt-4 p-3 rounded-xl bg-blue-50 border border-blue-300 flex items-start gap-3 shadow-sm">
          <span className="text-xl">💡</span>
          <div>
            <div className="text-sm font-bold text-blue-900">Note on Accuracy</div>
            <div className="text-xs text-blue-800">Model suggestions are recommendations — consider <strong>local conditions & expert guidance</strong>.</div>
          </div>
        </div>
      </div>
    );
  }

  // DISEASE
  if (!potatoResult) {
    return (
      <div className="p-6 rounded-2xl crystal-card border crystal-border min-h-[220px] flex items-center justify-center">
        <div className="text-gray-600 text-center">
          <Icon name="Scan" className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          No detection yet — upload a leaf image and run detection.
        </div>
      </div>
    );
  }

  const top3 = topN(potatoResult.probabilities, 3);
  const topProb = topConfidence(potatoResult.probabilities);

  return (
    <div className="p-6 rounded-2xl crystal-card border crystal-border shadow-xl" role="region" aria-live="polite">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
        <h4 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Icon name="Leaf" className="w-5 h-5 text-blue-600" /> Top 3 Disease Classes
        </h4>
        <div className="text-base text-gray-600">
          <span className="font-bold text-blue-700">{potatoResult.predictedClass}</span>
        </div>
      </div>

      <div className="space-y-4">
        {top3.map((c) => (
          <div key={c.label} className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100 border border-blue-200 shrink-0">
              <span className="text-2xl">🍃</span>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <div className="font-semibold text-lg text-gray-800 capitalize">{c.label}</div>
                <div className="text-base font-bold text-blue-700">{(c.prob * 100).toFixed(1)}%</div>
              </div>

              <div className="mt-2 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-2.5 rounded-full" style={{ width: `${(c.prob * 100).toFixed(2)}%`, background: "linear-gradient(90deg, #3b82f6, #2563eb)" }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {topProb < 0.5 && (
        <div className="mt-6 p-3 rounded-xl bg-yellow-50 border border-yellow-300 text-yellow-800 flex items-start gap-3 shadow-sm">
          <span className="text-xl">⚠️</span>
          <div>
            <div className="text-sm font-bold">Expert Confirmation Required</div>
            <div className="text-xs text-gray-700">Confidence is low — consult an expert before initiating costly treatment.</div>
          </div>
        </div>
      )}

      <div className="mt-4 p-3 rounded-xl bg-blue-50 border border-blue-300 flex items-start gap-3 shadow-sm">
        <span className="text-xl">📌</span>
        <div>
          <div className="text-sm font-bold text-blue-900">Visual Inspection is Key</div>
          <div className="text-xs text-blue-800">Model may misclassify rare diseases — prioritize visual inspection and expert confirmation.</div>
        </div>
      </div>
    </div>
  );
}
