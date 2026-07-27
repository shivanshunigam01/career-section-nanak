import * as XLSX from "xlsx";
import { CRM_LEAD_STAGES, type CrmLeadStage } from "@/lib/leadStages";
import { LEAD_SOURCE_OPTIONS } from "@/data/leadSources";

/** One row from the dealership "Current Format" CRE Excel sheet. */
export type CreLeadImportRow = {
  enquiryDate?: string;
  source: string;
  name: string;
  mobile: string;
  email?: string;
  city: string;
  existingVariant?: string;
  model: string;
  callDate?: string;
  initialRemark?: string;
  leadType?: string;
  status: CrmLeadStage;
  salesConsultant?: string;
  salesPersonRemark?: string;
  tdDate?: string;
  tdDone?: boolean;
  tdNotDoneWhy?: string;
  afterTdRemark?: string;
  bookingDone?: boolean;
  bookingDate?: string;
  finalModel?: string;
  finalVariant?: string;
  finalColour?: string;
  exchangeNeeded?: boolean;
  retailDone?: boolean;
  retailDate?: string;
  deliveryDate?: string;
  remarks: string;
  followUps: { scheduledAt?: string; note: string }[];
  area?: string;
  address?: string;
};

const HEADER_MAP: Record<string, string> = {
  "sl. no.": "sl",
  "enquiry date": "enquiryDate",
  "lead source": "source",
  "customer name": "name",
  phone: "mobile",
  "mail id": "email",
  location: "city",
  "existing variant": "existingVariant",
  model: "model",
  "call date": "callDate",
  "initial remark": "initialRemark",
  "lead type": "leadType",
  "sales consultant": "salesConsultant",
  date: "salesDate",
  "sales person remark": "salesPersonRemark",
  "td date": "tdDate",
  "td done yes/ no": "tdDone",
  "td done yes / no": "tdDone",
  "td not done, why?": "tdNotDoneWhy",
  "after td remark": "afterTdRemark",
  "cre follow up call 1 date": "creFu1Date",
  "cre follow up call remark 1": "creFu1Remark",
  "sales person follow up call 1 date": "spFu1Date",
  "sales person follow up call 1 remark 1": "spFu1Remark",
  "cre follow up call 2 date": "creFu2Date",
  "cre follow up call remark 2": "creFu2Remark",
  "sales person follow up call remark 2 date": "spFu2Date",
  "sales person follow up call remark 2": "spFu2Remark",
  "cre follow up call 3 date": "creFu3Date",
  "cre follow up call remark 3": "creFu3Remark",
  "sales person follow up call remark 3 date": "spFu3Date",
  "sales person follow up call remark 3": "spFu3Remark",
  "booking done yes / no": "bookingDone",
  "booking date": "bookingDate",
  "final model": "finalModel",
  "final variant": "finalVariant",
  "final colour": "finalColour",
  "mail sent yes / no": "mailSent",
  "exchange yes / no": "exchangeNeeded",
  "retail done yes / no": "retailDone",
  "retail date": "retailDate",
  "delivery date": "deliveryDate",
};

