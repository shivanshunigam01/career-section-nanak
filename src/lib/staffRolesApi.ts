import { adminDeleteJson, adminGet, adminPostJson, adminPutJson } from "@/lib/api";
import type { AdminModuleKey } from "@/lib/adminModules";

export type StaffRoleRecord = {
  _id: string;
  name: string;
  description?: string;
  authRole: "executive" | "manager";
  allowedModules: string[];
  allowedActions: string[];
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type StaffRolePayload = {
  name: string;
  description?: string;
  authRole: "executive" | "manager";
  allowedModules: AdminModuleKey[] | string[];
  allowedActions: string[];
  active?: boolean;
};

export async function fetchStaffRoles(activeOnly = false): Promise<StaffRoleRecord[]> {
  const q = activeOnly ? "?active=true" : "";
  const { data } = await adminGet<StaffRoleRecord[]>(`/admin/td/roles${q}`);
  return Array.isArray(data) ? data : [];
}

export async function createStaffRole(payload: StaffRolePayload): Promise<StaffRoleRecord> {
  return adminPostJson<StaffRoleRecord>("/admin/td/roles", payload);
}

export async function updateStaffRole(id: string, payload: Partial<StaffRolePayload>): Promise<StaffRoleRecord> {
  return adminPutJson<StaffRoleRecord>(`/admin/td/roles/${id}`, payload);
}

export async function deleteStaffRole(id: string): Promise<void> {
  await adminDeleteJson(`/admin/td/roles/${id}`);
}
