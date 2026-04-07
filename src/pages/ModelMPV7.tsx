import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Check, Download, Sparkles, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import LeadCaptureStrip from "@/components/LeadCaptureStrip";
import Footer from "@/components/Footer";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import { BrochureDownloadButton } from "@/components/BrochureDownloadButton";
import { toast } from "sonner";
import { addLead } from "@/lib/vfLocalStorage";
import type { Lead } from "@/data/mockData";
import { hasApi } from "@/lib/apiConfig";
import { formatApiErrors } from "@/lib/api";
import { submitPublicLead } from "@/lib/publicFormsApi";
import { DEFAULT_MPV7_TRIM, leadModelLabel } from "@/data/vinfastModels";
import { BiharDistrictField } from "@/components/BiharDistrictField";
import { FormCaptcha } from "@/components/FormCaptcha";
import { BIHAR_DEFAULT_DISTRICT, DISTRICT_OTHER } from "@/data/biharDistricts";
import mpv7Hero from "@/assets/mpv7-gallery/mpv7-hero.png";
import mpv7Feature2 from "@/assets/mpv7-gallery/mpv7-02.png";
import mpv7DtlOverview1 from "@/assets/mpv7-details/mpv7-dtl-overview-1.jpg";
import mpv7DtlOverview2 from "@/assets/mpv7-details/mpv7-dtl-overview-2.jpg";
import mpv7DtlOverview3 from "@/assets/mpv7-details/mpv7-dtl-overview-3.jpg";
import mpv7DtlFrontView from "@/assets/mpv7-details/mpv7-dtl-front-view.jpg";
import mpv7DtlSideLeft from "@/assets/mpv7-details/mpv7-dtl-side-left.png";
import mpv7DtlGrille from "@/assets/mpv7-details/mpv7-dtl-grille.jpg";
import mpv7DtlHeadlight from "@/assets/mpv7-details/mpv7-dtl-headlight.jpg";
import mpv7DtlWheel from "@/assets/mpv7-details/mpv7-dtl-wheel.jpg";
import mpv7DtlSideMirror from "@/assets/mpv7-details/mpv7-dtl-side-mirror.jpg";
import mpv7DtlInterior1 from "@/assets/mpv7-details/mpv7-dtl-interior-1.jpg";
import mpv7DtlInterior2 from "@/assets/mpv7-details/mpv7-dtl-interior-2.jpg";
import mpv7DtlSteering from "@/assets/mpv7-details/mpv7-dtl-steering.png";
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

const MPV7_PREBOOK_SESSION_KEY = "vinfast_mpv7_prebook_unlocked";
const MPV7_PREBOOK_UNLOCK_EVENT = "vinfast-mpv7-prebook-unlock";
const MOBILE_REGEX = /^[6-9]\d{9}$/;

