import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronRight, MapPin, Loader2, CalendarCheck, Car } from "lucide-react";
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
import NotFound from "./NotFound";
import {
  fetchDistrictPage,
  fetchSeoDistricts,
  fetchSeoModels,
  modelPagePath,
  type DistrictPageData,
  type SeoDistrict,
  type SeoModel,
} from "@/lib/seoApi";
import { applyPageSeo } from "@/lib/seo";

/**
 * Hyperlocal SEO landing page: /{districtSlug}/{modelSlug}
 * (e.g. /patna/vinfast-vf6). Content, FAQs and JSON-LD come from the backend
 * DistrictPage documents (38 districts × models, editable in the admin API).
 */
export default function DistrictLanding() {
  const { districtSlug = "", modelSlug = "" } = useParams();
  const [page, setPage] = useState<DistrictPageData | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [districts, setDistricts] = useState<SeoDistrict[]>([]);
  const [models, setModels] = useState<SeoModel[]>([]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    setPage(null);
    void Promise.all([
      fetchDistrictPage(districtSlug, modelSlug),
      fetchSeoDistricts(),
      fetchSeoModels(),
    ]).then(([pageData, districtList, modelList]) => {
      if (cancelled) return;
      setDistricts(districtList ?? []);
      setModels(modelList ?? []);
      if (!pageData) {
        setNotFound(true);
      } else {
        setPage(pageData);
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [districtSlug, modelSlug]);

  useEffect(() => {
    if (!page) return;
    applyPageSeo(
      {
        title: page.metaTitle || `${page.modelName} in ${page.districtName} | Patliputra VinFast`,
        description: page.metaDescription,
        keywords: page.keywords,
        canonicalPath: page.path,
        schemas: page.schemas,
      },
      page.path,
    );
  }, [page]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-40 text-muted-foreground">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading…
        </div>
        <Footer />
      </div>
    );
  }

  if (notFound || !page) return <NotFound />;

  const otherModels = models.filter((m) => m.key !== page.modelKey);
  const popularDistricts = districts
    .filter((d) => d.slug !== page.districtSlug)
    .slice(0, 12);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="container mx-auto px-4 lg:px-8 pt-24 lg:pt-28">
          <ol className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
            <li>
              <Link to="/" className="hover:text-foreground">Home</Link>
            </li>
            <ChevronRight className="w-3 h-3" aria-hidden />
            <li>
              <Link to={modelPagePath(page.modelKey)} className="hover:text-foreground">
                {page.modelName}
              </Link>
            </li>
            <ChevronRight className="w-3 h-3" aria-hidden />
            <li className="text-foreground font-medium">{page.districtName}</li>
          </ol>
        </nav>

        {/* Hero */}
        <header className="container mx-auto px-4 lg:px-8 py-10 lg:py-14">
          <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-primary mb-4">
            <MapPin className="w-3.5 h-3.5" /> VinFast in {page.districtName}, Bihar
          </p>
          <h1 className="font-display text-3xl lg:text-5xl font-bold text-foreground max-w-3xl leading-tight">
            {page.h1 || `${page.modelName} in ${page.districtName}`}
          </h1>
          {page.intro ? (
            <p className="text-muted-foreground text-base lg:text-lg leading-relaxed max-w-3xl mt-5">
              {page.intro}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-3 mt-8">
            <Button asChild size="lg" className="bg-primary text-primary-foreground">
              <Link to="/test-drive">
                <CalendarCheck className="w-4 h-4 mr-2" /> Book a test drive
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to={modelPagePath(page.modelKey)}>
                <Car className="w-4 h-4 mr-2" /> Explore {page.modelName}
              </Link>
            </Button>
          </div>
        </header>

        {/* Content sections */}
        {page.sections.length ? (
          <section className="container mx-auto px-4 lg:px-8 pb-6 space-y-10 max-w-4xl">
            {page.sections.map((s, i) => (
              <article key={i}>
                {s.heading ? (
                  <h2 className="font-display text-xl lg:text-2xl font-bold text-foreground mb-3">
                    {s.heading}
                  </h2>
                ) : null}
                {s.body ? (
                  <p className="text-muted-foreground text-sm lg:text-base leading-relaxed whitespace-pre-line">
                    {s.body}
                  </p>
                ) : null}
              </article>
            ))}
          </section>
        ) : null}

        {/* FAQs */}
        {page.faqs.length ? (
          <section className="container mx-auto px-4 lg:px-8 py-10 max-w-4xl">
            <h2 className="font-display text-xl lg:text-2xl font-bold text-foreground mb-5">
              {page.modelName} in {page.districtName} — Frequently asked questions
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {page.faqs.map((f, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
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
        ) : null}

        {/* Internal links — other models in this district */}
        {otherModels.length ? (
          <section className="container mx-auto px-4 lg:px-8 py-8 max-w-4xl">
            <h2 className="font-display text-lg font-bold text-foreground mb-4">
              More VinFast models in {page.districtName}
            </h2>
            <div className="flex flex-wrap gap-2">
              {otherModels.map((m) => (
                <Link
                  key={m.key}
                  to={`/${page.districtSlug}/${m.slug}`}
                  className="rounded-full border border-border/60 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                >
                  {m.name} in {page.districtName}
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        {/* Internal links — same model across Bihar */}
        {popularDistricts.length ? (
          <section className="container mx-auto px-4 lg:px-8 py-8 pb-16 max-w-4xl">
            <h2 className="font-display text-lg font-bold text-foreground mb-4">
              {page.modelName} across Bihar
            </h2>
            <div className="flex flex-wrap gap-2">
              {popularDistricts.map((d) => (
                <Link
                  key={d.slug}
                  to={`/${d.slug}/${modelSlug}`}
                  className="rounded-full border border-border/60 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                >
                  {page.modelName} in {d.name}
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </main>

      <Footer />
      <StickyMobileCTA />
    </div>
  );
}
