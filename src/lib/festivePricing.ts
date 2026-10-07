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

function compactPrice(s: string): string {
  return s.replace(/\s/g, "").toLowerCase();
}

/** CMS/API sometimes still stores MRP in priceFrom — never show that as the festive offer. */
function normalizeFestiveOffer(slug: FestivePriceSlug, rawOffer: string, listPrice: string): string {
  const defaults = FESTIVE_PRICE_DEFAULTS[slug];
  const offer = rawOffer.trim();
  if (!offer) return defaults.offer;
  const o = compactPrice(offer);
  const l = compactPrice(listPrice || defaults.list);
  if (o === l) return defaults.offer;
  if (slug === "mpv7" && (/24[,.]?49/.test(o) || o.includes("19.99lakh") || o.includes("1999lakh"))) {
    return defaults.offer;
  }
  if (slug === "limo-green" && /22[,.]?99/.test(o) && !/18[,.]?59/.test(o)) {
    return defaults.offer;
  }
  return offer;
}

function normalizeFestiveList(slug: FestivePriceSlug, rawList: string): string {
  const defaults = FESTIVE_PRICE_DEFAULTS[slug];
  const list = rawList.trim();
  if (!list) return defaults.list;
  const c = compactPrice(list);
  if (slug === "mpv7" && (/20[,.]?39/.test(c) || c.includes("19.99"))) return defaults.list;
  if (slug === "limo-green" && /18[,.]?59/.test(c)) return defaults.list;
  return list;
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
  const rawOffer =
    String(opts?.pricingRow?.priceFrom || "").trim() ||
    String(siteOffer || "").trim() ||
    defaults.offer;
  const rawList =
    String(opts?.pricingRow?.listPrice || "").trim() ||
    String(siteList || "").trim() ||
    defaults.list;
  const list = normalizeFestiveList(slug, rawList);
  const offer = normalizeFestiveOffer(slug, rawOffer, list);
  return { list, offer };
}
