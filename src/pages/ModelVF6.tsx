import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Check, Download, Gauge, Sparkles, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import LeadCaptureStrip from "@/components/LeadCaptureStrip";
import Footer from "@/components/Footer";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import vf6Banner from "@/assets/vf6-banner.webp";
import interiorImg from "@/assets/interior.jpg";
import vf6InfinityBlanc from "@/assets/vf6-infinity-blanc.png";
import vf6CrimsonRed from "@/assets/vf6-crimson-red.png";
import vf6JetBlack from "@/assets/vf6-jet-black.png";
import vf6DesatSilver from "@/assets/vf6-desat-silver.png";
import vf6ZenithGrey from "@/assets/vf6-zenith-grey.png";
import vf6UrbanMint from "@/assets/vf6-urban-mint.png";
import vf6GalExterior1 from "@/assets/vf6-gallery/vf6-gallery-exterior-1.jpg";
import vf6GalExterior2 from "@/assets/vf6-gallery/vf6-gallery-exterior-2.jpg";
import vf6GalSideProfile from "@/assets/vf6-gallery/vf6-gallery-side-profile.jpg";
import vf6GalFrontThreeQuarter from "@/assets/vf6-gallery/vf6-gallery-front-three-quarter.jpg";
import vf6GalGrille from "@/assets/vf6-gallery/vf6-gallery-grille.jpg";
import vf6GalParkingSensor from "@/assets/vf6-gallery/vf6-gallery-parking-sensor.jpg";
import vf6GalAlloyA from "@/assets/vf6-gallery/vf6-gallery-alloy-wheel-a.jpg";
import vf6GalFrontSeats from "@/assets/vf6-gallery/vf6-gallery-front-seats.jpg";
import vf6GalSteering from "@/assets/vf6-gallery/vf6-gallery-steering-wheel.jpg";
import vf6GalAirVents from "@/assets/vf6-gallery/vf6-gallery-air-vents.jpg";
import vf6GalInfotainment from "@/assets/vf6-gallery/vf6-gallery-infotainment.jpg";
import vf6GalPanoramicRoof from "@/assets/vf6-gallery/vf6-gallery-panoramic-roof.jpg";

