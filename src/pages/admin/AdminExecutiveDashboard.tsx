import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart3, RefreshCw, Loader2, Users, Target, CalendarCheck,
  TrendingUp, TrendingDown, Minus, Star, MessageSquare, ArrowRight,
  UserCheck, Pencil, Activity, MapPin, UserPlus,
} from "lucide-react";
import { toast } from "sonner";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatApiErrors } from "@/lib/api";
import { getAdminUser, isCreUser } from "@/lib/adminAuth";
import {
  fetchExecutiveDashboard,
  isCreDashboardReport,
  type CreDashboardReport,
  type ExecutiveDashboard,
} from "@/lib/executiveDashboardApi";
import { STAGE_COLORS, normalizeCrmStage } from "@/lib/leadStages";
import { cn } from "@/lib/utils";

const CHART_COLORS = ["#00d4ff", "#7c3aed", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];
const YEAR_OPTIONS = [2024, 2025, 2026, 2027];

function fmtDate(iso?: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function fmtDateTime(iso?: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
}

const ACTIVITY_META: Record<string, { label: string; icon: React.ElementType; badge: string }> = {
  stage_change: { label: "Stage change", icon: ArrowRight, badge: "bg-blue-500/10 text-blue-500 border-blue-500/25" },
  assignment: { label: "Assignment", icon: UserCheck, badge: "bg-violet-500/10 text-violet-500 border-violet-500/25" },
  follow_up: { label: "Follow-up", icon: MessageSquare, badge: "bg-amber-500/10 text-amber-600 border-amber-500/25" },
  feedback: { label: "Feedback", icon: Star, badge: "bg-emerald-500/10 text-emerald-600 border-emerald-500/25" },
  edit: { label: "Details edited", icon: Pencil, badge: "bg-cyan-500/10 text-cyan-600 border-cyan-500/25" },
};

function CompareStat({
  label,
  current,
  previous,
  suffix = "",
  icon: Icon,
}: {
  label: string;
  current: number;
  previous: number;
  suffix?: string;
  icon: React.ElementType;
}) {
  const delta = current - previous;
  const TrendIcon = delta > 0 ? TrendingUp : delta < 0 ? TrendingDown : Minus;
  const trendColor = delta > 0 ? "text-green-500" : delta < 0 ? "text-red-400" : "text-muted-foreground";

  return (
    <Card className="bg-card border-border/50 p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold mt-1 text-foreground">
            {current}{suffix}
          </p>
          <div className={cn("flex items-center gap-1 mt-1 text-xs", trendColor)}>
            <TrendIcon className="w-3.5 h-3.5 shrink-0" />
            <span>{delta >= 0 ? "+" : ""}{delta}{suffix} vs last year</span>
          </div>
        </div>
        <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </Card>
  );
}

function bookingStatusBadge(status: string) {
  const map: Record<string, string> = {
    COMPLETED: "bg-green-500/15 text-green-600",
    IN_PROGRESS: "bg-blue-500/15 text-blue-600",
    CONFIRMED: "bg-primary/15 text-primary",
    PENDING: "bg-amber-500/15 text-amber-600",
    CANCELLED: "bg-red-500/15 text-red-500",
    MISSED: "bg-muted text-muted-foreground",
  };
  return map[status] ?? "bg-muted text-muted-foreground";
}

function CreDashboardView({
  data,
  year,
  setYear,
  loading,
  onReload,
}: {
  data: CreDashboardReport;
  year: number;
  setYear: (y: number) => void;
  loading: boolean;
  onReload: () => void;
}) {
  const typeData = useMemo(
    () => Object.entries(data.byLeadType).map(([name, value]) => ({ name, value })),
    [data.byLeadType],
  );
  const areaData = useMemo(
    () => Object.entries(data.byArea).slice(0, 12).map(([name, value]) => ({ name, value })),
    [data.byArea],
  );
  const pipelineData = useMemo(
    () => Object.entries(data.pipeline).filter(([, v]) => v > 0).map(([name, value]) => ({ name, value })),
    [data.pipeline],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-primary" />
            CRE Report — {data.cre.name}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Leads you added &amp; assigned to executives by area and lead type
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={String(year)} onValueChange={(v) => setYear(Number(v))}>
            <SelectTrigger className="w-[120px] bg-background"><SelectValue /></SelectTrigger>
            <SelectContent>
              {YEAR_OPTIONS.map((y) => (
                <SelectItem key={y} value={String(y)}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={onReload} disabled={loading}>
            <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
          </Button>
          <Button asChild size="sm" className="bg-primary text-primary-foreground">
            <Link to="/admin/crm/leads"><UserPlus className="w-4 h-4 mr-1.5" /> Lead CRM</Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className="text-xs">
          {data.year}: {fmtDate(data.period.from)} – {fmtDate(data.period.to)}
        </Badge>
        <Badge variant="secondary" className="text-xs">
          All-time created: {data.overview.totalCreatedAllTime}
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <CompareStat
          label={`Leads created (${data.year})`}
          current={data.overview.totalCreated}
          previous={data.overview.totalCreatedPrev}
          icon={Users}
        />
        <CompareStat
          label="Assigned to executives"
          current={data.overview.assigned}
          previous={0}
          icon={UserCheck}
        />
        <CompareStat
          label="Still unassigned"
          current={data.overview.unassigned}
          previous={0}
          icon={Target}
        />
        <CompareStat
          label="Assignment rate"
          current={data.overview.assignmentRate}
          previous={0}
          suffix="%"
          icon={MapPin}
        />
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="bg-secondary/40">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="executives">By executive</TabsTrigger>
          <TabsTrigger value="leads">Recent leads</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid lg:grid-cols-2 gap-4">
            <Card className="p-4 border-border/50">
              <h3 className="font-semibold text-sm mb-3">By lead type</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={typeData} dataKey="value" nameKey="name" outerRadius={90} label>
                      {typeData.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip /><Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
            <Card className="p-4 border-border/50">
              <h3 className="font-semibold text-sm mb-3">By area / city</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={areaData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-25} textAnchor="end" height={60} />
                    <YAxis allowDecimals={false} /><Tooltip />
                    <Bar dataKey="value" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
            <Card className="p-4 border-border/50 lg:col-span-2">
              <h3 className="font-semibold text-sm mb-3">Monthly created vs assigned</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.monthly}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="label" /><YAxis allowDecimals={false} /><Tooltip /><Legend />
                    <Line type="monotone" dataKey="created" stroke="#00d4ff" strokeWidth={2} />
                    <Line type="monotone" dataKey="assigned" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
            {pipelineData.length > 0 ? (
              <Card className="p-4 border-border/50 lg:col-span-2">
                <h3 className="font-semibold text-sm mb-3">CRM pipeline (leads you created)</h3>
                <div className="flex flex-wrap gap-2">
                  {pipelineData.map((row) => (
                    <Badge key={row.name} variant="outline" className={cn("text-xs", STAGE_COLORS[normalizeCrmStage(row.name)])}>
                      {row.name}: {row.value}
                    </Badge>
                  ))}
                </div>
              </Card>
            ) : null}
          </div>
        </TabsContent>

        <TabsContent value="executives" className="mt-4">
          <Card className="border-border/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-left">
                  <tr>
                    <th className="p-3">Executive</th>
                    <th className="p-3">Assigned</th>
                    <th className="p-3">Lead types</th>
                    <th className="p-3">Areas</th>
                  </tr>
                </thead>
                <tbody>
                  {data.byExecutive.length === 0 ? (
                    <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">No assignments yet this year.</td></tr>
                  ) : data.byExecutive.map((row) => (
                    <tr key={row.executiveId} className="border-t border-border/50">
                      <td className="p-3">
                        <p className="font-medium">{row.name}</p>
                        <p className="text-xs text-muted-foreground">{row.email}</p>
                      </td>
                      <td className="p-3 font-semibold">{row.assignedCount}</td>
                      <td className="p-3 text-xs">
                        {Object.entries(row.byLeadType).map(([k, v]) => `${k}: ${v}`).join(" · ") || "—"}
                      </td>
                      <td className="p-3 text-xs">
                        {Object.entries(row.byArea).slice(0, 4).map(([k, v]) => `${k}: ${v}`).join(" · ") || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="leads" className="mt-4">
          <Card className="border-border/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-left">
                  <tr>
                    <th className="p-3">Lead</th>
                    <th className="p-3">Area</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Stage</th>
                    <th className="p-3">Assigned to</th>
                    <th className="p-3">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentLeads.map((lead) => (
                    <tr key={lead._id} className="border-t border-border/50">
                      <td className="p-3">
                        <p className="font-medium">{lead.name}</p>
                        <p className="text-xs text-muted-foreground font-mono">{lead.mobile}</p>
                      </td>
                      <td className="p-3 text-xs">{lead.area || lead.city || "—"}</td>
                      <td className="p-3 text-xs">{lead.leadType || "—"}</td>
                      <td className="p-3"><Badge variant="outline" className="text-[10px]">{lead.status}</Badge></td>
                      <td className="p-3 text-xs">{lead.assignedTo?.name || <span className="text-amber-600">Unassigned</span>}</td>
                      <td className="p-3 text-xs text-muted-foreground">{fmtDateTime(lead.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function AdminExecutiveDashboard() {
  const adminUser = getAdminUser();
  const creUser = isCreUser(adminUser);
  const [year, setYear] = useState(new Date().getFullYear());
  const [data, setData] = useState<ExecutiveDashboard | CreDashboardReport | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const report = await fetchExecutiveDashboard(year);
      setData(report);
    } catch (e) {
      setData(null);
      toast.error(formatApiErrors(e));
    } finally {
      setLoading(false);
    }
  }, [year]);

  useEffect(() => { void load(); }, [load]);

  const pipelineData = useMemo(() => {
    if (!data || isCreDashboardReport(data)) return [];
    return Object.entries(data.leads.pipeline).filter(([, v]) => v > 0).map(([name, value]) => ({ name, value }));
  }, [data]);

  const sourceData = useMemo(() => {
    if (!data || isCreDashboardReport(data)) return [];
    return Object.entries(data.leads.bySource).map(([name, value]) => ({ name, value }));
  }, [data]);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground">
        <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading your dashboard...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-24 text-muted-foreground">
        <p>Could not load dashboard.</p>
        <Button variant="outline" className="mt-4" onClick={() => void load()}>Retry</Button>
      </div>
    );
  }

  if (isCreDashboardReport(data) || creUser) {
    if (!isCreDashboardReport(data)) {
      return (
        <div className="text-center py-24 text-muted-foreground">
          <p>CRE report unavailable.</p>
          <Button variant="outline" className="mt-4" onClick={() => void load()}>Retry</Button>
        </div>
      );
    }
    return (
      <CreDashboardView
        data={data}
        year={year}
        setYear={setYear}
        loading={loading}
        onReload={() => void load()}
      />
    );
  }

  const { leads, leadsCompare, testDrives, testDrivesCompare } = data;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-primary" />
            My Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {adminUser?.name ?? "Executive"} · Leads &amp; test drives assigned to you
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={String(year)} onValueChange={(v) => setYear(Number(v))}>
            <SelectTrigger className="w-[120px] bg-background"><SelectValue /></SelectTrigger>
            <SelectContent>
              {YEAR_OPTIONS.map((y) => (
                <SelectItem key={y} value={String(y)}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={() => void load()} disabled={loading}>
            <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className="text-xs">
          {data.year}: {fmtDate(data.period.from)} – {fmtDate(data.period.to)}
        </Badge>
        <Badge variant="secondary" className="text-xs">
          All-time: {data.allTime.totalLeads} leads · {data.allTime.totalTestDrives} test drives
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <CompareStat label={`Leads (${data.year})`} current={leads.overview.totalLeads} previous={leadsCompare.overview.totalLeads} icon={Users} />
        <CompareStat label={`Test drives (${data.year})`} current={testDrives.totalBookings} previous={testDrivesCompare.totalBookings} icon={CalendarCheck} />
        <CompareStat label="TD completed" current={testDrives.completed} previous={testDrivesCompare.completed} icon={Target} />
        <CompareStat label="Open follow-ups" current={leads.followUpSummary?.pending ?? 0} previous={0} icon={Activity} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-4 border-border/50">
          <h3 className="font-semibold text-sm mb-3">Pipeline</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipelineData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis allowDecimals={false} /><Tooltip />
                <Bar dataKey="value" fill="#00d4ff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-4 border-border/50">
          <h3 className="font-semibold text-sm mb-3">By source</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={sourceData} dataKey="value" nameKey="name" outerRadius={90}>
                  {sourceData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip /><Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="border-border/50 overflow-hidden">
        <div className="p-4 border-b border-border/50 flex items-center justify-between">
          <h3 className="font-semibold text-sm">Recent bookings</h3>
          <Button asChild variant="outline" size="sm"><Link to="/admin/td/my-bookings">Open My Test Drives</Link></Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left">
              <tr>
                <th className="p-3">Customer</th>
                <th className="p-3">Model</th>
                <th className="p-3">Slot</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.recentBookings.length === 0 ? (
                <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">No recent bookings.</td></tr>
              ) : data.recentBookings.map((b) => (
                <tr key={b.bookingId} className="border-t border-border/50">
                  <td className="p-3">
                    <p className="font-medium">{b.customerName}</p>
                    <p className="text-xs text-muted-foreground font-mono">{b.mobile}</p>
                  </td>
                  <td className="p-3">{b.model}</td>
                  <td className="p-3 text-xs">{fmtDate(b.slotDate)} {b.slotTime || ""}</td>
                  <td className="p-3"><Badge className={cn("text-[10px]", bookingStatusBadge(b.status))}>{b.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {leads.activityLog?.length ? (
        <Card className="p-4 border-border/50">
          <h3 className="font-semibold text-sm mb-3">Recent activity</h3>
          <ul className="space-y-2">
            {leads.activityLog.slice(0, 12).map((row, idx) => {
              const meta = ACTIVITY_META[row.type] || ACTIVITY_META.edit;
              const Icon = meta.icon;
              return (
                <li key={`${row.type}-${idx}`} className="flex items-start gap-2 text-sm">
                  <span className={cn("mt-0.5 rounded border px-1.5 py-0.5 text-[10px]", meta.badge)}>
                    <Icon className="w-3 h-3 inline mr-1" />{meta.label}
                  </span>
                  <span className="text-muted-foreground flex-1">{row.summary || row.reason || "—"}</span>
                  <span className="text-[11px] text-muted-foreground">{fmtDateTime(row.createdAt)}</span>
                </li>
              );
            })}
          </ul>
        </Card>
      ) : null}
    </div>
  );
}
