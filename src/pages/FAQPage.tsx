import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePageSeo } from "@/lib/seo";
import { breadcrumbSchema, faqSchema } from "@/lib/seoSchemas";

type FaqItem = { question: string; answer: string };

const FAQ_GROUPS: { id: string; label: string; faqs: FaqItem[] }[] = [
  {
    id: "vf6",
    label: "VinFast VF6",
    faqs: [
      {
        question: "What is the driving range of the VinFast VF6?",
        answer:
          "The VF6 is designed for everyday Bihar commuting with a competitive certified range for a compact e-SUV. Real-world range varies with traffic, AC use, and driving style. Visit Patliputra VinFast for a test drive and our team will walk you through expected range for your typical routes.",
      },
      {
        question: "How long does it take to charge the VF6?",
        answer:
          "Charging time depends on your charger power and how empty the battery is. A home AC wallbox is convenient overnight; DC fast charging is faster for top-ups on longer trips. Our advisors can recommend the right home setup for your usage in Patna and across Bihar.",
      },
      {
        question: "Does the VF6 support DC fast charging?",
        answer:
          "Yes, the VF6 supports DC fast charging in addition to AC home charging. That makes it practical for city use with occasional highway trips. We can show you charging options during your showroom visit or test drive.",
      },
      {
        question: "What battery warranty does the VF6 offer?",
        answer:
          "VinFast provides a manufacturer battery warranty on VF6 models sold in India. Exact coverage terms can vary by programme and purchase date. Speak with Patliputra VinFast for the latest warranty details before you book.",
      },
      {
        question: "Can I install a home charger for the VF6 in Bihar?",
        answer:
          "Most VF6 owners prefer a dedicated home charger for overnight top-ups. Our team can guide you on site assessment, recommended charger types, and installation partners serving Patna and nearby districts. Contact us after booking to plan installation.",
      },
      {
        question: "Is the VF6 suitable for daily city driving in Bihar?",
        answer:
          "Yes. The VF6’s compact footprint, electric torque, and easy parking make it a strong choice for Patna traffic and district-city commuting. Book a test drive to feel how it handles your daily routes.",
      },
      {
        question: "How much does a full charge cost for the VF6?",
        answer:
          "Cost depends on your electricity tariff and how much energy you add. Home charging in Bihar is typically far cheaper per kilometre than petrol. Try our charging calculator for an estimate, then confirm tariff details with your local utility.",
      },
      {
        question: "Are VF6 maintenance costs lower than petrol cars?",
        answer:
          "Electric vehicles generally need less routine maintenance because there is no engine oil, clutch, or exhaust system. VinFast scheduled services still apply. Ask our service desk for a maintenance overview tailored to VF6 ownership.",
      },
      {
        question: "What financing options are available for the VF6?",
        answer:
          "Patliputra VinFast works with finance partners for EMI plans suited to different down-payment and tenure preferences. Use our EMI calculator for a quick estimate, then visit us for live offers and documentation help.",
      },
      {
        question: "Can I exchange my current vehicle for a VF6?",
        answer:
          "Yes. We assist with exchange evaluations and can factor your existing vehicle into the purchase plan. Bring your car to the showroom for an assessment, or contact us to schedule an evaluation alongside your VF6 test drive.",
      },
    ],
  },
  {
    id: "vf7",
    label: "VinFast VF7",
    faqs: [
      {
        question: "What is the difference between VF7 Earth, Wind, and Sky variants?",
        answer:
          "Earth, Wind, and Sky are VF7 trim levels that step up features, comfort, and technology. Higher trims typically add more convenience and advanced driver aids. Our consultants at Patliputra VinFast can compare variants side by side for your priorities and budget.",
      },
      {
        question: "Which VF7 variant offers ADAS?",
        answer:
          "Advanced driver-assistance features are available on select higher VF7 variants. Availability depends on the trim and specification pack. Visit the showroom to see which ADAS features are included on the variant you are considering.",
      },
      {
        question: "Is the VF7 a premium electric SUV?",
        answer:
          "The VF7 is positioned as VinFast’s premium e-SUV for India, with a spacious cabin, modern design, and feature-rich trims. It suits buyers who want more presence and comfort than a compact EV. Experience it on a test drive with Patliputra VinFast.",
      },
      {
        question: "Does the VF7 receive OTA software updates?",
        answer:
          "VinFast vehicles are designed with connected software that can receive over-the-air improvements where supported. Update availability depends on model and network connectivity. Ask our team what OTA enhancements currently apply to the VF7.",
      },
      {
        question: "What smart connectivity features does the VF7 have?",
        answer:
          "The VF7 includes modern connected-car features such as smartphone-friendly infotainment and remote vehicle functions on supported trims. Exact apps and services can vary. We will demonstrate connectivity during your showroom visit.",
      },
      {
        question: "What safety technology is available on the VF7?",
        answer:
          "VF7 models come with a suite of passive and active safety systems, with additional ADAS on select variants. Specs differ by trim. Our advisors can walk you through airbags, cameras, sensors, and assist features for each variant.",
      },
      {
        question: "What real-world range can I expect from the VF7?",
        answer:
          "Certified range is a useful starting point, but real-world range depends on speed, load, climate control, and road conditions in Bihar. A highway-plus-city test drive with our team is the best way to set expectations for your usage.",
      },
      {
        question: "Can I book a VF7 test drive online?",
        answer:
          "Yes. Use our online test-drive form to pick a preferred time, and Patliputra VinFast will confirm your slot. You can also call or walk into the showroom if you prefer to schedule in person.",
      },
      {
        question: "What charging options does the VF7 support?",
        answer:
          "The VF7 supports AC home charging and DC fast charging for quicker top-ups. We help customers plan home wallbox installation and explain public charging etiquette for Bihar trips. Bring your parking setup details when you visit.",
      },
      {
        question: "Is roadside assistance available for VF7 owners?",
        answer:
          "VinFast ownership programmes typically include roadside support subject to the terms of your purchase package. Coverage details can vary. Ask Patliputra VinFast for the assistance benefits linked to your VF7 booking.",
      },
    ],
  },
  {
    id: "mpv7",
    label: "VinFast VF MPV7",
    faqs: [
      {
        question: "Is the VinFast MPV7 suitable for large families?",
        answer:
          "Yes. The MPV7 is built around family and multi-passenger comfort with three-row seating. It is a strong fit for households that regularly travel with children, elders, or guests across Bihar. Book a test drive to check seat access and cabin space.",
      },
      {
        question: "Does the MPV7 offer three-row seating?",
        answer:
          "The MPV7 is a seven-seater MPV with three rows designed for everyday family use. Seat flexibility and comfort vary with how you configure luggage versus passengers. Our team can demonstrate folding and access options at the showroom.",
      },
      {
        question: "How much luggage capacity does the MPV7 have?",
        answer:
          "Luggage space depends on whether all three rows are occupied. With rear seats folded or partially used, cargo volume increases for trips and airport runs. Visit Patliputra VinFast to see practical packing configurations in person.",
      },
      {
        question: "Is the MPV7 good for corporate and staff travel?",
        answer:
          "Many businesses choose a seven-seater EV for guest pickups, campus transfers, and executive travel with lower running costs. We can discuss fleet-friendly purchase and charging plans for organisations in Patna and across Bihar.",
      },
      {
        question: "How long does MPV7 charging take?",
        answer:
          "Charge time depends on charger power and the battery’s starting level. Overnight AC charging suits most family routines; DC fast charging shortens stops on longer journeys. Use our charging calculator for a planning estimate.",
      },
      {
        question: "Does the MPV7 support fast charging?",
        answer:
          "Yes, DC fast charging is supported alongside AC home charging. That flexibility helps families and fleet users mix overnight charging with occasional public top-ups. Confirm recommended charge curves with our advisors.",
      },
      {
        question: "What is the warranty period on the MPV7?",
        answer:
          "VinFast offers manufacturer warranty coverage on the vehicle and battery as per the applicable India programme. Terms can update over time. Patliputra VinFast will share the current warranty card details before you finalise your booking.",
      },
      {
        question: "Is the MPV7 comfortable for long-distance travel in Bihar?",
        answer:
          "The MPV7’s spacious cabin and electric drivetrain make highway and inter-district trips more relaxed for passengers. Plan charging stops for longer routes. A test drive on mixed roads is the best way to judge comfort for your family.",
      },
      {
        question: "What infotainment features does the MPV7 include?",
        answer:
          "Expect a modern touchscreen interface with smartphone connectivity on supported trims, plus cabin features aimed at family convenience. Feature lists vary by specification. We will demonstrate the system during your showroom visit.",
      },
      {
        question: "Can businesses buy MPV7 vehicles as a fleet?",
        answer:
          "Yes. Patliputra VinFast supports fleet and multi-unit enquiries for corporate buyers. Share your volume, charging setup, and usage profile, and we will propose a purchase and support plan.",
      },
    ],
  },
  {
    id: "charging",
    label: "Charging & Ownership",
    faqs: [
      {
        question: "How do I set up home charging for a VinFast EV in Bihar?",
        answer:
          "Start with a parking spot that has safe power access, then choose an AC wallbox matched to your electrical load. Patliputra VinFast can guide site checks and introduce trusted installers. Most owners charge overnight and start each day ready to drive.",
      },
      {
        question: "Is public charging available in Bihar?",
        answer:
          "Public and destination charging options are expanding in Patna and other Bihar cities, alongside highway corridors. Availability still varies by route, so home charging remains the most reliable base. Ask us for current public-charging tips for your travel pattern.",
      },
      {
        question: "How do EV running costs compare with petrol in Bihar?",
        answer:
          "Per kilometre, electricity is usually much cheaper than petrol at typical Bihar tariffs and fuel prices. Savings grow with monthly kilometres driven. Try our running-cost calculator for a personalised monthly and yearly comparison.",
      },
      {
        question: "How long does an EV battery typically last?",
        answer:
          "Modern EV batteries are engineered for many years of normal use and are backed by manufacturer warranty programmes. Longevity depends on charging habits and climate. Our team can share best practices to help protect battery health over ownership.",
      },
    ],
  },
  {
    id: "finance",
    label: "Finance & Booking",
    faqs: [
      {
        question: "What EMI options are available at Patliputra VinFast?",
        answer:
          "We offer flexible down-payment and tenure combinations through partner financiers. Rates and eligibility depend on your profile and the model you choose. Use the EMI calculator online, then visit us for live quotes and paperwork support.",
      },
      {
        question: "How does the VinFast booking process work?",
        answer:
          "Choose your model and variant, place a booking with our team, complete finance or payment formalities, and schedule delivery. We keep you updated on documentation and handover. Contact Patliputra VinFast to start the process for VF6, VF7, or MPV7.",
      },
      {
        question: "How do I book a VinFast test drive in Bihar?",
        answer:
          "Submit the online test-drive request or call the showroom. Pick a preferred slot and model, and our team will confirm availability. Bring a valid driving licence so you can experience the vehicle on the road.",
      },
      {
        question: "Do you help with vehicle exchange and insurance?",
        answer:
          "Yes. We assist with exchange evaluations and can guide you on insurance options for your new VinFast. Bring your existing policy and RC details when you visit so we can streamline the process with your booking.",
      },
    ],
  },
];

