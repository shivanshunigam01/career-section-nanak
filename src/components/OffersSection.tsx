import { useMemo } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { hasApi } from "@/lib/apiConfig";
import { useRefetchWhenVisible } from "@/hooks/useRefetchWhenVisible";
import { usePublicOffers } from "@/hooks/usePublicOffers";
import { OfferMedia, offerMediaTypeFromApi } from "@/components/OfferMedia";

type OfferCard = {
  id: string;
  title: string;
  description: string;
  badge: string | null;
  model: string | null;
  validTill: string | null;
  mediaUrl: string;
  mediaType: ReturnType<typeof offerMediaTypeFromApi>;
  ctaLabel: string;
  ctaLink: string;
};

function formatValidTill(raw: unknown): string | null {
  if (!raw) return null;
  const d = new Date(String(raw));
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function mapOffersFromApi(raw: Record<string, unknown>[]): OfferCard[] {
  return raw.map((o, i) => ({
    id: String(o._id ?? `offer-${i}`),
    title: String(o.title ?? "Offer"),
    description: String(o.description ?? ""),
    badge: o.type ? String(o.type) : null,
    model: o.model ? String(o.model) : null,
    validTill: formatValidTill(o.validTill),
    mediaUrl: String(o.imageUrl ?? ""),
    mediaType: offerMediaTypeFromApi(o.mediaType ?? (String(o.imageUrl ?? "").toLowerCase().endsWith(".gif") ? "gif" : "image")),
    ctaLabel: String(o.ctaLabel ?? "Know more"),
    ctaLink: String(o.ctaLink ?? "/contact"),
  }));
}

function OfferCtaLink({ to, label }: { to: string; label: string }) {
  const isExternal = /^https?:\/\//i.test(to);
  if (isExternal) {
    return (
      <a href={to} target="_blank" rel="noopener noreferrer" className="inline-flex w-full">
        <Button variant="hero" size="sm" className="w-full mt-4">{label}</Button>
      </a>
    );
  }
  return (
    <Button variant="hero" size="sm" className="w-full mt-4" asChild>
      <Link to={to.startsWith("/") ? to : `/${to}`}>{label}</Link>
    </Button>
  );
}

const OffersSection = () => {
  const { offers: rawOffers, loaded, hasOffers, reload } = usePublicOffers();

  useRefetchWhenVisible(reload, hasApi());

  const list = useMemo(() => mapOffersFromApi(rawOffers), [rawOffers]);

  if (loaded && !hasOffers) {
    return null;
  }

  return (
    <section id="offers" className="py-16 sm:py-24 lg:py-32 section-dark scroll-mt-20">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-14"
        >
          <p className="text-primary font-display font-semibold text-sm uppercase tracking-[0.2em] mb-3 flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4" />
            Limited time
          </p>
          <h2 className="font-display font-bold text-3xl md:text-5xl">Exclusive offers</h2>
          <p className="mt-3 max-w-2xl mx-auto text-muted-foreground text-sm sm:text-base">
            Current deals from Patliputra VinFast — exchange benefits, finance, and launch promotions.
          </p>
        </motion.div>

        {loaded && hasOffers && (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {list.map((offer, i) => (
              <motion.article
                key={offer.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card/40 shadow-lg shadow-black/10 backdrop-blur-sm transition hover:border-primary/30 hover:shadow-primary/5"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-secondary/20">
                  <OfferMedia
                    url={offer.mediaUrl}
                    mediaType={offer.mediaType}
                    title={offer.title}
                    className="h-full w-full transition duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  {offer.badge && (
                    <span className="absolute top-3 right-3 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow">
                      {offer.badge}
                    </span>
                  )}
                  {offer.model && offer.model !== "All Models" && (
                    <span className="absolute bottom-3 left-3 rounded-md bg-black/55 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                      {offer.model}
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <h3 className="font-display text-xl font-semibold leading-snug text-foreground">{offer.title}</h3>
                  {offer.validTill && (
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-primary/90">
                      <CalendarDays className="h-3.5 w-3.5" />
                      Valid till {offer.validTill}
                    </p>
                  )}
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{offer.description}</p>
                  <OfferCtaLink to={offer.ctaLink} label={offer.ctaLabel} />
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {!loaded && hasApi() && (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 animate-pulse">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-[22rem] rounded-2xl bg-foreground/[0.06]" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default OffersSection;
