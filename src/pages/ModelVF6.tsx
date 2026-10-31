import { useEffect, useState } from "react";
import { Check, Download } from "lucide-react";
import Navbar from "@/components/Navbar";
import LeadCaptureStrip from "@/components/LeadCaptureStrip";
import { BrochureDownloadButton } from "@/components/BrochureDownloadButton";
import Footer from "@/components/Footer";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import vf6HeroBanner from "@/assets/model-heroes/vf6-hero-banner.jpg";
import vf6WhyInteriorRhd from "@/assets/interior-rhd-luxury-ambient.png";
import vf6InfinityBlanc from "@/assets/vf6-infinity-blanc.png";
import vf6CrimsonRed from "@/assets/vf6-crimson-red.png";
import vf6JetBlack from "@/assets/vf6-jet-black.png";
import vf6DesatSilver from "@/assets/vf6-desat-silver.png";
import vf6ZenithGrey from "@/assets/vf6-zenith-grey.png";
import vf6MoonlitOcean from "@/assets/vf6-moonlit-ocean.jpg";
import vf6IvyGreen from "@/assets/vf6-ivy-green.jpg";
import vf6GalExterior1 from "@/assets/vf6-gallery/vf6-gallery-exterior-1.jpg";
import vf6GalExterior2 from "@/assets/vf6-gallery/vf6-gallery-exterior-2.jpg";
import vf6GalDetail01 from "@/assets/vf6-gallery/vf6-gallery-detail-01.png";
import vf6GalDetail02 from "@/assets/vf6-gallery/vf6-gallery-detail-02.png";
import vf6GalDetail03 from "@/assets/vf6-gallery/vf6-gallery-detail-03.png";
import vf6GalDetail04 from "@/assets/vf6-gallery/vf6-gallery-detail-04.png";
import vf6GalDetail05 from "@/assets/vf6-gallery/vf6-gallery-detail-05.png";
import { usePublicSite } from "@/context/PublicSiteContext";
import { usePublicPricing } from "@/hooks/usePublicPricing";
import { usePageSeo } from "@/hooks/usePageSeo";
import { VF6_PAGE_SEO } from "@/lib/seoBlueprint";
import { VF6_TRIM_0_100_KMH } from "@/data/vinfastCompareSpecAnchors";
import { ModelPagePriceBand } from "@/components/model/ModelPagePriceBand";
import { ModelPageVariantBar } from "@/components/model/ModelPageVariantBar";
import { ModelPageHighlightsBlock } from "@/components/model/ModelPageHighlightsBlock";
import { ModelPageNextStepSection } from "@/components/model/ModelPageNextStepSection";

const colors = [
  { name: "Infinity Blanc", hex: "#E8E8E4", image: vf6InfinityBlanc },
  { name: "Crimson Red", hex: "#C80F1E", image: vf6CrimsonRed },
  { name: "Jet Black", hex: "#18191D", image: vf6JetBlack },
  { name: "Desert Silver", hex: "#C8C9C4", image: vf6DesatSilver },
  { name: "Zenith Grey", hex: "#61656B", image: vf6ZenithGrey },
  { name: "Moonlit Ocean", hex: "#1E4A7A", image: vf6MoonlitOcean },
  { name: "Ivy Green", hex: "#1F3D2E", image: vf6IvyGreen },
];

type VariantId = "earth" | "wind" | "infinity";

const vf6Variants: {
  id: VariantId;
  name: string;
  shortLabel: string;
  description: string;
}[] = [
  {
    id: "earth",
    name: "VF 6 Earth",
    shortLabel: "Earth",
    description: "177 PS, R17 alloys, longest MIDC range — chassis safety (ABS suite + TPMS), no ADAS, no smart-app suite.",
  },
  {
    id: "wind",
    name: "VF 6 Wind",
    shortLabel: "Wind",
    description: "204 PS, 18\" wheels, 7 airbags, ADAS core, panoramic roof & smart connectivity.",
  },
  {
    id: "infinity",
    name: "VF 6 Wind Infinity",
    shortLabel: "Wind Infinity",
    description: "Everything in Wind plus extended ADAS: AEB, FCW, RCTA, auto high beam, driver monitoring & more.",
  },
];

const variantHeroStats: Record<
  VariantId,
  { range: string; accel: string; power: string; driveline: string }
