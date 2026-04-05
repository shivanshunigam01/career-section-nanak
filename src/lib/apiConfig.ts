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
