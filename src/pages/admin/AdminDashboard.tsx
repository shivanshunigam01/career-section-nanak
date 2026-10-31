import { useMemo, useEffect, useRef, useState, useCallback } from "react";
import { mockLeads, mockTestDrives, mockEnquiries, LEAD_STATUSES } from "@/data/mockData";
import type { Lead, TestDriveBooking, Enquiry } from "@/data/mockData";
import {
  getEnquiriesAdminInitial,
  getLeadsAdminInitial,
  getTestDrivesAdminInitial,
  subscribeVfStorage,
  VF_STORAGE_KEYS,
} from "@/lib/vfLocalStorage";
import { hasApi } from "@/lib/apiConfig";
import { adminGet, formatApiErrors } from "@/lib/api";
import type { DashboardStats } from "@/lib/apiMappers";
import { dashboardStatsFromApi, leadFromApi, testDriveFromApi, tdBookingFromApi, enquiryFromApi } from "@/lib/apiMappers";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Users, Car, TestTube, MessageSquare, TrendingUp, Clock, Phone, CalendarCheck, Loader2, Flame, Snowflake } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { localDateKey } from "@/lib/reportPeriod";

type CardAction =
  | "all-leads"
  | "leads-today"
  | "td-pending"
  | "all-testdrives"
  | "open-enquiries"
  | "all-enquiries"
  | "hot-leads"
  | "warm-leads"
  | "cold-leads"
  | "bookings"
  | "bookings-mtd"
  | "delivered"
  | "delivered-mtd"
  | "test-drives-mtd"
  | "contact-pending"
  | "pending-followups"
  | "models";

type DetailMode = "leads" | "testdrives" | "enquiries" | "models";

type LeadFlagFilter = "all" | "HOT" | "WARM" | "COLD";

const LEAD_FLAG_OPTIONS = ["HOT", "WARM", "COLD"] as const;

function effectiveLeadFlag(l: Lead): string {
  const raw = (l.leadFlag || l.interestLevel || "").trim().toUpperCase();
  return LEAD_FLAG_OPTIONS.includes(raw as (typeof LEAD_FLAG_OPTIONS)[number]) ? raw : "";
}

