// src/pages/SubscriptionPage.jsx
import React, { useContext, useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import { upgradeSubscription } from "../api/subscriptionApi";

import {
  Check,
  Zap,
  Sprout,
  Star,
  ShieldCheck,
  Sparkles,
  BadgeCheck,
} from "lucide-react";

export default function SubscriptionPage() {
  const { user, setUser } = useContext(AuthContext);
  const [loadingPlan, setLoadingPlan] = useState(null);

  // Extract active subscription
  const activePlan = user?.subscriptionActive ? user.subscriptionPlan : null;
  const expiryDate = user?.subscriptionExpiresAt
    ? new Date(user.subscriptionExpiresAt).toDateString()
    : null;

  const plans = [
    {
      id: "monthly",
      title: "Pro Grower",
      price: 199,
      displayPrice: "₹199 / Month",
      description: "Unlock premium AI tools and marketplace boosts.",
      features: [
        "High Accuracy Disease Detection",
        "10 Product Listings / Month",
        "Priority Weather Alerts",
        "Premium ML Tools",
        "Faster Marketplace Approvals",
      ],
      icon: Zap,
      glow: "from-emerald-400 to-emerald-600",
      badge: "MOST POPULAR",
    },
    {
      id: "yearly",
      title: "Pro Grower — Annual",
      price: 1999,
      displayPrice: "₹1999 / Year",
      description: "2 months free + exclusive insights.",
      features: [
        "Everything in Monthly",
        "Exclusive Annual Insights",
        "Early Feature Access",
        "Premium Support",
      ],
      icon: Sprout,
      glow: "from-slate-400 to-slate-700",
      badge: "BEST VALUE",
    },
  ];

  const handleSubscribe = async (plan) => {
    if (!user) return toast.error("Please log in first.");

    // Block action if user already subscribed
    if (user.subscriptionActive) {
      return toast.error("You already have an active subscription.");
    }

    setLoadingPlan(plan.id);
    try {
      const res = await upgradeSubscription(plan.id, plan.price);

      toast.success("Subscription activated!", { icon: "🌱" });

      // Update user context
      setUser({
        ...user,
        subscriptionActive: true,
        subscriptionPlan: "pro",
        subscriptionExpiresAt: res.expiresOn,
      });

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          subscriptionActive: true,
          subscriptionPlan: "pro",
          subscriptionExpiresAt: res.expiresOn,
        })
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Subscription failed");
    }
    setLoadingPlan(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden page-fade">
      <Navbar />

      {/* Background Glow Effects */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-96 h-96 bg-emerald-200/20 blur-[110px] rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-[550px] h-[550px] bg-slate-300/20 blur-[160px] rounded-full"></div>
      </div>

      {/* Hero Section */}
      <section className="pt-28 pb-16 px-6 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-5 py-2 bg-white shadow-inner rounded-full text-emerald-700 text-sm mb-3">
          <Star size={16} />
          Plantify Premium
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
          Your Growth,
          <span className="bg-gradient-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent">
            Supercharged
          </span>
        </h1>

        <p className="text-gray-600 text-lg mt-4">
          Choose a subscription plan that gives you cutting-edge plant health,
          AI insights, and full marketplace power.
        </p>

        {/* Show Active Subscription */}
        {activePlan && (
          <div className="mt-8 bg-white px-6 py-4 rounded-2xl shadow-lg inline-flex flex-col items-center gap-2">
            <BadgeCheck className="text-emerald-600" size={26} />
            <p className="text-lg font-bold text-gray-900">
              You are Pro Member 🌿
            </p>
            <p className="text-gray-600 text-sm">
              Your subscription is active until:
            </p>
            <p className="text-emerald-700 font-semibold">{expiryDate}</p>
          </div>
        )}
      </section>

      {/* Plans Section */}
      <section className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto px-6 pb-28">
        {plans.map((p) => {
          const Icon = p.icon;

          const isDisabled = user?.subscriptionActive;

          return (
            <div
              key={p.id}
              className="
                relative p-8 rounded-3xl bg-white shadow-inner
                border border-gray-200 backdrop-blur-xl
                hover:shadow-[0_20px_50px_rgba(16,185,129,0.2)]
                transition-all duration-500 hover:-translate-y-1
              "
            >
              {/* Badge */}
              <span className="absolute -top-3 left-6 bg-emerald-200 text-emerald-900 text-[11px] px-3 py-1 rounded-md font-bold uppercase shadow-md tracking-wide">
                {p.badge}
              </span>

              <div className="relative">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-emerald-100">
                    <Icon className="w-7 h-7 text-emerald-700" />
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {p.title}
                    </h3>
                    <p className="text-gray-500 text-sm">{p.description}</p>
                  </div>

                  <div className="ml-auto text-3xl font-bold text-gray-900">
                    {p.displayPrice}
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-6">
                  {p.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-emerald-600" />
                      <span className="text-gray-700">{f}</span>
                    </li>
                  ))}
                </ul>

                {/* Button */}
                <button
                  onClick={() => handleSubscribe(p)}
                  disabled={isDisabled || loadingPlan === p.id}
                  className={`
                    w-full py-3 rounded-xl font-semibold text-white
                    bg-gradient-to-r ${p.glow}
                    shadow-md transition-all duration-300
                    ${
                      isDisabled
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:scale-[1.02] active:scale-95"
                    }
                  `}
                >
                  {isDisabled
                    ? "Already Subscribed"
                    : loadingPlan === p.id
                    ? "Processing..."
                    : "Activate Plan"}
                </button>
              </div>
            </div>
          );
        })}
      </section>
      {/* --- EXTRA INFO SECTION: Policies + FAQs + Trust Indicators --- */}
      <section className="mt-10 mb-24 px-6 max-w-5xl mx-auto">
        {/* TITLE */}
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-10">
          Before You Subscribe,
          <span className="bg-gradient-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent">
            Know Your Benefits
          </span>
        </h2>

        {/* POLICY CARDS */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Refund Policy */}
          <div className="p-6 rounded-2xl bg-white/70 backdrop-blur-xl border border-gray-200 shadow-md hover:shadow-lg transition">
            <ShieldCheck className="w-10 h-10 text-emerald-600 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Refund Policy
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              If you face any technical issues preventing you from using premium
              features, you may request a refund within <strong>7 days</strong>{" "}
              of purchase.
            </p>
          </div>

          {/* Auto Renewal */}
          <div className="p-6 rounded-2xl bg-white/70 backdrop-blur-xl border border-gray-200 shadow-md hover:shadow-lg transition">
            <Sparkles className="w-10 h-10 text-emerald-600 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Auto Renewal
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Monthly subscriptions renew automatically. You can cancel anytime
              to stop future renewals — no hidden charges.
            </p>
          </div>

          {/* Cancellation */}
          <div className="p-6 rounded-2xl bg-white/70 backdrop-blur-xl border border-gray-200 shadow-md hover:shadow-lg transition">
            <BadgeCheck className="w-10 h-10 text-emerald-600 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Cancellation
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              You can cancel your plan anytime—the premium features will remain
              active until the current billing period ends.
            </p>
          </div>
        </div>

        {/* ---------------------------------------------------------------------- */}
        {/* TRUST BADGES */}
        <div className="mt-16 flex flex-col items-center text-center">
          <p className="text-gray-600 text-sm font-medium">
            We use industry-grade secure payments
          </p>

          <div className="flex gap-6 mt-3">
            <div className="px-4 py-2 bg-white/70 backdrop-blur-xl shadow rounded-xl border border-gray-200 text-sm font-semibold text-gray-800">
              RBI-Compliant Payments
            </div>
            <div className="px-4 py-2 bg-white/70 backdrop-blur-xl shadow rounded-xl border border-gray-200 text-sm font-semibold text-gray-800">
              256-bit SSL Encryption
            </div>
            <div className="px-4 py-2 bg-white/70 backdrop-blur-xl shadow rounded-xl border border-gray-200 text-sm font-semibold text-gray-800">
              Secure Auto-Billing
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------------------- */}
        {/* FAQ SECTION */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-6">
            Frequently Asked Questions
          </h3>

          <div className="space-y-6 max-w-3xl mx-auto">
            {/* Q1 */}
            <div className="p-5 rounded-xl bg-white/80 backdrop-blur-xl border border-gray-200 shadow-sm">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Will my data remain private?
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Absolutely. We never share your crop data, scan results, or
                marketplace information with third parties. Everything is
                protected under our privacy policy.
              </p>
            </div>

            {/* Q2 */}
            <div className="p-5 rounded-xl bg-white/80 backdrop-blur-xl border border-gray-200 shadow-sm">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Can I switch plans later?
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Yes! You can upgrade to an annual plan or switch back to monthly
                billing anytime.
              </p>
            </div>

            {/* Q3 */}
            <div className="p-5 rounded-xl bg-white/80 backdrop-blur-xl border border-gray-200 shadow-sm">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                What happens if I cancel?
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                You will continue to enjoy premium benefits until your
                subscription expiry date. After that, your account returns to
                the free plan.
              </p>
            </div>

            {/* Q4 */}
            <div className="p-5 rounded-xl bg-white/80 backdrop-blur-xl border border-gray-200 shadow-sm">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Is support included?
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Yes — premium users get priority support for ML tools,
                marketplace issues, and plant disease troubleshooting.
              </p>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------------------- */}
        {/* CONTACT SUPPORT */}
        {/* <div className="text-center mt-14">
          <p className="text-gray-700 text-sm font-medium">
            Need help choosing a plan?
          </p>
          <a
            href="/support"
            className="inline-block mt-2 text-emerald-600 hover:text-emerald-700 font-semibold underline"
          >
            Contact Support
          </a>
        </div> */}
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
