/** Aligned with model pages (VF 6 / VF 7 trims). */

export const VF7_VARIANT_OPTIONS = [
  "VF 7 Earth",
  "VF 7 Wind",
  "VF 7 Wind Infinity",
  "VF 7 Sky",
  "VF 7 Sky Infinity",
] as const;

export const VF6_VARIANT_OPTIONS = ["VF 6 Earth", "VF 6 Wind", "VF 6 Wind Infinity"] as const;

/** Single-lineup electric MPV — one trim label for forms */
export const MPV7_VARIANT_OPTIONS = ["VF MPV 7"] as const;

export const DEFAULT_VF7_TRIM = VF7_VARIANT_OPTIONS[0];
export const DEFAULT_VF6_TRIM = VF6_VARIANT_OPTIONS[0];
export const DEFAULT_MPV7_TRIM = MPV7_VARIANT_OPTIONS[0];

/** Contact form: not sure which model. */
export const MODEL_TRIM_COMBO_BOTH = "__BOTH__";

export function encodeModelTrim(model: string, variant: string): string {
  if (model === "Both") return MODEL_TRIM_COMBO_BOTH;
  return variant ? `${model}|${variant}` : `${model}|`;
}

export function decodeModelTrim(raw: string): { model: string; variant: string } {
  if (raw === MODEL_TRIM_COMBO_BOTH) return { model: "Both", variant: "" };
  const i = raw.indexOf("|");
  if (i < 0) return { model: "VF 7", variant: "" };
  return { model: raw.slice(0, i), variant: raw.slice(i + 1) };
}

/** Value stored on leads / bookings / testimonials (single field). */
export function leadModelLabel(model: string, variant: string): string {
  if (model === "Both") return "VF 6 / VF 7 / VF MPV 7";
  return variant || model;
}

/** Map a stored label back to model + variant for the dropdown. */
export function parseStoredModelLine(stored: string): { model: string; variant: string } {
  const s = stored.trim();
  if (!s) return { model: "VF 7", variant: DEFAULT_VF7_TRIM };
  if (s === "VF 6 / VF 7" || s === "VF 6 / VF 7 / VF MPV 7" || s === "Both") return { model: "Both", variant: "" };
  if ((VF7_VARIANT_OPTIONS as readonly string[]).includes(s)) return { model: "VF 7", variant: s };
  if ((VF6_VARIANT_OPTIONS as readonly string[]).includes(s)) return { model: "VF 6", variant: s };
  if ((MPV7_VARIANT_OPTIONS as readonly string[]).includes(s)) return { model: "VF MPV 7", variant: s };
  if (s === "VF 7") return { model: "VF 7", variant: DEFAULT_VF7_TRIM };
  if (s === "VF 6") return { model: "VF 6", variant: DEFAULT_VF6_TRIM };
  if (s === "VF MPV 7") return { model: "VF MPV 7", variant: DEFAULT_MPV7_TRIM };
  return { model: "VF 7", variant: DEFAULT_VF7_TRIM };
}
