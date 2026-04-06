
import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, Download, Gauge, Sparkles, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import LeadCaptureStrip from "@/components/LeadCaptureStrip";
import Footer from "@/components/Footer";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import vf7Street from "@/assets/vf7-street.jpg";
import vf7InfinityBlanc from "@/assets/vf7-infinity-blanc.png";
import vf7CrimsonRed from "@/assets/vf7-crimson-red.png";
import vf7DesatSilver from "@/assets/vf7-desat-silver.png";
import vf7ZenithGrey from "@/assets/vf7-zenith-grey.png";
import vf7UrbanMint from "@/assets/vf7-urban-mint.png";
import vf7JetBlack from "@/assets/vf7-jet-black.png";
import vf7GalExteriorA from "@/assets/vf7-gallery/vf7-gallery-exterior-a.jpg";
import vf7GalExteriorB from "@/assets/vf7-gallery/vf7-gallery-exterior-b.jpg";
import vf7GalFrontThreeQuarter from "@/assets/vf7-gallery/vf7-gallery-front-three-quarter.jpg";
import vf7GalFrontView from "@/assets/vf7-gallery/vf7-gallery-front-view.jpg";
import vf7GalGrille from "@/assets/vf7-gallery/vf7-gallery-grille.jpg";
import vf7GalHeadlight from "@/assets/vf7-gallery/vf7-gallery-headlight.jpg";
import vf7GalWheel from "@/assets/vf7-gallery/vf7-gallery-wheel.jpg";
import vf7GalSideStep from "@/assets/vf7-gallery/vf7-gallery-side-step.jpg";
import vf7GalSideMirror from "@/assets/vf7-gallery/vf7-gallery-side-mirror.jpg";
import vf7GalIntEnh01 from "@/assets/vf7-gallery/vf7-gallery-interior-enhanced-01.jpg";
import vf7GalIntEnh02 from "@/assets/vf7-gallery/vf7-gallery-interior-enhanced-02.jpg";
import vf7GalIntEnh03 from "@/assets/vf7-gallery/vf7-gallery-interior-enhanced-03.jpg";
import vf7GalIntEnh04 from "@/assets/vf7-gallery/vf7-gallery-interior-enhanced-04.jpg";
import vf7GalIntEnh05 from "@/assets/vf7-gallery/vf7-gallery-interior-enhanced-05.jpg";
import vf7GalIntEnh06 from "@/assets/vf7-gallery/vf7-gallery-interior-enhanced-06.jpg";
import vf7GalIntEnh07 from "@/assets/vf7-gallery/vf7-gallery-interior-enhanced-07.jpg";
import vf7GalIntEnh08 from "@/assets/vf7-gallery/vf7-gallery-interior-enhanced-08.jpg";
import { usePublicSite } from "@/context/PublicSiteContext";

const colors = [
  { name: "Infinity Blanc", hex: "#E6E6E2", image: vf7InfinityBlanc },
  { name: "Crimson Red", hex: "#C80F1E", image: vf7CrimsonRed },
  { name: "Jet Black", hex: "#18191D", image: vf7JetBlack },
  { name: "Desert Silver", hex: "#D8D9D4", image: vf7DesatSilver },
  { name: "Zenith Grey", hex: "#61656B", image: vf7ZenithGrey },
  { name: "Urban Mint", hex: "#727A67", image: vf7UrbanMint },
];

type VariantId = "earth" | "wind" | "windInfinity" | "sky" | "skyInfinity";

const vf7Variants: {
  id: VariantId;
  name: string;
  shortLabel: string;
  description: string;
}[] = [
  {
    id: "earth",
    name: "VF 7 Earth",
    shortLabel: "Earth",
    description:
      "177 PS FWD, 59.6 kWh, up to 438 km MIDC — silver alloys, limited ADAS, 6 speakers, no panoramic roof or wireless charger.",
  },
  {
    id: "wind",
    name: "VF 7 Wind",
    shortLabel: "Wind",
    description:
      "204 PS FWD, 59.6 kWh, up to 532 km MIDC — black alloys, full ADAS + ACC, 8 speakers, smart suite, flush handles; no panoramic roof.",
  },
  {
    id: "windInfinity",
    name: "VF 7 Wind Infinity",
    shortLabel: "Wind Infinity",
    description:
      "204 PS FWD with 510 km MIDC — adds panoramic glass roof and Wind+ equipment: powered tailgate, roof rails, wireless charger & more.",
  },
  {
    id: "sky",
    name: "VF 7 Sky",
    shortLabel: "Sky",
    description:
      "353 PS dual-motor AWD, 70 kWh, 510 km MIDC, 5.8 s to 100 km/h — performance flagship with 110 kW DC charging & black alloys.",
  },
  {
    id: "skyInfinity",
    name: "VF 7 Sky Infinity",
    shortLabel: "Sky Infinity",
    description:
      "Same AWD performance as Sky — top trim with Wind Infinity-style comfort and glass roof; full ADAS and connected feature set.",
  },
];

