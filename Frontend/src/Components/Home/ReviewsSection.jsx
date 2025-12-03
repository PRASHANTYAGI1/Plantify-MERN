import React, { useState, useRef, useEffect, useCallback } from "react";
import { Quote, Star, X, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";

const reviews = [
  {
    name: "Rajesh K.",
    role: "Farmer",
    location: "Punjab, India",
    text: "Amazing platform! Helped me diagnose my crops instantly and saved my yield this season. The real-time data is invaluable for predicting issues.",
    rating: 5,
  },
  {
    name: "Deepika P.",
    role: "Tool Rental Owner",
    location: "Mumbai, India",
    text: "I rented tools at a low price and delivery was super fast. The platform makes business seamless and connects me directly to growers who need my equipment.",
    rating: 5,
  },
  {
    name: "Amit S.",
    role: "Gardening Hobbyist",
    location: "Bangalore, India",
    text: "The community access is fantastic. Learned so much about exotic plants from experts. It's a supportive environment for all skill levels.",
    rating: 5,
  },
  {
    name: "Suresh R.",
    role: "Agricultural Consultant",
    location: "Hyderabad, India",
    text: "Weather insights are a game changer. Essential for modern farming efficiency and planning complex irrigation schedules.",
    rating: 5,
  },
  {
    name: "Priya M.",
    role: "Small Farm Owner",
    location: "Chennai, India",
    text: "The crop classification tool’s accuracy is phenomenal. Saved me hours of manual inspection and reduced pesticide usage significantly.",
    rating: 5,
  },
  {
    name: "Vikram J.",
    role: "Agri-Tech Enthusiast",
    location: "Pune, India",
    text: "The AI models integrate seamlessly with IoT devices and provide hyper-local insights. This is the future of smart agriculture.",
    rating: 5,
  }
];

const getInitials = (name) =>
  name.split(" ").map((n) => n[0]).join("").slice(0, 2);

const ReviewModal = ({ review, onClose }) => {
  if (!review) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-[100]"
      onClick={onClose}
    >
      <div
        className="bg-white p-8 rounded-3xl shadow-2xl max-w-lg w-full relative animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition"
        >
          <X className="w-6 h-6 text-gray-700" />
        </button>

        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-emerald-600 rounded-full text-white flex items-center justify-center text-xl font-bold shadow-lg">
            {getInitials(review.name)}
          </div>

          <div>
            <h3 className="text-2xl font-bold flex items-center gap-2 text-gray-900">
              {review.name}
              <CheckCircle className="text-emerald-500 w-5 h-5" />
            </h3>
            <p className="text-emerald-600 font-medium">{review.role}</p>
            <p className="text-gray-500 italic text-sm">{review.location}</p>

            <div className="flex mt-2">
              {[...Array(review.rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
          </div>
        </div>

        <Quote className="w-10 h-10 text-emerald-500 opacity-20 mt-6" />
        <p className="text-gray-700 text-lg leading-relaxed italic mt-4 pl-4 border-l-4 border-emerald-500">
          {review.text}
        </p>
      </div>
    </div>
  );
};

export default function TestimonialsScroller() {
  const trackRef = useRef(null);
  const [selectedReview, setSelectedReview] = useState(null);
  const [isPaused, setIsPaused] = useState(false);

  const loopReviews = [...reviews, ...reviews];
  const speed = 0.4;

  /** AUTO SCROLL */
  const animateScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track || isPaused) return;

    track.scrollLeft += speed;

    if (track.scrollLeft >= track.scrollWidth / 2) {
      track.scrollLeft = 0;
    }

    requestAnimationFrame(animateScroll);
  }, [isPaused]);

  useEffect(() => {
    const frame = requestAnimationFrame(animateScroll);
    return () => cancelAnimationFrame(frame);
  }, [animateScroll]);

  /** PAUSE ON MANUAL SCROLL */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let timeout;

    const onScroll = () => {
      setIsPaused(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setIsPaused(false), 2000);
    };

    track.addEventListener("scroll", onScroll);
    return () => track.removeEventListener("scroll", onScroll);
  }, []);

  /** ARROW BUTTONS */
  const scrollLeftManual = () => {
    setIsPaused(true);
    trackRef.current.scrollBy({ left: -300, behavior: "smooth" });
    setTimeout(() => setIsPaused(false), 2000);
  };

  const scrollRightManual = () => {
    setIsPaused(true);
    trackRef.current.scrollBy({ left: 300, behavior: "smooth" });
    setTimeout(() => setIsPaused(false), 2000);
  };

  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden">

      {/* Background Blobs */}
      <div className="absolute inset-0 opacity-25 pointer-events-none">
        <div className="absolute top-10 left-0 w-72 h-72 bg-emerald-300 blur-[120px]" />
        <div className="absolute bottom-10 right-0 w-72 h-72 bg-green-300 blur-[120px]" />
      </div>

      {/* Heading */}
      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center mb-14">
        <h2 className="text-5xl font-extrabold text-gray-900">
          What Growers{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-500">
            Say
          </span>
        </h2>
        <p className="text-lg text-gray-600 mt-3">
          Real voices from our trusted community.
        </p>
      </div>

      {/* Arrows */}
      <button
        onClick={scrollLeftManual}
        className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 bg-white shadow-md p-3 rounded-full hover:scale-110 transition z-30"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={scrollRightManual}
        className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 bg-white shadow-md p-3 rounded-full hover:scale-110 transition z-30"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Marquee Section */}
      <div className="relative mt-10">
        {/* Fade edges */}
        <div className="absolute top-0 bottom-0 left-0 w-20 bg-gradient-to-r from-gray-50 to-transparent z-20 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-20 bg-gradient-to-l from-gray-50 to-transparent z-20 pointer-events-none" />

        <div
          ref={trackRef}
          className="flex space-x-8 overflow-x-scroll slim-scroll px-2 py-4"
          style={{ scrollBehavior: "smooth" }}
        >
          {loopReviews.map((r, i) => (
            <div
              key={i}
              className="w-[320px] flex-shrink-0 group cursor-pointer"
              onClick={() => setSelectedReview(r)}
            >
              <div className="relative bg-white p-6 rounded-3xl shadow-lg border border-gray-100 transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-emerald-300/70">

                {/* Overlay */}
                <div className="absolute inset-0 bg-emerald-500/80 rounded-3xl opacity-0 group-hover:opacity-100 transition flex items-center justify-center z-10">
                  <p className="text-white text-lg font-semibold">See Full Story →</p>
                </div>

                <Quote className="w-10 h-10 text-emerald-500 opacity-20 mb-4" />
                <p className="text-gray-700 italic line-clamp-4 mb-6">
                  "{r.text}"
                </p>

                {/* Footer */}
                <div className="flex items-center gap-3 border-t pt-4">
                  <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white font-semibold shadow">
                    {getInitials(r.name)}
                  </div>
                  <div>
                    <h4 className="font-bold flex items-center gap-1 text-gray-900">
                      {r.name}
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                    </h4>
                    <p className="text-emerald-600 text-sm">{r.role}</p>
                    <p className="text-gray-500 text-xs">{r.location}</p>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedReview && (
        <ReviewModal review={selectedReview} onClose={() => setSelectedReview(null)} />
      )}

      {/* Slim Scrollbar CSS */}
      <style>{`
        .slim-scroll::-webkit-scrollbar {
          height: 4px;
        }
        .slim-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .slim-scroll::-webkit-scrollbar-thumb {
          background: #34d399;
          border-radius: 50px;
        }
        .slim-scroll::-webkit-scrollbar-thumb:hover {
          background: #059669;
        }

        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slideUp {
          animation: slideUp 0.35s ease-out;
        }
      `}</style>
    </section>
  );
}
