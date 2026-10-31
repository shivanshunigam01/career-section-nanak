type ModelPageHeroProps = {
  /** Public URL under /model-heroes/ (high-res, not bundled). */
  imageSrc: string;
  alt: string;
  /** Intrinsic width of imageSrc (for layout + sharp scaling). */
  width: number;
  /** Intrinsic height of imageSrc. */
  height: number;
  ariaLabel: string;
  srTitle: string;
};

/**
 * Full-viewport model hero — loads high-res static JPEG from /public for clarity.
 */
export function ModelPageHero({ imageSrc, alt, width, height, ariaLabel, srTitle }: ModelPageHeroProps) {
  return (
    <section
      className="relative z-0 w-full max-w-none overflow-hidden bg-neutral-950 pt-[4.25rem]"
      aria-label={ariaLabel}
    >
      <div className="model-page-hero-frame">
        <img
          src={imageSrc}
          alt={alt}
          width={width}
          height={height}
          className="model-page-hero-image"
          sizes="100vw"
          loading="eager"
          fetchPriority="high"
          decoding="sync"
        />
      </div>
      <h1 className="sr-only">{srTitle}</h1>
    </section>
  );
}
