import { useCallback, useEffect, useState } from "react";
import { adminGet, formatApiErrors } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3, RefreshCw, Loader2, TrendingUp, Users, Car,
  CalendarCheck, Star, CheckCircle2, XCircle, AlertTriangle, Clock
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { toast } from "sonner";

type AdminReport = {
  overview: {
    totalBookings: number; completed: number; pending: number;
    cancelled: number; missed: number; inProgress: number;
    totalCustomers: number; conversionRate: number;
  };
  vehicleFleet: Record<string, number>;
  feedback: { avgOverall: number; count: number };
  charts: {
    bookingsByStatus: Record<string, number>;
    bookingsByModel: Record<string, number>;
    bookingTrend: { _id: string; count: number }[];
  };
  executivePerformance: { _id: string; name: string; total: number; completed: number }[];
  topFeedback: { overallRating: number; remarks: string; customerId: { name: string } | null }[];
};

const CHART_COLORS = ["#00d4ff", "#7c3aed", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

const StatCard = ({ label, value, icon: Icon, color = "text-primary", sub }: { label: string; value: string | number; icon: React.ElementType; color?: string; sub?: string }) => (
  <Card className="bg-card border-border/50 p-4">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
      <div className={`p-2 rounded-lg bg-primary/10 ${color}`}><Icon className="w-5 h-5" /></div>
    </div>
  </Card>
);

export default function AdminTDReports() {
  const [data, setData] = useState<AdminReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const fetchReport = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (from) params.set("from", from);
      if (to) params.set("to", to);
      const res = await adminGet<AdminReport>(`/admin/td/reports/admin?${params}`);
      setData(res.data);
    } catch (e) {
      toast.error(formatApiErrors(e));
    } finally {
      setLoading(false);
    }
  }, [from, to]);

  useEffect(() => { void fetchReport(); }, [fetchReport]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground">
        <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading reports...
      </div>
    );
  }

  if (!data) return null;
  const { overview, vehicleFleet, feedback, charts, executivePerformance, topFeedback } = data;

  const bookingStatusData = Object.entries(charts.bookingsByStatus).map(([name, value]) => ({ name, value }));
  const modelData = Object.entries(charts.bookingsByModel).map(([name, value]) => ({ name: name || "Unknown", value }));
  const fleetData = Object.entries(vehicleFleet).map(([name, value]) => ({ name: name.replace("_", " "), value }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-primary" /> TD Reports & Analytics
          </h1>
          <p className="text-muted-foreground text-sm">Complete Test Drive Management Overview</p>
        </div>
        <Button onClick={() => void fetchReport()} variant="outline" size="sm"><RefreshCw className="w-4 h-4 mr-2" /> Refresh</Button>
      </div>

      {/* Date Filter */}
      <Card className="bg-card border-border/50 p-4">
        <div className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="space-y-1.5 flex-1"><Label className="text-xs">From Date</Label><Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="bg-secondary/50" /></div>
          <div className="space-y-1.5 flex-1"><Label className="text-xs">To Date</Label><Input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="bg-secondary/50" /></div>
          <Button onClick={() => void fetchReport()} className="bg-primary text-primary-foreground shrink-0">Apply Filter</Button>
          <Button onClick={() => { setFrom(""); setTo(""); }} variant="outline" className="shrink-0">Clear</Button>
        </div>
      </Card>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Total Bookings" value={overview.totalBookings} icon={CalendarCheck} />
        <StatCard label="Completed" value={overview.completed} icon={CheckCircle2} color="text-green-400" sub={`${overview.conversionRate}% conversion`} />
        <StatCard label="Pending / Confirmed" value={overview.pending} icon={Clock} color="text-yellow-400" />
        <StatCard label="Total Customers" value={overview.totalCustomers} icon={Users} />
        <StatCard label="In Progress" value={overview.inProgress} icon={TrendingUp} color="text-purple-400" />
        <StatCard label="Cancelled" value={overview.cancelled} icon={XCircle} color="text-red-400" />
        <StatCard label="Missed" value={overview.missed} icon={AlertTriangle} color="text-orange-400" />
        <StatCard label="Avg Feedback" value={feedback.count > 0 ? `${feedback.avgOverall?.toFixed(1)} ⭐` : "N/A"} icon={Star} color="text-yellow-400" sub={`${feedback.count} responses`} />
      </div>

      <Tabs defaultValue="charts">
        <TabsList className="bg-secondary/50">
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="fleet">Fleet Status</TabsTrigger>
          <TabsTrigger value="executives">Executive Performance</TabsTrigger>
          <TabsTrigger value="feedback">Top Feedback</TabsTrigger>
        </TabsList>

        {/* Charts Tab */}
        <TabsContent value="charts" className="space-y-6 mt-4">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Booking Trend */}
            <Card className="bg-card border-border/50 p-4">
              <h3 className="font-semibold text-sm mb-4">Booking Trend (Last 30 Days)</h3>
              {charts.bookingTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={charts.bookingTrend}>
                    <XAxis dataKey="_id" tick={{ fontSize: 10 }} tickFormatter={(v: string) => v.slice(5)} />
                    <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                    <Tooltip formatter={(v: number) => [v, "Bookings"]} labelFormatter={(l: string) => `Date: ${l}`} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                    <Bar dataKey="count" fill="#00d4ff" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : <p className="text-muted-foreground text-sm text-center py-10">No data in selected range</p>}
            </Card>

            {/* Bookings by Status */}
            <Card className="bg-card border-border/50 p-4">
              <h3 className="font-semibold text-sm mb-4">Bookings by Status</h3>
              {bookingStatusData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={bookingStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }: { name: string; value: number }) => `${name}: ${value}`} labelLine={false} fontSize={10}>
                      {bookingStatusData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                    </Pie>
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : <p className="text-muted-foreground text-sm text-center py-10">No data</p>}
            </Card>

            {/* Bookings by Model */}
            <Card className="bg-card border-border/50 p-4">
              <h3 className="font-semibold text-sm mb-4">Bookings by Model</h3>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={modelData} layout="vertical">
                  <XAxis type="number" tick={{ fontSize: 10 }} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={60} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                  <Bar dataKey="value" fill="#7c3aed" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Fleet Status */}
            <Card className="bg-card border-border/50 p-4">
              <h3 className="font-semibold text-sm mb-4">Fleet Status Distribution</h3>
              {fleetData.length > 0 ? (
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={fleetData}>
                    <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                    <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                    <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : <p className="text-muted-foreground text-sm text-center py-10">No fleet data</p>}
            </Card>
          </div>
        </TabsContent>

        {/* Fleet Tab */}
        <TabsContent value="fleet" className="mt-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {Object.entries(vehicleFleet).map(([status, count]) => (
              <Card key={status} className="bg-card border-border/50 p-4 text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">{status.replace("_", " ")}</p>
                <p className="text-3xl font-bold text-foreground mt-1">{count}</p>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Executive Performance Tab */}
        <TabsContent value="executives" className="mt-4">
          {executivePerformance.length === 0 ? (
            <p className="text-muted-foreground text-center py-12">No executive data available</p>
          ) : (
            <div className="space-y-3">
              {executivePerformance.map((e, i) => (
                <Card key={e._id} className="bg-card border-border/50 p-4">
                  <div className="flex items-center gap-4">
                    <span className="text-xl font-bold text-muted-foreground w-8">#{i + 1}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{e.name || "Unknown"}</p>
                      <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                        <span>Total: <span className="text-foreground font-medium">{e.total}</span></span>
                        <span>Completed: <span className="text-green-400 font-medium">{e.completed}</span></span>
                        <span>Rate: <span className="text-primary font-medium">{e.total > 0 ? Math.round((e.completed / e.total) * 100) : 0}%</span></span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">{e.completed}</p>
                      <p className="text-xs text-muted-foreground">completed</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Feedback Tab */}
        <TabsContent value="feedback" className="mt-4">
          {topFeedback.length === 0 ? (
            <p className="text-muted-foreground text-center py-12">No feedback yet</p>
          ) : (
            <div className="space-y-3">
              {topFeedback.map((fb, i) => (
                <Card key={i} className="bg-card border-border/50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-foreground">{fb.customerId?.name ?? "Anonymous"}</p>
                      {fb.remarks && <p className="text-sm text-muted-foreground mt-1 italic">"{fb.remarks}"</p>}
                    </div>
                    <Badge className="bg-yellow-400/10 text-yellow-400 border-yellow-400/20 shrink-0">
                      {"⭐".repeat(Math.round(fb.overallRating))} {fb.overallRating?.toFixed(1)}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
