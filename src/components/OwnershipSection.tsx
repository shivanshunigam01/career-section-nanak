import { motion } from "framer-motion";
import { Plug, Home, Wrench, ShieldCheck } from "lucide-react";
import vf7Street from "@/assets/vf7-street.jpg";

const ownershipItems = [
  {
    icon: Plug,
    title: "Charging Made Simple",
    description: "Access to India's growing fast-charging network. Charge 10-70% in just 24 minutes.",
  },
  {
    icon: Home,
    title: "Home Charging",
    description: "Get a complimentary home charger installed. Charge overnight, wake up to 100%.",
  },
  {
    icon: Wrench,
    title: "Service & Support",
    description: "Dedicated service center in Patna with trained EV technicians and genuine parts.",
  },
  {
    icon: ShieldCheck,
    title: "Warranty & Peace of Mind",
    description: "Industry-leading warranty on battery, motor, and vehicle components.",
  },
];

const OwnershipSection = () => {
  return (
    <section className="py-24 lg:py-32 section-dark overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-primary font-display font-semibold text-sm uppercase tracking-[0.2em] mb-3">
              Ownership Confidence
            </p>
            <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl mb-8">
              Own the Future,
              <br />
              <span className="text-muted-foreground">Worry-Free</span>
            </h2>
            <div className="space-y-6">
              {ownershipItems.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold mb-1">{item.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="rounded-3xl overflow-hidden shadow-luxury">
              <img
                src={vf7Street}
                alt="VinFast VF 7 on Road"
                className="w-full h-full object-cover aspect-[4/3]"
                loading="lazy"
              />
            </div>
            {/* Floating stat card */}
            <div className="absolute -bottom-6 -left-4 glass-card p-5 hidden lg:block">
              <p className="font-display font-bold text-2xl text-primary">24 min</p>
              <p className="text-foreground/60 text-xs">Fast charge 10-70%</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default OwnershipSection;
