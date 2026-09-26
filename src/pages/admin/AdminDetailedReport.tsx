import { useCallback, useEffect, useState, type ReactNode } from "react";
import { BarChart3, RefreshCw, Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatApiErrors } from "@/lib/api";
import {
  fetchDetailedReport,
  type DetailedReport,
  type DetailedReportSummaryBlock,
} from "@/lib/detailedReportApi";
import { cn } from "@/lib/utils";

/** Dense MIS table styling — fits dashboard on one screen at xl+. */
const TH =
  "bg-slate-800 text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-wide px-1 py-0.5 border border-slate-700 text-center leading-tight";
const TD =
  "px-1 py-0 border border-slate-200 text-center text-[10px] sm:text-[11px] tabular-nums leading-tight";
const TD_L = "px-1 py-0 border border-slate-200 text-[10px] sm:text-[11px] leading-tight";
const TOTAL_ROW = "bg-amber-100 font-semibold";
const STRIPE = "bg-slate-50/80";

function fmt(n: number) {
  return n.toLocaleString("en-IN");
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-[10px] sm:text-xs font-semibold mb-0.5 uppercase tracking-wide text-muted-foreground shrink-0">
      {children}
    </h2>
  );
}

function CompactKpiCard({
  title,
  headerClass,
  items,
}: {
  title: string;
  headerClass: string;
  items: { label: string; value: number }[];
}) {
  return (
    <div className="rounded-md border bg-card overflow-hidden shadow-sm min-w-0">
      <div className={cn("px-1.5 py-0.5 text-white text-[10px] sm:text-xs font-bold text-center truncate", headerClass)}>
        {title}
      </div>
      <div className="divide-y divide-border">
        {items.map((m) => (
          <div key={m.label} className="flex items-center justify-between gap-1 px-1.5 py-0.5 text-[10px] sm:text-[11px]">
            <span className="text-muted-foreground truncate" title={m.label}>
              {m.label}
            </span>
            <span className="font-bold tabular-nums shrink-0">{fmt(m.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function tripletMetrics(prefix: string, block: DetailedReportSummaryBlock) {
  return [
    { label: `${prefix} All`, value: block.all },
    { label: `${prefix} MTD`, value: block.mtd },
    { label: `${prefix} Today`, value: block.today },
  ];
}

export default function AdminDetailedReport() {
  const [data, setData] = useState<DetailedReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

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

  /** On desktop, keep the MIS dashboard in one viewport (scroll inside panels if needed). */
  useEffect(() => {
    const main = document.querySelector("main");
    if (!main) return undefined;
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => {
      if (mq.matches) main.classList.add("lg:!overflow-y-hidden");
      else main.classList.remove("lg:!overflow-y-hidden");
    };
    sync();
    mq.addEventListener("change", sync);
    return () => {
      mq.removeEventListener("change", sync);
      main.classList.remove("lg:!overflow-y-hidden");
    };
  }, []);

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
    <div
      className={cn(
        "detailed-report-dashboard flex flex-col gap-2",
        "max-lg:pb-8",
        "lg:h-[calc(100dvh-5.25rem)] lg:max-h-[calc(100dvh-5.25rem)] lg:overflow-hidden",
        "xl:h-[calc(100dvh-4.75rem)] xl:max-h-[calc(100dvh-4.75rem)]",
        "2xl:h-[calc(100dvh-4.5rem)] 2xl:max-h-[calc(100dvh-4.5rem)]",
      )}
    >
      <div className="flex shrink-0 items-center justify-between gap-2">
        <div className="min-w-0">
          <h1 className="font-display text-lg sm:text-xl font-bold text-foreground flex items-center gap-2 truncate">
            <BarChart3 className="w-5 h-5 shrink-0 text-primary" />
            Detailed Report
          </h1>
          <p className="text-[10px] sm:text-xs text-muted-foreground truncate" title={data.period.label}>
            {data.period.label} · {fmtTime(data.generatedAt)}
          </p>
        </div>
        <Button variant="outline" size="sm" className="h-8 shrink-0" onClick={() => void load()} disabled={loading}>
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
          <span className="ml-1 hidden sm:inline">Refresh</span>
        </Button>
      </div>

      <div className="grid shrink-0 grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-1.5">
        <CompactKpiCard title="Total Leads" headerClass="bg-blue-600" items={tripletMetrics("Leads", summary.totalLeads)} />
        <CompactKpiCard title="Walk-In" headerClass="bg-rose-700" items={tripletMetrics("Walk-In", summary.walkIn)} />
        <CompactKpiCard title="Digital" headerClass="bg-teal-700" items={tripletMetrics("Digital", summary.digital)} />
        <CompactKpiCard
          title="Test Drive"
          headerClass="bg-sky-600"
          items={[
            { label: "TD Till Date", value: summary.testDrives.all },
            { label: "TD MTD", value: summary.testDrives.mtd },
            { label: "TD Today", value: summary.testDrives.doneToday },
          ]}
        />
        <CompactKpiCard
          title="Booking Count"
          headerClass="bg-violet-700"
          items={[{ label: "Booking Count", value: summary.bookingCount }]}
        />
        <CompactKpiCard
          title="Calls Made Today"
          headerClass="bg-indigo-800"
          items={[{ label: "Follow-ups Today", value: summary.callsMadeToday }]}
        />
      </div>

      <div
        className={cn(
          "grid flex-1 min-h-0 gap-2",
          "grid-cols-1",
          "lg:grid-cols-12 lg:overflow-hidden",
          "max-lg:overflow-visible",
        )}
      >
        <div className="lg:col-span-2 flex flex-col min-h-0 min-w-0">
          <SectionTitle>Lead Source</SectionTitle>
          <div className="min-h-0 flex-1 overflow-x-auto lg:overflow-y-auto">
            <table className="w-full border-collapse">
              <thead className="sticky top-0 z-[1]">
                <tr>
                  <th className={cn(TH, "text-left")}>Source</th>
                  <th className={TH}>Cnt</th>
                  <th className={TH}>Asgn</th>
                </tr>
              </thead>
              <tbody>
                {data.leadSources.map((row, i) => (
                  <tr key={row.source} className={i % 2 ? STRIPE : undefined}>
                    <td className={cn(TD_L, "max-w-[5rem] truncate")} title={row.source}>
                      {row.source}
                    </td>
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
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col min-h-0 min-w-0">
          <SectionTitle>Sales Manager</SectionTitle>
          <div className="min-h-0 flex-1 overflow-x-auto lg:overflow-y-auto">
            <table className="w-full border-collapse min-w-[520px]">
              <thead className="sticky top-0 z-[1]">
                <tr>
                  <th className={cn(TH, "text-left")}>Manager</th>
                  <th className={TH}>Leads</th>
                  <th className={TH}>TD</th>
                  <th className={TH}>TD Mo</th>
                  <th className={TH}>Team TD</th>
                  <th className={TH}>T.MTD</th>
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
                    <td colSpan={6} className={cn(TD, "text-muted-foreground")}>
                      No sales managers
                    </td>
                  </tr>
                )}
                <tr className={TOTAL_ROW}>
                  <td className={cn(TD_L, "font-bold")}>TOTAL</td>
                  <td className={TD}>{fmt(mgrTotals.leads)}</td>
                  <td className={TD}>{fmt(mgrTotals.td)}</td>
                  <td className={TD}>{fmt(mgrTotals.tdMtd)}</td>
                  <td className={TD}>{fmt(mgrTotals.teamTd)}</td>
                  <td className={TD}>{fmt(mgrTotals.teamTdMtd)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col gap-2 min-h-0 min-w-0">
          <div className="flex flex-col min-h-0 flex-[2]">
            <SectionTitle>Sales Executive</SectionTitle>
            <div className="overflow-x-auto min-h-0">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className={cn(TH, "text-left")}>Executive</th>
                    <th className={TH}>Lds</th>
                    <th className={TH}>TD</th>
                    <th className={TH}>Mo</th>
                  </tr>
                </thead>
                <tbody>
                  {data.salesExecutives.map((row, i) => (
                    <tr key={row.staffId} className={i % 2 ? STRIPE : undefined}>
                      <td className={cn(TD_L, "truncate max-w-[6rem]")} title={row.name}>
                        {row.name}
                      </td>
                      <td className={TD}>{fmt(row.totalLeads)}</td>
                      <td className={TD}>{fmt(row.totalTestDrive)}</td>
                      <td className={TD}>{fmt(row.totalTestDriveMtd)}</td>
                    </tr>
                  ))}
                  {data.salesExecutives.length === 0 && (
                    <tr>
                      <td colSpan={4} className={cn(TD, "text-muted-foreground")}>
                        None
                      </td>
                    </tr>
                  )}
                  <tr className={TOTAL_ROW}>
                    <td className={cn(TD_L, "font-bold")}>TOTAL</td>
                    <td className={TD}>{fmt(execTotals.leads)}</td>
                    <td className={TD}>{fmt(execTotals.td)}</td>
                    <td className={TD}>{fmt(execTotals.tdMtd)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-col min-h-0 flex-1">
            <SectionTitle>Lead Type</SectionTitle>
            <div className="overflow-x-auto min-h-0 lg:overflow-y-auto flex-1">
              <table className="w-full border-collapse">
                <thead className="sticky top-0 z-[1]">
                  <tr>
                    <th className={cn(TH, "text-left")}>Type</th>
                    <th className={TH}>Cnt</th>
                  </tr>
                </thead>
                <tbody>
                  {data.leadTypes.map((row, i) => (
                    <tr key={row.leadType} className={i % 2 ? STRIPE : undefined}>
                      <td className={cn(TD_L, "truncate")} title={row.leadType}>
                        {row.leadType}
                      </td>
                      <td className={TD}>{fmt(row.count)}</td>
                    </tr>
                  ))}
                  {data.leadTypes.length === 0 && (
                    <tr>
                      <td colSpan={2} className={cn(TD, "text-muted-foreground")}>
                        —
                      </td>
                    </tr>
                  )}
                  <tr className={TOTAL_ROW}>
                    <td className={cn(TD_L, "font-bold")}>Total</td>
                    <td className={TD}>{fmt(data.leadTypesTotal)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 flex flex-col min-h-0 min-w-0">
          <SectionTitle>Monthly TD</SectionTitle>
          <div className="min-h-0 flex-1 overflow-x-auto">
            <div className="grid grid-cols-2 gap-x-2 gap-y-0">
              {data.monthlyTestDrives.map((row, i) => (
                <div
                  key={row.monthNum}
                  className={cn(
                    "flex items-center justify-between border border-slate-200 px-1 py-0 text-[10px] sm:text-[11px]",
                    i % 2 ? STRIPE : "bg-background",
                  )}
                >
                  <span className="text-muted-foreground">{row.month}</span>
                  <span className="font-semibold tabular-nums">{fmt(row.count)}</span>
                </div>
              ))}
            </div>
            <div
              className={cn(
                "mt-0.5 flex items-center justify-between border border-amber-200 bg-amber-100 px-1 py-0.5 text-[10px] sm:text-[11px] font-bold",
              )}
            >
              <span>TOTAL</span>
              <span className="tabular-nums">{fmt(data.monthlyTestDrivesTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
