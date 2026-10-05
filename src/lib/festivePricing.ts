import type { PublicVehiclePricing } from "@/hooks/usePublicPricing";
import type { SiteConfigPublic } from "@/context/PublicSiteContext";

export type FestivePriceSlug = "mpv7" | "limo-green";

export type FestivePricePair = {
  list: string;
  offer: string;
};

/** Default ex-showroom (struck through) and festive offer prices. */
export const FESTIVE_PRICE_DEFAULTS: Record<FestivePriceSlug, FestivePricePair> = {
  mpv7: { list: "₹24,49,000*", offer: "₹20,39,000*" },
  "limo-green": { list: "₹22,99,000*", offer: "₹18,59,000*" },
};

export function isFestivePricingSlug(slug: string): slug is FestivePriceSlug {
  return slug === "mpv7" || slug === "limo-green";
}

export function resolveFestivePricing(
  slug: string,
  opts?: {
    pricingRow?: PublicVehiclePricing | null;
    siteConfig?: SiteConfigPublic | null;
  },
): FestivePricePair | null {
  if (!isFestivePricingSlug(slug)) return null;
  const defaults = FESTIVE_PRICE_DEFAULTS[slug];
  const siteOffer =
    slug === "mpv7" ? opts?.siteConfig?.mpv7Price : opts?.siteConfig?.limoGreenPrice;
  const siteList =
    slug === "mpv7" ? opts?.siteConfig?.mpv7ListPrice : opts?.siteConfig?.limoGreenListPrice;
  const offer =
    String(opts?.pricingRow?.priceFrom || "").trim() ||
    String(siteOffer || "").trim() ||
    defaults.offer;
  const list =
    String(opts?.pricingRow?.listPrice || "").trim() ||
    String(siteList || "").trim() ||
    defaults.list;
  return { list, offer };
}