const variantHeroStats: Record<
  VariantId,
  { range: string; accel: string; power: string; driveline: string }
> = {
  earth: { range: "438 km", accel: "9.1 s", power: "177 PS", driveline: "FWD" },
  wind: { range: "532 km", accel: "8.5 s", power: "204 PS", driveline: "FWD" },
  windInfinity: { range: "510 km", accel: "8.5 s", power: "204 PS", driveline: "FWD" },
  sky: { range: "510 km", accel: "5.8 s", power: "353 PS", driveline: "AWD" },
  skyInfinity: { range: "510 km", accel: "5.8 s", power: "353 PS", driveline: "AWD" },
};

const variantExShowroomPrice: Record<VariantId, string> = {
  earth: "₹21,89,000*",
  wind: "₹24,69,000*",
  windInfinity: "₹25,19,000*",
  sky: "₹26,19,000*",
  skyInfinity: "₹26,79,000*",
};

const variantKeyFigures: Record<VariantId, { label: string; value: string }[]> = {
  earth: [
    { label: "Driveline", value: "FWD" },
    { label: "Usable battery", value: "59.6 kWh" },
    { label: "Max. torque", value: "250 Nm" },
    { label: "DC fast charge (10–70%)", value: "24 min · up to 100 kW" },
    { label: "Boot space", value: "537 L" },
    { label: "Tyres & wheels", value: "245/50 R19 · silver alloy" },
  ],
  wind: [
    { label: "Driveline", value: "FWD" },
    { label: "Usable battery", value: "59.6 kWh" },
    { label: "Max. torque", value: "310 Nm" },
    { label: "DC fast charge (10–70%)", value: "24 min · up to 100 kW" },
    { label: "Boot space", value: "537 L" },
    { label: "Tyres & wheels", value: "245/50 R19 · black alloy" },
  ],
  windInfinity: [
    { label: "Driveline", value: "FWD" },
    { label: "Usable battery", value: "59.6 kWh" },
    { label: "Max. torque", value: "310 Nm" },
    { label: "DC fast charge (10–70%)", value: "24 min · up to 100 kW" },
    { label: "Boot space", value: "537 L" },
    { label: "Tyres & wheels", value: "245/50 R19 · black alloy" },
  ],
  sky: [
    { label: "Driveline", value: "AWD (dual motor)" },
    { label: "Usable battery", value: "70 kWh" },
    { label: "Max. torque", value: "500 Nm" },
    { label: "DC fast charge (10–70%)", value: "28 min · up to 110 kW" },
    { label: "Boot space", value: "537 L" },
    { label: "Tyres & wheels", value: "245/50 R19 · black alloy" },
  ],
  skyInfinity: [
    { label: "Driveline", value: "AWD (dual motor)" },
    { label: "Usable battery", value: "70 kWh" },
    { label: "Max. torque", value: "500 Nm" },
    { label: "DC fast charge (10–70%)", value: "28 min · up to 110 kW" },
    { label: "Boot space", value: "537 L" },
    { label: "Tyres & wheels", value: "245/50 R19 · black alloy" },
  ],
};

const variantSpotlightChips: Record<VariantId, string[]> = {
  earth: [
    "Silver 19\" alloys",
    "Electric tailgate release",
    "6-way powered driver seat",
    "Dual-zone HVAC · PM1.0 · ionizer",
    "HUD · rear vents · 60:40 rear split",
    "6 speakers · 32.76 cm touchscreen",
  ],
  wind: [
    "Black 19\" alloys · flush handles",
    "Powered tailgate · roof rails",
    "8-way powered driver seat",
    "Wireless charger · 8 speakers",
    "Full ADAS + adaptive cruise",
    "Smart modes · OTA · wireless AA/CP",
  ],
  windInfinity: [
    "Panoramic glass roof",
    "All Wind features included",
    "Wind Infinity comfort & convenience",
    "8 speakers · full connected suite",
  ],
  sky: [
    "353 PS AWD performance",
    "70 kWh battery · 110 kW DC",
    "Black alloys · flush handles",
    "Full ADAS + ACC",
    "8 speakers · smart connectivity",
  ],
  skyInfinity: [
    "Sky AWD performance",
    "Sky Infinity flagship trim",
    "Panoramic roof · top equipment",
    "Full ADAS & connected suite",
  ],
};

