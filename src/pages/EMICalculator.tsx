import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import { usePageSeo } from "@/hooks/usePageSeo";
import { CALCULATOR_METHODOLOGY_NOTE, EMI_PAGE_SEO } from "@/lib/seoBlueprint";
import { TCO_OWNERSHIP_YEAR_OPTIONS, TCO_DEFAULTS } from "@/lib/tco/tcoDefaults";
import { findTcoVehicle, TCO_VEHICLE_OPTIONS } from "@/lib/tco/tcoVehicleData";
import { formatInr } from "@/lib/tco/formatInr";
import emiHeroBanner from "@/assets/emi/emi-calculator-hero.jpg";

const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);

const EMICalculator = () => {
  usePageSeo(EMI_PAGE_SEO);

  const [vehicleId, setVehicleId] = useState("vf7:earth");
  const vehicle = useMemo(
    () => findTcoVehicle(vehicleId) ?? TCO_VEHICLE_OPTIONS[0],
    [vehicleId],
  );

  const [price, setPrice] = useState(vehicle.priceRupees || 2_299_000);
  const [downPayment, setDownPayment] = useState(500_000);
  const [tenure, setTenure] = useState(60);
  const [rate, setRate] = useState(8.5);
  const [ownershipYears, setOwnershipYears] = useState<number>(TCO_DEFAULTS.ownershipYears);
  const [monthlyKm, setMonthlyKm] = useState<number>(TCO_DEFAULTS.monthlyKm);

  const onVehicleChange = (id: string) => {
    setVehicleId(id);
    const v = findTcoVehicle(id);
    if (v?.priceRupees) {
      setPrice(v.priceRupees);
      setDownPayment((prev) =>
        Math.min(prev, Math.floor(v.priceRupees * 0.9 / 10_000) * 10_000),
      );
    }
  };

  const maxDownPayment = Math.floor(price * 0.9 / 10000) * 10000;

  const emi = useMemo(() => {
    const principal = price - downPayment;
    if (principal <= 0) return 0;

    const monthlyRate = rate / 100 / 12;
    const months = tenure;
    if (monthlyRate === 0) return principal / months;

    return (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  }, [price, downPayment, tenure, rate]);

  const totalAmount = emi * tenure;
  const totalInterest = totalAmount - (price - downPayment);
  const yearlyKm = monthlyKm * 12;
  const totalKmOwnership = yearlyKm * ownershipYears;

  const tcoHref = `/total-cost-of-ownership?vehicle=${encodeURIComponent(vehicleId)}&years=${ownershipYears}&km=${monthlyKm}`;

  const labelCls = "text-sm text-muted-foreground";
  const inputCls = "w-28 text-right text-sm font-semibold tabular-nums bg-background/60 border border-border/60 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground";

  return (
    <div className="public-page-shell">
      <Navbar />

      <section className="border-b border-border/60" aria-label="EMI calculator hero">
        <div className="relative w-full overflow-hidden pt-[4.25rem] lg:pt-0">
          <div className="relative h-[clamp(240px,48vw,560px)] min-h-[240px] w-full max-h-[min(88dvh,calc(100dvh-4.25rem))] lg:max-h-[min(620px,calc(100dvh-4.25rem))]">
            <div className="hero-media-scrim absolute inset-0 overflow-hidden [transform:translateZ(0)]">
              <img
                src={emiHeroBanner}
                alt="VinFast EMI calculator — plan smarter, drive sooner"
                className="hero-slider-image h-full w-full object-cover object-[center_42%]"
                sizes="100vw"
                fetchPriority="high"
                decoding="async"
              />
            </div>
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/55 to-background/15"
              aria-hidden
            />
            <div className="absolute inset-0 flex items-end">
              <div className="container mx-auto px-4 lg:px-8 pb-8 sm:pb-10 md:pb-12 w-full">
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-2xl mx-auto lg:mx-0 text-center lg:text-left"
                >
                  <p className="text-primary font-display font-semibold text-xs sm:text-sm uppercase tracking-[0.2em] mb-2">
                    Easy Finance
                  </p>
                  <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-foreground leading-tight">
                    EMI Calculator
                  </h1>
                  <p className="text-muted-foreground text-sm md:text-base mt-3 max-w-xl mx-auto lg:mx-0">
                    Calculate monthly EMI for VF 6, VF 7, VF MPV 7, or Limo Green — and link to total cost of ownership
                    for your driving pattern.
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="py-12 lg:py-16 pb-20 lg:pb-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-6 sm:gap-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-5 sm:p-8 min-w-0">
              <h3 className="font-display font-bold text-lg mb-6">Customize Your Plan</h3>
              <div className="space-y-6">
                <div>
                  <label className={labelCls + " block mb-2"}>VinFast model & variant</label>
                  <Select value={vehicleId} onValueChange={onVehicleChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-[min(20rem,60vh)]">
                      {TCO_VEHICLE_OPTIONS.map((opt) => (
                        <SelectItem key={opt.id} value={opt.id}>
                          {opt.fullLabel}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Indicative price: {vehicle.priceDisplay} — on-road may differ.
                  </p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className={labelCls}>Vehicle Price</label>
                    <input
                      type="number"
                      className={inputCls}
                      min={500000}
                      max={10000000}
                      step={10000}
                      value={price}
                      onChange={(e) => {
                        const v = clamp(Number(e.target.value) || 500000, 500000, 10000000);
                        setPrice(v);
                        setDownPayment((prev) => Math.min(prev, Math.floor(v * 0.9 / 10000) * 10000));
                      }}
                    />
                  </div>
                  <input
                    type="range"
                    className="w-full accent-primary"
                    min={500000}
                    max={10000000}
                    step={10000}
                    value={price}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setPrice(v);
                      setDownPayment((prev) => Math.min(prev, Math.floor(v * 0.9 / 10000) * 10000));
                    }}
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className={labelCls}>Down Payment</label>
                    <input
                      type="number"
                      className={inputCls}
                      min={0}
                      max={maxDownPayment}
                      step={10000}
                      value={downPayment}
                      onChange={(e) => {
                        const v = clamp(Number(e.target.value) || 0, 0, maxDownPayment);
                        setDownPayment(v);
                      }}
                    />
                  </div>
                  <input
                    type="range"
                    className="w-full accent-primary"
                    min={0}
                    max={maxDownPayment}
                    step={10000}
                    value={downPayment}
                    onChange={(e) => setDownPayment(Number(e.target.value))}
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className={labelCls}>Tenure (months)</label>
                    <input
                      type="number"
                      className={inputCls}
                      min={12}
                      max={120}
                      step={1}
                      value={tenure}
                      onChange={(e) => setTenure(clamp(Number(e.target.value) || 12, 12, 120))}
                    />
                  </div>
                  <input
                    type="range"
                    className="w-full accent-primary"
                    min={12}
                    max={120}
                    step={1}
                    value={tenure}
                    onChange={(e) => setTenure(Number(e.target.value))}
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className={labelCls}>Interest Rate (% p.a.)</label>
                    <input
                      type="number"
                      className={inputCls}
                      min={1}
                      max={20}
                      step={0.1}
                      value={rate}
                      onChange={(e) => setRate(clamp(Number(e.target.value) || 1, 1, 20))}
                    />
                  </div>
                  <input
                    type="range"
                    className="w-full accent-primary"
                    min={1}
                    max={20}
                    step={0.1}
                    value={rate}
                    onChange={(e) => setRate(Number(e.target.value))}
                  />
                </div>

                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-4">
                  <p className="text-sm font-display font-semibold text-foreground">
                    Estimated yearly & monthly travel distance
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Used to plan fuel versus charging costs over time. Open the total cost of ownership calculator
                    with these assumptions pre-filled.
                  </p>
                  <div>
                    <p className={labelCls + " mb-2"}>Ownership horizon (for running-cost planning)</p>
                    <div className="flex flex-wrap gap-2">
                      {TCO_OWNERSHIP_YEAR_OPTIONS.map((y) => (
                        <button
                          key={y}
                          type="button"
                          onClick={() => setOwnershipYears(y)}
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold border transition-colors ${
                            ownershipYears === y
                              ? "bg-primary text-primary-foreground border-primary"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          {y} yr
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className={labelCls}>Monthly km driven</label>
                      <input
                        type="number"
                        className={inputCls}
                        min={TCO_DEFAULTS.monthlyKmMin}
                        max={TCO_DEFAULTS.monthlyKmMax}
                        step={50}
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
                    <input
                      type="range"
                      className="w-full accent-primary"
                      min={TCO_DEFAULTS.monthlyKmMin}
                      max={TCO_DEFAULTS.monthlyKmMax}
                      step={50}
                      value={monthlyKm}
                      onChange={(e) => setMonthlyKm(Number(e.target.value))}
                    />
                  </div>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>
                      Estimated yearly distance: <strong className="text-foreground">{yearlyKm.toLocaleString("en-IN")} km</strong>
                    </li>
                    <li>
                      Over {ownershipYears} years: <strong className="text-foreground">{totalKmOwnership.toLocaleString("en-IN")} km</strong>
                    </li>
                    <li>
                      Finance plan uses vehicle price <strong className="text-foreground">{formatInr(price)}</strong> (ex-showroom
                      estimate — not EMI on energy savings).
                    </li>
                  </ul>
                  <Link to={tcoHref} className="block">
                    <Button variant="outline" size="sm" className="w-full">
                      Compare EV vs petrol total cost
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-5 sm:p-8 h-fit min-w-0">
              <h3 className="font-display font-bold text-lg mb-6">Estimated EMI</h3>

              <div className="rounded-2xl bg-primary/5 border border-primary/20 p-6 text-center mb-6">
                <p className="text-sm text-muted-foreground mb-2">Your Monthly EMI</p>
                <p className="font-display font-bold text-4xl text-primary">{formatInr(emi)}</p>
                <p className="text-xs text-muted-foreground mt-2">{vehicle.fullLabel}</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Loan Amount</span>
                  <span className="font-semibold">{formatInr(price - downPayment)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Interest</span>
                  <span className="font-semibold">{formatInr(totalInterest)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Amount</span>
                  <span className="font-semibold">{formatInr(totalAmount)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <Link to="/contact" className="block">
                  <Button variant="hero" size="lg" className="w-full">Get Best Finance Offer</Button>
                </Link>
                <Link to="/test-drive" className="block">
                  <Button variant="outline" size="lg" className="w-full">Book Test Drive</Button>
                </Link>
                <Link to={tcoHref} className="block">
                  <Button variant="outline" size="lg" className="w-full">Total cost of ownership</Button>
                </Link>
              </div>
            </motion.div>
          </div>
          <p className="max-w-4xl mx-auto mt-10 text-center text-xs text-muted-foreground leading-relaxed px-4">
            {CALCULATOR_METHODOLOGY_NOTE}
          </p>
        </div>
      </div>
      <Footer />
      <StickyMobileCTA />
    </div>
  );
};

export default EMICalculator;
