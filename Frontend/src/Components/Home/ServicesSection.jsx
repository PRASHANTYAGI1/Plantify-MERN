import React from "react";
import { Scan, Sparkles, ShoppingBag } from "lucide-react";

export default function ServicesSection() {
  const services = [
    {
      icon: Scan,
      title: "AI-ML Vision Diagnosis",
      desc: "Detect plant diseases with 99.1% accuracy using advanced computer vision.",
      details: "Leaf Scan • Symptom Match • Detect early signs",
      accent: "emerald",
    },
    {
      icon: Sparkles,
      title: "ML Yield Optimization",
      desc: "ML analyzes 12+ variables to maximize yield and reduce risk.",
      details: "Yield Forecast • ROI Insights • Crop Matching",
      accent: "indigo",
    },
    {
      icon: ShoppingBag,
      title: "Verified Farm Supplies",
      desc: "Access certified suppliers with guaranteed quality.",
      details: "QC Checked • Fast Delivery • Safe Packaging",
      accent: "red",
    },
  ];

  const colors = {
    emerald: "from-emerald-400/60 to-emerald-500/50",
    indigo: "from-indigo-400/60 to-indigo-500/50",
    red: "from-red-400/60 to-red-500/50",
  };

  return (
    <section className="relative py-16 md:py-20 px-4 sm:px-6 md:px-10 lg:px-20 bg-white">

      {/* HEADER */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900">
          Premium Tools for{" "}
          <span className="relative inline-block smart-underline text-emerald-600">
            Smart Farming
          </span>
        </h2>

        <p className="text-gray-600 text-lg mt-4 opacity-0 animate-fadeIn">
          Three powerful technologies designed to boost productivity and reduce effort.
        </p>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {services.map((s, i) => (
          <div
            key={i}
            className="
              relative bg-white/70 backdrop-blur-xl border border-gray-200 
              rounded-3xl p-8 shadow-[0_18px_60px_rgba(0,0,0,0.06)]
              transform transition-all duration-700 ease-out
              hover:-translate-y-4 hover:shadow-[0_45px_120px_rgba(0,0,0,0.12)]
              hover:rotate-[2deg] hover:scale-[1.03]
              group animate-cardFade
            "
            style={{ animationDelay: `${i * 0.2}s`, transformStyle: "preserve-3d" }}
          >
            {/* Glow Border */}
            <div
              className={`
                absolute inset-0 rounded-3xl opacity-0 
                group-hover:opacity-100 transition-all duration-500 
                blur-xl bg-gradient-to-br ${colors[s.accent]}
              `}
            />

            <div className="relative z-10">

              {/* ICON */}
              <div
                className={`
                  w-14 h-14 rounded-2xl flex items-center justify-center
                  bg-gradient-to-br ${colors[s.accent]} text-white shadow-lg
                `}
              >
                <s.icon className="w-7 h-7" />
              </div>

              {/* TITLE */}
              <h3 className="mt-6 text-2xl font-semibold text-gray-900">
                {s.title}
              </h3>

              {/* DESCRIPTION */}
              <p className="mt-3 text-gray-600 text-base leading-relaxed">
                {s.desc}
              </p>

              {/* HOVER DETAILS MINI CARD */}
              <div
                className="
                  absolute left-1/2 -translate-x-1/2 bottom-6 w-[90%]
                  opacity-0 group-hover:opacity-100 
                  translate-y-4 group-hover:translate-y-0
                  transition-all duration-600 ease-out
                  bg-white/80 backdrop-blur-xl border border-gray-200 
                  rounded-xl p-4 shadow-lg
                "
                style={{ transform: "translateZ(45px)" }}
              >
                <p className="text-sm font-semibold text-gray-800">
                  {s.details}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ANIMATIONS */}
      <style jsx>{`
        /* Fade In */
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 1.2s ease forwards; }

        /* Card Fade Entrance */
        @keyframes cardFade {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-cardFade { animation: cardFade 1s ease forwards; }

        /* Auto underline only on Smart Farming */
        .smart-underline::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -6px;
          height: 3px;
          width: 100%;
          background: linear-gradient(90deg,#10b981,#059669,#10b981);
          border-radius: 4px;
          transform: scaleX(0);
          transform-origin: left;
          animation: underlineOnce 1.4s ease forwards;
        }

        @keyframes underlineOnce {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
      `}</style>
    </section>
  );
}
