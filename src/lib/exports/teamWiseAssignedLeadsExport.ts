import type { TeamWiseAssignedLeadsReport } from "@/lib/teamWiseAssignedLeadsApi";
import { downloadExcelWorkbook } from "@/lib/reportExcelExport";

/** Flat matrix sheet (same layout as on-screen table). */
export function downloadTeamWiseAssignedLeadsExcel(report: TeamWiseAssignedLeadsReport) {
  const { teamMatrix } = report;
  const headerRow: unknown[] = [
    "Lead Source",
    ...teamMatrix.columns.map((c) => `${c.name} (${c.abbr})`),
    "Source Wise Total",
  ];
  const body: unknown[][] = [headerRow];
  for (const row of teamMatrix.rows) {
    body.push([
      row.source,
      ...teamMatrix.columns.map((c) => row.cells[c.staffId] ?? 0),
      row.rowTotal,
    ]);
  }
  body.push([
    "TOTAL",
    ...teamMatrix.columns.map((c) => teamMatrix.columnTotals[c.staffId] ?? 0),
    teamMatrix.grandTotal,
  ]);

  const summary: Record<string, unknown>[] = [
    { Metric: "Period", Value: report.period.label },
    { Metric: "Generated At", Value: report.generatedAt },
    { Metric: "Grand Total", Value: teamMatrix.grandTotal },
    { Metric: "Staff Columns", Value: teamMatrix.columns.length },
    { Metric: "Lead Sources", Value: teamMatrix.rows.length },
  ];

  downloadExcelWorkbook(`team-wise-assigned-leads-${report.period.today}`, [
    { name: "Summary", rows: summary },
    { name: "Matrix", rows: body },
  ]);
}
