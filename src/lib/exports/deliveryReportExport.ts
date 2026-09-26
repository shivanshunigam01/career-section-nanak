import type { DeliveryReport } from "@/lib/deliveryReportApi";
import { downloadExcelWorkbook } from "@/lib/reportExcelExport";

export function downloadDeliveryReportExcel(report: DeliveryReport) {
  const rows = report.rows.map((row) => ({
    "Lead ID": row.leadId,
    Name: row.name,
    Mobile: row.mobile,
    Model: row.model,
    "Car Model": row.carModel ?? "",
    "Car Variant": row.carVariant ?? "",
    Colour: row.colour ?? "",
    Source: row.source,
    Executive: row.executiveName,
    "Delivery Date": row.deliveryDate ? row.deliveryDate.slice(0, 10) : "",
  }));

  const summary: Record<string, unknown>[] = [
    { Metric: "Period From", Value: report.from },
    { Metric: "Period To", Value: report.to },
    { Metric: "Total Deliveries", Value: report.totalDeliveries },
    { Metric: "Generated", Value: new Date().toISOString() },
  ];

  downloadExcelWorkbook(`delivery-report-${report.from}-${report.to}`, [
    { name: "Summary", rows: summary },
    { name: "Deliveries", rows },
  ]);
}
