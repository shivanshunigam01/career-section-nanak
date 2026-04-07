import { publicPost } from "@/lib/api";
import { normalizeLeadModel, normalizeTestDriveModel } from "@/lib/apiMappers";
import { leadModelLabel } from "@/data/vinfastModels";

export async function submitPublicLead(payload: {
  name: string;
  mobile: string;
  city: string;
  otherCity?: string;
  modelDisplay: string;
  source: string;
  remarks?: string;
  interest?: string;
  email?: string;
  financeNeeded?: boolean;
  exchangeNeeded?: boolean;
  pageSource?: string;
  /** Google reCAPTCHA v3 token (required when API has RECAPTCHA_SECRET_KEY). */
  recaptchaToken?: string;
}): Promise<void> {
  const city = payload.city === "Other" ? "Other" : payload.city.trim();
  const otherCity = payload.city === "Other" ? (payload.otherCity || "").trim() : "";
  const model = normalizeLeadModel(payload.modelDisplay);
  const trimNote = payload.modelDisplay.trim();
  const remarks = [payload.remarks, trimNote && model !== trimNote ? `Trim: ${trimNote}` : ""]
    .filter(Boolean)
    .join(" | ");

  const recaptchaToken = payload.recaptchaToken?.trim();
  await publicPost("/leads", {
    name: payload.name.trim(),
    mobile: payload.mobile.trim(),
    email: payload.email?.trim() || undefined,
    city,
    otherCity,
    model,
    interest: payload.interest?.trim() || undefined,
    source: payload.source?.trim() || "Website",
    remarks: remarks || undefined,
    financeNeeded: payload.financeNeeded ?? false,
    exchangeNeeded: payload.exchangeNeeded ?? false,
    pageSource: payload.pageSource,
    ...(recaptchaToken ? { recaptchaToken } : {}),
  });
}

export async function submitPublicTestDrive(payload: {
  customerName: string;
  mobile: string;
  email?: string;
  city?: string;
  model: string;
  variant: string;
  preferredDate: string;
  preferredTime?: string;
  branch?: string;
  remarks?: string;
  pageSource?: string;
  preferredTestDriveLocation: string;
  ownsCar: string;
  currentCarDetails?: string;
  purchaseTimeline: string;
  recaptchaToken?: string;
}): Promise<void> {
  const display = leadModelLabel(payload.model, payload.variant);
  const recaptchaToken = payload.recaptchaToken?.trim();
  await publicPost("/test-drives", {
    customerName: payload.customerName.trim(),
    mobile: payload.mobile.trim(),
    email: payload.email?.trim() || undefined,
    model: normalizeTestDriveModel(display),
    city: payload.city?.trim() || undefined,
    preferredDate: payload.preferredDate,
    preferredTime: payload.preferredTime?.trim() || undefined,
    branch: payload.branch?.trim() || undefined,
    preferredTestDriveLocation: payload.preferredTestDriveLocation,
    ownsCar: payload.ownsCar,
    currentCarDetails:
      payload.ownsCar === "Yes" ? payload.currentCarDetails?.trim() || undefined : undefined,
    purchaseTimeline: payload.purchaseTimeline,
    remarks: [payload.remarks?.trim(), `Trim: ${display}`].filter(Boolean).join(" | ") || undefined,
    pageSource: payload.pageSource,
    ...(recaptchaToken ? { recaptchaToken } : {}),
  });
}

export async function submitPublicEnquiry(payload: {
  name: string;
  mobile: string;
  email?: string;
  city?: string;
  model?: string;
  variant?: string;
  interest: string;
  message?: string;
  source?: string;
  recaptchaToken?: string;
}): Promise<void> {
  const display = payload.model && payload.variant !== undefined ? leadModelLabel(payload.model, payload.variant) : "";
  const recaptchaToken = payload.recaptchaToken?.trim();
  await publicPost("/enquiries", {
    name: payload.name.trim(),
    mobile: payload.mobile.trim(),
    email: payload.email?.trim() || undefined,
    city: payload.city?.trim() || undefined,
    model: display ? normalizeTestDriveModel(display) : undefined,
    interest: payload.interest,
    message: payload.message?.trim() || undefined,
    source: payload.source ?? "Contact Form",
    ...(recaptchaToken ? { recaptchaToken } : {}),
  });
}
