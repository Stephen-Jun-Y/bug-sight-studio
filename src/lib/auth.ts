import type { AuthPayload, CurrentUserProfile } from "@/types/api";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_KEY = "authUser";

const isStoredUser = (value: unknown): value is CurrentUserProfile => {
  if (!value || typeof value !== "object") return false;

  const user = value as Partial<CurrentUserProfile>;
  return typeof user.id === "number";
};

const readStoredUser = (): CurrentUserProfile | null => {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as unknown;
    return isStoredUser(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY) || "";

export const saveAuth = (payload: AuthPayload) => {
  const accessToken = payload.accessToken ?? payload.token ?? "";
  if (accessToken) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  } else {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }
  if (payload.refreshToken != null) {
    localStorage.setItem(REFRESH_TOKEN_KEY, payload.refreshToken);
  } else {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }

  const nickname = payload.nickname ?? payload.user?.nickname ?? "";
  const avatarUrl = payload.avatarUrl ?? payload.user?.avatarUrl ?? "";
  const id = payload.user?.id ?? payload.userId;

  if (id != null) {
    localStorage.setItem(
      USER_KEY,
      JSON.stringify({
        id,
        nickname,
        avatarUrl,
      })
    );
  } else {
    localStorage.removeItem(USER_KEY);
  }
};

export const clearAuth = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const getStoredUser = () => readStoredUser();

export const updateStoredUser = (partial: Partial<CurrentUserProfile>) => {
  const currentUser = readStoredUser();
  const nextUser = currentUser ? { ...currentUser, ...partial } : partial;

  if (!nextUser || typeof nextUser !== "object" || !("id" in nextUser) || typeof nextUser.id !== "number") {
    return;
  }

  localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
};

export const getStoredNickname = () => {
  return getStoredUser()?.nickname || "";
};
