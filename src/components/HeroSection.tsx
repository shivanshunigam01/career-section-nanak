import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import vf7Hero from "@/assets/vf7-hero.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-end pb-20 lg:pb-32 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={vf7Hero}
          alt="VinFast VF 7 Electric SUV"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-2xl"
        >
          <p className="text-primary font-display font-semibold text-sm uppercase tracking-[0.2em] mb-4">
            Bihar's First Authorized Dealer
          </p>
          <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-7xl leading-[1.05] mb-6">
            VinFast Electric
            <br />
            <span className="text-gradient-red">SUVs in Bihar</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-lg mb-8 leading-relaxed">
            Explore VF 6 and VF 7 with Patliputra Auto. Premium electric SUVs with 5-star safety, intelligent ADAS, and up to 450 km range.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/test-drive">
              <Button variant="hero" size="xl">
                Book Test Drive
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="heroOutline" size="xl">
                Get Best Offer
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-6 mt-8">
            <Link to="/models/vf7" className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4">
              View VF 7 →
            </Link>
            <Link to="/models/vf6" className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4">
              View VF 6 →
            </Link>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
            >
              WhatsApp Now →
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