/** [parameter, Earth, Wind, Wind Inf, Sky, Sky Inf] */
const technicalSpecRows: [string, string, string, string, string, string][] = [
  ["Max. power", "130 kW (177 PS)", "150 kW (204 PS)", "150 kW (204 PS)", "260 kW (353 PS)", "260 kW (353 PS)"],
  ["Max. torque", "250 Nm", "310 Nm", "310 Nm", "500 Nm", "500 Nm"],
  ["Driveline", "FWD", "FWD", "FWD", "AWD", "AWD"],
  ["Range (MIDC)", "438 km", "532 km", "510 km", "510 km", "510 km"],
  ["Acceleration (0–100 km/h)", "9.1 s", "8.5 s", "8.5 s", "5.8 s", "5.8 s"],
  ["Usable battery capacity", "59.6 kWh", "59.6 kWh", "59.6 kWh", "70 kWh", "70 kWh"],
  ["Charge port", "CCS2", "CCS2", "CCS2", "CCS2", "CCS2"],
  ["AC charging", "Up to 7.2 kW", "Up to 7.2 kW", "Up to 7.2 kW", "Up to 7.2 kW", "Up to 7.2 kW"],
  ["DC charging (max.)", "100 kW", "100 kW", "100 kW", "110 kW", "110 kW"],
  ["Fast charging (10–70%)", "24 min", "24 min", "24 min", "28 min", "28 min"],
  ["Portable charger", "3.3 kW (16 A)", "3.3 kW (16 A)", "3.3 kW (16 A)", "3.3 kW (16 A)", "3.3 kW (16 A)"],
  ["Length × width × height", "4550 × 1893 × 1594 mm", "4550 × 1893 × 1594 mm", "4550 × 1893 × 1594 mm", "4550 × 1893 × 1594 mm", "4550 × 1893 × 1594 mm"],
  ["Wheelbase", "2840 mm", "2840 mm", "2840 mm", "2840 mm", "2840 mm"],
  ["Ground clearance (unladen)", "190 mm", "190 mm", "190 mm", "190 mm", "190 mm"],
  ["Boot space", "537 L", "537 L", "537 L", "537 L", "537 L"],
  ["Curb weight", "2085 kg", "2127 kg", "2127 kg", "2218 kg", "2218 kg"],
  ["Tyre size", "245/50 R19 (D = 487.4 mm)", "245/50 R19 (D = 487.4 mm)", "245/50 R19 (D = 487.4 mm)", "245/50 R19 (D = 487.4 mm)", "245/50 R19 (D = 487.4 mm)"],
  ["Front / rear brakes", "Disc / Disc", "Disc / Disc", "Disc / Disc", "Disc / Disc", "Disc / Disc"],
  ["Electronic parking brake", "Yes", "Yes", "Yes", "Yes", "Yes"],
  ["Auto Hold", "Yes", "Yes", "Yes", "Yes", "Yes"],
  ["Front suspension", "MacPherson independent", "MacPherson independent", "MacPherson independent", "MacPherson independent", "MacPherson independent"],
  ["Rear suspension", "Control blade independent", "Control blade independent", "Control blade independent", "Control blade independent", "Control blade independent"],
  ["Regeneration brake modes", "Off / Low / Medium / High", "Off / Low / Medium / High", "Off / Low / Medium / High", "Off / Low / Medium / High", "Off / Low / Medium / High"],
  ["Driving modes", "Eco / Normal / Sport", "Eco / Normal / Sport", "Eco / Normal / Sport", "Eco / Normal / Sport", "Eco / Normal / Sport"],
];

const exteriorDiffRows: [string, string, string, string, string, string][] = [
  ["Wheels", "Silver finish alloy", "Black alloy", "Black alloy", "Black alloy", "Black alloy"],
  ["Tailgate", "Electric release", "Powered", "Powered", "Powered", "Powered"],
  ["Roof rail", "No", "Yes", "Yes", "Yes", "Yes"],
  ["Flush door handles", "No", "Yes", "Yes", "Yes", "Yes"],
];