const colors = [
  { name: "Infinity Blanc", hex: "#E8E8E4", image: vf6InfinityBlanc },
  { name: "Crimson Red", hex: "#C80F1E", image: vf6CrimsonRed },
  { name: "Jet Black", hex: "#18191D", image: vf6JetBlack },
  { name: "Desert Silver", hex: "#C8C9C4", image: vf6DesatSilver },
  { name: "Zenith Grey", hex: "#61656B", image: vf6ZenithGrey },
  { name: "Urban Mint", hex: "#727A67", image: vf6UrbanMint },
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
  { range: string; accel: string; power: string }
> = {
  earth: { range: "468 km", accel: "10.4 s", power: "177 PS" },
  wind: { range: "463 km", accel: "8.9 s", power: "204 PS" },
  infinity: { range: "463 km", accel: "8.9 s", power: "204 PS" },
};

/** Dense facts for the selected-variant column (synced with spec tables) */
const variantKeyFigures: Record<VariantId, { label: string; value: string }[]> = {
  earth: [
    { label: "Usable battery", value: "59.6 kWh" },
    { label: "Max. torque", value: "250 Nm" },
    { label: "DC fast charge (10–70%)", value: "25 min · up to 100 kW" },
    { label: "Boot space", value: "423 L" },
    { label: "Ground clearance", value: "190 mm (unladen)" },
    { label: "Tyres & wheels", value: "225/60 R17 · silver alloy" },
  ],
  wind: [
    { label: "Usable battery", value: "59.6 kWh" },
    { label: "Max. torque", value: "310 Nm" },
    { label: "DC fast charge (10–70%)", value: "25 min · up to 100 kW" },
    { label: "Boot space", value: "423 L" },
    { label: "Ground clearance", value: "190 mm (unladen)" },
    { label: "Tyres & wheels", value: "225/55 R18 · machine-cut alloy" },
  ],
  infinity: [
    { label: "Usable battery", value: "59.6 kWh" },
    { label: "Max. torque", value: "310 Nm" },
    { label: "DC fast charge (10–70%)", value: "25 min · up to 100 kW" },
    { label: "Boot space", value: "423 L" },
    { label: "Ground clearance", value: "190 mm (unladen)" },
    { label: "Tyres & wheels", value: "225/55 R18 · machine-cut alloy" },
  ],
};

const variantSpotlightChips: Record<VariantId, string[]> = {
  earth: [
    "17\" silver alloys",
    "Fabric seats",
    "Longest MIDC range in the lineup",
    "Single-zone auto climate · 6 speakers",
    "Chassis safety suite + TPMS",
  ],
  wind: [
    "18\" machine-cut alloys",
    "Vegan leather · ventilated front seats",
    "Panoramic roof · dual-zone HVAC · PM1.0 filter",
    "7 airbags · 360° camera · rear sensors",
    "Core ADAS · adaptive cruise",
    "Smart app · OTA · wireless AA / CarPlay",
  ],
  infinity: [
    "Everything included on Wind",
    "AEB · forward collision warning",
    "Rear cross-traffic alert",
    "Auto high beam · driver monitoring",
    "Door-open warning",
  ],
};

/** Rows: [parameter, Earth, Wind, Wind Infinity] */
const technicalSpecRows: [string, string, string, string][] = [
  ["Max. power", "130 kW (177 PS)", "150 kW (204 PS)", "150 kW (204 PS)"],
  ["Max. torque", "250 Nm", "310 Nm", "310 Nm"],
  ["Driveline", "FWD", "FWD", "FWD"],
  ["Range (MIDC)", "468 km", "463 km", "463 km"],
  ["Acceleration (0–100 km/h)", "10.4 s", "8.9 s", "8.9 s"],
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
  "Colours: Infinity Blanc, Crimson Red, Jet Black, Desert Silver, Zenith Grey, Urban Mint",
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
    src: vf6GalSideProfile,
    title: "Sleek side profile",
    description: "Aerodynamic roofline and defined wheel arches — Wind and Wind Infinity wear 18\" machine-cut alloys; Earth uses refined 17\" silver alloys.",
    alt: "VF 6 left side profile",
  },
  {
    src: vf6GalFrontThreeQuarter,
    title: "Front fascia & lighting",
    description: "LED projector headlamps, signature V-shaped DRL, and a confident grille graphic — visibility and identity in one glance.",
    alt: "VF 6 front left three-quarter detail",
  },
  {
    src: vf6GalGrille,
    title: "Signature V identity",
    description: "The VinFast V centres the front graphic — paired with follow-me-home and auto headlamp behaviour on every trim.",
    alt: "VF 6 front grille and V logo detail",
  },
  {
    src: vf6GalParkingSensor,
    title: "Front parking sensors",
    description:
      "Wind and Wind Infinity add a full convenience and safety layer — front sensors work with the 360° camera for tight urban parking. Sensors sit neatly in the bumper for clean styling while you get audible and visual guidance.",
    alt: "VF 6 with front parking sensors and sensor zone illustration",
  },
  {
    src: vf6GalAlloyA,
    title: "Alloys & tyres",
    description:
      "Machine-cut 18\" alloys on Wind and Wind Infinity (225/55 R18); Earth uses silver 17\" wheels (225/60 R17) for efficiency and comfort. Packages are tuned to the VF 6 FWD chassis for confident grip in monsoon runs and on highways.",
    alt: "VF 6 alloy wheel and tyre detail",
  },
  {
    src: vf6GalFrontSeats,
    title: "Front row comfort",
    description: "Wind and Wind Infinity upgrade to vegan leather with powered adjustment — ventilated front seats on Wind/Infinity for Bihar summers.",
    alt: "VF 6 front seats from passenger side",
  },
  {
    src: vf6GalSteering,
    title: "D-cut steering wheel",
    description: "Multi-function controls and vegan leather wrap — tilt and telescopic adjustment so drivers of every height find a natural position.",
    alt: "VF 6 steering wheel and controls",
  },
  {
    src: vf6GalAirVents,
    title: "Dual-zone climate",
    description: "Wind and Wind Infinity get automatic dual-zone HVAC with PM1.0 cabin filter and air ionizer — Earth retains capable single-zone automatic comfort.",
    alt: "VF 6 dashboard air vents",
  },
  {
    src: vf6GalInfotainment,
    title: "32.76 cm touchscreen",
    description: "Central hub for navigation, media, and on Wind/Infinity — wireless Android Auto & Apple CarPlay, smart modes, OTA updates and remote app features.",
    alt: "VF 6 infotainment main menu on touchscreen",
  },
  {
    src: vf6GalPanoramicRoof,
    title: "Panoramic glass roof",
    description: "Standard on Wind and Wind Infinity — floods the cabin with natural light and opens the rear bench for family trips out of Patna.",
    alt: "VF 6 panoramic glass roof from inside cabin",
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
  const [selectedColor, setSelectedColor] = useState(0);
  const [variant, setVariant] = useState<VariantId>("wind");

  const stats = variantHeroStats[variant];
  const vMeta = vf6Variants.find((v) => v.id === variant)!;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero — top inset clears fixed navbar (h-16 lg:h-20); flex spacer keeps copy bottom-aligned without clipping under nav */}
      <section className="relative flex min-h-[85vh] flex-col">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={vf6Banner}
            alt="VinFast VF 6"
            className="image-high-quality h-full w-full object-cover object-[20%_50%] scale-[1.32] origin-[24%_48%] motion-reduce:scale-100 motion-reduce:object-center max-md:scale-[1.2] max-md:object-[18%_52%]"
            sizes="100vw"
            fetchPriority="high"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
        </div>
        <div className="relative z-10 flex min-h-0 flex-1 flex-col pt-20 lg:pt-28">
          <div className="min-h-0 flex-1" aria-hidden />
          <div className="container mx-auto w-full shrink-0 px-4 pb-16 lg:px-8 lg:pb-24">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="text-white/90 font-display font-semibold text-sm uppercase tracking-[0.25em] mb-3">Compact Electric SUV</p>
            <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl lg:text-8xl mb-2 text-white leading-[1.05]">
              VF 6
            </h1>

            <div className="flex flex-wrap items-center gap-6 mb-6">
              {[
                { val: "₹17.29L*", label: "Indicative ex-showroom*" },
                { val: stats.range, label: "Range (MIDC)" },
                { val: stats.accel, label: "0–100 km/h" },
                { val: stats.power, label: "Max. power" },
              ].map((s, i) => (
                <div key={s.label} className="flex items-center gap-6">
                  {i > 0 && <div className="w-px h-10 bg-white/25 hidden sm:block" />}
                  <div className="text-center sm:text-left">
                    <p className="font-display font-bold text-2xl text-white">{s.val}</p>
                    <p className="text-xs text-white/70">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-white/85 text-base sm:text-lg max-w-xl mb-8 leading-relaxed">{vMeta.description}</p>

            <div className="flex flex-wrap items-center gap-x-2 gap-y-2 mb-4 w-full max-w-2xl">
              {vf6Variants.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setVariant(v.id)}
                  className={`rounded-full px-2.5 py-1 text-[11px] sm:text-xs font-semibold transition-all border text-center leading-tight whitespace-nowrap shrink-0 ${
                    variant === v.id
                      ? "bg-white text-gray-900 border-white shadow-md"
                      : "bg-white/10 text-white border-white/40 hover:bg-white/20"
                  }`}
                >
                  {v.shortLabel}
                </button>
              ))}
            </div>

            <p className="text-white/50 text-xs max-w-xl mb-6">*Contact Patliputra VinFast Patna for variant-wise on-road price and offers.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-3xl">
              <Link to="/test-drive" className="w-full">
                <Button variant="hero" size="lg" className="w-full">
                  Book Test Drive
                </Button>
              </Link>
              <Link to="/book-now" className="w-full">
                <Button variant="heroWhite" size="lg" className="w-full">
                  Book Now
                </Button>
              </Link>
              <Link to="/contact" className="w-full">
                <Button variant="heroOutline" size="lg" className="w-full">
                  Get On-Road Price
                </Button>
              </Link>
              <Link to="/emi-calculator" className="w-full">
                <Button variant="outline" size="lg" className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20">
                  EMI Calculator
                </Button>
              </Link>
            </div>
          </motion.div>
          </div>
        </div>
      </section>

      {/* Selected variant first; exterior colour picker below (syncs with Color Studio) */}
      <section className="py-10 sm:py-14 lg:py-20 border-b border-border/60 bg-muted/25">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid items-start gap-10 lg:gap-14 lg:grid-cols-12">
            <div className="lg:col-span-5 xl:col-span-5 space-y-6">
              <div>
                <p className="text-primary font-display font-semibold text-sm uppercase tracking-[0.2em] mb-2">Selected variant</p>
                <h2 className="font-display font-bold text-2xl md:text-3xl lg:text-4xl mb-3">{vMeta.name}</h2>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed">{vMeta.description}</p>
              </div>

              <div className="rounded-2xl border border-border/70 bg-background/90 p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-foreground/80 mb-3">Key figures</p>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                  {variantKeyFigures[variant].map((row) => (
                    <div key={row.label} className="border-b border-border/40 sm:border-0 pb-3 sm:pb-0 last:border-0 last:pb-0">
                      <dt className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{row.label}</dt>
                      <dd className="text-sm font-medium text-foreground mt-0.5 leading-snug">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="rounded-2xl border border-border/70 bg-background/80 p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-foreground/80 mb-2">ADAS</p>
                <div className="text-sm text-muted-foreground leading-relaxed">
                  {variant === "earth" && <span>No ADAS on VF 6 Earth.</span>}
                  {variant === "wind" && (
                    <ul className="list-disc pl-5 space-y-1.5">
                      {adasWindBullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  )}
                  {variant === "infinity" && (
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-semibold text-foreground/80 mb-1">Same as Wind</p>
                        <ul className="list-disc pl-5 space-y-1">
                          {adasWindBullets.map((b) => (
                            <li key={b}>{b}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-foreground/80 mb-1">Additional on Infinity</p>
                        <ul className="list-disc pl-5 space-y-1">
                          {adasInfinityExtraBullets.map((b) => (
                            <li key={b}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-border/70 bg-muted/30 p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-foreground/80 mb-2">Safety</p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">{safetyChassisAll}</p>
                {variant === "earth" ? (
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Expanded pack (7 airbags, 360° camera, rain-sensing wipers, and more) is reserved for Wind and Wind Infinity.
                  </p>
                ) : (
                  <>
                    <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1.5">
                      {safetyWindInfinityBullets.slice(0, 5).map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                    <p className="text-xs text-muted-foreground mt-3">Full safety list is in the specifications section below.</p>
                  </>
                )}
              </div>
            </div>

            <div className="lg:col-span-7 xl:col-span-7 space-y-8">
              <div className="rounded-2xl border border-border/60 bg-[#ECECEA] dark:bg-muted/40 overflow-hidden shadow-sm">
                <div className="relative aspect-[16/10] sm:aspect-[2/1] lg:min-h-[280px]">
                  <img
                    src={colors[selectedColor].image}
                    alt={`VF 6 ${vMeta.shortLabel} in ${colors[selectedColor].name}`}
                    className="image-high-quality absolute inset-0 h-full w-full object-contain object-center p-6 sm:p-8"
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <p className="text-center text-xs text-muted-foreground px-4 py-3 border-t border-border/40 bg-background/60">
                  {colors[selectedColor].name} · {vMeta.name}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                <div className="rounded-xl border border-border/70 bg-card/80 p-3 sm:p-4 shadow-sm col-span-2 sm:col-span-1">
                  <p className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 leading-tight">
                    Indicative ex-showroom
                  </p>
                  <p className="font-display font-bold text-base sm:text-lg md:text-xl tabular-nums">₹17.29L*</p>
                </div>
                <div className="rounded-xl border border-border/70 bg-card/80 p-3 sm:p-4 shadow-sm">
                  <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                    <Gauge className="w-3.5 h-3.5 shrink-0" aria-hidden />
                    <p className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider leading-tight">Range (MIDC)</p>
                  </div>
                  <p className="font-display font-bold text-base sm:text-lg md:text-xl tabular-nums">{stats.range}</p>
                </div>
                <div className="rounded-xl border border-border/70 bg-card/80 p-3 sm:p-4 shadow-sm">
                  <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                    <Timer className="w-3.5 h-3.5 shrink-0" aria-hidden />
                    <p className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider leading-tight">0–100 km/h</p>
                  </div>
                  <p className="font-display font-bold text-base sm:text-lg md:text-xl tabular-nums">{stats.accel}</p>
                </div>
                <div className="rounded-xl border border-border/70 bg-card/80 p-3 sm:p-4 shadow-sm">
                  <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                    <Sparkles className="w-3.5 h-3.5 shrink-0" aria-hidden />
                    <p className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider leading-tight">Max. power</p>
                  </div>
                  <p className="font-display font-bold text-base sm:text-lg md:text-xl tabular-nums">{stats.power}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">At a glance</p>
                <div className="flex flex-wrap gap-2">
                  {variantSpotlightChips[variant].map((chip) => (
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
                  <Link to="/test-drive">Book test drive</Link>
                </Button>
                <Button asChild variant="outline" size="default">
                  <Link to="/book-now">Book now</Link>
                </Button>
                <Button asChild variant="ghost" size="default" className="text-muted-foreground">
                  <Link to="/contact">On-road price</Link>
                </Button>
              </div>

              <div
                className="rounded-xl border border-border/60 bg-muted/30 p-4 sm:p-5 mt-4"
                role="group"
                aria-label="Choose trim for on-road price and offers"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                  Trim for on-road price &amp; offers
                </p>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-2 w-full max-w-2xl">
                  {vf6Variants.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setVariant(v.id)}
                      className={`rounded-full px-2.5 py-1 text-[11px] sm:text-xs font-semibold transition-all border text-center leading-tight whitespace-nowrap shrink-0 ${
                        variant === v.id
                          ? "bg-foreground text-background border-foreground shadow-sm"
                          : "bg-background/90 text-foreground border-border/80 hover:bg-muted"
                      }`}
                    >
                      {v.shortLabel}
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-xs text-muted-foreground mt-3">
                *Contact Patliputra VinFast Patna for variant-wise pricing and offers.
              </p>
            </div>
          </div>

          <div className="mt-10 lg:mt-12 rounded-2xl border border-border/60 bg-card/90 shadow-sm p-5 sm:p-6 lg:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
              <div className="min-w-0">
                <p className="text-primary font-display font-semibold text-xs uppercase tracking-[0.2em] mb-2">Exterior colour</p>
                <p className="font-display font-bold text-xl sm:text-2xl text-foreground">{colors[selectedColor].name}</p>
                <p className="text-muted-foreground text-sm mt-2 max-w-xl leading-relaxed">
                  Choose a paint for your VF 6 preview. The same selection stays in sync with <span className="text-foreground/80 font-medium">Color Studio</span> further down the page.
                </p>
              </div>
              <div className="flex flex-shrink-0 flex-wrap items-center gap-2.5 sm:gap-3">
                {colors.map((c, i) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setSelectedColor(i)}
                    className={`relative flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border-2 transition-all ${
                      i === selectedColor
                        ? "border-primary scale-105 ring-2 ring-primary/30 shadow-md"
                        : "border-foreground/20 hover:border-foreground/40 hover:scale-[1.02]"
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                    aria-label={`Select colour ${c.name}`}
                    aria-pressed={i === selectedColor}
                  >
                    {i === selectedColor && (
                      <Check className="h-4 w-4 text-white drop-shadow-md mix-blend-difference" strokeWidth={3} aria-hidden />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Showroom photo gallery — Patliputra VF 6 library */}
      <section className="py-12 sm:py-16 lg:py-24 bg-background border-y border-border/50">
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

          <p className="text-muted-foreground text-xs mt-12 max-w-4xl leading-relaxed">
            Images are representative of VF 6 equipment and trim; exact features depend on Earth, Wind, or Wind Infinity specification. Contact Patliputra VinFast Patna to confirm variant availability.
          </p>
        </div>
      </section>

      {/* Color Studio */}
      <section className="py-14 sm:py-20 section-surface">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <p className="text-primary font-display font-semibold text-sm uppercase tracking-[0.2em] mb-3">Color Studio</p>
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-8">Choose Your Shade</h2>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto mb-8">
            Infinity Blanc, Crimson Red, Jet Black, Desert Silver, Zenith Grey, Urban Mint.
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
      <section className="py-16 sm:py-24 section-dark">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <p className="text-primary font-display font-semibold text-sm uppercase tracking-[0.2em] mb-3">Specifications</p>
            <h2 className="font-display font-bold text-3xl md:text-5xl mb-4">VF 6 Earth, Wind & Wind Infinity</h2>
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
            <a href="/brochures/VF6-Brochure.pdf" download="VinFast-VF6-Brochure.pdf" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg">
                <Download className="w-4 h-4 mr-2" /> Download Brochure
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-16 sm:py-24 section-surface">
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
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="/brochures/VF6-Brochure.pdf" download="VinFast-VF6-Brochure.pdf" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="lg">
                    <Download className="w-4 h-4 mr-2" /> Download Brochure
                  </Button>
                </a>
              </div>
            </div>
            <div className="rounded-3xl overflow-hidden shadow-luxury border border-border/40">
              <img
                src={interiorImg}
                alt="VinFast VF 6 interior"
                className="image-high-quality aspect-[4/3] w-full object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </section>

      <LeadCaptureStrip />
      <Footer />
      <StickyMobileCTA />
    </div>
  );
};

export default ModelVF6;
