import { Link } from "react-router-dom";
import { Battery, Download, Gauge, Sparkles, Timer, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import LeadCaptureStrip from "@/components/LeadCaptureStrip";
import Footer from "@/components/Footer";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import mpv7Hero from "@/assets/mpv7-gallery/mpv7-hero.png";
import mpv7Feature1 from "@/assets/mpv7-gallery/mpv7-01.png";
import mpv7Feature2 from "@/assets/mpv7-gallery/mpv7-02.png";
import mpv7DtlOverview1 from "@/assets/mpv7-details/mpv7-dtl-overview-1.jpg";
import mpv7DtlOverview2 from "@/assets/mpv7-details/mpv7-dtl-overview-2.jpg";
import mpv7DtlOverview3 from "@/assets/mpv7-details/mpv7-dtl-overview-3.jpg";
import mpv7DtlFrontView from "@/assets/mpv7-details/mpv7-dtl-front-view.jpg";
import mpv7DtlFrontThreeQuarter from "@/assets/mpv7-details/mpv7-dtl-front-three-quarter.jpg";
import mpv7DtlSideLeft from "@/assets/mpv7-details/mpv7-dtl-side-left.jpg";
import mpv7DtlGrille from "@/assets/mpv7-details/mpv7-dtl-grille.jpg";
import mpv7DtlHeadlight from "@/assets/mpv7-details/mpv7-dtl-headlight.jpg";
import mpv7DtlWheel from "@/assets/mpv7-details/mpv7-dtl-wheel.jpg";
import mpv7DtlSideMirror from "@/assets/mpv7-details/mpv7-dtl-side-mirror.jpg";
import mpv7DtlInterior1 from "@/assets/mpv7-details/mpv7-dtl-interior-1.jpg";
import mpv7DtlInterior2 from "@/assets/mpv7-details/mpv7-dtl-interior-2.jpg";
import mpv7DtlSteering from "@/assets/mpv7-details/mpv7-dtl-steering.jpg";
import mpv7DtlSeats from "@/assets/mpv7-details/mpv7-dtl-seats.jpg";
import mpv7DtlTaillight from "@/assets/mpv7-details/mpv7-dtl-taillight.jpg";
import mpv7DtlRear from "@/assets/mpv7-details/mpv7-dtl-rear.jpg";
import mpv7DtlHorn from "@/assets/mpv7-details/mpv7-dtl-horn.jpg";
import mpv7DtlCutout from "@/assets/mpv7-details/mpv7-dtl-cutout.jpg";
import mpv7DtlOverviewMob1 from "@/assets/mpv7-details/mpv7-dtl-overview-mobile-1.jpg";
import mpv7DtlOverviewMob2 from "@/assets/mpv7-details/mpv7-dtl-overview-mobile-2.jpg";
import mpv7DtlOverviewMob3 from "@/assets/mpv7-details/mpv7-dtl-overview-mobile-3.jpg";
import mpv7DtlInteriorMob1 from "@/assets/mpv7-details/mpv7-dtl-interior-mobile-1.jpg";
import mpv7DtlInteriorMob2 from "@/assets/mpv7-details/mpv7-dtl-interior-mobile-2.jpg";

const EX_SHOWROOM = "Bookings open — contact for ex-showroom price*";

const heroStats = [
  { icon: Gauge, label: "Range (NEDC)", value: "450 km" },
  { icon: Timer, label: "DC fast charge", value: "10–70% ~35 min" },
  { icon: Users, label: "Seating", value: "7 (2+3+2)" },
];

const mpv7GalleryFeature: { src: string; title: string; description: string; alt: string }[] = [
  {
    src: mpv7Feature1,
    title: "Step into space designed around your journeys",
    description:
      "Room that stretches beyond expectations — a confident silhouette, signature V lighting, and proportions built for family trips across Bihar and beyond.",
    alt: "VinFast VF MPV 7 exterior overview",
  },
  {
    src: mpv7Feature2,
    title: "Your drive, your way",
    description:
      "Experience the thrill of electric with a vehicle that redefines the family journey — efficient packaging, modern tech, and the quiet confidence of zero tailpipe emissions.",
    alt: "VinFast VF MPV 7 exterior lifestyle shot",
  },
];

/** Detail photography from official MPV 7 asset set (Downloads / mpv7). */
const mpv7GalleryDetails: { src: string; title: string; description: string; alt: string }[] = [
  {
    src: mpv7DtlOverview1,
    title: "Room beyond expectations",
    description: "A confident silhouette and signature lighting — proportions built for family journeys.",
    alt: "VinFast VF MPV 7 exterior overview",
  },
  {
    src: mpv7DtlOverview2,
    title: "Designed around your trips",
    description: "Balanced surfacing and glass area for a modern electric MPV stance.",
    alt: "VinFast VF MPV 7 exterior second angle",
  },
  {
    src: mpv7DtlOverview3,
    title: "On the road",
    description: "Ride height and presence tuned for Indian roads — confirm ground clearance with Patliputra VinFast.",
    alt: "VinFast VF MPV 7 exterior third angle",
  },
  {
    src: mpv7DtlFrontView,
    title: "Front presence",
    description: "Full-width V signature lighting and a sculpted front graphic.",
    alt: "VinFast VF MPV 7 front view",
  },
  {
    src: mpv7DtlFrontThreeQuarter,
    title: "Front three-quarter",
    description: "See the full proportion — MPV practicality with SUV-inspired presence.",
    alt: "VinFast VF MPV 7 front three-quarter",
  },
  {
    src: mpv7DtlSideLeft,
    title: "Side profile",
    description: "Long wheelbase and floating roofline for a premium seven-seat silhouette.",
    alt: "VinFast VF MPV 7 side profile",
  },
  {
    src: mpv7DtlGrille,
    title: "V identity",
    description: "Centre V emblem and integrated light signature.",
    alt: "VinFast VF MPV 7 grille and logo",
  },
  {
    src: mpv7DtlHeadlight,
    title: "Lighting",
    description: "Crisp projector performance for night driving with a modern LED graphic.",
    alt: "VinFast VF MPV 7 headlamp detail",
  },
  {
    src: mpv7DtlWheel,
    title: "Alloy wheels",
    description: "225/55 R18 — aerodynamic multi-spoke alloys for efficiency and presence.",
    alt: "VinFast VF MPV 7 wheel detail",
  },
  {
    src: mpv7DtlSideMirror,
    title: "Side mirror",
    description: "Body-colour integration and practical adjustability for daily driving.",
    alt: "VinFast VF MPV 7 side mirror",
  },
  {
    src: mpv7DtlInterior1,
    title: "Three-row cabin",
    description: "Space that makes every seat feel considered — premium materials for seven.",
    alt: "VinFast VF MPV 7 interior wide view",
  },
  {
    src: mpv7DtlInterior2,
    title: "Comfort & ambience",
    description: "Second-row perspective — flexible seating and cabin refinement.",
    alt: "VinFast VF MPV 7 interior second angle",
  },
  {
    src: mpv7DtlSteering,
    title: "Driver focus",
    description: "Steering-wheel controls and cockpit layout centred on the daily drive.",
    alt: "VinFast VF MPV 7 steering wheel",
  },
  {
    src: mpv7DtlSeats,
    title: "Flexible seating",
    description: "Fold and configure rows to match passengers and cargo — exact operation per trim.",
    alt: "VinFast VF MPV 7 seat flexibility",
  },
  {
    src: mpv7DtlTaillight,
    title: "Rear signature",
    description: "Sculpted tail lamps that close out the design with clarity.",
    alt: "VinFast VF MPV 7 tail lamp",
  },
  {
    src: mpv7DtlRear,
    title: "Rear details",
    description: "Clean surfacing and practical access for daily loading.",
    alt: "VinFast VF MPV 7 rear detail",
  },
  {
    src: mpv7DtlHorn,
    title: "Front-end detail",
    description: "Integrated horn and bumper surfacing — form aligned with the V design language.",
    alt: "VinFast VF MPV 7 front bumper detail",
  },
  {
    src: mpv7DtlCutout,
    title: "Pure silhouette",
    description: "The MPV outline at a glance — unmistakable VinFast proportions.",
    alt: "VinFast VF MPV 7 side silhouette",
  },
  {
    src: mpv7DtlOverviewMob1,
    title: "Exterior (compact crop)",
    description: "Alternate crop from the official gallery — useful on smaller screens.",
    alt: "VinFast VF MPV 7 exterior mobile crop 1",
  },
  {
    src: mpv7DtlOverviewMob2,
    title: "Exterior (compact crop 2)",
    description: "Second mobile-optimised exterior frame from the same asset set.",
    alt: "VinFast VF MPV 7 exterior mobile crop 2",
  },
  {
    src: mpv7DtlOverviewMob3,
    title: "Exterior (compact crop 3)",
    description: "Third mobile-optimised exterior frame from the same asset set.",
    alt: "VinFast VF MPV 7 exterior mobile crop 3",
  },
  {
    src: mpv7DtlInteriorMob1,
    title: "Cabin (compact crop)",
    description: "Interior framing from the mobile asset pack — trim may vary.",
    alt: "VinFast VF MPV 7 interior mobile crop 1",
  },
  {
    src: mpv7DtlInteriorMob2,
    title: "Cabin (compact crop 2)",
    description: "Second interior frame from the mobile asset pack.",
    alt: "VinFast VF MPV 7 interior mobile crop 2",
  },
];

const specRows: [string, string][] = [
  ["Overall dimensions (L × W × H)", "4750 × 1900 × 1660 mm"],
  ["Wheelbase", "2890 mm"],
  ["Maximum power", "150 kW"],
  ["Maximum torque", "310 Nm"],
  ["Drive system", "Front-wheel drive (FWD)"],
  ["Battery capacity", "75.3 kWh"],
  ["AC charging time (10–70%)", "~7 hours"],
  ["DC charging time (10–70%)", "~35 mins"],
  ["Top speed", "145 km/h"],
  ["Acceleration (0–100 km/h)", "8.3 s"],
  ["Seating capacity", "7 seats"],
  ["Tyre size", "225/55 R18"],
  ["Ground clearance (unladen)", "175 mm"],
  ["Turning radius", "5.8 m"],
  ["Range (NEDC)", "450 km"],
  ["Safety", "6 airbags · ADAS (confirm pack with dealer)"],
  ["Warranty — vehicle", "7 years or 160,000 km"],
  ["Warranty — battery", "8 years or unlimited km"],
];

const ModelMPV7 = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative flex min-h-[85vh] flex-col">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={mpv7Hero}
            alt="VinFast VF MPV 7 electric MPV — bookings open"
            className="h-full w-full object-cover object-[center_42%]"
            sizes="100vw"
            fetchPriority="high"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/20" aria-hidden />
        </div>
        <div className="relative z-10 flex min-h-0 flex-1 flex-col pt-20 sm:pt-24 lg:pt-28">
          <div className="min-h-0 flex-1" aria-hidden />
          <div className="container mx-auto w-full shrink-0 px-4 pb-20 lg:px-8 lg:pb-28">
            <div className="text-left max-w-3xl">
              <p className="text-hero-plain font-display font-semibold text-xs sm:text-sm uppercase tracking-[0.25em] mb-2">
                The all-new
              </p>
              <h1 className="text-hero-plain-lg font-display font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-3 leading-[1.05]">
                VF MPV 7
              </h1>
              <span className="inline-block rounded-md bg-white/95 text-gray-900 px-3 py-1.5 text-xs sm:text-sm font-display font-bold uppercase tracking-wide mb-6 shadow-sm">
                Bookings open
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 max-w-2xl">
                {heroStats.map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="rounded-xl border border-white/25 bg-black/40 backdrop-blur-sm px-4 py-3 flex items-start gap-3"
                  >
                    <Icon className="w-5 h-5 text-white shrink-0 mt-0.5" aria-hidden />
                    <div>
                      <p className="text-hero-plain-lg font-display font-bold text-lg tabular-nums leading-tight">{value}</p>
                      <p className="text-hero-plain-muted text-[11px] mt-0.5">{label}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mb-2">
                <p className="text-hero-plain-lg font-display font-bold text-2xl sm:text-3xl lg:text-4xl tabular-nums leading-[1.08]">
                  {EX_SHOWROOM}
                </p>
                <p className="text-hero-plain-muted text-[11px] sm:text-xs mt-0.5">Indicative — Patliputra VinFast Patna</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 w-full max-w-xl sm:max-w-2xl mt-4">
                <Link to="/test-drive" className="w-full">
                  <Button variant="hero" size="lg" className="w-full rounded-full sm:!py-6 sm:!text-base">
                    Book Test Drive
                  </Button>
                </Link>
                <Link to="/book-now" className="w-full">
                  <Button variant="heroWhite" size="lg" className="w-full rounded-full sm:!py-6 sm:!text-base">
                    Book Now
                  </Button>
                </Link>
                <Link to="/contact" className="w-full sm:col-span-2">
                  <Button
                    variant="heroOutline"
                    size="lg"
                    className="w-full rounded-full sm:!py-6 sm:!text-base bg-black/45 border-white/50 text-white hover:bg-black/55"
                  >
                    Get On-Road Price
                  </Button>
                </Link>
              </div>

              <p className="text-hero-plain-soft text-sm sm:text-base leading-relaxed mt-6 max-w-xl">
                Seven-seat electric MPV with ADAS, fast charging, and VinFast warranty coverage — experience it first at
                Patliputra VinFast, Bihar&apos;s authorized dealer.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-14 lg:py-20 border-b border-border/60 bg-muted/25">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mb-10">
            <p className="text-primary font-display font-semibold text-sm uppercase tracking-[0.2em] mb-2">Highlights</p>
            <h2 className="font-display font-bold text-2xl md:text-3xl lg:text-4xl mb-3">Built for families who move together</h2>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              Electric torque, intelligent assistance, and a cabin designed around real journeys — from school runs in Patna to
              highway weekends.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Battery, t: "75.3 kWh battery", d: "NEDC range up to 450 km with DC fast charging for long family trips." },
              { icon: Sparkles, t: "ADAS on board", d: "Advanced driver assistance for safer motorway and city use." },
              { icon: Users, t: "True seven seats", d: "2+3+2 layout with room for passengers and luggage planning." },
              { icon: Gauge, t: "150 kW peak", d: "310 Nm torque — responsive acceleration for an electric MPV." },
            ].map(({ icon: Icon, t, d }) => (
              <div key={t} className="rounded-2xl border border-border/70 bg-background p-5 shadow-sm">
                <Icon className="w-6 h-6 text-primary mb-3" />
                <h3 className="font-display font-bold text-lg mb-2">{t}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 lg:py-24 bg-background border-y border-border/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mb-12 lg:mb-16">
            <p className="text-primary font-display font-semibold text-sm uppercase tracking-[0.2em] mb-3">Gallery</p>
            <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl mb-4">VF MPV 7 in detail</h2>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              Below: full official MPV 7 detail pack (exterior, cabin, and mobile crops) — each frame with short context. Exact
              equipment may vary; confirm with Patliputra VinFast Patna.
            </p>
          </div>

          <div className="grid gap-10 lg:gap-12 md:grid-cols-2 mb-14 lg:mb-20">
            {mpv7GalleryFeature.map((item) => (
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
            {mpv7GalleryDetails.map((item) => (
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

          <p className="text-muted-foreground text-xs mt-12 max-w-4xl leading-relaxed">
            *Images shown are for illustrative purposes only. Features and specifications may vary — contact Patliputra VinFast for
            the latest VF MPV 7 pack and availability in Bihar.
          </p>
        </div>
      </section>

      <section className="py-14 sm:py-20 section-surface border-t border-border/60">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mb-10">
            <p className="text-primary font-display font-semibold text-sm uppercase tracking-[0.2em] mb-3">Specifications</p>
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">Technical summary</h2>
            <p className="text-muted-foreground text-sm md:text-base">
              Key figures as published for the VF MPV 7 — ask our Patna team for variant-specific confirmation and on-road
              pricing.
            </p>
          </div>
          <div className="overflow-x-auto touch-pan-x rounded-2xl border border-border/80 bg-card/30 max-w-4xl">
            <table className="w-full min-w-[320px] text-sm text-left">
              <tbody>
                {specRows.map(([k, v]) => (
                  <tr key={k} className="border-b border-border/60 last:border-0">
                    <th className="px-4 py-3 font-medium text-muted-foreground w-[45%] align-top">{k}</th>
                    <td className="px-4 py-3 align-top tabular-nums">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button variant="outline" size="lg" asChild>
              <a href="/contact" className="inline-flex items-center gap-2">
                <Download className="w-4 h-4" />
                Request brochure
              </a>
            </Button>
            <Button variant="hero" size="lg" asChild>
              <Link to="/compare">Compare models</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 section-dark border-t border-border/60">
        <div className="container mx-auto px-4 lg:px-8 text-center max-w-2xl">
          <h2 className="font-display font-bold text-2xl md:text-3xl mb-4">Ready for a seven-seat electric?</h2>
          <p className="text-muted-foreground mb-8 text-sm">
            Book a test drive or speak to Patliputra VinFast about booking, finance, and delivery timelines for the VF MPV 7.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/test-drive">
              <Button variant="hero" size="lg">
                Book test drive
              </Button>
            </Link>
            <Link to="/book-now">
              <Button variant="outline" size="lg">
                Book now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <LeadCaptureStrip />
      <Footer />
      <StickyMobileCTA />
    </div>
  );
};

export default ModelMPV7;
