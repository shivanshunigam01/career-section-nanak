import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { hasApi } from "@/lib/apiConfig";
import { publicGet } from "@/lib/api";

export type DealerInfo = {
  dealerName: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  showroomHours: string;
  gstNo?: string;
};

export type SiteConfigPublic = {
  whatsappNumber: string;
  phoneNumber: string;
  heroTagline: string;
  leadStripTitle: string;
  leadStripSubtitle: string;
  vf7Price: string;
  vf6Price: string;
  vf7Range: string;
  vf6Range: string;
};

const DEFAULT_DEALER: DealerInfo = {
  dealerName: "Patliputra Auto",
  phone: "+91 9231445060",
  whatsapp: "919231445060",
  email: "info@patliputravinfast.com",
  address:
    "Plot No. 2421, NH 30, Bypass Road, Opposite Indian Oil Pump, Paijawa, Patna, Bihar - 800009",
  showroomHours: "10 AM – 8 PM, Mon–Sat",
  gstNo: "",
};

const DEFAULT_SITE: SiteConfigPublic = {
  whatsappNumber: "919231445060",
  phoneNumber: "+91 9231445060",
  heroTagline: "Bihar's First VinFast Dealer",
  leadStripTitle: "Ready to Go Electric?",
  leadStripSubtitle: "Leave your details and our EV advisor will reach out in 10 minutes.",
  vf7Price: "₹21.89L*",
  vf6Price: "₹17.29L*",
  vf7Range: "431 km",
  vf6Range: "381 km",
};

type PublicSiteContextValue = {
  dealer: DealerInfo;
  siteConfig: SiteConfigPublic;
  /** True after an API attempt finished (success or fail). */
  cmsTried: boolean;
};

const PublicSiteContext = createContext<PublicSiteContextValue | null>(null);

function mergeDealer(doc: Record<string, unknown> | null): DealerInfo {
  if (!doc) return DEFAULT_DEALER;
  return {
    dealerName: String(doc.dealerName ?? DEFAULT_DEALER.dealerName),
    phone: String(doc.phone ?? DEFAULT_DEALER.phone),
    whatsapp: String(doc.whatsapp ?? DEFAULT_DEALER.whatsapp),
    email: String(doc.email ?? DEFAULT_DEALER.email),
    address: String(doc.address ?? DEFAULT_DEALER.address),
    showroomHours: String(doc.showroomHours ?? DEFAULT_DEALER.showroomHours),
    gstNo: doc.gstNo != null ? String(doc.gstNo) : DEFAULT_DEALER.gstNo,
  };
}

function mergeSite(doc: Record<string, unknown> | null): SiteConfigPublic {
  if (!doc) return DEFAULT_SITE;
  return {
    whatsappNumber: String(doc.whatsappNumber ?? DEFAULT_SITE.whatsappNumber),
    phoneNumber: String(doc.phoneNumber ?? DEFAULT_SITE.phoneNumber),
    heroTagline: String(doc.heroTagline ?? DEFAULT_SITE.heroTagline),
    leadStripTitle: String(doc.leadStripTitle ?? DEFAULT_SITE.leadStripTitle),
    leadStripSubtitle: String(doc.leadStripSubtitle ?? DEFAULT_SITE.leadStripSubtitle),
    vf7Price: String(doc.vf7Price ?? DEFAULT_SITE.vf7Price),
    vf6Price: String(doc.vf6Price ?? DEFAULT_SITE.vf6Price),
    vf7Range: String(doc.vf7Range ?? DEFAULT_SITE.vf7Range),
    vf6Range: String(doc.vf6Range ?? DEFAULT_SITE.vf6Range),
  };
}

export function PublicSiteProvider({ children }: { children: ReactNode }) {
  const [dealer, setDealer] = useState<DealerInfo>(DEFAULT_DEALER);
  const [siteConfig, setSiteConfig] = useState<SiteConfigPublic>(DEFAULT_SITE);
  const [cmsTried, setCmsTried] = useState(false);

  useEffect(() => {
    if (!hasApi()) {
      setCmsTried(true);
      return;
    }
    let cancelled = false;
    (async () => {
      const [dRaw, sRaw] = await Promise.all([
        publicGet<Record<string, unknown>>("/public/dealer-settings"),
        publicGet<Record<string, unknown>>("/public/site-config"),
      ]);
      if (cancelled) return;
      setDealer(mergeDealer(dRaw));
      setSiteConfig(mergeSite(sRaw));
      setCmsTried(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(
    () => ({ dealer, siteConfig, cmsTried }),
    [dealer, siteConfig, cmsTried],
  );

  return <PublicSiteContext.Provider value={value}>{children}</PublicSiteContext.Provider>;
}

export function usePublicSite(): PublicSiteContextValue {
  const ctx = useContext(PublicSiteContext);
  if (!ctx) {
    return {
      dealer: DEFAULT_DEALER,
      siteConfig: DEFAULT_SITE,
      cmsTried: true,
    };
  }
  return ctx;
}
