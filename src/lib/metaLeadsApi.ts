import axios from "axios";

/**
 * Public Meta leads — no JWT. Backend proxies META_LEADS_UPSTREAM_URL (your Meta API).
 */
export const META_LEADS_API_URL =
  "https://apivnfast.patliputragroup.com/api/v1/public/All_leads";

export type MetaLeadsApiPayload = {
  success?: boolean;
  data?: unknown;
  meta?: Record<string, unknown>;
  message?: string;
  [key: string]: unknown;
};

export async function fetchMetaLeadsPayload(): Promise<MetaLeadsApiPayload> {
  const { data } = await axios.get<MetaLeadsApiPayload>(META_LEADS_API_URL, {
    headers: { Accept: "application/json" },
  });
  return data;
}

/** Normalize `data` to an array of row objects for the table. */
export function metaLeadsRows(payload: MetaLeadsApiPayload | null): Record<string, unknown>[] {
  if (!payload) return [];
  const d = payload.data;
  if (Array.isArray(d)) return d.filter((x): x is Record<string, unknown> => x != null && typeof x === "object");
  if (d != null && typeof d === "object") return [d as Record<string, unknown>];
  return [];
}

function displayValue(value: unknown): string {
  if (value == null) return "—";
  if (typeof value === "string") return value.trim() ? value : "—";
  if (typeof value === "number") return String(value);
  if (typeof value === "boolean") return value ? "true" : "false";
  return "—";
}

function stripPrefix(value: unknown): string {
  const s = value == null ? "" : String(value).trim();
  if (!s) return "";
  const idx = s.indexOf("_");
  return idx >= 0 ? s.slice(idx + 1) : s;
}

function tryParseJson(maybeJson: unknown): unknown | null {
  if (typeof maybeJson !== "string") return null;
  const s = maybeJson.trim();
  if (!s) return null;
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}

function parseFlowToken(flowToken: unknown): Record<string, unknown> {
  // flow_token may be an object already or a stringified JSON.
  const parsed = tryParseJson(flowToken);
  if (parsed && typeof parsed === "object") return parsed as Record<string, unknown>;
  if (flowToken && typeof flowToken === "object") return flowToken as Record<string, unknown>;
  return {};
}

export type MetaLeadRow = {
  id: string;
  createdAt: string;
  name: string;
  mobile: string;
  whatsappNumber: string;
  email: string;
  state: string;
  pin: string;
  interestedModel: string;
};

/**
 * Map webhook/provider keys into a clean table row.
 * Example keys:
 * - screen_0_Name_0
 * - screen_0_Contact_No_1
 * - screen_0_State_2 (e.g. "1_Jharkhand")
 * - screen_0_PIN_3
 * - screen_0_Interested_Model_5 (e.g. "1_VF7")
 */
export function mapMetaLeadRow(doc: Record<string, unknown>): MetaLeadRow {
  const flow = parseFlowToken(doc.flow_token);

  const createdAt = displayValue(doc.createdAt || doc.receivedAt);
  const whatsappNumber = displayValue(doc.whatsapp_number || flow.MobileNumber);
  const mobile = displayValue(
    doc.screen_0_Contact_No_1 ||
      doc.mobile_number ||
      doc.phone_number ||
      flow.MobileNumber ||
      doc.mobile,
  );

  const name =
    displayValue(doc.screen_0_Name_0) ||
    displayValue((flow as { Name?: unknown }).Name) ||
    displayValue((flow as { name?: unknown }).name);

  const email = displayValue(doc.screen_0_Email_ID_4 || doc.email);
  const state = stripPrefix(doc.screen_0_State_2) || "—";
  const pin = displayValue(doc.screen_0_PIN_3 || doc.pin);
  const interestedModel = stripPrefix(doc.screen_0_Interested_Model_5) || "—";

  const candidateId = doc.uniqueId ?? doc._id;
  const candidateIdStr = typeof candidateId === "string" ? candidateId.trim() : "";
  const id = candidateIdStr ? candidateIdStr : `${whatsappNumber}-${createdAt}`;

  return {
    id: id || String(Math.random()),
    createdAt,
    name,
    mobile,
    whatsappNumber,
    email,
    state,
    pin,
    interestedModel,
  };
}
