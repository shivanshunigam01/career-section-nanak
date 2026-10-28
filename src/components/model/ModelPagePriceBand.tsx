import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FestivePriceDisplay } from "@/components/FestivePriceDisplay";
import type { FestivePriceSlug } from "@/lib/festivePricing";

export type ModelPagePriceBandProps = {
  festiveSlug?: FestivePriceSlug;
  /** Shown when there is no festive campaign (VF 6 / VF 7). */
  exShowroomPrice?: string;
  priceCaption?: string;
  primaryCta: { href: string; label: string };
  secondaryCta?: { href: string; label: string };
};

/** Centered price + CTA — same placement on every model page (directly under hero). */
export function ModelPagePriceBand({
  festiveSlug,
  exShowroomPrice,
  priceCaption = "Indicative ex-showroom",
  primaryCta,
  secondaryCta,
}: ModelPagePriceBandProps) {
  const primaryIsInternal = primaryCta.href.startsWith("/") || primaryCta.href.startsWith("#");

  return (
    <section className="relative border-b border-border/50 bg-gradient-to-b from-background via-background to-muted/30">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" aria-hidden />
      <div className="container mx-auto px-4 lg:px-8 py-8 sm:py-10 lg:py-12">
        <div className="mx-auto flex max-w-lg flex-col items-center gap-5 text-center">
          <div className="h-1 w-12 rounded-full bg-primary/80" aria-hidden />
          {festiveSlug ? (
            <FestivePriceDisplay slug={festiveSlug} size="lg" align="center" />
          ) : (
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{priceCaption}</p>
              <p className="font-display font-bold text-3xl sm:text-4xl tabular-nums text-primary">{exShowroomPrice ?? "—"}</p>
            </div>
          )}
          <div className="flex w-full max-w-md flex-col gap-2.5 sm:flex-row sm:justify-center">
            <Button
              variant="hero"
              size="lg"
              className="h-12 min-w-[min(100%,17rem)] rounded-full px-8 text-sm font-semibold shadow-md shadow-primary/25 sm:h-14 sm:px-10"
              asChild
            >
              {primaryIsInternal ? (
                <Link to={primaryCta.href}>{primaryCta.label}</Link>
              ) : (
                <a href={primaryCta.href}>{primaryCta.label}</a>
              )}
            </Button>
            {secondaryCta ? (
              <Button variant="outline" size="lg" className="h-12 rounded-full sm:h-14" asChild>
                {secondaryCta.href.startsWith("/") ? (
                  <Link to={secondaryCta.href}>{secondaryCta.label}</Link>
                ) : (
                  <a href={secondaryCta.href}>{secondaryCta.label}</a>
                )}
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