> = {
  earth: { range: "468 km", accel: VF6_TRIM_0_100_KMH.earth, power: "177 PS", driveline: "FWD" },
  wind: { range: "463 km", accel: VF6_TRIM_0_100_KMH.wind, power: "204 PS", driveline: "FWD" },
  infinity: { range: "463 km", accel: VF6_TRIM_0_100_KMH.infinity, power: "204 PS", driveline: "FWD" },
};

const variantExShowroomPrice: Record<VariantId, string> = {
  earth: "₹18,19,000*",
  wind: "₹18,69,000*",
  infinity: "₹19,19,000*",
};

/** Rows: [parameter, Earth, Wind, Wind Infinity] */
const technicalSpecRows: [string, string, string, string][] = [
  ["Max. power", "130 kW (177 PS)", "150 kW (204 PS)", "150 kW (204 PS)"],
  ["Max. torque", "250 Nm", "310 Nm", "310 Nm"],
  ["Driveline", "FWD", "FWD", "FWD"],
  ["Range (MIDC)", "468 km", "463 km", "463 km"],
  [
    "Acceleration (0–100 km/h)",
    variantHeroStats.earth.accel,
    variantHeroStats.wind.accel,
    variantHeroStats.infinity.accel,
  ],
  ["Usable battery capacity", "59.6 kWh", "59.6 kWh", "59.6 kWh"],
  ["Charge port", "CCS2", "CCS2", "CCS2"],
  ["AC charging", "Up to 7.2 kW", "Up to 7.2 kW", "Up to 7.2 kW"],
  ["DC charging", "Up to 100 kW", "Up to 100 kW", "Up to 100 kW"],
  ["Fast charging (10–70%)", "25 min", "25 min", "25 min"],
  ["Portable charger", "3.3 kW (16 A)", "3.3 kW (16 A)", "3.3 kW (16 A)"],
  ["Length × width × height", "4231 × 1834 × 1615 mm", "4231 × 1834 × 1615 mm", "4231 × 1834 × 1615 mm"],
  ["Wheelbase", "2730 mm", "2730 mm", "2730 mm"],
  ["Ground clearance (unladen)", "190 mm", "190 mm", "190 mm"],
  ["Boot space", "423 L", "423 L", "423 L"],
  ["Curb weight", "1962 kg", "2028 kg", "2028 kg"],
  [
    "Tyre & wheel size",
    "225/60 R17 (D = 436.6 mm), silver finish alloy",
    "225/55 R18 (D = 462 mm), machine cut alloy",
    "225/55 R18 (D = 462 mm), machine cut alloy",
  ],
  ["Front / rear brakes", "Disc / Disc", "Disc / Disc", "Disc / Disc"],
  ["Electronic parking brake", "Yes", "Yes", "Yes"],
  ["Auto Hold", "Yes", "Yes", "Yes"],
  ["Front suspension", "MacPherson independent", "MacPherson independent", "MacPherson independent"],
  ["Rear suspension", "Control blade independent", "Control blade independent", "Control blade independent"],
  ["Regeneration brake modes", "Off / Low / Medium / High", "Off / Low / Medium / High", "Off / Low / Medium / High"],
  ["Driving modes", "Eco / Normal / Sport", "Eco / Normal / Sport", "Eco / Normal / Sport"],
];

/** Exterior & interior — only where trims differ (per full VF 6 brief) */
const exteriorInteriorRows: [string, string, string, string][] = [
  ["Wheels", "Silver finish alloy (R17)", "Machine cut alloy (R18)", "Machine cut alloy (R18)"],
  ["Heated ORVM", "No", "Yes", "Yes"],
  ["Roof rail", "No", "Yes", "Yes"],
  ["Seat upholstery", "Fabric", "Vegan leather", "Vegan leather"],
  ["Driver seat adjustment", "Manual", "6-way power", "8-way power"],
  ["Ventilated front seats", "No", "Yes", "Yes"],
  ["HVAC", "Automatic single-zone", "Automatic dual-zone", "Automatic dual-zone"],
  ["Cabin air filter", "Yes", "PM1.0", "PM1.0"],
  ["Air ionizer", "No", "Yes", "Yes"],
  ["Rear AC vents", "No", "Yes", "Yes"],
  ["Head-up display (HUD)", "No", "Yes", "Yes"],
  ["Rear centre armrest (with cupholders)", "No", "Yes", "Yes"],
  ["Panoramic glass roof", "No", "Yes", "Yes"],
  ["Wireless charger", "No", "Yes", "Yes"],
];

