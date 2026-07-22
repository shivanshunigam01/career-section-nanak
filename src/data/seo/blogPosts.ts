export type BlogCluster =
  | "ev-education"
  | "vf6"
  | "vf7"
  | "mpv7";

export type BlogPost = {
  slug: string;
  path: string;
  title: string;
  description: string;
  keywords: string[];
  cluster: BlogCluster;
  clusterLabel: string;
  date: string;
  readMinutes: number;
  h1: string;
  lead: string;
  sections: { heading: string; body: string }[];
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "why-electric-vehicles-are-the-future-of-bihar",
    path: "/blogs/why-electric-vehicles-are-the-future-of-bihar",
    title: "Why Electric Vehicles Are the Future of Bihar | Patliputra VinFast",
    description:
      "How EVs cut fuel costs, improve air quality and fit Bihar’s roads — with VinFast VF6, VF7 and MPV7 from Patliputra VinFast.",
    keywords: ["Electric vehicles Bihar", "EV future Bihar", "Why buy EV Patna"],
    cluster: "ev-education",
    clusterLabel: "EV Education",
    date: "2026-04-01",
    readMinutes: 6,
    h1: "Why Electric Vehicles Are the Future of Bihar",
    lead: "Lower running costs, quieter streets and growing charging access are making premium EVs practical across all 38 districts.",
    sections: [
      {
        heading: "Fuel savings that add up",
        body: "Electricity per kilometre is typically far cheaper than petrol or diesel — especially for daily Patna, Muzaffarpur and Gaya commutes. Pair home charging with an overnight routine and you start most days at full charge.",
      },
      {
        heading: "Built for Bihar journeys",
        body: "Modern electric SUVs and MPVs handle city traffic and intercity trips when you plan DC fast-charging stops. Patliputra VinFast helps map ownership for your district.",
      },
      {
        heading: "Start with the right model",
        body: "VF6 for smart family SUVs, VF7 for premium ADAS luxury, MPV7 for seven-seat families and fleets — explore, compare and book a test drive.",
      },
    ],
  },
  {
    slug: "how-to-choose-the-right-electric-suv",
    path: "/blogs/how-to-choose-the-right-electric-suv",
    title: "How to Choose the Right Electric SUV | Buying Guide",
    description:
      "Range, features, budget and seating — a practical checklist to choose between VinFast VF6 and VF7 in Bihar.",
    keywords: ["Choose electric SUV", "VF6 or VF7", "EV SUV buying guide"],
    cluster: "ev-education",
    clusterLabel: "EV Education",
    date: "2026-04-05",
    readMinutes: 5,
    h1: "How to Choose the Right Electric SUV",
    lead: "Match daily kilometres, feature needs and budget before you fall for a brochure — then verify with a test drive.",
    sections: [
      {
        heading: "List your must-haves",
        body: "ADAS, panoramic roof, connected apps, boot space and on-road budget. VF6 maximises smart value; VF7 maximises premium tech.",
      },
      {
        heading: "Calculate ownership",
        body: "Use EMI, charging and running-cost calculators, then request a district on-road quote including exchange.",
      },
    ],
  },
  {
    slug: "charging-infrastructure-in-bihar",
    path: "/blogs/charging-infrastructure-in-bihar",
    title: "Charging Infrastructure in Bihar | Home & Public Guide",
    description:
      "Home AC chargers and public DC fast charging for VinFast owners across Bihar — practical tips from Patliputra VinFast.",
    keywords: ["EV charging Bihar", "Home charger Bihar", "Public charging Patna"],
    cluster: "ev-education",
    clusterLabel: "EV Education",
    date: "2026-04-10",
    readMinutes: 5,
    h1: "Charging Infrastructure in Bihar",
    lead: "Most owners charge at home; public DC fills the gaps on longer trips.",
    sections: [
      {
        heading: "Home first",
        body: "A wallbox on a dedicated circuit covers daily driving for most families. We help assess suitability.",
      },
      {
        heading: "Highway confidence",
        body: "Plan DC stops on major corridors. Keep apps updated for live availability where supported.",
      },
    ],
  },
  {
    slug: "cost-of-owning-an-ev",
    path: "/blogs/cost-of-owning-an-ev",
    title: "Cost of Owning an EV in Bihar | TCO Guide",
    description:
      "Electricity vs fuel, maintenance, insurance and EMI — understand total cost of VinFast ownership in Bihar.",
    keywords: ["EV running cost Bihar", "Cost of owning EV", "VinFast TCO"],
    cluster: "ev-education",
    clusterLabel: "EV Education",
    date: "2026-04-12",
    readMinutes: 6,
    h1: "Cost of Owning an EV",
    lead: "Look beyond ex-showroom price — electricity, service and residual value complete the picture.",
    sections: [
      {
        heading: "Running costs",
        body: "Compare petrol litres to kWh with our running-cost calculator using your tariff and monthly kilometres.",
      },
      {
        heading: "Finance the smart way",
        body: "Optimise down payment and tenure on the EMI calculator before you visit the showroom.",
      },
    ],
  },
  {
    slug: "top-10-reasons-to-buy-the-vf6",
    path: "/blogs/top-10-reasons-to-buy-the-vf6",
    title: "Top 10 Reasons to Buy the VinFast VF6 | Bihar",
    description:
      "Why Bihar buyers choose VinFast VF6 — range, features, variants, finance and Patliputra VinFast support.",
    keywords: ["Buy VinFast VF6", "VF6 reasons", "VF6 Bihar"],
    cluster: "vf6",
    clusterLabel: "VinFast VF6",
    date: "2026-04-15",
    readMinutes: 5,
    h1: "Top 10 Reasons to Buy the VF6",
    lead: "Smart electric SUV ownership without compromise — from Earth to Wind Infinity.",
    sections: [
      {
        heading: "Value, features and family fit",
        body: "VF6 targets buyers who want a modern EV SUV for city and family use, backed by authorised service across Bihar’s 38 districts.",
      },
      {
        heading: "Experience it",
        body: "Book a test drive and request an on-road quote with exchange and finance options.",
      },
    ],
  },
  {
    slug: "is-the-vf6-worth-buying",
    path: "/blogs/is-the-vf6-worth-buying",
    title: "Is the VinFast VF6 Worth Buying? | Honest Take",
    description:
      "Is VinFast VF6 worth it in Bihar? Ownership costs, variants and who should buy — from Patliputra VinFast.",
    keywords: ["Is VF6 worth buying", "VinFast VF6 review Bihar"],
    cluster: "vf6",
    clusterLabel: "VinFast VF6",
    date: "2026-04-18",
    readMinutes: 5,
    h1: "Is the VF6 Worth Buying?",
    lead: "For city-focused families seeking a smart EV SUV with strong features, VF6 is one of the most compelling options in Bihar.",
    sections: [
      {
        heading: "Who it is for",
        body: "Daily commuters, first-time EV buyers and families who want five seats without jumping to ultra-luxury pricing.",
      },
      {
        heading: "Who should look at VF7 instead",
        body: "If ADAS and premium cabin are non-negotiable, step up to VF7 Sky trims.",
      },
    ],
  },
  {
    slug: "vf6-running-cost-analysis",
    path: "/blogs/vf6-running-cost-analysis",
    title: "VF6 Running Cost Analysis | Electricity vs Petrol",
    description:
      "Estimate VinFast VF6 running costs in Bihar versus petrol SUVs — with calculator links from Patliputra VinFast.",
    keywords: ["VF6 running cost", "VF6 charging cost", "EV vs petrol Bihar"],
    cluster: "vf6",
    clusterLabel: "VinFast VF6",
    date: "2026-04-20",
    readMinutes: 4,
    h1: "VF6 Running Cost Analysis",
    lead: "Plug in your tariff and monthly kilometres to see why electric adds up.",
    sections: [
      {
        heading: "Use the tools",
        body: "Open the running-cost and charging calculators, then validate with a real on-road quote including EMI.",
      },
    ],
  },
  {
    slug: "why-the-vf7-stands-out",
    path: "/blogs/why-the-vf7-stands-out",
    title: "Why the VinFast VF7 Stands Out | Premium EV SUV",
    description:
      "ADAS, connected tech and luxury trims — why VinFast VF7 stands out for premium buyers in Bihar.",
    keywords: ["VinFast VF7 review", "Premium EV SUV Bihar", "VF7 ADAS"],
    cluster: "vf7",
    clusterLabel: "VinFast VF7",
    date: "2026-04-22",
    readMinutes: 5,
    h1: "Why the VF7 Stands Out",
    lead: "A premium electric SUV that climbs from Earth to Sky Infinity with technology you can feel on every drive.",
    sections: [
      {
        heading: "ADAS and connectivity",
        body: "Higher trims bring driver assistance and connected features that define the premium EV experience.",
      },
      {
        heading: "Try before you buy",
        body: "Book a VF7 test drive at Patliputra VinFast and compare Earth vs Sky with an advisor.",
      },
    ],
  },
  {
    slug: "adas-explained",
    path: "/blogs/adas-explained",
    title: "ADAS Explained | VinFast VF7 Driver Assistance",
    description:
      "What ADAS means on VinFast VF7 — adaptive cruise, lane support and how to experience it on a Bihar test drive.",
    keywords: ["ADAS explained", "VF7 ADAS", "ADAS electric SUV"],
    cluster: "vf7",
    clusterLabel: "VinFast VF7",
    date: "2026-04-25",
    readMinutes: 5,
    h1: "ADAS Explained",
    lead: "Advanced Driver Assistance Systems help reduce fatigue on highways — when you understand what each feature does.",
    sections: [
      {
        heading: "Learn on a guided drive",
        body: "Our team explains VF7 ADAS behaviour safely so you know what the car can and cannot do.",
      },
    ],
  },
  {
    slug: "best-electric-mpv-in-india",
    path: "/blogs/best-electric-mpv-in-india",
    title: "Best Electric MPV in India | VinFast VF MPV7",
    description:
      "Looking for the best electric MPV for large families and fleets? Explore VinFast VF MPV7 with Patliputra VinFast, Bihar.",
    keywords: ["Best electric MPV", "VinFast MPV7", "7 seater electric car"],
    cluster: "mpv7",
    clusterLabel: "VinFast MPV7",
    date: "2026-04-28",
    readMinutes: 5,
    h1: "Best Electric MPV in India for Families & Fleets",
    lead: "Seven seats, EV refinement and corporate-ready practicality — MPV7 is built for big households and executive travel.",
    sections: [
      {
        heading: "Space that works harder",
        body: "Three-row flexibility for school runs, weddings and guest transfers — with electricity instead of diesel bills.",
      },
    ],
  },
  {
    slug: "family-road-trips-with-mpv7",
    path: "/blogs/family-road-trips-with-mpv7",
    title: "Family Road Trips with VinFast MPV7 | Bihar",
    description:
      "Plan Bihar family road trips in the VinFast VF MPV7 — seating, charging stops and comfort tips.",
    keywords: ["MPV7 road trip", "Family electric MPV", "7 seater EV Bihar"],
    cluster: "mpv7",
    clusterLabel: "VinFast MPV7",
    date: "2026-05-01",
    readMinutes: 4,
    h1: "Family Road Trips with MPV7",
    lead: "More seats, quieter cabin, fewer fuel stops — electric MPV travel done right.",
    sections: [
      {
        heading: "Charge as you explore",
        body: "Combine overnight hotel or home charging with DC fast stops on longer legs across Bihar.",
      },
    ],
  },
  {
    slug: "corporate-fleet-benefits-electric-mpv",
    path: "/blogs/corporate-fleet-benefits-electric-mpv",
    title: "Corporate Fleet Benefits of Electric MPVs | Bihar",
    description:
      "Why companies in Bihar choose VinFast MPV7 and Limo Green for executive and guest fleets.",
    keywords: ["Corporate electric fleet", "EV fleet Bihar", "Executive electric MPV"],
    cluster: "mpv7",
    clusterLabel: "VinFast MPV7",
    date: "2026-05-04",
    readMinutes: 4,
    h1: "Corporate Fleet Benefits of Electric MPVs",
    lead: "Lower energy cost per kilometre, quieter guest experience and a modern brand image.",
    sections: [
      {
        heading: "Talk to corporate sales",
        body: "Patliputra VinFast supports multi-unit quotations, delivery planning and driver familiarisation.",
      },
    ],
  },
];

export function getBlogBySlug(slug: string) {
  return BLOG_POSTS.find((b) => b.slug === slug) ?? null;
}

export function getBlogsByCluster(cluster: BlogCluster) {
  return BLOG_POSTS.filter((b) => b.cluster === cluster);
}
