const GUEST_HISTORY_KEY = "searchHistory:guest";
const USER_HISTORY_KEY_PREFIX = "searchHistory:user:";
const SEARCH_HISTORY_LIMIT = 8;

const getHistoryKey = (userId?: number | null) =>
  userId != null ? `${USER_HISTORY_KEY_PREFIX}${userId}` : GUEST_HISTORY_KEY;

const parseHistory = (raw: string | null) => {
  if (!raw) return [] as string[];

  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
};

export const listSearchHistory = (userId?: number | null) =>
  parseHistory(localStorage.getItem(getHistoryKey(userId)));

export const saveSearchHistoryItem = (keyword: string, userId?: number | null) => {
  const trimmed = keyword.trim();
  if (!trimmed) return [];

  const current = listSearchHistory(userId);
  const next = [trimmed, ...current.filter((item) => item !== trimmed)].slice(0, SEARCH_HISTORY_LIMIT);
  localStorage.setItem(getHistoryKey(userId), JSON.stringify(next));
  return next;
};

export const clearSearchHistory = (userId?: number | null) => {
  localStorage.setItem(getHistoryKey(userId), JSON.stringify([]));
};
