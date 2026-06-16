import { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import { Calendar, Clock, Loader2, MapPin, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ApiRequestError, formatApiErrors } from "@/lib/api";
import {
  customerRescheduleBooking,
  fetchCustomerBookings,
  type CustomerBooking,
} from "@/lib/customerApi";
import { fetchPublicTdSlots, formatSlotLabel, type PublicTdSlot } from "@/lib/publicTdApi";
import { formatTime12h } from "@/lib/tdSlotSchedule";
import { cn } from "@/lib/utils";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  CONFIRMED: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  IN_PROGRESS: "bg-blue-500/15 text-blue-700 dark:text-blue-300",
  COMPLETED: "bg-muted text-muted-foreground",
  CANCELLED: "bg-red-500/15 text-red-700 dark:text-red-300",
  RESCHEDULED: "bg-violet-500/15 text-violet-700 dark:text-violet-300",
  MISSED: "bg-red-500/15 text-red-700 dark:text-red-300",
};

function formatBookingDate(booking: CustomerBooking): string {
  if (booking.slotDateLabel) {
    return format(new Date(`${booking.slotDateLabel}T12:00:00`), "dd MMM yyyy");
  }
  if (booking.slotDate) {
    return format(new Date(booking.slotDate), "dd MMM yyyy");
  }
  return "—";
}

export default function CustomerBookings() {
  const [bookings, setBookings] = useState<CustomerBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [rescheduleTarget, setRescheduleTarget] = useState<CustomerBooking | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [rescheduleSlots, setRescheduleSlots] = useState<PublicTdSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadBookings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchCustomerBookings();
      setBookings(data);
    } catch (e) {
      toast.error(e instanceof ApiRequestError ? formatApiErrors(e) : "Could not load bookings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadBookings();
  }, [loadBookings]);

  const openReschedule = (booking: CustomerBooking) => {
    const dateStr =
      booking.slotDateLabel ||
      (booking.slotDate ? new Date(booking.slotDate).toISOString().split("T")[0] : "");
    setRescheduleTarget(booking);
    setRescheduleDate(dateStr);
    setRescheduleTime(booking.slotTime || "");
    setRescheduleSlots([]);
  };

  const loadRescheduleSlots = useCallback(async () => {
    if (!rescheduleTarget?.branchId?._id || !rescheduleDate) return;
    setSlotsLoading(true);
    try {
      const model = rescheduleTarget.preferredModel || rescheduleTarget.testDriveId?.model || "";
      const variant =
        rescheduleTarget.testDriveId?.variant ||
        (rescheduleTarget as CustomerBooking & { preferredVariant?: string }).preferredVariant ||
        "";
      const res = await fetchPublicTdSlots({
        branchId: rescheduleTarget.branchId._id,
        date: rescheduleDate,
        model,
        variant: variant || undefined,
      });
      setRescheduleSlots(res.slots);
    } catch {
      toast.error("Could not load available time slots");
    } finally {
      setSlotsLoading(false);
    }
  }, [rescheduleDate, rescheduleTarget]);

  useEffect(() => {
    if (rescheduleTarget && rescheduleDate) {
      void loadRescheduleSlots();
    }
  }, [rescheduleTarget, rescheduleDate, loadRescheduleSlots]);

  const handleReschedule = async () => {
    if (!rescheduleTarget || !rescheduleDate || !rescheduleTime) {
      toast.error("Select a new date and time");
      return;
    }
    setSaving(true);
    try {
      await customerRescheduleBooking(rescheduleTarget._id, rescheduleDate, rescheduleTime);
      toast.success("Test drive rescheduled successfully");
      setRescheduleTarget(null);
      void loadBookings();
    } catch (e) {
      toast.error(e instanceof ApiRequestError ? formatApiErrors(e) : "Reschedule failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <Card className="p-10 text-center">
        <p className="text-muted-foreground">No test drive bookings found for your mobile number.</p>
        <Button asChild className="mt-4">
          <a href="/test-drive">Book a test drive</a>
        </Button>
      </Card>
    );
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button variant="outline" size="sm" onClick={() => void loadBookings()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4">
        {bookings.map((booking) => (
          <Card key={booking._id} className="p-5 border-border/60">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-3 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-foreground">{booking.bookingId}</span>
                  <Badge className={STATUS_COLORS[booking.bookingStatus] || "bg-muted"}>
                    {booking.bookingStatus}
                  </Badge>
                </div>

                <div className="grid gap-2 text-sm sm:grid-cols-2">
                  <p className="flex items-center gap-2 text-foreground">
                    <Calendar className="h-4 w-4 text-primary shrink-0" />
                    {formatBookingDate(booking)}
                  </p>
                  <p className="flex items-center gap-2 text-foreground">
                    <Clock className="h-4 w-4 text-primary shrink-0" />
                    {booking.slotTimeLabel || formatTime12h(booking.slotTime)}
                  </p>
                  <p className="flex items-center gap-2 text-muted-foreground sm:col-span-2">
                    <MapPin className="h-4 w-4 shrink-0" />
                    {booking.branchId?.name || "Showroom"}
                    {booking.preferredModel || booking.testDriveId?.model
                      ? ` · ${booking.preferredModel || booking.testDriveId?.model}`
                      : ""}
                    {booking.testDriveId?.variant ? ` ${booking.testDriveId.variant}` : ""}
                  </p>
                </div>

                {booking.assignedExecutive?.name ? (
                  <p className="text-xs text-muted-foreground">
                    Executive: {booking.assignedExecutive.name}
                  </p>
                ) : null}
              </div>

              {booking.canReschedule ? (
                <Button variant="outline" size="sm" className="shrink-0" onClick={() => openReschedule(booking)}>
                  Reschedule
                </Button>
              ) : null}
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={Boolean(rescheduleTarget)} onOpenChange={(open) => !open && setRescheduleTarget(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Reschedule test drive</DialogTitle>
            <DialogDescription>
              Choose a new date and time for booking {rescheduleTarget?.bookingId}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reschedule-date">New date</Label>
              <Input
                id="reschedule-date"
                type="date"
                value={rescheduleDate}
                onChange={(e) => {
                  setRescheduleDate(e.target.value);
                  setRescheduleTime("");
                }}
              />
            </div>

            <div className="space-y-2">
              <Label>Available time slots</Label>
              {slotsLoading ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                </div>
              ) : rescheduleSlots.length === 0 ? (
                <p className="text-sm text-muted-foreground py-2">No slots available for this date.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                  {rescheduleSlots.map((slot) => (
                    <button
                      key={slot.time}
                      type="button"
                      disabled={!slot.available}
                      onClick={() => setRescheduleTime(slot.time)}
                      className={cn(
                        "rounded-xl border px-3 py-2 text-sm transition-colors",
                        !slot.available && "opacity-50 cursor-not-allowed border-border bg-muted/30",
                        slot.available && rescheduleTime === slot.time
                          ? "border-primary bg-primary/10 text-primary font-medium"
                          : slot.available && "border-border hover:border-primary/50",
                      )}
                    >
                      {formatSlotLabel(slot)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRescheduleTarget(null)}>
              Cancel
            </Button>
            <Button onClick={() => void handleReschedule()} disabled={saving || !rescheduleTime}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Confirm reschedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
