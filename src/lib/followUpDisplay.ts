import type { LeadFollowUpItem } from "@/lib/pvLeadCrmApi";

function effectiveTime(fu: LeadFollowUpItem): number {
  const raw = fu.completedAt || fu.scheduledAt || fu.createdAt;
  if (!raw) return 0;
  const t = new Date(raw).getTime();
  return Number.isNaN(t) ? 0 : t;
}

/** Newest follow-up first (5th call before 1st). */
export function sortFollowUpsLatestFirst<T extends LeadFollowUpItem>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const diff = effectiveTime(b) - effectiveTime(a);
    if (diff !== 0) return diff;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

export function latestFollowUpLabel(fu: LeadFollowUpItem | null | undefined): string {
  if (!fu) return "";
  const outcome = String(fu.outcome || "").trim();
  if (outcome) return outcome;
  return String(fu.note || "")
    .replace(/^(CRE|Sales)\s#\d+:\s*/i, "")
    .trim();
}
