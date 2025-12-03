import React from "react";
import Icon from "./Icon";

export default function QuoteCard({ quote }) {
  return (
    <section className="mt-12 py-10 px-4 md:px-6">
      <div className="max-w-4xl mx-auto p-6 md:p-8 rounded-2xl crystal-card border crystal-border flex flex-col md:flex-row items-center gap-6">
        <img src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=600&auto=format&fit=crop" alt="farmer" className="w-20 h-20 rounded-full object-cover hidden md:block border-4 border-white shadow-xl" />
        <div>
          <div className="text-base text-amber-700 font-bold flex items-center gap-2">
            <Icon name="Zap" className="w-4 h-4" /> A little motivation
          </div>
          <div className="mt-2 text-xl md:text-2xl font-extrabold text-gray-900 leading-snug">“{quote}”</div>
          <div className="mt-2 text-sm text-gray-700 italic">— Refresh the page to see another quote.</div>
        </div>
      </div>
    </section>
  );
}
