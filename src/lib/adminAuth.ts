import {
  ADMIN_MODULES,
  actionToken,
  type AdminModuleAction,
  type AdminModuleKey,
} from "./adminModules";

export type AdminUser = {
  _id?: string;
  name: string;
  email: string;
  role: string;
  designation?: string | null;
  designationLabel?: string | null;
  /** Module keys this user may access. Empty/missing = default access for their role. */
  allowedModules?: string[];
  /** Action tokens `module:action`. Empty with custom modules = all actions on those modules. */
  allowedActions?: string[];
  /** Portal account type — set at login (`admin` or `tdstaff`). */
  userType?: "admin" | "tdstaff";
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

/** Paths sales executives can access in the staff portal. */
export const STAFF_PORTAL_PREFIXES = ["/admin/my-dashboard", "/admin/td/my-bookings", "/admin/crm/leads"] as const;

/** CRE portal is dashboard + full Lead CRM only (no TD bookings). */
export const CRE_PORTAL_PREFIXES = ["/admin/my-dashboard", "/admin/crm/leads"] as const;

/** Customer Relationship Executive accounts (staff portal). */
export function isCreUser(user: AdminUser | null | undefined): boolean {
  return Boolean(user && String(user.designation || "").toLowerCase() === "cre");
}

export function isStaffPortalPath(pathname: string, user?: AdminUser | null): boolean {
  const prefixes = isCreUser(user) ? CRE_PORTAL_PREFIXES : STAFF_PORTAL_PREFIXES;
  return prefixes.some((p) => pathname.startsWith(p));
}

/** Executives, managers, and CRE use the Lead CRM module. */
export function isCrmStaffUser(user: AdminUser | null | undefined): boolean {
  if (!user) return false;
  return user.role === "executive" || user.role === "manager" || isCreUser(user);
}

/**
 * Module keys explicitly granted in User Master, or null when the user has no
 * per-user restriction (superadmins, and staff left on role defaults).
 */
export function getRestrictedModules(user: AdminUser | null | undefined): AdminModuleKey[] | null {
  if (!user?.allowedModules?.length) return null;
  const valid = new Set<string>(ADMIN_MODULES.map((m) => m.key));
  const keys = user.allowedModules.filter((k): k is AdminModuleKey => valid.has(k));
  return keys.length ? keys : null;
}

export function isModuleAllowed(user: AdminUser | null | undefined, key: AdminModuleKey): boolean {
  const restricted = getRestrictedModules(user);
  return !restricted || restricted.includes(key);
}

/**
 * Action-level check for User Master ACL.
 * - Admin portal → allowed.
 * - No custom modules → allowed here (pages/routes keep their own role gates).
 * - Custom modules + empty actions → all actions on granted modules.
 * - Custom modules + actions → must include `module:action`.
 */
export function canPerformAction(
  user: AdminUser | null | undefined,
  moduleKey: AdminModuleKey,
  action: AdminModuleAction,
): boolean {
  if (!user) return false;
  if (user.userType === "admin") return true;

  const mod = ADMIN_MODULES.find((m) => m.key === moduleKey);
  if (!mod || !mod.actions.includes(action)) return false;

  const restricted = getRestrictedModules(user);
  if (!restricted) return true;
  if (!restricted.includes(moduleKey)) return false;

  const actions = user.allowedActions ?? [];
  if (!actions.length) return true;
  return actions.includes(actionToken(moduleKey, action));
}

/**
 * For destructive/manager-gated UI: custom ACL users follow action tokens;
 * CRE has full Lead CRM rights; other unrestricted users need manager/superadmin.
 */
export function canPerformManagerAction(
  user: AdminUser | null | undefined,
  moduleKey: AdminModuleKey,
  action: AdminModuleAction,
): boolean {
  if (!user) return false;
  if (user.userType === "admin") return true;
  if (isCreUser(user) && moduleKey === "crm_leads") {
    return canPerformAction(user, moduleKey, action);
  }
  if (getRestrictedModules(user)) return canPerformAction(user, moduleKey, action);
  return user.role === "manager" || user.role === "superadmin";
}

/** True when a restricted user may open this path (unrestricted users always may). */
export function isPathAllowed(user: AdminUser | null | undefined, pathname: string): boolean {
  const restricted = getRestrictedModules(user);
  if (!restricted) return true;
  return ADMIN_MODULES.some(
    (m) => restricted.includes(m.key) && (pathname === m.path || pathname.startsWith(`${m.path}/`)),
  );
}

/**
 * Sales executives / CRE use a focused staff portal.
 * CRE always stays on the CRE shell (dashboard + Lead CRM).
 * Other users with explicit User Master modules follow that ACL instead.
 */
export function isFieldStaffUser(user: AdminUser | null | undefined): boolean {
  if (!user) return false;
  if (isCreUser(user)) return true;
  if (getRestrictedModules(user)) return false;
  return user.role === "executive" || user.designation === "sales_executive";
}

/** Leaf sales executives only (assigned-leads scope) — not CRE. */
export function isExecutiveScopedStaff(user: AdminUser | null | undefined): boolean {
  if (!user || isCreUser(user)) return false;
  return isFieldStaffUser(user);
}

export function getAdminLoginRedirect(user: AdminUser | null | undefined): string {
  // CRE / field staff always land on their separate dashboard first.
  if (isCreUser(user) || isFieldStaffUser(user)) return "/admin/my-dashboard";
  const restricted = getRestrictedModules(user);
  if (restricted) {
    if (restricted.includes("my_dashboard")) return "/admin/my-dashboard";
    const first = ADMIN_MODULES.find((m) => restricted.includes(m.key));
    if (first) return first.path;
  }
  return "/admin/dashboard";
}

/** Login page for the current session's account type. */
export function getPortalLoginPath(user: AdminUser | null | undefined): string {
  if (user?.userType === "tdstaff" || isFieldStaffUser(user)) return "/staff/login";
  return "/admin/login";
}

export function isStaffUserType(user: AdminUser | null | undefined): boolean {
  return user?.userType === "tdstaff";
}

export function isAdminUserType(user: AdminUser | null | undefined): boolean {
  return user?.userType === "admin" || (!user?.userType && !isFieldStaffUser(user));
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
