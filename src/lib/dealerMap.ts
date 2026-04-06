/** Extract Google Maps embed `src` from raw iframe HTML, or accept a direct https URL. */
export function mapsEmbedSrc(address: string, mapEmbedUrl?: string): string {
  const raw = (mapEmbedUrl ?? "").trim();
  if (raw) {
    const srcMatch = raw.match(/\bsrc\s*=\s*["']([^"']+)["']/i);
    if (srcMatch?.[1]?.trim()) return srcMatch[1].trim();
    if (/^https?:\/\//i.test(raw)) return raw;
  }
  return `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
}

/** Link for “open in maps” from address row; prefers a plain URL from admin, else search. */
export function mapsDirectionsHref(address: string, mapEmbedUrl?: string): string {
  const raw = (mapEmbedUrl ?? "").trim();
  if (raw && /^https?:\/\//i.test(raw) && !/<iframe/i.test(raw)) {
    return raw;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}
