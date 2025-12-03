import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import Navbar from "../Components/Navbar";
import HeroSection from "../Components/Home/HeroSection";

import ServicesSection from "../Components/Home/ServicesSection";
import CategorySection from "../Components/Home/CategorySection";
import ProductsSection from "../Components/Home/ProductsSection";
import SubscriptionSection from "../Components/Home/SubscriptionSection";
import SellersSection from "../Components/Home/SellersSection";
import ReviewsSection from "../Components/Home/ReviewsSection";
import CommunityCTA from "../Components/Home/CommunityCTA";
import Footer from "../Components/Footer";

import AlertMessage from "../Components/AlertMessage";

export default function Home() {
  const { user } = useContext(AuthContext);

  return (
    <div className="overflow-x-hidden bg-[#F5F3ED] page-fade">
      <Navbar user={user} />

      {/* ---------------- AUTO ALERTS ---------------- */}
      <div className="max-w-5xl mx-auto mt-4 px-4 space-y-3">

        {user && !user.profileCompleted && (
          <AlertMessage
            type="warning"
            message="Your profile is incomplete. Please update your details for the best experience."
          />
        )}

        {user && !user.mobileVerified && (
          <AlertMessage
            type="danger"
            message="Your mobile number is not verified. Please verify it to secure your account."
          />
        )}

        {user && user.subscriptionPlan === "free" && user.canSell && (
          <AlertMessage
            type="info"
            message="You are using the Free Seller Plan. Upgrade to unlock higher product limits."
          />
        )}

        {user && user.accountStatus === "pending" && (
          <AlertMessage
            type="info"
            message="Your account is under review. Some features may be limited."
          />
        )}

      </div>
      {/* ---------------- END ALERTS ---------------- */}

      <HeroSection />
      <ServicesSection />
      <CategorySection />
      {/* <ProductsSection /> */}
      <SellersSection />
      <ReviewsSection />
      <SubscriptionSection />
      <CommunityCTA />

      <Footer />
    </div>
  );
}
