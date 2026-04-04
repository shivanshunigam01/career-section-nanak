const TOKEN_KEY = "vf_admin_token";
const USER_KEY = "vf_admin_user";

export type AdminUser = { _id?: string; name: string; email: string; role: string };

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

export function setAdminSession(token: string, admin: AdminUser) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(admin));
  localStorage.setItem("admin_logged_in", "true");
}

export function clearAdminSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem("admin_logged_in");
}

export function isAdminSession(): boolean {
  return Boolean(getAdminToken()) || localStorage.getItem("admin_logged_in") === "true";
}
