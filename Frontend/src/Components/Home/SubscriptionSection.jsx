import React from "react";
import { Check, Zap, Sprout, Star } from "lucide-react";
import { toast } from "react-hot-toast";

export default function PlantifySubscriptionSection() {
  const plans = [
    {
      id: "pro",
      title: "Pro Grower",
      price: "₹199/Mo",
      short: "Maximize yields with advanced AI tools.",
      details: [
        "High Accuracy Disease Detection",
        "10 Product Listings / Month",
        "Priority Weather Alerts",
        "unlimited image Scans",
      ],
      icon: Zap,
      glow: "from-emerald-400 to-emerald-600",
      tagText: "MOST PICKED",
      iconBg: "bg-emerald-100",
      iconText: "text-emerald-700",
      checkText: "text-emerald-600",
      badgeBg: "bg-emerald-200",
    },
    {
      id: "essential",
      title: "Essential Care",
      price: "₹1999/Yr",
      short: "Core plant health tools for everyday growers.",
      details: [
        "unlimited AI Scans / Month",
        "Basic Weather Updates",
        "Full Marketplace Access",
        "Best for budget growers",
      ],
      icon: Sprout,
      glow: "from-slate-400 to-slate-600",
      tagText: "BEST VALUE",
      iconBg: "bg-slate-100",
      iconText: "text-slate-700",
      checkText: "text-slate-600",
      badgeBg: "bg-slate-200",
    },
  ];

  return (
    <section className="relative py-14 px-4 sm:px-6 md:px-10 bg-gradient-to-br from-gray-50 to-white overflow-hidden font-inter">

      {/* Soft Background Blobs */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-12 left-10 w-52 sm:w-64 h-52 sm:h-64 bg-emerald-200/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-12 right-10 w-60 sm:w-72 h-60 sm:h-72 bg-slate-300/10 blur-[140px] rounded-full"></div>
      </div>

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 px-2">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-full shadow-sm mb-3">
          <Star className="w-4 h-4" />
          Premium Plans
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
          Choose Your{" "}
          <span className="bg-gradient-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent">
            Growth Plan
          </span>
        </h2>

        <p className="text-gray-600 mt-4 text-sm sm:text-base">
          Unlock powerful tools to manage and monitor your crops efficiently.
        </p>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {plans.map((p) => {
          const Icon = p.icon;
          return (
            <div
              key={p.id}
              className="
                relative group p-7 rounded-3xl bg-white/90 backdrop-blur-xl
                border border-gray-200/60 shadow-[0_10px_35px_rgba(0,0,0,0.05)]
                hover:shadow-[0_20px_55px_rgba(16,185,129,0.20)]
                transition-all duration-500 hover:-translate-y-1 hover:bg-white
              "
            >

              {/* Badge */}
              <div
                className={`
                  absolute -top-3 left-6 px-4 py-1.5 text-[11px]
                  font-bold uppercase rounded-md shadow-md z-20
                  ${p.badgeBg} 
                  text-black tracking-wide transform -rotate-2
                `}
              >
                {p.tagText}
              </div>

              {/* Glow */}
              <div
                className={`
                  absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100
                  transition-all duration-500 blur-xl pointer-events-none
                  bg-gradient-to-br ${p.glow}
                `}
              ></div>

              {/* Content */}
              <div className="relative z-10">

                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${p.iconBg}`}>
                      <Icon className={`w-6 h-6 ${p.iconText}`} />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                        {p.title}
                      </h3>
                      <p className="text-gray-500 text-sm mt-1">{p.short}</p>
                    </div>
                  </div>

                  <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                    {p.price}
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-7">
                  {p.details.map((d, i) => (
                    <li key={i} className="flex items-start gap-3 p-2 rounded-lg">
                      <Check className={`w-5 h-5 ${p.checkText}`} />
                      <span className="text-gray-700 font-medium">{d}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA (Fixed) */}
                <button
                  onClick={() => {
                    toast.success("Redirecting to Subscription Page");
                    window.location.href = "/subscription";
                  }}
                  className={`
                    w-full py-3 rounded-xl font-semibold text-white text-sm
                    bg-gradient-to-r ${p.glow}
                    shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-95
                    transition-all duration-300
                  `}
                >
                  Select Plan
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-center text-gray-500 text-sm mt-10">All plans come with a 14-day free trial.</p>
    </section>
  );
}
