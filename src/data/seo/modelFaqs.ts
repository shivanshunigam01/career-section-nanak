/** Model FAQ clusters for AEO — natural-language Q&A (30+ per core model). */
export type ModelFaqSet = {
  modelKey: "vf6" | "vf7" | "mpv7";
  modelName: string;
  path: string;
  faqs: { question: string; answer: string }[];
};

export const MODEL_FAQ_SETS: ModelFaqSet[] = [
  {
    modelKey: "vf6",
    modelName: "VinFast VF6",
    path: "/models/vf6",
    faqs: [
      {
        question: "What is the driving range of the VinFast VF6?",
        answer:
          "The VF6 offers a competitive certified range suited to daily Bihar commuting and intercity trips. For the latest ARAI/certified figure and real-world estimates, check the VF6 page or ask Patliputra VinFast for a district-specific ownership consultation.",
      },
      {
        question: "How long does it take to charge the VF6?",
        answer:
          "AC home charging is typically overnight. DC fast charging can add substantial range in a short stop depending on charger power and battery state of charge.",
      },
      {
        question: "Does the VF6 support DC fast charging?",
        answer:
          "Yes. The VF6 supports DC fast charging in addition to AC charging at home or work.",
      },
      {
        question: "What warranty is offered with the battery?",
        answer:
          "VinFast provides a comprehensive vehicle warranty with extended battery coverage. Confirm current terms with Patliputra VinFast at booking.",
      },
      {
        question: "Can I install a home charger?",
        answer:
          "Yes. Most homes can support an AC wallbox. Our team helps assess electrical readiness across Bihar.",
      },
      {
        question: "Is the VF6 suitable for daily city driving?",
        answer:
          "Yes. The VF6 is positioned as a smart, feature-loaded electric SUV ideal for city driving and family use in Patna and across Bihar.",
      },
      {
        question: "How much does charging cost per full charge?",
        answer:
          "Cost depends on your electricity tariff and usable battery capacity. Use our charging calculator for an estimate.",
      },
      {
        question: "What are the maintenance costs?",
        answer:
          "EVs generally have lower routine maintenance than petrol/diesel cars — fewer fluids and no engine oil changes. Scheduled service is available at Patliputra VinFast.",
      },
      {
        question: "What financing options are available?",
        answer:
          "EV loans via partner banks and NBFCs with flexible EMIs. Use the EMI calculator, then speak to our finance desk.",
      },
      {
        question: "Can I exchange my current vehicle?",
        answer:
          "Yes. Exchange benefits are available when upgrading to the VF6. Request a valuation online or at the showroom.",
      },
      {
        question: "What is the VinFast VF6 price in Bihar?",
        answer:
          "Ex-showroom prices vary by variant (Earth, Wind, Wind Infinity). Request an on-road quote for your district from Patliputra VinFast.",
      },
      {
        question: "What variants does the VF6 offer?",
        answer: "Earth, Wind and Wind Infinity — each stepping up features and equipment.",
      },
      {
        question: "Is the VF6 a good family electric SUV?",
        answer:
          "Yes. With five seats, modern safety tech and low running costs, it suits families seeking a premium EV under a practical budget.",
      },
      {
        question: "Can I book a VF6 test drive in Patna?",
        answer:
          "Yes. Book online in under a minute; our team confirms on WhatsApp. Home test drives may be available in select Patna areas.",
      },
      {
        question: "What smart features does the VF6 include?",
        answer:
          "Connected features, modern infotainment and driver aids vary by variant. Explore Wind Infinity for the richest feature set.",
      },
      {
        question: "Is the VF6 worth buying in Bihar?",
        answer:
          "If you want a smart electric SUV for city and family use with strong value, the VF6 is a leading choice — especially with dealer support across 38 districts.",
      },
      {
        question: "How does VF6 compare to Tata Curvv EV?",
        answer:
          "Both compete in the electric SUV space. Compare range, features, warranty, dealer network and on-road price on our comparison pages, then test drive both if possible.",
      },
      {
        question: "Does VF6 qualify as a best electric SUV under 20 lakh?",
        answer:
          "Depending on variant and offers, VF6 targets value-focused premium EV buyers. Confirm current pricing with Patliputra VinFast.",
      },
      {
        question: "What is the boot space like?",
        answer:
          "The VF6 offers practical cargo space for family luggage and weekly shopping. See the specifications section on the model page for exact litres.",
      },
      {
        question: "Are OTA updates supported?",
        answer:
          "VinFast vehicles support connected software updates. Ask our advisors which features update over the air on your chosen VF6 trim.",
      },
      {
        question: "What colours are available?",
        answer:
          "Exterior colour availability varies by trim and stock. Check the VF6 configurator experience on the model page or ask the showroom.",
      },
      {
        question: "Is roadside assistance included?",
        answer:
          "VinFast roadside assistance programmes apply as per your vehicle package. Patliputra VinFast also provides local ownership support across Bihar.",
      },
      {
        question: "Can I get VF6 on-road price in Muzaffarpur?",
        answer:
          "Yes. We serve customers statewide including Muzaffarpur. Request a district-specific on-road quote online.",
      },
      {
        question: "What is VinFast VF6 Earth vs Wind?",
        answer:
          "Earth is the accessible entry trim; Wind and Wind Infinity add equipment and technology. Our advisors help match trim to budget.",
      },
      {
        question: "Does VF6 work for Bihar highway trips?",
        answer:
          "Yes, with sensible trip planning and DC fast-charging stops. Use our trip and range tools when planning longer journeys.",
      },
      {
        question: "How do I book a VF6?",
        answer:
          "Use Pre-Booking / Book Now on the website, or visit Patliputra VinFast in Patna. Our team guides documentation and delivery timelines.",
      },
      {
        question: "Is insurance available at the dealership?",
        answer:
          "Yes. We assist with EV insurance quotes and policy placement at purchase.",
      },
      {
        question: "What seating capacity does VF6 have?",
        answer: "The VF6 is a five-seater electric SUV.",
      },
      {
        question: "Which EV is best for Bihar roads?",
        answer:
          "For many buyers, VF6 balances ground clearance expectations of an SUV stance, range and features for Bihar city and highway mix. Test drive to confirm comfort.",
      },
      {
        question: "How much is VF6 EMI?",
        answer:
          "EMI depends on on-road price, down payment, tenure and rate. Use the EMI calculator for an instant estimate.",
      },
    ],
  },
  {
    modelKey: "vf7",
    modelName: "VinFast VF7",
    path: "/models/vf7",
    faqs: [
      {
        question: "What is the difference between Earth, Wind and Sky variants?",
        answer:
          "Earth, Wind, Wind Infinity, Sky and Sky Infinity step up luxury, technology and ADAS. Sky trims typically emphasise premium cabin and advanced driver assistance versus Earth/Wind.",
      },
      {
        question: "Which VF7 variant offers ADAS?",
        answer:
          "ADAS availability is concentrated on higher VF7 trims (notably Sky / Sky Infinity). Confirm the exact ADAS pack for your chosen variant with Patliputra VinFast.",
      },
      {
        question: "Is the VF7 a premium electric SUV?",
        answer:
          "Yes. VF7 is positioned as a premium connected electric SUV with luxury appointments and advanced technology.",
      },
      {
        question: "Does it support OTA updates?",
        answer:
          "Yes. Connected VinFast vehicles receive over-the-air software updates that can improve features over time.",
      },
      {
        question: "What smart connectivity features are included?",
        answer:
          "Expect modern infotainment, smartphone integration and connected services that vary by trim. Sky Infinity represents the richest experience.",
      },
      {
        question: "What safety technologies are available?",
        answer:
          "Multiple airbags, structural safety design and ADAS suites on higher trims. Ask for the safety list specific to your variant.",
      },
      {
        question: "What is the real-world driving range?",
        answer:
          "Real-world range depends on speed, climate, load and driving style. Start from the certified figure on the VF7 page, then discuss Bihar usage patterns with our team.",
      },
      {
        question: "Can I book a test drive online?",
        answer: "Yes. Book a VF7 test drive online; confirmation typically comes via WhatsApp.",
      },
      {
        question: "What charging options are available?",
        answer:
          "AC home charging plus DC fast charging on compatible public chargers. We guide home installation across Bihar.",
      },
      {
        question: "Does VinFast offer roadside assistance?",
        answer:
          "Roadside assistance is available as per VinFast ownership programmes. Patliputra VinFast provides local support statewide.",
      },
      {
        question: "What is VinFast VF7 price in Bihar?",
        answer:
          "Pricing varies by Earth, Wind, Wind Infinity, Sky and Sky Infinity. Request a current on-road quote for your district.",
      },
      {
        question: "Does VF7 have a panoramic roof?",
        answer:
          "Panoramic roof availability depends on trim. Higher Sky-oriented variants are the place to look — confirm on the build you choose.",
      },
      {
        question: "How does VF7 compare to BYD Atto 3?",
        answer:
          "Both are premium-leaning EVs. Compare ADAS, interior quality, range, warranty and dealer support on our comparison pages.",
      },
      {
        question: "How does VF7 compare to Hyundai Creta Electric?",
        answer:
          "Creta Electric and VF7 target lifestyle SUV buyers differently on tech and luxury. Test both and compare on-road offers.",
      },
      {
        question: "Is VF7 good for a family of five?",
        answer:
          "Yes. VF7 is a five-seater premium SUV designed for comfortable family travel.",
      },
      {
        question: "What is VF7 Wind Infinity vs Sky?",
        answer:
          "Sky variants generally add more premium and ADAS equipment over Wind Infinity. Our showroom walkthrough highlights the differences clearly.",
      },
      {
        question: "Can I get VF7 finance in Patna?",
        answer:
          "Yes. Partner bank/NBFC EV loans are arranged through Patliputra VinFast with EMI planning support.",
      },
      {
        question: "What interior highlights does VF7 offer?",
        answer:
          "A premium cabin with modern materials, large displays and comfort features that escalate through the trim ladder.",
      },
      {
        question: "Is VF7 suitable for Bihar highways?",
        answer:
          "Yes, with trip planning and DC charging stops. Long-range capability and ADAS on higher trims support confident highway driving.",
      },
      {
        question: "Which VinFast SUV is best for city driving?",
        answer:
          "VF6 is the smarter city-value pick; VF7 is ideal when you want premium features and ADAS in the city and beyond.",
      },
      {
        question: "Does VF7 support connected apps?",
        answer:
          "Yes. Connected services let you monitor and interact with the vehicle remotely where supported by trim and market features.",
      },
      {
        question: "What is the warranty on VF7?",
        answer:
          "Comprehensive vehicle and battery warranties apply. Ask for the latest VinFast warranty card details at purchase.",
      },
      {
        question: "Can corporates buy VF7?",
        answer:
          "Yes. Leadership and demo fleet purchases are supported via our corporate sales desk.",
      },
      {
        question: "How long is VF7 delivery?",
        answer:
          "Delivery timelines depend on variant, colour and stock. Patliputra VinFast shares estimated timelines at booking.",
      },
      {
        question: "Is there a VF7 Sky Infinity?",
        answer:
          "Yes. Sky Infinity sits at the top of the VF7 lineup with the richest feature set.",
      },
      {
        question: "What is VinFast VF7 ADAS?",
        answer:
          "ADAS may include adaptive cruise, lane support and collision mitigation features depending on pack. Experience them on a guided test drive.",
      },
      {
        question: "Where is the VinFast dealer for VF7 in Bihar?",
        answer:
          "Patliputra VinFast in Patna is Bihar’s authorised dealership serving all 38 districts.",
      },
      {
        question: "How much does it cost to charge a VinFast VF7?",
        answer:
          "Use the charging calculator with your tariff for a full-charge estimate — typically far lower than equivalent petrol costs.",
      },
      {
        question: "Can I exchange my SUV for a VF7?",
        answer:
          "Yes. Exchange valuations are available toward VF7 purchase.",
      },
      {
        question: "What seats does VF7 have?",
        answer: "The VF7 is a five-seater premium electric SUV.",
      },
    ],
  },
  {
    modelKey: "mpv7",
    modelName: "VinFast VF MPV7",
    path: "/models/mpv7",
    faqs: [
      {
        question: "Is the MPV7 suitable for large families?",
        answer:
          "Yes. The VF MPV7 is a spacious seven-seater electric MPV designed for large families and group travel.",
      },
      {
        question: "Does it have three-row seating?",
        answer: "Yes. MPV7 offers three-row seating for up to seven occupants.",
      },
      {
        question: "What is the luggage capacity?",
        answer:
          "Cargo space varies with third-row use. With seats in place you still get practical luggage room; folding rows expands capacity for big trips.",
      },
      {
        question: "Can it be used for corporate travel?",
        answer:
          "Yes. MPV7 suits executive guest transport and corporate fleets seeking electric running costs.",
      },
      {
        question: "What is the expected charging time?",
        answer:
          "Overnight AC charging is typical at home. DC fast charging shortens top-ups on the road.",
      },
      {
        question: "Does it support fast charging?",
        answer: "Yes. MPV7 supports DC fast charging alongside AC charging.",
      },
      {
        question: "What is the warranty period?",
        answer:
          "VinFast vehicle and battery warranties apply. Confirm current terms with Patliputra VinFast.",
      },
      {
        question: "Is it comfortable for long-distance travel?",
        answer:
          "Yes. Generous space, EV refinement and three-row flexibility make MPV7 strong for Bihar highway family trips.",
      },
      {
        question: "What infotainment features are included?",
        answer:
          "Modern touchscreen infotainment with connectivity features suited to family and fleet use. See the model page for the full list.",
      },
      {
        question: "Can businesses purchase fleets?",
        answer:
          "Yes. Corporate and institutional fleet purchases are supported statewide.",
      },
      {
        question: "What is VinFast MPV7 price?",
        answer:
          "Request a current ex-showroom and on-road quote from Patliputra VinFast for Bihar delivery.",
      },
      {
        question: "Is MPV7 the best electric MPV in India for families?",
        answer:
          "For buyers needing seven seats with EV benefits, MPV7 is a top contender — especially with local dealer support in Bihar.",
      },
      {
        question: "How does MPV7 differ from Limo Green?",
        answer:
          "Both are seven-seat electric people carriers. Compare positioning, equipment and fleet suitability with our advisors.",
      },
      {
        question: "Can I book MPV7 test drive?",
        answer: "Yes. Book online; our team will schedule your experience.",
      },
      {
        question: "Is MPV7 good for school and airport runs?",
        answer:
          "Yes. Three rows and easy access make it practical for family logistics and guest transport.",
      },
      {
        question: "What about running costs vs diesel MPV?",
        answer:
          "Electricity costs are typically much lower per kilometre than diesel. Use the running-cost calculator for a personalised comparison.",
      },
      {
        question: "Does MPV7 have captain seats?",
        answer:
          "Seating configuration details depend on the offered layout. Confirm second-row style during your showroom visit or test drive.",
      },
      {
        question: "Is finance available for MPV7?",
        answer: "Yes. EV finance options are available through partner lenders.",
      },
      {
        question: "Can I get MPV7 in Darbhanga or Bhagalpur?",
        answer:
          "Yes. Patliputra VinFast serves customers across all Bihar districts including Darbhanga and Bhagalpur.",
      },
      {
        question: "What safety features does MPV7 include?",
        answer:
          "Modern EV safety structure and assist features as equipped. Ask for the variant safety sheet.",
      },
      {
        question: "Is home charging enough for MPV7?",
        answer:
          "For most owners, overnight home charging covers daily family use. Public DC charging supports longer journeys.",
      },
      {
        question: "Which VinFast model suits a family of five or more?",
        answer:
          "Families of five can choose VF6 or VF7; for six–seven occupants, MPV7 is the purpose-built option.",
      },
      {
        question: "Can hotels use MPV7 for guest transfers?",
        answer:
          "Yes. Quiet electric operation and seven seats suit hospitality fleets.",
      },
      {
        question: "How do I compare MPV7 vs petrol Innova-class vehicles?",
        answer:
          "Compare fuel vs electricity cost, maintenance, cabin quietness and emissions using our calculators and a side-by-side test drive.",
      },
      {
        question: "What is the booking process?",
        answer:
          "Reserve online or at the Patna showroom. Pay booking amount as applicable and complete KYC/finance steps with our team.",
      },
      {
        question: "Does MPV7 support OTA?",
        answer:
          "Connected software updates are part of the VinFast ownership experience where applicable.",
      },
      {
        question: "Is insurance mandatory?",
        answer:
          "Yes, as per Indian regulations. We help arrange EV-appropriate cover at delivery.",
      },
      {
        question: "What colours are offered?",
        answer:
          "Colour availability depends on stock. Check with the showroom for current MPV7 shades.",
      },
      {
        question: "Where is after-sales service?",
        answer:
          "Authorised service through Patliputra VinFast with support for owners across Bihar.",
      },
      {
        question: "Is MPV7 available with Standard variant only?",
        answer:
          "MPV7 is offered in the Standard configuration in the current lineup. Confirm equipment details with our advisors.",
      },
    ],
  },
];

export function getModelFaqs(modelKey: string) {
  return MODEL_FAQ_SETS.find((s) => s.modelKey === modelKey) ?? null;
}

export const ALL_MODEL_FAQS = MODEL_FAQ_SETS.flatMap((s) =>
  s.faqs.map((f) => ({ ...f, modelKey: s.modelKey, modelName: s.modelName }))
);
