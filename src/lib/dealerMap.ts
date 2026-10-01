/**
 * Showroom pin: Near Deedarganj Check Post, NH-30, Patna 800009
 * (same location as https://www.google.com/maps/.../@25.580227,85.248147,...)
 */
const SHOWROOM_LAT = 25.580227;
const SHOWROOM_LNG = 85.248147;

/** Open in Google Maps (mobile app + desktop) — search view at the correct pin. */
export const SHOWROOM_GOOGLE_MAPS_URL =
  "https://www.google.com/maps/search/Near+Deedarganj+Check+Post+NH-30+Patna+800009/@25.580227,85.248147,16z?hl=en-GB&entry=ttu";

/** Reliable iframe embed (no API key) — uses lat/lng so the map matches the pin above. */
const SHOWROOM_EMBED_SRC = `https://www.google.com/maps?q=${SHOWROOM_LAT}%2C${SHOWROOM_LNG}&z=16&hl=en&output=embed`;

/** Only iframe-safe Google Maps URLs (search/share links refuse to connect in iframes). */
function isEmbeddableGoogleMapsUrl(url: string): boolean {
  try {
    const u = new URL(url);
    const hostPath = `${u.hostname}${u.pathname}`;
    if (!/google\./i.test(u.hostname) || !hostPath.includes("/maps")) return false;
    if (hostPath.includes("/maps/embed")) return true;
    if (u.searchParams.get("output") === "embed") return true;
    return false;
  } catch {
    return false;
  }
}

/** Extract Google Maps embed `src` from raw iframe HTML, or accept a direct embed https URL. */
export function mapsEmbedSrc(address: string, mapEmbedUrl?: string): string {
  const raw = (mapEmbedUrl ?? "").trim();
  if (raw) {
    const srcMatch = raw.match(/\bsrc\s*=\s*["']([^"']+)["']/i);
    const candidate = srcMatch?.[1]?.trim() || (/^https?:\/\//i.test(raw) ? raw : "");
    if (candidate && isEmbeddableGoogleMapsUrl(candidate)) return candidate;
  }
  return SHOWROOM_EMBED_SRC;
}

/**
 * Link for “open in maps” from address row.
 * Prefers a plain https URL from admin Settings; otherwise uses the fixed Deedarganj NH-30 pin (address text alone can geocode incorrectly).
 */
export function mapsDirectionsHref(_address: string, mapEmbedUrl?: string): string {
  const raw = (mapEmbedUrl ?? "").trim();
  if (raw && /^https?:\/\//i.test(raw) && !/<iframe/i.test(raw)) {
    return raw;
  }
  return SHOWROOM_GOOGLE_MAPS_URL;
}
