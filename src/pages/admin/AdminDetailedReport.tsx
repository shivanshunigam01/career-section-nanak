import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { BarChart3, RefreshCw, Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatApiErrors } from "@/lib/api";
import {
  fetchDetailedReport,
  type DetailedReport,
  type DetailedReportFollowUpCallRow,
  type DetailedReportLeadRow,
  type DetailedReportTestDriveRow,
} from "@/lib/detailedReportApi";
import {
  filterDetailedFollowUpCalls,
  filterDetailedLeadRows,
  filterDetailedTestDriveRows,
} from "@/lib/detailedReportKpi";
import { cn } from "@/lib/utils";
import { ReportExportButtons } from "@/components/admin/ReportExportButtons";
import { downloadDetailedReportExcel } from "@/lib/exports/detailedReportExport";
import { printReportAsPdf } from "@/lib/reportPdfExport";

const TH =
  "bg-slate-800 text-white text-xs font-bold uppercase tracking-wide px-3 py-2 border border-slate-700 text-center";
const TD = "px-3 py-2 border border-slate-200 text-center text-sm tabular-nums";
const TD_L = "px-3 py-2 border border-slate-200 text-sm";
const TOTAL_ROW = "bg-amber-100 font-semibold";
const STRIPE = "bg-slate-50/80";

