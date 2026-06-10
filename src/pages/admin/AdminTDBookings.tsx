import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Search, Calendar, Clock, User, Car, CheckCircle, XCircle,
  UserCheck, Phone, Mail, MapPin, ChevronRight, AlertCircle,
  RefreshCw, Filter, Eye, Edit2, Play, StopCircle
} from "lucide-react";

type BookingStatus =
  | "Pending Approval" | "Approved" | "Assigned" | "Confirmed"
  | "In Progress" | "Completed" | "Cancelled" | "No Show" | "Rescheduled";

interface TDBooking {
  id: string;
  bookingRef: string;
  customerName: string;
  customerMobile: string;
  customerEmail?: string;
  model: "VF 6" | "VF 7";
  variant?: string;
  branch: string;
  date: string;
  slotStart: string;
  slotEnd: string;
  status: BookingStatus;
  vehicleId?: string;
  executive?: string;
  licenseVerified: boolean;
  leadId?: string;
  createdAt: string;
}

const STATUS_STYLE: Record<BookingStatus, string> = {
  "Pending Approval": "bg-amber-400/10 text-amber-400 border-amber-400/30",
  Approved: "bg-blue-400/10 text-blue-400 border-blue-400/30",
  Assigned: "bg-indigo-400/10 text-indigo-400 border-indigo-400/30",
  Confirmed: "bg-cyan-400/10 text-cyan-400 border-cyan-400/30",
  "In Progress": "bg-orange-400/10 text-orange-400 border-orange-400/30",
  Completed: "bg-green-400/10 text-green-400 border-green-400/30",
  Cancelled: "bg-red-400/10 text-red-400 border-red-400/30",
  "No Show": "bg-secondary text-muted-foreground border-border",
  Rescheduled: "bg-purple-400/10 text-purple-400 border-purple-400/30",
};

const MOCK_BOOKINGS: TDBooking[] = [
  { id: "1", bookingRef: "TDB-20250401-A1B2", customerName: "Vikram Sharma", customerMobile: "9876543210", customerEmail: "vikram@gmail.com", model: "VF 7", variant: "Plus", branch: "Patna Main", date: "2025-04-02", slotStart: "10:00", slotEnd: "10:45", status: "Pending Approval", licenseVerified: false, createdAt: "2025-04-01" },
  { id: "2", bookingRef: "TDB-20250401-C3D4", customerName: "Priya Kumari", customerMobile: "9123456780", model: "VF 6", variant: "Eco", branch: "Patna Main", date: "2025-04-02", slotStart: "11:00", slotEnd: "11:45", status: "Assigned", vehicleId: "VF6-2001", executive: "Rahul Kumar", licenseVerified: true, leadId: "LEAD001", createdAt: "2025-04-01" },
  { id: "3", bookingRef: "TDB-20250401-E5F6", customerName: "Arun Singh", customerMobile: "9988776655", model: "VF 7", variant: "Plus", branch: "Patna Main", date: "2025-04-02", slotStart: "12:00", slotEnd: "12:45", status: "In Progress", vehicleId: "VF7-1003", executive: "Priya Singh", licenseVerified: true, createdAt: "2025-04-01" },
  { id: "4", bookingRef: "TDB-20250401-G7H8", customerName: "Sunita Devi", customerMobile: "9765432100", model: "VF 6", branch: "Patna Main", date: "2025-04-01", slotStart: "14:00", slotEnd: "14:45", status: "Completed", vehicleId: "VF6-2001", executive: "Rahul Kumar", licenseVerified: true, createdAt: "2025-03-31" },
  { id: "5", bookingRef: "TDB-20250331-I9J0", customerName: "Rajesh Gupta", customerMobile: "9654321098", model: "VF 7", branch: "Patna Main", date: "2025-04-03", slotStart: "09:00", slotEnd: "09:45", status: "Approved", vehicleId: "VF7-1001", licenseVerified: true, createdAt: "2025-03-31" },
  { id: "6", bookingRef: "TDB-20250330-K1L2", customerName: "Meena Tiwari", customerMobile: "9543210987", model: "VF 7", branch: "Patna Main", date: "2025-04-01", slotStart: "15:00", slotEnd: "15:45", status: "Cancelled", licenseVerified: false, createdAt: "2025-03-30" },
];

const ALL_STATUSES: BookingStatus[] = ["Pending Approval", "Approved", "Assigned", "Confirmed", "In Progress", "Completed", "Cancelled", "No Show", "Rescheduled"];

