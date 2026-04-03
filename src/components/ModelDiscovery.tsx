import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Battery, Gauge, Shield, Zap } from "lucide-react";
import vf7Real from "@/assets/vf7-real.png";
import vf6Banner from "@/assets/vf6-banner.webp";

const models = [
  {
    name: "VF 7",
    tagline: "Bold. Intelligent. Unstoppable.",
    price: "₹21.89 Lakh*",
    image: vf7Real,
    href: "/models/vf7",
    specs: [
      { icon: Battery, label: "Battery", value: "75.3 kWh" },
      { icon: Gauge, label: "Range", value: "431 km" },
      { icon: Zap, label: "0–100", value: "5.9s" },
      { icon: Shield, label: "Safety", value: "5-Star" },
    ],
  },
  {
    name: "VF 6",
    tagline: "Compact. Smart. Electrifying.",
    price: "₹17.29 Lakh*",
    image: vf6Banner,
    href: "/models/vf6",
    specs: [
      { icon: Battery, label: "Battery", value: "59.6 kWh" },
      { icon: Gauge, label: "Range", value: "381 km" },
      { icon: Zap, label: "0–100", value: "6.8s" },
      { icon: Shield, label: "Safety", value: "5-Star" },
    ],
  },
];

const ModelDiscovery = () => {
  return (
    <section className="py-16 sm:py-24 lg:py-32 section-dark">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-16"
        >
          <p className="text-primary font-display font-semibold text-sm uppercase tracking-[0.2em] mb-3">
            Our Models
          </p>
          <h2 className="font-display font-bold text-3xl md:text-5xl">
            Choose Your Electric Future
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {models.map((model, i) => (
            <motion.div
              key={model.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="group relative rounded-3xl overflow-hidden border border-foreground/[0.06] bg-card hover:border-foreground/[0.12] transition-all duration-500"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={model.image}
                  alt={`VinFast ${model.name}`}
                  className="w-full h-full object-cover transition-[filter] duration-500 group-hover:brightness-[1.06]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>
              <div className="p-5 sm:p-6 lg:p-8">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4 mb-4">
                  <div className="min-w-0">
                    <h3 className="font-display font-bold text-xl sm:text-2xl lg:text-3xl">
                      VinFast {model.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mt-1">{model.tagline}</p>
                  </div>
                  <div className="text-left sm:text-right shrink-0">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">From</p>
                    <p className="font-display font-bold text-base sm:text-lg text-primary tabular-nums">{model.price}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-6">
                  {model.specs.map((spec) => {
                    const Icon = spec.icon;
                    return (
                      <div
                        key={spec.label}
                        className="text-center p-2.5 sm:p-3 rounded-xl bg-background/50 border border-foreground/[0.04] min-w-0"
                      >
                        <Icon className="w-4 h-4 text-primary mx-auto mb-1 sm:mb-1.5 shrink-0" />
                        <p className="text-[9px] sm:text-[10px] text-muted-foreground leading-tight">{spec.label}</p>
                        <p className="text-xs sm:text-sm font-semibold font-display tabular-nums mt-0.5 break-words">{spec.value}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link to={model.href} className="flex-1 min-w-0">
                    <Button variant="hero" className="w-full">
                      Explore {model.name}
                    </Button>
                  </Link>
                  <Link to="/compare" className="shrink-0">
                    <Button variant="outline" className="h-10 w-full sm:w-auto min-w-[7rem]">
                      Compare
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ModelDiscovery;
