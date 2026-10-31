import type { Enquiry, Lead, LeadStatus, TestDriveBooking, TestDriveStatus } from "@/data/mockData";

const MONGO_ID_RE = /^[a-f\d]{24}$/i;

export function isMongoId(id: string): boolean {
  return MONGO_ID_RE.test(id);
}

function isoDateOnly(value: unknown): string {
  if (!value) return "";
  const d = new Date(String(value));
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

const DATE_ONLY_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Display lead submission time in admin (API ISO) or date-only mock/local rows. Uses Asia/Kolkata. */
export function formatLeadSubmittedAt(value: string): string {
  const s = value?.trim() ?? "";
  if (!s) return "—";
  let d: Date;
  if (DATE_ONLY_RE.test(s)) {
    const [y, m, day] = s.split("-").map(Number);
    d = new Date(y, m - 1, day);
  } else {
    d = new Date(s);
  }
  if (Number.isNaN(d.getTime())) return "—";
  if (DATE_ONLY_RE.test(s)) {
    return d.toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", year: "numeric", month: "short", day: "numeric" });
  }
  return d.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function populatedName(ref: unknown): string {
  if (ref && typeof ref === "object" && "name" in ref) return String((ref as { name?: string }).name ?? "");
  return "";
}

/** Legacy website intake labels — show as Patliputra Vinfast Website in admin UI. */
const LEGACY_WEBSITE_LEAD_SOURCES = new Set([
  "Website",
  "Enquiry",
  "Book Now",
  "Pre-Booking",
  "Test Drive",
  "Brochure download",
  "VF MPV 7 Pre-book",
  "Contact Form",
]);

const PATLIPUTRA_VINFAST_WEBSITE_SOURCE = "Patliputra Vinfast Website";

export function normalizeLeadSourceFromApi(raw: unknown): string {
  const s = String(raw ?? "").trim();
  if (!s) return PATLIPUTRA_VINFAST_WEBSITE_SOURCE;
  if (s === PATLIPUTRA_VINFAST_WEBSITE_SOURCE) return s;
  if (LEGACY_WEBSITE_LEAD_SOURCES.has(s)) return PATLIPUTRA_VINFAST_WEBSITE_SOURCE;
  if (s.startsWith("Contact:") || s.startsWith("Homepage:")) return PATLIPUTRA_VINFAST_WEBSITE_SOURCE;
  return s;
}

/** Map UI model line to backend Lead.model field. */
export function normalizeLeadModel(display: string): string {
  const s = display.toUpperCase();
  if (
    s.includes("NOT SURE") ||
    s.includes("VF 6 / VF 7 / VF MPV 7") ||
    s.includes("VF 6 / VF 7") ||
    s === "BOTH"
  ) {
    return "Both";
  }
  if (s.includes("LIMO")) return "Limo Green";
  if (s.includes("MPV")) return "VF MPV 7";
  const has6 = /\bVF\s*6\b|\bVF6\b/i.test(display);
  const has7 = /\bVF\s*7\b|\bVF7\b/i.test(display);
  if (has6 && has7) return "Both";
  if (has6) return "VF 6";
  return "VF 7";
}

/** Test drives reject `Both`; default to VF 7. VF MPV 7 preserved when selected. */
export function normalizeTestDriveModel(display: string): string {
  const m = normalizeLeadModel(display);
  if (m === "Both") return "VF 7";
  return m;
}

function resolveLeadFlagFromApiDoc(doc: Record<string, unknown>): string {
  const levels = new Set(["HOT", "WARM", "COLD"]);
  const cre = doc.creSheet && typeof doc.creSheet === "object" ? (doc.creSheet as Record<string, unknown>) : null;
  for (const raw of [doc.leadFlag, doc.interestLevel, doc.leadType, cre?.followUp]) {
    const s = String(raw ?? "").trim().toUpperCase();
    if (levels.has(s)) return s;
  }
  return "";
}

export function leadFromApi(doc: Record<string, unknown>): Lead {
  const assigned = populatedName(doc.assignedTo) || (typeof doc.assignedTo === "string" && !isMongoId(doc.assignedTo) ? String(doc.assignedTo) : "");
  const modelLine = String(doc.model ?? "");
  const interest = doc.interest ? String(doc.interest) : "";
  const displayModel = interest && !modelLine.includes(interest) ? `${modelLine} (${interest})` : modelLine;

  return {
    id: String(doc._id ?? ""),
    name: String(doc.name ?? ""),
    mobile: String(doc.mobile ?? ""),
    email: String(doc.email ?? ""),
    city: String(doc.city ?? ""),
    otherCity: String(doc.otherCity ?? ""),
    model: displayModel || "VF 7",
    source: normalizeLeadSourceFromApi(doc.source),
    status: (doc.status as LeadStatus) || "New Lead",
    assignedTo: assigned,
    createdAt:
      doc.createdAt != null && String(doc.createdAt).trim() !== "" ? String(doc.createdAt) : "",
    nextFollowUp: isoDateOnly(doc.nextFollowUp),
    remarks: String(doc.remarks ?? ""),
    financeNeeded: Boolean(doc.financeNeeded),
    exchangeNeeded: Boolean(doc.exchangeNeeded),
    interestLevel: String(doc.interestLevel ?? ""),
    leadFlag: resolveLeadFlagFromApiDoc(doc),
  };
}

export function leadToApiPayload(lead: Lead): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    name: lead.name.trim(),
    mobile: lead.mobile.trim(),
    email: lead.email?.trim() || undefined,
    city: lead.city.trim(),
    otherCity: lead.city === "Other" ? (lead.otherCity || "").trim() : "",
    model: normalizeLeadModel(lead.model),
    source: lead.source?.trim() || "Website",
    status: lead.status,
    remarks: lead.remarks?.trim() || undefined,
    financeNeeded: lead.financeNeeded,
    exchangeNeeded: lead.exchangeNeeded,
    nextFollowUp: lead.nextFollowUp ? new Date(`${lead.nextFollowUp}T12:00:00`).toISOString() : null,
  };

  const at = lead.assignedTo.trim();
  if (isMongoId(at)) payload.assignedTo = at;
  else if (at === "") payload.assignedTo = null;

  return payload;
}

