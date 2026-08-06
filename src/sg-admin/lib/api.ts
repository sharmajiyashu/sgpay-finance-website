import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
} from "axios";
import { ADMIN_API_PATHS, API_CONFIG } from "@/lib/config/env";

const BASE_URL = API_CONFIG.admin;

const PUBLIC_PATHS = [
  ADMIN_API_PATHS.health,
  ADMIN_API_PATHS.login,
  ADMIN_API_PATHS.forgotPassword,
  ADMIN_API_PATHS.resetPassword,
];

const TOKEN_EXPIRY_MS = 6 * 60 * 60 * 1000;
const TOKEN_KEY = "sgAdminToken";
const TOKEN_EXPIRY_KEY = "sgAdminTokenExpiry";
const AUTH_USER_KEY = "sgAdminAuthUser";

export interface AuthUser {
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  userRole?: string;
  roleName?: string;
  [key: string]: unknown;
}

export interface ResponseWrapper<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

function toErrorMessage(value: unknown, fallback = "Request failed"): string {
  if (typeof value === "string" && value.trim().length > 0) return value;
  if (value == null) return fallback;
  if (typeof value === "object") {
    try {
      const json = JSON.stringify(value);
      return json && json !== "{}" ? json : fallback;
    } catch {
      return fallback;
    }
  }
  const s = String(value);
  return s.trim().length > 0 ? s : fallback;
}

function isPublicPath(path: string): boolean {
  const normalized = "/" + (path?.split("?")[0] ?? "").replace(/^\/+/, "");
  return PUBLIC_PATHS.some(
    (p) => normalized === p || normalized.startsWith(p + "/")
  );
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return null;
  const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
  if (expiry) {
    const expiryMs = Number(expiry);
    if (!Number.isNaN(expiryMs) && Date.now() >= expiryMs) {
      clearToken();
      return null;
    }
  }
  return token;
}

export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: API_CONFIG.timeout,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const path = config.url ?? "";
    if (!isPublicPath(path)) {
      const token = getToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    const { config, data } = response;
    const wrapped = data as ResponseWrapper<unknown>;
    if (
      wrapped &&
      typeof wrapped.success === "boolean" &&
      !wrapped.success
    ) {
      return Promise.reject(
        new Error(toErrorMessage(wrapped.error, "Request failed"))
      );
    }
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data as ResponseWrapper<unknown> | undefined;
    const message = toErrorMessage(
      data?.error ?? error?.message,
      "Request failed"
    );

    if (status === 401) {
      clearToken();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(new Error(message));
  }
);

export async function get<T = unknown>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const { data } = await api.get<ResponseWrapper<T>>(url, config);
  if (data.success && data.data !== undefined) return data.data as T;
  throw new Error(data.error ?? "Request failed");
}

export async function post<T = unknown>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  const { data } = await api.post<ResponseWrapper<T>>(url, body, config);
  if (data.success && data.data !== undefined) return data.data as T;
  throw new Error(data.error ?? "Request failed");
}

export async function put<T = unknown>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  const { data } = await api.put<ResponseWrapper<T>>(url, body, config);
  if (data.success && data.data !== undefined) return data.data as T;
  throw new Error(data.error ?? "Request failed");
}

export async function patch<T = unknown>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  const { data } = await api.patch<ResponseWrapper<T>>(url, body, config);
  if (data.success && data.data !== undefined) return data.data as T;
  throw new Error(data.error ?? "Request failed");
}

export async function deleteRequest<T = unknown>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const { data } = await api.delete<ResponseWrapper<T>>(url, config);
  if (data.success && data.data !== undefined) return data.data as T;
  throw new Error(data.error ?? "Request failed");
}

export function setToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(
      TOKEN_EXPIRY_KEY,
      String(Date.now() + TOKEN_EXPIRY_MS)
    );
  }
}

export function clearToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  }
}

export function getAuthUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function setAuthUser(user: AuthUser): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  }
}

export { API_CONFIG, ADMIN_API_PATHS } from "@/lib/config/env";
