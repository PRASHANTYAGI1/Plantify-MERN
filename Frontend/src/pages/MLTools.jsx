import React, { useCallback, useEffect, useMemo, useState } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import toast, { Toaster } from "react-hot-toast";
import { predictCrop, predictPotato } from "../api/mlApi";

import Icon from "../Components/MLtools/Icon";
import Spinner from "../Components/MLtools/Spinner";
import HeroSection from "../Components/MLtools/HeroSection";
import TeacherSection from "../Components/MLtools/TeacherSection";
import ScanBanner from "../Components/MLtools/ScanBanner";
import ToolSwitcher from "../Components/MLtools/ToolSwitcher";
import CropInputCard from "../Components/MLtools/CropInputCard";
import DiseaseInputCard from "../Components/MLtools/DiseaseInputCard";
import OutputCard from "../Components/MLtools/OutputCard";
import QuoteCard from "../Components/MLtools/QuoteCard";
import StatsFooter from "../Components/MLtools/StatsFooter";

/**
 * MLTools.jsx — Primary page.
 * - Single <style> block below contains crystal/glass theme and animations used across components.
 * - Keep structure identical to your original; visual improvements and animations applied via CSS classes.
 */

/* =========================
   Custom styles (global to this file)
   ========================= */
const InlineStyles = () => (
  <style>
    {`
    /* crystal / glass base */
    .crystal-card {
      background: linear-gradient(180deg, rgba(255,255,255,0.7), rgba(250,250,250,0.6));
      backdrop-filter: blur(10px) saturate(120%);
      -webkit-backdrop-filter: blur(10px) saturate(120%);
      border-radius: 16px;
      transition: transform 280ms ease, box-shadow 280ms ease;
    }
    .crystal-border {
      border: 1px solid rgba(255,255,255,0.6);
      box-shadow:
        0 6px 18px rgba(23,23,23,0.06),
        0 1px 0 rgba(255,255,255,0.55) inset;
    }
    .crystal-info {
      background: linear-gradient(180deg, rgba(255,255,255,0.6), rgba(250,250,250,0.55));
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255,255,255,0.5);
    }
    .crystal-alert {
      background: linear-gradient(180deg, rgba(255,250,240,0.9), rgba(255,250,240,0.85));
      border: 1px solid rgba(255,235,205,0.8);
    }

    /* chips & buttons */
    .chip {
      padding: 6px 10px;
      border-radius: 999px;
      background: linear-gradient(90deg,#0f9d58,#34d399);
      color: white;
      font-size: 12px;
      border: none;
      box-shadow: 0 6px 18px rgba(16,185,129,0.12);
    }
    .chip-amber {
      padding: 6px 10px;
      border-radius: 999px;
      background: linear-gradient(90deg,#f59e0b,#fbbf24);
      color: white;
      font-size: 12px;
      box-shadow: 0 6px 18px rgba(244,180,0,0.08);
    }
    .chip-blue {
      padding: 6px 10px;
      border-radius: 999px;
      background: linear-gradient(90deg,#3b82f6,#60a5fa);
      color: white;
      font-size: 12px;
      box-shadow: 0 6px 18px rgba(59,130,246,0.08);
    }

    /* special tab styles */
    .active-tab-green {
      background: linear-gradient(90deg,#ecfdf5,#ffffff);
      color: #059669;
      box-shadow: 0 8px 30px rgba(16,185,129,0.08);
      border-radius: 999px;
    }
    .active-tab-blue {
      background: linear-gradient(90deg,#eff6ff,#ffffff);
      color: #2563eb;
      box-shadow: 0 8px 30px rgba(59,130,246,0.08);
      border-radius: 999px;
    }

    /* floating animation */
    @keyframes floatingY {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-6px); }
      100% { transform: translateY(0px); }
    }
    .float {
      animation: floatingY 6s ease-in-out infinite;
    }

    /* subtle multi-color crystal shadow used on cards */
    .crystal-card:hover {
      transform: translateY(-6px);
      box-shadow:
        0 18px 40px rgba(16,185,129,0.06),
        0 10px 30px rgba(37,99,235,0.03),
        0 2px 8px rgba(0,0,0,0.06);
    }
    .crystal-hover { transform: translateY(-4px); }

    /* small soft shadow variant */
    .small-shadow {
      box-shadow: 0 6px 18px rgba(16,185,129,0.04);
    }

    /* upgrade button */
    .btn-upgrade {
      padding: .6rem 1rem;
      border-radius: 999px;
      background: linear-gradient(90deg,#ffb347,#ffcc33);
      color: #7a2b00;
      font-weight: 700;
      box-shadow: 0 8px 30px rgba(255, 183, 71, 0.12);
    }

    /* alert */
    .crystal-alert:hover { transform: translateY(-4px); }

    /* responsive helpers: reduce animation on small screens */
    @media (max-width: 640px) {
      .float { animation: none; transform: none; }
      .crystal-card:hover { transform: none; }
    }
      
        
    `}
  </style>
);