const interiorDiffRows: [string, string, string, string, string, string][] = [
  ["Driver seat power adjustment", "6-way", "8-way", "8-way", "8-way", "8-way"],
  ["Wireless charger", "No", "Yes", "Yes", "Yes", "Yes"],
  ["Panoramic glass roof", "No", "No", "Yes", "Yes", "Yes"],
  ["Audio", "6 speakers", "8 speakers", "8 speakers", "8 speakers", "8 speakers"],
];

const exteriorCommonBullets = [
  "LED projector headlamps · auto headlamp · auto levelling · follow-me-home",
  "DRL & signature V lights (front & rear) · LED tail lamps",
  "ORVM: power adjust & fold · heated · memory · reverse link · auto dimming",
  "LED side turn indicators · shark-fin antenna · keyless entry",
];

const interiorCommonBullets = [
  "D-cut multi-function steering · vegan leather wrap · tilt & telescopic",
  "Automatic dual-zone HVAC · PM1.0 cabin filter · air ionizer · rear AC vents",
  "Head-up display (HUD) · rear centre armrest with cupholders · 60:40 rear seat split",
  "USB — Front: 2× Type A; Rear: 2× Type A & 1× Type C (90 W)",
  "Power windows one-touch up/down · anti-pinch · auto-dimming IRVM · glove box & luggage lights",
];

const safetyAllBullets = [
  "ABS, EBD, BA, ESC, TCS · hill start assist · TPMS",
  "7 airbags — driver, co-driver, front side, curtain, driver knee",
  "Rain-sensing wipers · roll-over mitigation · emergency signal system",
  "Rear parking sensors · 360° camera · rear seat ISOFIX",
  "Theft alarm & immobilizer · speed-sensing door lock · seatbelt reminder (all seats)",
];

const adasEarthNote =
  "VF 7 Earth: basic / limited ADAS. Cruise control is conventional (non-adaptive). Contact Patliputra VinFast Patna for the exact Earth ADAS pack.";

const adasWindPlusBullets = [
  "Blind spot detection",
  "Lane centering control",
  "Auto lane change assist",
  "Lane departure warning",
  "Lane keeping assist",
  "Emergency lane keeping",
  "Automatic emergency braking (front & rear)",
  "Forward collision warning",
  "Rear cross traffic alert",
  "Auto high beam",
  "Driver monitoring system (DMS camera)",
  "Adaptive cruise control (ACC)",
  "Door open warning",
];

const connectivityRows: [string, string, string, string, string, string][] = [
  [
    "Touchscreen",
    "32.76 cm",
    "32.76 cm",
    "32.76 cm",
    "32.76 cm",
    "32.76 cm",
  ],
  [
    "Smart & connected features",
    "32.76 cm display & 6-speaker audio. Full smart suite (camp, pet, wash, valet modes; wireless Android Auto & Apple CarPlay; games; diagnostics; firmware OTA; remote doors/window/HVAC; tracking; notifications; app OTA) from Wind upward — confirm with dealer for Earth.",
    "Camp, pet, wash & valet · wireless Android Auto & Apple CarPlay · games · on-board diagnostics · firmware OTA · remote control · vehicle tracking · smartphone notifications · OTA via app",
    "Same smart suite as Wind",
    "Same smart suite as Wind",
    "Same smart suite as Wind",
  ],
];

const featureHighlights = [
  "Five trims: Earth & Wind (FWD 59.6 kWh), Wind Infinity (FWD + panoramic roof), Sky & Sky Infinity (AWD 70 kWh, 353 PS)",
  "Earth: 438 km MIDC; Wind peaks at 532 km; Wind Infinity & Sky line at 510 km MIDC",
  "Sky & Sky Infinity: dual-motor AWD, 500 Nm, 5.8 s 0–100 km/h, 110 kW DC & 28 min 10–70% charge",
  "All variants: 7 airbags, 360° camera, LED lighting signature, dual-zone climate, HUD, 537 L boot",
  "Colours: Infinity Blanc, Crimson Red, Jet Black, Desert Silver, Zenith Grey, Urban Mint",
];

const vf7GalleryFeature: { src: string; title: string; description: string; alt: string }[] = [
  {
    src: vf7GalExteriorA,
    title: "Presence in motion",
    description:
      "4550 mm length and a 2840 mm wheelbase give the VF 7 a commanding SUV stance on Patna streets and highway cruises alike.",
    alt: "VinFast VF 7 exterior lifestyle shot",
  },
  {
    src: vf7GalExteriorB,
    title: "Sculpted surfacing",
    description:
      "Clean shoulder lines, black or silver 19\" alloys, and signature V lighting front and rear keep the design unmistakably VinFast.",
    alt: "VinFast VF 7 exterior detail",
  },
];

