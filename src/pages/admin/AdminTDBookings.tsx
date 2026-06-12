import { useCallback, useEffect, useState } from "react";
import { adminGet, adminPatchJson, adminPostJson, formatApiErrors } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  CalendarCheck, Search, RefreshCw, Car, User, Clock, Building2,
  CheckCircle2, XCircle, AlertTriangle, Loader2, Eye, UserCheck, Ban
} from "lucide-react";
import { toast } from "sonner";

type Booking = {
  _id: string;
  bookingId: string;
  bookingStatus: string;
  slotDate: string;
  slotTime: string;
  slotDuration: number;
  dlVerified: boolean;
  preferredModel: string;
  customerId: { _id: string; name: string; mobile: string; customerId: string } | null;
  vehicleId: { vehicleId: string; model: string; registrationNo: string; color: string } | null;
  assignedExecutive: { _id: string; name: string; email: string } | null;
  branchId: { name: string; code: string } | null;
  createdAt: string;
  cancellationReason?: string;
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20",
  CONFIRMED: "bg-blue-400/10 text-blue-400 border-blue-400/20",
  IN_PROGRESS: "bg-purple-400/10 text-purple-400 border-purple-400/20",
  COMPLETED: "bg-green-400/10 text-green-400 border-green-400/20",
  CANCELLED: "bg-red-400/10 text-red-400 border-red-400/20",
  RESCHEDULED: "bg-orange-400/10 text-orange-400 border-orange-400/20",
  MISSED: "bg-gray-400/10 text-gray-400 border-gray-400/20",
};

const ALL_STATUSES = ["PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED", "RESCHEDULED", "MISSED"];

