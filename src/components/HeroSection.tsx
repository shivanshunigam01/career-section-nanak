import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import homepageHero from "@/assets/homepage-hero.webp";
import vfSeriesBanner from "@/assets/vf-series-banner.jpeg";
import vf7Street from "@/assets/vf7-street.jpg";

const slides = [
  {
    image: homepageHero,
    subtitle: "Bihar's First Authorized VinFast Dealer — Book Your Test Drive Today",
    objectPosition: "center 60%",
  },
  {
    image: vfSeriesBanner,
    subtitle: "Introducing the VF Series — Design You Can Feel. 5-Star Safety.",
    objectPosition: "center 55%",
  },
  {
    image: vf7Street,
    subtitle: "VinFast VF 7 — 349 HP · 431 km Range · Level 2+ ADAS",
    objectPosition: "center 50%",
  },
];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>(
    new Array(slides.length).fill(false)
  );

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

  // Preload all hero images
  useEffect(() => {
    slides.forEach((slide, idx) => {
      const img = new Image();
      img.src = slide.image;
      img.onload = () =>
        setImagesLoaded((prev) => {
          const next = [...prev];
          next[idx] = true;
          return next;
        });
    });
  }, []);

  return (
    <section className="relative h-[85vh] sm:h-[90vh] lg:h-screen min-h-[500px] sm:min-h-[600px] max-h-[1000px] flex items-end pb-6 sm:pb-12 lg:pb-28 overflow-hidden">
      {/* All slide images rendered, crossfade via opacity */}
      {slides.map((slide, i) => (
        <motion.div
          key={i}
          animate={{ opacity: i === current ? 1 : 0, scale: i === current ? 1 : 1.05 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0"
          style={{ zIndex: i === current ? 1 : 0 }}
        >
          <img
            src={slide.image}
            alt={slide.subtitle}
            className="w-full h-full object-cover"
            style={{ objectPosition: slide.objectPosition }}
            loading="eager"
          />
          {/* Bottom gradient for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 sm:via-background/30 to-transparent" />
          {/* Left gradient — stronger on mobile for text contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 sm:from-background/70 via-background/40 sm:via-transparent to-transparent" />
        </motion.div>
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
            <p className="text-foreground/80 font-display font-medium text-xs sm:text-sm lg:text-base max-w-sm sm:max-w-lg mb-4 sm:mb-6 leading-relaxed drop-shadow-lg">
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
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-foreground/20 flex items-center justify-center text-foreground/50 hover:text-foreground hover:border-foreground/40 transition-all backdrop-blur-sm"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1 rounded-full transition-all duration-500 ${
                  i === current ? "w-6 sm:w-8 bg-primary" : "w-3 sm:w-4 bg-foreground/20"
                }`}
              />
            ))}
          </div>
          <button
            onClick={next}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-foreground/20 flex items-center justify-center text-foreground/50 hover:text-foreground hover:border-foreground/40 transition-all backdrop-blur-sm"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Quick links below hero — hidden on small mobile to save space */}
        <div className="hidden sm:flex items-center gap-6 mt-6 lg:mt-8">
          <Link
            to="/models/vf7"
            className="text-xs sm:text-sm text-foreground/40 hover:text-foreground transition-colors underline underline-offset-4 decoration-foreground/20"
          >
            Explore VF 7 →
          </Link>
          <Link
            to="/models/vf6"
            className="text-xs sm:text-sm text-foreground/40 hover:text-foreground transition-colors underline underline-offset-4 decoration-foreground/20"
          >
            Explore VF 6 →
          </Link>
          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs sm:text-sm text-foreground/40 hover:text-foreground transition-colors underline underline-offset-4 decoration-foreground/20"
          >
            WhatsApp Now →
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
