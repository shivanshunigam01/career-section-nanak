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

const FESTIVE_OFFER_RUPEES: Record<FestivePriceSlug, number> = {
  mpv7: 2039000,
  "limo-green": 1859000,
};

const LIST_RUPEES: Record<FestivePriceSlug, number> = {
  mpv7: 2449000,
  "limo-green": 2299000,
};

export function isFestivePricingSlug(slug: string): slug is FestivePriceSlug {
  return slug === "mpv7" || slug === "limo-green";
}

/** Parse ₹24,49,000*, ₹24.49L*, ₹24.49 Lakh* into integer rupees. */
export function parseIndianVehiclePriceToRupees(raw: string): number | null {
  const s = String(raw || "").trim().toLowerCase();
  if (!s) return null;
  const lakhMatch = s.match(/([\d.]+)\s*(?:lakh|lac)\b/) || s.match(/([\d.]+)\s*l\b/);
  if (lakhMatch) {
    const n = Number.parseFloat(lakhMatch[1]);
    return Number.isFinite(n) ? Math.round(n * 100_000) : null;
  }
  const digits = s.replace(/[^\d]/g, "");
  if (!digits) return null;
  const n = Number.parseInt(digits, 10);
  return Number.isFinite(n) ? n : null;
}

function near(a: number, b: number, tolerance = 15_000): boolean {
  return Math.abs(a - b) <= tolerance;
}

function isValidFestiveOffer(slug: FestivePriceSlug, rupees: number | null): boolean {
  if (rupees == null) return false;
  return near(rupees, FESTIVE_OFFER_RUPEES[slug], 25_000);
}

function isValidListPrice(slug: FestivePriceSlug, rupees: number | null): boolean {
  if (rupees == null) return false;
  return near(rupees, LIST_RUPEES[slug], 25_000);
}

export function resolveFestivePricing(
  slug: string,
  opts?: {
    pricingRow?: PublicVehiclePricing | null;
    siteConfig?: SiteConfigPublic | null;
  },
): FestivePricePair | null {
  if (!isFestivePricingSlug(slug)) return null;
  const canonical = FESTIVE_PRICE_DEFAULTS[slug];

  const siteOffer =
    slug === "mpv7" ? opts?.siteConfig?.mpv7Price : opts?.siteConfig?.limoGreenPrice;
  const siteList =
    slug === "mpv7" ? opts?.siteConfig?.mpv7ListPrice : opts?.siteConfig?.limoGreenListPrice;

  const rawOffer =
    String(opts?.pricingRow?.priceFrom || "").trim() ||
    String(siteOffer || "").trim();
  const rawList =
    String(opts?.pricingRow?.listPrice || "").trim() ||
    String(siteList || "").trim();

  const offerRupees = parseIndianVehiclePriceToRupees(rawOffer);
  const listRupees = parseIndianVehiclePriceToRupees(rawList);

  let list = canonical.list;
  if (isValidListPrice(slug, listRupees)) {
    list = rawList;
  }

  let offer = canonical.offer;
  if (
    isValidFestiveOffer(slug, offerRupees) &&
    listRupees != null &&
    offerRupees != null &&
    offerRupees < listRupees - 10_000
  ) {
    offer = rawOffer;
  } else if (
    isValidFestiveOffer(slug, offerRupees) &&
    (listRupees == null || offerRupees! < LIST_RUPEES[slug] - 10_000)
  ) {
    offer = rawOffer;
  }

  // CMS often stores MRP as ₹24.49L* in the offer field — same value as list, different format.
  const listN = parseIndianVehiclePriceToRupees(list) ?? LIST_RUPEES[slug];
  const offerN = parseIndianVehiclePriceToRupees(offer) ?? offerRupees;
  if (offerN == null || offerN >= listN - 10_000) {
    offer = canonical.offer;
  }
  if (!isValidListPrice(slug, parseIndianVehiclePriceToRupees(list))) {
    list = canonical.list;
  }

  return { list, offer };
}
