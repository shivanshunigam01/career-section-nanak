import { mockLeads, mockTestDrives, mockEnquiries, LEAD_STATUSES } from "@/data/mockData";
import { Card } from "@/components/ui/card";
import { Users, Car, TestTube, MessageSquare, TrendingUp, Clock, Phone, CalendarCheck } from "lucide-react";

const statCards = [
  { label: "Total Leads", value: mockLeads.length, icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
  { label: "Test Drives", value: mockTestDrives.length, icon: TestTube, color: "text-green-400", bg: "bg-green-400/10" },
  { label: "Enquiries", value: mockEnquiries.length, icon: MessageSquare, color: "text-amber-400", bg: "bg-amber-400/10" },
  { label: "Bookings", value: mockLeads.filter(l => l.status === "Booked").length, icon: CalendarCheck, color: "text-primary", bg: "bg-primary/10" },
  { label: "Hot Leads", value: mockLeads.filter(l => ["Interested", "Negotiation"].includes(l.status)).length, icon: TrendingUp, color: "text-orange-400", bg: "bg-orange-400/10" },
  { label: "Pending Follow-ups", value: mockLeads.filter(l => l.nextFollowUp).length, icon: Clock, color: "text-purple-400", bg: "bg-purple-400/10" },
  { label: "Contact Pending", value: mockLeads.filter(l => l.status === "Contact Attempted").length, icon: Phone, color: "text-cyan-400", bg: "bg-cyan-400/10" },
  { label: "Models in Demand", value: 2, icon: Car, color: "text-emerald-400", bg: "bg-emerald-400/10" },
];

const pipelineData = LEAD_STATUSES.map(status => ({
  status,
  count: mockLeads.filter(l => l.status === status).length,
}));

const AdminDashboard = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Welcome back — here's your dealership overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label} className="bg-card border-border/50 p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-display font-bold text-foreground mt-1">{stat.value}</p>
              </div>
              <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* CRM Pipeline */}
      <div>
        <h2 className="font-display text-lg font-semibold text-foreground mb-4">CRM Pipeline</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {pipelineData.map((stage) => (
            <div key={stage.status} className="glass-card-sm p-3 text-center">
              <p className="text-2xl font-bold text-foreground">{stage.count}</p>
              <p className="text-[10px] text-muted-foreground mt-1 leading-tight">{stage.status}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Leads & Test Drives */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <Card className="bg-card border-border/50 p-5">
          <h3 className="font-display font-semibold text-foreground mb-4">Recent Leads</h3>
          <div className="space-y-3">
            {mockLeads.slice(0, 5).map((lead) => (
              <div key={lead.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{lead.name}</p>
                  <p className="text-xs text-muted-foreground">{lead.model} · {lead.source}</p>
                </div>
                <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${
                  lead.status === "New Lead" ? "bg-blue-400/10 text-blue-400" :
                  lead.status === "Interested" ? "bg-green-400/10 text-green-400" :
                  lead.status === "Booked" ? "bg-primary/10 text-primary" :
                  lead.status === "Lost" ? "bg-destructive/10 text-destructive" :
                  "bg-secondary text-muted-foreground"
                }`}>
                  {lead.status}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Test Drives */}
        <Card className="bg-card border-border/50 p-5">
          <h3 className="font-display font-semibold text-foreground mb-4">Test Drive Bookings</h3>
          <div className="space-y-3">
            {mockTestDrives.map((td) => (
              <div key={td.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{td.customerName}</p>
                  <p className="text-xs text-muted-foreground">{td.model} · {td.preferredDate} {td.preferredTime}</p>
                </div>
                <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${
                  td.status === "Confirmed" ? "bg-green-400/10 text-green-400" :
                  td.status === "Completed" ? "bg-primary/10 text-primary" :
                  td.status === "Cancelled" ? "bg-destructive/10 text-destructive" :
                  "bg-amber-400/10 text-amber-400"
                }`}>
                  {td.status}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Source Breakdown */}
      <Card className="bg-card border-border/50 p-5">
        <h3 className="font-display font-semibold text-foreground mb-4">Lead Sources</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {["Google Ads", "Website", "WhatsApp", "Meta Ads", "Walk-in", "Referral"].map((source) => {
            const count = mockLeads.filter(l => l.source === source).length;
            return (
              <div key={source} className="text-center p-3 rounded-lg bg-secondary/30">
                <p className="text-lg font-bold text-foreground">{count}</p>
                <p className="text-[11px] text-muted-foreground">{source}</p>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
