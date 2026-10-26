import type {
  DetailedReportFollowUpCallRow,
  DetailedReportLeadRow,
  DetailedReportPeriodBounds,
  DetailedReportTestDriveRow,
} from "@/lib/detailedReportApi";

function localDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function enquiryKey(row: DetailedReportLeadRow): string | null {
  if (!row.enquiryAt) return null;
  const d = new Date(row.enquiryAt);
  return Number.isNaN(d.getTime()) ? null : localDateKey(d);
}

function slotDateKey(row: DetailedReportTestDriveRow): string | null {
  if (!row.slotDate) return null;
  const d = new Date(row.slotDate);
  return Number.isNaN(d.getTime()) ? null : localDateKey(d);
}

export function filterDetailedLeadRows(
  key: "totalLeads" | "walkIn" | "digital" | "booking",
  scope: "all" | "mtd" | "today",
  rows: DetailedReportLeadRow[],
  todayKey: string,
  bounds: DetailedReportPeriodBounds,
): DetailedReportLeadRow[] {
  const mtdFrom = localDateKey(new Date(bounds.mtdFrom));
  const mtdTo = localDateKey(new Date(bounds.mtdTo));

  let scoped = rows;
  if (scope === "today") {
    scoped = rows.filter((r) => enquiryKey(r) === todayKey);
  } else if (scope === "mtd") {
    scoped = rows.filter((r) => {
      const k = enquiryKey(r);
      return k != null && k >= mtdFrom && k <= mtdTo;
    });
  }

  switch (key) {
    case "walkIn":
      return scoped.filter((r) => r.isWalkInSheet);
    case "digital":
      return scoped.filter((r) => r.isDigitalSheet);
    case "booking":
      return scoped.filter((r) => r.bookingDone);
    default:
      return scoped;
  }
}

export function filterDetailedTestDriveRows(
  scope: "all" | "mtd" | "doneToday",
  rows: DetailedReportTestDriveRow[],
  todayKey: string,
  bounds: DetailedReportPeriodBounds,
): DetailedReportTestDriveRow[] {
  const mtdFrom = localDateKey(new Date(bounds.mtdFrom));
  const mtdTo = localDateKey(new Date(bounds.mtdTo));

  if (scope === "all") return rows;

  if (scope === "mtd") {
    return rows.filter((r) => {
      const k = slotDateKey(r);
      return k != null && k >= mtdFrom && k <= mtdTo;
    });
  }

  return rows.filter(
    (r) => slotDateKey(r) === todayKey && String(r.bookingStatus).toUpperCase() === "COMPLETED",
  );
}

export function filterDetailedFollowUpCalls(rows: DetailedReportFollowUpCallRow[]): DetailedReportFollowUpCallRow[] {
  return rows;
}
