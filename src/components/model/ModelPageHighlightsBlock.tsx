import type { ReactNode } from "react";
import { MODEL_SECTION_PY } from "@/components/model/modelPageLayout";

export type ModelHighlightStat = { label: string; value: string };

type ModelPageHighlightsBlockProps = {
  sectionTitle: string;
  productName: string;
  description: string;
  highlights: ModelHighlightStat[];
  disclaimer?: string;
  actions?: ReactNode;
};

/** Headline + 3-up stats — same block on MPV 7, Limo Green, VF 6, VF 7. */
export function ModelPageHighlightsBlock({
  sectionTitle,
  productName,
  description,
  highlights,
  disclaimer,
  actions,
}: ModelPageHighlightsBlockProps) {
  return (
    <section className={`${MODEL_SECTION_PY} border-b border-border/60 bg-muted/25`}>
      <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
        <h2 className="font-display font-bold text-3xl md:text-4xl mb-1 text-foreground">{sectionTitle}</h2>
        <h3 className="font-display font-bold text-xl md:text-2xl text-foreground/95 mt-3 mb-4">{productName}</h3>
        <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-8 max-w-3xl">{description}</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {highlights.slice(0, 3).map((h) => (
            <div key={h.label} className="rounded-2xl border border-border/70 bg-card/90 p-5 text-center shadow-sm">
              <p className="font-display font-bold text-2xl md:text-3xl tabular-nums text-foreground">{h.value}</p>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-2">{h.label}</p>
            </div>
          ))}
        </div>
        {disclaimer ? <p className="text-xs text-muted-foreground max-w-3xl mb-8">{disclaimer}</p> : null}
        {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
      </div>
    </section>
  );
}
