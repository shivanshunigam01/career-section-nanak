export type ComparisonPage = {
  slug: string;
  path: string;
  title: string;
  description: string;
  keywords: string[];
  h1: string;
  lead: string;
  vinfastModel: "VF6" | "VF7" | "MPV7";
  rival: string;
  points: { label: string; vinfast: string; rival: string }[];
  summary: string;
  faqs: { question: string; answer: string }[];
};

export const COMPARISON_PAGES: ComparisonPage[] = [
  {
    slug: "vinfast-vf6-vs-tata-curvv-ev",
    path: "/compare/vinfast-vf6-vs-tata-curvv-ev",
    title: "VinFast VF6 vs Tata Curvv EV | Comparison Bihar",
    description:
      "Compare VinFast VF6 and Tata Curvv EV on range, features, price positioning and ownership in Bihar. Book a VF6 test drive at Patliputra VinFast.",
    keywords: ["VinFast VF6 vs Tata Curvv EV", "VF6 vs Curvv EV", "Electric SUV comparison Bihar"],
    h1: "VinFast VF6 vs Tata Curvv EV",
    lead: "Two compelling electric SUVs — see how VF6 stacks up for Bihar buyers focused on value, features and dealer support.",
    vinfastModel: "VF6",
    rival: "Tata Curvv EV",
    points: [
      { label: "Body style", vinfast: "Electric SUV", rival: "Electric coupe-SUV" },
      { label: "Seating", vinfast: "5", rival: "5" },
      { label: "Dealer in Bihar", vinfast: "Patliputra VinFast (authorised)", rival: "Tata network" },
      { label: "Trim ladder", vinfast: "Earth / Wind / Wind Infinity", rival: "Multiple Curvv EV trims" },
      { label: "Ownership focus", vinfast: "Smart features + EV value", rival: "Design-led EV SUV" },
    ],
    summary:
      "Choose VF6 if you want a smart VinFast SUV with strong feature content and dedicated Bihar dealer care. Test drive both before you decide.",
    faqs: [
      {
        question: "Is VF6 better than Curvv EV for families?",
        answer:
          "Both seat five. Compare cabin space, warranty, on-road price and service convenience in your district — then take a VF6 test drive with Patliputra VinFast.",
      },
    ],
  },
  {
    slug: "vinfast-vf6-vs-mahindra-be-6",
    path: "/compare/vinfast-vf6-vs-mahindra-be-6",
    title: "VinFast VF6 vs Mahindra BE 6 | EV SUV Comparison",
    description:
      "VinFast VF6 vs Mahindra BE 6 comparison for Bihar — features, positioning and which electric SUV fits your needs.",
    keywords: ["VinFast VF6 vs Mahindra BE 6", "VF6 vs BE 6", "Electric SUV comparison"],
    h1: "VinFast VF6 vs Mahindra BE 6",
    lead: "Performance-flavoured BE 6 versus value-smart VF6 — understand the trade-offs for Bihar roads and budgets.",
    vinfastModel: "VF6",
    rival: "Mahindra BE 6",
    points: [
      { label: "Positioning", vinfast: "Smart family electric SUV", rival: "Sporty electric SUV" },
      { label: "Seating", vinfast: "5", rival: "5" },
      { label: "Bihar support", vinfast: "Patliputra VinFast statewide", rival: "Mahindra network" },
    ],
    summary:
      "VF6 emphasises accessible premium EV ownership; BE 6 leans performance. Match the car to how you drive daily.",
    faqs: [
      {
        question: "Which is better for city use in Patna?",
        answer:
          "Both work in the city. VF6 is tuned as a practical smart SUV — experience it with a Patliputra VinFast test drive.",
      },
    ],
  },
  {
    slug: "vinfast-vf6-vs-mg-zs-ev",
    path: "/compare/vinfast-vf6-vs-mg-zs-ev",
    title: "VinFast VF6 vs MG ZS EV | Comparison",
    description:
      "Compare VinFast VF6 and MG ZS EV — features, ownership and electric SUV value for buyers in Bihar.",
    keywords: ["VinFast VF6 vs MG ZS EV", "VF6 vs ZS EV"],
    h1: "VinFast VF6 vs MG ZS EV",
    lead: "An established MG EV rival versus VinFast’s feature-rich VF6 — compare before you book.",
    vinfastModel: "VF6",
    rival: "MG ZS EV",
    points: [
      { label: "Segment", vinfast: "Electric SUV", rival: "Electric SUV" },
      { label: "Seating", vinfast: "5", rival: "5" },
      { label: "Local EV destination", vinfast: "Patliputra VinFast", rival: "MG dealers" },
    ],
    summary: "Weigh feature packs, warranty and on-road deals. Book VF6 for a head-to-head feel.",
    faqs: [
      {
        question: "Should I buy VF6 or ZS EV?",
        answer:
          "Compare latest prices, battery warranty and dealer proximity. Patliputra VinFast can prepare a VF6 on-road quote for your district.",
      },
    ],
  },
  {
    slug: "vinfast-vf7-vs-byd-atto-3",
    path: "/compare/vinfast-vf7-vs-byd-atto-3",
    title: "VinFast VF7 vs BYD Atto 3 | Premium EV Comparison",
    description:
      "VinFast VF7 vs BYD Atto 3 — premium electric SUV comparison for Bihar buyers focused on tech, ADAS and comfort.",
    keywords: ["VinFast VF7 vs BYD Atto 3", "VF7 vs Atto 3"],
    h1: "VinFast VF7 vs BYD Atto 3",
    lead: "Premium EV SUVs with strong tech stories — see where VF7’s ADAS and luxury trims stand out.",
    vinfastModel: "VF7",
    rival: "BYD Atto 3",
    points: [
      { label: "Positioning", vinfast: "Premium ADAS electric SUV", rival: "Tech-led electric SUV" },
      { label: "VF7 trims", vinfast: "Earth to Sky Infinity", rival: "Atto 3 variants" },
      { label: "Bihar dealer", vinfast: "Patliputra VinFast", rival: "BYD network" },
    ],
    summary:
      "VF7 Sky trims highlight ADAS and premium cabin. Atto 3 remains a strong tech rival — test drive VF7 to decide.",
    faqs: [
      {
        question: "Which has better ADAS — VF7 or Atto 3?",
        answer:
          "ADAS packs differ by trim and software. Compare Sky / Sky Infinity VF7 features on a guided demo at Patliputra VinFast.",
      },
    ],
  },
  {
    slug: "vinfast-vf7-vs-hyundai-creta-electric",
    path: "/compare/vinfast-vf7-vs-hyundai-creta-electric",
    title: "VinFast VF7 vs Hyundai Creta Electric | Comparison",
    description:
      "Compare VinFast VF7 and Hyundai Creta Electric for premium EV SUV buyers in Bihar.",
    keywords: ["VinFast VF7 vs Creta Electric", "VF7 vs Creta EV"],
    h1: "VinFast VF7 vs Hyundai Creta Electric",
    lead: "Lifestyle electric SUVs with brand strength — compare luxury, tech and ownership.",
    vinfastModel: "VF7",
    rival: "Hyundai Creta Electric",
    points: [
      { label: "Segment", vinfast: "Premium electric SUV", rival: "Electric midsize SUV" },
      { label: "Seating", vinfast: "5", rival: "5" },
      { label: "Highlight", vinfast: "ADAS & luxury trims", rival: "Hyundai ecosystem" },
    ],
    summary: "Creta Electric brings Hyundai familiarity; VF7 pushes premium connected EV luxury. Drive both.",
    faqs: [
      {
        question: "Is VF7 more premium than Creta Electric?",
        answer:
          "Higher VF7 trims aim at a more luxurious, ADAS-led experience. Compare on-road prices and feature lists for your budget.",
      },
    ],
  },
  {
    slug: "vinfast-vf7-vs-mahindra-xev-9e",
    path: "/compare/vinfast-vf7-vs-mahindra-xev-9e",
    title: "VinFast VF7 vs Mahindra XEV 9e | Comparison",
    description:
      "VinFast VF7 vs Mahindra XEV 9e electric SUV comparison for Bihar — design, tech and ownership.",
    keywords: ["VinFast VF7 vs XEV 9e", "VF7 vs Mahindra XEV 9e"],
    h1: "VinFast VF7 vs Mahindra XEV 9e",
    lead: "Two bold electric SUV statements — align design preference with features and dealer care.",
    vinfastModel: "VF7",
    rival: "Mahindra XEV 9e",
    points: [
      { label: "Positioning", vinfast: "Premium connected EV SUV", rival: "Design-forward EV SUV" },
      { label: "Seating", vinfast: "5", rival: "5" },
      { label: "Local support", vinfast: "Patliputra VinFast", rival: "Mahindra network" },
    ],
    summary: "Pick based on design language, ADAS needs and service comfort. Book VF7 to feel the difference.",
    faqs: [
      {
        question: "VF7 or XEV 9e for Bihar highways?",
        answer:
          "Both can handle highway use with charging planning. Evaluate range, ADAS and seat comfort on a VF7 test drive.",
      },
    ],
  },
];

export function getComparisonBySlug(slug: string) {
  return COMPARISON_PAGES.find((c) => c.slug === slug) ?? null;
}
