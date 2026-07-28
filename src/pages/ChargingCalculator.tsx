import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { usePageSeo } from "@/lib/seo";
import { breadcrumbSchema, faqSchema } from "@/lib/seoSchemas";

const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);

const CHARGER_OPTIONS = [
  { value: "3.3", label: "3.3 kW home", kw: 3.3 },
  { value: "7.4", label: "7.4 kW AC wallbox", kw: 7.4 },
  { value: "30", label: "30 kW DC", kw: 30 },
  { value: "60", label: "60 kW DC", kw: 60 },
  { value: "150", label: "150 kW DC", kw: 150 },
] as const;

const CALC_FAQS = [
  {
    question: "How accurate is this EV charging cost calculator?",
    answer:
      "It uses simple energy maths: battery capacity, charge percentage window, tariff, and charger power. Real sessions vary with temperature, battery conditioning, and tapering charge rates — especially on DC above roughly 80%. Treat results as planning estimates.",
  },
  {
    question: "Is home charging cheaper than public charging in Bihar?",
    answer:
      "Home tariffs are usually lower than many public DC rates, so overnight AC charging tends to be the most economical. Public fast charging is best for speed on longer trips. Confirm your local electricity rate when interpreting the cost outputs.",
  },
  {
    question: "Why does DC charging slow above 80%?",
    answer:
      "Fast chargers often reduce power as the battery fills to protect cell health. That means the last portion of a charge can take disproportionately longer. For daily use, many owners top up to a comfortable level rather than always waiting for 100% on DC.",
  },
  {
    question: "What battery capacity should I enter for VinFast models?",
    answer:
      "Use the usable battery capacity for the model and variant you are considering. The default 59.6 kWh is a convenient starting point for planning. Confirm exact figures with Patliputra VinFast for the vehicle you intend to buy.",
  },
];

