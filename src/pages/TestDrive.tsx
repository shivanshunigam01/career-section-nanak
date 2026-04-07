import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import { toast } from "sonner";
import { CalendarDays, Calendar as CalendarIcon, MapPin, Car } from "lucide-react";
import { cn } from "@/lib/utils";
import { addLead, addTestDriveBooking } from "@/lib/vfLocalStorage";
import type { Lead, TestDriveBooking } from "@/data/mockData";
import { hasApi } from "@/lib/apiConfig";
import { formatApiErrors } from "@/lib/api";
import { submitPublicTestDrive } from "@/lib/publicFormsApi";
import { DEFAULT_VF7_TRIM, leadModelLabel } from "@/data/vinfastModels";
import { ModelTrimSelect } from "@/components/ModelTrimSelect";
import { BiharDistrictField } from "@/components/BiharDistrictField";
import { BIHAR_DEFAULT_DISTRICT, DISTRICT_OTHER, resolvedDistrictLabel } from "@/data/biharDistricts";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  OWNS_CAR_OPTIONS,
  PURCHASE_TIMELINE_OPTIONS,
  TEST_DRIVE_LOCATION_OPTIONS,
} from "@/data/testDriveFormOptions";

const MOBILE_REGEX = /^[6-9]\d{9}$/;

/** First calendar day of each month that accepts test-drive bookings (days 1–9 are blocked). */
const MIN_TEST_DRIVE_DAY_OF_MONTH = 10;

function isTestDriveBookableDate(d: Date): boolean {
  const start = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (start < todayStart) return false;
  if (d.getDate() < MIN_TEST_DRIVE_DAY_OF_MONTH) return false;
  return true;
}

function toISODateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

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
    name: "",
    mobile: "",
    email: "",
    city: BIHAR_DEFAULT_DISTRICT,
    otherCity: "",
    model: "VF 7",
    variant: DEFAULT_VF7_TRIM,
    preferredTestDriveLocation: "",
    ownsCar: "",
    currentCarDetails: "",
    purchaseTimeline: "",
    date: "",
    time: "",
    remarks: "",
  });
  const [mobileError, setMobileError] = useState("");
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const todayStr = getLocalISODate();
  const selectedCalendarDate = formData.date
    ? new Date(`${formData.date}T12:00:00`)
    : undefined;

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

  const handleSubmit = async (e: React.FormEvent) => {
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

    const selected = new Date(`${formData.date}T12:00:00`);
    if (Number.isNaN(selected.getTime())) {
      toast.error("Please select a valid preferred date.");
      return;
    }
    if (!isTestDriveBookableDate(selected)) {
      toast.error(
        `Test drives can be booked from the ${MIN_TEST_DRIVE_DAY_OF_MONTH}th of each month onward (past dates are not allowed).`,
      );
      return;
    }
    if (formData.city === DISTRICT_OTHER && !formData.otherCity.trim()) {
      toast.error("Please enter your city or district (outside Bihar).");
      return;
    }
    if (!formData.preferredTestDriveLocation) {
      toast.error("Please choose a preferred test drive location.");
      return;
    }
    if (!formData.ownsCar) {
      toast.error("Please answer whether you currently own a car.");
      return;
    }
    if (formData.ownsCar === "Yes" && !formData.currentCarDetails.trim()) {
      toast.error("Please enter your current car (model / brand).");
      return;
    }
    if (!formData.purchaseTimeline) {
      toast.error("Please select when you are planning to purchase.");
      return;
    }

    const modelLine = leadModelLabel(formData.model, formData.variant);
    const cityResolved = resolvedDistrictLabel(formData.city, formData.otherCity);

    if (hasApi()) {
      try {
        await submitPublicTestDrive({
          customerName: formData.name.trim(),
          mobile: formData.mobile,
          email: formData.email.trim(),
          city: cityResolved,
          model: formData.model,
          variant: formData.variant,
          preferredDate: formData.date,
          preferredTime: formData.time,
          branch: "Patna Showroom",
          remarks: formData.remarks?.trim() ? formData.remarks.trim() : `Preferred: ${formData.date} ${formData.time}`,
          pageSource: "Test Drive Page",
          preferredTestDriveLocation: formData.preferredTestDriveLocation,
          ownsCar: formData.ownsCar,
          currentCarDetails:
            formData.ownsCar === "Yes" ? formData.currentCarDetails.trim() : undefined,
          purchaseTimeline: formData.purchaseTimeline,
        });
      } catch (err) {
        toast.error(formatApiErrors(err));
        return;
      }
      toast.success("Test drive booked! We'll confirm your slot shortly via SMS.");
      setFormData({
        name: "",
        mobile: "",
        email: "",
        city: BIHAR_DEFAULT_DISTRICT,
        otherCity: "",
        model: "VF 7",
        variant: DEFAULT_VF7_TRIM,
        preferredTestDriveLocation: "",
        ownsCar: "",
        currentCarDetails: "",
        purchaseTimeline: "",
        date: "",
        time: "",
        remarks: "",
      });
      setMobileError("");
      return;
    }

    try {
      const leadId = `WL_${Date.now()}`;
      const tdMeta = [
        `TD location: ${formData.preferredTestDriveLocation}`,
        formData.ownsCar === "Yes"
          ? `Owns car: Yes — ${formData.currentCarDetails.trim()}`
          : "Owns car: No",
        `Purchase plan: ${formData.purchaseTimeline}`,
      ].join(" | ");
      const lead: Lead = {
        id: leadId,
        name: formData.name.trim(),
        mobile: formData.mobile,
        email: formData.email.trim(),
        city: cityResolved,
        model: modelLine,
        source: "Test Drive",
        status: "Test Drive Scheduled",
        assignedTo: "",
        createdAt: todayStr,
        nextFollowUp: "",
        remarks: [formData.remarks?.trim(), tdMeta, `Preferred: ${formData.date} ${formData.time}`]
          .filter(Boolean)
          .join(" | "),
        financeNeeded: false,
        exchangeNeeded: false,
      };

      const booking: TestDriveBooking = {
        id: `WTD_${Date.now()}`,
        leadId,
        customerName: formData.name.trim(),
        mobile: formData.mobile,
        model: modelLine,
        preferredDate: formData.date,
        preferredTime: formData.time,
        branch: "Patna Showroom",
        preferredTestDriveLocation: formData.preferredTestDriveLocation,
        ownsCar: formData.ownsCar,
        currentCarDetails:
          formData.ownsCar === "Yes" ? formData.currentCarDetails.trim() : "",
        purchaseTimeline: formData.purchaseTimeline,
        status: "Pending",
        assignedExecutive: "",
        feedback: "",
        createdAt: todayStr,
      };

      addLead(lead);
      addTestDriveBooking(booking);
    } catch {
      toast.error("Could not save your booking (storage blocked or full). Please call or WhatsApp us.");
      return;
    }

    toast.success("Test drive booked! We'll confirm your slot shortly via SMS.");
    setFormData({
      name: "",
      mobile: "",
      email: "",
      city: BIHAR_DEFAULT_DISTRICT,
      otherCity: "",
      model: "VF 7",
      variant: DEFAULT_VF7_TRIM,
      preferredTestDriveLocation: "",
      ownsCar: "",
      currentCarDetails: "",
      purchaseTimeline: "",
      date: "",
      time: "",
      remarks: "",
    });
    setMobileError("");
  };

  const update = (field: string, value: string) =>
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "ownsCar" && value !== "Yes" ? { currentCarDetails: "" } : {}),
    }));

  const inputClass =
    "h-12 px-4 rounded-xl bg-background/50 border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-full min-w-0";
  const labelClass = "text-xs font-medium text-muted-foreground";
  const fieldBlockClass = "flex flex-col gap-2 min-w-0";

  return (
    <div className="min-h-screen bg-background pb-36 lg:pb-0">
      <Navbar />
      <div className="pt-24 pb-36 lg:pt-32 lg:pb-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 sm:gap-14 lg:gap-16 items-start">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <p className="text-primary font-display font-semibold text-sm uppercase tracking-[0.2em] mb-3">Test Drive</p>
              <h1 className="font-display font-bold text-4xl md:text-5xl mb-6">Experience the Future</h1>
              <p className="text-muted-foreground text-lg mb-6 max-w-lg">
                Schedule a complimentary test drive with a date and time. For buying or reserving a vehicle, use{" "}
                <Link to="/book-now" className="text-primary font-medium hover:underline">
                  Book Now
                </Link>
                .
              </p>
              <div className="space-y-6">
                {[
                  { icon: Car, title: "Choose Your Model", desc: "Select VF 6 or VF 7 for your test drive experience." },
                  {
                    icon: CalendarDays,
                    title: "Pick a Date",
                    desc: `Bookings open from the ${MIN_TEST_DRIVE_DAY_OF_MONTH}th of each month. We're available Mon–Sat.`,
                  },
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
              className="glass-card p-5 sm:p-8 min-w-0"
            >
              <h3 className="font-display font-bold text-xl mb-2">Schedule your test drive</h3>
              <p className="text-muted-foreground text-sm mb-6">
                {`Date and time apply only to test drives. The first selectable day each month is the ${MIN_TEST_DRIVE_DAY_OF_MONTH}th (days 1–9 are blocked).`}
              </p>
              <div className="space-y-4">
                <div className={fieldBlockClass}>
                  <label htmlFor="td-name" className={labelClass}>
                    Full name *
                  </label>
                  <input
                    id="td-name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => update("name", e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className={fieldBlockClass}>
                  <label htmlFor="td-mobile" className={labelClass}>
                    Mobile number *
                  </label>
                  <input
                    id="td-mobile"
                    type="tel"
                    placeholder="10-digit mobile"
                    value={formData.mobile}
                    onChange={handleMobileChange}
                    maxLength={10}
                    inputMode="numeric"
                    className={`${inputClass} ${mobileError ? "border-red-500 focus:ring-red-500/50" : ""}`}
                  />
                  {mobileError ? <p className="text-red-500 text-[11px] leading-tight">{mobileError}</p> : null}
                </div>
                <div className={fieldBlockClass}>
                  <label htmlFor="td-email" className={labelClass}>
                    Email (optional)
                  </label>
                  <input
                    id="td-email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => update("email", e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                  <div className={fieldBlockClass}>
                    <label htmlFor="td-model-trim" className={labelClass}>
                      Select your test drive *
                    </label>
                    <ModelTrimSelect
                      id="td-model-trim"
                      model={formData.model}
                      variant={formData.variant}
                      onChange={(m, v) => setFormData({ ...formData, model: m, variant: v })}
                      className={inputClass}
                    />
                  </div>
                  <BiharDistrictField
                    id="td-district"
                    label="District (Bihar) *"
                    selectClassName={inputClass}
                    otherInputClassName={`${inputClass} border-primary/50`}
                    value={formData.city}
                    otherValue={formData.otherCity}
                    onDistrictChange={(city) => setFormData({ ...formData, city, otherCity: "" })}
                    onOtherChange={(otherCity) => setFormData({ ...formData, otherCity })}
                    fullWidthOtherRow
                    otherFieldLabel="City / state / district *"
                  />
                </div>

                <div className={fieldBlockClass}>
                  <span className={labelClass}>Preferred test drive location *</span>
                  <RadioGroup
                    value={formData.preferredTestDriveLocation}
                    onValueChange={(v) => update("preferredTestDriveLocation", v)}
                    className="grid gap-2 sm:grid-cols-2"
                  >
                    {TEST_DRIVE_LOCATION_OPTIONS.map((opt) => (
                      <div
                        key={opt}
                        className="flex items-center gap-2 rounded-xl border border-border/60 bg-background/30 px-3 py-2.5"
                      >
                        <RadioGroupItem value={opt} id={`td-loc-${opt.replace(/\s+/g, "-")}`} />
                        <Label
                          htmlFor={`td-loc-${opt.replace(/\s+/g, "-")}`}
                          className="text-sm font-normal cursor-pointer leading-snug"
                        >
                          {opt}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className={fieldBlockClass}>
                  <span className={labelClass}>Do you currently own a car? *</span>
                  <RadioGroup
                    value={formData.ownsCar}
                    onValueChange={(v) => update("ownsCar", v)}
                    className="flex flex-wrap gap-3"
                  >
                    {OWNS_CAR_OPTIONS.map((opt) => (
                      <div
                        key={opt}
                        className="flex items-center gap-2 rounded-xl border border-border/60 bg-background/30 px-3 py-2.5"
                      >
                        <RadioGroupItem value={opt} id={`td-own-${opt}`} />
                        <Label htmlFor={`td-own-${opt}`} className="text-sm font-normal cursor-pointer">
                          {opt}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {formData.ownsCar === "Yes" ? (
                  <div className={fieldBlockClass}>
                    <label htmlFor="td-current-car" className={labelClass}>
                      Which car? (model / brand) *
                    </label>
                    <input
                      id="td-current-car"
                      type="text"
                      placeholder="e.g. Honda City, Maruti Swift"
                      value={formData.currentCarDetails}
                      onChange={(e) => update("currentCarDetails", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                ) : null}

                <div className={fieldBlockClass}>
                  <span className={labelClass}>Are you planning to purchase within? *</span>
                  <RadioGroup
                    value={formData.purchaseTimeline}
                    onValueChange={(v) => update("purchaseTimeline", v)}
                    className="grid gap-2 sm:grid-cols-2"
                  >
                    {PURCHASE_TIMELINE_OPTIONS.map((opt, i) => (
                      <div
                        key={opt}
                        className="flex items-center gap-2 rounded-xl border border-border/60 bg-background/30 px-3 py-2.5"
                      >
                        <RadioGroupItem value={opt} id={`td-buy-${i}`} />
                        <Label htmlFor={`td-buy-${i}`} className="text-sm font-normal cursor-pointer leading-snug">
                          {opt}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                  <div className={fieldBlockClass}>
                    <span id="td-date-label" className={labelClass}>
                      Preferred date *
                    </span>
                    <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          aria-labelledby="td-date-label"
                          className={cn(
                            "h-12 w-full min-w-0 justify-start text-left font-normal rounded-xl border-border bg-background/50 px-4",
                            !formData.date && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 shrink-0 opacity-70" />
                          <span className="truncate">
                            {formData.date
                              ? format(new Date(`${formData.date}T12:00:00`), "dd MMM yyyy")
                              : "Pick date"}
                          </span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedCalendarDate}
                          onSelect={(d) => {
                            if (!d) return;
                            if (!isTestDriveBookableDate(d)) return;
                            update("date", toISODateString(d));
                            setDatePickerOpen(false);
                          }}
                          disabled={(date) => !isTestDriveBookableDate(date)}
                          defaultMonth={selectedCalendarDate ?? new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className={fieldBlockClass}>
                    <label htmlFor="td-time" className={labelClass}>
                      Preferred time
                    </label>
                    <select
                      id="td-time"
                      value={formData.time}
                      onChange={(e) => update("time", e.target.value)}
                      className={inputClass}
                    >
                      <option value="">Select time</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="12:00 PM">12:00 PM</option>
                      <option value="02:00 PM">02:00 PM</option>
                      <option value="03:00 PM">03:00 PM</option>
                      <option value="04:00 PM">04:00 PM</option>
                      <option value="05:00 PM">05:00 PM</option>
                    </select>
                  </div>
                </div>
                <div className={fieldBlockClass}>
                  <label htmlFor="td-remarks" className={labelClass}>
                    Remarks (optional)
                  </label>
                  <textarea
                    id="td-remarks"
                    placeholder="Any special requests…"
                    value={formData.remarks}
                    onChange={(e) => update("remarks", e.target.value)}
                    className={`${inputClass} h-24 py-3 resize-none`}
                  />
                </div>
                <Button type="submit" variant="hero" size="lg" className="w-full">
                  Confirm Test Drive
                </Button>
                <p className="text-center text-muted-foreground text-xs">By submitting, you agree to our privacy policy.</p>
                <p className="text-center text-muted-foreground text-xs pt-1">
                  Ready to buy?{" "}
                  <Link to="/book-now" className="text-primary font-medium hover:underline">
                    Go to Book Now
                  </Link>
                </p>
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