function leadFlagBadgeClass(flag: string) {
  switch (flag) {
    case "HOT":
      return "bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/30";
    case "WARM":
      return "bg-orange-500/15 text-orange-800 dark:text-orange-300 border-orange-500/30";
    case "COLD":
      return "bg-sky-500/15 text-sky-800 dark:text-sky-300 border-sky-500/30";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function isBookingLeadStatus(status: string) {
  return status === "Booking" || status === "Booked";
}

function mtdRangeKeys(now = new Date()) {
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  return { from: localDateKey(start), to: localDateKey(now) };
}

function fmtDate(v?: string) {
  if (!v) return "—";
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? v : d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

const LEAD_STATUS_BADGE: Record<string, string> = {
  "New Lead": "bg-blue-400/10 text-blue-400",
  Interested: "bg-green-400/10 text-green-400",
  Booked: "bg-primary/10 text-primary",
  Lost: "bg-destructive/10 text-destructive",
};

const TD_STATUS_BADGE: Record<string, string> = {
  Scheduled: "bg-green-400/10 text-green-400",
  Completed: "bg-primary/10 text-primary",
  Cancelled: "bg-destructive/10 text-destructive",
  "No Show": "bg-muted text-muted-foreground",
};

const AdminDashboard = () => {
  const [storageRev, setStorageRev] = useState(0);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [apiRecentLeads, setApiRecentLeads] = useState<Lead[]>([]);
  const [apiRecentTd, setApiRecentTd] = useState<TestDriveBooking[]>([]);
  const [apiLoading, setApiLoading] = useState(false);
  const [leadFlagFilter, setLeadFlagFilter] = useState<LeadFlagFilter>("all");

  const useRemote = hasApi();

  const fetchRecentLeads = useCallback(async (flag: LeadFlagFilter) => {
    const q = new URLSearchParams({ limit: "5", page: "1" });
    if (flag !== "all") q.set("interestLevel", flag);
    const leadsRes = await adminGet<unknown[]>(`/admin/leads?${q}`);
    return (leadsRes.data as Record<string, unknown>[]).map((d) => leadFromApi(d));
  }, []);

  useEffect(() => {
    if (!useRemote) {
      const u1 = subscribeVfStorage(VF_STORAGE_KEYS.leads, () => setStorageRev((r) => r + 1));
      const u2 = subscribeVfStorage(VF_STORAGE_KEYS.testDrives, () => setStorageRev((r) => r + 1));
      const u3 = subscribeVfStorage(VF_STORAGE_KEYS.enquiries, () => setStorageRev((r) => r + 1));
      return () => {
        u1();
        u2();
        u3();
      };
    }

    let cancelled = false;
    (async () => {
      setApiLoading(true);
      try {
        const s = await adminGet<Record<string, unknown>>("/admin/dashboard/stats");
        const [recentLeads, tdRes] = await Promise.all([
          fetchRecentLeads(leadFlagFilter),
          adminGet<unknown[]>("/admin/td/bookings?limit=5&page=1"),
        ]);
        if (cancelled) return;
        setStats(dashboardStatsFromApi(s.data));
        setApiRecentLeads(recentLeads);
        setApiRecentTd((tdRes.data as Record<string, unknown>[]).map((d) => tdBookingFromApi(d)));
      } catch (e) {
        if (!cancelled) toast.error(formatApiErrors(e));
      } finally {
        if (!cancelled) setApiLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [useRemote, leadFlagFilter, fetchRecentLeads]);

  const leads = useMemo(() => {
    let rows: Lead[];
    if (useRemote) rows = apiRecentLeads;
    else {
      const { seedMock, leads: L } = getLeadsAdminInitial();
      rows = seedMock ? mockLeads : L;
    }
    if (leadFlagFilter === "all") return rows;
    return rows.filter((l) => effectiveLeadFlag(l) === leadFlagFilter);
  }, [useRemote, apiRecentLeads, storageRev, leadFlagFilter]);

  const testDrives = useMemo(() => {
    if (useRemote) return apiRecentTd;
    const { seedMock, bookings } = getTestDrivesAdminInitial();
    return seedMock ? mockTestDrives : bookings;
  }, [useRemote, apiRecentTd, storageRev]);

  const enquiries = useMemo(() => {
    if (useRemote) return [];
    const { seedMock, enquiries: E } = getEnquiriesAdminInitial();
    return seedMock ? mockEnquiries : E;
  }, [useRemote, storageRev]);

  // KPI detail popup state
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailTitle, setDetailTitle] = useState("");
  const [detailMode, setDetailMode] = useState<DetailMode>("leads");
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailLeads, setDetailLeads] = useState<Lead[]>([]);
  const [detailTds, setDetailTds] = useState<TestDriveBooking[]>([]);
  const [detailEnquiries, setDetailEnquiries] = useState<Enquiry[]>([]);
  const [detailModels, setDetailModels] = useState<{ model: string; count: number }[]>([]);

  // Full lists are fetched lazily on first card click (the dashboard itself only loads 5 recent rows)
  const allLeadsRef = useRef<Lead[] | null>(null);
  const allTdsRef = useRef<TestDriveBooking[] | null>(null);
  const allEnquiriesRef = useRef<Enquiry[] | null>(null);

  const loadAllLeads = async (opts?: {
    from?: string;
    to?: string;
    interestLevel?: string;
    crmBase?: string;
    status?: string;
    dateField?: string;
  }): Promise<Lead[]> => {
    if (!useRemote) {
      const base = leads;
      if (opts?.interestLevel) return base.filter((l) => effectiveLeadFlag(l) === opts.interestLevel);
      if (opts?.status === "Delivered") return base.filter((l) => l.status === "Delivered");
      if (opts?.crmBase?.includes("booking")) return base.filter((l) => isBookingLeadStatus(l.status));
      return base;
    }
    const cacheable = !opts?.from && !opts?.to && !opts?.interestLevel && !opts?.status && !opts?.crmBase && !opts?.dateField;
    if (cacheable && allLeadsRef.current) return allLeadsRef.current;
    const q = new URLSearchParams({ limit: "5000", page: "1" });
    if (opts?.from) q.set("from", opts.from);
    if (opts?.to) q.set("to", opts.to);
    if (opts?.interestLevel) q.set("interestLevel", opts.interestLevel);
    if (opts?.status) q.set("status", opts.status);
    if (opts?.dateField) q.set("dateField", opts.dateField);
    const basePath = opts?.crmBase || "/admin/leads";
    const res = await adminGet<unknown[]>(`${basePath}?${q}`);
    const rows = (res.data as Record<string, unknown>[]).map((d) => leadFromApi(d));
    if (cacheable) allLeadsRef.current = rows;
    return rows;
  };

  const loadAllTestDrives = async (): Promise<TestDriveBooking[]> => {
    if (!useRemote) return testDrives;
    if (allTdsRef.current) return allTdsRef.current;
    const res = await adminGet<unknown[]>("/admin/td/bookings?limit=500&page=1");
    const rows = (res.data as Record<string, unknown>[])
      .filter((d) => !["CANCELLED", "MISSED"].includes(String(d.bookingStatus ?? "").toUpperCase()))
      .map((d) => tdBookingFromApi(d));
    allTdsRef.current = rows;
    return rows;
  };

  const loadAllEnquiries = async (): Promise<Enquiry[]> => {
    if (!useRemote) return enquiries;
    if (allEnquiriesRef.current) return allEnquiriesRef.current;
    const res = await adminGet<unknown[]>("/admin/enquiries?limit=500&page=1");
    const rows = (res.data as Record<string, unknown>[]).map((d) => enquiryFromApi(d));
    allEnquiriesRef.current = rows;
    return rows;
  };

  const fetchDashboardDrill = async (metric: string, status?: string) => {
    const q = new URLSearchParams({ metric, limit: "10000", page: "1" });
    if (status) q.set("status", status);
    const res = await adminGet<unknown[]>(`/admin/dashboard/drill?${q}`);
    const kind = String(res.meta?.kind ?? "leads");
    const rows = res.data as Record<string, unknown>[];
    const total = typeof res.meta?.total === "number" ? res.meta.total : rows.length;
    if (kind === "td") {
      return { kind: "testdrives" as DetailMode, rows: rows.map((d) => tdBookingFromApi(d)), total };
    }
    if (kind === "enquiries") {
      return { kind: "enquiries" as DetailMode, rows: rows.map((d) => enquiryFromApi(d)), total };
    }
    return { kind: "leads" as DetailMode, rows: rows.map((d) => leadFromApi(d)), total };
  };

  const openDashboardDrill = (title: string, metric: string, status?: string) => {
    setDetailTitle(title);
    setDetailOpen(true);
    setDetailLoading(true);
    setDetailLeads([]);
    setDetailTds([]);
    setDetailEnquiries([]);
    void fetchDashboardDrill(metric, status)
      .then(({ kind, rows, total }) => {
        setDetailTitle(`${title} (${total.toLocaleString("en-IN")})`);
        setDetailMode(kind);
        if (kind === "leads") setDetailLeads(rows as Lead[]);
        else if (kind === "testdrives") setDetailTds(rows as TestDriveBooking[]);
        else setDetailEnquiries(rows as Enquiry[]);
      })
      .catch((e) => {
        setDetailLeads([]);
        setDetailTds([]);
        setDetailEnquiries([]);
        toast.error(formatApiErrors(e));
      })
      .finally(() => setDetailLoading(false));
  };

  const showLeadRows = (
    title: string,
    filter?: (l: Lead) => boolean,
    range?: {
      from?: string;
      to?: string;
      interestLevel?: string;
      crmBase?: string;
      status?: string;
      dateField?: string;
    },
  ) => {
    setDetailTitle(title);
    setDetailMode("leads");
    setDetailOpen(true);
    setDetailLoading(true);
    void loadAllLeads(range)
      .then((rows) => setDetailLeads(filter ? rows.filter(filter) : rows))
      .catch((e) => {
        setDetailLeads([]);
        toast.error(formatApiErrors(e));
      })
      .finally(() => setDetailLoading(false));
  };

  const showTdRows = (title: string, filter?: (t: TestDriveBooking) => boolean) => {
    setDetailTitle(title);
    setDetailMode("testdrives");
    setDetailOpen(true);
    setDetailLoading(true);
    void loadAllTestDrives()
      .then((rows) => setDetailTds(filter ? rows.filter(filter) : rows))
      .catch((e) => {
        setDetailTds([]);
        toast.error(formatApiErrors(e));
      })
      .finally(() => setDetailLoading(false));
  };

  const showEnquiryRows = (title: string, filter?: (e: Enquiry) => boolean) => {
    setDetailTitle(title);
    setDetailMode("enquiries");
    setDetailOpen(true);
    setDetailLoading(true);
    void loadAllEnquiries()
      .then((rows) => setDetailEnquiries(filter ? rows.filter(filter) : rows))
      .catch((e) => {
        setDetailEnquiries([]);
        toast.error(formatApiErrors(e));
      })
      .finally(() => setDetailLoading(false));
  };

  const showModelRows = (title: string) => {
    setDetailTitle(title);
    setDetailMode("models");
    setDetailOpen(true);
    setDetailLoading(true);
    const toRows = (rec: Record<string, number>) =>
      Object.entries(rec)
        .map(([model, count]) => ({ model: model || "Unknown", count }))
        .sort((a, b) => b.count - a.count);
    if (useRemote) {
      setDetailModels(toRows(stats?.leadsByModel ?? {}));
      setDetailLoading(false);
    } else {
      void loadAllLeads()
        .then((rows) => {
          const rec: Record<string, number> = {};
          for (const l of rows) rec[l.model || "Unknown"] = (rec[l.model || "Unknown"] ?? 0) + 1;
          setDetailModels(toRows(rec));
        })
        .finally(() => setDetailLoading(false));
    }
  };

  const handlePipelineClick = (status: string) => {
    if (useRemote) {
      openDashboardDrill(`CRM Pipeline — ${status}`, "pipeline-status", status);
      return;
    }
    showLeadRows(`CRM Pipeline — ${status}`, (l) => l.status === status);
  };

  const handleCardClick = (action: CardAction) => {
    if (useRemote) {
      switch (action) {
        case "all-leads":
          openDashboardDrill("Total Leads", "all-leads");
          break;
        case "leads-today":
          openDashboardDrill("Leads Today", "leads-today");
          break;
        case "td-pending":
          openDashboardDrill("Pending / Scheduled Test Drives", "td-pending");
          break;
        case "test-drives-mtd":
          openDashboardDrill("Test drives MTD", "test-drives-mtd");
          break;
        case "all-testdrives":
          openDashboardDrill("Test Drives", "all-testdrives");
          break;
        case "open-enquiries":
          openDashboardDrill("Open Enquiries", "open-enquiries");
          break;
        case "all-enquiries":
          openDashboardDrill("Enquiries", "all-enquiries");
          break;
        case "hot-leads":
          openDashboardDrill("HOT leads (flag)", "hot-leads");
          break;
        case "warm-leads":
          openDashboardDrill("WARM leads (flag)", "warm-leads");
          break;
        case "cold-leads":
          openDashboardDrill("COLD leads (flag)", "cold-leads");
          break;
        case "bookings":
          openDashboardDrill("Bookings (all)", "bookings");
          break;
        case "bookings-mtd":
          openDashboardDrill("Bookings MTD", "bookings-mtd");
          break;
        case "delivered":
          openDashboardDrill("Delivered (all)", "delivered");
          break;
        case "delivered-mtd":
          openDashboardDrill("Delivered MTD", "delivered-mtd");
          break;
        case "contact-pending":
          openDashboardDrill("Enquiry stage", "contact-pending");
          break;
        case "pending-followups":
          openDashboardDrill("Pending Follow-ups", "pending-followups");
          break;
        case "models":
          showModelRows("Leads by Model");
          break;
      }
      return;
    }

    switch (action) {
      case "all-leads":
        showLeadRows("Total Leads");
        break;
      case "leads-today": {
        const today = localDateKey(new Date());
        showLeadRows("Leads Today", (l) => localDateKey(l.createdAt) === today, { from: today, to: today, dateField: "enquiry" });
        break;
      }
      case "td-pending":
        showTdRows("Pending / Scheduled Test Drives", (t) => t.status === "Pending" || t.status === "Scheduled");
        break;
      case "test-drives-mtd": {
        const mtd = mtdRangeKeys();
        showTdRows("Test drives MTD", (t) => {
          if (!t.preferredDate) return false;
          return t.preferredDate >= mtd.from && t.preferredDate <= mtd.to;
        });
        break;
      }
      case "all-testdrives":
        showTdRows("Test Drives");
        break;
      case "open-enquiries":
        showEnquiryRows("Open Enquiries", (e) => e.status === "Open" || e.status === "In Progress");
        break;
      case "all-enquiries":
        showEnquiryRows("Enquiries");
        break;
      case "hot-leads":
        showLeadRows("HOT leads (flag)", undefined, { interestLevel: "HOT" });
        break;
      case "warm-leads":
        showLeadRows("WARM leads (flag)", undefined, { interestLevel: "WARM" });
        break;
      case "cold-leads":
        showLeadRows("COLD leads (flag)", undefined, { interestLevel: "COLD" });
        break;
      case "bookings":
        showLeadRows("Bookings (all)", (l) => isBookingLeadStatus(l.status), {
          crmBase: "/admin/crm/booking-leads",
        });
        break;
      case "bookings-mtd": {
        const mtd = mtdRangeKeys();
        showLeadRows("Bookings MTD", (l) => isBookingLeadStatus(l.status), {
          crmBase: "/admin/crm/booking-leads",
          from: mtd.from,
          to: mtd.to,
          dateField: "booking",
        });
        break;
      }
      case "delivered":
        showLeadRows("Delivered (all)", (l) => l.status === "Delivered", { status: "Delivered", crmBase: "/admin/crm/leads" });
        break;
      case "delivered-mtd": {
        const mtd = mtdRangeKeys();
        showLeadRows("Delivered MTD", (l) => l.status === "Delivered", {
          crmBase: "/admin/crm/leads",
          status: "Delivered",
          from: mtd.from,
          to: mtd.to,
          dateField: "delivery",
        });
        break;
      }
      case "contact-pending":
        showLeadRows("Contact Pending", (l) => l.status === "Contact Attempted");
        break;
      case "pending-followups":
        showLeadRows("Pending Follow-ups", (l) => Boolean(l.nextFollowUp));
        break;
      case "models":
        showModelRows("Leads by Model");
        break;
    }
  };

  const statCards = useMemo(() => {
    if (useRemote && stats) {
      const byStatus = (id: string) => stats.leadsByStatus?.[id] ?? 0;
      const tdByStatus = stats.testDrivesByStatus ?? {};
      const pendingTestDrives =
        (tdByStatus.PENDING ?? tdByStatus.Pending ?? 0) +
        (tdByStatus.CONFIRMED ?? tdByStatus.Scheduled ?? 0);
      return [
        { label: "Total Leads", value: stats.totalLeads, icon: Users, color: "text-blue-400", bg: "bg-blue-400/10", action: "all-leads" as CardAction },
        { label: "Leads Today", value: stats.newLeadsToday, icon: Users, color: "text-sky-400", bg: "bg-sky-400/10", action: "leads-today" as CardAction },
        { label: "Test drives (active)", value: stats.totalTestDrives, icon: TestTube, color: "text-green-400", bg: "bg-green-400/10", action: "all-testdrives" as CardAction },
        { label: "Test drives MTD", value: stats.testDrivesMtd, icon: TestTube, color: "text-emerald-400", bg: "bg-emerald-400/10", action: "test-drives-mtd" as CardAction },
        { label: "Pending / scheduled TD", value: pendingTestDrives, icon: Clock, color: "text-lime-400", bg: "bg-lime-400/10", action: "td-pending" as CardAction },
        { label: "Bookings (all)", value: stats.bookings, icon: CalendarCheck, color: "text-primary", bg: "bg-primary/10", action: "bookings" as CardAction },
        { label: "Bookings MTD", value: stats.bookingsMtd, icon: CalendarCheck, color: "text-violet-400", bg: "bg-violet-400/10", action: "bookings-mtd" as CardAction },
        { label: "Delivered (all)", value: stats.delivered, icon: CalendarCheck, color: "text-indigo-400", bg: "bg-indigo-400/10", action: "delivered" as CardAction },
        { label: "Delivered MTD", value: stats.deliveredMtd, icon: CalendarCheck, color: "text-fuchsia-400", bg: "bg-fuchsia-400/10", action: "delivered-mtd" as CardAction },
        { label: "Open Enquiries", value: stats.openEnquiries, icon: MessageSquare, color: "text-amber-400", bg: "bg-amber-400/10", action: "open-enquiries" as CardAction },
        { label: "HOT leads", value: stats.hotFlagLeads, icon: Flame, color: "text-red-500", bg: "bg-red-500/10", action: "hot-leads" as CardAction },
        { label: "WARM leads", value: stats.warmFlagLeads, icon: TrendingUp, color: "text-orange-500", bg: "bg-orange-500/10", action: "warm-leads" as CardAction },
        { label: "COLD leads", value: stats.coldFlagLeads, icon: Snowflake, color: "text-sky-500", bg: "bg-sky-500/10", action: "cold-leads" as CardAction },
        { label: "Enquiry stage", value: byStatus("Enquiry"), icon: Phone, color: "text-cyan-400", bg: "bg-cyan-400/10", action: "contact-pending" as CardAction },
        { label: "Model groups", value: Object.keys(stats.leadsByModel ?? {}).length, icon: Car, color: "text-emerald-400", bg: "bg-emerald-400/10", action: "models" as CardAction },
      ];
    }

    if (useRemote && !stats) {
      const ph = "—";
      const noAction = undefined as CardAction | undefined;
      return [
        { label: "Total Leads", value: ph, icon: Users, color: "text-blue-400", bg: "bg-blue-400/10", action: noAction },
        { label: "Leads Today", value: ph, icon: Users, color: "text-sky-400", bg: "bg-sky-400/10", action: noAction },
        { label: "Pending / Scheduled TD", value: ph, icon: TestTube, color: "text-green-400", bg: "bg-green-400/10", action: noAction },
        { label: "Open Enquiries", value: ph, icon: MessageSquare, color: "text-amber-400", bg: "bg-amber-400/10", action: noAction },
        { label: "HOT leads", value: ph, icon: Flame, color: "text-red-500", bg: "bg-red-500/10", action: noAction },
        { label: "WARM leads", value: ph, icon: TrendingUp, color: "text-orange-500", bg: "bg-orange-500/10", action: noAction },
        { label: "COLD leads", value: ph, icon: Snowflake, color: "text-sky-500", bg: "bg-sky-500/10", action: noAction },
        { label: "Bookings", value: ph, icon: CalendarCheck, color: "text-primary", bg: "bg-primary/10", action: noAction },
        { label: "Contact Pending", value: ph, icon: Phone, color: "text-cyan-400", bg: "bg-cyan-400/10", action: noAction },
        { label: "Model groups", value: ph, icon: Car, color: "text-emerald-400", bg: "bg-emerald-400/10", action: noAction },
      ];
    }

    return [
      { label: "Total Leads", value: leads.length, icon: Users, color: "text-blue-400", bg: "bg-blue-400/10", action: "all-leads" as CardAction },
      { label: "Test Drives", value: testDrives.length, icon: TestTube, color: "text-green-400", bg: "bg-green-400/10", action: "all-testdrives" as CardAction },
      { label: "Enquiries", value: enquiries.length, icon: MessageSquare, color: "text-amber-400", bg: "bg-amber-400/10", action: "all-enquiries" as CardAction },
      { label: "Bookings", value: leads.filter((l) => l.status === "Booked").length, icon: CalendarCheck, color: "text-primary", bg: "bg-primary/10", action: "bookings" as CardAction },
      { label: "Hot Leads", value: leads.filter((l) => ["Interested", "Negotiation"].includes(l.status)).length, icon: TrendingUp, color: "text-orange-400", bg: "bg-orange-400/10", action: "hot-leads" as CardAction },
      { label: "Pending Follow-ups", value: leads.filter((l) => l.nextFollowUp).length, icon: Clock, color: "text-purple-400", bg: "bg-purple-400/10", action: "pending-followups" as CardAction },
      { label: "Contact Pending", value: leads.filter((l) => l.status === "Contact Attempted").length, icon: Phone, color: "text-cyan-400", bg: "bg-cyan-400/10", action: "contact-pending" as CardAction },
      { label: "Models in Demand", value: new Set(leads.map((l) => l.model)).size || 2, icon: Car, color: "text-emerald-400", bg: "bg-emerald-400/10", action: "models" as CardAction },
    ];
  }, [useRemote, stats, leads, testDrives, enquiries]);

  const pipelineData = useMemo(() => {
    if (useRemote && stats?.leadsByStatus) {
      const stages =
        stats.crmPipelineStages?.length ? stats.crmPipelineStages : LEAD_STATUSES;
      return stages.map((status) => ({
        status,
        count: stats.leadsByStatus[status] ?? 0,
      }));
    }
    if (useRemote && !stats) {
      const ph: number | string = "—";
      return LEAD_STATUSES.map((status) => ({ status, count: ph }));
    }
    return LEAD_STATUSES.map((status) => ({
      status,
      count: leads.filter((l) => l.status === status).length,
    }));
  }, [useRemote, stats, leads]);

  const sourceBreakdown = useMemo(() => {
    if (useRemote && stats?.leadsBySource) {
      return Object.entries(stats.leadsBySource).map(([source, count]) => ({
        source: source || "Unknown",
        count,
      }));
    }
    if (useRemote && !stats) {
      return [];
    }
    return ["Google Ads", "Website", "WhatsApp", "Meta Ads", "Walk-in", "Referral", "Book Now", "Test Drive"].map((source) => ({
      source,
      count: leads.filter((l) => l.source === source).length,
    }));
  }, [useRemote, stats, leads]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {useRemote ? (apiLoading ? "Loading live stats…" : "Live data from API") : "Welcome back — here's your dealership overview"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={leadFlagFilter}
            onValueChange={(v) => setLeadFlagFilter(v as LeadFlagFilter)}
          >
            <SelectTrigger className="w-[11rem] h-9 bg-secondary/50">
              <SelectValue placeholder="Lead flag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All lead flags</SelectItem>
              {LEAD_FLAG_OPTIONS.map((level) => (
                <SelectItem key={level} value={level}>{level} leads only</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {LEAD_FLAG_OPTIONS.map((level) => {
            const count =
              stats && useRemote
                ? level === "HOT"
                  ? stats.hotFlagLeads
                  : level === "WARM"
                    ? stats.warmFlagLeads
                    : stats.coldFlagLeads
                : null;
            const active = leadFlagFilter === level;
            return (
              <button
                key={level}
                type="button"
                onClick={() => setLeadFlagFilter((prev) => (prev === level ? "all" : level))}
              >
                <Badge
                  variant={active ? "default" : "outline"}
                  className={cn("text-xs cursor-pointer", !active && leadFlagBadgeClass(level))}
                >
                  {level}
                  {count != null ? ` · ${count.toLocaleString("en-IN")}` : ""}
                </Badge>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((stat) => (
          <Card
            key={stat.label}
            className={`bg-card border-border/50 p-4 ${stat.action ? "cursor-pointer transition-colors hover:bg-secondary/20" : ""}`}
            onClick={stat.action ? () => handleCardClick(stat.action as CardAction) : undefined}
            role={stat.action ? "button" : undefined}
            tabIndex={stat.action ? 0 : undefined}
            onKeyDown={stat.action ? (e) => { if (e.key === "Enter" || e.key === " ") handleCardClick(stat.action as CardAction); } : undefined}
          >
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

      <div>
        <h2 className="font-display text-lg font-semibold text-foreground mb-4">CRM Pipeline</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {pipelineData.map((stage) => (
            <button
              key={stage.status}
              type="button"
              className="glass-card-sm p-3 text-center cursor-pointer transition-colors hover:bg-secondary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              onClick={() => handlePipelineClick(stage.status)}
            >
              <p className="text-2xl font-bold text-foreground">{stage.count}</p>
              <p className="text-[10px] text-muted-foreground mt-1 leading-tight">{stage.status}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border/50 p-5">
          <h3 className="font-display font-semibold text-foreground mb-1">Recent Leads</h3>
          {leadFlagFilter !== "all" ? (
            <p className="text-xs text-muted-foreground mb-4">Showing {leadFlagFilter} flagged leads only</p>
          ) : (
            <p className="text-xs text-muted-foreground mb-4">Latest enquiries — use lead flag filter above for HOT / WARM / COLD</p>
          )}
          <div className="space-y-3">
            {useRemote && apiLoading && leads.length === 0 ? (
              <p className="text-sm text-muted-foreground py-2">Loading…</p>
            ) : (
              leads.slice(0, 5).map((lead) => (
                <div key={lead.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{lead.name}</p>
                    <p className="text-xs text-muted-foreground">{lead.model} · {lead.source}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {effectiveLeadFlag(lead) ? (
                      <Badge variant="outline" className={cn("text-[10px]", leadFlagBadgeClass(effectiveLeadFlag(lead)))}>
                        {effectiveLeadFlag(lead)}
                      </Badge>
                    ) : null}
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
                </div>
              ))
            )}
          </div>
        </Card>

        <Card className="bg-card border-border/50 p-5">
          <h3 className="font-display font-semibold text-foreground mb-4">Test Drive Bookings</h3>
          <div className="space-y-3">
            {useRemote && apiLoading && testDrives.length === 0 ? (
              <p className="text-sm text-muted-foreground py-2">Loading…</p>
            ) : (
              testDrives.slice(0, 5).map((td) => (
                <div key={td.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{td.customerName}</p>
                    <p className="text-xs text-muted-foreground">{td.model} · {td.preferredDate} {td.preferredTime}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${
                    td.status === "Scheduled" ? "bg-green-400/10 text-green-400" :
                    td.status === "Completed" ? "bg-primary/10 text-primary" :
                    td.status === "Cancelled" ? "bg-destructive/10 text-destructive" :
                    td.status === "No Show" ? "bg-muted text-muted-foreground" :
                    "bg-amber-400/10 text-amber-400"
                  }`}>
                    {td.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      <Card className="bg-card border-border/50 p-5">
        <h3 className="font-display font-semibold text-foreground mb-4">Lead Sources</h3>
        {sourceBreakdown.length === 0 && useRemote && !stats ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {sourceBreakdown.map(({ source, count }) => (
              <div key={source} className="text-center p-3 rounded-lg bg-secondary/30">
                <p className="text-lg font-bold text-foreground">{count}</p>
                <p className="text-[11px] text-muted-foreground">{source}</p>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>{detailTitle}</DialogTitle>
          </DialogHeader>
          {detailLoading ? (
            <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Loading…</span>
            </div>
          ) : detailMode === "leads" ? (
            <div className="max-h-[65vh] overflow-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border/50 text-muted-foreground">
                    <th className="text-left p-2">Customer</th>
                    <th className="text-left p-2">Model</th>
                    <th className="text-left p-2">Flag</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Source</th>
                    <th className="text-left p-2">Assigned to</th>
                    <th className="text-left p-2">Created</th>
                    <th className="text-left p-2">Next follow-up</th>
                  </tr>
                </thead>
                <tbody>
                  {detailLeads.length === 0 ? (
                    <tr><td colSpan={8} className="p-8 text-center text-muted-foreground">No records found</td></tr>
                  ) : (
                    detailLeads.map((row) => (
                      <tr key={row.id} className="border-b border-border/20 hover:bg-secondary/10">
                        <td className="p-2">
                          <p className="font-medium">{row.name}</p>
                          <p className="text-muted-foreground">{row.mobile}</p>
                        </td>
                        <td className="p-2">{row.model}</td>
                        <td className="p-2">
                          {effectiveLeadFlag(row) ? (
                            <Badge variant="outline" className={cn("text-[10px]", leadFlagBadgeClass(effectiveLeadFlag(row)))}>
                              {effectiveLeadFlag(row)}
                            </Badge>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="p-2">
                          <Badge className={`text-[10px] ${LEAD_STATUS_BADGE[row.status] ?? "bg-secondary text-muted-foreground"}`}>
                            {row.status}
                          </Badge>
                        </td>
                        <td className="p-2">{row.source}</td>
                        <td className="p-2">{row.assignedTo || "Unassigned"}</td>
                        <td className="p-2 whitespace-nowrap">{fmtDate(row.createdAt)}</td>
                        <td className="p-2 whitespace-nowrap">{fmtDate(row.nextFollowUp)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : detailMode === "testdrives" ? (
            <div className="max-h-[65vh] overflow-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border/50 text-muted-foreground">
                    <th className="text-left p-2">Customer</th>
                    <th className="text-left p-2">Model</th>
                    <th className="text-left p-2">Preferred slot</th>
                    <th className="text-left p-2">Branch</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Executive</th>
                  </tr>
                </thead>
                <tbody>
                  {detailTds.length === 0 ? (
                    <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No records found</td></tr>
                  ) : (
                    detailTds.map((row) => (
                      <tr key={row.id} className="border-b border-border/20 hover:bg-secondary/10">
                        <td className="p-2">
                          <p className="font-medium">{row.customerName}</p>
                          <p className="text-muted-foreground">{row.mobile}</p>
                        </td>
                        <td className="p-2">{row.model}</td>
                        <td className="p-2 whitespace-nowrap">{fmtDate(row.preferredDate)} {row.preferredTime}</td>
                        <td className="p-2">{row.branch || "—"}</td>
                        <td className="p-2">
                          <Badge className={`text-[10px] ${TD_STATUS_BADGE[row.status] ?? "bg-amber-400/10 text-amber-400"}`}>
                            {row.status}
                          </Badge>
                        </td>
                        <td className="p-2">{row.assignedExecutive || "Unassigned"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : detailMode === "enquiries" ? (
            <div className="max-h-[65vh] overflow-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border/50 text-muted-foreground">
                    <th className="text-left p-2">Customer</th>
                    <th className="text-left p-2">Type</th>
                    <th className="text-left p-2">Message</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {detailEnquiries.length === 0 ? (
                    <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No records found</td></tr>
                  ) : (
                    detailEnquiries.map((row) => (
                      <tr key={row.id} className="border-b border-border/20 hover:bg-secondary/10">
                        <td className="p-2">
                          <p className="font-medium">{row.name}</p>
                          <p className="text-muted-foreground">{row.mobile}</p>
                        </td>
                        <td className="p-2">{row.type}</td>
                        <td className="p-2 max-w-[18rem]">{row.message || "—"}</td>
                        <td className="p-2">
                          <Badge variant="outline" className="text-[10px]">{row.status}</Badge>
                        </td>
                        <td className="p-2 whitespace-nowrap">{fmtDate(row.createdAt)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="max-h-[65vh] overflow-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border/50 text-muted-foreground">
                    <th className="text-left p-2">Model</th>
                    <th className="text-right p-2">Leads</th>
                  </tr>
                </thead>
                <tbody>
                  {detailModels.length === 0 ? (
                    <tr><td colSpan={2} className="p-8 text-center text-muted-foreground">No records found</td></tr>
                  ) : (
                    detailModels.map((row) => (
                      <tr key={row.model} className="border-b border-border/20 hover:bg-secondary/10">
                        <td className="p-2 font-medium">{row.model}</td>
                        <td className="p-2 text-right">{row.count}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
