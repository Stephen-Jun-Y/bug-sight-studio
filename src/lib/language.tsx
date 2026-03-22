import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export type AppLanguage = "zh-CN" | "en-US";

export const LANGUAGE_STORAGE_KEY = "appLanguage";
const DEFAULT_LANGUAGE: AppLanguage = "zh-CN";

type TranslateFn = (cn: string, en?: string) => string;

type LanguageContextValue = {
  language: AppLanguage;
  isEnglish: boolean;
  setLanguage: (language: AppLanguage) => void;
  t: TranslateFn;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const isAppLanguage = (value: string | null): value is AppLanguage => value === "zh-CN" || value === "en-US";

export const getStoredLanguage = (): AppLanguage => {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;
  const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return isAppLanguage(stored) ? stored : DEFAULT_LANGUAGE;
};

export const persistLanguage = (language: AppLanguage) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
};

export const translateText = (language: AppLanguage, cn: string, en?: string) => {
  if (language === "en-US") {
    return en ?? cn;
  }
  return cn;
};

const EXACT_ERROR_TRANSLATIONS: Record<string, string> = {
  "请求失败": "Request failed",
  "网络异常，请检查网络连接": "Network error. Please check your connection.",
  "识别失败，请稍后重试": "Recognition failed. Please try again later.",
  "邮箱已注册": "This email is already registered.",
  "密码错误": "Incorrect password.",
  "用户不存在": "User not found.",
  "未登录": "Please sign in first.",
  "请先登录": "Please sign in first.",
  "请先登录后再识别": "Please sign in before starting recognition.",
  "未能读取到有效 token": "Please sign in first.",
  "注册需要填写昵称并同意协议": "Sign-up requires a nickname and agreement to the terms.",
  "请填写邮箱和密码": "Please enter your email and password.",
};

export const translateCommonErrorMessage = (message?: string | null, language = getStoredLanguage()) => {
  const normalized = message?.trim();
  if (!normalized || language === "zh-CN") {
    return normalized ?? "请求失败";
  }

  if (EXACT_ERROR_TRANSLATIONS[normalized]) {
    return EXACT_ERROR_TRANSLATIONS[normalized];
  }

  if (normalized.includes("token") || normalized.includes("未登录")) {
    return "Please sign in first.";
  }

  if (normalized.includes("网络") || normalized.toLowerCase().includes("network")) {
    return "Network error. Please check your connection.";
  }

  return normalized;
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<AppLanguage>(() => getStoredLanguage());

  const setLanguage = useCallback((next: AppLanguage) => {
    persistLanguage(next);
    setLanguageState(next);
  }, []);

  const t = useCallback<TranslateFn>((cn, en) => translateText(language, cn, en), [language]);

  const value = useMemo<LanguageContextValue>(() => ({
    language,
    isEnglish: language === "en-US",
    setLanguage,
    t,
  }), [language, setLanguage, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useI18n = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useI18n must be used within LanguageProvider");
  }
  return context;
};
