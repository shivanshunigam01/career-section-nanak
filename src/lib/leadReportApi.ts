import { adminGet } from "@/lib/api";

export type LeadReportOverview = {
  totalLeads: number;
  activeLeads: number;
  unassigned: number;
  convertedCount: number;
  conversionRate: number;
  followUpsPending: number;
  followUpsCompleted: number;
  followUpsOverdue: number;
  feedbackCount: number;
  avgFeedbackRating: number;
};

export type LeadExecutivePerformance = {
  executiveId: string | null;
  name: string;
  leadsAssigned: number;
  leadsConverted: number;
  conversionRate: number;
  stageChanges: number;
  followUpsLogged: number;
  followUpsCompleted: number;
  followUpsPending: number;
  followUpsOverdue: number;
  testDrivesCompleted: number;
  feedbackCount: number;
  avgExecutiveBehaviour: number | null;
};

export type LeadActivityRow = {
  type: "stage_change" | "assignment" | "follow_up" | "feedback";
  at: string;
  executiveName: string;
  executiveId?: string;
  leadId?: string | null;
  leadName: string;
  leadMobile: string;
  detail: string;
  status?: string;
};

export type LeadFollowUpReportRow = {
  id: string;
  leadId: string | null;
  leadName: string;
  leadMobile: string;
  leadStatus: string;
  executiveName: string;
  note: string;
  scheduledAt?: string;
  completedAt?: string;
  outcome: string;
  status: string;
  createdAt: string;
};

export type LeadFeedbackReportRow = {
  createdAt?: string;
  customerName: string;
  mobile: string;
  leadId: string | null;
  leadName: string;
  leadStatus: string | null;
  executiveName: string;
  bookingId: string;
  model: string;
  overallRating?: number;
  purchaseIntention?: number;
  executiveBehaviour?: number;
  remarks: string;
};

export type LeadDetailReportRow = {
  leadId: string;
  name: string;
  mobile: string;
  model: string;
  status: string;
  source: string;
  interest: string;
  assignedTo: string;
  assignedToId: string | null;
  followUpCount: number;
  followUpsPending: number;
  lastFollowUp: string | null;
  nextFollowUp: string | null;
  remarks: string;
  feedbackRating: number | null;
  purchaseIntention: number | null;
  converted: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type LeadAdminReport = {
  overview: LeadReportOverview;
  pipeline: Record<string, number>;
  bySource: Record<string, number>;
  byModel: Record<string, number>;
  executivePerformance: LeadExecutivePerformance[];
  followUpSummary: { pending: number; completed: number; overdue: number; cancelled: number; total: number };
  followUpRows: LeadFollowUpReportRow[];
  activityLog: LeadActivityRow[];
  feedbackRows: LeadFeedbackReportRow[];
  leadDetailRows: LeadDetailReportRow[];
  stages: string[];
};

export async function fetchLeadAdminReport(params?: {
  from?: string;
  to?: string;
  executiveId?: string;
}): Promise<LeadAdminReport> {
  const q = new URLSearchParams();
  if (params?.from) q.set("from", params.from);
  if (params?.to) q.set("to", params.to);
  if (params?.executiveId) q.set("executiveId", params.executiveId);
  const { data } = await adminGet<LeadAdminReport>(`/admin/td/leads/reports/admin?${q}`);
  return data!;
}
