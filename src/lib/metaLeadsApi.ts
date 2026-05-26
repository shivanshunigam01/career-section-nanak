/**
 * Meta Lead page — direct browser axios call only.
 * Not routed through api.ts / admin JWT / CRM lead mappers.
 *
 * Set `VITE_META_LEADS_API_URL` to your Meta leads endpoint (must allow CORS from this site).
 */
/** Live server must deploy backend with GET /admin/All_leads before JWT middleware. */
export const META_LEADS_API_URL =
  (import.meta.env.VITE_META_LEADS_API_URL as string | undefined)?.replace(/\/$/, "").trim() ||
  "https://apivnfast.patliputragroup.com/api/v1/admin/All_leads";

export type MetaLeadsApiPayload = {
  success?: boolean;
  data?: unknown;
  meta?: Record<string, unknown>;
  message?: string;
  [key: string]: unknown;
};

/** Normalize `data` to an array of row objects for the table. */
export function metaLeadsRows(payload: MetaLeadsApiPayload | null): Record<string, unknown>[] {
  if (!payload) return [];
  const d = payload.data;
  if (Array.isArray(d)) return d.filter((x): x is Record<string, unknown> => x != null && typeof x === "object");
  if (d != null && typeof d === "object") return [d as Record<string, unknown>];
  return [];
}

export function cellDisplay(value: unknown): string {
  if (value == null) return "—";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (typeof value === "object" && value !== null && "name" in value) {
    return String((value as { name?: unknown }).name ?? JSON.stringify(value));
  }
  return JSON.stringify(value);
}

/** Preferred columns when present on Meta / lead objects. */
export const META_LEAD_TABLE_KEYS = [
  "name",
  "full_name",
  "mobile",
  "phone_number",
  "email",
  "city",
  "model",
  "source",
  "status",
  "createdAt",
  "created_time",
] as const;

export function tableColumns(rows: Record<string, unknown>[]): string[] {
  const keys = new Set<string>();
  for (const key of META_LEAD_TABLE_KEYS) {
    if (rows.some((r) => key in r)) keys.add(key);
  }
  for (const row of rows) {
    for (const k of Object.keys(row)) {
      if (!k.startsWith("_") && k !== "__v") keys.add(k);
    }
  }
  return [...keys];
}
