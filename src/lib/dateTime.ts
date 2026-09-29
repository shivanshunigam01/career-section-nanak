/** Convert browser datetime-local value to UTC ISO for the API. */
export function datetimeLocalToApiIso(value?: string | null): string | undefined {
  const raw = value?.trim();
  if (!raw) return undefined;
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toISOString();
}
