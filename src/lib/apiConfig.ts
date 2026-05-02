/**
 * Public + admin API base (must include `/api/v1`).
 * Override with env; production builds fall back to the Patliputra server if unset.
 */
export const LIVE_API_BASE = "https://apivnfast.patliputragroup.com/api/v1";

function resolveApiBase(): string {
  const fromEnv = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "").trim();
  if (fromEnv) return fromEnv;
  if (import.meta.env.PROD) return LIVE_API_BASE;
  return "";
}

export const API_BASE = resolveApiBase();

export function hasApi(): boolean {
  return Boolean(API_BASE);
}

/** Admin-facing email alerts from form submissions are disabled; WhatsApp OTP still calls the API. */
export const PUBLIC_FORM_POST_DISABLED_MESSAGE =
  "Online lead submission is paused. WhatsApp verification still works.";

/** Default: public POST /leads, /test-drives, /enquiries are skipped. Set `VITE_PUBLIC_FORM_POST_DISABLED=false` to turn submissions back on. */
export function isPublicFormPostDisabled(): boolean {
  return import.meta.env.VITE_PUBLIC_FORM_POST_DISABLED !== "false";
}