const ALL_FAQS = FAQ_GROUPS.flatMap((g) => g.faqs);

export default function FAQPage() {
  const faqLd = faqSchema(ALL_FAQS);
  usePageSeo({
    title: "VinFast EV FAQs for Bihar | Patliputra VinFast",
    description:
      "Answers on VinFast VF6, VF7, MPV7, charging, ownership, EMI and booking from Patliputra VinFast — authorised dealer for Patna and Bihar.",
    keywords: [
      "VinFast FAQ Bihar",
      "VF6 FAQ",
      "VF7 FAQ",
      "MPV7 FAQ",
      "EV charging Bihar",
      "Patliputra VinFast",
      "VinFast EMI Patna",
    ],
    canonicalPath: "/faq",
    schemas: [
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "FAQ", path: "/faq" },
      ]),
      ...(faqLd ? [faqLd] : []),
    ],
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
        <nav aria-label="Breadcrumb" className="container mx-auto px-4 lg:px-8 pt-24 lg:pt-28">
          <ol className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
            <li>
              <Link to="/" className="hover:text-foreground">
                Home
              </Link>
            </li>
            <ChevronRight className="w-3 h-3" aria-hidden />
            <li className="text-foreground font-medium">FAQ</li>
          </ol>
        </nav>

        <header className="container mx-auto px-4 lg:px-8 py-10 lg:py-14">
          <p className="text-primary font-display font-semibold text-sm uppercase tracking-[0.2em] mb-3">
            Help Centre
          </p>
          <h1 className="font-display text-3xl lg:text-5xl font-bold text-foreground max-w-3xl leading-tight">
            VinFast EV FAQs for Bihar
          </h1>
          <p className="text-muted-foreground text-base lg:text-lg leading-relaxed max-w-3xl mt-5">
            Straight answers from Patliputra VinFast on VF6, VF7, MPV7, charging, ownership, finance,
            and booking. Specs and offers can vary — book a test drive or contact us for the latest
            details for your district.
          </p>
        </header>

        <section className="container mx-auto px-4 lg:px-8 pb-10 max-w-4xl" aria-labelledby="faq-groups-heading">
          <h2 id="faq-groups-heading" className="sr-only">
            FAQ categories
          </h2>
          <Tabs defaultValue="vf6" className="w-full">
            <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 bg-muted p-1">
              {FAQ_GROUPS.map((group) => (
                <TabsTrigger key={group.id} value={group.id} className="text-xs sm:text-sm">
                  {group.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {FAQ_GROUPS.map((group) => (
              <TabsContent key={group.id} value={group.id} className="mt-6">
                <h2 className="font-display text-xl lg:text-2xl font-bold text-foreground mb-4">
                  {group.label}
                </h2>
                <Accordion type="single" collapsible className="w-full">
                  {group.faqs.map((f, i) => (
                    <AccordionItem key={`${group.id}-${i}`} value={`${group.id}-${i}`}>
                      <AccordionTrigger className="text-left text-sm lg:text-base">
                        {f.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                        {f.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>
            ))}
          </Tabs>
        </section>

        <section className="container mx-auto px-4 lg:px-8 py-8 max-w-4xl" aria-labelledby="faq-links-heading">
          <h2 id="faq-links-heading" className="font-display text-lg font-bold text-foreground mb-4">
            Explore models & tools
          </h2>
          <div className="flex flex-wrap gap-2">
            {[
              { to: "/models/vf6", label: "VinFast VF6" },
              { to: "/models/vf7", label: "VinFast VF7" },
              { to: "/models/mpv7", label: "VinFast MPV7" },
              { to: "/test-drive", label: "Book a test drive" },
              { to: "/emi-calculator", label: "EMI calculator" },
              { to: "/charging-calculator", label: "Charging calculator" },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="rounded-full border border-border/60 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="mt-8">
            <Button asChild size="lg" className="bg-primary text-primary-foreground">
              <Link to="/test-drive">Book a test drive</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
      <StickyMobileCTA />
    </div>
  );
}
