import * as XLSX from "xlsx";
import { API_BASE } from "@/lib/apiConfig";
import { getAdminToken } from "@/lib/adminAuth";
import { adminPostJson, ApiRequestError } from "@/lib/api";

export type CrmImportLeadRow = {
  name: string;
  mobile: string;
  email?: string;
  city?: string;
  model?: string;
  source?: string;
  status?: string;
  remarks?: string;
  assignedToEmail?: string;
  nextFollowUp?: string;
  financeNeeded?: boolean | string;
  exchangeNeeded?: boolean | string;
};

export type CrmImportFollowUpRow = {
  mobile?: string;
  leadId?: string;
  note: string;
  scheduledAt?: string;
  completedAt?: string;
  outcome?: string;
  status?: string;
};

export type CrmImportResult = {
  created: number;
  followUpsCreated?: number;
  failed: { row: number | string; name?: string; mobile?: string; message: string }[];
};

function cellStr(value: unknown): string {
  if (value == null) return "";
  if (value instanceof Date) return value.toISOString();
  return String(value).trim();
}

function normalizeHeader(h: string): string {
  return h.trim().toLowerCase().replace(/\s+/g, " ");
}

function pick(raw: Record<string, unknown>, aliases: string[]): string {
  const map: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(raw)) {
    map[normalizeHeader(k)] = v;
  }
  for (const a of aliases) {
    const key = normalizeHeader(a);
    if (map[key] != null && cellStr(map[key]) !== "") return cellStr(map[key]);
    for (const [hk, hv] of Object.entries(map)) {
      if (hk === key || hk.includes(key)) {
        const s = cellStr(hv);
        if (s) return s;
      }
    }
  }
  return "";
}

export function parseCrmLeadSpreadsheet(file: File): Promise<{
  leads: CrmImportLeadRow[];
  followUps: CrmImportFollowUpRow[];
}> {
  return file.arrayBuffer().then((buf) => {
    const wb = XLSX.read(buf, { type: "array", cellDates: true });
    const names = wb.SheetNames || [];
    const leadsName = names.find((n) => /^leads?$/i.test(n)) || names[0];
    const followName = names.find((n) => /follow/i.test(n));

    const leadSheet = leadsName ? wb.Sheets[leadsName] : null;
    const rawLeads = leadSheet
      ? (XLSX.utils.sheet_to_json(leadSheet, { defval: "" }) as Record<string, unknown>[])
      : [];

    const leads: CrmImportLeadRow[] = [];
    for (const raw of rawLeads) {
      const name = pick(raw, ["name", "customer name", "full name", "lead name"]);
      const mobile = pick(raw, ["mobile", "phone", "contact", "mobile number"]);
      if (!name || !mobile) continue;
      leads.push({
        name,
        mobile,
        email: pick(raw, ["email", "email id"]) || undefined,
        city: pick(raw, ["city", "state", "location"]) || undefined,
        model: pick(raw, ["model", "interested model", "vehicle"]) || undefined,
        source: pick(raw, ["source", "lead source"]) || undefined,
        status: pick(raw, ["status", "lead status"]) || undefined,
        remarks: pick(raw, ["remarks", "notes", "comment"]) || undefined,
        assignedToEmail:
          pick(raw, ["assigned to email", "assignee email", "assignedtoemail"]) || undefined,
        nextFollowUp: pick(raw, ["next follow up", "next followup", "nextfollowup"]) || undefined,
        financeNeeded: pick(raw, ["finance", "finance needed"]) || undefined,
        exchangeNeeded: pick(raw, ["exchange", "exchange needed"]) || undefined,
      });
    }

    const followUps: CrmImportFollowUpRow[] = [];
    if (followName && wb.Sheets[followName]) {
      const rawFus = XLSX.utils.sheet_to_json(wb.Sheets[followName], { defval: "" }) as Record<
        string,
        unknown
      >[];
      for (const raw of rawFus) {
        const note = pick(raw, ["note", "follow up note", "remarks", "comment"]);
        if (!note) continue;
        followUps.push({
          note,
          mobile: pick(raw, ["mobile", "phone"]) || undefined,
          leadId: pick(raw, ["lead id", "leadid"]) || undefined,
          scheduledAt: pick(raw, ["scheduled at", "scheduled"]) || undefined,
          completedAt: pick(raw, ["completed at", "completed"]) || undefined,
          outcome: pick(raw, ["outcome"]) || undefined,
          status: pick(raw, ["status"]) || undefined,
        });
      }
    }

    return { leads, followUps };
  });
}

export function downloadCrmLeadImportTemplate() {
  const leadRows = [
    {
      Name: "Sample Customer",
      Mobile: "9876543210",
      Email: "sample@example.com",
      City: "Patna",
      Model: "VF 7",
      Source: "Excel Import",
      Status: "Enquiry",
      Remarks: "",
      AssignedToEmail: "",
      NextFollowUp: "",
      FinanceNeeded: "No",
      ExchangeNeeded: "No",
    },
  ];
  const followRows = [
    {
      Mobile: "9876543210",
      LeadId: "",
      Note: "Called customer — interested in test drive",
      ScheduledAt: "",
      CompletedAt: "",
      Outcome: "Connected",
      Status: "completed",
    },
  ];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(leadRows), "Leads");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(followRows), "FollowUps");
  XLSX.writeFile(wb, "crm-leads-import-template.xlsx");
}

export async function importCrmLeads(
  leads: CrmImportLeadRow[],
  followUps: CrmImportFollowUpRow[],
): Promise<CrmImportResult> {
  return adminPostJson<CrmImportResult>("/admin/crm/leads/import", { leads, followUps });
}

export async function exportCrmLeadsExcel(query?: Record<string, string>): Promise<void> {
  const params = new URLSearchParams(query || {});
  const qs = params.toString() ? `?${params}` : "";
  const token = getAdminToken();
  const headers = new Headers();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const res = await fetch(`${API_BASE}/admin/crm/leads/export${qs}`, { headers });
  if (!res.ok) {
    let message = "Export failed";
    try {
      const json = (await res.json()) as { message?: string };
      message = String(json.message || message);
    } catch {
      /* ignore */
    }
    throw new ApiRequestError(message, res.status);
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `crm-leads-export-${new Date().toISOString().slice(0, 10)}.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadImportErrors(
  failed: { row: number | string; name?: string; mobile?: string; message: string }[],
  filename = "import-errors.xlsx",
) {
  if (!failed?.length) return;
  const rows = failed.map((f) => ({
    Row: f.row,
    Name: f.name || "",
    Mobile: f.mobile || "",
    Error: f.message || "",
  }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows), "Errors");
  XLSX.writeFile(wb, filename);
}

export async function bulkDeleteCrmLeads(ids: string[]): Promise<{ deleted: number }> {
  return adminPostJson<{ deleted: number }>("/admin/crm/leads/bulk-delete", { ids });
}
