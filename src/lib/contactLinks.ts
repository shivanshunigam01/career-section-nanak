/** Digits-only for wa.me (no +). */
export function whatsappDigits(raw: string): string {
  return raw.replace(/\D/g, "");
}

export function waMeUrl(digits: string): string {
  const w = whatsappDigits(digits);
  const message = encodeURIComponent(
    "Hi, I came across VinFast and would like to explore more details.",
  );
  return w
    ? `https://wa.me/${w}?text=${message}`
    : `https://wa.me/919231445060?text=${message}`;
}

/** Build tel: href from a display number like "+91 92314 45060". */
export function telHref(display: string): string {
  const d = display.replace(/\D/g, "");
  if (!d) return "tel:+919231445060";
  if (d.length >= 10 && d.startsWith("91")) return `tel:+${d}`;
  if (d.length === 10) return `tel:+91${d}`;
  return `tel:+${d}`;
}