function fmt(n: number) {
  return n.toLocaleString("en-IN");
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function KpiBox({
  title,
  headerClass,
  metrics,
}: {
  title: string;
  headerClass: string;
  metrics: { label: string; value: number; onClick?: () => void }[];
}) {
  return (
    <Card className="overflow-hidden border shadow-sm">
      <div className={cn("px-3 py-2.5 text-white text-sm font-bold text-center", headerClass)}>{title}</div>
      <div className="divide-y divide-border">
        {metrics.map((m) => (
          <div key={m.label} className="flex items-center justify-between gap-3 px-3 py-2.5 text-sm">
            <span className="text-muted-foreground">{m.label}</span>
            {m.onClick ? (
              <button
                type="button"
                onClick={m.onClick}
                className="font-bold tabular-nums text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                title="View detailed records"
              >
                {fmt(m.value)}
              </button>
            ) : (
              <span className="font-bold tabular-nums text-foreground">{fmt(m.value)}</span>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

type PopupMode = "leads" | "testDrives" | "followUps";

function fmtDateShort(iso: string | null | undefined) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function ReportTableCard({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("border shadow-sm overflow-hidden bg-card", className)}>
      <div className="px-4 py-3 border-b bg-muted/30">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground">{title}</h2>
      </div>
      <div className="overflow-x-auto p-1 sm:p-2">{children}</div>
    </Card>
  );
}

export default function AdminDetailedReport() {
  const [data, setData] = useState<DetailedReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupMode, setPopupMode] = useState<PopupMode>("leads");
  const [popupLeads, setPopupLeads] = useState<DetailedReportLeadRow[]>([]);
  const [popupTestDrives, setPopupTestDrives] = useState<DetailedReportTestDriveRow[]>([]);
  const [popupFollowUps, setPopupFollowUps] = useState<DetailedReportFollowUpCallRow[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const report = await fetchDetailedReport();
      setData(report);
    } catch (e) {
      setData(null);
      const msg = formatApiErrors(e);
      setLoadError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground">
        <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading detailed report...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-4 py-12 text-center max-w-lg mx-auto">
        <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
        <h2 className="font-semibold text-lg">Detailed report unavailable</h2>
        <p className="text-sm text-muted-foreground">{loadError ?? "Could not load report data."}</p>
        <Button variant="outline" onClick={() => void load()}>Retry</Button>
      </div>
    );
  }

  const { summary } = data;
  const leadRows = data.leadDetailRows ?? [];
  const tdRows = data.testDriveDetailRows ?? [];
  const callRows = data.followUpCallRows ?? [];
  const periodBounds = data.periodBounds ?? {
    mtdFrom: data.period.mtdFrom,
    mtdTo: data.period.mtdTo,
    todayFrom: data.period.mtdTo,
    todayTo: data.period.mtdTo,
  };
  const todayKey = data.period.today;

  const openLeadPopup = (title: string, rows: DetailedReportLeadRow[]) => {
    setPopupTitle(title);
    setPopupMode("leads");
    setPopupLeads(rows);
    setPopupOpen(true);
  };

  const openTestDrivePopup = (title: string, rows: DetailedReportTestDriveRow[]) => {
    setPopupTitle(title);
    setPopupMode("testDrives");
    setPopupTestDrives(rows);
    setPopupOpen(true);
  };

  const openFollowUpPopup = (title: string, rows: DetailedReportFollowUpCallRow[]) => {
    setPopupTitle(title);
    setPopupMode("followUps");
    setPopupFollowUps(rows);
    setPopupOpen(true);
  };

  const mgrTotals = data.salesManagers.reduce(
    (acc, r) => ({
      leads: acc.leads + r.totalLeads,
      td: acc.td + r.totalTestDrive,
      tdMtd: acc.tdMtd + r.totalTestDriveMtd,
      teamTd: acc.teamTd + (r.teamTestDrive ?? 0),
      teamTdMtd: acc.teamTdMtd + (r.teamTestDriveMtd ?? 0),
    }),
    { leads: 0, td: 0, tdMtd: 0, teamTd: 0, teamTdMtd: 0 },
  );
  const execTotals = data.salesExecutives.reduce(
    (acc, r) => ({
      leads: acc.leads + r.totalLeads,
      td: acc.td + r.totalTestDrive,
      tdMtd: acc.tdMtd + r.totalTestDriveMtd,
    }),
    { leads: 0, td: 0, tdMtd: 0 },
  );

  return (
    <div className="space-y-6 pb-10 max-w-[1600px]">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 print:hidden">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-primary" />
            Detailed Report
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {data.period.label} · Generated {fmtTime(data.generatedAt)}
          </p>
          <p className="text-xs text-muted-foreground mt-1 max-w-3xl">
            Staff lead counts match Excel <strong className="font-medium text-foreground">SALES CONSULTANT</strong> on
            each lead (same as your per-user sheets). CRM assignee can differ — fix those under Unassigned until the
            sheet consultant is updated.{" "}
            <Link to="/admin/reports/team-assigned-leads" className="text-primary hover:underline font-medium">
              Team-wise matrix →
            </Link>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ReportExportButtons
            onExcel={() => {
              try {
                downloadDetailedReportExcel(data);
                toast.success("Excel download started");
              } catch (e) {
                toast.error(formatApiErrors(e) || "Could not export Excel");
              }
            }}
            onPdf={() => printReportAsPdf(`Detailed Report ${data.period.today}`)}
          />
          <Button variant="outline" size="sm" onClick={() => void load()} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <RefreshCw className="w-4 h-4 mr-1" />}
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-3">
        <KpiBox
          title="Total Leads"
          headerClass="bg-blue-600"
          metrics={[
            {
              label: "Total Leads (All)",
              value: summary.totalLeads.all,
              onClick: () => openLeadPopup("Total Leads (All)", filterDetailedLeadRows("totalLeads", "all", leadRows, todayKey, periodBounds)),
            },
            {
              label: "Total Leads MTD",
              value: summary.totalLeads.mtd,
              onClick: () =>
                openLeadPopup("Total Leads MTD", filterDetailedLeadRows("totalLeads", "mtd", leadRows, todayKey, periodBounds)),
            },
            {
              label: "Total Leads Today",
              value: summary.totalLeads.today,
              onClick: () =>
                openLeadPopup("Total Leads Today", filterDetailedLeadRows("totalLeads", "today", leadRows, todayKey, periodBounds)),
            },
          ]}
        />
        <KpiBox
          title="Total Walk-In"
          headerClass="bg-rose-700"
          metrics={[
            {
              label: "Walk-In (All)",
              value: summary.walkIn.all,
              onClick: () => openLeadPopup("Walk-In (All)", filterDetailedLeadRows("walkIn", "all", leadRows, todayKey, periodBounds)),
            },
            {
              label: "Walk-In MTD",
              value: summary.walkIn.mtd,
              onClick: () => openLeadPopup("Walk-In MTD", filterDetailedLeadRows("walkIn", "mtd", leadRows, todayKey, periodBounds)),
            },
            {
              label: "Walk-In Today",
              value: summary.walkIn.today,
              onClick: () => openLeadPopup("Walk-In Today", filterDetailedLeadRows("walkIn", "today", leadRows, todayKey, periodBounds)),
            },
          ]}
        />
        <KpiBox
          title="Total Digital Leads"
          headerClass="bg-teal-700"
          metrics={[
            {
              label: "Digital (All)",
              value: summary.digital.all,
              onClick: () => openLeadPopup("Digital Leads (All)", filterDetailedLeadRows("digital", "all", leadRows, todayKey, periodBounds)),
            },
            {
              label: "Digital MTD",
              value: summary.digital.mtd,
              onClick: () => openLeadPopup("Digital Leads MTD", filterDetailedLeadRows("digital", "mtd", leadRows, todayKey, periodBounds)),
            },
            {
              label: "Digital Today",
              value: summary.digital.today,
              onClick: () => openLeadPopup("Digital Leads Today", filterDetailedLeadRows("digital", "today", leadRows, todayKey, periodBounds)),
            },
          ]}
        />
        <KpiBox
          title="Test Drive"
          headerClass="bg-sky-600"
          metrics={[
            {
              label: "Test Drive Till Date",
              value: summary.testDrives.all,
              onClick: () =>
                openTestDrivePopup("Test Drive Till Date", filterDetailedTestDriveRows("all", tdRows, todayKey, periodBounds)),
            },
            {
              label: "Test Drive MTD",
              value: summary.testDrives.mtd,
              onClick: () =>
                openTestDrivePopup("Test Drive MTD", filterDetailedTestDriveRows("mtd", tdRows, todayKey, periodBounds)),
            },
            {
              label: "Test Drive Done Today",
              value: summary.testDrives.doneToday,
              onClick: () =>
                openTestDrivePopup("Test Drive Done Today", filterDetailedTestDriveRows("doneToday", tdRows, todayKey, periodBounds)),
            },
          ]}
        />
        <KpiBox
          title="Booking Count"
          headerClass="bg-violet-700"
          metrics={[
            {
              label: "Booking Count",
              value: summary.bookingCount,
              onClick: () =>
                openLeadPopup("Booking Count", filterDetailedLeadRows("booking", "all", leadRows, todayKey, periodBounds)),
            },
          ]}
        />
        <KpiBox
          title="Calls Made Today"
          headerClass="bg-indigo-800"
          metrics={[
            {
              label: "Follow-ups Today",
              value: summary.callsMadeToday,
              onClick: () => openFollowUpPopup("Follow-ups Today", filterDetailedFollowUpCalls(callRows)),
            },
          ]}
        />
      </div>

      <Dialog open={popupOpen} onOpenChange={setPopupOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>{popupTitle}</DialogTitle>
            {popupMode === "leads" && data.leadDetailRowsTruncated ? (
              <p className="text-xs text-muted-foreground">
                Showing {popupLeads.length} of {data.leadDetailRowsTotal ?? popupLeads.length} leads in scope — open Lead CRM for the full list.
              </p>
            ) : null}
          </DialogHeader>
          {popupMode === "leads" ? (
            <div className="max-h-[65vh] overflow-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border/50 text-muted-foreground">
                    <th className="text-left p-2">Customer</th>
                    <th className="text-left p-2">Model</th>
                    <th className="text-left p-2">Stage</th>
                    <th className="text-left p-2">Source</th>
                    <th className="text-left p-2">Assigned to</th>
                    <th className="text-left p-2">Enquiry</th>
                    <th className="text-left p-2">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {popupLeads.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-muted-foreground">
                        No records match this KPI
                      </td>
                    </tr>
                  ) : (
                    popupLeads.map((row) => (
                      <tr key={row.leadId} className="border-b border-border/20 hover:bg-secondary/10">
                        <td className="p-2">
                          <p className="font-medium">{row.name}</p>
                          <p className="text-muted-foreground">{row.mobile}</p>
                        </td>
                        <td className="p-2">{row.model}</td>
                        <td className="p-2">{row.status}</td>
                        <td className="p-2">{row.source}</td>
                        <td className="p-2">{row.assignedTo}</td>
                        <td className="p-2 whitespace-nowrap">{fmtDateShort(row.enquiryAt)}</td>
                        <td className="p-2 max-w-[14rem] truncate" title={row.remarks}>
                          {row.remarks}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : popupMode === "testDrives" ? (
            <div className="max-h-[65vh] overflow-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border/50 text-muted-foreground">
                    <th className="text-left p-2">Customer</th>
                    <th className="text-left p-2">Model</th>
                    <th className="text-left p-2">Slot date</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {popupTestDrives.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-muted-foreground">
                        No test drive records match this KPI
                      </td>
                    </tr>
                  ) : (
                    popupTestDrives.map((row) => (
                      <tr key={row.bookingId} className="border-b border-border/20 hover:bg-secondary/10">
                        <td className="p-2">
                          <p className="font-medium">{row.customerName}</p>
                          <p className="text-muted-foreground">{row.customerMobile}</p>
                        </td>
                        <td className="p-2">{row.model}</td>
                        <td className="p-2 whitespace-nowrap">{fmtDateShort(row.slotDate)}</td>
                        <td className="p-2">{row.bookingStatus}</td>
                        <td className="p-2">{row.source}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="max-h-[65vh] overflow-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border/50 text-muted-foreground">
                    <th className="text-left p-2">Customer</th>
                    <th className="text-left p-2">Executive</th>
                    <th className="text-left p-2">Note</th>
                    <th className="text-left p-2">Scheduled</th>
                    <th className="text-left p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {popupFollowUps.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-muted-foreground">
                        No follow-ups logged for today
                      </td>
                    </tr>
                  ) : (
                    popupFollowUps.map((row) => (
                      <tr key={row.followUpId} className="border-b border-border/20 hover:bg-secondary/10">
                        <td className="p-2">
                          <p className="font-medium">{row.customerName}</p>
                          <p className="text-muted-foreground">{row.customerMobile}</p>
                        </td>
                        <td className="p-2">{row.executive}</td>
                        <td className="p-2 max-w-[16rem]">{row.note}</td>
                        <td className="p-2 whitespace-nowrap">{fmtDateShort(row.scheduledAt || row.completedAt)}</td>
                        <td className="p-2">{row.status}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        <ReportTableCard title="Lead Source" className="xl:col-span-3">
          <table className="w-full border-collapse min-w-[260px]">
            <thead>
              <tr>
                <th className={cn(TH, "text-left")}>Lead Source</th>
                <th className={TH}>Count</th>
                <th className={TH}>Assigned</th>
              </tr>
            </thead>
            <tbody>
              {data.leadSources.map((row, i) => (
                <tr key={row.source} className={i % 2 ? STRIPE : undefined}>
                  <td className={TD_L}>{row.source}</td>
                  <td className={TD}>{fmt(row.count)}</td>
                  <td className={TD}>{fmt(row.assignedCount)}</td>
                </tr>
              ))}
              <tr className={TOTAL_ROW}>
                <td className={cn(TD_L, "font-bold")}>Total</td>
                <td className={TD}>{fmt(data.leadSourcesTotal.count)}</td>
                <td className={TD}>{fmt(data.leadSourcesTotal.assignedCount)}</td>
              </tr>
            </tbody>
          </table>
        </ReportTableCard>

        <div className="xl:col-span-6 space-y-4">
          <ReportTableCard title="Sales Manager">
            <table className="w-full border-collapse min-w-[640px]">
              <thead>
                <tr>
                  <th className={cn(TH, "text-left")}>Sales Manager</th>
                  <th className={TH}>Total Leads</th>
                  <th className={TH}>Total TD</th>
                  <th className={TH}>TD This Month</th>
                  <th className={TH}>TD By Team</th>
                  <th className={TH}>Team TD MTD</th>
                </tr>
              </thead>
              <tbody>
                {data.salesManagers.map((row, i) => (
                  <tr key={row.staffId} className={i % 2 ? STRIPE : undefined}>
                    <td className={cn(TD_L, "whitespace-nowrap")}>
                      {row.name} ({row.abbr})
                    </td>
                    <td className={TD}>{fmt(row.totalLeads)}</td>
                    <td className={TD}>{fmt(row.totalTestDrive)}</td>
                    <td className={TD}>{fmt(row.totalTestDriveMtd)}</td>
                    <td className={TD}>{fmt(row.teamTestDrive ?? 0)}</td>
                    <td className={TD}>{fmt(row.teamTestDriveMtd ?? 0)}</td>
                  </tr>
                ))}
                {data.salesManagers.length === 0 && (
                  <tr>
                    <td colSpan={6} className={cn(TD, "text-muted-foreground py-6")}>
                      No sales managers found
                    </td>
                  </tr>
                )}
                {data.unassignedSheet && data.unassignedSheet.totalLeads > 0 ? (
                  <tr className="bg-muted/50 text-muted-foreground">
                    <td className={cn(TD_L, "italic")}>Unassigned (sheet)</td>
                    <td className={TD}>{fmt(data.unassignedSheet.totalLeads)}</td>
                    <td className={TD}>{fmt(data.unassignedSheet.totalTestDrive)}</td>
                    <td className={TD}>{fmt(data.unassignedSheet.totalTestDriveMtd)}</td>
                    <td className={TD}>—</td>
                    <td className={TD}>—</td>
                  </tr>
                ) : null}
                <tr className={TOTAL_ROW}>
                  <td className={cn(TD_L, "font-bold")}>TOTAL (managers)</td>
                  <td className={TD}>{fmt(mgrTotals.leads)}</td>
                  <td className={TD}>{fmt(mgrTotals.td)}</td>
                  <td className={TD}>{fmt(mgrTotals.tdMtd)}</td>
                  <td className={TD}>{fmt(mgrTotals.teamTd)}</td>
                  <td className={TD}>{fmt(mgrTotals.teamTdMtd)}</td>
                </tr>
              </tbody>
            </table>
          </ReportTableCard>

          <ReportTableCard title="Sales Executive">
            <table className="w-full border-collapse min-w-[480px]">
              <thead>
                <tr>
                  <th className={cn(TH, "text-left")}>Sales Executive</th>
                  <th className={TH}>Total Leads</th>
                  <th className={TH}>Total TD</th>
                  <th className={TH}>TD This Month</th>
                </tr>
              </thead>
              <tbody>
                {data.salesExecutives.map((row, i) => (
                  <tr key={row.staffId} className={i % 2 ? STRIPE : undefined}>
                    <td className={cn(TD_L, "whitespace-nowrap")}>
                      {row.name} ({row.abbr})
                    </td>
                    <td className={TD}>{fmt(row.totalLeads)}</td>
                    <td className={TD}>{fmt(row.totalTestDrive)}</td>
                    <td className={TD}>{fmt(row.totalTestDriveMtd)}</td>
                  </tr>
                ))}
                {data.salesExecutives.length === 0 && (
                  <tr>
                    <td colSpan={4} className={cn(TD, "text-muted-foreground py-6")}>
                      No sales executives found
                    </td>
                  </tr>
                )}
                <tr className={TOTAL_ROW}>
                  <td className={cn(TD_L, "font-bold")}>TOTAL (executives)</td>
                  <td className={TD}>{fmt(execTotals.leads)}</td>
                  <td className={TD}>{fmt(execTotals.td)}</td>
                  <td className={TD}>{fmt(execTotals.tdMtd)}</td>
                </tr>
              </tbody>
            </table>
          </ReportTableCard>

          {data.unassignedSheet ? (
            <p className="text-xs text-muted-foreground px-1">
              Sheet attribution check: managers {fmt(mgrTotals.leads)} + executives {fmt(execTotals.leads)} + unassigned{" "}
              {fmt(data.unassignedSheet.totalLeads)} ={" "}
              <strong className="text-foreground tabular-nums">
                {fmt(mgrTotals.leads + execTotals.leads + data.unassignedSheet.totalLeads)}
              </strong>{" "}
              (all leads {fmt(summary.totalLeads.all)})
            </p>
          ) : null}

          <ReportTableCard title="Monthly Performance (Test Drives)" className="max-w-xl">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className={cn(TH, "text-left")}>Month</th>
                  <th className={TH}>Test Drives</th>
                </tr>
              </thead>
              <tbody>
                {data.monthlyTestDrives.map((row, i) => (
                  <tr key={row.monthNum} className={i % 2 ? STRIPE : undefined}>
                    <td className={TD_L}>{row.month}</td>
                    <td className={TD}>{fmt(row.count)}</td>
                  </tr>
                ))}
                <tr className={TOTAL_ROW}>
                  <td className={cn(TD_L, "font-bold")}>TOTAL</td>
                  <td className={cn(TD, "font-bold")}>{fmt(data.monthlyTestDrivesTotal)}</td>
                </tr>
              </tbody>
            </table>
          </ReportTableCard>
        </div>

        <ReportTableCard title="Lead Type" className="xl:col-span-3">
          <table className="w-full border-collapse min-w-[220px]">
            <thead>
              <tr>
                <th className={cn(TH, "text-left")}>Lead Type</th>
                <th className={TH}>Count</th>
              </tr>
            </thead>
            <tbody>
              {data.leadTypes.map((row, i) => (
                <tr key={row.leadType} className={i % 2 ? STRIPE : undefined}>
                  <td className={TD_L}>{row.leadType}</td>
                  <td className={TD}>{fmt(row.count)}</td>
                </tr>
              ))}
              {data.leadTypes.length === 0 && (
                <tr>
                  <td colSpan={2} className={cn(TD, "text-muted-foreground py-6")}>
                    No lead types recorded
                  </td>
                </tr>
              )}
              <tr className={TOTAL_ROW}>
                <td className={cn(TD_L, "font-bold")}>Total</td>
                <td className={TD}>{fmt(data.leadTypesTotal)}</td>
              </tr>
            </tbody>
          </table>
        </ReportTableCard>
      </div>
    </div>
  );
}
