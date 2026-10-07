import type { PublicVehiclePricing } from "@/hooks/usePublicPricing";
import type { SiteConfigPublic } from "@/context/PublicSiteContext";

export type FestivePriceSlug = "mpv7" | "limo-green";

export type FestivePricePair = {
  list: string;
  offer: string;
};

/** Campaign list (MRP) and festive offer — single source of truth for public UI. */
export const FESTIVE_PRICE_DEFAULTS: Record<FestivePriceSlug, FestivePricePair> = {
  mpv7: { list: "₹24,49,000*", offer: "₹20,39,000*" },
  "limo-green": { list: "₹22,99,000*", offer: "₹18,59,000*" },
};

export function isFestivePricingSlug(slug: string): slug is FestivePriceSlug {
  return slug === "mpv7" || slug === "limo-green";
}

export function festiveSlugFromHref(href: string): FestivePriceSlug | null {
  if (href.includes("/models/mpv7")) return "mpv7";
  if (href.includes("limo-green")) return "limo-green";
  return null;
}

/** Parse ₹24,49,000*, ₹24.49L*, ₹24.49 Lakh* into integer rupees. */
export function parseIndianVehiclePriceToRupees(raw: string): number | null {
  const s = String(raw || "").trim().toLowerCase();
  if (!s) return null;
  const lakhMatch =
    s.match(/([\d.]+)\s*(?:lakh|lac)\b/) ||
    s.match(/([\d.]+)\s*l\*/) ||
    s.match(/([\d.]+)\s*l\b/);
  if (lakhMatch) {
    const n = Number.parseFloat(lakhMatch[1]);
    return Number.isFinite(n) ? Math.round(n * 100_000) : null;
  }
  const digits = s.replace(/[^\d]/g, "");
  if (!digits) return null;
  const n = Number.parseInt(digits, 10);
  return Number.isFinite(n) ? n : null;
}

/** Homepage + model pages: always show fixed campaign prices (ignore CMS Lakh duplicates). */
export function resolveFestivePricing(
  slug: string,
  _opts?: {
    pricingRow?: PublicVehiclePricing | null;
    siteConfig?: SiteConfigPublic | null;
  },
): FestivePricePair | null {
  if (!isFestivePricingSlug(slug)) return null;
  return { ...FESTIVE_PRICE_DEFAULTS[slug] };
}
