import React, { useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Leaf, Droplet, Sun, Users, Zap } from "lucide-react";

export default function About() {
  const heroRef = useRef(null);
  const glowRef = useRef(null);

  /* ------------------ PARALLAX EFFECT ------------------ */
  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      const offset = window.scrollY * 0.15;
      heroRef.current.style.transform = `translateY(${offset}px) scale(1.02)`;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ------------------ CURSOR GLOW ------------------ */
  useEffect(() => {
    const glow = glowRef.current;
    const moveGlow = (e) => {
      glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    };
    window.addEventListener("mousemove", moveGlow);
    return () => window.removeEventListener("mousemove", moveGlow);
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-800 overflow-x-hidden antialiased">

      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
      `}</style>

      <Navbar />

      {/* ------------------- PAGE WRAPPER ------------------- */}
      <main className="max-w-7xl mx-auto px-6 py-20">

        {/* PAGE TITLE */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-green-900 mb-5">
          ABOUT US
        </h1>

        {/* SMALL DESCRIPTION */}
        <p className="text-gray-600 text-lg max-w-2xl mb-16">
          A modern farming ecosystem where growers buy, sell, diagnose plant diseases,
          predict crops, and collaborate — all inside one unified platform.
        </p>

        {/* ================= HERO SECTION ================= */}
        <section className="relative mb-36">

          {/* Cursor Glow */}
          <div
            ref={glowRef}
            className="pointer-events-none fixed top-0 left-0 w-44 h-44 rounded-full 
              bg-green-300/20 blur-3xl opacity-80 transition-transform duration-300 z-[5]"
          />

          {/* Hero Image */}
          <img
            ref={heroRef}
            src="/hero3.3.1.png"
            alt="hero"
            className="mx-auto rounded-3xl h-[460px] md:h-[580px] max-w-4xl object-cover
              drop-shadow-[0_25px_80px_rgba(0,0,0,0.10)] "
          />

          {/* ----------------- CIRCLE CARD POSITIONS ----------------- */}

          {/* Top Center */}
          <CircleCard
            icon={<Sun size={18} />}
            title="Crop Prediction"
            text="AI suggests crops using soil & climate data."
            color="text-amber-600"
            shadow="rgba(255,200,150,0.35)"
            position="absolute -top-14 left-1/2 -translate-x-1/2"
          />

          {/* Top Left */}
          <CircleCard
            icon={<Leaf size={18} />}
            title="Platform Purpose"
            text="Buy & sell farm essentials with ease."
            color="text-green-700"
            shadow="rgba(120,200,120,0.35)"
            position="absolute top-20 left-20"
          />

          {/* Top Right */}
          <CircleCard
            icon={<Droplet size={18} />}
            title="Disease Scan"
            text="Instant AI leaf disease detection."
            color="text-sky-600"
            shadow="rgba(140,180,255,0.35)"
            position="absolute top-20 right-20"
          />

          {/* Bottom Left */}
          <CircleCard
            icon={<Zap size={18} />}
            title="Subscription"
            text="Unlock premium AI features."
            color="text-orange-600"
            shadow="rgba(255,150,120,0.35)"
            position="absolute bottom-40 left-25"
          />

          {/* Bottom Right */}
          <CircleCard
            icon={<Leaf size={18} />}
            title="NPK Stats"
            text="Analyze soil nutrients instantly."
            color="text-green-700"
            shadow="rgba(100,255,200,0.35)"
            position="absolute bottom-40 right-25"
          />

          {/* Bottom Center */}
          {/* <CircleCard
            icon={<Users size={18} />}
            title="Community"
            text="Grow together with real farmers."
            color="text-violet-600"
            shadow="rgba(200,150,255,0.35)"
            position="absolute -bottom-14 left-1/2 -translate-x-1/2"
            fontSize="text-xs"
          /> */}
        </section>

        {/* ================= FEATURES ================= */}
        <section className="grid md:grid-cols-3 gap-10 mb-20">
          <FeatureCard
            icon={<Leaf className="text-green-600" />}
            title="Marketplace"
            text="Buy & sell directly with real farmers."
          />

          <FeatureCard
            icon={<Droplet className="text-sky-500" />}
            title="Disease Detection"
            text="AI-powered leaf diagnosis in seconds."
          />

          <FeatureCard
            icon={<Sun className="text-amber-500" />}
            title="Crop Recommendation"
            text="Plan the best crops for your soil."
          />
        </section>
      </main>

      {/* TEAM SECTION */}
      <TeamSection />

      <Footer />
    </div>
  );
}

/* ============================================================
   REUSABLE — CIRCLE FLOATING CARD
============================================================ */
function CircleCard({ icon, title, text, color, shadow, position }) {
  return (
    <div
      className={`${position} bg-white/90 backdrop-blur-xs p-5 rounded-2xl w-56
        border border-white/20 transition-all duration-500 cursor-pointer
        hover:scale-[1.12] hover:-translate-y-2 shadow-xs`}
      style={{
        animation: `float 6s ease-in-out infinite`,
        boxShadow: `0 12px 50px ${shadow}`,
      }}
    >
      <h3 className={`flex items-center gap-2 ${color} font-bold text-sm`}>
        {icon} {title}
      </h3>

      <p className="text-[12px] text-gray-700 mt-1 leading-snug">{text}</p>

    

     
    </div>
  );
}

/* ============================================================
   SIMPLE FEATURE CARD
============================================================ */
function FeatureCard({ icon, title, text }) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition">
      {icon}
      <h4 className="font-semibold text-green-800 mt-3">{title}</h4>
      <p className="text-gray-600 text-sm mt-1">{text}</p>
    </div>
  );
}

/* ============================================================
   TEAM SECTION
============================================================ */
function TeamSection() {
  return (
    <section className="w-full py-24 relative overflow-hidden page-fade">
      <div className="absolute inset-0 bg-gradient-to-r from-green-50 via-white to-green-50" />

      <div className="relative max-w-6xl mx-auto px-6 group">
        <div className="relative rounded-3xl bg-white/30 backdrop-blur-2xl p-12 shadow-xl border border-white/40">

          {/* Default view */}
          <div className="transition-all duration-500 group-hover:opacity-0">
            <h2 className="text-4xl font-extrabold text-green-900">Our Team</h2>
            <p className="text-gray-700 max-w-xl mt-3">
              Engineers • Designers • Innovators transforming agriculture with AI.
            </p>
          </div>

          {/* Hover Reveal */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700
            flex items-center justify-center backdrop-blur-3xl bg-white/40 rounded-3xl p-10">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">

              <TeamMember
                icon={<Zap className="text-green-700" />}
                name="Any"
                role="Design Lead"
              />

              <TeamMember
                icon={<Droplet className="text-sky-500" />}
                name="Prashant"
                role="Developer + ML"
              />

              <TeamMember
                icon={<Users className="text-violet-600" />}
                name="ANY"
                role="Frontend Developer"
              />

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   TEAM MEMBER CARD
============================================================ */
function TeamMember({ icon, name, role }) {
  return (
    <div className="transform hover:scale-105 transition">
      <div className="mx-auto w-14 h-14 rounded-xl bg-white/70 backdrop-blur-xl flex items-center justify-center shadow-md">
        {icon}
      </div>
      <h3 className="font-bold text-green-900 text-xl mt-3">{name}</h3>
      <p className="text-gray-700 text-sm">{role}</p>
    </div>
  );
}
