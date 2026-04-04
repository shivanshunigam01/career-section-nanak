import { API_BASE } from "./apiConfig";
import { clearAdminSession, getAdminToken } from "./adminAuth";

export class ApiRequestError extends Error {
  status: number;
  errors?: { field: string; message: string }[];

  constructor(message: string, status: number, errors?: { field: string; message: string }[]) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.errors = errors;
  }
}

async function parseJson(res: Response): Promise<Record<string, unknown>> {
  const text = await res.text();
  try {
    return text ? (JSON.parse(text) as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

/** Public (unauthenticated) POST — paths like `/leads`, `/test-drives`. */
export async function publicPost(path: string, body: unknown): Promise<{ data: unknown; message?: string }> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await parseJson(res);
  if (!res.ok) {
    throw new ApiRequestError(
      String(json.message ?? "Request failed"),
      res.status,
      json.errors as ApiRequestError["errors"],
    );
  }
  return { data: json.data, message: json.message as string | undefined };
}

function mergeAuthHeaders(headers: Headers) {
  const token = getAdminToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
}

export async function adminRequest(
  path: string,
  init: RequestInit & { json?: unknown } = {},
): Promise<{ res: Response; json: Record<string, unknown> }> {
  const { json: jsonBody, ...rest } = init;
  const headers = new Headers(rest.headers);
  let body = rest.body;
  if (jsonBody !== undefined) {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(jsonBody);
  }
  mergeAuthHeaders(headers);
  const res = await fetch(`${API_BASE}${path}`, { ...rest, headers, body });
  const json = await parseJson(res);
  if (res.status === 401) clearAdminSession();
  return { res, json };
}

function assertOk(res: Response, json: Record<string, unknown>) {
  if (!res.ok) {
    throw new ApiRequestError(
      String(json.message ?? "Request failed"),
      res.status,
      json.errors as ApiRequestError["errors"],
    );
  }
}

export async function adminGet<T>(path: string): Promise<{ data: T; meta?: { page: number; limit: number; total: number } }> {
  const { res, json } = await adminRequest(path);
  assertOk(res, json);
  return { data: json.data as T, meta: json.meta as { page: number; limit: number; total: number } | undefined };
}

export async function adminGetData<T>(path: string): Promise<T> {
  const { data } = await adminGet<T>(path);
  return data;
}

export async function adminPostJson<T>(path: string, body: unknown): Promise<T> {
  const { res, json } = await adminRequest(path, { method: "POST", json: body });
  assertOk(res, json);
  return json.data as T;
}

export async function adminPutJson<T>(path: string, body: unknown): Promise<T> {
  const { res, json } = await adminRequest(path, { method: "PUT", json: body });
  assertOk(res, json);
  return json.data as T;
}

export async function adminPatchJson<T>(path: string, body: unknown): Promise<T> {
  const { res, json } = await adminRequest(path, { method: "PATCH", json: body });
  assertOk(res, json);
  return json.data as T;
}

export async function adminDeleteJson<T = unknown>(path: string): Promise<T | undefined> {
  const { res, json } = await adminRequest(path, { method: "DELETE" });
  assertOk(res, json);
  return json.data as T | undefined;
}

export async function adminLogin(email: string, password: string): Promise<{ token: string; admin: Record<string, unknown> }> {
  const res = await fetch(`${API_BASE}/admin/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const json = await parseJson(res);
  if (!res.ok) {
    throw new ApiRequestError(
      String(json.message ?? "Login failed"),
      res.status,
      json.errors as ApiRequestError["errors"],
    );
  }
  return { token: json.token as string, admin: json.admin as Record<string, unknown> };
}

export async function adminMe(): Promise<unknown> {
  const { res, json } = await adminRequest("/admin/auth/me");
  assertOk(res, json);
  return json.data;
}

export function formatApiErrors(err: unknown): string {
  if (err instanceof ApiRequestError && err.errors?.length) {
    return err.errors.map((e) => `${e.field}: ${e.message}`).join("; ");
  }
  if (err instanceof Error) return err.message;
  return "Something went wrong";
}