const exteriorCommonBullets = [
  "Headlamp: LED projector; auto headlamp, auto levelling, follow-me-home",
  "DRL: LED; front & rear signature V light; tail lamp: LED",
  "ORVM: power fold & power adjust; reverse link (passenger side)",
  "Shark-fin antenna, window trim, keyless entry",
];

const interiorCommonBullets = [
  "Steering: D-cut multi-function, vegan leather wrap; tilt & telescopic adjustment",
  "USB — Front: 2× Type A; Rear: 2× Type A & 1× Type C (90 W)",
  "Power windows: all auto up/down; anti-pinch: Yes",
  "Keyless start: Yes; auto-dimming IRVM: Yes",
  "Glove box light & luggage light: Yes",
];

const safetyChassisAll =
  "On every VF 6 (Earth, Wind & Wind Infinity): ABS, EBD, BA, ESC, TCS, hill start assist, TPMS.";

const safetyWindInfinityBullets = [
  "7 airbags — driver, co-driver, front side, curtain, driver knee",
  "Rain-sensing wipers",
  "Roll-over mitigation",
  "Emergency signal system",
  "Rear parking sensors",
  "360° camera",
  "Rear seat ISOFIX",
  "Theft alarm & immobilizer",
  "Speed-sensing door lock",
  "Seatbelt reminder — all seats",
];

const adasWindBullets = [
  "Blind spot detection",
  "Lane centering control",
  "Auto lane change assist",
  "Lane departure warning",
  "Lane keeping assist",
  "Emergency lane keeping",
  "Adaptive cruise control",
];

const adasInfinityExtraBullets = [
  "Automatic emergency braking (front & rear)",
  "Forward collision warning",
  "Rear cross traffic alert",
  "Auto high beam",
  "Driver monitoring system",
  "Door open warning",
];

const connectivityRows: [string, string, string, string][] = [
  ["Touchscreen", "32.76 cm", "32.76 cm", "32.76 cm"],
  ["Audio", "6 speakers", "8 speakers", "8 speakers"],
  [
    "Smart & connected features",
    "Touchscreen & 6-speaker audio (no camp/pet/wash/valet, wireless AA/CP, games, remote app or FOTA per model brief)",
    "Camp, pet, wash & valet modes; wireless Android Auto & Apple CarPlay; games; on-board diagnostics; firmware OTA; remote control (doors, window, HVAC); vehicle tracking & monitoring; smartphone notifications; OTA via smartphone app",
    "Same smart suite as Wind",
  ],
];

const featureHighlights = [
  "Three variants: Earth (177 PS, R17), Wind & Wind Infinity (204 PS, R18)",
  "Same 59.6 kWh battery — Earth up to 468 km MIDC; Wind/Infinity 463 km MIDC",
  "Earth: no ADAS; Wind: core ADAS + ACC; Infinity: adds AEB, FCW, RCTA, driver monitoring & more",
  "Wind & Wind Infinity: 7 airbags, 360° camera, panoramic roof, ventilated seats & full smart connectivity",
  "Colours: Infinity Blanc, Crimson Red, Jet Black, Desert Silver, Zenith Grey, Moonlit Ocean, Ivy Green",
];

/** Patliputra showroom photography — each item keeps visible copy with the image */
const vf6GalleryFeature: { src: string; title: string; description: string; alt: string }[] = [
  {
    src: vf6GalExterior1,
    title: "Sculpted for the city",
    description:
      "Compact SUV proportions with a confident stance — LED lighting and clean surfacing that reads premium from every angle you walk up to it.",
    alt: "VinFast VF 6 exterior — dramatic three-quarter view",
  },
  {
    src: vf6GalExterior2,
    title: "Designed to stand out",
    description:
      "Strong shoulder lines and balanced glass area give the VF 6 a modern silhouette that feels at home on Patna roads and open highways alike.",
    alt: "VinFast VF 6 exterior — dynamic road presence",
  },
];

