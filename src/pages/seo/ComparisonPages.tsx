import { Link, useParams } from "react-router-dom";
import SeoPageShell from "@/components/seo/SeoPageShell";
import { Button } from "@/components/ui/button";
import { COMPARISON_PAGES, getComparisonBySlug } from "@/data/seo/comparisons";
import NotFound from "@/pages/NotFound";

export function CompareHubPage() {
  return (
    <SeoPageShell
      title="Compare VinFast Models & Rival EVs | Patliputra VinFast"
      description="High-intent EV comparisons — VinFast VF6 and VF7 vs Curvv EV, BE 6, ZS EV, Atto 3, Creta Electric and XEV 9e. Plus trim compare tools."
      path="/compare-models"
      keywords={["Compare electric SUVs", "VinFast vs Tata", "VF7 vs Creta Electric", "EV comparison Bihar"]}
      eyebrow="Compare"
      h1="Compare VinFast & Rival Electric SUVs"
      lead="Side-by-side pages for high-intent buyers — then book a test drive to feel the difference."
      ctaPrimary={{ label: "Compare VF6 vs VF7 Trims", to: "/compare" }}
      ctaSecondary={{ label: "Book Test Drive", to: "/test-drive" }}
    >
      <div className="grid sm:grid-cols-2 gap-4">
        {COMPARISON_PAGES.map((c) => (
          <Link
            key={c.slug}
            to={c.path}
            className="block rounded-xl border border-border/60 p-5 hover:border-primary/40 transition-colors"
          >
            <h2 className="font-display font-semibold text-lg mb-2">{c.h1}</h2>
            <p className="text-sm text-muted-foreground line-clamp-2">{c.lead}</p>
          </Link>
        ))}
      </div>
    </SeoPageShell>
  );
}

export function ComparisonDetailPage() {
  const { slug = "" } = useParams();
  const page = getComparisonBySlug(slug);
  if (!page) return <NotFound />;

  const modelPath =
    page.vinfastModel === "VF6"
      ? "/models/vf6"
      : page.vinfastModel === "VF7"
        ? "/models/vf7"
        : "/models/mpv7";

  return (
    <SeoPageShell
      title={page.title}
      description={page.description}
      path={page.path}
      keywords={page.keywords}
      eyebrow="EV Comparison"
      h1={page.h1}
      lead={page.lead}
      faqs={page.faqs}
      ctaPrimary={{ label: `Explore ${page.vinfastModel}`, to: modelPath }}
      ctaSecondary={{ label: "Book Test Drive", to: "/test-drive" }}
    >
      <div className="overflow-x-auto rounded-xl border border-border/60">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/60 bg-muted/30">
              <th className="text-left p-3 font-display">Aspect</th>
              <th className="text-left p-3 font-display">VinFast {page.vinfastModel}</th>
              <th className="text-left p-3 font-display">{page.rival}</th>
            </tr>
          </thead>
          <tbody>
            {page.points.map((row) => (
              <tr key={row.label} className="border-b border-border/40">
                <td className="p-3 font-medium">{row.label}</td>
                <td className="p-3 text-muted-foreground">{row.vinfast}</td>
                <td className="p-3 text-muted-foreground">{row.rival}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-muted-foreground leading-relaxed mt-6">{page.summary}</p>
      <div className="flex flex-wrap gap-3 mt-6">
        <Button asChild>
          <Link to="/compare">Trim-level VF6 / VF7 compare</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/compare-models">All comparisons</Link>
        </Button>
      </div>
    </SeoPageShell>
  );
}
