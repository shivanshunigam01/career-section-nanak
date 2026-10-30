import { adminGet } from "@/lib/api";

export type DetailedReportSummaryBlock = {
  all: number;
  mtd: number;
  today: number;
};

export type DetailedReportSummary = {
  totalLeads: DetailedReportSummaryBlock;
  walkIn: DetailedReportSummaryBlock;
  digital: DetailedReportSummaryBlock;
  testDrives: { all: number; mtd: number; doneToday: number };
  bookingCount: number;
  callsMadeToday: number;
  leadTemperature?: { hot: number; warm: number; cold: number };
};

export type DetailedReportLeadAssignment = {
  total: number;
  crmAssigned: number;
  crmUnassigned: number;
  sheetConsultantNamed: number;
  crmAssignedOnly: number;
};

export type DetailedReportLeadSourceRow = {
  source: string;
  count: number;
  assignedCount: number;
  isWalkIn?: boolean;
};

export type DetailedReportStaffRow = {
  staffId: string;
  name: string;
  designation: string;
  abbr: string;
  totalLeads: number;
  totalTestDrive: number;
  totalTestDriveMtd: number;
  teamTestDrive?: number;
  teamTestDriveMtd?: number;
  /** Manager + direct-report SE leads (sheet attribution). */
  teamTotalLeads?: number;
};

export type DetailedReportAttributionTotals = {
  grandTotal: number;
  managersDirect: number;
  executives: number;
  otherStaff: number;
  sheetUnmatched: number;
  attributedSubtotal: number;
  inBalance: boolean;
};

export type DetailedReportLeadTypeRow = {
  leadType: string;
  count: number;
};

export type DetailedReportMonthlyTd = {
  month: string;
  monthNum: number;
  count: number;
};

export type DetailedReportTeamMember = {
  staffId: string;
  name: string;
  abbr: string;
  designation: string;
  totalLeads: number;
};

export type DetailedReportTeam = {
  teamId: string;
  managerName: string;
  managerAbbr: string;
  colorClass: string;
  teamTotal: number;
  members: DetailedReportTeamMember[];
};

export type DetailedReportMatrixRow = {
  source: string;
  cells: Record<string, number>;
  rowTotal: number;
};

export type DetailedReportTeamMatrix = {
  teams: DetailedReportTeam[];
  columns: DetailedReportTeamMember[];
  rows: DetailedReportMatrixRow[];
  grandTotal: number;
  columnTotals: Record<string, number>;
};

export type DetailedReportUnassignedSheet = {
  totalLeads: number;
  totalTestDrive: number;
  totalTestDriveMtd: number;
};

export type DetailedReportLeadRow = {
  leadId: string;
  name: string;
  mobile: string;
  model: string;
  status: string;
  source: string;
  assignedTo: string;
  enquiryAt: string | null;
  remarks: string;
  isWalkInSheet: boolean;
  isDigitalSheet: boolean;
  bookingDone: boolean;
};

export type DetailedReportTestDriveRow = {
  bookingId: string;
  slotDate: string | null;
  bookingStatus: string;
  customerName: string;
  customerMobile: string;
  model: string;
  source: string;
  leadId: string | null;
};

export type DetailedReportFollowUpCallRow = {
  followUpId: string;
  leadId: string | null;
  customerName: string;
  customerMobile: string;
  model: string;
  note: string;
  status: string;
  scheduledAt: string | null;
  completedAt: string | null;
  executive: string;
};

export type DetailedReportPeriodBounds = {
  mtdFrom: string;
  mtdTo: string;
  todayFrom: string;
  todayTo: string;
};

export type DetailedReport = {
  generatedAt: string;
  period: {
    mtdFrom?: string;
    mtdTo: string;
    today: string;
    label: string;
  };
  summary: DetailedReportSummary;
  leadAssignment?: DetailedReportLeadAssignment;
  leadSources: DetailedReportLeadSourceRow[];
  leadSourcesTotal: { count: number; assignedCount: number };
  salesManagers: DetailedReportStaffRow[];
  salesExecutives: DetailedReportStaffRow[];
  leadTypes: DetailedReportLeadTypeRow[];
  leadTypesTotal: number;
  monthlyTestDrives: DetailedReportMonthlyTd[];
  monthlyTestDrivesTotal: number;
  unassignedSheet?: DetailedReportUnassignedSheet;
  attributionTotals?: DetailedReportAttributionTotals;
  attributionNote?: string;
  leadDetailRows?: DetailedReportLeadRow[];
  leadDetailRowsTotal?: number;
  leadDetailRowsTruncated?: boolean;
  testDriveDetailRows?: DetailedReportTestDriveRow[];
  followUpCallRows?: DetailedReportFollowUpCallRow[];
  periodBounds?: DetailedReportPeriodBounds;
};

export async function fetchDetailedReport(): Promise<DetailedReport> {
  const { data } = await adminGet<DetailedReport>("/admin/reports/detailed");
  if (!data) throw new Error("Detailed report response was empty");
  return data;
}

export type DetailedKpiRecordsKind = "leads" | "testDrives" | "followUps";

export type DetailedKpiRecordsResponse = {
  kind: DetailedKpiRecordsKind;
  kpi: string;
  scope: string;
  rows: DetailedReportLeadRow[] | DetailedReportTestDriveRow[] | DetailedReportFollowUpCallRow[];
  total: number;
  truncated?: boolean;
};

export type DetailedReportDrillParams = {
  kpi?: string;
  scope?: string;
  table?: string;
  source?: string;
  metric?: string;
  leadType?: string;
  staffId?: string;
  monthNum?: number | string;
  year?: number | string;
};

export async function fetchDetailedReportKpiRecords(
  params: DetailedReportDrillParams | string,
  scope?: string,
): Promise<DetailedKpiRecordsResponse> {
  const q = new URLSearchParams();
  if (typeof params === "string") {
    q.set("kpi", params);
    if (scope) q.set("scope", scope);
  } else {
    for (const [key, val] of Object.entries(params)) {
      if (val !== undefined && val !== null && String(val).trim() !== "") {
        q.set(key, String(val));
      }
    }
  }
  const { data } = await adminGet<DetailedKpiRecordsResponse>(`/admin/reports/detailed/kpi-records?${q}`);
  if (!data) throw new Error("KPI records could not be loaded");
  return data;
}
