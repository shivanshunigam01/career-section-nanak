import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

type ModelPageNextStepSectionProps = {
  id?: string;
  eyebrow: string;
  title?: string;
  description: ReactNode;
  children?: ReactNode;
  bookHref: string;
  bookLabel: string;
  testDriveHref?: string;
};

/** Gradient “Ready to take the next step?” band — form (MPV/Limo) or CTAs (VF 6 / VF 7). */
export function ModelPageNextStepSection({
  id,
  eyebrow,
  title = "Ready to take the next step?",
  description,
  children,
  bookHref,
  bookLabel,
  testDriveHref = "/test-drive",
}: ModelPageNextStepSectionProps) {
  return (
    <section
      id={id}
      className="scroll-mt-20 sm:scroll-mt-24 border-t border-border/60 bg-gradient-to-b from-primary/[0.07] via-muted/40 to-muted/30 py-14 sm:py-16 lg:py-20"
    >
      <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
        <div className="text-center mb-8 sm:mb-10">
          <p className="text-primary font-display font-semibold text-sm uppercase tracking-[0.2em] mb-2">{eyebrow}</p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl mb-3">{title}</h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">{description}</p>
        </div>

        {children ? (
          <div className="rounded-2xl border border-border/70 bg-card/95 p-5 sm:p-6 lg:p-8 shadow-sm">{children}</div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button variant="hero" size="lg" className="w-full sm:w-auto min-w-[14rem]" asChild>
              <Link to={bookHref}>{bookLabel}</Link>
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto min-w-[14rem]" asChild>
              <Link to={testDriveHref}>Book a test drive</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
