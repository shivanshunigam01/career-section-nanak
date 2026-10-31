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
      name: "Sales Manager & Team",
      rows: (report.salesManagerTeams ?? report.salesManagers.map((m) => ({ manager: m, executives: [], teamRollup: null }))).flatMap(
        (team) => {
          const mgr = team.manager;
          const rollup = team.teamRollup;
          const rows: Record<string, unknown>[] = [
            {
              Name: mgr.name,
              Role: mgr.abbr,
              Level: "Manager",
              "Leads Assigned": mgr.totalLeads,
              "Total TD Done": mgr.totalTestDrive,
              "TD MTD": mgr.totalTestDriveMtd,
              "TD Today": mgr.totalTestDriveToday ?? 0,
            },
          ];
          for (const exec of team.executives ?? []) {
            rows.push({
              Name: `  ${exec.name}`,
              Role: exec.abbr,
              Level: "Executive",
              "Leads Assigned": exec.totalLeads,
              "Total TD Done": exec.totalTestDrive,
              "TD MTD": exec.totalTestDriveMtd,
              "TD Today": exec.totalTestDriveToday ?? 0,
            });
          }
          if (team.executives?.length && team.teamRollup) {
            rows.push({
              Name: "",
              Role: "",
              Level: "Team total",
              "Leads Assigned": team.teamRollup.teamTotalLeads,
              "Total TD Done": team.teamRollup.teamTotalTd,
              "TD MTD": team.teamRollup.teamTotalTdMtd,
              "TD Today": team.teamRollup.teamTotalTdToday ?? 0,
            });
          }
          return rows;
        },
      ),
    },
    ...(report.orphanSalesExecutives?.length
      ? [
          {
            name: "Other Executives",
            rows: report.orphanSalesExecutives.map((r) => ({
              Executive: r.name,
              Role: r.abbr,
              "Total Leads": r.totalLeads,
              "Total TD": r.totalTestDrive,
              "TD MTD": r.totalTestDriveMtd,
            })),
          },
        ]
      : []),
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
