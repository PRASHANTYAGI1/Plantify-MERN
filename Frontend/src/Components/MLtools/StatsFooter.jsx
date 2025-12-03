import React from "react";

export default function StatsFooter({ stats, counters }) {
  return (
    <>
      <style>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.45);
          backdrop-filter: blur(14px) saturate(160%);
          -webkit-backdrop-filter: blur(14px) saturate(160%);
          border-radius: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.55);
          box-shadow:
            0 4px 12px rgba(0,0,0,0.06),
            0 1px 3px rgba(0,0,0,0.04);
          transition: all 0.3s ease;
        }

        .glass-card:hover {
          transform: translateY(-6px);
          box-shadow:
            0 8px 20px rgba(0,0,0,0.08),
            0 4px 8px rgba(0,0,0,0.06);
        }

        .stat-number {
          animation: subtlePulse 3s ease-in-out infinite;
        }

        @keyframes subtlePulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.95; transform: scale(1.03); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>

      <section className="py-16 bg-gradient-to-br from-white to-green-50">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          
          {stats.map((s) => (
            <div
              key={s.id}
              className="p-6 glass-card cursor-pointer select-none"
            >
              <div className="flex flex-col items-center text-center">
                
                {/* Icon */}
                <div className="text-4xl md:text-5xl mb-3 opacity-90">
                  {s.icon}
                </div>

                {/* Counter */}
                <div className="text-3xl md:text-4xl font-bold text-gray-900 stat-number">
                  {counters[s.id]}
                </div>

                {/* Label */}
                <div className="text-sm text-gray-600 mt-2 font-medium tracking-wide capitalize">
                  {s.label}
                </div>

              </div>
            </div>
          ))}

        </div>
      </section>
    </>
  );
}
