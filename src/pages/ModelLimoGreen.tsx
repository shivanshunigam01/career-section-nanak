import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import LeadCaptureStrip from "@/components/LeadCaptureStrip";
import Footer from "@/components/Footer";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import { toast } from "sonner";
import { addLead } from "@/lib/vfLocalStorage";
import type { Lead } from "@/data/mockData";
import { hasApi, isPublicFormPostDisabled, PUBLIC_FORM_POST_DISABLED_MESSAGE } from "@/lib/apiConfig";
import { formatApiErrors } from "@/lib/api";
import { submitPublicLead } from "@/lib/publicFormsApi";
import { DEFAULT_LIMO_GREEN_TRIM, leadModelLabel } from "@/data/vinfastModels";
import { BiharDistrictField } from "@/components/BiharDistrictField";
import { FormCaptcha } from "@/components/FormCaptcha";
import { BIHAR_DEFAULT_DISTRICT, DISTRICT_OTHER } from "@/data/biharDistricts";
import { usePublicFormRecaptcha } from "@/context/PublicRecaptchaContext";
import { usePublicSite } from "@/context/PublicSiteContext";
import { ModelPagePriceBand } from "@/components/model/ModelPagePriceBand";
import { ModelPageHighlightsBlock } from "@/components/model/ModelPageHighlightsBlock";
import { ModelPageInteriorBand } from "@/components/model/ModelPageInteriorBand";
import { ModelPageVehicleSpecSection } from "@/components/model/ModelPageVehicleSpecSection";
import { ModelPageNextStepSection } from "@/components/model/ModelPageNextStepSection";
import { MODEL_SECTION_PY } from "@/components/model/modelPageLayout";
import { usePageSeo } from "@/hooks/usePageSeo";
import { LIMO_GREEN_PAGE_SEO } from "@/lib/seoBlueprint";
import { WhatsAppOtpVerify } from "@/components/WhatsAppOtpVerify";
import limoGreenHeroDesktop from "@/assets/limo-green/hero-desktop.jpg";
import limoGreenHeroPortrait from "@/assets/limo-green/modal-car.webp";
import limoGreenIntro from "@/assets/limo-green/intro-car.webp";
import limoGreenDesign from "@/assets/limo-green/design-car.webp";
import limoGreenInterior from "@/assets/limo-green/interior-gallery.webp";
import limoGreenColorSilver from "@/assets/limo-green/color-silver.webp";
import limoGreenFooterBanner from "@/assets/limo-green/limo-green-footer.webp";

const LIMO_GREEN_PREBOOK_SESSION_KEY = "vinfast_limo_green_prebook_unlocked";
const LIMO_GREEN_PREBOOK_UNLOCK_EVENT = "vinfast-limo-green-prebook-unlock";
const MOBILE_REGEX = /^[6-9]\d{9}$/;

const getLocalISODate = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const VINFAST_LIMO_GREEN_DISCLAIMER =
  "Image is for representation purpose only. Actual car features and details may vary.";

/** Vehicle Specification table — VinFast Limo Green (India). */
const specRows: [string, string][] = [
  ["Overall dimension (LxWxH) (mm)", "4740 x 1872 x 1729"],
  ["Wheel base (mm)", "2840 mm"],
  ["Seating capacity", "7 seats (2+3+2)"],
  ["Usable Battery Capacity", "60.13 kWh (LFP)"],
  ["Range (NEDC)", "Up to 450 km"],
  ["Max power / torque", "150 kW (201 hp) / 280 Nm"],
  ["Drivetrain", "Front-wheel drive, single-speed"],
  ["Fast Charging 10% to 70%", "30 mins"],
  ["Selectable driving mode", "Eco/Normal"],
  ["Boot space (rear seats folded)", "1,240 L"],
  ["Infotainment", "10.1-inch touchscreen"],
  ["Braking & Stability Assistance", "ABS, EBD, ESC"],
  ["Electronic Parking Brake", "YES"],
  ["Tire Pressure Monitoring System (TPMS)", "YES"],
];

