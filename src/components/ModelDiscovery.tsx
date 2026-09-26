import { useEffect, useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Battery,
  Gauge,
  Shield,
  Users,
  Zap,
  PlugZap,
  CarFront,
  Building2,
  Check,
} from "lucide-react";
import vf7FrontHero from "@/assets/vf7-model-discovery-upload.png";
import vf6DiscoveryHero from "@/assets/vf6-model-discovery-upload.png";
import mpv7Card from "@/assets/mpv7-gallery/mpv7-new.png";
import limoGreenCard from "@/assets/limo-green/modal-car.webp";
import { usePublicSite } from "@/context/PublicSiteContext";
import { hasApi } from "@/lib/apiConfig";
import { publicGet } from "@/lib/api";
import { useRefetchWhenVisible } from "@/hooks/useRefetchWhenVisible";
import { cn } from "@/lib/utils";

type Spec = { icon: typeof Battery | typeof Users; label: string; value: string };

type ModelStripe = "burgundy" | "green" | "steel" | "fleet";

type ModelCard = {
  name: string;
  tagline: string;
  price: string;
  image: string;
  href: string;
  specs: Spec[];
  category: string;
  segment: string;
  differentiator: string;
  stripe: ModelStripe;
  highlights: string[];
  imageFrame?: string;
};

const STRIPE_CLASS: Record<ModelStripe, string> = {
  burgundy: "model-card-stripe-burgundy",
  green: "model-card-stripe-green",
  steel: "model-card-stripe-steel",
  fleet: "model-card-stripe-fleet",
};

const BADGE_CLASS: Record<ModelStripe, string> = {
  burgundy: "bg-primary/90 text-primary-foreground",
  green: "bg-secondary/90 text-secondary-foreground",
  steel: "bg-accent/90 text-accent-foreground",
  fleet: "bg-amber-700/90 text-amber-50",
};

const BASE_MODELS: Omit<ModelCard, "price">[] = [
  {
    name: "VF 7",
    tagline: "Bold. Intelligent. Unstoppable.",
    image: vf7FrontHero,
    href: "/models/vf7",
    category: "Mid-size SUV",
    segment: "Flagship electric SUV",
    differentiator: "Largest battery · longest range in lineup",
    stripe: "burgundy",
    highlights: [
      "70 kWh battery · up to 532 km (MIDC) range",
      "Spacious 5-seat cabin with premium RHD layout",
      "DC fast charging for long highway days",
      "Advanced driver assistance & 5-star safety focus",
    ],
    specs: [
      { icon: Battery, label: "Battery", value: "70 kWh" },
      { icon: Gauge, label: "Range", value: "532 km" },
      { icon: Zap, label: "0–100", value: "5.8s" },
      { icon: PlugZap, label: "DC charge", value: "~25 min*" },
    ],
  },
  {
    name: "VF 6",
    tagline: "Compact. Smart. Electrifying.",
    image: vf6DiscoveryHero,
    href: "/models/vf6",
    category: "Compact SUV",
    segment: "City-smart electric SUV",
    differentiator: "Easier to park · lower entry price",
    stripe: "green",
    highlights: [
      "59.6 kWh battery · up to 468 km (MIDC) range",
      "Compact footprint for city streets & tight parking",
      "Connected cockpit with portrait infotainment",
      "Ideal first EV for families upgrading from ICE",
    ],
    specs: [
      { icon: Battery, label: "Battery", value: "59.6 kWh" },
      { icon: Gauge, label: "Range", value: "468 km" },
      { icon: Zap, label: "0–100", value: "10.4s" },
      { icon: CarFront, label: "Body", value: "Compact SUV" },
    ],
  },
  {
    name: "VF MPV 7",
    tagline: "Space. Seven seats. Electric.",
    image: mpv7Card,
    href: "/models/mpv7",
    category: "7-seat MPV",
    segment: "Family & leisure",
    differentiator: "Family MPV · lifestyle focus",
    stripe: "steel",
    imageFrame: "ring-2 ring-accent/40 ring-inset",
    highlights: [
      "60.13 kWh · up to 517 km (ARAI) for all seven seats",
      "Three-row seating with flexible luggage space",
      "Built for family trips, not chauffeur fleet duty",
      "Distinct exterior design vs Limo Green fleet trim",
    ],
    specs: [
      { icon: Battery, label: "Battery", value: "60.13 kWh" },
      { icon: Gauge, label: "Range", value: "517 km (ARAI)" },
      { icon: Users, label: "Seats", value: "7" },
      { icon: Shield, label: "Use case", value: "Family" },
    ],
  },
  {
    name: "Limo Green",
    tagline: "Built for your business.",
    image: limoGreenCard,
    href: "/models/limo-green",
    category: "7-seat MPV",
    segment: "Fleet & business",
    differentiator: "Fleet / chauffeur · business trim",
    stripe: "fleet",
    imageFrame: "ring-2 ring-amber-600/35 ring-inset",
    highlights: [
      "60.13 kWh · up to 450 km range (fleet planning)",
      "Seven seats tuned for chauffeur & corporate travel",
      "Lower running cost vs diesel MPV fleets",
      "Different positioning from VF MPV 7 family model",
    ],
    specs: [
      { icon: Battery, label: "Battery", value: "60.13 kWh" },
      { icon: Gauge, label: "Range", value: "450 km" },
      { icon: Building2, label: "Focus", value: "Fleet" },
      { icon: Users, label: "Seats", value: "7" },
    ],
  },
];

