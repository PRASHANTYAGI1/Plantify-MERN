import React from "react";
import Icon from "./Icon";

export default function TeacherSection({ copyToClipboard }) {
  return (
    <section className="w-full py-8 md:py-12 px-4 md:px-6 -mt-10 z-10 relative">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 md:p-6 rounded-2xl crystal-card border crystal-border hover:crystal-hover transition">
          <h3 className="font-bold text-lg md:text-xl mb-2 text-green-800 flex items-center gap-2">
            <Icon name="FlaskConical" className="w-5 h-5" /> NPK (Soil Nutrients)
          </h3>
          <p className="text-sm text-gray-800 mb-3">Typical ranges (general guide):</p>
          <ul className="text-sm text-gray-700 list-disc pl-5">
            <li>N (Nitrogen): 0–100</li>
            <li>P (Phosphorus): 0–100</li>
            <li>K (Potassium): 0–500</li>
          </ul>

          <div className="mt-3 flex flex-wrap gap-2">
            <button onClick={() => copyToClipboard("N:40,P:20,K:30")} className="chip">N:40 P:20 K:30</button>
            <button onClick={() => copyToClipboard("N:10,P:10,K:5")} className="chip">N:10 P:10 K:5</button>
          </div>

          <a className="mt-3 block text-sm text-blue-700 font-medium hover:text-blue-900 transition" href="https://www.agriculture.gov.au/forestry/soil" target="_blank" rel="noreferrer">
            <span className="underline">More on soil nutrients →</span>
          </a>
        </div>

        <div className="p-5 md:p-6 rounded-2xl crystal-card border crystal-border hover:crystal-hover transition">
          <h3 className="font-bold text-lg md:text-xl mb-2 text-amber-800 flex items-center gap-2">
            <Icon name="Droplet" className="w-5 h-5" /> pH & Rainfall (mm)
          </h3>
          <p className="text-sm text-gray-800 mb-3">
            pH guide: <strong>Acidic</strong> &lt; 6.5 — <strong>Neutral</strong> ~6.5–7.5 — <strong>Alkaline</strong> &gt; 7.5.
          </p>

          <div className="mt-2 flex gap-2">
            <button onClick={() => copyToClipboard("pH:6.5")} className="chip-amber">pH:6.5</button>
            <button onClick={() => copyToClipboard("rainfall:25")} className="chip">rainfall:25 mm</button>
          </div>

          <a className="mt-3 block text-sm text-blue-700 font-medium hover:text-blue-900 transition" href="https://www.metoffice.gov.uk/weather/climate" target="_blank" rel="noreferrer">
            <span className="underline">Weather & rainfall guides →</span>
          </a>
        </div>

        <div className="p-5 md:p-6 rounded-2xl crystal-card border crystal-border hover:crystal-hover transition">
          <h3 className="font-bold text-lg md:text-xl mb-2 text-blue-800 flex items-center gap-2">
            <Icon name="Cloud" className="w-5 h-5" /> Temperature & Humidity
          </h3>
          <p className="text-sm text-gray-800 mb-3">
            Temperature: enter °C. Humidity: enter as % (0–100). Use local weather apps or your on-field sensors.
          </p>

          <div className="mt-2 flex gap-2">
            <button onClick={() => copyToClipboard("temperature:25,humidity:60")} className="chip-blue">25°C / 60%</button>
          </div>

          <a className="mt-3 block text-sm text-blue-700 font-medium hover:text-blue-900 transition" href="https://www.accuweather.com" target="_blank" rel="noreferrer">
            <span className="underline">Open weather dashboard →</span>
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-6 p-4 rounded-xl crystal-info shadow-inner text-sm text-gray-800">
        <h4 className="font-bold text-base text-gray-900 flex items-center gap-2">
          <Icon name="Lightbulb" className="w-4 h-4 text-green-600" /> Teacher Quick Tips
        </h4>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Fill all <strong>NPK & environmental</strong> values for best results — use lab values if available.</li>
          <li>Use <strong>clear daylight images</strong> for disease detection; avoid shadows or cluttered backgrounds.</li>
          <li>Low-confidence predictions will show a <strong>warning</strong> — retake the photo or consult an expert.</li>
          <li>These tools provide <strong>guidance</strong> — always verify with local agronomy advice before major actions.</li>
        </ul>
      </div>
    </section>
  );
}