function normalizeHeader(h: string): string {
  return String(h || "")
    .replace(/[\r\n]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function cellStr(value: unknown): string {
  if (value == null) return "";
  return String(value).trim();
}

function parseBool(value: unknown): boolean | undefined {
  const s = cellStr(value).toLowerCase();
  if (!s || s === "no" || s === "n" || s === "false" || s === "0") return s ? false : undefined;
  if (["yes", "y", "true", "1"].includes(s)) return true;
  return undefined;
}

function normalizePhone(raw: unknown): string {
  const digits = cellStr(raw).replace(/\D/g, "");
  if (digits.length >= 10) return digits.slice(-10);
  return digits;
}

function isBlankEmail(raw: string): boolean {
  const s = raw.trim().toLowerCase();
  return !s || s === "no" || s === "n/a" || s === "na" || s === "-";
}

/** Map Excel MODEL cell → CRM catalog model. */
export function normalizeCreModel(raw: string): string {
  const s = String(raw || "").trim();
  if (!s) return "VF 7";
  const upper = s.toUpperCase().replace(/\s+/g, " ");
  if (upper.includes(",") || upper.includes("/")) return "Both";
  if (upper.includes("LIMO")) return "Limo Green";
  if (upper.includes("MPV")) return "VF MPV 7";
  if (upper.includes("VF 6") || upper === "VF6") return "VF 6";
  if (upper.includes("VF 7") || upper === "VF7") return "VF 7";
  if (upper.includes("VF 3") || upper === "VF3") return "VF 7";
  return s;
}

/** Map Excel LEAD SOURCE → CRM source label. */
export function normalizeCreSource(raw: string): string {
  const s = String(raw || "").trim();
  if (!s) return "Walk-in";
  const lower = s.toLowerCase();
  if (lower === "walk-in" || lower === "walk in") return "Walk-in";
  if (lower === "referral") return "Existing Customer Referral";
  if (lower.includes("vinfast") && lower.includes("digital")) return "VinFast India Digital Leads";
  if (lower === "social media" || lower.startsWith("social media")) {
    return "Social Media (YouTube, Facebook, Instagram)";
  }
  const exact = LEAD_SOURCE_OPTIONS.find((o) => o.toLowerCase() === lower);
  if (exact) return exact;
  return s;
}

/** Map Excel LEAD TYPE (+ booking/retail flags) → CRM stage. */
export function normalizeCreLeadType(
  leadType: string,
  opts?: { bookingDone?: boolean; retailDone?: boolean; tdDone?: boolean },
): CrmLeadStage {
  if (opts?.retailDone) return "Delivered";
  if (opts?.bookingDone) return "Booking";

  const t = String(leadType || "").trim().toUpperCase();
  if (t.includes("LOST") || t.includes("NOT INTEREST")) return "Lost";
  if (t.includes("HOT")) return "Interested";
  if (t.includes("WARM")) return "Interested";
  if (t.includes("COLD")) return "Enquiry";
  if (t.includes("FOLLOW")) return "Enquiry";
  if (t.includes("NOT CONNECT")) return "Enquiry";
  if (opts?.tdDone) return "Test Drive Completed";

  const asStage = CRM_LEAD_STAGES.find((s) => s.toUpperCase() === t);
  return asStage || "Enquiry";
}

function pushFollowUp(
  list: { scheduledAt?: string; note: string }[],
  dateRaw: string,
  remarkRaw: string,
  label: string,
) {
  const note = cellStr(remarkRaw);
  const date = cellStr(dateRaw);
  if (!note && !date) return;
  list.push({
    scheduledAt: date || undefined,
    note: note ? `${label}: ${note}` : `${label}${date ? ` (${date})` : ""}`,
  });
}

function mapNormalizedRow(raw: Record<string, string>): CreLeadImportRow | null {
  const name = cellStr(raw.name);
  const mobile = normalizePhone(raw.mobile);
  if (!name || mobile.length !== 10) return null;

  const emailRaw = cellStr(raw.email);
  const email = isBlankEmail(emailRaw) ? undefined : emailRaw;
  const city = cellStr(raw.city) || "Patna";
  const model = normalizeCreModel(cellStr(raw.model));
  const source = normalizeCreSource(cellStr(raw.source));
  const tdDone = parseBool(raw.tdDone);
  const bookingDone = parseBool(raw.bookingDone);
  const retailDone = parseBool(raw.retailDone);
  const exchangeNeeded = parseBool(raw.exchangeNeeded) ?? false;
  const status = normalizeCreLeadType(cellStr(raw.leadType), {
    bookingDone,
    retailDone,
    tdDone,
  });

  const remarkParts: string[] = [];
  if (cellStr(raw.initialRemark)) remarkParts.push(`Initial: ${cellStr(raw.initialRemark)}`);
  if (cellStr(raw.salesPersonRemark)) remarkParts.push(`Sales: ${cellStr(raw.salesPersonRemark)}`);
  if (cellStr(raw.afterTdRemark)) remarkParts.push(`After TD: ${cellStr(raw.afterTdRemark)}`);
  if (cellStr(raw.tdNotDoneWhy)) remarkParts.push(`TD not done: ${cellStr(raw.tdNotDoneWhy)}`);
  if (cellStr(raw.existingVariant) && cellStr(raw.existingVariant).toUpperCase() !== "NO") {
    remarkParts.push(`Existing variant: ${cellStr(raw.existingVariant)}`);
  }
  if (cellStr(raw.finalModel) || cellStr(raw.finalVariant) || cellStr(raw.finalColour)) {
    remarkParts.push(
      `Final: ${[cellStr(raw.finalModel), cellStr(raw.finalVariant), cellStr(raw.finalColour)].filter(Boolean).join(" / ")}`,
    );
  }
  if (cellStr(raw.model) && normalizeCreModel(cellStr(raw.model)) !== cellStr(raw.model)) {
    remarkParts.push(`Excel model: ${cellStr(raw.model)}`);
  }

  const followUps: { scheduledAt?: string; note: string }[] = [];
  pushFollowUp(followUps, raw.creFu1Date || "", raw.creFu1Remark || "", "CRE FU1");
  pushFollowUp(followUps, raw.spFu1Date || "", raw.spFu1Remark || "", "Sales FU1");
  pushFollowUp(followUps, raw.creFu2Date || "", raw.creFu2Remark || "", "CRE FU2");
  pushFollowUp(followUps, raw.spFu2Date || "", raw.spFu2Remark || "", "Sales FU2");
  pushFollowUp(followUps, raw.creFu3Date || "", raw.creFu3Remark || "", "CRE FU3");
  pushFollowUp(followUps, raw.spFu3Date || "", raw.spFu3Remark || "", "Sales FU3");

  return {
    enquiryDate: cellStr(raw.enquiryDate) || undefined,
    source,
    name,
    mobile,
    email,
    city,
    existingVariant: cellStr(raw.existingVariant) || undefined,
    model,
    callDate: cellStr(raw.callDate) || undefined,
    initialRemark: cellStr(raw.initialRemark) || undefined,
    leadType: cellStr(raw.leadType) || undefined,
    status,
    salesConsultant: cellStr(raw.salesConsultant) || undefined,
    salesPersonRemark: cellStr(raw.salesPersonRemark) || undefined,
    tdDate: cellStr(raw.tdDate) || undefined,
    tdDone,
    tdNotDoneWhy: cellStr(raw.tdNotDoneWhy) || undefined,
    afterTdRemark: cellStr(raw.afterTdRemark) || undefined,
    bookingDone,
    bookingDate: cellStr(raw.bookingDate) || undefined,
    finalModel: cellStr(raw.finalModel) || undefined,
    finalVariant: cellStr(raw.finalVariant) || undefined,
    finalColour: cellStr(raw.finalColour) || undefined,
    exchangeNeeded,
    retailDone,
    retailDate: cellStr(raw.retailDate) || undefined,
    deliveryDate: cellStr(raw.deliveryDate) || undefined,
    remarks: remarkParts.join("\n"),
    followUps,
    area: city,
    address: city,
  };
}

export function mapCreSheetRow(raw: Record<string, unknown>): CreLeadImportRow | null {
  const normalized: Record<string, string> = {};
  for (const [header, value] of Object.entries(raw)) {
    const key = HEADER_MAP[normalizeHeader(header)];
    if (!key) continue;
    normalized[key] = cellStr(value);
  }
  return mapNormalizedRow(normalized);
}

export async function parseCreLeadSpreadsheet(file: File): Promise<CreLeadImportRow[]> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array", cellDates: true });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) return [];
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: "",
    raw: false,
  });
  return rows.map(mapCreSheetRow).filter((r): r is CreLeadImportRow => r != null);
}