function formatDuration(hours: number): string {
  if (!Number.isFinite(hours) || hours <= 0) return "—";
  const totalMinutes = Math.round(hours * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} hr`;
  return `${h} hr ${m} min`;
}

export default function ChargingCalculator() {
  const [batteryKwh, setBatteryKwh] = useState(59.6);
  const [tariff, setTariff] = useState(8);
  const [chargerKey, setChargerKey] = useState("7.4");
  const [fromPct, setFromPct] = useState(20);
  const [toPct, setToPct] = useState(100);
  const [efficiency, setEfficiency] = useState(6.5);

  const charger = CHARGER_OPTIONS.find((c) => c.value === chargerKey) ?? CHARGER_OPTIONS[1];
  const isDc = charger.kw >= 30;

  const results = useMemo(() => {
    const start = Math.min(fromPct, toPct);
    const end = Math.max(fromPct, toPct);
    const energyNeeded = batteryKwh * ((end - start) / 100);
    const fullChargeCost = batteryKwh * tariff;
    const topUpCost = energyNeeded * tariff;
    const hours = charger.kw > 0 ? energyNeeded / charger.kw : 0;
    const costPerKm = efficiency > 0 ? tariff / efficiency : 0;
    return { energyNeeded, fullChargeCost, topUpCost, hours, costPerKm, start, end };
  }, [batteryKwh, tariff, fromPct, toPct, charger.kw, efficiency]);

  const faqLd = faqSchema(CALC_FAQS);
  usePageSeo({
    title: "EV Charging Cost Calculator | Patliputra VinFast",
    description:
      "Estimate VinFast EV charging cost and time in Bihar — battery size, tariff, charger power and charge window. Home vs DC tips from Patliputra VinFast.",
    keywords: [
      "EV charging calculator",
      "charging cost Bihar",
      "home charger cost",
      "DC fast charging time",
      "Patliputra VinFast",
      "VinFast charging",
    ],
    canonicalPath: "/charging-calculator",
    schemas: [
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Charging Calculator", path: "/charging-calculator" },
      ]),
      ...(faqLd ? [faqLd] : []),
    ],
  });

  const labelCls = "text-sm text-muted-foreground";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
        <nav aria-label="Breadcrumb" className="container mx-auto px-4 lg:px-8 pt-24 lg:pt-28">
          <ol className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
            <li>
              <Link to="/" className="hover:text-foreground">
                Home
              </Link>
            </li>
            <ChevronRight className="w-3 h-3" aria-hidden />
            <li className="text-foreground font-medium">Charging Calculator</li>
          </ol>
        </nav>

        <header className="container mx-auto px-4 lg:px-8 py-10 lg:py-14 text-center">
          <p className="text-primary font-display font-semibold text-sm uppercase tracking-[0.2em] mb-3">
            Ownership Tools
          </p>
          <h1 className="font-display font-bold text-3xl md:text-5xl mb-4">
            EV Charging Cost & Time Calculator
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Estimate energy needed, rupee cost, and approximate charge time for VinFast EVs in Bihar
            — then fine-tune with your tariff and charger.
          </p>
        </header>

        <section className="container mx-auto px-4 lg:px-8 pb-12" aria-labelledby="calc-heading">
          <h2 id="calc-heading" className="sr-only">
            Calculator inputs and results
          </h2>
          <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-6 sm:gap-8">
            <Card className="glass-card border-border/60">
              <CardHeader>
                <CardTitle className="font-display text-lg">Inputs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className={labelCls} htmlFor="battery-kwh">
                      Battery capacity (kWh)
                    </label>
                    <Input
                      id="battery-kwh"
                      type="number"
                      className="w-24 h-8 text-right"
                      min={40}
                      max={100}
                      step={0.1}
                      value={batteryKwh}
                      onChange={(e) => setBatteryKwh(clamp(Number(e.target.value) || 40, 40, 100))}
                    />
                  </div>
                  <Slider
                    value={[batteryKwh]}
                    min={40}
                    max={100}
                    step={0.1}
                    onValueChange={([v]) => setBatteryKwh(v)}
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className={labelCls} htmlFor="tariff">
                      Electricity tariff (₹/kWh)
                    </label>
                    <Input
                      id="tariff"
                      type="number"
                      className="w-24 h-8 text-right"
                      min={4}
                      max={15}
                      step={0.1}
                      value={tariff}
                      onChange={(e) => setTariff(clamp(Number(e.target.value) || 4, 4, 15))}
                    />
                  </div>
                  <Slider
                    value={[tariff]}
                    min={4}
                    max={15}
                    step={0.1}
                    onValueChange={([v]) => setTariff(v)}
                  />
                </div>

                <div>
                  <label className={labelCls} htmlFor="charger-power">
                    Charger power
                  </label>
                  <Select value={chargerKey} onValueChange={setChargerKey}>
                    <SelectTrigger id="charger-power" className="mt-2">
                      <SelectValue placeholder="Select charger" />
                    </SelectTrigger>
                    <SelectContent>
                      {CHARGER_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className={labelCls}>Current charge (%)</span>
                    <span className="text-sm font-semibold tabular-nums">{fromPct}%</span>
                  </div>
                  <Slider
                    value={[fromPct]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={([v]) => setFromPct(Math.min(v, toPct))}
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className={labelCls}>Target charge (%)</span>
                    <span className="text-sm font-semibold tabular-nums">{toPct}%</span>
                  </div>
                  <Slider
                    value={[toPct]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={([v]) => setToPct(Math.max(v, fromPct))}
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className={labelCls} htmlFor="efficiency">
                      Efficiency (km/kWh)
                    </label>
                    <Input
                      id="efficiency"
                      type="number"
                      className="w-24 h-8 text-right"
                      min={3}
                      max={12}
                      step={0.1}
                      value={efficiency}
                      onChange={(e) => setEfficiency(clamp(Number(e.target.value) || 3, 3, 12))}
                    />
                  </div>
                  <Slider
                    value={[efficiency]}
                    min={3}
                    max={12}
                    step={0.1}
                    onValueChange={([v]) => setEfficiency(v)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-border/60 h-fit">
              <CardHeader>
                <CardTitle className="font-display text-lg">Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-2xl bg-primary/5 border border-primary/20 p-6 text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Cost for {results.start}% → {results.end}%
                  </p>
                  <p className="font-display font-bold text-4xl text-primary">
                    {formatINR(results.topUpCost)}
                  </p>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Energy needed</span>
                    <span className="font-semibold tabular-nums">
                      {results.energyNeeded.toFixed(1)} kWh
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Full-charge cost (0–100%)</span>
                    <span className="font-semibold tabular-nums">
                      {formatINR(results.fullChargeCost)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Approx. charging time</span>
                    <span className="font-semibold tabular-nums">
                      {formatDuration(results.hours)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Cost per km</span>
                    <span className="font-semibold tabular-nums">
                      ₹{results.costPerKm.toFixed(2)}
                    </span>
                  </div>
                </div>

                {isDc ? (
                  <p className="text-xs text-muted-foreground leading-relaxed border-t border-border/60 pt-4">
                    Note: DC fast charging often slows above about 80% state of charge. Actual time
                    to a full battery can be longer than a constant-power estimate.
                  </p>
                ) : null}

                <div className="pt-2 space-y-3">
                  <Button asChild variant="hero" size="lg" className="w-full">
                    <Link to="/test-drive">Book a test drive</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="w-full">
                    <Link to="/running-cost-calculator">Compare running costs</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="container mx-auto px-4 lg:px-8 py-8 max-w-4xl space-y-10" aria-labelledby="how-calc">
          <div>
            <h2 id="how-calc" className="font-display text-xl lg:text-2xl font-bold text-foreground mb-3">
              How EV charging cost is calculated
            </h2>
            <p className="text-muted-foreground text-sm lg:text-base leading-relaxed">
              Energy needed (kWh) equals battery capacity multiplied by the charge window:
              (target % − current %) ÷ 100. Cost is energy × tariff (₹/kWh). Approximate time is
              energy ÷ charger power (kW), assuming steady power delivery. Cost per km is tariff ÷
              efficiency (km/kWh). Real sessions may differ due to losses and charge tapering.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl lg:text-2xl font-bold text-foreground mb-3">
              Home vs public charging in Bihar
            </h2>
            <p className="text-muted-foreground text-sm lg:text-base leading-relaxed">
              Most Patliputra VinFast customers rely on overnight home AC charging for weekday
              commuting and use public DC chargers for longer Bihar trips. Home rates are usually
              more predictable; public rates and wait times vary by location. Plan your primary
              charging at home, then use this calculator to compare AC wallbox versus DC top-up
              scenarios.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 lg:px-8 py-10 max-w-4xl" aria-labelledby="charge-faq">
          <h2 id="charge-faq" className="font-display text-xl lg:text-2xl font-bold text-foreground mb-5">
            Charging calculator FAQs
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {CALC_FAQS.map((f, i) => (
              <AccordionItem key={i} value={`charge-faq-${i}`}>
                <AccordionTrigger className="text-left text-sm lg:text-base">
                  {f.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                  {f.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </main>

      <Footer />
      <StickyMobileCTA />
    </div>
  );
}
