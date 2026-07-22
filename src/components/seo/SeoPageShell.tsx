import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import SeoHead from "@/components/seo/SeoHead";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { SeoFaq } from "@/lib/seoApi";

export type SeoPageSection = {
  heading: string;
  body: string;
  bullets?: string[];
};

type SeoPageShellProps = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  eyebrow?: string;
  h1: string;
  lead?: string;
  sections?: SeoPageSection[];
  faqs?: SeoFaq[];
  schemas?: Record<string, unknown>[];
  ctaPrimary?: { label: string; to: string };
  ctaSecondary?: { label: string; to: string };
  children?: React.ReactNode;
};

export default function SeoPageShell({
  title,
  description,
  path,
  keywords = [],
  eyebrow = "Patliputra VinFast",
  h1,
  lead,
  sections = [],
  faqs = [],
  schemas = [],
  ctaPrimary = { label: "Book Test Drive", to: "/test-drive" },
  ctaSecondary = { label: "Get On-Road Price", to: "/book-now" },
  children,
}: SeoPageShellProps) {
  const faqSchema =
    faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }
      : null;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://patliputravinfast.in/" },
      { "@type": "ListItem", position: 2, name: h1, item: `https://patliputravinfast.in${path}` },
    ],
  };

  return (
    <div className="min-h-screen bg-background pb-36 lg:pb-0">
      <SeoHead
        title={title}
        description={description}
        path={path}
        keywords={keywords}
        schemas={[breadcrumbSchema, ...(faqSchema ? [faqSchema] : []), ...schemas]}
      />
      <Navbar />

      <section className="pt-24 pb-10 lg:pt-32 lg:pb-14 border-b border-border/40 bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-primary font-display font-semibold text-sm uppercase tracking-[0.2em] mb-3">
              {eyebrow}
            </p>
            <h1 className="font-display font-bold text-3xl md:text-5xl leading-tight mb-4">{h1}</h1>
            {lead ? <p className="text-muted-foreground text-base md:text-lg leading-relaxed">{lead}</p> : null}
            <div className="flex flex-wrap gap-3 mt-8">
              <Button asChild size="lg">
                <Link to={ctaPrimary.to}>{ctaPrimary.label}</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to={ctaSecondary.to}>{ctaSecondary.label}</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 lg:px-8 max-w-4xl py-12 lg:py-16 space-y-12">
        {sections.map((section) => (
          <motion.section
            key={section.heading}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display font-bold text-2xl md:text-3xl mb-4">{section.heading}</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{section.body}</p>
            {section.bullets?.length ? (
              <ul className="mt-4 space-y-2 text-muted-foreground">
                {section.bullets.map((b) => (
                  <li key={b} className="flex gap-2">
                    <span className="text-primary mt-1.5 shrink-0">•</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </motion.section>
        ))}

        {children}

        {faqs.length > 0 ? (
          <section>
            <h2 className="font-display font-bold text-2xl md:text-3xl mb-6">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem key={faq.question} value={`faq-${i}`}>
                  <AccordionTrigger className="text-left font-display">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        ) : null}
      </div>

      <Footer />
      <StickyMobileCTA />
    </div>
  );
}
