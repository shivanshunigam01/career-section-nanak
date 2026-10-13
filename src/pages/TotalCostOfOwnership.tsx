import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChevronDown, Info } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePageSeo } from "@/hooks/usePageSeo";
import { TCO_PAGE_SEO, CALCULATOR_METHODOLOGY_NOTE } from "@/lib/seoBlueprint";
import { calculateTco, homeChargingPercentToPublic } from "@/lib/tco/tcoCalculate";
import {
  PETROL_COMPARISON_PRESETS,
  TCO_DEFAULTS,
  TCO_OWNERSHIP_YEAR_OPTIONS,
} from "@/lib/tco/tcoDefaults";
import { formatInr, formatInrDecimal } from "@/lib/tco/formatInr";
import type { TcoInputs } from "@/lib/tco/tcoTypes";
import { validateTcoInputs } from "@/lib/tco/tcoValidation";
import {
  findTcoVehicle,
  TCO_VEHICLE_OPTIONS,
  type TcoVehicleOption,
} from "@/lib/tco/tcoVehicleData";
import { TcoLeadActions } from "@/components/tco/TcoLeadActions";
import { cn } from "@/lib/utils";
import vf7Hero from "@/assets/slide-vf7-driving.png";

const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);

const labelCls = "text-sm text-muted-foreground";
const inputCls =
  "w-28 text-right text-sm font-semibold tabular-nums bg-background/60 border border-border/60 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground";

function NumericRow({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2 gap-2">
        <label className={labelCls}>{label}</label>
        <div className="flex items-center gap-1">
          <input
            type="number"
            className={inputCls}
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(clamp(Number(e.target.value) || min, min, max))}
          />
          {suffix ? <span className="text-xs text-muted-foreground">{suffix}</span> : null}
        </div>
      </div>
    </div>
  );
}

function applyVehicleToState(
  vehicle: TcoVehicleOption,
  setters: {
    setEvPrice: (n: number) => void;
    setEvEfficiency: (n: number) => void;
    setEvResale: (n: number) => void;
  },
) {
  if (vehicle.priceRupees > 0) setters.setEvPrice(vehicle.priceRupees);
  const eff =
    vehicle.efficiencyKwhPer100Km ?? TCO_DEFAULTS.fallbackEvEfficiencyKwhPer100Km;
  setters.setEvEfficiency(eff);
  setters.setEvResale(
    Math.round(vehicle.priceRupees * (TCO_DEFAULTS.evResalePercent / 100)),
  );
}

