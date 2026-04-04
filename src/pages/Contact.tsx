import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import { toast } from "sonner";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { addEnquiry, addLead } from "@/lib/vfLocalStorage";
import type { Enquiry, Lead } from "@/data/mockData";
import { hasApi } from "@/lib/apiConfig";
import { formatApiErrors } from "@/lib/api";
import { submitPublicEnquiry, submitPublicLead } from "@/lib/publicFormsApi";
import { DEFAULT_VF7_TRIM, leadModelLabel } from "@/data/vinfastModels";
import { ModelTrimSelect } from "@/components/ModelTrimSelect";

const GOOGLE_MAPS_URL = "https://maps.app.goo.gl/6LioDasHnAeh2eus9";
const SHOWROOM_ADDRESS = "Plot No. 2421, NH 30, Bypass Road, Opposite Indian Oil Pump, Paijawa, Patna, Bihar - 800009";

const MOBILE_REGEX = /^[6-9]\d{9}$/;

const getLocalISODate = () => {
  // Returns YYYY-MM-DD in the user's local timezone.
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "", mobile: "", email: "", city: "Patna", model: "VF 7", variant: DEFAULT_VF7_TRIM,
    interest: "General Enquiry", message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile) {
      toast.error("Please fill name and mobile number.");
      return;
    }
    const mobileDigits = formData.mobile.replace(/\D/g, "").slice(0, 10);
    if (hasApi() && !MOBILE_REGEX.test(mobileDigits)) {
      toast.error("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    if (hasApi()) {
      try {
        await submitPublicEnquiry({
          name: formData.name,
          mobile: mobileDigits,
          email: formData.email,
          city: formData.city,
          model: formData.model,
          variant: formData.variant,
          interest: formData.interest,
          message: formData.message,
        });
        await submitPublicLead({
          name: formData.name,
          mobile: mobileDigits,
          city: formData.city,
          modelDisplay: leadModelLabel(formData.model, formData.variant),
          source: `Contact: ${formData.interest}`,
          email: formData.email,
          remarks: formData.message.trim() || `Interest: ${formData.interest}`,
          pageSource: "Contact Page",
        });
      } catch (err) {
        toast.error(formatApiErrors(err));
        return;
      }
      toast.success("Thank you! Our team will contact you within 10 minutes.");
      setFormData({ name: "", mobile: "", email: "", city: "Patna", model: "VF 7", variant: DEFAULT_VF7_TRIM, interest: "General Enquiry", message: "" });
      return;
    }

    try {
      const todayStr = getLocalISODate();
      const ts = Date.now();
      const enquiry: Enquiry = {
        id: `WE_${ts}`,
        name: formData.name.trim(),
        mobile: formData.mobile.trim(),
        email: formData.email.trim(),
        type: formData.interest,
        message: formData.message.trim(),
        status: "Open",
        createdAt: todayStr,
      };
      addEnquiry(enquiry);
      const lead: Lead = {
        id: `WL_${ts}`,
        name: formData.name.trim(),
        mobile: formData.mobile.trim(),
        email: formData.email.trim(),
        city: formData.city,
        model: leadModelLabel(formData.model, formData.variant),
        source: `Contact: ${formData.interest}`,
        status: "New Lead",
        assignedTo: "",
        createdAt: todayStr,
        nextFollowUp: "",
        remarks: formData.message.trim() || `Interest: ${formData.interest}`,
        financeNeeded: false,
        exchangeNeeded: false,
      };
      addLead(lead);
    } catch {
      toast.error("Could not save your enquiry (storage blocked or full). Please call or WhatsApp us.");
      return;
    }

    toast.success("Thank you! Our team will contact you within 10 minutes.");
    setFormData({ name: "", mobile: "", email: "", city: "Patna", model: "VF 7", variant: DEFAULT_VF7_TRIM, interest: "General Enquiry", message: "" });
  };

  const update = (field: string, value: string) => setFormData({ ...formData, [field]: value });
  const inputClass = "h-12 px-4 rounded-xl bg-background/50 border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-full";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20 lg:pt-32 lg:pb-32">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <p className="text-primary font-display font-semibold text-sm uppercase tracking-[0.2em] mb-3">Get in Touch</p>
            <h1 className="font-display font-bold text-4xl md:text-5xl mb-4">Contact Us</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Visit our showroom, call us, or fill the form below. We're here to help you go electric.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <div className="glass-card p-5 sm:p-8">
                <h3 className="font-display font-bold text-xl mb-6">Patna Showroom</h3>
                <div className="space-y-4">
                  {[
                    { icon: MapPin, text: SHOWROOM_ADDRESS, href: GOOGLE_MAPS_URL },
                    { icon: Phone, text: "+91 92314 45060", href: "tel:+919231445060" },
                    { icon: Mail, text: "info@patliputravinfast.com", href: "mailto:info@patliputravinfast.com" },
                    { icon: Clock, text: "10:00 AM – 8:00 PM, Monday – Saturday" },
                  ].map((item) => {
                    const Icon = item.icon;
                    const content = (
                      <div className="flex gap-4">
                        <Icon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-foreground/80 text-sm">{item.text}</span>
                      </div>
                    );
                    return item.href ? (
                      <a
                        key={item.text}
                        href={item.href}
                        target={item.href.startsWith("http") ? "_blank" : undefined}
                        rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="block hover:opacity-80 transition-opacity"
                      >
                        {content}
                      </a>
                    ) : (
                      <div key={item.text}>{content}</div>
                    );
                  })}
                </div>
              </div>

              <div className="glass-card p-8 aspect-video rounded-2xl overflow-hidden">
                <iframe
                  src={`https://www.google.com/maps?q=${encodeURIComponent(SHOWROOM_ADDRESS)}&output=embed`}
                  width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
                  title="Patliputra VinFast Showroom Location"
                  className="rounded-xl"
                />
              </div>

              <div className="flex gap-3">
                <a href="https://wa.me/919231445060" target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button variant="whatsapp" size="lg" className="w-full">
                    <MessageCircle className="w-5 h-5" /> WhatsApp Us
                  </Button>
                </a>
                <a href="tel:+919231445060" className="flex-1">
                  <Button variant="outline" size="lg" className="w-full">
                    <Phone className="w-5 h-5" /> Call Now
                  </Button>
                </a>
              </div>
            </motion.div>

            {/* Form */}
            <motion.form
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              onSubmit={handleSubmit} className="glass-card p-5 sm:p-8"
            >
              <h3 className="font-display font-bold text-xl mb-6">Send an Enquiry</h3>
              <div className="space-y-4">
                <input type="text" placeholder="Full Name *" value={formData.name} onChange={(e) => update("name", e.target.value)} className={inputClass} />
                <input type="tel" placeholder="Mobile Number *" value={formData.mobile} onChange={(e) => update("mobile", e.target.value)} className={inputClass} />
                <input type="email" placeholder="Email (Optional)" value={formData.email} onChange={(e) => update("email", e.target.value)} className={inputClass} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <ModelTrimSelect
                    model={formData.model}
                    variant={formData.variant}
                    onChange={(m, v) => setFormData({ ...formData, model: m, variant: v })}
                    className={inputClass}
                    includeNotSureBoth
                  />
                  <select value={formData.city} onChange={(e) => update("city", e.target.value)} className={inputClass}>
                    <option value="Patna">Patna</option>
                    <option value="Muzaffarpur">Muzaffarpur</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <select value={formData.interest} onChange={(e) => update("interest", e.target.value)} className={inputClass}>
                  <option value="General Enquiry">General Enquiry</option>
                  <option value="Get On-Road Price">Get On-Road Price</option>
                  <option value="Book Test Drive">Book Test Drive</option>
                  <option value="Finance Support">Finance Support</option>
                  <option value="Exchange Car">Exchange Car</option>
                  <option value="Corporate/Fleet">Corporate / Fleet</option>
                  <option value="Service">Service & Support</option>
                </select>
                <textarea placeholder="Your Message (Optional)" value={formData.message} onChange={(e) => update("message", e.target.value)} className={`${inputClass} h-24 py-3 resize-none`} />
                <Button type="submit" variant="hero" size="lg" className="w-full">Submit Enquiry</Button>
                <p className="text-center text-muted-foreground text-xs">We respect your privacy. No spam, ever.</p>
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

export default ContactPage;
