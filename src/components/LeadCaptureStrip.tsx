import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const LeadCaptureStrip = () => {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    city: "Patna",
    model: "VF 7",
    interest: "Test Drive",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile) {
      toast.error("Please fill in your name and mobile number.");
      return;
    }
    toast.success("Thank you! Our EV advisor will contact you within 10 minutes.");
    setFormData({ name: "", mobile: "", city: "Patna", model: "VF 7", interest: "Test Drive" });
  };

  return (
    <section className="py-20 lg:py-28 section-dark relative overflow-hidden">
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
          className="max-w-4xl mx-auto glass-card p-6 lg:p-8"
        >
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <input
              type="text"
              placeholder="Your Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="h-12 px-4 rounded-xl bg-background/50 border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <input
              type="tel"
              placeholder="Mobile Number"
              value={formData.mobile}
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              className="h-12 px-4 rounded-xl bg-background/50 border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <select
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="h-12 px-4 rounded-xl bg-background/50 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="Patna">Patna</option>
              <option value="Muzaffarpur">Muzaffarpur</option>
              <option value="Gaya">Gaya</option>
              <option value="Other">Other</option>
            </select>
            <select
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              className="h-12 px-4 rounded-xl bg-background/50 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="VF 7">VF 7</option>
              <option value="VF 6">VF 6</option>
            </select>
            <Button type="submit" variant="hero" className="h-12">
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
