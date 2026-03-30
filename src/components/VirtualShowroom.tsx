import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import interiorImg from "@/assets/interior.jpg";
import slideVf6Vf7Night from "@/assets/slide-vf6-vf7-night.png";
import vf7Real from "@/assets/vf7-real.png";
import vf6Banner from "@/assets/vf6-banner.webp";

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
            Experience the premium craftsmanship and cutting-edge technology of the VF 6 & VF 7.
          </p>
        </motion.div>

        {/* VF 6 & VF 7 together — hero banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden shadow-luxury mb-8"
        >
          <img
            src={slideVf6Vf7Night}
            alt="VinFast VF 6 and VF 7"
            className="w-full aspect-[21/9] object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 lg:bottom-10 lg:left-10 lg:right-10 flex items-end justify-between">
            <div>
              <p className="font-display font-bold text-xl lg:text-3xl text-foreground">VF 6 & VF 7</p>
              <p className="text-foreground/60 text-sm lg:text-base mt-1">Two bold electric SUVs. One authorised dealer in Bihar.</p>
            </div>
            <div className="hidden md:flex gap-3">
              <Link to="/models/vf6">
                <Button variant="outline" size="sm" className="backdrop-blur-sm">Explore VF 6</Button>
              </Link>
              <Link to="/models/vf7">
                <Button variant="hero" size="sm">Explore VF 7</Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Individual model cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
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
              className="w-full aspect-[16/10] object-cover group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent" />
            <div className="absolute bottom-5 left-6 right-6 flex items-end justify-between">
              <div>
                <p className="font-display font-bold text-xl text-foreground">VinFast VF 7</p>
                <p className="text-foreground/60 text-sm">349 HP · 431 km · AWD · 5-Star</p>
              </div>
              <Link to="/models/vf7">
                <Button variant="hero" size="sm">View Model</Button>
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
              src={vf6Banner}
              alt="VinFast VF 6"
              className="w-full aspect-[16/10] object-cover group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent" />
            <div className="absolute bottom-5 left-6 right-6 flex items-end justify-between">
              <div>
                <p className="font-display font-bold text-xl text-foreground">VinFast VF 6</p>
                <p className="text-foreground/60 text-sm">201 HP · 381 km · FWD · 5-Star</p>
              </div>
              <Link to="/models/vf6">
                <Button variant="hero" size="sm">View Model</Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Interior banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden shadow-luxury"
        >
          <img
            src={interiorImg}
            alt="VinFast Premium Interior"
            className="w-full aspect-[21/9] object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 lg:bottom-10 lg:left-10 lg:right-10">
            <p className="font-display font-bold text-xl lg:text-2xl text-foreground">Premium Interior</p>
            <p className="text-foreground/60 text-sm mt-1">Handcrafted luxury meets intelligent design</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default VirtualShowroom;