export default function TotalCostOfOwnership() {
  usePageSeo(TCO_PAGE_SEO);
  const [searchParams] = useSearchParams();

  const [vehicleId, setVehicleId] = useState("vf7:earth");
  const [ownershipYears, setOwnershipYears] = useState<number>(TCO_DEFAULTS.ownershipYears);
  const [monthlyKm, setMonthlyKm] = useState(TCO_DEFAULTS.monthlyKm);
  const [petrolMileage, setPetrolMileage] = useState(TCO_DEFAULTS.petrolMileageKmPerLitre);
  const [petrolPrice, setPetrolPrice] = useState(TCO_DEFAULTS.petrolPricePerLitre);
  const [homeChargingPct, setHomeChargingPct] = useState(TCO_DEFAULTS.homeChargingPercent);
  const [homeTariff, setHomeTariff] = useState(TCO_DEFAULTS.homeTariffPerKwh);
  const [publicTariff, setPublicTariff] = useState(TCO_DEFAULTS.publicTariffPerKwh);
  const [evEfficiency, setEvEfficiency] = useState(14);
  const [evPrice, setEvPrice] = useState(2_299_000);
  const [petrolPriceVehicle, setPetrolPriceVehicle] = useState(TCO_DEFAULTS.petrolComparisonPrice);
  const [evInsurance, setEvInsurance] = useState(TCO_DEFAULTS.evInsuranceAnnual);
  const [petrolInsurance, setPetrolInsurance] = useState(TCO_DEFAULTS.petrolInsuranceAnnual);
  const [evMaintenance, setEvMaintenance] = useState(TCO_DEFAULTS.evMaintenanceAnnual);
  const [petrolMaintenance, setPetrolMaintenance] = useState(TCO_DEFAULTS.petrolMaintenanceAnnual);
  const [evResale, setEvResale] = useState(
    Math.round(2_299_000 * (TCO_DEFAULTS.evResalePercent / 100)),
  );
  const [petrolResale, setPetrolResale] = useState(
    Math.round(TCO_DEFAULTS.petrolComparisonPrice * (TCO_DEFAULTS.petrolResalePercent / 100)),
  );
  const [batterySubMonthly, setBatterySubMonthly] = useState(TCO_DEFAULTS.batterySubscriptionMonthly);
  const [otherEvAnnual, setOtherEvAnnual] = useState(TCO_DEFAULTS.otherEvAnnual);
  const [otherPetrolAnnual, setOtherPetrolAnnual] = useState(TCO_DEFAULTS.otherPetrolAnnual);
  const [petrolPreset, setPetrolPreset] = useState(PETROL_COMPARISON_PRESETS[0].id);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [breakdownOpen, setBreakdownOpen] = useState(false);

  const vehicle = useMemo(
    () => findTcoVehicle(vehicleId) ?? TCO_VEHICLE_OPTIONS[0],
    [vehicleId],
  );

  const syncFromVehicle = useCallback(
    (v: TcoVehicleOption) => {
      applyVehicleToState(v, {
        setEvPrice,
        setEvEfficiency,
        setEvResale,
      });
    },
    [],
  );

  useEffect(() => {
    syncFromVehicle(findTcoVehicle(vehicleId) ?? TCO_VEHICLE_OPTIONS[0]);
  }, [syncFromVehicle, vehicleId]);

  useEffect(() => {
    const vParam = searchParams.get("vehicle");
    const years = searchParams.get("years");
    const km = searchParams.get("km");
    if (vParam && findTcoVehicle(vParam)) setVehicleId(vParam);
    if (years) {
      const y = Number(years);
      if (TCO_OWNERSHIP_YEAR_OPTIONS.includes(y as (typeof TCO_OWNERSHIP_YEAR_OPTIONS)[number])) {
        setOwnershipYears(y);
      }
    }
    if (km) {
      const k = Number(km);
      if (Number.isFinite(k) && k > 0) setMonthlyKm(clamp(k, TCO_DEFAULTS.monthlyKmMin, TCO_DEFAULTS.monthlyKmMax));
    }
  }, [searchParams]);

  const publicChargingPct = homeChargingPercentToPublic(homeChargingPct);

  const inputs: TcoInputs = useMemo(
    () => ({
      ownershipYears,
      monthlyKm,
      petrolMileageKmPerLitre: petrolMileage,
      petrolPricePerLitre: petrolPrice,
      homeChargingPercent: homeChargingPct,
      publicChargingPercent: publicChargingPct,
      homeTariffPerKwh: homeTariff,
      publicTariffPerKwh: publicTariff,
      evEfficiencyKwhPer100Km: evEfficiency,
      evPurchasePrice: evPrice,
      petrolPurchasePrice: petrolPriceVehicle,
      evInsuranceAnnual: evInsurance,
      petrolInsuranceAnnual: petrolInsurance,
      evMaintenanceAnnual: evMaintenance,
      petrolMaintenanceAnnual: petrolMaintenance,
      evResaleValue: evResale,
      petrolResaleValue: petrolResale,
      batterySubscriptionMonthly: batterySubMonthly,
      otherEvAnnual,
      otherPetrolAnnual,
    }),
    [
      ownershipYears,
      monthlyKm,
      petrolMileage,
      petrolPrice,
      homeChargingPct,
      publicChargingPct,
      homeTariff,
      publicTariff,
      evEfficiency,
      evPrice,
      petrolPriceVehicle,
      evInsurance,
      petrolInsurance,
      evMaintenance,
      petrolMaintenance,
      evResale,
      petrolResale,
      batterySubMonthly,
      otherEvAnnual,
      otherPetrolAnnual,
    ],
  );

  const errors = useMemo(() => validateTcoInputs(inputs), [inputs]);
  const result = useMemo(() => calculateTco(inputs), [inputs]);

  const chartData = useMemo(() => {
    if (!result) return [];
    return [
      {
        name: "Purchase",
        petrol: result.petrol.purchase,
        ev: result.ev.purchase,
      },
      {
        name: "Fuel / charging",
        petrol: result.petrol.fuelOrEnergy,
        ev: result.ev.fuelOrEnergy,
      },
      {
        name: "Insurance",
        petrol: result.petrol.insurance,
        ev: result.ev.insurance,
      },
      {
        name: "Maintenance",
        petrol: result.petrol.maintenance,
        ev: result.ev.maintenance,
      },
    ];
  }, [result]);

  const scrollToCalculator = () => {
    document.getElementById("tco-calculator")?.scrollIntoView({ behavior: "smooth" });
  };

  const onPetrolPreset = (id: string) => {
    setPetrolPreset(id);
    const preset = PETROL_COMPARISON_PRESETS.find((p) => p.id === id);
    if (preset) {
      setPetrolPriceVehicle(preset.purchasePrice);
      setPetrolMileage(preset.mileageKmPerLitre);
      setPetrolResale(
        Math.round(preset.purchasePrice * (TCO_DEFAULTS.petrolResalePercent / 100)),
      );
    }
  };

  const yearlyKm = monthlyKm * 12;

  return (
    <div className="min-h-screen bg-background pb-36 lg:pb-0">
      <Navbar />

      <section className="relative pt-24 lg:pt-28 pb-12 overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <p className="text-primary font-display font-semibold text-sm uppercase tracking-[0.2em] mb-3">
                Total cost of ownership
              </p>
              <h1 className="font-display font-bold text-4xl md:text-5xl mb-4 leading-tight">
                Calculate Your Electric Driving Savings
              </h1>
              <p className="text-muted-foreground max-w-xl leading-relaxed mb-6">
                Compare estimated ownership costs for a VinFast electric vehicle and a conventional
                petrol car over the years and kilometres you actually drive. Adjust tariffs, mileage,
                and insurance to match your situation — results are planning estimates, not quotes.
              </p>
              <Button variant="hero" size="lg" onClick={scrollToCalculator}>
                Calculate your savings
              </Button>
              <p className="mt-4 text-xs text-muted-foreground">
                Also try the{" "}
                <Link to="/emi-calculator" className="text-primary hover:underline">
                  EMI calculator
                </Link>{" "}
                for finance estimates.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative rounded-3xl overflow-hidden border border-border/50 shadow-xl"
            >
              <img
                src={vf7Hero}
                alt="VinFast electric SUV on the road"
                className="w-full h-auto object-cover max-h-[360px]"
                loading="eager"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section id="tco-calculator" className="pb-20 lg:pb-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 space-y-6 min-w-0">
              <div className="glass-card p-5 sm:p-8">
                <h2 className="font-display font-bold text-xl mb-6">Select your VinFast</h2>
                <div className="grid sm:grid-cols-[120px_1fr] gap-4 items-start mb-6">
                  <img
                    src={vehicle.image}
                    alt={vehicle.fullLabel}
                    className="rounded-xl border border-border/50 w-full object-contain bg-muted/30 p-2"
                  />
                  <div className="space-y-3 min-w-0">
                    <Select value={vehicleId} onValueChange={setVehicleId}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose model & variant" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[min(24rem,70vh)]">
                        {TCO_VEHICLE_OPTIONS.map((opt) => (
                          <SelectItem key={opt.id} value={opt.id}>
                            {opt.fullLabel} — {opt.priceDisplay}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      Indicative ex-showroom: <strong className="text-foreground">{vehicle.priceDisplay}</strong>
                      {!vehicle.priceFromCatalog ? (
                        <span className="text-amber-600 dark:text-amber-400"> — confirm with dealer</span>
                      ) : null}
                    </p>
                    {vehicle.festiveOfferPrice ? (
                      <p className="text-xs text-muted-foreground">
                        Campaign offer shown where applicable (list {vehicle.festiveListPrice}). Eligibility
                        and validity per official terms — confirm at showroom.
                      </p>
                    ) : null}
                    {vehicle.efficiencyDerived ? (
                      <p className="text-xs text-muted-foreground flex items-start gap-1.5">
                        <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        Estimated efficiency {(vehicle.efficiencyKwhPer100Km ?? 0).toFixed(1)} kWh/100
                        km from battery ({vehicle.batteryKwh} kWh) and MIDC range ({vehicle.rangeKm} km).
                      </p>
                    ) : (
                      <p className="text-xs text-amber-600 dark:text-amber-400">
                        Efficiency not derived from catalog — adjust kWh/100 km below or confirm with dealer.
                      </p>
                    )}
                  </div>
                </div>

                <h3 className="font-display font-semibold text-lg mb-4">Your driving pattern</h3>
                <div className="space-y-5">
                  <div>
                    <p className={labelCls + " mb-2"}>Ownership duration</p>
                    <div className="flex flex-wrap gap-2">
                      {TCO_OWNERSHIP_YEAR_OPTIONS.map((y) => (
                        <button
                          key={y}
                          type="button"
                          onClick={() => setOwnershipYears(y)}
                          className={cn(
                            "rounded-full px-4 py-2 text-sm font-semibold border transition-colors",
                            ownershipYears === y
                              ? "bg-primary text-primary-foreground border-primary"
                              : "border-border hover:border-primary/50",
                          )}
                        >
                          {y} years
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className={labelCls}>Monthly travel distance</label>
                      <input
                        type="number"
                        className={inputCls}
                        min={TCO_DEFAULTS.monthlyKmMin}
                        max={TCO_DEFAULTS.monthlyKmMax}
                        value={monthlyKm}
                        onChange={(e) =>
                          setMonthlyKm(
                            clamp(
                              Number(e.target.value) || TCO_DEFAULTS.monthlyKmMin,
                              TCO_DEFAULTS.monthlyKmMin,
                              TCO_DEFAULTS.monthlyKmMax,
                            ),
                          )
                        }
                      />
                    </div>
                    <Slider
                      value={[monthlyKm]}
                      min={TCO_DEFAULTS.monthlyKmMin}
                      max={TCO_DEFAULTS.monthlyKmMax}
                      step={50}
                      onValueChange={([v]) => setMonthlyKm(v)}
                      className="py-2"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Estimated yearly distance: <strong>{yearlyKm.toLocaleString("en-IN")} km</strong>
                      {result ? (
                        <>
                          {" "}
                          · Total over {ownershipYears} years:{" "}
                          <strong>{result.totalKm.toLocaleString("en-IN")} km</strong>
                        </>
                      ) : null}
                    </p>
                  </div>

                  <NumericRow
                    label="Petrol comparison mileage"
                    value={petrolMileage}
                    onChange={setPetrolMileage}
                    min={5}
                    max={30}
                    step={0.5}
                    suffix="km/l"
                  />
                  <NumericRow
                    label="Petrol price"
                    value={petrolPrice}
                    onChange={setPetrolPrice}
                    min={50}
                    max={200}
                    step={1}
                    suffix="₹/L"
                  />

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className={labelCls}>Home charging share</label>
                      <span className="text-sm font-semibold tabular-nums">
                        {homeChargingPct}% home · {publicChargingPct}% public
                      </span>
                    </div>
                    <Slider
                      value={[homeChargingPct]}
                      min={0}
                      max={100}
                      step={5}
                      onValueChange={([v]) => setHomeChargingPct(v)}
                    />
                  </div>

                  <NumericRow
                    label="Home electricity tariff"
                    value={homeTariff}
                    onChange={setHomeTariff}
                    min={4}
                    max={25}
                    step={0.5}
                    suffix="₹/kWh"
                  />
                  <NumericRow
                    label="Public charging tariff"
                    value={publicTariff}
                    onChange={setPublicTariff}
                    min={8}
                    max={35}
                    step={0.5}
                    suffix="₹/kWh"
                  />
                  <NumericRow
                    label="EV efficiency"
                    value={evEfficiency}
                    onChange={setEvEfficiency}
                    min={10}
                    max={35}
                    step={0.1}
                    suffix="kWh/100km"
                  />
                </div>

                {errors.length > 0 ? (
                  <ul className="mt-4 text-sm text-destructive space-y-1" role="alert">
                    {errors.map((e) => (
                      <li key={e.field}>{e.message}</li>
                    ))}
                  </ul>
                ) : null}
              </div>

              <div className="glass-card p-5 sm:p-8">
                <h3 className="font-display font-bold text-lg mb-4">Petrol vehicle to compare</h3>
                <Select value={petrolPreset} onValueChange={onPetrolPreset}>
                  <SelectTrigger className="mb-4">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PETROL_COMPARISON_PRESETS.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mb-4">
                  Presets are planning assumptions only — not competitor claims. Enter your own on-road
                  price and mileage below.
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <NumericRow
                    label="Petrol vehicle price"
                    value={petrolPriceVehicle}
                    onChange={(n) => {
                      setPetrolPriceVehicle(n);
                      setPetrolResale(
                        Math.round(n * (TCO_DEFAULTS.petrolResalePercent / 100)),
                      );
                    }}
                    min={500_000}
                    max={10_000_000}
                    step={10_000}
                  />
                  <NumericRow
                    label="VinFast price (editable)"
                    value={evPrice}
                    onChange={(n) => {
                      setEvPrice(n);
                      setEvResale(Math.round(n * (TCO_DEFAULTS.evResalePercent / 100)));
                    }}
                    min={500_000}
                    max={10_000_000}
                    step={10_000}
                  />
                </div>
              </div>

              <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
                <div className="glass-card p-5 sm:p-8">
                  <CollapsibleTrigger className="flex w-full items-center justify-between font-display font-bold text-lg">
                    Advanced cost settings
                    <ChevronDown
                      className={cn("w-5 h-5 transition-transform", advancedOpen && "rotate-180")}
                    />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-6 space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <NumericRow
                        label="EV insurance (annual)"
                        value={evInsurance}
                        onChange={setEvInsurance}
                        min={0}
                        max={200_000}
                        step={1000}
                      />
                      <NumericRow
                        label="Petrol insurance (annual)"
                        value={petrolInsurance}
                        onChange={setPetrolInsurance}
                        min={0}
                        max={200_000}
                        step={1000}
                      />
                      <NumericRow
                        label="EV maintenance (annual)"
                        value={evMaintenance}
                        onChange={setEvMaintenance}
                        min={0}
                        max={200_000}
                        step={1000}
                      />
                      <NumericRow
                        label="Petrol maintenance (annual)"
                        value={petrolMaintenance}
                        onChange={setPetrolMaintenance}
                        min={0}
                        max={200_000}
                        step={1000}
                      />
                      <NumericRow
                        label="Estimated EV resale"
                        value={evResale}
                        onChange={setEvResale}
                        min={0}
                        max={10_000_000}
                        step={10_000}
                      />
                      <NumericRow
                        label="Estimated petrol resale"
                        value={petrolResale}
                        onChange={setPetrolResale}
                        min={0}
                        max={10_000_000}
                        step={10_000}
                      />
                      <NumericRow
                        label="Battery subscription (monthly)"
                        value={batterySubMonthly}
                        onChange={setBatterySubMonthly}
                        min={0}
                        max={50_000}
                        step={500}
                      />
                      <NumericRow
                        label="Other EV costs (annual)"
                        value={otherEvAnnual}
                        onChange={setOtherEvAnnual}
                        min={0}
                        max={500_000}
                        step={1000}
                      />
                      <NumericRow
                        label="Other petrol costs (annual)"
                        value={otherPetrolAnnual}
                        onChange={setOtherPetrolAnnual}
                        min={0}
                        max={500_000}
                        step={1000}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Resale values are user assumptions unless you have a verified buyback offer. Battery
                      subscription fees apply only where officially contracted — default is zero; confirm
                      battery ownership vs subscription for your variant.
                    </p>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            </div>

            <div className="lg:col-span-2 space-y-6 min-w-0">
              <div className="glass-card p-5 sm:p-8 lg:sticky lg:top-28">
                <h2 className="font-display font-bold text-xl mb-4">Estimated results</h2>
                {!result ? (
                  <p className="text-muted-foreground text-sm">Fix the inputs above to see estimates.</p>
                ) : (
                  <>
                    <p className="text-xs text-muted-foreground mb-4">
                      Estimated total cost over {ownershipYears} years ({result.totalKm.toLocaleString("en-IN")}{" "}
                      km)
                    </p>
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="rounded-xl border border-border/60 p-4 bg-background/40">
                        <p className="text-xs text-muted-foreground mb-1">VinFast EV</p>
                        <p className="font-display font-bold text-xl text-primary">
                          {formatInr(result.ev.totalTco)}
                        </p>
                      </div>
                      <div className="rounded-xl border border-border/60 p-4 bg-background/40">
                        <p className="text-xs text-muted-foreground mb-1">Petrol vehicle</p>
                        <p className="font-display font-bold text-xl">{formatInr(result.petrol.totalTco)}</p>
                      </div>
                    </div>

                    <div
                      className={cn(
                        "rounded-2xl p-5 text-center mb-6 border",
                        result.savings >= 0
                          ? "bg-primary/5 border-primary/25"
                          : "bg-amber-500/5 border-amber-500/30",
                      )}
                    >
                      <p className="text-sm text-muted-foreground mb-1">
                        {result.savings >= 0 ? "Estimated savings with EV" : "EV costs more under these inputs"}
                      </p>
                      <p className="font-display font-bold text-3xl">
                        {formatInr(Math.abs(result.savings))}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        ≈ {formatInr(Math.abs(result.annualSavings))} per year (planning estimate)
                      </p>
                    </div>

                    <div className="space-y-2 text-sm mb-6">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Energy cost per km (EV)</span>
                        <span className="font-semibold tabular-nums">
                          {formatInrDecimal(result.ev.costPerKmEnergy, 2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Fuel cost per km (petrol)</span>
                        <span className="font-semibold tabular-nums">
                          {formatInrDecimal(result.petrol.costPerKmEnergy, 2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total charging (EV)</span>
                        <span className="font-semibold">{formatInr(result.ev.fuelOrEnergy)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total fuel (petrol)</span>
                        <span className="font-semibold">{formatInr(result.petrol.fuelOrEnergy)}</span>
                      </div>
                    </div>

                    <div className="h-48 w-full min-w-0 mb-4" aria-hidden>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                          <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                          <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${Math.round(v / 100000)}L`} />
                          <Tooltip formatter={(v: number) => formatInr(v)} />
                          <Legend />
                          <Bar dataKey="petrol" name="Petrol" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="ev" name="VinFast EV" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <Collapsible open={breakdownOpen} onOpenChange={setBreakdownOpen}>
                      <CollapsibleTrigger className="flex w-full items-center justify-between text-sm font-semibold text-primary">
                        Detailed cost breakdown
                        <ChevronDown
                          className={cn("w-4 h-4 transition-transform", breakdownOpen && "rotate-180")}
                        />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pt-4">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="text-muted-foreground border-b border-border/50">
                              <th className="text-left py-2 font-medium">Item</th>
                              <th className="text-right py-2 font-medium">EV</th>
                              <th className="text-right py-2 font-medium">Petrol</th>
                            </tr>
                          </thead>
                          <tbody className="tabular-nums">
                            {[
                              ["Purchase", result.ev.purchase, result.petrol.purchase],
                              ["Fuel / charging", result.ev.fuelOrEnergy, result.petrol.fuelOrEnergy],
                              ["Insurance", result.ev.insurance, result.petrol.insurance],
                              ["Maintenance", result.ev.maintenance, result.petrol.maintenance],
                              ["Battery subscription", result.ev.batterySubscription, result.petrol.batterySubscription],
                              ["Other", result.ev.other, result.petrol.other],
                              ["Resale (deducted)", -result.ev.resaleValue, -result.petrol.resaleValue],
                            ].map(([label, ev, petrol]) => (
                              <tr key={String(label)} className="border-b border-border/30">
                                <td className="py-2">{label}</td>
                                <td className="text-right py-2">{formatInr(ev as number)}</td>
                                <td className="text-right py-2">{formatInr(petrol as number)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </CollapsibleContent>
                    </Collapsible>
                  </>
                )}
              </div>

              {result ? (
                <TcoLeadActions
                  modelKey={vehicle.modelKey}
                  variantLabel={vehicle.fullLabel}
                  ownershipYears={ownershipYears}
                  estimatedSavings={result.savings}
                />
              ) : null}
            </div>
          </div>

          <p className="max-w-6xl mx-auto mt-12 text-center text-xs text-muted-foreground leading-relaxed px-4">
            {CALCULATOR_METHODOLOGY_NOTE}
          </p>
        </div>
      </section>

      <Footer />
      <StickyMobileCTA />
    </div>
  );
}
