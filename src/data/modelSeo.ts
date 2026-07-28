/**
 * Per-model SEO config (titles, descriptions, keyword strategy, JSON-LD)
 * following the Bihar keyword map: primary + variant + local + intent keywords.
 */
import type { PageSeo } from "@/lib/seo";
import { breadcrumbSchema, faqSchema, vehicleSchema } from "@/lib/seoSchemas";

function modelPageSeo(opts: {
  path: string;
  name: string;
  title: string;
  description: string;
  bodyType: string;
  seats: number;
  variants: string[];
  price?: string;
  range?: string;
  keywords: string[];
  faqs: { question: string; answer: string }[];
}): PageSeo {
  return {
    title: opts.title,
    description: opts.description,
    keywords: opts.keywords,
    canonicalPath: opts.path,
    ogType: "product",
    schemas: [
      vehicleSchema({
        name: opts.name,
        path: opts.path,
        description: opts.description,
        bodyType: opts.bodyType,
        seats: opts.seats,
        variants: opts.variants,
        price: opts.price,
        range: opts.range,
      }),
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: opts.name, path: opts.path },
      ]),
      faqSchema(opts.faqs),
    ].filter(Boolean) as object[],
  };
}

export const VF6_SEO: PageSeo = modelPageSeo({
  path: "/models/vf6",
  name: "VinFast VF6",
  title: "VinFast VF6 Price in Bihar | Electric SUV — Patliputra VinFast",
  description:
    "VinFast VF6 electric SUV in Bihar — Earth, Wind & Wind Infinity variants, up to 468 km MIDC range, DC fast charging. Price, specs, booking & test drive in Patna.",
  bodyType: "Electric SUV",
  seats: 5,
  variants: ["Earth", "Wind", "Wind Infinity"],
  price: "₹18.19L",
  range: "468 km (MIDC)",
  keywords: [
    "VinFast VF6",
    "VinFast VF6 Price Bihar",
    "VinFast VF6 Price Patna",
    "Buy VinFast VF6",
    "VinFast VF6 Booking",
    "VinFast VF6 Test Drive",
    "VinFast VF6 Review",
    "VinFast VF6 Range",
    "VinFast VF6 Specifications",
    "VinFast VF6 Earth",
    "VinFast VF6 Wind",
    "VinFast VF6 Wind Infinity",
    "Best Electric SUV under 20 lakh",
    "Premium Electric SUV Bihar",
    "Family Electric SUV",
  ],
  faqs: [
    {
      question: "What is the driving range of the VinFast VF6?",
      answer:
        "The VinFast VF6 delivers up to 468 km MIDC certified range on the Earth variant and 463 km on Wind and Wind Infinity, powered by a 59.6 kWh usable battery.",
    },
    {
      question: "Does the VinFast VF6 support DC fast charging?",
      answer:
        "Yes. The VF6 supports DC fast charging up to 100 kW, taking the battery from 10% to 70% in about 25 minutes.",
    },
    {
      question: "What variants is the VinFast VF6 available in?",
      answer:
        "The VF6 comes in three variants — Earth, Wind and Wind Infinity. Wind adds ADAS, 7 airbags and a panoramic roof; Wind Infinity extends ADAS with AEB, FCW, RCTA and driver monitoring.",
    },
    {
      question: "Where can I test drive the VinFast VF6 in Bihar?",
      answer:
        "Book a free test drive at Patliputra VinFast, Bihar's authorised VinFast dealership in Patna (NH 30, Bypass Road). Home test drives are available across Patna — book online in under a minute.",
    },
  ],
});

