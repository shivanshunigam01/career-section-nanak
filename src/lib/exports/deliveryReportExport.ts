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
    Team: row.teamManager ?? "",
    "Delivery Date": row.deliveryDate ? row.deliveryDate.slice(0, 10) : "",
  }));

  const summary: Record<string, unknown>[] = [
    { Metric: "Period From", Value: report.from },
    { Metric: "Period To", Value: report.to },
    { Metric: "Deliveries In Range", Value: report.totalInSelectedRange ?? report.totalDeliveries },
    { Metric: "Deliveries All (Lead CRM)", Value: report.alignedWithLeadReport?.all ?? "" },
    { Metric: "Deliveries MTD (Lead CRM)", Value: report.alignedWithLeadReport?.mtd ?? "" },
    { Metric: "Deliveries Today (Lead CRM)", Value: report.alignedWithLeadReport?.today ?? "" },
    { Metric: "Generated", Value: new Date().toISOString() },
  ];

  const teamRows =
    report.byTeam?.map((t) => ({
      Manager: t.managerName,
      Own: t.ownCount,
      "Team Total": t.teamCount,
    })) ?? [];

  downloadExcelWorkbook(`delivery-report-${report.from}-${report.to}`, [
    { name: "Summary", rows: summary },
    ...(teamRows.length ? [{ name: "By Team", rows: teamRows }] : []),
    { name: "Deliveries", rows },
  ]);
}