const vf6GalleryDetails: { src: string; title: string; description: string; alt: string }[] = [
  {
    src: vf6GalDetail01,
    title: "Driver-centric cabin",
    description:
      "Landscape touchscreen, D-cut steering with the VinFast V, and light upholstery with contrast stitching — clear ergonomics and a premium feel through the front row.",
    alt: "VinFast VF 6 interior dashboard, steering wheel, and front seats",
  },
  {
    src: vf6GalDetail02,
    title: "Sleek side profile",
    description:
      "Aerodynamic roofline and defined wheel arches — Wind and Wind Infinity wear 18\" machine-cut alloys; Earth uses refined 17\" silver alloys.",
    alt: "VinFast VF 6 full side profile",
  },
  {
    src: vf6GalDetail03,
    title: "Front fascia & lighting",
    description:
      "LED lighting, signature V-shaped DRL, and a confident front graphic — visibility and identity in one glance.",
    alt: "VinFast VF 6 front three-quarter studio view",
  },
  {
    src: vf6GalDetail04,
    title: "Signature road presence",
    description:
      "Bold VF 6 proportions on the road — the full-width V light signature and sculpted cladding read unmistakable from the three-quarter angle.",
    alt: "VinFast VF 6 front three-quarter on open road with mountain backdrop",
  },
  {
    src: vf6GalDetail05,
    title: "Electrified performance",
    description:
      "Panoramic roofline, motion-ready stance, and smart-tech positioning — Wind and Wind Infinity add full ADAS and connected features; confirm your exact trim at Patliputra VinFast.",
    alt: "VinFast VF 6 dynamic front three-quarter on highway with motion blur",
  },
];

