import type { ApiEnvelope } from "@/types/api";
import { getAccessToken } from "@/lib/auth";

const API_BASE = import.meta.env.VITE_API_BASE || "http://124.221.209.129:8080/api/v1";

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

export const request = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const token = getAccessToken();
  const isFormData = options.body instanceof FormData;
  const response = await fetch(buildUrl(path, options.params), {
    method: options.method || "GET",
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    body: options.body ? (isFormData ? (options.body as BodyInit) : JSON.stringify(options.body)) : undefined,
  });

  const envelope = (await response.json()) as ApiEnvelope<T>;
  if (!response.ok || envelope.code !== 0) {
    throw new Error(envelope.message || "请求失败");
  }

  return envelope.data;
};

export const withPagination = (page: number, pageSize: number) => ({
  page,
  pageSize,
});
