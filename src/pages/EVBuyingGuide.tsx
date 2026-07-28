import type { ReactNode } from "react";
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
import { usePageSeo } from "@/lib/seo";
import { articleSchema, breadcrumbSchema, faqSchema } from "@/lib/seoSchemas";

const BUYING_FAQS = [
  {
    question: "Which VinFast EV is best for city driving in Bihar?",
    answer:
      "The VF6 is a strong compact e-SUV for daily Patna and district-city commuting. If you want a larger premium SUV with more features, consider the VF7. Families needing seven seats should look at the MPV7. A test drive is the clearest way to decide.",
  },
  {
    question: "Do I need a home charger before buying an EV?",
    answer:
      "Home charging is the most convenient option for overnight top-ups, but it is not always mandatory on day one. Many buyers arrange a wallbox soon after booking. Patliputra VinFast can advise on power requirements and installation partners in Bihar.",
  },
  {
    question: "How should I compare EV running costs with petrol?",
    answer:
      "Compare cost per kilometre using your monthly distance, local electricity tariff, and petrol mileage. EVs usually cost less to run, especially at higher monthly kilometres. Use our running-cost calculator for a Bihar-focused estimate.",
  },
  {
    question: "Can I finance a VinFast EV on EMI?",
    answer:
      "Yes. Patliputra VinFast works with finance partners for flexible EMI plans. Check the EMI calculator for a planning figure, then visit the showroom for live offers, eligibility checks, and documentation support.",
  },
  {
    question: "What should I check on a VinFast test drive?",
    answer:
      "Evaluate seating comfort, visibility, cabin noise, charging port access, boot or third-row space, and how the vehicle feels in traffic. Bring typical passenger counts and route notes so our advisors can tailor the drive.",
  },
];

const SECTIONS: { heading: string; body: ReactNode }[] = [
  {
    heading: "Why go electric in Bihar",
    body: (
      <>
        <p>
          Bihar drivers spend significant time in stop-go traffic, where electric torque and lower
          per-kilometre energy costs can make everyday mobility smoother and more affordable. Quieter
          cabins, fewer oil-service visits, and the option to charge overnight at home are practical
          advantages for Patna professionals and district-city households alike.
        </p>
        <p className="mt-4">
          As public and destination charging continue to expand, pairing a home charger with
          occasional public top-ups is already a workable ownership pattern for many VinFast buyers
          served by Patliputra VinFast.
        </p>
      </>
    ),
  },
  {
    heading: "Understanding EV types & the VinFast lineup",
    body: (
      <>
        <p>
          VinFast’s India lineup at Patliputra VinFast covers three clear use cases. The{" "}
          <Link to="/models/vf6" className="text-primary hover:underline">
            VF6
          </Link>{" "}
          is a compact e-SUV suited to city parking and daily commuting. The{" "}
          <Link to="/models/vf7" className="text-primary hover:underline">
            VF7
          </Link>{" "}
          is a premium e-SUV with higher trims that can include ADAS and richer equipment. The{" "}
          <Link to="/models/mpv7" className="text-primary hover:underline">
            MPV7
          </Link>{" "}
          is a seven-seater focused on family and multi-passenger comfort.
        </p>
        <p className="mt-4">
          If you are undecided between two models, use our{" "}
          <Link to="/compare" className="text-primary hover:underline">
            model compare
          </Link>{" "}
          page, then schedule a back-to-back test drive.
        </p>
      </>
    ),
  },
  {
    heading: "How to choose the right EV",
    body: (
      <ul className="list-disc pl-5 space-y-2">
        <li>
          <span className="text-foreground font-medium">Range:</span> Match certified range to your
          longest regular trip, with a buffer for AC use and highway speeds.
        </li>
        <li>
          <span className="text-foreground font-medium">Charging access:</span> Prefer home or
          workplace charging for overnight top-ups; plan public charging for longer Bihar routes.
        </li>
        <li>
          <span className="text-foreground font-medium">Budget:</span> Look beyond on-road price to
          EMI, electricity cost, and maintenance. The{" "}
          <Link to="/emi-calculator" className="text-primary hover:underline">
            EMI calculator
          </Link>{" "}
          and{" "}
          <Link to="/running-cost-calculator" className="text-primary hover:underline">
            running-cost calculator
          </Link>{" "}
          help frame the full picture.
        </li>
        <li>
          <span className="text-foreground font-medium">Family size:</span> Two to five regular
          occupants often fit VF6 or VF7; seven-seat needs point toward MPV7.
        </li>
      </ul>
    ),
  },
  {
    heading: "Charging at home vs public",
    body: (
      <>
        <p>
          Home AC charging is the backbone of EV ownership: plug in after you park and wake up with
          a usable state of charge. A dedicated wallbox is usually more convenient and safer than a
          basic portable lead for daily use.
        </p>
        <p className="mt-4">
          Public DC fast charging is ideal for longer trips or when you cannot charge at home.
          Availability in Bihar is improving but still route-dependent, so treat public charging as
          a supplement rather than your only plan. Patliputra VinFast can help you map a practical
          charging mix before delivery.
        </p>
      </>
    ),
  },
  {
    heading: "Total cost of ownership basics",
    body: (
      <p>
        Total cost of ownership includes purchase price or EMI, electricity, scheduled service,
        insurance, tyres, and residual value. EVs often win on energy and routine maintenance even
        when the sticker price is similar to a comparable petrol SUV. Run your monthly kilometres
        through the{" "}
        <Link to="/running-cost-calculator" className="text-primary hover:underline">
          running-cost calculator
        </Link>{" "}
        and discuss insurance and exchange options with our team for a Bihar-specific estimate.
      </p>
    ),
  },
  {
    heading: "Finance, EMI & exchange",
    body: (
      <p>
        Most buyers combine a down payment with an EMI plan through partner financiers. Use the{" "}
        <Link to="/emi-calculator" className="text-primary hover:underline">
          EMI calculator
        </Link>{" "}
        to explore tenure and down-payment scenarios, then visit Patliputra VinFast for live offers.
        If you already own a car, ask for an exchange evaluation so the trade-in can reduce the
        amount you finance.
      </p>
    ),
  },
  {
    heading: "Test drive checklist",
    body: (
      <ul className="list-disc pl-5 space-y-2">
        <li>Confirm seat height, steering reach, and rear-seat comfort for your passengers.</li>
        <li>Check boot or third-row access with the luggage you usually carry.</li>
        <li>Note visibility, turn-in feel, and braking confidence in traffic.</li>
        <li>Ask where the charge port is and how the cable routes in your parking spot.</li>
        <li>Discuss ADAS or connectivity features on the exact variant you intend to buy.</li>
        <li>
          Book via our{" "}
          <Link to="/test-drive" className="text-primary hover:underline">
            test drive
          </Link>{" "}
          page and bring a valid driving licence.
        </li>
      </ul>
    ),
  },
];

