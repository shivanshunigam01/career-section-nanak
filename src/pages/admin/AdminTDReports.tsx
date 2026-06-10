import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from "recharts";
import {
  Calendar, TrendingUp, Car, Users, Battery, Wrench,
  AlertTriangle, CheckCircle, Clock, Target, Download
} from "lucide-react";

// ── Mock data ────────────────────────────────────────────────────────────────

const dailyData = [
  { day: "Mon", bookings: 8, completed: 6, cancelled: 1 },
  { day: "Tue", bookings: 12, completed: 10, cancelled: 0 },
  { day: "Wed", bookings: 7, completed: 5, cancelled: 2 },
  { day: "Thu", bookings: 15, completed: 13, cancelled: 1 },
  { day: "Fri", bookings: 18, completed: 16, cancelled: 0 },
  { day: "Sat", bookings: 22, completed: 19, cancelled: 2 },
  { day: "Sun", bookings: 4, completed: 2, cancelled: 1 },
];

const slotData = [
  { slot: "09:00", bookings: 14, available: 2 },
  { slot: "09:45", bookings: 18, available: 0 },
  { slot: "10:30", bookings: 22, available: 0 },
  { slot: "11:15", bookings: 20, available: 2 },
  { slot: "12:00", bookings: 16, available: 4 },
  { slot: "14:00", bookings: 25, available: 0 },
  { slot: "14:45", bookings: 21, available: 1 },
  { slot: "15:30", bookings: 17, available: 3 },
  { slot: "16:15", bookings: 12, available: 4 },
];

const vehicleUtilData = [
  { vehicle: "VF7-1001", model: "VF 7", tds: 67, km: 4210, depletionPct: 5, status: "Good" },
  { vehicle: "VF7-1002", model: "VF 7", tds: 102, km: 6540, depletionPct: 8, status: "Good" },
  { vehicle: "VF6-2001", model: "VF 6", tds: 148, km: 8900, depletionPct: 11, status: "Good" },
  { vehicle: "VF7-1003", model: "VF 7", tds: 48, km: 3100, depletionPct: 4, status: "Good" },
  { vehicle: "VF6-2002", model: "VF 6", tds: 215, km: 12400, depletionPct: 16, status: "Moderate" },
  { vehicle: "VF7-1004", model: "VF 7", tds: 298, km: 18200, depletionPct: 23, status: "Warning" },
];

const executiveData = [
  { name: "Rahul Kumar", assigned: 42, completed: 38, noShow: 2, cancelled: 2, rate: 90 },
  { name: "Priya Singh", assigned: 36, completed: 31, noShow: 3, cancelled: 2, rate: 86 },
  { name: "Amit Verma", assigned: 28, completed: 22, noShow: 4, cancelled: 2, rate: 79 },
  { name: "Neha Gupta", assigned: 19, completed: 17, noShow: 1, cancelled: 1, rate: 89 },
];

const conversionFunnel = [
  { stage: "Test Drive Booked", count: 186 },
  { stage: "Test Drive Done", count: 142 },
  { stage: "Interested", count: 98 },
  { stage: "Negotiation", count: 54 },
  { stage: "Booking", count: 32 },
  { stage: "Delivered", count: 18 },
];

const sourceData = [
  { name: "Website", value: 42 },
  { name: "WhatsApp", value: 28 },
  { name: "Google Ads", value: 19 },
  { name: "Meta Ads", value: 7 },
  { name: "Walk-in", value: 4 },
];

const CHART_COLORS = ["#e63232", "#3b82f6", "#22c55e", "#f59e0b", "#a855f7"];

const followupData = [
  { name: "Vikram Sharma", mobile: "9876543210", model: "VF 7", lastTD: "2025-03-28", daysOverdue: 3, executive: "Rahul Kumar", intent: "Hot" },
  { name: "Sunita Devi", mobile: "9765432100", model: "VF 6", lastTD: "2025-03-25", daysOverdue: 6, executive: "Priya Singh", intent: "Warm" },
  { name: "Arun Singh", mobile: "9988776655", model: "VF 7", lastTD: "2025-03-20", daysOverdue: 11, executive: "Amit Verma", intent: "Warm" },
  { name: "Meena Tiwari", mobile: "9543210987", model: "VF 6", lastTD: "2025-03-18", daysOverdue: 13, executive: "Rahul Kumar", intent: "Cold" },
];

