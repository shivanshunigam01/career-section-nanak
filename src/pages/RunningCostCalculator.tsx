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

const RUN_FAQS = [
  {
    question: "Why do EVs usually cost less to run than petrol cars?",
    answer:
      "Electricity per kilometre is typically cheaper than petrol at common Bihar tariffs and fuel prices. EVs also avoid many engine-related service items. Exact savings depend on your monthly distance, tariff, and the petrol car’s mileage.",
  },
  {
    question: "What monthly kilometres should I enter?",
    answer:
      "Use your realistic average — commute plus weekend trips. Higher monthly distance usually increases absolute savings. If your usage varies by season, try a few scenarios to see the range.",
  },
  {
    question: "Does this include EMI, insurance, or service?",
    answer:
      "No. This tool focuses on energy versus fuel running cost only. For EMI planning use our EMI calculator, and ask Patliputra VinFast for insurance and service package guidance when you buy.",
  },
  {
    question: "How is the CO2 note calculated?",
    answer:
      "We estimate petrol litres avoided from your distance and mileage, then multiply by roughly 2.3 kg CO2 per litre. It is a simplified illustration, not a full lifecycle assessment of electricity generation.",
  },
];

export default function RunningCostCalculator() {
  const [monthlyKm, setMonthlyKm] = useState(1200);
  const [petrolPrice, setPetrolPrice] = useState(107);
  const [petrolMileage, setPetrolMileage] = useState(14);
  const [tariff, setTariff] = useState(8);
  const [evEfficiency, setEvEfficiency] = useState(6.5);

  const results = useMemo(() => {
    const petrolMonthly =
      petrolMileage > 0 ? (monthlyKm / petrolMileage) * petrolPrice : 0;
    const evMonthly = evEfficiency > 0 ? (monthlyKm / evEfficiency) * tariff : 0;
    const monthlySavings = petrolMonthly - evMonthly;
    const yearlyPetrol = petrolMonthly * 12;
    const yearlyEv = evMonthly * 12;
    const yearlySavings = monthlySavings * 12;
    const fiveYearSavings = yearlySavings * 5;
    const petrolPerKm = petrolMileage > 0 ? petrolPrice / petrolMileage : 0;
    const evPerKm = evEfficiency > 0 ? tariff / evEfficiency : 0;
    const litresSavedYearly = petrolMileage > 0 ? (monthlyKm * 12) / petrolMileage : 0;
    const co2KgYearly = litresSavedYearly * 2.3;
    return {
      petrolMonthly,
      evMonthly,
      monthlySavings,
      yearlyPetrol,
      yearlyEv,
      yearlySavings,
      fiveYearSavings,
      petrolPerKm,
      evPerKm,
      co2KgYearly,
    };
  }, [monthlyKm, petrolPrice, petrolMileage, tariff, evEfficiency]);

  const faqLd = faqSchema(RUN_FAQS);
  usePageSeo({
    title: "EV vs Petrol Running Cost | Patliputra VinFast",
    description:
      "Compare VinFast EV vs petrol running costs for Bihar — monthly, yearly and 5-year savings, cost per km, and a simple CO2 estimate from Patliputra VinFast.",
    keywords: [
      "EV vs petrol cost",
      "running cost calculator Bihar",
      "electric car savings Patna",
      "VinFast running cost",
      "Patliputra VinFast",
    ],
    canonicalPath: "/running-cost-calculator",
    schemas: [
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Running Cost Calculator", path: "/running-cost-calculator" },
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
            <li className="text-foreground font-medium">Running Cost Calculator</li>
          </ol>
        </nav>

        <header className="container mx-auto px-4 lg:px-8 py-10 lg:py-14 text-center">
          <p className="text-primary font-display font-semibold text-sm uppercase tracking-[0.2em] mb-3">
            Ownership Tools
          </p>
          <h1 className="font-display font-bold text-3xl md:text-5xl mb-4">
            EV vs Petrol Running Cost Calculator
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            See how much you could save each month and over five years by switching from petrol to a
            VinFast EV at typical Bihar tariffs and fuel prices.
          </p>
        </header>

        <section className="container mx-auto px-4 lg:px-8 pb-12" aria-labelledby="run-calc-heading">
          <h2 id="run-calc-heading" className="sr-only">
            Calculator inputs and results
          </h2>
          <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-6 sm:gap-8">
            <Card className="glass-card border-border/60">
              <CardHeader>
                <CardTitle className="font-display text-lg">Your assumptions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className={labelCls} htmlFor="monthly-km">
                      Monthly running (km)
                    </label>
                    <Input
                      id="monthly-km"
                      type="number"
                      className="w-28 h-8 text-right"
                      min={100}
                      max={5000}
                      step={50}
                      value={monthlyKm}
                      onChange={(e) => setMonthlyKm(clamp(Number(e.target.value) || 100, 100, 5000))}
                    />
                  </div>
                  <Slider
                    value={[monthlyKm]}
                    min={100}
                    max={5000}
                    step={50}
                    onValueChange={([v]) => setMonthlyKm(v)}
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className={labelCls} htmlFor="petrol-price">
                      Petrol price (₹/L)
                    </label>
                    <Input
                      id="petrol-price"
                      type="number"
                      className="w-28 h-8 text-right"
                      min={80}
                      max={150}
                      step={1}
                      value={petrolPrice}
                      onChange={(e) =>
                        setPetrolPrice(clamp(Number(e.target.value) || 80, 80, 150))
                      }
                    />
                  </div>
                  <Slider
                    value={[petrolPrice]}
                    min={80}
                    max={150}
                    step={1}
                    onValueChange={([v]) => setPetrolPrice(v)}
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className={labelCls} htmlFor="petrol-mileage">
                      Petrol mileage (km/L)
                    </label>
                    <Input
                      id="petrol-mileage"
                      type="number"
                      className="w-28 h-8 text-right"
                      min={5}
                      max={30}
                      step={0.5}
                      value={petrolMileage}
                      onChange={(e) =>
                        setPetrolMileage(clamp(Number(e.target.value) || 5, 5, 30))
                      }
                    />
                  </div>
                  <Slider
                    value={[petrolMileage]}
                    min={5}
                    max={30}
                    step={0.5}
                    onValueChange={([v]) => setPetrolMileage(v)}
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className={labelCls} htmlFor="ev-tariff">
                      Electricity tariff (₹/kWh)
                    </label>
                    <Input
                      id="ev-tariff"
                      type="number"
                      className="w-28 h-8 text-right"
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
                  <div className="flex justify-between items-center mb-2">
                    <label className={labelCls} htmlFor="ev-efficiency">
                      EV efficiency (km/kWh)
                    </label>
                    <Input
                      id="ev-efficiency"
                      type="number"
                      className="w-28 h-8 text-right"
                      min={3}
                      max={12}
                      step={0.1}
                      value={evEfficiency}
                      onChange={(e) =>
                        setEvEfficiency(clamp(Number(e.target.value) || 3, 3, 12))
                      }
                    />
                  </div>
                  <Slider
                    value={[evEfficiency]}
                    min={3}
                    max={12}
                    step={0.1}
                    onValueChange={([v]) => setEvEfficiency(v)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-border/60 h-fit">
              <CardHeader>
                <CardTitle className="font-display text-lg">Comparison</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-2xl bg-primary/5 border border-primary/20 p-6 text-center">
                  <p className="text-sm text-muted-foreground mb-2">5-year estimated savings</p>
                  <p className="font-display font-bold text-4xl text-primary">
                    {formatINR(Math.max(0, results.fiveYearSavings))}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl border border-border/60 p-4">
                    <p className="text-muted-foreground mb-1">Petrol / month</p>
                    <p className="font-semibold tabular-nums">{formatINR(results.petrolMonthly)}</p>
                  </div>
                  <div className="rounded-xl border border-border/60 p-4">
                    <p className="text-muted-foreground mb-1">EV / month</p>
                    <p className="font-semibold tabular-nums">{formatINR(results.evMonthly)}</p>
                  </div>
                  <div className="rounded-xl border border-border/60 p-4">
                    <p className="text-muted-foreground mb-1">Petrol / year</p>
                    <p className="font-semibold tabular-nums">{formatINR(results.yearlyPetrol)}</p>
                  </div>
                  <div className="rounded-xl border border-border/60 p-4">
                    <p className="text-muted-foreground mb-1">EV / year</p>
                    <p className="font-semibold tabular-nums">{formatINR(results.yearlyEv)}</p>
                  </div>
                </div>

                <div className="space-y-3 text-sm border-t border-border/60 pt-4">
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Monthly savings</span>
                    <span className="font-semibold tabular-nums text-primary">
                      {formatINR(Math.max(0, results.monthlySavings))}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Yearly savings</span>
                    <span className="font-semibold tabular-nums text-primary">
                      {formatINR(Math.max(0, results.yearlySavings))}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Petrol cost / km</span>
                    <span className="font-semibold tabular-nums">
                      ₹{results.petrolPerKm.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">EV cost / km</span>
                    <span className="font-semibold tabular-nums">
                      ₹{results.evPerKm.toFixed(2)}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed border-t border-border/60 pt-4">
                  Rough CO2 note: switching could avoid about{" "}
                  <span className="font-medium text-foreground">
                    {Math.round(results.co2KgYearly).toLocaleString("en-IN")} kg
                  </span>{" "}
                  of CO2 per year from petrol not burned (~2.3 kg CO2 per litre), before accounting
                  for electricity generation mix.
                </p>

                <div className="pt-2 space-y-3">
                  <Button asChild variant="hero" size="lg" className="w-full">
                    <Link to="/test-drive">Book a test drive</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="w-full">
                    <Link to="/emi-calculator">Estimate EMI</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="container mx-auto px-4 lg:px-8 py-8 max-w-4xl space-y-10" aria-labelledby="why-less">
          <div>
            <h2 id="why-less" className="font-display text-xl lg:text-2xl font-bold text-foreground mb-3">
              Why EVs cost less to run
            </h2>
            <p className="text-muted-foreground text-sm lg:text-base leading-relaxed">
              At everyday Bihar electricity tariffs, each kilometre in a VinFast EV typically costs a
              fraction of the same distance in a petrol SUV. There is no gearbox oil change rhythm
              tied to an internal combustion engine, and regenerative braking can stretch energy
              further in city traffic. Fuel-price swings also matter less when most charging happens
              at home.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl lg:text-2xl font-bold text-foreground mb-3">
              5-year savings example in Bihar
            </h2>
            <p className="text-muted-foreground text-sm lg:text-base leading-relaxed">
              With the default inputs — about 1,200 km per month, petrol near ₹107/L at 14 km/L, and
              electricity near ₹8/kWh at 6.5 km/kWh — many drivers see meaningful monthly and
              multi-year savings before counting reduced routine maintenance. Adjust the sliders to
              match your commute between Patna and nearby districts, then talk to Patliputra VinFast
              about the model that fits your range and family needs.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 lg:px-8 py-10 max-w-4xl" aria-labelledby="run-faq">
          <h2 id="run-faq" className="font-display text-xl lg:text-2xl font-bold text-foreground mb-5">
            Running cost FAQs
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {RUN_FAQS.map((f, i) => (
              <AccordionItem key={i} value={`run-faq-${i}`}>
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
