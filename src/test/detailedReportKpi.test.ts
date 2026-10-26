import { describe, expect, it } from "vitest";
import { filterDetailedLeadRows, filterDetailedTestDriveRows } from "@/lib/detailedReportKpi";
import type { DetailedReportLeadRow, DetailedReportPeriodBounds, DetailedReportTestDriveRow } from "@/lib/detailedReportApi";

const bounds: DetailedReportPeriodBounds = {
  mtdFrom: "2026-10-01T00:00:00.000Z",
  mtdTo: "2026-10-31T23:59:59.999Z",
  todayFrom: "2026-10-26T00:00:00.000Z",
  todayTo: "2026-10-26T23:59:59.999Z",
};

describe("detailedReportKpi", () => {
  it("filters walk-in MTD by enquiry date and sheet walk-in source", () => {
    const rows: DetailedReportLeadRow[] = [
      {
        leadId: "1",
        name: "A",
        mobile: "9",
        model: "VF6",
        status: "New",
        source: "Walk-In",
        assignedTo: "SE",
        enquiryAt: "2026-10-15T10:00:00.000Z",
        remarks: "—",
        isWalkInSheet: true,
        isDigitalSheet: false,
        bookingDone: false,
      },
      {
        leadId: "2",
        name: "B",
        mobile: "8",
        model: "VF7",
        status: "New",
        source: "Meta Ads",
        assignedTo: "SE",
        enquiryAt: "2026-10-20T10:00:00.000Z",
        remarks: "—",
        isWalkInSheet: false,
        isDigitalSheet: true,
        bookingDone: false,
      },
    ];
    const walkMtd = filterDetailedLeadRows("walkIn", "mtd", rows, "2026-10-26", bounds);
    expect(walkMtd).toHaveLength(1);
    expect(walkMtd[0].leadId).toBe("1");
  });

  it("filters test drives done today as completed on today slot date", () => {
    const rows: DetailedReportTestDriveRow[] = [
      {
        bookingId: "b1",
        slotDate: "2026-10-26T06:30:00.000Z",
        bookingStatus: "COMPLETED",
        customerName: "C",
        customerMobile: "7",
        model: "VF6",
        source: "Walk-In",
        leadId: "1",
      },
      {
        bookingId: "b2",
        slotDate: "2026-10-26T06:30:00.000Z",
        bookingStatus: "CONFIRMED",
        customerName: "D",
        customerMobile: "6",
        model: "VF7",
        source: "Meta Ads",
        leadId: "2",
      },
    ];
    const doneToday = filterDetailedTestDriveRows("doneToday", rows, "2026-10-26", bounds);
    expect(doneToday).toHaveLength(1);
    expect(doneToday[0].bookingId).toBe("b1");
  });
});
