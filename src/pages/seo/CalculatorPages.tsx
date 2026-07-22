import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SeoPageShell from "@/components/seo/SeoPageShell";
import { Button } from "@/components/ui/button";

const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);

export function ChargingCalculatorPage() {
  const [batteryKwh, setBatteryKwh] = useState(60);
  const [socFrom, setSocFrom] = useState(20);
  const [socTo, setSocTo] = useState(80);
  const [chargerKw, setChargerKw] = useState(7.2);
  const [tariff, setTariff] = useState(8);

  const energyKwh = useMemo(() => {
    const delta = clamp(socTo - socFrom, 0, 100) / 100;
    return batteryKwh * delta;
  }, [batteryKwh, socFrom, socTo]);

  const hours = chargerKw > 0 ? energyKwh / chargerKw : 0;
  const cost = energyKwh * tariff;

  return (
    <SeoPageShell
      title="EV Charging Calculator Bihar | Time & Cost | Patliputra VinFast"
      description="Estimate VinFast charging time and electricity cost — home AC or DC fast charging. Plan VF6, VF7 and MPV7 ownership in Bihar."
      path="/charging-calculator"
      keywords={["EV charging calculator", "Charging cost Bihar", "VinFast charging time"]}
      eyebrow="Interactive Tools"
      h1="Charging Time & Cost Calculator"
      lead="Estimate how long a charge takes and what it costs at your electricity tariff."
      ctaPrimary={{ label: "Running Cost Calculator", to: "/running-cost-calculator" }}
      ctaSecondary={{ label: "EMI Calculator", to: "/emi-calculator" }}
    >
      <div className="glass-card p-5 sm:p-8 space-y-6 max-w-xl">
        <Field label="Battery capacity (kWh)" value={batteryKwh} min={30} max={100} step={1} onChange={setBatteryKwh} />
        <Field label="Start SoC (%)" value={socFrom} min={0} max={99} step={1} onChange={setSocFrom} />
        <Field label="Target SoC (%)" value={socTo} min={1} max={100} step={1} onChange={setSocTo} />
        <Field label="Charger power (kW)" value={chargerKw} min={3} max={150} step={0.1} onChange={setChargerKw} />
        <Field label="Tariff (₹/kWh)" value={tariff} min={3} max={20} step={0.5} onChange={setTariff} />
        <div className="rounded-xl bg-primary/10 p-4 space-y-1">
          <p className="font-display font-bold text-lg">≈ {energyKwh.toFixed(1)} kWh</p>
          <p className="text-muted-foreground text-sm">
            Time ≈ {hours < 1 ? `${Math.round(hours * 60)} min` : `${hours.toFixed(1)} hours`}
          </p>
          <p className="text-muted-foreground text-sm">Cost ≈ ₹{Math.round(cost).toLocaleString("en-IN")}</p>
        </div>
        <p className="text-xs text-muted-foreground">
          Estimates only — real charging curves taper near full charge. Ask Patliputra VinFast about home charger installation.
        </p>
      </div>
    </SeoPageShell>
  );
}

export function RunningCostCalculatorPage() {
  const [kmPerMonth, setKmPerMonth] = useState(1200);
  const [evKwhPer100, setEvKwhPer100] = useState(16);
  const [tariff, setTariff] = useState(8);
  const [petrolKmpl, setPetrolKmpl] = useState(12);
  const [petrolPrice, setPetrolPrice] = useState(105);

  const evMonthly = useMemo(() => (kmPerMonth / 100) * evKwhPer100 * tariff, [kmPerMonth, evKwhPer100, tariff]);
  const petrolMonthly = useMemo(
    () => (kmPerMonth / Math.max(petrolKmpl, 1)) * petrolPrice,
    [kmPerMonth, petrolKmpl, petrolPrice]
  );
  const savings = petrolMonthly - evMonthly;

  return (
    <SeoPageShell
      title="EV Running Cost Calculator Bihar | Fuel vs Electricity"
      description="Compare VinFast electricity costs vs petrol — monthly savings estimator for Bihar drivers. VF6, VF7 and MPV7."
      path="/running-cost-calculator"
      keywords={["EV running cost calculator", "Fuel vs electricity", "VinFast savings Bihar"]}
      eyebrow="Interactive Tools"
      h1="Fuel vs Electricity Cost Calculator"
      lead="See how much you could save each month by switching to a VinFast EV."
      ctaPrimary={{ label: "Charging Calculator", to: "/charging-calculator" }}
      ctaSecondary={{ label: "Book Test Drive", to: "/test-drive" }}
    >
      <div className="glass-card p-5 sm:p-8 space-y-6 max-w-xl">
        <Field label="Kilometres / month" value={kmPerMonth} min={200} max={5000} step={50} onChange={setKmPerMonth} />
        <Field label="EV consumption (kWh/100 km)" value={evKwhPer100} min={10} max={30} step={0.5} onChange={setEvKwhPer100} />
        <Field label="Electricity tariff (₹/kWh)" value={tariff} min={3} max={20} step={0.5} onChange={setTariff} />
        <Field label="Petrol / diesel (km/l)" value={petrolKmpl} min={5} max={30} step={0.5} onChange={setPetrolKmpl} />
        <Field label="Fuel price (₹/l)" value={petrolPrice} min={80} max={150} step={1} onChange={setPetrolPrice} />
        <div className="rounded-xl bg-primary/10 p-4 space-y-1">
          <p className="text-sm text-muted-foreground">EV energy ≈ ₹{Math.round(evMonthly).toLocaleString("en-IN")}/month</p>
          <p className="text-sm text-muted-foreground">Fuel ≈ ₹{Math.round(petrolMonthly).toLocaleString("en-IN")}/month</p>
          <p className="font-display font-bold text-lg">
            Estimated savings ≈ ₹{Math.round(savings).toLocaleString("en-IN")}/month
          </p>
        </div>
        <Button asChild>
          <Link to="/emi-calculator">Plan EMI next</Link>
        </Button>
      </div>
    </SeoPageShell>
  );
}

function Field({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (n: number) => void;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2 gap-2">
        <label className="text-sm text-muted-foreground">{label}</label>
        <input
          type="number"
          className="w-28 text-right text-sm font-semibold tabular-nums bg-background/60 border border-border/60 rounded-lg px-2 py-1"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(clamp(Number(e.target.value) || min, min, max))}
        />
      </div>
      <input
        type="range"
        className="w-full accent-primary"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}
