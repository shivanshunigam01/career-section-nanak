import { MODEL_SECTION_PY } from "@/components/model/modelPageLayout";

type ModelPageInteriorBandProps = {
  imageSrc: string;
  imageAlt: string;
  title?: string;
  description?: string;
  disclaimer?: string;
};

export function ModelPageInteriorBand({ imageSrc, imageAlt, title, description, disclaimer }: ModelPageInteriorBandProps) {
  return (
    <section className={`${MODEL_SECTION_PY} bg-background border-b border-border/50`}>
      <div className="w-full">
        {(title || description) && (
          <div className="container mx-auto px-4 lg:px-8 max-w-5xl mb-8">
            {title ? <h2 className="font-display font-bold text-3xl md:text-4xl mb-4 text-foreground">{title}</h2> : null}
            {description ? (
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-3xl">{description}</p>
            ) : null}
          </div>
        )}
        <div className="relative w-full overflow-hidden">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="image-high-quality w-full h-[34vh] min-h-[230px] max-h-[520px] sm:h-[46vh] lg:h-[62vh] object-cover object-center"
            sizes="100vw"
            loading="lazy"
            decoding="async"
          />
        </div>
        {disclaimer ? (
          <div className="container mx-auto px-4 lg:px-8">
            <p className="text-xs text-muted-foreground mt-4 text-center max-w-2xl mx-auto">{disclaimer}</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
