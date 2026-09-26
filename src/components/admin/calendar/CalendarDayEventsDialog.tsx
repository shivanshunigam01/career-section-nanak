import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarClock, Car, ExternalLink, Phone, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { calendarEventDateKey, resolveCalendarEventHref, type CalendarEvent } from "@/lib/calendarApi";
import { cn } from "@/lib/utils";

const TYPE_LABELS: Record<string, string> = {
  new_lead: "New Lead",
  lead: "Lead",
  test_drive: "Test Drive",
  lead_follow_up: "Follow-up",
  stage_activity: "Stage",
  booking_update: "Booking",
  delivery: "Delivery",
  sales_activity: "Sales",
  awaiting_vehicle: "Awaiting Vehicle",
  pending_approval: "Approval",
  customer_appointment: "Meeting",
};

/** Estimated card height for virtualized day lists (px). */
const EVENT_ROW_HEIGHT = 112;
const VIRTUALIZE_THRESHOLD = 40;

function formatDayTitle(dateKey: string) {
  const d = new Date(`${dateKey}T12:00:00`);
  if (Number.isNaN(d.getTime())) return dateKey;
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatEventTime(ev: CalendarEvent) {
  if (ev.allDay) return "All day";
  if (ev.time) return ev.time;
  if (!ev.start) return "—";
  const d = new Date(ev.start);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

function sortEvents(a: CalendarEvent, b: CalendarEvent) {
  if (a.allDay && !b.allDay) return -1;
  if (!a.allDay && b.allDay) return 1;
  return String(a.start || "").localeCompare(String(b.start || ""));
}

export function filterEventsForDate(events: CalendarEvent[], dateKey: string) {
  return events.filter((ev) => calendarEventDateKey(ev) === dateKey).sort(sortEvents);
}

function EventCard({
  ev,
  onOpen,
}: {
  ev: CalendarEvent;
  onOpen: (ev: CalendarEvent) => void;
}) {
  const typeLabel = TYPE_LABELS[ev.type] || ev.type;
  const href = resolveCalendarEventHref(ev);

  return (
    <button
      type="button"
      onClick={() => onOpen(ev)}
      className={cn(
        "w-full text-left rounded-lg border border-border/60 bg-card p-3",
        "hover:border-primary/40 hover:bg-primary/5 transition-colors group",
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0">
          <p className="font-medium text-sm truncate">{ev.customerName || ev.title}</p>
          <p className="text-xs text-muted-foreground truncate">{ev.title}</p>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <Badge variant="outline" className="text-[10px]" style={{ borderColor: ev.color, color: ev.color }}>
            {typeLabel}
          </Badge>
          {href ? (
            <span className="inline-flex items-center gap-0.5 text-[10px] text-primary opacity-80 group-hover:opacity-100">
              Open lead <ExternalLink className="w-3 h-3" />
            </span>
          ) : null}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <CalendarClock className="w-3 h-3" />
          {formatEventTime(ev)}
        </span>
        {ev.mobile ? (
          <span className="inline-flex items-center gap-1 truncate">
            <Phone className="w-3 h-3 shrink-0" />
            {ev.mobile}
          </span>
        ) : null}
        {ev.vehicle ? (
          <span className="inline-flex items-center gap-1 truncate">
            <Car className="w-3 h-3 shrink-0" />
            {ev.vehicle}
          </span>
        ) : null}
        {ev.assignedExecutive?.name ? (
          <span className="inline-flex items-center gap-1 truncate">
            <User className="w-3 h-3 shrink-0" />
            {ev.assignedExecutive.name}
          </span>
        ) : null}
      </div>
      {(ev.status || ev.remarks) && (
        <div className="mt-2 pt-2 border-t border-border/40 text-xs space-y-0.5">
          {ev.status ? (
            <p>
              <span className="text-muted-foreground">Status: </span>
              <span className="font-medium text-foreground">{ev.status}</span>
            </p>
          ) : null}
          {ev.remarks ? <p className="text-muted-foreground line-clamp-2">{ev.remarks}</p> : null}
        </div>
      )}
    </button>
  );
}

function VirtualEventList({
  events,
  onOpen,
}: {
  events: CalendarEvent[];
  onOpen: (ev: CalendarEvent) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [viewportHeight, setViewportHeight] = useState(320);
  const [scrollTop, setScrollTop] = useState(0);

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return undefined;
    const measure = () => setViewportHeight(el.clientHeight || 320);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const onScroll = useCallback(() => {
    const el = scrollRef.current;
    if (el) setScrollTop(el.scrollTop);
  }, []);

  const totalHeight = events.length * EVENT_ROW_HEIGHT;
  const startIndex = Math.max(0, Math.floor(scrollTop / EVENT_ROW_HEIGHT) - 4);
  const endIndex = Math.min(
    events.length,
    Math.ceil((scrollTop + viewportHeight) / EVENT_ROW_HEIGHT) + 4,
  );
  const slice = events.slice(startIndex, endIndex);
  const offsetY = startIndex * EVENT_ROW_HEIGHT;

  return (
    <div
      ref={scrollRef}
      onScroll={onScroll}
      className="h-full min-h-0 overflow-y-auto overscroll-contain touch-pan-y"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      <div style={{ height: totalHeight, position: "relative" }} className="w-full">
        <div
          className="absolute left-0 right-0 px-3 space-y-2"
          style={{ transform: `translateY(${offsetY}px)` }}
        >
          {slice.map((ev) => (
            <div key={ev.id} style={{ minHeight: EVENT_ROW_HEIGHT - 8 }}>
              <EventCard ev={ev} onOpen={onOpen} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

type Props = {
  open: boolean;
  dateKey: string | null;
  events: CalendarEvent[];
  onOpenChange: (open: boolean) => void;
  onSelectEvent?: (event: CalendarEvent) => void;
};

export function CalendarDayEventsDialog({
  open,
  dateKey,
  events,
  onOpenChange,
  onSelectEvent,
}: Props) {
  const navigate = useNavigate();
  const dayEvents = dateKey ? filterEventsForDate(events, dateKey) : [];

  const openEvent = (ev: CalendarEvent) => {
    const href = resolveCalendarEventHref(ev);
    if (href) {
      onOpenChange(false);
      navigate(href);
      return;
    }
    onSelectEvent?.(ev);
    onOpenChange(false);
  };

  const todayKey = (() => {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  })();
  const isToday = dateKey === todayKey;
  const useVirtual = dayEvents.length > VIRTUALIZE_THRESHOLD;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!flex max-h-[min(85vh,720px)] w-[min(100vw-2rem,32rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg [&>button]:z-10">
        <DialogHeader className="shrink-0 border-b border-border/50 px-5 pb-3 pt-5 pr-12">
          <DialogTitle className="font-display flex items-center gap-2 text-lg">
            <CalendarClock className="h-5 w-5 text-primary" />
            <span className="min-w-0 truncate">{dateKey ? formatDayTitle(dateKey) : "Day schedule"}</span>
            {isToday ? (
              <Badge variant="secondary" className="text-[10px] uppercase tracking-wide">
                Today
              </Badge>
            ) : null}
          </DialogTitle>
          <DialogDescription>
            {dayEvents.length
              ? `${dayEvents.length.toLocaleString("en-IN")} schedule${dayEvents.length === 1 ? "" : "s"} — tap to open the lead in CRM`
              : "No events on this date"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {dayEvents.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-muted-foreground">
              Nothing scheduled for this day. Use filters or add a lead / test drive from the calendar header.
            </p>
          ) : useVirtual ? (
            <div className="h-full min-h-0 flex-1">
              <VirtualEventList events={dayEvents} onOpen={openEvent} />
            </div>
          ) : (
            <div
              className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3 space-y-2 touch-pan-y"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              {dayEvents.map((ev) => (
                <EventCard key={ev.id} ev={ev} onOpen={openEvent} />
              ))}
            </div>
          )}
        </div>

        <div className="shrink-0 border-t border-border/50 px-5 py-3">
          <Button type="button" variant="outline" className="w-full" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