const vf7GalleryDetails: { src: string; title: string; description: string; alt: string }[] = [
  {
    src: vf7GalFrontThreeQuarter,
    title: "Front three-quarter",
    description: "LED projector headlamps with auto levelling and follow-me-home — paired with the brand’s V-shaped light signature.",
    alt: "VF 7 front three-quarter view",
  },
  {
    src: vf7GalFrontView,
    title: "Front view",
    description: "Confident grille graphic and full-width lighting cues; heated, memory ORVMs with reverse link on every trim.",
    alt: "VF 7 front view",
  },
  {
    src: vf7GalGrille,
    title: "V identity",
    description: "The central V motif anchors the fascia — keyless entry and smart welcome behaviour complement the look.",
    alt: "VF 7 grille detail",
  },
  {
    src: vf7GalHeadlight,
    title: "LED projector detail",
    description: "Crisp projector performance for night driving; DRL integration keeps the VF 7 visible in urban traffic.",
    alt: "VF 7 headlamp close-up",
  },
  {
    src: vf7GalWheel,
    title: "19\" alloys & rubber",
    description: "245/50 R19 on every variant — silver finish on Earth, black alloy from Wind through Sky Infinity.",
    alt: "VF 7 wheel and tyre",
  },
  {
    src: vf7GalSideStep,
    title: "Side profile",
    description: "Roof rails from Wind up (Earth without) — easier roof loading for family trips across Bihar.",
    alt: "VF 7 side step and sill",
  },
  {
    src: vf7GalSideMirror,
    title: "ORVM detail",
    description: "Power fold, heat, memory, auto dim and LED side indicators — standard across the VF 7 range.",
    alt: "VF 7 side mirror",
  },
  {
    src: vf7GalIntEnh01,
    title: "Cabin climate & air quality",
    description: "Automatic dual-zone HVAC with PM1.0 filtration and ionizer — fresh air for every row on Patna commutes and highway runs.",
    alt: "VinFast VF 7 interior — climate and cabin air",
  },
  {
    src: vf7GalIntEnh02,
    title: "Steering & driver controls",
    description: "D-cut steering with vegan leather wrap, multi-function spokes and tilt/telescopic reach — keep eyes forward with HUD in view.",
    alt: "VinFast VF 7 interior — steering wheel and controls",
  },
  {
    src: vf7GalIntEnh03,
    title: "Driver-focused cockpit",
    description: "Clear sightlines, digital instrumentation and a minimalist IP — technology that stays intuitive at city speeds and on the open road.",
    alt: "VinFast VF 7 interior — driver cockpit",
  },
  {
    src: vf7GalIntEnh04,
    title: "Center console & storage",
    description: "Thoughtful stowage, piano-key drive logic and satin accents — daily usability with a premium feel across Earth through Sky Infinity.",
    alt: "VinFast VF 7 interior — center console",
  },
  {
    src: vf7GalIntEnh05,
    title: "Front-row comfort",
    description: "Powered adjustment (trim-dependent), supportive cushioning and refined materials — Wind upward adds ventilated front seats for Bihar summers.",
    alt: "VinFast VF 7 interior — front seats",
  },
  {
    src: vf7GalIntEnh06,
    title: "Rear passenger space",
    description: "2840 mm wheelbase pays off in legroom; rear vents and amenities keep family trips out of Patna comfortable.",
    alt: "VinFast VF 7 interior — rear seating",
  },
  {
    src: vf7GalIntEnh07,
    title: "Craft & detailing",
    description: "Contrast stitching, soft-touch surfaces and ambient touches that read upscale without shouting — showroom photography from Patliputra VinFast.",
    alt: "VinFast VF 7 interior — trim and detail",
  },
  {
    src: vf7GalIntEnh08,
    title: "32.76 cm touchscreen hub",
    description: "Navigation, media and connected services; Wind upward adds wireless Android Auto & Apple CarPlay, smart modes and OTA updates.",
    alt: "VinFast VF 7 interior — infotainment display",
  },
];

