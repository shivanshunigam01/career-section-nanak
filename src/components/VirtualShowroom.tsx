import { motion } from "framer-motion";
import interiorImg from "@/assets/interior.jpg";
import vinFastLineup from "@/assets/vinfast-lineup.webp";

const VirtualShowroom = () => {
  return (
    <section className="py-24 lg:py-32 section-surface overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-primary font-display font-semibold text-sm uppercase tracking-[0.2em] mb-3">
            Virtual Showroom
          </p>
          <h2 className="font-display font-bold text-3xl md:text-5xl mb-4">
            Step Inside Luxury
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Experience the premium craftsmanship and cutting-edge technology of VinFast.
          </p>
        </motion.div>

        {/* Full lineup banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden shadow-luxury mb-8"
        >
          <img
            src={vinFastLineup}
            alt="VinFast Complete Lineup"
            className="w-full aspect-[21/9] object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 lg:bottom-10 lg:left-10 lg:right-10">
            <p className="font-display font-bold text-xl lg:text-3xl text-foreground">The Complete VF Lineup</p>
            <p className="text-foreground/50 text-sm lg:text-base mt-1">VF 3 · VF 6 · VF 7 · VF 8 · VF 9 — A vision for every lifestyle</p>
          </div>
        </motion.div>

        {/* Interior */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden shadow-luxury"
        >
          <img
            src={interiorImg}
            alt="VinFast Interior"
            className="w-full aspect-[21/9] object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />

          {/* Hotspot indicators */}
          <div className="absolute top-1/3 left-1/4 w-3 h-3 lg:w-4 lg:h-4 rounded-full bg-primary/80 animate-pulse-glow cursor-pointer" title="12.9-inch Infotainment" />
          <div className="absolute top-1/2 left-[45%] w-3 h-3 lg:w-4 lg:h-4 rounded-full bg-primary/80 animate-pulse-glow cursor-pointer" title="15.6-inch Touchscreen" />
          <div className="absolute bottom-1/3 right-1/3 w-3 h-3 lg:w-4 lg:h-4 rounded-full bg-primary/80 animate-pulse-glow cursor-pointer" title="Premium Leather Seats" />

          <div className="absolute bottom-6 left-6 right-6 lg:bottom-10 lg:left-10 lg:right-10 flex items-end justify-between">
            <div>
              <p className="font-display font-bold text-xl lg:text-2xl text-foreground">Premium Interior</p>
              <p className="text-foreground/50 text-sm">Handcrafted luxury meets intelligent design</p>
            </div>
            <div className="hidden md:flex gap-2">
              {["360° Exterior", "Interior Tour", "Color Studio"].map((label) => (
                <button key={label} className="glass-card-sm px-4 py-2 text-xs text-foreground/70 hover:text-foreground transition-colors">
                  {label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default VirtualShowroom;
