import type { ReactNode } from "react";
import { MODEL_SECTION_PY } from "@/components/model/modelPageLayout";

type ModelPageVehicleSpecSectionProps = {
  disclaimer?: string;
  intro?: string;
  children: ReactNode;
  footer?: ReactNode;
};

/** Dark spec block — same title and shell on every model page. */
export function ModelPageVehicleSpecSection({ disclaimer, intro, children, footer }: ModelPageVehicleSpecSectionProps) {
  return (
    <section className={`${MODEL_SECTION_PY} section-dark border-t border-border/60`}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="font-display font-bold text-3xl md:text-5xl mb-3 text-foreground">Vehicle Specification</h2>
          {intro ? <p className="text-muted-foreground text-sm md:text-base mb-2">{intro}</p> : null}
          {disclaimer ? <p className="text-muted-foreground text-sm md:text-base">{disclaimer}</p> : null}
        </div>
        {children}
        {footer ? <div className="mt-10 flex flex-wrap justify-center gap-3">{footer}</div> : null}
      </div>
    </section>
  );
}
