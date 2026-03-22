import type { ApiEnvelope } from "@/types/api";
import { getAccessToken } from "@/lib/auth";
import { translateCommonErrorMessage } from "@/lib/language";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8080/api/v1";

type Method = "GET" | "POST" | "PATCH" | "DELETE";

type RequestOptions = {
  method?: Method;
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
  headers?: Record<string, string>;
};

const buildUrl = (path: string, params?: RequestOptions["params"]) => {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${API_BASE}${normalized}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      url.searchParams.set(key, String(value));
    });
  }
  return url.toString();
};

const parseEnvelope = async <T>(response: Response): Promise<Partial<ApiEnvelope<T>>> => {
  const raw = await response.text();
  if (!raw) return {};

  try {
    return JSON.parse(raw) as ApiEnvelope<T>;
  } catch {
    return { message: raw };
  }
};

export const request = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const token = getAccessToken();
  const isFormData = options.body instanceof FormData;

  let response: Response;
  try {
    response = await fetch(buildUrl(path, options.params), {
      method: options.method || "GET",
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
      body: options.body ? (isFormData ? (options.body as BodyInit) : JSON.stringify(options.body)) : undefined,
    });
  } catch {
    throw new Error(translateCommonErrorMessage("网络异常，请检查网络连接"));
  }

  const envelope = await parseEnvelope<T>(response);
  const okCode = envelope.code === 0 || envelope.code === 200;
  if (!response.ok || !okCode) {
    throw new Error(translateCommonErrorMessage(envelope.message || "请求失败"));
  }

  return envelope.data as T;
};

export const withPagination = (page: number, pageSize: number) => ({
  page,
  pageSize,
});
