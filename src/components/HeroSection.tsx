import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import slideVf7Driving from "@/assets/slide-vf7-driving.png";
import slideVf6Vf7Night from "@/assets/slide-vf6-vf7-night.png";
import slideVf6Lifestyle from "@/assets/slide-vf6-lifestyle.png";
import slideVf7Interior from "@/assets/slide-vf7-interior.png";
import slideVf7RearDetail from "@/assets/slide-vf7-rear-detail.png";
import slideVf7Wheel from "@/assets/slide-vf7-wheel.png";

const slides = [
  {
    image: slideVf7Driving,
    subtitle: "Bihar's First Authorized VinFast Dealer — Book Your Test Drive Today",
    objectPosition: "center 50%",
  },
  {
    image: slideVf6Vf7Night,
    subtitle: "VF 6 & VF 7 — Two Electric SUVs. One Bold Choice.",
    objectPosition: "center 45%",
  },
  {
    image: slideVf6Lifestyle,
    subtitle: "VinFast VF 6 — Smart, Safe & Built for Every Family",
    objectPosition: "center 55%",
  },
  {
    image: slideVf7Interior,
    subtitle: "Premium Interior. 12.9\" Infotainment. Ventilated Seats.",
    objectPosition: "center 40%",
  },
  {
    image: slideVf7RearDetail,
    subtitle: "Bold Design. Distinctive Style. Made to Turn Heads.",
    objectPosition: "center 50%",
  },
  {
    image: slideVf7Wheel,
    subtitle: "VinFast VF 7 — 349 HP · 431 km Range · Level 2+ ADAS",
    objectPosition: "center 60%",
  },
];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);

  const next = useCallback(
    () => setCurrent((c) => (c + 1) % slides.length),
    []
  );
  const prev = useCallback(
    () => setCurrent((c) => (c - 1 + slides.length) % slides.length),
    []
  );

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative h-[85vh] sm:h-[90vh] lg:h-screen min-h-[500px] sm:min-h-[600px] max-h-[1000px] flex items-end pb-6 sm:pb-12 lg:pb-28 pt-16 lg:pt-0 overflow-hidden">
      {/* Slides — CSS opacity crossfade (no Framer GPU layer, preserves image sharpness) */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{
            opacity: i === current ? 1 : 0,
            zIndex: i === current ? 1 : 0,
          }}
        >
          <img
            src={slide.image}
            alt={slide.subtitle}
            className="w-full h-full object-cover"
            style={{ objectPosition: slide.objectPosition }}
            loading="eager"
            decoding="sync"
          />
        </div>
      ))}

      {/* Content */}
      <div className="relative container mx-auto px-4 lg:px-8 z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="max-w-lg lg:max-w-2xl"
          >
            <p className="text-white font-display font-semibold text-sm sm:text-base lg:text-xl max-w-sm sm:max-w-xl mb-4 sm:mb-6 leading-relaxed [text-shadow:0_2px_4px_rgba(0,0,0,0.9),0_4px_24px_rgba(0,0,0,0.75)]">
              {slides[current].subtitle}
            </p>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <Link to="/test-drive">
                <Button variant="hero" size="lg" className="sm:!px-8 sm:!py-5 sm:!text-base">
                  Book Test Drive
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="heroOutline" size="lg" className="sm:!px-8 sm:!py-5 sm:!text-base">
                  Get Best Offer
                </Button>
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Slide controls */}
        <div className="flex items-center gap-3 sm:gap-4 mt-6 sm:mt-10 lg:mt-12">
          <button
            onClick={prev}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-white border border-gray-200 flex items-center justify-center text-gray-900 transition-all duration-300 shadow-md hover:scale-105"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === current ? "w-8 sm:w-10 bg-primary shadow-glow-red" : "w-3 sm:w-4 bg-black/25 hover:bg-black/40"
                }`}
              />
            ))}
          </div>
          <button
            onClick={next}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-white border border-gray-200 flex items-center justify-center text-gray-900 transition-all duration-300 shadow-md hover:scale-105"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Quick link pills */}
        <div className="hidden sm:flex items-center gap-3 mt-6 lg:mt-8 flex-wrap">
          <Link
            to="/models/vf7"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-gray-200 bg-white/95 hover:bg-white text-gray-900 text-xs sm:text-sm font-medium transition-all duration-300 shadow-md"
          >
            Explore VF 7 <ChevronRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/models/vf6"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-gray-200 bg-white/95 hover:bg-white text-gray-900 text-xs sm:text-sm font-medium transition-all duration-300 shadow-md"
          >
            Explore VF 6 <ChevronRight className="w-3.5 h-3.5" />
          </Link>
          <a
            href="https://wa.me/919231445060"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#1fa855] bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs sm:text-sm font-medium transition-all duration-300 shadow-md"
          >
            WhatsApp Now <ChevronRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
