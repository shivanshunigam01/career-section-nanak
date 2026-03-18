import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Minus } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import vf7Real from "@/assets/vf7-real.png";
import vf6Banner from "@/assets/vf6-banner.webp";

const compareData = [
  { label: "Starting Price", vf7: "₹43.90 Lakh*", vf6: "₹35.00 Lakh*" },
  { label: "Motor Power", vf7: "349 HP", vf6: "201 HP" },
  { label: "Torque", vf7: "500 Nm", vf6: "310 Nm" },
  { label: "Battery", vf7: "75.3 kWh", vf6: "59.6 kWh" },
  { label: "Range", vf7: "431 km", vf6: "381 km" },
  { label: "0-100 km/h", vf7: "5.9s", vf6: "6.8s" },
  { label: "Drive Type", vf7: "AWD", vf6: "FWD" },
  { label: "Fast Charge", vf7: "10-70% in 24 min", vf6: "10-70% in 26 min" },
  { label: "NCAP Rating", vf7: "5-Star", vf6: "5-Star" },
  { label: "Airbags", vf7: "6", vf6: "6" },
  { label: "ADAS", vf7: "Level 2+", vf6: "Level 2" },
  { label: "Touchscreen", vf7: '15.6"', vf6: '12.9"' },
  { label: "Panoramic Sunroof", vf7: true, vf6: false },
  { label: "Ventilated Seats", vf7: true, vf6: false },
  { label: "Powered Tailgate", vf7: true, vf6: false },
  { label: "Boot Space", vf7: "655L", vf6: "422L" },
];

const ComparePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20 lg:pt-32 lg:pb-32">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <p className="text-primary font-display font-semibold text-sm uppercase tracking-[0.2em] mb-3">Side by Side</p>
            <h1 className="font-display font-bold text-4xl md:text-5xl mb-4">Compare Models</h1>
            <p className="text-muted-foreground">VF 7 vs VF 6 — find the perfect VinFast for you.</p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div />
              {[
                { name: "VF 7", img: vf7Real, href: "/models/vf7" },
                { name: "VF 6", img: vf6Banner, href: "/models/vf6" },
              ].map((m) => (
                <div key={m.name} className="text-center">
                  <div className="rounded-2xl overflow-hidden mb-4 aspect-[16/10] border border-foreground/[0.06]">
                    <img src={m.img} alt={`VinFast ${m.name}`} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="font-display font-bold text-xl mb-2">VinFast {m.name}</h3>
                  <Link to={m.href}>
                    <Button variant="outline" size="sm">View Details</Button>
                  </Link>
                </div>
              ))}
            </div>

            <div className="glass-card overflow-hidden">
              {compareData.map((row, i) => (
                <div key={row.label} className={`grid grid-cols-3 gap-4 px-6 py-4 ${i < compareData.length - 1 ? "border-b border-foreground/[0.04]" : ""} ${i % 2 === 0 ? "bg-foreground/[0.01]" : ""}`}>
                  <span className="text-muted-foreground text-sm">{row.label}</span>
                  <span className="text-center font-display font-medium text-sm tabular-nums">
                    {typeof row.vf7 === "boolean" ? (row.vf7 ? <Check className="w-4 h-4 text-primary mx-auto" /> : <Minus className="w-4 h-4 text-muted-foreground mx-auto" />) : row.vf7}
                  </span>
                  <span className="text-center font-display font-medium text-sm tabular-nums">
                    {typeof row.vf6 === "boolean" ? (row.vf6 ? <Check className="w-4 h-4 text-primary mx-auto" /> : <Minus className="w-4 h-4 text-muted-foreground mx-auto" />) : row.vf6}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-4 mt-10">
              <Link to="/test-drive"><Button variant="hero" size="lg">Book Test Drive</Button></Link>
              <Link to="/contact"><Button variant="outline" size="lg">Get Best Price</Button></Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <StickyMobileCTA />
    </div>
  );
};

export default ComparePage;