const AdminTDBookings = () => {
  const [bookings, setBookings] = useState<TDBooking[]>(MOCK_BOOKINGS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [selected, setSelected] = useState<TDBooking | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  const statusCounts = ALL_STATUSES.reduce((acc, s) => {
    acc[s] = bookings.filter(b => b.status === s).length;
    return acc;
  }, {} as Record<string, number>);

  const filtered = bookings.filter(b => {
    const matchSearch = !search ||
      b.customerName.toLowerCase().includes(search.toLowerCase()) ||
      b.customerMobile.includes(search) ||
      b.bookingRef.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || b.status === statusFilter;
    const matchDate = !dateFilter || b.date === dateFilter;
    return matchSearch && matchStatus && matchDate;
  });

  const openDetail = (b: TDBooking) => { setSelected(b); setShowDetail(true); };

  const approveBooking = (id: string) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "Approved" as BookingStatus } : b));
  };

  const cancelBooking = (id: string) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "Cancelled" as BookingStatus } : b));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Test Drive Bookings</h1>
          <p className="text-muted-foreground text-sm">{bookings.length} total · {statusCounts["Pending Approval"]} pending approval · {statusCounts["In Progress"]} in progress</p>
        </div>
      </div>

      {/* Status Quick Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setStatusFilter("all")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${statusFilter === "all" ? "bg-primary/10 text-primary border-primary/30" : "bg-secondary/50 text-muted-foreground border-border/40 hover:border-border"}`}
        >
          All ({bookings.length})
        </button>
        {(["Pending Approval", "Approved", "Assigned", "In Progress", "Completed", "Cancelled"] as BookingStatus[]).map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(statusFilter === s ? "all" : s)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${statusFilter === s ? STATUS_STYLE[s] : "bg-secondary/50 text-muted-foreground border-border/40"}`}
          >
            {s} ({statusCounts[s] || 0})
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search name, mobile, booking ref..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 bg-secondary/50" />
        </div>
        <Input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="bg-secondary/50 w-full sm:w-44" />
        {(search || dateFilter || statusFilter !== "all") && (
          <Button variant="outline" size="sm" onClick={() => { setSearch(""); setDateFilter(""); setStatusFilter("all"); }}>
            <RefreshCw className="w-3.5 h-3.5 mr-1" /> Clear
          </Button>
        )}
      </div>

      {/* Bookings Table */}
      <Card className="bg-card border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50 bg-secondary/30">
                <th className="text-left p-3 text-xs text-muted-foreground font-medium">Booking Ref</th>
                <th className="text-left p-3 text-xs text-muted-foreground font-medium">Customer</th>
                <th className="text-left p-3 text-xs text-muted-foreground font-medium hidden md:table-cell">Model</th>
                <th className="text-left p-3 text-xs text-muted-foreground font-medium">Date & Slot</th>
                <th className="text-left p-3 text-xs text-muted-foreground font-medium hidden lg:table-cell">Vehicle</th>
                <th className="text-left p-3 text-xs text-muted-foreground font-medium hidden lg:table-cell">Executive</th>
                <th className="text-left p-3 text-xs text-muted-foreground font-medium">Status</th>
                <th className="text-right p-3 text-xs text-muted-foreground font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => (
                <tr key={b.id} className="border-b border-border/20 hover:bg-secondary/20 transition-colors">
                  <td className="p-3">
                    <p className="font-mono text-xs text-foreground font-medium">{b.bookingRef}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{b.createdAt}</p>
                  </td>
                  <td className="p-3">
                    <p className="font-medium text-foreground text-sm">{b.customerName}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Phone className="w-2.5 h-2.5" />{b.customerMobile}
                    </p>
                    {!b.licenseVerified && (
                      <span className="text-[9px] text-amber-400 flex items-center gap-0.5 mt-0.5">
                        <AlertCircle className="w-2.5 h-2.5" /> License pending
                      </span>
                    )}
                  </td>
                  <td className="p-3 hidden md:table-cell">
                    <span className="text-foreground font-medium">{b.model}</span>
                    {b.variant && <span className="text-xs text-muted-foreground block">{b.variant}</span>}
                  </td>
                  <td className="p-3">
                    <p className="text-sm text-foreground flex items-center gap-1"><Calendar className="w-3 h-3 text-muted-foreground" />{b.date}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{b.slotStart} – {b.slotEnd}</p>
                  </td>
                  <td className="p-3 hidden lg:table-cell text-xs text-muted-foreground">{b.vehicleId || "—"}</td>
                  <td className="p-3 hidden lg:table-cell text-xs text-muted-foreground">{b.executive || "—"}</td>
                  <td className="p-3">
                    <span className={`text-[10px] px-2 py-1 rounded-full font-medium border whitespace-nowrap ${STATUS_STYLE[b.status]}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openDetail(b)}
                        className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      {b.status === "Pending Approval" && (
                        <button
                          onClick={() => approveBooking(b.id)}
                          className="p-1.5 rounded hover:bg-green-400/10 text-muted-foreground hover:text-green-400"
                          title="Approve"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {!["Completed", "Cancelled"].includes(b.status) && (
                        <button
                          onClick={() => cancelBooking(b.id)}
                          className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                          title="Cancel"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-10 text-sm">No bookings match the current filters</p>
          )}
        </div>
      </Card>

      {/* Booking Detail Dialog */}
      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">Booking Detail — {selected?.bookingRef}</DialogTitle>
          </DialogHeader>
          {selected && <BookingDetailPanel booking={selected} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const BookingDetailPanel = ({ booking }: { booking: TDBooking }) => (
  <Tabs defaultValue="info" className="mt-2">
    <TabsList className="bg-secondary/50 w-full">
      <TabsTrigger value="info" className="flex-1 text-xs">Booking Info</TabsTrigger>
      <TabsTrigger value="assign" className="flex-1 text-xs">Assign</TabsTrigger>
      <TabsTrigger value="checklist" className="flex-1 text-xs">Checklist</TabsTrigger>
    </TabsList>

    <TabsContent value="info" className="mt-4 space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {[
          ["Customer", booking.customerName],
          ["Mobile", booking.customerMobile],
          ["Email", booking.customerEmail || "—"],
          ["Model", `${booking.model}${booking.variant ? " " + booking.variant : ""}`],
          ["Branch", booking.branch],
          ["Date", booking.date],
          ["Slot", `${booking.slotStart} – ${booking.slotEnd}`],
          ["Vehicle", booking.vehicleId || "Not assigned"],
          ["Executive", booking.executive || "Not assigned"],
          ["License", booking.licenseVerified ? "✅ Verified" : "⚠️ Pending"],
        ].map(([k, v]) => (
          <div key={k} className="bg-secondary/30 rounded-lg p-3">
            <p className="text-[10px] text-muted-foreground">{k}</p>
            <p className="text-sm font-medium text-foreground">{v}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <span className={`px-3 py-1.5 rounded-full text-xs font-medium border ${STATUS_STYLE[booking.status]}`}>
          {booking.status}
        </span>
      </div>
    </TabsContent>

    <TabsContent value="assign" className="mt-4 space-y-4">
      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Assign Demo Vehicle</Label>
          <Select>
            <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select available vehicle" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="vf7-1001">VF7-1001 · VF 7 Plus · White (87% battery)</SelectItem>
              <SelectItem value="vf7-1002">VF7-1002 · VF 7 Plus · Black (72% battery)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Assign Sales Executive</Label>
          <Select>
            <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select executive" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="exec1">Rahul Kumar</SelectItem>
              <SelectItem value="exec2">Priya Singh</SelectItem>
              <SelectItem value="exec3">Amit Verma</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Internal Remarks</Label>
          <Textarea placeholder="Notes for executive..." className="bg-secondary/50" rows={2} />
        </div>
        <Button className="bg-primary text-primary-foreground w-full">
          <UserCheck className="w-4 h-4 mr-2" /> Confirm Assignment
        </Button>
      </div>
    </TabsContent>

    <TabsContent value="checklist" className="mt-4 space-y-3">
      <p className="text-xs text-muted-foreground font-medium">Pre-drive checklist status:</p>
      {[
        ["Customer Confirmed", true],
        ["Driving License Verified", booking.licenseVerified],
        ["Vehicle Assigned", !!booking.vehicleId],
        ["Executive Assigned", !!booking.executive],
        ["Opening Odometer Captured", booking.status === "In Progress" || booking.status === "Completed"],
        ["Opening Battery Captured", booking.status === "In Progress" || booking.status === "Completed"],
      ].map(([label, done]) => (
        <div key={label as string} className={`flex items-center gap-3 p-3 rounded-lg border ${done ? "bg-green-400/5 border-green-400/20" : "bg-secondary/30 border-border/30"}`}>
          {done ? <CheckCircle className="w-4 h-4 text-green-400 shrink-0" /> : <AlertCircle className="w-4 h-4 text-muted-foreground shrink-0" />}
          <span className={`text-sm ${done ? "text-foreground" : "text-muted-foreground"}`}>{label as string}</span>
        </div>
      ))}
    </TabsContent>
  </Tabs>
);

export default AdminTDBookings;
