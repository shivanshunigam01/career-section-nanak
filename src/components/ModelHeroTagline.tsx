import { cn } from "@/lib/utils";

type ModelHeroTaglineProps = {
  /** Display name on hero (e.g. VF 7, VF MPV 7). */
  modelName: string;
  tagline: string;
  taglineLine2?: string;
  className?: string;
};

/** Limo Green–style white headline + tagline over model page hero. */
export function ModelHeroTagline({
  modelName,
  tagline,
  taglineLine2,
  className,
}: ModelHeroTaglineProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-10 flex items-center px-4 sm:px-8 lg:px-12 xl:px-16",
        className,
      )}
    >
      <div className="max-w-xl text-left drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
        <p
          className="font-display text-3xl font-bold italic uppercase tracking-wide text-white sm:text-4xl md:text-5xl lg:text-[3.25rem] lg:leading-tight"
        >
          {modelName}
        </p>
        <p className="mt-2 font-display text-xs font-bold uppercase tracking-[0.14em] text-white sm:text-sm md:text-base">
          {tagline}
        </p>
        {taglineLine2 ? (
          <p className="font-display text-xs font-bold uppercase tracking-[0.14em] text-white sm:text-sm md:text-base">
            {taglineLine2}
          </p>
        ) : null}
      </div>
    </div>
  );
}
