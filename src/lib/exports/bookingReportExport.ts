import type { BookingReport } from "@/lib/bookingReportApi";
import { downloadExcelWorkbook } from "@/lib/reportExcelExport";

export function downloadBookingReportExcel(report: BookingReport) {
  const rows = report.rows.map((row) => ({
    "Customer Name": row.customerName || row.name,
    Mobile: row.mobile,
    "Car Model": row.carModel,
    Variant: row.carVariant,
    Colour: row.colour,
    "Lead ID": row.leadId,
    "Order No": row.orderNumber ?? "",
    "Booking No": row.bookingNo ?? "",
    Source: row.source,
    Executive: row.executiveName,
    Team: row.teamManager ?? "",
    Stage: row.status || row.stage || "",
    "Booking Date": row.bookingDate ? row.bookingDate.slice(0, 10) : "",
  }));

  const summary: Record<string, unknown>[] = [
    { Metric: "Period From", Value: report.from },
    { Metric: "Period To", Value: report.to },
    { Metric: "Bookings In Range", Value: report.totalInSelectedRange ?? report.totalBookings },
    { Metric: "Bookings All (Lead CRM)", Value: report.alignedWithLeadReport?.all ?? "" },
    { Metric: "Bookings MTD (Lead CRM)", Value: report.alignedWithLeadReport?.mtd ?? "" },
    { Metric: "Bookings Today (Lead CRM)", Value: report.alignedWithLeadReport?.today ?? "" },
    { Metric: "Generated", Value: new Date().toISOString() },
  ];

  const teamRows =
    report.byTeam?.map((t) => ({
      Manager: t.managerName,
      Own: t.ownCount,
      "Team Total": t.teamCount,
    })) ?? [];

  downloadExcelWorkbook(`booking-report-${report.from}-${report.to}`, [
    { name: "Summary", rows: summary },
    ...(teamRows.length ? [{ name: "By Team", rows: teamRows }] : []),
    { name: "Bookings", rows },
  ]);
}
