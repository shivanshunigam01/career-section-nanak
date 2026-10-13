import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { BiharDistrictField } from "@/components/BiharDistrictField";
import { FormCaptcha } from "@/components/FormCaptcha";
import { WhatsAppOtpVerify } from "@/components/WhatsAppOtpVerify";
import { usePublicFormRecaptcha } from "@/context/PublicRecaptchaContext";
import { usePublicSite } from "@/context/PublicSiteContext";
import { formatApiErrors } from "@/lib/api";
import { hasApi, isPublicFormPostDisabled, PUBLIC_FORM_POST_DISABLED_MESSAGE } from "@/lib/apiConfig";
import { submitPublicLead } from "@/lib/publicFormsApi";
import { addLead } from "@/lib/vfLocalStorage";
import type { Lead } from "@/data/mockData";
import { BIHAR_DEFAULT_DISTRICT, DISTRICT_OTHER } from "@/data/biharDistricts";
import { modelBaseNameFromKey } from "@/lib/tco/tcoVehicleData";
import type { CompareModelKey } from "@/data/compareCatalog";
import { formatInr } from "@/lib/tco/formatInr";

const MOBILE_REGEX = /^[6-9]\d{9}$/;

type Props = {
  modelKey: CompareModelKey;
  variantLabel: string;
  ownershipYears: number;
  estimatedSavings: number | null;
};

export function TcoLeadActions({ modelKey, variantLabel, ownershipYears, estimatedSavings }: Props) {
  const { siteConfig } = usePublicSite();
  const whatsappOtpEnabled = Boolean(siteConfig.features?.whatsappOtp);
  const { getToken } = usePublicFormRecaptcha();
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [city, setCity] = useState(BIHAR_DEFAULT_DISTRICT);
  const [otherCity, setOtherCity] = useState("");
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaResetSignal, setCaptchaResetSignal] = useState(0);
  const [waToken, setWaToken] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const baseModel = modelBaseNameFromKey(modelKey);
  const bookNowModel = encodeURIComponent(baseModel);
  const savingsNote =
    estimatedSavings != null
      ? `TCO estimate (${ownershipYears} yr): ${estimatedSavings >= 0 ? "savings" : "extra cost"} ${formatInr(Math.abs(estimatedSavings))} vs petrol assumption.`
      : `TCO calculator — ${ownershipYears} year ownership horizon.`;

  const handleTalkToDealer = useCallback(async () => {
    const mobileDigits = mobile.replace(/\D/g, "");
    if (!name.trim()) {
      toast.error("Enter your name.");
      return;
    }
    if (!MOBILE_REGEX.test(mobileDigits)) {
      toast.error("Enter a valid 10-digit mobile number.");
      return;
    }
    if (whatsappOtpEnabled && !waToken) {
      toast.error("Verify your WhatsApp number first.");
      return;
    }
    if (!captchaVerified) {
      toast.error("Please complete captcha verification.");
      return;
    }

    setSubmitting(true);
    const remarks = [savingsNote, variantLabel ? `Variant: ${variantLabel}` : ""].filter(Boolean).join(" | ");

    try {
      if (hasApi() && !isPublicFormPostDisabled()) {
        let token: string | undefined;
        try {
          token = await getToken("tco_lead");
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Security verification failed.");
          return;
        }
        const res = await submitPublicLead({
          name: name.trim(),
          mobile: mobileDigits,
          city: city === DISTRICT_OTHER ? DISTRICT_OTHER : city,
          otherCity: city === DISTRICT_OTHER ? otherCity : "",
          modelDisplay: variantLabel || baseModel,
          interestedModels: [baseModel],
          source: "Website",
          interest: "TCO Calculator",
          remarks,
          pageSource: "Total Cost of Ownership",
          recaptchaToken: token,
          whatsappVerificationToken: waToken ?? undefined,
        });
        toast.success(res.message || "Thank you — our team will contact you shortly.");
      } else if (isPublicFormPostDisabled()) {
        toast.error(PUBLIC_FORM_POST_DISABLED_MESSAGE);
        return;
      } else {
        const todayStr = new Date().toISOString().slice(0, 10);
        const lead: Lead = {
          id: `WL_${Date.now()}`,
          name: name.trim(),
          mobile: mobileDigits,
          email: "",
          city: city === DISTRICT_OTHER ? DISTRICT_OTHER : city,
          otherCity: city === DISTRICT_OTHER ? otherCity : undefined,
          model: variantLabel || baseModel,
          source: "TCO Calculator",
          status: "New Lead",
          assignedTo: "",
          createdAt: todayStr,
          nextFollowUp: "",
          remarks,
          financeNeeded: false,
          exchangeNeeded: false,
        };
        addLead(lead);
        toast.success("Request saved — our team will contact you shortly.");
      }
      setName("");
      setMobile("");
      setCaptchaResetSignal((n) => n + 1);
      setCaptchaVerified(false);
    } catch (err) {
      toast.error(formatApiErrors(err));
    } finally {
      setSubmitting(false);
    }
  }, [
    name,
    mobile,
    city,
    otherCity,
    waToken,
    whatsappOtpEnabled,
    captchaVerified,
    getToken,
    savingsNote,
    variantLabel,
    baseModel,
  ]);

  return (
    <div className="rounded-2xl border border-border/60 bg-card/40 p-6 sm:p-8 space-y-6">
      <div>
        <h3 className="font-display font-bold text-xl mb-2">Next steps</h3>
        <p className="text-sm text-muted-foreground">
          Estimates are for planning only. Book a test drive or speak with Patliputra VinFast for on-road price and
          finance.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button variant="hero" asChild>
          <Link to="/test-drive">Book a test drive</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to={`/book-now?model=${bookNowModel}`}>Get on-road price</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/contact">Contact showroom</Link>
        </Button>
      </div>

      <div className="border-t border-border/50 pt-6 space-y-4">
        <p className="text-sm font-medium">Talk to our dealership</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tco-lead-name">Name</Label>
            <Input
              id="tco-lead-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tco-lead-mobile">Mobile</Label>
            <Input
              id="tco-lead-mobile"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
              inputMode="numeric"
              autoComplete="tel"
            />
          </div>
        </div>
        <BiharDistrictField
          id="tco-lead-district"
          label="District (Bihar)"
          selectClassName="h-11 px-3 rounded-xl bg-background/50 border border-border text-sm w-full"
          otherInputClassName="h-11 px-3 rounded-xl bg-background/50 border border-border text-sm w-full"
          value={city}
          otherValue={otherCity}
          onDistrictChange={(d) => {
            setCity(d);
            setOtherCity("");
          }}
          onOtherChange={setOtherCity}
          fullWidthOtherRow
        />
        {whatsappOtpEnabled ? (
          <WhatsAppOtpVerify
            mobile={mobile.replace(/\D/g, "").slice(0, 10)}
            displayName={name.trim() || "Customer"}
            recaptchaAction="tco_whatsapp_otp"
            enabled
            onTokenChange={setWaToken}
          />
        ) : null}
        <FormCaptcha onVerifyChange={setCaptchaVerified} resetSignal={captchaResetSignal} />
        <Button type="button" className="w-full sm:w-auto" disabled={submitting} onClick={() => void handleTalkToDealer()}>
          {submitting ? "Sending…" : "Request a callback"}
        </Button>
      </div>
    </div>
  );
}
