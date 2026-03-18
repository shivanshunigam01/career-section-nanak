import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Check, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import LeadCaptureStrip from "@/components/LeadCaptureStrip";
import Footer from "@/components/Footer";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import vf6Hero from "@/assets/vf6-hero.jpg";
import interiorImg from "@/assets/interior.jpg";

const colors = [
  { name: "Neptune Blue", hex: "#1B3A5C" },
  { name: "Everest White", hex: "#E8E8E8" },
  { name: "Decepticon Grey", hex: "#4A4A4A" },
  { name: "Crimson Red", hex: "#8B1A1A" },
  { name: "Brazen Black", hex: "#1A1A1A" },
];

const specs = [
  { category: "Performance", items: [
    { label: "Motor Power", value: "201 HP (150 kW)" },
    { label: "Torque", value: "310 Nm" },
    { label: "0-100 km/h", value: "6.8 seconds" },
    { label: "Top Speed", value: "175 km/h" },
    { label: "Drive Type", value: "FWD" },
  ]},
  { category: "Battery & Charging", items: [
    { label: "Battery Capacity", value: "59.6 kWh" },
    { label: "Range (WLTP)", value: "381 km" },
    { label: "Fast Charging", value: "10-70% in 26 min" },
    { label: "Home Charging", value: "0-100% in 9 hrs" },
    { label: "Charger Type", value: "CCS2" },
  ]},
  { category: "Safety", items: [
    { label: "NCAP Rating", value: "5-Star" },
    { label: "Airbags", value: "6 Airbags" },
    { label: "ADAS Level", value: "Level 2" },
    { label: "Parking Assist", value: "Rear Camera" },
    { label: "Collision Alert", value: "FCW + AEB" },
  ]},
  { category: "Dimensions", items: [
    { label: "Length", value: "4,238 mm" },
    { label: "Width", value: "1,820 mm" },
    { label: "Height", value: "1,594 mm" },
    { label: "Wheelbase", value: "2,730 mm" },
    { label: "Boot Space", value: "422 litres" },
  ]},
];

const features = [
  "12.9-inch Touchscreen",
  "Wireless Apple CarPlay",
  "Heated Front Seats",
  "Wireless Charging",
  "Connected Car Features",
  "Voice Assistant",
  "6-Speaker Audio",
  "Ambient Lighting",
  "Auto Climate Control",
  "Cruise Control",
  "Lane Keep Assist",
  "Hill Descent Control",
];

const ModelVF6 = () => {
  const [selectedColor, setSelectedColor] = useState(0);
  const [activeSpec, setActiveSpec] = useState(0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-end pb-16 lg:pb-24">
        <div className="absolute inset-0">
          <img src={vf6Hero} alt="VinFast VF 6" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>
        <div className="relative container mx-auto px-4 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="text-primary font-display font-semibold text-sm uppercase tracking-[0.2em] mb-3">Compact Electric SUV</p>
            <h1 className="font-display font-bold text-5xl md:text-6xl lg:text-8xl mb-4">VF 6</h1>
            <p className="text-muted-foreground text-lg max-w-xl mb-6">
              Compact. Smart. Electrifying. The perfect urban electric SUV for the modern family.
            </p>
            <div className="flex flex-wrap items-center gap-6 mb-8">
              {[
                { val: "₹35.00L*", label: "Starting Price" },
                { val: "381 km", label: "Range" },
                { val: "6.8s", label: "0–100 km/h" },
                { val: "5★", label: "Safety", red: true },
              ].map((s, i) => (
                <div key={s.label} className="flex items-center gap-6">
                  {i > 0 && <div className="w-px h-10 bg-border" />}
                  <div className="text-center">
                    <p className={`font-display font-bold text-2xl ${s.red ? "text-primary" : ""}`}>{s.val}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/test-drive"><Button variant="hero" size="lg">Book Test Drive</Button></Link>
              <Link to="/contact"><Button variant="heroOutline" size="lg">Get On-Road Price</Button></Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Color Selector */}
      <section className="py-20 section-surface">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <p className="text-primary font-display font-semibold text-sm uppercase tracking-[0.2em] mb-3">Color Studio</p>
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-8">Choose Your Shade</h2>
          <div className="flex items-center justify-center gap-4 mb-4">
            {colors.map((c, i) => (
              <button key={c.name} onClick={() => setSelectedColor(i)}
                className={`w-10 h-10 rounded-full border-2 transition-all ${i === selectedColor ? "border-primary scale-125" : "border-transparent"}`}
                style={{ backgroundColor: c.hex }} title={c.name} />
            ))}
          </div>
          <p className="text-muted-foreground text-sm">{colors[selectedColor].name}</p>
        </div>
      </section>

      {/* Specs */}
      <section className="py-24 section-dark">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-primary font-display font-semibold text-sm uppercase tracking-[0.2em] mb-3">Specifications</p>
            <h2 className="font-display font-bold text-3xl md:text-5xl">Every Detail Matters</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {specs.map((s, i) => (
              <button key={s.category} onClick={() => setActiveSpec(i)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${i === activeSpec ? "bg-primary text-primary-foreground" : "bg-foreground/5 text-muted-foreground hover:text-foreground"}`}>
                {s.category}
              </button>
            ))}
          </div>
          <motion.div key={activeSpec} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
            {specs[activeSpec].items.map((item, i) => (
              <div key={item.label} className={`flex items-center justify-between py-4 ${i < specs[activeSpec].items.length - 1 ? "border-b border-border/30" : ""}`}>
                <span className="text-muted-foreground text-sm">{item.label}</span>
                <span className="font-display font-semibold tabular-nums">{item.value}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 section-surface">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-primary font-display font-semibold text-sm uppercase tracking-[0.2em] mb-3">Features</p>
              <h2 className="font-display font-bold text-3xl md:text-4xl mb-8">Smart & Connected</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {features.map((f) => (
                  <div key={f} className="flex items-center gap-3 py-2">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-sm text-foreground/80">{f}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Button variant="outline" size="lg">Download Brochure <ChevronRight className="w-4 h-4" /></Button>
              </div>
            </div>
            <div className="rounded-3xl overflow-hidden shadow-luxury">
              <img src={interiorImg} alt="VF 6 Interior" className="w-full aspect-[4/3] object-cover" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      <LeadCaptureStrip />
      <Footer />
      <StickyMobileCTA />
    </div>
  );
};

export default ModelVF6;
