import { useCallback, useEffect, useState } from "react";
import {
  CalendarCheck, RefreshCw, Loader2, Users, Car, AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ReportPeriodPresets, { type ReportPeriod } from "@/components/admin/ReportPeriodPresets";
import ReportStageSourceFilters from "@/components/admin/ReportStageSourceFilters";
import { resolvePeriodRange } from "@/lib/reportPeriod";
import { formatApiErrors } from "@/lib/api";
import { fetchBookingReport } from "@/lib/bookingReportApi";
import { ReportExportButtons } from "@/components/admin/ReportExportButtons";
import { downloadBookingReportExcel } from "@/lib/exports/bookingReportExport";
import { printReportAsPdf } from "@/lib/reportPdfExport";

function fmtDate(iso?: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function AdminBookingReports() {
  const initial = resolvePeriodRange({ period: "monthly" });
  const [period, setPeriod] = useState<ReportPeriod>(initial.period);
  const [from, setFrom] = useState(initial.from);
  const [to, setTo] = useState(initial.to);
  const [source, setSource] = useState("all");
  const [data, setData] = useState<BookingReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const report = await fetchBookingReport({
        period,
        from: from || undefined,
        to: to || undefined,
        source: source !== "all" ? source : undefined,
      });
      setData(report);
    } catch (e) {
      setData(null);
      const msg = formatApiErrors(e);
      setLoadError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [period, from, to, source]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground">
        <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading booking reports...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-4 py-12 text-center max-w-lg mx-auto">
        <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
        <h2 className="font-semibold text-lg">Booking reports unavailable</h2>
        <p className="text-sm text-muted-foreground">{loadError ?? "Could not load report data."}</p>
        <Button variant="outline" onClick={() => void load()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <CalendarCheck className="w-7 h-7 text-primary" />
            Booking Report
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Customer-wise bookings with car model, variant and colour
          </p>
        </div>
        <div className="flex flex-wrap gap-2 print:hidden">
          <ReportExportButtons
            onExcel={() => {
              try {
                downloadBookingReportExcel(data);
                toast.success("Excel download started");
              } catch (e) {
                toast.error(formatApiErrors(e) || "Could not export Excel");
              }
            }}
            onPdf={() => printReportAsPdf(`Booking Report ${data.from} – ${data.to}`)}
          />
          <Button variant="outline" size="sm" onClick={() => void load()} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-1 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
        </div>
      </div>

      <div className="print:hidden space-y-4">
        <ReportPeriodPresets
          value={period}
          from={from}
          to={to}
          onChange={(p) => {
            const range = resolvePeriodRange({ period: p });
            setPeriod(p);
            setFrom(range.from);
            setTo(range.to);
          }}
          onRangeChange={(range) => {
            setFrom(range.from);
            setTo(range.to);
          }}
        />
        <ReportStageSourceFilters
          status="all"
          source={source}
          onStatusChange={() => undefined}
          onSourceChange={setSource}
          showStage={false}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-card border-border/50 p-4">
          <p className="text-xs text-muted-foreground">Total bookings</p>
          <p className="text-2xl font-bold mt-1 tabular-nums">{data.totalBookings}</p>
        </Card>
        <Card className="bg-card border-border/50 p-4">
          <p className="text-xs text-muted-foreground">Executives with bookings</p>
          <p className="text-2xl font-bold mt-1 tabular-nums">{data.byExecutive.length}</p>
        </Card>
        <Card className="bg-card border-border/50 p-4">
          <p className="text-xs text-muted-foreground">Models booked</p>
          <p className="text-2xl font-bold mt-1 tabular-nums">{data.byModel.length}</p>
        </Card>
      </div>

      {data.byPeriod.length > 0 ? (
        <Card className="bg-card border-border/50 p-4">
          <h2 className="font-semibold text-sm mb-3">Bookings by period ({data.bucketUnit})</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data.byPeriod}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="bucket" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" name="Bookings" fill="#00d4ff" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      ) : null}

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="bg-card border-border/50 p-4">
          <h2 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" /> By executive
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted-foreground border-b border-border/50">
                  <th className="py-2 pr-2">Executive</th>
                  <th className="py-2 text-right">Bookings</th>
                </tr>
              </thead>
              <tbody>
                {data.byExecutive.map((row) => (
                  <tr key={row.executiveId || row.name} className="border-b border-border/30">
                    <td className="py-2 pr-2">{row.name}</td>
                    <td className="py-2 text-right tabular-nums">{row.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <Card className="bg-card border-border/50 p-4">
          <h2 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <Car className="w-4 h-4 text-primary" /> By model
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted-foreground border-b border-border/50">
                  <th className="py-2 pr-2">Model</th>
                  <th className="py-2 text-right">Bookings</th>
                </tr>
              </thead>
              <tbody>
                {data.byModel.map((row) => (
                  <tr key={row.model} className="border-b border-border/30">
                    <td className="py-2 pr-2">{row.model}</td>
                    <td className="py-2 text-right tabular-nums">{row.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <Card className="bg-card border-border/50 p-4 overflow-x-auto">
        <h2 className="font-semibold text-sm mb-3">Customer-wise bookings</h2>
        <table className="w-full text-sm min-w-[720px]">
          <thead>
            <tr className="text-left text-xs text-muted-foreground border-b border-border/50">
              <th className="p-3">Customer Name</th>
              <th className="p-3">Car Model</th>
              <th className="p-3">Variant</th>
              <th className="p-3">Colour</th>
              <th className="p-3">Mobile</th>
              <th className="p-3">Executive</th>
              <th className="p-3">Booking Date</th>
            </tr>
          </thead>
          <tbody>
            {data.rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-muted-foreground">
                  No bookings in this period
                </td>
              </tr>
            ) : (
              data.rows.map((row) => (
                <tr key={row._id} className="border-b border-border/30">
                  <td className="p-3 font-medium">{row.customerName || row.name}</td>
                  <td className="p-3">{row.carModel || "—"}</td>
                  <td className="p-3">{row.carVariant || "—"}</td>
                  <td className="p-3">{row.colour || "—"}</td>
                  <td className="p-3 font-mono text-xs">{row.mobile || "—"}</td>
                  <td className="p-3">{row.executiveName}</td>
                  <td className="p-3 whitespace-nowrap">{fmtDate(row.bookingDate)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
