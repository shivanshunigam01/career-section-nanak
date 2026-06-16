import { adminGet, adminPatchJson, adminPostJson } from "@/lib/api";

export type TDLogRecord = {
  _id: string;
  bookingId: string;
  openingOdometer?: number;
  closingOdometer?: number;
  totalKM?: number;
  openingBattery?: number;
  closingBattery?: number;
  durationMinutes?: number;
  status: "STARTED" | "COMPLETED" | "ABORTED";
  startTime?: string;
  endTime?: string;
};

export async function fetchTdLogByBooking(bookingId: string): Promise<TDLogRecord | null> {
  const { data } = await adminGet<TDLogRecord[]>(`/admin/td/logs?bookingId=${bookingId}`);
  const logs = data ?? [];
  return logs[0] ?? null;
}

export async function startTestDriveLog(payload: {
  bookingId: string;
  openingOdometer: number;
  openingBattery?: number;
}): Promise<TDLogRecord> {
  return adminPostJson<TDLogRecord>("/admin/td/logs/start", payload);
}

export async function endTestDriveLog(
  logId: string,
  payload: {
    closingOdometer: number;
    closingBattery?: number;
    executiveRemarks?: string;
  },
): Promise<TDLogRecord> {
  return adminPatchJson<TDLogRecord>(`/admin/td/logs/${logId}/end`, payload);
}
