import { downloadExcelWorkbook } from "@/lib/reportExcelExport";

type Overview = {
  totalBookings: number;
  completed: number;
  pending: number;
  cancelled: number;
  missed: number;
  inProgress: number;
  totalCustomers: number;
  completionRate: number;
  leadConversionRate: number;
  leadsFromTestDrives: number;
  convertedToBusiness: number;
  feedbackCount: number;
};

type CustomerDriveRow = {
  bookingId: string;
  customerName: string;
  mobile: string;
  model: string;
  variant: string;
  vehicleLabel: string;
  slotDate: string;
  slotTime: string;
  status: string;
  executiveName: string;
  remarks: string;
  leadStatus?: string | null;
  converted?: boolean;
};

type FeedbackRow = {
  createdAt?: string;
  customerName: string;
  mobile: string;
  bookingId: string;
  slotDate?: string;
  slotTime?: string;
  model: string;
  vehicleLabel: string;
  executiveName: string;
  overallRating?: number;
  purchaseIntention?: number;
  remarks: string;
  leadStatus?: string | null;
  converted?: boolean;
};

type VehicleReportRow = {
  registrationNo: string;
  model: string;
  variant: string;
  color: string;
  status: string;
  totalTestDrives: number;
  totalKM: number;
  branchName: string;
  avgFeedbackRating: number | null;
  completedDrives: number;
  scheduledBookings: number;
};

type ExecRow = { name: string; total: number; completed: number };

export type TdAdminReportExportPayload = {
  from: string;
  to: string;
  overview: Overview;
  executivePerformance: ExecRow[];
  customerTestDriveLog: CustomerDriveRow[];
  allFeedback: FeedbackRow[];
  vehicleWiseReport: VehicleReportRow[];
};

export function downloadTdAdminReportExcel(payload: TdAdminReportExportPayload) {
  const { from, to, overview } = payload;
  const summaryRows: Record<string, unknown>[] = Object.entries(overview).map(([k, v]) => ({
    Metric: k,
    Value: v,
  }));

  downloadExcelWorkbook(`td-reports-${from || "from"}-${to || "to"}`, [
    { name: "Overview", rows: summaryRows },
    {
      name: "Executives",
      rows: payload.executivePerformance.map((r) => ({
        Executive: r.name,
        Total: r.total,
        Completed: r.completed,
      })),
    },
    {
      name: "Test Drive Log",
      rows: payload.customerTestDriveLog.map((r) => ({
        BookingId: r.bookingId,
        Customer: r.customerName,
        Mobile: r.mobile,
        Model: r.model,
        Variant: r.variant,
        Vehicle: r.vehicleLabel,
        Date: r.slotDate,
        Time: r.slotTime,
        Status: r.status,
        Executive: r.executiveName,
        LeadStatus: r.leadStatus ?? "",
        Converted: r.converted ? "Yes" : "No",
        Remarks: r.remarks,
      })),
    },
    {
      name: "Feedback",
      rows: payload.allFeedback.map((r) => ({
        Customer: r.customerName,
        Mobile: r.mobile,
        BookingId: r.bookingId,
        Model: r.model,
        Vehicle: r.vehicleLabel,
        Executive: r.executiveName,
        Overall: r.overallRating ?? "",
        PurchaseIntent: r.purchaseIntention ?? "",
        Remarks: r.remarks,
        CreatedAt: r.createdAt ?? "",
      })),
    },
    {
      name: "Vehicles",
      rows: payload.vehicleWiseReport.map((r) => ({
        Registration: r.registrationNo,
        Model: r.model,
        Variant: r.variant,
        Color: r.color,
        Status: r.status,
        "Total TD": r.totalTestDrives,
        KM: r.totalKM,
        Branch: r.branchName,
        "Avg Rating": r.avgFeedbackRating ?? "",
        Completed: r.completedDrives,
        Scheduled: r.scheduledBookings,
      })),
    },
  ]);
}
