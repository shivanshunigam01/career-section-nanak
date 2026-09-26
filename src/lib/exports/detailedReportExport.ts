import type { DetailedReport } from "@/lib/detailedReportApi";
import { downloadExcelWorkbook } from "@/lib/reportExcelExport";

export function downloadDetailedReportExcel(report: DetailedReport) {
  const stamp = report.period.today || new Date().toISOString().slice(0, 10);
  const s = report.summary;

  const summaryRows: Record<string, unknown>[] = [
    { Metric: "Total Leads (All)", Value: s.totalLeads.all },
    { Metric: "Total Leads MTD", Value: s.totalLeads.mtd },
    { Metric: "Total Leads Today", Value: s.totalLeads.today },
    { Metric: "Walk-In (All)", Value: s.walkIn.all },
    { Metric: "Walk-In MTD", Value: s.walkIn.mtd },
    { Metric: "Digital (All)", Value: s.digital.all },
    { Metric: "Digital MTD", Value: s.digital.mtd },
    { Metric: "TD Till Date", Value: s.testDrives.all },
    { Metric: "TD MTD", Value: s.testDrives.mtd },
    { Metric: "TD Today", Value: s.testDrives.doneToday },
    { Metric: "Booking Count", Value: s.bookingCount },
    { Metric: "Calls Made Today", Value: s.callsMadeToday },
    { Metric: "Lead Sources Total", Value: report.leadSourcesTotal.count },
    { Metric: "Assigned (sheet)", Value: report.leadSourcesTotal.assignedCount },
    {
      Metric: "Unassigned (sheet consultant)",
      Value: report.unassignedSheet?.totalLeads ?? "",
    },
    { Metric: "Generated At", Value: report.generatedAt },
    { Metric: "Period", Value: report.period.label },
  ];

  downloadExcelWorkbook(`detailed-report-${stamp}`, [
    { name: "Summary", rows: summaryRows },
    {
      name: "Lead Sources",
      rows: report.leadSources.map((r) => ({
        Source: r.source,
        Count: r.count,
        Assigned: r.assignedCount,
      })),
    },
    {
      name: "Unassigned",
      rows: report.unassignedSheet
        ? [
            {
              Leads: report.unassignedSheet.totalLeads,
              TD: report.unassignedSheet.totalTestDrive,
              "TD MTD": report.unassignedSheet.totalTestDriveMtd,
            },
          ]
        : [],
    },
    {
      name: "Sales Managers",
      rows: report.salesManagers.map((r) => ({
        Manager: r.name,
        Role: r.abbr,
        "Total Leads": r.totalLeads,
        "Total TD": r.totalTestDrive,
        "TD MTD": r.totalTestDriveMtd,
        "TD By Team": r.teamTestDrive ?? 0,
        "Team TD MTD": r.teamTestDriveMtd ?? 0,
      })),
    },
    {
      name: "Sales Executives",
      rows: report.salesExecutives.map((r) => ({
        Executive: r.name,
        Role: r.abbr,
        "Total Leads": r.totalLeads,
        "Total TD": r.totalTestDrive,
        "TD MTD": r.totalTestDriveMtd,
      })),
    },
    {
      name: "Lead Types",
      rows: report.leadTypes.map((r) => ({ "Lead Type": r.leadType, Count: r.count })),
    },
    {
      name: "Monthly TD",
      rows: report.monthlyTestDrives.map((r) => ({ Month: r.month, Count: r.count })),
    },
  ]);
}