export default function MLTools() {
  const [activeTool, setActiveTool] = useState("crop");

  // Inputs & model state
  const [cropInput, setCropInput] = useState({
    N: "", P: "", K: "", temperature: "", humidity: "", ph: "", rainfall: "",
  });
  const [cropResult, setCropResult] = useState(null);
  const [loadingCrop, setLoadingCrop] = useState(false);

  const [potatoImage, setPotatoImage] = useState(null);
  const [potatoPreview, setPotatoPreview] = useState(null);
  const [potatoResult, setPotatoResult] = useState(null);
  const [loadingPotato, setLoadingPotato] = useState(false);

  // Stats and counters
  const stats = useMemo(() => [
    { id: "farms", label: "Farms", value: 322, icon: "🌾" },
    { id: "agents", label: "Agents", value: 291, icon: "👨‍🌾" },
    { id: "companies", label: "Companies", value: 41, icon: "🏢" },
    { id: "suppliers", label: "Suppliers", value: 139, icon: "🚜" },
  ], []);
  const [counters, setCounters] = useState({
    farms: 0, agents: 0, companies: 0, suppliers: 0,
  });

  // Quote rotation
  const quotes = useMemo(() => [
    "The soil is the great connector of lives — it sustains us all.",
    "Small seeds, great harvests — patience grows everything.",
    "A farmer's work is the first step toward every meal.",
    "Tend the land, and it will tend you back.",
    "Plant with care, harvest with gratitude.",
    "Good soil is an investment that pays forever.",
    "Nature whispers advice — a gardener listens.",
    "Cultivate the earth and cultivate hope.",
    "From careful hands come bountiful fields.",
    "Sow kindness, reap abundance."
  ], []);
  const [quote, setQuote] = useState(() => quotes[Math.floor(Math.random() * quotes.length)]);

  // Limit & subscription (backend-aware)
  const DAILY_LIMIT = 5; // matches backend
  const [isPro, setIsPro] = useState(false);
  const [usage, setUsage] = useState(0); // mlDailyUsage from backend
  const [loadingUser, setLoadingUser] = useState(true);

  // LocalStorage fallback (keeps user's quick UI feedback) — not authoritative
  const STORAGE_KEY = "mltools_scan_state_v1";
  const [scanState, setScanState] = useState({
    date: new Date().toISOString().slice(0, 10), scans: 0,
  });

  // Low confidence threshold
  const LOW_CONF_THRESHOLD = 0.25;

  const topN = (probs = {}, n = 5) =>
    Object.entries(probs || {}).map(([k, v]) => ({ label: k, prob: Number(v) })).sort((a,b)=>b.prob-a.prob).slice(0,n);

  const topConfidence = (probs = {}) => {
    const entries = Object.values(probs || {});
    if (!entries.length) return 0;
    return Math.max(...entries.map((x)=>Number(x)));
  };

  // load user & usage from backend
  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        const data = await res.json();
        if (!mounted) return;
        setIsPro(data.subscriptionPlan === "pro" && data.subscriptionActive === true);
        setUsage(Number(data.mlDailyUsage ?? 0));
      } catch (e) {
        // silent fail — keep UI usable
        console.error("load user failed", e);
      } finally {
        if (mounted) setLoadingUser(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  // load/reset local scan state
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const today = new Date().toISOString().slice(0,10);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.date !== today) {
          const reset = { date: today, scans: 0 };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(reset));
          setScanState(reset);
        } else {
          setScanState(parsed);
        }
      } else {
        const init = { date: today, scans: 0 };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(init));
        setScanState(init);
      }
    } catch (err) {
      console.error("scan state load error", err);
    }
  }, []);

  // animate counters
  useEffect(() => {
    stats.forEach((s) => {
      const start = 0;
      const end = s.value;
      const duration = 900;
      const startTime = performance.now();
      const tick = (now) => {
        const elapsed = now - startTime;
        const t = Math.min(1, elapsed / duration);
        const eased = Math.round(start + (end - start) * (1 - Math.cos(Math.PI * t)) / 2);
        setCounters((prev) => ({ ...prev, [s.id]: eased }));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, [stats]);

  // cleanup preview URL
  useEffect(() => {
    return () => {
      if (potatoPreview) {
        try { URL.revokeObjectURL(potatoPreview); } catch {}
      }
    };
  }, [potatoPreview]);

  const saveScanState = useCallback((newState) => {
    setScanState(newState);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(newState)); } catch (e) { console.error(e); }
  }, []);

  const handleCropChange = useCallback((e) => {
    const { name, value } = e.target;
    setCropInput((p) => ({ ...p, [name]: value }));
  }, []);

  const validateCropInputs = useCallback(() => {
    return Object.entries(cropInput).filter(([k,v]) => v === "" || v === null || Number.isNaN(Number(v))).map(([k])=>k);
  }, [cropInput]);

  const checkScanAllowed = useCallback(() => {
    if (isPro) return true;
    // backend usage is authoritative; local scans reflect optimistic updates
    return (usage < DAILY_LIMIT);
  }, [isPro, usage]);

  const incrementUsageLocal = useCallback(() => {
    setUsage((u) => Math.min(DAILY_LIMIT, u + 1));
    // local storage increment for UI quick feedback
    const newState = { ...scanState, scans: (scanState.scans ?? 0) + 1 };
    saveScanState(newState);
  }, [scanState, saveScanState]);

  // copy to clipboard helper
  const copyToClipboard = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied example to clipboard");
    } catch {
      toast.error("Copy failed — allow clipboard permissions or copy manually");
    }
  }, []);

  // CROP predict
  const handleCropPredict = useCallback(async () => {
    const missing = validateCropInputs();
    if (missing.length) {
      toast.error(`Please fill: ${missing.join(", ")}`);
      return;
    }
    if (!checkScanAllowed()) {
      toast.error("Daily scan limit reached. Upgrade to Pro for more scans.");
      return;
    }

    setLoadingCrop(true);
    setCropResult(null);
    toast.loading("Running crop prediction...", { id: "crop-run" });

    try {
      const values = [
        Number(cropInput.N), Number(cropInput.P), Number(cropInput.K),
        Number(cropInput.temperature), Number(cropInput.humidity),
        Number(cropInput.ph), Number(cropInput.rainfall)
      ];
      const res = await predictCrop(values); // backend middleware enforces quota
      setCropResult(res);
      toast.success("Crop prediction completed", { id: "crop-run" });

      // optimistic UI update (backend already increments usage server-side)
      incrementUsageLocal();
    } catch (err) {
      toast.dismiss("crop-run");
      if (err?.response?.status === 403) {
        setUsage(DAILY_LIMIT);
        toast.error("Daily limit reached. Upgrade to Pro to continue.");
      } else {
        toast.error("Crop prediction failed. Try again.");
        console.error(err);
      }
    } finally {
      setLoadingCrop(false);
    }
  }, [cropInput, validateCropInputs, checkScanAllowed, incrementUsageLocal]);

  // POTATO handlers
  const handlePotatoImage = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (potatoPreview) { try { URL.revokeObjectURL(potatoPreview); } catch {} }
    setPotatoImage(file);
    setPotatoPreview(URL.createObjectURL(file));
    setPotatoResult(null);
  }, [potatoPreview]);

  const incrementScanCount = useCallback(() => {
    const newState = { ...scanState, scans: (scanState.scans ?? 0) + 1 };
    saveScanState(newState);
  }, [scanState, saveScanState]);

  const handlePotatoPredict = useCallback(async () => {
    if (!potatoImage) {
      toast.error("Please upload a potato leaf image");
      return;
    }
    if (!checkScanAllowed()) {
      toast.error("Daily scan limit reached. Upgrade to Pro for more scans.");
      return;
    }

    setLoadingPotato(true);
    setPotatoResult(null);
    toast.loading("Running disease detection...", { id: "disease-run" });

    try {
      const res = await predictPotato(potatoImage);
      setPotatoResult(res);
      toast.success("Disease detection completed", { id: "disease-run" });

      // optimistic UI update
      incrementUsageLocal();
    } catch (err) {
      toast.dismiss("disease-run");
      if (err?.response?.status === 403) {
        setUsage(DAILY_LIMIT);
        toast.error("Daily limit reached. Upgrade to Pro to continue.");
      } else {
        toast.error("Disease detection failed. Try again.");
        console.error(err);
      }
    } finally {
      setLoadingPotato(false);
    }
  }, [potatoImage, checkScanAllowed, incrementUsageLocal]);

  const clearPotato = useCallback(() => {
    setPotatoImage(null);
    if (potatoPreview) { try { URL.revokeObjectURL(potatoPreview); } catch {} }
    setPotatoPreview(null);
    setPotatoResult(null);
  }, [potatoPreview]);

  // Derived UI
  const scansLeft = isPro ? Infinity : Math.max(0, DAILY_LIMIT - usage);

  // Main JSX (keeps original structure, only refactored into components)
  return (
    <div className="page-fade m-0 p-0 bg-[#F5F3ED] overflow-x-hidden">
      <InlineStyles />
      <Toaster position="top-right" />
      <Navbar className="sticky top-0" />

      <HeroSection />

      <div className="h-6 md:h-10" />

      <TeacherSection copyToClipboard={copyToClipboard} />

      <main className="max-w-6xl mx-auto px-4 md:px-6 -mt-8">
        <ScanBanner isPro={isPro} usage={usage} dailyLimit={DAILY_LIMIT} onUpgradeClick={() => toast.info("Upgrade flow not wired in demo")} />

        <div className="text-center mb-6">
          {isPro ? (
            <div className="text-green-700 font-bold">Unlimited Scans (Pro)</div>
          ) : (
            <div className="text-amber-700 font-bold">{scansLeft === Infinity ? "∞" : `${scansLeft} / ${DAILY_LIMIT}`} scans remaining</div>
          )}
        </div>

        <ToolSwitcher active={activeTool} setActive={setActiveTool} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: inputs */}
          <div>
            {activeTool === "crop" ? (
              <CropInputCard cropInput={cropInput} onChange={handleCropChange} onSubmit={handleCropPredict} loading={loadingCrop} />
            ) : (
              <DiseaseInputCard
                potatoImage={potatoImage}
                potatoPreview={potatoPreview}
                onFileChange={handlePotatoImage}
                onPredict={handlePotatoPredict}
                loading={loadingPotato}
                onClear={clearPotato}
                potatoResult={potatoResult}
                topConfidence={topConfidence}
                LOW_CONF_THRESHOLD={LOW_CONF_THRESHOLD}
              />
            )}
          </div>

          {/* Right: output */}
          <div>
            <OutputCard
              forTool={activeTool === "crop" ? "crop" : "disease"}
              cropResult={cropResult}
              potatoResult={potatoResult}
              topN={topN}
              topConfidence={topConfidence}
            />
          </div>
        </div>

        {/* Low-confidence global notice */}
        {activeTool === "disease" && potatoResult && topConfidence(potatoResult.probabilities) < LOW_CONF_THRESHOLD && (
          <div className="mt-8 p-6 rounded-xl crystal-alert border-2 text-red-900 flex items-start gap-4" role="alert">
            <div className="text-3xl">🚨</div>
            <div>
              <div className="font-bold text-lg">CRITICAL: IMAGE UNCLEAR / MODEL UNCERTAIN</div>
              <div className="text-base mt-1">Try taking a <strong>much clearer photo</strong> (full daylight, sharp close-up of leaf, clean background) and run the scan again, or <strong>consult an expert immediately</strong>.</div>
            </div>
          </div>
        )}

        <div className="mt-8 p-6 rounded-2xl crystal-card border shadow-lg">
          <h4 className="font-bold text-xl text-gray-900 mb-4 flex items-center gap-2">
            <Icon name="Globe" className="w-5 h-5 text-blue-700" /> Teacher Resources & How-to Links
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-l-4 border-green-500 pl-4">
              <h5 className="font-bold text-gray-800">Where to get NPK / Soil Tests</h5>
              <p className="text-sm text-gray-700 mt-1">Local agricultural labs or commercial DIY soil kits provide NPK & pH.</p>
              <a href="https://www.wikihow.com/Test-Soil-pH" target="_blank" rel="noreferrer" className="text-blue-700 block mt-2 font-medium hover:underline">How to test soil pH (WikiHow) →</a>
              <a href="https://www.agriculture.gov.au/forestry/soil" target="_blank" rel="noreferrer" className="text-blue-700 block mt-1 font-medium hover:underline">Soil nutrient guides →</a>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <h5 className="font-bold text-gray-800">How to get Rainfall in mm & Weather</h5>
              <p className="text-sm text-gray-700 mt-1">Use reliable weather services or regional met services for accurate rainfall amounts in mm.</p>
              <a href="https://www.accuweather.com" target="_blank" rel="noreferrer" className="text-blue-700 block mt-2 font-medium hover:underline">AccuWeather →</a>
              <a href="https://www.weather.gov" target="_blank" rel="noreferrer" className="text-blue-700 block mt-1 font-medium hover:underline">National weather services →</a>
            </div>
          </div>

          <div className="mt-6 p-3 rounded-lg bg-gray-100 border border-gray-200 text-sm text-gray-700">
            <strong className="text-gray-900">Scale examples:</strong> NPK: <em className="text-green-700">40 / 20 / 30</em>, pH: <em className="text-amber-700">6.5</em>, Rainfall (7-day): <em className="text-blue-700">25 mm</em>, Temp: <em className="text-red-700">25°C</em>, Humidity: <em className="text-indigo-700">60%</em>.
          </div>
        </div>
      </main>

      <QuoteCard quote={quote} />

      <StatsFooter stats={stats} counters={counters} />

      <Footer />
    </div>
  );
}
