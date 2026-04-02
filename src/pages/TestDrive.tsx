import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import { toast } from "sonner";
import { CalendarDays, MapPin, Car } from "lucide-react";

const MOBILE_REGEX = /^[6-9]\d{9}$/;

const getLocalISODate = () => {
  // Returns YYYY-MM-DD in the user's local timezone (safe for <input type="date">).
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const TestDrivePage = () => {
  const [formData, setFormData] = useState({
    name: "", mobile: "", email: "", city: "Patna", model: "VF 7",
    date: "", time: "", remarks: "",
  });
  const [mobileError, setMobileError] = useState("");
  const todayStr = getLocalISODate();

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
    setFormData({ ...formData, mobile: digits });
    if (digits.length === 0) {
      setMobileError("");
    } else if (digits.length < 10) {
      setMobileError("Mobile number must be 10 digits.");
    } else if (MOBILE_REGEX.test(digits)) {
      setMobileError("");
    } else {
      setMobileError("Enter a valid Indian mobile number (starts with 6–9).");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Please enter your full name.");
      return;
    }
    if (!formData.mobile) {
      toast.error("Please enter your mobile number.");
      return;
    }
    if (!MOBILE_REGEX.test(formData.mobile)) {
      toast.error("Please enter a valid 10-digit Indian mobile number.");
      return;
    }
    if (!formData.date) {
      toast.error("Please select a preferred date.");
      return;
    }

    const selected = new Date(`${formData.date}T00:00:00`);
    const today = new Date(`${todayStr}T00:00:00`);
    if (Number.isNaN(selected.getTime())) {
      toast.error("Please select a valid preferred date.");
      return;
    }
    if (selected.getTime() < today.getTime()) {
      toast.error("Back date test drive booking is not allowed. Please select today or a future date.");
      return;
    }

    toast.success("Test drive booked! We'll confirm your slot shortly via SMS.");
    setFormData({ name: "", mobile: "", email: "", city: "Patna", model: "VF 7", date: "", time: "", remarks: "" });
    setMobileError("");
  };

  const update = (field: string, value: string) => setFormData({ ...formData, [field]: value });

  const inputClass = "h-12 px-4 rounded-xl bg-background/50 border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-full";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20 lg:pt-32 lg:pb-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <p className="text-primary font-display font-semibold text-sm uppercase tracking-[0.2em] mb-3">Test Drive</p>
              <h1 className="font-display font-bold text-4xl md:text-5xl mb-6">Experience the Future</h1>
              <p className="text-muted-foreground text-lg mb-10 max-w-lg">
                Book a complimentary test drive of the VinFast VF 6 or VF 7. Feel the electric difference firsthand.
              </p>
              <div className="space-y-6">
                {[
                  { icon: Car, title: "Choose Your Model", desc: "Select VF 6 or VF 7 for your test drive experience." },
                  { icon: CalendarDays, title: "Pick a Date", desc: "Choose a convenient time. We're available Mon–Sat." },
                  { icon: MapPin, title: "Visit or Home Drive", desc: "Drive at our showroom or request a home test drive." },
                ].map((step) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.title} className="flex gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-display font-semibold mb-1">{step.title}</h3>
                        <p className="text-muted-foreground text-sm">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              onSubmit={handleSubmit}
              className="glass-card p-8"
            >
              <h3 className="font-display font-bold text-xl mb-6">Book Your Test Drive</h3>
              <div className="space-y-4">
                <input type="text" placeholder="Full Name *" value={formData.name} onChange={(e) => update("name", e.target.value)} className={inputClass} />
                <div className="flex flex-col gap-1">
                  <input
                    type="tel"
                    placeholder="Mobile Number *"
                    value={formData.mobile}
                    onChange={handleMobileChange}
                    maxLength={10}
                    inputMode="numeric"
                    className={`${inputClass} ${mobileError ? "border-red-500 focus:ring-red-500/50" : ""}`}
                  />
                  {mobileError && (
                    <p className="text-red-500 text-[11px] px-1 leading-tight">{mobileError}</p>
                  )}
                </div>
                <input type="email" placeholder="Email (Optional)" value={formData.email} onChange={(e) => update("email", e.target.value)} className={inputClass} />
                <div className="grid grid-cols-2 gap-4">
                  <select value={formData.model} onChange={(e) => update("model", e.target.value)} className={inputClass}>
                    <option value="VF 7">VF 7</option>
                    <option value="VF 6">VF 6</option>
                  </select>
                  <select value={formData.city} onChange={(e) => update("city", e.target.value)} className={inputClass}>
                    <option value="Patna">Patna</option>
                    <option value="Muzaffarpur">Muzaffarpur</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => update("date", e.target.value)}
                    min={todayStr}
                    className={inputClass}
                  />
                  <select value={formData.time} onChange={(e) => update("time", e.target.value)} className={inputClass}>
                    <option value="">Select Time</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="03:00 PM">03:00 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                    <option value="05:00 PM">05:00 PM</option>
                  </select>
                </div>
                <textarea placeholder="Any remarks..." value={formData.remarks} onChange={(e) => update("remarks", e.target.value)} className={`${inputClass} h-24 py-3 resize-none`} />
                <Button type="submit" variant="hero" size="lg" className="w-full">
                  Confirm Test Drive
                </Button>
                <p className="text-center text-muted-foreground text-xs">By submitting, you agree to our privacy policy.</p>
              </div>
            </motion.form>
          </div>
        </div>
      </div>
      <Footer />
      <StickyMobileCTA />
    </div>
  );
};

export default TestDrivePage;