/** Map TDBooking module row for dashboard / lists (excludes cancelled in caller when needed). */
export function tdBookingFromApi(doc: Record<string, unknown>): TestDriveBooking {
  const executive = populatedName(doc.assignedExecutive);
  const leadRef = doc.leadId;
  let leadId = "";
  if (typeof leadRef === "string") leadId = leadRef;
  else if (leadRef && typeof leadRef === "object" && "_id" in leadRef) leadId = String((leadRef as { _id?: unknown })._id ?? "");

  const raw = String(doc.bookingStatus ?? "PENDING").toUpperCase();
  let status: TestDriveStatus = "Pending";
  if (raw === "CONFIRMED" || raw === "IN_PROGRESS") status = "Scheduled";
  else if (raw === "COMPLETED") status = "Completed";
  else if (raw === "CANCELLED" || raw === "MISSED") status = "Cancelled";

  const customer = doc.customerId && typeof doc.customerId === "object" ? (doc.customerId as Record<string, unknown>) : null;

  return {
    id: String(doc._id ?? doc.bookingId ?? ""),
    leadId,
    customerName: String(doc.customerName ?? customer?.name ?? ""),
    mobile: String(doc.customerMobile ?? customer?.mobile ?? ""),
    model: String(doc.preferredModel ?? doc.model ?? ""),
    preferredDate: isoDateOnly(doc.slotDate ?? doc.preferredDate),
    preferredTime: String(doc.slotTime ?? doc.preferredTime ?? ""),
    branch: String(doc.branch ?? ""),
    preferredTestDriveLocation: String(doc.preferredTestDriveLocation ?? ""),
    ownsCar: String(doc.ownsCar ?? ""),
    currentCarDetails: String(doc.currentCarDetails ?? ""),
    purchaseTimeline: String(doc.purchaseTimeline ?? ""),
    status,
    assignedExecutive: executive,
    feedback: String(doc.feedback ?? ""),
    createdAt: isoDateOnly(doc.createdAt),
  };
}

export function testDriveFromApi(doc: Record<string, unknown>): TestDriveBooking {
  const executive = populatedName(doc.assignedExecutive);
  const leadRef = doc.leadId;
  let leadId = "";
  if (typeof leadRef === "string") leadId = leadRef;
  else if (leadRef && typeof leadRef === "object" && "_id" in leadRef) leadId = String((leadRef as { _id?: unknown })._id ?? "");

  const status = (doc.status as TestDriveStatus) || "Pending";

  return {
    id: String(doc._id ?? ""),
    leadId,
    customerName: String(doc.customerName ?? ""),
    mobile: String(doc.mobile ?? ""),
    model: String(doc.model ?? ""),
    preferredDate: isoDateOnly(doc.preferredDate),
    preferredTime: String(doc.preferredTime ?? ""),
    branch: String(doc.branch ?? ""),
    preferredTestDriveLocation: String(doc.preferredTestDriveLocation ?? ""),
    ownsCar: String(doc.ownsCar ?? ""),
    currentCarDetails: String(doc.currentCarDetails ?? ""),
    purchaseTimeline: String(doc.purchaseTimeline ?? ""),
    status,
    assignedExecutive: executive,
    feedback: String(doc.feedback ?? ""),
    createdAt: isoDateOnly(doc.createdAt),
  };
}

