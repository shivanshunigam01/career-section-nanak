import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import { Link } from "react-router-dom";

const clamp = (val: number, min: number, max: number) =>
  Math.min(Math.max(val, min), max);

const useEditableNumber = (
  initial: number,
  min: number,
  max: number,
  step: number = 1
) => {
  const [value, setValue] = useState(initial);
  const [raw, setRaw] = useState(String(initial));
  const [focused, setFocused] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRaw(e.target.value);
    const parsed = parseFloat(e.target.value.replace(/,/g, ""));
    if (!isNaN(parsed)) setValue(parsed);
  };

  const handleBlur = () => {
    setFocused(false);
    const parsed = parseFloat(raw.replace(/,/g, ""));
    const clamped = isNaN(parsed) ? value : clamp(parsed, min, max);
    // round to nearest step
    const snapped = Math.round(clamped / step) * step;
    setValue(snapped);
    setRaw(String(snapped));
  };

  const handleFocus = () => {
    setFocused(true);
    setRaw(String(value));
  };

  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setValue(v);
    if (!focused) setRaw(String(v));
  };

  return { value, raw, focused, handleInputChange, handleBlur, handleFocus, handleSlider, setValue, setRaw };
};

const EMICalculator = () => {
  const price     = useEditableNumber(2189000, 500000, 10000000, 10000);
  const downPay   = useEditableNumber(500000, 0, 8000000, 10000);
  const tenure    = useEditableNumber(60, 12, 120, 1);
  const rate      = useEditableNumber(8.5, 1, 20, 0.1);

  const emi = useMemo(() => {
    const principal = price.value - downPay.value;
    if (principal <= 0) return 0;
    const r = rate.value / 100 / 12;
    const n = tenure.value;
    if (r === 0) return principal / n;
    return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }, [price.value, downPay.value, tenure.value, rate.value]);

  const totalAmount   = emi * tenure.value;
  const totalInterest = totalAmount - (price.value - downPay.value);
  const format        = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");

  const inputCls =
    "w-28 text-right text-sm font-semibold font-display tabular-nums bg-background/70 border border-border rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary transition-all";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20 lg:pt-32 lg:pb-32">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <p className="text-primary font-display font-semibold text-sm uppercase tracking-[0.2em] mb-3">Easy Finance</p>
            <h1 className="font-display font-bold text-4xl md:text-5xl mb-4">EMI Calculator</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Calculate your monthly EMI for VinFast VF 6 or VF 7. Type any value or drag the slider.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-8">

            {/* Left — Inputs */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-8">
              <h3 className="font-display font-bold text-lg mb-6">Customize Your Plan</h3>
              <div className="space-y-7">

                {/* Vehicle Price */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm text-muted-foreground">Vehicle Price (₹)</label>
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-muted-foreground">₹</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={price.focused ? price.raw : price.value.toLocaleString("en-IN")}
                        onChange={price.handleInputChange}
                        onFocus={price.handleFocus}
                        onBlur={price.handleBlur}
                        className={inputCls}
                      />
                    </div>
                  </div>
                  <input type="range" min={2500000} max={10000000} step={10000}
                    value={price.value}
                    onChange={price.handleSlider}
                    className="w-full accent-primary" />
                  <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                    <span>₹25L</span><span>₹1Cr</span>
                  </div>
                </div>

                {/* Down Payment */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm text-muted-foreground">Down Payment (₹)</label>
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-muted-foreground">₹</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={downPay.focused ? downPay.raw : downPay.value.toLocaleString("en-IN")}
                        onChange={downPay.handleInputChange}
                        onFocus={downPay.handleFocus}
                        onBlur={() => {
                          const parsed = parseFloat(downPay.raw.replace(/,/g, ""));
                          const clamped = isNaN(parsed) ? downPay.value : clamp(parsed, 0, price.value * 0.9);
                          downPay.setValue(Math.round(clamped / 10000) * 10000);
                          downPay.setRaw(String(Math.round(clamped / 10000) * 10000));
                          downPay.handleBlur();
                        }}
                        className={inputCls}
                      />
                    </div>
                  </div>
                  <input type="range" min={0} max={Math.floor(price.value * 0.9 / 10000) * 10000} step={10000}
                    value={Math.min(downPay.value, Math.floor(price.value * 0.9 / 10000) * 10000)}
                    onChange={downPay.handleSlider}
                    className="w-full accent-primary" />
                  <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                    <span>₹0</span><span>90% of price</span>
                  </div>
                </div>

                {/* Tenure */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm text-muted-foreground">Tenure</label>
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        inputMode="numeric"
                        value={tenure.focused ? tenure.raw : tenure.value}
                        onChange={tenure.handleInputChange}
                        onFocus={tenure.handleFocus}
                        onBlur={tenure.handleBlur}
                        className={inputCls}
                      />
                      <span className="text-sm text-muted-foreground">mo</span>
                    </div>
                  </div>
                  <input type="range" min={12} max={120} step={1}
                    value={tenure.value}
                    onChange={tenure.handleSlider}
                    className="w-full accent-primary" />
                  <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                    <span>12 mo</span><span>120 mo</span>
                  </div>
                </div>

                {/* Interest Rate */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm text-muted-foreground">Interest Rate</label>
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={rate.focused ? rate.raw : rate.value}
                        onChange={rate.handleInputChange}
                        onFocus={rate.handleFocus}
                        onBlur={rate.handleBlur}
                        className={inputCls}
                      />
                      <span className="text-sm text-muted-foreground">%</span>
                    </div>
                  </div>
                  <input type="range" min={1} max={20} step={0.1}
                    value={rate.value}
                    onChange={rate.handleSlider}
                    className="w-full accent-primary" />
                  <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                    <span>1%</span><span>20%</span>
                  </div>
                </div>

              </div>
            </motion.div>

            {/* Right — Result */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-8 flex flex-col justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-2">Approx. Monthly EMI</p>
                <p className="font-display font-bold text-4xl md:text-5xl text-primary mb-8">
                  {price.value > downPay.value ? format(emi) : "—"}
                </p>

                <div className="space-y-4">
                  {[
                    { label: "Loan Amount",    value: format(Math.max(0, price.value - downPay.value)) },
                    { label: "Total Interest", value: format(Math.max(0, totalInterest)) },
                    { label: "Total Payable",  value: format(Math.max(0, totalAmount)) },
                    { label: "Tenure",         value: `${tenure.value} months` },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-2 border-b border-border/30">
                      <span className="text-muted-foreground text-sm">{item.label}</span>
                      <span className="font-display font-semibold tabular-nums">{item.value}</span>
                    </div>
                  ))}
                </div>

                {/* Simple breakdown bar */}
                {price.value > downPay.value && (
                  <div className="mt-6">
                    <p className="text-xs text-muted-foreground mb-2">Cost Breakdown</p>
                    <div className="h-3 rounded-full overflow-hidden flex">
                      <div
                        className="bg-primary h-full transition-all duration-500"
                        style={{ width: `${((price.value - downPay.value) / Math.max(totalAmount, 1)) * 100}%` }}
                        title="Principal"
                      />
                      <div
                        className="bg-primary/30 h-full flex-1 transition-all duration-500"
                        title="Interest"
                      />
                    </div>
                    <div className="flex gap-4 mt-2">
                      <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground"><span className="w-2.5 h-2.5 rounded-sm bg-primary inline-block" />Principal</span>
                      <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground"><span className="w-2.5 h-2.5 rounded-sm bg-primary/30 inline-block" />Interest</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 flex flex-col gap-3">
                <Link to="/contact">
                  <Button variant="hero" size="lg" className="w-full">Get Finance Support</Button>
                </Link>
                <Link to="/test-drive">
                  <Button variant="outline" size="lg" className="w-full">Book Test Drive</Button>
                </Link>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
      <Footer />
      <StickyMobileCTA />
    </div>
  );
};

export default EMICalculator;
