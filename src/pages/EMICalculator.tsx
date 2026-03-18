import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import { Link } from "react-router-dom";

const EMICalculator = () => {
  const [price, setPrice] = useState(4390000);
  const [downPayment, setDownPayment] = useState(1000000);
  const [tenure, setTenure] = useState(60);
  const [rate, setRate] = useState(8.5);

  const emi = useMemo(() => {
    const principal = price - downPayment;
    const r = rate / 100 / 12;
    const n = tenure;
    if (r === 0) return principal / n;
    return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }, [price, downPayment, tenure, rate]);

  const totalAmount = emi * tenure;
  const totalInterest = totalAmount - (price - downPayment);

  const format = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");

  const inputClass = "h-12 px-4 rounded-xl bg-background/50 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-full";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20 lg:pt-32 lg:pb-32">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <p className="text-primary font-display font-semibold text-sm uppercase tracking-[0.2em] mb-3">Easy Finance</p>
            <h1 className="font-display font-bold text-4xl md:text-5xl mb-4">EMI Calculator</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Calculate your monthly EMI for VinFast VF 6 or VF 7. Get the best finance options in Bihar.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-8">
              <h3 className="font-display font-bold text-lg mb-6">Customize Your Plan</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm text-muted-foreground">Vehicle Price</label>
                    <span className="text-sm font-semibold tabular-nums">{format(price)}</span>
                  </div>
                  <input type="range" min={2500000} max={6000000} step={10000} value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full accent-primary" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm text-muted-foreground">Down Payment</label>
                    <span className="text-sm font-semibold tabular-nums">{format(downPayment)}</span>
                  </div>
                  <input type="range" min={0} max={price * 0.8} step={10000} value={downPayment}
                    onChange={(e) => setDownPayment(Number(e.target.value))}
                    className="w-full accent-primary" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm text-muted-foreground">Tenure (months)</label>
                    <span className="text-sm font-semibold tabular-nums">{tenure} months</span>
                  </div>
                  <input type="range" min={12} max={84} step={6} value={tenure}
                    onChange={(e) => setTenure(Number(e.target.value))}
                    className="w-full accent-primary" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm text-muted-foreground">Interest Rate (%)</label>
                    <span className="text-sm font-semibold tabular-nums">{rate}%</span>
                  </div>
                  <input type="range" min={6} max={15} step={0.1} value={rate}
                    onChange={(e) => setRate(Number(e.target.value))}
                    className="w-full accent-primary" />
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-8 flex flex-col justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-2">Approx. Monthly EMI</p>
                <p className="font-display font-bold text-4xl md:text-5xl text-primary mb-8">{format(emi)}</p>

                <div className="space-y-4">
                  {[
                    { label: "Loan Amount", value: format(price - downPayment) },
                    { label: "Total Interest", value: format(totalInterest) },
                    { label: "Total Amount", value: format(totalAmount) },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-2 border-b border-border/30">
                      <span className="text-muted-foreground text-sm">{item.label}</span>
                      <span className="font-display font-semibold tabular-nums">{item.value}</span>
                    </div>
                  ))}
                </div>
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
