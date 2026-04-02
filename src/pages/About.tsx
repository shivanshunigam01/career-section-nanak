import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import { Award, Users, Target, Globe } from "lucide-react";
import patliputraVinfastHero from "@/assets/patliputra-vinfast-about-hero.png";
import vf8Convoy from "@/assets/vf8-convoy.jpg";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-end pb-14 pt-16 lg:pt-20">
        <div className="absolute inset-0">
          <img src={patliputraVinfastHero} alt="Patliputra Auto × VinFast" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />
        </div>
        <div className="relative container mx-auto px-4 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="text-primary font-display font-semibold text-sm uppercase tracking-[0.25em] mb-3">About Us</p>
            <h1 className="font-display font-bold text-4xl md:text-6xl lg:text-7xl text-white leading-tight mb-3">
              Patliputra Auto<br className="hidden sm:block" /> × VinFast
            </h1>
            <p className="text-white/75 text-base md:text-lg max-w-xl">
              Bihar's first authorized VinFast dealer — bringing electric excellence to your doorstep.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-foreground/60 text-lg leading-relaxed max-w-3xl mx-auto text-center mb-20">
            Bihar's first and authorized VinFast dealer. Backed by Patliputra Group's legacy of trust, we bring Vietnam's leading electric vehicle brand to the heart of India.
          </motion.p>

          {/* Stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {[
              { icon: Award, value: "25+", label: "Years of Trust" },
              { icon: Users, value: "5,000+", label: "Happy Customers" },
              { icon: Globe, value: "Bihar", label: "State Coverage" },
              { icon: Target, value: "#1", label: "EV Dealer in Bihar" },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="glass-card-sm p-8 text-center">
                  <Icon className="w-8 h-8 text-primary mx-auto mb-4" />
                  <p className="font-display font-bold text-3xl mb-1">{stat.value}</p>
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Image + Text */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="rounded-3xl overflow-hidden shadow-luxury">
              <img src={vf8Convoy} alt="VinFast Fleet" className="w-full aspect-[4/3] object-cover" />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-6">
              <div>
                <h2 className="font-display font-bold text-2xl mb-4">About VinFast</h2>
                <p className="text-muted-foreground leading-relaxed">
                  VinFast is Vietnam's leading automotive manufacturer, part of Vingroup — one of Southeast Asia's largest conglomerates. With a mission to make electric vehicles accessible to everyone, VinFast combines cutting-edge technology, world-class safety, and premium design at competitive prices.
                </p>
              </div>
              <div>
                <h2 className="font-display font-bold text-2xl mb-4">About Patliputra Auto</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Patliputra Auto is Bihar's most trusted automotive group with 25+ years serving customers across the state with brands like JCB, Ashok Leyland, and Switch EV. As VinFast's authorized dealer for Bihar, we bring the same commitment to excellence and after-sales support.
                </p>
              </div>
              <div>
                <h2 className="font-display font-bold text-2xl mb-4">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To make Bihar's electric vehicle transition seamless, premium, and accessible. Every family deserves safe, intelligent, and sustainable mobility.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
      <StickyMobileCTA />
    </div>
  );
};

export default AboutPage;
