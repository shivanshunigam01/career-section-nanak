import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import interiorLuxuryRhd from "@/assets/interior-rhd-luxury.png";
import vf6Interior from "@/assets/interior.jpg";
import vf7Interior from "@/assets/slide-vf7-interior.png";
import mpv7Interior from "@/assets/mpv7-details/mpv7-dtl-interior-1.jpg";

const interiorModels = [
  {
    href: "/models/vf6",
    label: "VF 6",
    image: vf6Interior,
    alt: "VinFast VF 6 cabin — dashboard and seating",
    objectClass: "object-cover object-center",
  },
  {
    href: "/models/vf7",
    label: "VF 7",
    image: vf7Interior,
    alt: "VinFast VF 7 cabin — infotainment and cockpit",
    objectClass: "object-cover object-center",
  },
  {
    href: "/models/mpv7",
    label: "VF MPV 7",
    image: mpv7Interior,
    alt: "VinFast VF MPV 7 cabin — three-row interior",
    objectClass: "object-cover object-[center_45%]",
  },
] as const;

const VirtualShowroom = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-24 section-surface overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-12 lg:mb-14"
        >
          <p className="text-primary font-display font-semibold text-sm uppercase tracking-[0.2em] mb-3">
            Virtual Showroom
          </p>
          <h2 className="font-display font-bold text-3xl md:text-5xl mb-4">Step Inside Luxury</h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
            Premium materials, ambient lighting, and connected cockpits — tailored for right-hand drive.
          </p>
        </motion.div>

        {/* Lead interior — RHD showcase */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden shadow-luxury mb-8 sm:mb-10"
        >
          <img
            src={interiorLuxuryRhd}
            alt="VinFast premium interior — right-hand drive cockpit with digital cluster and portrait touchscreen"
            className="w-full aspect-[5/4] sm:aspect-[16/9] md:aspect-[21/9] object-cover object-center min-h-[200px] sm:min-h-0"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 lg:bottom-10 lg:left-10 lg:right-10">
            <p className="text-on-image-lg font-display font-bold text-lg sm:text-xl lg:text-2xl">Premium Interior</p>
            <p className="text-on-image-soft text-xs sm:text-sm mt-1">Handcrafted luxury meets intelligent design</p>
          </div>
        </motion.div>

        {/* Model cabins — interior photography only */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-8 sm:mb-10">
          {interiorModels.map((m, i) => (
            <motion.div
              key={m.href}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="group relative rounded-2xl overflow-hidden border border-border/60 bg-card/40 shadow-sm"
            >
              <Link to={m.href} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-2xl">
                <div className="relative aspect-[16/10] overflow-hidden bg-muted/30">
                  <img
                    src={m.image}
                    alt={m.alt}
                    className={`h-full w-full transition-[filter,transform] duration-500 group-hover:brightness-[1.05] group-hover:scale-[1.02] ${m.objectClass}`}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 flex items-end justify-between gap-2">
                    <p className="text-on-image-lg font-display font-bold text-base sm:text-lg">{m.label}</p>
                    <span className="shrink-0 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-gray-900 shadow-sm group-hover:bg-white">
                      View
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Single model picker — no duplicate banners */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center gap-4"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Explore models</p>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 w-full max-w-2xl">
            <Link to="/models/vf6" className="flex-1 min-w-[8.5rem] sm:flex-none">
              <Button variant="outline" size="lg" className="w-full rounded-full">
                VF 6
              </Button>
            </Link>
            <Link to="/models/vf7" className="flex-1 min-w-[8.5rem] sm:flex-none">
              <Button variant="default" size="lg" className="w-full rounded-full">
                VF 7
              </Button>
            </Link>
            <Link to="/models/mpv7" className="flex-1 min-w-[8.5rem] sm:flex-none">
              <Button variant="outline" size="lg" className="w-full rounded-full">
                VF MPV 7
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default VirtualShowroom;
