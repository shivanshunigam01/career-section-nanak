import { adminGet } from "@/lib/api";

const PAGE_LIMIT = 2500;
const MAX_PAGES = 500;

/**
 * Loads every row from a paginated admin list endpoint (`meta.total` + paging)
 * into a single array for CSV/PDF export.
 */
export async function fetchAllAdminRows<T>(
  resourcePath: string,
  mapper: (doc: Record<string, unknown>) => T,
): Promise<T[]> {
  const base = resourcePath.split("?")[0];
  const results: T[] = [];
  let page = 1;

  while (page <= MAX_PAGES) {
    const { data, meta } = await adminGet<unknown[]>(`${base}?page=${page}&limit=${PAGE_LIMIT}`);
    const batch = (data ?? []) as Record<string, unknown>[];
    for (const doc of batch) {
      results.push(mapper(doc));
    }
    const total = meta?.total;
    if (batch.length === 0) break;
    if (batch.length < PAGE_LIMIT) break;
    if (typeof total === "number" && results.length >= total) break;
    page += 1;
  }

  return results;
}