function SpecTable({ title, rows }: { title: string; rows: [string, string, string, string][] }) {
  return (
    <div className="mb-12">
      <h3 className="font-display font-bold text-lg md:text-xl mb-4 text-left">{title}</h3>
      <div className="overflow-x-auto touch-pan-x rounded-2xl border border-border/80 bg-card/30 [-webkit-overflow-scrolling:touch]">
        <table className="w-full min-w-[640px] text-sm text-left">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-4 py-3 font-display font-semibold w-[28%]">Parameter</th>
              <th className="px-3 py-3 font-display font-semibold text-primary">VF 6 Earth</th>
              <th className="px-3 py-3 font-display font-semibold text-primary">VF 6 Wind</th>
              <th className="px-3 py-3 font-display font-semibold text-primary">VF 6 Wind Infinity</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([param, e, w, inf]) => (
              <tr key={param} className="border-b border-border/60 last:border-0">
                <td className="px-4 py-2.5 text-muted-foreground align-top">{param}</td>
                <td className="px-3 py-2.5 align-top tabular-nums">{e}</td>
                <td className="px-3 py-2.5 align-top tabular-nums">{w}</td>
                <td className="px-3 py-2.5 align-top tabular-nums">{inf}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const ModelVF6 = () => {
  const { siteConfig } = usePublicSite();
  const { variantPrice, bySlug } = usePublicPricing();
  const [selectedColor, setSelectedColor] = useState(0);
  const [variant, setVariant] = useState<VariantId>("earth");

  usePageSeo(VF6_PAGE_SEO);

  useEffect(() => {
    // Preload all colour images so palette switches feel instant.
    colors.forEach((color) => {
      const img = new Image();
      img.src = color.image;
    });
  }, []);

  const stats = variantHeroStats[variant];
  const vMeta = vf6Variants.find((v) => v.id === variant)!;
  const displayExShowroom =
    variant === "earth"
      ? bySlug("vf6")?.priceFrom || siteConfig.vf6Price || variantExShowroomPrice.earth
      : variantPrice("vf6", variant, variantExShowroomPrice[variant]);

  return (
    <div className="public-page-shell">
      <Navbar />

      <section
        className="relative z-0 w-full max-w-none overflow-hidden bg-muted/20 pt-[4.25rem]"
        aria-label="VF 6 hero"
      >
        <div className="model-page-hero-frame">
          <img
            src={vf6HeroBanner}
            alt="VinFast VF 6 — Built for a brighter tomorrow."
            className="model-page-hero-image hero-slider-image"
            sizes="100vw"
            fetchPriority="high"
            decoding="async"
          />
        </div>
        <h1 className="sr-only">VinFast VF 6</h1>
      </section>

      <ModelPagePriceBand
        exShowroomPrice={displayExShowroom}
        priceCaption={`Indicative ex-showroom · ${vMeta.shortLabel}`}
        primaryCta={{ href: "/book-now?model=VF%206", label: "Book Now — VF 6" }}
        secondaryCta={{ href: "/test-drive", label: "Book a test drive" }}
      />

      <ModelPageVariantBar
        productLabel="VF 6"
        selectedVariantName={vMeta.name}
        variants={vf6Variants}
        selectedId={variant}
        onSelect={(id) => setVariant(id as VariantId)}
        selectId="vf6-variant-selector"
      />

      <ModelPageHighlightsBlock
        sectionTitle="Your drive, your way."
        productName="VF 6"
        description="Compact, smart, and electrifying — three trims on one VinFast SUV platform."
        highlights={[
          { label: "Range (MIDC)", value: stats.range },
          { label: "0–100 km/h", value: stats.accel },
          { label: "Max. power", value: stats.power },
        ]}
      />

      {/* Showroom photo gallery — Patliputra VF 6 library */}
      <section className="py-14 sm:py-20 lg:py-24 bg-background border-y border-border/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mb-12 lg:mb-16">
            <p className="text-primary font-display font-semibold text-sm uppercase tracking-[0.2em] mb-3">Gallery</p>
            <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl mb-4">VF 6 in detail</h2>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              Real exterior and interior photography from the showroom — each shot is paired with short context so specifications and design cues stay easy to scan alongside the visuals.
            </p>
          </div>

          <div className="grid gap-10 lg:gap-12 md:grid-cols-2 mb-14 lg:mb-20">
            {vf6GalleryFeature.map((item) => (
              <article key={item.title} className="flex flex-col">
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-border/50 bg-muted/30 shadow-sm">
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="image-high-quality absolute inset-0 h-full w-full object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="mt-5 md:mt-6">
                  <h3 className="font-display font-bold text-xl md:text-2xl text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm md:text-base text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="grid gap-10 sm:grid-cols-2 xl:grid-cols-3">
            {vf6GalleryDetails.map((item) => (
              <article key={item.title} className="flex flex-col">
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border/50 bg-muted/20">
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="image-high-quality absolute inset-0 h-full w-full object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="mt-4 flex-1 flex flex-col">
                  <h3 className="font-display font-bold text-lg md:text-xl text-foreground leading-snug">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">{item.description}</p>
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>

      {/* Color Studio */}
      <section className="py-14 sm:py-20 lg:py-24 section-surface">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <p className="text-primary font-display font-semibold text-sm uppercase tracking-[0.2em] mb-3">Color Studio</p>
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-8">Choose Your Shade</h2>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto mb-8">
            Infinity Blanc, Crimson Red, Jet Black, Desert Silver, Zenith Grey, Moonlit Ocean, Ivy Green.
          </p>
          <div className="max-w-5xl mx-auto mb-8 rounded-3xl overflow-hidden bg-[#F0F0F0]">
            <img
              src={colors[selectedColor].image}
              alt={`VinFast VF 6 in ${colors[selectedColor].name}`}
              className="image-high-quality h-auto w-full object-contain"
              sizes="(max-width: 768px) 100vw, 896px"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
            {colors.map((c, i) => (
              <button
                key={c.name}
                type="button"
                onClick={() => setSelectedColor(i)}
                className={`w-10 h-10 rounded-full border-2 transition-all ${i === selectedColor ? "border-primary scale-110 shadow-glow-red" : "border-foreground/10"}`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
          </div>
          <p className="text-muted-foreground text-sm">{colors[selectedColor].name}</p>
        </div>
      </section>

      {/* Full specification tables */}
      <section className="py-14 sm:py-20 lg:py-24 section-dark">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <p className="text-primary font-display font-semibold text-sm uppercase tracking-[0.2em] mb-3">Specifications</p>
            <h2 className="font-display font-bold text-3xl md:text-5xl mb-4">Vehicle Specification</h2>
            <p className="text-sm text-muted-foreground mb-2">VF 6 Earth, Wind & Wind Infinity</p>
            <p className="text-muted-foreground text-sm md:text-base">
              Full technical, safety, ADAS, and feature breakdown for VF 6 Earth, Wind & Wind Infinity — as per the official model specification brief.
            </p>
          </div>

          <SpecTable title="Technical specification" rows={technicalSpecRows} />

          <div className="mb-12 grid gap-10 lg:grid-cols-2">
            <div>
              <h3 className="font-display font-bold text-lg md:text-xl mb-4 text-left">Exterior — standard on all variants</h3>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc pl-5">
                {exteriorCommonBullets.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-display font-bold text-lg md:text-xl mb-4 text-left">Interior — all variants</h3>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc pl-5">
                {interiorCommonBullets.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          </div>

          <SpecTable title="Exterior & interior — differences by trim" rows={exteriorInteriorRows} />

          <div className="mb-12 grid gap-6 sm:gap-8 lg:grid-cols-2">
            <div className="rounded-2xl border border-border/80 bg-card/40 p-5 sm:p-6">
              <h3 className="font-display font-bold text-lg md:text-xl mb-3">Safety — all variants</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{safetyChassisAll}</p>
              <p className="text-muted-foreground text-xs mt-4 leading-relaxed">
                VF 6 Earth does not include the expanded safety pack below (7 airbags, 360°, rain-sensing wipers, etc.).
              </p>
            </div>
            <div className="rounded-2xl border border-border/80 bg-card/40 p-5 sm:p-6">
              <h3 className="font-display font-bold text-lg md:text-xl mb-3">Safety — VF 6 Wind & Wind Infinity only</h3>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc pl-5">
                {safetyWindInfinityBullets.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mb-12">
            <h3 className="font-display font-bold text-lg md:text-xl mb-4">ADAS by variant</h3>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              <div className="rounded-2xl border border-border/80 bg-card/40 p-4 sm:p-5 text-left min-w-0">
                <p className="font-display font-semibold text-primary mb-2">VF 6 Earth</p>
                <p className="text-sm text-muted-foreground">No ADAS.</p>
              </div>
              <div className="rounded-2xl border border-border/80 bg-card/40 p-4 sm:p-5 text-left min-w-0">
                <p className="font-display font-semibold text-primary mb-2">VF 6 Wind</p>
                <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                  {adasWindBullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-border/80 bg-card/40 p-4 sm:p-5 text-left min-w-0">
                <p className="font-display font-semibold text-primary mb-2">VF 6 Wind Infinity</p>
                <p className="text-xs font-semibold text-foreground/70 mb-1">Same as Wind</p>
                <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1 mb-3">
                  {adasWindBullets.map((b) => (
                    <li key={`inf-${b}`}>{b}</li>
                  ))}
                </ul>
                <p className="text-xs font-semibold text-foreground/70 mb-1">Additional on Infinity</p>
                <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                  {adasInfinityExtraBullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <SpecTable title="Connectivity, infotainment & smart features" rows={connectivityRows} />

          <div className="flex justify-center mt-10">
            <BrochureDownloadButton
              brochureHref="/brochures/VF6-Brochure.pdf"
              downloadFileName="VinFast-VF6-Brochure.pdf"
              modelDisplay="VF 6"
              pageSource="VF 6 Model Page"
              variant="outline"
              size="lg"
            >
              <Download className="w-4 h-4 mr-2" /> Download Brochure
            </BrochureDownloadButton>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-14 sm:py-20 lg:py-24 section-surface">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-16 items-center">
            <div>
              <p className="text-primary font-display font-semibold text-sm uppercase tracking-[0.2em] mb-3">Why VF 6</p>
              <h2 className="font-display font-bold text-3xl md:text-4xl mb-8">Three trims, one smart platform</h2>
              <div className="grid sm:grid-cols-1 gap-3">
                {featureHighlights.map((f) => (
                  <div key={f} className="flex items-start gap-3 py-2">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground/80">{f}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl overflow-hidden shadow-luxury border border-border/40">
              <img
                src={vf6WhyInteriorRhd}
                alt="VinFast VF 6 interior — right-hand drive cabin, dashboard and front seats"
                className="image-high-quality aspect-[4/3] w-full object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </section>

      <ModelPageNextStepSection
        eyebrow="VF 6 · Book Now"
        description={
          <>
            Reserve or enquire with Patliputra VinFast — we&apos;ll confirm pricing for your{" "}
            <strong className="text-foreground font-medium">{vMeta.shortLabel}</strong> trim and arrange finance or a test drive.
          </>
        }
        bookHref="/book-now?model=VF%206"
        bookLabel="Book Now — VF 6"
      />

      <LeadCaptureStrip />
      <Footer />
      <StickyMobileCTA />
    </div>
  );
};

export default ModelVF6;
