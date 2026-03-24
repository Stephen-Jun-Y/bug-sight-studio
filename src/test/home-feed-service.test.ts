import { beforeEach, describe, expect, it, vi } from "vitest";
import { getHomeFeed } from "@/services/home-feed-service";
import type { InsectInfo, PageData, RecognitionResult } from "@/types/api";

const getAccessTokenMock = vi.hoisted(() => vi.fn());
const listRecognitionHistoryMock = vi.hoisted(() => vi.fn());
const getPopularInsectsMock = vi.hoisted(() => vi.fn());

vi.mock("@/lib/auth", () => ({
  getAccessToken: () => getAccessTokenMock(),
}));

vi.mock("@/services/recognition-service", () => ({
  listRecognitionHistory: (...args: unknown[]) => listRecognitionHistoryMock(...args),
}));

vi.mock("@/services/species-service", () => ({
  getPopularInsects: (...args: unknown[]) => getPopularInsectsMock(...args),
}));

const historyPage: PageData<RecognitionResult> = {
  list: [
    {
      recognitionId: 12,
      species: {
        id: 69,
        name: "绿叶蝉",
        latinName: "Cicadella viridis",
      },
      confidence: 0.88,
      similar: [],
      imageUrl: "https://example.com/recent-1.jpg",
      note: null,
      location: "稻田",
      capturedAt: "2026-03-22T10:00:00",
      isUnknown: false,
    },
  ],
  total: 1,
  page: 1,
  size: 5,
};

const popularInsects: InsectInfo[] = [
  {
    id: 69,
    speciesNameCn: "绿叶蝉",
    speciesNameEn: "Cicadella viridis",
    orderName: "Hemiptera",
    familyName: "Cicadellidae",
    harmLevel: 2,
    recognitionCount: 321,
    coverImageUrl: "https://example.com/popular-1.jpg",
  },
];

describe("getHomeFeed", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    listRecognitionHistoryMock.mockResolvedValue(historyPage);
    getPopularInsectsMock.mockResolvedValue(popularInsects);
  });

  it("uses real recent history and popular insects for signed-in users", async () => {
    getAccessTokenMock.mockReturnValue("token");

    const feed = await getHomeFeed();

    expect(listRecognitionHistoryMock).toHaveBeenCalledWith({ page: 1, pageSize: 5 });
    expect(getPopularInsectsMock).toHaveBeenCalledWith(6);
    expect(feed.recentItems).toEqual([
      expect.objectContaining({
        id: "12",
        imageUrl: "https://example.com/recent-1.jpg",
        speciesNameCn: "绿叶蝉",
        speciesNameEn: "Cicadella viridis",
      }),
    ]);
    expect(feed.popularItems).toEqual([
      expect.objectContaining({
        id: "69",
        imageUrl: "https://example.com/popular-1.jpg",
        speciesNameCn: "绿叶蝉",
        speciesNameEn: "Cicadella viridis",
      }),
    ]);
  });

  it("skips recent history for anonymous users but still loads popular insects", async () => {
    getAccessTokenMock.mockReturnValue("");

    const feed = await getHomeFeed();

    expect(listRecognitionHistoryMock).not.toHaveBeenCalled();
    expect(getPopularInsectsMock).toHaveBeenCalledWith(6);
    expect(feed.recentItems).toEqual([]);
    expect(feed.popularItems).toHaveLength(1);
  });
});
