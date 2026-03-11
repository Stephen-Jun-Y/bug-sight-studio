import type { AuthPayload } from "@/types/api";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_KEY = "authUser";

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY) || "";

export const saveAuth = (payload: AuthPayload) => {
  const accessToken = payload.accessToken || payload.token || "";
  if (accessToken) localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (payload.refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, payload.refreshToken);

  const nickname = payload.nickname || payload.user?.nickname || "";
  const avatarUrl = payload.avatarUrl || payload.user?.avatarUrl || "";
  const id = payload.user?.id || payload.userId;

  if (id) {
    localStorage.setItem(
      USER_KEY,
      JSON.stringify({
        id,
        nickname,
        avatarUrl,
      })
    );
  }
};

export const clearAuth = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const getStoredNickname = () => {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return "";
  try {
    const user = JSON.parse(raw) as { nickname?: string };
    return user.nickname || "";
  } catch {
    return "";
  }
};
