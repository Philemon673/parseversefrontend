/**
 * lib/api.ts
 * Centralized API client for the ParseVerse backend.
 * Base URL comes from NEXT_PUBLIC_API_URL env variable.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1";

// ── Token helpers (localStorage, client-side only) ──────────────────────────

function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("pv_access_token");
}

function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("pv_refresh_token");
}

export function saveTokens(access: string, refresh: string) {
  localStorage.setItem("pv_access_token", access);
  localStorage.setItem("pv_refresh_token", refresh);
}

export function clearTokens() {
  localStorage.removeItem("pv_access_token");
  localStorage.removeItem("pv_refresh_token");
}

// ── Core fetch wrapper ───────────────────────────────────────────────────────

async function request<T>(
  path: string,
  options: RequestInit = {},
  retry = true,
): Promise<T> {
  const token = getAccessToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  // Auto-refresh on 401
  if (res.status === 401 && retry) {
    const refreshToken = getRefreshToken();
    if (!refreshToken) throw new Error("Session expired. Please log in again.");

    const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!refreshRes.ok) {
      clearTokens();
      throw new Error("Session expired. Please log in again.");
    }

    const data = await refreshRes.json();
    saveTokens(data.accessToken, data.refreshToken);

    // Retry the original request once
    return request<T>(path, options, false);
  }

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(errorBody.message ?? `HTTP ${res.status}`);
  }

  // 204 No Content
  if (res.status === 204) return undefined as unknown as T;

  return res.json() as Promise<T>;
}

// ── Convenience methods ──────────────────────────────────────────────────────

export const api = {
  get: <T>(path: string) => request<T>(path, { method: "GET" }),

  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),

  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),

  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body) }),

  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),

  /** For multipart/form-data (file uploads) — no Content-Type header */
  upload: <T>(path: string, formData: FormData) => {
    const token = getAccessToken();
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return request<T>(path, { method: "POST", headers, body: formData }, true);
  },
};

// ── Typed API calls ──────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "STUDENT" | "MENTOR" | "TUTOR" | "INSTRUCTOR" | "ADMIN";
  avatarUrl?: string;
  bio?: string;
  field?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export const authApi = {
  signup: (data: {
    name: string;
    email: string;
    password: string;
    role: string;
    bio?: string;
    field?: string;
  }) => api.post<AuthResponse>("/auth/signup", data),

  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>("/auth/login", data),

  getMe: () => api.get<AuthUser>("/auth/me"),

  logout: () => api.post<void>("/auth/logout"),
};
