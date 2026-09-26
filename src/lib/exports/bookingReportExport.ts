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
    "Booking Date": row.bookingDate ? row.bookingDate.slice(0, 10) : "",
  }));

  const summary: Record<string, unknown>[] = [
    { Metric: "Period From", Value: report.from },
    { Metric: "Period To", Value: report.to },
    { Metric: "Total Bookings", Value: report.totalBookings },
    { Metric: "Generated", Value: new Date().toISOString() },
  ];

  downloadExcelWorkbook(`booking-report-${report.from}-${report.to}`, [
    { name: "Summary", rows: summary },
    { name: "Bookings", rows },
  ]);
}