function slugMatchesHref(href: string, slug: string): boolean {
  const s = slug.toLowerCase();
  if (href.includes("limo-green")) return s.includes("limo");
  if (href.includes("mpv7")) return s.includes("mpv7") || s.includes("mpv") || s === "vf-mpv-7" || s.endsWith("mpv7");
  if (href.includes("vf7")) return s.includes("vf7") || s === "vf-7" || s.endsWith("vf7");
  if (href.includes("vf6")) return s.includes("vf6") || s === "vf-6" || s.endsWith("vf6");
  return false;
}

function mergeModels(
  base: Omit<ModelCard, "price">[],
  apiList: Record<string, unknown>[] | null,
  site: {
    vf7Price: string;
    vf6Price: string;
    mpv7Price: string;
    limoGreenPrice: string;
    vf7Range: string;
    vf6Range: string;
    mpv7Range: string;
    limoGreenRange: string;
  },
): ModelCard[] {
  return base.map((m) => {
    const api = apiList?.find((p) => slugMatchesHref(m.href, String(p.slug ?? "")));
    const sitePrice = m.href.includes("vf7")
      ? site.vf7Price
      : m.href.includes("mpv7")
        ? site.mpv7Price
        : m.href.includes("limo-green")
          ? site.limoGreenPrice
          : site.vf6Price;
    const siteRange = m.href.includes("mpv7")
      ? site.mpv7Range
      : m.href.includes("limo-green")
        ? site.limoGreenRange
        : m.href.includes("vf7")
          ? site.vf7Range
          : site.vf6Range;
    const price = api?.priceFrom ? String(api.priceFrom) : sitePrice;
    const image =
      api?.heroImage && String(api.heroImage).trim() ? String(api.heroImage) : m.image;
    const tagline = api?.tagline ? String(api.tagline) : m.tagline;
    const displayName = api?.name
      ? String(api.name).replace(/^VinFast\s*/i, "").trim() || m.name
      : m.name;
    const specs = m.specs.map((spec) => {
      if (spec.label !== "Range") return spec;
      if (m.href.includes("/models/vf6") || m.href.includes("/models/vf7")) return spec;
      return { ...spec, value: siteRange || spec.value };
    });
    return {
      ...m,
      name: displayName,
      tagline,
      price,
      image,
      specs,
    };
  });
}