export const VF7_SEO: PageSeo = modelPageSeo({
  path: "/models/vf7",
  name: "VinFast VF7",
  title: "VinFast VF7 Price in Bihar | Premium Electric SUV with ADAS",
  description:
    "VinFast VF7 premium electric SUV in Bihar — Earth, Wind, Wind Infinity, Sky & Sky Infinity variants with ADAS, panoramic roof & connected tech. Book a test drive in Patna.",
  bodyType: "Premium Electric SUV",
  seats: 5,
  variants: ["Earth", "Wind", "Wind Infinity", "Sky", "Sky Infinity"],
  range: "450 km (MIDC)",
  keywords: [
    "VinFast VF7",
    "VinFast VF7 Price",
    "VinFast VF7 Bihar",
    "VinFast VF7 Booking",
    "VinFast VF7 Test Drive",
    "VinFast VF7 Review",
    "VinFast VF7 Range",
    "VinFast VF7 ADAS",
    "VinFast VF7 Interior",
    "VF7 Earth",
    "VF7 Wind",
    "VF7 Sky",
    "VF7 Sky Infinity",
    "Premium Electric SUV India",
    "Luxury EV SUV",
    "ADAS Electric SUV",
    "Electric SUV with panoramic roof",
  ],
  faqs: [
    {
      question: "What is the difference between VF7 Earth, Wind and Sky variants?",
      answer:
        "Earth is the value-focused entry; Wind adds premium comfort, connectivity and core ADAS; Sky and Sky Infinity sit at the top with dual-motor AWD performance and the full advanced driver-assistance suite.",
    },
    {
      question: "Which VinFast VF7 variant offers ADAS?",
      answer:
        "ADAS features begin from the Wind variant, with the most complete suite — including highway assist and driver monitoring — on Sky and Sky Infinity.",
    },
    {
      question: "Does the VinFast VF7 support OTA updates?",
      answer:
        "Yes, the VF7 receives over-the-air software updates for infotainment and vehicle features, plus a connected smart-app suite.",
    },
    {
      question: "Can I book a VinFast VF7 test drive online in Bihar?",
      answer:
        "Yes — book online at Patliputra VinFast and choose showroom or doorstep test drive slots in Patna. Our team confirms your slot the same day.",
    },
  ],
});

export const MPV7_SEO: PageSeo = modelPageSeo({
  path: "/models/mpv7",
  name: "VinFast VF MPV7",
  title: "VinFast MPV7 Price in Bihar | 7-Seater Electric MPV — Patliputra",
  description:
    "VinFast VF MPV7 — the premium 7-seater electric MPV for large families and corporate fleets in Bihar. Three-row seating, fast charging. Price, booking & test drive in Patna.",
  bodyType: "Electric MPV",
  seats: 7,
  variants: ["Standard"],
  keywords: [
    "VinFast MPV7",
    "VinFast MPV7 Price",
    "VinFast MPV7 Booking",
    "VinFast MPV7 Review",
    "VinFast MPV7 Features",
    "VinFast MPV7 Range",
    "7 Seater Electric Car",
    "Best Electric MPV",
    "Premium Family EV",
    "Electric Car for Large Family",
    "Executive Electric MPV",
    "Electric Car for Corporate Use",
  ],
  faqs: [
    {
      question: "Is the VinFast MPV7 suitable for large families?",
      answer:
        "Yes — the VF MPV7 offers three-row seating for seven with generous cabin space, making it ideal for large families and long trips across Bihar.",
    },
    {
      question: "Can the VinFast MPV7 be used for corporate travel?",
      answer:
        "Absolutely. Its executive comfort, low running cost and fleet-friendly ownership make the MPV7 a strong choice for corporate and fleet buyers. Patliputra VinFast supports fleet purchases.",
    },
    {
      question: "Does the VinFast MPV7 support fast charging?",
      answer:
        "Yes, the MPV7 supports DC fast charging so you can top up quickly on highway journeys, alongside convenient overnight AC home charging.",
    },
  ],
});

export const LIMO_GREEN_SEO: PageSeo = modelPageSeo({
  path: "/models/limo-green",
  name: "VinFast Limo Green",
  title: "VinFast Limo Green in Bihar | Electric MPV for Fleet & Family",
  description:
    "VinFast Limo Green — practical 7-seater electric MPV for fleet operators and families in Bihar. Low running cost, spacious cabin. Price, booking & test drive at Patliputra VinFast.",
  bodyType: "Electric MPV",
  seats: 7,
  variants: ["Standard"],
  keywords: [
    "VinFast Limo Green",
    "VinFast Limo Green Price",
    "VinFast Limo Green Bihar",
    "Electric MPV for fleet",
    "7 seater electric car Bihar",
    "Fleet Electric MPV",
  ],
  faqs: [
    {
      question: "Who is the VinFast Limo Green designed for?",
      answer:
        "The Limo Green is a practical 7-seater electric MPV aimed at fleet operators, taxi services and value-conscious families who want the lowest running cost per kilometre.",
    },
    {
      question: "Where can I see the VinFast Limo Green in Bihar?",
      answer:
        "Visit Patliputra VinFast in Patna — Bihar's authorised VinFast dealership — or book a test drive online to experience the Limo Green.",
    },
  ],
});
