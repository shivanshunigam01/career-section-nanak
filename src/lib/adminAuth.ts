export type AdminUser = {
  _id?: string;
  name: string;
  email: string;
  role: string;
  designation?: string | null;
  designationLabel?: string | null;
};

const TOKEN_KEY = "vf_admin_token";
const USER_KEY = "vf_admin_user";
const SESSION_START_KEY = "vf_admin_session_started_at";

/** Admin panel session length (client-enforced; aligns with typical JWT refresh expectations). */
export const ADMIN_SESSION_DURATION_MS = 60 * 60 * 1000;

export function getAdminToken(): string | null {
  if (typeof localStorage === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getAdminUser(): AdminUser | null {
  if (typeof localStorage === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AdminUser;
  } catch {
    return null;
  }
}

function getSessionStartedAt(): number | null {
  if (typeof localStorage === "undefined") return null;
  const raw = localStorage.getItem(SESSION_START_KEY);
  if (!raw) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

/** Paths executives can access in the staff portal. */
export const STAFF_PORTAL_PREFIXES = ["/admin/td/my-bookings", "/admin/crm/leads"] as const;

export function isStaffPortalPath(pathname: string): boolean {
  return STAFF_PORTAL_PREFIXES.some((p) => pathname.startsWith(p));
}

/** Executives and managers use the TD lead CRM module. */
export function isCrmStaffUser(user: AdminUser | null | undefined): boolean {
  if (!user) return false;
  return user.role === "executive" || user.role === "manager";
}

/** Sales executives use a focused portal (test drives + assigned leads). */
export function isFieldStaffUser(user: AdminUser | null | undefined): boolean {
  if (!user) return false;
  return user.role === "executive" || user.designation === "sales_executive";
}

export function getAdminLoginRedirect(user: AdminUser | null | undefined): string {
  if (isFieldStaffUser(user)) return "/admin/td/my-bookings";
  return "/admin/dashboard";
}

export function canAccessFullAdmin(user: AdminUser | null | undefined): boolean {
  return !isFieldStaffUser(user);
}

/** Call when starting any admin session (JWT login or local demo login). */
export function markAdminSessionStart() {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(SESSION_START_KEY, String(Date.now()));
}

export function setAdminSession(token: string, admin: AdminUser) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(admin));
  localStorage.setItem("admin_logged_in", "true");
  markAdminSessionStart();
}

export function clearAdminSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem("admin_logged_in");
  localStorage.removeItem(SESSION_START_KEY);
}

export function isAdminSession(): boolean {
  return Boolean(getAdminToken()) || localStorage.getItem("admin_logged_in") === "true";
}

/** True when logged in and session age exceeds {@link ADMIN_SESSION_DURATION_MS}, or session has no start time (invalid legacy state). */
export function isAdminSessionTimedOut(): boolean {
  if (!isAdminSession()) return false;
  const start = getSessionStartedAt();
  if (start == null) return true;
  return Date.now() - start >= ADMIN_SESSION_DURATION_MS;
}