/** Download a blank Excel template matching the Current Format columns. */
export function downloadCreLeadImportTemplate(): void {
  const headers = [
    "Sl. No.",
    "ENQUIRY DATE",
    "LEAD SOURCE",
    "CUSTOMER NAME",
    "PHONE",
    "MAIL ID",
    "LOCATION",
    "EXISTING VARIANT",
    "MODEL",
    "CALL DATE",
    "INITIAL REMARK",
    "LEAD TYPE",
    "SALES CONSULTANT",
    "DATE",
    "SALES PERSON REMARK",
    "TD Date",
    "TD DONE\nYES/ NO",
    "TD NOT DONE,\nWHY?",
    "AFTER TD REMARK",
    "CRE Follow up call 1 Date",
    "CRE Follow up call remark 1",
    "Sales Person Follow up call 1 Date",
    "Sales Person Follow up call 1 Remark 1",
    "CRE Follow up call 2 Date",
    "CRE Follow up call remark 2",
    "Sales Person Follow up call remark 2 Date",
    "Sales Person Follow up call remark 2",
    "CRE Follow up call 3 Date",
    "CRE Follow up call remark 3",
    "Sales Person Follow up call remark 3 Date",
    "Sales Person Follow up call remark 3",
    "BOOKING DONE\nYES / NO",
    "BOOKING DATE",
    "FINAL MODEL",
    "FINAL VARIANT",
    "FINAL COLOUR",
    "MAIL SENT\nYES / NO",
    "EXCHANGE\nYES / NO",
    "RETAIL DONE\nYES / NO",
    "RETAIL DATE",
    "DELIVERY DATE",
  ];
  const sample = [
    "1",
    "28-Apr-26",
    "Walk-In",
    "Sample Customer",
    "9876543210",
    "NO",
    "Patna",
    "NO",
    "VF 7",
    "28-Apr-26",
    "Interested in test drive",
    "HOT (within 30 days)",
    "Prashant (SE)",
    "",
    "",
    "",
    "NO",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "NO",
    "",
    "",
    "",
    "",
    "NO",
    "NO",
    "NO",
    "",
    "",
  ];
  const ws = XLSX.utils.aoa_to_sheet([headers, sample]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Leads");
  XLSX.writeFile(wb, "cre-leads-import-template.xlsx");
}

/** CRE form lead-type options (Excel LEAD TYPE values). */
export const CRE_LEAD_TYPE_OPTIONS = [
  "HOT (within 30 days)",
  "WARM (within 60 days)",
  "COLD (beyond 60 days)",
  "FOLLOW-UP",
  "NOT CONNECTED",
  "LOST",
] as const;

export const CRE_SOURCE_OPTIONS = [
  "Walk-in",
  "Existing Customer Referral",
  "Outdoor Activity",
  "Tele-Out",
  "Tele-In",
  "Meta Ads",
  "CarDekho",
  "Management Referral",
  "VinFast India Digital Leads",
  "Social Media (YouTube, Facebook, Instagram)",
  "WhatsApp",
  "Website",
  "Event / BTL",
] as const;
