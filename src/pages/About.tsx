import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import { Award, Users, Target, Globe } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20 lg:pt-32 lg:pb-32">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto text-center mb-20">
            <p className="text-primary font-display font-semibold text-sm uppercase tracking-[0.2em] mb-3">About Us</p>
            <h1 className="font-display font-bold text-4xl md:text-5xl mb-6">Patliputra Auto × VinFast</h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Bihar's first and authorized VinFast dealer. Backed by Patliputra Group's legacy of trust, we bring Vietnam's leading electric vehicle brand to the heart of India.
            </p>
          </motion.div>

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

          {/* About VinFast */}
          <div className="max-w-3xl mx-auto space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="font-display font-bold text-2xl mb-4">About VinFast</h2>
              <p className="text-muted-foreground leading-relaxed">
                VinFast is Vietnam's leading automotive manufacturer, part of Vingroup — one of Southeast Asia's largest conglomerates. With a mission to make electric vehicles accessible to everyone, VinFast combines cutting-edge technology, world-class safety, and premium design at competitive prices.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="font-display font-bold text-2xl mb-4">About Patliputra Auto</h2>
              <p className="text-muted-foreground leading-relaxed">
                Patliputra Auto is Bihar's most trusted automotive group, serving customers across the state for over 25 years with brands like JCB, Ashok Leyland, and Switch EV. As VinFast's authorized dealer for Bihar, we bring the same commitment to excellence, customer service, and after-sales support that has defined our legacy.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="font-display font-bold text-2xl mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                To make Bihar's electric vehicle transition seamless, premium, and accessible. We believe every family deserves safe, intelligent, and sustainable mobility — and that's exactly what VinFast delivers.
              </p>
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
