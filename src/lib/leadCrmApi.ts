import { adminGet, adminPatchJson, adminPostJson } from "@/lib/api";
import type { CrmLeadStage } from "@/lib/leadStages";

export type CrmLead = {
  _id: string;
  name: string;
  mobile: string;
  email?: string;
  city?: string;
  model: string;
  source?: string;
  status: string;
  remarks?: string;
  nextFollowUp?: string;
  assignedTo?: { _id: string; name: string; email?: string } | null;
  createdAt?: string;
  updatedAt?: string;
};

export type LeadStageHistoryItem = {
  _id: string;
  fromStage?: string;
  toStage: string;
  reason?: string;
  createdAt: string;
  changedBy?: { name?: string; email?: string } | null;
};

export type LeadFollowUpItem = {
  _id: string;
  note: string;
  scheduledAt?: string;
  completedAt?: string;
  outcome?: string;
  status: "pending" | "completed" | "cancelled";
  createdAt: string;
  createdBy?: { name?: string; email?: string } | null;
};

export type CrmLeadDetail = {
  lead: CrmLead;
  history: LeadStageHistoryItem[];
  followUps: LeadFollowUpItem[];
  stages: CrmLeadStage[];
};

export type AssignableStaffUser = {
  _id: string;
  name: string;
  email?: string;
  role?: string;
  designation?: string;
  designationLabel?: string;
};

/** Active staff from User Master (TD → User Master module). */
export async function fetchAssignableStaffUsers(): Promise<AssignableStaffUser[]> {
  const { data } = await adminGet<AssignableStaffUser[]>("/admin/td/users/assignable");
  return data ?? [];
}

/** @deprecated Use fetchAssignableStaffUsers */
export const fetchCrmExecutives = fetchAssignableStaffUsers;

export async function assignCrmLeadExecutive(leadId: string, executiveId: string | null): Promise<CrmLead> {
  return adminPatchJson<CrmLead>(`/admin/td/leads/${leadId}/assign`, {
    executiveId: executiveId || null,
  });
}

export async function fetchCrmLeads(params?: {
  search?: string;
  status?: string;
  followUpDue?: boolean;
  assignedTo?: string;
  limit?: number;
}): Promise<{ leads: CrmLead[]; total: number; stages: CrmLeadStage[] }> {
  const q = new URLSearchParams({ limit: String(params?.limit ?? 100) });
  if (params?.search) q.set("search", params.search);
  if (params?.status && params.status !== "all") q.set("status", params.status);
  if (params?.followUpDue) q.set("followUpDue", "true");
  if (params?.assignedTo) q.set("assignedTo", params.assignedTo);

  const res = await adminGet<CrmLead[]>(`/admin/td/leads?${q}`);
  return {
    leads: res.data ?? [],
    total: res.meta?.total ?? res.data?.length ?? 0,
    stages: (res.meta as { stages?: CrmLeadStage[] } | undefined)?.stages ?? [],
  };
}

export async function fetchCrmLeadDetail(id: string): Promise<CrmLeadDetail> {
  const { data } = await adminGet<CrmLeadDetail>(`/admin/td/leads/${id}`);
  return {
    lead: data!.lead,
    history: data?.history ?? [],
    followUps: data?.followUps ?? [],
    stages: data?.stages ?? [],
  };
}

export async function updateCrmLeadStage(id: string, stage: string, reason?: string): Promise<CrmLead> {
  return adminPatchJson<CrmLead>(`/admin/td/leads/${id}/stage`, { stage, reason });
}

export async function updateCrmLeadRemarks(id: string, remarks: string): Promise<CrmLead> {
  return adminPatchJson<CrmLead>(`/admin/td/leads/${id}/remarks`, { remarks });
}

export async function addCrmFollowUp(
  leadId: string,
  payload: { note: string; scheduledAt?: string; outcome?: string; markCompleted?: boolean },
): Promise<LeadFollowUpItem> {
  return adminPostJson<LeadFollowUpItem>(`/admin/td/leads/${leadId}/follow-ups`, payload);
}

export async function completeCrmFollowUp(leadId: string, followUpId: string, outcome?: string): Promise<LeadFollowUpItem> {
  return adminPatchJson<LeadFollowUpItem>(`/admin/td/leads/${leadId}/follow-ups/${followUpId}`, {
    status: "completed",
    outcome,
  });
}
