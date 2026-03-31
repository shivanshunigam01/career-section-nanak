import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Minus, Zap, Battery, Shield, Layers, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LeadCaptureStrip from "@/components/LeadCaptureStrip";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import vf7DesatSilver from "@/assets/vf7-desat-silver.png";
import vf6DesatSilver from "@/assets/vf6-desat-silver.png";

type SpecValue = string | boolean | number;

interface SpecRow {
  label: string;
  vf7: SpecValue;
  vf6: SpecValue;
  unit?: string;
  higherIsBetter?: boolean;
  highlight?: boolean;
}

interface Category {
  id: string;
  label: string;
  icon: React.ReactNode;
  specs: SpecRow[];
}

const categories: Category[] = [
  {
    id: "price",
    label: "Price & Value",
    icon: <Star className="w-4 h-4" />,
    specs: [
      { label: "Ex-Showroom Price", vf7: "₹21.89 Lakh*", vf6: "₹17.29 Lakh*", highlight: true },
      { label: "Variants", vf7: "Plus / Max", vf6: "Plus / Max" },
      { label: "Warranty", vf7: "5 Yrs / 1.5L km", vf6: "5 Yrs / 1.5L km" },
    ],
  },
  {
    id: "performance",
    label: "Performance",
    icon: <Zap className="w-4 h-4" />,
    specs: [
      { label: "Motor Power", vf7: 349, vf6: 201, unit: "HP", higherIsBetter: true, highlight: true },
      { label: "Torque", vf7: 500, vf6: 310, unit: "Nm", higherIsBetter: true },
      { label: "0–100 km/h", vf7: "5.9s", vf6: "6.8s", higherIsBetter: false },
      { label: "Top Speed", vf7: "200 km/h", vf6: "175 km/h" },
      { label: "Drive Type", vf7: "AWD", vf6: "FWD" },
    ],
  },
  {
    id: "battery",
    label: "Battery & Range",
    icon: <Battery className="w-4 h-4" />,
    specs: [
      { label: "Battery Capacity", vf7: 75.3, vf6: 59.6, unit: "kWh", higherIsBetter: true, highlight: true },
      { label: "Range (WLTP)", vf7: 431, vf6: 381, unit: "km", higherIsBetter: true },
      { label: "Fast Charge (10–70%)", vf7: "24 min", vf6: "26 min" },
      { label: "Home Charge (0–100%)", vf7: "11 hrs", vf6: "9 hrs" },
      { label: "Charger Type", vf7: "CCS2", vf6: "CCS2" },
    ],
  },
  {
    id: "safety",
    label: "Safety",
    icon: <Shield className="w-4 h-4" />,
    specs: [
      { label: "Global NCAP Rating", vf7: "5-Star", vf6: "5-Star", highlight: true },
      { label: "Airbags", vf7: "6 Airbags", vf6: "6 Airbags" },
      { label: "ADAS Level", vf7: "Level 2+", vf6: "Level 2" },
      { label: "AEB (Auto Emergency Braking)", vf7: true, vf6: true },
      { label: "Lane Keep Assist", vf7: true, vf6: true },
      { label: "360° Parking Camera", vf7: true, vf6: false },
      { label: "Blind Spot Monitor", vf7: true, vf6: false },
    ],
  },
  {
    id: "features",
    label: "Features & Comfort",
    icon: <Layers className="w-4 h-4" />,
    specs: [
      { label: "Touchscreen", vf7: '15.6"', vf6: '12.9"', highlight: true },
      { label: "Panoramic Sunroof", vf7: true, vf6: false },
      { label: "Ventilated Front Seats", vf7: true, vf6: false },
      { label: "Heated Front Seats", vf7: true, vf6: true },
      { label: "Wireless Charging", vf7: true, vf6: true },
      { label: "Powered Tailgate", vf7: true, vf6: false },
      { label: "Ambient Lighting", vf7: true, vf6: true },
      { label: "Boot Space", vf7: "655 L", vf6: "422 L" },
      { label: "Seating", vf7: "5 Adults", vf6: "5 Adults" },
    ],
  },
];

const barSpecs = [
  { label: "Power", vf7: 349, vf6: 201, max: 400, unit: "HP" },
  { label: "Range", vf7: 431, vf6: 381, max: 500, unit: "km" },
  { label: "Battery", vf7: 75.3, vf6: 59.6, max: 85, unit: "kWh" },
  { label: "Boot Space", vf7: 655, vf6: 422, max: 700, unit: "L" },
];

