/** Static SEO content pages aligned with the site URL architecture. */
export type SeoStaticPage = {
  path: string;
  title: string;
  description: string;
  keywords: string[];
  eyebrow: string;
  h1: string;
  lead: string;
  sections: { heading: string; body: string; bullets?: string[] }[];
  faqs?: { question: string; answer: string }[];
};

export const SEO_STATIC_PAGES: SeoStaticPage[] = [
  {
    path: "/ev-buying-guide",
    title: "Complete EV Buying Guide Bihar | Patliputra VinFast",
    description:
      "How to choose the right electric SUV or MPV in Bihar — range, charging, finance, variants and total cost of ownership for VinFast VF6, VF7 and MPV7.",
    keywords: [
      "EV buying guide Bihar",
      "How to choose electric SUV",
      "Buy electric car Patna",
      "Electric vehicle guide Bihar",
    ],
    eyebrow: "EV Education",
    h1: "Complete EV Buying Guide for Bihar",
    lead: "From range and charging to finance and family seating — a clear path to buying your first premium electric vehicle with Patliputra VinFast.",
    sections: [
      {
        heading: "Start with how you drive",
        body: "City commute in Patna or Muzaffarpur? Weekend trips to Gaya or Bhagalpur? Large family needing three rows? Match daily kilometres, seating and boot space before comparing trims. VinFast VF6 suits smart city and family SUV needs; VF7 adds premium ADAS and luxury; VF MPV7 is built for seven seats and corporate travel.",
      },
      {
        heading: "Range, charging and Bihar roads",
        body: "Look at certified range for your typical day plus a buffer for highway runs. Plan home AC charging for overnight top-ups and note DC fast-charging along major corridors. Our team maps home-charger suitability and public options across all 38 districts.",
      },
      {
        heading: "Total cost of ownership",
        body: "Compare electricity vs fuel, lower maintenance, EV insurance, EMI and residual value. Use our EMI, running-cost and charging calculators, then request an on-road quote including exchange benefits.",
        bullets: [
          "EMI & down-payment planning",
          "Exchange valuation on your current car",
          "Home charger guidance",
          "Test drive before you decide",
        ],
      },
    ],
    faqs: [
      {
        question: "Which VinFast model is best for city driving in Bihar?",
        answer:
          "The VF6 is ideal for daily city driving and family use. The VF7 suits buyers wanting premium features and ADAS. Choose MPV7 if you need seven seats.",
      },
      {
        question: "Can I install a charger at home?",
        answer:
          "Yes. Most homes and apartments can support an AC home charger. Patliputra VinFast guides installation and electrical readiness across Bihar.",
      },
    ],
  },
  {
    path: "/finance",
    title: "EV Finance & Loan Options Bihar | Patliputra VinFast",
    description:
      "VinFast EV finance in Bihar — low down payment, partner bank & NBFC loans, EMI planning for VF6, VF7 and MPV7. Calculate EMI and apply with Patliputra VinFast.",
    keywords: [
      "VinFast finance Bihar",
      "EV loan Patna",
      "Electric car EMI Bihar",
      "VinFast loan options",
    ],
    eyebrow: "Easy Finance",
    h1: "EV Finance for VinFast in Bihar",
    lead: "Attractive EV loans, flexible tenure and quick approvals — plan your VF6, VF7 or MPV7 purchase with confidence.",
    sections: [
      {
        heading: "Partner banks & NBFCs",
        body: "Patliputra VinFast works with leading lenders for competitive EV interest rates, low down payments and documentation support at the showroom.",
      },
      {
        heading: "Plan before you visit",
        body: "Use the EMI calculator to model vehicle price, down payment, tenure and rate. Bring your preferred structure when you book a consultation or test drive.",
      },
      {
        heading: "What you will need",
        body: "Typical KYC, income proof and address documents. Our finance desk helps you complete paperwork for customers across Bihar.",
      },
    ],
    faqs: [
      {
        question: "What financing options are available?",
        answer:
          "EV loans from partner banks and NBFCs with flexible tenure. Use our EMI calculator, then speak to our finance team for the latest rates and offers.",
      },
    ],
  },
  {
    path: "/exchange",
    title: "Car Exchange Offer Bihar | Upgrade to VinFast EV",
    description:
      "Exchange your petrol, diesel or CNG car for a VinFast VF6, VF7 or MPV7. Instant valuation and exchange benefits at Patliputra VinFast, Bihar.",
    keywords: ["Car exchange Bihar", "Exchange for electric car", "VinFast exchange offer Patna"],
    eyebrow: "Exchange",
    h1: "Exchange Your Car for a VinFast EV",
    lead: "Turn your current vehicle into part-payment toward a premium electric SUV or MPV — with transparent valuation and dealer support.",
    sections: [
      {
        heading: "How exchange works",
        body: "Share your car details online or at the showroom. We assess condition and market value, apply exchange benefits, and adjust your on-road quote for VF6, VF7 or MPV7.",
      },
      {
        heading: "Why upgrade to electric",
        body: "Lower running costs, quieter drives, modern safety tech and a future-ready ownership experience across Bihar’s growing charging network.",
      },
    ],
    faqs: [
      {
        question: "Can I exchange my current vehicle?",
        answer:
          "Yes. Patliputra VinFast offers exchange benefits on petrol, diesel and CNG cars when you upgrade to VinFast. Request a valuation online or at the showroom.",
      },
    ],
  },
  {
    path: "/insurance",
    title: "EV Insurance Bihar | VinFast Insurance Assistance",
    description:
      "Electric vehicle insurance guidance for VinFast owners in Bihar — competitive EV cover, claim support and ownership peace of mind from Patliputra VinFast.",
    keywords: ["EV insurance Bihar", "VinFast insurance Patna", "Electric car insurance"],
    eyebrow: "Insurance",
    h1: "EV Insurance Made Simple",
    lead: "Get the right cover for your VinFast — battery, motor and third-party — with dealer-assisted quotes and renewals.",
    sections: [
      {
        heading: "What EV insurance should cover",
        body: "Comprehensive policies typically cover own-damage, third-party liability and add-ons relevant to EVs. Ask our team for VinFast-aligned recommendations.",
      },
      {
        heading: "We help end-to-end",
        body: "From first policy at delivery to renewals and claim guidance, Patliputra VinFast supports owners across all 38 districts of Bihar.",
      },
    ],
  },
  {
    path: "/corporate-sales",
    title: "Corporate & Fleet EV Sales Bihar | VinFast MPV7",
    description:
      "Corporate VinFast sales in Bihar — fleet pricing, executive MPV7 and Limo Green for companies, hotels and institutions. Contact Patliputra VinFast.",
    keywords: [
      "Corporate EV sales Bihar",
      "Electric fleet Patna",
      "VinFast fleet purchase",
      "Executive electric MPV",
    ],
    eyebrow: "Corporate Sales",
    h1: "Corporate & Fleet Electric Mobility",
    lead: "Premium electric MPVs and SUVs for businesses that want lower running costs, brand-forward mobility and reliable after-sales across Bihar.",
    sections: [
      {
        heading: "Built for organisations",
        body: "VF MPV7 and Limo Green suit executive travel, guest transport and staff mobility. VF6 and VF7 work well for leadership SUVs and demo fleets.",
      },
      {
        heading: "Fleet benefits",
        body: "Volume pricing discussions, delivery planning, charging guidance and dedicated service coordination through Patliputra VinFast.",
        bullets: [
          "Multi-unit quotations",
          "Corporate billing support",
          "Driver familiarisation & test drives",
          "Service scheduling for fleets",
        ],
      },
    ],
    faqs: [
      {
        question: "Can businesses purchase fleets?",
        answer:
          "Yes. Patliputra VinFast supports corporate and institutional fleet purchases of VinFast EVs across Bihar. Contact our corporate sales desk for a tailored proposal.",
      },
    ],
  },
  {
    path: "/charging-infrastructure",
    title: "EV Charging Infrastructure Bihar | Home & Public Charging",
    description:
      "Charging guide for VinFast owners in Bihar — home AC chargers, DC fast charging, public network tips and installation support from Patliputra VinFast.",
    keywords: [
      "EV charging Bihar",
      "Home charger Patna",
      "Public charging Bihar",
      "VinFast charging",
    ],
    eyebrow: "Charging",
    h1: "Charging Infrastructure in Bihar",
    lead: "Home overnight charging plus growing public DC options — drive VF6, VF7 and MPV7 with confidence across the state.",
    sections: [
      {
        heading: "Home charging",
        body: "Most owners charge overnight with an AC wallbox. We help assess electrical load, recommend charger capacity and coordinate installation partners.",
      },
      {
        heading: "Public & highway charging",
        body: "Use DC fast charging for longer trips. Plan stops on major Bihar corridors and keep the VinFast app / navigation tools handy for live station status where available.",
      },
      {
        heading: "How long does charging take?",
        body: "AC home charging is typically overnight. DC fast charging can restore substantial range in a short stop — exact times depend on charger power, battery state and ambient conditions.",
      },
    ],
    faqs: [
      {
        question: "Does the VF6 support DC fast charging?",
        answer:
          "Yes. VinFast VF6 supports DC fast charging in addition to AC home charging. Ask our team for recommended charger types and home installation options.",
      },
      {
        question: "How much does charging cost per full charge?",
        answer:
          "Cost depends on your electricity tariff and usable battery energy. Use our charging calculator for an estimate, then compare with petrol/diesel using the running-cost tool.",
      },
    ],
  },
  {
    path: "/ownership-experience",
    title: "VinFast Ownership Experience Bihar | Service & Support",
    description:
      "What VinFast ownership feels like with Patliputra VinFast — service, warranty, OTA updates, roadside assistance and care across Bihar.",
    keywords: ["VinFast ownership Bihar", "VinFast service Patna", "EV after sales Bihar"],
    eyebrow: "Ownership",
    h1: "The VinFast Ownership Experience",
    lead: "From delivery day to scheduled service — authorised support, genuine parts and guidance built for Bihar drivers.",
    sections: [
      {
        heading: "Service you can rely on",
        body: "Scheduled maintenance, software updates and genuine parts through Patliputra VinFast. Lower routine maintenance versus many ICE vehicles.",
      },
      {
        heading: "Connected ownership",
        body: "OTA software updates and connected features keep your VinFast improving over time. Our team explains apps, charging profiles and ADAS behaviour on VF7 where applicable.",
      },
      {
        heading: "Roadside assistance",
        body: "VinFast roadside assistance programmes (as applicable to your vehicle) plus local dealer support for owners across Bihar’s 38 districts.",
      },
    ],
  },
  {
    path: "/customer-stories",
    title: "VinFast Customer Stories Bihar | Real Owners",
    description:
      "Customer stories from VinFast owners in Bihar — city commuting, family travel and switching from petrol to electric with Patliputra VinFast.",
    keywords: ["VinFast reviews Bihar", "EV customer stories Patna", "VinFast owner experience"],
    eyebrow: "Customer Stories",
    h1: "Stories from Bihar’s EV Drivers",
    lead: "Families and professionals across Patna, Muzaffarpur, Gaya and beyond share why they chose VinFast — and what electric ownership changed for them.",
    sections: [
      {
        heading: "From fuel queues to home charging",
        body: "Owners often highlight quieter cabins, lower monthly running costs and the convenience of waking up to a full charge. Book a test drive to experience the difference yourself.",
      },
      {
        heading: "Share your story",
        body: "Already a VinFast owner with Patliputra VinFast? Tell us about your journey — city runs, highway trips or family road days. Selected stories may be featured with your permission.",
      },
    ],
  },
];

export function getSeoStaticPage(path: string) {
  return SEO_STATIC_PAGES.find((p) => p.path === path) ?? null;
}
