import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Gift, Repeat, Sparkles, Tag, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { hasApi } from "@/lib/apiConfig";
import { publicGet } from "@/lib/api";

const ICONS: LucideIcon[] = [Sparkles, Repeat, Tag, Gift];

type OfferCard = {
  icon: LucideIcon;
  title: string;
  description: string;
  badge: string | null;
};

const FALLBACK_OFFERS: OfferCard[] = [
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

function mapOffersFromApi(raw: Record<string, unknown>[]): OfferCard[] {
  return raw.map((o, i) => ({
    icon: ICONS[i % ICONS.length],
    title: String(o.title ?? "Offer"),
    description: String(o.description ?? ""),
    badge: o.type ? String(o.type) : null,
  }));
}

const OffersSection = () => {
  const [offers, setOffers] = useState<OfferCard[]>(FALLBACK_OFFERS);

  useEffect(() => {
    if (!hasApi()) return;
    let cancelled = false;
    (async () => {
      const data = await publicGet<unknown[]>("/public/offers");
      if (cancelled || !Array.isArray(data) || data.length === 0) return;
      setOffers(mapOffersFromApi(data as Record<string, unknown>[]));
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const list = useMemo(() => (offers.length ? offers : FALLBACK_OFFERS), [offers]);

  return (
    <section className="py-16 sm:py-24 lg:py-32 section-dark">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-16"
        >
          <p className="text-primary font-display font-semibold text-sm uppercase tracking-[0.2em] mb-3">
            Limited Time
          </p>
          <h2 className="font-display font-bold text-3xl md:text-5xl">
            Exclusive Offers
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {list.map((offer, i) => {
            const Icon = offer.icon;
            return (
              <motion.div
                key={`${offer.title}-${i}`}
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
