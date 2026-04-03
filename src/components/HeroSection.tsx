import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import heroSlide01 from "@/assets/hero-slideshow/slide-01.png";
import heroSlide02 from "@/assets/hero-slideshow/slide-02.png";
import heroSlide03 from "@/assets/hero-slideshow/slide-03.png";
import heroSlide04 from "@/assets/hero-slideshow/slide-04.png";
import heroSlide05 from "@/assets/hero-slideshow/slide-05.png";
import heroSlide06 from "@/assets/hero-slideshow/slide-06.png";

/** Homepage hero — Patliputra website slideshow (VF 6 / VF 7 campaign art). */
const slides: {
  image: string;
  title: string;
  sub?: string;
  footnote?: string;
  objectPosition: string;
}[] = [
  {
    image: heroSlide01,
    title: "VF 6 & VF 7",
    sub: "Two electric SUVs, signature V lighting — experience them at Patliputra VinFast, Bihar's authorized dealer.",
    objectPosition: "center 42%",
  },
  {
    image: heroSlide02,
    title: "VinFast VF 7",
    sub: "Urban performance and electric sophistication — crafted for highways, city streets, and everything between.",
    objectPosition: "center 48%",
  },
  {
    image: heroSlide03,
    title: "Precision in every detail",
    sub: "Aerodynamic alloys, bold red and black — the unmistakable VF design language.",
    objectPosition: "center 55%",
  },
  {
    image: heroSlide04,
    title: "Signature LED presence",
    sub: "Sleek light bar, floating roof lines, and a rear profile that turns every head.",
    objectPosition: "center 45%",
  },
  {
    image: heroSlide05,
    title: "Premium VF 6 cabin",
    sub: "Large touchscreen, minimalist dash, and a driver-centric cockpit built for comfort and connectivity.",
    objectPosition: "center 50%",
  },
  {
    image: heroSlide06,
    title: "Built for your family",
    sub: "VF 6 — space, safety, and zero-emission drives from Patna to the open road.",
    footnote: "*Images shown are for illustrative purposes only. Features and specification may vary as per trim.",
    objectPosition: "center 45%",
  },
];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), []);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + slides.length) % slides.length), []);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative h-[85vh] sm:h-[90vh] lg:h-screen min-h-[500px] sm:min-h-[600px] max-h-[min(100vh,1280px)] flex items-end pb-6 sm:pb-12 lg:pb-28 pt-16 lg:pt-0 overflow-hidden bg-zinc-950">
      {slides.map((slide, i) => (
        <div
          key={slide.image}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{
            opacity: i === current ? 1 : 0,
            zIndex: i === current ? 1 : 0,
          }}
          aria-hidden={i !== current}
        >
          <img
            src={slide.image}
            alt={`${slide.title} — VinFast hero`}
            className="image-high-quality h-full w-full object-cover"
            style={{ objectPosition: slide.objectPosition }}
            sizes="100vw"
            loading={i === 0 ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={i === 0 ? "high" : "low"}
          />
        </div>
      ))}
      <div className="absolute inset-0 z-[2] bg-gradient-to-t from-black/80 via-black/35 to-black/15 pointer-events-none" />

      <div className="relative container mx-auto px-4 lg:px-8 z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="max-w-xl sm:max-w-2xl lg:max-w-3xl"
          >
            <p className="text-on-image font-display font-semibold text-xs sm:text-sm uppercase tracking-[0.2em] mb-2">
              Patliputra VinFast · Patna
            </p>
            <h2 className="text-on-image-lg font-display font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight mb-3 sm:mb-4">
              {slides[current].title}
            </h2>
            {slides[current].sub && (
              <p className="text-on-image-soft font-medium text-sm sm:text-base md:text-lg leading-relaxed max-w-prose">
                {slides[current].sub}
              </p>
            )}
            {slides[current].footnote && (
              <p className="text-on-image-ghost text-[11px] sm:text-xs leading-snug max-w-prose mt-3">{slides[current].footnote}</p>
            )}
            <div className="h-4 sm:h-5" />
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <Link to="/test-drive">
                <Button variant="hero" size="lg" className="sm:!px-8 sm:!py-5 sm:!text-base">
                  Book Test Drive
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="heroWhite" size="lg" className="sm:!px-8 sm:!py-5 sm:!text-base">
                  Get Best Offer
                </Button>
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center gap-3 sm:gap-4 mt-6 sm:mt-10 lg:mt-12">
          <button
            type="button"
            onClick={prev}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-white border border-gray-200 flex items-center justify-center text-gray-900 transition-all duration-300 shadow-md hover:scale-105 shrink-0"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <div className="flex gap-1.5 sm:gap-2 flex-1 min-w-0 overflow-x-auto py-1 scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrent(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 shrink-0 rounded-full transition-all duration-500 ${
                  i === current ? "w-7 sm:w-9 bg-primary shadow-glow-red" : "w-2.5 sm:w-3 bg-white/35 hover:bg-white/55"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={next}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-white border border-gray-200 flex items-center justify-center text-gray-900 transition-all duration-300 shadow-md hover:scale-105 shrink-0"
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 mt-5 sm:mt-6 lg:mt-8 flex-wrap">
          <Link
            to="/models/vf7"
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-gray-200 bg-white/95 hover:bg-white text-gray-900 text-[11px] sm:text-sm font-medium transition-all duration-300 shadow-md"
          >
            Explore VF 7 <ChevronRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/models/vf6"
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-gray-200 bg-white/95 hover:bg-white text-gray-900 text-[11px] sm:text-sm font-medium transition-all duration-300 shadow-md"
          >
            Explore VF 6 <ChevronRight className="w-3.5 h-3.5" />
          </Link>
          <a
            href="https://wa.me/919231445060"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-[#1fa855] bg-[#25D366] hover:bg-[#20bd5a] text-white text-[11px] sm:text-sm font-medium transition-all duration-300 shadow-md"
          >
            WhatsApp Now <ChevronRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
