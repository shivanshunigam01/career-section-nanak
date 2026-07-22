import { Link } from "react-router-dom";
import SeoPageShell from "@/components/seo/SeoPageShell";
import {
  BIHAR_DISTRICTS_SEO,
  SEO_MODEL_LABELS,
  SEO_MODEL_SLUGS,
  type SeoModelSlug,
} from "@/data/seo/biharDistrictsSeo";

export default function BiharDistrictsIndexPage() {
  return (
    <SeoPageShell
      title="VinFast in All 38 Bihar Districts | Patliputra VinFast"
      description="Hyperlocal VinFast pages for every Bihar district — VF6, VF7 and MPV7 price, booking and test drive landing pages from Patliputra VinFast."
      path="/bihar"
      keywords={[
        "VinFast Bihar",
        "Electric SUV Bihar",
        "VinFast dealer Bihar districts",
        "Premium EV Bihar",
      ]}
      eyebrow="Hyperlocal SEO"
      h1="VinFast Across All 38 Districts of Bihar"
      lead="Dedicated landing pages for VF6, VF7, MPV7 and Limo Green in every district — from Patna to Kishanganj."
    >
      <div className="space-y-10">
        {SEO_MODEL_SLUGS.map((modelSlug) => (
          <section key={modelSlug}>
            <h2 className="font-display font-bold text-xl md:text-2xl mb-4">
              {SEO_MODEL_LABELS[modelSlug as SeoModelSlug]}
            </h2>
            <div className="flex flex-wrap gap-2">
              {BIHAR_DISTRICTS_SEO.map((d) => (
                <Link
                  key={`${d.slug}-${modelSlug}`}
                  to={`/${d.slug}/${modelSlug}`}
                  className="text-sm px-3 py-1.5 rounded-full border border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                >
                  {d.name}
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </SeoPageShell>
  );
}
