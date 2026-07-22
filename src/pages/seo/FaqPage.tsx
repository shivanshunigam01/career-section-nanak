import { Link } from "react-router-dom";
import SeoPageShell from "@/components/seo/SeoPageShell";
import { MODEL_FAQ_SETS } from "@/data/seo/modelFaqs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FaqPage() {
  return (
    <SeoPageShell
      title="VinFast FAQ Bihar | VF6, VF7, MPV7 Questions Answered"
      description="Frequently asked questions about VinFast VF6, VF7 and MPV7 in Bihar — range, charging, ADAS, finance, warranty and test drives from Patliputra VinFast."
      path="/faq"
      keywords={[
        "VinFast FAQ",
        "VF6 FAQ",
        "VF7 FAQ",
        "MPV7 FAQ",
        "Electric car questions Bihar",
      ]}
      eyebrow="Help Centre"
      h1="VinFast FAQs for Bihar Buyers"
      lead="Natural-language answers for research, comparison and purchase — optimised for search and AI assistants."
      ctaPrimary={{ label: "Book Test Drive", to: "/test-drive" }}
      ctaSecondary={{ label: "Contact Us", to: "/contact" }}
    >
      <div className="space-y-12">
        {MODEL_FAQ_SETS.map((set) => (
          <section key={set.modelKey} id={set.modelKey}>
            <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
              <h2 className="font-display font-bold text-2xl md:text-3xl">{set.modelName}</h2>
              <Link to={set.path} className="text-sm text-primary hover:underline">
                View model page →
              </Link>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {set.faqs.map((faq, i) => (
                <AccordionItem key={faq.question} value={`${set.modelKey}-${i}`}>
                  <AccordionTrigger className="text-left font-display">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        ))}
      </div>
    </SeoPageShell>
  );
}
