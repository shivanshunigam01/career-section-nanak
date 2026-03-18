import { motion } from "framer-motion";
import interiorImg from "@/assets/interior.jpg";

const VirtualShowroom = () => {
  return (
    <section className="py-24 lg:py-32 section-surface">
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
            Experience the premium craftsmanship and cutting-edge technology of VinFast interiors.
          </p>
        </motion.div>

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
          <div className="absolute top-1/3 left-1/4 w-4 h-4 rounded-full bg-primary/80 animate-pulse-glow cursor-pointer" title="12.9-inch Infotainment" />
          <div className="absolute top-1/2 left-[45%] w-4 h-4 rounded-full bg-primary/80 animate-pulse-glow cursor-pointer" title="15.6-inch Touchscreen" />
          <div className="absolute bottom-1/3 right-1/3 w-4 h-4 rounded-full bg-primary/80 animate-pulse-glow cursor-pointer" title="Premium Leather Seats" />

          <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between">
            <div>
              <p className="font-display font-bold text-xl text-foreground">Premium Interior</p>
              <p className="text-foreground/60 text-sm">Handcrafted luxury meets intelligent design</p>
            </div>
            <div className="flex gap-3">
              <button className="glass-card-sm px-4 py-2 text-sm text-foreground/80 hover:text-foreground transition-colors">
                360° Exterior
              </button>
              <button className="glass-card-sm px-4 py-2 text-sm text-foreground/80 hover:text-foreground transition-colors">
                Interior Tour
              </button>
              <button className="glass-card-sm px-4 py-2 text-sm text-foreground/80 hover:text-foreground transition-colors">
                Color Studio
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default VirtualShowroom;
