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
import heroMpv7 from "@/assets/mpv7-gallery/mpv7-hero.png";
import { hasApi } from "@/lib/apiConfig";
import { publicGet } from "@/lib/api";
import { usePublicSite } from "@/context/PublicSiteContext";
import { waMeUrl } from "@/lib/contactLinks";
import { useRefetchWhenVisible } from "@/hooks/useRefetchWhenVisible";

export type HeroSlideView = {
  image: string;
  title: string;
  /** Three subtitle lines under the title (CMS / API subtitles are split automatically). */
  subLines?: readonly [string, string, string];
  footnote?: string;
  objectPosition: string;
  badge?: string;
  ctaPrimary?: string;
  ctaPrimaryLink?: string;
  ctaSecondary?: string;
  ctaSecondaryLink?: string;
};

function subtitleToThreeLines(raw: string): readonly [string, string, string] {
  const t = raw.trim();
  if (!t) return ["", "", ""];
  const byNl = t.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
  if (byNl.length >= 3) return [byNl[0], byNl[1], byNl.slice(2).join(" ")];
  if (byNl.length === 2) return [byNl[0], byNl[1], ""];
  const sentences =
    t.match(/[^.!?]+(?:[.!?]+|$)/g)?.map((s) => s.trim()).filter(Boolean) ?? [t];
  if (sentences.length >= 3) return [sentences[0], sentences[1], sentences.slice(2).join(" ")];
  if (sentences.length === 2) return [sentences[0], sentences[1], ""];
  const dashParts = t.split(/\s*[—–]\s*/).map((s) => s.trim()).filter(Boolean);
  if (dashParts.length >= 3) return [dashParts[0], dashParts[1], dashParts.slice(2).join(" — ")];
  if (dashParts.length === 2) return [dashParts[0], dashParts[1], ""];
  const commaParts = t.split(/,\s+/);
  if (commaParts.length >= 3) {
    const a = Math.ceil(commaParts.length / 3);
    const b = Math.ceil((2 * commaParts.length) / 3);
    return [commaParts.slice(0, a).join(", "), commaParts.slice(a, b).join(", "), commaParts.slice(b).join(", ")];
  }
  const words = t.split(/\s+/);
  if (words.length >= 6) {
    const n = Math.ceil(words.length / 3);
    return [
      words.slice(0, n).join(" "),
      words.slice(n, 2 * n).join(" "),
      words.slice(2 * n).join(" "),
    ];
  }
  return [t, "", ""];
}

/** New launch — always first in the home hero rotation (fallback + merged API slides). */
function buildMpv7LaunchSlide(): HeroSlideView {
  return {
    image: heroMpv7,
    title: "The all-new VF MPV 7",
    subLines: ["Seven-seat electric MPV", "60.13 kWh battery", "Pre-booking open."],
    footnote: "*Images shown are for illustrative purposes only. Specifications may vary; confirm with dealer.",
    objectPosition: "center 48%",
    ctaPrimary: "Register for pre-booking",
    ctaPrimaryLink: "/models/mpv7#mpv7-prebook",
    ctaSecondary: "Get on-road price",
    ctaSecondaryLink: "/contact",
  };
}

const HERO_FALLBACK_TAIL: HeroSlideView[] = [
  {
    image: heroSlide02,
    title: "VinFast VF 7",
    subLines: ["Urban electric SUV for city and highway."],
    objectPosition: "center 48%",
  },
  {
    image: heroSlide03,
    title: "Precision in every detail",
    subLines: ["Alloys, colour, unmistakable VF form."],
    objectPosition: "center 55%",
  },
  {
    image: heroVf7LedHighway,
    title: "Signature LED presence",
    subLines: ["Full-width light signature, front to rear."],
    objectPosition: "center 50%",
  },
  {
    image: heroVf7Cockpit,
    title: "Your command centre",
    subLines: ["Touchscreen, connected services, refined cabin."],
    objectPosition: "center 48%",
  },
  {
    image: heroSlide05,
    title: "Premium VF 6 cabin",
    subLines: ["Minimal dash, large screen, driver-focused layout."],
    objectPosition: "center 50%",
  },
  {
    image: heroSlide06,
    title: "Built for your family",
    subLines: ["VF 6 — space, safety, zero tailpipe emissions."],
    footnote: "*Images shown are for illustrative purposes only. Features and specification may vary as per trim.",
    objectPosition: "28% 45%",
  },
];

function buildHeroFallbackSlides(brand: string): HeroSlideView[] {
  return [
    buildMpv7LaunchSlide(),
    {
      image: heroSlide01,
      title: "VF 6, VF 7 & VF MPV 7",
      subLines: [`Electric SUVs and seven-seat MPV — ${brand}.`],
      objectPosition: "28% 48%",
    },
    ...HERO_FALLBACK_TAIL,
  ];
}

