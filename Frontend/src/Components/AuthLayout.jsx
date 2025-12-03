import React from "react";
import { Card, CardContent } from "@mui/material";
import { useLocation } from "react-router-dom";

const AuthLayout = ({ children }) => {
  const location = useLocation();
  
  // Different images for login and signup pages
  const isLoginPage = location.pathname === "/login";
  const backgroundImage = isLoginPage
    ? "https://images.unsplash.com/photo-1621849400072-f554417f7051?q=80&w=1974&auto=format&fit=crop"
    : "https://images.unsplash.com/photo-1585824151239-8062a14657ba?q=80&w=2154&auto=format&fit=crop";

  return (
    <div className={`min-h-screen w-full flex bg-gray-50 ${isLoginPage ? 'flex-row' : 'flex-row-reverse'} transition-all duration-700`}>
      {/* Image panel with transition */}
      <div
        className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden transition-all duration-700 ease-in-out"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30 transition-opacity duration-700"></div>

        {/* Centered glassmorphic card */}
        <Card
          elevation={0}
          className="relative z-10 w-4/5 max-w-lg rounded-3xl backdrop-blur-lg animate-fadeIn"
          style={{
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
            borderRadius: "24px",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            background: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(12px)",
          }}
        >
          <CardContent className="p-10 text-white text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight">
              Plantify
            </h1>
            <p className="text-base sm:text-lg leading-relaxed mb-6 text-gray-50">
              Helping farmers and gardeners succeed with the right tools, insights, and marketplace support.
            </p>
            <p className="text-sm text-gray-100 font-light">
              Join our community and grow smarter, together.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Form panel with transition */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12 bg-white transition-all duration-500">
        <div 
          key={location.pathname}
          className="w-full max-w-md animate-slideRotate"
        >
          {children}
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn { 
          from { opacity: 0; transform: translateY(20px) scale(0.98)} 
          to { opacity: 1; transform: translateY(0) scale(1)} 
        }
        .animate-fadeIn { 
          animation: fadeIn 0.8s ease-out forwards; 
        }
        
        @keyframes slideRotate {
          0% { 
            opacity: 0; 
            transform: translateX(-30px) rotateY(-15deg);
          }
          100% { 
            opacity: 1; 
            transform: translateX(0) rotateY(0deg);
          }
        }
        .animate-slideRotate {
          animation: slideRotate 0.6s ease-out forwards;
          transform-origin: center;
        }
      `}</style>
    </div>
  );
};

export default AuthLayout;