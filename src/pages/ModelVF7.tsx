import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Check, ChevronRight, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import LeadCaptureStrip from "@/components/LeadCaptureStrip";
import Footer from "@/components/Footer";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import vf7Street from "@/assets/vf7-street.jpg";
import vf7Real from "@/assets/vf7-real.png";
import interiorImg from "@/assets/interior.jpg";

const colors = [
  { name: "Crimson Red", hex: "#B81C1C" },
  { name: "Neptune Blue", hex: "#1B3A5C" },
  { name: "Decepticon Grey", hex: "#4A4A4A" },
  { name: "Everest White", hex: "#E8E8E8" },
  { name: "Brazen Black", hex: "#1A1A1A" },
];

const specs = [
  { category: "Performance", items: [
    { label: "Motor Power", value: "349 HP (260 kW)" },
    { label: "Torque", value: "500 Nm" },
    { label: "0-100 km/h", value: "5.9 seconds" },
    { label: "Top Speed", value: "200 km/h" },
    { label: "Drive Type", value: "AWD" },
  ]},
  { category: "Battery & Charging", items: [
    { label: "Battery Capacity", value: "75.3 kWh" },
    { label: "Range (WLTP)", value: "431 km" },
    { label: "Fast Charging", value: "10-70% in 24 min" },
    { label: "Home Charging", value: "0-100% in 11 hrs" },
    { label: "Charger Type", value: "CCS2" },
  ]},
  { category: "Safety", items: [
    { label: "NCAP Rating", value: "5-Star" },
    { label: "Airbags", value: "6 Airbags" },
    { label: "ADAS Level", value: "Level 2+" },
    { label: "Parking Assist", value: "360° Camera" },
    { label: "Collision Alert", value: "FCW + AEB" },
  ]},
  { category: "Dimensions", items: [
    { label: "Length", value: "4,545 mm" },
    { label: "Width", value: "1,890 mm" },
    { label: "Height", value: "1,635 mm" },
    { label: "Wheelbase", value: "2,840 mm" },
    { label: "Boot Space", value: "655 litres" },
  ]},
];

const features = [
  "15.6-inch HD Touchscreen", "Panoramic Sunroof", "Ventilated Front Seats",
  "Wireless Charging", "Connected Car Features", "Voice Assistant",
  "Premium Sound System", "Ambient Lighting", "Powered Tailgate",
  "Auto Park Assist", "Lane Keep Assist", "Adaptive Cruise Control",
];

const ModelVF7 = () => {
  const [selectedColor, setSelectedColor] = useState(0);
  const [activeSpec, setActiveSpec] = useState(0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-end pb-16 lg:pb-24">
        <div className="absolute inset-0">
          <img src={vf7Street} alt="VinFast VF 7" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
        </div>
        <div className="relative container mx-auto px-4 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="text-primary font-display font-semibold text-sm uppercase tracking-[0.25em] mb-3">Premium Electric SUV</p>
            <h1 className="font-display font-bold text-5xl md:text-6xl lg:text-8xl mb-4">VF 7</h1>
            <p className="text-foreground/50 text-lg max-w-xl mb-6">
              Bold. Intelligent. Unstoppable. The VinFast VF 7 redefines what an electric SUV can be.
            </p>
            <div className="flex flex-wrap items-center gap-6 mb-8">
              {[
                { val: "₹43.90L*", label: "Starting Price" },
                { val: "431 km", label: "Range" },
                { val: "5.9s", label: "0–100 km/h" },
                { val: "5★", label: "Safety", red: true },
              ].map((s, i) => (
                <div key={s.label} className="flex items-center gap-6">
                  {i > 0 && <div className="w-px h-10 bg-foreground/10" />}
                  <div className="text-center">
                    <p className={`font-display font-bold text-2xl ${s.red ? "text-primary" : ""}`}>{s.val}</p>
                    <p className="text-xs text-foreground/40">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/test-drive"><Button variant="hero" size="lg">Book Test Drive</Button></Link>
              <Link to="/contact"><Button variant="heroOutline" size="lg">Get On-Road Price</Button></Link>
              <Link to="/emi-calculator"><Button variant="outline" size="lg">EMI Calculator</Button></Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Gallery strip */}
      <section className="py-4 section-surface">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl overflow-hidden aspect-[16/9]">
              <img src={vf7Real} alt="VF 7 Front" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" loading="lazy" />
            </div>
            <div className="rounded-2xl overflow-hidden aspect-[16/9]">
              <img src={interiorImg} alt="VF 7 Interior" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" loading="lazy" />
            </div>
          </div>
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
                className={`w-10 h-10 rounded-full border-2 transition-all ${i === selectedColor ? "border-primary scale-125 shadow-glow-red" : "border-foreground/10"}`}
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
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${i === activeSpec ? "bg-primary text-primary-foreground" : "bg-foreground/5 text-muted-foreground hover:text-foreground hover:bg-foreground/10"}`}>
                {s.category}
              </button>
            ))}
          </div>
          <motion.div key={activeSpec} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto glass-card p-8">
            {specs[activeSpec].items.map((item, i) => (
              <div key={item.label} className={`flex items-center justify-between py-4 ${i < specs[activeSpec].items.length - 1 ? "border-b border-foreground/[0.06]" : ""}`}>
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
              <h2 className="font-display font-bold text-3xl md:text-4xl mb-8">Loaded with Intelligence</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {features.map((f) => (
                  <div key={f} className="flex items-center gap-3 py-2">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-sm text-foreground/80">{f}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="/brochures/VF7-Brochure.pdf" download="VinFast-VF7-Brochure.pdf" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="lg">
                    <Download className="w-4 h-4 mr-2" /> Download Brochure
                  </Button>
                </a>
              </div>
            </div>
            <div className="rounded-3xl overflow-hidden shadow-luxury">
              <img src={interiorImg} alt="VF 7 Interior" className="w-full aspect-[4/3] object-cover" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* Brochure PDF Viewer */}
      <section className="py-24 section-dark">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <p className="text-primary font-display font-semibold text-sm uppercase tracking-[0.2em] mb-3">Official Brochure</p>
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">VF 7 — Full Brochure</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-6">
              Browse the complete VinFast VF 7 brochure below or download it for offline reading.
            </p>
            <a href="/brochures/VF7-Brochure.pdf" download="VinFast-VF7-Brochure.pdf" target="_blank" rel="noopener noreferrer">
              <Button variant="hero" size="lg">
                <Download className="w-4 h-4 mr-2" /> Download PDF
              </Button>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card overflow-hidden rounded-3xl"
          >
            <div className="flex items-center gap-3 px-6 py-4 border-b border-foreground/[0.06]">
              <FileText className="w-5 h-5 text-primary" />
              <span className="font-display font-semibold text-sm">VinFast VF 7 — Official Brochure</span>
              <a href="/brochures/VF7-Brochure.pdf" download="VinFast-VF7-Brochure.pdf" className="ml-auto flex items-center gap-1.5 text-xs text-primary hover:underline">
                <Download className="w-3.5 h-3.5" /> Download
              </a>
            </div>
            <iframe
              src="/brochures/VF7-Brochure.pdf"
              title="VinFast VF 7 Brochure"
              className="w-full"
              style={{ height: "80vh", minHeight: "600px" }}
            />
          </motion.div>
        </div>
      </section>

      <LeadCaptureStrip />
      <Footer />
      <StickyMobileCTA />
    </div>
  );
};

export default ModelVF7;