const renderValue = (val: SpecValue) => {
  if (typeof val === "boolean") {
    return val
      ? <Check className="w-4 h-4 text-primary mx-auto" />
      : <Minus className="w-4 h-4 text-muted-foreground/40 mx-auto" />;
  }
  return <span>{val}</span>;
};

const getWinner = (row: SpecRow): "vf7" | "vf6" | "tie" | null => {
  if (typeof row.vf7 === "boolean" && typeof row.vf6 === "boolean") {
    if (row.vf7 === row.vf6) return "tie";
    return row.vf7 ? "vf7" : "vf6";
  }
  if (typeof row.vf7 === "number" && typeof row.vf6 === "number") {
    if (row.vf7 === row.vf6) return "tie";
    if (row.higherIsBetter === false) return row.vf7 < row.vf6 ? "vf7" : "vf6";
    return row.vf7 > row.vf6 ? "vf7" : "vf6";
  }
  return null;
};

const ComparePage = () => {
  const [activeCategory, setActiveCategory] = useState("price");

  const currentCat = categories.find((c) => c.id === activeCategory)!;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-24 pb-10 lg:pt-32 lg:pb-12 section-surface">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <p className="text-primary font-display font-semibold text-sm uppercase tracking-[0.2em] mb-3">Side by Side</p>
            <h1 className="font-display font-bold text-4xl md:text-5xl mb-4">Compare Models</h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              VF 7 vs VF 6 — explore every detail side by side and choose the right EV for you.
            </p>
          </motion.div>

          {/* Car Cards */}
          <div className="grid grid-cols-2 gap-4 sm:gap-8 max-w-3xl mx-auto mb-12">
            {[
              { name: "VF 7", img: vf7DesatSilver, href: "/models/vf7", price: "₹21.89L*", badge: "Performance" },
              { name: "VF 6", img: vf6DesatSilver, href: "/models/vf6", price: "₹17.29L*", badge: "Value" },
            ].map((m, idx) => (
              <motion.div
                key={m.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card p-4 sm:p-6 text-center group"
              >
                <span className="inline-block text-xs font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full mb-3">
                  {m.badge}
                </span>
                <div className="rounded-xl overflow-hidden bg-[#F0F0F0] mb-4 aspect-[4/3]">
                  <img
                    src={m.img}
                    alt={`VinFast ${m.name}`}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="font-display font-bold text-xl mb-1">VinFast {m.name}</h3>
                <p className="text-primary font-semibold text-lg mb-4">{m.price}</p>
                <Link to={m.href}>
                  <Button variant="outline" size="sm" className="w-full">View Details</Button>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Visual Comparison Bars */}
          <div className="max-w-3xl mx-auto glass-card p-6 sm:p-8 mb-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-6">At a Glance</p>
            <div className="space-y-5">
              {barSpecs.map((spec) => (
                <div key={spec.label}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">{spec.label}</span>
                    <div className="flex gap-4 text-xs font-semibold tabular-nums">
                      <span className="text-primary">VF 7: {spec.vf7} {spec.unit}</span>
                      <span className="text-foreground/50">VF 6: {spec.vf6} {spec.unit}</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-2 rounded-full bg-foreground/[0.06] overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(spec.vf7 / spec.max) * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full rounded-full bg-primary"
                      />
                    </div>
                    <div className="h-2 rounded-full bg-foreground/[0.06] overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(spec.vf6 / spec.max) * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                        className="h-full rounded-full bg-foreground/30"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-6 pt-2">
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-primary inline-block" /><span className="text-xs text-muted-foreground">VF 7</span></div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-foreground/30 inline-block" /><span className="text-xs text-muted-foreground">VF 6</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Spec Table */}
      <section className="py-16 section-dark">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <p className="text-primary font-display font-semibold text-sm uppercase tracking-[0.2em] mb-2">Deep Dive</p>
              <h2 className="font-display font-bold text-2xl md:text-3xl">Detailed Specifications</h2>
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === cat.id
                      ? "bg-primary text-primary-foreground shadow-glow-red"
                      : "bg-foreground/5 text-muted-foreground hover:text-foreground hover:bg-foreground/10"
                  }`}
                >
                  {cat.icon}
                  <span className="hidden sm:inline">{cat.label}</span>
                </button>
              ))}
            </div>

            {/* Spec Table */}
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card overflow-hidden"
            >
              {/* Table Header */}
              <div className="grid grid-cols-3 gap-2 px-4 sm:px-6 py-3 border-b border-foreground/[0.06] bg-foreground/[0.02]">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Spec</span>
                <span className="text-center text-xs font-semibold text-primary uppercase tracking-widest">VF 7</span>
                <span className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-widest">VF 6</span>
              </div>

              {currentCat.specs.map((row, i) => {
                const winner = getWinner(row);
                return (
                  <div
                    key={row.label}
                    className={`grid grid-cols-3 gap-2 items-center px-4 sm:px-6 py-4 ${
                      i < currentCat.specs.length - 1 ? "border-b border-foreground/[0.04]" : ""
                    } ${row.highlight ? "bg-primary/[0.03]" : i % 2 === 0 ? "bg-foreground/[0.01]" : ""}`}
                  >
                    <span className={`text-sm ${row.highlight ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                      {row.label}
                    </span>
                    <span className={`text-center font-display font-medium text-sm tabular-nums flex items-center justify-center ${winner === "vf7" ? "text-primary" : ""}`}>
                      {renderValue(typeof row.vf7 === "number" ? `${row.vf7}${row.unit ? " " + row.unit : ""}` : row.vf7)}
                      {winner === "vf7" && <span className="ml-1.5 text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-semibold hidden sm:inline">Better</span>}
                    </span>
                    <span className={`text-center font-display font-medium text-sm tabular-nums flex items-center justify-center ${winner === "vf6" ? "text-emerald-500" : ""}`}>
                      {renderValue(typeof row.vf6 === "number" ? `${row.vf6}${row.unit ? " " + row.unit : ""}` : row.vf6)}
                      {winner === "vf6" && <span className="ml-1.5 text-[10px] bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded-full font-semibold hidden sm:inline">Better</span>}
                    </span>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Which is right for you */}
      <section className="py-20 section-surface">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-primary font-display font-semibold text-sm uppercase tracking-[0.2em] mb-3">Recommendation</p>
            <h2 className="font-display font-bold text-3xl md:text-4xl">Which One is Right for You?</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                model: "VF 7",
                img: vf7DesatSilver,
                href: "/models/vf7",
                tagline: "For the Performance Seeker",
                color: "primary",
                reasons: [
                  "You want AWD & maximum power",
                  "Long highway drives with 431 km range",
                  "You prefer a larger, more premium cabin",
                  "Tech features like 360° camera & Level 2+ ADAS",
                  "Panoramic sunroof & ventilated seats matter to you",
                ],
              },
              {
                model: "VF 6",
                img: vf6DesatSilver,
                href: "/models/vf6",
                tagline: "For the Smart City Driver",
                color: "emerald",
                reasons: [
                  "Urban commuting & compact parking",
                  "More budget-friendly starting price",
                  "Faster home charging (9 hrs)",
                  "Lighter weight, easier city maneuverability",
                  "Still gets 5-Star safety & ADAS Level 2",
                ],
              },
            ].map((card) => (
              <motion.div
                key={card.model}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass-card p-6 sm:p-8"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#F0F0F0] flex-shrink-0">
                    <img src={card.img} alt={card.model} className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-xl">VinFast {card.model}</h3>
                    <p className={`text-sm font-medium ${card.color === "primary" ? "text-primary" : "text-emerald-500"}`}>
                      {card.tagline}
                    </p>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  {card.reasons.map((r) => (
                    <li key={r} className="flex items-start gap-3 text-sm text-foreground/80">
                      <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${card.color === "primary" ? "text-primary" : "text-emerald-500"}`} />
                      {r}
                    </li>
                  ))}
                </ul>
                <Link to={card.href} className="block">
                  <Button
                    variant={card.color === "primary" ? "hero" : "outline"}
                    size="lg"
                    className="w-full"
                  >
                    Explore {card.model}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 section-dark text-center">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">Still Deciding?</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Book a test drive for either model and our EV advisor will help you pick the perfect one.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/test-drive"><Button variant="hero" size="lg">Book Test Drive</Button></Link>
            <Link to="/contact"><Button variant="outline" size="lg">Talk to an Advisor</Button></Link>
          </div>
        </div>
      </section>

      <LeadCaptureStrip />
      <Footer />
      <StickyMobileCTA />
    </div>
  );
};

export default ComparePage;
