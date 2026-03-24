import { beforeEach, describe, expect, it } from "vitest";
import { clearSearchHistory, listSearchHistory, saveSearchHistoryItem } from "@/lib/search-history";

describe("search history storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("stores history per user and keeps the latest item first", () => {
    saveSearchHistoryItem("绿叶蝉", 7);
    saveSearchHistoryItem("蝗总科", 7);
    saveSearchHistoryItem("绿叶蝉", 7);
    saveSearchHistoryItem("稻纵卷叶螟", 8);

    expect(listSearchHistory(7)).toEqual(["绿叶蝉", "蝗总科"]);
    expect(listSearchHistory(8)).toEqual(["稻纵卷叶螟"]);
  });

  it("clears only the selected user's history bucket", () => {
    saveSearchHistoryItem("绿叶蝉", 7);
    saveSearchHistoryItem("稻纵卷叶螟", 8);

    clearSearchHistory(7);

    expect(listSearchHistory(7)).toEqual([]);
    expect(listSearchHistory(8)).toEqual(["稻纵卷叶螟"]);
  });
});