const ModelDiscovery = () => {
  const { siteConfig } = usePublicSite();
  const [apiProducts, setApiProducts] = useState<Record<string, unknown>[] | null>(null);

  const loadProducts = useCallback(async () => {
    if (!hasApi()) return;
    const data = await publicGet<unknown[]>("/public/products");
    if (Array.isArray(data) && data.length > 0) {
      setApiProducts(data as Record<string, unknown>[]);
    }
  }, []);

  useEffect(() => {
    if (!hasApi()) return;
    void loadProducts();
  }, [loadProducts]);

  useRefetchWhenVisible(loadProducts, hasApi());

  const models = useMemo(
    () => mergeModels(BASE_MODELS, apiProducts, siteConfig),
    [apiProducts, siteConfig],
  );

  return (
    <section className="py-16 sm:py-24 lg:py-32 section-dark relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, hsl(207 38% 28% / 0.35), transparent 60%)",
        }}
      />
      <div className="container relative mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-16"
        >
          <p className="text-secondary font-display font-semibold text-sm uppercase tracking-[0.2em] mb-3">
            Our Models
          </p>
          <h2 className="font-display font-bold text-3xl md:text-5xl text-foreground">
            Choose Your Electric Future
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mt-4 text-sm sm:text-base leading-relaxed">
            Each model is built for a different need — compare segment, range, and seating at a glance
            so similar-looking MPVs are easy to tell apart.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 xl:grid-cols-2 gap-8 lg:gap-10 max-w-6xl mx-auto">
          {models.map((model, i) => (
            <motion.article
              key={model.href}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className={cn(
                "group relative rounded-3xl overflow-hidden border border-border/80 bg-card/95 hover:border-accent/40 transition-all duration-500 shadow-luxury",
                STRIPE_CLASS[model.stripe],
              )}
            >
              <div className={cn("relative aspect-[16/10] overflow-hidden bg-muted/40", model.imageFrame)}>
                <img
                  src={model.image}
                  alt={`VinFast ${model.name} — ${model.segment}`}
                  className={cn(
                    "w-full h-full object-cover transition-[filter,transform] duration-500 group-hover:brightness-[1.08] group-hover:scale-[1.02]",
                    model.href.includes("mpv7") ? " object-[48%_top]" : "",
                    model.href.includes("limo-green") ? " object-center saturate-[1.05]" : "",
                  )}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-md",
                      BADGE_CLASS[model.stripe],
                    )}
                  >
                    {model.category}
                  </span>
                </div>
                <p className="absolute bottom-3 left-3 right-3 text-xs sm:text-sm font-medium text-foreground/95 drop-shadow-md">
                  {model.differentiator}
                </p>
              </div>

              <div className="p-5 sm:p-6 lg:p-7">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4 mb-3">
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-accent mb-1">
                      {model.segment}
                    </p>
                    <h3 className="font-display font-bold text-xl sm:text-2xl lg:text-[1.65rem]">
                      {model.href.includes("mpv7") || model.href.includes("limo-green")
                        ? model.name
                        : `VinFast ${model.name}`}
                    </h3>
                    <p className="text-muted-foreground text-sm mt-1">{model.tagline}</p>
                  </div>
                  <div className="text-left sm:text-right shrink-0 rounded-xl border border-border/60 bg-background/40 px-3 py-2">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Ex-showroom from</p>
                    <p className="font-display font-bold text-base sm:text-lg text-primary tabular-nums">
                      {model.price}
                    </p>
                  </div>
                </div>

                <ul className="space-y-2 mb-5 text-sm text-muted-foreground">
                  {model.highlights.map((line) => (
                    <li key={line} className="flex gap-2 leading-snug">
                      <Check className="w-4 h-4 shrink-0 text-secondary mt-0.5" aria-hidden />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 mb-6">
                  {model.specs.map((spec) => {
                    const Icon = spec.icon;
                    return (
                      <div
                        key={spec.label}
                        className="text-center p-2.5 sm:p-3 rounded-xl bg-background/50 border border-border/50 min-w-0"
                      >
                        <Icon className="w-4 h-4 text-accent mx-auto mb-1 sm:mb-1.5 shrink-0" />
                        <p className="text-[9px] sm:text-[10px] text-muted-foreground leading-tight">
                          {spec.label}
                        </p>
                        <p className="text-xs sm:text-sm font-semibold font-display tabular-nums mt-0.5 break-words">
                          {spec.value}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link to={model.href} className="flex-1 min-w-0">
                    <Button variant="hero" className="w-full">
                      View full specs
                    </Button>
                  </Link>
                  <Link to="/test-drive" className="flex-1 min-w-0">
                    <Button variant="secondary" className="w-full">
                      Enquire
                    </Button>
                  </Link>
                  <Link to="/compare" className="shrink-0 sm:w-auto">
                    <Button variant="outline" className="h-10 w-full sm:w-auto min-w-[7rem] border-border/80">
                      Compare
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
        <p className="text-center text-[11px] text-muted-foreground/80 mt-8 max-w-xl mx-auto">
          * DC fast-charge time is indicative and depends on charger power and battery state. Confirm
          final specs and pricing with our Patna showroom team.
        </p>
      </div>
    </section>
  );
};

export default ModelDiscovery;