function SpecTable7({ title, rows }: { title: string; rows: [string, string, string, string, string, string][] }) {
  const heads = ["VF 7 Earth", "VF 7 Wind", "Wind Infinity", "VF 7 Sky", "Sky Infinity"] as const;
  return (
    <div className="mb-12">
      <h3 className="font-display font-bold text-lg md:text-xl mb-4 text-left">{title}</h3>
      <div className="overflow-x-auto touch-pan-x rounded-2xl border border-border/80 bg-card/30 [-webkit-overflow-scrolling:touch]">
        <table className="w-full min-w-[980px] text-sm text-left">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-3 py-3 font-display font-semibold w-[22%] min-w-[140px]">Parameter</th>
              {heads.map((h) => (
                <th key={h} className="px-2 py-3 font-display font-semibold text-primary whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([param, c1, c2, c3, c4, c5]) => (
              <tr key={param} className="border-b border-border/60 last:border-0">
                <td className="px-3 py-2.5 text-muted-foreground align-top">{param}</td>
                <td className="px-2 py-2.5 align-top tabular-nums text-xs sm:text-sm">{c1}</td>
                <td className="px-2 py-2.5 align-top tabular-nums text-xs sm:text-sm">{c2}</td>
                <td className="px-2 py-2.5 align-top tabular-nums text-xs sm:text-sm">{c3}</td>
                <td className="px-2 py-2.5 align-top tabular-nums text-xs sm:text-sm">{c4}</td>
                <td className="px-2 py-2.5 align-top tabular-nums text-xs sm:text-sm">{c5}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const ModelVF7 = () => {
  const { siteConfig } = usePublicSite();
  const [selectedColor, setSelectedColor] = useState(0);
  const [variant, setVariant] = useState<VariantId>("earth");

  const stats = variantHeroStats[variant];
  const vMeta = vf7Variants.find((v) => v.id === variant)!;
  const displayExShowroom =
    variant === "earth" ? siteConfig.vf7Price : variantExShowroomPrice[variant];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative flex min-h-[85vh] flex-col">
        <div className="hero-media-scrim absolute inset-0 overflow-hidden">
          <img
            src={vf7Street}
            alt="VinFast VF 7"
            className="h-full w-full object-cover object-[32%_50%]"
            sizes="100vw"
            fetchPriority="high"
            decoding="async"
          />
        </div>
        <div className="relative z-10 flex min-h-0 flex-1 flex-col pt-20 sm:pt-24 lg:pt-28">
          <div className="min-h-0 flex-1" aria-hidden />
          <div className="container mx-auto w-full shrink-0 px-4 pb-20 mt-[22px] sm:mt-[30px] lg:mt-[38px] lg:px-8 lg:pb-28 -translate-y-4 sm:-translate-y-5 lg:-translate-y-6">
            <div className="text-left max-w-3xl">
              <p className="text-hero-plain font-display font-semibold text-sm uppercase tracking-[0.25em] mb-2 mt-px">Premium Electric SUV</p>
              <h1 className="text-hero-plain-lg font-display font-bold text-4xl sm:text-5xl md:text-6xl lg:text-8xl mb-4 sm:mb-5 leading-[1.05]">
                VF 7
              </h1>

              <div className="mb-1.5 flex w-max max-w-full gap-4 sm:gap-5">
                <div className="grid auto-rows-min gap-y-1.5 sm:gap-y-2 pr-4 sm:pr-5 border-r border-white/30">
                  <div>
                    <p className="text-hero-plain-lg font-display font-bold text-xl sm:text-2xl tabular-nums leading-tight">{stats.range}</p>
                    <p className="text-hero-plain-muted text-[11px] sm:text-xs mt-0.5">Range (MIDC)</p>
                  </div>
                  <div>
                    <p className="text-hero-plain-lg font-display font-bold text-xl sm:text-2xl tabular-nums leading-tight">{stats.power}</p>
                    <p className="text-hero-plain-muted text-[11px] sm:text-xs mt-0.5">Max. power</p>
                  </div>
                </div>
                <div className="grid auto-rows-min gap-y-1.5 sm:gap-y-2 min-w-0">
                  <div>
                    <p className="text-hero-plain-lg font-display font-bold text-xl sm:text-2xl tabular-nums leading-tight">{stats.accel}</p>
                    <p className="text-hero-plain-muted text-[11px] sm:text-xs mt-0.5">0–100 km/h</p>
                  </div>
                  <div>
                    <p className="text-hero-plain-lg font-display font-bold text-xl sm:text-2xl tabular-nums leading-tight">{stats.driveline}</p>
                    <p className="text-hero-plain-muted text-[11px] sm:text-xs mt-0.5">Driveline</p>
                  </div>
                </div>
              </div>

              <div className="mb-2">
                <p className="text-hero-plain-lg font-display font-bold text-3xl sm:text-4xl lg:text-5xl tabular-nums leading-[1.08]">
                  {displayExShowroom}
                </p>
                <p className="text-hero-plain-muted text-[11px] sm:text-xs mt-0.5">Indicative ex-showroom*</p>
              </div>

              <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1.5 sm:gap-x-2 mb-2 w-full">
                {vf7Variants.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setVariant(v.id)}
                    className={`rounded-full px-2 py-1.5 text-[10px] sm:text-xs font-semibold border text-center leading-tight whitespace-nowrap shrink-0 sm:px-2.5 ${
                      variant === v.id
                        ? "bg-white text-gray-900 border-white"
                        : "bg-black/45 text-white border-white/50 hover:bg-black/55"
                    }`}
                  >
                    {v.shortLabel}
                  </button>
              ))}
            </div>

              <div className="mt-4 sm:mt-5 w-full min-w-0">
                <p className="text-hero-plain-soft text-sm sm:text-base leading-normal whitespace-normal lg:whitespace-nowrap text-pretty max-w-full">
                  {vMeta.description}
                </p>
              </div>

              <div className="mt-3 sm:mt-4 grid grid-cols-2 gap-2.5 sm:gap-3 w-full max-w-xl sm:max-w-2xl">
                <Link to="/test-drive" className="w-full min-w-0">
                  <Button variant="hero" size="lg" className="w-full rounded-full !py-3.5 !text-xs sm:!py-6 sm:!text-base">
                    Book Test Drive
                  </Button>
                </Link>
                <Link to="/book-now" className="w-full min-w-0">
                  <Button variant="heroWhite" size="lg" className="w-full rounded-full !py-3.5 !text-xs sm:!py-6 sm:!text-base">
                    Book Now
                  </Button>
                </Link>
                <Link to="/contact" className="w-full min-w-0">
                  <Button variant="heroOutline" size="lg" className="w-full rounded-full !py-3.5 !text-xs sm:!py-6 sm:!text-base bg-black/45 border-white/50 text-white hover:bg-black/55">
                    Get On-Road Price
                  </Button>
                </Link>
                <Link to="/emi-calculator" className="w-full min-w-0">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full rounded-full !py-3.5 !text-xs sm:!py-6 sm:!text-base bg-black/45 border-white/50 text-white hover:bg-black/55"
                  >
                    EMI Calculator
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Exterior colour + selected variant (aligned with VF 6) */}
      <section className="py-10 sm:py-14 lg:py-20 border-b border-border/60 bg-muted/25">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-10 lg:mb-12 rounded-2xl border border-border/60 bg-card/90 shadow-sm p-5 sm:p-6 lg:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
              <div className="min-w-0">
                <p className="text-primary font-display font-semibold text-xs uppercase tracking-[0.2em] mb-2">Exterior colour</p>
                <p className="font-display font-bold text-xl sm:text-2xl text-foreground">{colors[selectedColor].name}</p>
                <p className="text-muted-foreground text-sm mt-2 max-w-xl leading-relaxed">
                  Pick a paint for your VF 7 preview. Selection stays in sync with <span className="text-foreground/80 font-medium">Color Studio</span> below.
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
                  {variant === "earth" ? (
                    <p>{adasEarthNote}</p>
                  ) : (
                    <ul className="list-disc pl-5 space-y-1.5">
                      {adasWindPlusBullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-border/70 bg-muted/30 p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-foreground/80 mb-2">Safety (all variants)</p>
                <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1.5">
                  {safetyAllBullets.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="lg:col-span-7 xl:col-span-7 space-y-8">
              <div className="rounded-2xl border border-border/60 bg-[#ECECEA] dark:bg-muted/40 overflow-hidden shadow-sm">
                <div className="relative aspect-[16/10] sm:aspect-[2/1] lg:min-h-[280px]">
                  <img
                    src={colors[selectedColor].image}
                    alt={`VF 7 ${vMeta.shortLabel} in ${colors[selectedColor].name}`}
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

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
                <div className="rounded-xl border border-border/70 bg-card/80 p-3 sm:p-4 shadow-sm col-span-2 sm:col-span-2 lg:col-span-1">
                  <p className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 leading-tight">
                    Indicative ex-showroom
                  </p>
                  <p className="font-display font-bold text-base sm:text-lg md:text-xl tabular-nums">
                    {displayExShowroom}
                  </p>
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
                <div className="rounded-xl border border-border/70 bg-card/80 p-3 sm:p-4 shadow-sm col-span-2 sm:col-span-1">
                  <p className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 leading-tight">
                    Driveline
                  </p>
                  <p className="font-display font-bold text-base sm:text-lg md:text-xl">{stats.driveline}</p>
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

              <div className="hidden lg:flex flex-wrap gap-3 pt-1">
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
                <div className="flex flex-wrap items-center gap-x-1.5 gap-y-2 sm:gap-x-2 w-full max-w-3xl">
                  {vf7Variants.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setVariant(v.id)}
                      className={`rounded-full px-2 py-1 text-[10px] sm:text-xs font-semibold transition-all border text-center leading-tight whitespace-nowrap shrink-0 sm:px-2.5 ${
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
        </div>
      </section>

      {/* Gallery */}
      <section className="py-12 sm:py-16 lg:py-24 bg-background border-y border-border/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mb-12 lg:mb-16">
            <p className="text-primary font-display font-semibold text-sm uppercase tracking-[0.2em] mb-3">Gallery</p>
            <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl mb-4">VF 7 in detail</h2>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              Showroom photography for the VF 7 — exterior and cabin details with short context next to each image.
            </p>
          </div>

          <div className="grid gap-10 lg:gap-12 md:grid-cols-2 mb-14 lg:mb-20">
            {vf7GalleryFeature.map((item) => (
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
            {vf7GalleryDetails.map((item) => (
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
            Images are representative; equipment may vary by Earth, Wind, Wind Infinity, Sky or Sky Infinity. Confirm with Patliputra VinFast Patna.
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
              alt={`VinFast VF 7 in ${colors[selectedColor].name}`}
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

      {/* Full specifications */}
      <section className="py-16 sm:py-24 section-dark">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <p className="text-primary font-display font-semibold text-sm uppercase tracking-[0.2em] mb-3">Specifications</p>
            <h2 className="font-display font-bold text-3xl md:text-5xl mb-4">VF 7 — all five variants</h2>
            <p className="text-muted-foreground text-sm md:text-base">
              Technical brief: FWD Earth / Wind / Wind Infinity (59.6 kWh) and AWD Sky / Sky Infinity (70 kW·h class battery, 353 PS).
            </p>
          </div>

          <SpecTable7 title="Technical specification" rows={technicalSpecRows} />
          <SpecTable7 title="Exterior — differences by trim" rows={exteriorDiffRows} />
          <SpecTable7 title="Interior & audio — differences by trim" rows={interiorDiffRows} />

          <div className="mb-12 grid gap-10 lg:grid-cols-2">
            <div>
              <h3 className="font-display font-bold text-lg md:text-xl mb-4 text-left">Exterior — common to all variants</h3>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc pl-5">
                {exteriorCommonBullets.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-display font-bold text-lg md:text-xl mb-4 text-left">Interior — common to all variants</h3>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc pl-5">
                {interiorCommonBullets.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mb-12 rounded-2xl border border-border/80 bg-card/40 p-6">
            <h3 className="font-display font-bold text-lg md:text-xl mb-3">ADAS summary</h3>
            <p className="text-sm text-muted-foreground mb-4">{adasEarthNote}</p>
            <p className="text-xs font-semibold uppercase tracking-wide text-foreground/80 mb-2">Wind · Wind Infinity · Sky · Sky Infinity</p>
            <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
              {adasWindPlusBullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
              </div>

          <SpecTable7 title="Connectivity & infotainment" rows={connectivityRows} />

          <div className="flex justify-center mt-10">
            <a href="/brochures/VF7-Brochure.pdf" download="VinFast-VF7-Brochure.pdf" target="_blank" rel="noopener noreferrer">
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
              <p className="text-primary font-display font-semibold text-sm uppercase tracking-[0.2em] mb-3">Why VF 7</p>
              <h2 className="font-display font-bold text-3xl md:text-4xl mb-8">Five trims, two drivetrain families</h2>
              <div className="grid gap-3">
                {featureHighlights.map((f) => (
                  <div key={f} className="flex items-start gap-3 py-2">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground/80">{f}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="/brochures/VF7-Brochure.pdf" download="VinFast-VF7-Brochure.pdf" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="lg">
                    <Download className="w-4 h-4 mr-2" /> Download Brochure
                  </Button>
                </a>
              </div>
            </div>
            <div className="rounded-3xl overflow-hidden shadow-luxury border border-border/40">
              <img
                src={vf7GalIntEnh08}
                alt="VF 7 infotainment and cabin"
                className="image-high-quality h-auto w-full object-cover aspect-[4/3]"
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

export default ModelVF7;