const getLocalISODate = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const mpv7GalleryFeature: { src: string; title: string; description: string; alt: string }[] = [
  {
    src: mpv7Hero,
    title: "Step into space designed around your journeys",
    description:
      "Room that stretches beyond expectations — a confident silhouette, signature V lighting, and proportions built for family trips across Bihar and beyond.",
    alt: "VinFast VF MPV 7 exterior overview — studio front three-quarter",
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
    src: mpv7Hero,
    title: "Front three-quarter",
    description: "See the full proportion — MPV practicality with SUV-inspired presence.",
    alt: "VinFast VF MPV 7 front three-quarter studio view",
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
    description:
      "Leather-wrapped wheel with integrated controls, vertical infotainment, and a cockpit laid out for everyday driving.",
    alt: "VinFast VF MPV 7 steering wheel and driver cockpit with touchscreen",
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
  ["Battery capacity", "60.13 kWh"],
  ["AC charging time (10–70%)", "~7 hours"],
  ["DC charging time (10–70%)", "~35 mins"],
  ["Top speed", "145 km/h"],
  ["Acceleration (0–100 km/h)", "<10 sec"],
  ["Seating capacity", "7 seats"],
  ["Tyre size", "225/55 R18"],
  ["Ground clearance (unladen)", "175 mm"],
  ["Turning radius", "5.8 m"],
  ["Safety", "6 airbags · ADAS (confirm pack with dealer)"],
  ["Warranty — vehicle", "7 years or 160,000 km"],
  ["Warranty — battery", "8 years or unlimited km"],
];

const mpv7KeyFigures: { label: string; value: string }[] = [
  { label: "Battery capacity", value: "60.13 kWh" },
  { label: "Max. torque", value: "310 Nm" },
  { label: "DC charge (10–70%)", value: "~35 mins" },
  { label: "Seating", value: "7 seats · 2+3+2" },
  { label: "Ground clearance (unladen)", value: "175 mm" },
  { label: "Tyres & wheels", value: "225/55 R18" },
];

const mpv7SpotlightChips = [
  "Seven-seat electric MPV",
  "ADAS — confirm pack with dealer",
  "Fast DC charging",
  "Bookings open · Patna",
];

const studioViews = [
  { label: "Studio", image: mpv7Hero, alt: "VinFast VF MPV 7 studio front three-quarter" },
  { label: "Lifestyle", image: mpv7Feature2, alt: "VinFast VF MPV 7 lifestyle exterior" },
  { label: "Side profile", image: mpv7DtlSideLeft, alt: "VinFast VF MPV 7 side profile" },
] as const;

const mpv7InteriorBullets = [
  "Three-row cabin with flexible 2+3+2 seating",
  "Vertical touchscreen infotainment and connected services",
  "Leather-wrapped steering with integrated controls",
  "Six airbags — confirm full safety and ADAS pack with Patna",
];

const inputClass =
  "h-12 px-4 rounded-xl bg-background/50 border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-full";

const ModelMPV7 = () => {
  const location = useLocation();
  const [prebookUnlocked, setPrebookUnlocked] = useState(
    () => typeof sessionStorage !== "undefined" && sessionStorage.getItem(MPV7_PREBOOK_SESSION_KEY) === "1",
  );
  const [interestForm, setInterestForm] = useState({
    name: "",
    mobile: "",
    email: "",
    city: BIHAR_DEFAULT_DISTRICT,
    otherCity: "",
  });
  const [mobileError, setMobileError] = useState("");
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaResetSignal, setCaptchaResetSignal] = useState(0);
  const [studioIdx, setStudioIdx] = useState(0);
  const todayStr = getLocalISODate();
  const studio = studioViews[studioIdx] ?? studioViews[0];

  useEffect(() => {
    if (location.hash !== "#mpv7-prebook") return;
    const t = window.setTimeout(() => {
      document.getElementById("mpv7-prebook")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
    return () => clearTimeout(t);
  }, [location.hash, location.pathname]);

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
    setInterestForm({ ...interestForm, mobile: digits });
    if (digits.length === 0) setMobileError("");
    else if (digits.length < 10) setMobileError("Mobile number must be 10 digits.");
    else if (MOBILE_REGEX.test(digits)) setMobileError("");
    else setMobileError("Enter a valid Indian mobile number (starts with 6–9).");
  };

  const handlePrebookInterestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!interestForm.name.trim()) {
      toast.error("Please enter your full name.");
      return;
    }
    if (!interestForm.mobile || !MOBILE_REGEX.test(interestForm.mobile)) {
      toast.error("Please enter a valid 10-digit Indian mobile number.");
      return;
    }
    if (interestForm.city === DISTRICT_OTHER && !interestForm.otherCity.trim()) {
      toast.error("Please enter your city or district (outside Bihar).");
      return;
    }
    if (!captchaVerified) {
      toast.error("Please complete captcha verification.");
      return;
    }

    const modelDisplay = leadModelLabel("VF MPV 7", DEFAULT_MPV7_TRIM);

    if (hasApi()) {
      try {
        await submitPublicLead({
          name: interestForm.name.trim(),
          mobile: interestForm.mobile,
          city: interestForm.city === DISTRICT_OTHER ? DISTRICT_OTHER : interestForm.city,
          otherCity: interestForm.city === DISTRICT_OTHER ? interestForm.otherCity : "",
          modelDisplay,
          source: "Website",
          email: interestForm.email.trim(),
          remarks: "VF MPV 7 pre-booking interest — form gate on model page",
          interest: "Pre-book interest",
          financeNeeded: false,
          exchangeNeeded: false,
          pageSource: "VF MPV 7 Model Page",
        });
      } catch (err) {
        toast.error(formatApiErrors(err));
        return;
      }
    } else {
      try {
        const lead: Lead = {
          id: `WL_${Date.now()}`,
          name: interestForm.name.trim(),
          mobile: interestForm.mobile,
          email: interestForm.email.trim(),
          city:
            interestForm.city === DISTRICT_OTHER
              ? interestForm.otherCity.trim() || DISTRICT_OTHER
              : interestForm.city,
          model: modelDisplay,
          source: "Website",
          status: "Interested",
          assignedTo: "",
          createdAt: todayStr,
          nextFollowUp: "",
          remarks: "VF MPV 7 pre-booking interest — form gate on model page",
          financeNeeded: false,
          exchangeNeeded: false,
        };
        addLead(lead);
      } catch {
        toast.error("Could not save your request. Please call or WhatsApp us.");
        return;
      }
    }

    sessionStorage.setItem(MPV7_PREBOOK_SESSION_KEY, "1");
    window.dispatchEvent(new Event(MPV7_PREBOOK_UNLOCK_EVENT));
    setPrebookUnlocked(true);
    toast.success("Thank you! You can now continue to complete your VF MPV 7 pre-booking.");
    setInterestForm({ name: "", mobile: "", email: "", city: BIHAR_DEFAULT_DISTRICT, otherCity: "" });
    setMobileError("");
    setCaptchaResetSignal((n) => n + 1);
  };

  return (
    <div className="min-h-screen bg-background pb-36 lg:pb-0">
      <Navbar />

      {/* Hero — same shell as VF 6 */}
      <section className="relative flex min-h-[85vh] flex-col">
        <div className="hero-media-scrim absolute inset-0 overflow-hidden">
          <img
            src={mpv7Hero}
            alt="VinFast VF MPV 7 electric MPV"
            className="h-full w-full object-cover object-[center_45%]"
            sizes="100vw"
            fetchPriority="high"
            decoding="async"
          />
        </div>
        <div className="relative z-10 flex min-h-0 flex-1 flex-col pt-20 sm:pt-24 lg:pt-28">
          <div className="min-h-0 flex-1" aria-hidden />
          <div className="container mx-auto w-full shrink-0 px-4 pb-20 mt-[22px] sm:mt-[30px] lg:mt-[38px] lg:px-8 lg:pb-28 -translate-y-4 sm:-translate-y-5 lg:-translate-y-6">
            <div className="text-left max-w-3xl">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-2 mb-2">
                <span className="inline-flex rounded-full px-2.5 py-1 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.18em] text-white bg-black/55 border border-white/40 backdrop-blur-sm">
                  New launch
                </span>
                <span className="hidden sm:inline text-white/50 text-xs" aria-hidden>
                  ·
                </span>
                <p className="text-hero-plain font-display font-semibold text-sm uppercase tracking-[0.25em]">
                  Seven-seat electric MPV
                </p>
              </div>
              <h1 className="text-hero-plain-lg font-display font-bold text-4xl sm:text-5xl md:text-6xl lg:text-8xl mb-4 sm:mb-5 leading-[1.05]">
                VF MPV 7
              </h1>

              <div className="mb-5 sm:mb-6 space-y-3 sm:space-y-3.5 max-w-md">
                <div>
                  <p className="text-hero-plain-lg font-display font-bold text-xl sm:text-2xl tabular-nums leading-tight">
                    60.13 kWh
                  </p>
                  <p className="text-hero-plain-muted text-[11px] sm:text-xs mt-0.5">Battery capacity</p>
                </div>
                <div>
                  <p className="text-hero-plain-lg font-display font-bold text-xl sm:text-2xl tabular-nums leading-tight">
                    150 kW
                  </p>
                  <p className="text-hero-plain-muted text-[11px] sm:text-xs mt-0.5">Max. power</p>
                </div>
                <div>
                  <p className="text-hero-plain-lg font-display font-bold text-xl sm:text-2xl tabular-nums leading-tight">
                    {"<10 sec"}
                  </p>
                  <p className="text-hero-plain-muted text-[11px] sm:text-xs mt-0.5">0–100 km/h</p>
                </div>
                <div>
                  <p className="text-hero-plain-lg font-display font-bold text-xl sm:text-2xl tabular-nums leading-tight">
                    7 seats
                  </p>
                  <p className="text-hero-plain-muted text-[11px] sm:text-xs mt-0.5">2+3+2 layout</p>
                </div>
              </div>

              <div className="flex w-full max-w-md flex-col gap-3">
                <Link to="#mpv7-prebook" className="w-full min-w-0">
                  <Button variant="hero" size="lg" className="w-full rounded-full !py-3.5 !text-xs sm:!py-6 sm:!text-base">
                    Register for pre-booking
                  </Button>
                </Link>
                <Link
                  to="/emi-calculator"
                  className="inline-flex w-full items-center justify-center rounded-full border border-white/55 bg-black/35 px-4 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-black/50 sm:py-3.5"
                >
                  EMI Calculator
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Model overview — VF 6–style two-column + exterior view strip */}
      <section className="py-10 sm:py-14 lg:py-20 border-b border-border/60 bg-muted/25">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid items-start gap-10 lg:gap-14 lg:grid-cols-12">
            <div className="lg:col-span-5 xl:col-span-5 space-y-6">
              <div>
                <p className="text-primary font-display font-semibold text-sm uppercase tracking-[0.2em] mb-2">Model overview</p>
                <h2 className="font-display font-bold text-2xl md:text-3xl lg:text-4xl mb-3">VinFast VF MPV 7</h2>
              </div>

              <div className="rounded-2xl border border-border/70 bg-background/90 p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-foreground/80 mb-3">Key figures</p>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                  {mpv7KeyFigures.map((row) => (
                    <div key={row.label} className="border-b border-border/40 sm:border-0 pb-3 sm:pb-0 last:border-0 last:pb-0">
                      <dt className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{row.label}</dt>
                      <dd className="text-sm font-medium text-foreground mt-0.5 leading-snug">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="rounded-2xl border border-border/70 bg-muted/30 p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-foreground/80 mb-2">Bookings &amp; pre-booking</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Bookings are open at Patliputra VinFast Patna. Register your interest in the section below — after you submit,
                  you can continue on Pre Book with VF MPV 7 pre-selected.
                </p>
              </div>

              {/* Fills left column on desktop — same angle as Exterior preview / studio */}
              <div className="hidden lg:block rounded-2xl border border-border/60 bg-[#ECECEA] dark:bg-muted/40 overflow-hidden shadow-sm">
                <div className="relative aspect-[4/3]">
                  <img
                    src={studio.image}
                    alt={studio.alt}
                    className="absolute inset-0 h-full w-full object-contain object-center p-5"
                    sizes="(max-width: 1280px) 40vw, 480px"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <p className="text-center text-xs text-muted-foreground px-4 py-2.5 border-t border-border/40 bg-background/60">
                  {studio.label} preview
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 xl:col-span-7 space-y-8">
              <div className="rounded-2xl border border-border/60 bg-[#ECECEA] dark:bg-muted/40 overflow-hidden shadow-sm">
                <div className="relative aspect-[16/10] sm:aspect-[2/1] lg:min-h-[280px]">
                  <img
                    src={studio.image}
                    alt={studio.alt}
                    className="image-high-quality absolute inset-0 h-full w-full object-contain object-center p-6 sm:p-8"
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <p className="text-center text-xs text-muted-foreground px-4 py-3 border-t border-border/40 bg-background/60">
                  {studio.label} · VF MPV 7
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                <div className="rounded-xl border border-border/70 bg-card/80 p-3 sm:p-4 shadow-sm col-span-2 sm:col-span-1">
                  <p className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 leading-tight">
                    Status
                  </p>
                  <p className="font-display font-bold text-sm sm:text-base leading-tight">Bookings open</p>
                </div>
                <div className="rounded-xl border border-border/70 bg-card/80 p-3 sm:p-4 shadow-sm">
                  <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                    <Timer className="w-3.5 h-3.5 shrink-0" aria-hidden />
                    <p className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider leading-tight">0–100 km/h</p>
                  </div>
                  <p className="font-display font-bold text-base sm:text-lg md:text-xl tabular-nums">{"<10 sec"}</p>
                </div>
                <div className="rounded-xl border border-border/70 bg-card/80 p-3 sm:p-4 shadow-sm">
                  <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                    <Sparkles className="w-3.5 h-3.5 shrink-0" aria-hidden />
                    <p className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider leading-tight">Max. power</p>
                  </div>
                  <p className="font-display font-bold text-base sm:text-lg md:text-xl tabular-nums">150 kW</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">At a glance</p>
                <div className="flex flex-wrap gap-2">
                  {mpv7SpotlightChips.map((chip) => (
                    <span
                      key={chip}
                      className="inline-flex items-center rounded-full border border-border/80 bg-background/90 px-3 py-1.5 text-xs font-medium text-foreground/90"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-1">
                <Button asChild variant="default" size="default">
                  <Link to="#mpv7-prebook">Register for pre-booking</Link>
                </Button>
                {prebookUnlocked ? (
                  <Button asChild variant="default" size="default" className="bg-primary">
                    <Link to="/book-now?model=VF%20MPV%207">Pre-book VF MPV 7</Link>
                  </Button>
                ) : null}
                <Button asChild variant="ghost" size="default" className="text-muted-foreground">
                  <Link to="/contact">On-road price</Link>
                </Button>
              </div>

              <div
                className="rounded-xl border border-border/60 bg-muted/30 p-4 sm:p-5 mt-4"
                role="group"
                aria-label="Choose exterior preview angle"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Exterior preview</p>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-2 w-full max-w-2xl">
                  {studioViews.map((v, i) => (
                    <button
                      key={v.label}
                      type="button"
                      onClick={() => setStudioIdx(i)}
                      className={`rounded-full px-2.5 py-1 text-[11px] sm:text-xs font-semibold transition-all border text-center leading-tight whitespace-nowrap shrink-0 ${
                        studioIdx === i
                          ? "bg-foreground text-background border-foreground shadow-sm"
                          : "bg-background/90 text-foreground border-border/80 hover:bg-muted"
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

          <div className="mt-10 lg:mt-12 rounded-2xl border border-border/60 bg-card/90 shadow-sm p-5 sm:p-6 lg:p-8">
            <div className="grid gap-6 lg:grid-cols-12 lg:items-stretch lg:gap-8">
              <div className="order-2 lg:order-1 lg:col-span-3 flex flex-col justify-center min-w-0">
                <p className="text-primary font-display font-semibold text-xs uppercase tracking-[0.2em] mb-2">Exterior views</p>
                <p className="font-display font-bold text-xl sm:text-2xl text-foreground">{studio.label}</p>
                <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
                  Switch angles to preview the VF MPV 7 — the same selection stays in sync with{" "}
                  <span className="text-foreground/80 font-medium">Exterior studio</span> further down the page.
                </p>
              </div>

              <div className="order-1 lg:order-2 lg:col-span-6 min-w-0">
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-border/50 bg-[#ECECEA] dark:bg-muted/40">
                  <img
                    src={studio.image}
                    alt={studio.alt}
                    className="absolute inset-0 h-full w-full object-contain object-center p-4 sm:p-6"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>

              <div className="order-3 lg:col-span-3 flex flex-row lg:flex-col flex-wrap items-center justify-center lg:justify-center gap-2.5 sm:gap-3 lg:gap-3">
                {studioViews.map((v, i) => (
                  <button
                    key={v.label}
                    type="button"
                    onClick={() => setStudioIdx(i)}
                    className={`relative h-14 w-14 sm:h-16 sm:w-16 lg:h-[4.5rem] lg:w-[4.5rem] shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                      i === studioIdx
                        ? "border-primary scale-105 ring-2 ring-primary/30 shadow-md"
                        : "border-border/80 hover:border-foreground/40 hover:scale-[1.02]"
                    }`}
                    title={v.label}
                    aria-label={`Show ${v.label} view`}
                    aria-pressed={i === studioIdx}
                  >
                    <img src={v.image} alt="" className="h-full w-full object-cover object-center" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 lg:py-24 bg-background border-y border-border/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mb-12 lg:mb-16">
            <p className="text-primary font-display font-semibold text-sm uppercase tracking-[0.2em] mb-3">Gallery</p>
            <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl mb-4">VF MPV 7 in detail</h2>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              Below: full official MPV 7 detail pack (exterior, cabin, and mobile crops) — each frame with short context.
            </p>
          </div>

          <div className="grid gap-8 md:gap-10 lg:gap-12 md:grid-cols-2 mb-12 lg:mb-16">
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

          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3 sm:gap-x-6 sm:gap-y-10">
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

        </div>
      </section>

      {/* Exterior studio — VF 6 Color Studio pattern */}
      <section className="py-14 sm:py-20 section-surface border-t border-border/60">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <p className="text-primary font-display font-semibold text-sm uppercase tracking-[0.2em] mb-3">Exterior studio</p>
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-8">Choose your view</h2>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto mb-8">
            Studio, lifestyle, and side profile views of the VF MPV 7.
          </p>
          <div className="max-w-5xl mx-auto mb-8 rounded-3xl overflow-hidden bg-[#F0F0F0] dark:bg-muted/30">
            <img
              src={studio.image}
              alt={studio.alt}
              className="image-high-quality h-auto w-full object-contain"
              sizes="(max-width: 768px) 100vw, 896px"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
            {studioViews.map((v, i) => (
              <button
                key={v.label}
                type="button"
                onClick={() => setStudioIdx(i)}
                className={`h-11 w-11 sm:h-12 sm:w-12 overflow-hidden rounded-full border-2 transition-all ${
                  i === studioIdx ? "border-primary scale-110 shadow-glow-red" : "border-foreground/10"
                }`}
                title={v.label}
                aria-label={`Select ${v.label} view`}
                aria-pressed={i === studioIdx}
              >
                <img src={v.image} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
          <p className="text-muted-foreground text-sm">{studio.label}</p>
        </div>
      </section>

      {/* Specifications — VF 6 dark band */}
      <section className="py-16 sm:py-24 section-dark border-t border-border/60">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <p className="text-primary font-display font-semibold text-sm uppercase tracking-[0.2em] mb-3">Specifications</p>
            <h2 className="font-display font-bold text-3xl md:text-5xl mb-4">VF MPV 7 — technical summary</h2>
            <p className="text-muted-foreground text-sm md:text-base">
              Key published figures for the seven-seat electric MPV — confirm final pack, ADAS scope, and on-road pricing with
              Patna.
            </p>
          </div>
          <div className="overflow-x-auto touch-pan-x rounded-2xl border border-border/80 bg-card/40 max-w-4xl mx-auto">
            <table className="w-full min-w-[320px] text-sm text-left">
              <tbody>
                {specRows.map(([k, v]) => (
                  <tr key={k} className="border-b border-border/60 last:border-0">
                    <th className="px-4 py-3 font-medium text-muted-foreground w-[45%] align-top">{k}</th>
                    <td className="px-4 py-3 align-top tabular-nums text-foreground/90">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <BrochureDownloadButton
              brochureHref="/brochures/VF-MPV7-Brochure.pdf"
              downloadFileName="VinFast-VF-MPV7-Brochure.pdf"
              modelDisplay="VF MPV 7"
              pageSource="VF MPV 7 Model Page"
              variant="outline"
              size="lg"
              className="border-white/25 bg-white/5 text-white hover:bg-white/10"
            >
              <Download className="w-4 h-4 mr-2" />
              Request brochure
            </BrochureDownloadButton>
            <Button variant="hero" size="lg" asChild>
              <Link to="/compare">Compare models</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Interior / why — VF 6 “Highlights” pattern */}
      <section className="py-16 sm:py-24 section-surface border-t border-border/60">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-16 items-center">
            <div>
              <p className="text-primary font-display font-semibold text-sm uppercase tracking-[0.2em] mb-3">Cabin &amp; comfort</p>
              <h2 className="font-display font-bold text-3xl md:text-4xl mb-8">Seven seats, one connected space</h2>
              <div className="grid gap-3">
                {mpv7InteriorBullets.map((f) => (
                  <div key={f} className="flex items-start gap-3 py-2">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" aria-hidden />
                    <span className="text-sm text-foreground/80">{f}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild variant="outline" size="lg">
                  <Link to="/contact">Ask about interior packs</Link>
                </Button>
              </div>
            </div>
            <div className="rounded-3xl overflow-hidden shadow-luxury border border-border/40">
              <img
                src={mpv7DtlInterior1}
                alt="VinFast VF MPV 7 interior"
                className="image-high-quality aspect-[4/3] w-full object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pre-booking interest — form unlocks Pre-book on Pre Book (VF 6 lead-style band) */}
      <section
        id="mpv7-prebook"
        className="scroll-mt-20 sm:scroll-mt-24 border-t border-border/60 bg-gradient-to-b from-primary/[0.07] via-muted/40 to-muted/30 py-14 sm:py-16 lg:py-20"
      >
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <div className="text-center mb-8 sm:mb-10">
            <p className="text-primary font-display font-semibold text-sm uppercase tracking-[0.2em] mb-2">VF MPV 7 · Pre-booking</p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl mb-3">Ready to take the next step?</h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              Share your details — we’ll call you back from Patna. After you submit, the <strong className="text-foreground font-medium">Pre-book VF MPV 7</strong> action unlocks on this page and in the overview above.
            </p>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card/95 p-5 sm:p-6 lg:p-8 shadow-sm">
            {!prebookUnlocked ? (
              <form onSubmit={handlePrebookInterestSubmit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:gap-3 lg:items-start">
                <div className="sm:col-span-2 lg:col-span-3">
                  <label htmlFor="mpv7-pb-name" className="sr-only">
                    Full name
                  </label>
                  <input
                    id="mpv7-pb-name"
                    type="text"
                    placeholder="Full name *"
                    value={interestForm.name}
                    onChange={(e) => setInterestForm({ ...interestForm, name: e.target.value })}
                    className={inputClass}
                    autoComplete="name"
                  />
                </div>
                <div className="sm:col-span-2 lg:col-span-3">
                  <label htmlFor="mpv7-pb-mobile" className="sr-only">
                    Mobile
                  </label>
                  <input
                    id="mpv7-pb-mobile"
                    type="tel"
                    placeholder="Mobile number *"
                    value={interestForm.mobile}
                    onChange={handleMobileChange}
                    maxLength={10}
                    inputMode="numeric"
                    className={`${inputClass} ${mobileError ? "border-red-500 focus:ring-red-500/50" : ""}`}
                    autoComplete="tel"
                  />
                  {mobileError && <p className="text-red-500 text-[11px] mt-1 px-1">{mobileError}</p>}
                </div>
                <div className="sm:col-span-1 lg:col-span-2">
                  <label htmlFor="mpv7-pb-email" className="sr-only">
                    Email
                  </label>
                  <input
                    id="mpv7-pb-email"
                    type="email"
                    placeholder="Email"
                    value={interestForm.email}
                    onChange={(e) => setInterestForm({ ...interestForm, email: e.target.value })}
                    className={inputClass}
                    autoComplete="email"
                  />
                </div>
                <BiharDistrictField
                  id="mpv7-pb-district"
                  label="District (Bihar)"
                  selectClassName={inputClass}
                  otherInputClassName={`${inputClass} border-primary/50`}
                  value={interestForm.city}
                  otherValue={interestForm.otherCity}
                  onDistrictChange={(city) => setInterestForm({ ...interestForm, city, otherCity: "" })}
                  onOtherChange={(otherCity) => setInterestForm({ ...interestForm, otherCity })}
                  fullWidthOtherRow
                  otherFieldLabel="City / state / district *"
                  selectWrapperClassName="sm:col-span-1 lg:col-span-2"
                  otherRowClassName="sm:col-span-2 lg:col-span-12"
                />
                <div className="sm:col-span-2 lg:col-span-2 flex lg:pt-0">
                  <Button type="submit" variant="hero" size="lg" className="w-full lg:w-auto lg:shrink-0">
                    Submit
                  </Button>
                </div>
                <div className="sm:col-span-2 lg:col-span-12">
                  <FormCaptcha onVerifyChange={setCaptchaVerified} resetSignal={captchaResetSignal} />
                </div>
                <p className="sm:col-span-2 lg:col-span-12 text-center lg:text-left text-muted-foreground text-xs">
                  By submitting, you agree to be contacted about VF MPV 7.
                </p>
              </form>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-center sm:text-left">
                <p className="text-sm text-muted-foreground">
                  You&apos;re set — continue on Pre Book with VF MPV 7 pre-selected.
                </p>
                <Button variant="hero" size="lg" asChild>
                  <Link to="/book-now?model=VF%20MPV%207">Pre-book VF MPV 7</Link>
                </Button>
              </div>
            )}
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
