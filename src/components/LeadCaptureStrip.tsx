import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { addLead } from "@/lib/vfLocalStorage";
import type { Lead } from "@/data/mockData";

const MOBILE_REGEX = /^[6-9]\d{9}$/;

const getLocalISODate = () => {
  // Returns YYYY-MM-DD in the user's local timezone.
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const LeadCaptureStrip = () => {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    city: "Patna",
    otherCity: "",
    model: "VF 7",
    interest: "Test Drive",
  });
  const [mobileError, setMobileError] = useState("");

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow digits only, max 10 characters
    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
    setFormData({ ...formData, mobile: digits });

    if (digits.length === 0) {
      setMobileError("");
    } else if (digits.length < 10) {
      setMobileError("Mobile number must be 10 digits.");
    } else if (!MOBILE_REGEX.test(digits)) {
      setMobileError("Enter a valid Indian mobile number (starts with 6–9).");
    } else {
      setMobileError("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Please enter your name.");
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

    try {
      const todayStr = getLocalISODate();
      const city = formData.city === "Other" ? (formData.otherCity || "Other") : formData.city;
      const lead: Lead = {
        id: `WL_${Date.now()}`,
        name: formData.name.trim(),
        mobile: formData.mobile,
        email: "",
        city,
        model: formData.model,
        source: "Website",
        status: "New Lead",
        assignedTo: "",
        createdAt: todayStr,
        nextFollowUp: "",
        remarks: `Interest: ${formData.interest}`,
        financeNeeded: false,
        exchangeNeeded: false,
      };
      addLead(lead);
    } catch {
      // Ignore localStorage failures; keep UX intact.
    }

    toast.success("Thank you! Our EV advisor will contact you within 10 minutes.");
    setFormData({ name: "", mobile: "", city: "Patna", otherCity: "", model: "VF 7", interest: "Test Drive" });
    setMobileError("");
  };

  return (
    <section className="py-12 sm:py-16 lg:py-24 section-dark relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
      <div className="container mx-auto px-4 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center mb-10"
        >
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-3">
            Ready to Go Electric?
          </h2>
          <p className="text-muted-foreground">
            Leave your details and our EV advisor will reach out in 10 minutes.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto glass-card p-4 sm:p-6 lg:p-8"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <input
              type="text"
              placeholder="Your Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="h-12 min-w-0 w-full px-4 rounded-xl bg-background/50 border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <div className="flex min-w-0 w-full flex-col gap-1">
              <input
                type="tel"
                placeholder="Mobile Number"
                value={formData.mobile}
                onChange={handleMobileChange}
                maxLength={10}
                inputMode="numeric"
                className={`h-12 min-w-0 w-full px-4 rounded-xl bg-background/50 border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  mobileError ? "border-red-500 focus:ring-red-500/50" : "border-border"
                }`}
              />
              {mobileError && (
                <p className="text-red-500 text-[11px] px-1 leading-tight">{mobileError}</p>
              )}
            </div>
            <div className="flex min-w-0 w-full flex-col gap-2">
              <select
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value, otherCity: "" })}
                className="h-12 min-w-0 w-full px-4 rounded-xl bg-background/50 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="Patna">Patna</option>
                <option value="Muzaffarpur">Muzaffarpur</option>
                <option value="Gaya">Gaya</option>
                <option value="Other">Other</option>
              </select>
              {formData.city === "Other" && (
                <input
                  type="text"
                  placeholder="Enter your city / state"
                  value={formData.otherCity}
                  onChange={(e) => setFormData({ ...formData, otherCity: e.target.value })}
                  className="h-12 min-w-0 w-full px-4 rounded-xl bg-background/50 border border-primary/50 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  autoFocus
                />
              )}
            </div>
            <select
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              className="h-12 min-w-0 w-full px-4 rounded-xl bg-background/50 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="VF 7">VF 7</option>
              <option value="VF 6">VF 6</option>
            </select>
            <Button type="submit" variant="hero" className="h-12 w-full sm:w-auto lg:w-full shrink-0">
              Get in Touch
            </Button>
          </div>
          <p className="text-center text-muted-foreground text-xs mt-4">
            By submitting, you agree to our privacy policy. We respect your data.
          </p>
        </motion.form>
      </div>
    </section>
  );
};

export default LeadCaptureStrip;