export default function EVBuyingGuide() {
  const faqLd = faqSchema(BUYING_FAQS);
  const description =
    "Complete EV buying guide for Bihar: choose VF6, VF7 or MPV7, plan charging, estimate costs, finance, and book a VinFast test drive with Patliputra VinFast.";

  usePageSeo({
    title: "EV Buying Guide for Bihar | Patliputra VinFast",
    description,
    keywords: [
      "EV buying guide Bihar",
      "buy electric car Patna",
      "VinFast VF6 VF7 MPV7",
      "EV charging Bihar",
      "Patliputra VinFast",
      "electric SUV Bihar",
    ],
    canonicalPath: "/ev-buying-guide",
    ogType: "article",
    schemas: [
      articleSchema({
        headline: "Complete EV Buying Guide for Bihar",
        description,
        path: "/ev-buying-guide",
      }),
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "EV Buying Guide", path: "/ev-buying-guide" },
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
            <li className="text-foreground font-medium">EV Buying Guide</li>
          </ol>
        </nav>

        <header className="container mx-auto px-4 lg:px-8 py-10 lg:py-14">
          <p className="text-primary font-display font-semibold text-sm uppercase tracking-[0.2em] mb-3">
            Buyer Guide
          </p>
          <h1 className="font-display text-3xl lg:text-5xl font-bold text-foreground max-w-3xl leading-tight">
            Complete EV Buying Guide for Bihar
          </h1>
          <p className="text-muted-foreground text-base lg:text-lg leading-relaxed max-w-3xl mt-5">
            A practical path from first interest to test drive — how to choose between VinFast VF6,
            VF7, and MPV7, plan charging, understand costs, and buy with confidence through
            Patliputra VinFast.
          </p>
        </header>

        <article className="container mx-auto px-4 lg:px-8 pb-6 space-y-12 max-w-4xl">
          {SECTIONS.map((section) => (
            <section key={section.heading} aria-labelledby={section.heading.replace(/\s+/g, "-").toLowerCase()}>
              <h2
                id={section.heading.replace(/\s+/g, "-").toLowerCase()}
                className="font-display text-xl lg:text-2xl font-bold text-foreground mb-3"
              >
                {section.heading}
              </h2>
              <div className="text-muted-foreground text-sm lg:text-base leading-relaxed">
                {section.body}
              </div>
            </section>
          ))}

          <section aria-labelledby="next-steps" className="rounded-2xl bg-primary/5 border border-primary/20 p-6 sm:p-8">
            <h2 id="next-steps" className="font-display text-xl lg:text-2xl font-bold text-foreground mb-3">
              Next steps
            </h2>
            <p className="text-muted-foreground text-sm lg:text-base leading-relaxed mb-6">
              Shortlist your model, estimate EMI and running costs, then book a test drive with
              Patliputra VinFast. Our team will help with charging guidance, exchange, insurance, and
              finance paperwork for buyers across Bihar.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-primary text-primary-foreground">
                <Link to="/test-drive">Book a test drive</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/compare">Compare models</Link>
              </Button>
            </div>
          </section>
        </article>

        <section className="container mx-auto px-4 lg:px-8 py-10 max-w-4xl" aria-labelledby="buying-faq">
          <h2 id="buying-faq" className="font-display text-xl lg:text-2xl font-bold text-foreground mb-5">
            Buying FAQs
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {BUYING_FAQS.map((f, i) => (
              <AccordionItem key={i} value={`buying-faq-${i}`}>
                <AccordionTrigger className="text-left text-sm lg:text-base">
                  {f.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                  {f.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <section className="container mx-auto px-4 lg:px-8 py-8 pb-16 max-w-4xl" aria-labelledby="guide-links">
          <h2 id="guide-links" className="font-display text-lg font-bold text-foreground mb-4">
            Helpful links
          </h2>
          <div className="flex flex-wrap gap-2">
            {[
              { to: "/models/vf6", label: "VF6" },
              { to: "/models/vf7", label: "VF7" },
              { to: "/models/mpv7", label: "MPV7" },
              { to: "/compare", label: "Compare" },
              { to: "/emi-calculator", label: "EMI calculator" },
              { to: "/running-cost-calculator", label: "Running cost calculator" },
              { to: "/test-drive", label: "Test drive" },
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
        </section>
      </main>

      <Footer />
      <StickyMobileCTA />
    </div>
  );
}
