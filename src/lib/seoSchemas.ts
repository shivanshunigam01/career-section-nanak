/**
 * schema.org JSON-LD builders used by public pages (mirrors backend
 * src/utils/seoSchema.js so page-level schemas stay consistent).
 */
import { absoluteUrl } from "./seo";

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  if (!faqs.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

/** Parses "₹18.19L*" style strings into rupees, or null. */
function parsePriceToNumber(priceStr?: string | null): number | null {
  if (!priceStr) return null;
  const match = String(priceStr).match(/([\d.]+)\s*(l|lakh|cr|crore)?/i);
  if (!match) return null;
  const value = parseFloat(match[1]);
  if (!Number.isFinite(value)) return null;
  const unit = (match[2] || "").toLowerCase();
  if (unit === "l" || unit === "lakh") return Math.round(value * 100000);
  if (unit === "cr" || unit === "crore") return Math.round(value * 10000000);
  return Math.round(value);
}

export function vehicleSchema(opts: {
  name: string;
  path: string;
  description: string;
  bodyType: string;
  seats: number;
  variants?: string[];
  price?: string | null;
  range?: string | null;
  image?: string;
}) {
  const priceNumber = parsePriceToNumber(opts.price);
  return {
    "@context": "https://schema.org",
    "@type": "Vehicle",
    name: opts.name,
    brand: { "@type": "Brand", name: "VinFast" },
    manufacturer: { "@type": "Organization", name: "VinFast Auto" },
    url: absoluteUrl(opts.path),
    description: opts.description,
    bodyType: opts.bodyType,
    seatingCapacity: opts.seats,
    fuelType: "Electric",
    vehicleEngine: { "@type": "EngineSpecification", fuelType: "Electric" },
    ...(opts.image ? { image: opts.image } : {}),
    ...(opts.range ? { additionalProperty: [{ "@type": "PropertyValue", name: "Certified range", value: opts.range }] } : {}),
    ...(opts.variants?.length ? { model: opts.variants.map((v) => `${opts.name} ${v}`) } : {}),
    ...(priceNumber
      ? {
          offers: {
            "@type": "Offer",
            price: priceNumber,
            priceCurrency: "INR",
            availability: "https://schema.org/InStock",
            seller: { "@type": "AutoDealer", name: "Patliputra VinFast" },
          },
        }
      : {}),
  };
}

export function articleSchema(opts: { headline: string; description: string; path: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.headline,
    description: opts.description,
    url: absoluteUrl(opts.path),
    author: { "@type": "Organization", name: "Patliputra VinFast" },
    publisher: { "@type": "Organization", name: "Patliputra VinFast" },
  };
}