const limoGreenHighlightTriplet: { label: string; value: string }[] = [
  { label: "Range (NEDC)", value: "450 km" },
  { label: "Battery Capacity", value: "60.13 kWh" },
  { label: "Seats", value: "7 (2+3+2)" },
];

const inputClass =
  "h-12 px-4 rounded-xl bg-background/50 border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-full";

const ModelLimoGreen = () => {
  const { siteConfig } = usePublicSite();
  const { getToken } = usePublicFormRecaptcha();
  const location = useLocation();
  usePageSeo(LIMO_GREEN_PAGE_SEO);
  const [prebookUnlocked, setPrebookUnlocked] = useState(
    () => typeof sessionStorage !== "undefined" && sessionStorage.getItem(LIMO_GREEN_PREBOOK_SESSION_KEY) === "1",
  );
  const [interestForm, setInterestForm] = useState({
    name: "",
    mobile: "",
    email: "",
    city: BIHAR_DEFAULT_DISTRICT,
    otherCity: "",
  });
  const [mobileError, setMobileError] = useState("");
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaResetSignal, setCaptchaResetSignal] = useState(0);
  const [waToken, setWaToken] = useState<string | null>(null);
  const onWaTokenChange = useCallback((t: string | null) => setWaToken(t), []);
  const todayStr = getLocalISODate();

  useEffect(() => {
    if (location.hash !== "#limo-green-prebook") return;
    const t = window.setTimeout(() => {
      document.getElementById("limo-green-prebook")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
    return () => clearTimeout(t);
  }, [location.hash, location.pathname]);

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
    setInterestForm({ ...interestForm, mobile: digits });
    if (digits.length === 0) setMobileError("");
    else if (digits.length < 10) setMobileError("Mobile number must be 10 digits.");
    else if (MOBILE_REGEX.test(digits)) setMobileError("");
    else setMobileError("Enter a valid Indian mobile number (starts with 6–9).");
  };

  const handlePrebookInterestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!interestForm.name.trim()) {
      toast.error("Please enter your full name.");
      return;
    }
    if (!interestForm.mobile || !MOBILE_REGEX.test(interestForm.mobile)) {
      toast.error("Please enter a valid 10-digit Indian mobile number.");
      return;
    }
    if (interestForm.city === DISTRICT_OTHER && !interestForm.otherCity.trim()) {
      toast.error("Please enter your city or district (outside Bihar).");
      return;
    }
    if (!captchaVerified) {
      toast.error("Please complete captcha verification.");
      return;
    }
    if (hasApi() && siteConfig.features?.whatsappOtp && !waToken) {
      toast.error("Please verify your mobile number with the WhatsApp code we send you.");
      return;
    }

    const modelDisplay = leadModelLabel("Limo Green", DEFAULT_LIMO_GREEN_TRIM);

    let apiSuccessMessage: string | undefined;
    if (hasApi() && !isPublicFormPostDisabled()) {
      let recaptchaToken: string | undefined;
      try {
        recaptchaToken = await getToken("limo_green_prebook");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Security verification failed.");
        return;
      }
      try {
        const res = await submitPublicLead({
          name: interestForm.name.trim(),
          mobile: interestForm.mobile,
          city: interestForm.city === DISTRICT_OTHER ? DISTRICT_OTHER : interestForm.city,
          otherCity: interestForm.city === DISTRICT_OTHER ? interestForm.otherCity : "",
          modelDisplay,
          source: "Website",
          email: interestForm.email.trim(),
          remarks: "Limo Green Book Now interest — form gate on model page",
          interest: "Book Now",
          financeNeeded: false,
          exchangeNeeded: false,
          pageSource: "Limo Green Model Page",
          recaptchaToken,
          whatsappVerificationToken: waToken ?? undefined,
        });
        apiSuccessMessage = res.message;
      } catch (err) {
        toast.error(formatApiErrors(err));
        return;
      }
    } else if (hasApi() && isPublicFormPostDisabled()) {
      apiSuccessMessage = PUBLIC_FORM_POST_DISABLED_MESSAGE;
    } else {
      try {
        const lead: Lead = {
          id: `WL_${Date.now()}`,
          name: interestForm.name.trim(),
          mobile: interestForm.mobile,
          email: interestForm.email.trim(),
          city:
            interestForm.city === DISTRICT_OTHER
              ? interestForm.otherCity.trim() || DISTRICT_OTHER
              : interestForm.city,
          model: modelDisplay,
          source: "Website",
          status: "Interested",
          assignedTo: "",
          createdAt: todayStr,
          nextFollowUp: "",
          remarks: "Limo Green Book Now interest — form gate on model page",
          financeNeeded: false,
          exchangeNeeded: false,
        };
        addLead(lead);
      } catch {
        toast.error("Could not save your request. Please call or WhatsApp us.");
        return;
      }
    }

    sessionStorage.setItem(LIMO_GREEN_PREBOOK_SESSION_KEY, "1");
    window.dispatchEvent(new Event(LIMO_GREEN_PREBOOK_UNLOCK_EVENT));
    setPrebookUnlocked(true);
    toast.success(
      apiSuccessMessage ?? "Thank you! You can now continue to complete your Limo Green Book Now.",
    );
    setInterestForm({ name: "", mobile: "", email: "", city: BIHAR_DEFAULT_DISTRICT, otherCity: "" });
    setMobileError("");
    setCaptchaResetSignal((n) => n + 1);
  };

  return (
    <div className="public-page-shell">
      <Navbar />

      {/* Mobile: portrait hero; lg+: official wide hero banner */}
      <section
        className="relative z-0 w-full max-w-none overflow-hidden bg-background pt-[4.25rem] lg:h-screen lg:max-h-[min(100vh,1280px)] lg:min-h-[600px] lg:pt-0"
        aria-label="VinFast Limo Green hero"
      >
        <div className="relative w-full max-w-none shrink-0 overflow-hidden h-[clamp(240px,72dvh,calc(100dvh-4.25rem))] min-h-[240px] max-h-[calc(100dvh-4.25rem)] lg:hidden">
          <div className="hero-media-scrim absolute inset-0 overflow-hidden [transform:translateZ(0)]">
            <img
              src={limoGreenHeroPortrait}
              alt="White VinFast Limo Green electric MPV parked in front of a modern glass building"
              className="hero-slider-image h-full w-full object-cover"
              style={{ objectPosition: "center 62%" }}
              sizes="100vw"
              fetchPriority="high"
              decoding="async"
            />
          </div>
        </div>
        <div className="relative hidden lg:block lg:absolute lg:inset-0 lg:min-h-0">
          <div className="hero-media-scrim absolute inset-0 overflow-hidden">
            <img
              src={limoGreenHeroDesktop}
              alt="VinFast Limo Green — built for your business"
              className="hero-slider-image h-full w-full object-cover object-[50%_45%]"
              sizes="100vw"
              fetchPriority="high"
              decoding="async"
            />
          </div>
        </div>
        <h1 className="sr-only">VinFast Limo Green — Built for your business.</h1>
      </section>

      <ModelPagePriceBand
        festiveSlug="limo-green"
        primaryCta={{ href: "#limo-green-prebook", label: "Register for Book Now" }}
        secondaryCta={{ href: "/test-drive", label: "Book a test drive" }}
      />

      <ModelPageHighlightsBlock
        sectionTitle="Built for your business."
        productName="Limo Green"
        description="A seven-seat electric MPV made for long days on the road — spacious, dependable, and affordable to run, for families and fleets alike."
        highlights={limoGreenHighlightTriplet}
        disclaimer={VINFAST_LIMO_GREEN_DISCLAIMER}
        actions={
          <>
            <Button asChild variant="default" size="default">
              <Link to="#limo-green-prebook">Register for Book Now</Link>
            </Button>
            {prebookUnlocked ? (
              <Button asChild variant="default" size="default" className="bg-primary">
                <Link to="/book-now?model=Limo%20Green">Book Now — Limo Green</Link>
              </Button>
            ) : null}
          </>
        }
      />

      <section className={`${MODEL_SECTION_PY} border-b border-border/60 bg-background`}>
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <div className="relative w-full overflow-hidden rounded-2xl bg-card/60 border border-border/60">
            <img
              src={limoGreenIntro}
              alt="VinFast Limo Green — rear three-quarter studio view"
              className="image-high-quality w-full h-auto object-contain"
              sizes="(max-width: 1024px) 100vw, 1024px"
              loading="lazy"
              decoding="async"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-4 text-center max-w-2xl mx-auto">{VINFAST_LIMO_GREEN_DISCLAIMER}</p>
        </div>
      </section>

      {/* Design */}
      <section className="py-14 sm:py-20 lg:py-24 border-b border-border/60 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-4 text-foreground">Design that works as hard as you do.</h2>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-8 max-w-3xl">
            Clean SUV-inspired lines, a signature V-motif front, and full-width light bars — a
            modern face for a practical people-mover.
          </p>
          <div className="relative w-full overflow-hidden">
            <img
              src={limoGreenDesign}
              alt="VinFast Limo Green — front three-quarter studio view with signature V-motif lighting"
              className="image-high-quality w-full h-auto object-contain"
              sizes="(max-width: 1024px) 100vw, 1024px"
              loading="lazy"
              decoding="async"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-4 text-center max-w-2xl mx-auto">{VINFAST_LIMO_GREEN_DISCLAIMER}</p>
        </div>
      </section>

      <ModelPageInteriorBand
        title="Room for everyone."
        description="A 2+3+2 layout with a quick-folding middle row, a long 2,840 mm wheelbase, and up to 1,240 litres of boot space with the rear seats folded."
        imageSrc={limoGreenInterior}
        imageAlt="VinFast Limo Green interior — seven-seat cabin with 10.1-inch touchscreen"
        disclaimer={VINFAST_LIMO_GREEN_DISCLAIMER}
      />

      {/* Colour */}
      <section className="py-14 sm:py-20 lg:py-24 border-b border-border/60 bg-muted/25">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <div className="text-center mb-8">
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-3 text-foreground">Choose your colour</h2>
            <p className="text-muted-foreground text-sm md:text-base">Desat Silver</p>
          </div>
          <div className="relative w-full overflow-hidden rounded-2xl bg-card/60 border border-border/60">
            <img
              src={limoGreenColorSilver}
              alt="VinFast Limo Green in Desat Silver — side profile"
              className="image-high-quality w-full h-auto object-contain"
              sizes="(max-width: 1024px) 100vw, 1024px"
              loading="lazy"
              decoding="async"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-4 text-center max-w-2xl mx-auto">{VINFAST_LIMO_GREEN_DISCLAIMER}</p>
        </div>
      </section>

      <ModelPageVehicleSpecSection disclaimer={VINFAST_LIMO_GREEN_DISCLAIMER}>
        <div className="overflow-x-auto touch-pan-x rounded-2xl border border-border/80 bg-card/40 max-w-4xl mx-auto">
          <table className="w-full min-w-[320px] text-sm text-left">
            <tbody>
              {specRows.map(([k, v]) => (
                <tr key={k} className="border-b border-border/60 last:border-0">
                  <th className="px-4 py-3 font-medium text-muted-foreground w-[45%] align-top">{k}</th>
                  <td className="px-4 py-3 align-top text-foreground/90">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ModelPageVehicleSpecSection>

      <ModelPageNextStepSection
        id="limo-green-prebook"
        eyebrow="Limo Green · Book Now"
        description={
          <>
            Share your details — we’ll call you back from Patna. After you submit, the{" "}
            <strong className="text-foreground font-medium">Book Now — Limo Green</strong> action unlocks on this page.
          </>
        }
        bookHref="/book-now?model=Limo%20Green"
        bookLabel="Book Now — Limo Green"
      >
            {!prebookUnlocked ? (
              <form onSubmit={handlePrebookInterestSubmit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:gap-3 lg:items-start">
                <div className="sm:col-span-2 lg:col-span-3">
                  <label htmlFor="limo-green-pb-name" className="sr-only">
                    Full name
                  </label>
                  <input
                    id="limo-green-pb-name"
                    type="text"
                    placeholder="Full name *"
                    value={interestForm.name}
                    onChange={(e) => setInterestForm({ ...interestForm, name: e.target.value })}
                    className={inputClass}
                    autoComplete="name"
                  />
                </div>
                <div className="sm:col-span-2 lg:col-span-3">
                  <label htmlFor="limo-green-pb-mobile" className="sr-only">
                    Mobile
                  </label>
                  <input
                    id="limo-green-pb-mobile"
                    type="tel"
                    placeholder="Mobile number *"
                    value={interestForm.mobile}
                    onChange={handleMobileChange}
                    maxLength={10}
                    inputMode="numeric"
                    className={`${inputClass} ${mobileError ? "border-red-500 focus:ring-red-500/50" : ""}`}
                    autoComplete="tel"
                  />
                  {mobileError && <p className="text-red-500 text-[11px] mt-1 px-1">{mobileError}</p>}
                </div>
                <div className="sm:col-span-1 lg:col-span-2">
                  <label htmlFor="limo-green-pb-email" className="sr-only">
                    Email
                  </label>
                  <input
                    id="limo-green-pb-email"
                    type="email"
                    placeholder="Email"
                    value={interestForm.email}
                    onChange={(e) => setInterestForm({ ...interestForm, email: e.target.value })}
                    className={inputClass}
                    autoComplete="email"
                  />
                </div>
                {hasApi() && siteConfig.features?.whatsappOtp && (
                  <div className="sm:col-span-2 lg:col-span-12">
                    <WhatsAppOtpVerify
                      mobile={interestForm.mobile.replace(/\D/g, "").slice(0, 10)}
                      displayName={interestForm.name.trim() || "Customer"}
                      recaptchaAction="limo_green_prebook_whatsapp_otp"
                      enabled
                      onTokenChange={onWaTokenChange}
                    />
                  </div>
                )}
                <BiharDistrictField
                  id="limo-green-pb-district"
                  label="District (Bihar)"
                  labelClassName="sr-only"
                  selectClassName={inputClass}
                  otherInputClassName={`${inputClass} border-primary/50`}
                  value={interestForm.city}
                  otherValue={interestForm.otherCity}
                  onDistrictChange={(city) => setInterestForm({ ...interestForm, city, otherCity: "" })}
                  onOtherChange={(otherCity) => setInterestForm({ ...interestForm, otherCity })}
                  fullWidthOtherRow
                  otherFieldLabel="City / state / district *"
                  selectWrapperClassName="sm:col-span-1 lg:col-span-2"
                  otherRowClassName="sm:col-span-2 lg:col-span-12"
                />
                <div className="sm:col-span-2 lg:col-span-12">
                  <FormCaptcha onVerifyChange={setCaptchaVerified} resetSignal={captchaResetSignal} />
                </div>
                <div className="sm:col-span-2 lg:col-span-2 flex lg:pt-0">
                  <Button
                    type="submit"
                    variant="hero"
                    size="lg"
                    className="w-full lg:w-auto lg:shrink-0"
                    disabled={Boolean(hasApi() && siteConfig.features?.whatsappOtp && !waToken)}
                  >
                    Submit
                  </Button>
                </div>
                <p className="sm:col-span-2 lg:col-span-12 text-center lg:text-left text-muted-foreground text-xs">
                  By submitting, you agree to be contacted about Limo Green.
                </p>
              </form>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-center sm:text-left">
                <p className="text-sm text-muted-foreground">
                  You&apos;re set — continue on Book Now with Limo Green pre-selected.
                </p>
                <Button variant="hero" size="lg" asChild>
                  <Link to="/book-now?model=Limo%20Green">Book Now — Limo Green</Link>
                </Button>
              </div>
            )}
      </ModelPageNextStepSection>

      {/* Closing banner */}
      <section className="relative w-full overflow-hidden">
        <img
          src={limoGreenFooterBanner}
          alt="VinFast Limo Green electric MPV on the road"
          className="image-high-quality w-full h-[36vh] min-h-[240px] max-h-[560px] sm:h-[48vh] lg:h-[60vh] object-cover object-center"
          sizes="100vw"
          loading="lazy"
          decoding="async"
        />
      </section>

      <LeadCaptureStrip />
      <Footer />
      <StickyMobileCTA />
    </div>
  );
};

export default ModelLimoGreen;
