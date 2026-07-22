import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
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
import { fetchDistrictPage, type DistrictPagePayload } from "@/lib/seoApi";
import {
  BIHAR_DISTRICTS_SEO,
  SEO_MODEL_LABELS,
  SEO_MODEL_ROUTE_MAP,
  getDistrictName,
  isSeoDistrictSlug,
  isSeoModelSlug,
  type SeoModelSlug,
} from "@/data/seo/biharDistrictsSeo";
import NotFound from "@/pages/NotFound";

export default function DistrictLandingPage() {
  const { districtSlug = "", modelSlug = "" } = useParams();
  const valid = isSeoDistrictSlug(districtSlug) && isSeoModelSlug(modelSlug);
  const [page, setPage] = useState<DistrictPagePayload | null>(null);
  const [loading, setLoading] = useState(valid);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!valid) return;
    let cancelled = false;
    setLoading(true);
    setFailed(false);
    fetchDistrictPage(districtSlug, modelSlug).then((data) => {
      if (cancelled) return;
      if (data) {
        setPage(data);
        setFailed(false);
      } else {
        setPage(null);
        setFailed(true);
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [districtSlug, modelSlug, valid]);

  if (!valid) return <NotFound />;

  const model = modelSlug as SeoModelSlug;
  const districtName = page?.districtName || getDistrictName(districtSlug);
  const modelName = page?.modelName || SEO_MODEL_LABELS[model];
  const modelPath = SEO_MODEL_ROUTE_MAP[model];
  const path = `/${districtSlug}/${modelSlug}`;

  const fallbackTitle = `${modelName} in ${districtName} — Price, Booking & Test Drive | Patliputra VinFast`;
  const fallbackDescription = `Buy ${modelName} in ${districtName}, Bihar. On-road price, EMI, exchange, charging guidance and test drive from Patliputra VinFast — Bihar's authorised VinFast dealer.`;

  const siblingModels = (Object.keys(SEO_MODEL_LABELS) as SeoModelSlug[]).filter((s) => s !== model);
  const nearbyDistricts = BIHAR_DISTRICTS_SEO.filter((d) => d.slug !== districtSlug).slice(0, 12);

  return (
    <div className="min-h-screen bg-background pb-36 lg:pb-0">
      <SeoHead
        title={page?.metaTitle || fallbackTitle}
        description={page?.metaDescription || fallbackDescription}
        path={path}
        keywords={page?.keywords || [`${modelName} ${districtName}`, `VinFast Dealer ${districtName}`, `Electric SUV ${districtName}`]}
        schemas={page?.schemas || []}
      />
      <Navbar />

      <section className="pt-24 pb-10 lg:pt-32 lg:pb-14 border-b border-border/40 bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <p className="text-sm text-muted-foreground mb-3">
            <Link to="/" className="hover:text-foreground">Home</Link>
            {" / "}
            <Link to={modelPath} className="hover:text-foreground">{modelName}</Link>
            {" / "}
            <span className="text-foreground">{districtName}</span>
          </p>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-primary font-display font-semibold text-sm uppercase tracking-[0.2em] mb-3">
              {districtName}, Bihar
            </p>
            <h1 className="font-display font-bold text-3xl md:text-5xl leading-tight mb-4">
              {page?.h1 || `${modelName} in ${districtName} — Price, Variants & Test Drive`}
            </h1>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
              {loading
                ? "Loading local pricing and ownership details…"
                : page?.intro ||
                  `${modelName} is available to customers in ${districtName} through Patliputra VinFast — Bihar's authorised VinFast dealership. Book a test drive, explore finance and get an on-road quote.`}
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Button asChild size="lg">
                <Link to="/test-drive">Book Test Drive</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/book-now">Get On-Road Price</Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link to={modelPath}>View {modelName}</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 lg:px-8 max-w-4xl py-12 lg:py-16 space-y-12">
        {failed && !page ? (
          <p className="text-muted-foreground">
            Live district content will appear when connected to the API. You can still explore the{" "}
            <Link className="text-primary underline" to={modelPath}>
              {modelName}
            </Link>{" "}
            model page or book a test drive.
          </p>
        ) : null}

        {(page?.sections || []).map((section) => (
          <section key={section.heading}>
            <h2 className="font-display font-bold text-2xl md:text-3xl mb-4">{section.heading}</h2>
            <p className="text-muted-foreground leading-relaxed">{section.body}</p>
          </section>
        ))}

        {!page?.sections?.length && !loading ? (
          <>
            <section>
              <h2 className="font-display font-bold text-2xl md:text-3xl mb-4">
                Why choose {modelName} in {districtName}?
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Patliputra VinFast brings authorised VinFast sales, finance, insurance, exchange and after-sales support to customers in {districtName}.
                Explore variants, calculate EMI and schedule a test drive without leaving your district research journey.
              </p>
            </section>
            <section>
              <h2 className="font-display font-bold text-2xl md:text-3xl mb-4">Local EV keywords we help you with</h2>
              <ul className="grid sm:grid-cols-2 gap-2 text-muted-foreground text-sm">
                {[
                  `VinFast Dealer ${districtName}`,
                  `Electric SUV ${districtName}`,
                  `Premium EV ${districtName}`,
                  `EV Showroom ${districtName}`,
                  `Electric SUV Test Drive ${districtName}`,
                  `Buy Electric SUV ${districtName}`,
                ].map((k) => (
                  <li key={k} className="rounded-lg border border-border/50 px-3 py-2">
                    {k}
                  </li>
                ))}
              </ul>
            </section>
          </>
        ) : null}

        {(page?.faqs?.length ? page.faqs : []).length > 0 ? (
          <section>
            <h2 className="font-display font-bold text-2xl md:text-3xl mb-6">FAQs — {modelName} in {districtName}</h2>
            <Accordion type="single" collapsible>
              {page!.faqs.map((faq, i) => (
                <AccordionItem key={faq.question} value={`d-faq-${i}`}>
                  <AccordionTrigger className="text-left font-display">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        ) : null}

        <section>
          <h2 className="font-display font-bold text-2xl md:text-3xl mb-4">Other VinFast models in {districtName}</h2>
          <div className="flex flex-wrap gap-3">
            {siblingModels.map((slug) => (
              <Button key={slug} asChild variant="outline">
                <Link to={`/${districtSlug}/${slug}`}>{SEO_MODEL_LABELS[slug]}</Link>
              </Button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display font-bold text-2xl md:text-3xl mb-4">
            {modelName} in other Bihar districts
          </h2>
          <div className="flex flex-wrap gap-2">
            {nearbyDistricts.map((d) => (
              <Link
                key={d.slug}
                to={`/${d.slug}/${modelSlug}`}
                className="text-sm px-3 py-1.5 rounded-full border border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
              >
                {d.name}
              </Link>
            ))}
            <Link to="/bihar" className="text-sm px-3 py-1.5 text-primary hover:underline">
              View all 38 districts →
            </Link>
          </div>
        </section>
      </div>

      <Footer />
      <StickyMobileCTA />
    </div>
  );
}
