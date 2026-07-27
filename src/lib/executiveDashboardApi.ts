import { adminGet } from "@/lib/api";
import type { LeadAdminReport, LeadDetailReportRow, LeadActivityRow, LeadFeedbackReportRow } from "@/lib/leadReportApi";

export type ExecutiveTdStats = {
  totalBookings: number;
  completed: number;
  pending: number;
  cancelled: number;
  missed: number;
  inProgress: number;
  completionRate: number;
  feedbackCount: number;
  avgFeedbackRating: number;
  avgPurchaseIntention: number;
  byModel: Record<string, number>;
};

export type ExecutiveMonthlyRow = {
  month: number;
  label: string;
  leads: number;
  testDrives: number;
  testDrivesCompleted: number;
};

export type ExecutiveRecentBooking = {
  bookingId: string;
  status: string;
  slotDate?: string;
  slotTime?: string;
  model: string;
  customerName: string;
  mobile: string;
};

export type ExecutiveDashboard = {
  reportType?: "executive" | "cre";
  year: number;
  compareYear: number;
  period: { from: string; to: string };
  comparePeriod: { from: string; to: string };
  allTime: { totalLeads: number; totalTestDrives: number };
  leads: Pick<
    LeadAdminReport,
    "overview" | "pipeline" | "bySource" | "byModel" | "followUpSummary"
  > & {
    leadDetailRows: LeadDetailReportRow[];
    activityLog: LeadActivityRow[];
    feedbackRows: LeadFeedbackReportRow[];
  };
  leadsCompare: {
    overview: LeadAdminReport["overview"];
    pipeline: Record<string, number>;
    bySource: Record<string, number>;
  };
  testDrives: ExecutiveTdStats;
  testDrivesCompare: ExecutiveTdStats;
  monthly: ExecutiveMonthlyRow[];
  recentBookings: ExecutiveRecentBooking[];
  stages: string[];
};

export type CreReportExecutiveRow = {
  executiveId: string;
  name: string;
  email?: string;
  designation?: string;
  assignedCount: number;
  byLeadType: Record<string, number>;
  byArea: Record<string, number>;
};

export type CreReportLeadRow = {
  _id: string;
  leadId?: string;
  name: string;
  mobile: string;
  city?: string;
  area?: string;
  address?: string;
  leadType?: string;
  status: string;
  source?: string;
  model?: string;
  assignedTo?: { _id: string; name: string; email?: string } | null;
  createdAt?: string;
};

export type CreDashboardReport = {
  reportType: "cre";
  year: number;
  compareYear: number;
  period: { from: string; to: string };
  comparePeriod: { from: string; to: string };
  cre: { _id: string; name: string; email?: string; designation?: string };
  overview: {
    totalCreatedAllTime: number;
    totalCreated: number;
    totalCreatedPrev: number;
    assigned: number;
    unassigned: number;
    assignmentRate: number;
  };
  pipeline: Record<string, number>;
  byLeadType: Record<string, number>;
  byArea: Record<string, number>;
  bySource: Record<string, number>;
  byExecutive: CreReportExecutiveRow[];
  monthly: { month: number; label: string; created: number; assigned: number }[];
  recentLeads: CreReportLeadRow[];
  stages: string[];
};

export function isCreDashboardReport(
  data: ExecutiveDashboard | CreDashboardReport | null | undefined,
): data is CreDashboardReport {
  return Boolean(data && (data as CreDashboardReport).reportType === "cre");
}

export async function fetchExecutiveDashboard(
  year?: number,
): Promise<ExecutiveDashboard | CreDashboardReport> {
  const q = new URLSearchParams();
  if (year) q.set("year", String(year));
  const { data } = await adminGet<ExecutiveDashboard | CreDashboardReport>(
    `/admin/crm/leads/reports/me?${q}`,
  );
  return data;
}

export async function fetchCreReport(params?: {
  year?: number;
  creId?: string;
}): Promise<CreDashboardReport> {
  const q = new URLSearchParams();
  if (params?.year) q.set("year", String(params.year));
  if (params?.creId) q.set("creId", params.creId);
  const { data } = await adminGet<CreDashboardReport>(`/admin/crm/leads/reports/cre?${q}`);
  return data;
}