export function testDriveToApiPayload(b: TestDriveBooking): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    customerName: b.customerName.trim(),
    mobile: b.mobile.trim(),
    model: normalizeTestDriveModel(b.model),
    preferredDate: b.preferredDate ? new Date(`${b.preferredDate}T12:00:00`).toISOString() : undefined,
    preferredTime: b.preferredTime?.trim() || undefined,
    branch: b.branch?.trim() || undefined,
    preferredTestDriveLocation: b.preferredTestDriveLocation?.trim() || undefined,
    ownsCar: b.ownsCar?.trim() || undefined,
    currentCarDetails: b.currentCarDetails?.trim() || undefined,
    purchaseTimeline: b.purchaseTimeline?.trim() || undefined,
    status: b.status,
    feedback: b.feedback?.trim() || undefined,
  };

  const lid = b.leadId.trim();
  if (isMongoId(lid)) payload.leadId = lid;
  else if (lid === "") payload.leadId = null;

  const exec = b.assignedExecutive.trim();
  if (isMongoId(exec)) payload.assignedExecutive = exec;
  else if (exec === "") payload.assignedExecutive = null;

  return payload;
}

export type EnquiryStatusUi = Enquiry["status"];

export function enquiryFromApi(doc: Record<string, unknown>): Enquiry {
  return {
    id: String(doc._id ?? ""),
    name: String(doc.name ?? ""),
    mobile: String(doc.mobile ?? ""),
    email: String(doc.email ?? ""),
    type: String(doc.interest ?? "General Enquiry"),
    message: String(doc.message ?? ""),
    status: (doc.status as EnquiryStatusUi) || "Open",
    createdAt: isoDateOnly(doc.createdAt),
  };
}

export function enquiryStatusPayload(status: Enquiry["status"]): Record<string, unknown> {
  return { status };
}

export type DashboardStats = {
  totalLeads: number;
  newLeadsToday: number;
  hotLeads: number;
  hotFlagLeads: number;
  warmFlagLeads: number;
  coldFlagLeads: number;
  bookings: number;
  bookingsMtd: number;
  delivered: number;
  deliveredMtd: number;
  pendingFollowUps: number;
  totalTestDrives: number;
  testDrivesThisWeek: number;
  testDrivesMtd: number;
  totalEnquiries: number;
  openEnquiries: number;
  leadsBySource: Record<string, number>;
  leadsByModel: Record<string, number>;
  leadsByStatus: Record<string, number>;
  testDrivesByStatus: Record<string, number>;
};

type AggregateRow = { _id?: unknown; count?: unknown };

function countRecordFromApi(value: unknown): Record<string, number> {
  if (value == null) return {};
  if (Array.isArray(value)) {
    const out: Record<string, number> = {};
    for (const row of value as AggregateRow[]) {
      const key = row?._id == null || row._id === "" ? "Unknown" : String(row._id);
      out[key] = Number(row?.count) || 0;
    }
    return out;
  }
  if (typeof value === "object") {
    const out: Record<string, number> = {};
    for (const [key, count] of Object.entries(value as Record<string, unknown>)) {
      if (count != null && typeof count === "object" && "count" in (count as AggregateRow)) {
        out[key] = Number((count as AggregateRow).count) || 0;
      } else {
        out[key] = Number(count) || 0;
      }
    }
    return out;
  }
  return {};
}

/** Normalize dashboard stats from API (handles legacy aggregate arrays). */
export function dashboardStatsFromApi(raw: Record<string, unknown> | null | undefined): DashboardStats {
  const d = raw ?? {};
  return {
    totalLeads: Number(d.totalLeads) || 0,
    newLeadsToday: Number(d.newLeadsToday ?? d.leadsToday) || 0,
    hotLeads: Number(d.hotLeads) || 0,
    hotFlagLeads: Number(d.hotFlagLeads ?? d.hotCount) || 0,
    warmFlagLeads: Number(d.warmFlagLeads ?? d.warmCount) || 0,
    coldFlagLeads: Number(d.coldFlagLeads ?? d.coldCount) || 0,
    bookings: Number(d.bookings) || 0,
    bookingsMtd: Number(d.bookingsMtd) || 0,
    delivered: Number(d.delivered) || 0,
    deliveredMtd: Number(d.deliveredMtd) || 0,
    pendingFollowUps: Number(d.pendingFollowUps) || 0,
    totalTestDrives: Number(d.totalTestDrives) || 0,
    testDrivesThisWeek: Number(d.testDrivesThisWeek) || 0,
    testDrivesMtd: Number(d.testDrivesMtd) || 0,
    totalEnquiries: Number(d.totalEnquiries) || 0,
    openEnquiries: Number(d.openEnquiries) || 0,
    leadsBySource: countRecordFromApi(d.leadsBySource),
    leadsByModel: countRecordFromApi(d.leadsByModel),
    leadsByStatus: countRecordFromApi(d.leadsByStatus),
    testDrivesByStatus: countRecordFromApi(d.testDrivesByStatus),
  };
}
