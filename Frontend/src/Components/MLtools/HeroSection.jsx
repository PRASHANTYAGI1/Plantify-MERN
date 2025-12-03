import React from "react";
import Icon from "./Icon";

export default function HeroSection() {
  return (
    <section
      className="w-full mt-15 min-h-[48vh] md:min-h-[68vh] bg-cover bg-center flex flex-col justify-center items-center text-center px-6"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2070&auto=format&fit=crop')",
      }}
    >
      <div className="w-full max-w-6xl">
        <h1 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-2xl leading-tight">
          Sow the{" "}
          <span className="px-3 py-1 rounded-xl bg-white/20 backdrop-blur-md">Seeds</span> of Sustainability
          <br /> Reap the Bounty of Tradition
        </h1>
        <p className="mt-4 text-center text-white/90 text-base md:text-lg">
          Empower farming with clear, practical guidance and gentle ML tools — crop recommendation & disease scan.
        </p>
      </div>
    </section>
  );
}
