import { useEffect, useState } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { addLead } from "@/lib/vfLocalStorage";
import type { Lead } from "@/data/mockData";
import { hasApi } from "@/lib/apiConfig";
import { formatApiErrors } from "@/lib/api";
import { submitPublicLead } from "@/lib/publicFormsApi";
import { leadModelLabel } from "@/data/vinfastModels";

const MOBILE_REGEX = /^[6-9]\d{9}$/;

const getLocalISODate = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

function triggerBrochureDownload(href: string, downloadFileName: string) {
  const a = document.createElement("a");
  a.href = href;
  a.setAttribute("download", downloadFileName);
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export type BrochureDownloadButtonProps = Omit<ButtonProps, "type" | "onClick" | "asChild"> & {
  brochureHref: string;
  downloadFileName: string;
  /** e.g. "VF 7", "VF 6", "VF MPV 7" */
  modelDisplay: string;
  pageSource: string;
};

export function BrochureDownloadButton({
  brochureHref,
  downloadFileName,
  modelDisplay,
  pageSource,
  children,
  disabled,
  ...buttonProps
}: BrochureDownloadButtonProps) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("Patna");
  const [otherCity, setOtherCity] = useState("");

  useEffect(() => {
    if (!open) {
      setName("");
      setMobile("");
      setEmail("");
      setCity("Patna");
      setOtherCity("");
      setSubmitting(false);
    }
  }, [open]);

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMobile(e.target.value.replace(/\D/g, "").slice(0, 10));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter your name.");
      return;
    }
    if (!mobile || !MOBILE_REGEX.test(mobile)) {
      toast.error("Please enter a valid 10-digit Indian mobile number.");
      return;
    }
    if (city === "Other" && !otherCity.trim()) {
      toast.error("Please enter your city.");
      return;
    }

    const cityVal = city === "Other" ? "Other" : city;
    const modelLine = leadModelLabel(modelDisplay, "");
    const remarks = `Brochure: ${downloadFileName}`;

    setSubmitting(true);
    try {
      if (hasApi()) {
        await submitPublicLead({
          name: name.trim(),
          mobile,
          city: cityVal,
          otherCity: city === "Other" ? otherCity : "",
          email: email.trim() || undefined,
          modelDisplay: modelLine,
          source: "Brochure download",
          remarks,
          pageSource,
        });
      } else {
        try {
          const todayStr = getLocalISODate();
          const ts = Date.now();
          const resolvedCity = city === "Other" ? otherCity.trim() : city;
          const lead: Lead = {
            id: `WL_${ts}`,
            name: name.trim(),
            mobile,
            email: email.trim(),
            city: resolvedCity,
            model: modelLine,
            source: "Brochure download",
            status: "New Lead",
            assignedTo: "",
            createdAt: todayStr,
            nextFollowUp: "",
            remarks,
            financeNeeded: false,
            exchangeNeeded: false,
          };
          addLead(lead);
        } catch {
          toast.error("Could not save your details. Please try again or contact us by phone.");
          return;
        }
      }

      triggerBrochureDownload(brochureHref, downloadFileName);
      toast.success("Your brochure download has started. We'll be in touch soon.");
      setOpen(false);
    } catch (err) {
      toast.error(formatApiErrors(err));
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "h-11 px-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-full";

  return (
    <>
      <Button type="button" disabled={disabled} onClick={() => setOpen(true)} {...buttonProps}>
        {children}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">Download brochure</DialogTitle>
            <DialogDescription>
              Enter your details to download the {modelDisplay} brochure. We&apos;ll save this as a lead so our team can follow up if you need help.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label htmlFor="brochure-name" className="text-xs font-medium text-foreground/80 mb-1 block">
                Full name <span className="text-primary">*</span>
              </label>
              <input
                id="brochure-name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="brochure-mobile" className="text-xs font-medium text-foreground/80 mb-1 block">
                Mobile <span className="text-primary">*</span>
              </label>
              <input
                id="brochure-mobile"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                value={mobile}
                onChange={handleMobileChange}
                className={inputClass}
                placeholder="10-digit mobile"
              />
            </div>
            <div>
              <label htmlFor="brochure-email" className="text-xs font-medium text-foreground/80 mb-1 block">
                Email (optional)
              </label>
              <input
                id="brochure-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="brochure-city" className="text-xs font-medium text-foreground/80 mb-1 block">
                City <span className="text-primary">*</span>
              </label>
              <select
                id="brochure-city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={inputClass}
              >
                <option value="Patna">Patna</option>
                <option value="Muzaffarpur">Muzaffarpur</option>
                <option value="Other">Other</option>
              </select>
            </div>
            {city === "Other" && (
              <div>
                <label htmlFor="brochure-other-city" className="text-xs font-medium text-foreground/80 mb-1 block">
                  Your city
                </label>
                <input
                  id="brochure-other-city"
                  type="text"
                  value={otherCity}
                  onChange={(e) => setOtherCity(e.target.value)}
                  className={inputClass}
                  placeholder="City name"
                />
              </div>
            )}

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={submitting}>
                Cancel
              </Button>
              <Button type="submit" variant="hero" disabled={submitting}>
                {submitting ? "Saving…" : "Download PDF"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
