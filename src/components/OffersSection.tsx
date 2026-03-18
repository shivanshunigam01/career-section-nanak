import { motion } from "framer-motion";
import { Gift, Repeat, Sparkles, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const offers = [
  {
    icon: Sparkles,
    title: "Bihar Launch Offer",
    description: "Exclusive launch benefits worth ₹2.5 Lakh on VF 6 & VF 7. Limited time only.",
    badge: "NEW",
  },
  {
    icon: Repeat,
    title: "Exchange Bonus",
    description: "Get up to ₹1.5 Lakh additional exchange value when you upgrade to VinFast.",
    badge: "POPULAR",
  },
  {
    icon: Tag,
    title: "Early Booking Benefit",
    description: "Reserve your VinFast today with just ₹21,000 and lock in launch pricing.",
    badge: null,
  },
  {
    icon: Gift,
    title: "Corporate Special",
    description: "Special fleet pricing and benefits for corporate and bulk buyers in Bihar.",
    badge: null,
  },
];

const OffersSection = () => {
  return (
    <section className="py-24 lg:py-32 section-dark">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-primary font-display font-semibold text-sm uppercase tracking-[0.2em] mb-3">
            Limited Time
          </p>
          <h2 className="font-display font-bold text-3xl md:text-5xl">
            Exclusive Offers
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {offers.map((offer, i) => {
            const Icon = offer.icon;
            return (
              <motion.div
                key={offer.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card-sm p-6 relative group hover:bg-foreground/[0.04] transition-colors"
              >
                {offer.badge && (
                  <span className="absolute top-4 right-4 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                    {offer.badge}
                  </span>
                )}
                <Icon className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-display font-semibold text-lg mb-2">{offer.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{offer.description}</p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link to="/contact">
            <Button variant="hero" size="lg">
              Claim Your Offer
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default OffersSection;
