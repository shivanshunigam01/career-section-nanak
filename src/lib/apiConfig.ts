/** Base URL including `/api/v1`, e.g. `http://localhost:5000/api/v1` */
export const API_BASE = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") ?? "";

export function hasApi(): boolean {
  return Boolean(API_BASE);
}
