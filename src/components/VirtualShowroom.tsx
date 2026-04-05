import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import interiorImg from "@/assets/interior.jpg";
import slideVf6Vf7Night from "@/assets/slide-vf6-vf7-night.png";
import vf7Real from "@/assets/vf7-real.png";
import vf6Card from "@/assets/vf6-banner.png";
import mpv7Hero from "@/assets/mpv7-gallery/mpv7-hero.png";

const VirtualShowroom = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-24 section-surface overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-12 lg:mb-16"
        >
          <p className="text-primary font-display font-semibold text-sm uppercase tracking-[0.2em] mb-3">
            Virtual Showroom
          </p>
          <h2 className="font-display font-bold text-3xl md:text-5xl mb-4">
            Step Inside Luxury
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Experience the premium craftsmanship and cutting-edge technology of the VF 6, VF 7, and seven-seat VF MPV 7.
          </p>
        </motion.div>

        {/* Premium Interior */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden shadow-luxury mb-8"
        >
          <img
            src={interiorImg}
            alt="VinFast Premium Interior"
            className="w-full aspect-[5/4] sm:aspect-[16/9] md:aspect-[21/9] object-cover min-h-[200px] sm:min-h-0"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 lg:bottom-10 lg:left-10 lg:right-10">
            <p className="text-on-image-lg font-display font-bold text-lg sm:text-xl lg:text-2xl">Premium Interior</p>
            <p className="text-on-image-soft text-xs sm:text-sm mt-1">Handcrafted luxury meets intelligent design</p>
          </div>
        </motion.div>

        {/* Individual model cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* VF 7 card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden shadow-luxury group"
          >
            <img
              src={vf7Real}
              alt="VinFast VF 7"
              className="w-full aspect-[16/10] object-cover transition-[filter] duration-500 group-hover:brightness-[1.06]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-6 sm:right-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-on-image-lg font-display font-bold text-lg sm:text-xl">VinFast VF 7</p>
                <p className="text-on-image-soft text-xs sm:text-sm">349 HP · 431 km · AWD · 5-Star</p>
              </div>
              <Link to="/models/vf7">
                <Button variant="hero" size="sm" className="w-full sm:w-auto">View Model</Button>
              </Link>
            </div>
          </motion.div>

          {/* VF 6 card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden shadow-luxury group"
          >
            <img
              src={vf6Card}
              alt="VinFast VF 6"
              className="w-full aspect-[16/10] object-cover transition-[filter] duration-500 group-hover:brightness-[1.06]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-6 sm:right-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-on-image-lg font-display font-bold text-lg sm:text-xl">VinFast VF 6</p>
                <p className="text-on-image-soft text-xs sm:text-sm">201 HP · 381 km · FWD · 5-Star</p>
              </div>
              <Link to="/models/vf6">
                <Button variant="hero" size="sm" className="w-full sm:w-auto">View Model</Button>
              </Link>
            </div>
          </motion.div>

          {/* VF MPV 7 card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden shadow-luxury group md:col-span-2 lg:col-span-1"
          >
            <img
              src={mpv7Hero}
              alt="VinFast VF MPV 7"
              className="w-full aspect-[16/10] object-cover object-[center_42%] transition-[filter] duration-500 group-hover:brightness-[1.06]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-6 sm:right-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-on-image-lg font-display font-bold text-lg sm:text-xl">VinFast VF MPV 7</p>
                <p className="text-on-image-soft text-xs sm:text-sm">7 seats · 450 km (NEDC) · 75.3 kWh · Bookings open</p>
              </div>
              <Link to="/models/mpv7">
                <Button variant="hero" size="sm" className="w-full sm:w-auto">View Model</Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* VF 6 & VF 7 — dual banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden shadow-luxury"
        >
          <img
            src={slideVf6Vf7Night}
            alt="VinFast VF 6 and VF 7"
            className="w-full aspect-[5/4] sm:aspect-[16/9] md:aspect-[21/9] object-cover min-h-[200px] sm:min-h-0"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 lg:bottom-10 lg:left-10 lg:right-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-on-image-lg font-display font-bold text-lg sm:text-xl lg:text-3xl">VF 6 · VF 7 · VF MPV 7</p>
              <p className="text-on-image-soft text-xs sm:text-sm lg:text-base mt-1">Electric SUVs and a seven-seat MPV. One authorised dealer in Bihar.</p>
            </div>
            <div className="flex flex-wrap gap-1.5 md:gap-2">
              <Link to="/models/vf6">
                <Button variant="heroWhite" size="sm" className="w-full sm:w-auto shadow-md">
                  Explore VF 6
                </Button>
              </Link>
              <Link to="/models/vf7">
                <Button variant="hero" size="sm" className="w-full sm:w-auto shadow-md">
                  Explore VF 7
                </Button>
              </Link>
              <Link to="/models/mpv7">
                <Button variant="outline" size="sm" className="w-full sm:w-auto shadow-md border-white/80 bg-black/30 text-white hover:bg-black/45">
                  Explore VF MPV 7
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default VirtualShowroom;
