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
    subtitle: "Bihar's First Authorized Dealer",
    title: "VinFast Electric SUVs",
    titleAccent: "Now in Bihar",
    description: "Experience the VF Series — Design You Can Feel. Book your test drive with Patliputra Auto today.",
  },
  {
    image: vfSeriesBanner,
    subtitle: "Introducing the VF Series",
    title: "Design You",
    titleAccent: "Can Feel",
    description: "Pre-booking now open for VF 6 & VF 7. Premium electric SUVs with 5-star Bharat NCAP safety.",
  },
  {
    image: vf7Street,
    subtitle: "VinFast VF 7",
    title: "Bold. Intelligent.",
    titleAccent: "Unstoppable.",
    description: "349 HP. 431 km range. Level 2+ ADAS. The premium electric SUV that redefines performance.",
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
    <section className="relative min-h-screen flex items-end pb-20 lg:pb-28 overflow-hidden">
      {/* Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <img
            src={slides[current].image}
            alt={slides[current].title}
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative container mx-auto px-4 lg:px-8 z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-2xl"
          >
            <p className="text-primary font-display font-semibold text-xs sm:text-sm uppercase tracking-[0.25em] mb-4">
              {slides[current].subtitle}
            </p>
            <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] mb-6">
              {slides[current].title}
              <br />
              <span className="text-gradient-red">{slides[current].titleAccent}</span>
            </h1>
            <p className="text-foreground/60 text-base sm:text-lg max-w-lg mb-8 leading-relaxed">
              {slides[current].description}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/test-drive">
                <Button variant="hero" size="xl">Book Test Drive</Button>
              </Link>
              <Link to="/contact">
                <Button variant="heroOutline" size="xl">Get Best Offer</Button>
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Slide controls */}
        <div className="flex items-center gap-4 mt-12">
          <button onClick={prev} className="w-10 h-10 rounded-full border border-foreground/20 flex items-center justify-center text-foreground/50 hover:text-foreground hover:border-foreground/40 transition-all">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1 rounded-full transition-all duration-500 ${
                  i === current ? "w-8 bg-primary" : "w-4 bg-foreground/20"
                }`}
              />
            ))}
          </div>
          <button onClick={next} className="w-10 h-10 rounded-full border border-foreground/20 flex items-center justify-center text-foreground/50 hover:text-foreground hover:border-foreground/40 transition-all">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Quick links below hero */}
        <div className="flex items-center gap-6 mt-8">
          <Link to="/models/vf7" className="text-xs sm:text-sm text-foreground/40 hover:text-foreground transition-colors underline underline-offset-4 decoration-foreground/20">
            Explore VF 7 →
          </Link>
          <Link to="/models/vf6" className="text-xs sm:text-sm text-foreground/40 hover:text-foreground transition-colors underline underline-offset-4 decoration-foreground/20">
            Explore VF 6 →
          </Link>
          <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm text-foreground/40 hover:text-foreground transition-colors underline underline-offset-4 decoration-foreground/20">
            WhatsApp Now →
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