function mapHeroFromApi(doc: Record<string, unknown>): HeroSlideView | null {
  const img = String(doc.bgImage ?? "").trim();
  if (!img) return null;
  const subtitle = String(doc.subtitle ?? "").trim();
  const triplet = subtitle ? subtitleToThreeLines(subtitle) : undefined;
  const subLines = triplet?.some((l) => l.trim()) ? triplet : undefined;
  return {
    image: img,
    title: String(doc.title ?? "VinFast"),
    subLines,
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
  const fallbackSlides = useMemo(() => buildHeroFallbackSlides(dealer.brand), [dealer.brand]);
  const [apiSlides, setApiSlides] = useState<HeroSlideView[] | null>(null);
  const slides = apiSlides ?? fallbackSlides;
  const [current, setCurrent] = useState(0);

  const loadSlidesFromApi = useCallback(async () => {
    if (!hasApi()) return;
    const raw = await publicGet<unknown[]>("/public/hero-slides");
    if (!Array.isArray(raw) || raw.length === 0) return;
    const mapped = (raw as Record<string, unknown>[]).map(mapHeroFromApi).filter(Boolean) as HeroSlideView[];
    if (mapped.length > 0) {
      const withoutDuplicateMpv7 = mapped.filter((s) => s.image !== heroMpv7);
      setApiSlides([buildMpv7LaunchSlide(), ...withoutDuplicateMpv7]);
    }
  }, []);

  useEffect(() => {
    if (!hasApi()) return;
    void loadSlidesFromApi();
  }, [loadSlidesFromApi]);

  useRefetchWhenVisible(loadSlidesFromApi, hasApi());

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

  const [intrinsicBySrc, setIntrinsicBySrc] = useState<Record<string, { w: number; h: number }>>({});
  const [isLg, setIsLg] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches,
  );

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const fn = () => setIsLg(mq.matches);
    fn();
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  const handleHeroImageLoad = useCallback((src: string, w: number, h: number) => {
    if (w <= 0 || h <= 0) return;
    setIntrinsicBySrc((prev) => {
      if (prev[src]?.w === w && prev[src]?.h === h) return prev;
      return { ...prev, [src]: { w, h } };
    });
  }, []);

  const waUrl = useMemo(() => waMeUrl(siteConfig.whatsappNumber || dealer.whatsapp), [siteConfig.whatsappNumber, dealer.whatsapp]);

  const slide = slides[current] ?? fallbackSlides[0];

  const mobileAspectStyle = useMemo(() => {
    const intr = intrinsicBySrc[slide.image];
    if (intr && intr.w > 0 && intr.h > 0) {
      return { aspectRatio: `${intr.w} / ${intr.h}` as const };
    }
    return { aspectRatio: "16 / 9" as const };
  }, [intrinsicBySrc, slide.image]);

  return (
    <section className="relative z-0 overflow-hidden bg-zinc-950 pt-[4.25rem] lg:h-screen lg:max-h-[min(100vh,1280px)] lg:min-h-[600px] lg:pt-0">
      <div
        className="relative w-full shrink-0 overflow-hidden lg:absolute lg:inset-0 lg:z-0 lg:min-h-[500px]"
        style={isLg ? undefined : mobileAspectStyle}
      >
        {slides.map((s, i) => (
          <div
            key={`${s.image}-${i}`}
            className="hero-media-scrim absolute inset-0 transition-opacity duration-1000 ease-in-out [transform:translateZ(0)]"
            style={{
              opacity: i === current ? 1 : 0,
              zIndex: i === current ? 1 : 0,
            }}
            aria-hidden={i !== current}
          >
            <img
              src={s.image}
              alt={`${s.title} — VinFast hero`}
              className="hero-slider-image h-full w-full object-contain object-center lg:min-h-full lg:min-w-full lg:object-cover"
              style={isLg ? { objectPosition: s.objectPosition } : undefined}
              sizes="(max-width: 768px) 100vw, (max-width: 1536px) 100vw, 1920px"
              loading={i <= 1 ? "eager" : "lazy"}
              decoding="async"
              fetchPriority={i === 0 ? "high" : i === 1 ? "auto" : "low"}
              onLoad={(e) => handleHeroImageLoad(s.image, e.currentTarget.naturalWidth, e.currentTarget.naturalHeight)}
            />
          </div>
        ))}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 max-lg:bg-gradient-to-t max-lg:from-zinc-950 max-lg:via-zinc-950/80 max-lg:to-transparent max-lg:pt-16 pb-6 sm:pb-8 lg:pb-28">
          <div className="pointer-events-auto container mx-auto px-4 lg:px-8">
        <div key={current} className="max-w-xl sm:max-w-2xl lg:max-w-3xl">
            {(() => {
              const lockup =
                current === 0
                  ? `${dealer.dealerName}. ${siteConfig.heroTagline}`
                  : (slide.badge?.trim() ?? "");
              return lockup ? (
                <p className="text-hero-plain font-display font-semibold text-xs sm:text-sm uppercase tracking-[0.2em] mb-2">
                  {lockup}
                </p>
              ) : null;
            })()}
            <h2 className="text-hero-plain-lg font-display font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight mb-3 sm:mb-4">
              {slide.title}
            </h2>
            {slide.subLines?.some((l) => l.trim()) && (
              <div className="text-hero-plain-soft font-medium text-sm sm:text-base md:text-lg leading-relaxed max-w-prose space-y-0.5">
                {slide.subLines.map(
                  (line, i) =>
                    line.trim() && (
                      <p key={i} className="block">
                        {line}
                      </p>
                    ),
                )}
              </div>
            )}
            {slide.footnote && (
              <p className="text-hero-plain-muted text-[11px] sm:text-xs leading-snug max-w-prose mt-3">{slide.footnote}</p>
            )}
            <div className="h-4 sm:h-5" />
            <div className="hidden lg:flex flex-wrap gap-3 sm:gap-4">
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
          className="hidden lg:flex items-center gap-3 sm:gap-4 mt-6 sm:mt-10 lg:mt-12 w-full flex-wrap"
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

        <div className="hidden lg:flex items-center gap-2 sm:gap-3 mt-5 sm:mt-6 lg:mt-8 flex-wrap">
          <Link
            to="/models/mpv7"
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-gray-300 bg-white hover:bg-neutral-50 text-gray-900 text-[11px] sm:text-sm font-medium"
          >
            Explore VF MPV 7 <ChevronRight className="w-3.5 h-3.5" />
          </Link>
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
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
