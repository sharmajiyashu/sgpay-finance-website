import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
} from "axios";
import { API_CONFIG, APP_API_PATHS } from "@/lib/config/env";

/** Matches backend ResponseWrapper */
export interface ResponseWrapper<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
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
  return String(value).trim() || fallback;
}

export const publicApi: AxiosInstance = axios.create({
  baseURL: API_CONFIG.app,
  timeout: API_CONFIG.timeout,
  headers: {
    "Content-Type": "application/json",
  },
});

publicApi.interceptors.response.use(
  (response) => {
    const wrapped = response.data as ResponseWrapper<unknown>;
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
    const data = error.response?.data as ResponseWrapper<unknown> | undefined;
    return Promise.reject(
      new Error(toErrorMessage(data?.error ?? error?.message, "Request failed"))
    );
  }
);

export async function publicGet<T = unknown>(
  path: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const { data } = await publicApi.get<ResponseWrapper<T>>(path, config);
  if (data.success && data.data !== undefined) return data.data as T;
  throw new Error(data.error ?? "Request failed");
}

export async function publicPost<T = unknown>(
  path: string,
  body?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  const { data } = await publicApi.post<ResponseWrapper<T>>(path, body, config);
  if (data.success && data.data !== undefined) return data.data as T;
  throw new Error(data.error ?? "Request failed");
}

export { APP_API_PATHS };
