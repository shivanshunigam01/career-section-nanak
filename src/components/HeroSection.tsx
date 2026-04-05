import { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import heroSlide01 from "@/assets/hero-slideshow/slide-01.png";
import heroSlide02 from "@/assets/hero-slideshow/slide-02.png";
import heroSlide03 from "@/assets/hero-slideshow/slide-03.png";
import heroVf7LedHighway from "@/assets/hero-slideshow/hero-vf7-led-highway.png";
import heroVf7Cockpit from "@/assets/hero-slideshow/hero-vf7-cockpit.png";
import heroSlide05 from "@/assets/hero-slideshow/slide-05.png";
import heroSlide06 from "@/assets/vf6-earth-hero-family.png";
import { hasApi } from "@/lib/apiConfig";
import { publicGet } from "@/lib/api";
import { usePublicSite } from "@/context/PublicSiteContext";
import { waMeUrl } from "@/lib/contactLinks";

export type HeroSlideView = {
  image: string;
  title: string;
  sub?: string;
  footnote?: string;
  objectPosition: string;
  badge?: string;
  ctaPrimary?: string;
  ctaPrimaryLink?: string;
  ctaSecondary?: string;
  ctaSecondaryLink?: string;
};

const FALLBACK_SLIDES: HeroSlideView[] = [
  {
    image: heroSlide01,
    title: "VF 6 & VF 7",
    sub: "Electrify your drive and outshine the streets with the best in class SUVs. Experience the revolution in motion, exclusively at Patliputra VinFast, Bihar's only authorized dealer.",
    objectPosition: "28% 48%",
  },
  {
    image: heroSlide02,
    title: "VinFast VF 7",
    sub: "Urban performance and electric sophistication — crafted for highways, city streets, and everything between.",
    objectPosition: "center 48%",
  },
  {
    image: heroSlide03,
    title: "Precision in every detail",
    sub: "Aerodynamic alloys, bold red and black — the unmistakable VF design language.",
    objectPosition: "center 55%",
  },
  {
    image: heroVf7LedHighway,
    title: "Signature LED presence",
    sub: "Full-width rear LED light bar with the centred V dip — the same identity as the front, unmistakable after dark.",
    objectPosition: "center 50%",
  },
  {
    image: heroVf7Cockpit,
    title: "Your command centre",
    sub: "Landscape touchscreen, connected services, and a leather-wrapped cabin centred on the VinFast V.",
    objectPosition: "center 48%",
  },
  {
    image: heroSlide05,
    title: "Premium VF 6 cabin",
    sub: "Large touchscreen, minimalist dash, and a driver-centric cockpit built for comfort and connectivity.",
    objectPosition: "center 50%",
  },
  {
    image: heroSlide06,
    title: "Built for your family",
    sub: "VF 6 — space, safety, and zero-emission drives from Patna to the open road.",
    footnote: "*Images shown are for illustrative purposes only. Features and specification may vary as per trim.",
    objectPosition: "28% 45%",
  },
];

function mapHeroFromApi(doc: Record<string, unknown>): HeroSlideView | null {
  const img = String(doc.bgImage ?? "").trim();
  if (!img) return null;
  return {
    image: img,
    title: String(doc.title ?? "VinFast"),
    sub: String(doc.subtitle ?? "") || undefined,
    objectPosition: String(doc.objectPosition ?? "center 50%"),
    badge: String(doc.badge ?? "").trim() || undefined,
    ctaPrimary: String(doc.ctaPrimary ?? "").trim() || undefined,
    ctaPrimaryLink: String(doc.ctaPrimaryLink ?? "").trim() || undefined,
    ctaSecondary: String(doc.ctaSecondary ?? "").trim() || undefined,
    ctaSecondaryLink: String(doc.ctaSecondaryLink ?? "").trim() || undefined,
  };
}

function CtaButton({
  label,
  link,
  variant = "hero" as const,
}: {
  label: string;
  link: string;
  variant?: "hero" | "heroWhite";
}) {
  const className =
    variant === "hero"
      ? "sm:!px-8 sm:!py-5 sm:!text-base"
      : "sm:!px-8 sm:!py-5 sm:!text-base";
  if (link.startsWith("http://") || link.startsWith("https://")) {
    return (
      <a href={link} target="_blank" rel="noopener noreferrer">
        <Button variant={variant} size="lg" className={className}>
          {label}
        </Button>
      </a>
    );
  }
  return (
    <Link to={link}>
      <Button variant={variant} size="lg" className={className}>
        {label}
      </Button>
    </Link>
  );
}

const HeroSection = () => {
  const { dealer, siteConfig } = usePublicSite();
  const [slides, setSlides] = useState<HeroSlideView[]>(FALLBACK_SLIDES);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!hasApi()) return;
    let cancelled = false;
    (async () => {
      const raw = await publicGet<unknown[]>("/public/hero-slides");
      if (cancelled || !Array.isArray(raw) || raw.length === 0) return;
      const mapped = (raw as Record<string, unknown>[]).map(mapHeroFromApi).filter(Boolean) as HeroSlideView[];
      if (mapped.length > 0) setSlides(mapped);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setCurrent((c) => (slides.length ? Math.min(c, slides.length - 1) : 0));
  }, [slides.length]);

  const next = useCallback(() => setCurrent((c) => (slides.length ? (c + 1) % slides.length : 0)), [slides.length]);
  const prev = useCallback(
    () => setCurrent((c) => (slides.length ? (c - 1 + slides.length) % slides.length : 0)),
    [slides.length],
  );

  useEffect(() => {
    if (!slides.length) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next, slides.length]);

  const waUrl = useMemo(() => waMeUrl(siteConfig.whatsappNumber || dealer.whatsapp), [siteConfig.whatsappNumber, dealer.whatsapp]);

  const slide = slides[current] ?? FALLBACK_SLIDES[0];

  return (
    <section className="relative h-[85vh] sm:h-[90vh] lg:h-screen min-h-[500px] sm:min-h-[600px] max-h-[min(100vh,1280px)] flex items-end pb-6 sm:pb-12 lg:pb-28 pt-16 lg:pt-0 overflow-hidden bg-zinc-950">
      {slides.map((s, i) => (
        <div
          key={`${s.image}-${i}`}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out [transform:translateZ(0)]"
          style={{
            opacity: i === current ? 1 : 0,
            zIndex: i === current ? 1 : 0,
          }}
          aria-hidden={i !== current}
        >
          <img
            src={s.image}
            alt={`${s.title} — VinFast hero`}
            className="hero-slider-image h-full w-full min-h-full min-w-full object-cover"
            style={{ objectPosition: s.objectPosition }}
            sizes="(max-width: 768px) 100vw, (max-width: 1536px) 100vw, 1920px"
            loading={i <= 1 ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={i === 0 ? "high" : i === 1 ? "auto" : "low"}
          />
        </div>
      ))}

      <div className="relative container mx-auto px-4 lg:px-8 z-10">
        <div key={current} className="max-w-xl sm:max-w-2xl lg:max-w-3xl">
            <p className="text-hero-plain font-display font-semibold text-xs sm:text-sm uppercase tracking-[0.2em] mb-2">
              {slide.badge || `${dealer.dealerName} · ${siteConfig.heroTagline}`}
            </p>
            <h2 className="text-hero-plain-lg font-display font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight mb-3 sm:mb-4">
              {slide.title}
            </h2>
            {slide.sub && (
              <p className="text-hero-plain-soft font-medium text-sm sm:text-base md:text-lg leading-relaxed max-w-prose">
                {slide.sub}
              </p>
            )}
            {slide.footnote && (
              <p className="text-hero-plain-muted text-[11px] sm:text-xs leading-snug max-w-prose mt-3">{slide.footnote}</p>
            )}
            <div className="h-4 sm:h-5" />
            <div className="flex flex-wrap gap-3 sm:gap-4">
              {slide.ctaPrimary && slide.ctaPrimaryLink ? (
                <CtaButton label={slide.ctaPrimary} link={slide.ctaPrimaryLink} variant="hero" />
              ) : (
                <Link to="/test-drive">
                  <Button variant="hero" size="lg" className="sm:!px-8 sm:!py-5 sm:!text-base">
                    Book Test Drive
                  </Button>
                </Link>
              )}
              {slide.ctaSecondary && slide.ctaSecondaryLink ? (
                <CtaButton label={slide.ctaSecondary} link={slide.ctaSecondaryLink} variant="heroWhite" />
              ) : (
                <Link to="/contact">
                  <Button variant="heroWhite" size="lg" className="sm:!px-8 sm:!py-5 sm:!text-base">
                    Get Best Offer
                  </Button>
                </Link>
              )}
            </div>
        </div>

        <div
          className="flex items-center gap-3 sm:gap-4 mt-6 sm:mt-10 lg:mt-12 w-full flex-wrap"
          role="group"
          aria-label="Hero slideshow controls"
        >
          <button
            type="button"
            onClick={prev}
            className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-full bg-white hover:bg-white border border-gray-300 flex items-center justify-center text-gray-900"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 overflow-x-auto max-w-full py-1 scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrent(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === current ? "true" : undefined}
                className={`shrink-0 rounded-full transition-[width,height,background-color] ${
                  i === current
                    ? "h-2.5 w-2.5 sm:h-3 sm:w-3 bg-primary ring-2 ring-primary/40"
                    : "h-2 w-2 sm:h-2.5 sm:w-2.5 bg-white/45 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={next}
            className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-full bg-white hover:bg-white border border-gray-300 flex items-center justify-center text-gray-900"
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 mt-5 sm:mt-6 lg:mt-8 flex-wrap">
          <Link
            to="/models/vf7"
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-gray-300 bg-white hover:bg-neutral-50 text-gray-900 text-[11px] sm:text-sm font-medium"
          >
            Explore VF 7 <ChevronRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/models/vf6"
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-gray-300 bg-white hover:bg-neutral-50 text-gray-900 text-[11px] sm:text-sm font-medium"
          >
            Explore VF 6 <ChevronRight className="w-3.5 h-3.5" />
          </Link>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-[#1fa855] bg-[#25D366] hover:bg-[#20bd5a] text-white text-[11px] sm:text-sm font-medium"
          >
            WhatsApp Now <ChevronRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