export default function AdminTDBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate, setFilterDate] = useState("");
  const [selected, setSelected] = useState<Booking | null>(null);
  const [cancelDialog, setCancelDialog] = useState<Booking | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ limit: "100" });
      if (filterStatus !== "all") params.set("status", filterStatus);
      if (filterDate) params.set("date", filterDate);
      const { data } = await adminGet<Booking[]>(`/admin/td/bookings?${params}`);
      setBookings(data ?? []);
    } catch (e) {
      toast.error(formatApiErrors(e));
    } finally {
      setLoading(false);
    }
  }, [filterStatus, filterDate]);

  useEffect(() => { void fetchBookings(); }, [fetchBookings]);

  const filtered = bookings.filter((b) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      b.bookingId?.toLowerCase().includes(s) ||
      b.customerId?.name?.toLowerCase().includes(s) ||
      b.customerId?.mobile?.includes(s) ||
      b.vehicleId?.registrationNo?.toLowerCase().includes(s)
    );
  });

  const handleCancel = async () => {
    if (!cancelDialog) return;
    setActionLoading(true);
    try {
      await adminPatchJson(`/admin/td/bookings/${cancelDialog._id}/cancel`, { reason: cancelReason });
      toast.success("Booking cancelled");
      setCancelDialog(null);
      setCancelReason("");
      void fetchBookings();
    } catch (e) {
      toast.error(formatApiErrors(e));
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    setActionLoading(true);
    try {
      await adminPatchJson(`/admin/td/bookings/${id}`, { bookingStatus: status });
      toast.success(`Booking marked as ${status}`);
      void fetchBookings();
    } catch (e) {
      toast.error(formatApiErrors(e));
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <CalendarCheck className="w-6 h-6 text-primary" /> TD Bookings
          </h1>
          <p className="text-muted-foreground text-sm">{filtered.length} booking(s)</p>
        </div>
        <Button onClick={() => void fetchBookings()} variant="outline" size="sm" className="shrink-0">
          <RefreshCw className="w-4 h-4 mr-2" /> Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search booking / customer..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-secondary/50" />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {ALL_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="bg-secondary/50" />
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading bookings...
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <CalendarCheck className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No bookings found</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((b) => (
            <Card key={b._id} className="bg-card border-border/50 p-4 space-y-3 hover:border-primary/30 transition-colors">
              {/* Top row */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground font-mono">{b.bookingId}</p>
                  <p className="font-semibold text-foreground truncate">{b.customerId?.name ?? "Unknown"}</p>
                  <p className="text-xs text-muted-foreground">{b.customerId?.mobile}</p>
                </div>
                <Badge className={`shrink-0 text-[10px] border ${STATUS_COLORS[b.bookingStatus] ?? "bg-secondary"}`}>
                  {b.bookingStatus}
                </Badge>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-2 text-xs border-t border-border/30 pt-3">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span>{new Date(b.slotDate).toLocaleDateString("en-IN")} {b.slotTime}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Car className="w-3.5 h-3.5 shrink-0" />
                  <span>{b.vehicleId ? `${b.vehicleId.model} — ${b.vehicleId.registrationNo}` : b.preferredModel || "TBD"}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <UserCheck className="w-3.5 h-3.5 shrink-0" />
                  <span>{b.assignedExecutive?.name ?? "Unassigned"}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Building2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{b.branchId?.name ?? "—"}</span>
                </div>
              </div>

              {/* DL badge */}
              <div className="flex items-center gap-1.5 text-xs">
                {b.dlVerified ? (
                  <span className="flex items-center gap-1 text-green-400"><CheckCircle2 className="w-3 h-3" /> DL Verified</span>
                ) : (
                  <span className="flex items-center gap-1 text-yellow-400"><AlertTriangle className="w-3 h-3" /> DL Pending</span>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-1.5 border-t border-border/30 pt-3">
                <Button size="sm" variant="ghost" className="flex-1 text-xs h-8" onClick={() => setSelected(b)}>
                  <Eye className="w-3.5 h-3.5 mr-1" /> View
                </Button>
                {b.bookingStatus === "CONFIRMED" && (
                  <Button size="sm" variant="ghost" className="text-xs h-8 text-green-400 hover:text-green-300 hover:bg-green-400/10"
                    onClick={() => void handleStatusUpdate(b._id, "COMPLETED")} disabled={actionLoading}>
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Complete
                  </Button>
                )}
                {!["COMPLETED", "CANCELLED", "MISSED"].includes(b.bookingStatus) && (
                  <Button size="sm" variant="ghost" className="text-xs h-8 text-red-400 hover:text-red-300 hover:bg-red-400/10"
                    onClick={() => { setCancelDialog(b); setCancelReason(""); }}>
                    <Ban className="w-3.5 h-3.5 mr-1" /> Cancel
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="bg-card border-border max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-display">Booking Details</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Booking ID", selected.bookingId],
                  ["Status", selected.bookingStatus],
                  ["Customer", selected.customerId?.name],
                  ["Mobile", selected.customerId?.mobile],
                  ["Customer ID", selected.customerId?.customerId],
                  ["Vehicle", selected.vehicleId ? `${selected.vehicleId.model} (${selected.vehicleId.registrationNo})` : selected.preferredModel || "TBD"],
                  ["Color", selected.vehicleId?.color || "—"],
                  ["Executive", selected.assignedExecutive?.name ?? "Unassigned"],
                  ["Date", new Date(selected.slotDate).toLocaleDateString("en-IN")],
                  ["Time", selected.slotTime],
                  ["Duration", `${selected.slotDuration} min`],
                  ["Branch", selected.branchId?.name],
                  ["DL Verified", selected.dlVerified ? "Yes ✅" : "No ❌"],
                  ["Booked On", new Date(selected.createdAt).toLocaleString("en-IN")],
                ].map(([label, val]) => (
                  <div key={label}>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="font-medium text-foreground">{val ?? "—"}</p>
                  </div>
                ))}
              </div>
              {selected.cancellationReason && (
                <div className="rounded-lg bg-red-400/5 border border-red-400/20 p-3">
                  <p className="text-xs text-red-400 font-medium">Cancellation Reason</p>
                  <p className="text-foreground text-sm mt-1">{selected.cancellationReason}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={!!cancelDialog} onOpenChange={(o) => !o && setCancelDialog(null)}>
        <DialogContent className="bg-card border-border max-w-sm">
          <DialogHeader><DialogTitle>Cancel Booking</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Cancelling <span className="text-foreground font-mono">{cancelDialog?.bookingId}</span> for <span className="text-foreground">{cancelDialog?.customerId?.name}</span>.</p>
            <div className="space-y-1.5">
              <Label className="text-xs">Reason (optional)</Label>
              <Textarea value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} className="bg-secondary/50" rows={3} placeholder="e.g. Customer requested cancellation" />
            </div>
            <div className="flex gap-3">
              <Button variant="destructive" className="flex-1" onClick={() => void handleCancel()} disabled={actionLoading}>
                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <XCircle className="w-4 h-4 mr-2" />} Confirm Cancel
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => setCancelDialog(null)}>Keep Booking</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