const lostReasons = [
  { reason: "Price too high", count: 18 },
  { reason: "Chose competitor EV", count: 12 },
  { reason: "Finance not approved", count: 9 },
  { reason: "Not ready to buy", count: 7 },
  { reason: "Customer no show", count: 5 },
  { reason: "Other", count: 4 },
];

// ── Sub-components ────────────────────────────────────────────────────────────

const SummaryCard = ({ label, value, sub, icon: Icon, color }: { label: string; value: string | number; sub?: string; icon: React.ElementType; color: string }) => (
  <Card className="bg-card border-border/50 p-4">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className={`text-2xl font-display font-bold mt-1 ${color}`}>{value}</p>
        {sub && <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>}
      </div>
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center bg-current/10`} style={{ background: "rgba(255,255,255,0.05)" }}>
        <Icon className={`w-4 h-4 ${color}`} />
      </div>
    </div>
  </Card>
);

const depletionColor = (pct: number) => pct >= 75 ? "bg-red-400" : pct >= 50 ? "bg-yellow-400" : pct >= 25 ? "bg-orange-400" : "bg-green-400";

// ── Main Component ────────────────────────────────────────────────────────────

const AdminTDReports = () => {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Test Drive Reports</h1>
          <p className="text-muted-foreground text-sm">Analytics across bookings, fleet, executives & conversions</p>
        </div>
        <div className="flex items-center gap-2">
          <Input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="bg-secondary/50 w-36 text-xs" />
          <span className="text-muted-foreground text-xs">to</span>
          <Input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="bg-secondary/50 w-36 text-xs" />
          <Button variant="outline" size="sm"><Download className="w-3.5 h-3.5 mr-1" /> Export</Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <SummaryCard label="Total Bookings (Month)" value={186} sub="+14% vs last month" icon={Calendar} color="text-blue-400" />
        <SummaryCard label="Test Drives Done" value={142} sub="76% completion rate" icon={CheckCircle} color="text-green-400" />
        <SummaryCard label="Conversions (Booked)" value={32} sub="22.5% TD-to-booking rate" icon={Target} color="text-primary" />
        <SummaryCard label="Pending Follow-ups" value={followupData.length} sub="Overdue actions" icon={Clock} color="text-amber-400" />
      </div>

      {/* Tab Reports */}
      <Tabs defaultValue="daily" className="space-y-4">
        <TabsList className="bg-secondary/50 flex-wrap h-auto gap-1 p-1">
          {[
            ["daily", "Daily Bookings"],
            ["slots", "Slot Analysis"],
            ["vehicles", "Fleet Utilization"],
            ["executives", "Executive KPI"],
            ["conversion", "Conversion Funnel"],
            ["followups", "Follow-ups"],
            ["depletion", "Fleet Depletion"],
            ["lost", "Lost Reasons"],
          ].map(([val, label]) => (
            <TabsTrigger key={val} value={val} className="text-xs px-3">{label}</TabsTrigger>
          ))}
        </TabsList>

        {/* Daily Booking Report */}
        <TabsContent value="daily" className="space-y-4">
          <Card className="bg-card border-border/50 p-5">
            <h3 className="font-display font-semibold text-foreground mb-4">Daily Booking Report (This Week)</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" tick={{ fill: "#888", fontSize: 11 }} />
                <YAxis tick={{ fill: "#888", fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid #333", borderRadius: 8 }} />
                <Legend />
                <Bar dataKey="bookings" fill="#3b82f6" radius={[3, 3, 0, 0]} name="Total Bookings" />
                <Bar dataKey="completed" fill="#22c55e" radius={[3, 3, 0, 0]} name="Completed" />
                <Bar dataKey="cancelled" fill="#ef4444" radius={[3, 3, 0, 0]} name="Cancelled" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
          <div className="grid sm:grid-cols-4 gap-3">
            {[["Total This Week", 86, "text-blue-400"], ["Completed", 71, "text-green-400"], ["Cancelled", 7, "text-red-400"], ["Completion Rate", "83%", "text-primary"]].map(([l, v, c]) => (
              <Card key={l as string} className="bg-card border-border/50 p-4 text-center">
                <p className={`text-2xl font-bold font-display ${c}`}>{v}</p>
                <p className="text-xs text-muted-foreground mt-1">{l as string}</p>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Slot Analysis */}
        <TabsContent value="slots" className="space-y-4">
          <Card className="bg-card border-border/50 p-5">
            <h3 className="font-display font-semibold text-foreground mb-4">Slot-wise Booking Frequency</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={slotData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="slot" tick={{ fill: "#888", fontSize: 10 }} />
                <YAxis tick={{ fill: "#888", fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid #333", borderRadius: 8 }} />
                <Bar dataKey="bookings" fill="#e63232" radius={[3, 3, 0, 0]} name="Bookings" />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-xs text-muted-foreground mt-3 text-center">Peak slots: 14:00–15:30 on weekdays · 10:00–12:00 on weekends</p>
          </Card>
        </TabsContent>

        {/* Fleet Utilization */}
        <TabsContent value="vehicles" className="space-y-4">
          <Card className="bg-card border-border/50 overflow-hidden">
            <div className="p-4 border-b border-border/30">
              <h3 className="font-display font-semibold text-foreground">Vehicle Utilization Report</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/30 bg-secondary/20">
                    {["Vehicle ID", "Model", "Total TDs", "Total KM", "Daily KM", "Depletion", "Status"].map(h => (
                      <th key={h} className="text-left p-3 text-xs text-muted-foreground font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {vehicleUtilData.map(v => (
                    <tr key={v.vehicle} className="border-b border-border/20 hover:bg-secondary/20">
                      <td className="p-3 font-mono text-xs text-foreground font-medium">{v.vehicle}</td>
                      <td className="p-3 text-sm text-foreground">{v.model}</td>
                      <td className="p-3 text-sm text-foreground">{v.tds}</td>
                      <td className="p-3 text-sm text-foreground">{v.km.toLocaleString()} km</td>
                      <td className="p-3 text-xs text-muted-foreground">{Math.round(v.km / 30)} km/day</td>
                      <td className="p-3 w-40">
                        <div className="flex items-center gap-2">
                          <Progress value={v.depletionPct} className="h-1.5 flex-1" />
                          <span className="text-xs text-muted-foreground">{v.depletionPct}%</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${v.status === "Good" ? "bg-green-400/10 text-green-400" : v.status === "Warning" ? "bg-yellow-400/10 text-yellow-400" : "bg-red-400/10 text-red-400"}`}>
                          {v.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* Executive KPI */}
        <TabsContent value="executives" className="space-y-4">
          <Card className="bg-card border-border/50 overflow-hidden">
            <div className="p-4 border-b border-border/30">
              <h3 className="font-display font-semibold text-foreground">Executive Productivity Report</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/30 bg-secondary/20">
                    {["Executive", "Assigned", "Completed", "No Show", "Cancelled", "Completion Rate"].map(h => (
                      <th key={h} className="text-left p-3 text-xs text-muted-foreground font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {executiveData.map(e => (
                    <tr key={e.name} className="border-b border-border/20 hover:bg-secondary/20">
                      <td className="p-3 font-medium text-foreground">{e.name}</td>
                      <td className="p-3 text-foreground">{e.assigned}</td>
                      <td className="p-3 text-green-400 font-medium">{e.completed}</td>
                      <td className="p-3 text-muted-foreground">{e.noShow}</td>
                      <td className="p-3 text-red-400">{e.cancelled}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Progress value={e.rate} className="h-1.5 w-20" />
                          <span className={`text-xs font-bold ${e.rate >= 85 ? "text-green-400" : e.rate >= 75 ? "text-amber-400" : "text-red-400"}`}>{e.rate}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* Conversion Funnel */}
        <TabsContent value="conversion" className="space-y-4">
          <div className="grid lg:grid-cols-2 gap-4">
            <Card className="bg-card border-border/50 p-5">
              <h3 className="font-display font-semibold text-foreground mb-4">TD-to-Booking Funnel</h3>
              <div className="space-y-3">
                {conversionFunnel.map((stage, i) => {
                  const pct = Math.round((stage.count / conversionFunnel[0].count) * 100);
                  return (
                    <div key={stage.stage}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground">{stage.stage}</span>
                        <span className="text-xs font-bold text-foreground">{stage.count} <span className="text-muted-foreground font-normal">({pct}%)</span></span>
                      </div>
                      <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
            <Card className="bg-card border-border/50 p-5">
              <h3 className="font-display font-semibold text-foreground mb-4">Lead Source Distribution</h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={sourceData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={10}>
                    {sourceData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid #333", borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </TabsContent>

        {/* Pending Follow-ups */}
        <TabsContent value="followups" className="space-y-4">
          <Card className="bg-card border-border/50 overflow-hidden">
            <div className="p-4 border-b border-border/30 flex items-center justify-between">
              <h3 className="font-display font-semibold text-foreground">Overdue Follow-ups</h3>
              <span className="text-xs bg-amber-400/10 text-amber-400 border border-amber-400/30 px-2 py-0.5 rounded-full">{followupData.length} overdue</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/30 bg-secondary/20">
                    {["Customer", "Mobile", "Model", "Last TD", "Days Overdue", "Executive", "Intent"].map(h => (
                      <th key={h} className="text-left p-3 text-xs text-muted-foreground font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {followupData.map(f => (
                    <tr key={f.name} className="border-b border-border/20 hover:bg-secondary/20">
                      <td className="p-3 font-medium text-foreground">{f.name}</td>
                      <td className="p-3 text-xs text-muted-foreground">{f.mobile}</td>
                      <td className="p-3 text-sm text-foreground">{f.model}</td>
                      <td className="p-3 text-xs text-muted-foreground">{f.lastTD}</td>
                      <td className="p-3">
                        <span className={`text-xs font-bold ${f.daysOverdue >= 10 ? "text-red-400" : f.daysOverdue >= 5 ? "text-amber-400" : "text-yellow-400"}`}>
                          {f.daysOverdue}d overdue
                        </span>
                      </td>
                      <td className="p-3 text-xs text-muted-foreground">{f.executive}</td>
                      <td className="p-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${f.intent === "Hot" ? "bg-red-400/10 text-red-400 border-red-400/30" : f.intent === "Warm" ? "bg-orange-400/10 text-orange-400 border-orange-400/30" : "bg-secondary text-muted-foreground border-border"}`}>
                          {f.intent}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* Fleet Depletion */}
        <TabsContent value="depletion" className="space-y-4">
          <Card className="bg-card border-border/50 p-5">
            <h3 className="font-display font-semibold text-foreground mb-4">Demo Fleet Depletion Status</h3>
            <div className="space-y-4">
              {vehicleUtilData.map(v => (
                <div key={v.vehicle} className="flex items-center gap-4">
                  <div className="w-24 shrink-0">
                    <p className="text-xs font-mono font-bold text-foreground">{v.vehicle}</p>
                    <p className="text-[10px] text-muted-foreground">{v.model}</p>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-muted-foreground">{v.km.toLocaleString()} / 80,000 km</span>
                      <span className={`text-[10px] font-bold ${v.depletionPct >= 50 ? "text-yellow-400" : "text-green-400"}`}>{v.depletionPct}%</span>
                    </div>
                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${depletionColor(v.depletionPct)}`} style={{ width: `${v.depletionPct}%` }} />
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded border font-medium shrink-0 ${v.status === "Good" ? "bg-green-400/10 text-green-400 border-green-400/30" : v.status === "Warning" ? "bg-yellow-400/10 text-yellow-400 border-yellow-400/30" : "bg-red-400/10 text-red-400 border-red-400/30"}`}>
                    {v.status}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Lost Reasons */}
        <TabsContent value="lost" className="space-y-4">
          <div className="grid lg:grid-cols-2 gap-4">
            <Card className="bg-card border-border/50 p-5">
              <h3 className="font-display font-semibold text-foreground mb-4">Lost Lead Reasons</h3>
              <div className="space-y-3">
                {lostReasons.map(r => {
                  const pct = Math.round((r.count / lostReasons.reduce((s, x) => s + x.count, 0)) * 100);
                  return (
                    <div key={r.reason}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground">{r.reason}</span>
                        <span className="text-xs font-bold text-foreground">{r.count} ({pct}%)</span>
                      </div>
                      <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-red-400/70" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
            <Card className="bg-card border-border/50 p-5">
              <h3 className="font-display font-semibold text-foreground mb-4">Cancellation Breakdown</h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={lostReasons} cx="50%" cy="50%" outerRadius={75} dataKey="count" nameKey="reason" label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={10}>
                    {lostReasons.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid #333", borderRadius: 8 }} />
                  <Legend formatter={(v) => <span className="text-[10px] text-muted-foreground">{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminTDReports;
